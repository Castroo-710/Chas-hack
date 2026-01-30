/**
 * AI Service - Parsar text till event-data
 * TODO: Koppla in OpenRouter / OpenAI här på riktigt
 */

async function parseEventText(text) {
  // Här skulle vi anropa OpenAI
  console.log(`🤖 AI analyserar text: "${text.substring(0, 50)}..."`);
  
  // Mockat svar för testning
  return {
    title: "AI Extraherat Event",
    description: text, // Vi sparar originaltexten som beskrivning
    location: "TBA",
    startTime: new Date(), // Just nu
    endTime: new Date(Date.now() + 3600000) // +1 timme
  };
}

module.exports = { parseEventText };
