-- CalSync Database Schema

-- Bevakade kanaler
CREATE TABLE IF NOT EXISTS watched_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL UNIQUE,
  channel_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATETIME,
  end_date DATETIME,
  source TEXT, -- 'discord_message', 'discord_event', 'manual'
  source_id TEXT, -- Discord message ID eller event ID
  google_event_id TEXT, -- ID från Google Calendar
  channel_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index för snabbare queries
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_channel ON events(channel_id);
