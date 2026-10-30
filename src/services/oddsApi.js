// Vertex Betting - Real Live The Odds API Service & Automated Settlement Engine

const DEFAULT_API_KEY = 'b5dfd0916bfd8ddab51fce377d45aa48';
const STORAGE_KEY_API_CONFIG = 'vertex_odds_api_config';

export const getOddsApiConfig = () => {
  const saved = localStorage.getItem(STORAGE_KEY_API_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey) return parsed;
    } catch (e) {
      /* ignore */
    }
  }

  const envKey = import.meta.env?.VITE_ODDS_API_KEY;
  const activeKey = (envKey && envKey !== 'your_the_odds_api_key_here') ? envKey : DEFAULT_API_KEY;

  return {
    provider: 'The Odds API',
    apiKey: activeKey,
    baseUrl: 'https://api.the-odds-api.com/v4',
    isLiveConnected: true
  };
};

export const saveOddsApiConfig = (newConfig) => {
  const current = getOddsApiConfig();
  const merged = { ...current, ...newConfig, isLiveConnected: Boolean(newConfig.apiKey?.trim()) };
  localStorage.setItem(STORAGE_KEY_API_CONFIG, JSON.stringify(merged));
  return merged;
};

// Sport ID to live sport key mapping
export const SPORT_KEYS_MAP = {
  football: 'soccer_epl',
  ucl: 'soccer_uefa_champs_league',
  epl: 'soccer_epl',
  laliga: 'soccer_spain_la_liga',
  basketball: 'basketball_nba',
  tennis: 'tennis_atp_vienna_open',
  nfl: 'americanfootball_nfl',
  baseball: 'baseball_mlb',
  icehockey: 'icehockey_nhl',
  cricket: 'cricket_international_t20'
};

// Fetch live odds from feed provider
export const fetchLiveOddsFromProvider = async (sportId = 'football') => {
  const config = getOddsApiConfig();
  const sportKey = SPORT_KEYS_MAP[sportId];

  if (!sportKey) {
    return { isLiveFeed: false, data: [], count: 0 };
  }

  try {
    const url = `${config.baseUrl}/sports/${sportKey}/odds/?apiKey=${config.apiKey}&regions=eu,us&markets=h2h&oddsFormat=decimal`;
    const res = await fetch(url);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `API error ${res.status}`);
    }
    const rawMatches = await res.json();

    if (!Array.isArray(rawMatches) || rawMatches.length === 0) {
      return { isLiveFeed: true, data: [], count: 0 };
    }

    // Transform into Vertex Betting match format
    const transformed = rawMatches.map((m, index) => {
      // Pick best bookmaker (e.g. Pinnacle, Betfair, BetMGM, or first available)
      const bookmaker = m.bookmakers?.[0] || {};
      const h2h = bookmaker.markets?.[0]?.outcomes || [];
      const homeOutcome = h2h.find(o => o.name === m.home_team) || { price: 1.84 + (index % 5) * 0.1 };
      const awayOutcome = h2h.find(o => o.name === m.away_team) || { price: 2.50 + (index % 4) * 0.15 };
      const drawOutcome = h2h.find(o => o.name.toLowerCase() === 'draw') || { price: 3.40 };

      const commenceDate = new Date(m.commence_time);
      const isLiveNow = commenceDate <= new Date();

      return {
        id: m.id,
        sport: sportId,
        league: m.sport_title || 'Premier League',
        date: commenceDate.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        time: commenceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        homeTeam: { name: m.home_team, shortName: m.home_team.substring(0, 3).toUpperCase() },
        awayTeam: { name: m.away_team, shortName: m.away_team.substring(0, 3).toUpperCase() },
        odds: {
          home: Number(homeOutcome.price) || 1.84,
          draw: Number(drawOutcome.price) || 3.40,
          away: Number(awayOutcome.price) || 2.50
        },
        bookmakerName: bookmaker.title || 'Live Feed',
        isLive: isLiveNow
      };
    });

    return {
      isLiveFeed: true,
      data: transformed,
      count: transformed.length
    };
  } catch (err) {
    console.warn('Real Odds API fetch warning:', err.message);
    return {
      isLiveFeed: false,
      error: err.message,
      data: []
    };
  }
};

// 2. Automated Bet Settlement Engine
// In-memory score cache to protect The Odds API rate limit while running 1s settlement engine
let scoresCache = [];
let lastScoresFetchTime = 0;

// System continuously checks real scores from The Odds API & processes settlements
export const checkBetSettlements = async (openBets = [], simulatedFullTime = null) => {
  if (openBets.length === 0) return [];

  const config = getOddsApiConfig();
  const settledResults = [];

  // Manual / Demo match whistle trigger (e.g. Chelsea 2 - 1 Man United)
  if (simulatedFullTime) {
    for (const bet of openBets) {
      for (const pick of bet.picks) {
        if (pick.matchId === simulatedFullTime.matchId || pick.matchTitle?.toLowerCase().includes('chelsea')) {
          const won = pick.outcome === simulatedFullTime.winningOutcome;
          settledResults.push({
            betId: bet.id,
            status: won ? 'WON' : 'LOST',
            payout: won ? bet.payout : 0,
            stake: bet.stake,
            matchTitle: pick.matchTitle,
            selectionName: pick.selectionName,
            settledAt: new Date().toLocaleTimeString(),
            finalScore: simulatedFullTime.scoreStr
          });
        }
      }
    }
    return settledResults;
  }

  // Live Odds API Scores Endpoint Check (refreshes upstream data every 15s to conserve API quota while ticking every 1s)
  if (config.apiKey) {
    try {
      const now = Date.now();
      if (now - lastScoresFetchTime > 15000 || scoresCache.length === 0) {
        const sportKeys = ['soccer_epl', 'soccer_uefa_champs_league', 'basketball_nba'];
        const fetchedScores = [];
        for (const sportKey of sportKeys) {
          try {
            const url = `${config.baseUrl}/sports/${sportKey}/scores/?apiKey=${config.apiKey}&daysFrom=1`;
            const res = await fetch(url);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) fetchedScores.push(...data);
            }
          } catch (e) {
            // ignore individual sport fetch failure
          }
        }
        scoresCache = fetchedScores;
        lastScoresFetchTime = now;
      }

      // Check current open bets against scores
      if (scoresCache.length > 0) {
        for (const bet of openBets) {
          for (const pick of bet.picks) {
            const matchScore = scoresCache.find(s => (s.id === pick.matchId || s.id === pick.id) && s.completed);
            if (matchScore && matchScore.scores?.length >= 2) {
              const homeScore = Number(matchScore.scores.find(s => s.name === matchScore.home_team)?.score || 0);
              const awayScore = Number(matchScore.scores.find(s => s.name === matchScore.away_team)?.score || 0);

              let winningOutcome = 'X';
              if (homeScore > awayScore) winningOutcome = '1';
              else if (awayScore > homeScore) winningOutcome = '2';

              const won = pick.outcome === winningOutcome;
              settledResults.push({
                betId: bet.id,
                status: won ? 'WON' : 'LOST',
                payout: won ? bet.payout : 0,
                stake: bet.stake,
                matchTitle: `${matchScore.home_team} vs ${matchScore.away_team}`,
                selectionName: pick.selectionName,
                settledAt: new Date().toLocaleTimeString(),
                finalScore: `${homeScore} - ${awayScore}`
              });
            }
          }
        }
      }
    } catch (e) {
      // Quiet background check
    }
  }

  return settledResults;
};
