import React from "react"
import { FormControl, Checkbox } from "@chakra-ui/react"
import { observer } from "mobx-react-lite"
import t from "../../../../utilities/translation/translate"
import { registerAdornmentComponentInfo } from "../adornment-component-info"
import { getAdornmentContentInfo, registerAdornmentContentInfo } from "../adornment-content-info"
import { ILSRLAdornmentModel, LSRLAdornmentModel } from "./lsrl-adornment-model"
import { kLSRLClass, kLSRLLabelKey, kLSRLPrefix, kLSRLRedoAddKey,
         kLSRLRedoRemoveKey, kLSRLType, kLSRLUndoAddKey,
         kLSRLUndoRemoveKey } from "./lsrl-adornment-types"
import { LSRLAdornment } from "./lsrl-adornment-component"
import { useGraphContentModelContext } from "../../hooks/use-graph-content-model-context"

const Controls = observer(() => {
  const graphModel = useGraphContentModelContext()
  const adornmentsStore = graphModel.adornmentsStore
  const existingAdornment = adornmentsStore.findAdornmentOfType<ILSRLAdornmentModel>(kLSRLType)

  const handleLSRLSetting = (checked: boolean) => {
    const existingLSRLAdornment = adornmentsStore.findAdornmentOfType<ILSRLAdornmentModel>(kLSRLType)
    const componentContentInfo = getAdornmentContentInfo(kLSRLType)
    const adornment = existingLSRLAdornment ?? componentContentInfo.modelClass.create() as ILSRLAdornmentModel
    const undoRedoKeys = {
      undoAdd: componentContentInfo.undoRedoKeys?.undoAdd,
      redoAdd: componentContentInfo.undoRedoKeys?.redoAdd,
      undoRemove: componentContentInfo.undoRedoKeys?.undoRemove,
      redoRemove: componentContentInfo.undoRedoKeys?.redoRemove
    }

    if (checked) {
      graphModel.applyUndoableAction(
        () => adornmentsStore.addAdornment(adornment, graphModel.getUpdateCategoriesOptions()),
        undoRedoKeys.undoAdd || "", undoRedoKeys.redoAdd || ""
      )
    } else {
      graphModel.applyUndoableAction(
        () => adornmentsStore.hideAdornment(adornment.type),
        undoRedoKeys.undoRemove || "", undoRedoKeys.redoRemove || ""
      )
    }
  }

  const handleShowConfidenceBandsSetting = (checked: boolean) => {
    existingAdornment?.setShowConfidenceBands(checked)
  }

  return (
    <>
      <FormControl>
        <Checkbox
          data-testid={`adornment-checkbox-${kLSRLClass}`}
          defaultChecked={existingAdornment?.isVisible}
          onChange={e => handleLSRLSetting(e.target.checked)}
        >
          {t(kLSRLLabelKey)}
        </Checkbox>
      </FormControl>
      <div
        className="sub-options show-confidence-bands"
        data-testid="adornment-show-confidence-bands-options"
      >
        <FormControl isDisabled={!existingAdornment?.isVisible}>
          <Checkbox
            data-testid={`adornment-checkbox-${kLSRLClass}-show-confidence-bands`}
            defaultChecked={existingAdornment?.showConfidenceBands}
            onChange={e => handleShowConfidenceBandsSetting(e.target.checked)}
          >
            {t("DG.Inspector.graphLSRLShowConfidenceBands")}
          </Checkbox>
        </FormControl>
      </div>
    </>
  )
})

registerAdornmentContentInfo({
  type: kLSRLType,
  plots: ['scatterPlot'],
  prefix: kLSRLPrefix,
  modelClass: LSRLAdornmentModel,
  undoRedoKeys: {
    undoAdd: kLSRLUndoAddKey,
    redoAdd: kLSRLRedoAddKey,
    undoRemove: kLSRLUndoRemoveKey,
    redoRemove: kLSRLRedoRemoveKey
  }
})

registerAdornmentComponentInfo({
  adornmentEltClass: kLSRLClass,
  Component: LSRLAdornment,
  Controls,
  labelKey: kLSRLLabelKey,
  order: 20,
  type: kLSRLType
})
