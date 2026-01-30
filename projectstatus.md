# CalSync - Discord to Calendar Bridge

> Samla events från Discord och webben till en smart kalender-feed (ICS).

---

## Projektöversikt

Vi bygger en tjänst som lyssnar på Discord-kanaler och tar emot webb-länkar. En AI-agent parsar informationen till konkreta kalenderhändelser. Användaren får en unik `.ics`-länk att lägga in i sin mobila kalender eller Google Calendar.

| Status | Fas |
|--------|-----|
| [x] | Grundstruktur |
| [x] | Discord Bot (Listener & Commands) |
| [x] | Backend API - Auth & DB |
| [ ] | Backend API - Ingest & Calendar (KVAR) |
| [ ] | AI Agent / Scraper (KVAR) |
| [ ] | Dashboard UI (Återställd/Ej påbörjad) |

---

## Team & Ansvarsområden

| Person | Område | Huvudfiler |
|--------|--------|------------|
| **Person 1** | Discord Bot (Lyssna & Skicka till API) | `bot/*` |
| **Person 2** | Backend API, Databas & ICS-generering | `server/*` |
| **Person 3** | AI Agent & Web Scraper Integration | `server/services/*` |
| **Person 4** | Dashboard UI (Visa events & ge ut URL) | `dashboard/*` |

---

## Steg-för-steg Plan

### Fas 1: Setup
- [x] Klona repo och kör `npm install`
- [x] Skapa `.env` fil
- [x] Uppdatera DB schema för Multi-User support

### Fas 2: Parallellt arbete

#### Person 1 - Discord Bot (KLAR)
- [x] Implementera `/watch` kommando (Personlig prenumeration)
- [x] Implementera `/list` kommando (Visa mina kanaler + ICS länk)
- [x] Lyssna på `messageCreate` (med URL-filter)
- [x] Skicka potentiella event-texter till Backend API (`POST /api/ingest`)

#### Person 2 - Backend API & DB (PÅGÅENDE)
- [x] Sätt upp SQLite med `better-sqlite3`
- [x] Skapa tabeller: `users`, `watched_channels`, `events`
- [x] Implementera JWT Auth (`/api/auth/login`, `/api/auth/me`)
- [x] Skapa Auth Middleware
- [ ] `POST /api/ingest` - Endpoint för att ta emot data från boten (Saknas)
- [ ] `GET /api/calendar/:token.ics` - Generera ICS-fil dynamiskt (Saknas)
- [ ] CRUD-endpoints för Dashboarden (Redigera/Ta bort events)

#### Person 3 - AI & Scraping (EJ PÅBÖRJAD)
*OBS: Gamla filer finns i `server/services/` men måste skrivas om.*
- [ ] Konfigurera OpenRouter / OpenAI klient
- [ ] Skapa prompt för att extrahera JSON (Titel, Start, Slut, Beskrivning)
- [ ] Implementera `parseEventText(text)` service

#### Person 4 - Dashboard (EJ PÅBÖRJAD)
- [ ] Initiera React-projekt
- [ ] Bygg Login UI (koppla mot `/api/auth/login`)
- [ ] Bygg Kalendervy

### Fas 3: Integration & Polish
- [ ] Testa flödet: Bot -> Ingest -> AI -> DB -> ICS
- [ ] Testa att prenumerera på kalendern i iPhone/Google

---

## Tech Stack

```
Bot:        discord.js v14
Backend:    Node.js + Express + JWT
Database:   SQLite (better-sqlite3)
AI:         OpenRouter API (Accessing OpenAI/Claude etc)
Format:     iCalendar (.ics) via 'ics' npm package
Dashboard:  React + Vite
```

---

## Databas Schema

**users**
- id, username, discord_id, calendar_token (unique)

**watched_channels**
- id, channel_id, user_discord_id, guild_id

**events**
- id, discord_user_id (owner), title, description, start_time, end_time, source_url

---

## API Endpoints (Implementerade)

**Auth**
- `POST /api/auth/login`
- `GET /api/auth/me`

## API Endpoints (Att göra)

**Ingest**
- `POST /api/ingest` (Tar emot `{text, sourceUrl, channelId, authorName}`)

**Calendar**
- `GET /api/calendar/:token.ics`