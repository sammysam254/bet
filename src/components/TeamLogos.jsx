import React, { useState } from 'react';

// Comprehensive Real Logo Database using ESPN Official Club & Franchise CDN (500x500 Transparent PNGs)
// Covers all aliases and common short forms (e.g. "Man United", "Man Utd", "Real Madrid", "Barca")
const TEAM_LOGO_MAP = {
  // English Premier League
  'man united': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
  'man utd': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
  'manchester united': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
  'chelsea': 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
  'man city': 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
  'manchester city': 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
  'arsenal': 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
  'liverpool': 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
  'tottenham': 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
  'tottenham hotspur': 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
  'spurs': 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
  'aston villa': 'https://a.espncdn.com/i/teamlogos/soccer/500/362.png',
  'villa': 'https://a.espncdn.com/i/teamlogos/soccer/500/362.png',
  'newcastle': 'https://a.espncdn.com/i/teamlogos/soccer/500/361.png',
  'newcastle united': 'https://a.espncdn.com/i/teamlogos/soccer/500/361.png',
  'brighton': 'https://a.espncdn.com/i/teamlogos/soccer/500/331.png',
  'brighton and hove albion': 'https://a.espncdn.com/i/teamlogos/soccer/500/331.png',
  'west ham': 'https://a.espncdn.com/i/teamlogos/soccer/500/379.png',
  'west ham united': 'https://a.espncdn.com/i/teamlogos/soccer/500/379.png',
  'brentford': 'https://a.espncdn.com/i/teamlogos/soccer/500/375.png',
  'fulham': 'https://a.espncdn.com/i/teamlogos/soccer/500/370.png',
  'crystal palace': 'https://a.espncdn.com/i/teamlogos/soccer/500/386.png',
  'everton': 'https://a.espncdn.com/i/teamlogos/soccer/500/388.png',
  'wolves': 'https://a.espncdn.com/i/teamlogos/soccer/500/376.png',
  'wolverhampton wanderers': 'https://a.espncdn.com/i/teamlogos/soccer/500/376.png',
  'bournemouth': 'https://a.espncdn.com/i/teamlogos/soccer/500/349.png',
  'afc bournemouth': 'https://a.espncdn.com/i/teamlogos/soccer/500/349.png',
  'nottingham forest': 'https://a.espncdn.com/i/teamlogos/soccer/500/393.png',
  'leicester city': 'https://a.espncdn.com/i/teamlogos/soccer/500/371.png',
  'leicester': 'https://a.espncdn.com/i/teamlogos/soccer/500/371.png',

  // UEFA Champions League & European Giants
  'real madrid': 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png',
  'barcelona': 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  'fc barcelona': 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  'barca': 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  'bayern munich': 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
  'bayern': 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
  'borussia dortmund': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'borussia d': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'dortmund': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'bvb': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'psg': 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
  'paris saint-germain': 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
  'paris': 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
  'atletico madrid': 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
  'atletico': 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
  'inter milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
  'inter': 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
  'ac milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',
  'milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',
  'juventus': 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png',
  'juve': 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png',
  'bayer leverkusen': 'https://a.espncdn.com/i/teamlogos/soccer/500/131.png',
  'leverkusen': 'https://a.espncdn.com/i/teamlogos/soccer/500/131.png',
  'rb leipzig': 'https://a.espncdn.com/i/teamlogos/soccer/500/11420.png',
  'leipzig': 'https://a.espncdn.com/i/teamlogos/soccer/500/11420.png',
  'roma': 'https://a.espncdn.com/i/teamlogos/soccer/500/104.png',
  'as roma': 'https://a.espncdn.com/i/teamlogos/soccer/500/104.png',
  'napoli': 'https://a.espncdn.com/i/teamlogos/soccer/500/114.png',
  'lazio': 'https://a.espncdn.com/i/teamlogos/soccer/500/112.png',
  'sevilla': 'https://a.espncdn.com/i/teamlogos/soccer/500/243.png',
  'real sociedad': 'https://a.espncdn.com/i/teamlogos/soccer/500/89.png',
  'athletic bilbao': 'https://a.espncdn.com/i/teamlogos/soccer/500/93.png',
  'villarreal': 'https://a.espncdn.com/i/teamlogos/soccer/500/102.png',
  'real betis': 'https://a.espncdn.com/i/teamlogos/soccer/500/244.png',
  'sporting cp': 'https://a.espncdn.com/i/teamlogos/soccer/500/2226.png',
  'benfica': 'https://a.espncdn.com/i/teamlogos/soccer/500/1929.png',
  'porto': 'https://a.espncdn.com/i/teamlogos/soccer/500/1920.png',

  // NBA Franchises
  'la lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  'los angeles lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  'lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  'golden state': 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
  'golden state warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
  'warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
  'boston celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
  'celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
  'miami heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
  'heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
  'milwaukee bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
  'bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
  'denver nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
  'nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
  'dallas mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
  'mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
  'new york knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
  'knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png'
};

