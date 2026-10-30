import React from 'react';
import { X, Ticket, CreditCard, LogOut, ChevronRight, Shield, Bell, Trophy, ArrowUpRight, ArrowDownLeft, Lock } from 'lucide-react';

export const SportsbookMenuModal = ({
  isOpen,
  onClose,
  userProfile,
  onOpenMyBets,
  onOpenDeposit,
  onSignOut,
  onOpenNotifications
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Sportsbook Account</h3>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* User Profile Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(47, 104, 255, 0.12), rgba(30, 41, 59, 0.6))', border: '1px solid rgba(47, 104, 255, 0.3)', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={userProfile.avatar || '/assets/user.jpg'}
              alt="User Avatar"
              style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #2f68ff' }}
            />
            <div style={{ position: 'absolute', bottom: '0', right: '0', width: '13px', height: '13px', borderRadius: '50%', background: '#10b981', border: '2px solid #0f172a' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>{userProfile.name}</h4>
              <span style={{ fontSize: '0.65rem', background: '#e0b115', color: '#000', fontWeight: '900', padding: '1px 6px', borderRadius: '9999px' }}>VIP 3</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{userProfile.email}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Available</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#60a5fa' }}>${userProfile.balance.toLocaleString()}</div>
          </div>
        </div>

        {/* Quick Cashier Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
          <button
            type="button"
            className="btn-place-bet"
            style={{ padding: '10px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => {
              onClose();
              onOpenDeposit();
            }}
          >
            <ArrowUpRight size={16} />
            Deposit Funds
          </button>
          <button
            type="button"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              borderRadius: '12px',
              padding: '10px 14px',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            onClick={() => {
              onClose();
              onOpenDeposit();
            }}
          >
            <ArrowDownLeft size={16} />
            Withdraw
          </button>
        </div>

        {/* User Betting Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Win Rate</span>
            <strong style={{ fontSize: '0.95rem', color: '#10b981', fontWeight: '800' }}>68.4%</strong>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Open Bets</span>
            <strong style={{ fontSize: '0.95rem', color: '#60a5fa', fontWeight: '800' }}>2 Active</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Reward Pts</span>
            <strong style={{ fontSize: '0.95rem', color: '#e0b115', fontWeight: '800' }}>1,840 pts</strong>
          </div>
        </div>

        {/* Navigation Actions */}
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
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>My Bets & Settlement History</span>
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
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Match Alerts & Odds Boosts</span>
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
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Payment Methods & Wallet</span>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <div className="menu-action-item" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={18} color="#60a5fa" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Responsible Gaming & Limits</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>Active</span>
          </div>

          <div className="menu-action-item" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={18} color="#a855f7" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Account Security & 2FA</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>Protected</span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            borderRadius: '14px',
            padding: '13px',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px'
          }}
          onClick={() => {
            onClose();
            onSignOut();
          }}
        >
          <LogOut size={16} />
          Sign Out of Account
        </button>

        {/* Trust Badges */}
        <div style={{ textAlign: 'center', paddingTop: '4px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            256-Bit SSL Encrypted • Licensed Sportsbook 18+
          </span>
        </div>
      </div>
    </div>
  );
};
