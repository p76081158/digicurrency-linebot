var CHANNEL_ACCESS_TOKEN = '';
var USER_ID = "";
var SheetID = "17zwlUREjtZVlOEm8l_uKxB5TRuQaj_yh3F_DVkT8XOc";
var emailAddress = "black842679513@gmail.com";
var LastRow = 501;

// push to line group
function push_message(message) {
  var postData = {
    "to": USER_ID,
    "messages": [{
      "type": "text",
      "text": message,
    }]
  };
  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  try {
    UrlFetchApp.fetch(url, options);
  }catch(error){
    MailApp.sendEmail(emailAddress, "CheckBS Faild", error.message + "\n" + message);
    push_message(message);
  }
}

// pull data from bitfinex and update google sheet
function sheetAutoUpdate(symbol,timeframe,limit) {
  var response;
  try{
    response = UrlFetchApp.fetch("https://api.bitfinex.com/v2/candles/trade:" + timeframe + ":" + symbol + "/hist?limit=" + limit, { muteHttpExceptions: true });
  }catch(error){
    MailApp.sendEmail(emailAddress, "SheetUpdateFaild for " + symbol , error.message);
    return;
  }
  switch (response.getResponseCode()) {
    case 200 :
      var result = JSON.parse(response.getContentText());
      var sheet = SpreadsheetApp.openById(SheetID).getSheetByName(symbol);
      var row = ( limit==="1" ? LastRow : parseInt(limit) + 1 );
      if (limit==="1") sheet.getRange("A" + row + ":F" + row).setValues(result);
      else sheet.getRange("A" + row + ":F2").setValues(result.reverse());
      sheet.getRange('R1').setValue(new Date());
      break;
    case 500 :
      sheetAutoUpdate(symbol,timeframe,limit);
      return;
    case 503 :
      return;
    default :
      MailApp.sendEmail(emailAddress, "SheetUpdateFaild for " + symbol + "limit=" + limit , response.getContentText());
  }
}

function CheckLock() {
  var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("LOCK");
  var lock = sheet.getRange('B1').getValue();
  return lock;
}

// check buy/sell point
function CheckBS(symbol) {
  var sheet = SpreadsheetApp.openById(SheetID).getSheetByName(symbol);
  var state = sheet.getRange('S1').getValue();
  var price = sheet.getRange('C501').getValue();
  var buypoint = sheet.getRange('P500').getValue();
  var sellpoint = sheet.getRange('Q500').getValue();
  switch(state) {
    case "SOLD":
      if (buypoint != "yes" || CheckLock() == "YES") break;
      push_message("BUY TIME! for " + symbol.substr(1,3) + " $" + price);
      break;
    case "HOLD":
      if (sellpoint != "yes") break;
      push_message("SELL TIME! for " + symbol.substr(1,3) + " $" + price);
  }
}

function LastCandles() {
  sheetAutoUpdate("tBTCUSD","3h","1");
  sheetAutoUpdate("tETHUSD","3h","1");
  sheetAutoUpdate("tXRPUSD","3h","1");
  sheetAutoUpdate("tLTCUSD","3h","1");
  sheetAutoUpdate("tZECUSD","3h","1");
  sheetAutoUpdate("tIOTUSD","3h","1");
  sheetAutoUpdate("tETCUSD","3h","1");
  sheetAutoUpdate("tXMRUSD","3h","1");
  sheetAutoUpdate("tDSHUSD","3h","1");
  sheetAutoUpdate("tEOSUSD","3h","1");
  sheetAutoUpdate("tSANUSD","3h","1");
  sheetAutoUpdate("tOMGUSD","3h","1");
  sheetAutoUpdate("tBCHUSD","3h","1");
  sheetAutoUpdate("tTRXUSD","3h","1");
}

function AllSheetUpdate() {
  sheetAutoUpdate("tBTCUSD","3h","500");
  sheetAutoUpdate("tETHUSD","3h","500");
  sheetAutoUpdate("tXRPUSD","3h","500");
  sheetAutoUpdate("tLTCUSD","3h","500");
  sheetAutoUpdate("tZECUSD","3h","500");
  sheetAutoUpdate("tIOTUSD","3h","500");
  sheetAutoUpdate("tETCUSD","3h","500");
  sheetAutoUpdate("tXMRUSD","3h","500");
  sheetAutoUpdate("tDSHUSD","3h","500");
  sheetAutoUpdate("tEOSUSD","3h","500");
  sheetAutoUpdate("tSANUSD","3h","500");
  sheetAutoUpdate("tOMGUSD","3h","500");
  sheetAutoUpdate("tBCHUSD","3h","500");
  sheetAutoUpdate("tTRXUSD","3h","500");
}

function CheckALL() { 
  CheckBS("tBTCUSD");
  CheckBS("tETHUSD");
  CheckBS("tXRPUSD");
  CheckBS("tLTCUSD");
  CheckBS("tZECUSD");
  CheckBS("tIOTUSD");
  CheckBS("tETCUSD");
  CheckBS("tXMRUSD");
  CheckBS("tDSHUSD");
  CheckBS("tEOSUSD");
  CheckBS("tSANUSD");
  CheckBS("tOMGUSD");
  CheckBS("tBCHUSD");
  CheckBS("tTRXUSD");
}