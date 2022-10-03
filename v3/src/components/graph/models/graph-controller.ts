import React from "react"
import {scaleBand, scaleLinear, scaleOrdinal} from "d3"
import {IGraphModel} from "./graph-model"
import {GraphLayout} from "./graph-layout"
import {DataConfigurationModel, IAttributeDescriptionSnapshot, IDataConfigurationModel}
  from "./data-configuration-model"
import {IDataSet} from "../../../data-model/data-set"
import {
  AxisPlace,
  EmptyAxisModel,
  CategoricalAxisModel,
  ICategoricalAxisModel,
  INumericAxisModel,
  NumericAxisModel, axisPlaceToGraphAttrPlace
} from "./axis-model"
import {PlotType} from "../graphing-types"
import {matchCirclesToData, setNiceDomain} from "../utilities/graph_utils"

export interface IGraphControllerProps {
  graphModel: IGraphModel
  layout: GraphLayout
  dataset: IDataSet | undefined
  enableAnimation: React.MutableRefObject<boolean>
  instanceId: string
  dotsRef: React.RefObject<SVGSVGElement>
}

export class GraphController {
  graphModel: IGraphModel
  layout: GraphLayout
  dataset: IDataSet | undefined
  dataConfig: IDataConfigurationModel
  enableAnimation: React.MutableRefObject<boolean>
  instanceId: string
  dotsRef: React.RefObject<SVGSVGElement>


  constructor(props: IGraphControllerProps) {
    this.graphModel = props.graphModel
    this.layout = props.layout
    this.dataset = props.dataset
    this.dataConfig = DataConfigurationModel.create()
    this.instanceId = props.instanceId
    this.enableAnimation = props.enableAnimation
    this.dotsRef = props.dotsRef
    if (this.dataset) {
      this.dataConfig.setDataset(this.dataset)
    }
    // Presumably a new dataset is now being used. So we have to set things up for an empty graph
    this.initializeGraph()
  }

  initializeGraph() {
    const {graphModel, dataConfig, layout, dotsRef, enableAnimation, instanceId} = this
    graphModel.setGraphProperties({
      axes: {bottom: EmptyAxisModel.create({place: 'bottom'}), left: EmptyAxisModel.create({place: 'left'})},
      plotType: 'casePlot', config: this.dataConfig
    })
    if (dotsRef.current) {
      matchCirclesToData({
        caseIDs: dataConfig.cases, dotsElement: dotsRef.current,
        pointRadius: graphModel.getPointRadius(), enableAnimation, instanceId
      })
    }
    layout.setAxisScale('bottom', scaleOrdinal())
    layout.setAxisScale('left', scaleOrdinal())
  }

  handleAttributeAssignment(axisPlace: AxisPlace, attrID: string) {
    const {dataset, dataConfig, graphModel, layout} = this,
      attrPlace = axisPlaceToGraphAttrPlace(axisPlace),
      attribute = dataset?.attrFromID(attrID),
      attributeType = attribute?.type ?? 'empty',
      otherAxisPlace = axisPlace === 'bottom' ? 'left' : 'bottom',
      otherAttrPlace = axisPlaceToGraphAttrPlace(otherAxisPlace),
      otherAttrID = graphModel.getAttributeID(axisPlaceToGraphAttrPlace(otherAxisPlace)),
      otherAttribute = dataset?.attrFromID(otherAttrID),
      otherAttributeType = otherAttribute?.type ?? 'empty',
      axisModel = graphModel.getAxis(axisPlace),
      currentAxisType = axisModel?.type,
      plotChoices: Record<string, Record<string, PlotType>> = {
        empty: {empty: 'casePlot', numeric: 'dotPlot', categorical: 'dotChart'},
        numeric: {empty: 'dotPlot', numeric: 'scatterPlot', categorical: 'dotPlot'},
        categorical: {empty: 'dotChart', numeric: 'dotPlot', categorical: 'dotChart'}
      },
      graphAttributePlace = axisPlaceToGraphAttrPlace(axisPlace),
      attrSnapshot: IAttributeDescriptionSnapshot = {attributeID: attrID},
      primaryPlace = otherAttributeType === 'numeric' ? otherAttrPlace :
        attributeType === 'numeric' ? attrPlace :
          otherAttributeType !== 'empty' ? otherAttrPlace : attrPlace
    dataConfig.setPrimaryPlace(primaryPlace)
    dataConfig.setAttribute(graphAttributePlace, attrSnapshot)
    graphModel.setPlotType(plotChoices[attributeType][otherAttributeType])
    if (attributeType === 'numeric') {
      if (currentAxisType !== attributeType) {
        const newAxisModel = NumericAxisModel.create({place: axisPlace, min: 0, max: 1})
        graphModel.setAxis(axisPlace, newAxisModel as INumericAxisModel)
        layout.setAxisScale(axisPlace, scaleLinear())
        setNiceDomain(attribute?.numValues || [], newAxisModel)
      } else {
        setNiceDomain(attribute?.numValues || [], axisModel as INumericAxisModel)
      }
    } else if (attributeType === 'categorical') {
      const setOfValues = new Set(attribute?.strValues)
      setOfValues.delete('')  // To eliminate category for empty values
      const categories = Array.from(setOfValues)
      if (currentAxisType !== attributeType) {
        const newAxisModel = CategoricalAxisModel.create({place: axisPlace})
        graphModel.setAxis(axisPlace, newAxisModel as ICategoricalAxisModel)
        layout.setAxisScale(axisPlace, scaleBand())
      }
      layout.axisScale(axisPlace)?.domain(categories)
    }
  }

  setDotsRef(dotsRef: React.RefObject<SVGSVGElement>) {
    this.dotsRef = dotsRef
  }

}
