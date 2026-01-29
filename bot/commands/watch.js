const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('watch')
    .setDescription('Börja bevaka en kanal för events')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Kanalen att bevaka')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    // TODO: Spara kanalen till databasen via backend API
    // TODO: await fetch('http://localhost:3000/api/channels', { ... })

    await interaction.reply(`Nu bevakas ${channel} för events!`);
  },
};
