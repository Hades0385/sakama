const {ActionRowBuilder, ButtonBuilder, ButtonStyle,EmbedBuilder} = require('discord.js');
const axios = require('axios')
const moment = require('moment')

const CWA_API = process.env.CWA_API
const prefix = process.env.PREFIX;

module.exports = {
    name: "forecast",
    aliases: ["f", "wfc"],
    run: async (message, args) => {
        const areas = area[args[0]];
        const twon = args[1];
        axios
        .get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-${areas}?Authorization=${CWA_API}&limit=1&format=JSON&locationName=${twon}`)
        .then(response => {
            let apiData = response.data.records.locations[0].location[0].weatherElement;
            let apiInfo = response.data.records.locations[0].location[0]; 

            let temp = apiData[3].time; 
            let pop6 = apiData[7].time; //六小時降雨機率
            let wx = apiData[1].time;
            let country = apiInfo.locationName
            const nowembed = new EmbedBuilder()
              .setColor('#000000')
              .setAuthor({ name: '鄉鎮天氣預報', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
              .setTitle(`${country}未來36hr天氣預報`)
              .addFields(
                { name: `${tTime(temp[0].dataTime)}`, value: `🌡️ ${temp[0].elementValue[0].value}\u00B0 C \n💧 ${pop6[0].elementValue[0].value}% \n🌦️ ${wx[0].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[1].dataTime)}`, value: `🌡️ ${temp[1].elementValue[0].value}\u00B0 C \n💧 ${pop6[0].elementValue[0].value}% \n🌦️ ${wx[1].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[2].dataTime)}`, value: `🌡️ ${temp[2].elementValue[0].value}\u00B0 C \n💧 ${pop6[1].elementValue[0].value}% \n🌦️ ${wx[2].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[3].dataTime)}`, value: `🌡️ ${temp[3].elementValue[0].value}\u00B0 C \n💧 ${pop6[1].elementValue[0].value}% \n🌦️ ${wx[3].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[4].dataTime)}`, value: `🌡️ ${temp[4].elementValue[0].value}\u00B0 C \n💧 ${pop6[2].elementValue[0].value}% \n🌦️ ${wx[4].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[5].dataTime)}`, value: `🌡️ ${temp[5].elementValue[0].value}\u00B0 C \n💧 ${pop6[2].elementValue[0].value}% \n🌦️ ${wx[5].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[6].dataTime)}`, value: `🌡️ ${temp[6].elementValue[0].value}\u00B0 C \n💧 ${pop6[3].elementValue[0].value}% \n🌦️ ${wx[6].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[7].dataTime)}`, value: `🌡️ ${temp[7].elementValue[0].value}\u00B0 C \n💧 ${pop6[3].elementValue[0].value}% \n🌦️ ${wx[7].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[8].dataTime)}`, value: `🌡️ ${temp[8].elementValue[0].value}\u00B0 C \n💧 ${pop6[4].elementValue[0].value}% \n🌦️ ${wx[8].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[9].dataTime)}`, value: `🌡️ ${temp[9].elementValue[0].value}\u00B0 C \n💧 ${pop6[4].elementValue[0].value}% \n🌦️ ${wx[9].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[10].dataTime)}`, value: `🌡️ ${temp[10].elementValue[0].value}\u00B0 C \n💧 ${pop6[5].elementValue[0].value}% \n🌦️ ${wx[10].elementValue[0].value}`, inline: true },
                { name: `${tTime(temp[11].dataTime)}`, value: `🌡️ ${temp[11].elementValue[0].value}\u00B0 C \n💧 ${pop6[5].elementValue[0].value}% \n🌦️ ${wx[11].elementValue[0].value}`, inline: true }
              )
              .setTimestamp()
              .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

            message.reply({ embeds: [nowembed] });
        }).catch(err => {
          const list = new ButtonBuilder()
              .setLabel('縣市鄉鎮名稱列表')
              .setURL('https://opendata.cwa.gov.tw/opendatadoc/Opendata_City.pdf')
              .setStyle(ButtonStyle.Link);

              const errembed = new EmbedBuilder()
              .setColor(`#ca0034`)
              .setAuthor({ name: '無法取得資訊,請檢查輸入是否正確'})
              .setDescription(`指令格式為${prefix}f <縣市> <鄉鎮> \n縣市鄉鎮請參考下方連結`)

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

function tTime(timeString) {
  const timestamp = moment(timeString, "YYYY-MM-DD HH:mm:ss").unix();
  return `<t:${timestamp}:f>`;  
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