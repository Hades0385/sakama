const { EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
  name: "weatherinfo",
  aliases: ["wi","winfo"],
  run: async (message, args) => {
    try{
      const data = await getWeatherInfo();
      const infoData = dataToJson(data.data);
      
      let title = infoData.Title
      let content = infoData.Content

      const nowembed = new EmbedBuilder()
        .setColor('#000000')
        .setAuthor({ name: '天氣概況', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
        .setTitle(`${title[1]}`)
        .setDescription(`${title[2]}\n${title[3]}`)
        .setTimestamp()
        .setFooter({ text: '資料來源:CWA', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/ROC_Central_Weather_Bureau.svg/1200px-ROC_Central_Weather_Bureau.svg.png' });
      
        for (let i = 0 ; i < content.length ; i += 1){
          nowembed
          .addFields(
            { name: `\u2800`, value: `\`\`\`${content[i]}\`\`\``, inline: false },
          )
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

async function getWeatherInfo(){
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/fcst/W01_Data.js`
  );
}

function dataToJson(data) {
  try {
    const jsonStr = convertToHalfWidth(data).replace(/^var W01_TXT=/, '').replace(/;$/, '').replace(/'/g, '"');
    if (jsonStr) {
      try {
        const W01_TXT = JSON.parse(jsonStr);
      return W01_TXT
      } catch (parseError) {
        console.error('JSON 解析錯誤:', parseError);
      }
    } else {
      console.error("無法找到 w01 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function convertToHalfWidth(str) {
  return str.replace(/[！-～]/g, function(char) {
      return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
  });
}