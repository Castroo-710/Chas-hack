const { Events } = require('discord.js');
const { isChannelWatchedAnywhere } = require('../../server/db/index');
const axios = require('axios');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // 1. Ignorera bottar
    if (message.author.bot) return;

    // 2. Kolla om kanalen övervakas av NÅGON
    if (!isChannelWatchedAnywhere(message.channelId)) return;

    // 3. Kolla om meddelandet innehåller en URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasUrl = urlRegex.test(message.content);

    if (!hasUrl) return;

    console.log(`[Bot Listener] Länk hittad i #${message.channel.name}. Skickas till backend...`);

    // 4. Skicka till Backend API
    try {
      await axios.post('http://localhost:3000/api/ingest', {
        text: message.content,
        sourceUrl: message.url, // Länk till meddelandet
        channelId: message.channelId,
        guildId: message.guildId,
        authorName: message.author.username
      });
      console.log('✅ Skickat till backend!');
    } catch (error) {
      // Ignorera fel om servern är nere (vanligt under dev)
      // console.error(`⚠️ Kunde inte nå backend: ${error.message}`);
    }
  },
};