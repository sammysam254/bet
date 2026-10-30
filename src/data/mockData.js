// Modern Sportsbook Architecture & Mock Data

export const API_CONFIG = {
  provider: 'The Odds API / Sportmonks / API-Football',
  apiKey: '', // To be filled when integrating external API key
  isLiveApiConnected: false,
  status: 'Ready for external Odds API key integration'
};

export const SPORTS_CATEGORIES = [
  { id: 'football', name: 'Football', icon: '⚽', hasLiveOdds: true, count: 5 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', hasLiveOdds: true, count: 2 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', hasLiveOdds: true, count: 1 },
  { id: 'baseball', name: 'Baseball', icon: '⚾', hasLiveOdds: false, count: 0 },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', hasLiveOdds: false, count: 0 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', hasLiveOdds: false, count: 0 },
  { id: 'esports', name: 'Esports', icon: '🎮', hasLiveOdds: false, count: 0 }
];

export const LEAGUES_LIST = [
  { id: 'ucl', name: 'UEFA Champions League', sportId: 'football', icon: 'ucl', count: 5, active: true },
  { id: 'epl', name: 'Premier League', sportId: 'football', icon: 'trophy', count: 0, active: false },
  { id: 'laliga', name: 'La Liga EA Sports', sportId: 'football', icon: 'shield', count: 0, active: false },
  { id: 'seriea', name: 'Serie A TIM', sportId: 'football', icon: 'shield', count: 0, active: false },
  { id: 'bundesliga', name: 'Bundesliga', sportId: 'football', icon: 'shield', count: 0, active: false },
  { id: 'nba', name: 'NBA Playoffs', sportId: 'basketball', icon: 'basketball', count: 2, active: true }
];

export const FEATURED_MATCH = {
  id: 'featured-1',
  sport: 'football',
  matchday: 'Matchday 1',
  league: 'UEFA Champions League',
  group: 'Group A',
  isLive: true,
  clock: '24:33',
  period: '1st half',
  homeTeam: {
    name: 'Chelsea',
    shortName: 'CHE',
    score: 2,
    color: '#034694'
  },
  awayTeam: {
    name: 'Man United',
    shortName: 'MUN',
    score: 1,
    color: '#da291c'
  },
  odds: {
    home: 1.84,
    draw: 4.20,
    away: 3.74
  },
  events: [
    { id: 1, time: "11'", type: 'goal', player: 'O. Watkins', team: 'home' },
    { id: 2, time: "15'", type: 'goal', player: 'O. Watkins', team: 'home' },
    { id: 3, time: "22'", type: 'goal', player: 'I. Mbaye', team: 'away' }
  ],
  h2h: {
    homeWinPct: 46.67,
    homeWins: 7,
    drawPct: 20.00,
    draws: 3,
    awayWinPct: 33.33,
    awayWins: 5
  },
  stats: {
    attacks: { home: 56, away: 75, trend: 'away' },
    dangers: { home: 25, away: 21, trend: 'home' },
    saves: { home: 16, away: 16, trend: 'even' },
    shots: { home: 25, away: 28, trend: 'away' },
    onTarget: { home: 7, away: 6, trend: 'home' },
    possession: { home: 52, away: 48 },
    corners: { home: 4, away: 6 },
    yellowCards: { home: 1, away: 2 }
  },
  lineups: {
    home: {
      formation: '4-3-3',
      players: ['Sanchez', 'James', 'Silva', 'Colwill', 'Chilwell', 'Fernandez', 'Caicedo', 'Gallagher', 'Sterling', 'Watkins', 'Mudryk']
    },
    away: {
      formation: '4-2-3-1',
      players: ['Onana', 'Dalot', 'Varane', 'Martinez', 'Shaw', 'Casemiro', 'Mainoo', 'Antony', 'Fernandes', 'Rashford', 'Mbaye']
    }
  },
  commentary: [
    { time: "24'", text: "Yellow card issued to Casemiro after a late challenge in midfield." },
    { time: "22'", text: "⚽ GOAL! I. Mbaye converts with a stunning low drive into the bottom left corner for Man United!" },
    { time: "18'", text: "Corner kick for Manchester United. Bruno Fernandes delivers into the box, cleared by Silva." },
    { time: "15'", text: "⚽ GOAL! O. Watkins bags a quick-fire double! Header from point-blank range makes it 2-0 Chelsea!" },
    { time: "11'", text: "⚽ GOAL! O. Watkins breaks the deadlock with a clinical finish after Enzo Fernandez's through ball!" },
    { time: "1'", text: "Kick-off! UEFA Champions League Group A showdown is underway at Stamford Bridge." }
  ],
  comments: [
    { id: 1, user: 'Alex_CFC', time: '2m ago', text: 'Watkins is on fire tonight!! Hat-trick incoming 🔥⚽', likes: 14 },
    { id: 2, user: 'RedDevil99', time: '1m ago', text: 'Mbaye brought us right back into this game. Defense needs to wake up though!', likes: 8 },
    { id: 3, user: 'TacticsGuru', time: 'Just now', text: 'Chelsea dominating the dangerous attacks (25 vs 21). High tempo match!', likes: 4 }
  ]
};

