import {addDisposer, getSnapshot, Instance, SnapshotIn, types} from "mobx-state-tree"
import {comparer, reaction} from "mobx"
import {AttributeType} from "../../../models/data/attribute"
import {IDataSet} from "../../../models/data/data-set"
import {typedId} from "../../../utilities/js-utils"
import { cachedFnFactory, cachedFnWithArgsFactory, safeGetSnapshot } from "../../../utilities/mst-utils"
import {AxisPlace} from "../../axis/axis-types"
import {GraphPlace} from "../../axis-graph-shared"
import {AttributeDescription, DataConfigurationModel, IAttributeDescriptionSnapshot, IDataConfigurationModel}
  from "../../data-display/models/data-configuration-model"
import {AttrRole, GraphAttrRole, graphPlaceToAttrRole, PrimaryAttrRoles} from "../../data-display/data-display-types"
import {updateCellKey} from "../adornments/adornment-utils"
import { isFiniteNumber } from "../../../utilities/math-utils"
import { CaseData } from "../../data-display/d3-types"

export const kGraphDataConfigurationType = "graphDataConfigurationType"

interface ILegalAttributeOptions {
  allowSameAttr?: boolean
}

/**
 * A note about cases:
 * - For situations in which there is exactly one y-attribute, there exists one set of cases, filtered
 *    by the presence of values for all assigned attributes, neglecting caption and legend.
 *  - But when there is more than one y-attribute, there is one set of cases for each y-attribute. So
 *    we have to choose the set of cases we are referring to. To keep the api as simple as possible we provide a
 *    set of access methods that do not require the user to specify which set of cases they are
 *    interested in. For these methods, the assumption is that the caseArrayNumber is 0.
 *  -
 */

