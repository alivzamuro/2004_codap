import {useEffect} from "react"
import {comparer, reaction} from "mobx"
import {isAlive} from "mobx-state-tree"
import {onAnyAction} from "../../../utilities/mst-utils"
import {mstAutorun} from "../../../utilities/mst-autorun"
import {mstReaction} from "../../../utilities/mst-reaction"
import {useDebouncedCallback} from "use-debounce"
import {isSetCaseValuesAction} from "../../../models/data/data-set-actions"
import {GraphAttrRoles} from "../../data-display/data-display-types"
import {matchCirclesToData} from "../../data-display/data-display-utils"
import {useGraphContentModelContext} from "./use-graph-content-model-context"
import {useGraphLayoutContext} from "./use-graph-layout-context"
import {IAxisModel} from "../../axis/models/axis-model"
import {useInstanceIdContext} from "../../../hooks/use-instance-id-context"
import { PixiPointEventHandler, PixiPoints } from "../../data-display/pixi/pixi-points"

export interface IPixiDragHandlers {
  start: PixiPointEventHandler
  drag: PixiPointEventHandler
  end: PixiPointEventHandler
}

export const usePixiDragHandlers = (pixiPoints: PixiPoints | undefined, {start, drag, end}: IPixiDragHandlers) => {
  useEffect(() => {
    if (pixiPoints) {
      pixiPoints.onPointDragStart = start
      pixiPoints.onPointDrag = drag
      pixiPoints.onPointDragEnd = end
      // On cleanup, remove event listeners
      return () => {
        pixiPoints.onPointDragStart = undefined
        pixiPoints.onPointDrag = undefined
        pixiPoints.onPointDragEnd = undefined
      }
    }
  }, [pixiPoints, start, drag, end])
}

export interface IPlotResponderProps {
  refreshPointPositions: (selectedOnly: boolean) => void
  refreshPointSelection: () => void
  pixiPoints?: PixiPoints
}

function isDefunctAxisModel(axisModel?: IAxisModel) {
  return axisModel && !isAlive(axisModel)
}