export const getTeamLogoUrl = (teamName = '') => {
  if (!teamName) return null;
  const clean = teamName.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  // 1. Direct key match
  if (TEAM_LOGO_MAP[clean]) return TEAM_LOGO_MAP[clean];

  // 2. Token / word boundary matching (e.g. "Man United" vs "Manchester United")
  for (const [key, url] of Object.entries(TEAM_LOGO_MAP)) {
    if (clean === key) return url;
    if (clean.includes(key) && key.length >= 4) return url;
    if (key.includes(clean) && clean.length >= 4) return url;
  }

  // 3. Fallback specialized checks
  if (clean.includes('manchester') && clean.includes('united')) return TEAM_LOGO_MAP['man united'];
  if (clean.includes('man') && clean.includes('united')) return TEAM_LOGO_MAP['man united'];
  if (clean.includes('manchester') && clean.includes('city')) return TEAM_LOGO_MAP['man city'];
  if (clean.includes('real') && clean.includes('madrid')) return TEAM_LOGO_MAP['real madrid'];
  if (clean.includes('barcelona') || clean.includes('barca')) return TEAM_LOGO_MAP['barcelona'];
  if (clean.includes('bayern')) return TEAM_LOGO_MAP['bayern munich'];
  if (clean.includes('dortmund') || clean.includes('bvb')) return TEAM_LOGO_MAP['borussia dortmund'];
  if (clean.includes('paris') || clean.includes('psg')) return TEAM_LOGO_MAP['psg'];
  if (clean.includes('chelsea')) return TEAM_LOGO_MAP['chelsea'];
  if (clean.includes('arsenal')) return TEAM_LOGO_MAP['arsenal'];
  if (clean.includes('liverpool')) return TEAM_LOGO_MAP['liverpool'];
  if (clean.includes('lakers')) return TEAM_LOGO_MAP['la lakers'];
  if (clean.includes('warriors')) return TEAM_LOGO_MAP['golden state warriors'];

  return null;
};

// Specialized authentic SVG crest badges for top clubs as foolproof fallback
const AUTHENTIC_CREST_COLORS = {
  'chelsea': { bg: '#034694', border: '#e0b115', text: '#ffffff', symbol: '🦁' },
  'man united': { bg: '#da291c', border: '#ffe500', text: '#ffffff', symbol: '🔴' },
  'manchester united': { bg: '#da291c', border: '#ffe500', text: '#ffffff', symbol: '🔴' },
  'real madrid': { bg: '#ffffff', border: '#e0b115', text: '#00529f', symbol: '👑' },
  'barcelona': { bg: '#a50044', border: '#004d98', text: '#edbb00', symbol: '🔵' },
  'bayern munich': { bg: '#dc052d', border: '#0066b2', text: '#ffffff', symbol: '⚪' },
  'borussia dortmund': { bg: '#fde100', border: '#000000', text: '#000000', symbol: 'BVB' },
  'psg': { bg: '#004170', border: '#da291c', text: '#ffffff', symbol: '🗼' },
  'arsenal': { bg: '#ef0107', border: '#9c824a', text: '#ffffff', symbol: '💣' },
  'man city': { bg: '#6cabdd', border: '#1c2c5b', text: '#ffffff', symbol: '⛵' },
  'liverpool': { bg: '#c8102e', border: '#00b2a9', text: '#ffffff', symbol: '🦅' },
  'la lakers': { bg: '#552583', border: '#fdb927', text: '#ffffff', symbol: '🏀' },
  'golden state': { bg: '#1d428a', border: '#ffc72c', text: '#ffffff', symbol: '🌉' }
};

const DynamicClubCrest = ({ team = '', size = 32 }) => {
  const norm = team.toLowerCase().trim();
  const theme = AUTHENTIC_CREST_COLORS[norm] || {
    bg: '#1e293b',
    border: '#3b82f6',
    text: '#ffffff',
    symbol: team.substring(0, 3).toUpperCase()
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: '50%',
        background: theme.bg,
        border: `2px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.text,
        fontWeight: '900',
        fontSize: `${Math.max(10, size * 0.36)}px`,
        boxShadow: `0 3px 10px rgba(0,0,0,0.4)`,
        userSelect: 'none',
        flexShrink: 0
      }}
      title={team}
    >
      {theme.symbol}
    </div>
  );
};

export const TeamLogo = ({ team = '', size = 32, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const realUrl = getTeamLogoUrl(team);

  if (realUrl && !hasError) {
    return (
      <img
        src={realUrl}
        alt={team}
        width={size}
        height={size}
        className={className}
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))'
        }}
        loading="lazy"
      />
    );
  }

  return <DynamicClubCrest team={team} size={size} />;
};

// Official League Icons
export const UefaChampionsLeagueIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="48" fill="#091b3e" stroke="#2563eb" strokeWidth="2.5" />
    <g fill="#ffffff">
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.8) translate(12, 12)" />
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.6) translate(33, 40)" />
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.6) translate(6, 40)" />
    </g>
  </svg>
);

export const PremierLeagueIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#38003c" stroke="#00ff85" strokeWidth="2.5" />
    <text x="50" y="65" fontSize="42" fill="#00ff85" fontWeight="900" textAnchor="middle">🦁</text>
  </svg>
);

export const LaLigaIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#1e1e24" stroke="#ff4b44" strokeWidth="2.5" />
    <text x="50" y="66" fontSize="38" fill="#ff4b44" fontWeight="900" textAnchor="middle">🇪🇸</text>
  </svg>
);
