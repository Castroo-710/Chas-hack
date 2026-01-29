const { Events } = require('discord.js');
const { isChannelWatchedAnywhere } = require('../../server/db/index');

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

    console.log(`[Bot Listener] Länk hittad i #${message.channel.name}. Skickas till analys...`);

    // 4. Skicka till Backend API (TODO: Person 2)
    // Backend API kommer sen kolla vilka användare som prenumererar på denna kanal
    // och skapa events för dem.
  },
};
