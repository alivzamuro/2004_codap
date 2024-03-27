import React from "react"
import {observer} from "mobx-react-lite"
import { Box, Flex, FormLabel, Input, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { t } from "../../../../utilities/translation/translate"
import { InspectorPalette } from "../../../inspector-panel"
import BarChartIcon from "../../../../assets/icons/icon-segmented-bar-chart.svg"
import { ITileModel } from "../../../../models/tiles/tile-model"
import { isGraphContentModel } from "../../models/graph-content-model"
import { isPointDisplayType } from "../../../data-display/data-display-types"

import "../../../data-display/inspector/inspector-panel.scss"

type BinOption = "binWidth" | "binAlignment"

interface IProps {
  tile?: ITileModel
  panelRect?: DOMRect
  buttonRect?: DOMRect
  setShowPalette: (palette: string | undefined) => void;
}
export const DisplayConfigPalette = observer(function DisplayConfigPanel(props: IProps) {
  const { buttonRect, panelRect, setShowPalette, tile } = props
  const graphModel = isGraphContentModel(tile?.content) ? tile?.content : undefined
  const selectedConfig = graphModel?.pointDisplayType

  const handleSelection = (configType: string) => {
    if (isPointDisplayType(configType)) {
      graphModel?.setPointConfig(configType)
    }
  }

  const setBinOption = (option: BinOption, value: number) => {
    switch (option) {
      case "binWidth":
        graphModel?.setBinWidth(value)
        break
      case "binAlignment":
        graphModel?.setBinAlignment(value)
        break
      default:
        break
    }
  }

  const handleBinOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, option: BinOption) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const value = Number((e.target as HTMLInputElement).value)
      setBinOption(option, value)
    }
  }

  const handleBinOptionBlur = (e: React.ChangeEvent<HTMLInputElement>, option: BinOption) => {
    const value = Number((e.target as HTMLInputElement).value)
    setBinOption(option, value)
  }

  return (
    <InspectorPalette
      title={t("DG.Inspector.configuration")}
      Icon={<BarChartIcon/>}
      setShowPalette={setShowPalette}
      panelRect={panelRect}
      buttonRect={buttonRect}
    >
      <Flex className="palette-form" direction="column">
        <RadioGroup defaultValue={selectedConfig}>
          <Stack>
            <Radio
              size="md"
              value="points"
              data-testid="points-radio-button"
              onChange={(e) => handleSelection(e.target.value)}
            >
              {t("DG.Inspector.graphPlotPoints")}
            </Radio>
            <Radio
              size="md"
              value="bins"
              data-testid="bins-radio-button"
              onChange={(e) => handleSelection(e.target.value)}
            >
              {t("DG.Inspector.graphGroupIntoBins")}
            </Radio>
            <Radio
              size="md"
              value="bars"
              data-testid="bars-radio-button"
              onChange={(e) => handleSelection(e.target.value)}
            >
              {t("DG.Inspector.graphBarForEachPoint")}
            </Radio>
          </Stack>
        </RadioGroup>
        {selectedConfig === "bins" && (
          <Stack>
            <Box className="inline-input-group" data-testid="graph-bin-width-setting">
              <FormLabel className="form-label">
                {t("DG.Inspector.graphBinWidth")}
              </FormLabel>
              {/* TODO: Make it so this field updates instantly to the appropriate value if the user-entered
                  value would result in a pixel width for bins that's smaller than the minimum allowed pixel
                  width. Currently, enforcing of the min pixel width is handled by the enforceMinBinPixelWidth
                  useEffect in BinnedDotPlotDots. */}
              <Input
                className="form-input"
                type="number"
                defaultValue={graphModel?.binWidth}
                onBlur={(e) => handleBinOptionBlur(e, "binWidth")}
                onKeyDown={(e) => handleBinOptionKeyDown(e, "binWidth")}
              />
            </Box>
            <Box className="inline-input-group" data-testid="graph-bin-alignment-setting">
              <FormLabel className="form-label">
                {t("DG.Inspector.graphAlignment")}
              </FormLabel>
              <Input
                className="form-input"
                type="number"
                defaultValue={graphModel?.binAlignment}
                onBlur={(e) => handleBinOptionBlur(e, "binAlignment")}
                onKeyDown={(e) => handleBinOptionKeyDown(e, "binAlignment")}
              />
            </Box>
          </Stack>       
        )}
      </Flex>
    </InspectorPalette>
  )
})
