import React, { useState } from 'react';
import { X, User, Ticket, CreditCard, Key, LogOut, CheckCircle2, ChevronRight, Shield, Bell, Zap, Database } from 'lucide-react';
import { getOddsApiConfig, saveOddsApiConfig } from '../services/oddsApi';
import { getRedisConfig, saveRedisConfig } from '../services/redisCache';
import { getSupabaseConfig, saveSupabaseConfig } from '../services/supabaseClient';

export const SportsbookMenuModal = ({
  isOpen,
  onClose,
  userProfile,
  onOpenMyBets,
  onOpenDeposit,
  onSignOut,
  onOpenNotifications
}) => {
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => getOddsApiConfig().apiKey || '');
  
  const redisConfig = getRedisConfig();
  const [redisUrlInput, setRedisUrlInput] = useState(redisConfig.url || '');
  const [redisTokenInput, setRedisTokenInput] = useState(redisConfig.token || '');

  const supabaseConfig = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(supabaseConfig.url || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(supabaseConfig.anonKey || '');

  const [apiSaved, setApiSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveAllSettings = (e) => {
    e.preventDefault();
    saveOddsApiConfig({ apiKey: apiKeyInput });
    saveRedisConfig({ url: redisUrlInput, token: redisTokenInput });
    saveSupabaseConfig({ url: supabaseUrlInput, anonKey: supabaseKeyInput });
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2400);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" style={{ maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Sportsbook Account & Settings</h3>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Profile Info */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={userProfile.avatar || '/assets/user.jpg'}
            alt="User Avatar"
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2f68ff' }}
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>{userProfile.name}</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{userProfile.email}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Balance</span>
            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#60a5fa' }}>${userProfile.balance.toLocaleString()}</div>
          </div>
        </div>

        {/* Live Infrastructure Status Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '4px 0' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={15} color="#10b981" />
            <div style={{ fontSize: '0.74rem' }}>
              <strong style={{ color: '#34d399', display: 'block' }}>Upstash Redis</strong>
              <span style={{ color: '#94a3b8' }}>0ms Instant Cache</span>
            </div>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={15} color="#60a5fa" />
            <div style={{ fontSize: '0.74rem' }}>
              <strong style={{ color: '#60a5fa', display: 'block' }}>Supabase DB</strong>
              <span style={{ color: '#94a3b8' }}>Auto Synchronized</span>
            </div>
          </div>
        </div>

        {/* Menu Navigation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="menu-action-item"
            onClick={() => {
              onClose();
              onOpenMyBets();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Ticket size={18} color="#2f68ff" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>My Bets & Cashout History</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <button
            type="button"
            className="menu-action-item"
            onClick={() => {
              onClose();
              onOpenDeposit();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CreditCard size={18} color="#10b981" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Deposit & Wallet Cashier</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <button
            type="button"
            className="menu-action-item"
            onClick={() => {
              onClose();
              onOpenNotifications();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="#f59e0b" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Game Alerts & Notifications</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <button
            type="button"
            className="menu-action-item"
            onClick={() => setShowApiSettings(!showApiSettings)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Key size={18} color="#a855f7" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>API Keys, Redis & DB Settings</span>
            </div>
            <span style={{ fontSize: '0.74rem', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '3px 8px', borderRadius: '9999px', fontWeight: '700' }}>
              All Live
            </span>
          </button>
        </div>

        {/* API, Redis & Supabase Settings Box */}
        {showApiSettings && (
          <form
            onSubmit={handleSaveAllSettings}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Upstash Redis Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#10b981' }}>⚡ Upstash Redis REST URL</span>
                <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Instant Loading</span>
              </div>
              <input
                type="text"
                placeholder="https://your-upstash-redis.upstash.io"
                value={redisUrlInput}
                onChange={(e) => setRedisUrlInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#10b981' }}>⚡ Upstash Redis REST Token</span>
              </div>
              <input
                type="password"
                placeholder="Upstash Redis Bearer Token"
                value={redisTokenInput}
                onChange={(e) => setRedisTokenInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            {/* Supabase Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#38bdf8' }}>🗄️ Supabase Project URL</span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Database Live</span>
              </div>
              <input
                type="text"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#38bdf8' }}>🗄️ Supabase Anon Public Key</span>
              </div>
              <input
                type="password"
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            {/* The Odds API Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#a855f7' }}>📡 The Odds API Key</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>the-odds-api.com</span>
              </div>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-place-bet"
              style={{ padding: '10px', fontSize: '0.85rem', marginTop: '4px' }}
            >
              {apiSaved ? '✓ All Credentials Updated & Synchronized!' : 'Save & Sync Infrastructure'}
            </button>
          </form>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            borderRadius: '14px',
            padding: '14px',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px'
          }}
          onClick={() => {
            onClose();
            onSignOut();
          }}
        >
          <LogOut size={16} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};
