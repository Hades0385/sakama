const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
  name: "aurora",
  aliases: ["au"],
  run: async (message, args) => {
    try{
      const { year, month, day, Hour, Minute } = getDateTime();
        
      const nowembed = new EmbedBuilder()
        .setColor('#000000')
        .setAuthor({ name: '太空天氣資訊', iconURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUQrirD-gIRTeGzy1m1nSTasQMSynnRdyGg&s'})
        .setTitle(`極光可見範圍預報(北半球)`)
        .setDescription(`資料時間 ${year}-${month}-${day} ${String(parseInt(Hour) + 8)}:${Minute}`)
        .setImage(`https://swoo.cwa.gov.tw/V2/img/Ovation/swoo_aurora_N_${year}-${month}-${day}_${Hour}${Minute}.jpg?ts=1721164434891`)
        .setTimestamp()
        .setFooter({ text: '資料來源:中央氣象署太空天氣作業辦公室',});

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
  let Minute = String(Math.floor(currentMinute / 5) * 5).padStart(2, '0');

  return {year,month,day,Hour,Minute};
}