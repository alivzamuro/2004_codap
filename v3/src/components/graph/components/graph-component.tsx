import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { useMemo } from "use-memo-one"
import { DataBroker } from "../../../data-model/data-broker"
import { DataSetContext } from "../../../hooks/use-data-set-context"
import { InstanceIdContext, useNextInstanceId } from "../../../hooks/use-instance-id-context"
import { MovableLineModel, MovableValueModel } from "../adornments/adornment-models"
import { NumericAxisModel } from "../models/axis-model"
import { GraphLayout, GraphLayoutContext } from "../models/graph-layout"
import { GraphModel } from "../models/graph-model"
import { Graph } from "./graph"

const defaultGraphModel = GraphModel.create({
  axes: {
    bottom: NumericAxisModel.create({place: 'bottom', min: 0, max: 10}),
    left: NumericAxisModel.create({place: 'left', min: 0, max: 10})
  },
  movableValue: MovableValueModel.create({value: 0}),
  movableLine: MovableLineModel.create({intercept: 0, slope: 1})
})

interface IProps {
  broker?: DataBroker;
}
export const GraphComponent = observer(({ broker }: IProps) => {
  const instanceId = useNextInstanceId("graph")
  const layout = useMemo(() => new GraphLayout(), [])
  const { width, height, ref: graphRef } = useResizeDetector({ refreshMode: "debounce", refreshRate: 200 })

  useEffect(() => {
    (width != null) && (height != null) && layout.setGraphExtent(width, height)
  }, [width, height, layout])

  return (
    <DataSetContext.Provider value={broker?.last}>
      <InstanceIdContext.Provider value={instanceId}>
        <GraphLayoutContext.Provider value={layout}>
          <Graph model={defaultGraphModel} graphRef={graphRef}/>
        </GraphLayoutContext.Provider>
      </InstanceIdContext.Provider>
    </DataSetContext.Provider>
  )
})
