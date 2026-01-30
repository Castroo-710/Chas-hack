/**
 * Database connection och helpers - PostgreSQL
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Aiven
  }
});

// Kör schema vid uppstart
async function initDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Users
async function ensureUserExists(discordId, username) {
  try {
    // Kolla om användaren finns
    const result = await pool.query(
      'SELECT * FROM users WHERE discord_id = $1',
      [discordId]
    );

    if (result.rows.length > 0) return result.rows[0];

    // Skapa ny användare om den inte finns
    // Generera en slumpmässig calendar_token
    const token = require('crypto').randomBytes(16).toString('hex');

    const insertResult = await pool.query(
      'INSERT INTO users (username, discord_id, calendar_token) VALUES ($1, $2, $3) RETURNING *',
      [username, discordId, token]
    );

    return insertResult.rows[0];
  } catch (error) {
    console.error('Error in ensureUserExists:', error);
    throw error;
  }
}

async function getUserById(id) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
}

// Watched Channels
async function addWatchedChannel(guildId, channelId, channelName, discordId) {
  try {
    const result = await pool.query(
      `INSERT INTO watched_channels (guild_id, channel_id, channel_name, user_discord_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (channel_id, user_discord_id) DO NOTHING
       RETURNING *`,
      [guildId, channelId, channelName, discordId]
    );
    return { changes: result.rowCount };
  } catch (error) {
    console.error('Error in addWatchedChannel:', error);
    throw error;
  }
}

async function removeWatchedChannel(channelId, discordId) {
  try {
    const result = await pool.query(
      'DELETE FROM watched_channels WHERE channel_id = $1 AND user_discord_id = $2',
      [channelId, discordId]
    );
    return result;
  } catch (error) {
    console.error('Error in removeWatchedChannel:', error);
    throw error;
  }
}

// Hämta alla kanaler som en specifik användare bevakar
async function getUserWatchedChannels(discordId) {
  try {
    const result = await pool.query(
      'SELECT * FROM watched_channels WHERE user_discord_id = $1',
      [discordId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getUserWatchedChannels:', error);
    throw error;
  }
}

// Hämta alla användare som bevakar en specifik kanal (för Listener)
async function getUsersWatchingChannel(channelId) {
  try {
    const result = await pool.query(
      'SELECT user_discord_id FROM watched_channels WHERE channel_id = $1',
      [channelId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getUsersWatchingChannel:', error);
    throw error;
  }
}

async function isChannelWatchedAnywhere(channelId) {
  try {
    const result = await pool.query(
      'SELECT 1 FROM watched_channels WHERE channel_id = $1 LIMIT 1',
      [channelId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error in isChannelWatchedAnywhere:', error);
    throw error;
  }
}

// Events
// Hämta events för en användare
async function getEvents(discordUserId) {
  try {
    if (discordUserId) {
      const result = await pool.query(
        'SELECT * FROM events WHERE discord_user_id = $1 ORDER BY start_time ASC',
        [discordUserId]
      );
      return result.rows;
    } else {
      // För demo-syfte, returnera alla om inget ID skickas
      const result = await pool.query('SELECT * FROM events ORDER BY start_time ASC');
      return result.rows;
    }
  } catch (error) {
    console.error('Error in getEvents:', error);
    throw error;
  }
}

async function deleteEvent(id) {
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1', [id]);
    return { rowCount: result.rowCount };
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    throw error;
  }
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
  getEvents,
  addEvent,
  deleteEvent,
};
