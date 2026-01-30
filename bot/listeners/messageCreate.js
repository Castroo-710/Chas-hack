const { Events } = require('discord.js');
const { isChannelWatchedAnywhere } = require('../../server/db/index');
const axios = require('axios');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // 1. Ignorera bottar
    if (message.author.bot) return;

    // 2. Se till att användaren finns i systemet (så vi har någonstans att spara eventet)
    const { ensureUserExists } = require('../../server/db/index');
    await ensureUserExists(message.author.id, message.author.username);

    // 3. Kolla om meddelandet innehåller en URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasUrl = urlRegex.test(message.content);

    if (!hasUrl) return;

    console.log(`[Bot Listener] Länk hittad i #${message.channel.name}. Skickas till backend...`);

    // 4. Skicka till Backend API
    try {
      const response = await axios.post('http://localhost:3000/api/ingest', {
        text: message.content,
        sourceUrl: message.content.match(urlRegex)[0], // Skicka den faktiska länken
        channelId: message.channelId,
        guildId: message.guildId,
        authorName: message.author.username,
        discordUserId: message.author.id // Skicka med ID
      });

      if (response.data.success && response.data.event) {
        const event = response.data.event;
        await message.reply({
          content: `✅ Jag hittade ett event: **${event.title}**\n📅 ${event.start_time}\n📍 ${event.location || 'Ingen plats angiven'}`
        });
        console.log('✅ Event skapat och svar skickat!');
      } else {
        console.log('ℹ️ Inget event hittades i länken/texten.');
      }
    } catch (error) {
      console.error(`⚠️ Kunde inte nå backend: ${error.message}`);
    }
  },
};