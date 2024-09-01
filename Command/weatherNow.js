const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const axios = require('axios')

const CWA_API = process.env.CWA_API

module.exports = {
    name: "weather",
    aliases: ["w", "wn"],
    run: async (message, args) => {
        axios
        .get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${CWA_API}&limit=1&StationName=${args}`)
        .then(response => {
            let apiData = response.data.records.Station[0].WeatherElement;
              let apiInfo = response.data.records.Station[0];
              let currentTemp = apiData.AirTemperature;
              let wind = apiData.WindSpeed;
              let pressure = apiData.AirPressure;
              let cloudness = apiData.Weather;
              let country = apiInfo.StationName;
              let rh = apiData.RelativeHumidity;
              let tempH = apiData.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature;
              let tempL = apiData.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature;
              let at = calculateWindChill(currentTemp, wind ,rh)
              let iconurl = Wx_icon_url[cloudness]
              const nowembed = new EmbedBuilder()
                .setColor('#000000')
                .setAuthor({ name: '天氣資訊', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
                .setTitle(`${country}目前氣溫 ${currentTemp}\u00B0 C`)
                .addFields(
                  { name: '天氣概況', value: `${cloudness}`, inline: false },
                  { name: '體感溫度', value: `${at} \u00B0 C`, inline: true },
                  { name: '今日觀測最高溫', value: `${tempH} \u00B0 C`, inline: true},
                  { name: '今日觀測最低溫', value: `${tempL} \u00B0 C`, inline: true },
                  { name: '風速', value: `${wind} m/s`, inline: true },
                  { name: '氣壓', value: `${pressure} hpa`, inline: true },
                  { name: '相對溼度', value: `${rh} %`, inline: true },
                )
                .setThumbnail(iconurl)
                .setTimestamp()
                .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

            message.reply({ embeds: [nowembed] });
            if (currentTemp >= 32){
              message.channel.send({ embeds: [tempembed] });
            }
        }).catch(err => {
          axios
          .get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${CWA_API}&limit=1&StationName=${args}`)
          .then(response => {
              let apiData = response.data.records.Station[0].WeatherElement;
              let apiInfo = response.data.records.Station[0];
              let currentTemp = apiData.AirTemperature;
              let wind = apiData.WindSpeed;
              let pressure = apiData.AirPressure;
              let cloudness = apiData.Weather;
              let country = apiInfo.StationName;
              let rh = apiData.RelativeHumidity;
              let vb = apiData.VisibilityDescription;
              let uv = apiData.UVIndex;
              let tempH = apiData.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature;
              let tempL = apiData.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature;
              let at = calculateWindChill(currentTemp, wind ,rh)
              let iconurl = Wx_icon_url[cloudness]
              const nowembed = new EmbedBuilder()
                .setColor('#000000')
                .setAuthor({ name: '天氣資訊', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
                .setTitle(`${country}目前氣溫 ${currentTemp}\u00B0 C`)
                .addFields(
                  { name: '天氣概況', value: `${cloudness}`, inline: false },
                  { name: '體感溫度', value: `${at} \u00B0 C`, inline: true },
                  { name: '今日觀測最高溫', value: `${tempH} \u00B0 C`, inline: true},
                  { name: '今日觀測最低溫', value: `${tempL} \u00B0 C`, inline: true },
                  { name: '風速', value: `${wind} m/s`, inline: true },
                  { name: '氣壓', value: `${pressure} hpa`, inline: true },
                  { name: '相對溼度', value: `${rh} %`, inline: true },
                  { name: '能見度', value: `${vb} km`, inline: true },
                  { name: '紫外線', value: `${uv} 級`, inline: true },
                )
                .setThumbnail(iconurl)
                .setTimestamp()
                .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });
  
              message.reply({ embeds: [nowembed] });
              if (currentTemp >= 32){
                message.channel.send({ embeds: [tempembed] });
              }
          }).catch(err => {
              const list = new ButtonBuilder()
              .setLabel('測站站名列表')
              .setURL('https://e-service.cwa.gov.tw/wdps/obs/state.htm')
              .setStyle(ButtonStyle.Link);

              const errembed = new EmbedBuilder()
              .setColor(`#ca0034`)
              .setAuthor({ name: '無法取得資訊,請檢查輸入是否正確'})
              .setDescription(`測站站名請參考下方連結`)

              const row = new ActionRowBuilder()
              .addComponents(list);

              message.reply({
                embeds: [errembed],
                components: [row],
              })
              console.log(err)
          })
        })
    },
  };


  const Wx_icon_url = {
    "多雲": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/67aaf9dbe30989c25cbde6c6ec099213.png",
    "晴時多雲": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/67aaf9dbe30989c25cbde6c6ec099213.png",
    "晴": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/575900edccbc7def167f7874c02aeb0b.png",
    "陰": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/66117fab0f288a2867b340fa2fcde31b.png",
    "陰有雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/a55fef55bbeb0762a8dd329b4b8ad342.png",
    "陣雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/4417bf88c7bbcd8e24fb78ee6479b362.png",
    "陰有雷雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
    "陰有雷": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
    "小雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/00171e3b54b97dee8c1a2f6a62272640.png",
    "陣雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/e95fb90fc5a4aac111be78770921beb1.png",
    "雷陣雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
    "濃霧": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/d35bb25d12281cd9ee5ce78a98cd2aa7.png",
    "大雷雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/efffb1e26f6de5bf5c8adbd872a2933a.png",
    "大雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/451d37e6cea3af4a568110863a1adcf7.png",
    "豪雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/451d37e6cea3af4a568110863a1adcf7.png",
    "暴風雨": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/451d37e6cea3af4a568110863a1adcf7.png",
    "風雪": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/e95fb90fc5a4aac111be78770921beb1.png",
    "冰雹": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/9189cb49e806d1ebfeed24f33367143c.png",
    "多雲有霾": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/73ae8300a30e895e3739cd50ade0dfe1.png",
    "沙塵暴": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/ad9e41c68b6a2671d2bcd843be1baa86.png",
    "乾燥": "https://help.apple.com/assets/64067987823C71654C27CD1A/64067990823C71654C27CD47/zh_TW/ad9e41c68b6a2671d2bcd843be1baa86.png"
  }

  function calculateWindChill(temperature, windSpeedMs, relativeHumidity) {
    // 計算水氣壓
    var e = (relativeHumidity / 100) * 6.105 * Math.exp((17.27 * temperature) / (237.7 + temperature));
    
    // 計算體感溫度
    var apparentTemperature = 1.04 * temperature + 0.2 * e - 0.65 * windSpeedMs - 2.7;
    
    // 四捨五入體感溫度到小數第一位
    apparentTemperature = Math.round(apparentTemperature * 10) / 10;
    
    return apparentTemperature;
}

const tempembed = new EmbedBuilder()
  .setColor('#000000')
  .setAuthor({ name: '⚠高溫警告'})
  .setDescription(`天氣高溫炎熱，避免非必要的戶外活動、勞動及運動，注意防曬、多補充水份、慎防熱傷害。室內保持通風及涼爽，建議採取人體或環境降溫的方法，如搧風或利用冰袋降溫等。關懷老人、小孩、慢性病人、肥胖、服用藥物者、弱勢族群、戶外工作或運動者，遠離高溫環境。`)