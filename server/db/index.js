/**
 * index.js - Database connection and helpers! (PostgreSQL Version)
 */
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
// Load env vars from project root if not already loaded
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log("🔌 Initializing Database Module...");

// 1. Connection Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 2. Database Initialization (Robust File Finding)
async function initDatabase() {
  const client = await pool.connect();
  try {
    // We try to find schema.sql in 3 likely locations to prevent path errors
    const possiblePaths = [
      path.join(__dirname, 'schema.sql'),       // Same folder as index.js
      path.join(__dirname, '../schema.sql'),    // One folder up
      path.join(process.cwd(), 'schema.sql')    // Project root where you run 'node'
    ];

    let schemaPath = null;

    // Loop through paths to find the file
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        schemaPath = p;
        break;
      }
    }

    if (!schemaPath) {
      console.error(`❌ CRITICAL ERROR: 'schema.sql' was not found.`);
      console.error(`Checked locations:`);
      possiblePaths.forEach(p => console.error(` - ${p}`));
      console.error(`📂 Files in current directory (${__dirname}):`, fs.readdirSync(__dirname));
      return;
    }

    console.log(`📜 Found schema at: ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('⏳ Executing schema on Aiven PostgreSQL...');
    await client.query(schema);
    console.log('✅ PostgreSQL Database initialized (Stockholm Timezone Active)');

  } catch (err) {
    console.error('❌ Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

// 3. Diagnostic Test
async function runDiagnostic() {
  try {
    console.log('🧪 Running Database Diagnostic...');

    // Check Timezone
    const timeRes = await pool.query("SELECT NOW(), CURRENT_SETTING('timezone') as zone");
    console.log(`🕒 Database Time: ${timeRes.rows[0].now}`);
    console.log(`🌍 Database Zone: ${timeRes.rows[0].zone}`);

    // Check User Creation
    const testUser = await ensureUserExists('123456789', 'Stockholm_Tester');
    console.log('👤 User Write/Read Test:', testUser.username === 'Stockholm_Tester' ? 'PASSED' : 'FAILED');

    console.log('✅ Diagnostic Complete. Check DBeaver for tables!');
  } catch (err) {
    console.error('❌ Diagnostic Failed:', err.message);
  }
}

// 4. Helper Functions
async function ensureUserExists(discordId, username) {
  const res = await pool.query('SELECT * FROM users WHERE discord_id = $1', [discordId]);
  if (res.rows.length > 0) return res.rows[0];

  const token = crypto.randomBytes(16).toString('hex');
  const insertQuery = `
    INSERT INTO users (username, discord_id, calendar_token)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const newUser = await pool.query(insertQuery, [username, discordId, token]);
  return newUser.rows[0];
}

async function addWatchedChannel(guildId, channelId, channelName, discordId) {
  const query = `
    INSERT INTO watched_channels (guild_id, channel_id, channel_name, user_discord_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (channel_id, user_discord_id) DO NOTHING
  `;
  return await pool.query(query, [guildId, channelId, channelName, discordId]);
}

async function removeWatchedChannel(channelId, discordId) {
  const query = 'DELETE FROM watched_channels WHERE channel_id = $1 AND user_discord_id = $2';
  return await pool.query(query, [channelId, discordId]);
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

async function addEvent(event) {
  // First, find the internal user ID based on Discord ID
  const userRes = await pool.query('SELECT id FROM users WHERE discord_id = $1', [event.discordUserId]);

  let userId = null;
  if (userRes.rows.length > 0) {
    userId = userRes.rows[0].id;
  } else {
    console.warn(`⚠️ Warning: agile event added for unknown Discord User: ${event.discordUserId}`);
  }

  const query = `
    INSERT INTO events (user_id, discord_user_id, title, description, location, start_time, end_time, source_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  return await pool.query(query, [
    userId,
    event.discordUserId,
    event.title,
    event.description,
    event.location,
    event.startTime,
    event.endTime,
    event.sourceUrl
  ]);
}

// 5. Startup Execution
// 5. Startup Execution (Only if run directly)
if (require.main === module) {
  (async () => {
    try {
      await initDatabase();
      await runDiagnostic();
      console.log('✅ Database preparation complete. Exiting setup script.');
      await pool.end();
      process.exit(0);
    } catch (e) {
      console.error("Critical error during startup:", e);
      process.exit(1);
    }
  })();
}

module.exports = {
  pool,
  initDatabase,
  ensureUserExists,
  addWatchedChannel,
  removeWatchedChannel,
  getUserWatchedChannels,
  getUsersWatchingChannel,
  isChannelWatchedAnywhere,
  addEvent,
};