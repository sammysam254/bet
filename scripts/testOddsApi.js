// Script to test The Odds API connectivity and fetch real games
import fs from 'fs';

// Read .env if available
let apiKey = process.env.VITE_ODDS_API_KEY || '';

if (!apiKey && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/VITE_ODDS_API_KEY=(.*)/);
  if (match && match[1]) {
    apiKey = match[1].trim();
  }
}

if (!apiKey && fs.existsSync('.env.example')) {
  const envContent = fs.readFileSync('.env.example', 'utf-8');
  const match = envContent.match(/VITE_ODDS_API_KEY=(.*)/);
  if (match && match[1] && match[1].trim() !== 'your_the_odds_api_key_here') {
    apiKey = match[1].trim();
  }
}

console.log('Testing The Odds API Connection...');
console.log('API Key detected:', apiKey ? `${apiKey.substring(0, 6)}...` : 'NONE (Still default placeholder)');

if (!apiKey || apiKey === 'your_the_odds_api_key_here') {
  console.log('\n[INFO] No real API key configured yet. To test real live data:');
  console.log('1. Obtain a free API key at https://the-odds-api.com/');
  console.log('2. Replace VITE_ODDS_API_KEY in .env');
  console.log('3. Or paste it directly in the Sportsbook UI under Menu -> Odds API Provider Settings');
  process.exit(0);
}

const url = `https://api.the-odds-api.com/v4/sports/soccer_uefa_champs_league/odds/?apiKey=${apiKey}&regions=eu&markets=h2h`;

async function testApi() {
  try {
    const res = await fetch(url);
    console.log('Odds Endpoint HTTP Status:', res.status, res.statusText);
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log(`\nSUCCESS: Fetched ${data.length} real live games from The Odds API:`);
      data.slice(0, 3).forEach((game, idx) => {
        const bookmaker = game.bookmakers?.[0];
        const odds = bookmaker?.markets?.[0]?.outcomes || [];
        const oddsStr = odds.map(o => `${o.name}: ${o.price}`).join(' | ');
        console.log(`[${idx + 1}] ${game.home_team} vs ${game.away_team} -> ${oddsStr}`);
      });
    } else {
      console.log('Odds API Response:', data);
    }

    // Test Scores Endpoint for automated settlement
    console.log('\nTesting Scores endpoint for automated settlement...');
    const scoresUrl = `https://api.the-odds-api.com/v4/sports/soccer_epl/scores/?apiKey=${apiKey}&daysFrom=2`;
    const scoresRes = await fetch(scoresUrl);
    console.log('Scores Endpoint HTTP Status:', scoresRes.status, scoresRes.statusText);
    const scoresData = await scoresRes.json();
    if (Array.isArray(scoresData)) {
      console.log(`SUCCESS: Fetched ${scoresData.length} match score records.`);
      scoresData.slice(0, 3).forEach(s => {
        console.log(`- ${s.home_team} vs ${s.away_team} | Completed: ${s.completed} | Scores: ${JSON.stringify(s.scores || [])}`);
      });
    }
  } catch (err) {
    console.error('API Fetch error:', err.message);
  }
}

testApi();
