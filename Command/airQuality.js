const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios')

const MOE_API = process.env.MOE_API

module.exports = {
  name: "airquality",
  aliases: ["aq","air"],
  run: async (message, args) => {
    const site = sites[args[0]];
    axios
    .get(`https://data.moenv.gov.tw/api/v2/aqx_p_432?language=zh&offset=${site}&api_key=${MOE_API}`)
    .then(response => {
      let apiData = response.data.records[0]
      let dataTime = apiData.publishtime
      let sitename = apiData.sitename
      let county = apiData.county
      let aqi = apiData.aqi
      let status = apiData.status
      let so2 = apiData.so2
      let co = apiData.co
      let o3 = apiData.o3
      let pm10 = apiData.pm10
      let pm25 = apiData["pm2.5"]
      let no2 = apiData.no2


      const nowembed = new EmbedBuilder()
        .setColor(`${color[status]}`)
        .setAuthor({ name: '空氣品質資訊', iconURL: 'https://upload.wikimedia.org/wikipedia/zh/thumb/e/e4/ROC_Ministry_of_Environment_Seal.svg/150px-ROC_Ministry_of_Environment_Seal.svg.png'})
        .setTitle(`${county}/${sitename}`)
        .setDescription(`${dataTime}`)
        .addFields(
          { name: 'AQI', value: `${aqi}`,inline: true},
          { name: '狀態', value: `${status}`,inline: true},
          { name: '\u2800', value: `\u2800`,inline: false},
          { name: `PM2.5`, value: `${pm25}μg/m3`,inline: true},
          { name: `PM10`, value: `${pm10}μg/m3`,inline: true},
          { name: `臭氧`, value: `${o3}ppb`,inline: true},
          { name: `一氧化碳`, value: `${co}ppm`,inline: true},
          { name: `二氧化硫`, value: `${so2}ppb`,inline: true},
          { name: `二氧化氮`, value: `${no2}ppb`,inline: true},
        )
        .setTimestamp()
        .setFooter({ text: '環境部開放資料'});

      message.reply({ embeds: [nowembed] });
    }).catch(err => {
        const list = new ButtonBuilder()
        .setLabel('環境部空氣品質監測網')
        .setURL('https://airtw.moenv.gov.tw/')
        .setStyle(ButtonStyle.Link);

        const errembed = new EmbedBuilder()
        .setColor(`#ca0034`)
        .setAuthor({ name: '無法取得資訊,請檢查輸入是否正確'})
        .setDescription(`測站站名請參考環境部空氣品質監測網`)

        const row = new ActionRowBuilder()
        .addComponents(list);

        message.reply({
          embeds: [errembed],
          components: [row],
        })
        console.log(err)
    })
  },
};
const color = {
  "良好" : '#009865',
  "普通" : '#fffb26',
  "對敏感族群不健康" : '#ff9835',
  "對所有族群不健康" : '#ca0034',
  "非常不健康" : '#670099',
  "危害" : '#7e0123',
}
const sites = {
  "基隆" : "0" ,
  "汐止" : "1" ,
  "萬里" : "2" ,
  "新店" : "3" ,
  "土城" : "4" ,
  "板橋" : "5" ,
  "新莊" : "6" ,
  "菜寮" : "7" ,
  "林口" : "8" ,
  "淡水" : "9" ,
  "士林" : "10" ,
  "中山" : "11" ,
  "萬華" : "12" ,
  "古亭" : "13" ,
  "松山" : "14" ,
  "大同" : "15" ,
  "桃園" : "16" ,
  "大園" : "17" ,
  "觀音" : "18" ,
  "平鎮" : "19" ,
  "龍潭" : "20" ,
  "湖口" : "21" ,
  "竹東" : "22" ,
  "新竹" : "23" ,
  "頭份" : "24" ,
  "苗栗" : "25" ,
  "三義" : "26" ,
  "豐原" : "27" ,
  "沙鹿" : "28" ,
  "大里" : "29" ,
  "忠明" : "30" ,
  "西屯" : "31" ,
  "彰化" : "32" ,
  "線西" : "33" ,
  "二林" : "34" ,
  "南投" : "35" ,
  "斗六" : "36" ,
  "崙背" : "37" ,
  "新港" : "38" ,
  "朴子" : "39" ,
  "臺西" : "40" ,
  "嘉義" : "41" ,
  "新營" : "42" ,
  "善化" : "43" ,
  "安南" : "44" ,
  "臺南" : "45" ,
  "美濃" : "46" ,
  "橋頭" : "47" ,
  "仁武" : "48" ,
  "鳳山" : "49" ,
  "大寮" : "50" ,
  "林園" : "51" ,
  "楠梓" : "52" ,
  "左營" : "53" ,
  "前金" : "54" ,
  "前鎮" : "55" ,
  "小港" : "56" ,
  "屏東" : "57" ,
  "潮州" : "58" ,
  "恆春" : "59" ,
  "臺東" : "60" ,
  "花蓮" : "61" ,
  "陽明" : "62" ,
  "宜蘭" : "63" ,
  "冬山" : "64" ,
  "三重" : "65" ,
  "中壢" : "66" ,
  "竹山" : "67" ,
  "永和" : "68" ,
  "復興" : "69" ,
  "埔里" : "70" ,
  "馬祖" : "71" ,
  "金門" : "72" ,
  "馬公" : "73" ,
  "關山" : "74" ,
  "麥寮" : "75" ,
  "富貴角" : "76" ,
  "大城" : "77" ,
  "彰化" : "78" ,
  "高雄" : "79" ,
  "臺南" : "80" ,
  "屏東" : "81" ,
  "新北" : "82" ,
  "大甲" : "83" ,
  "屏東(枋山)" : "84" ,
}

