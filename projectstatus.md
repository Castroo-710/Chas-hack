# CalSync - Discord to Calendar Bridge

> Samla events från Discord och webben till en smart kalender-feed (ICS).

---

## Projektöversikt

Vi bygger en tjänst som lyssnar på Discord-kanaler och tar emot webb-länkar. En AI-agent parsar informationen till konkreta kalenderhändelser. Användaren får en unik `.ics`-länk att lägga in i sin mobila kalender eller Google Calendar.

| Status | Fas |
|--------|-----|
| [ ] | Grundstruktur |
| [ ] | Discord Bot (Listener) |
| [ ] | Backend API & DB |
| [ ] | ICS Feed Generator |
| [ ] | AI Agent / Scraper |
| [ ] | Dashboard UI |

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
- [ ] Klona repo och kör `npm install`
- [ ] Skapa `.env` fil
- [ ] Skapa Discord Application

### Fas 2: Parallellt arbete

#### Person 1 - Discord Bot
- [ ] Implementera `/watch` kommando (starta bevakning av kanal)
- [ ] Lyssna på `messageCreate`
- [ ] Filtrera bort spam/korta meddelanden
- [ ] Skicka potentiella event-texter till Backend API (`POST /api/ingest`)

#### Person 2 - Backend API & DB
- [ ] Sätt upp SQLite med `better-sqlite3`
- [ ] Skapa tabeller: `users`, `sources` (kanaler/url), `events`
- [ ] `POST /api/ingest` - Ta emot råtext, skicka till AI-service, spara svar
- [ ] `GET /api/calendar/:token.ics` - Generera ICS-fil dynamiskt
- [ ] CRUD-endpoints för Dashboarden (redigera felaktiga events)

#### Person 3 - AI & Scraping
- [ ] Konfigurera OpenRouter / OpenAI klient
- [ ] Skapa prompt för att extrahera JSON (Titel, Start, Slut, Beskrivning) från ostrukturerad text
- [ ] Bygg "Scrape URL" funktion (hämta HTML-text -> AI -> JSON)
- [ ] Hantera datumformat (hårdkodat till Svensk tid/CET)

#### Person 4 - Dashboard
- [ ] Inloggning (enkel, t.ex. JWT eller bara en "User ID" generator för hackathon)
- [ ] Vy: "Mina Events" (Lista där man kan ta bort/redigera det AI hittat)
- [ ] Vy: "Lägg till Källa" (Klistra in URL eller instruktioner för boten)
- [ ] Komponent: "Din Kalender Länk" (Kopiera-knapp för .ics url)

### Fas 3: Integration & Polish
- [ ] Testa att prenumerera på kalendern i iPhone/Google
- [ ] Finjustera AI-prompts för bättre datumtolkning

---

## Tech Stack

```
Bot:        discord.js v14
Backend:    Node.js + Express
Database:   SQLite (better-sqlite3)
AI:         OpenRouter API (Accessing OpenAI/Claude etc)
Format:     iCalendar (.ics) via 'ics' npm package
Dashboard:  React + Vite
```

---

## Databas Schema (Preliminärt)

**events**
- id (uuid)
- user_id
- title (string)
- description (text)
- start_time (datetime ISO)
- end_time (datetime ISO)
- source_url (string, origin)
- created_at

---
