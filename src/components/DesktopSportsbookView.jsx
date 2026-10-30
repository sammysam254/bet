import React, { useState, useEffect } from 'react';
import { BarChart2, Star, Search, Bell, Trophy, Shield, Flame, Activity, Disc, ChevronRight, Radio, Key, Clock, DollarSign, CheckCircle2, Ticket, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeamLogo, UefaChampionsLeagueIcon } from './TeamLogos';
import { FEATURED_MATCH, LEAGUE_MATCHES, OTHER_SPORTS_MATCHES, SPORTS_CATEGORIES, LEAGUES_LIST } from '../data/mockData';
import { fetchLiveOddsFromProvider } from '../services/oddsApi';

export const DesktopSportsbookView = ({
  userBalance,
  onOpenDeposit,
  onOpenNotifications,
  onOpenSearch,
  onSignOut,
  betslip,
  onToggleOddSelection,
  onOpenMatchDetails,
  onOpenApiSettings,
  activeBets = [],
  betHistory = [],
  onPlaceBetSuccess,
  onCashOutBet,
  onClearAllPicks,
  onSettleMatchDemo
}) => {
  const [activeCategory, setActiveCategory] = useState('football');
  const [activeCompetition, setActiveCompetition] = useState('ucl');
  const [chatComment, setChatComment] = useState('');
  const [chatList, setChatList] = useState(FEATURED_MATCH.comments || []);
  const [rightPanelTab, setRightPanelTab] = useState('betslip'); // 'betslip' | 'mybets'
  const [stake, setStake] = useState(25);
  const [desktopNavTab, setDesktopNavTab] = useState('sportsbook'); // 'sportsbook', 'live', 'ucl', 'promos'
  const [liveMatches, setLiveMatches] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  // Fetch real games from The Odds API on mount & category change
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLive(true);
    fetchLiveOddsFromProvider(activeCategory).then(res => {
      if (isMounted) {
        setIsLoadingLive(false);
        if (res.isLiveFeed && res.data?.length > 0) {
          setLiveMatches(res.data);
        } else {
          setLiveMatches([]);
        }
      }
    });
    return () => { isMounted = false; };
  }, [activeCategory]);

  const isOddSelected = (matchId, outcome) => {
    return betslip.some(item => item.matchId === matchId && item.outcome === outcome);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatComment.trim()) return;
    setChatList([
      { id: Date.now(), user: 'You', time: 'Just now', text: chatComment.trim(), likes: 0 },
      ...chatList
    ]);
    setChatComment('');
  };

  const totalOdds = betslip.reduce((acc, p) => acc * p.odds, 1);
  const potentialPayout = (stake * (betslip.length > 0 ? totalOdds : 0)).toFixed(2);

  const handlePlaceBet = () => {
    if (stake <= 0 || stake > userBalance || betslip.length === 0) return;
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) { /* ignore */ }

    const receipt = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString(),
      stake: Number(stake),
      odds: Number(totalOdds.toFixed(2)),
      payout: Number(potentialPayout),
      picks: [...betslip]
    };

    if (onPlaceBetSuccess) {
      onPlaceBetSuccess(Number(stake), receipt);
    }
    if (onClearAllPicks) {
      onClearAllPicks();
    }
    setRightPanelTab('mybets');
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Desktop Top Navbar */}
      <nav className="desktop-nav-header" style={{ maxWidth: '1440px', width: '100%' }}>
        <div className="desktop-nav-left">
          <div className="brand-badge" style={{ cursor: 'pointer' }} onClick={() => { setActiveCategory('football'); setActiveCompetition('ucl'); }}>
            <div className="brand-icon-box">
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
            </div>
            <div>
              <span style={{ color: '#fff' }}>VERTEX</span>
              <span style={{ color: '#2f68ff', marginLeft: '4px' }}>BET</span>
            </div>
          </div>

          <div className="desktop-nav-links">
            <span
              className={`nav-link ${desktopNavTab === 'sportsbook' ? 'active' : ''}`}
              onClick={() => { setDesktopNavTab('sportsbook'); setActiveCategory('football'); }}
            >
              Sportsbook
            </span>
            <span
              className={`nav-link ${desktopNavTab === 'live' ? 'active' : ''}`}
              onClick={() => { setDesktopNavTab('live'); setActiveCategory('football'); }}
            >
              Live In-Play <span className="nav-live-dot" />
            </span>
            <span
              className={`nav-link ${desktopNavTab === 'ucl' ? 'active' : ''}`}
              onClick={() => { setDesktopNavTab('ucl'); setActiveCategory('football'); setActiveCompetition('ucl'); }}
            >
              Champions League
            </span>
            <span
              className={`nav-link ${desktopNavTab === 'promos' ? 'active' : ''}`}
              onClick={() => { setDesktopNavTab('promos'); onOpenDeposit(); }}
            >
              Promotions ($1,356)
            </span>
          </div>
        </div>

        <div className="desktop-nav-right">
          <button
            type="button"
            className="header-circle-btn"
            onClick={onOpenSearch}
            title="Search matches"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            className="header-circle-btn"
            onClick={onOpenNotifications}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notif-badge-dot" />
          </button>

          <button
            type="button"
            className="balance-pill-btn"
            onClick={onOpenDeposit}
            title="Wallet & Deposit"
          >
            <span>Balance: ${userBalance.toLocaleString()}</span>
          </button>

          {/* User Profile / Sportsbook Account Button */}
          <div
            className="desktop-profile-btn"
            onClick={onOpenApiSettings}
            title="Click to view Sportsbook Accounts & Settings"
          >
            <img src="/assets/user.jpg" alt="Profile" className="desktop-nav-avatar" />
            <div className="desktop-nav-user-info">
              <span className="desktop-nav-username">Alex Vance</span>
              <span className="desktop-nav-vip-badge">VIP Level 3 • Online</span>
            </div>
          </div>

          <button
            type="button"
            className="header-circle-btn"
            onClick={onSignOut}
            title="Sign Out"
          >
            <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Exit</span>
          </button>
        </div>
      </nav>

      <div className="desktop-sportsbook-container" id="desktop-sportsbook-layout">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Sidebar Navigation                           */}
        {/* ========================================================= */}
        <aside className="desktop-sidebar">
          {/* User Card */}
          <div className="desktop-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div className="user-avatar-wrapper" style={{ width: '48px', height: '48px' }}>
                <img src="/assets/user.jpg" alt="User Profile" className="user-avatar-img" />
                <div className="user-online-dot" />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Welcome back</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Alexander V.</h4>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Balance</span>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>${userBalance.toLocaleString()}</div>
            </div>

            <button
              type="button"
              className="btn-place-bet"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              onClick={onOpenDeposit}
            >
              Deposit Funds
            </button>
          </div>

          {/* Interactive Sports Categories */}
          <div className="desktop-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sports
              </h4>
              <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: '700' }}>Live Feeds</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {SPORTS_CATEGORIES.map(sport => {
                const isActive = activeCategory === sport.id;
                return (
                  <button
                    key={sport.id}
                    type="button"
                    className={`sport-chip ${isActive ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      justifyContent: 'space-between',
                      transition: 'all 0.25s ease'
                    }}
                    onClick={() => {
                      setActiveCategory(sport.id);
                      if (sport.id === 'football') setActiveCompetition('ucl');
                      if (sport.id === 'basketball') setActiveCompetition('nba');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{sport.icon}</span>
                      <span style={{ fontWeight: isActive ? '800' : '600' }}>{sport.name}</span>
                    </div>
                    {sport.hasLiveOdds && (
                      <span className="live-pill-badge" style={{ padding: '1.5px 6px', fontSize: '0.62rem' }}>
                        LIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top Competitions */}
          <div className="desktop-card" style={{ padding: '14px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              Top Competitions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                className={`menu-action-item ${activeCompetition === 'ucl' ? 'selected' : ''}`}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: activeCompetition === 'ucl' ? 'rgba(47, 104, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: activeCompetition === 'ucl' ? '#2f68ff' : 'var(--border-subtle)'
                }}
                onClick={() => {
                  setActiveCompetition('ucl');
                  setActiveCategory('football');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UefaChampionsLeagueIcon size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Champions League</span>
                </div>
                <span className="count-badge-bubble" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>5</span>
              </button>

              <button
                type="button"
                className={`menu-action-item ${activeCompetition === 'epl' ? 'selected' : ''}`}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: activeCompetition === 'epl' ? 'rgba(47, 104, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: activeCompetition === 'epl' ? '#2f68ff' : 'var(--border-subtle)'
                }}
                onClick={() => {
                  setActiveCompetition('epl');
                  setActiveCategory('epl');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={18} color="#e0b115" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Premier League</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: '700' }}>Ready</span>
              </button>

              <button
                type="button"
                className={`menu-action-item ${activeCompetition === 'laliga' ? 'selected' : ''}`}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: activeCompetition === 'laliga' ? 'rgba(47, 104, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: activeCompetition === 'laliga' ? '#2f68ff' : 'var(--border-subtle)'
                }}
                onClick={() => {
                  setActiveCompetition('laliga');
                  setActiveCategory('laliga');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color="#ef4444" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>La Liga EA Sports</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: '700' }}>Ready</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: Main Betting Arena with Transitions        */}
        {/* ========================================================= */}
        <main className="desktop-main-arena">
          {/* 1. FOOTBALL / CHAMPIONS LEAGUE ARENA */}
          {activeCategory === 'football' && (
            <div key="football-arena" className="screen-transition-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Featured Live Match Hero with In-Depth Stats */}
              <div className="featured-match-card" style={{ padding: '24px' }}>
                <div className="featured-top-bar">
                  <span className="matchday-text" style={{ fontSize: '0.85rem' }}>Matchday 1 • UEFA Champions League Group A</span>
                  <div className="live-pill-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                    <span className="live-pulse-dot animate-pulse-live" />
                    <span>LIVE IN-PLAY</span>
                  </div>
                </div>

                <div className="featured-score-arena" style={{ padding: '16px 20px' }}>
                  <div className="team-block" style={{ width: '140px' }}>
                    <TeamLogo team={FEATURED_MATCH.homeTeam.name} size={64} />
                    <span className="team-name-text" style={{ fontSize: '1.15rem' }}>{FEATURED_MATCH.homeTeam.name}</span>
                  </div>

                  <div className="live-score-center">
                    <div className="live-score-numbers" style={{ fontSize: '3rem' }}>
                      {FEATURED_MATCH.homeTeam.score} : {FEATURED_MATCH.awayTeam.score}
                    </div>
                    <div className="live-clock-time" style={{ fontSize: '1rem' }}>{FEATURED_MATCH.clock} (1st half)</div>
                  </div>

                  <div className="team-block" style={{ width: '140px' }}>
                    <TeamLogo team={FEATURED_MATCH.awayTeam.name} size={64} />
                    <span className="team-name-text" style={{ fontSize: '1.15rem' }}>{FEATURED_MATCH.awayTeam.name}</span>
                  </div>
                </div>

                {/* Goalscorers Timeline */}
                <div className="match-events-timeline" style={{ marginBottom: '16px' }}>
                  <div className="events-home-list">
                    <div>O. Watkins 11' ⚽</div>
                    <div>O. Watkins 15' ⚽</div>
                  </div>
                  <div className="events-ball-icon">⚽</div>
                  <div className="events-away-list">
                    <div>22' I. Mbaye ⚽</div>
                  </div>
                </div>

                {/* Live Odds Matrix */}
                <div className="odds-buttons-grid">
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('featured-1', '1') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: FEATURED_MATCH.id,
                        matchTitle: 'Chelsea vs Man United',
                        outcome: '1',
                        selectionName: 'Chelsea to Win',
                        odds: FEATURED_MATCH.odds.home
                      })
                    }
                  >
                    <span className="odds-label">1 (Chelsea)</span>
                    <span className="odds-val">{FEATURED_MATCH.odds.home.toFixed(2)}</span>
                  </button>
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('featured-1', 'X') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: FEATURED_MATCH.id,
                        matchTitle: 'Chelsea vs Man United',
                        outcome: 'X',
                        selectionName: 'Draw',
                        odds: FEATURED_MATCH.odds.draw
                      })
                    }
                  >
                    <span className="odds-label">X (Draw)</span>
                    <span className="odds-val">{FEATURED_MATCH.odds.draw.toFixed(2)}</span>
                  </button>
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('featured-1', '2') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: FEATURED_MATCH.id,
                        matchTitle: 'Chelsea vs Man United',
                        outcome: '2',
                        selectionName: 'Man United to Win',
                        odds: FEATURED_MATCH.odds.away
                      })
                    }
                  >
                    <span className="odds-label">2 (Man United)</span>
                    <span className="odds-val">{FEATURED_MATCH.odds.away.toFixed(2)}</span>
                  </button>
                </div>
              </div>

              {/* In-Play Detailed Stats & 2D Radar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                <div className="inplay-stats-card">
                  <div className="watermark-crest-left">
                    <TeamLogo team="Chelsea" size={160} />
                  </div>
                  <div className="watermark-crest-right">
                    <TeamLogo team="Man United" size={160} />
                  </div>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '4px', zIndex: 2 }}>
                    Match In-Play Statistics
                  </h4>

                  <div className="stat-row-item">
                    <span className="stat-num-home">56</span>
                    <span className="stat-label-center">Attacks</span>
                    <span className="stat-num-away highlight-red"><span className="arrow-up-red">↑</span>75</span>
                  </div>
                  <div className="stat-row-item">
                    <span className="stat-num-home highlight-blue">25<span className="arrow-up-blue">↑</span></span>
                    <span className="stat-label-center">Dangers</span>
                    <span className="stat-num-away">21</span>
                  </div>
                  <div className="stat-row-item">
                    <span className="stat-num-home">16</span>
                    <span className="stat-label-center">Saves</span>
                    <span className="stat-num-away">16</span>
                  </div>
                  <div className="stat-row-item">
                    <span className="stat-num-home">25</span>
                    <span className="stat-label-center">Shots</span>
                    <span className="stat-num-away highlight-red"><span className="arrow-up-red">↑</span>28</span>
                  </div>
                  <div className="stat-row-item">
                    <span className="stat-num-home highlight-blue">7<span className="arrow-up-blue">↑</span></span>
                    <span className="stat-label-center">OnTarget</span>
                    <span className="stat-num-away">6</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="h2h-probability-card" style={{ margin: 0 }}>
                    <div className="h2h-teams-header">
                      <div className="h2h-team-chip">
                        <TeamLogo team="Chelsea" size={20} />
                        <span>Chelsea</span>
                      </div>
                      <div className="h2h-team-chip">
                        <span>Man United</span>
                        <TeamLogo team="Man United" size={20} />
                      </div>
                    </div>

                    <div className="h2h-segmented-bar">
                      <div className="segment-chelsea" style={{ width: '46.67%' }}>46.67%</div>
                      <div className="segment-draw" style={{ width: '20%' }}>20%</div>
                      <div className="segment-manutd" style={{ width: '33.33%' }}>33.33%</div>
                    </div>

                    <div className="h2h-legend-row">
                      <div className="legend-item"><span className="legend-circle legend-blue" /><span>7 Wins</span></div>
                      <div className="legend-item"><span className="legend-circle legend-grey" /><span>3 Draws</span></div>
                      <div className="legend-item"><span className="legend-circle legend-red" /><span>5 Wins</span></div>
                    </div>
                  </div>

                  <div className="pitch-container" style={{ margin: 0, height: '140px' }}>
                    <div className="pitch-half-line" />
                    <div className="pitch-center-circle" />
                    <div className="pitch-action-pulse" style={{ top: '35%', left: '70%' }}>
                      <div className="pitch-action-ball" />
                    </div>
                    <div className="pitch-label-overlay">
                      <span>Man United Attack Phase</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Fixtures List (Synced with The Odds API) */}
              <div className="desktop-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UefaChampionsLeagueIcon size={22} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>
                      {activeCategory === 'football' ? 'Live Football & UEFA Fixtures' : `${activeCategory.toUpperCase()} Fixtures`}
                    </h3>
                    {liveMatches.length > 0 && (
                      <span className="live-pill-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                        <span className="live-pulse-dot" style={{ background: '#10b981' }} />
                        LIVE THE ODDS API ({liveMatches.length} MATCHES)
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {isLoadingLive ? 'Fetching real-time odds...' : 'All bookmaker odds live (GMT)'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(liveMatches.length > 0 ? liveMatches : LEAGUE_MATCHES).map(match => (
                    <div key={match.id} className="desktop-match-item">
                      <div className="desktop-team-chip" title={match.homeTeam.name}>
                        <TeamLogo team={match.homeTeam.name} size={30} />
                        <span>{match.homeTeam.name}</span>
                      </div>

                      <div className="desktop-match-time-chip">
                        <span className="match-date-str">{match.date}</span>
                        <span className="match-time-str">{match.time}</span>
                        {match.bookmakerName && (
                          <span className="bookmaker-badge">{match.bookmakerName}</span>
                        )}
                      </div>

                      <div className="desktop-team-chip away" title={match.awayTeam.name}>
                        <span>{match.awayTeam.name}</span>
                        <TeamLogo team={match.awayTeam.name} size={30} />
                      </div>

                      <div className="odds-buttons-grid" style={{ width: '240px' }}>
                        <button
                          type="button"
                          className={`odds-pill-btn ${isOddSelected(match.id, '1') ? 'selected' : ''}`}
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
                          className={`odds-pill-btn ${isOddSelected(match.id, 'X') ? 'selected' : ''}`}
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
                          className={`odds-pill-btn ${isOddSelected(match.id, '2') ? 'selected' : ''}`}
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. BASKETBALL / NBA ARENA */}
          {activeCategory === 'basketball' && (
            <div key="basketball-arena" className="screen-transition-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* NBA Live Match Hero */}
              <div className="featured-match-card" style={{ padding: '24px' }}>
                <div className="featured-top-bar">
                  <span className="matchday-text" style={{ fontSize: '0.85rem' }}>NBA Playoffs 2026 • Game 4</span>
                  <div className="live-pill-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                    <span className="live-pulse-dot animate-pulse-live" />
                    <span>LIVE IN-PLAY • Q3 04:12</span>
                  </div>
                </div>

                <div className="featured-score-arena" style={{ padding: '16px 20px' }}>
                  <div className="team-block" style={{ width: '150px' }}>
                    <span style={{ fontSize: '2.5rem' }}>🏀</span>
                    <span className="team-name-text" style={{ fontSize: '1.15rem' }}>LA Lakers</span>
                  </div>

                  <div className="live-score-center">
                    <div className="live-score-numbers" style={{ fontSize: '3rem' }}>
                      86 : 89
                    </div>
                    <div className="live-clock-time" style={{ fontSize: '1rem' }}>Quarter 3 • 4:12 remaining</div>
                  </div>

                  <div className="team-block" style={{ width: '150px' }}>
                    <span style={{ fontSize: '2.5rem' }}>🏀</span>
                    <span className="team-name-text" style={{ fontSize: '1.15rem' }}>Golden State</span>
                  </div>
                </div>

                <div className="odds-buttons-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('nba-1', '1') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: 'nba-1',
                        matchTitle: 'LA Lakers vs Golden State',
                        outcome: '1',
                        selectionName: 'LA Lakers to Win',
                        odds: 1.90
                      })
                    }
                  >
                    <span className="odds-label">1 (Lakers)</span>
                    <span className="odds-val">1.90</span>
                  </button>
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('nba-1', '2') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: 'nba-1',
                        matchTitle: 'LA Lakers vs Golden State',
                        outcome: '2',
                        selectionName: 'Golden State to Win',
                        odds: 1.95
                      })
                    }
                  >
                    <span className="odds-label">2 (Warriors)</span>
                    <span className="odds-val">1.95</span>
                  </button>
                </div>
              </div>

              {/* NBA Live Fixtures (Synced with The Odds API) */}
              <div className="desktop-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🏀</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Live NBA Fixtures</h3>
                    {liveMatches.length > 0 && (
                      <span className="live-pill-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                        <span className="live-pulse-dot" style={{ background: '#10b981' }} />
                        ODDS API LIVE ({liveMatches.length} GAMES)
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {isLoadingLive ? 'Fetching NBA odds...' : 'Official Bookmaker Lines'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(liveMatches.length > 0 ? liveMatches : OTHER_SPORTS_MATCHES.basketball).map(match => (
                    <div key={match.id} className="desktop-match-item">
                      <div className="desktop-team-chip" title={match.homeTeam.name}>
                        <TeamLogo team={match.homeTeam.name} size={30} />
                        <span>{match.homeTeam.name}</span>
                      </div>

                      <div className="desktop-match-time-chip">
                        <span className="match-date-str">{match.date}</span>
                        <span className="match-time-str">{match.time}</span>
                        {match.bookmakerName && (
                          <span className="bookmaker-badge">{match.bookmakerName}</span>
                        )}
                      </div>

                      <div className="desktop-team-chip away" title={match.awayTeam.name}>
                        <span>{match.awayTeam.name}</span>
                        <TeamLogo team={match.awayTeam.name} size={30} />
                      </div>

                      <div className="odds-buttons-grid" style={{ width: '200px', gridTemplateColumns: '1fr 1fr' }}>
                        <button
                          type="button"
                          className={`odds-pill-btn ${isOddSelected(match.id, '1') ? 'selected' : ''}`}
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
                          className={`odds-pill-btn ${isOddSelected(match.id, '2') ? 'selected' : ''}`}
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. TENNIS ARENA */}
          {activeCategory === 'tennis' && (
            <div key="tennis-arena" className="screen-transition-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="featured-match-card" style={{ padding: '24px' }}>
                <div className="featured-top-bar">
                  <span className="matchday-text" style={{ fontSize: '0.85rem' }}>ATP Masters 1000 • Semi-Final</span>
                  <div className="live-pill-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                    <span className="live-pulse-dot animate-pulse-live" />
                    <span>LIVE IN-PLAY • Set 3 (4-3)</span>
                  </div>
                </div>

                <div className="featured-score-arena" style={{ padding: '16px 20px' }}>
                  <div className="team-block" style={{ width: '150px' }}>
                    <span style={{ fontSize: '2.5rem' }}>🎾</span>
                    <span className="team-name-text" style={{ fontSize: '1.15rem' }}>C. Alcaraz</span>
                  </div>

                  <div className="live-score-center">
                    <div className="live-score-numbers" style={{ fontSize: '2.8rem' }}>
                      1 : 1
                    </div>
                    <div className="live-clock-time" style={{ fontSize: '1rem' }}>Current Set: 4 - 3 (30-15)</div>
                  </div>

                  <div className="team-block" style={{ width: '150px' }}>
                    <span style={{ fontSize: '2.5rem' }}>🎾</span>
                    <span className="team-name-text" style={{ fontSize: '1.15rem' }}>J. Sinner</span>
                  </div>
                </div>

                <div className="odds-buttons-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('atp-1', '1') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: 'atp-1',
                        matchTitle: 'C. Alcaraz vs J. Sinner',
                        outcome: '1',
                        selectionName: 'C. Alcaraz to Win',
                        odds: 1.88
                      })
                    }
                  >
                    <span className="odds-label">1 (Alcaraz)</span>
                    <span className="odds-val">1.88</span>
                  </button>
                  <button
                    type="button"
                    className={`odds-pill-btn ${isOddSelected('atp-1', '2') ? 'selected' : ''}`}
                    onClick={() =>
                      onToggleOddSelection({
                        matchId: 'atp-1',
                        matchTitle: 'C. Alcaraz vs J. Sinner',
                        outcome: '2',
                        selectionName: 'J. Sinner to Win',
                        odds: 1.92
                      })
                    }
                  >
                    <span className="odds-label">2 (Sinner)</span>
                    <span className="odds-val">1.92</span>
                  </button>
                </div>
              </div>

              {/* Tennis Live Fixtures */}
              <div className="desktop-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🎾</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>ATP / WTA Tour Fixtures</h3>
                    {liveMatches.length > 0 && (
                      <span className="live-pill-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                        <span className="live-pulse-dot" style={{ background: '#10b981' }} />
                        ODDS API LIVE ({liveMatches.length} MATCHES)
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(liveMatches.length > 0 ? liveMatches : OTHER_SPORTS_MATCHES.tennis).map(match => (
                    <div key={match.id} className="desktop-match-item">
                      <div className="desktop-team-chip" title={match.homeTeam.name}>
                        <TeamLogo team={match.homeTeam.name} size={30} />
                        <span>{match.homeTeam.name}</span>
                      </div>

                      <div className="desktop-match-time-chip">
                        <span className="match-date-str">{match.date}</span>
                        <span className="match-time-str">{match.time}</span>
                        {match.bookmakerName && (
                          <span className="bookmaker-badge">{match.bookmakerName}</span>
                        )}
                      </div>

                      <div className="desktop-team-chip away" title={match.awayTeam.name}>
                        <span>{match.awayTeam.name}</span>
                        <TeamLogo team={match.awayTeam.name} size={30} />
                      </div>

                      <div className="odds-buttons-grid" style={{ width: '200px', gridTemplateColumns: '1fr 1fr' }}>
                        <button
                          type="button"
                          className={`odds-pill-btn ${isOddSelected(match.id, '1') ? 'selected' : ''}`}
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
                          className={`odds-pill-btn ${isOddSelected(match.id, '2') ? 'selected' : ''}`}
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. NFL / AMERICAN FOOTBALL ARENA & OTHER LIVE SPORTS */}
          {activeCategory !== 'football' && activeCategory !== 'basketball' && activeCategory !== 'tennis' && liveMatches.length > 0 && (
            <div key={`live-${activeCategory}`} className="screen-transition-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="desktop-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚡</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                      {activeCategory.toUpperCase()} Live Fixtures
                    </h3>
                    <span className="live-pill-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                      <span className="live-pulse-dot" style={{ background: '#10b981' }} />
                      ODDS API LIVE ({liveMatches.length} MATCHES)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Real-time market feeds
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {liveMatches.map(match => (
                    <div key={match.id} className="desktop-match-item">
                      <div className="desktop-team-chip" title={match.homeTeam.name}>
                        <TeamLogo team={match.homeTeam.name} size={30} />
                        <span>{match.homeTeam.name}</span>
                      </div>

                      <div className="desktop-match-time-chip">
                        <span className="match-date-str">{match.date}</span>
                        <span className="match-time-str">{match.time}</span>
                        {match.bookmakerName && (
                          <span className="bookmaker-badge">{match.bookmakerName}</span>
                        )}
                      </div>

                      <div className="desktop-team-chip away" title={match.awayTeam.name}>
                        <span>{match.awayTeam.name}</span>
                        <TeamLogo team={match.awayTeam.name} size={30} />
                      </div>

                      <div className="odds-buttons-grid" style={{ width: match.odds.draw ? '240px' : '200px', gridTemplateColumns: match.odds.draw ? '1fr 1fr 1fr' : '1fr 1fr' }}>
                        <button
                          type="button"
                          className={`odds-pill-btn ${isOddSelected(match.id, '1') ? 'selected' : ''}`}
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
                        {match.odds.draw && (
                          <button
                            type="button"
                            className={`odds-pill-btn ${isOddSelected(match.id, 'X') ? 'selected' : ''}`}
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
                        )}
                        <button
                          type="button"
                          className={`odds-pill-btn ${isOddSelected(match.id, '2') ? 'selected' : ''}`}
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. OFF-SEASON / UNPOPULATED CATEGORY */}
          {activeCategory !== 'football' && activeCategory !== 'basketball' && activeCategory !== 'tennis' && liveMatches.length === 0 && (
            <div
              key={`pending-${activeCategory}`}
              className="screen-transition-enter"
              style={{
                background: 'rgba(20, 24, 33, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '60px 40px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(47, 104, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa'
                }}
              >
                <Radio size={36} className="animate-pulse-live" />
              </div>

              <div className="live-pill-badge" style={{ padding: '4px 14px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.08)', color: '#9aa0b0', borderColor: 'var(--border-subtle)' }}>
                <span>OFF-SEASON / NEXT ROUND PENDING</span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff' }}>
                {activeCategory.toUpperCase()} Schedule
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: '1.6' }}>
                No active games currently in-play for this league. As soon as bookmakers release lines for the upcoming fixture round, they will stream automatically into this arena.
              </p>

              <button
                type="button"
                className="btn-desktop-signup"
                style={{ marginTop: '10px', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={onOpenApiSettings}
              >
                <Key size={18} />
                <span>Sportsbook Provider Settings</span>
              </button>
            </div>
          )}
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Bet Slip, My Bets & Live Chat               */}
        {/* ========================================================= */}
        <aside className="desktop-right-panel">
          {/* Bet Slip / My Bets Card */}
          <div className="desktop-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="auth-mode-switch" style={{ margin: 0 }}>
              <button
                type="button"
                className={`auth-mode-tab ${rightPanelTab === 'betslip' ? 'active' : ''}`}
                onClick={() => setRightPanelTab('betslip')}
              >
                Bet Slip {betslip.length > 0 && `(${betslip.length})`}
              </button>
              <button
                type="button"
                className={`auth-mode-tab ${rightPanelTab === 'mybets' ? 'active' : ''}`}
                onClick={() => setRightPanelTab('mybets')}
              >
                My Bets {activeBets.length > 0 && `(${activeBets.length})`}
              </button>
            </div>

            {rightPanelTab === 'betslip' ? (
              betslip.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🎟️</span>
                  <p style={{ marginTop: '8px', fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>Your slip is empty</p>
                  <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Select any odds (1, X, 2) in the match matrix</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {betslip.map(pick => (
                    <div key={`${pick.matchId}-${pick.outcome}`} className="betslip-pick-card">
                      <div className="pick-meta">
                        <span className="pick-match-title">{pick.matchTitle}</span>
                        <span className="pick-outcome">{pick.selectionName}</span>
                      </div>
                      <span className="pick-odds-val">{pick.odds.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="quick-stakes-row">
                    {[5, 10, 25, 50].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        className="stake-chip-btn"
                        onClick={() => setStake(prev => Number(prev || 0) + amt)}
                      >
                        +${amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="stake-chip-btn"
                      onClick={() => setStake(userBalance)}
                    >
                      Max
                    </button>
                  </div>

                  <div className="stake-input-box">
                    <span>$</span>
                    <input
                      type="number"
                      min="1"
                      max={userBalance}
                      value={stake}
                      onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
                    />
                  </div>

                  <div className="payout-calculation-row">
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Odds: {totalOdds.toFixed(2)}</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>Potential Payout:</div>
                    </div>
                    <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#10b981' }}>${potentialPayout}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-place-bet"
                    id="btn-desktop-place-bet"
                    disabled={stake <= 0 || stake > userBalance || betslip.length === 0}
                    onClick={handlePlaceBet}
                  >
                    Place Bet (${Number(stake).toFixed(2)})
                  </button>
                </div>
              )
            ) : (
              /* MY BETS PANEL (Open & Settled) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeBets.length === 0 ? (
                  <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <Clock size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '0.85rem' }}>No open bets in-play</p>
                  </div>
                ) : (
                  activeBets.map(bet => {
                    const cashoutValue = (bet.stake * 1.35).toFixed(2);
                    return (
                      <div
                        key={bet.id}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span>#{bet.id}</span>
                          <span style={{ color: '#10b981', fontWeight: '800' }}>IN-PLAY</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#fff' }}>
                          {bet.picks[0]?.selectionName} @{bet.odds}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span>Stake: ${bet.stake.toFixed(2)}</span>
                          <span style={{ color: '#10b981', fontWeight: '800' }}>Win: ${bet.payout.toFixed(2)}</span>
                        </div>
                        <button
                          type="button"
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: '#000',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            padding: '6px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            marginTop: '2px'
                          }}
                          onClick={() => onCashOutBet && onCashOutBet(bet)}
                        >
                          <DollarSign size={14} />
                          <span>Cash Out (${cashoutValue})</span>
                        </button>
                      </div>
                    );
                  })
                )}

                {activeBets.length > 0 && (
                  <button
                    type="button"
                    style={{
                      background: 'rgba(47, 104, 255, 0.12)',
                      border: '1px solid rgba(47, 104, 255, 0.3)',
                      color: '#60a5fa',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginTop: '6px'
                    }}
                    onClick={() => onSettleMatchDemo && onSettleMatchDemo({ matchId: 'featured-1', winningOutcome: '1', scoreStr: '2 - 1' })}
                  >
                    <Clock size={14} />
                    <span>Check Odds API / Full-Time Whistle (2-1)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Live Fan Banter */}
          <div className="desktop-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Live Fan Banter</span>
              <span className="live-pulse-dot animate-pulse-live" />
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {chatList.map(c => (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#60a5fa' }}>{c.user}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.time}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Write a message..."
                value={chatComment}
                onChange={(e) => setChatComment(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
              <button
                type="submit"
                style={{ background: '#2f68ff', color: '#fff', padding: '0 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700' }}
              >
                Send
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};
