import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { signInUser, signUpUser } from '../services/supabaseClient';

export const AuthScreen = ({ onAuthSuccess, onBack }) => {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        if (!password || password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const data = await signUpUser({
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim()
        });

        if (data?.session) {
          onAuthSuccess({
            id: data.user.id,
            name: fullName.trim() || email.split('@')[0],
            email: email.trim(),
            avatar: '/assets/user.jpg',
            balance: 1356
          });
        } else {
          // Email confirmation or direct user
          setSuccessNotice('Account created successfully! Signing you in...');
          setTimeout(async () => {
            try {
              const res = await signInUser({ email: email.trim(), password: password.trim() });
              onAuthSuccess(res.profile);
            } catch (err) {
              setErrorMessage(err.message || 'Please verify your email or sign in.');
            }
          }, 1200);
        }
      } else {
        // Sign In
        const res = await signInUser({
          email: email.trim(),
          password: password.trim()
        });
        onAuthSuccess(res.profile);
      }
    } catch (err) {
      console.warn('Supabase Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check credentials.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please try again or create an account.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick One-Click Access for Instant Testing
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Try real sign in with demo player
      const demoEmail = 'alexander@vertexbet.com';
      const demoPass = 'Vertex@Bet2026';
      try {
        const res = await signInUser({ email: demoEmail, password: demoPass });
        onAuthSuccess(res.profile);
        return;
      } catch (_) {
        // Try to create demo account in Supabase
        try {
          await signUpUser({ email: demoEmail, password: demoPass, fullName: 'Alexander Vance' });
          const res = await signInUser({ email: demoEmail, password: demoPass });
          onAuthSuccess(res.profile);
          return;
        } catch (_) {}
      }

      onAuthSuccess({
        name: 'Alexander Vance',
        email: 'alexander@vertexbet.com',
        avatar: '/assets/user.jpg',
        balance: 1356
      });
    } finally {
      setIsLoading(false);
    }
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
          <span style={{ color: '#2f68ff', fontWeight: '900' }}>⚡ VERTEX BET</span>
        </div>
      </div>

      {/* Promotional Welcome Banner */}
      <div className="auth-bonus-card">
        <div className="bonus-icon-box">
          <Sparkles size={20} color="#f59e0b" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
            Live Supabase Authentication
          </h4>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            $1,356 instant signup bonus credited to your live database wallet
          </p>
        </div>
      </div>

      {/* Auth Mode Toggle Tabs (Sign In vs Sign Up) */}
      <div className="auth-mode-switch">
        <button
          type="button"
          className={`auth-mode-tab ${authMode === 'signin' ? 'active' : ''}`}
          onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
          id="tab-auth-signin"
        >
          Sign In
        </button>
        <button
          type="button"
          className={`auth-mode-tab ${authMode === 'signup' ? 'active' : ''}`}
          onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
          id="tab-auth-signup"
        >
          Create Account
        </button>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <AlertCircle size={16} flexShrink={0} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Notice Box */}
      {successNotice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <CheckCircle size={16} flexShrink={0} />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Real Supabase Auth Form */}
      <form onSubmit={handleSubmit} className="auth-form-fields">
        {authMode === 'signup' && (
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <div className="auth-input-wrapper">
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="e.g. Alexander Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="auth-input-group">
          <label className="auth-input-label">Email Address</label>
          <div className="auth-input-wrapper">
            <Mail size={18} color="var(--text-muted)" />
            <input
              type="email"
              placeholder="name@email.com"
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
              placeholder="Minimum 6 characters"
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
              <span>{authMode === 'signin' ? 'Sign In to Supabase' : 'Create Supabase Account'}</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>

        {/* Quick Demo Sign In */}
        <button
          type="button"
          className="btn-quick-demo"
          id="btn-quick-demo-login"
          onClick={handleQuickDemoLogin}
          disabled={isLoading}
        >
          <CheckCircle size={16} color="#10b981" />
          <span>Quick 1-Click Access ($1,356 Balance)</span>
        </button>
      </form>
    </div>
  );
};
