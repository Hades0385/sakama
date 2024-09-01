const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');
const axios = require('axios')

const CWA_API = process.env.CWA_API

module.exports = {
    name: "suntime",
    aliases: ["s", "st"],
    run: async (message, args) => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); 
      const day = String(today.getDate()).padStart(2, '0'); 
      const todayData = `${year}-${month}-${day}`;  
      
      axios
        .get(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${CWA_API}&limit=1&format=JSON&CountyName=${args}&Date=${todayData}`)
        .then(response => {
            // console.log(response.data.records.locations.location[0].time);
            let apiData = response.data.records.locations.location[0].time[0];
            let apiInfo = response.data.records.locations.location[0];
            let data = apiData.Date;
            let fltime = apiData.BeginCivilTwilightTime;
            let lltime = apiData.EndCivilTwilightTime;
            let sunr = apiData.SunRiseTime;
            let suns = apiData.SunSetTime;
            let country = apiInfo.CountyName
            const nowembed = new EmbedBuilder()
              .setColor('#000000')
              .setAuthor({ name: '日出日落時間', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
              .setTitle(`${country}的日出日落時間`)
              .setDescription(`${data}`)
              .addFields(
                { name: '日出時間', value: `${sunr} `, inline: true },
                { name: '日落時間', value: `${suns} `, inline: true },
                { name: '\u200B', value: `\u200B`},
                { name: '第一道曙光', value: `${fltime} `,inline: true},
                { name: '最後一道屬光', value: `${lltime}`, inline: true }
              )
              .setTimestamp()
              .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

            message.reply({ embeds: [nowembed] });
        }).catch(err => {

          const list = new ButtonBuilder()
          .setLabel('縣市名稱列表')
          .setURL('https://opendata.cwa.gov.tw/opendatadoc/Opendata_City.pdf')
          .setStyle(ButtonStyle.Link);

          const errembed = new EmbedBuilder()
          .setColor(`#ca0034`)
          .setAuthor({ name: '無法取得資訊,請檢查輸入是否正確'})

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


