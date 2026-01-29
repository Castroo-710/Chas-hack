const { SlashCommandBuilder } = require('discord.js');
const { addWatchedChannel, ensureUserExists } = require('../../server/db/index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('watch')
    .setDescription('Lägg till denna kanal i DIN kalender-bevakning'),
  async execute(interaction) {
    const channel = interaction.channel;
    const guildId = interaction.guildId;
    const user = interaction.user;

    try {
      // 1. Se till att användaren finns i systemet
      const dbUser = ensureUserExists(user.id, user.username);

      // 2. Lägg till bevakning
      const result = addWatchedChannel(guildId, channel.id, channel.name, user.id);
      
      if (result.changes > 0) {
        await interaction.reply({
          content: `✅ Jag har lagt till **#${channel.name}** i din bevakningslista!\n🔗 Din kalender-länk: 
${process.env.DASHBOARD_URL || 'http://localhost:3000'}/calendar/${dbUser.calendar_token}.ics`, 
          ephemeral: true // Bara du ser detta
        });
      } else {
        await interaction.reply({
          content: `⚠️ Du bevakar redan den här kanalen.`, 
          ephemeral: true 
        });
      }
    } catch (error) {
      console.error('Fel vid /watch:', error);
      await interaction.reply({
        content: '❌ Något gick fel. Försök igen.', 
        ephemeral: true 
      });
    }
  },
};
