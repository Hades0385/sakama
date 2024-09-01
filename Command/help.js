const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const axios = require('axios')

const prefix = process.env.PREFIX;

module.exports = {
  name: "help",
  aliases: ["help"],
  run: async (message, args) => {
    try {
      const commands = [
        { name: '`weather <測站站名>`', value: '查詢當前天氣資訊', inline: true },
        { name: '`forecast <縣市> <鄉鎮市區>`', value: '查詢未來36hr天氣預報 ', inline: true },
        { name: '`moontime <縣市>`', value: '查詢月出月落時間 ', inline: true },
        { name: '`suntime <縣市>`', value: '查詢日出日落時間', inline: true },
        { name: '`satellite `', value: '查詢衛星影像', inline: true },
        { name: '`radar `', value: '查詢雷達回波圖', inline: true },
        { name: '`earthquake `', value: '查詢顯著有感地震報告', inline: true },
        { name: '`airquality <測站站名>`', value: '查詢空氣品質', inline: true },
        { name: '`uvi <縣市>`', value: '查詢紫外線等級', inline: true },
        { name: '`rain`', value: '查詢未來一小時降雨預估', inline: true },
        { name: '`wcs`', value: '查詢各縣市停班課訊息', inline: true },
        { name: '`tsunami`', value: '查詢海嘯資訊', inline: true },
        { name: '`solarwind`', value: '查詢太陽風與磁場資訊', inline: true },
        { name: '`aurora`', value: '查詢可見極光範圍預報', inline: true },
        { name: '`typhoon`', value: '查詢颱風路徑預報', inline: true },
        { name: '`today`', value: '查詢今年已經過幾天', inline: true },
      ];

      const itemsPerPage = 6;
      const pages = [];

      for (let i = 0; i < commands.length; i += itemsPerPage) {
        const currentCommands = commands.slice(i, i + itemsPerPage);
        const embed = new EmbedBuilder()
          .setColor('#000000')
          .setAuthor({ name: '指令列表', iconURL: 'https://avatars.githubusercontent.com/u/70755374' })
          .setDescription(`指令前綴: ${prefix}`)
          .addFields(currentCommands)
          .setTimestamp()
          .setFooter({ text: `made with ❤ by hex0xyz | 總指令數: ${commands.length} | (${Math.floor(i / itemsPerPage) + 1}/${Math.ceil(commands.length / itemsPerPage)})` });

        pages.push(embed);
      }

      let currentPage = 0;

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('上一頁')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('下一頁')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === pages.length - 1)
          );

        const messageEmbed = await message.reply({ embeds: [pages[currentPage]], components: [row] });

        const filter = i => ['previous', 'next'].includes(i.customId) && i.user.id === message.author.id;
        const collector = messageEmbed.createMessageComponentCollector({ filter, time: 90000 });

        collector.on('collect', async i => {
          if (i.customId === 'previous') {
            currentPage--;
          } else if (i.customId === 'next') {
            currentPage++;
          }

          await i.update({ embeds: [pages[currentPage]], components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('previous')
                  .setLabel('上一頁')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPage === 0),
                new ButtonBuilder()
                  .setCustomId('next')
                  .setLabel('下一頁')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPage === pages.length - 1)
              )
          ] });
        });

        collector.on('end', collected => {
            messageEmbed.edit({ components: [] });
        });
  } catch (error) {
    console.log(error);
  }
  },
};
