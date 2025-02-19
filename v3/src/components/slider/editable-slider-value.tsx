import {NumberInput, NumberInputField} from "@chakra-ui/react"
import { autorun } from "mobx"
import {observer} from "mobx-react-lite"
import { isAlive } from "mobx-state-tree"
import React, {useState, useEffect} from "react"
import {MultiScale} from "../axis/models/multi-scale"
import {ISliderModel} from "./slider-model"
import { valueChangeNotification } from "./slider-utils"
import { logMessageWithReplacement } from "../../lib/log-message"

import './slider.scss'

interface IProps {
  sliderModel: ISliderModel
  multiScale: MultiScale
}

export const EditableSliderValue = observer(function EditableSliderValue({ sliderModel, multiScale}: IProps) {
  const [candidate, setCandidate] = useState("")

  useEffect(() => {
    return autorun(() => {
      if (!isAlive(sliderModel)) return
      // trigger update on domain change
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const domain = sliderModel.domain
      setCandidate(multiScale.formatValueForScale(sliderModel.value))
    })
  }, [multiScale, sliderModel])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const {key} = e
    if (key === "Escape" || key === "Enter") {
      e.currentTarget.blur()
    }
  }

  const handleValueChange = (value: string) => {
    setCandidate(value)
  }

  const handleSubmitValue = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value)
    if (isFinite(inputValue)) {
      sliderModel.applyModelChange(
        () => {
          sliderModel.encompassValue(inputValue)
          sliderModel.setValue(inputValue)
        },
        {
          notify: () => valueChangeNotification(sliderModel.value, sliderModel.name),
          undoStringKey: "DG.Undo.slider.change",
          redoStringKey: "DG.Redo.slider.change",
          log: logMessageWithReplacement("sliderEdit: { expression: %@ = %@ }",
               {name: sliderModel.name, value: inputValue})
        }
      )
    }
  }

  return (
    <NumberInput value={candidate} className="value-input"
        onChange={handleValueChange} data-testid="slider-variable-value">
      <NumberInputField className="value-text-input text-input"
        data-testid="slider-variable-value-text-input" maxLength={15}
        onKeyDown={handleKeyDown} onBlur={handleSubmitValue} />
    </NumberInput>
  )
})
