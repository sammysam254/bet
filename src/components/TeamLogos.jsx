import React, { useState } from 'react';

// Comprehensive Real Logo Database using ESPN Official Club & Franchise CDN (500x500 Transparent PNGs)
const TEAM_LOGO_MAP = {
  // English Premier League & Championship
  'chelsea': 'https://a.espncdn.com/i/teamlogos/soccer/500/363.png',
  'manchester united': 'https://a.espncdn.com/i/teamlogos/soccer/500/360.png',
  'manchester city': 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png',
  'arsenal': 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png',
  'liverpool': 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png',
  'tottenham hotspur': 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
  'tottenham': 'https://a.espncdn.com/i/teamlogos/soccer/500/367.png',
  'bournemouth': 'https://a.espncdn.com/i/teamlogos/soccer/500/349.png',
  'afc bournemouth': 'https://a.espncdn.com/i/teamlogos/soccer/500/349.png',
  'leeds united': 'https://a.espncdn.com/i/teamlogos/soccer/500/357.png',
  'leeds': 'https://a.espncdn.com/i/teamlogos/soccer/500/357.png',
  'brentford': 'https://a.espncdn.com/i/teamlogos/soccer/500/375.png',
  'nottingham forest': 'https://a.espncdn.com/i/teamlogos/soccer/500/393.png',
  'nottingham': 'https://a.espncdn.com/i/teamlogos/soccer/500/393.png',
  'brighton and hove albion': 'https://a.espncdn.com/i/teamlogos/soccer/500/331.png',
  'brighton': 'https://a.espncdn.com/i/teamlogos/soccer/500/331.png',
  'crystal palace': 'https://a.espncdn.com/i/teamlogos/soccer/500/386.png',
  'aston villa': 'https://a.espncdn.com/i/teamlogos/soccer/500/362.png',
  'fulham': 'https://a.espncdn.com/i/teamlogos/soccer/500/370.png',
  'newcastle united': 'https://a.espncdn.com/i/teamlogos/soccer/500/361.png',
  'newcastle': 'https://a.espncdn.com/i/teamlogos/soccer/500/361.png',
  'west ham united': 'https://a.espncdn.com/i/teamlogos/soccer/500/379.png',
  'west ham': 'https://a.espncdn.com/i/teamlogos/soccer/500/379.png',
  'wolverhampton wanderers': 'https://a.espncdn.com/i/teamlogos/soccer/500/376.png',
  'wolves': 'https://a.espncdn.com/i/teamlogos/soccer/500/376.png',
  'everton': 'https://a.espncdn.com/i/teamlogos/soccer/500/388.png',
  'leicester city': 'https://a.espncdn.com/i/teamlogos/soccer/500/371.png',
  'leicester': 'https://a.espncdn.com/i/teamlogos/soccer/500/371.png',
  'southampton': 'https://a.espncdn.com/i/teamlogos/soccer/500/383.png',
  'ipswich town': 'https://a.espncdn.com/i/teamlogos/soccer/500/398.png',
  'ipswich': 'https://a.espncdn.com/i/teamlogos/soccer/500/398.png',
  'coventry city': 'https://a.espncdn.com/i/teamlogos/soccer/500/389.png',
  'coventry': 'https://a.espncdn.com/i/teamlogos/soccer/500/389.png',
  'sunderland': 'https://a.espncdn.com/i/teamlogos/soccer/500/366.png',
  'hull city': 'https://a.espncdn.com/i/teamlogos/soccer/500/306.png',
  'hull': 'https://a.espncdn.com/i/teamlogos/soccer/500/306.png',

  // UEFA & European Heavyweights
  'real madrid': 'https://a.espncdn.com/i/teamlogos/soccer/500/86.png',
  'barcelona': 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  'fc barcelona': 'https://a.espncdn.com/i/teamlogos/soccer/500/83.png',
  'atletico madrid': 'https://a.espncdn.com/i/teamlogos/soccer/500/1068.png',
  'bayern munich': 'https://a.espncdn.com/i/teamlogos/soccer/500/132.png',
  'borussia dortmund': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'dortmund': 'https://a.espncdn.com/i/teamlogos/soccer/500/124.png',
  'bayer leverkusen': 'https://a.espncdn.com/i/teamlogos/soccer/500/131.png',
  'vfb stuttgart': 'https://a.espncdn.com/i/teamlogos/soccer/500/134.png',
  'stuttgart': 'https://a.espncdn.com/i/teamlogos/soccer/500/134.png',
  'galatasaray': 'https://a.espncdn.com/i/teamlogos/soccer/500/436.png',
  'shakhtar donetsk': 'https://a.espncdn.com/i/teamlogos/soccer/500/627.png',
  'sporting lisbon': 'https://a.espncdn.com/i/teamlogos/soccer/500/2226.png',
  'sporting cp': 'https://a.espncdn.com/i/teamlogos/soccer/500/2226.png',
  'as roma': 'https://a.espncdn.com/i/teamlogos/soccer/500/104.png',
  'roma': 'https://a.espncdn.com/i/teamlogos/soccer/500/104.png',
  'juventus': 'https://a.espncdn.com/i/teamlogos/soccer/500/111.png',
  'inter milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
  'inter': 'https://a.espncdn.com/i/teamlogos/soccer/500/110.png',
  'ac milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',
  'milan': 'https://a.espncdn.com/i/teamlogos/soccer/500/103.png',
  'paris saint-germain': 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',
  'psg': 'https://a.espncdn.com/i/teamlogos/soccer/500/160.png',

  // NBA Franchises
  'los angeles lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  'lakers': 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
  'golden state warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
  'warriors': 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
  'boston celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
  'celtics': 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
  'milwaukee bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
  'bucks': 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
  'denver nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
  'nuggets': 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
  'miami heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
  'heat': 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
  'chicago bulls': 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
  'bulls': 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
  'dallas mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
  'mavericks': 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
  'new york knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
  'knicks': 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png',
  'phoenix suns': 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
  'suns': 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
  'philadelphia 76ers': 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
  '76ers': 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
  'brooklyn nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
  'nets': 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png',
  'washington wizards': 'https://a.espncdn.com/i/teamlogos/nba/500/was.png',
  'wizards': 'https://a.espncdn.com/i/teamlogos/nba/500/was.png',
  'charlotte hornets': 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
  'hornets': 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png',
  'toronto raptors': 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
  'raptors': 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png',
  'indiana pacers': 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
  'pacers': 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png',
  'cleveland cavaliers': 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
  'cavaliers': 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png',
  'minnesota timberwolves': 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
  'timberwolves': 'https://a.espncdn.com/i/teamlogos/nba/500/min.png',
  'oklahoma city thunder': 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
  'thunder': 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
  'san antonio spurs': 'https://a.espncdn.com/i/teamlogos/nba/500/sas.png',
  'spurs': 'https://a.espncdn.com/i/teamlogos/nba/500/sas.png',
  'houston rockets': 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
  'rockets': 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png',
  'los angeles clippers': 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',
  'clippers': 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png',

  // NFL Franchises
  'dallas cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
  'cowboys': 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
  'arizona cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
  'cardinals': 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png',
  'kansas city chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
  'chiefs': 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
  'san francisco 49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  '49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  'philadelphia eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
  'eagles': 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
  'baltimore ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
  'ravens': 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
  'buffalo bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
  'bills': 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png',
  'detroit lions': 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
  'lions': 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
  'miami dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
  'dolphins': 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png',
  'green bay packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',
  'packers': 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png',

  // MLB Baseball Franchises
  'new york yankees': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
  'yankees': 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png',
  'los angeles dodgers': 'https://a.espncdn.com/i/teamlogos/mlb/500/lad.png',
  'dodgers': 'https://a.espncdn.com/i/teamlogos/mlb/500/lad.png',
  'boston red sox': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
  'red sox': 'https://a.espncdn.com/i/teamlogos/mlb/500/bos.png',
  'houston astros': 'https://a.espncdn.com/i/teamlogos/mlb/500/hou.png',
  'astros': 'https://a.espncdn.com/i/teamlogos/mlb/500/hou.png',
  'philadelphia phillies': 'https://a.espncdn.com/i/teamlogos/mlb/500/phi.png',
  'phillies': 'https://a.espncdn.com/i/teamlogos/mlb/500/phi.png',
  'atlanta braves': 'https://a.espncdn.com/i/teamlogos/mlb/500/atl.png',
  'braves': 'https://a.espncdn.com/i/teamlogos/mlb/500/atl.png',
  'chicago cubs': 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png',
  'cubs': 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png',
  'new york mets': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
  'mets': 'https://a.espncdn.com/i/teamlogos/mlb/500/nym.png',
  'san diego padres': 'https://a.espncdn.com/i/teamlogos/mlb/500/sd.png',
  'padres': 'https://a.espncdn.com/i/teamlogos/mlb/500/sd.png',
  'texas rangers': 'https://a.espncdn.com/i/teamlogos/mlb/500/tex.png',
  'rangers': 'https://a.espncdn.com/i/teamlogos/mlb/500/tex.png'
};

