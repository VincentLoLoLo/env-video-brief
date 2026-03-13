/**
 * 環境部影片需求問卷 — Google Apps Script
 * 31 題 · 5 段落（A 整體背景 / B 開場影片 / C 1999 整合 / D 影片規格 / E 補充）
 */

var HEADERS = [
  "提交時間",
  "A1 播放場合","A2 觀眾","A3 活動日期","A4 預算","A5 參考影片","A6 禁忌",
  "B7 開場方向","B8 部長＋長官","B9 角色定位","B10 舞伴構想","B11 舞伴作用","B12 歡樂感","B13 是否帶1999","B14 觀眾反應",
  "C15 核心訊息","C16 整合服務","C17 其他管道","C18 一鏡到底","C19 場景走法","C20 影片長度","C21 整體風格","C22 出現人物","C23 結尾收法",
  "D24 畫面類型","D25 風格統一","D26 音樂","D27 色調","D28 文字圖卡","D29 節奏","D30 比例格式",
  "E31 補充"
];

var TARGET_SHEET_ID = "1NulQPHDvnSC1GD1DuxApOPbzPKtrrgZeY_1NeXew2lM";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(TARGET_SHEET_ID).getActiveSheet();

    // 支援表單提交 (e.parameter.data) 和 JSON body (e.postData.contents)
    var raw;
    if (e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    } else if (e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }
    var data = JSON.parse(raw);

    // 第一次：寫入標題列（或更新舊標題）
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    } else {
      // 檢查標題是否需要更新（舊版 24 題 → 新版 31 題）
      var firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      if (firstRow.length < HEADERS.length || firstRow[1] !== HEADERS[1]) {
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      }
    }

    // 寫入回覆資料
    var row = [data.timestamp || new Date().toLocaleString("zh-TW")];
    var answers = data.answers || [];
    for (var i = 0; i < 31; i++) {
      row.push(answers[i] || "（未填寫）");
    }
    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("OK");
}

/**
 * 手動執行：強制更新現有試算表的標題列
 * 在 Apps Script 編輯器中選擇此函式 → 執行
 */
function updateHeaders() {
  var sheet = SpreadsheetApp.openById(TARGET_SHEET_ID).getActiveSheet();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
}
