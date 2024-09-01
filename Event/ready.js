const prefix = process.env.PREFIX;
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

module.exports = (Discord, client, message) => {
  console.log(`log in as ${client.user.tag}!`);

  let guilds = client.guilds.cache.size;
  let channels = client.channels.cache.size;

  const activities = [
      `weather | ${prefix}help `,
      `${guilds} servers | ${channels} channels`,
      `with ❤ by hex `,
  ];

  client.user.setActivity({ name: `weather | ${prefix}help`, type: ActivityType.Custom });

  setInterval(() => {
      client.user.setPresence({ 
          activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: ActivityType.Custom }], 
          status: 'online', 
      });
  }, 15000)
}