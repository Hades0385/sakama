# Sakama
> 一個為台灣天氣資訊而設計的 Discord 機器人，提供包括每小時測站氣溫、天氣預報、降雨預估等多項功能。
## 主要功能
 - 當前鄉鎮市區氣溫
 - 鄉鎮天氣預報
 - 未來一小時降雨預估
 - 各縣市停班課訊息
 - 各縣市日出日落、月初月落時間
 - 雷達迴波圖、衛星雲圖
 - 最近有感地震報告、最近海嘯資訊
 - 當前空氣品質
 - 當前縣市紫外線等級
 - 天氣特警報、天氣概況資訊查詢
 - 太陽風與磁場資訊
 - 可見極光範圍預報
 - 颱風路徑預報

## 環境
1. 下載並安裝 [Node.js](https://nodejs.org/en) `v18` 或`更新版本`
2. 開啟 `.env.example` 檔案並將其重新命名為 `.env` 並修改配置
```env
CLIENT_TOKEN = "THIS-IS-AN-EXAMPLE" #discord機器人Token
CWA_API = THIS-IS-AN-EXAMPLE #中央氣象署APIkey
MOE_API = THIS-IS-AN-EXAMPLE #環境部APIkey
PREFIX = '$' #指令前綴
```
3. 安裝必需的依賴
```sh
$ npm install
```
### 相關連結
> [discord機器人建立教學](https://hackmd.io/@winsonOTP/discord-js-v14-ep1)
> [中央氣象署會員註冊](https://opendata.cwa.gov.tw/userLogin)
> [環境部會員註冊](https://data.moenv.gov.tw/api-term)

## 執行
在終端輸入以下指令來啟動機器人
```sh
$ node .
```

## 指令

在 Discord 聊天室中輸入 `$help` 來查看完整指令列表

## 2025.1.22更新

改進
- 簡化天氣預報查詢, 現在只需要輸入鄉鎮名即可
- 改進天氣預報圖標顯示, 根據天氣現象顯示相對應圖示
- 改進停班停課資訊顯示

更新
- 新增天氣概況查詢功能
- 新增鄉鎮天氣資訊取代原先測站資訊指令`wheather [鄉鎮名]` , 測站資訊調整為`station [測站名]`
- 新增天氣特警報資訊查詢功能
- 因應CWA天氣預報api資料格式改動及改進處理邏輯
- 原先天氣預報改為12小每小時預報另新增36小時每6小時預報
- 更新說明文件

重構
- 重構颱風路徑預報查詢功能, 將資料來源更改為CWA
- 重構紫外線查詢功能, 將資料來源更改為CWA並將查詢範圍擴大至全縣市
---

##### 專案名稱由 [@ziliang7476](https://www.instagram.com/ziliang7476/) 提供
