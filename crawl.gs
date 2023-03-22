//lay du lieu danh sach ma chung khoan
function stockListCrawl()
{
   var resp = UrlFetchApp.fetch("https://fiin-core.ssi.com.vn/Master/GetListOrganization?language=vi");
   return resp.getContentText();
}


//lay du lieu theo ma chung khoan
function stockRealtimeCrawl(symbol)
{
   var resp = UrlFetchApp.fetch("https://apipubaws.tcbs.com.vn/stock-insight/v1/stock/second-tc-price?tickers=" + symbol);
   return resp.getContentText();

}
