const {ActionRowBuilder, ButtonBuilder, ButtonStyle,EmbedBuilder} = require('discord.js');
const axios = require('axios')

module.exports = {
  name: "typhoon",
  aliases: ["ty","tp"],
  run: async (message, args) => {
    axios
      .get('https://watch.ncdr.nat.gov.tw/wh/cv_typhoon_gif')
      .then((response) => {
        const data = parseHTMLData(response.data);
        const filteredData = filterData(data);
        const { year, month, day} = getDateTime();
        const tt = data[0].timestamp.split(' ')[0]

        if (filteredData.length === 0 ||( tt !== `${year}-${month}-${day}` && tt !== `${year}-${month}-${String(parseInt(day)+1).padStart(2, '0')}`)) {
          const embed = new EmbedBuilder()
          .setColor(`#000000`)
          .setAuthor({ name: "目前無颱風資訊" });
          message.reply({ embeds: [embed] });
        } else if (filteredData.length === 1) {
          const embed = createEmbed(filteredData[0]);
          message.reply({ embeds: [embed] });
        } else if (filteredData.length > 1) {
          const buttons =createButtons(filteredData);
          const row = new ActionRowBuilder().addComponents(buttons);
          const cembed = new EmbedBuilder()
            .setColor(`#000000`)
            .setAuthor({ name: "請選擇要查看的颱風路徑預報\n(此功能暫無作用,統一抓取同一資料來源)" });
          message.reply({
            embeds: [cembed],
            components: [row],
          }).then(sentMessage => {
            const filter = (interaction) => {
              return buttons.some(button => button.data.custom_id === interaction.customId) && interaction.user.id === message.author.id;
            };

            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', (interaction) => {
              const selectedTyphoon = filteredData.find(typhoon => typhoon.id === interaction.customId);
              const embed = createEmbed(selectedTyphoon);
              interaction.update({ embeds: [embed], components: [] });
            });

            collector.on('end', collected => {
              if (collected.size === 0) {
                const errembed = new EmbedBuilder()
                .setColor(`#ca0034`)
                .setAuthor({ name: "已超時" });
                sentMessage.edit({  embeds: [errembed], components: [] });
              }
            });
          });
        } else {
          const errembed = new EmbedBuilder()
          .setColor(`#ca0034`)
          .setAuthor({ name: "無法取得資訊,請稍後在試" });
          message.reply({embeds: [errembed]});
        }
      })
      .catch((error) => {
        const errembed = new EmbedBuilder()
          .setColor(`#ca0034`)
          .setAuthor({ name: "無法取得資訊,請稍後在試" });
        message.reply({
          embeds: [errembed],
        });

        console.error(error);
      });
  },
};

function parseHTMLData(htmlContent) {
    const dataStartIndex = htmlContent.indexOf("\n") + 1;
    const csvData = htmlContent.substring(dataStartIndex).trim();
  
    const lines = csvData.split("\n");
  
    const parsedData = [];
  
    lines.forEach((line) => {
      const [num, id, time, range, timestamp, cname, oname, dltimes, url] = line.split(",");
      parsedData.push({
        num: num.trim(),
        id: id.trim(),
        time: time.trim(),
        range: range.trim(),
        timestamp: timestamp.trim(),
        cname: cname.trim(),
        oname: oname.trim(),
        dltimes: dltimes.trim(),
        url: url.trim(),
      });
    });
  
    return parsedData;
}

function filterData(data) {
  const filteredData = data.filter(record => record.range === 'd2');
  
  const groupedData = filteredData.reduce((acc, record) => {
    if (!acc[record.id]) {
      acc[record.id] = record;
    } else if (new Date(record.timestamp) > new Date(acc[record.id].timestamp)) {
      acc[record.id] = record;
    }
    return acc;
  }, {});

  return Object.values(groupedData);
}

function createEmbed(typhoon) {
  const { year, month, day, Hour } = getDateTime();
  return new EmbedBuilder()
    .setAuthor({ name: '颱風資訊', iconURL: 'https://pic.616pic.com/ys_bnew_img/00/24/17/0joFE1ygYw.jpg'})
    .setTitle(`颱風 ${typhoon.cname} (${typhoon.oname}) 路徑預報`)
    .setDescription(`區域系集模式-WEPS`)
    .setColor('#000000')
    .setImage(`https://npd.cwa.gov.tw/NPD/irisme_data/grapher/gifdir/Ntrack/WRF_WEPS/${year}/WEPS_TY_PROB_${year% 100}${month}${day}${Hour}.jpg`)
    .setTimestamp()
    .setFooter({
      text: `\u2800\n資料來源：NCDR、中央氣象署`,
    });
}

function createButtons(typhoons) {
  return typhoons.map(typhoon => new ButtonBuilder()
    .setCustomId(typhoon.id)
    .setLabel(typhoon.cname)
    .setStyle(ButtonStyle.Primary));
}

function getDateTime() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let Hour = today.getHours()-20;

  if (Hour < 0) {
      Hour += 24;
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

  month = String(month).padStart(2, '0');
  day = String(day).padStart(2, '0');
  Hour = String(Math.floor(Hour / 6) * 6).padStart(2, '0');
  return {year,month,day,Hour};
  
}

function getTime() {
  const ttoday = new Date();
  let ty = ttoday.getFullYear();
  let tm = ttoday.getMonth() + 1;
  let td = ttoday.getDate();
  tm = String(tm).padStart(2, '0');
  td = String(td).padStart(2, '0');
  return {ty,tm,td}; 
}