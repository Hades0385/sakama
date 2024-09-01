const {EmbedBuilder } = require('discord.js');
const axios = require('axios')

const CWA_API = process.env.CWA_API

module.exports = {
    name: "earthquake",
    aliases: ["e", "eq"],
    run: async (message, args) => {
        axios
        .get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${CWA_API}&limit=1`)
        .then(response => {
            // console.log(response.data.records.locations.location[0].time);
            let apiData = response.data.records.Earthquake[0].EarthquakeInfo;
            let apiInfo = response.data.records.Earthquake[0];
            let data = apiData.OriginTime;
            let fd = apiData.FocalDepth; //震央深度
            let nl = apiData.Epicenter.EpicenterLatitude; //北緯
            let el = apiData.Epicenter.EpicenterLongitude; //東經
            let location = apiData.Epicenter.Location
            let rm = apiInfo.ReportRemark
            let eno = apiInfo.EarthquakeNo
            let mv = apiData.EarthquakeMagnitude.MagnitudeValue
            const nowembed = new EmbedBuilder()
              .setColor('#000000')
              .setAuthor({ name: '顯著有感地震報告', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
              .setTitle(`地震編號 NO.${eno}`)
              .setDescription(`時間${data}`)
              .addFields(
                { name: '北緯', value: `${nl} `, inline: true },
                { name: '東經', value: `${el} `, inline: true },
                { name: '地點', value: `${location}`, inline: false},
                { name: '地震深度', value: `${fd} `,inline: true},
                { name: '芮氏規模', value: `${mv}`, inline: true },
                { name: '\u200B', value: `${rm}`, inline: false }
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

