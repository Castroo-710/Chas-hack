const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserWatchedChannels, ensureUserExists } = require('../../server/db/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Visa alla kanaler du bevakar'),
  async execute(interaction) {
    const user = interaction.user;
    
    // Se till att användaren finns (om de kör /list innan /watch)
    const dbUser = ensureUserExists(user.id, user.username);
    const channels = getUserWatchedChannels(user.id);

    if (channels.length === 0) {
      await interaction.reply({
        content: 'Du bevakar inga kanaler än. Gå till en kanal och skriv `/watch`.',
        ephemeral: true
      });
      return;
    }

    const listString = channels.map(c => `• <#${c.channel_id}> (Server: ${c.guild_id})`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('Dina bevakade kanaler 📅')
      .setDescription(listString)
      .addFields({
        name: 'Din Kalender Länk (.ics)',
        value: `\`${process.env.DASHBOARD_URL || 'http://localhost:3000'}/api/calendar/${dbUser.calendar_token}.ics`\`
      })
      .setColor(0x00FF00);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
