const {EmbedBuilder } = require('discord.js');
const axios = require('axios')

const CWA_API = process.env.CWA_API

module.exports = {
  name: "tsunami",
  aliases: ["t", "ts"],
  run: async (message, args) => {
    axios
    .get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0014-001?Authorization=${CWA_API}&limit=1`)
    .then(response => {
      // console.log(response.data.records.locations.location[0].time);
      let apiData = response.data.records.Tsunami[0].EarthquakeInfo;
      let apiInfo = response.data.records.Tsunami[0];
      let data = apiData.OriginTime;
      let source = apiData.Source;
      let fd = apiData.FocalDepth; //震央深度
      let nl = apiData.Epicenter.EpicenterLatitude; //北緯
      let el = apiData.Epicenter.EpicenterLongitude; //東經
      let location = apiData.Epicenter.Location
      let eno = apiInfo.TsunamiNo //編號
      let rno = apiInfo.ReportNo
      let mv = apiData.EarthquakeMagnitude.MagnitudeValue
      const nowembed = new EmbedBuilder()
        .setColor('#000000')
        .setAuthor({ name: '海嘯資訊', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
        .setTitle(`海嘯編號 NO.${eno}`)
        .setDescription(`${apiInfo.ReportContent}`)
        .addFields(
          { name: '發布時間', value: `${data} `, inline: true },
          { name: '資訊來源', value: `${source} `, inline: true },
          { name: '報告編號', value: `${rno} `, inline: true },
          { name: '北緯', value: `${nl} `, inline: true },
          { name: '東經', value: `${el} `, inline: true },
          { name: '地點', value: `${location}`, inline: false},
          { name: '地震深度', value: `${fd}km `,inline: true},
          { name: '芮氏規模', value: `${mv}`, inline: true },
        )
        .setImage(apiInfo.ReportImageURI)
        .setTimestamp()
        .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

      message.reply({ embeds: [nowembed] });
    }).catch(err => {
      const embed = new EmbedBuilder()
        .setColor(`#ca0034`)
        .setAuthor({ name: '發生錯誤,無法取得資訊'})
      message.reply({ embeds: [embed] });
      console.log(err)
    })
  },
};

