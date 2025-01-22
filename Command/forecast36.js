const {ActionRowBuilder, ButtonBuilder, ButtonStyle,EmbedBuilder} = require('discord.js');
const axios = require('axios')
const moment = require('moment')

const CWA_API = process.env.CWA_API;

module.exports = {
    name: "forecast36",
    aliases: ["f36", "wfc36"],
    run: async (message, args) => {
        let areas,twon;
        if (args.length === 2) {
            areas = area[args[0]];
            twon = args[1];
        } else {
            areas = area[findCity(args[0])];
            twon = args[0];
        }  
        if ((findCity(args[0]) === null && args.length === 1)||( !area[args[0]] && args.length === 2)) {
          const list = new ButtonBuilder()
          .setLabel('縣市鄉鎮名稱列表')
          .setURL('https://opendata.cwa.gov.tw/opendatadoc/Opendata_City.pdf')
          .setStyle(ButtonStyle.Link);

          const errembed = new EmbedBuilder()
          .setColor(`#ca0034`)
          .setAuthor({ name: '❌無效的鄉鎮名'})
          .setDescription(`鄉鎮名稱請參考下方連結`)

          const row = new ActionRowBuilder()
          .addComponents(list);

          message.reply({
            embeds: [errembed],
            components: [row],
          })
        }else {
          try {
              let response = await getData(areas,twon)
              let apiData = response.data.records.Locations[0].Location[0].WeatherElement;
              let apiInfo = response.data.records.Locations[0].Location[0]; 
            //24/12/10更新格式
              let temp = apiData[0].Time; 
              let ci = apiData[4].Time;
              let pop3 = apiData[7].Time; //每三小時降雨機率
              let wx = apiData[8].Time;
              let country = apiInfo.LocationName
              const nowembed = new EmbedBuilder()
                .setColor('#000000')
                .setAuthor({ name: '鄉鎮天氣預報', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
                .setTitle(`${country}未來36hr天氣預報`)
                .setTimestamp()
                .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });
              let t = timeCheck(temp[0].DataTime)
                for (let i = 0 ; i < 36 ; i += 6){
                  nowembed
                  .addFields(
                    { name: `${tTime(temp[t+i].DataTime)}`, value: `🌡️ ${temp[t+i].ElementValue[0].Temperature}\u00B0 C \`${ci[t+i].ElementValue[0].ComfortIndexDescription}\` \n💧 ${pop3[Math.floor(t+i / 3)].ElementValue[0].ProbabilityOfPrecipitation}% \n${icon[wx[Math.floor(t+i / 3)].ElementValue[0].Weather]} ${wx[Math.floor(t+i / 3)].ElementValue[0].Weather}`, inline: true },
                  )
                }
              message.reply({ embeds: [nowembed] });
          }catch(error) {
                const errembed = new EmbedBuilder()
                .setColor(`#ca0034`)
                .setAuthor({ name: '發生錯誤,無法取得資訊'})
                .setDescription(`遇到非預期錯誤,請稍後再試`)

                message.reply({
                  embeds: [errembed],
                })
              console.log(error)
          }
        }
    },
  };

