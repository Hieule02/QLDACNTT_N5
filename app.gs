function listTickerDisplay() {
    var exchangeSelectCell = 'C5';
    var Priceboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Priceboard");
    var exchange = Priceboard.getRange(exchangeSelectCell).getValue();
    var page = Priceboard.getRange('C6').getValue();
    var status = Priceboard.getRange('C8');
    status.setValue('Updating...').setFontColor('red');
    Priceboard.getRange('D6:I').clearContent();
    SpreadsheetApp.flush();

    var tickerList = stockListByEx(exchange);
    for (var i = 0; i < 50; i++) {
        Priceboard.getRange('D' + (i + 6)).setValue(tickerList[0][50 * (page - 1) + i]);
        Priceboard.getRange('E' + (i + 6)).setValue(tickerList[1][50 * (page - 1) + i]);
    }
    status.setValue('Done!').setFontColor("green");
}

function searchTicker() {
    var exchangeSelectCell = 'C5';
    var searchCell = 'C7';
    var Priceboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Priceboard");
    var exchange = Priceboard.getRange(exchangeSelectCell).getValue();
    var status = Priceboard.getRange('C8');
    var tickerName = Priceboard.getRange(searchCell).getValue();
    tickerName = tickerName.toUpperCase();
    status.setValue('Dang tim kiem...').setFontColor('red');
    Priceboard.getRange('D6:I').clearContent();
    SpreadsheetApp.flush();

    var tickerList = stockListByEx(exchange);
    var count = 0;
    for (var i = 0; i < tickerList[0].length; i++) {
        if (tickerList[0][i].includes(tickerName)) {
            Priceboard.getRange('D' + (count + 6)).setValue(tickerList[0][i]);
            Priceboard.getRange('E' + (count + 6)).setValue(tickerList[1][i]);
            count++;
        }
    }
    if (Priceboard.getRange('D' + (6)).getValue() == '') status.setValue('Khong tim thay!').setFontColor("red");
}


function realtimePriceUpdate() {
    var Priceboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Priceboard");

    for (;;) {
        Utilities.sleep(1 * 1000);
        Priceboard.getRange('F5').setNote("dang cap nhat gia");
        SpreadsheetApp.flush();
        var tickerList = new Array();
        for (var i = 0; i < 50; i++) tickerList.push(Priceboard.getRange('D' + (i + 6)).getValue());

        var realtimePrice = stockRealtimeCrawl(tickerList);
        var price, color, thamchieu, p;
        for (var i = 0; i < 50; i++) {
            if (Priceboard.getRange('D' + (i + 6)).isBlank()) break;
            if (realtimePrice.data[i].cp == '' || realtimePrice.data[i].cp == null) continue;

            price = parseInt(realtimePrice.data[i].cp);
            thamchieu = parseInt(realtimePrice.data[i].hmp);
            p = (price - thamchieu) * (100 / thamchieu);
            if (price == thamchieu) color = "#e78b03";
            else if (price < thamchieu) color = "#ff0017";
            else if (price > thamchieu) color = "#078c54";
            var x = parseInt(Priceboard.getRange('F' + (i + 6)).getValue());
            if (price == x) continue;
            else if (price > x) Priceboard.getRange('F' + (i + 6) + ':I' + (i + 6)).setBackgroundRGB(255, 0, 0);
            else if (true) Priceboard.getRange('F' + (i + 6) + ':I' + (i + 6)).setBackgroundRGB(50, 205, 50);
            SpreadsheetApp.flush();
            Priceboard.getRange('F' + (i + 6) + ':I' + (i + 6)).setBackgroundRGB(243,243,243);
            SpreadsheetApp.flush();

            
            Priceboard.getRange('F' + (i + 6)).setValue(price).setFontColor(color);
            Priceboard.getRange('G' + (i + 6)).setValue(price - thamchieu).setFontColor(color);
            Priceboard.getRange('H' + (i + 6)).setValue(p.toFixed(2) + '%').setFontColor(color);
            Priceboard.getRange('I' + (i + 6)).setValue(thamchieu).setFontColor('#e78b03');
        }
        Priceboard.getRange('F5').setNote("done");
        SpreadsheetApp.flush();
    }
}
