import React, { useState, useEffect } from 'react';
import { Search, Bell, BarChart2, Star, ChevronDown, ChevronUp, Home, Disc, Ticket, Menu, Clock, Radio, Key } from 'lucide-react';
import { TeamLogo, UefaChampionsLeagueIcon } from './TeamLogos';
import { SPORTS_CATEGORIES, FEATURED_MATCH, LEAGUE_MATCHES, OTHER_SPORTS_MATCHES } from '../data/mockData';
import { fetchLiveOddsFromProvider } from '../services/oddsApi';

export const HomeScreen = ({
  userBalance,
  onOpenMatchDetails,
  onOpenBetSlip,
  onOpenSearch,
  onOpenNotifications,
  onOpenDeposit,
  onOpenMenu,
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
          {/* Featured Live Match Card */}
          <div
            className="featured-match-card"
            id="card-featured-match"
            onClick={() => onOpenMatchDetails(FEATURED_MATCH)}
          >
            <div className="featured-top-bar">
              <span className="matchday-text">{FEATURED_MATCH.matchday}</span>

              <div className="league-center-meta">
                <div className="live-pill-badge">
                  <span className="live-pulse-dot animate-pulse-live" />
                  <span>LIVE</span>
                </div>
                <span className="league-title-small">{FEATURED_MATCH.league}</span>
                <span className="group-text-small">{FEATURED_MATCH.group}</span>
              </div>

              <div className="featured-actions">
                <button
                  type="button"
                  className="card-icon-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMatchDetails(FEATURED_MATCH);
                  }}
                  title="View in-depth match stats"
                >
                  <BarChart2 size={16} />
                </button>
                <button
                  type="button"
                  className={`card-icon-action ${favorites[FEATURED_MATCH.id] ? 'starred' : ''}`}
                  onClick={(e) => toggleFavorite(e, FEATURED_MATCH.id)}
                  title="Add to favorites"
                >
                  <Star size={16} fill={favorites[FEATURED_MATCH.id] ? '#f59e0b' : 'none'} />
                </button>
              </div>
            </div>

            {/* Teams and Score Row */}
            <div className="featured-score-arena">
              <div className="team-block">
                <TeamLogo team={FEATURED_MATCH.homeTeam.name} size={48} />
                <span className="team-name-text">{FEATURED_MATCH.homeTeam.name}</span>
              </div>

              <div className="live-score-center">
                <div className="live-score-numbers">
                  {FEATURED_MATCH.homeTeam.score} : {FEATURED_MATCH.awayTeam.score}
                </div>
                <div className="live-clock-time">{FEATURED_MATCH.clock}</div>
                <div className="live-period-sub">{FEATURED_MATCH.period}</div>
              </div>

              <div className="team-block">
                <TeamLogo team={FEATURED_MATCH.awayTeam.name} size={48} />
                <span className="team-name-text">{FEATURED_MATCH.awayTeam.name}</span>
              </div>
            </div>

            {/* Carousel Slider Dash Indicators */}
            <div className="featured-carousel-slider-dots">
              {[0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className={`slider-dash ${sliderIndex === idx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSliderIndex(idx);
                  }}
                />
              ))}
            </div>
          </div>

          {/* UEFA Champions League Section */}
          <div className="league-accordion-section">
            <div
              className="league-section-header"
              onClick={() => setIsLeagueExpanded(!isLeagueExpanded)}
            >
              <div className="league-header-left">
                <UefaChampionsLeagueIcon size={20} />
                <span className="league-name-main">UEFA Champions League</span>
                <span className="count-badge-bubble">{(liveMatches.length > 0 ? liveMatches : LEAGUE_MATCHES).length}</span>
                {liveMatches.length > 0 && (
                  <span className="live-pill-badge" style={{ padding: '2px 8px', fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                    ODDS API LIVE
                  </span>
                )}
              </div>
              {isLeagueExpanded ? (
                <ChevronUp size={18} color="#9aa0b0" />
              ) : (
                <ChevronDown size={18} color="#9aa0b0" />
              )}
            </div>

            {isLeagueExpanded && (
              <div className="league-matches-list">
                {(liveMatches.length > 0 ? liveMatches : LEAGUE_MATCHES).map(match => {
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
                          <span className="odds-val">{match.odds.home.toFixed(2)}</span>
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
                          <span className="odds-val">{match.odds.draw.toFixed(2)}</span>
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
                          <span className="odds-val">{match.odds.away.toFixed(2)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
        >
          <Home size={22} />
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'sports' ? 'active' : ''}`}
          onClick={() => setSelectedSport(selectedSport === 'football' ? 'basketball' : 'football')}
          title="Live Sports"
        >
          <Disc size={22} />
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'betslip' ? 'active' : ''}`}
          onClick={onOpenBetSlip}
          title="Bet Slip"
          id="btn-dock-betslip"
        >
          <Ticket size={22} />
          {betslip.length > 0 && (
            <span className="dock-badge-count">{betslip.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => onOpenMatchDetails(FEATURED_MATCH)}
          title="Favorites"
        >
          <Star size={22} />
        </button>

        <button
          type="button"
          className={`dock-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={onOpenMenu}
          title="Account Menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </div>
  );
};
