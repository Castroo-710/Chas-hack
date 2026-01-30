/**
 * Database connection och helpers
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || './server/db/database.sqlite';
const db = new Database(dbPath);

// Kör schema vid uppstart
function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('Database initialized');
}

// Users
function ensureUserExists(discordId, username) {
  // Kolla om användaren finns
  const user = db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId);
  
  if (user) return user;

  // Skapa ny användare om den inte finns
  // Generera en slumpmässig calendar_token
  const token = require('crypto').randomBytes(16).toString('hex');
  
  const stmt = db.prepare(`
    INSERT INTO users (username, discord_id, calendar_token)
    VALUES (?, ?, ?)
  `);
  stmt.run(username, discordId, token);
  
  return db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

// Watched Channels
function addWatchedChannel(guildId, channelId, channelName, discordId) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO watched_channels (guild_id, channel_id, channel_name, user_discord_id)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(guildId, channelId, channelName, discordId);
}

function removeWatchedChannel(channelId, discordId) {
  const stmt = db.prepare('DELETE FROM watched_channels WHERE channel_id = ? AND user_discord_id = ?');
  return stmt.run(channelId, discordId);
}

// Hämta alla kanaler som en specifik användare bevakar
function getUserWatchedChannels(discordId) {
  const stmt = db.prepare('SELECT * FROM watched_channels WHERE user_discord_id = ?');
  return stmt.all(discordId);
}

// Hämta alla användare som bevakar en specifik kanal (för Listener)
function getUsersWatchingChannel(channelId) {
  const stmt = db.prepare('SELECT user_discord_id FROM watched_channels WHERE channel_id = ?');
  return stmt.all(channelId);
}

function isChannelWatchedAnywhere(channelId) {
  const stmt = db.prepare('SELECT 1 FROM watched_channels WHERE channel_id = ? LIMIT 1');
  return stmt.get(channelId) !== undefined;
}

// Events
function addEvent(event) {
  const stmt = db.prepare(`
    INSERT INTO events (discord_user_id, title, description, location, start_time, end_time, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    event.discordUserId,
    event.title,
    event.description,
    event.location,
    event.startTime,
    event.endTime,
    event.sourceUrl
  );
}

module.exports = {
  db,
  initDatabase,
  ensureUserExists,
  getUserById,
  addWatchedChannel,
  removeWatchedChannel,
  getUserWatchedChannels,
  getUsersWatchingChannel,
  isChannelWatchedAnywhere,
  addEvent,
};
