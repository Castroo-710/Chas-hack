const jwt = require('jsonwebtoken');
const { ensureUserExists, getUserById } = require('../db/index');
const { authenticateToken } = require('../middleware/auth');

async function authRoutes(fastify, options) {
  
  // POST /api/auth/login
  fastify.post('/login', async (request, reply) => {
    const { username, discordId } = request.body;

    if (!username || !discordId) {
      return reply.code(400).send({ error: 'Username och DiscordID krävs' });
    }

    try {
      // Hitta eller skapa användare i DB
      // Notera: ensureUserExists är nu async pga Postgres
      const user = await ensureUserExists(discordId, username);

      const userForToken = { 
        id: user.id, 
        username: user.username,
        discordId: user.discord_id 
      };

      const accessToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '24h' });

      return { 
        accessToken, 
        user: userForToken,
        calendarUrl: `/api/calendar/${user.calendar_token}.ics`
      };

    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internt serverfel vid inloggning' });
    }
  });

  // GET /api/auth/me
  fastify.get('/me', {
    preHandler: authenticateToken
  }, async (request, reply) => {
    // request.user sätts av authenticateToken
    const dbUser = await getUserById(request.user.id);
    
    if (!dbUser) {
      return reply.code(404).send({ error: 'Användare hittades inte' });
    }

    return {
      id: dbUser.id,
      username: dbUser.username,
      discordId: dbUser.discord_id,
      calendarToken: dbUser.calendar_token
    };
  });
}

module.exports = authRoutes;