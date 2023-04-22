//lay du lieu danh sach ma chung khoan
function stockListCrawl() {
    //var resp = UrlFetchApp.fetch("https://fiin-core.ssi.com.vn/Master/GetListOrganization?language=en");
    //var resp = UrlFetchApp.fetch("https://iboard.ssi.com.vn/dchart/api/1.1/defaultAllStocks");
    var resp = UrlFetchApp.fetch("https://raw.githubusercontent.com/Hieule02/QLDACNTT_N5/main/data/stockList.json");
    return JSON.parse(resp);
}

function stockListByEx(exchange) {
    var comGroupCode;
    if (exchange == "UPCOM") comGroupCode = "UpcomIndex";
    if (exchange == "HOSE") comGroupCode = "VNINDEX";
    if (exchange == "HNX") comGroupCode = "HNXIndex";

    var stocklist = stockListCrawl();
    let r = new Array();
    let companyList = new Array();
    let tickerList = new Array();

    for (var i = 0; i < stocklist.totalCount; i++) {
        if (stocklist.items[i].comGroupCode == comGroupCode) {
            tickerList.push(stocklist.items[i].ticker);
            companyList.push(stocklist.items[i].organShortName);
        }
    }
    r.push(tickerList);
    r.push(companyList);
    return r;
}

//lay du lieu theo ma chung khoan
function stockRealtimeCrawl(symbol) {
    var resp = UrlFetchApp.fetch("https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/second-tc-price?tickers=" + symbol);
    return JSON.parse(resp);
}

function stockHistoryCrawl(ticker, timeStart, timeEnd) {
    var resp = UrlFetchApp.fetch("https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/bars-long-term?ticker=" + ticker +
        "&type=stock&resolution=D&from=" + timeStart + "&to=" + timeEnd);
    return JSON.parse(resp);
}

//lay thong tin cong ty
function stockTickerOverview(symbol) {
    var resp = UrlFetchApp.fetch("https://apipubaws.tcbs.com.vn/tcanalysis/v1/ticker/" + symbol + "/overview");
    return JSON.parse(resp);
}