export const LEAGUE_MATCHES = [
  {
    id: 'cl-match-1',
    sport: 'football',
    league: 'UEFA Champions League',
    date: '16 April',
    time: '20:00',
    homeTeam: { name: 'Borussia D', shortName: 'BVB' },
    awayTeam: { name: 'Barcelona', shortName: 'BAR' },
    odds: { home: 1.84, draw: 4.20, away: 3.74 }
  },
  {
    id: 'cl-match-2',
    sport: 'football',
    league: 'UEFA Champions League',
    date: '16 April',
    time: '20:00',
    homeTeam: { name: 'Aston Villa', shortName: 'AVL' },
    awayTeam: { name: 'PSG', shortName: 'PSG' },
    odds: { home: 2.10, draw: 3.50, away: 3.10 }
  },
  {
    id: 'cl-match-3',
    sport: 'football',
    league: 'UEFA Champions League',
    date: '17 April',
    time: '21:00',
    homeTeam: { name: 'Real Madrid', shortName: 'RMA' },
    awayTeam: { name: 'Bayern Munich', shortName: 'BAY' },
    odds: { home: 1.95, draw: 3.80, away: 3.40 }
  },
  {
    id: 'cl-match-4',
    sport: 'football',
    league: 'UEFA Champions League',
    date: '17 April',
    time: '21:00',
    homeTeam: { name: 'Arsenal', shortName: 'ARS' },
    awayTeam: { name: 'Inter Milan', shortName: 'INT' },
    odds: { home: 1.75, draw: 3.90, away: 4.50 }
  }
];

export const OTHER_SPORTS_MATCHES = {
  basketball: [
    {
      id: 'nba-1',
      sport: 'basketball',
      league: 'NBA Playoffs',
      date: 'Tonight',
      time: '20:30',
      homeTeam: { name: 'LA Lakers', shortName: 'LAL' },
      awayTeam: { name: 'Golden State', shortName: 'GSW' },
      odds: { home: 1.90, draw: 15.0, away: 1.95 }
    },
    {
      id: 'nba-2',
      sport: 'basketball',
      league: 'NBA Playoffs',
      date: 'Tonight',
      time: '22:00',
      homeTeam: { name: 'Boston Celtics', shortName: 'BOS' },
      awayTeam: { name: 'Miami Heat', shortName: 'MIA' },
      odds: { home: 1.45, draw: 18.0, away: 2.80 }
    }
  ],
  tennis: [
    {
      id: 'atp-1',
      sport: 'tennis',
      league: 'ATP Masters 1000',
      date: 'Tomorrow',
      time: '14:00',
      homeTeam: { name: 'C. Alcaraz', shortName: 'ALC' },
      awayTeam: { name: 'J. Sinner', shortName: 'SIN' },
      odds: { home: 1.88, draw: 0, away: 1.92 }
    }
  ],
  baseball: [
    {
      id: 'mlb-1',
      sport: 'baseball',
      league: 'MLB World Series',
      date: 'Tonight',
      time: '20:00',
      homeTeam: { name: 'New York Yankees', shortName: 'NYY' },
      awayTeam: { name: 'Los Angeles Dodgers', shortName: 'LAD' },
      odds: { home: 1.95, draw: 0, away: 1.87 }
    },
    {
      id: 'mlb-2',
      sport: 'baseball',
      league: 'MLB Championship',
      date: 'Tomorrow',
      time: '19:30',
      homeTeam: { name: 'Boston Red Sox', shortName: 'BOS' },
      awayTeam: { name: 'Houston Astros', shortName: 'HOU' },
      odds: { home: 2.10, draw: 0, away: 1.76 }
    }
  ],
  nfl: [
    {
      id: 'nfl-1',
      sport: 'nfl',
      league: 'NFL Regular Season',
      date: 'Sunday',
      time: '18:00',
      homeTeam: { name: 'Kansas City Chiefs', shortName: 'KC' },
      awayTeam: { name: 'San Francisco 49ers', shortName: 'SF' },
      odds: { home: 1.80, draw: 0, away: 2.05 }
    }
  ]
};

// Default settled/history bets for realistic sportsbook experience
export const INITIAL_BET_HISTORY = [
  {
    id: 'TXN-904812',
    timestamp: 'Today, 14:15',
    status: 'WON',
    stake: 50.00,
    odds: 2.45,
    payout: 122.50,
    cashoutAvailable: false,
    picks: [
      {
        matchTitle: 'Real Madrid vs Man City',
        selectionName: 'Real Madrid to Win',
        odds: 2.45
      }
    ]
  },
  {
    id: 'TXN-761934',
    timestamp: 'Yesterday, 19:45',
    status: 'LOST',
    stake: 25.00,
    odds: 4.80,
    payout: 0.00,
    cashoutAvailable: false,
    picks: [
      {
        matchTitle: 'Bayern Munich vs Arsenal',
        selectionName: 'Both Teams to Score & Over 2.5',
        odds: 4.80
      }
    ]
  }
];
