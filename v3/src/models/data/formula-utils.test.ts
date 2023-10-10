import { ICase } from "./data-set-types"
import { DisplayNameMap, ILocalAttributeDependency, ILookupDependency } from "./formula-types"
import {
  safeSymbolName, customizeDisplayFormula, reverseDisplayNameMap, canonicalToDisplay, makeDisplayNamesSafe,
  displayToCanonical, unescapeBacktickString, escapeBacktickString, safeSymbolNameFromDisplayFormula,
  getLocalAttrCasesToRecalculate, getLookupCasesToRecalculate, isAttrDefined
} from "./formula-utils"

const displayNameMapExample: DisplayNameMap = {
  "localNames": {
    "LifeSpan": "LOCAL_ATTR_ATTR_LIFE_SPAN",
    "Order": "LOCAL_ATTR_ATTR_ORDER",
    "caseIndex": "LOCAL_ATTR_CASE_INDEX",
    "v1": "GLOBAL_VALUE_GLOB_V1"
  },
  "dataSet": {
    "Mammals": {
      "id": "DATA_MAMMALS",
      "attribute": {
        "LifeSpan": "ATTR_LIFE_SPAN",
        "Order": "ATTR_ORDER",
      }
    },
    "Roller Coaster": {
      "id": "DATA_ROLLER_COASTER",
      "attribute": {
        // \, ", and " are added to test characters escaping
        "Park\"": "ATTR_PARK",
        "Top\\Speed'": "ATTR_TOP_SPEED",
      }
    }
  }
}

describe("displayToCanonical", () => {
  it("converts display formula to canonical formula", () => {
    expect(displayToCanonical(
      "mean(LifeSpan) * v1", displayNameMapExample
    )).toEqual("mean(LOCAL_ATTR_ATTR_LIFE_SPAN) * GLOBAL_VALUE_GLOB_V1")
  })
  describe("when function name or constant is equal to attribute name", () => {
    const displayMap: DisplayNameMap = {
      localNames: {
        mean: "LOCAL_ATTR_ATTR_MEAN",
      },
      dataSet: {}
    }
    it("still converts display formula to canonical formula correctly", () => {
      expect(displayToCanonical(
        "mean(mean) + 'mean'", displayMap
      )).toEqual('mean(LOCAL_ATTR_ATTR_MEAN) + "mean"')
    })
  })
  describe("when attribute name includes special characters", () => {
    const testDisplayMap: DisplayNameMap = {
      localNames: {
        [safeSymbolName("mean`attribute\\🙃")]: "LOCAL_ATTR_ATTR_MEAN",
      },
      dataSet: {}
    }
    it("works as long as it's enclosed in backticks", () => {
      expect(displayToCanonical(
        "mean(`mean\\`attribute\\\\🙃`) + 'mean'", testDisplayMap
      )).toEqual('mean(LOCAL_ATTR_ATTR_MEAN) + "mean"')
    })
  })
  describe("when attribute name is provided as string constant (e.g. lookup functions)", () => {
    it("is still converted correctly and names with special characters are NOT enclosed in backticks", () => {
      expect(displayToCanonical(
        'lookupByKey("Roller Coaster", "Park\\"", "Top\\\\Speed\'", Order) * 2', displayNameMapExample
      )).toEqual('lookupByKey("DATA_ROLLER_COASTER", "ATTR_PARK", "ATTR_TOP_SPEED", LOCAL_ATTR_ATTR_ORDER) * 2')
    })
  })
})

describe("unescapeBacktickString", () => {
  it("converts escaped characters in safe symbol name to original characters", () => {
    expect(unescapeBacktickString("Attribute\\`Test")).toEqual("Attribute`Test")
    expect(unescapeBacktickString("Attribute\\\\Test")).toEqual("Attribute\\Test")
  })
  it("is's an inverse of escapeBacktickString", () => {
    const testString = "Attribute\\\\\\`Test"
    expect(unescapeBacktickString(escapeBacktickString(testString))).toEqual(testString)
  })
})

describe("escapeBacktickString", () => {
  it("converts some characters in safe symbol name to escaped characters", () => {
    expect(escapeBacktickString("Attribute`Test")).toEqual("Attribute\\`Test")
    expect(escapeBacktickString("Attribute\\Test")).toEqual("Attribute\\\\Test")
  })
  it("is's an inverse of unescapeBacktickString", () => {
    const testString = "Attribute`Test\\"
    expect(unescapeBacktickString(escapeBacktickString(testString))).toEqual(testString)
  })
})

