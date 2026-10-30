import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Trophy, TrendingUp, CheckCircle } from 'lucide-react';
import { AuthScreen } from './AuthScreen';

export const DesktopLanding = ({ onAuthSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="desktop-landing-page" id="desktop-landing-page">
      {/* Desktop Top Navbar */}
      <nav className="desktop-nav-header">
        <div className="desktop-nav-left">
          <div className="brand-badge">
            <div className="brand-icon-box">
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
            </div>
            <div>
              <span style={{ color: '#fff' }}>VERTEX</span>
              <span style={{ color: '#2f68ff', marginLeft: '4px' }}>BET</span>
            </div>
          </div>

          <div className="desktop-nav-links">
            <span className="nav-link active">Sports</span>
            <span className="nav-link">Live In-Play <span className="nav-live-dot" /></span>
            <span className="nav-link">Champions League</span>
            <span className="nav-link">Promotions</span>
            <span className="nav-link">VIP Club</span>
          </div>
        </div>

        <div className="desktop-nav-right">
          <button
            type="button"
            className="btn-desktop-signin"
            onClick={() => setShowAuthModal(true)}
            id="btn-desktop-signin"
          >
            Sign In
          </button>
          <button
            type="button"
            className="btn-desktop-signup"
            onClick={() => setShowAuthModal(true)}
            id="btn-desktop-signup"
          >
            <span>Create Account</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Showcase Section */}
      <section className="desktop-hero-section">
        {/* Left Column: Headline and Call to Actions */}
        <div className="desktop-hero-left">
          <div className="hero-vip-badge">
            <Sparkles size={16} color="#f59e0b" />
            <span>Official Sportsbook & Live Betting Platform</span>
          </div>

          <h1 className="desktop-hero-title">
            YOUR WINNING<br />
            <span className="gradient-text-blue">JOURNEY</span><br />
            STARTS HERE!
          </h1>

          <p className="desktop-hero-subtitle">
            Experience ultra-fast live in-play betting with high-speed odds updates, in-depth match stats, live 2D pitch radar, and instant cashouts.
          </p>

          {/* Quick Bonus Offer & CTA */}
          <div className="desktop-cta-card">
            <div className="cta-bonus-info">
              <div className="bonus-amount-chip">$1,356 BONUS</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff' }}>100% First Deposit Match</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Sign up today and get 50 free accumulator bets</p>
              </div>
            </div>

            <div className="desktop-cta-buttons">
              <button
                type="button"
                className="btn-desktop-cta-primary"
                onClick={() => setShowAuthModal(true)}
                id="btn-desktop-get-started"
              >
                <span>Get started</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="btn-desktop-cta-demo"
                onClick={() =>
                  onAuthSuccess({
                    name: 'Alexander Vance',
                    email: 'alexander@vertexbet.com',
                    avatar: '/assets/user.jpg',
                    balance: 1356
                  })
                }
                id="btn-desktop-demo-login"
              >
                <CheckCircle size={18} color="#10b981" />
                <span>Instant Demo Sign In ($1,356)</span>
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="desktop-trust-badges">
            <div className="trust-item">
              <ShieldCheck size={18} color="#3b82f6" />
              <span>Licensed & Encrypted</span>
            </div>
            <div className="trust-item">
              <Zap size={18} color="#f59e0b" />
              <span>Instant Cashouts</span>
            </div>
            <div className="trust-item">
              <Trophy size={18} color="#10b981" />
              <span>Best Odds Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Exact 3 Tilted Cards Collage from the Design */}
        <div className="desktop-hero-right">
          <div className="desktop-collage-stage">
            {/* Top Card: Messi kissing World Cup Trophy */}
            <div className="hero-tilted-card desktop-card-top">
              <img src="/assets/messi.jpg" alt="Lionel Messi World Cup Trophy" />
              <div className="card-overlay-gradient" />
            </div>

            {/* Middle Card: Zlatan celebration */}
            <div className="hero-tilted-card desktop-card-mid">
              <img src="/assets/zlatan.jpg" alt="Zlatan Ibrahimovic Roar" />
              <div className="card-overlay-gradient" />
            </div>

            {/* Bottom Card: Cristiano Ronaldo celebration */}
            <div className="hero-tilted-card desktop-card-bot">
              <img src="/assets/ronaldo.jpg" alt="Cristiano Ronaldo Flex" />
              <div className="card-overlay-gradient" />
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Desktop Sign In / Sign Up */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div
            className="drawer-sheet"
            style={{ borderRadius: '24px', maxWidth: '420px', margin: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <AuthScreen
              onAuthSuccess={(user) => {
                setShowAuthModal(false);
                onAuthSuccess(user);
              }}
              onBack={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
