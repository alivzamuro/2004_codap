import {
  Button, FormControl, FormLabel, Input, ModalBody, ModalCloseButton, ModalFooter, ModalHeader,
  Textarea, Tooltip
} from "@chakra-ui/react"
import React, { useState } from "react"
import { CodapModal } from "../../codap-modal"
import t from "../../../utilities/translation/translate"
import { useDataSetContext } from "../../../hooks/use-data-set-context"

interface IProps {
  columnName: string
  isOpen: boolean
  onClose: () => void
}

export const EditFormulaModal = ({ columnName, isOpen, onClose }: IProps) => {
  const dataSet = useDataSetContext()
  const attribute = dataSet?.attrFromName(columnName)
  const [formula, setFormula] = useState("")

  const applyFormula = () => {
    attribute?.setDisplayFormula(formula)
    closeModal()
  }

  const closeModal = () => {
    onClose()
  }

  const handleFormulaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setFormula(e.target.value)

  const buttons = [{
    label: t("DG.AttrFormView.cancelBtnTitle"),
    tooltip: t("DG.AttrFormView.cancelBtnTooltip"),
    onClick: closeModal
  }, {
    label: t("DG.AttrFormView.applyBtnTitle"),
    onClick: applyFormula
  }]

  return (
    <CodapModal
      isOpen={isOpen}
      onClose={onClose}
      modalWidth={"350px"}
    >
      <ModalHeader h="30" className="codap-modal-header" fontSize="md" data-testid="codap-modal-header">
        <div className="codap-modal-icon-container" />
        <div className="codap-header-title" />
        <ModalCloseButton onClick={onClose} data-testid="modal-close-button" />
      </ModalHeader>
      <ModalBody>
        <FormControl display="flex" flexDirection="column">
          <FormLabel display="flex" flexDirection="row">{t("DG.AttrFormView.attrNamePrompt")}
            <Input size="xs" ml={5} placeholder="attribute" value={columnName} data-testid="attr-name-input" disabled />
          </FormLabel>
          <FormLabel>{t("DG.AttrFormView.formulaPrompt")}
            <Textarea size="xs" value={formula} onChange={handleFormulaChange}
              onKeyDown={(e) => e.stopPropagation()} data-testid="attr-formula-input" />
          </FormLabel>
        </FormControl>
      </ModalBody>
      <ModalFooter mt="-5">
        {
          buttons.map((b, idx) => (
            <Tooltip key={idx} label={b.tooltip} h="20px" fontSize="12px" color="white" openDelay={1000}
              placement="bottom" bottom="15px" left="15px" data-testid="modal-tooltip"
            >
              <Button size="xs" variant="ghost" ml="5" onClick={b.onClick} data-testid={`${b.label}-button`}>
                {b.label}
              </Button>
            </Tooltip>
          ))
        }
      </ModalFooter>
    </CodapModal>
  )
}
