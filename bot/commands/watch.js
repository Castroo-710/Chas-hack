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
      console.log(`[/watch] Started by ${user.username} (ID: ${user.id}) in channel: ${channel.name}`);

      // 1. Se till att användaren finns i systemet
      console.log(`[/watch] Ensuring user exists...`);
      const dbUser = await ensureUserExists(user.id, user.username);
      console.log(`[/watch] User found/created with token: ${dbUser.calendar_token}`);

      // 2. Lägg till bevakning
      console.log(`[/watch] Adding watched channel: ${channel.id}`);
      const result = await addWatchedChannel(guildId, channel.id, channel.name, user.id);
      console.log(`[/watch] Result: changes=${result.changes}`);

      if (result.changes > 0) {
        await interaction.reply({
          content: `✅ Jag har lagt till **#${channel.name}** i din bevakningslista!\n🔗 Din personliga kalender-länk: 
${process.env.SERVER_URL || 'http://localhost:3000'}/api/calendar/${dbUser.calendar_token}.ics`,
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
