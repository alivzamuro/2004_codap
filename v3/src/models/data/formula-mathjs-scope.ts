import { FValue, CASE_INDEX_FAKE_ATTR_ID, GLOBAL_VALUE, LOCAL_ATTR, NO_PARENT_KEY } from "./formula-types"
import type { IGlobalValueManager } from "../global/global-value-manager"
import type { IDataSet } from "./data-set"
import type { IValueType } from "./attribute"

const CACHE_ENABLED = true

export interface IFormulaMathjsScopeContext {
  localDataSet: IDataSet
  dataSets: Map<string, IDataSet>
  globalValueManager?: IGlobalValueManager
  caseIds: string[]
  formulaAttrId: string
  formulaCollectionIndex: number
  childMostAggregateCollectionIndex: number
  childMostCollectionCaseIds: string[]
  caseGroupId: Record<string, string>
  caseChildrenCount: Record<string, number>
}

// Official MathJS docs don't describe custom scopes in great detail, but there's a good example in their repo:
// https://github.com/josdejong/mathjs/blob/develop/examples/advanced/custom_scope_objects.js
export class FormulaMathJsScope {
  context: IFormulaMathjsScopeContext
  casePointer = 0
  // When aggregate functions (functions working with multiple cases) are evaluated, this flag should be set to true.
  isAggregate = false
  dataStorage: Record<string, any> = {}
  caseIndexCache?: Record<string, number>
  // `cache` is used directly by custom formula functions like `prev`, `next` or aggregate functions.
  cache = new Map<string, any>()
  // `previousResults` is used for calculating self-referencing, recursive functions like prev(), e.g.:
  // [CumulativeValue attribute formula]: "prev(CumulativeValue, 0) + Value"
  previousResults: FValue[] = []

  get caseId() {
    return this.context.caseIds[this.casePointer]
  }

  constructor (context: IFormulaMathjsScopeContext) {
    this.context = context
    this.initDataStorage(context)
  }

  initDataStorage(context: IFormulaMathjsScopeContext) {
    // We could parse symbol name in scope.get() function, but this should be faster, as it's done only once,
    // and no parsing is needed when the symbol is accessed for each dataset case.
    // `caseIndex` is a special symbol that might be used by formulas.
    const localAttributeIds = context.localDataSet.attributes.map(a => a.id).concat(CASE_INDEX_FAKE_ATTR_ID)
    // Local dataset attribute symbols.
    localAttributeIds.forEach(attrId => {
      // Make sure that all the caching and case processing is done lazily, only for attributes that are actually
      // referenced by the formula.
      let cachedGroup: Record<string, IValueType[]>
      Object.defineProperty(this.dataStorage, `${LOCAL_ATTR}${attrId}`, {
        get: () => {
          if (!this.isAggregate) {
            return this.getLocalValue(this.caseId, attrId)
          } else {
            if (!cachedGroup) {
              cachedGroup = {}
              // Cache is calculated lazily to avoid calculating it for all the attributes that are not referenced by
              // the formula. Note that each case is processed only once, so this mapping is only O(n) complexity.
              context.childMostCollectionCaseIds.forEach(cId => {
                const groupId = context.caseGroupId[cId]
                if (!cachedGroup[groupId]) {
                  cachedGroup[groupId] = []
                }
                cachedGroup[groupId].push(this.getLocalValue(cId, attrId))
              })
            }
            return cachedGroup[this.getCaseAggregateGroupId()] || cachedGroup[NO_PARENT_KEY]
          }
        }
      })
    })
    // Global value symbols.
    context.globalValueManager?.globals.forEach(global => {
      Object.defineProperty(this.dataStorage, `${GLOBAL_VALUE}${global.id}`, {
        get: () => {
          return global.value
        }
      })
    })
  }

  // --- Functions required by MathJS scope "interface". It doesn't seem to be defined/typed anywhere, so it's all
  //     based on: // https://github.com/josdejong/mathjs/blob/develop/examples/advanced/custom_scope_objects.js ---

  get(key: string): any {
    return this.dataStorage[key]
  }

  set() {
    throw new Error("It's not allowed to set local values in the formula scope.")
  }

  has(key: string) {
    return Object.prototype.hasOwnProperty.call(this.dataStorage, key)
  }

  keys(): any {
    return new Set(Object.keys(this.dataStorage))
  }