export const getTeamLogoUrl = (teamName = '') => {
  const norm = teamName.toLowerCase().trim();
  if (TEAM_LOGO_MAP[norm]) return TEAM_LOGO_MAP[norm];

  // Fuzzy substring match
  for (const [key, url] of Object.entries(TEAM_LOGO_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return url;
    }
  }

  return null;
};

// Generates an elegant gradient badge with stylish club initials if no external image exists
const DynamicClubCrest = ({ team = '', size = 32 }) => {
  const initials = team
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || 'FC';

  // Deterministic vibrant gradient based on team string
  let hash = 0;
  for (let i = 0; i < team.length; i++) {
    hash = team.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [
    ['#3b82f6', '#1d4ed8'],
    ['#ef4444', '#b91c1c'],
    ['#10b981', '#047857'],
    ['#8b5cf6', '#6d28d9'],
    ['#f59e0b', '#b45309'],
    ['#06b6d4', '#0e7490']
  ];
  const [color1, color2] = hues[Math.abs(hash) % hues.length];

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1.5px solid rgba(255, 255, 255, 0.25)',
        boxShadow: `0 2px 8px ${color1}44`,
        color: '#ffffff',
        fontWeight: '900',
        fontSize: `${Math.max(10, size * 0.38)}px`,
        letterSpacing: '0.5px',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        userSelect: 'none'
      }}
    >
      {initials}
    </div>
  );
};

// Main TeamLogo component that displays real logos with graceful fallback
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
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))'
        }}
        loading="lazy"
      />
    );
  }

  return <DynamicClubCrest team={team} size={size} />;
};

// UEFA Champions League Starball Icon
export const UefaChampionsLeagueIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="48" fill="#091b3e" stroke="#2563eb" strokeWidth="2.5" />
    <g fill="#ffffff">
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.8) translate(12, 12)" />
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.6) translate(33, 40)" />
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.6) translate(6, 40)" />
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.5) translate(50, 70)" />
      <polygon points="50,20 53,32 64,32 55,40 58,52 50,44 42,52 45,40 36,32 47,32" transform="scale(0.5) translate(5, 70)" />
    </g>
  </svg>
);
