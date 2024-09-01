const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
  name: "satellite",
  aliases: ["stl"],
  run: async (message, args) => {
    try{
      const { year, month, day, Hour, Minute } = getDateTime();
        
      const nowembed = new EmbedBuilder()
        .setColor('#000000')
        .setAuthor({ name: '天氣資訊', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
        .setTitle(`衛星影像`)
        .setDescription(`資料時間 ${year}-${month}-${day} ${Hour}:${Minute}`)
        .setImage(`https://www.cwa.gov.tw/Data/satellite/LCC_IR1_CR_2750/LCC_IR1_CR_2750-${year}-${month}-${day}-${Hour}-${Minute}.jpg`)
        .setTimestamp()
        .setFooter({ text: '中央氣象署開放資料', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

      message.reply({ embeds: [nowembed] });
    }catch (error) {
      const embed = new EmbedBuilder()
        .setColor(`#ca0034`)
        .setAuthor({ name: '發生錯誤,無法取得資訊'})
      message.reply({ embeds: [embed] });
      console.log(error)
    }
  },
};

function getDateTime() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let Hour = today.getHours();
  let currentMinute = today.getMinutes() - 20;

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