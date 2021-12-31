var CHANNEL_ACCESS_TOKEN = '';
var SheetID = "17zwlUREjtZVlOEm8l_uKxB5TRuQaj_yh3F_DVkT8XOc";
var SymbolList = "BTC,ETH,XRP,LTC,ZEC,IOT,ETC,XMR,DSH,EOS,SAN,OMG,BCH,TRX";
var emailAddress = "black842679513@gmail.com";

function CheckSymbol(symbol) {
  var sarray = SymbolList.split(",");
  for (var i in sarray) {
    if (symbol === sarray[i]) return true;
  }
  return false;
}

function Lock(state) {
  var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("LOCK");
  sheet.getRange('B1').setValue(state);
}

function Reply(token,message) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var options = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': token,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),     
  };
  try{
    UrlFetchApp.fetch(url, options);
  }catch(error){
    MailApp.sendEmail(emailAddress, "Line Replay Error", error.message);
    UrlFetchApp.fetch(url, options);
  }
  
  /*
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': token,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),
  });*/
  //return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function AllState() {
  var sarray = SymbolList.split(",");
  var message = "";
  for (var i in sarray) {
    var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("t" + sarray[i] + "USD");
    message = message + sarray[i] + ":" + sheet.getRange('S1').getValue() + "\n";  
  }
  return message;
}
/*
//抓取IP位置
function doGet(e) {
  return ContentService.createTextOutput("Hello world");
}
*/
//處理Line server傳進來訊息，再送出訊息到用戶端
function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  if (user_message.charAt(0) === '!') {
    var message = user_message.split(" ");
    switch (message[0]) {
      default:
        user_message = "unknown cmd";
        break;
      case "!buy":
        if (!CheckSymbol(message[1])) {
          user_message = "unknown symbol";
          break;
        }
        var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("t" + message[1] + "USD");
        sheet.getRange('S1').setValue("HOLD");
        user_message = "success";
        Lock("YES");
        break;
      case "!sell":
        if (!CheckSymbol(message[1])) {
          user_message = "unknown symbol";
          break;
        }
        var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("t" + message[1] + "USD");
        sheet.getRange('S1').setValue("SOLD");
        user_message = "success";
        Lock("NO");
        break;
      case "!current":
        user_message = AllState();
        break;
      case "!cmd":
        user_message = "!buy symbol\n!sell symbol\n!current";
        break;
      case "!id":
        user_message = JSON.parse(e.postData.contents).events[0].source.groupId;
    }
  }
  else return;
  Reply(reply_token,user_message);
}
