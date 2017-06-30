// ==========================================================================
//                              DG Strings
//
//  Copyright (c) 2014 by The Concord Consortium, Inc. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// ==========================================================================

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//
SC.stringsFor('English', {

  // CFM/File menu
  'DG.fileMenu.menuItem.newDocument': "新增",
  'DG.fileMenu.menuItem.openDocument': "開啟...",
  'DG.fileMenu.menuItem.closeDocument': "關閉",
  'DG.fileMenu.menuItem.importFile': "匯入...",
  'DG.fileMenu.menuItem.revertTo': "復原...",
    'DG.fileMenu.menuItem.revertToOpened': "回到開啟的狀態",
    'DG.fileMenu.menuItem.revertToShared': "分享文件",
  'DG.fileMenu.menuItem.saveDocument': "儲存...",
  'DG.fileMenu.menuItem.copyDocument': "建立複本",
  'DG.fileMenu.menuItem.share': "分享...",
    'DG.fileMenu.menuItem.shareGetLink': "取得文件連結",
    'DG.fileMenu.menuItem.shareUpdate': "更新文件內容",
  'DG.fileMenu.menuItem.renameDocument': "重新命名",

  // main.js
  'DG.main.userEntryView.title': "選擇想要的動作？",
  'DG.main.userEntryView.openDocument': "開啟檔案或範例",
  'DG.main.userEntryView.newDocument': "建立新檔案",

  // mainPage.js
  'DG.mainPage.mainPane.undoButton.title': "上一步",
  'DG.mainPage.mainPane.undoButton.toolTip': "回復上一個動作",
  'DG.mainPage.mainPane.redoButton.title': "下一步",
  'DG.mainPage.mainPane.redoButton.toolTip': "重做最後的動作",
  'DG.mainPage.mainPane.versionString': "Version %@ (%@)", // DG.VERSION, DG.BUILD_NUM
  'DG.mainPage.mainPane.messageView.value': "DG不支援您的瀏覽器 " +
  "DG 支援的瀏覽器有 Internet Explorer 9+, Firefox 3.6+, Chrome 10+, Safari 4+. " +
  "DG 不支援其他瀏覽器",
  'DG.mainPage.titleBar.saved': '文件已儲存!',

  // IS_BUILD variants of strings for InquirySpace
  'DG.mainPage.mainPane.versionString.IS_BUILD': "Version %@ (%@ IS)", // Add suffix to version to identify SRRI's subsequent modifications .srri0, .srri1, .srri2 etc.

  // DG.IS_SRRI_BUILD variants of strings for SRRI build
  'DG.mainPage.mainPane.versionString.SRRI_BUILD': "Version %@ (%@.srri10)", // Add suffix to version to identify SRRI's subsequent modifications .srri0, .srri1, .srri2 etc.

  // DG.AppController
  'DG.AppController.resetData.title' : "清除資料...",
  'DG.AppController.resetData.toolTip' : "刪除目前檔案的所有資料",
  'DG.AppController.resetData.warnMessage' : "你確定要刪除目前檔案的所有資料?",
  'DG.AppController.resetData.warnDescription' : "此動作無法復原",
  'DG.AppController.resetData.okButtonTitle' : "確定，刪除資料",
  'DG.AppController.resetData.cancelButtonTitle' : "取消，保留資料",
  'DG.AppController.closeDocument.warnMessage' : "關閉目前為保存的文件?",
  'DG.AppController.closeDocument.warnDescription' : "此動作無法復原",
  'DG.AppController.closeDocument.okButtonTitle' : "關閉",
  'DG.AppController.closeDocument.cancelButtonTitle' : "取消",
  'DG.AppController.beforeUnload.confirmationMessage' : "本文件包含未保存的更改",
  'DG.AppController.optionMenuItems.reportProblem' : "傳送意見...",
  'DG.AppController.optionMenuItems.viewWebPage' : "顯示網頁...",
  'DG.AppController.optionMenuItems.configureGuide' : "設置說明...",
  'DG.AppController.optionMenuItems.about' : "關於 CODAP...",
  'DG.AppController.optionMenuItems.releaseNotes' : "最新消息",
  'DG.AppController.optionMenuItems.help' : "幫助...",
  'DG.AppController.optionMenuItems.toWebSite' : "CODAP 首頁",
  'DG.AppController.exportDocument.prompt' : "檔案名稱:",
  'DG.AppController.exportCaseData.prompt' : "匯出檔案, 從:",
  'DG.AppController.exportDocument.exportTitle' : "匯出",
  'DG.AppController.exportDocument.exportTooltip' : "將資料匯出成文件",
  'DG.AppController.exportDocument.cancelTitle' : "取消",
  'DG.AppController.exportDocument.cancelTooltip' : "取消匯出",
  'DG.AppController.feedbackDialog.dialogTitle' : "提供意見",
  'DG.AppController.feedbackDialog.subHeaderText' : "您的意見對我們來說很重要!",
  'DG.AppController.feedbackDialog.messageText' : "任何問題、錯誤或功能要求都非常歡迎您提出，以協助我們改進，感謝!",
  'DG.AppController.feedbackDialog.subjectHint' : "您的意見是",
  'DG.AppController.feedbackDialog.feedbackHint' : "細節",
  'DG.AppController.feedbackDialog.submitFeedbackButton' : "送出",
  'DG.AppController.feedbackDialog.cancelFeedbackButton' : "取消",
  'DG.AppController.showWebSiteTitle' : '關於 CODAP',
  'DG.AppController.showHelpTitle' : '幫助 CODAP',
  'DG.AppController.showAboutTitle' : '關於 CODAP',
  'DG.AppController.showReleaseNotesTitle' : 'CODAP說明',
  'DG.AppController.dropFile.error' : '錯誤: %@1',  // Error: <error text>
  'DG.AppController.dropFile.unknownFileType' : '您無法匯入拖曳的檔案',
  'DG.AppController.validateDocument.missingRequiredProperty' : '找不到所需要的變項: %@1',
  'DG.AppController.validateDocument.unexpectedProperty' : '未預期的高層變項: %@1',
  'DG.AppController.validateDocument.unresolvedID' : '未解決的id: %@1',
  'DG.AppController.validateDocument.parseError' : '文件解析錯誤: %@1',
  'DG.AppController.validateDocument.invalidDocument' : '無效的JSON文件: %@1',
  'DG.AppController.openDocument.error.general': '無法開啟文件',
  'DG.AppController.openDocument.error.invalid_format': 'CODAP 無法讀取此類文件',
  'DG.AppController.createDataSet.initialAttribute': '變項', /* RETRANSLATE: Attribute --retranslated */
  'DG.AppController.createDataSet.name': '新數據集', /* RETRANSLATE: New Dataset --retranslated */
  'DG.AppController.createDataSet.collectionName': '數據', /* TRANSLATE: Cases --retranslated */
  'DG.AppController.caseTableMenu.newDataSet': '-- 新 --', /* -- new -- --retranslated */

  'DG.SingleTextDialog.okButton.title': "確認",
  'DG.SingleTextDialog.cancelButton.title': "取消",
  'DG.SingleTextDialog.cancelButton.toolTip': "關閉對話框而不進行任何更改",  // TRANSLATE: "Dismiss the dialog without making any changes --retranslated"

  // DG.DocumentController
  'DG.DocumentController.calculatorTitle': "計算機",
  'DG.DocumentController.caseTableTitle': "表格",
  'DG.DocumentController.graphTitle': "圖表",
  'DG.DocumentController.sliderTitle': "滑桿",
  'DG.DocumentController.textTitle': "文字",
  'DG.DocumentController.mapTitle': "地圖",
  'DG.DocumentController.enterURLPrompt': "輸入顯示網頁的網址",
  'DG.DocumentController.enterViewWebPageOKTip': "顯示網址所提供的網頁",

  // DG.Document
  'DG.Document.defaultDocumentName': "未命名文件",
  'DG.Document.documentName.toolTip': "點選編輯文件名稱",   // "Click to edit document name"

  // DG.SliderView
  'DG.SliderView.thumbView.toolTip': "拖曳以更改滑桿的值",
  'DG.SliderView.startButton.toolTip': "開始/停止 動畫",

  // DG.ToolButtonData
  'DG.ToolButtonData.tableButton.title': "表格",
  'DG.ToolButtonData.tableButton.toolTip': "製作一個表格(ctrl-alt-t)",
  'DG.ToolButtonData.graphButton.title': "圖表",
  'DG.ToolButtonData.graphButton.toolTip': "製作一張圖表 (ctrl-alt-g)",
  'DG.ToolButtonData.sliderButton.title': "滑桿",
  'DG.ToolButtonData.sliderButton.toolTip': "製作一個滑桿 (ctrl-alt-s)",
  'DG.ToolButtonData.calcButton.title': "計算機",
  'DG.ToolButtonData.calcButton.toolTip': "打開/關閉計算機 (ctrl-alt-c)",
  'DG.ToolButtonData.textButton.title': "文字",
  'DG.ToolButtonData.textButton.toolTip': "製作一個文字物件 (ctrl-alt-shift-t)",
  'DG.ToolButtonData.mapButton.title': "地圖",
  'DG.ToolButtonData.mapButton.toolTip': "製作一張地圖",
  'DG.ToolButtonData.optionMenu.title': "選項",
  'DG.ToolButtonData.optionMenu.toolTip': "顯示網頁, 設置說明...",
  'DG.ToolButtonData.tileListMenu.title': "清單",
  'DG.ToolButtonData.tileListMenu.toolTip': "顯示本文件中的物件清單",
  'DG.ToolButtonData.guideMenu.title': "說明",
  'DG.ToolButtonData.guideMenu.toolTip': "顯示活動說明與操作說明",
  'DG.ToolButtonData.guideMenu.showGuide': "顯示說明",
  'DG.ToolButtonData.help.title': "幫助",
  'DG.ToolButtonData.help.toolTip': "CODAP幫助, 學習關於CODAP物件",

  'DG.Slider.multiples': "Restrict to Multiples of:(zh)",  // TRANSLATE: "Restrict to Multiples of:"
  'DG.Slider.maxPerSecond': "Maximum Animation Frames/sec:(zh)",  // TRANSLATE: "Maximum Animation Frames/sec:"
  'DG.Slider.direction': "動畫方向:",  // Direction
  'DG.Slider.backAndForth': "倒退和前進",   // Back and Forth
  'DG.Slider.lowToHigh': "低到高",   // Low to High
  'DG.Slider.highToLow': "高到低",   // High to Low
  'DG.Slider.mode': "動畫重複:",   // Animation Repetition:
  'DG.Slider.nonStop': "不停止",   // Non-Stop
  'DG.Slider.onceOnly': "一次",   // Once Only

  // Undo / Redo
  'DG.Undo.exceptionOccurred': "回到上一步時發生錯誤.",
  'DG.Redo.exceptionOccurred': "回到下一步時發生錯誤.",
  'DG.Undo.componentMove': "回復移動物件",
  'DG.Redo.componentMove': "重做移動物件",
  'DG.Undo.componentResize': "回復調整大小",
  'DG.Redo.componentResize': "重做調整大小",
  'DG.Undo.axisDilate': "回復軸的調整",
  'DG.Redo.axisDilate': "重做軸的調整",
  'DG.Undo.axisRescaleFromData': "回復軸的調整",
  'DG.Redo.axisRescaleFromData': "重做軸的調整",
  'DG.Undo.axisDrag': "回復軸的拖曳",
  'DG.Redo.axisDrag': "重做軸的拖曳",
  'DG.Undo.axisAttributeChange': "回復更改軸的變項",
  'DG.Redo.axisAttributeChange': "重做更改軸的變項",
  'DG.Undo.axisAttributeAdded': "回復增加軸的變項",
  'DG.Redo.axisAttributeAdded': "重做增加軸的變項",
  'DG.Undo.toggleComponent.add.calcView': "回復顯示計算機",
  'DG.Redo.toggleComponent.add.calcView': "重做顯示計算機",
  'DG.Undo.toggleComponent.delete.calcView': "回復隱藏計算機",
  'DG.Redo.toggleComponent.delete.calcView': "重做隱藏計算機",
  'DG.Undo.caseTable.open': "回復顯示表格",
  'DG.Redo.caseTable.open': "重做顯示表格",
  'DG.Undo.caseTable.editAttribute': "回復編輯表格變項",
  'DG.Redo.caseTable.editAttribute': "重做編輯表格變項",
  'DG.Undo.caseTable.createAttribute': "回復建立表格變項",
  'DG.Redo.caseTable.createAttribute': "重做建立表格變項",
  'DG.Undo.caseTable.editAttributeFormula': "回復編輯表格變項公式",
  'DG.Redo.caseTable.editAttributeFormula': "重做編輯表格變項公式",
  'DG.Undo.caseTable.deleteAttribute': "回復刪除表格變項",
  'DG.Redo.caseTable.deleteAttribute': "重做刪除表格變項",
  'DG.Undo.caseTable.createCollection': "回復建立新集合",
  'DG.Redo.caseTable.createCollection': "重做建立新集合",
  'DG.Undo.caseTable.collectionNameChange': '回復命名集合',
  'DG.Redo.caseTable.collectionNameChange': '重做命名集合',
  'DG.Undo.caseTable.groupToggleExpandCollapseAll': '回復全部展開/縮小',
  'DG.Redo.caseTable.groupToggleExpandCollapseAll': '重做全部展開/縮小',
  'DG.Undo.caseTable.expandCollapseOneCase': '回復展開或縮小群組',
  'DG.Redo.caseTable.expandCollapseOneCase': '重做展開或縮小群組',
  'DG.Undo.document.share': "回復分享文件",
  'DG.Redo.document.share': "重做分享文件",
  'DG.Undo.document.unshare': "回復停止分享文件",
  'DG.Redo.document.unshare': "重做停止分享文件",
  'DG.Undo.game.add': "回復在文件增加遊戲",
  'DG.Redo.game.add': "重做在文件增加遊戲",
  'DG.Undo.graph.showCount': "回復顯示數量",
  'DG.Redo.graph.showCount': "重做顯示數量",
  'DG.Undo.graph.hideCount': "回復隱藏數量",
  'DG.Redo.graph.hideCount': "重做隱藏數量",
  'DG.Undo.graph.showPercent': "回復顯示百分比",
  'DG.Redo.graph.showPercent': "重做顯示百分比",
  'DG.Undo.graph.hidePercent': "回復隱藏百分比",
  'DG.Redo.graph.hidePercent': "重做隱藏百分比",
  'DG.Undo.graph.showMovableLine': "回復顯示可移動的線",
  'DG.Redo.graph.showMovableLine': "重做顯示可移動的線",
  'DG.Undo.graph.hideMovableLine': "回復隱藏可移動的線",
  'DG.Redo.graph.hideMovableLine': "重做隱藏可移動的線",
  'DG.Undo.graph.lockIntercept': "回復鎖定線的截距",
  'DG.Redo.graph.lockIntercept': "重做鎖定線的截距",
  'DG.Undo.graph.unlockIntercept': "回復解開線的截距",
  'DG.Redo.graph.unlockIntercept': "重做解開線的截距",
  'DG.Undo.graph.showPlotFunction': "回復顯示繪製功能",
  'DG.Redo.graph.showPlotFunction': "重做顯示繪製功能",
  'DG.Undo.graph.hidePlotFunction': "回復隱藏繪製功能",
  'DG.Redo.graph.hidePlotFunction': "重做隱藏繪製功能",
  'DG.Undo.graph.changePlotFunction': "回復改變繪製功能", // TRANSLATE: "Undo change plotted function"
  'DG.Redo.graph.changePlotFunction': "重做改變繪製功能", // TRANSLATE: "Redo change plotted function"
  'DG.Undo.graph.showPlotValue': "回復顯示繪製的值",
  'DG.Redo.graph.showPlotValue': "重做顯示繪製的值",
  'DG.Undo.graph.hidePlotValue': "回復隱藏繪製的值",
  'DG.Redo.graph.hidePlotValue': "重做顯示繪製的值",
  'DG.Undo.graph.changePlotValue': "回復改變繪製的值", // TRANSLATE: "Undo change plotted value"
  'DG.Redo.graph.changePlotValue': "重做改變 繪製的值", // TRANSLATE: "Redo change plotted value"
  'DG.Undo.graph.showConnectingLine': "回復顯示連接線",
  'DG.Redo.graph.showConnectingLine': "重做顯示連接線",
  'DG.Undo.graph.hideConnectingLine': "回復隱藏連接線",
  'DG.Redo.graph.hideConnectingLine': "重做隱藏連接線",
  'DG.Undo.graph.showLSRL': "回復顯示最小平方直線",
  'DG.Redo.graph.showLSRL': "重做顯示最小平方直線",
  'DG.Undo.graph.hideLSRL': "回復隱藏最小平方直線",
  'DG.Redo.graph.hideLSRL': "重做顯示最小平方直線",
  'DG.Undo.graph.showSquares': "回復顯示方格",
  'DG.Redo.graph.showSquares': "重做顯示方格",
  'DG.Undo.graph.hideSquares': "回復隱藏方格",
  'DG.Redo.graph.hideSquares': "重做隱藏方格",
  'DG.Undo.graph.showPlottedMean': "回復顯示平均值",
  'DG.Redo.graph.showPlottedMean': "重做顯示平均值",
  'DG.Undo.graph.hidePlottedMean': "回復隱藏平均值",
  'DG.Redo.graph.hidePlottedMean': "重做顯示平均值",
  'DG.Undo.graph.showPlottedMedian': "回復顯示中位數",
  'DG.Redo.graph.showPlottedMedian': "重做顯示中位數",
  'DG.Undo.graph.hidePlottedMedian': "回復隱藏中位數",
  'DG.Redo.graph.hidePlottedMedian': "重做隱藏中位數",
  'DG.Undo.graph.showPlottedStDev': "回復顯示標準差",
  'DG.Redo.graph.showPlottedStDev': "重做顯示標準差",
  'DG.Undo.graph.hidePlottedStDev': "回復隱藏標準差",
  'DG.Redo.graph.hidePlottedStDev': "重做隱藏標準差",
  'DG.Undo.graph.showPlottedIQR': "回復顯示四分位差",
  'DG.Redo.graph.hidePlottedIQR': "重做顯示四分位差",
  'DG.Undo.graph.hidePlottedIQR': "回復隱藏四分位差",
  'DG.Redo.graph.showPlottedIQR': "重做隱藏四分位差",
  'DG.Undo.graph.addMovableValue': "回復增加可移動值",
  'DG.Redo.graph.addMovableValue': "重做增加可移動值",
  'DG.Undo.graph.removeMovableValue': "回復移除可移動值",
  'DG.Redo.graph.removeMovableValue': "重做移動可移動值",
  'DG.Undo.graph.moveMovableValue': "回復移動可移動值",
  'DG.Redo.graph.moveMovableValue': "重做移動可移動值",
  'DG.Undo.graph.changePointColor': "回復更改資料顏色",
  'DG.Redo.graph.changePointColor': "重做更改資料顏色",
  'DG.Undo.graph.changeStrokeColor': "回復更改外框顏色",
  'DG.Redo.graph.changeStrokeColor': "重做更改外框顏色",
  'DG.Undo.graph.changePointSize': "回復更改點的大小",
  'DG.Redo.graph.changePointSize': "重做更改點的大小",
  'DG.Undo.graph.changeAttributeColor': "回復更改變項顏色",
  'DG.Redo.graph.changeAttributeColor': "重做更改變項顏色",
  'DG.Undo.graph.changeBackgroundColor': "回復更改圖表背景顏色",
  'DG.Redo.graph.changeBackgroundColor': "重做更改圖表背景顏色",
  'DG.Undo.graph.toggleTransparent': "回復修改點的透明度",
  'DG.Redo.graph.toggleTransparent': "重做修改點的透明度",
  'DG.Undo.guide.show': "回復顯示說明",
  'DG.Redo.guide.show': "重做顯示說明",
  'DG.Undo.guide.navigate': "回復更改說明頁",
  'DG.Redo.guide.navigate': "重做更改說明頁",
  'DG.Undo.hideSelectedCases': "回復隱藏選取的資料",
  'DG.Redo.hideSelectedCases': "重做隱藏選取的資料",
  'DG.Undo.hideUnselectedCases': "回復隱藏未選取的資料",
  'DG.Redo.hideUnselectedCases': "重做隱藏未選取的資料",
  'DG.Undo.enableNumberToggle': "回復顯示資料編號層",
  'DG.Redo.enableNumberToggle': "重做顯示資料編號層",
  'DG.Undo.disableNumberToggle': "回復隱藏資料編號層",
  'DG.Redo.disableNumberToggle': "重做隱藏資料編號層",
  'DG.Undo.interactiveUndoableAction': "回復互動中的動作",
  'DG.Redo.interactiveUndoableAction': "重做互動中的動作",
  'DG.Undo.showAllCases': "回復顯示所有資料",
  'DG.Redo.showAllCases': "重做顯示所有資料",
  'DG.Undo.map.create': "回復增加地圖",
  'DG.Redo.map.create': "重做增加地圖",
  'DG.Undo.map.fitBounds': "回復調整地圖大小",
  'DG.Redo.map.fitBounds': "重做調整地圖大小",
  'DG.Undo.map.pan': "回復移動地圖",
  'DG.Redo.map.pan': "重做移動地圖",
  'DG.Undo.map.zoom': "回復縮放地圖",
  'DG.Redo.map.zoom': "重做縮放地圖",
  'DG.Undo.map.showGrid': "回復在地圖上顯示網格",
  'DG.Redo.map.showGrid': "重做在地圖上顯示網格",
  'DG.Undo.map.hideGrid': "回復在地圖上隱藏網格",
  'DG.Redo.map.hideGrid': "重做在地圖上隱藏網格",
  'DG.Undo.map.changeGridSize': "回復更改地圖網格大小",
  'DG.Redo.map.changeGridSize': "重做更改地圖網格大小",
  'DG.Undo.map.showPoints': "回復在地圖上顯示資料點",
  'DG.Redo.map.showPoints': "重做在地圖上顯示資料點",
  'DG.Undo.map.hidePoints': "回復在地圖上隱藏資料點",
  'DG.Redo.map.hidePoints': "重做在地圖上隱藏資料點",
  'DG.Undo.map.showLines': "回復在地圖上顯示直線",
  'DG.Redo.map.showLines': "重做在地圖上顯示直線",
  'DG.Undo.map.hideLines': "回復在地圖上隱藏直線",
  'DG.Redo.map.hideLines': "重做在地圖上隱藏直線",
  'DG.Undo.map.changeBaseMap': "回復更改地圖背景",
  'DG.Redo.map.changeBaseMap': "重做更改地圖背景",
  'DG.Undo.textComponent.create': "回復增加文字物件",
  'DG.Redo.textComponent.create': "重做增加文字物件",
  'DG.Undo.textComponent.edit': "回復編輯文字",
  'DG.Redo.textComponent.edit': "重做編輯文字",
  'DG.Undo.sliderComponent.create': "回復增加滑桿",
  'DG.Redo.sliderComponent.create': "重做增加滑桿",
  'DG.Undo.slider.change': "回復更改滑桿值",
  'DG.Redo.slider.change': "重做更改滑桿值",
  'DG.Undo.slider.changeMultiples': "Undo change to slider multiples restriction",  // TRANSLATE: "Undo change to slider multiples restriction"
  'DG.Redo.slider.changeMultiples': "Redo change to slider multiples restriction",  // TRANSLATE: "Redo change to slider multiples restriction"
  'DG.Undo.slider.changeSpeed': "Undo change to slider max frames/sec", // TRANSLATE: "Undo change to slider max frames/sec"
  'DG.Redo.slider.changeSpeed': "Redo change to slider max frames/sec", // TRANSLATE: "Redo change to slider max frames/sec"
  'DG.Undo.slider.changeDirection': "Undo change to slider animation direction",  // TRANSLATE: "Undo change to slider animation direction"
  'DG.Redo.slider.changeDirection': "Redo change to slider animation direction",  // TRANSLATE: "Redo change to slider animation direction"
  'DG.Undo.slider.changeRepetition': "Undo change to slider animation repetition",  // TRANSLATE: "Undo change to slider animation repetition"
  'DG.Redo.slider.changeRepetition': "Redo change to slider animation repetition",  // TRANSLATE: "Redo change to slider animation repetition"
  'DG.Undo.graphComponent.create': "回復增加圖表",
  'DG.Redo.graphComponent.create': "重做增加圖表",
  'DG.Undo.dataContext.create': '回復資料建立',
  'DG.Redo.dataContext.create': '重做資料建立',
  'DG.Undo.data.deleteCases': "回復刪除資料",
  'DG.Redo.data.deleteCases': "重做刪除資料",
  'DG.Undo.component.close': "回復關閉物件",
  'DG.Redo.component.close': "重做關閉物件",
  'DG.Undo.component.minimize': "回復縮小物件",
  'DG.Redo.component.minimize': "重做縮小物件",
  'DG.Undo.dataContext.moveAttribute': "回復移動表格變項",
  'DG.Redo.dataContext.moveAttribute': "重做移動表格變項",


  // DG.DataContext
  'DG.DataContext.singleCaseName': "case",
  'DG.DataContext.pluralCaseName': "cases",
  'DG.DataContext.caseCountString': "%@1 %@2",  // %@1: count, %@2: case name string
  'DG.DataContext.setOfCasesLabel': "a collection",
  'DG.DataContext.collapsedRowString': "%@1 of %@2",
  'DG.DataContext.noData': "No Data",   // "No Data"
  'DG.DataContext.baseName': 'Data_Set_%@1',

  // DG.CollectionClient
  'DG.CollectionClient.cantEditFormulaErrorMsg': "這個公式變項 \"%@\" 是無法編輯的",
  'DG.CollectionClient.cantEditFormulaErrorDesc': "建立一個可用來說明公式的新變項",

  // DG.Formula
  'DG.Formula.FuncCategoryArithmetic': "算術函數",
  'DG.Formula.FuncCategoryConversion': "其他函數", // put into "其他" for now
  'DG.Formula.FuncCategoryDateTime': "日期/時間函數",
  'DG.Formula.FuncCategoryLookup': "陣列函數",
  'DG.Formula.FuncCategoryOther': "其他函數",
  'DG.Formula.FuncCategoryRandom': "其他函數", // put into "其他" for now
  'DG.Formula.FuncCategoryStatistical': "統計函數",
  'DG.Formula.FuncCategoryString': "字串函數",
  'DG.Formula.FuncCategoryTrigonometric': "三角函數",

  'DG.Formula.DateLongMonthJanuary': "一月",
  'DG.Formula.DateLongMonthFebruary': "二月",
  'DG.Formula.DateLongMonthMarch': "三月",
  'DG.Formula.DateLongMonthApril': "四月",
  'DG.Formula.DateLongMonthMay': "五月",
  'DG.Formula.DateLongMonthJune': "六月",
  'DG.Formula.DateLongMonthJuly': "七月",
  'DG.Formula.DateLongMonthAugust': "八月",
  'DG.Formula.DateLongMonthSeptember': "九月",
  'DG.Formula.DateLongMonthOctober': "十月",
  'DG.Formula.DateLongMonthNovember': "十一月",
  'DG.Formula.DateLongMonthDecember': "十二月",

  'DG.Formula.DateShortMonthJanuary': "1月",
  'DG.Formula.DateShortMonthFebruary': "2月",
  'DG.Formula.DateShortMonthMarch': "3月",
  'DG.Formula.DateShortMonthApril': "4月",
  'DG.Formula.DateShortMonthMay': "5月",
  'DG.Formula.DateShortMonthJune': "6月",
  'DG.Formula.DateShortMonthJuly': "7月",
  'DG.Formula.DateShortMonthAugust': "8月",
  'DG.Formula.DateShortMonthSeptember': "9月",
  'DG.Formula.DateShortMonthOctober': "10月",
  'DG.Formula.DateShortMonthNovember': "11月",
  'DG.Formula.DateShortMonthDecember': "12月",

  'DG.Formula.DateLongDaySunday': "星期日",
  'DG.Formula.DateLongDayMonday': "星期一",
  'DG.Formula.DateLongDayTuesday': "星期二",
  'DG.Formula.DateLongDayWednesday': "星期三",
  'DG.Formula.DateLongDayThursday': "星期四",
  'DG.Formula.DateLongDayFriday': "星期五",
  'DG.Formula.DateLongDaySaturday': "星期六",

                                        /* "dd-mmm-yyyy", "dd-mmm-yy", "mm/dd/yy", "mm/dd/yyyy" */
  'DG.Utilities.date.localDatePattern': '(?:(?:[0-3]?\\d\-(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\-\\d{2}(?:\\d{2})?)|(?:[01]?\\d\/[0-3]?\\d\/\\d{2}(?:\\d{2})?))',
                                    /* "hh:mm", "hh:mm:ss", "hh:mm:ss.ddd" */
  'DG.Utilities.date.timePattern': '(?:[0-2]?\\d:[0-5]?\\d(?::[0-5]\\d(?:\\.\\d{3})?)? ?(?:[ap]m)?)',
                                    /* "yyyy-mm-dd", "yyyy-mm-ddThh:mm:ss", "yyyy-mm-ddThh:mm:ssZ" "yyyy-mm-ddThh:mm:ss+hh:mm"*/
  // We are assembling the full iso pattern piecemeal below, in hopes of making it
  // easier to read and understand...
  'DG.Utilities.date.iso8601Pattern': [
    '^', // beginning of string
    '\\d{4}-[01]\\d-[0-3]\\d', // iso date part yyyy-mm-dd
    '(?:', // optional clause BEGIN
      '[T ]', // date/time separator
      '(?:[0-2]\\d:[0-5]\\d:[0-5]\\d(?:\\.\\d{3,3})?)',  // iso time part hh:mm:ss or hh:mm:ss.ddd
      '(?:', // optional clause BEGIN
        'Z|(?:[-+]?[01]\\d:[0-5]\\d)|(?: ?[-+][0-2]\\d{3})', // iso timezone part 'Z', +hh:mm, -hh:mm, +hhmm, -hhmm
      ')?', // optional clause END
    ')?', // optional clause END
    '$'
  ].join(''),
                                  /* "rgb(nnn,nnn,nnn)" "rgba(nnn,nnn,nnn,0.n)" "#ffffff" */
  'DG.Utilities.colorPattern': '(?:rgb\\((?:\\d{1,3},){2}\\d{1,3}\\))|(?:rgba\\((?:\\d{1,3},){3}[\\d\\.]*\\))|(?:#[\\da-f]{6})',

  'DG.Formula.SyntaxErrorMiddle': "語法錯誤: '%@'",
  'DG.Formula.SyntaxErrorEnd': "表達不完整",
  'DG.Formula.VarReferenceError.message': "'%@': 未知變數",
  'DG.Formula.VarReferenceError.description': "變數 '%@' 無法辨認",
  'DG.Formula.FuncReferenceError.message': "'%@': 未知函數",
  'DG.Formula.FuncReferenceError.description': "函數 '%@' 無法辨識",
  'DG.Formula.FuncArgsErrorSingle.message': "'%@' 需要一個參數",
  'DG.Formula.FuncArgsErrorSingle.description': "此函數 '%@'需要一個參數",
  'DG.Formula.FuncArgsErrorPlural.message': "'%@' 需要 %@ 參數",
  'DG.Formula.FuncArgsErrorPlural.description': "此函數 '%@' 需要 %@ 參數",
  'DG.Formula.FuncArgsErrorRange.message': "'%@' 需要 %@-%@ 參數",
  'DG.Formula.FuncArgsErrorRange.description': "此函數 '%@' 需要 %@-%@ 參數",
  'DG.Formula.LookupDataSetError.message': "'%@': 無法辨認的資料組",
  'DG.Formula.LookupDataSetError.description': "資料組 '%@' 無法辨識",
  'DG.Formula.LookupAttrError.message': "'%@' 在資料組中找不到 '%@'",
  'DG.Formula.LookupAttrError.description': "變項 '%@' 在資料組中找不到 '%@'",

  // DG.TableController
  'DG.TableController.headerMenuItems.editAttribute': "編輯變項特性...",
  'DG.TableController.headerMenuItems.editFormula': "編輯公式...",
  'DG.TableController.headerMenuItems.randomizeAttribute': "重新格式化",
  'DG.TableController.headerMenuItems.deleteAttribute': "刪除變項",
  'DG.TableController.newAttrDlg.defaultAttrName': "新變項",
  'DG.TableController.newAttrDlg.attrNameHint': "為新變項輸入一個名字",
  'DG.TableController.newAttrDlg.formulaHint': "如果需要，輸入公式來計算此變項值",
  'DG.TableController.newAttrDlg.applyTooltip': "使用名稱和（可選）公式定義新變項",
  'DG.TableController.newAttrDlg.mustEnterAttrNameMsg': "請為新的變項輸入一個名字",
  'DG.TableController.newAttrDialog.AttributesCategory': "變項",
  'DG.TableController.newAttrDialog.SpecialCategory': "特殊的",
  'DG.TableController.newAttrDialog.GlobalsCategory': "全域的",
  'DG.TableController.newAttrDialog.ConstantsCategory': "常數",  // Set to "Special" to combine with 'caseIndex'
  'DG.TableController.newAttrDialog.FunctionsCategory': "函數",
  'DG.TableController.renameAttributeInvalidMsg': "變項名字不能是空白的",
  'DG.TableController.renameAttributeInvalidDesc': "請輸入一個有效的名字",
  'DG.TableController.renameAttributeDuplicateMsg': "已經有同樣的變項名字存在",
  'DG.TableController.renameAttributeDuplicateDesc': "請輸入一個唯一的變項名字",
  'DG.TableController.deleteAttribute.confirmMessage': "刪除此變項 '%@'?",
  'DG.TableController.deleteAttribute.confirmDescription': "這個動作不能復原",
  'DG.TableController.deleteAttribute.okButtonTitle': "刪除變數",
  'DG.TableController.deleteAttribute.cancelButtonTitle': "取消",
  'DG.TableController.deleteDataSet.confirmMessage': "刪除此資料組: '%@'?",
  'DG.TableController.deleteDataSet.confirmDescription': "這個動作無法復原",
  'DG.TableController.deleteDataSet.okButtonTitle': "刪除資料組",
  'DG.TableController.deleteDataSet.cancelButtonTitle': "取消",
  'DG.TableController.attrEditor.precisionHint': "小數點後的位數",
  'DG.TableController.attrEditor.unitHint': "可用的測量單位",
  'DG.TableController.attrEditor.descriptionHint': "描述這個變項",
  'DG.TableController.scoreAttrName': "分數",
  'DG.TableController.setScoreDlg.applyTooltip': "設定一個公式針對 '%@' 變項",
  'DG.TableController.setScoreDlg.formulaHint': "輸入一個公式來計算這個屬型",
  'DG.TableController.newAttributeTooltip': 'Add a new attribute to this table', // TRANSLATE: "Add a new attribute to this table"

  'DG.TableController.attributeEditor.title': '變項特徵',
  // DG.CaseTableDropTarget
  'DG.CaseTableDropTarget.dropMessage': "移除變項以建立新的集合",
  'DG.CaseTable.attribute.type.none': '',
  'DG.CaseTable.attribute.type.nominal': '名義',
  'DG.CaseTable.attribute.type.categorical': 'categorical',
  'DG.CaseTable.attribute.type.numeric': '數值',
  'DG.CaseTable.attribute.type.date': '日期',
  'DG.CaseTable.attribute.type.qualitative': '性質',
  'DG.CaseTable.attributeEditor.name': 'name', // name
  'DG.CaseTable.attributeEditor.description': 'description', // description
  'DG.CaseTable.attributeEditor.type': 'type', // type
  'DG.CaseTable.attributeEditor.unit': 'unit', // unit
  'DG.CaseTable.attributeEditor.precision': 'precision', // precision
  'DG.CaseTable.attributeEditor.editable': 'editable', // editable

  // DG.CaseTableController
  'DG.CaseTableController.allTables': 'All tables',

  // DG.AttributeFormulaView
  'DG.AttrFormView.attrNamePrompt': "變項名字:",
  'DG.AttrFormView.formulaPrompt': "公式:",
  'DG.AttrFormView.operandMenuTitle': "--- 插入值 ---",
  'DG.AttrFormView.functionMenuTitle': "--- 插入公式 ---",
  'DG.AttrFormView.applyBtnTitle': "送出",
  'DG.AttrFormView.cancelBtnTitle': "取消",
  'DG.AttrFormView.cancelBtnTooltip': "關閉對話框而不進行任何更改",

  // DG.GuideConfigurationView
  'DG.GuideConfigView.titlePrompt': "說明標題",
  'DG.GuideConfigView.titleHint': "活動名字",
  'DG.GuideConfigView.itemTitleHint': "網頁名稱",
  'DG.GuideConfigView.itemURLHint': "網址",
  'DG.GuideConfigView.okBtnTitle': "OK",
  'DG.GuideConfigView.okBtnToolTip': "接受說明選項",
  'DG.GuideConfigView.cancelBtnTitle': "取消",
  'DG.GuideConfigView.cancelBtnTooltip': "關閉對話框而不進行任何更改",
  'DG.GuideConfigView.httpWarning': "網址的開頭應該要是 http:// 或是 https://",

  'DG.DataDisplayModel.rescaleToData': "重新縮放資料",
  'DG.DataDisplayModel.ShowConnectingLine': "顯示連接線",
  'DG.DataDisplayModel.HideConnectingLine': "隱藏連接線",

  // DG.AxisView
  'DG.AxisView.emptyGraphCue': '點擊此處, 或者在這裡拖曳一個變項',

  // DG.CellLinearAxisView
  'DG.CellLinearAxisView.midPanelTooltip': "可拖曳轉換軸的規模",
  'DG.CellLinearAxisView.lowerPanelTooltip': "可拖曳來改變軸的下限",
  'DG.CellLinearAxisView.upperPanelTooltip': "可拖曳來改變軸的上限",

  // DG.PlotModel
  'DG.PlotModel.mixup': "混和所有的資料點",  // "Mix Up the Plot"
  'DG.PlotModel.showCount': "顯示數量",
  'DG.PlotModel.hideCount': "隱藏數量",

  // DG.ScatterPlotModel
  'DG.ScatterPlotModel.sumSquares': ",\n平方總和 = %@", // sumOfResidualsSquared
  'DG.ScatterPlotModel.rSquared': ",\nr平方 = %@", // r-squared
  'DG.ScatterPlotModel.slopeIntercept': "%@ = %@* %@ %@ %@",// y,slope,x,signInt,Int
  'DG.ScatterPlotModel.infiniteSlope': "%@ = %@",// x,constant
  'DG.ScatterPlotModel.slopeOnly': "slope = %@ %@",// numeric slope
  'DG.ScatterPlotModel.yearsLabel': "per year",// per year - used in equation for line when x is a datetime axis
  'DG.ScatterPlotModel.daysLabel': "每天",// per day - used in equation for line when x is a datetime axis
  'DG.ScatterPlotModel.hoursLabel': "每小時",// per hour - used in equation for line when x is a datetime axis
  'DG.ScatterPlotModel.minutesLabel': "每分鐘",// per minute - used in equation for line when x is a datetime axis
  'DG.ScatterPlotModel.secondsLabel': "每秒",// per second - used in equation for line when x is a datetime axis

  // DG.LegendView
  'DG.LegendView.attributeTooltip': "點即可改變圖例變項",  // "Click to change legend attribute"

  // DG.NumberToggleView
  'DG.NumberToggleView.showAll': "顯示全部 -",  // "顯示全部"
  'DG.NumberToggleView.hideAll': "隱藏全部 -",  // "隱藏全部"
  'DG.NumberToggleView.lastDash': "\u2013",         // "-"
  'DG.NumberToggleView.lastUnchecked': "\u2610",    // "[ ]"
  'DG.NumberToggleView.lastChecked': "\u2612",      // "[x]"
  'DG.NumberToggleView.lastLabel': "Last",    // TRANSLATE: "Last"
  'DG.NumberToggleView.showAllTooltip': "點擊數字可觸發可見性。 點擊標籤可顯示全部。",  // "點擊數字可觸發可見性。 點擊標籤可顯示全部。"
  'DG.NumberToggleView.hideAllTooltip': "點擊數字可觸發可見性。 點擊標籤可隱藏全部。",  // "點擊數字可觸發可見性。 點擊標籤可隱藏全部。"
  'DG.NumberToggleView.enableLastModeTooltip': "Click to show last parent case only", // TRANSLATE: "Click to show last parent case only"
  'DG.NumberToggleView.disableLastModeTooltip': "Click to exit last parent case mode",  // TRANSLATE: "Click to exit last parent case mode"
  'DG.NumberToggleView.indexTooltip': "點擊可觸發可見性",  // "點擊可觸發可見性"

  // DG.PlottedAverageAdornment
  'DG.PlottedAverageAdornment.meanValueTitle': "平均值=%@", // "平均值=123.456"
  'DG.PlottedAverageAdornment.medianValueTitle': "中位數=%@", // "中位數=123.456"
  'DG.PlottedAverageAdornment.stDevValueTitle': "\xB11 SD, %@", // "st.dev=123.456"
  'DG.PlottedAverageAdornment.iqrValueTitle': "四分位距=%@", // "四分位距=123.456"
  'DG.PlottedAverageAdornment.boxPlotTitle': "下限=%@\n第1四分位數=%@\n中位數=%@\n第3四分位數=%@\n上限=%@\n四分位距=%@", // "下限=%@\n第1四分位數=%@\n中位數=%@\n第3四分位數=\nIQ=%@\n上限=%@"
  'DG.PlottedCountAdornment.title': "%@ %@, %@%", // "12 cases, 50%"

  // DG.GraphModel
  'DG.DataDisplayMenu.attribute_x': "X: %@", // %@ = attribute name
  'DG.DataDisplayMenu.attribute_y': "Y: %@", // %@ = attribute name
  'DG.DataDisplayMenu.attribute_y2': "Y: %@", // %@ = attribute name
  'DG.DataDisplayMenu.attribute_legend': "圖例: %@", // %@ = attribute name
  'DG.DataDisplayMenu.remove': "移除變項",
  'DG.DataDisplayMenu.removeAttribute_x': "移除 X: %@", // %@ = attribute name
  'DG.DataDisplayMenu.removeAttribute_y': "移除 Y: %@", // %@ = attribute name
  'DG.DataDisplayMenu.removeAttribute_y2': "移除 Y: %@", // %@ = attribute name
  'DG.DataDisplayMenu.removeAttribute_legend': "移除圖例: %@", // %@ = attribute name
  'DG.DataDisplayMenu.treatAsCategorical': "視為類別",
  'DG.DataDisplayMenu.treatAsNumeric': "視為數字",
  'DG.DataDisplayMenu.hide': "隱藏與顯示",
  'DG.DataDisplayMenu.hideSelectedPlural': "隱藏所選的案例",
  'DG.DataDisplayMenu.hideUnselectedPlural': "隱藏未選擇的案例",
  'DG.DataDisplayMenu.hideSelectedSing': "隱藏所選的案例",
  'DG.DataDisplayMenu.hideUnselectedSing': "隱藏未選擇的案例",
  'DG.DataDisplayMenu.enableNumberToggle': "Show Parent Visibility Toggles",  // TRANSLATE: "Show Parent Visibility Toggles"
  'DG.DataDisplayMenu.disableNumberToggle': "Hide Parent Visibility Toggles", // TRANSLATE: "Hide Parent Visibility Toggles"
  'DG.DataDisplayMenu.showAll': "顯示所有案例",
  'DG.DataDisplayMenu.snapshot': "製作快照",

  // DG.GraphView
  'DG.GraphView.replaceAttribute': "取代 %@ 使用 %@",  // both %@ are attribute names
  'DG.GraphView.addAttribute': "增加 %@",  // %@ is attribute name
  'DG.GraphView.addToEmptyPlace': "用 %@ 建立軸",  // %@ is attribute name
  'DG.GraphView.addToEmptyX': "用 %@ 建立X軸",  // %@ is attribute name
  'DG.GraphView.dropInPlot': "Color points by values of %@",  // TRANSLATE: "Color points by values of %@" -- %@ is attribute name
  'DG.GraphView.zoomTip': "雙點擊以放大\nShift加雙點擊以縮小",  // %@ is attribute name
  'DG.GraphView.rescale': "將資料重新縮放",  // Rescale to data

  // DG.AxisView
  'DG.AxisView.labelTooltip': "—點擊以改變%@ 軸變項",  // %@ is either horizontal or vertical
  'DG.AxisView.vertical': 'vertical', // TRANSLATE: "vertical"
  'DG.AxisView.horizontal': 'horizontal', // TRANSLATE: "horizontal"

  // DG.DataTip
  'DG.DataTip.connectingLine': "%@: %@\n加上 %@ %@",

  // DG.MovableValueAdornment
  'DG.MovableMonthYear': "%@, %@", // <monthname>, <year>
  'DG.MovableMonthDayHour': "%@ %@ %@:00", // <monthname> <day> <hour>:00

  // DG.PlottedValueAdornment/DG.PlottedFunctionAdornment
  'DG.PlottedFormula.defaultNamePrompt': "Formula", // TRANSLATE: "Formula"
  'DG.PlottedValue.namePrompt': "Plotted Value",  // TRANSLATE: "Plotted Value"
  'DG.PlottedValue.formulaPrompt': "value =", // TRANSLATE: "value ="
  'DG.PlottedValue.formulaHint': "",
  'DG.PlottedFunction.namePrompt': "Plotted Function",  // TRANSLATE: "Plotted Function"
  'DG.PlottedFunction.formulaPrompt': "f() =",  // TRANSLATE? "f() ="
  'DG.PlottedFunction.formulaHint': "Type an expression e.g. x*x/30 - 50",  // TRANSLATE: "Type an expression e.g. x*x/30 - 50"

  // DG.MapView
  'DG.MapView.showGrid': "顯示表格",  // "顯示表格"
  'DG.MapView.hideGrid': "隱藏表格",  // "隱藏表格"
  'DG.MapView.showPoints': "顯示標點",  // "顯示標點"
  'DG.MapView.hidePoints': "隱藏標點",  // "隱藏標點"
  'DG.MapView.marqueeHint': "選框工具—在地圖上拖曳所選擇的標點",  // "Marquee tool—drag select points in map"
  'DG.MapView.gridControlHint': "重新調整表格大小",  // "Change size of grid rectangles"

  // Inspector
  'DG.Inspector.values': "測量",  // "測量"
  'DG.Inspector.styles': "格式化",  // "格式化"
  'DG.Inspector.pointSize': "標點大小:",  // "標點大小:"
  'DG.Inspector.transparency': "透明度:",  // "透明度:"
  'DG.Inspector.color': "顏色:",  // "顏色:"
  'DG.Inspector.legendColor': "圖例顏色:",  // "圖例顏色:"
  'DG.Inspector.backgroundColor': "背景\n顏色:",  // "背景顏色:"
  'DG.Inspector.stroke': "筆觸:",  // "筆觸:"
  'DG.Inspector.rescale.toolTip': "放大或縮小以顯示所有資料",  // "放大或縮小以顯示所有資料"
  'DG.Inspector.mixUp.toolTip': "混和所有的資料點",  // "混和所有的資料點"
  'DG.Inspector.hideShow.toolTip': "顯示所有案例或隱藏所選擇的案例/未選擇的案例",  // "顯示所有案例或隱藏所選擇的案例/未選擇的案例"
  'DG.Inspector.delete.toolTip': "刪除選擇的或未選擇的案例",  // "刪除選擇的或未選擇的案例"
  'DG.Inspector.sliderValues.toolTip': "設置動畫滑塊方向, 速度, …",  // "設置動畫滑塊方向, 速度, …"
  'DG.Inspector.webViewEditURL.toolTip': "編輯網頁的網址",  // "編輯網頁的網址"

  'DG.Inspector.selection.selectAll': "選擇所有案例",           // "選擇所有案例"
  'DG.Inspector.selection.deleteSelectedCases': "刪除選擇的案例",  // "刪除選擇的案例"
  'DG.Inspector.selection.deleteUnselectedCases': "刪除未選擇的案例",    // "刪除未選擇的案例"
  'DG.Inspector.deleteAll': "刪除所有案例",           // "刪除所有案例"
  'DG.Inspector.deleteDataSet': "刪除資料組",        // "刪除資料組"

  // Display Inspector
  'DG.Inspector.displayValues.toolTip': "更改與標點一起所顯示的內容",  // "更改與標點一起所顯示的內容"
  'DG.Inspector.displayStyles.toolTip': "更改顯示的外觀",  // "更改顯示的外觀"
  'DG.Inspector.makeImage.toolTip': "以PNG檔案儲存影像",  // "以PNG檔案儲存影像"
  'DG.Inspector.displayShow': "顯示 …",  // "顯示 …"

  // Color Picker
  'DG.Inspector.colorPicker.more': 'more', // TRANSLATE: "more"
  'DG.Inspector.colorPicker.less': 'less', // TRANSLATE: "less"

  // Graph Inspector
  'DG.Inspector.graphTransparency': "透明",  // "透明"
  'DG.Inspector.graphCount': "數量",  // "數量"
  'DG.Inspector.graphPercent': "百分比",  // "百分比"
  'DG.Inspector.graphRow': "列",  // "列"
  'DG.Inspector.graphColumn': "行",  // "行"
  'DG.Inspector.graphCell': "格",  // "格"
  'DG.Inspector.graphConnectingLine': "連接線",  // "連接線"
  'DG.Inspector.graphMovableLine': "活動線",  // "活動線"
  'DG.Inspector.graphInterceptLocked': "擷取鎖定",  // "擷取鎖定"
  'DG.Inspector.graphPlottedFunction': "繪圖功能",  // "繪圖功能"
  'DG.Inspector.graphSquares': "殘差平方",  // "殘差平方"
  'DG.Inspector.graphLSRL': "最小平方線",  // "最小平方線"
  'DG.Inspector.graphMovableValue': "活動值",  // "活動值"
  'DG.Inspector.graphAdd': "增加",  // "增加"
  'DG.Inspector.graphRemove': "移除",  // "移除"
  'DG.Inspector.graphPlottedMean': "平均",  // "平均"
  'DG.Inspector.graphPlottedMedian': "中位數",  // "中位數"
  'DG.Inspector.graphPlottedStDev': "標準差",  // "標準差"
  'DG.Inspector.graphPlottedIQR': "四分位數",  // "四分位數"
  'DG.Inspector.graphPlottedBoxPlot': "箱型圖",  // "箱型圖"
  'DG.Inspector.graphPlottedValue': "定點值",  // "定點值"

  // Table Inspector
  'DG.Inspector.attributes.toolTip': "建立新變項。匯出案例資料。",  // "建立新變項。匯出案例資料。"
  'DG.Inspector.newAttribute': "在 %@...的新變項",  // "在 %@...的新變項"
  'DG.Inspector.randomizeAllAttributes': "全部重新整理", // "隨機化變項"
  'DG.Inspector.exportCaseData': "匯出案例資料...", // "匯出案例資料..."

  // Map Inspector
  'DG.Inspector.mapGrid': "表格",  // "表格"
  'DG.Inspector.mapPoints': "標點",  // "標點"
  'DG.Inspector.mapLines': "連接線",  // "連接線"

  // Game Controller
  'DG.GameController.continuityError': '抱歉，在案例表中的欄位已被重新排序，無法接受新的數據',

  // Game View
  'DG.GameView.loading': '載入中',
  'DG.GameView.loadError': '如果你可以看到這句話，載入以上網址可能失敗了。你可以檢查在另一個瀏覽器標籤檢查這個連結或將錯誤報告給http://codap.concord.org/help.',

  // Controllers
  'DG.Component.closeComponent.confirmCloseMessage': '你確定嗎?',
  'DG.Component.closeComponent.confirmCloseDescription': '',
  'DG.Component.closeComponent.okButtonTitle': '是的，關閉它',
  'DG.Component.closeComponent.cancelButtonTitle': '取消',
  'DG.GameController.confirmCloseDescription': '如果你關閉這個，你可能無法添加更多數據',

  // Web View
  'DG.WebView.defaultTitle': '網頁'
  });
