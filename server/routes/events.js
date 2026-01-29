const express = require('express');
const router = express.Router();

// GET /api/events - Hämta alla events
router.get('/', async (req, res) => {
  // TODO: Hämta från databas
  res.json({ events: [] });
});

// POST /api/events - Skapa nytt event
router.post('/', async (req, res) => {
  const { title, description, date, source } = req.body;

  // TODO: Spara till databas
  // TODO: Skicka till calendarSync för att skapa i Google Calendar

  res.json({ success: true, event: { title, date } });
});

// DELETE /api/events/:id - Ta bort event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // TODO: Ta bort från databas
  // TODO: Ta bort från Google Calendar

  res.json({ success: true });
});

module.exports = router;
