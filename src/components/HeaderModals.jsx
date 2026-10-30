import React, { useState } from 'react';
import { X, Search, Bell, CreditCard, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { LEAGUE_MATCHES, FEATURED_MATCH } from '../data/mockData';
import { TeamLogo } from './TeamLogos';

export const SearchModal = ({ isOpen, onClose, onSelectMatch }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const allMatches = [FEATURED_MATCH, ...LEAGUE_MATCHES];
  const filtered = allMatches.filter(m =>
    m.homeTeam.name.toLowerCase().includes(query.toLowerCase()) ||
    m.awayTeam.name.toLowerCase().includes(query.toLowerCase()) ||
    m.league.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Search Sports & Matches</h3>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '10px 14px', gap: '10px' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search teams (Chelsea, Barca, PSG...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', fontSize: '0.95rem' }}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          {filtered.map(match => (
            <div
              key={match.id}
              onClick={() => {
                onSelectMatch(match);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TeamLogo team={match.homeTeam.name} size={22} />
                <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>{match.homeTeam.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>vs</span>
                <span style={{ fontSize: '0.88rem', fontWeight: '700' }}>{match.awayTeam.name}</span>
                <TeamLogo team={match.awayTeam.name} size={22} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '600' }}>
                {match.isLive ? 'LIVE' : (match.time || 'Upcoming')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: "⚽ GOAL! Chelsea 2 - 1 Man United",
      desc: "I. Mbaye scored in the 22nd minute. Odds updated live!",
      time: "2m ago",
      unread: true
    },
    {
      id: 2,
      title: "🔥 Accumulator Boost Activated!",
      desc: "Get an extra 25% winnings on 4+ leg Champions League parlays.",
      time: "1h ago",
      unread: false
    },
    {
      id: 3,
      title: "💰 Deposit Confirmed",
      desc: "Your wallet was credited with $200.00 instantly.",
      time: "3h ago",
      unread: false
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#60a5fa" />
            <h3 className="drawer-title">Notifications</h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div
              key={n.id}
              style={{
                background: n.unread ? 'rgba(47, 104, 255, 0.08)' : 'rgba(255,255,255,0.04)',
                border: n.unread ? '1px solid rgba(47, 104, 255, 0.3)' : '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>{n.title}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DepositModal = ({ isOpen, onClose, currentBalance, onDepositSuccess }) => {
  const [depositAmount, setDepositAmount] = useState(100);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = () => {
    onDepositSuccess(Number(depositAmount));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="#10b981" />
            <h3 className="drawer-title">Wallet & Deposit</h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={48} color="#10b981" />
            <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Funds Added Successfully!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+${depositAmount} added to your balance.</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Current Balance</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#ffffff' }}>${currentBalance.toLocaleString()}</div>
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '9999px', fontWeight: '700' }}>Verified</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Quick Deposit Amount</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[50, 100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className="stake-chip-btn"
                    style={{
                      background: depositAmount === amt ? '#ffffff' : 'rgba(255,255,255,0.06)',
                      color: depositAmount === amt ? '#000000' : '#ffffff'
                    }}
                    onClick={() => setDepositAmount(amt)}
                  >
                    +${amt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn-place-bet"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginTop: '10px' }}
              onClick={handleDeposit}
            >
              <span>Instant Deposit (${depositAmount})</span>
              <ArrowUpRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