describe("safeSymbolName", () => {
  it("converts strings that are not parsable by Mathjs to valid symbol names", () => {
    expect(safeSymbolName("Valid_Name_Should_Not_Be_Changed")).toEqual("Valid_Name_Should_Not_Be_Changed")
    expect(safeSymbolName("Attribute Name")).toEqual("Attribute_Name")
    expect(safeSymbolName("1")).toEqual("_1")
    expect(safeSymbolName("1a")).toEqual("_1a")
    expect(safeSymbolName("Attribute 🙃 Test")).toEqual("Attribute____Test")
    expect(safeSymbolName("Attribute`Test")).toEqual("Attribute_Test")
    expect(safeSymbolName("Attribute\\Test")).toEqual("Attribute_Test")
    expect(safeSymbolName("Attribute\\\\Test")).toEqual("Attribute__Test")
    expect(safeSymbolName("Attribute\\`Test")).toEqual("Attribute__Test")
    expect(safeSymbolName("Attribute\\\\\\`Test")).toEqual("Attribute____Test")
  })
})
describe("safeSymbolNameFromDisplayFormula", () => {
  it("unescapes special characters and converts strings that are not parsable by Mathjs to valid symbol names", () => {
    // \\ and \` treated as one character
    expect(safeSymbolNameFromDisplayFormula("Attribute\\Test")).toEqual("Attribute_Test")
    expect(safeSymbolNameFromDisplayFormula("Attribute\\\\Test")).toEqual("Attribute_Test")
    expect(safeSymbolNameFromDisplayFormula("Attribute\\`Test")).toEqual("Attribute_Test")
    expect(safeSymbolNameFromDisplayFormula("Attribute\\\\\\`Test")).toEqual("Attribute__Test")
  })
})

describe("makeDisplayNamesSafe", () => {
  it("replaces all the symbols enclosed between `` with safe symbol names", () => {
    expect(makeDisplayNamesSafe("mean(`Attribute Name`)")).toEqual("mean(Attribute_Name)")
    // \` and \\ treated as one symbol - unescaping is done in safeSymbolNameFromDisplayFormula
    expect(makeDisplayNamesSafe("`Attr\\\\Name` + `Attr\\`Name 2`")).toEqual("Attr_Name + Attr_Name_2")
  })
})

describe("customizeDisplayFormula", () => {
  it("replaces all the assignment operators with equality operators", () => {
    expect(customizeDisplayFormula("a = 1")).toEqual("a == 1")
    expect(customizeDisplayFormula("a = b")).toEqual("a == b")
    expect(customizeDisplayFormula("a = b = c")).toEqual("a == b == c")
  })
  it("doesn't replace unequality operator", () => {
    expect(customizeDisplayFormula("a != 1")).toEqual("a != 1")
    expect(customizeDisplayFormula("a != b")).toEqual("a != b")
    expect(customizeDisplayFormula("a != b = c = d != e")).toEqual("a != b == c == d != e")
  })
})

describe("reverseDisplayNameMap", () => {
  it("reverses the display name map", () => {
    expect(reverseDisplayNameMap(displayNameMapExample)).toEqual({
      LOCAL_ATTR_ATTR_LIFE_SPAN: "LifeSpan",
      LOCAL_ATTR_ATTR_ORDER: "Order",
      LOCAL_ATTR_CASE_INDEX: "caseIndex",
      GLOBAL_VALUE_GLOB_V1: "v1",
      DATA_MAMMALS: "Mammals",
      ATTR_LIFE_SPAN: "LifeSpan",
      ATTR_ORDER: "Order",
      DATA_ROLLER_COASTER: "Roller Coaster",
      ATTR_PARK: "Park\"",
      ATTR_TOP_SPEED: "Top\\Speed'",
    })
  })
})

