const axios = require('axios');
const jwt = require('jsonwebtoken');

// Konfigurera API-URL
const API_URL = 'http://localhost:3000/api/auth';
// Mock User Data
const mockUser = {
  username: 'TestUser',
  discordId: '123456789'
};

async function testAuthFlow() {
  console.log('🏁 Startar Auth Test...');

  try {
    // 1. Logga in (Simulera Discord OAuth)
    console.log(`📡 Skickar inloggning för ${mockUser.username}...`);
    const loginRes = await axios.post(`${API_URL}/login`, mockUser);
    
    if (loginRes.status !== 200) {
      console.error('❌ Login misslyckades:', loginRes.status);
      return;
    }

    const { accessToken, user, calendarUrl } = loginRes.data;
    console.log('✅ Login lyckades!');
    console.log(`🔑 Token mottagen: ${accessToken.substring(0, 20)}...`);
    console.log(`📅 Kalender URL: ${calendarUrl}`);

    // 2. Använd token för att hämta "Me" (Skyddad resurs)
    console.log('📡 Hämtar skyddad profil (/me)...');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (meRes.status === 200) {
      console.log('✅ Token validering lyckades!');
      console.log('👤 Profil:', meRes.data);
    } else {
      console.error('❌ Token validering misslyckades:', meRes.status);
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ API Fel:', error.response.status, error.response.data);
    } else {
      console.error('❌ Nätverksfel:', error.message);
    }
  }
}

testAuthFlow();