async function getData(areas,twon) {
  return axios.get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${areas}?Authorization=${CWA_API}&limit=1&format=JSON&LocationName=${twon}`)
}

function tTime(timeString) {
  const timestamp = moment(timeString, "YYYY-MM-DD HH:mm:ss").unix();
  return `<t:${timestamp}:d><t:${timestamp}:t>`;  
}

const area = {
    "宜蘭縣" : "001" ,
    "桃園市" : "005" ,
    "新竹縣" : "009" ,
    "苗栗縣" : "013" ,
    "彰化縣" : "017" ,
    "南投縣" : "021" ,
    "雲林縣" : "025" ,
    "嘉義縣" : "029" ,
    "屏東縣" : "033" ,
    "臺東縣" : "037" ,
    "花蓮縣" : "041" ,
    "澎湖縣" : "045" ,
    "基隆市" : "049" ,
    "新竹市" : "053" ,
    "嘉義市" : "057" ,
    "臺北市" : "061" ,
    "高雄市" : "065" ,
    "新北市" : "069" ,
    "臺中市" : "073" ,
    "臺南市" : "077" ,
    "連江縣" : "081" ,
    "金門縣" : "085" ,
};

const cityName ={
  '臺北市': ['中正區', '大同區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  '新北市': ['板橋區', '三峽區', '新店區', '中和區', '永和區', '三重區', '汐止區', '樹林區', '鶯歌區', '土城區', '蘆洲區', '五股區', '八里區', '淡水區', '三芝區', '石門區'],
  '臺中市': ['中區', '東區', '南區', '西區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '大里區', '太平區', '大雅區', '潭子區', '大肚區', '龍井區', '霧峰區', '烏日區', '大甲區', '清水區', '沙鹿區', '梧棲區', '大安區'],
  '臺南市': ['中區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '小港區'],
  '高雄市': ['楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '苓雅區', '前金區', '前鎮區', '小港區', '大寮區', '大樹區', '大社區', '仁武區', '鳥松區', '岡山區', '路竹區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區', '林園區', '茄萣區', '旗山區', '美濃區', '內門區', '杉林區', '甲仙區', '六龜區', '三民區', '龍巖區'],
  '基隆市': ['仁愛區', '信義區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
  '桃園市': ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '大溪區', '龍潭區', '大園區', '龜山區'],
  '新竹市': ['東區', '北區', '香山區'],
  '新竹縣': ['竹北市', '湖口鄉', '新豐鄉', '新埔鎮', '關西鎮', '芎林鄉', '橫山鄉', '五峰鄉', '寶山鄉', '竹東鎮', '尖石鄉', '北埔鄉', '峨眉鄉'],
  '苗栗縣': ['苗栗市', '苑裡鎮', '通霄鎮', '竹南鎮', '頭份鎮', '後龍鎮', '三義鄉', '西湖鄉', '公館鄉', '大湖鄉', '泰安鄉', '造橋鄉', '三灣鄉', '南庄鄉', '頭屋鄉', '獅潭鄉', '卓蘭鎮'],
  '彰化縣': ['彰化市', '鹿港鎮', '和美鎮', '伸港鄉', '福興鄉', '秀水鄉', '花壇鄉', '芬園鄉', '大村鄉', '埔心鄉', '埔鹽鄉', '田中鎮', '田尾鄉', '社頭鄉', '二林鎮', '大城鄉', '小港鄉', '溪州鄉'],
  '南投縣': ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '中寮鄉', '南投鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'],
  '嘉義市': ['東區', '西區'],
  '嘉義縣': ['太保市', '朴子市', '布袋鎮', '阿里山鄉', '梅山鄉', '大埔鄉', '中埔鄉', '溪口鄉', '六腳鄉', '水上鄉', '鹿草鄉', '中埔鄉', '大林鎮'],
  '雲林縣': ['斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '大埤鄉', '褒忠鄉', '東勢鄉', '臺西鄉', '崙背鄉', '麥寮鄉', '林內鄉', '二崙鄉', '西螺鎮', '北港鎮', '元長鄉', '四湖鄉', '口湖鄉', '水林鄉'],
  '臺南縣': ['南化鄉', '安南區', '安平區', '東區', '北區', '中西區', '安南區', '永康區', '歸仁鄉', '新化鄉', '左鎮鄉', '玉井鄉', '楠西鄉', '仁德鄉', '關廟鄉', '龍崎鄉', '官田鄉', '麻豆鄉', '佳里鎮', '西港鄉', '七股鄉', '將軍鄉', '學甲鄉', '北門鄉', '新營市', '後壁鄉', '白河鄉', '東山鄉', '六甲鄉', '小港區'],
  '高雄縣': ['岡山鎮', '路竹鎮', '梓官鎮', '彌陀鎮', '永安鄉', '湖內鄉', '鳳山區', '仁武鄉', '鳥松鄉', '大社鄉', '大樹鄉', '旗山鎮', '美濃鎮', '內門鄉', '杉林鄉', '甲仙鄉', '六龜鄉', '三民區', '龍巖鄉'],
  '屏東縣': ['屏東市', '三地門鄉', '霧臺鄉', '瑪家鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉', '長治鄉', '麟洛鄉', '竹田鄉', '內埔鄉', '萬丹鄉', '潮州鎮', '南州鄉', '東港鎮', '恆春鎮', '墾丁', '車城鄉', '滿州鄉', '枋寮鄉', '枋山鄉', '新園鄉', '九棚鄉', '林邊鄉'],
  '宜蘭縣': ['宜蘭市', '羅東鎮', '蘇澳鎮', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'],
  '花蓮縣': ['花蓮市', '鳳林鎮', '玉里鎮', '豐濱鄉', '壽豐鄉', '光復鄉', '新城鄉', '吉安鄉', '卓溪鄉', '瑞穗鄉', '萬榮鄉', '鯉魚潭'],
  '臺東縣': ['臺東市', '成功鎮', '關山鎮', '卑南鄉', '鹿野鄉', '池上鄉', '東河鄉', '長濱鄉', '太麻里鄉', '綠島鄉', '蘭嶼鄉'],
  '澎湖縣': ['馬公市', '湖西鄉', '白沙鄉', '南竿鄉', '北竿鄉', '東引鄉'],
  '金門縣': ['金城鎮', '金湖鎮', '金寧鄉', '金南鄉', '金東鄉', '烈嶼鄉', '烏丘鄉'],
  '連江縣': ['南竿鄉', '北竿鄉', '東引鄉', '莒光鄉', '馬祖鄉']
};

function findCity(areas) {
  for (const county in cityName) {
    if (cityName[county].includes(areas)) {
      return county;
    }
  }
  return null;
}

const icon = {
  '晴':':sunny:',
  '多雲':':partly_sunny:',
  '午後短暫雷陣雨':':sunny: -> :thunder_cloud_rain:',
  '短暫陣雨':':cloud_rain:',
  '陣雨':':cloud_rain:',
  '短暫陣雨或雷雨':':cloud_rain:/:thunder_cloud_rain:',
  '陰':':cloud:',
  '陣雨或雷雨':':cloud_rain:/:thunder_cloud_rain:',
  '短暫雨':':cloud_rain:',
}

function timeCheck(time) {
  const timestamp = moment(time, "YYYY-MM-DD HH:mm:ss");
  const hours = timestamp.hours();
  let currentHour = moment().hour();
  let i = currentHour - hours + 1;
  return i;
}