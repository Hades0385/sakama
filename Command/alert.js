const { EmbedBuilder } = require('discord.js');
const axios = require("axios");
const moment = require('moment');

module.exports = {
  name: "alert",
  aliases: ["wa","a"],
  run: async (message, args) => {
    try{
      const data = await getAlertData();
      const warnData = dataToJson(data.data);

      const nowembed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle(`⚠️ 天氣特警報`)
        .setTimestamp()
        .setFooter({ text: '資料來源:CWA', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });

        if (!warnData || Object.keys(warnData).length === 0) {
          nowembed.setDescription(`\n目前無發布警報`);
        } else {
          for (const key in warnData) {
            if (warnData.hasOwnProperty(key)) {
              const alert = warnData[key].C; 
              nowembed.addFields(
                { name: `${alert.title}`, value: `\`\`\`${alert.content}\`\`\` 發布時間:${unixTme(alert.issued)} | 有效時間:${unixTme(alert.validto)}\n\u2800`, inline: false },
              );
            }
          }
        }

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

async function getAlertData() {
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/warn/Warning_Content.js`
  );
}

function dataToJson(data) { 
  try {
    const wcMatch = data.match(/var\s+WarnContent\s*=\s*({[\s\S]*?});/);
    if (wcMatch && wcMatch[1]) {
      const WC = JSON.parse(wcMatch[1].replace(/'/g, '"'));
      return WC
    } else {
      console.error("無法找到 WarnContent 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function unixTme(timeString) {
  const timestamp = moment(timeString, "YYYY-MM-DD HH:mm").unix();
  return `<t:${timestamp}:f>`;  
}