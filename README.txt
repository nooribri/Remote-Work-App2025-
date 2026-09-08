تعليمات استخدام النظام:

1. افتح Google Sheets وأنشئ جدولًا جديدًا.
2. اذهب إلى Extensions > Apps Script والصق الكود التالي:

--------------------------------
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const results = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((h, j) => row[h] = data[i][j]);
    results.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify(results)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.employeeId,
    data.employeeName,
    data.department,
    data.email,
    data.date,
    data.workType,
    data.notes
  ]);
  return ContentService.createTextOutput("تم الحفظ").setMimeType(ContentService.MimeType.TEXT);
}
--------------------------------

3. اضغط على "نشر" > "نشر تطبيق ويب"، وامنح الصلاحية "لأي شخص".
4. انسخ رابط الـ Web App.
5. استبدل "YOUR_SCRIPT_ID" في ملفات form.html و report.html بالرابط الصحيح.

تم!
