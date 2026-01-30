-- CalSync Database Schema (PostgreSQL)

-- Användare
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  discord_id TEXT UNIQUE, -- Koppling till Discord-kontot
  calendar_token TEXT NOT NULL UNIQUE, -- Unik sträng för ICS-url:en
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bevakade kanaler (Prenumerationer)
CREATE TABLE IF NOT EXISTS watched_channels (
  id SERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  channel_name TEXT,
  user_discord_id TEXT NOT NULL, -- Vem som vill ha dessa events
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(channel_id, user_discord_id) -- En användare kan bara bevaka samma kanal en gång
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER, -- Koppling till vår interna User ID (om vi har en)
  discord_user_id TEXT, -- Alternativ koppling direkt till Discord ID för enklare hantering
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_watched_user ON watched_channels(user_discord_id);
CREATE INDEX IF NOT EXISTS idx_events_discord_user ON events(discord_user_id);
