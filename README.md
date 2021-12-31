# 虛擬貨幣機器人

## 介紹

透過 Google Apps Script 撰寫網路應用程式，讓此網路應用程式能夠自動抓取虛擬貨幣交易所的資料，並將抓取的資料存放於 Google 試算表，透過技術指標 (MACD) 來判斷買賣點，並用 Line Bot 通知。

## Google 試算表

* [**連結**](https://docs.google.com/spreadsheets/d/17zwlUREjtZVlOEm8l_uKxB5TRuQaj_yh3F_DVkT8XOc/edit?usp=sharing)
* **透過設定觸發條件更新試算表**
    * 每小時抓取一次資料
    * 每5分鐘更新最後一根K線

![](https://i.imgur.com/P7Enb0f.png)

## Line Bot

* **透過 Google Apps Script 撰寫 Webhook**
* **定期讀取試算表中的買賣點並主動 push 到 Line 群組**

![](https://i.imgur.com/X3wbtPp.png)
