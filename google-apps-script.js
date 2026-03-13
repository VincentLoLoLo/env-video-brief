/**
 * 環境部影片需求問卷 — Google Apps Script
 * 31 題 · 5 段落（A 整體背景 / B 開場影片 / C 1999 整合 / D 影片規格 / E 補充）
 */

var HEADERS = [
  "提交時間",
  "A1 這兩支影片會在什麼場合播放？",
  "A2 現場觀眾主要是哪些人？",
  "A3 活動日期大概什麼時候？我需要多少時間製作？",
  "A4 預算範圍大概在哪裡？",
  "A5 有沒有你看過覺得「就是這種感覺」的影片？",
  "A6 有沒有絕對不能出現的東西？",
  "B7 開場影片的方向，我目前理解是這樣",
  "B8 畫面中有環境部部長，還有另一位長官？",
  "B9 部長和長官在畫面中是什麼角色？",
  "B10 後面有「舞伴」的構想？可能是真人也可能是玩偶人物？",
  "B11「舞伴」在影片中的作用是什麼？",
  "B12 開場影片的「歡樂感」你心中的畫面是什麼？",
  "B13 開場影片需不需要帶出 1999 或服務整合的內容？",
  "B14 開場影片播完後，你希望觀眾的反應是？",
  "C15 影片B的核心訊息，我理解是",
  "C16 具體有哪些服務被整合進 1999 了？",
  "C17 除了 1999 電話，也要介紹 LINE 等其他管道？",
  "C18 想用「一鏡到底」的方式來呈現影片B？",
  "C19 一鏡到底的畫面，你心中的場景是怎樣走的？",
  "C20 影片B大概多長？",
  "C21 影片B的整體風格要什麼感覺？",
  "C22 影片B需要哪些人出現在畫面中？",
  "C23 影片B結尾要怎麼收？",
  "D24 兩支影片的畫面類型，你想要哪種風格？",
  "D25 兩支影片的畫面風格要一樣嗎？",
  "D26 音樂想要什麼感覺？",
  "D27 色調氛圍想要什麼感覺？",
  "D28 文字和圖卡要怎麼呈現？",
  "D29 畫面節奏想要快還是慢？",
  "D30 影片需要什麼比例和格式？",
  "E31 還有什麼是您要提醒我的？"
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
