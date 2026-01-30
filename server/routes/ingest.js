const { addEvent, getUsersWatchingChannel } = require('../db/index');
const { parseEventText } = require('../services/ai');

async function ingestRoutes(fastify, options) {
  
  // POST /api/ingest
  // Tar emot data från Discord Bot eller Web Scraper
  fastify.post('/', async (request, reply) => {
    const { text, sourceUrl, channelId, guildId, authorName } = request.body;

    if (!text) {
      return reply.code(400).send({ error: 'Ingen text tillhandahölls' });
    }

    try {
      // 1. Kör AI-analys på texten
      const eventData = await parseEventText(text);

      // 2. Hitta vilka användare som ska ha detta event
      // (Vilka prenumererar på denna kanal?)
      const interestedUsers = await getUsersWatchingChannel(channelId);

      if (interestedUsers.length === 0) {
        console.log(`Inga prenumeranter för kanal ${channelId}, sparar ändå som 'orphan' event.`);
      }

      // 3. Spara eventet i databasen
      // Om vi har prenumeranter, skapa ett event för varje (eller koppla via join-tabell)
      // För enkelhetens skull nu: Vi sparar det kopplat till "system" eller första användaren
      // TODO: Loopa igenom interestedUsers och skapa kopplingar.
      
      const savedEvent = await addEvent({
        discordUserId: interestedUsers.length > 0 ? interestedUsers[0].user_discord_id : 'system', 
        title: eventData.title,
        description: `Source: ${authorName}\n\n${eventData.description}`,
        location: eventData.location,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        sourceUrl: sourceUrl
      });

      return { 
        success: true, 
        message: 'Event analyserat och sparat', 
        eventId: savedEvent.id 
      };

    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Misslyckades att behandla event' });
    }
  });
}

module.exports = ingestRoutes;
