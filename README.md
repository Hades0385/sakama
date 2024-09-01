# Sakama
> 一個為台灣天氣資訊而設計的 Discord 機器人，提供包括每小時測站氣溫、天氣預報、降雨預估等多項功能。
## 特色
 - 當前測站氣溫
 - 鄉鎮天氣預報
 - 未來一小時降雨預估
 - 各縣市停班課訊息
 - 各縣市日出日落、月初月落時間
 - 雷達迴波圖、衛星雲圖
 - 最近有感地震報告
 - 當前空氣品質
 - 當前縣市紫外線等級
 - 最近海嘯資訊
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

---

##### 專案名稱由 [@ziliang7476](https://www.instagram.com/ziliang7476/) 提供
