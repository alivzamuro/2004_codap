import { comparer, reaction } from "mobx"
import { onAnyAction } from "../../utilities/mst-utils"
import { IDataSet } from "../data/data-set"
import { AddCasesAction, SetCaseValuesAction } from "../data/data-set-actions"
import {
  CaseList, IFormulaDependency, IGlobalValueDependency, ILocalAttributeDependency, ILookupDependency
} from "./formula-types"
import { IGlobalValueManager } from "../global/global-value-manager"
import { ICase } from "../data/data-set-types"

export const isAttrDefined = (dataSetCase: ICase, attributeId?: string) =>
  !!attributeId && Object.prototype.hasOwnProperty.call(dataSetCase, attributeId)

export const getLocalAttrCasesToRecalculate = (cases: ICase[], formulaDependencies: ILocalAttributeDependency[]) => {
  const regularAttrDeps = formulaDependencies.filter(d => d.type === "localAttribute" && !d.aggregate)
  const aggregateAttrDeps = formulaDependencies.filter(d => d.type === "localAttribute" && d.aggregate)

  return cases.some(c => aggregateAttrDeps.some(d => isAttrDefined(c, d.attrId)))
    ? "ALL_CASES"
    : cases.filter(c => regularAttrDeps.some(d => isAttrDefined(c, d.attrId)))
}

export const observeLocalAttributes = (formulaDependencies: IFormulaDependency[], localDataSet: IDataSet,
  recalculateCallback: (casesToRecalculate: CaseList) => void) => {
  const localAttrDependencies =
    formulaDependencies.filter(d => d.type === "localAttribute") as ILocalAttributeDependency[]

  const anyAggregateDepPresent = localAttrDependencies.some(d => d.aggregate)

  // Observe local dataset attribute changes
  const disposeDatasetObserver = onAnyAction(localDataSet, mstAction => {
    let casesToRecalculate: CaseList = []
    switch (mstAction.name) {
      case "addCases": {
        // Recalculate only new cases if there's no aggregate dependency. Otherwise, we need to update all the cases.
        casesToRecalculate = anyAggregateDepPresent ? "ALL_CASES" : (mstAction as AddCasesAction).args[0] || []
        break
      }
      case "setCaseValues": {
        // Recalculate cases with dependency attribute updated.
        const cases = (mstAction as SetCaseValuesAction).args[0] || []
        casesToRecalculate = getLocalAttrCasesToRecalculate(cases, localAttrDependencies)
        break
      }
      default:
        break
    }

    if (casesToRecalculate.length > 0) {
      recalculateCallback(casesToRecalculate)
    }
  })

  return disposeDatasetObserver
}

export const getLookupCasesToRecalculate = (cases: ICase[], dependency: ILookupDependency) =>
  cases.some(c => isAttrDefined(c, dependency.attrId) || isAttrDefined(c, dependency.keyAttrId)) ? "ALL_CASES" : []

export const observeLookupDependencies = (formulaDependencies: IFormulaDependency[], dataSets: Map<string, IDataSet>,
  recalculateCallback: (casesToRecalculate: CaseList) => void) => {
  const lookupDependencies: ILookupDependency[] =
    formulaDependencies.filter(d => d.type === "lookup") as ILookupDependency[]

  const disposeLookupObserver = lookupDependencies.map(dependency => {
    const externalDataSet = dataSets.get(dependency.dataSetId)
    if (!externalDataSet) {
      return
    }
    return onAnyAction(externalDataSet, mstAction => {
      let casesToRecalculate: CaseList = []
      switch (mstAction.name) {
        // TODO: these rules are very broad, think if there are some ways to optimize and narrow them down.
        case "addCases": {
          casesToRecalculate = "ALL_CASES"
          break
        }
        case "removeCases": {
          casesToRecalculate = "ALL_CASES"
          break
        }
        case "setCaseValues": {
          // recalculate cases with dependency attribute updated
          const cases = (mstAction as SetCaseValuesAction).args[0] || []
          casesToRecalculate = getLookupCasesToRecalculate(cases, dependency)
          break
        }
        default:
          break
      }

      if (casesToRecalculate.length > 0) {
        recalculateCallback(casesToRecalculate)
      }
    })
  })

  return () => disposeLookupObserver.forEach(dispose => dispose?.())
}

export const observeGlobalValues = (formulaDependencies: IFormulaDependency[],
  globalValueManager: IGlobalValueManager | undefined, recalculateCallback: (casesToRecalculate: CaseList) => void) => {
  const globalValueDependencies = formulaDependencies.filter(d => d.type === "globalValue") as IGlobalValueDependency[]
  const disposeGlobalValueObserver = globalValueDependencies.map(dependency =>
    // Recalculate formula when global value dependency is updated.
    reaction(
      () => globalValueManager?.getValueById(dependency.globalId)?.value,
      () => recalculateCallback("ALL_CASES"),
      { name: "observeGlobalValues reaction"  }
    )
  )
  return () => disposeGlobalValueObserver.forEach(dispose => dispose())
}

export const observeSymbolNameChanges = (dataSets: Map<string, IDataSet>,
  globalValueManager: IGlobalValueManager | undefined, nameUpdateCallback: () => void) => {
  // When any attribute name is updated, we need to update display formulas. We could make this more granular,
  // and observe only dependant attributes, but it doesn't seem necessary for now.
  const disposeAttrNameReaction = reaction(
    () => Array.from(dataSets.values()).map(ds => ds.attrNameMap.toJSON()),
    () => nameUpdateCallback(),
    {
      equals: comparer.structural,
      name: "observeSymbolNameChanges attribute name reaction"
    }
  )
  const disposeGlobalValueManagerReaction = reaction(
    () => Array.from(globalValueManager?.globals.values() || []).map(g => g.name),
    () => nameUpdateCallback(),
    {
      equals: comparer.structural,
      name: "observeSymbolNameChanges global value name reaction"
    }
  )

  return () => {
    disposeAttrNameReaction()
    disposeGlobalValueManagerReaction()
  }
}

export const observeDatasetHierarchyChanges = (dataSet: IDataSet,
  recalculateCallback: (casesToRecalculate?: CaseList) => void) => {
  // When any collection is added or removed, or attribute is moved between collections,
  // we need to recalculate the formula.
  const disposeAttrCollectionReaction = reaction(
    () => Object.fromEntries(dataSet.collections.map(c => [ c.id, c.attributes.map(a => a?.id) ])),
    () => recalculateCallback("ALL_CASES"),
    {
      equals: comparer.structural,
      name: "observeDatasetHierarchyChanges dataset collections reaction"
    }
  )

  return disposeAttrCollectionReaction
}
