import React, {useCallback, useEffect, useRef} from "react"
import {select} from "d3"
import {AttributeType} from "../../../../models/data/attribute"
import {IDataSet} from "../../../../models/data/data-set"
import {axisGap} from "../../../axis/axis-types"
import {GraphPlace} from "../../../axis-graph-shared"
import {getStringBounds} from "../../../axis/axis-utils"
import {useDataConfigurationContext} from "../../hooks/use-data-configuration-context"
import {AttributeLabel} from "../attribute-label"

import vars from "../../../vars.scss"

interface IAttributeLabelProps {
  onChangeAttribute?: (place: GraphPlace, dataSet: IDataSet, attrId: string) => void
}

export const LegendAttributeLabel =
  function LegendAttributeLabel({ onChangeAttribute }: IAttributeLabelProps) {
    const dataConfiguration = useDataConfigurationContext(),
      labelRef = useRef<SVGGElement>(null),
      className = 'attribute-label'

    const refreshLegendTitle = useCallback(() => {
      const dataset = dataConfiguration?.dataset,
        attributeID = dataConfiguration?.attributeID('legend'),
        attributeName = (attributeID ? dataset?.attrFromID(attributeID)?.name : '') ?? '',
        labelFont = vars.labelFont,
        labelBounds = getStringBounds(attributeName, labelFont),
        tX = axisGap,
        tY = labelBounds.height / 2 + axisGap
      select(labelRef.current)
        .selectAll(`text.${className}`)
        .data([1])
        .join(
          enter => enter,
          (update) =>
            update
              .attr('class', className)
              .attr('data-testid', className)
              .attr('x', tX)
              .attr('y', tY)
              .text(attributeName)
        )
    }, [dataConfiguration])

    const handleRemoveAttribute = useCallback(() => {
      dataConfiguration?.applyUndoableAction(
        () => dataConfiguration.setAttribute('legend', {attributeID: ''}),
        {
          undoStringKey: "V3.Undo.legendAttributeRemove",
          redoStringKey: "V3.Redo.legendAttributeRemove"
        }
      )
    }, [dataConfiguration])

    const handleTreatAttributeAs = useCallback((_place: GraphPlace, _attrId: string, treatAs: AttributeType) => {
      dataConfiguration?.applyUndoableAction(
        () => dataConfiguration.setAttributeType('legend', treatAs),
        {
          undoStringKey: "V3.Undo.attributeTreatAs",
          redoStringKey: "V3.Redo.attributeTreatAs"
        }
      )
    }, [dataConfiguration])

    useEffect(function setupTitle() {

      const removeUnusedLabel = () => {
        select(labelRef.current)
          .selectAll(`text.${className}`)
          .remove()
      }

      if (labelRef) {
        removeUnusedLabel()
        select(labelRef.current)
          .selectAll(`text.${className}`)
          .data([1])
          .join(
            (enter) =>
              enter.append('text')
                .attr('class', className)
                .attr('text-anchor', 'start')
                .attr('data-testid', className)
          )
        refreshLegendTitle()
      }
    }, [labelRef, refreshLegendTitle])

    return dataConfiguration && (
      <AttributeLabel
        ref={labelRef}
        place={'legend'}
        refreshLabel={refreshLegendTitle}
        onChangeAttribute={onChangeAttribute}
        onRemoveAttribute={handleRemoveAttribute}
        onTreatAttributeAs={handleTreatAttributeAs}
      />
    )
  }
