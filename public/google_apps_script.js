/**
 * Google Apps Script Web App for PEC Hackathon Dashboard
 * 
 * Instructions:
 * 1. Open your Google Spreadsheet (with "Participation" and "Winners" tabs).
 * 2. Click "Extensions" > "Apps Script".
 * 3. Replace all code in the script editor with this file.
 * 4. Click "Deploy" > "New deployment".
 * 5. Choose type: "Web app".
 * 6. Set Description: "PEC Hackathon API".
 * 7. Set Execute as: "Me".
 * 8. Set Who has access: "Anyone".
 * 9. Click "Deploy" and authorize access.
 * 10. Copy the Web app URL and paste it into the Dashboard Sheet Setup modal or VITE_GAS_WEBAPP_URL.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tab names (adjust if your tabs have different names)
    var partSheet = ss.getSheetByName("Participation") || ss.getSheets()[0];
    var winSheet = ss.getSheetByName("Winners") || (ss.getSheets().length > 1 ? ss.getSheets()[1] : null);
    
    function parseSheetData(sheet) {
      if (!sheet) return [];
      var range = sheet.getDataRange();
      var values = range.getValues();
      if (values.length < 2) return [];
      
      var headers = values[0];
      var results = [];
      
      for (var i = 1; i < values.length; i++) {
        var row = values[i];
        var rowObj = {};
        var hasContent = false;
        
        for (var j = 0; j < headers.length; j++) {
          var header = String(headers[j]).trim();
          var cellVal = row[j];
          rowObj[header] = cellVal !== null && cellVal !== undefined ? cellVal : "";
          if (String(cellVal).trim() !== "") {
            hasContent = true;
          }
        }
        
        if (hasContent) {
          results.push(rowObj);
        }
      }
      return results;
    }
    
    var output = {
      status: "success",
      timestamp: new Date().toISOString(),
      spreadsheetTitle: ss.getName(),
      participation: parseSheetData(partSheet),
      winners: parseSheetData(winSheet)
    };
    
    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    var errorOutput = {
      status: "error",
      message: err.toString()
    };
    return ContentService.createTextOutput(JSON.stringify(errorOutput))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
