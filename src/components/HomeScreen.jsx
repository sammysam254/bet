import React, { useState, useEffect } from 'react';
import { Search, Bell, BarChart2, Star, ChevronDown, ChevronUp, Home, Disc, Ticket, Menu, Clock, Radio, Key, Sparkles, Filter, LogOut, Video, Play } from 'lucide-react';
import { TeamLogo, UefaChampionsLeagueIcon } from './TeamLogos';
import { SPORTS_CATEGORIES, FEATURED_MATCHES, FEATURED_MATCH, LEAGUES_DATA, LEAGUE_MATCHES, OTHER_SPORTS_MATCHES } from '../data/mockData';
import { fetchLiveOddsFromProvider } from '../services/oddsApi';
import { InteractiveGoalReel } from './InteractiveGoalReel';
import { RealSportsNews } from './RealSportsNews';
import { InteractiveSportsPulse } from './InteractiveSportsPulse';

export const HomeScreen = ({
  userBalance,
  onOpenMatchDetails,
  onOpenBetSlip,
  onOpenSearch,
  onOpenNotifications,
  onOpenDeposit,
  onOpenMenu,
  onOpenMyBets,
  onSignOut,
  betslip,
  onToggleOddSelection,
  activeTab,
  setActiveTab
}) => {
  const [selectedSport, setSelectedSport] = useState('football');
  const [isLeagueExpanded, setIsLeagueExpanded] = useState(true);
  const [favorites, setFavorites] = useState({ 'featured-1': false });
  const [sliderIndex, setSliderIndex] = useState(0);
  const [liveMatches, setLiveMatches] = useState([]);
  const [activeMobileLeague, setActiveMobileLeague] = useState('all');

  // 5-Second Auto-Slide Timer for Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex(prev => (prev + 1) % FEATURED_MATCHES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchLiveOddsFromProvider(selectedSport, (bgRes) => {
      if (isMounted && bgRes.isLiveFeed && bgRes.data?.length > 0) {
        setLiveMatches(bgRes.data);
      }
    }).then(res => {
      if (isMounted && res.isLiveFeed && res.data?.length > 0) {
        setLiveMatches(res.data);
      } else if (isMounted && !res.fromCache) {
        setLiveMatches([]);
      }
    });
    return () => { isMounted = false; };
  }, [selectedSport]);

  const toggleFavorite = (e, matchId) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const isOddSelected = (matchId, outcome) => {
    return betslip.some(item => item.matchId === matchId && item.outcome === outcome);
  };

  return (
    <div className="home-screen" id="home-dashboard-screen">
      {/* Top Header Bar */}
      <div className="home-top-header">
        <div className="user-profile-widget">
          <div className="user-avatar-wrapper" onClick={onOpenMenu} title="View Account / Menu">
            <img src="/assets/user.jpg" alt="User Profile" className="user-avatar-img" />
            <div className="user-online-dot" />
          </div>
          <div className="balance-info" onClick={onOpenDeposit} title="Click to deposit or view wallet">
            <span className="balance-label">Balance</span>
            <span className="balance-amount">${userBalance.toLocaleString()}</span>
          </div>
        </div>

        <div className="header-action-buttons">
          <button
            type="button"
            className="header-circle-btn"
            id="btn-header-search"
            onClick={onOpenSearch}
            title="Search matches and leagues"
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            className="header-circle-btn"
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            title="Notifications"
          >
            <Bell size={19} />
            <span className="notif-badge-dot" />
          </button>
        </div>
      </div>

      {/* Horizontal Sports Category Selector */}
      <div className="sports-category-scroll">
        {SPORTS_CATEGORIES.map(sport => {
          const isActive = selectedSport === sport.id;
          if (sport.id === 'football') {
            return (
              <button
                key={sport.id}
                type="button"
                className={`sport-chip ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport.id)}
              >
                <span>⚽</span>
                <span>Football</span>
              </button>
            );
          }
          return (
            <button
              key={sport.id}
              type="button"
              className={`sport-icon-circle ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedSport(sport.id)}
              title={sport.name}
            >
              <span>{sport.icon}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. FOOTBALL SPORT VIEW (Exact Match to Design Mockup)     */}
      {/* ========================================================= */}
      {selectedSport === 'football' && (
        <>
          {/* Featured Live Match Carousel (Slides every 5 seconds) */}
          {(() => {
            const activeHero = FEATURED_MATCHES[sliderIndex] || FEATURED_MATCHES[0];
            return (
              <div
                className="featured-match-card"
                id="card-featured-match"
                onClick={() => onOpenMatchDetails(activeHero)}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Ambient Real Pitch Video Background */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                  <video
                    src="https://upload.wikimedia.org/wikipedia/commons/6/69/Goal_by_Rafael_Leao.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.16, filter: 'blur(1px)' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(17,20,28,0.78) 0%, rgba(13,15,21,0.95) 100%)' }} />
                </div>

                <div className="featured-top-bar" style={{ position: 'relative', zIndex: 2 }}>
                  <span className="matchday-text" style={{ fontWeight: '700' }}>{activeHero.matchday}</span>

                  <div className="league-center-meta">
                    {activeHero.isLive ? (
                      <div className="live-pill-badge">
                        <span className="live-pulse-dot animate-pulse-live" />
                        <span>LIVE IN-PLAY</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', color: '#93c5fd' }}>
                        <Clock size={11} />
                        <span>{activeHero.clock}</span>
                      </div>
                    )}
                    <span className="league-title-small">{activeHero.league}</span>
                  </div>

                  <div className="featured-actions">
                    <button
                      type="button"
                      className="card-icon-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMatchDetails(activeHero);
                      }}
                      title="View in-depth match stats"
                    >
                      <BarChart2 size={16} />
                    </button>
                    <button
                      type="button"
                      className={`card-icon-action ${favorites[activeHero.id] ? 'starred' : ''}`}
                      onClick={(e) => toggleFavorite(e, activeHero.id)}
                      title="Add to favorites"
                    >
                      <Star size={16} fill={favorites[activeHero.id] ? '#f59e0b' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Teams and Score Row */}
                <div className="featured-score-arena">
                  <div className="team-block">
                    <TeamLogo team={activeHero.homeTeam.name} size={48} />
                    <span className="team-name-text" style={{ fontWeight: '800' }}>{activeHero.homeTeam.name}</span>
                  </div>

                  <div className="live-score-center">
                    {activeHero.isLive ? (
                      <>
                        <div className="live-score-numbers">
                          {activeHero.homeTeam.score} : {activeHero.awayTeam.score}
                        </div>
                        <div className="live-clock-time" style={{ color: '#60a5fa' }}>{activeHero.clock}</div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)' }}>VS</span>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', background: 'rgba(56,189,248,0.12)', padding: '2px 8px', borderRadius: '9999px', fontWeight: '700' }}>
                          {activeHero.time || 'Upcoming'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="team-block">
                    <TeamLogo team={activeHero.awayTeam.name} size={48} />
                    <span className="team-name-text" style={{ fontWeight: '800' }}>{activeHero.awayTeam.name}</span>
                  </div>
                </div>

                {/* Hot Insight Badge */}
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '6px 10px', margin: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', color: '#e2e8f0' }}>
                  <Sparkles size={14} color="#f59e0b" />
                  <span>{activeHero.hotInsight}</span>
                </div>

                {/* Carousel Slider Dash Indicators (5-second auto slide) */}
                <div className="featured-carousel-slider-dots">
                  {FEATURED_MATCHES.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`slider-dash ${sliderIndex === idx ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSliderIndex(idx);
                      }}
                      title={`${m.homeTeam.name} vs ${m.awayTeam.name}`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Interactive Goal Cam & Real Match Scoring Video Arena */}
          <InteractiveGoalReel onBetOnMatch={onOpenMatchDetails} />

          {/* Sorted Leagues Filter & Accordions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>🏆 Sorted League Fixtures</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verified Odds</span>
            </div>

            {LEAGUES_DATA.map(league => (
              <div key={league.id} className="league-accordion-section">
                <div className="league-section-header">
                  <div className="league-header-left">
                    <span style={{ fontSize: '1.2rem' }}>{league.flag}</span>
                    <span className="league-name-main">{league.name}</span>
                    <span className="count-badge-bubble">{league.matches.length}</span>
                  </div>
                </div>

                <div className="league-matches-list">
                  {league.matches.map(match => {
                    const homeSelected = isOddSelected(match.id, '1');
                    const drawSelected = isOddSelected(match.id, 'X');
                    const awaySelected = isOddSelected(match.id, '2');

                    return (
                      <div key={match.id} className="league-match-card">
                        <div
                          className="match-teams-row"
                          onClick={() => onOpenMatchDetails(match)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="match-team-side">
                            <span>{match.homeTeam.name}</span>
                            <TeamLogo team={match.homeTeam.name} size={30} />
                          </div>

                          <div className="match-schedule-center">
                            <span className="match-date-str">{match.date}</span>
                            <span className="match-time-str">{match.time}</span>
                            {match.isLive && (
                              <span className="live-pill-badge" style={{ padding: '1px 6px', fontSize: '0.62rem' }}>LIVE</span>
                            )}
                          </div>

                          <div className="match-team-side away">
                            <TeamLogo team={match.awayTeam.name} size={30} />
                            <span>{match.awayTeam.name}</span>
                          </div>
                        </div>

                        {/* Odds Buttons Row (1, X, 2) */}
                        <div className="odds-buttons-grid">
                          <button
                            type="button"
                            className={`odds-pill-btn ${homeSelected ? 'selected' : ''}`}
                            onClick={() =>
                              onToggleOddSelection({
                                matchId: match.id,
                                matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                                outcome: '1',
                                selectionName: `${match.homeTeam.name} to Win`,
                                odds: match.odds.home
                              })
                            }
                          >
                            <span className="odds-label">1</span>
                            <span className="odds-val">{Number(match.odds.home).toFixed(2)}</span>
                          </button>

                          <button
                            type="button"
                            className={`odds-pill-btn ${drawSelected ? 'selected' : ''}`}
                            onClick={() =>
                              onToggleOddSelection({
                                matchId: match.id,
                                matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                                outcome: 'X',
                                selectionName: 'Draw',
                                odds: match.odds.draw
                              })
                            }
                          >
                            <span className="odds-label">X</span>
                            <span className="odds-val">{Number(match.odds.draw).toFixed(2)}</span>
                          </button>

                          <button
                            type="button"
                            className={`odds-pill-btn ${awaySelected ? 'selected' : ''}`}
                            onClick={() =>
                              onToggleOddSelection({
                                matchId: match.id,
                                matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                                outcome: '2',
                                selectionName: `${match.awayTeam.name} to Win`,
                                odds: match.odds.away
                              })
                            }
                          >
                            <span className="odds-label">2</span>
                            <span className="odds-val">{Number(match.odds.away).toFixed(2)}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. BASKETBALL VIEW                                        */}
      {/* ========================================================= */}
      {selectedSport === 'basketball' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px' }}>
            <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>🏀 NBA Live Fixtures</span>
            <span className="count-badge-bubble">{(liveMatches.length > 0 ? liveMatches : OTHER_SPORTS_MATCHES.basketball).length}</span>
          </div>

          {(liveMatches.length > 0 ? liveMatches : OTHER_SPORTS_MATCHES.basketball).map(match => {
            const homeSelected = isOddSelected(match.id, '1');
            const awaySelected = isOddSelected(match.id, '2');

            return (
              <div key={match.id} className="league-match-card">
                <div className="match-teams-row">
                  <div className="match-team-side">
                    <TeamLogo team={match.homeTeam.name} size={28} />
                    <span>{match.homeTeam.name}</span>
                  </div>
                  <div className="match-schedule-center">
                    <span className="match-date-str">{match.date}</span>
                    <span className="match-time-str">{match.time}</span>
                  </div>
                  <div className="match-team-side away">
                    <span>{match.awayTeam.name}</span>
                    <TeamLogo team={match.awayTeam.name} size={28} />
                  </div>
                </div>

                <div className="odds-buttons-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <button
                    type="button"
                    className={`odds-pill-btn ${homeSelected ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: match.id,
                        matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                        outcome: '1',
                        selectionName: `${match.homeTeam.name} to Win`,
                        odds: match.odds.home
                      })
                    }
                  >
                    <span className="odds-label">1</span>
                    <span className="odds-val">{Number(match.odds.home).toFixed(2)}</span>
                  </button>
                  <button
                    type="button"
                    className={`odds-pill-btn ${awaySelected ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: match.id,
                        matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                        outcome: '2',
                        selectionName: `${match.awayTeam.name} to Win`,
                        odds: match.odds.away
                      })
                    }
                  >
                    <span className="odds-label">2</span>
                    <span className="odds-val">{Number(match.odds.away).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TENNIS VIEW                                            */}
      {/* ========================================================= */}
      {selectedSport === 'tennis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px' }}>
            <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>🎾 ATP Masters 1000</span>
            <span className="count-badge-bubble">{(liveMatches.length > 0 ? liveMatches : OTHER_SPORTS_MATCHES.tennis).length}</span>
          </div>

          {(liveMatches.length > 0 ? liveMatches : OTHER_SPORTS_MATCHES.tennis).map(match => {
            const homeSelected = isOddSelected(match.id, '1');
            const awaySelected = isOddSelected(match.id, '2');

            return (
              <div key={match.id} className="league-match-card">
                <div className="match-teams-row">
                  <div className="match-team-side">
                    <TeamLogo team={match.homeTeam.name} size={28} />
                    <span>{match.homeTeam.name}</span>
                  </div>
                  <div className="match-schedule-center">
                    <span className="match-date-str">{match.date}</span>
                    <span className="match-time-str">{match.time}</span>
                  </div>
                  <div className="match-team-side away">
                    <span>{match.awayTeam.name}</span>
                    <TeamLogo team={match.awayTeam.name} size={28} />
                  </div>
                </div>

                <div className="odds-buttons-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <button
                    type="button"
                    className={`odds-pill-btn ${homeSelected ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: match.id,
                        matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                        outcome: '1',
                        selectionName: `${match.homeTeam.name} to Win`,
                        odds: match.odds.home
                      })
                    }
                  >
                    <span className="odds-label">1</span>
                    <span className="odds-val">{Number(match.odds.home).toFixed(2)}</span>
                  </button>
                  <button
                    type="button"
                    className={`odds-pill-btn ${awaySelected ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: match.id,
                        matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                        outcome: '2',
                        selectionName: `${match.awayTeam.name} to Win`,
                        odds: match.odds.away
                      })
                    }
                  >
                    <span className="odds-label">2</span>
                    <span className="odds-val">{Number(match.odds.away).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Sports Pulse & Live Community Poll */}
      <InteractiveSportsPulse />

      {/* Real Live Sports Breaking News Wire (Free ESPN Live Feed) */}
      <RealSportsNews />

      {/* ========================================================= */}
      {/* 4. OTHER SPORTS: Clean Ready-for-API Empty State          */}
      {/* ========================================================= */}
      {['baseball', 'volleyball', 'rugby', 'esports'].includes(selectedSport) && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '36px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            margin: '20px 0'
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(47, 104, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}
          >
            <Radio size={26} className="animate-pulse-live" />
          </div>

          <div className="live-pill-badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#9aa0b0', borderColor: 'var(--border-subtle)' }}>
            <span>ODDS FEED PENDING</span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
            Ready for {selectedSport.toUpperCase()} Odds API
          </h3>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: '1.5' }}>
            No live matches currently in-play. Live markets and odds will stream automatically once your Odds API provider is connected.
          </p>

          <button
            type="button"
            className="btn-place-bet"
            style={{ padding: '10px 20px', fontSize: '0.85rem', marginTop: '6px' }}
            onClick={onOpenMenu}
          >
            <Key size={16} />
            <span>Configure Odds API Key</span>
          </button>
        </div>
      )}

      {/* Floating Bottom Dock Navigation */}
      <div className="floating-bottom-dock">
        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          title="Home"
          id="btn-dock-home"
        >
          <Home size={19} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'mybets' ? 'active' : ''}`}
          onClick={onOpenMyBets}
          title="My Bets"
          id="btn-dock-mybets"
        >
          <BarChart2 size={19} />
          <span>My Bets</span>
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'betslip' ? 'active' : ''}`}
          onClick={onOpenBetSlip}
          title="Bet Slip"
          id="btn-dock-betslip"
        >
          <Ticket size={19} />
          <span>Slip</span>
          {betslip.length > 0 && (
            <span className="dock-badge-count">{betslip.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={onOpenSearch}
          title="Search"
          id="btn-dock-search"
        >
          <Search size={19} />
          <span>Search</span>
        </button>

        <button
          type="button"
          className="dock-nav-item dock-signout-btn"
          onClick={onSignOut}
          title="Sign Out"
          id="btn-dock-signout"
        >
          <LogOut size={19} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
