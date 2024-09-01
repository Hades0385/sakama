const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "today",
  aliases: ["td", "tt"],
  run: async (message, args) => {
    const {today,dp,dr} = calculate();
    const {year,month,day,days} = getDateTime();
    const pbar = bar(today);
    const embed = new EmbedBuilder()
      .setTitle(
        `${year} 年 已經過 ${today}%`
      )
      .setColor("#000000")
      .setDescription(`今天是${year}年${month}月${day}日 星期${days}`)
      .addFields({
        name: `今年已過`,
        value: `${dp}天`,
        inline: true,
      },{
        name: `距離明年剩`,
        value: `${dr}天`,
        inline: true,
      },{
        name: `進度條`,
        value: `${pbar}`,
        inline: false,
      },)
      .setTimestamp()
      .setFooter({
        text: `made with ❤ by hex`,
      });
    message.reply({ embeds: [embed] });
  },
};

function calculate() {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);
  const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((endOfYear - now) / (1000 * 60 * 60 * 24));
  const progress = (daysPassed / totalDays) * 100;
  return {
    today: Math.round(progress * 100) / 100, 
    dp: daysPassed,
    dr: daysRemaining
};
}

function getDateTime() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth()+1;
  let day = today.getDate();
  let days_list = ['日','一','二','三','四','五','六',];
  let days = days_list[today.getDay()];
  month = String(month).padStart(2, '0');
  day = String(day).padStart(2, '0');
  return {year,month,day,days};
}

function bar(percent) {
  const totalBlocks = 20;
  const filledBlocks = Math.floor((percent / 100) * totalBlocks); 
  const emptyBlocks = totalBlocks - filledBlocks; 
  const progressBar = '▨'.repeat(filledBlocks) + '▢'.repeat(emptyBlocks);
  return progressBar
}
