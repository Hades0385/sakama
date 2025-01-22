const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const moment = require('moment')

module.exports = {
  name: "typhoon",
  aliases: ["ty", "tp"],
  run: async (message, args) => {
    try {
      const data = await getData();
      const dataTime = getDataTime(data.data);
      const typhoons = Object.values(typhoonData(data.data)); 
      const tt = timeCheck(dataTime)
      if (!typhoons || typhoons.length === 0 || tt == 0) {
        const embed = new EmbedBuilder()
          .setColor(`#000000`)
          .setAuthor({ name: "目前無颱風資訊" });
        return message.reply({ embeds: [embed] }); 
      } else if (typhoons.length === 1) {
        const typhoonName = typhoons[0]; 
        const url = await getUrl(typhoonName, dataTime);
        const embed = createEmbed(typhoonName, dataTime, url); 
        return message.reply({ embeds: [embed] }); 
      } else if (typhoons.length > 1) {
        const row = new ActionRowBuilder();
        for (const typhoon of typhoons) { 
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(typhoon.Name.E) 
              .setLabel(`${typhoon.Name.C} (${typhoon.Name.E})`)
              .setStyle(ButtonStyle.Primary)
          );
        }

        const cembed = new EmbedBuilder()
          .setColor('#000000')
          .setAuthor({ name: "請選擇要查看的颱風路徑預報" });

        const sentMessage = await message.reply({
          embeds: [cembed],
          components: [row],
        });

        const filter = interaction => {
          return typhoons.some(typhoon => typhoon.Name.E === interaction.customId) && interaction.user.id === message.author.id;
        };

        const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
          const selectedTyphoon = typhoons.find(typhoon => typhoon.Name.E === interaction.customId); 
          const url = await getUrl(selectedTyphoon, dataTime);
          const embed = createEmbed(selectedTyphoon, dataTime, url); 
          interaction.update({ embeds: [embed], components: [] });
        });

        collector.on('end', collected => {
          if (collected.size === 0 || reason === 'time') {
		const disabledButtons = typhoons.map(typhoon => 
		  new ButtonBuilder()
			.setCustomId(`${typhoon.Name.C} (${typhoon.Name.E})`) 
			.setLabel(typhoon.Name.E)    
			.setStyle(ButtonStyle.Primary)         
			.setDisabled(true)           
		);

		const actionRow = new ActionRowBuilder().addComponents(disabledButtons);

		const timeoutEmbed = new EmbedBuilder()
		  .setColor('#ca0034')
		  .setAuthor({ name: "已超時，請重新使用指令" });

		sentMessage.edit({ embeds: [timeoutEmbed], components: [actionRow] });
  }
        });
      } else {
        const errembed = new EmbedBuilder()
          .setColor(`#ca0034`)
          .setAuthor({ name: "無法取得資訊,請稍後再試" });
        return message.reply({ embeds: [errembed] }); 
      }

    } catch (error) {
      const errembed = new EmbedBuilder()
        .setColor(`#ca0034`)
        .setAuthor({ name: "發生錯誤" })
        .setDescription('無法取得資訊,請稍後再試');
      message.reply({ embeds: [errembed] });
      console.error(error);
    }
  },
};

async function getData() {
  return axios.get('https://www.cwa.gov.tw/Data/js/typhoon/TY_NEWS-Data.js');
}

function typhoonData(data) {
  try {
    const Match = data.match(/var\s+TYPHOON\s*=\s*({[\s\S]*?});/);
    if (Match && Match[1]) {
      const td = JSON.parse(Match[1].replace(/'/g, '"'));
      return td;
    } else {
      console.error("無法找到 typhoon 物件");
      return []; 
    }
  } catch (error) {
    console.error("請求錯誤:", error);
    return []; 
  }
}

function getDataTime(data) {
  try {
    const Match = data.match(/var\s+TY_DataTime\s*=\s*([\s\S]*?);/);
    if (Match && Match[1]) {
      const dt = Match[1].replace(/'/g, '');
      return dt;
    } else {
      console.error("無法找到 TY_DataTime 物件");
      return null; 
    }
  } catch (error) {
    console.error("請求錯誤:", error);
    return null; 
  }
}

function createEmbed(typhoonName, dataTime, url) {
	  return new EmbedBuilder()
		.setAuthor({ name: '颱風資訊', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg' })
		.setTitle(`颱風 ${typhoonName.Name.C} (${typhoonName.Name.E}) 路徑預報`)
		.setColor('#000000')
		.setImage(`${url}`) 
		.setTimestamp()
		.setFooter({ text: `資料來源:CWA` });
}

async function getUrl(typhoonName, dataTime) {
  try {
    const response = await axios.get(`https://www.cwa.gov.tw/Data/typhoon/TY_NEWS/Download_PTA_${dataTime}_${typhoonName.Name.E}_zhtw.png`, {
      responseType: 'arraybuffer', 
    });

    if (response.status === 200) {
      return `https://www.cwa.gov.tw/Data/typhoon/TY_NEWS/Download_PTA_${dataTime}_${typhoonName.Name.E}_zhtw.png`; 
    } else {
      return 'https://blog.sinapsis.agency/wp-content/uploads/2021/04/DEFINICIONES.-ERROR-404.png';
    }
  } catch (error) {
    return 'https://blog.sinapsis.agency/wp-content/uploads/2021/04/DEFINICIONES.-ERROR-404.png';
  }
}

function timeCheck(dataTime) {
  const currentDay = moment().startOf('day'); 
  const dataDay = moment(dataTime, "YYYYMMDDHHmm").startOf('day'); 

  if (dataDay.isSame(currentDay, 'day') || dataDay.isSame(currentDay.subtract(1, 'days'), 'day')) {
    return 1; 
  }

  return 0; 
}


