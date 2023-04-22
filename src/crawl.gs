function initFunc() {
    deleteAllTrigger();
    createOnOpenTrigger("onOpenTrigger");
    createOnEditTrigger("onEditTrigger");
}

function onEditTrigger(e) {
    var searchCell = 'C7';
    var Priceboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Priceboard");
    var tickerSearch = Priceboard.getRange(searchCell).getValue();
    if (e.range.getA1Notation() == "C5" && tickerSearch != '') searchTicker();
    else if (e.range.getA1Notation() == "C5" || e.range.getA1Notation() == "C6") listTickerDisplay();
    if (e.range.getA1Notation() == "C7" && e.range.getValue() == '') listTickerDisplay();
    if (e.range.getA1Notation() == "C7" && e.range.getValue() != '') searchTicker();
    if (e.range.getA1Notation() == "B4" && e.range.getValue() != '') {
        updateTickerOverview();
        updateHistoricalData();
    }
    realtimePriceUpdate(Priceboard);
}

function onOpenTrigger() {
    var Priceboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Priceboard");
    while (true) {
        realtimePriceUpdate(Priceboard);
    }
}

function createOnOpenTrigger(functionName) {
    ScriptApp.newTrigger(functionName)
        .forSpreadsheet(SpreadsheetApp.getActive())
        .onOpen()
        .create();
}

function createOnEditTrigger(functionName) {
    ScriptApp.newTrigger(functionName)
        .forSpreadsheet(SpreadsheetApp.getActive())
        .onEdit()
        .create();
}

function deleteAllTrigger() {
    ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
}
