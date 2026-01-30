const express = require('express');
const jwt = require('jsonwebtoken');
const { ensureUserExists, getUserById } = require('../db/index');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
// I ett riktigt scenario skulle detta vara en OAuth-callback.
// För hackathon: Skicka { username: "mittnamn", discordId: "12345" } för att logga in/skapa konto.
router.post('/login', (req, res) => {
  const { username, discordId } = req.body;

  if (!username || !discordId) {
    return res.status(400).json({ error: 'Username och DiscordID krävs' });
  }

  try {
    // Hitta eller skapa användare i DB
    const user = ensureUserExists(discordId, username);

    // Skapa JWT payload
    const userForToken = { 
      id: user.id, 
      username: user.username,
      discordId: user.discord_id 
    };

    // Signera token (giltig i 24h)
    const accessToken = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      accessToken, 
      user: userForToken,
      calendarUrl: `/api/calendar/${user.calendar_token}.ics`
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internt serverfel vid inloggning' });
  }
});

// GET /api/auth/me
// Test-endpoint för att se vem man är inloggad som
router.get('/me', authenticateToken, (req, res) => {
  // req.user kommer från authenticateToken middleware
  const dbUser = getUserById(req.user.id);
  
  if (!dbUser) {
    return res.status(404).json({ error: 'Användare hittades inte' });
  }

  res.json({
    id: dbUser.id,
    username: dbUser.username,
    discordId: dbUser.discord_id,
    calendarToken: dbUser.calendar_token
  });
});

module.exports = router;
