/**
 * Event Parser - Använder AI för att extrahera event-information från text
 */

// TODO: Välj AI-provider (OpenAI eller Anthropic)

async function parseEventFromText(text) {
  // TODO: Implementera AI-anrop för att extrahera:
  // - Titel
  // - Datum
  // - Tid
  // - Beskrivning

  // Exempel på prompt:
  // "Extract event information from this message. Return JSON with: title, date, time, description"

  return {
    title: null,
    date: null,
    time: null,
    description: null,
    confidence: 0,
  };
}

async function isEventMessage(text) {
  // TODO: Använd AI för att avgöra om meddelandet innehåller ett event
  // Return true/false

  return false;
}

module.exports = {
  parseEventFromText,
  isEventMessage,
};
