//lay du lieu danh sach ma chung khoan
function stockListCrawl() {
    var resp = UrlFetchApp.fetch("https://fiin-core.ssi.com.vn/Master/GetListOrganization?language=vi");
    return JSON.parse(resp);
}

function stockListByEx(exchange) {
    var comGroupCode;
    if (exchange == "UPCOM") comGroupCode = "UpcomIndex";
    if (exchange == "HOSE") comGroupCode = "VNINDEX";
    if (exchange == "HNX") comGroupCode = "HNXIndex";

    var stocklist = stockListCrawl();
    let tickerList = new Array();
    for (var i = 0; i < stocklist.totalCount; i++) {
        if (stocklist.items[i].comGroupCode == comGroupCode) tickerList.push(stocklist.items[i].ticker);
    }
    return tickerList;

}

//lay du lieu theo ma chung khoan
function stockRealtimeCrawl(symbol) {
    var resp = UrlFetchApp.fetch("https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/second-tc-price?tickers=" + symbol);
    return JSON.parse(resp);
    //ex: {"data":[{"t":"AAA","fv":0.73,"mav":0.98,"nstv":0,"nstp":0.0,"rsi":62.7307,"macdv":0.00,"macdsignal":"Neutral","tsignal":"Neutral","avgsignal":"Strong Buy","ma20":9006.5,"ma50":8584.2,"ma100":7840.8,"session":0,"mw3d":2.8,"mw1m":6.8,"mw3m":36.0,"mw1y":-50.1,"rs3d":82.0,"rs1m":76.0,"rs3m":95.0,"rs1y":27.0,"rsavg":70.0,"hp1m":9290,"hp3m":9290,"hp1y":19100,"lp1m":8690,"lp3m":7070,"lp1y":5690,"hp1yp":-51.4,"lp1yp":63.3,"pe":22.8,"pb":0.6,"roe":0.030142,"oscore":3.5,"av":103500,"bv":11700,"ev":14842,"hmp":9290,"mscore":0.00,"delta1m":2.5,"delta1y":-21.5,"seq":1680249540,"vnid3d":0.8,"vnid1m":4.2,"vnid3m":5.7,"vnid1y":-28.6,"cp":9290.0,"vnipe":12.0734,"vnipb":1.58812}]}
}

//lay thong tin cong ty
function stockTickerOverview(symbol) {
    var resp = UrlFetchApp.fetch("https://apipubaws.tcbs.com.vn/tcanalysis/v1/ticker/" + symbol + "/overview");
    return JSON.parse(resp);
    // ex: {"exchange":"HOSE","shortName":"An Phát Bioplastics","industryID":150,"industryIDv2":"1353","industry":"Hóa chất","industryEn":"Chemicals","establishedYear":"2002","noEmployees":2713,"noShareholders":27697,"foreignPercent":0.020,"website":"https://anphatbioplastics.com","stockRating":3.5,"deltaInWeek":0.015,"deltaInMonth":0.025,"deltaInYear":-0.215,"outstandingShare":382.3,"issueShare":382.3,"companyType":"CT","ticker":"AAA"}
}
