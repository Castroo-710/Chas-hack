const express = require('express');
const router = express.Router();
const { parseEventFromUrl, parseEventFromText } = require('../services/eventParser');
const { addEvent } = require('../db/index');

// POST /api/ingest
router.post('/', async (req, res) => {
    try {
        const { text, sourceUrl, channelId, guildId, authorName } = req.body;

        console.log(`[Ingest] Received content from ${authorName} in channel ${channelId}`);

        let eventData;

        // 1. Determine if we should parse URL or Text
        // Ideally the bot sends 'sourceUrl' if it found a link.
        if (sourceUrl) {
            console.log(`[Ingest] Parsing URL: ${sourceUrl}`);
            eventData = await parseEventFromUrl(sourceUrl);
        } else {
            console.log(`[Ingest] Parsing Text: ${text.substring(0, 50)}...`);
            eventData = await parseEventFromText(text);
        }

        if (!eventData || !eventData.is_event) {
            console.log('[Ingest] No event found in content.');
            return res.json({ success: false, message: 'No event detected.' });
        }

        console.log('[Ingest] Event found:', eventData.title);

        // 2. Save to Database
        // Note: 'discordUserId' is not passed from bot yet (it passed authorName), 
        // but the DB 'events' table expects 'discord_user_id'. 
        // allowed null? Let's assume we can pass null or we need to update bot to send ID.
        // Looking at bot/listeners/messageCreate.js, it sends: text, sourceUrl, channelId, guildId, authorName.
        // It does NOT send authorId. I should update bot to send authorId too. 
        // For now, I will use a placeholder or 0 if DB requires it, but let's assume we update the bot in next step.

        // Actually, looking at db/index.js addEvent:
        // VALUES (?, ?, ?, ?, ?, ?, ?) -> discordUserId, title, description, location, startTime, endTime, sourceUrl
        // I need discordUserId.
        // I will update this file to expect discordUserId from body.

        const newEvent = {
            discordUserId: req.body.discordUserId, // Will update bot to send this
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startTime: eventData.start_time,
            endTime: eventData.end_time,
            sourceUrl: sourceUrl || null
        };

        await addEvent(newEvent);

        res.json({
            success: true,
            event: eventData
        });

    } catch (error) {
        console.error('[Ingest] Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
