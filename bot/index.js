require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

client.commands = new Collection();

// TODO: Ladda kommandon från ./commands/
// TODO: Ladda listeners från ./listeners/

client.once('ready', () => {
  console.log(`Bot inloggad som ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
