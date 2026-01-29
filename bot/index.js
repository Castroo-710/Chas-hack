require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

client.commands = new Collection();

// Ladda kommandon
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[VARNING] Kommandot på ${filePath} saknar 'data' eller 'execute' egenskap.`);
  }
}

// Ladda lyssnare
const listenersPath = path.join(__dirname, 'listeners');
const listenerFiles = fs.readdirSync(listenersPath).filter(file => file.endsWith('.js'));

for (const file of listenerFiles) {
  const filePath = path.join(listenersPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Hantera slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Inget kommando som matchar ${interaction.commandName} hittades.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Det uppstod ett fel när kommandot kördes!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Det uppstod ett fel när kommandot kördes!', ephemeral: true });
    }
  }
});

client.once('ready', () => {
  console.log(`Bot inloggad som ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);