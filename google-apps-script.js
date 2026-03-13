/**
 * 環境部影片需求問卷 — Google Apps Script
 *
 * 部署步驟：
 * 1. 打開 Google Sheet → 擴充功能 → Apps Script
 * 2. 貼上此程式碼（覆蓋原有內容）→ 儲存
 * 3. 部署 → 新增部署作業 → 網頁應用程式
 * 4. 執行身分：「我」/ 誰可以存取：「所有人」
 * 5. 部署 → 複製 URL
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 支援表單提交 (e.parameter.data) 和 JSON body (e.postData.contents)
    var raw;
    if (e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    } else if (e.postData && e.postData.contents) {
      raw = e.postData.contents;
    }
    var data = JSON.parse(raw);

    // 第一次：寫入標題列
    if (sheet.getLastRow() === 0) {
      var headers = ["提交時間"];
      for (var i = 1; i <= 31; i++) {
        headers.push("第" + i + "題");
      }
      sheet.appendRow(headers);
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
