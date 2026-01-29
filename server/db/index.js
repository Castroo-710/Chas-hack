/**
 * Database connection och helpers
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './server/db/database.sqlite';
const db = new Database(dbPath);

// Kör schema vid uppstart
function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('Database initialized');
}

// Watched Channels
function addWatchedChannel(guildId, channelId, channelName) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO watched_channels (guild_id, channel_id, channel_name)
    VALUES (?, ?, ?)
  `);
  return stmt.run(guildId, channelId, channelName);
}

function removeWatchedChannel(channelId) {
  const stmt = db.prepare('DELETE FROM watched_channels WHERE channel_id = ?');
  return stmt.run(channelId);
}

function getWatchedChannels(guildId) {
  const stmt = db.prepare('SELECT * FROM watched_channels WHERE guild_id = ?');
  return stmt.all(guildId);
}

function isChannelWatched(channelId) {
  const stmt = db.prepare('SELECT 1 FROM watched_channels WHERE channel_id = ?');
  return stmt.get(channelId) !== undefined;
}

// Events
function addEvent(event) {
  const stmt = db.prepare(`
    INSERT INTO events (title, description, start_date, end_date, source, source_id, channel_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    event.title,
    event.description,
    event.startDate,
    event.endDate,
    event.source,
    event.sourceId,
    event.channelId
  );
}

function getEvents(limit = 50) {
  const stmt = db.prepare(`
    SELECT * FROM events
    ORDER BY start_date ASC
    LIMIT ?
  `);
  return stmt.all(limit);
}

function getUpcomingEvents() {
  const stmt = db.prepare(`
    SELECT * FROM events
    WHERE start_date >= datetime('now')
    ORDER BY start_date ASC
  `);
  return stmt.all();
}

function deleteEvent(id) {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  return stmt.run(id);
}

function updateGoogleEventId(id, googleEventId) {
  const stmt = db.prepare('UPDATE events SET google_event_id = ? WHERE id = ?');
  return stmt.run(googleEventId, id);
}

module.exports = {
  db,
  initDatabase,
  addWatchedChannel,
  removeWatchedChannel,
  getWatchedChannels,
  isChannelWatched,
  addEvent,
  getEvents,
  getUpcomingEvents,
  deleteEvent,
  updateGoogleEventId,
};