  delete() {
    throw new Error("It's not allowed to delete local values in the formula scope.")
  }

  clear () {
    throw new Error("It's not allowed to clear values in the formula scope.")
  }

  // MathJS requests a separate subscope for every parsed and evaluated function call.
  createSubScope () {
    // In regular MathJS use case, a subscope is used to create a new scope for a function call. It needs to ensure
    // that variables from subscope cannot overwrite variables from the parent scope. However, since we don't allow
    // any variables to be set in the formula scope, we can reuse the same scope instance.
    return this
  }

  // --- Custom functions used by our formulas or formula manager --

  getLocalValue(caseId: string, attrId: string) {
    if (attrId === this.context.formulaAttrId) {
      // When formula references its own attribute, we cannot simply return case values - we're just trying
      // to calculate them. In most cases this is not allowed, but there are some exceptions, e.g. prev function
      // referencing its own attribute. It could be used to calculate cumulative value in a recursive way.
      return this.previousResults[this.casePointer]
    }
    return attrId === CASE_INDEX_FAKE_ATTR_ID
      ? this.getCaseIndex(caseId)
      : this.context.localDataSet.getValue(caseId, attrId)
  }

  // Note that case index is what user sees in the table: 1-based index that respects grouping.
  // It's not the same as a case pointer (index in fact) that is used internally by this class.
  getCaseIndex(caseId: string) {
    if (!this.caseIndexCache) {
      // Cache is calculated lazily to avoid calculating when not necessary.
      // Note that each case is processed only once, so this mapping is only O(n) complexity.
      this.caseIndexCache = {}
      const casesCount: Record<string, number> = {}
      this.context.childMostCollectionCaseIds.forEach(cId => {
        const groupId = this.context.caseGroupId[cId]
        if (!casesCount[groupId]) {
          casesCount[groupId] = 0
        }
        casesCount[groupId] += 1
        this.caseIndexCache![cId] = casesCount[groupId]
      })
    }
    return this.caseIndexCache[caseId]
  }

  getCasePointer() {
    return this.casePointer
  }

  setCasePointer(casePointer: number) {
    this.casePointer = casePointer
  }

  getNumberOfCases() {
    return this.context.caseIds.length
  }

  savePreviousResult(value: FValue) {
    this.previousResults.push(value)
  }

  // with... methods could be replaced by more elegant approach of creating sub-scope with modified properties,
  // but it would require re-initialization of the data storage. Since this could happen multiple times for each
  // evaluated case, it could be a performance hit. So, for now with... methods seem like a reasonable compromise.
  withCustomCasePointer(callback: () => void, casePointer: number) {
    const originalCasePointer = this.casePointer
    this.casePointer = casePointer
    callback()
    this.casePointer = originalCasePointer
  }

  withAggregateContext(callback: () => void) {
    const originalIsAggregate = this.isAggregate
    this.isAggregate = true
    callback()
    this.isAggregate = originalIsAggregate
  }

  getCaseChildrenCount() {
    return this.context.caseChildrenCount[this.caseId] ?? 0
  }

  getLocalDataSet() {
    return this.context.localDataSet
  }

  getDataSet(dataSetId: string) {
    return this.context.dataSets.get(dataSetId)
  }

  getCaseAggregateGroupId() {
    // There are two separate kinds of aggregate cases grouping:
    // - Same-level grouping, which is used when the table is flat or when the aggregate function is referencing
    //   attributes only from the same collection.
    // - Parent-child grouping, which is used when the table is hierarchical and the aggregate function is
    //   referencing attributes from child collections.
    // When aggregate function is defined in a parent table but it references an attribute in a child table, we need to
    // use formula's case ID as a group ID.
    const useSameLevelGrouping = this.context.formulaCollectionIndex === this.context.childMostAggregateCollectionIndex
    return useSameLevelGrouping ? this.getCaseGroupId() : this.caseId
  }

  getCaseGroupId() {
    return this.context.caseGroupId[this.caseId]
  }

  // Basic, flexible cache used by formula's custom functions, usually aggregate or semi-aggregate.
  setCached(key: string, value: any) {
    if (CACHE_ENABLED) {
      this.cache.set(key, value)
    }
  }

  getCached(key: string) {
    if (CACHE_ENABLED) {
      return this.cache.get(key)
    }
    return undefined
  }
}
