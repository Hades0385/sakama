const prefix = process.env.PREFIX;
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });

module.exports = async (client,message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
  
    try {
        command.run(message, args);
    } catch (error) {
        console.error(error);
        message.reply('執行指令時出現錯誤');
    }

}