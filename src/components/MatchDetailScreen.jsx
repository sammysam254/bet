import React, { useState } from 'react';
import { ArrowLeft, BarChart2, Star, Send, ThumbsUp } from 'lucide-react';
import { TeamLogo } from './TeamLogos';
import { FEATURED_MATCH } from '../data/mockData';

export const MatchDetailScreen = ({
  match = FEATURED_MATCH,
  onBack,
  betslip,
  onToggleOddSelection
}) => {
  const [activeTab, setActiveTab] = useState('Stats');
  const [isStarred, setIsStarred] = useState(false);
  const [commentsList, setCommentsList] = useState(match.comments || []);
  const [newComment, setNewComment] = useState('');

  const isOddSelected = (outcome) => {
    return betslip.some(item => item.matchId === match.id && item.outcome === outcome);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now(),
      user: 'You',
      time: 'Just now',
      text: newComment.trim(),
      likes: 0
    };
    setCommentsList([commentObj, ...commentsList]);
    setNewComment('');
  };

  const handleLikeComment = (commentId) => {
    setCommentsList(prev =>
      prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
    );
  };

  return (
    <div className="match-details-screen" id="match-details-screen">
      {/* Top Navigation Header */}
      <div className="details-nav-header">
        <button
          type="button"
          className="btn-back-header"
          onClick={onBack}
          id="btn-back-to-home"
        >
          <ArrowLeft size={20} />
          <span>{match.league || 'UEFA Champions League'}</span>
        </button>

        <div className="details-header-icons">
          <button type="button" className="card-icon-action" title="Match Statistics">
            <BarChart2 size={18} />
          </button>
          <button
            type="button"
            className={`card-icon-action ${isStarred ? 'starred' : ''}`}
            onClick={() => setIsStarred(!isStarred)}
            title="Star Favorite"
          >
            <Star size={18} fill={isStarred ? '#f59e0b' : 'none'} />
          </button>
        </div>
      </div>

      {/* Live Match Hero Banner */}
      <div className="match-live-hero-card">
        <div className="hero-live-badge-row">
          <div className="live-pill-badge">
            <span className="live-pulse-dot animate-pulse-live" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Teams and Score Row */}
        <div className="match-teams-combat-row">
          <div className="team-combat-side">
            <TeamLogo team={match.homeTeam.name} size={50} />
            <span>{match.homeTeam.name}</span>
          </div>

          <div className="combat-score-col">
            <div className="combat-score-text">
              {match.homeTeam.score ?? 2} : {match.awayTeam.score ?? 1}
            </div>
            <div className="combat-clock-text">{match.clock || '24:33'}</div>
          </div>

          <div className="team-combat-side">
            <TeamLogo team={match.awayTeam.name} size={50} />
            <span>{match.awayTeam.name}</span>
          </div>
        </div>

        {/* Events / Goalscorers List */}
        <div className="match-events-timeline">
          <div className="events-home-list">
            <div>O. Watkins 11'</div>
            <div>O. Watkins 15'</div>
          </div>

          <div className="events-ball-icon">⚽</div>

          <div className="events-away-list">
            <div>22' I. Mbaye</div>
          </div>
        </div>

        {/* Quick Odds Selection Row */}
        <div className="odds-buttons-grid">
          <button
            type="button"
            className={`odds-pill-btn ${isOddSelected('1') ? 'selected' : ''}`}
            onClick={() =>
              onToggleOddSelection({
                matchId: match.id,
                matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                outcome: '1',
                selectionName: `${match.homeTeam.name} to Win`,
                odds: match.odds?.home || 1.84
              })
            }
          >
            <span className="odds-label">1</span>
            <span className="odds-val">{(match.odds?.home || 1.84).toFixed(2)}</span>
          </button>

          <button
            type="button"
            className={`odds-pill-btn ${isOddSelected('X') ? 'selected' : ''}`}
            onClick={() =>
              onToggleOddSelection({
                matchId: match.id,
                matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                outcome: 'X',
                selectionName: 'Draw',
                odds: match.odds?.draw || 4.20
              })
            }
          >
            <span className="odds-label">X</span>
            <span className="odds-val">{(match.odds?.draw || 4.20).toFixed(2)}</span>
          </button>

          <button
            type="button"
            className={`odds-pill-btn ${isOddSelected('2') ? 'selected' : ''}`}
            onClick={() =>
              onToggleOddSelection({
                matchId: match.id,
                matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                outcome: '2',
                selectionName: `${match.awayTeam.name} to Win`,
                odds: match.odds?.away || 3.74
              })
            }
          >
            <span className="odds-label">2</span>
            <span className="odds-val">{(match.odds?.away || 3.74).toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation: Preview | Stats | Broadcast | Comments */}
      <div className="match-tabs-bar">
        {['Preview', 'Stats', 'Broadcast', 'Comments'].map(tab => (
          <button
            key={tab}
            type="button"
            className={`match-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: STATS CONTENT (Exact replica of Screen 3) */}
      {activeTab === 'Stats' && (
        <div className="tab-stats-container">
          {/* Head to Head & Win Probability */}
          <div className="h2h-probability-card">
            <div className="h2h-teams-header">
              <div className="h2h-team-chip">
                <TeamLogo team={match.homeTeam.name} size={22} />
                <span>{match.homeTeam.name}</span>
              </div>
              <div className="h2h-team-chip">
                <span>{match.awayTeam.name}</span>
                <TeamLogo team={match.awayTeam.name} size={22} />
              </div>
            </div>

            {/* 3-Segment Progress Bar */}
            <div className="h2h-segmented-bar">
              <div className="segment-chelsea" style={{ width: '46.67%' }}>
                46.67%
              </div>
              <div className="segment-draw" style={{ width: '20%' }}>
                20%
              </div>
              <div className="segment-manutd" style={{ width: '33.33%' }}>
                33.33%
              </div>
            </div>

            {/* Legend row */}
            <div className="h2h-legend-row">
              <div className="legend-item">
                <span className="legend-circle legend-blue" />
                <span>7 Wins</span>
              </div>
              <div className="legend-item">
                <span className="legend-circle legend-grey" />
                <span>3 Draws</span>
              </div>
              <div className="legend-item">
                <span className="legend-circle legend-red" />
                <span>5 Wins</span>
              </div>
            </div>
          </div>

          {/* Detailed In-Play Match Stats Card with subtle team crest watermarks */}
          <div className="inplay-stats-card">
            {/* Crest Watermarks */}
            <div className="watermark-crest-left">
              <TeamLogo team={match.homeTeam.name} size={140} />
            </div>
            <div className="watermark-crest-right">
              <TeamLogo team={match.awayTeam.name} size={140} />
            </div>

            {/* Attacks */}
            <div className="stat-row-item">
              <span className="stat-num-home">{match.stats?.attacks?.home || 56}</span>
              <span className="stat-label-center">Attacks</span>
              <span className="stat-num-away highlight-red">
                <span className="arrow-up-red">↑</span>{match.stats?.attacks?.away || 75}
              </span>
            </div>

            {/* Dangers */}
            <div className="stat-row-item">
              <span className="stat-num-home highlight-blue">
                {match.stats?.dangers?.home || 25}<span className="arrow-up-blue">↑</span>
              </span>
              <span className="stat-label-center">Dangers</span>
              <span className="stat-num-away">{match.stats?.dangers?.away || 21}</span>
            </div>

            {/* Saves */}
            <div className="stat-row-item">
              <span className="stat-num-home">{match.stats?.saves?.home || 16}</span>
              <span className="stat-label-center">Saves</span>
              <span className="stat-num-away">{match.stats?.saves?.away || 16}</span>
            </div>

            {/* Shots */}
            <div className="stat-row-item">
              <span className="stat-num-home">{match.stats?.shots?.home || 25}</span>
              <span className="stat-label-center">Shots</span>
              <span className="stat-num-away highlight-red">
                <span className="arrow-up-red">↑</span>{match.stats?.shots?.away || 28}
              </span>
            </div>

            {/* OnTarget */}
            <div className="stat-row-item">
              <span className="stat-num-home highlight-blue">
                {match.stats?.onTarget?.home || 7}<span className="arrow-up-blue">↑</span>
              </span>
              <span className="stat-label-center">OnTarget</span>
              <span className="stat-num-away">{match.stats?.onTarget?.away || 6}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BROADCAST CONTENT (Live 2D Pitch Radar & Commentary Feed) */}
      {activeTab === 'Broadcast' && (
        <div className="tab-broadcast-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="pitch-container">
            <div className="pitch-half-line" />
            <div className="pitch-center-circle" />
            <div className="pitch-box-left" />
            <div className="pitch-box-right" />

            {/* Live animated ball in attack zone */}
            <div className="pitch-action-pulse" style={{ top: '35%', left: '68%' }}>
              <div className="pitch-action-ball" />
            </div>

            <div className="pitch-label-overlay">
              <span>Dangerous Attack: Man United</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '10px', color: '#60a5fa' }}>Live Match Commentary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(match.commentary || []).map((comm, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', lineHeight: '1.4' }}>
                  <span style={{ fontWeight: '800', color: '#ff453a' }}>{comm.time}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{comm.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PREVIEW CONTENT (Lineups & Formations) */}
      {activeTab === 'Preview' && (
        <div className="tab-preview-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '12px' }}>Confirmed Starting Lineups</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <TeamLogo team={match.homeTeam.name} size={18} />
                  <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{match.homeTeam.name} (4-3-3)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(match.lineups?.home?.players || []).map((p, i) => (
                    <div key={i}>• {p}</div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <TeamLogo team={match.awayTeam.name} size={18} />
                  <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{match.awayTeam.name} (4-2-3-1)</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(match.lineups?.away?.players || []).map((p, i) => (
                    <div key={i}>• {p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '14px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Venue</span>
              <span style={{ fontWeight: '700' }}>Stamford Bridge, London</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Referee</span>
              <span style={{ fontWeight: '700' }}>Szymon Marciniak</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Weather</span>
              <span style={{ fontWeight: '700' }}>14°C, Clear Night</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMENTS CONTENT (Live Fan Chat) */}
      {activeTab === 'Comments' && (
        <div className="tab-comments-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Post Comment Input */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Join live fan banter..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#2f68ff',
                color: '#ffffff',
                padding: '0 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>

          {/* Comment list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {commentsList.map(c => (
              <div
                key={c.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.84rem', color: '#60a5fa' }}>{c.user}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.time}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{c.text}</p>
                <button
                  type="button"
                  onClick={() => handleLikeComment(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <ThumbsUp size={13} />
                  <span>{c.likes}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
