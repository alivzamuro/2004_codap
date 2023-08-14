import { parse, MathNode, SymbolNode, FunctionNode, ConstantNode, isFunctionNode, isSymbolNode } from "mathjs"
import {
  AGGREGATE_SYMBOL_SUFFIX, LOCAL_ATTR, GLOBAL_VALUE, DisplayNameMap, IFormulaDependency, ILocalAttributeDependency,
  CODAPMathjsFunctions
} from "./formula-types"

// Set of formula helpers that can be used outside FormulaManager context. It should make them easier to test.

const AGGREGATE_FUNCTION: Record<string, boolean> = {
  mean: true,
  sum: true,
  // TODO: add more functions while working on the aggregate functions support
}

export const isAggregateFunction = (name: string) => AGGREGATE_FUNCTION[name] === true

const LOOKUP_FUNCTION: Record<string, boolean> = {
  lookupByIndex: true,
  lookupByKey: true,
  // TODO: add more functions while working on the lookup functions support
}

export const isLookupFunction = (name: string) => LOOKUP_FUNCTION[name] === true

export const getValueOrName = (node: MathNode) => {
  if (node.type === "SymbolNode") {
    return (node as SymbolNode).name
  }
  if (node.type === "ConstantNode") {
    return (node as ConstantNode).value
  }
  return ""
}

// Function replaces all the symbol names typed by user (display names) with the symbol canonical names that
// can be resolved by formula context and do not rely on user-based display names.
export const canonicalizeExpression = (displayExpression: string, displayNameMap: DisplayNameMap) => {
  const formulaTree = parse(displayExpression)

  interface IExtendedMathNode extends MathNode {
    isDescendantOfAggregateFunc?: boolean
  }

  const visitNode = (node: IExtendedMathNode, path: string, parent: IExtendedMathNode) => {
    if (isFunctionNode(node) && isAggregateFunction(node.fn.name) || parent?.isDescendantOfAggregateFunc) {
      node.isDescendantOfAggregateFunc = true
    }
    else if (isSymbolNode(node)) {
      if (node.name in displayNameMap.localNames) {
        node.name = displayNameMap.localNames[node.name]

        // Consider following formula example:
        // "mean(Speed) + Speed"
        // `Speed` is one that should be resolved to two very different values depending on the context:
        // - if Speed is not an argument of aggregate function, it should be resolved to the current case value
        // - if Speed is an argument of aggregate function, it should be resolved to an array containing all the values
        // This differentiation can be done using the suffixes added to the symbol name.
        if (parent.isDescendantOfAggregateFunc) {
          node.name += AGGREGATE_SYMBOL_SUFFIX
        }
      }
    }
    if (node.type === "FunctionNode" && isLookupFunction((node as FunctionNode).fn.name)) {
      const functionNode = node as FunctionNode
      if (functionNode.args[0].type === "ConstantNode") {
        const dataSetName = getValueOrName(functionNode.args[0])?.toString() || ""
        ;(functionNode.args[0] as ConstantNode<string>).value = displayNameMap.dataSet[dataSetName]?.id

        if (functionNode.args[1].type === "ConstantNode") {
          const attrName = getValueOrName(functionNode.args[1])?.toString() || ""
          ;(functionNode.args[1] as ConstantNode<string>).value =
            displayNameMap.dataSet[dataSetName]?.attribute[attrName]
        }

        if (functionNode.fn.name === CODAPMathjsFunctions.lookupByKey) {
          const keyAttrName = getValueOrName(functionNode.args[2])?.toString() || ""
          ;(functionNode.args[2] as ConstantNode<string>).value =
            displayNameMap.dataSet[dataSetName]?.attribute[keyAttrName]
        }
      }
    }
  }

  formulaTree.traverse(visitNode)
  return formulaTree.toString()
}

export const parseCanonicalSymbolName = (symbolName: string): IFormulaDependency | null => {
  if (symbolName.startsWith(LOCAL_ATTR)) {
    const attrId = symbolName.substring(LOCAL_ATTR.length)
    const result: ILocalAttributeDependency = { type: "localAttribute", attrId }
    if (attrId.endsWith(AGGREGATE_SYMBOL_SUFFIX)) {
      result.attrId = attrId.substring(0, attrId.length - AGGREGATE_SYMBOL_SUFFIX.length)
      result.aggregate = true
    }
    return result
  }
  if (symbolName.startsWith(GLOBAL_VALUE)) {
    const globalId = symbolName.substring(GLOBAL_VALUE.length)
    return { type: "globalValue", globalId }
  }
  return null
}

export const getFormulaDependencies = (formulaCanonical: string) => {
  const formulaTree = parse(formulaCanonical)
  const result: IFormulaDependency[] = []

  const visitNode = (node: MathNode) => {
    if (isSymbolNode(node)) {
      const parsedName = parseCanonicalSymbolName(node.name)
      if (parsedName) {
        result.push(parsedName)
      }
    }
    if (node.type === "FunctionNode" && isLookupFunction((node as FunctionNode).fn.name)) {
      const functionNode = node as FunctionNode
      const dataSetId = getValueOrName(functionNode.args[0])?.toString() || ""
      const attrId = getValueOrName(functionNode.args[1])?.toString() || ""
      if (functionNode.fn.name === CODAPMathjsFunctions.lookupByIndex) {
        const zeroBasedIndex = Number(getValueOrName(functionNode.args[2])) - 1 ?? undefined
        result.push({ type: "lookupByIndex", dataSetId, attrId, index: zeroBasedIndex })
      }
      if (functionNode.fn.name === CODAPMathjsFunctions.lookupByKey) {
        const keyAttrId = getValueOrName(functionNode.args[2])?.toString() || ""
        result.push({ type: "lookupByKey", dataSetId, attrId, keyAttrId })
      }
    }
  }
  formulaTree.traverse(visitNode)
  return result
}
