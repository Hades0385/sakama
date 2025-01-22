const {ActionRowBuilder,  ButtonBuilder,  ButtonStyle,  EmbedBuilder,} = require("discord.js");
const axios = require("axios");
const moment = require('moment');

module.exports = {
  name: "weather",
  aliases: ["wt","w"],
  run: async (message, args) => {
    try{
      const dataId = await getDataId(args)
      const { year, month, day, Hour, Minute } = getDateTime();
      const time = `${year}${month}${day}${Hour}`
      const weatherData = await getWeatherData(dataId[0], time)
      const gtData = wdataToJSON(weatherData.data)[dataId[1]]
      const W50Data = await getIfonData()
      const w50 = idataToJSON(W50Data.data)[dataId[0]]
      

      let temp = gtData.C_T
      let at = gtData.C_AT
      let rh = gtData.RH
      let rain = gtData.Rain
      let sr = gtData.Sunrise
      let ss = gtData.Sunset

      let wtt = w50.Title
      let wc = contentLength(w50.Content)
      let sunBar = bar(sunPercent(sr,ss,`${Hour}:${Minute}`))
        
      const nowembed = new EmbedBuilder()
        .setColor('#000000')
        .setAuthor({ name: `${args} 天氣資訊`, iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
        .setTitle(`目前氣溫 ${temp} \u00B0 C`)
        .setDescription(`> ${wtt}  \n \`\`\`${wc}\`\`\` `)
        .addFields(
          { name: '體感溫度', value: `${at} \u00B0 C`, inline: true },
          { name: '相對溼度', value: `${rh} %`, inline: true },
          { name: '時雨量', value: `${rain} mm`, inline: true},
          { name: '日出時間', value: `${sr}(${toUnix(sr)}) `, inline: true },
          { name: '日落時間', value: `${ss}(${toUnix(ss)})`, inline: true },
          { name: '太陽位置', value: `${sunBar} `, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: '資料來源:CWA(中央氣象署)', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

      message.reply({ embeds: [nowembed] });
    }catch (error) {
      const list = new ButtonBuilder()
          .setLabel('縣市鄉鎮名稱列表')
          .setURL('https://opendata.cwa.gov.tw/opendatadoc/Opendata_City.pdf')
          .setStyle(ButtonStyle.Link);

          const errembed = new EmbedBuilder()
          .setColor(`#ca0034`)
          .setAuthor({ name: '無法取得資訊,請稍後在試'})
          .setDescription(`請檢查輸入是否正確,鄉鎮名稱請參考下列連結`)

          const row = new ActionRowBuilder()
          .addComponents(list);

          message.reply({
            embeds: [errembed],
            components: [row],
          })
        console.log(error)
    }
  },
};

async function getWeatherData(twonID, time) {
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/GT/TableData_GT_T_${twonID}.js?T=${time}`
  );
}

async function getIfonData() {
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/fcst/W50_Data.js`
  );
}

async function getTownId() {
  return axios.get(
    "https://www.cwa.gov.tw/Data/js/info/Info_Town.js?v=20200817", {headers: {'Accept-Charset': 'utf-8'}}
  );
}

function wdataToJSON(data) { //將天氣資料轉為JSON
  try {
    const gtMatch = data.match(/var\s+GT\s*=\s*({[\s\S]*?});/);
    if (gtMatch && gtMatch[1]) {
      const GT = JSON.parse(gtMatch[1].replace(/'/g, '"'));
      return GT
    } else {
      console.error("無法找到 GT 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function idataToJSON(data) { //將w50資料轉為JSON
  try {
    const jsonStr = data.replace(/^var W50_County=/, '').replace(/;$/, '').replace(/'/g, '"');
    if (jsonStr) {
      try {
        const W50_County = JSON.parse(jsonStr);
      return W50_County
      } catch (parseError) {
        console.error('JSON 解析錯誤:', parseError);
      }
    } else {
      console.error("無法找到 w50 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function tdataToJSON(data) { //將鄉鎮ID資料轉為JSON
  try {
    const itMatch = data.match(/var\s+Info_Town\s*=\s*({[\s\S]*?});/);
    if (itMatch && itMatch[1]) {
      const Info_Town = JSON.parse(itMatch[1].replace(/'/g, '"'));
      return Info_Town
    } else {
      console.error("無法找到 info_twon 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

async function findCityId(townshipName,cityData) {// 尋找鄉鎮ID
  for (const [cityCode, townships] of Object.entries(cityData)) {
      const township = townships.find(t => t.Name.C === townshipName);
      if (township) {
          return [cityCode, township.ID];
      }
  }
  return null; 
}

async function getDataId(arg) {//取得城市及鄉鎮ID
  try {
    const response = await getTownId();
    const data = response.data;
    let twonId = tdataToJSON(data);
    let dataId = findCityId(arg[0], twonId);
    return dataId;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
}

function getDateTime() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let Hour = today.getHours();
  let currentMinute = today.getMinutes();

  if (currentMinute < 0) {
      currentMinute += 60;
      Hour -= 1;
      if (Hour < 0) {
          Hour = 23;
          day -= 1;
          if (day < 1) {
              month -= 1;
              if (month < 1) {
                  year -= 1;
                  month = 12;
              }
              const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();
              day = lastDayOfPreviousMonth;
          }
      }
  }

  month = String(month).padStart(2, '0');
  day = String(day).padStart(2, '0');
  Hour = String(Hour).padStart(2, '0');
  let Minute = String(Math.floor(currentMinute / 10) * 10).padStart(2, '0');

  return {year,month,day,Hour,Minute};
}

function sunPercent(sunriseTime, sunsetTime, currentTime) {
  const parseTimeToUnix = (timeStr) => {
    return moment(timeStr, 'HH:mm').valueOf(); 
  };
  const sunriseUnix = parseTimeToUnix(sunriseTime);
  const sunsetUnix = parseTimeToUnix(sunsetTime);
  const nowUnix = parseTimeToUnix(currentTime);

  if (nowUnix < sunriseUnix) {
    return 0;
  }
  if (nowUnix > sunsetUnix) {
    return 100;
  }

  const totalDaylight = sunsetUnix - sunriseUnix;
  const elapsed = nowUnix - sunriseUnix;
  const percentage = (elapsed / totalDaylight) * 100;
  return percentage;
}

function bar(percent) {
  if (percent === 100) {
    const state = '已日落';
    return state
  }else if (percent === 0) {
    const state = '尚未日出'; 
    return state
  }else{
  const totalBlocks = 20;
  const filledBlocks = Math.floor((percent / 100) * totalBlocks); 
  const emptyBlocks = totalBlocks - filledBlocks; 
  const progressBar = '-'.repeat(filledBlocks-1) + '☀' + '-'.repeat(emptyBlocks) ;
  return progressBar
  }
}

function toUnix(timeString) {
  const timestamp = moment(timeString, "HH:mm").unix();
  return `<t:${timestamp}:R>`; 
}

function contentLength(data) {
  if (data.length > 2) {
    return data[1]
  } else {
    return data[0]
  }
}