export const usePlotResponders = (props: IPlotResponderProps) => {
  const { refreshPointPositions, refreshPointSelection, pixiPoints} = props,
    graphModel = useGraphContentModelContext(),
    startAnimation = graphModel.startAnimation,
    layout = useGraphLayoutContext(),
    dataConfiguration = graphModel.dataConfiguration,
    dataset = dataConfiguration?.dataset,
    instanceId = useInstanceIdContext()

  const callRefreshPointPositions = useDebouncedCallback((selectedOnly: boolean) => {
    refreshPointPositions(selectedOnly)
  })

  // respond to numeric axis domain changes (e.g. axis dragging)
  useEffect(() => {
    return mstReaction(
      () => {
        const xNumeric = graphModel.getNumericAxis('bottom')
        const yNumeric = graphModel.getNumericAxis('left')
        const v2Numeric = graphModel.getNumericAxis('rightNumeric')
        if (isDefunctAxisModel(xNumeric) || isDefunctAxisModel(yNumeric) || isDefunctAxisModel(v2Numeric)) {
          console.warn("usePlot numeric domains reaction skipped for defunct axis model(s)")
          return
        }
        const {domain: xDomain} = xNumeric || {}
        const {domain: yDomain} = yNumeric || {}
        const {domain: v2Domain} = v2Numeric || {}
        return [xDomain, yDomain, v2Domain]
      },
      () => {
        callRefreshPointPositions(false)
      }, {name: "usePlot [numeric domains]", fireImmediately: true}, graphModel
    )
  }, [callRefreshPointPositions, graphModel])

  useEffect(function respondToCategorySetChanges() {
    return reaction(() => {
      return layout.categorySetArrays
    }, (categorySetsArrays) => {
      if (categorySetsArrays.length) {
        startAnimation()
        callRefreshPointPositions(false)
      }
    }, {name: "usePlot.respondToCategorySetChanges"})
  }, [callRefreshPointPositions, layout.categorySetArrays, startAnimation])

  // respond to attribute assignment changes
  useEffect(() => {
    const disposer = mstReaction(
      () => GraphAttrRoles.map((aRole) => dataConfiguration?.attributeID(aRole)),
      () => {
        // if plot is not univariate and the attribute type changes, we need to update the pointConfig
        if (graphModel?.plotType !== "dotPlot" && !graphModel?.pointsFusedIntoBars) {
          graphModel?.setPointConfig("points")
        // if the attribute change results in a univariate plot, make sure points are only fused into bars
        // if the pointDisplayType is histogram
        } else if (graphModel?.plotType === "dotPlot" && graphModel?.pointDisplayType !== "histogram") {
          graphModel?.setPointsFusedIntoBars(false)
        }
        // If points are fused into bars and a secondary attribute is added or the primary attribute is removed,
        // unfuse the points. Otherwise, if a primary attribute exists, make sure the bar graph's count axis gets
        // updated.
        const { primaryRole } = dataConfiguration
        const primaryAttrID = primaryRole && dataConfiguration.attributeID(primaryRole)
        const secondaryRole = primaryRole === "x" ? "y" : "x"
        const secondaryAttrID = dataConfiguration.attributeID(secondaryRole)
        if (graphModel.pointsFusedIntoBars) {
          if (secondaryAttrID || !primaryAttrID) {
            graphModel.setPointsFusedIntoBars(false)
          } else if (primaryAttrID) {
            graphModel.setBarCountAxis()
          }
        }
        startAnimation()
        callRefreshPointPositions(false)
      }, {name: "usePlot [attribute assignment]"}, dataConfiguration
    )
    return () => disposer()
  }, [callRefreshPointPositions, dataConfiguration, graphModel, startAnimation])

  useEffect(function respondToHiddenCasesChange() {
    const disposer = mstReaction(
      () => [dataConfiguration?.dataset?.itemIds.length, dataConfiguration?.hiddenCases.length],
      () => {
        if (!pixiPoints) {
          return
        }
        matchCirclesToData({
          dataConfiguration,
          pointRadius: graphModel.getPointRadius(),
          pointColor: graphModel.pointDescription.pointColor,
          pointDisplayType: graphModel.pointDisplayType,
          pointStrokeColor: graphModel.pointDescription.pointStrokeColor,
          pixiPoints,
          startAnimation, instanceId
        })
        callRefreshPointPositions(false)
      }, {name: "respondToHiddenCasesChange", equals: comparer.structural}, dataConfiguration
    )
    return () => disposer()
  }, [callRefreshPointPositions, dataConfiguration, graphModel, instanceId, pixiPoints, startAnimation])

  // respond to axis range changes (e.g. component resizing)
  useEffect(() => {
    const disposer = reaction(
      () => [layout.getAxisLength('left'), layout.getAxisLength('bottom')],
      () => {
        callRefreshPointPositions(false)
      }, {name: "usePlot [axis range]"}
    )
    return () => disposer()
  }, [layout, callRefreshPointPositions])

  // respond to selection changes
  useEffect(function respondToSelectionChanges() {
    if (dataset) {
      return mstReaction(
        () => dataset?.selectionChanges,
        () => {
          // If there are hidden cases in the graph that are then selected in a different tile, remove them from
          // the hiddenCases array and make sure their positions are set.
          if (dataConfiguration.displayOnlySelectedCases && dataConfiguration?.hiddenCases.length > 0) {
            const selectedCases = Array.from(dataset.selection)
            const allCases = dataset.items.map(c => c.__id__)
            const updatedHiddenCases = allCases.filter(caseID => !selectedCases.includes(caseID))
            dataConfiguration?.setHiddenCases(updatedHiddenCases)
            pixiPoints && matchCirclesToData({
              dataConfiguration,
              pointRadius: graphModel.getPointRadius(),
              pointColor: graphModel.pointDescription.pointColor,
              pointDisplayType: graphModel.pointDisplayType,
              pointStrokeColor: graphModel.pointDescription.pointStrokeColor,
              pixiPoints,
              startAnimation, instanceId
            })
            callRefreshPointPositions(false)
          }
          refreshPointSelection()
        },
        {name: "useSubAxis.respondToSelectionChanges"}, dataConfiguration
      )
    }
  }, [callRefreshPointPositions, dataConfiguration, dataset, graphModel, instanceId, pixiPoints,
      refreshPointSelection, startAnimation])

  // respond to value changes
  useEffect(() => {
    if (dataset) {
      const disposer = onAnyAction(dataset, action => {
        if (isSetCaseValuesAction(action)) {
          // assumes that if we're caching then only selected cases are being updated
          callRefreshPointPositions(dataset.isCaching())
          // TODO: handling of add/remove cases was added specifically for the case plot.
          // Bill has expressed a desire to refactor the case plot to behave more like the
          // other plots, which already handle removal of cases (and perhaps addition of cases?)
          // without this. Should check to see whether this is necessary down the road.
        } else if (["addCases", "removeCases"].includes(action.name)) {
          callRefreshPointPositions(false)
        }
      })
      return () => disposer()
    }
  }, [dataset, callRefreshPointPositions])

  // respond to added or removed cases or change in attribute type or change in collection groups
  useEffect(function handleDataConfigurationActions() {
    const disposer = dataConfiguration?.onAction(action => {
      if (!pixiPoints) {
        return
      }
      if (['addCases', 'removeCases', 'setAttributeType', 'invalidateCollectionGroups'].includes(action.name)) {
        // there  are no longer any cases in the dataset, or if plot is not univariate and the attribute type changes,
        // we need to set the pointConfig to points
        const caseDataArray = dataConfiguration?.caseDataArray ?? []
        if (caseDataArray.length === 0 || graphModel?.plotType !== "dotPlot") {
          graphModel?.setPointConfig("points")
        }

        matchCirclesToData({
          dataConfiguration,
          pointRadius: graphModel.getPointRadius(),
          pointColor: graphModel.pointDescription.pointColor,
          pointDisplayType: graphModel.pointDisplayType,
          pointStrokeColor: graphModel.pointDescription.pointStrokeColor,
          pixiPoints,
          startAnimation, instanceId
        })
        callRefreshPointPositions(false)
      }
    }) || (() => true)
    return () => disposer()
  }, [dataset, dataConfiguration, startAnimation, graphModel, callRefreshPointPositions, instanceId, pixiPoints])

  // respond to pointDisplayType changes
  useEffect(function respondToPointConfigChange() {
    return mstReaction(
      () => graphModel.pointDisplayType,
      () => {
        if (!pixiPoints) return

        matchCirclesToData({
          dataConfiguration,
          pointRadius: graphModel.getPointRadius(),
          pointColor: graphModel.pointDescription.pointColor,
          pointDisplayType: graphModel.pointDisplayType,
          pointStrokeColor: graphModel.pointDescription.pointStrokeColor,
          pixiPoints,
          startAnimation, instanceId
        })
        callRefreshPointPositions(false)
      }, {name: "usePlot [pointDisplayType]"}, graphModel
    )
  }, [callRefreshPointPositions, dataConfiguration, graphModel, instanceId, pixiPoints, startAnimation])

  // respond to pointsNeedUpdating becoming false; that is when the points have been updated
  // Happens when the number of plots has changed for now. Possibly other situations in the future.
  useEffect(() => {
    return mstAutorun(
      () => {
        !graphModel.dataConfiguration.pointsNeedUpdating && callRefreshPointPositions(false)
      }, {name: "usePlot [callRefreshPointPositions]"}, graphModel)
  }, [graphModel, callRefreshPointPositions])
}
