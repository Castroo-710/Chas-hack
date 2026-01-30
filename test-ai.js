require('dotenv').config();
const { parseEventFromText, parseEventFromUrl } = require('./server/services/eventParser');

async function test() {
  console.log('--- Testar Event Parser (Person 3) ---\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Ingen OPENAI_API_KEY hittades i .env filen!');
    console.error('   Kopiera .env.example till .env och lägg in din nyckel.');
    return;
  }

  // Test 1: Enkel text
  const textExample = "Vi ska ha hackathon på fredag kl 17:00 i Stockholm. Det slutar på söndag kl 12.";
  console.log(`📝 Analyserar text: "${textExample}"`);
  const resultText = await parseEventFromText(textExample);
  console.log('Resultat:', JSON.stringify(resultText, null, 2));
  console.log('\n-----------------------------------\n');

  // Test 2: URL (Om du vill testa, avkommentera nedan)
  /*
  const urlExample = "https://www.meetup.com/något-event";
  console.log(`🌐 Skrapar URL: ${urlExample}`);
  const resultUrl = await parseEventFromUrl(urlExample);
  console.log('Resultat:', JSON.stringify(resultUrl, null, 2));
  */
  
  console.log('✅ Test klart (om du fick JSON ovan).');
}

test();