describe("canonicalToDisplay", () => {
  it("converts canonical formula to display formula maintaining whitespace characters", () => {
    expect(canonicalToDisplay(
      "mean(LOCAL_ATTR_ATTR_LIFE_SPAN) + GLOBAL_VALUE_GLOB_V1",
      "mean (\nLifeSpan\n) + v1 ", reverseDisplayNameMap(displayNameMapExample)
    )).toEqual("mean (\nLifeSpan\n) + v1 ")
    expect(canonicalToDisplay(
      "mean(LOCAL_ATTR_ATTR_LIFE_SPAN) + LOCAL_ATTR_ATTR_ORDER * GLOBAL_VALUE_GLOB_V1",
      "mean (\nOldLifeSpan\n) + OldOrder * OldV1", reverseDisplayNameMap(displayNameMapExample)
    )).toEqual("mean (\nLifeSpan\n) + Order * v1")
  })
  describe("when function name or constant is equal to attribute name", () => {
    const displayMap: DisplayNameMap = {
      localNames: {
        NewMeanAttr: "LOCAL_ATTR_ATTR_MEAN",
      },
      dataSet: {}
    }
    it("still converts canonical formula to display formula correctly", () => {
      expect(canonicalToDisplay(
        "mean(LOCAL_ATTR_ATTR_MEAN) + 'mean'",
        "mean ( mean ) + 'mean'", reverseDisplayNameMap(displayMap)
      )).toEqual("mean ( NewMeanAttr ) + 'mean'")
    })
  })
  describe("when attribute name includes special characters", () => {
    const testDisplayMap: DisplayNameMap = {
      localNames: {
        "new\\mean`attribute 🙃": "LOCAL_ATTR_ATTR_MEAN",
      },
      dataSet: {}
    }
    it("is enclosed in backticks and special characters are escaped", () => {
      expect(canonicalToDisplay(
        "mean(LOCAL_ATTR_ATTR_MEAN) + 'mean'",
        "mean ( mean ) + 'mean'", reverseDisplayNameMap(testDisplayMap)
      )).toEqual("mean ( `new\\\\mean\\`attribute 🙃` ) + 'mean'")
    })
  })
  describe("when attribute name is provided as string constant (e.g. lookup functions)", () => {
    it("is still converted correctly and names with special characters are NOT enclosed in backticks", () => {
      expect(canonicalToDisplay(
        'lookupByKey("DATA_ROLLER_COASTER", "ATTR_PARK", "ATTR_TOP_SPEED", LOCAL_ATTR_ATTR_ORDER) * 2',
        'lookupByKey("Old Roller Coaster", "Old Park", "Old Top Speed", OldOrder) * 2',
        reverseDisplayNameMap(displayNameMapExample)
      )).toEqual('lookupByKey("Roller Coaster", "Park\\"", "Top\\\\Speed\'", Order) * 2')
    })
  })
})

describe("isAttrDefined", () => {
  const dataSetCase: ICase = { __id__: "1", attr1: 1, attr2: 2 }

  it("returns true if the attribute is defined in the data set case", () => {
    const attributeId = "attr1"
    const result = isAttrDefined(dataSetCase, attributeId)
    expect(result).toBe(true)
  })

  it("returns false if the attribute is not defined in the data set case", () => {
    const attributeId = "attr3"
    const result = isAttrDefined(dataSetCase, attributeId)
    expect(result).toBe(false)
  })

  it("returns false if the attribute ID is not provided", () => {
    const attributeId = undefined
    const result = isAttrDefined(dataSetCase, attributeId)
    expect(result).toBe(false)
  })
})

describe("getLocalAttrCasesToRecalculate", () => {
  const cases: ICase[] = [
    { __id__: "1", attr1: 0, attr2: 1 },
    { __id__: "2", attr1: 2, attr2: 3 },
    { __id__: "3", attr1: "" }, // empty string should be considered as value that needs to trigger recalculation
    { __id__: "4", attr2: 4 },
  ]

  it("returns 'ALL_CASES' if any case has an attribute that depends on an aggregate attribute", () => {
    const formulaDependencies: ILocalAttributeDependency[] = [
      { attrId: "attr1", type: "localAttribute", aggregate: false },
      { attrId: "attr2", type: "localAttribute", aggregate: true },
    ]
    const result = getLocalAttrCasesToRecalculate(cases, formulaDependencies)
    expect(result).toBe("ALL_CASES")
  })

  it("returns an array of cases that have an attribute that depends on a regular attribute", () => {
    const formulaDependencies: ILocalAttributeDependency[] = [
      { attrId: "attr1", type: "localAttribute", aggregate: false }
    ]
    const result = getLocalAttrCasesToRecalculate(cases, formulaDependencies)
    expect(result).toEqual([cases[0], cases[1], cases[2]])
  })

  it("returns an empty array if no case has an attribute that depends on a regular attribute", () => {
    const formulaDependencies: ILocalAttributeDependency[] = [
      { attrId: "attr3", type: "localAttribute", aggregate: false }
    ]
    const result = getLocalAttrCasesToRecalculate(cases, formulaDependencies)
    expect(result).toEqual([])
  })
})

describe("getLookupCasesToRecalculate", () => {
  const dependency: ILookupDependency = { type: "lookup", dataSetId: "ds1", attrId: "attr1", keyAttrId: "attr2" }

  it("returns 'ALL_CASES' if any case has the lookup attribute or the lookup key attribute", () => {
    expect(getLookupCasesToRecalculate([{ __id__: "1", attr1: 1 }], dependency)).toBe("ALL_CASES")
    expect(getLookupCasesToRecalculate([{ __id__: "1", attr2: "" }], dependency)).toBe("ALL_CASES")
  })

  it("returns an empty array if no case has the lookup attribute or the lookup key attribute", () => {
    expect(getLookupCasesToRecalculate([{ __id__: "1", attr3: 3 }], dependency)).toEqual([])
  })
})
