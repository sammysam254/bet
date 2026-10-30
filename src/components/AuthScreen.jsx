import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const AuthScreen = ({ onAuthSuccess, onBack }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('alexander@vertexbet.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Alexander Vance');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: authMode === 'signup' ? (fullName || 'New Player') : 'Alexander Vance',
        email: email,
        avatar: '/assets/user.jpg',
        balance: 1356
      });
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({
        name: 'Alexander Vance',
        email: 'alexander@vertexbet.com',
        avatar: '/assets/user.jpg',
        balance: 1356
      });
    }, 400);
  };

  return (
    <div className="auth-screen-container" id="auth-screen">
      {/* Top Bar with Back Arrow */}
      <div className="auth-top-nav">
        <button
          type="button"
          className="btn-back-header"
          onClick={onBack}
          id="btn-back-to-welcome"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="auth-brand-pill">
          <span style={{ color: '#2f68ff', fontWeight: '900' }}>⚡ VERTEX</span>
        </div>
      </div>

      {/* Promotional Welcome Banner */}
      <div className="auth-bonus-card">
        <div className="bonus-icon-box">
          <Sparkles size={20} color="#f59e0b" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
            Welcome Bonus: $1,356
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            100% matched deposit + 50 free live accumulator bets
          </p>
        </div>
      </div>

      {/* Auth Mode Toggle Tabs (Sign In vs Sign Up) */}
      <div className="auth-mode-switch">
        <button
          type="button"
          className={`auth-mode-tab ${authMode === 'signin' ? 'active' : ''}`}
          onClick={() => setAuthMode('signin')}
          id="tab-auth-signin"
        >
          Sign In
        </button>
        <button
          type="button"
          className={`auth-mode-tab ${authMode === 'signup' ? 'active' : ''}`}
          onClick={() => setAuthMode('signup')}
          id="tab-auth-signup"
        >
          Sign Up
        </button>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="auth-form-fields">
        {authMode === 'signup' && (
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <div className="auth-input-wrapper">
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Alexander Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="auth-input-group">
          <label className="auth-input-label">Email or Mobile</label>
          <div className="auth-input-wrapper">
            <Mail size={18} color="var(--text-muted)" />
            <input
              type="email"
              placeholder="alexander@vertexbet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label className="auth-input-label">Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} color="var(--text-muted)" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn-toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {authMode === 'signin' && (
          <div className="auth-options-row">
            <label className="remember-me-label">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <button type="button" className="btn-forgot-pass">
              Forgot password?
            </button>
          </div>
        )}

        {/* Primary Submit Button */}
        <button
          type="submit"
          className="btn-auth-submit"
          id="btn-auth-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-spinner" />
          ) : (
            <>
              <span>{authMode === 'signin' ? 'Sign In to Account' : 'Create VIP Account'}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>

        {/* Quick 1-Click Demo Login Button */}
        <button
          type="button"
          className="btn-quick-demo"
          id="btn-quick-demo-login"
          onClick={handleQuickDemoLogin}
          disabled={isLoading}
        >
          <CheckCircle size={16} color="#10b981" />
          <span>Instant Demo Sign In ($1,356)</span>
        </button>

        {/* Social Logins */}
        <div className="social-auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-auth-grid">
          <button
            type="button"
            className="social-auth-btn"
            onClick={handleQuickDemoLogin}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="social-auth-btn"
            onClick={handleQuickDemoLogin}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.81 1.02.08 2.05-.51 2.68-1.28z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </form>
    </div>
  );
};