export const GraphDataConfigurationModel = DataConfigurationModel
  .named('GraphDataConfigurationModel')
  .props({
    id: types.optional(types.identifier, () => typedId("GDCON")),
    type: types.optional(types.literal(kGraphDataConfigurationType), kGraphDataConfigurationType),
    // determines stacking direction in categorical-categorical, for instance
    primaryRole: types.maybe(types.enumeration([...PrimaryAttrRoles])),
    // all attributes for (left) y role
    _yAttributeDescriptions: types.array(AttributeDescription),
  })
  .views(self => ({
    get secondaryRole() {
      return self.primaryRole === 'x' ? 'y'
        : self.primaryRole === 'y' ? 'x'
          : ''
    },
    get y2AttributeDescriptionIsPresent() {
      return !!self._attributeDescriptions.get('rightNumeric')
    },
    get yAttributeDescriptionsExcludingY2() {
      return self._yAttributeDescriptions
    },
    // Includes rightNumeric if present
    get yAttributeDescriptions() {
      const descriptions = self._yAttributeDescriptions,
        y2Description = self._attributeDescriptions.get('rightNumeric') ?? null
      return descriptions.concat(y2Description ? [y2Description] : [])
    },
    // Includes rightNumeric if present
    get yAttributeIDs() {
      return this.yAttributeDescriptions.map((d: IAttributeDescriptionSnapshot) => d.attributeID)
    },
    /**
     * No attribute descriptions beyond the first for y are returned.
     * The rightNumeric attribute description is also not returned.
     */
    get attributeDescriptions() {
      const descriptions: Partial<Record<AttrRole, IAttributeDescriptionSnapshot>> =
        {...getSnapshot(self._attributeDescriptions)}
      delete descriptions.rightNumeric
      if (self._yAttributeDescriptions.length > 0) {
        descriptions.y = safeGetSnapshot(self._yAttributeDescriptions[0])
      }
      return descriptions
    },
    get attributeDescriptionsStr() {
      return JSON.stringify(this.attributeDescriptions)
    },
    /**
     * For the 'y' role we return the first y-attribute, for 'rightNumeric' we return the last y-attribute.
     * For all other roles we return the attribute description for the role.
     */
    attributeDescriptionForRole(role: GraphAttrRole) {
      return role === 'y' ? safeGetSnapshot(this.yAttributeDescriptions[0])
        : role === 'rightNumeric' ? self._attributeDescriptions.get('rightNumeric')
          : this.attributeDescriptions[role]
    },
    placeCanHaveZeroExtent(place: GraphPlace) {
      return ['rightNumeric', 'legend', 'top', 'rightCat'].includes(place) &&
        self.attributeID(graphPlaceToAttrRole[place]) === ''
    },
    placeCanShowClickHereCue(place: GraphPlace, pointsFusedIntoBars = false) {
      const role = graphPlaceToAttrRole[place]
      const isSecondaryRole = (place === 'left' || place === 'bottom') && self.primaryRole !== role
      return ['left', 'bottom'].includes(place) && !self.attributeID(role) && !(isSecondaryRole && pointsFusedIntoBars)
    },
    placeAlwaysShowsClickHereCue(place: GraphPlace) {
      return this.placeCanShowClickHereCue(place) &&
        !self.attributeID(graphPlaceToAttrRole[place === 'left' ? 'bottom' : 'left'])
    },
    placeShouldShowClickHereCue(place: GraphPlace, tileHasFocus: boolean) {
      return this.placeAlwaysShowsClickHereCue(place) ||
        (this.placeCanShowClickHereCue(place) && tileHasFocus)
    }
  }))
  .views(self => {
    const baseRolesForAttribute = self.rolesForAttribute
    return {
      rolesForAttribute(attrID: string) {
        const roles = baseRolesForAttribute(attrID)
        if (self.yAttributeIDs.includes(attrID)) {
          // role depends on whether there are attributes remaining
          roles.push(self.yAttributeDescriptions.length > 1 ? "yPlus" : "y")
        }
        return roles
      }
    }
  })
  .views(self => ({
    get primaryAttributeID(): string {
      return self.primaryRole && self.attributeID(self.primaryRole) || ''
    },
    get secondaryAttributeID(): string {
      return self.secondaryRole && self.attributeID(self.secondaryRole) || ''
    },
    get graphCaseIDs() {
      const allGraphCaseIds = new Set<string>()
      // todo: We're bypassing get caseDataArray to avoid infinite recursion. Is it necessary?
      self.filteredCases?.forEach(aFilteredCases => {
        if (aFilteredCases) {
          aFilteredCases.caseIds.forEach(id => allGraphCaseIds.add(id))
        }
      })
      return allGraphCaseIds
    },
    get primaryAttributeType(): AttributeType {
      return self.primaryRole && self.attributeType(self.primaryRole) || "categorical"
    }
  }))
  .actions(self => ({
    _setAttributeDescription(iRole: GraphAttrRole, iDesc?: IAttributeDescriptionSnapshot) {
      if (iRole === 'y') {
        self._yAttributeDescriptions.clear()
        if (iDesc?.attributeID) {
          self._yAttributeDescriptions.push(iDesc)
        }
      } else if (iDesc?.attributeID) {
        self._attributeDescriptions.set(iRole, iDesc)
      } else {
        self._attributeDescriptions.delete(iRole)
      }
    }
  }))
  .views(self => ({
    /**
     * We override the base implementation to handle the case where there are multiple y-attributes. We only have
     * to do this when caseArrayNumber is not zero; i.e. when the plot has multiple y-attributes.
     */
    filterCase(data: IDataSet, caseID: string, caseArrayNumber?: number) {
      // If the case is hidden we don't plot it
      if (self.hiddenCasesSet.has(caseID)) return false
      if (caseArrayNumber === 0 || caseArrayNumber === undefined) {
        return self._filterCase(data, caseID)
      }
      // Note that this excludes `rightNumeric` (see `attributeDescriptions` above)
      const descriptions = {...self.attributeDescriptions}
      // If a 'rightNumeric' attribute exists and caseArrayNumber is >= the length of _yAttributeDescriptions, then
      // we are looking at the rightNumeric attribute. Delete the y attribute description and add the rightNumeric one.
      // Otherwise, replace the y attribute description with the one at the given index.
      if (caseArrayNumber >= self._yAttributeDescriptions.length) {
        delete descriptions.y
        const rightNumeric = self.attributeDescriptionForRole('rightNumeric')
        if (rightNumeric) {
          descriptions.rightNumeric = rightNumeric
        }
      } else {
        descriptions.y = self._yAttributeDescriptions[caseArrayNumber]
      }
      return self._caseHasValidValuesForDescriptions(data, caseID, descriptions)
    }
  }))
  .views(self => ({
    get numberOfPlots() {
      return self.filteredCases?.length ?? 0  // filteredCases is an array of CaseArrays
    },
    get hasY2Attribute() {
      return !!self.attributeID('rightNumeric')
    },
    /**
     * Note that in order to eliminate a selected case from the graph's selection, we have to check that it is not
     * present in any of the case sets, not just the 0th one.
     */
    get selection() {
      if (!self.dataset || !self.filteredCases?.[0]) return []
      return Array.from(self.graphCaseIDs).filter(caseId => self.dataset?.isCaseSelected(caseId))
    }
  }))
  .views(self => (
    {
      get numericValuesForYAxis() {
        const allGraphCaseIds = Array.from(self.graphCaseIDs),
          allValues: number[] = []

        return self.yAttributeIDs.reduce((acc: number[], yAttrID: string) => {
          const values = allGraphCaseIds.map((anID: string) => Number(self.dataset?.getValue(anID, yAttrID)))
          return acc.concat(values)
        }, allValues)
      },
      numRepetitionsForPlace(place: GraphPlace) {
        // numRepetitions is the number of times an axis is repeated in the graph
        let numRepetitions = 1
        switch (place) {
          case 'left':
            numRepetitions = Math.max(self.categoryArrayForAttrRole('rightSplit').length, 1)
            break
          case 'bottom':
            numRepetitions = Math.max(self.categoryArrayForAttrRole('topSplit').length, 1)
        }
        return numRepetitions
      },
      get attrTypes() {
        return {
          bottom: self.attributeType("x"),
          left: self.attributeType("y"),
          top: self.attributeType("topSplit"),
          right: self.attributeType("rightSplit")
        }
      }
    }))
  .views(self => ({
    /**
     * For the purpose of computing percentages, we need to know the total number of cases we're counting.
     * A "subplot" contains the cases being considered. Subplots are always defined by topSplit and/or rightSplit
     * categorical attributes rather than any categorical attributes on the left or bottom.
     * A "cell" is defined by zero or more categorical attributes within a subplot.
     * A percentage is the percentage of cases within a subplot that are within a given cell.
     */
    get categoricalAttrCount() {
      const attrTypes = self.attrTypes
      return Object.values(attrTypes).filter(a => a === "categorical").length
    },
    potentiallyCategoricalRoles(): AttrRole[] {
      return ["legend", "x", "y", "topSplit", "rightSplit"] as const
    },
    get hasExactlyOneCategoricalAxis() {
      const attrTypes = self.attrTypes
      const xHasCategorical = attrTypes.bottom === "categorical" || attrTypes.top === "categorical"
      const yHasCategorical = attrTypes.left === "categorical"
      const hasOnlyOneCategoricalAxis = (xHasCategorical && !yHasCategorical) || (!xHasCategorical && yHasCategorical)
      return hasOnlyOneCategoricalAxis
    },
    get hasExactlyTwoPerpendicularCategoricalAttrs() {
      const attrTypes = self.attrTypes
      const xHasCategorical = attrTypes.bottom === "categorical" || attrTypes.top === "categorical"
      const yHasCategorical = attrTypes.left === "categorical" || attrTypes.right === "categorical"
      const hasOnlyTwoCategorical = this.categoricalAttrCount === 2
      return hasOnlyTwoCategorical && xHasCategorical && yHasCategorical
    },
    get hasSingleSubplot() {
      // A graph has a single subplot if it has one or fewer categorical attributes, or if it has exactly two
      // categorical attributes on axes that are perpendicular to each other.
      return this.categoricalAttrCount <= 1 || this.hasExactlyTwoPerpendicularCategoricalAttrs
    }
  }))
  .views(self => ({
    getCategoriesOptions() {
      // Helper used often by adornments that usually ask about the same categories and their specifics.
      const xAttrType = self.attributeType("x")
      const yAttrType = self.attributeType("y")
      return {
        xAttrId: self.attributeID("x"),
        xAttrType,
        xCats: xAttrType === "categorical" ? self.categoryArrayForAttrRole("x", []) : [""],
        yAttrId: self.attributeID("y"),
        yAttrType,
        yCats: yAttrType === "categorical" ? self.categoryArrayForAttrRole("y", []) : [""],
        topAttrId: self.attributeID("topSplit"),
        topCats: self.categoryArrayForAttrRole("topSplit", []) ?? [""],
        rightAttrId: self.attributeID("rightSplit"),
        rightCats: self.categoryArrayForAttrRole("rightSplit", []) ?? [""],
      }
    }
  }))
  .views(self => ({
    cellMap(
      extraPrimaryAttrRole: AttrRole, extraSecondaryAttrRole: AttrRole,
      binWidth = 0, minValue = 0, totalNumberOfBins = 0
    ) {
      type BinMap = Record<string, Record<string, Record<string, Record<string, number>>>>
      const primAttrID = self.primaryRole ? self.attributeID(self.primaryRole) : "",
        secAttrID = self.secondaryRole ? self.attributeID(self.secondaryRole) : "",
        extraPrimAttrID = self.attributeID(extraPrimaryAttrRole) ?? '',
        extraSecAttrID = self.attributeID(extraSecondaryAttrRole) ?? '',
        valueQuads = (self.caseDataArray || []).map((aCaseData: CaseData) => {
          return {
            primary: (primAttrID && self.dataset?.getValue(aCaseData.caseID, primAttrID)) ?? '',
            secondary: (secAttrID && self.dataset?.getValue(aCaseData.caseID, secAttrID)) ?? '__main__',
            extraPrimary: (extraPrimAttrID && self.dataset?.getValue(aCaseData.caseID, extraPrimAttrID)) ?? '__main__',
            extraSecondary: (extraSecAttrID && self.dataset?.getValue(aCaseData.caseID, extraSecAttrID)) ?? '__main__'
          }
        }),
        bins: BinMap = {}

      valueQuads?.forEach((aValue: any) => {
        const primaryValue = totalNumberOfBins > 0
                               ? Math.floor((Number(aValue.primary) - minValue) / binWidth)
                               : aValue.primary
        if (bins[primaryValue] === undefined) {
          bins[primaryValue] = {}
        }
        if (bins[primaryValue][aValue.secondary] === undefined) {
          bins[primaryValue][aValue.secondary] = {}
        }
        if (bins[primaryValue][aValue.secondary][aValue.extraPrimary] === undefined) {
          bins[primaryValue][aValue.secondary][aValue.extraPrimary] = {}
        }
        if (bins[primaryValue][aValue.secondary][aValue.extraPrimary][aValue.extraSecondary] === undefined) {
          bins[primaryValue][aValue.secondary][aValue.extraPrimary][aValue.extraSecondary] = 0
        }
        bins[primaryValue][aValue.secondary][aValue.extraPrimary][aValue.extraSecondary]++
      })

      return bins
    }
  }))
  .views(self => ({
    maxOverAllCells(extraPrimaryAttrRole: AttrRole, extraSecondaryAttrRole: AttrRole) {
      const bins = self.cellMap(extraPrimaryAttrRole, extraSecondaryAttrRole)
      // Find and return the maximum value in the bins
      return Object.keys(bins).reduce((hMax, hKey) => {
        return Math.max(hMax, Object.keys(bins[hKey]).reduce((vMax, vKey) => {
          return Math.max(vMax, Object.keys(bins[hKey][vKey]).reduce((epMax, epKey) => {
            return Math.max(epMax, Object.keys(bins[hKey][vKey][epKey]).reduce((esMax, esKey) => {
              return Math.max(esMax, bins[hKey][vKey][epKey][esKey])
            }, 0))
          }, 0))
        }, 0))
      }, 0)
    },
    maxCellLength(
      extraPrimaryAttrRole: AttrRole, extraSecondaryAttrRole: AttrRole,
      binWidth: number, minValue: number, totalNumberOfBins: number
    ) {
      const bins = self.cellMap(extraPrimaryAttrRole, extraSecondaryAttrRole, binWidth, minValue, totalNumberOfBins)
      // Find and return the length of the record in bins with the most elements
      let maxInBin = 0
      for (const pKey in bins) {
        const pBin = bins[pKey]
        for (const sKey in pBin) {
          const sBin = pBin[sKey]
          for (const epKey in sBin) {
            const epBin = sBin[epKey]
            for (const esKey in epBin) {
              const esBin = epBin[esKey]
              maxInBin = Math.max(maxInBin, esBin)
            }
          }
        }
      }
      return maxInBin
    },
    cellKey(index: number) {
      const { xAttrId, xCats, yAttrId, yCats, topAttrId, topCats, rightAttrId, rightCats } = self.getCategoriesOptions()
      const rightCatCount = rightCats.length || 1
      const yCatCount = yCats.length || 1
      const xCatCount = xCats.length || 1
      let cellKey: Record<string, string> = {}

      // Determine which categories are associated with the cell's axes using the provided index value and
      // the attributes and categories present in the graph.
      const topIndex = Math.floor(index / (rightCatCount * yCatCount * xCatCount))
      const topCat = topCats[topIndex]
      cellKey = updateCellKey(cellKey, topAttrId, topCat)
      const rightIndex = Math.floor(index / (yCatCount * xCatCount)) % rightCatCount
      const rightCat = rightCats[rightIndex]
      cellKey = updateCellKey(cellKey, rightAttrId, rightCat)
      const yCat = yCats[index % yCatCount]
      cellKey = updateCellKey(cellKey, yAttrId, yCat)
      const xCat = xCats[index % xCatCount]
      cellKey = updateCellKey(cellKey, xAttrId, xCat)

      return cellKey
    },
    getAllCellKeys() {
      const { xCats, yCats, topCats, rightCats } = self.getCategoriesOptions()
      const topCatCount = topCats.length || 1
      const rightCatCount = rightCats.length || 1
      const xCatCount = xCats.length || 1
      const yCatCount = yCats.length || 1
      const columnCount = topCatCount * xCatCount
      const rowCount = rightCatCount * yCatCount
      const totalCount = rowCount * columnCount
      const cellKeys: Record<string, string>[] = []
      for (let i = 0; i < totalCount; ++i) {
        cellKeys.push(this.cellKey(i))
      }
      return cellKeys
    },
    isCaseInSubPlot(cellKey: Record<string, string>, caseData: Record<string, any>) {
      const numOfKeys = Object.keys(cellKey).length
      let matchedValCount = 0
      Object.keys(cellKey).forEach(key => {
        if (cellKey[key] === caseData[key]) matchedValCount++
      })
      return matchedValCount === numOfKeys
    },
    allPlottedCases: cachedFnFactory(() => {
      const casesInPlot = new Set<string>()
      self.filteredCases?.forEach(aFilteredCases => {
        aFilteredCases.caseIds.forEach((id) => {
          casesInPlot.add(id)
        })
      })
      return Array.from(casesInPlot)
    })
  }))
  .views(self => ({
    subPlotKey(anID: string) {
      const primaryAttrRole = self.primaryRole ?? "x"
      const primaryIsBottom = primaryAttrRole === "x"
      const extraPrimaryRole = primaryIsBottom ? "topSplit" : "rightSplit"
      const extraPrimaryAttrID = self.attributeID(extraPrimaryRole) ?? ""
      const extraSecondaryRole = primaryIsBottom ? "rightSplit" : "topSplit"
      const extraSecondaryAttrID = self.attributeID(extraSecondaryRole) ?? ""
      const category = self.dataset?.getStrValue(anID, self.secondaryAttributeID) ?? "__main__"
      const extraCategory = self.dataset?.getStrValue(anID, extraSecondaryAttrID) ?? "__main__"
      const extraPrimaryCategory = self.dataset?.getStrValue(anID, extraPrimaryAttrID) ?? "__main__"
      const key: Record<string, string> = {}
      self.secondaryAttributeID && (key[self.secondaryAttributeID] = category)
      extraSecondaryAttrID && (key[extraSecondaryAttrID] = extraCategory)
      extraPrimaryAttrID && (key[extraPrimaryAttrID] = extraPrimaryCategory)
      return key
    },
    subPlotCases: cachedFnWithArgsFactory({
      key: (cellKey: Record<string, string>) => JSON.stringify(cellKey),
      calculate: (cellKey: Record<string, string>) => {
        return self.allPlottedCases().filter((caseId) => {
          const itemData = self.dataset?.getFirstItemForCase(caseId, { numeric: false })
          const caseData = itemData || { __id__: caseId }
          return self.isCaseInSubPlot(cellKey, caseData)
        })
      }
    }),
    cellCases: cachedFnWithArgsFactory({
      key: (cellKey: Record<string, string>) => JSON.stringify(cellKey),
      calculate: (cellKey: Record<string, string>) => {
        const rightAttrID = self.attributeID("rightSplit")
        const rightValue = rightAttrID ? cellKey[rightAttrID] : ""
        const topAttrID = self.attributeID("topSplit")
        const topAttrType = self.attributeType("topSplit")
        const topValue = topAttrID ? cellKey[topAttrID] : ""

        return self.allPlottedCases().filter(caseId => {
          const caseData = self.dataset?.getFirstItemForCase(caseId, { numeric: false })
          if (!caseData) return false
          const isRightMatch = !rightAttrID || rightValue === caseData[rightAttrID]
          const isTopMatch = !topAttrID || topAttrType !== "categorical" ||
            (topAttrType === "categorical" && topValue === caseData[topAttrID])

          return isRightMatch && isTopMatch
        })
      }
    }),
    rowCases: cachedFnWithArgsFactory({
      key: (cellKey: Record<string, string>) => JSON.stringify(cellKey),
      calculate: (cellKey: Record<string, string>) => {
        const leftAttrID = self.attributeID("y")
        const leftAttrType = self.attributeType("y")
        const leftValue = leftAttrID ? cellKey[leftAttrID] : ""
        const rightAttrID = self.attributeID("rightSplit")
        const rightValue = rightAttrID ? cellKey[rightAttrID] : ""
        const topAttrID = self.attributeID("topSplit")
        const topValue = topAttrID ? cellKey[topAttrID] : ""

        return self.allPlottedCases().filter(caseId => {
          const caseData = self.dataset?.getFirstItemForCase(caseId, { numeric: false })
          if (!caseData) return false

          const isLeftMatch = !leftAttrID || leftAttrType !== "categorical" ||
            (leftAttrType === "categorical" && leftValue === caseData[leftAttrID])
          const isRightMatch = !rightAttrID || rightValue === caseData[rightAttrID]
          const isTopMatch = !topAttrID || topValue === caseData[topAttrID]

          return isLeftMatch && isRightMatch && isTopMatch
        })
      }
    }),
    columnCases: cachedFnWithArgsFactory({
      key: (cellKey: Record<string, string>) => JSON.stringify(cellKey),
      calculate: (cellKey: Record<string, string>) => {
        const bottomAttrID = self.attributeID("x")
        const bottomAttrType = self.attributeType("x")
        const bottomValue = bottomAttrID ? cellKey[bottomAttrID] : ""
        const topAttrID = self.attributeID("topSplit")
        const topValue = topAttrID ? cellKey[topAttrID] : ""
        const rightAttrID = self.attributeID("rightSplit")
        const rightValue = rightAttrID ? cellKey[rightAttrID] : ""

        return self.allPlottedCases().filter(caseId => {
          const caseData = self.dataset?.getFirstItemForCase(caseId, { numeric: false })
          if (!caseData) return false

          const isBottomMatch = !bottomAttrID || bottomAttrType !== "categorical" ||
            (bottomAttrType === "categorical" && bottomValue === caseData[bottomAttrID])
          const isTopMatch = !topAttrID || topValue === caseData[topAttrID]
          const isRightMatch = !rightAttrID || rightValue === caseData[rightAttrID]

          return isBottomMatch && isTopMatch && isRightMatch
        })
      }
    })
  }))
  .views(self => ({
    casesInRange(min: number, max: number, attrId: string, cellKey: Record<string, string>, inclusiveMax = true) {
      return self.subPlotCases(cellKey)?.filter(caseId => {
        const caseValue = self.dataset?.getNumeric(caseId, attrId)
        if (!isFiniteNumber(caseValue)) return false
        const isWithinRange = caseValue >= min && (inclusiveMax ? caseValue <= max : caseValue < max)
        if (isWithinRange) {
          return caseId
        }
      })
    }
  }))
  .views(self => (
    {
      /**
       * Called to determine whether the categories on an axis should be centered.
       * If the attribute is playing a primary role, then it should be centered.
       * If it is a secondary role, then it should not be centered.
       * 'top' and 'rightCat' are always centered.
       */
      categoriesForAxisShouldBeCentered(place: AxisPlace) {
        const role = graphPlaceToAttrRole[place],
          primaryRole = self.primaryRole
        return primaryRole === role || !['left', 'bottom'].includes(place)
      },
      placeCanAcceptAttributeIDDrop(
        place: GraphPlace, dataSet?: IDataSet, idToDrop?: string, options?: ILegalAttributeOptions
      ) {
        const role = graphPlaceToAttrRole[place],
          xIsNumeric = self.attributeType('x') === 'numeric',
          existingID = self.attributeID(role),
          differentAttribute = options?.allowSameAttr || existingID !== idToDrop
        // only drops on left/bottom axes can change data set
        if (dataSet?.id !== self.dataset?.id && !['left', 'bottom'].includes(place)) {
          return false
        }

        if (!idToDrop) return false

        const typeToDropIsNumeric = dataSet?.attrFromID(idToDrop)?.type === "numeric"
        if (place === 'yPlus') {
          return xIsNumeric && typeToDropIsNumeric && !self.yAttributeIDs.includes(idToDrop)
        } else if (place === 'rightNumeric') {
          return xIsNumeric && typeToDropIsNumeric && differentAttribute
        } else if (['top', 'rightCat'].includes(place)) {
          return !typeToDropIsNumeric && differentAttribute
        } else {
          return differentAttribute
        }
      }
    }))
  .extend(self => {
    const superClearAttributes = self.clearAttributes

    return {
      actions: {
        clearAttributes() {
          superClearAttributes()
          self._yAttributeDescriptions.clear()
        }
      }
    }
  })
  .actions(self => ({
    setPrimaryRole(role: GraphAttrRole) {
      if (role === 'x' || role === 'y') {
        self.primaryRole = role
      }
    },
    setAttribute(role: GraphAttrRole, desc?: IAttributeDescriptionSnapshot) {

      // For 'x' and 'y' roles, if the given attribute is already present on the other axis, then
      // move whatever attribute is assigned to the given role to that axis.
      if (['x', 'y'].includes(role)) {
        const otherRole = role === 'x' ? 'y' : 'x',
          otherDesc = self.attributeDescriptionForRole(otherRole)
        if (otherDesc?.attributeID === desc?.attributeID) {
          const currentDesc = self.attributeDescriptionForRole(role) ?? {attributeID: '', type: 'categorical'}
          self._setAttributeDescription(otherRole, currentDesc)
        }
      }
      if (role === 'y') {
        self._yAttributeDescriptions.clear()
        if (desc && desc.attributeID !== '') {
          self._yAttributeDescriptions.push(desc)
        }
      } else if (role === 'rightNumeric') {
        this.setY2Attribute(desc)
      } else {
        self._setAttributeDescription(role, desc)
      }
      self._setAttribute(role, desc)
    },
    addYAttribute(desc: IAttributeDescriptionSnapshot) {
      self._yAttributeDescriptions.push(desc)
    },
    setY2Attribute(desc?: IAttributeDescriptionSnapshot) {
      self._setAttributeDescription('rightNumeric', desc)
      if (!desc?.attributeID) {
        self.setPointsNeedUpdating(true)
      } else {
        const existingFilteredCases = self.filteredCases?.[self.numberOfPlots - 1]
        existingFilteredCases?.invalidateCases()
      }
    },
    removeYAttributeWithID(id: string) {
      const index = self._yAttributeDescriptions.findIndex((aDesc) => aDesc.attributeID === id)
      if (index >= 0) {
        self._yAttributeDescriptions.splice(index, 1)
        // remove and destroy the filtered cases for the y attribute
        self.filteredCases?.splice(index, 1)
          .forEach(aFilteredCases => aFilteredCases.destroy())
        self.filteredCases?.forEach((aFilteredCases, casesArrayNumber) => {
          aFilteredCases.setCasesArrayNumber(casesArrayNumber)
        })
        self.setPointsNeedUpdating(true)
      }
    },
    setAttributeType(role: GraphAttrRole, type: AttributeType, plotNumber = 0) {
      if (role === 'y') {
        self._yAttributeDescriptions[plotNumber]?.setType(type)
      } else {
        self._attributeDescriptions.get(role)?.setType(type)
      }
      self._setAttributeType(role, type, plotNumber)
    },
  }))
  .actions(self => ({
    clearGraphSpecificCasesCache() {
      self.allPlottedCases.invalidate()
      self.subPlotCases.invalidateAll()
      self.rowCases.invalidateAll()
      self.columnCases.invalidateAll()
      self.cellCases.invalidateAll()
    }
  }))
  .actions(self => {
    const baseClearCasesCache = self.clearCasesCache
    return {
      clearCasesCache() {
        self.clearGraphSpecificCasesCache()
        baseClearCasesCache()
      }
    }
  })
  .actions(self => {
    const baseAfterCreate = self.afterCreate
    const baseRemoveAttributeFromRole = self.removeAttributeFromRole
    return {
      afterCreate() {
        // synchronize filteredCases with attribute configuration
        addDisposer(self, reaction(
          () => {
            const yAttributeDescriptions = getSnapshot(self._yAttributeDescriptions)
            const _y2AttributeDescription = self._attributeDescriptions.get("rightNumeric")
            const y2AttributeDescription = _y2AttributeDescription
                                              ? { y2AttributeDescription: getSnapshot(_y2AttributeDescription) }
                                              : undefined
            return { yAttributeDescriptions, ...y2AttributeDescription }
          },
          ({ yAttributeDescriptions, y2AttributeDescription }) => {
            const yAttrCount = yAttributeDescriptions.length + (y2AttributeDescription ? 1 : 0)
            const filteredCasesRequired = Math.max(1, yAttrCount)
            // remove any extraneous filteredCases
            while (self.filteredCases.length > filteredCasesRequired) {
              self.filteredCases.pop()?.destroy()
            }
            // add any required filteredCases
            while (self.filteredCases.length < filteredCasesRequired) {
              self._addNewFilteredCases()
            }
          }, { name: "GraphDataConfigurationModel yAttrDescriptions reaction", equals: comparer.structural }
        ))
        addDisposer(self, reaction(
          () => self.getAllCellKeys(),
          () => self.clearGraphSpecificCasesCache(),
          { name: "GraphDataConfigurationModel getCellKeys reaction", equals: comparer.structural }
        ))
        baseAfterCreate()
      },
      removeAttributeFromRole(role: GraphAttrRole, attrID: string) {
        if (role === "yPlus") {
          self.removeYAttributeWithID(attrID)
        }
        else {
          baseRemoveAttributeFromRole(role, attrID)
        }
      }
    }
  })

export interface IGraphDataConfigurationModel extends Instance<typeof GraphDataConfigurationModel> {
}

export interface IGraphDataConfigurationModelSnapshot extends SnapshotIn<typeof GraphDataConfigurationModel> {
}

export function isGraphDataConfigurationModel(model?: IDataConfigurationModel): model is IGraphDataConfigurationModel {
  return model?.type === kGraphDataConfigurationType
}
