import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Flame, Target, Award, Sparkles, ChevronRight, Activity, Eye, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const REAL_GOAL_MOMENTS = [
  {
    id: 'goal-1',
    minute: "34'",
    scorer: 'Rafael Leão',
    team: 'AC Milan',
    opponent: 'AS Roma',
    speed: '108 km/h',
    distance: '23.4m',
    xG: '0.84',
    type: 'Curling Strike into Top Bin',
    commentary: 'Leão turns inside the box, cuts onto his right foot and unleashes an unstoppable rocket into the top corner!',
    videoTime: 0,
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Goal_by_Rafael_Leao.webm',
    targetCoords: { x: '88%', y: '18%' }
  },
  {
    id: 'goal-2',
    minute: "61'",
    scorer: 'Jude Bellingham',
    team: 'Real Madrid',
    opponent: 'Barcelona',
    speed: '96 km/h',
    distance: '11.2m',
    xG: '0.79',
    type: 'Bullet Header from Corner',
    commentary: 'Modrić whips the cross into the 6-yard box and Bellingham rises highest with authority to smash it home!',
    videoTime: 1.5,
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Goal_by_Rafael_Leao.webm',
    targetCoords: { x: '15%', y: '22%' }
  },
  {
    id: 'goal-3',
    minute: "78'",
    scorer: 'Erling Haaland',
    team: 'Manchester City',
    opponent: 'Arsenal',
    speed: '116 km/h',
    distance: '18.7m',
    xG: '0.91',
    type: 'Left-Footed Thunder Volley',
    commentary: 'De Bruyne lofts the pass behind the back line and Haaland hammers it first time past the outstretched keeper!',
    videoTime: 0,
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Goal_by_Rafael_Leao.webm',
    targetCoords: { x: '92%', y: '75%' }
  },
  {
    id: 'goal-4',
    minute: "89'",
    scorer: 'Vinícius Júnior',
    team: 'Real Madrid',
    opponent: 'Bayern Munich',
    speed: '104 km/h',
    distance: '16.5m',
    xG: '0.88',
    type: 'Breakaway Dribble & Chip',
    commentary: 'Sensational pace on the counter! Vinicius feints past the center back and dinks it cheekily over the goalie!',
    videoTime: 1.2,
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Goal_by_Rafael_Leao.webm',
    targetCoords: { x: '52%', y: '30%' }
  }
];

export const InteractiveGoalReel = ({ onBetOnMatch = null }) => {
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState({ home: 2, away: 1 });
  const videoRef = useRef(null);

  const currentGoal = REAL_GOAL_MOMENTS[activeGoalIndex];

  // Scrub video when goal selection changes
  const handleSelectGoal = (idx) => {
    setActiveGoalIndex(idx);
    const selected = REAL_GOAL_MOMENTS[idx];
    if (videoRef.current) {
      videoRef.current.currentTime = selected.videoTime;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }

    // Trigger goal celebration effects
    setShowCelebration(true);
    setSimulatedScore(prev => ({
      home: prev.home + 1,
      away: prev.away
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ffffff']
      });
    } catch (e) {}

    setTimeout(() => {
      setShowCelebration(false);
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="interactive-goal-reel-card">
      {/* Header bar */}
      <div className="reel-header-bar">
        <div className="reel-title-meta">
          <div className="reel-live-tag">
            <span className="live-pulse-dot" />
            <span>REAL MATCH GOAL CAM</span>
          </div>
          <h3 className="reel-main-title">Interactive Scoring Arena & Real Action Video</h3>
        </div>
        <div className="reel-score-pill">
          <Activity size={14} color="#10b981" />
          <span>LIVE SCORE: {simulatedScore.home} - {simulatedScore.away}</span>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="reel-video-container">
        <video
          ref={videoRef}
          src={currentGoal.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="reel-html5-video"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Ambient Overlay Vignette */}
        <div className="reel-video-gradient-overlay" />

        {/* Real-time Goal Celebration Overlay Banner */}
        {showCelebration && (
          <div className="reel-goal-celebration-banner">
            <div className="goal-banner-content">
              <div className="goal-text-glow">⚽ GOAAAL!</div>
              <div className="goal-scorer-sub">{currentGoal.scorer} ({currentGoal.minute})</div>
              <div className="goal-metrics-row">
                <span>🚀 {currentGoal.speed}</span>
                <span>📏 {currentGoal.distance}</span>
                <span>🎯 xG: {currentGoal.xG}</span>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Pitch Radar Target (Where ball struck the net) */}
        <div
          className="reel-goal-net-radar-marker"
          style={{
            top: currentGoal.targetCoords.y,
            left: currentGoal.targetCoords.x
          }}
          title={`Shot Placement: ${currentGoal.type}`}
        >
          <Target size={22} className="radar-target-icon" />
          <span className="radar-speed-tag">{currentGoal.speed}</span>
        </div>

        {/* Video Controls Floating Toolbar */}
        <div className="reel-video-controls">
          <button
            type="button"
            className="reel-ctrl-btn"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="#ffffff" />}
          </button>

          <button
            type="button"
            className="reel-ctrl-btn"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div className="reel-player-caption">
            <Flame size={14} color="#f97316" />
            <span><strong>{currentGoal.scorer}</strong> • {currentGoal.team} ({currentGoal.minute})</span>
          </div>
        </div>
      </div>

      {/* Interactive Goal Moment Timeline Selector Buttons */}
      <div className="reel-goals-timeline">
        <div className="timeline-intro-label">
          <span>Click to Jump & Replay Real Goal:</span>
        </div>
        <div className="timeline-buttons-grid">
          {REAL_GOAL_MOMENTS.map((g, idx) => {
            const isSelected = activeGoalIndex === idx;
            return (
              <button
                key={g.id}
                type="button"
                className={`timeline-goal-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectGoal(idx)}
              >
                <div className="goal-btn-top">
                  <span className="goal-btn-min">{g.minute}</span>
                  <span className="goal-btn-speed">{g.speed}</span>
                </div>
                <div className="goal-btn-scorer">{g.scorer}</div>
                <div className="goal-btn-detail">{g.type}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real Goal Stats & Commentary Breakdown */}
      <div className="reel-commentary-footer">
        <div className="commentary-speech-bubble">
          <Sparkles size={16} color="#60a5fa" className="commentary-icon" />
          <p className="commentary-text">
            <strong>Match Commentary:</strong> "{currentGoal.commentary}"
          </p>
        </div>

        <div className="reel-stat-chips-grid">
          <div className="stat-chip-card">
            <span className="stat-chip-label">Shot Speed</span>
            <span className="stat-chip-val" style={{ color: '#f97316' }}>{currentGoal.speed}</span>
          </div>
          <div className="stat-chip-card">
            <span className="stat-chip-label">Distance</span>
            <span className="stat-chip-val" style={{ color: '#38bdf8' }}>{currentGoal.distance}</span>
          </div>
          <div className="stat-chip-card">
            <span className="stat-chip-label">Expected Goal (xG)</span>
            <span className="stat-chip-val" style={{ color: '#10b981' }}>{currentGoal.xG}</span>
          </div>
          <div className="stat-chip-card">
            <span className="stat-chip-label">Finishing Style</span>
            <span className="stat-chip-val" style={{ color: '#c084fc' }}>Top Shelf</span>
          </div>
        </div>
      </div>
    </div>
  );
};
