import { Instance, types } from "mobx-state-tree"
import { AdornmentModel, IAdornmentModel } from "../adornment-models"
import { kCountType } from "./count-adornment-types"
import { IDataConfigurationModel } from "../../../data-display/models/data-configuration-model"
import { withUndoRedoStrings } from "../../../../models/history/codap-undo-types"

export const CountAdornmentModel = AdornmentModel
  .named("CountAdornmentModel")
  .props({
    type: types.optional(types.literal(kCountType), kCountType),
    showCount: false,
    showPercent: false,
    percentType: types.optional(types.enumeration(["cell", "column", "row"]), "cell"),
  })
  .views(self => ({
    percentValue(casesInPlot: number, cellKey: Record<string, string>, dataConfig?: IDataConfigurationModel) {
      const divisor = self.percentType === "row"
        ? dataConfig?.rowCases(cellKey)?.length ?? 0
        : self.percentType === "column"
          ? dataConfig?.columnCases(cellKey)?.length ?? 0
          : dataConfig?.cellCases(cellKey)?.length ?? 0
      const percentValue = casesInPlot / divisor
      return isFinite(percentValue) ? percentValue : 0
    }
  }))
  .actions(self => ({
    setShowCount(showCount: boolean) {
      self.showCount = showCount
      self.isVisible = self.showCount || self.showPercent
      const undoString = showCount ? "DG.Undo.graph.showCount" : "DG.Undo.graph.hideCount"
      const redoString = showCount ? "DG.Redo.graph.showCount" : "DG.Redo.graph.hideCount"
      withUndoRedoStrings(undoString, redoString)
    },
    setShowPercent(showPercent: boolean) {
      self.showPercent = showPercent
      self.isVisible = self.showCount || self.showPercent
      const undoString = showPercent ? "DG.Undo.graph.showPercent" : "DG.Undo.graph.hidePercent"
      const redoString = showPercent ? "DG.Redo.graph.showPercent" : "DG.Redo.graph.hidePercent"
      withUndoRedoStrings(undoString, redoString)
    },
    setPercentType(percentType: string) {
      self.percentType = percentType
    }
  }))

export interface ICountAdornmentModel extends Instance<typeof CountAdornmentModel> {}
export function isCountAdornment(adornment: IAdornmentModel): adornment is ICountAdornmentModel {
  return adornment.type === kCountType
}
