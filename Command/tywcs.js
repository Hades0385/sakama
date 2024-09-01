const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "wcs",
  aliases: ["wc"],
  run: async (message, args) => {
    axios
      .get("https://www.dgpa.gov.tw/typh/daily/nds.html")
      .then((response) => {
        const citys = args[0]
        const $ = cheerio.load(response.data);
        const updateTimeText = $(".Content_Updata h4").text().trim();

        const regex = /更新時間：(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})/;
        const match = updateTimeText.match(regex);

        let updateTime = "";
        if (match) {
          updateTime = match[1];
        }

        const tableBody = $(".Table_Body");

        const results = [];

        tableBody.find("tr").each((index, element) => {
          const cityName = $(element)
            .find('td[headers="city_Name"] font')
            .text()
            .trim();
          const suspensionInfo = $(element)
            .find('td[headers="StopWorkSchool_Info"] font')
            .text()
            .trim();

          if (cityName !== "" && suspensionInfo !== "") {
            results.push({ city: cityName, suspension: suspensionInfo });
          }
        });

        const embed = new EmbedBuilder()
          .setTitle(`⚠️ 天然災害停止上班及上課情形 `)
          .setColor("#000000")
          .setDescription(`\u2800`)
          .setTimestamp()
          .setFooter({
            text: `\u2800\n資料來源：行政院人事行政總處\n更新時間:${updateTime}`,
          });

        if (results.length === 0){
          embed.setDescription(`\u2800\n目前無停班課訊息。`);
        }

        if (citys) {
          const cityData = results.find(result => result.city === citys)
          if (cityData) {
            embed
              .setTitle(`⚠️ ${citys} 天然災害停止上班及上課情形`)
              .addFields({
                name: cityData.city,
                value: cityData.suspension,
                inline: true,
              });
          } else {
            embed
              .setTitle(`⚠️  ${citys} 天然災害停止上班及上課情形`)
              .setDescription(
                `\u2800\n目前 **${citys}** 無停班課訊息`
              );
          }
        } else {
          for (const { city, suspension } of results) {
            embed.addFields({ name: city, value: suspension, inline: true })
          }
        } ;

        message.reply({ embeds: [embed] });
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
