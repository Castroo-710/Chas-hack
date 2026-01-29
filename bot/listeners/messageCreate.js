// Lyssnar på nya meddelanden i bevakade kanaler

module.exports = {
  name: 'messageCreate',

  async execute(message) {
    // Ignorera bot-meddelanden
    if (message.author.bot) return;

    // TODO: Kolla om kanalen är bevakad
    // TODO: Skicka meddelandet till backend för AI-parsning
    // TODO: await fetch('http://localhost:3000/api/events', { ... })

    console.log(`Nytt meddelande i ${message.channel.name}: ${message.content}`);
  },
};
