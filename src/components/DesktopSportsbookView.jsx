import React, { useState, useEffect } from 'react';
import { BarChart2, Star, Search, Bell, Trophy, Shield, Flame, Activity, Disc, ChevronLeft, ChevronRight, Radio, Key, Clock, DollarSign, CheckCircle2, Ticket, RefreshCw, Zap, TrendingUp, Sparkles, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeamLogo, UefaChampionsLeagueIcon, PremierLeagueIcon, LaLigaIcon } from './TeamLogos';
import { FEATURED_MATCHES, FEATURED_MATCH, LEAGUES_DATA, LEAGUE_MATCHES, OTHER_SPORTS_MATCHES, SPORTS_CATEGORIES, LEAGUES_LIST } from '../data/mockData';
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
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState('all');
  const [chatComment, setChatComment] = useState('');
  const [chatList, setChatList] = useState(FEATURED_MATCH.comments || []);
  const [rightPanelTab, setRightPanelTab] = useState('betslip'); // 'betslip' | 'mybets'
  const [stake, setStake] = useState(25);
  const [desktopNavTab, setDesktopNavTab] = useState('sportsbook'); // 'sportsbook', 'live', 'ucl', 'promos'
  const [liveMatches, setLiveMatches] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  // 5-Second Auto-Slide Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  useEffect(() => {
    if (isHeroPaused) return;
    const intervalMs = 100;
    const totalMs = 5000;
    const timer = setInterval(() => {
      setSlideProgress(prev => {
        if (prev >= 100) {
          setHeroIndex(idx => (idx + 1) % FEATURED_MATCHES.length);
          return 0;
        }
        return prev + (intervalMs / totalMs) * 100;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const handleNextHero = () => {
    setHeroIndex(prev => (prev + 1) % FEATURED_MATCHES.length);
    setSlideProgress(0);
  };

  const handlePrevHero = () => {
    setHeroIndex(prev => (prev - 1 + FEATURED_MATCHES.length) % FEATURED_MATCHES.length);
    setSlideProgress(0);
  };

  // Fetch real games with instant Upstash Redis cache + background SWR
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLive(true);
    fetchLiveOddsFromProvider(activeCategory, (bgRes) => {
      if (isMounted && bgRes.isLiveFeed && bgRes.data?.length > 0) {
        setLiveMatches(bgRes.data);
      }
    }).then(res => {
      if (isMounted) {
        setIsLoadingLive(false);
        if (res.isLiveFeed && res.data?.length > 0) {
          setLiveMatches(res.data);
        } else if (!res.fromCache) {
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
            {/* Featured Live Match Hero Slider (Slides every 5 seconds) */}
            {(() => {
              const currentHero = FEATURED_MATCHES[heroIndex] || FEATURED_MATCHES[0];
              return (
                <div
                  className="featured-match-card"
                  style={{ padding: '24px', position: 'relative' }}
                  onMouseEnter={() => setIsHeroPaused(true)}
                  onMouseLeave={() => setIsHeroPaused(false)}
                >
                  {/* Prev / Next Carousel Controls */}
                  <button
                    type="button"
                    className="hero-nav-arrow hero-nav-prev"
                    onClick={(e) => { e.stopPropagation(); handlePrevHero(); }}
                    title="Previous Featured Match"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    className="hero-nav-arrow hero-nav-next"
                    onClick={(e) => { e.stopPropagation(); handleNextHero(); }}
                    title="Next Featured Match"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="featured-top-bar" style={{ padding: '0 40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="matchday-text" style={{ fontSize: '0.85rem', fontWeight: '700' }}>{currentHero.matchday}</span>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                        {currentHero.badge}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {currentHero.isLive ? (
                        <div className="live-pill-badge" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                          <span className="live-pulse-dot animate-pulse-live" />
                          <span>LIVE IN-PLAY ({currentHero.clock})</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', color: '#93c5fd' }}>
                          <Clock size={13} />
                          <span>{currentHero.clock}</span>
                        </div>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {heroIndex + 1}/{FEATURED_MATCHES.length}
                      </span>
                    </div>
                  </div>

                  {/* Team Logos & Score Center */}
                  <div className="featured-score-arena" style={{ padding: '16px 40px' }}>
                    <div className="team-block" style={{ width: '160px' }}>
                      <TeamLogo team={currentHero.homeTeam.name} size={68} />
                      <span className="team-name-text" style={{ fontSize: '1.18rem', fontWeight: '900', marginTop: '6px' }}>
                        {currentHero.homeTeam.name}
                      </span>
                    </div>

                    <div className="live-score-center">
                      {currentHero.isLive ? (
                        <>
                          <div className="live-score-numbers" style={{ fontSize: '3.2rem', letterSpacing: '4px' }}>
                            {currentHero.homeTeam.score} : {currentHero.awayTeam.score}
                          </div>
                          <div className="live-clock-time" style={{ fontSize: '1rem', color: '#60a5fa' }}>
                            {currentHero.clock} ({currentHero.period})
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '2rem', fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>VS</span>
                          <span style={{ fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '4px 12px', borderRadius: '9999px', fontWeight: '700' }}>
                            {currentHero.time || 'Kickoff Soon'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="team-block" style={{ width: '160px' }}>
                      <TeamLogo team={currentHero.awayTeam.name} size={68} />
                      <span className="team-name-text" style={{ fontSize: '1.18rem', fontWeight: '900', marginTop: '6px' }}>
                        {currentHero.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {/* AI Hot Insight Banner */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '9px 16px', margin: '0 40px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.86rem', color: '#e2e8f0' }}>
                    <Sparkles size={16} color="#f59e0b" />
                    <span>{currentHero.hotInsight}</span>
                  </div>

                  {/* Live Odds Matrix */}
                  <div className="odds-buttons-grid" style={{ padding: '0 40px' }}>
                    <button
                      type="button"
                      className={`odds-pill-btn ${isOddSelected(currentHero.id, '1') ? 'selected' : ''}`}
                      onClick={() =>
                        onToggleOddSelection({
                          matchId: currentHero.id,
                          matchTitle: `${currentHero.homeTeam.name} vs ${currentHero.awayTeam.name}`,
                          outcome: '1',
                          selectionName: `${currentHero.homeTeam.name} to Win`,
                          odds: currentHero.odds.home
                        })
                      }
                    >
                      <span className="odds-label">1 ({currentHero.homeTeam.name})</span>
                      <span className="odds-val">{currentHero.odds.home.toFixed(2)}</span>
                    </button>
                    <button
                      type="button"
                      className={`odds-pill-btn ${isOddSelected(currentHero.id, 'X') ? 'selected' : ''}`}
                      onClick={() =>
                        onToggleOddSelection({
                          matchId: currentHero.id,
                          matchTitle: `${currentHero.homeTeam.name} vs ${currentHero.awayTeam.name}`,
                          outcome: 'X',
                          selectionName: 'Draw',
                          odds: currentHero.odds.draw
                        })
                      }
                    >
                      <span className="odds-label">X (Draw)</span>
                      <span className="odds-val">{currentHero.odds.draw.toFixed(2)}</span>
                    </button>
                    <button
                      type="button"
                      className={`odds-pill-btn ${isOddSelected(currentHero.id, '2') ? 'selected' : ''}`}
                      onClick={() =>
                        onToggleOddSelection({
                          matchId: currentHero.id,
                          matchTitle: `${currentHero.homeTeam.name} vs ${currentHero.awayTeam.name}`,
                          outcome: '2',
                          selectionName: `${currentHero.awayTeam.name} to Win`,
                          odds: currentHero.odds.away
                        })
                      }
                    >
                      <span className="odds-label">2 ({currentHero.awayTeam.name})</span>
                      <span className="odds-val">{currentHero.odds.away.toFixed(2)}</span>
                    </button>
                  </div>

                  {/* 5-Second Timer Progress Bar */}
                  <div className="hero-timer-track" style={{ margin: '16px 40px 0' }}>
                    <div className="hero-timer-fill" style={{ width: `${slideProgress}%` }} />
                  </div>

                  {/* Hero Slide Indicator Dots */}
                  <div className="hero-dots-row">
                    {FEATURED_MATCHES.map((m, idx) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`hero-dot-btn ${idx === heroIndex ? 'active' : ''}`}
                        onClick={() => { setHeroIndex(idx); setSlideProgress(0); }}
                        title={`${m.homeTeam.name} vs ${m.awayTeam.name}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* In-Play Detailed Stats & AI Match Intelligence */}
            {(() => {
              const currentHero = FEATURED_MATCHES[heroIndex] || FEATURED_MATCHES[0];
              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                  <div className="inplay-stats-card">
                    <div className="watermark-crest-left">
                      <TeamLogo team={currentHero.homeTeam.name} size={160} />
                    </div>
                    <div className="watermark-crest-right">
                      <TeamLogo team={currentHero.awayTeam.name} size={160} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', zIndex: 2 }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: '800' }}>
                        Live Match Statistics & Momentum
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: '700' }}>
                        {currentHero.homeTeam.name} vs {currentHero.awayTeam.name}
                      </span>
                    </div>

                    <div className="stat-row-item">
                      <span className="stat-num-home">{currentHero.stats.attacks.home}</span>
                      <span className="stat-label-center">Attacks</span>
                      <span className={`stat-num-away ${currentHero.stats.attacks.trend === 'away' ? 'highlight-red' : ''}`}>
                        {currentHero.stats.attacks.away}
                      </span>
                    </div>
                    <div className="stat-row-item">
                      <span className={`stat-num-home ${currentHero.stats.dangers.trend === 'home' ? 'highlight-blue' : ''}`}>
                        {currentHero.stats.dangers.home}
                      </span>
                      <span className="stat-label-center">Dangerous Attacks</span>
                      <span className="stat-num-away">{currentHero.stats.dangers.away}</span>
                    </div>
                    <div className="stat-row-item">
                      <span className="stat-num-home">{currentHero.stats.shots.home}</span>
                      <span className="stat-label-center">Total Shots</span>
                      <span className="stat-num-away">{currentHero.stats.shots.away}</span>
                    </div>
                    <div className="stat-row-item">
                      <span className="stat-num-home highlight-blue">{currentHero.stats.onTarget.home}</span>
                      <span className="stat-label-center">Shots On Target</span>
                      <span className="stat-num-away highlight-red">{currentHero.stats.onTarget.away}</span>
                    </div>
                    <div className="stat-row-item">
                      <span className="stat-num-home">{currentHero.stats.possession.home}%</span>
                      <span className="stat-label-center">Possession</span>
                      <span className="stat-num-away">{currentHero.stats.possession.away}%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* AI Predictive Win Probability */}
                    <div className="h2h-probability-card" style={{ margin: 0, padding: '16px' }}>
                      <div className="h2h-teams-header">
                        <div className="h2h-team-chip">
                          <TeamLogo team={currentHero.homeTeam.name} size={22} />
                          <span>{currentHero.homeTeam.name}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: '800' }}>AI WIN PROBABILITY</span>
                        <div className="h2h-team-chip">
                          <span>{currentHero.awayTeam.name}</span>
                          <TeamLogo team={currentHero.awayTeam.name} size={22} />
                        </div>
                      </div>

                      <div className="ai-prob-track">
                        <div className="ai-prob-seg-home" style={{ width: `${currentHero.prediction.homeWin}%` }} />
                        <div className="ai-prob-seg-draw" style={{ width: `${currentHero.prediction.draw}%` }} />
                        <div className="ai-prob-seg-away" style={{ width: `${currentHero.prediction.awayWin}%` }} />
                      </div>

                      <div className="h2h-legend-row" style={{ marginTop: '8px' }}>
                        <div className="legend-item">
                          <span className="legend-circle legend-blue" />
                          <span>{currentHero.homeTeam.shortName} ({currentHero.prediction.homeWin}%)</span>
                        </div>
                        {currentHero.prediction.draw > 0 && (
                          <div className="legend-item">
                            <span className="legend-circle legend-grey" />
                            <span>Draw ({currentHero.prediction.draw}%)</span>
                          </div>
                        )}
                        <div className="legend-item">
                          <span className="legend-circle legend-red" />
                          <span>{currentHero.awayTeam.shortName} ({currentHero.prediction.awayWin}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Player Spotlight Card */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={18} color="#f59e0b" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Key Player to Watch</span>
                        <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{currentHero.topPerformer}</strong>
                      </div>
                    </div>

                    {/* Interactive 2D Pitch Radar */}
                    <div className="pitch-container" style={{ margin: 0, height: '125px' }}>
                      <div className="pitch-half-line" />
                      <div className="pitch-center-circle" />
                      <div className="pitch-action-pulse" style={{ top: '35%', left: '68%' }}>
                        <div className="pitch-action-ball" />
                      </div>
                      <div className="pitch-label-overlay">
                        <span>{currentHero.homeTeam.name} vs {currentHero.awayTeam.name} • Active Attack Phase</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* League Quick-Filter Pills */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={18} color="#60a5fa" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Browse Fixtures by League</h3>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>All odds updated live</span>
              </div>

              <div className="league-filter-pills">
                <button
                  type="button"
                  className={`league-pill-btn ${selectedLeagueFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedLeagueFilter('all')}
                >
                  <span>⚡</span> All Leagues ({LEAGUE_MATCHES.length})
                </button>
                {LEAGUES_DATA.map(league => (
                  <button
                    key={league.id}
                    type="button"
                    className={`league-pill-btn ${selectedLeagueFilter === league.id ? 'active' : ''}`}
                    onClick={() => setSelectedLeagueFilter(league.id)}
                  >
                    <span>{league.flag}</span> {league.name} ({league.matches.length})
                  </button>
                ))}
              </div>
            </div>

            {/* League-Categorized Fixtures (Champions League under UCL, EPL under EPL, La Liga under La Liga, etc.) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(selectedLeagueFilter === 'all'
                ? LEAGUES_DATA
                : LEAGUES_DATA.filter(l => l.id === selectedLeagueFilter)
              ).map(league => (
                <div key={league.id} className="league-section-card">
                  {/* League Header */}
                  <div className="league-header-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{league.flag}</span>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', margin: 0 }}>{league.name}</h4>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          {league.country} • {league.matches.length} Featured Fixtures
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: '9999px', fontWeight: '800', color: league.badgeColor, border: '1px solid rgba(255,255,255,0.1)' }}>
                      Live Feed
                    </span>
                  </div>

                  {/* Matches inside this League */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {league.matches.map(match => (
                      <div key={match.id} className="desktop-match-item">
                        {/* Home Team with Real Official Logo */}
                        <div className="desktop-team-chip" title={match.homeTeam.name}>
                          <TeamLogo team={match.homeTeam.name} size={32} />
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{match.homeTeam.name}</span>
                        </div>

                        {/* Kickoff / Match Time */}
                        <div className="desktop-match-time-chip">
                          <span className="match-date-str">{match.date}</span>
                          <span className="match-time-str">{match.time}</span>
                          {match.isLive ? (
                            <span className="live-pill-badge" style={{ padding: '2px 8px', fontSize: '0.68rem', marginTop: '3px' }}>
                              <span className="live-pulse-dot" />
                              {match.clock || 'LIVE'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Upcoming</span>
                          )}
                        </div>

                        {/* Away Team with Real Official Logo */}
                        <div className="desktop-team-chip away" title={match.awayTeam.name}>
                          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{match.awayTeam.name}</span>
                          <TeamLogo team={match.awayTeam.name} size={32} />
                        </div>

                        {/* 1X2 Odds Buttons Matrix */}
                        <div className="odds-buttons-grid" style={{ width: '250px' }}>
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
              ))}
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
