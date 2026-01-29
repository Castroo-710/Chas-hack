-- CalSync Database Schema

-- Användare (för att kunna ha unika ICS-feeds)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  calendar_token TEXT NOT NULL UNIQUE, -- Unik sträng för ICS-url:en
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bevakade kanaler
CREATE TABLE IF NOT EXISTS watched_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL UNIQUE,
  channel_name TEXT,
  user_id INTEGER, -- Koppling till vem som lade till kanalen
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  source_url TEXT, -- Varifrån infon kom (URL eller Discord-länk)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index för snabbare queries
CREATE INDEX IF NOT EXISTS idx_events_user_start ON events(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_users_token ON users(calendar_token);