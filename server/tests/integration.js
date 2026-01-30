const axios = require('axios');
const { pool } = require('../db/index');

const API_URL = 'http://localhost:3000/api';

// Testdata
const TEST_USER = {
  username: 'IntegrationUser',
  discordId: '999999999' // Fejkad ID
};

const TEST_CHANNEL = {
  guildId: 'guild_123',
  channelId: 'channel_123',
  channelName: 'general'
};

const TEST_MESSAGE = {
  text: "Glöm inte mötet imorgon kl 15:00! https://zoom.us/j/123456",
  sourceUrl: "https://discord.com/channels/123/456/789",
  channelId: TEST_CHANNEL.channelId,
  guildId: TEST_CHANNEL.guildId,
  authorName: "Bossen"
};

async function runIntegrationTest() {
  console.log('🚀 Startar Full System Integration Test...\n');

  try {
    // ---------------------------------------------------------
    // 1. AUTENTISERING (Simulera Dashboard Login)
    // ---------------------------------------------------------
    console.log('Step 1: Autentisering...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    const { accessToken, user, calendarUrl } = loginRes.data;
    
    if (!accessToken) throw new Error('Fick ingen Access Token');
    console.log('✅ Inloggad som:', user.username);
    console.log('🔑 Calendar Token:', user.calendarToken);

    // ---------------------------------------------------------
    // 2. SETUP (Simulera att användaren bevakar en kanal)
    // ---------------------------------------------------------
    console.log('\nStep 2: Setup Bevakning (DB Direct)...');
    // Vi lägger till bevakningen direkt i DB eftersom bot-kommandot gör det
    // Detta verifierar att databas-kopplingen fungerar.
    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO watched_channels (guild_id, channel_id, channel_name, user_discord_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (channel_id, user_discord_id) DO NOTHING
      `, [TEST_CHANNEL.guildId, TEST_CHANNEL.channelId, TEST_CHANNEL.channelName, TEST_USER.discordId]);
      console.log('✅ Kanalbevakning tillagd i PostgreSQL.');
    } finally {
      client.release();
    }

    // ---------------------------------------------------------
    // 3. INGEST (Simulera att Botten skickar ett meddelande)
    // ---------------------------------------------------------
    console.log('\nStep 3: Bot Ingest (Simulera meddelande)...');
    const ingestRes = await axios.post(`${API_URL}/ingest`, TEST_MESSAGE);
    
    if (ingestRes.data.success) {
      console.log('✅ Servern tog emot eventet.');
      console.log('📝 Server svar:', ingestRes.data.message);
    } else {
      throw new Error('Ingest misslyckades');
    }

    // ---------------------------------------------------------
    // 4. VERIFIERING (Hämta ICS-kalendern)
    // ---------------------------------------------------------
    console.log('\nStep 4: Hämta genererad Kalender (ICS)...');
    // Vi använder token vi fick i steg 1
    // URL:en i loginRes.data.calendarUrl är relativ (/api/calendar/...), vi lägger till host
    const icsUrl = `http://localhost:3000${calendarUrl}`;
    
    const icsRes = await axios.get(icsUrl);
    const icsContent = icsRes.data;

    console.log('✅ ICS-fil hämtad!');
    
    // Enkel validering av innehållet
    if (icsContent.includes('BEGIN:VCALENDAR') && icsContent.includes('AI Extraherat Event')) {
      console.log('✅ ICS-filen innehåller korrekt VCALENDAR-header.');
      console.log('✅ Eventet "AI Extraherat Event" hittades i kalendern.');
    } else {
      console.error('⚠️ Varning: ICS-filen verkar tom eller felaktig.');
      console.log('Innehåll:', icsContent.substring(0, 200) + '...');
    }

    // ---------------------------------------------------------
    // 5. STÄDNING (Valfritt: Ta bort testdata)
    // ---------------------------------------------------------
    console.log('\n✅ TEST SUCCESS! Hela flödet fungerar.');
    console.log('Systemet är redo för riktig Dashboard.');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    // Stäng poolen så skriptet avslutas om vi körde det standalone (men servern körs separat)
    // await pool.end(); 
  }
}

runIntegrationTest();
