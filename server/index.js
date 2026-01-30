require('dotenv').config();
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const { initDatabase } = require('./db/index');
const authRoutes = require('./routes/auth');
const ingestRoutes = require('./routes/ingest');
const calendarRoutes = require('./routes/calendar');

const fastify = Fastify({
  logger: true // Bra för debugging
});

// Initialize Database
// Eftersom initDatabase är async i PG-versionen, kör vi den men låter den inte blockera hela uppstarten om den tar tid,
// alternativt awaitar vi den i start-funktionen.
initDatabase();

// Plugins
fastify.register(cors, { 
  origin: true // Tillåt alla origins för hackathon
});

// Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(ingestRoutes, { prefix: '/api/ingest' });
fastify.register(calendarRoutes, { prefix: '/api/calendar' });

// Health Check
fastify.get('/', async (request, reply) => {
  return { message: 'CalSync API is running (Fastify + Postgres)' };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port: port, host: '0.0.0.0' });
    console.log(`Server körs på http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
