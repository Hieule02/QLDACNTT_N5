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
    var tickerList = new Array();
    var count = 0;
    for (var i = 0; i < 50; i++) tickerList.push(Priceboard.getRange('D' + (i + 6)).getValue());
    var realtimePrice = stockRealtimeCrawl(tickerList);
  
    var price, color, thamchieu, p;
    Logger.log(count++ + " - " + realtimePrice.data[0].cp);
    for (var i = 0; i < 50; i++) {
        tickerList.pop()
        if (Priceboard.getRange('D' + (i + 6)).isBlank()) break;
        if (realtimePrice.data[i].cp == '' || realtimePrice.data[i].cp == null) continue;

        price = parseInt(realtimePrice.data[i].cp);
        thamchieu = parseInt(realtimePrice.data[i].hmp);
        p = (price - thamchieu) * (100 / thamchieu);
        if (price == thamchieu) color = "#e78b03";
        else if (price < thamchieu) color = "#ff0017";
        else if (price > thamchieu) color = "#078c54";
        var x = 0;
        if (Priceboard.getRange('F' + (i + 6)).getValue() != "")
            x = parseInt(Priceboard.getRange('F' + (i + 6)).getValue());
        if (price == x) return;
        else if (price > x) Priceboard.getRange('F' + (i + 6) + ':I' + (i + 6)).setBackgroundRGB(255, 0, 0);
        else Priceboard.getRange('F' + (i + 6) + ':I' + (i + 6)).setBackgroundRGB(50, 205, 50);
        SpreadsheetApp.flush();

        Priceboard.getRange('F' + (i + 6)).setValue(price).setFontColor(color);
        Priceboard.getRange('G' + (i + 6)).setValue(price - thamchieu).setFontColor(color);
        Priceboard.getRange('H' + (i + 6)).setValue(p.toFixed(2) + '%').setFontColor(color);
        Priceboard.getRange('I' + (i + 6)).setValue(thamchieu).setFontColor('#e78b03');
        Priceboard.getRange('F' + (i + 6) + ':I' + (i + 6)).setBackgroundRGB(243, 243, 243);
    }
}

function updateHistoricalData() {
    var PriceChart = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PriceChart");
    PriceChart.getRange("D25:J").clearContent();
    SpreadsheetApp.flush();
    var tickerName = PriceChart.getRange('B4').getValue();
    tickerName = tickerName.toUpperCase();

    var dateOffset = (24 * 60 * 60 * 1000);
    var endDate = new Date();
    var startDate = endDate.getTime() - dateOffset * 20;
    var priceList = stockHistoryCrawl(tickerName, parseInt(startDate / 1000), parseInt(endDate / 1000));
    var data = priceList.data;

    for (var j = data.length - 1; j > 0; j--) {
        var i = data.length - 1 - j;
        var change = (data[j].close - data[j].open) * 100 / data[j].open;
        PriceChart.getRange('D' + (25 + i)).setValue(data[j].tradingDate.substring(0, 10));
        PriceChart.getRange('E' + (25 + i)).setValue(data[j].open);
        PriceChart.getRange('F' + (25 + i)).setValue(data[j].high);
        PriceChart.getRange('G' + (25 + i)).setValue(data[j].low);
        PriceChart.getRange('H' + (25 + i)).setValue(data[j].close);
        PriceChart.getRange('I' + (25 + i)).setValue(data[j].volume);
        PriceChart.getRange('J' + (25 + i)).setValue(change.toFixed(2) + "%");
    }
}

function updateTickerOverview() {
    var PriceChart = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PriceChart");
    var tickerName = PriceChart.getRange('B4').getValue();
    tickerName = tickerName.toUpperCase();
    var data = stockTickerOverview(tickerName);
    PriceChart.getRange("B6:B11").clearContent();
    //PriceChart.getRange('B6').setValue(data.shortName);
    PriceChart.getRange('B7').setValue(data.shortName);
    PriceChart.getRange('B8').setValue(data.exchange);
    PriceChart.getRange('B9').setValue(data.establishedYear);
    PriceChart.getRange('B10').setValue(data.website);
    PriceChart.getRange('B11').setValue(data.stockRating);
}
