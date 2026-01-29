# CalSync - Discord to Calendar Bridge

> Ta bort schema-kaoset genom att samla events från Discord till din kalender.

---

## Projektöversikt

| Status | Fas |
|--------|-----|
| [ ] | Grundstruktur |
| [ ] | Discord Bot |
| [ ] | Backend API |
| [ ] | Google Calendar Integration |
| [ ] | Dashboard |
| [ ] | Polish & Demo |

---

## Team & Ansvarsområden

| Person | Område | Huvudfiler |
|--------|--------|------------|
| **Person 1** | Discord Bot | `bot/*` |
| **Person 2** | Backend API & Database | `server/*` |
| **Person 3** | Google Calendar Integration | `server/services/calendarSync.js` |
| **Person 4** | Dashboard UI | `dashboard/*` |

---

## Steg-för-steg Plan

### Fas 1: Setup (Alla tillsammans)
- [ ] Klona repo och kör `npm install`
- [ ] Skapa `.env` fil med tokens (se `.env.example`)
- [ ] Skapa Discord Application på https://discord.com/devers
- [ ] Skapa Google Cloud Project för Calendar API

### Fas 2: Parallellt arbete

#### Person 1 - Discord Bot
- [ ] Sätt upp grundläggande bot med discord.js
- [ ] Implementera `/watch` kommando (välj kanal att bevaka)
- [ ] Implementera `/unwatch` kommando
- [ ] Implementera `/list` kommando (visa bevakade kanaler)
- [ ] Lyssna på nya meddelanden i bevakade kanaler
- [ ] Lyssna på Discord Scheduled Events
- [ ] Skicka events till backend API

#### Person 2 - Backend API
- [ ] Sätt upp Express server
- [ ] Skapa SQLite databas schema
- [ ] `POST /api/events` - ta emot events från bot
- [ ] `GET /api/events` - hämta alla events
- [ ] `DELETE /api/events/:id` - ta bort event
- [ ] `GET /api/channels` - hämta bevakade kanaler
- [ ] `POST /api/channels` - lägg till kanal att bevaka

#### Person 3 - Calendar Integration
- [ ] Sätt upp Google Calendar API auth (OAuth2)
- [ ] Implementera `createEvent()` funktion
- [ ] Implementera `updateEvent()` funktion
- [ ] Implementera `deleteEvent()` funktion
- [ ] AI-parsning av meddelanden (extrahera datum/tid)
- [ ] Generera .ics fil som alternativ export

#### Person 4 - Dashboard
- [ ] Sätt upp React/Vite projekt
- [ ] Skapa layout med navbar
- [ ] Visa lista över kommande events
- [ ] Visa bevakade kanaler med toggle on/off
- [ ] Inställningssida för Google Calendar koppling
- [ ] Responsiv design

### Fas 3: Integration
- [ ] Koppla ihop bot → backend → calendar
- [ ] Testa hela flödet
- [ ] Fixa buggar

### Fas 4: Demo & Polish
- [ ] Skapa demo-presentation
- [ ] Dokumentera hur man kör projektet
- [ ] Spela in demo-video (backup)

---

## Tech Stack

```
Bot:        discord.js v14
Backend:    Node.js + Express
Database:   SQLite (better-sqlite3)
AI:         OpenAI API / Anthropic API
Calendar:   Google Calendar API
Dashboard:  React + Vite
Styling:    Tailwind CSS
```

---

## Git Workflow

### Branch-strategi

```
main (protected)
  │
  └── dev (integration branch)
        │
        ├── feature/discord-bot      (Person 1)
        ├── feature/backend-api      (Person 2)
        ├── feature/calendar-sync    (Person 3)
        └── feature/dashboard        (Person 4)
```

### Regler

1. **Aldrig pusha direkt till `main` eller `dev`**
2. **Varje person arbetar på sin egen feature-branch**
3. **Synka med dev ofta** (minst 1 gång per dag)

### Dagligt arbetsflöde

```bash
# 1. Börja dagen - hämta senaste från dev
git checkout dev
git pull origin dev
git checkout feature/din-branch
git merge dev

# 2. Arbeta och committa ofta
git add .
git commit -m "feat: beskrivande meddelande"

# 3. Pusha din branch
git push origin feature/din-branch

# 4. När feature är klar - skapa Pull Request till dev
# Gör detta via GitHub/GitLab UI
```

### Commit-meddelanden (Conventional Commits)

```
feat:     Ny funktionalitet
fix:      Buggfix
docs:     Dokumentation
style:    Formatering (ingen kodändring)
refactor: Omstrukturering av kod
test:     Tester
chore:    Övrigt (dependencies, config)
```

**Exempel:**
```bash
git commit -m "feat: add /watch command to discord bot"
git commit -m "fix: handle empty messages in event parser"
git commit -m "docs: update README with setup instructions"
```

### Pull Request Process

1. Skapa PR från din feature-branch → dev
2. Beskriv vad du gjort
3. Minst 1 person granskar (snabb review räcker)
4. Mergea via "Squash and merge"
5. Ta bort feature-branch efter merge

### Undvik Merge Conflicts

| Gör | Gör inte |
|-----|----------|
| Arbeta i separata mappar | Redigera samma fil som någon annan |
| Mergea dev ofta | Vänta länge med att synka |
| Små, ofta commits | Stora commits med många ändringar |
| Kommunicera i Discord | Anta att ingen annan jobbar på samma sak |

---

## Mappstruktur

```
chas-hack/
├── bot/
│   ├── index.js              # Bot entry point
│   ├── commands/
│   │   ├── watch.js          # /watch command
│   │   ├── unwatch.js        # /unwatch command
│   │   └── list.js           # /list command
│   └── listeners/
│       ├── messageCreate.js  # Lyssna på meddelanden
│       └── guildScheduled.js # Lyssna på Discord events
│
├── server/
│   ├── index.js              # Express entry point
│   ├── routes/
│   │   ├── events.js         # /api/events routes
│   │   └── channels.js       # /api/channels routes
│   ├── services/
│   │   ├── eventParser.js    # AI-parsning av text → event
│   │   └── calendarSync.js   # Google Calendar API
│   └── db/
│       ├── schema.sql        # Databas schema
│       └── index.js          # Databas connection
│
├── dashboard/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── .env.example              # Mall för miljövariabler
├── .gitignore
├── package.json
├── projectstatus.md          # Denna fil
└── README.md
```

---

## Miljövariabler (.env)

```env
# Discord
DISCORD_TOKEN=din_bot_token
DISCORD_CLIENT_ID=din_client_id

# Google Calendar
GOOGLE_CLIENT_ID=din_google_client_id
GOOGLE_CLIENT_SECRET=din_google_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# AI (välj en)
OPENAI_API_KEY=din_openai_key
ANTHROPIC_API_KEY=din_anthropic_key

# Server
PORT=3000
DATABASE_PATH=./server/db/database.sqlite
```

---

## Snabbkommandon

```bash
# Starta allt (från root)
npm run dev

# Endast bot
npm run bot

# Endast server
npm run server

# Endast dashboard
npm run dashboard
```

---

## Kontakt & Kommunikation

- **Discord-kanal:** #hackathon-team
- **Snabba frågor:** Skriv i Discord
- **Blockers:** Säg till direkt, vänta inte

---

*Senast uppdaterad: 2025-01-29*
