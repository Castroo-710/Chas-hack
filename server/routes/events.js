const express = require('express');
const router = express.Router();

const { getEvents, addEvent } = require('../db/index');

// GET /api/events - Hämta alla events
router.get('/', async (req, res) => {
  try {
    // Om vi har user från middleware (om vi lägger till det senare):
    const userId = req.user ? req.user.discordId : null;

    // För nu, hämta alla om vi inte har auth, eller hämta för specifik user om vi vill
    const events = await getEvents(userId);

    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - Skapa nytt event
router.post('/', async (req, res) => {
  try {
    const { title, description, location, startTime, endTime, discordUserId } = req.body;

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields: title, startTime, endTime' });
    }

    // Create event object
    const newEvent = {
      discordUserId: discordUserId || null, // Allow null for dashboard-created events
      title,
      description: description || '',
      location: location || '',
      startTime,
      endTime,
      sourceUrl: null
    };

    // Save to database
    const result = await addEvent(newEvent);

    // Return the created event with ID
    res.json({
      success: true,
      event: {
        id: result.lastInsertRowid,
        ...newEvent
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE /api/events/:id - Ta bort event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await deleteEvent(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
