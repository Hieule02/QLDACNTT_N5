function onChangeTrigger(e) {
    var exchangeSelectCell = 'C5';
    var searchCell = 'C7';
    var Priceboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Priceboard");
    var tickerSearch = Priceboard.getRange(searchCell).getValue();
    if (e.range.getA1Notation() == "C5" && tickerSearch !='') searchTicker();
    else if (e.range.getA1Notation() == "C5" || e.range.getA1Notation() == "C6") listTickerDisplay();
    if (e.range.getA1Notation() == "C7" && e.range.getValue() == '') listTickerDisplay();
    if (e.range.getA1Notation() == "C7" && e.range.getValue() != '') searchTicker();
    realtimePriceUpdate();
}

function onOpenTrigger() {
    try {
        deleteTriggerWithName("onOpenTrigger");
    } catch (e) {
        Logger.log("Khong xoa duoc trigger:onOpenTrigger onOpenTrigger>deleteTriggerWithName")
    };
    createTimeDrivenTriggers("onOpenTrigger",3);
    realtimePriceUpdate();
}

function createTimeDrivenTriggers(functionName, second) {
    // Trigger perper second.
    ScriptApp.newTrigger(functionName)
        .timeBased()
        .after(second*60*1000)
        .create();
}

function deleteTriggerWithName(name) {
    const trs = ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction());
    const ts = ScriptApp.getProjectTriggers();
    for (var i=trs.length-1;i>=0;i--) 
    if(trs[i]=== name) ScriptApp.deleteTrigger(ts[i]);
}

function createOnOpenTrigger(functionName)
{
        ScriptApp.newTrigger(functionName)
          .forSpreadsheet(SpreadsheetApp.getActive())
          .onOpen().create();

}
function deleteAllTrigger()
{
    ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
}
