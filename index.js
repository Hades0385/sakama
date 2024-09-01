const { Client, GatewayIntentBits, Collection} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.MessageContent,] });
require('dotenv').config()

client.commands = new Collection();
client.events = new Collection();

require("./commandLoader.js")(client, "./Command"); 
require("./eventLoader.js")(client, "./Event"); 
client.login(process.env.CLIENT_TOKEN)