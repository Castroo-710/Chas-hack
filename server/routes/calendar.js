const express = require('express');
const router = express.Router();
const ics = require('ics');
const { pool } = require('../db/index');

// GET /api/calendar/:token.ics
router.get('/:token.ics', async (req, res) => {
    const { token } = req.params;

    try {
        // 1. Hitta användaren baserat på token
        const userResult = await pool.query(
            'SELECT * FROM users WHERE calendar_token = $1',
            [token]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).send('Calendar not found');
        }

        const user = userResult.rows[0];

        // 2. Hitta alla events för denna användare
        const eventsResult = await pool.query(
            'SELECT * FROM events WHERE discord_user_id = $1 ORDER BY start_time ASC',
            [user.discord_id]
        );

        const dbEvents = eventsResult.rows;

        if (dbEvents.length === 0) {
            // Skapa ett placeholder-event så kalendern inte är helt tom
            const { error, value } = ics.createEvent({
                start: [2024, 1, 1, 0, 0],
                duration: { hours: 1 },
                title: 'Välkommen till CalSync!',
                description: 'Dina events kommer dyka upp här automatiskt.',
            });
            res.setHeader('Content-Type', 'text/calendar');
            return res.send(value);
        }

        // 3. Formatera för 'ics' paketet
        const calendarEvents = dbEvents.map(event => {
            const start = new Date(event.start_time);
            const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 60 * 60 * 1000);

            return {
                start: [
                    start.getFullYear(),
                    start.getMonth() + 1,
                    start.getDate(),
                    start.getHours(),
                    start.getMinutes()
                ],
                end: [
                    end.getFullYear(),
                    end.getMonth() + 1,
                    end.getDate(),
                    end.getHours(),
                    end.getMinutes()
                ],
                title: event.title,
                description: event.description || '',
                location: event.location || '',
                url: event.source_url || undefined
            };
        });

        const { error, value } = ics.createEvents(calendarEvents);

        if (error) {
            console.error('ICS generation error:', error);
            return res.status(500).send('Error generating calendar');
        }

        // 4. Skicka filen
        res.setHeader('Content-Type', 'text/calendar');
        res.setHeader('Content-Disposition', `attachment; filename="calendar.ics"`);
        res.send(value);

    } catch (error) {
        console.error('Calendar error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
