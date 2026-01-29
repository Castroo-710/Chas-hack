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
function createUser(username, calendarToken) {
  const stmt = db.prepare(`
    INSERT INTO users (username, calendar_token)
    VALUES (?, ?)
  `);
  return stmt.run(username, calendarToken);
}

function getUserByToken(token) {
  const stmt = db.prepare('SELECT * FROM users WHERE calendar_token = ?');
  return stmt.get(token);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

// Watched Channels
function addWatchedChannel(guildId, channelId, channelName, userId = null) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO watched_channels (guild_id, channel_id, channel_name, user_id)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(guildId, channelId, channelName, userId);
}

function removeWatchedChannel(channelId) {
  const stmt = db.prepare('DELETE FROM watched_channels WHERE channel_id = ?');
  return stmt.run(channelId);
}

function getWatchedChannels(guildId) {
  const stmt = db.prepare('SELECT * FROM watched_channels WHERE guild_id = ?');
  return stmt.all(guildId);
}

function getAllWatchedChannels() {
  const stmt = db.prepare('SELECT * FROM watched_channels');
  return stmt.all();
}

function isChannelWatched(channelId) {
  const stmt = db.prepare('SELECT 1 FROM watched_channels WHERE channel_id = ?');
  return stmt.get(channelId) !== undefined;
}

// Events
function addEvent(event) {
  const stmt = db.prepare(`
    INSERT INTO events (user_id, title, description, location, start_time, end_time, source_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    event.userId,
    event.title,
    event.description,
    event.location,
    event.startTime,
    event.endTime,
    event.sourceUrl
  );
}

function getEventsForUser(userId, limit = 50) {
  const stmt = db.prepare(`
    SELECT * FROM events
    WHERE user_id = ?
    ORDER BY start_time ASC
    LIMIT ?
  `);
  return stmt.all(userId, limit);
}

function getUpcomingEventsForUser(userId) {
  const stmt = db.prepare(`
    SELECT * FROM events
    WHERE user_id = ? AND start_time >= datetime('now')
    ORDER BY start_time ASC
  `);
  return stmt.all(userId);
}

function deleteEvent(id) {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  return stmt.run(id);
}

module.exports = {
  db,
  initDatabase,
  createUser,
  getUserByToken,
  getUserById,
  addWatchedChannel,
  removeWatchedChannel,
  getWatchedChannels,
  getAllWatchedChannels,
  isChannelWatched,
  addEvent,
  getEventsForUser,
  getUpcomingEventsForUser,
  deleteEvent,
};