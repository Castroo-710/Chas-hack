/**
 * Database connection och helpers (PostgreSQL)
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Krävs ofta för Aiven/Heroku m.fl.
  }
});

// Kör schema vid uppstart (Async nu pga Postgres)
async function initDatabase() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const client = await pool.connect();
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Postgres stöder inte alltid flera statements i en query beroende på config,
    // men pg-biblioteket brukar hantera det om det är enkel SQL.
    await client.query(schema);
    client.release();
    console.log('Database initialized (PostgreSQL)');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
}

// Users
async function ensureUserExists(discordId, username) {
  const client = await pool.connect();
  try {
    // Kolla om användaren finns
    const res = await client.query('SELECT * FROM users WHERE discord_id = $1', [discordId]);
    
    if (res.rows.length > 0) return res.rows[0];

    // Skapa ny
    const token = require('crypto').randomBytes(16).toString('hex');
    const insertRes = await client.query(
      'INSERT INTO users (username, discord_id, calendar_token) VALUES ($1, $2, $3) RETURNING *',
      [username, discordId, token]
    );
    return insertRes.rows[0];
  } finally {
    client.release();
  }
}

async function getUserById(id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

async function getUserByToken(token) {
  const res = await pool.query('SELECT * FROM users WHERE calendar_token = $1', [token]);
  return res.rows[0];
}

// Watched Channels
async function addWatchedChannel(guildId, channelId, channelName, discordId) {
  // ON CONFLICT DO NOTHING är Postgres motsvarighet till INSERT OR IGNORE
  // Förutsätter att vi har en UNIQUE constraint
  const query = `
    INSERT INTO watched_channels (guild_id, channel_id, channel_name, user_discord_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (channel_id, user_discord_id) DO NOTHING
  `;
  const res = await pool.query(query, [guildId, channelId, channelName, discordId]);
  return { changes: res.rowCount };
}

async function getUserWatchedChannels(discordId) {
  const res = await pool.query('SELECT * FROM watched_channels WHERE user_discord_id = $1', [discordId]);
  return res.rows;
}

async function getUsersWatchingChannel(channelId) {
  const res = await pool.query('SELECT user_discord_id FROM watched_channels WHERE channel_id = $1', [channelId]);
  return res.rows;
}

async function isChannelWatchedAnywhere(channelId) {
  const res = await pool.query('SELECT 1 FROM watched_channels WHERE channel_id = $1 LIMIT 1', [channelId]);
  return res.rows.length > 0;
}

// Events
async function addEvent(event) {
  const query = `
    INSERT INTO events (discord_user_id, title, description, location, start_time, end_time, source_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  const res = await pool.query(query, [
    event.discordUserId,
    event.title,
    event.description,
    event.location,
    event.startTime,
    event.endTime,
    event.sourceUrl
  ]);
  return res.rows[0];
}

async function getEventsForUser(userId) {
  // Eftersom vi inte har user_id strikt kopplat i events-tabellen än (vi har discord_user_id som text),
  // måste vi göra en join eller hämta via discord_id.
  // Låt oss hämta användarens discord_id först.
  const userRes = await pool.query('SELECT discord_id FROM users WHERE id = $1', [userId]);
  if (userRes.rows.length === 0) return [];
  
  const discordId = userRes.rows[0].discord_id;

  // Hämta events där discord_user_id matchar ELLER user_id matchar (om vi sätter det senare)
  // Vi lägger också till en LIMIT för säkerhets skull
  const query = `
    SELECT * FROM events 
    WHERE discord_user_id = $1 OR user_id = $2
    ORDER BY start_time ASC
    LIMIT 100
  `;
  const res = await pool.query(query, [discordId, userId]);
  return res.rows;
}

module.exports = {
  pool,
  initDatabase,
  ensureUserExists,
  getUserById,
  getUserByToken,
  addWatchedChannel,
  getUserWatchedChannels,
  getUsersWatchingChannel,
  isChannelWatchedAnywhere,
  addEvent,
  getEventsForUser,
};
