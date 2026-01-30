const { getUserByToken, getEventsForUser } = require('../db/index');
const { createIcsFeed } = require('../services/icsGenerator');

async function calendarRoutes(fastify, options) {
  
  // GET /api/calendar/:token.ics
  fastify.get('/:token.ics', async (request, reply) => {
    const { token } = request.params;

    try {
      // 1. Validera token
      // Notera: getUserByToken är async nu
      const user = await getUserByToken(token);
      
      if (!user) {
        return reply.code(404).send('Kalender hittades inte');
      }

      // 2. Hämta events för denna användare
      // Vi måste lägga till getEventsForUser i db/index.js (PG-versionen) om den saknas
      const events = await getEventsForUser(user.id);

      if (events.length === 0) {
        // Returnera en tom kalender hellre än 404, så klienter inte klagar
        return reply
          .header('Content-Type', 'text/calendar')
          .send('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CalSync//EN\nEND:VCALENDAR');
      }

      // 3. Generera ICS
      const icsData = await createIcsFeed(events);

      // 4. Skicka som fil
      return reply
        .header('Content-Type', 'text/calendar')
        .header('Content-Disposition', `attachment; filename="calsync-${user.username}.ics"`)
        .send(icsData);

    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send('Kunde inte generera kalender');
    }
  });
}

module.exports = calendarRoutes;
