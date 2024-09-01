const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "rainforecast",
  aliases: ["rain", "rf"],
  run: async (message, args) => {
    axios
      .get("https://watch.ncdr.nat.gov.tw/wh/dv_ncdrnowcast_town?")
      .then((response) => {
        const city = args[0];
        const rainData = parseHTMLData(response.data);
        // 過濾出level值等於1的資料
        const rainForecast = rainData.filter((item) => item.level === 1);

        let time = rainData[0].timestamp;
        let description = `預警標準：未來1小時內可能發生10mm/10分鐘或40mm/1小時的降雨量\n此資訊僅供參考使用，實際降雨請以氣象署公告為主\n\u2800`;

        const embed = new EmbedBuilder()
          .setTitle(`⚠️ 推估 全台 未來一小時內會發生大雨鄉鎮列表`)
          .setDescription(`${description}`)
          .setColor("#000000")
          .setTimestamp()
          .setFooter({
            text: `\u2800\n資料來源：國家災害防救科技中心-氣象組\n最近更新時間:${time}`,
          });

        if (rainForecast.length === 0) {
          embed.setDescription(`${description}\n目前無預警縣市`);
        } else {
          // 將過濾出的資料按城市分組
          const groupedData = rainForecast.reduce((acc, item) => {
            if (!acc[item.city]) {
              acc[item.city] = [];
            }
            acc[item.city].push(item.town);
            return acc;
          }, {});

          if (city) {
            if (groupedData[city]) {
              embed
                .setTitle(`⚠️ 推估 ${city} 未來一小時內會發生大雨鄉鎮列表`)
                .addFields({
                  name: city,
                  value: groupedData[city].join("、"),
                  inline: true,
                });
            } else {
              embed
                .setTitle(`⚠️ 推估 ${city} 未來一小時內會發生大雨鄉鎮列表`)
                .setDescription(
                  `${description}\u2800\n目前 **${city}** 無預警鄉鎮`
                );
            }
          } else {
            for (const [cityName, towns] of Object.entries(groupedData)) {
              embed.addFields({
                name: cityName,
                value: towns.join("、"),
                inline: true,
              });
            }
          }
        }

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

function parseHTMLData(htmlContent) {
  const dataStartIndex = htmlContent.indexOf("\n") + 1;
  const csvData = htmlContent.substring(dataStartIndex).trim();

  const lines = csvData.split("\n");

  const parsedData = [];

  lines.forEach((line) => {
    const [id, level, timestamp, cid, city, town] = line.split(",");
    parsedData.push({
      id: id.trim(),
      level: parseInt(level.trim()),
      timestamp: timestamp.trim(),
      cid: cid.trim(),
      city: city.trim(),
      town: town.trim(),
    });
  });

  return parsedData;
}
