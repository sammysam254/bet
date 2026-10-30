import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MyBetsModal = ({
  isOpen,
  onClose,
  activeBets,
  betHistory,
  onCashOutBet,
  onSettleMatchDemo
}) => {
  const [tab, setTab] = useState('open'); // 'open' or 'settled'

  if (!isOpen) return null;

  const handleCashOut = (bet) => {
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      /* ignore */
    }
    onCashOutBet(bet);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" style={{ maxWidth: '480px', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="drawer-title">My Bets & Portfolio</h3>
            {activeBets.length > 0 && (
              <span className="count-badge-bubble" style={{ background: '#2f68ff', color: '#fff' }}>
                {activeBets.length}
              </span>
            )}
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs: Open Bets vs Settled History */}
        <div className="auth-mode-switch" style={{ margin: 0 }}>
          <button
            type="button"
            className={`auth-mode-tab ${tab === 'open' ? 'active' : ''}`}
            onClick={() => setTab('open')}
          >
            Open Bets ({activeBets.length})
          </button>
          <button
            type="button"
            className={`auth-mode-tab ${tab === 'settled' ? 'active' : ''}`}
            onClick={() => setTab('settled')}
          >
            Settled History ({betHistory.length})
          </button>
        </div>

        {/* Tab 1: Open Bets */}
        {tab === 'open' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '180px' }}>
            {activeBets.length === 0 ? (
              <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Clock size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>No Open Bets</h4>
                <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Place a bet on any live match or upcoming fixture to see it here!</p>
              </div>
            ) : (
              activeBets.map(bet => {
                const cashoutValue = (bet.stake * 1.35).toFixed(2);
                return (
                  <div
                    key={bet.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Ticket #{bet.id}</span>
                      <span className="live-pill-badge" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
                        <span className="live-pulse-dot animate-pulse-live" />
                        IN-PLAY
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {bet.picks.map((pick, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                          <span style={{ fontWeight: '700', color: '#fff' }}>{pick.selectionName}</span>
                          <span style={{ color: '#60a5fa', fontWeight: '800' }}>@{pick.odds.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Stake: </span>
                        <span style={{ fontWeight: '800' }}>${bet.stake.toFixed(2)}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Potential Win: </span>
                        <span style={{ fontWeight: '800', color: '#10b981' }}>${bet.payout.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Early Cashout Button */}
                    <button
                      type="button"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#000',
                        fontWeight: '800',
                        fontSize: '0.84rem',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '4px'
                      }}
                      onClick={() => handleCashOut(bet)}
                    >
                      <DollarSign size={16} />
                      <span>Early Cash Out (${cashoutValue})</span>
                    </button>
                  </div>
                );
              })
            )}

            {activeBets.length > 0 && (
              <button
                type="button"
                style={{
                  background: 'rgba(47, 104, 255, 0.12)',
                  border: '1px solid rgba(47, 104, 255, 0.3)',
                  color: '#60a5fa',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  padding: '12px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
                onClick={() => {
                  if (onSettleMatchDemo) {
                    onSettleMatchDemo({ matchId: 'featured-1', winningOutcome: '1', scoreStr: '2 - 1' });
                  }
                }}
              >
                <Clock size={16} />
                <span>Check Odds API / Full-Time Whistle (Chelsea 2 - 1 Man United)</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Settled History */}
        {tab === 'settled' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {betHistory.map(bet => {
              const isWon = bet.status === 'WON';
              const isCashedOut = bet.status === 'CASHED OUT';

              return (
                <div
                  key={bet.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{bet.id} • {bet.timestamp}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: isWon ? 'rgba(16, 185, 129, 0.15)' : isCashedOut ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isWon ? '#10b981' : isCashedOut ? '#f59e0b' : '#ef4444'
                      }}
                    >
                      {bet.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                    <span style={{ fontWeight: '700', color: '#fff' }}>{bet.picks[0]?.selectionName || 'Match Bet'}</span>
                    <span style={{ color: '#60a5fa', fontWeight: '800' }}>@{bet.odds.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Stake: ${bet.stake.toFixed(2)}</span>
                    <span style={{ fontWeight: '800', color: isWon ? '#10b981' : isCashedOut ? '#f59e0b' : 'var(--text-secondary)' }}>
                      {isWon ? `Return: +$${bet.payout.toFixed(2)}` : isCashedOut ? `Cashed Out: +$${bet.payout.toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
