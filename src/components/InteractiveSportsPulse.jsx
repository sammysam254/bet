import React, { useState } from 'react';
import { Activity, Zap, ThumbsUp, TrendingUp, ShieldAlert, Award, CheckCircle, BarChart3, Users } from 'lucide-react';

const INITIAL_POLL = {
  question: '⚽ Who scores the next goal in today’s marquee showdown?',
  totalVotes: 3842,
  options: [
    { id: 'opt-1', label: 'Erling Haaland (Man City)', votes: 1614, pct: 42 },
    { id: 'opt-2', label: 'Kylian Mbappé (Real Madrid)', votes: 1229, pct: 32 },
    { id: 'opt-3', label: 'Bukayo Saka (Arsenal)', votes: 692, pct: 18 },
    { id: 'opt-4', label: 'No More Goals (Defensive Lockout)', votes: 307, pct: 8 }
  ]
};

const STAR_FORM_DATA = [
  { name: 'Erling Haaland', team: 'Man City', role: 'Striker', form: '🔥 8 Goals in 6 Matches', rating: '9.4', status: 'Starting XI' },
  { name: 'Kylian Mbappé', team: 'Real Madrid', role: 'Forward', form: '⚡ 6 Goals, 3 Assists', rating: '9.1', status: 'Starting XI' },
  { name: 'Jude Bellingham', team: 'Real Madrid', role: 'Midfielder', form: '🎯 4 Goals in UCL', rating: '8.9', status: 'Starting XI' },
  { name: 'Bukayo Saka', team: 'Arsenal', role: 'Winger', form: '🪄 5 Assists in EPL', rating: '8.8', status: 'Starting XI' }
];

export const InteractiveSportsPulse = () => {
  const [poll, setPoll] = useState(INITIAL_POLL);
  const [selectedVote, setSelectedVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleCastVote = (optId) => {
    if (hasVoted) return;
    setSelectedVote(optId);
    setHasVoted(true);

    setPoll(prev => {
      const updatedTotal = prev.totalVotes + 1;
      const updatedOpts = prev.options.map(opt => {
        const newVotes = opt.id === optId ? opt.votes + 1 : opt.votes;
        return {
          ...opt,
          votes: newVotes,
          pct: Math.round((newVotes / updatedTotal) * 100)
        };
      });
      return {
        ...prev,
        totalVotes: updatedTotal,
        options: updatedOpts
      };
    });
  };

  return (
    <div className="sports-pulse-container">
      {/* 1. Tactical Intelligence Grid */}
      <div className="pulse-tactical-grid">
        {/* Live Momentum Card */}
        <div className="pulse-card">
          <div className="pulse-card-header">
            <div className="pulse-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h4 className="pulse-card-title">Live In-Play Momentum</h4>
              <span className="pulse-card-sub">Pitch pressure index</span>
            </div>
          </div>

          <div className="momentum-meter-box">
            <div className="momentum-labels">
              <span>Home Dominance 68%</span>
              <span>Away Push 32%</span>
            </div>
            <div className="momentum-track">
              <div className="momentum-bar-home" style={{ width: '68%' }} />
              <div className="momentum-bar-away" style={{ width: '32%' }} />
            </div>
            <p className="momentum-caption">
              ⚡ Real Madrid sustained 7 attack entries into the 18-yard box during the last 10 minutes.
            </p>
          </div>
        </div>

        {/* Sharp Betting Consensus Card */}
        <div className="pulse-card">
          <div className="pulse-card-header">
            <div className="pulse-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Zap size={18} />
            </div>
            <div>
              <h4 className="pulse-card-title">Pro Sharp Consensus</h4>
              <span className="pulse-card-sub">Algorithm & volume flow</span>
            </div>
          </div>

          <div className="sharp-flow-box">
            <div className="sharp-stat-row">
              <span className="sharp-stat-label">High-Stakes Handle:</span>
              <span className="sharp-stat-val">79% on Over 2.5 Goals</span>
            </div>
            <div className="sharp-stat-row">
              <span className="sharp-stat-label">Line Movement:</span>
              <span className="sharp-stat-val" style={{ color: '#60a5fa' }}>Steaming -110 ➔ -145</span>
            </div>
            <div className="sharp-stat-row">
              <span className="sharp-stat-label">AI Win Expectancy:</span>
              <span className="sharp-stat-val" style={{ color: '#10b981' }}>Home 64.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Community Match Poll */}
      <div className="pulse-poll-card">
        <div className="poll-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#f59e0b" />
            <span className="poll-badge">LIVE COMMUNITY POLL</span>
          </div>
          <span className="poll-count-text">
            {poll.totalVotes.toLocaleString()} votes cast
          </span>
        </div>

        <h3 className="poll-question-text">{poll.question}</h3>

        <div className="poll-options-list">
          {poll.options.map(opt => {
            const isChosen = selectedVote === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`poll-option-btn ${isChosen ? 'selected' : ''}`}
                onClick={() => handleCastVote(opt.id)}
                disabled={hasVoted}
              >
                <div
                  className="poll-option-fill"
                  style={{ width: `${opt.pct}%` }}
                />
                <div className="poll-option-content">
                  <div className="poll-option-left">
                    {isChosen ? (
                      <CheckCircle size={16} color="#10b981" />
                    ) : (
                      <span className="poll-circle-radio" />
                    )}
                    <span className="poll-option-label">{opt.label}</span>
                  </div>
                  <span className="poll-option-pct">{opt.pct}%</span>
                </div>
              </button>
            );
          })}
        </div>
        {hasVoted && (
          <div className="poll-thankyou-message">
            <CheckCircle size={14} color="#10b981" />
            <span>Vote counted! Real-time consensus updated across the platform.</span>
          </div>
        )}
      </div>

      {/* 3. Verified Star Player Lineup & Form Table */}
      <div className="pulse-lineup-card">
        <div className="lineup-header">
          <Award size={18} color="#c084fc" />
          <h4 className="lineup-title">Verified Star Players & Form Tracker</h4>
        </div>

        <div className="lineup-players-grid">
          {STAR_FORM_DATA.map((player) => (
            <div key={player.name} className="player-form-item">
              <div className="player-form-top">
                <span className="player-form-name">{player.name}</span>
                <span className="player-form-rating">★ {player.rating}</span>
              </div>
              <div className="player-form-team">{player.team} • {player.role}</div>
              <div className="player-form-meta">
                <span className="player-form-stat">{player.form}</span>
                <span className="player-status-tag">{player.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
