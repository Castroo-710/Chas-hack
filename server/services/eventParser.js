/**
 * Event Parser - Använder AI för att extrahera event-information från text och URL:er
 */
require('dotenv').config();
const OpenAI = require('openai');
const axios = require('axios');

// Konfigurera OpenRouter (kompatibel med OpenAI SDK)
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://github.com/chas-hackathon/calsync', // Byt ut mot er faktiska URL
    'X-Title': 'CalSync',
  },
});

const MODEL = 'openai/gpt-4o-mini'; // Prisvärd och snabb modell via OpenRouter

// --- KONFIGURATION FÖR NOTISER ---
// Här kan du enkelt ändra när notiser ska skickas.
// Varje objekt i listan blir en separat notis i kalendern.
const DEFAULT_ALARMS = [
  { weeks: 2 }, // 1 vecka innan
  { days: 1 }   // 1 dag innan
];
// ---------------------------------

/**
 * Extraherar event-data från ostrukturerad text
 * @param {string} text - Texten att analysera
 * @returns {Promise<Object>} - Event-objektet
 */
async function parseEventFromText(text) {
  const today = new Date().toISOString();

  const systemPrompt = `
    You are an intelligent event parser. Your job is to extract calendar event details from the user's input.
    
    Current Date: ${today} (Use this to resolve relative dates like "tomorrow" or "next Friday").
    Default Time Zone: CET (Central European Time).

    Output must be valid JSON matching this schema:
    {
      "title": "Clear and specific title for the event",
      "description": "Short summary of the event details",
      "location": "Physical location or URL (if found)",
      "start_time": "ISO 8601 string (YYYY-MM-DDTHH:mm:ss)",
      "end_time": "ISO 8601 string (YYYY-MM-DDTHH:mm:ss) - Estimate 1h duration if not specified",
      "is_event": boolean (true if this looks like an event, false if it's just chat)
    }

    If the text contains multiple events, just extract the first/main one.
    If the text is NOT an event (e.g., "Hello how are you"), set "is_event": false and other fields to null.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content);

    // Lägg till automatiska påminnelser om det är ett giltigt event
    if (result.is_event) {
      result.alarms = DEFAULT_ALARMS.map(interval => ({
        action: 'display',
        description: 'Påminnelse: ' + (result.title || 'Event'),
        trigger: { ...interval, before: true }
      }));
    }

    return result;
  } catch (error) {
    console.error('Error parsing event with AI:', error);
    return { is_event: false, error: 'AI processing failed' };
  }
}

/**
 * Hämtar text från en URL och försöker hitta ett event
 * @param {string} url 
 */
async function parseEventFromUrl(url) {
  try {
    console.log(`Scraping URL: ${url}`);
    // 1. Hämta HTML
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'CalSyncBot/1.0' }
    });

    // 2. Rensa HTML (väldigt enkelt, ta bort scripts/styles och taggar)
    let text = response.data;
    text = text.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, ""); // Ta bort script
    text = text.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");   // Ta bort style
    text = text.replace(/<[^>]+>/g, "\n");                             // Ersätt taggar med nyrad
    text = text.replace(/\s+/g, " ").trim();                           // Snygga till whitespace

    // Begränsa textlängd för att spara tokens
    const truncatedText = text.substring(0, 8000);

    // 3. Skicka till AI
    return await parseEventFromText(`Source URL: ${url}\n\nPage Content:\n${truncatedText}`);

  } catch (error) {
    console.error('Error fetching URL:', error.message);
    return { is_event: false, error: 'Could not fetch URL' };
  }
}

async function isEventMessage(text) {
  return true;
}

module.exports = {
  parseEventFromText,
  parseEventFromUrl,
  isEventMessage,
};