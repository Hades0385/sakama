const { EmbedBuilder } = require('discord.js');
const axios = require('axios')
const moment = require('moment')

const CWA_API = process.env.CWA_API

module.exports = {
    name: "solarwind",
    aliases: ["sw",],
    run: async (message, args) => {
      try {
        const response = await axios.get(`https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json`);
        const data = response.data[response.data.length - 1];
        const time = data[0];
        const density = data[1];
        const speed = data[2];
        const temp = data[3];
        const rp = await axios.get(`https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json`)
        const nt = rp.data[rp.data.length - 1][6];
  
        const { year, month, day, Hour, Minute } = getDateTime();
  
        const nowEmbed = new EmbedBuilder()
          .setColor('#000000')
          .setAuthor({ name: '太空天氣資訊', iconURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUQrirD-gIRTeGzy1m1nSTasQMSynnRdyGg&s'})
          .setTitle('太陽風與磁場')
          .setDescription(`資料時間 ${tTime(time)} UTC+0`)
          .addFields(
            { name: '行星際磁場', value: `${nt}nT`, inline: true },
            { name: '太陽風風速', value: `${speed}公里/秒`, inline: true },
            { name: '太陽風密度', value: `${density}個/立方公分`, inline: true },
            { name: '質子溫度', value: `${temp}K`, inline: true },
            { name: '圖片資料說明(上到下)', value: '行星際磁場 | 太陽風密度 | 太陽風速度 | 質子溫度', inline: false },
          )
          .setImage(`https://www.ngdc.noaa.gov/dscovr/plots/dscovr_1day_plots/${year}/${month}/${year}${month}${day-1}-day.png`)
          .setTimestamp()
          .setFooter({ text:'資料來源: NOAA/DSCOVR資料中心'});
  
        message.reply({ embeds: [nowEmbed] });
  
      } catch (error) {
        console.error(error);
        const embed = new EmbedBuilder()
        .setColor(`#ca0034`)
        .setAuthor({ name: '發生錯誤,無法取得資訊'})
        message.reply({ embeds: [embed] });
      }
    },
  };

function getDateTime() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let Hour = today.getHours() - 8;
  let currentMinute = today.getMinutes() - 10;

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

function tTime(timeString) {
  const timestamp = moment(timeString, "YYYY-MM-DD HH:mm:ss.SSS").unix();
  return `<t:${timestamp}:f>`;  
}
