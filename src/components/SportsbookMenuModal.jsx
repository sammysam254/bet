import React, { useState } from 'react';
import { X, User, Ticket, CreditCard, Key, LogOut, CheckCircle2, ChevronRight, Shield, Bell } from 'lucide-react';
import { getOddsApiConfig, saveOddsApiConfig } from '../services/oddsApi';

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
  const [apiSaved, setApiSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    saveOddsApiConfig({ apiKey: apiKeyInput });
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Sportsbook Account</h3>
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
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Odds API Provider Settings</span>
            </div>
            <span style={{ fontSize: '0.74rem', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '3px 8px', borderRadius: '9999px', fontWeight: '700' }}>
              {getOddsApiConfig().isLiveConnected ? 'Connected' : 'Ready'}
            </span>
          </button>
        </div>

        {/* API & Supabase Settings Accordion Box */}
        {showApiSettings && (
          <form
            onSubmit={handleSaveApiKey}
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
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#60a5fa' }}>The Odds API Key</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>the-odds-api.com</span>
              </div>
              <input
                type="text"
                placeholder="Paste The Odds API Key (e.g. 7f8a9...)"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#34d399' }}>Supabase Project URL</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>supabase.com</span>
              </div>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                defaultValue={localStorage.getItem('vertex_supabase_url') || ''}
                onChange={(e) => localStorage.setItem('vertex_supabase_url', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#34d399' }}>Supabase Anon Public Key</span>
              </div>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                defaultValue={localStorage.getItem('vertex_supabase_anon') || ''}
                onChange={(e) => localStorage.setItem('vertex_supabase_anon', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 12px',
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
              {apiSaved ? 'Connected & Saved Successfully!' : 'Save & Connect Provider Keys'}
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
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '0.9rem',
            marginTop: '8px'
          }}
          onClick={() => {
            onClose();
            onSignOut();
          }}
        >
          <LogOut size={16} />
          <span>Sign Out of Sportsbook</span>
        </button>
      </div>
    </div>
  );
};
