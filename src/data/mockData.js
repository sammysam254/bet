// Modern Sportsbook Architecture & Real League Fixtures

export const SPORTS_CATEGORIES = [
  { id: 'football', name: 'Football', icon: '⚽', hasLiveOdds: true, count: 18 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', hasLiveOdds: true, count: 8 },
  { id: 'tennis', name: 'Tennis', icon: '🎾', hasLiveOdds: true, count: 4 },
  { id: 'baseball', name: 'Baseball', icon: '⚾', hasLiveOdds: false, count: 2 },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', hasLiveOdds: false, count: 1 },
  { id: 'rugby', name: 'Rugby', icon: '🏉', hasLiveOdds: false, count: 1 },
  { id: 'esports', name: 'Esports', icon: '🎮', hasLiveOdds: false, count: 3 }
];

export const LEAGUES_LIST = [
  { id: 'ucl', name: 'UEFA Champions League', sportId: 'football', count: 5, active: true },
  { id: 'epl', name: 'Premier League', sportId: 'football', count: 6, active: false },
  { id: 'laliga', name: 'La Liga EA Sports', sportId: 'football', count: 4, active: false },
  { id: 'bundesliga', name: 'Bundesliga', sportId: 'football', count: 3, active: false },
  { id: 'seriea', name: 'Serie A TIM', sportId: 'football', count: 3, active: false },
  { id: 'nba', name: 'NBA Playoffs', sportId: 'basketball', count: 4, active: true }
];

// Carousel Hero Matches (Slides every 5 seconds)
export const FEATURED_MATCHES = [
  {
    id: 'hero-1',
    sport: 'football',
    matchday: 'Matchday 1 • UEFA Champions League Group A',
    league: 'UEFA Champions League',
    badge: 'UCL HIGHLIGHT',
    isLive: true,
    clock: '24:33',
    period: '1st half',
    homeTeam: { name: 'Chelsea', shortName: 'CHE', score: 2, color: '#034694' },
    awayTeam: { name: 'Man United', shortName: 'MUN', score: 1, color: '#da291c' },
    odds: { home: 1.84, draw: 4.20, away: 3.74 },
    prediction: { homeWin: 56, draw: 22, awayWin: 22 },
    hotInsight: '⚡ 78% of live tickets backed Over 2.5 Goals',
    events: [
      { id: 1, time: "11'", type: 'goal', player: 'O. Watkins', team: 'home' },
      { id: 2, time: "15'", type: 'goal', player: 'O. Watkins', team: 'home' },
      { id: 3, time: "22'", type: 'goal', player: 'I. Mbaye', team: 'away' }
    ],
    stats: {
      attacks: { home: 56, away: 75, trend: 'away' },
      dangers: { home: 25, away: 21, trend: 'home' },
      saves: { home: 16, away: 16, trend: 'even' },
      shots: { home: 25, away: 28, trend: 'away' },
      onTarget: { home: 7, away: 6, trend: 'home' },
      possession: { home: 52, away: 48 },
      corners: { home: 4, away: 6 }
    },
    topPerformer: 'Ollie Watkins (2 Goals • 8.9 Rating)'
  },
  {
    id: 'hero-2',
    sport: 'football',
    matchday: 'Semifinal Leg 2 • Santiago Bernabéu',
    league: 'UEFA Champions League',
    badge: 'STAR SHOWDOWN',
    isLive: false,
    date: 'Tonight',
    time: '21:00 GMT',
    clock: 'Upcoming',
    period: 'Pre-Match',
    homeTeam: { name: 'Real Madrid', shortName: 'RMA', score: 0, color: '#ffffff' },
    awayTeam: { name: 'Bayern Munich', shortName: 'BAY', score: 0, color: '#dc052d' },
    odds: { home: 1.95, draw: 3.80, away: 3.40 },
    prediction: { homeWin: 52, draw: 26, awayWin: 22 },
    hotInsight: '🔥 Vinicius Jr has 5 G/A in his last 4 UCL knockout ties',
    events: [],
    stats: {
      attacks: { home: 62, away: 58, trend: 'home' },
      dangers: { home: 28, away: 24, trend: 'home' },
      saves: { home: 12, away: 14, trend: 'even' },
      shots: { home: 18, away: 16, trend: 'home' },
      onTarget: { home: 8, away: 6, trend: 'home' },
      possession: { home: 54, away: 46 },
      corners: { home: 7, away: 5 }
    },
    topPerformer: 'Vinicius Jr (12 Goals this UCL campaign)'
  },
  {
    id: 'hero-3',
    sport: 'football',
    matchday: 'Premier League • Title Decider • Emirates Stadium',
    league: 'Premier League',
    badge: 'TITLE CLASH',
    isLive: false,
    date: 'Today',
    time: '17:30 GMT',
    clock: 'Today 17:30',
    period: 'Pre-Match',
    homeTeam: { name: 'Arsenal', shortName: 'ARS', score: 0, color: '#ef0107' },
    awayTeam: { name: 'Man City', shortName: 'MCI', score: 0, color: '#6cabdd' },
    odds: { home: 2.30, draw: 3.40, away: 2.90 },
    prediction: { homeWin: 42, draw: 28, awayWin: 30 },
    hotInsight: '🎯 Erling Haaland averages 1.14 xG per 90 in top-4 away games',
    events: [],
    stats: {
      attacks: { home: 51, away: 64, trend: 'away' },
      dangers: { home: 22, away: 29, trend: 'away' },
      saves: { home: 15, away: 11, trend: 'home' },
      shots: { home: 14, away: 19, trend: 'away' },
      onTarget: { home: 5, away: 8, trend: 'away' },
      possession: { home: 47, away: 53 },
      corners: { home: 5, away: 8 }
    },
    topPerformer: 'Bukayo Saka (8 Key Passes in last 3 derbies)'
  },
  {
    id: 'hero-4',
    sport: 'football',
    matchday: 'Quarter-Final 2nd Leg • Camp Nou',
    league: 'UEFA Champions League',
    badge: 'EUROPEAN CLASSIC',
    isLive: false,
    date: 'Tomorrow',
    time: '20:00 GMT',
    clock: 'Tomorrow 20:00',
    period: 'Pre-Match',
    homeTeam: { name: 'Barcelona', shortName: 'BAR', score: 0, color: '#a50044' },
    awayTeam: { name: 'PSG', shortName: 'PSG', score: 0, color: '#004170' },
    odds: { home: 2.05, draw: 3.60, away: 3.25 },
    prediction: { homeWin: 48, draw: 24, awayWin: 28 },
    hotInsight: '⚡ 65% of bettors selected Both Teams to Score (BTTS: Yes)',
    events: [],
    stats: {
      attacks: { home: 59, away: 55, trend: 'home' },
      dangers: { home: 27, away: 23, trend: 'home' },
      saves: { home: 10, away: 14, trend: 'even' },
      shots: { home: 21, away: 15, trend: 'home' },
      onTarget: { home: 9, away: 6, trend: 'home' },
      possession: { home: 58, away: 42 },
      corners: { home: 8, away: 4 }
    },
    topPerformer: 'Lamine Yamal (5 Assists in Champions League)'
  },
  {
    id: 'hero-5',
    sport: 'basketball',
    matchday: 'Western Conference Semifinals • Game 4',
    league: 'NBA Playoffs',
    badge: 'NBA MARQUEE',
    isLive: true,
    clock: 'Q3 04:12',
    period: '3rd Quarter',
    homeTeam: { name: 'LA Lakers', shortName: 'LAL', score: 88, color: '#552583' },
    awayTeam: { name: 'Golden State', shortName: 'GSW', score: 84, color: '#1d428a' },
    odds: { home: 1.72, draw: 16.0, away: 2.20 },
    prediction: { homeWin: 58, draw: 0, awayWin: 42 },
    hotInsight: '🏀 LeBron James: 28 pts, 9 reb, 8 ast on 62% shooting',
    events: [],
    stats: {
      attacks: { home: 70, away: 68, trend: 'even' },
      dangers: { home: 35, away: 32, trend: 'home' },
      saves: { home: 8, away: 9, trend: 'even' },
      shots: { home: 42, away: 39, trend: 'home' },
      onTarget: { home: 24, away: 22, trend: 'home' },
      possession: { home: 50, away: 50 },
      corners: { home: 0, away: 0 }
    },
    topPerformer: 'Anthony Davis (14 Rebounds, 4 Blocks)'
  }
];

export const FEATURED_MATCH = FEATURED_MATCHES[0];

// Structured Leagues Database with Complete Categorized Matches
export const LEAGUES_DATA = [
  {
    id: 'ucl',
    name: 'UEFA Champions League',
    icon: 'ucl',
    country: 'Europe',
    flag: '🏆',
    badgeColor: '#2563eb',
    matches: [
      {
        id: 'ucl-1',
        sport: 'football',
        league: 'UEFA Champions League',
        date: 'Today',
        time: '20:45',
        isLive: true,
        clock: 'Live 24:33',
        homeTeam: { name: 'Chelsea', shortName: 'CHE', score: 2 },
        awayTeam: { name: 'Man United', shortName: 'MUN', score: 1 },
        odds: { home: 1.84, draw: 4.20, away: 3.74 },
        overUnder: { over: 1.62, under: 2.20 }
      },
      {
        id: 'ucl-2',
        sport: 'football',
        league: 'UEFA Champions League',
        date: 'Tonight',
        time: '21:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Real Madrid', shortName: 'RMA' },
        awayTeam: { name: 'Bayern Munich', shortName: 'BAY' },
        odds: { home: 1.95, draw: 3.80, away: 3.40 },
        overUnder: { over: 1.55, under: 2.35 }
      },
      {
        id: 'ucl-3',
        sport: 'football',
        league: 'UEFA Champions League',
        date: 'Tonight',
        time: '20:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Borussia Dortmund', shortName: 'BVB' },
        awayTeam: { name: 'Barcelona', shortName: 'BAR' },
        odds: { home: 2.80, draw: 3.60, away: 2.35 },
        overUnder: { over: 1.48, under: 2.50 }
      },
      {
        id: 'ucl-4',
        sport: 'football',
        league: 'UEFA Champions League',
        date: 'Tomorrow',
        time: '20:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Aston Villa', shortName: 'AVL' },
        awayTeam: { name: 'PSG', shortName: 'PSG' },
        odds: { home: 3.10, draw: 3.50, away: 2.10 },
        overUnder: { over: 1.60, under: 2.25 }
      },
      {
        id: 'ucl-5',
        sport: 'football',
        league: 'UEFA Champions League',
        date: 'Tomorrow',
        time: '21:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Arsenal', shortName: 'ARS' },
        awayTeam: { name: 'Inter Milan', shortName: 'INT' },
        odds: { home: 1.75, draw: 3.90, away: 4.50 },
        overUnder: { over: 1.72, under: 2.05 }
      }
    ]
  },
  {
    id: 'epl',
    name: 'English Premier League',
    icon: 'trophy',
    country: 'England',
    flag: '🦁',
    badgeColor: '#10b981',
    matches: [
      {
        id: 'epl-1',
        sport: 'football',
        league: 'Premier League',
        date: 'Today',
        time: '17:30',
        isLive: false,
        clock: '17:30 GMT',
        homeTeam: { name: 'Arsenal', shortName: 'ARS' },
        awayTeam: { name: 'Man City', shortName: 'MCI' },
        odds: { home: 2.30, draw: 3.40, away: 2.90 },
        overUnder: { over: 1.75, under: 2.00 }
      },
      {
        id: 'epl-2',
        sport: 'football',
        league: 'Premier League',
        date: 'Today',
        time: '15:00',
        isLive: true,
        clock: 'Live 68:14',
        homeTeam: { name: 'Liverpool', shortName: 'LIV', score: 1 },
        awayTeam: { name: 'Tottenham', shortName: 'TOT', score: 0 },
        odds: { home: 1.35, draw: 4.50, away: 7.20 },
        overUnder: { over: 1.85, under: 1.90 }
      },
      {
        id: 'epl-3',
        sport: 'football',
        league: 'Premier League',
        date: 'Saturday',
        time: '15:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Newcastle United', shortName: 'NEW' },
        awayTeam: { name: 'Aston Villa', shortName: 'AVL' },
        odds: { home: 2.15, draw: 3.50, away: 3.20 },
        overUnder: { over: 1.65, under: 2.15 }
      },
      {
        id: 'epl-4',
        sport: 'football',
        league: 'Premier League',
        date: 'Saturday',
        time: '17:30',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Chelsea', shortName: 'CHE' },
        awayTeam: { name: 'West Ham', shortName: 'WHU' },
        odds: { home: 1.60, draw: 4.10, away: 5.25 },
        overUnder: { over: 1.58, under: 2.30 }
      },
      {
        id: 'epl-5',
        sport: 'football',
        league: 'Premier League',
        date: 'Sunday',
        time: '14:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Brighton', shortName: 'BHA' },
        awayTeam: { name: 'Fulham', shortName: 'FUL' },
        odds: { home: 1.85, draw: 3.70, away: 3.90 },
        overUnder: { over: 1.70, under: 2.10 }
      }
    ]
  },
  {
    id: 'laliga',
    name: 'La Liga EA Sports',
    icon: 'shield',
    country: 'Spain',
    flag: '🇪🇸',
    badgeColor: '#ef4444',
    matches: [
      {
        id: 'laliga-1',
        sport: 'football',
        league: 'La Liga EA Sports',
        date: 'Sunday',
        time: '21:00',
        isLive: false,
        clock: 'El Clásico',
        homeTeam: { name: 'Real Madrid', shortName: 'RMA' },
        awayTeam: { name: 'Barcelona', shortName: 'BAR' },
        odds: { home: 2.10, draw: 3.65, away: 3.15 },
        overUnder: { over: 1.52, under: 2.45 }
      },
      {
        id: 'laliga-2',
        sport: 'football',
        league: 'La Liga EA Sports',
        date: 'Saturday',
        time: '18:30',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Atletico Madrid', shortName: 'ATM' },
        awayTeam: { name: 'Sevilla', shortName: 'SEV' },
        odds: { home: 1.65, draw: 3.80, away: 5.10 },
        overUnder: { over: 1.80, under: 1.95 }
      },
      {
        id: 'laliga-3',
        sport: 'football',
        league: 'La Liga EA Sports',
        date: 'Sunday',
        time: '16:15',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Real Sociedad', shortName: 'RSO' },
        awayTeam: { name: 'Athletic Bilbao', shortName: 'ATH' },
        odds: { home: 2.40, draw: 3.10, away: 3.05 },
        overUnder: { over: 2.10, under: 1.70 }
      },
      {
        id: 'laliga-4',
        sport: 'football',
        league: 'La Liga EA Sports',
        date: 'Friday',
        time: '21:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Villarreal', shortName: 'VIL' },
        awayTeam: { name: 'Real Betis', shortName: 'BET' },
        odds: { home: 1.95, draw: 3.60, away: 3.70 },
        overUnder: { over: 1.75, under: 2.05 }
      }
    ]
  },
  {
    id: 'bundesliga',
    name: 'German Bundesliga',
    icon: 'shield',
    country: 'Germany',
    flag: '🇩🇪',
    badgeColor: '#f59e0b',
    matches: [
      {
        id: 'bun-1',
        sport: 'football',
        league: 'Bundesliga',
        date: 'Saturday',
        time: '18:30',
        isLive: false,
        clock: 'Der Klassiker',
        homeTeam: { name: 'Bayern Munich', shortName: 'BAY' },
        awayTeam: { name: 'Borussia Dortmund', shortName: 'BVB' },
        odds: { home: 1.55, draw: 4.80, away: 5.50 },
        overUnder: { over: 1.35, under: 3.10 }
      },
      {
        id: 'bun-2',
        sport: 'football',
        league: 'Bundesliga',
        date: 'Saturday',
        time: '15:30',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Bayer Leverkusen', shortName: 'B04' },
        awayTeam: { name: 'RB Leipzig', shortName: 'RBL' },
        odds: { home: 1.90, draw: 3.80, away: 3.70 },
        overUnder: { over: 1.60, under: 2.25 }
      }
    ]
  },
  {
    id: 'seriea',
    name: 'Italian Serie A',
    icon: 'shield',
    country: 'Italy',
    flag: '🇮🇹',
    badgeColor: '#06b6d4',
    matches: [
      {
        id: 'ser-1',
        sport: 'football',
        league: 'Serie A TIM',
        date: 'Sunday',
        time: '20:45',
        isLive: false,
        clock: "Derby d'Italia",
        homeTeam: { name: 'Inter Milan', shortName: 'INT' },
        awayTeam: { name: 'Juventus', shortName: 'JUV' },
        odds: { home: 1.90, draw: 3.40, away: 4.20 },
        overUnder: { over: 1.90, under: 1.85 }
      },
      {
        id: 'ser-2',
        sport: 'football',
        league: 'Serie A TIM',
        date: 'Sunday',
        time: '18:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'AC Milan', shortName: 'ACM' },
        awayTeam: { name: 'AS Roma', shortName: 'ROM' },
        odds: { home: 2.05, draw: 3.35, away: 3.65 },
        overUnder: { over: 1.80, under: 1.95 }
      }
    ]
  },
  {
    id: 'nba',
    name: 'NBA Basketball',
    icon: 'basketball',
    country: 'USA',
    flag: '🏀',
    badgeColor: '#8b5cf6',
    matches: [
      {
        id: 'nba-1',
        sport: 'basketball',
        league: 'NBA Playoffs',
        date: 'Tonight',
        time: '20:30',
        isLive: true,
        clock: 'Q3 04:12',
        homeTeam: { name: 'LA Lakers', shortName: 'LAL', score: 88 },
        awayTeam: { name: 'Golden State', shortName: 'GSW', score: 84 },
        odds: { home: 1.72, draw: 16.0, away: 2.20 },
        overUnder: { over: 1.90, under: 1.90 }
      },
      {
        id: 'nba-2',
        sport: 'basketball',
        league: 'NBA Playoffs',
        date: 'Tonight',
        time: '22:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Boston Celtics', shortName: 'BOS' },
        awayTeam: { name: 'Miami Heat', shortName: 'MIA' },
        odds: { home: 1.45, draw: 18.0, away: 2.80 },
        overUnder: { over: 1.88, under: 1.92 }
      },
      {
        id: 'nba-3',
        sport: 'basketball',
        league: 'NBA Playoffs',
        date: 'Tomorrow',
        time: '01:00',
        isLive: false,
        clock: 'Upcoming',
        homeTeam: { name: 'Denver Nuggets', shortName: 'DEN' },
        awayTeam: { name: 'Milwaukee Bucks', shortName: 'MIL' },
        odds: { home: 1.62, draw: 17.0, away: 2.40 },
        overUnder: { over: 1.91, under: 1.89 }
      }
    ]
  }
];

// Flat list for legacy support
export const LEAGUE_MATCHES = LEAGUES_DATA.flatMap(l => l.matches);

export const OTHER_SPORTS_MATCHES = {
  basketball: LEAGUES_DATA.find(l => l.id === 'nba')?.matches || [],
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
  ]
};

export const INITIAL_BET_HISTORY = [
  {
    id: 'TXN-904812',
    date: '28 Oct 2026',
    matchTitle: 'Real Madrid vs Barcelona',
    selectionName: 'Real Madrid to Win',
    stake: 50,
    odds: 2.10,
    payout: 105,
    status: 'WON',
    picks: [{ matchTitle: 'Real Madrid vs Barcelona', selectionName: 'Real Madrid to Win', odds: 2.10 }]
  },
  {
    id: 'TXN-904739',
    date: '26 Oct 2026',
    matchTitle: 'Arsenal vs Liverpool',
    selectionName: 'Both Teams to Score',
    stake: 35,
    odds: 1.75,
    payout: 61.25,
    status: 'WON',
    picks: [{ matchTitle: 'Arsenal vs Liverpool', selectionName: 'Both Teams to Score', odds: 1.75 }]
  }
];
