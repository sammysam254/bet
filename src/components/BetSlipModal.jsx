import React, { useState } from 'react';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BetSlipModal = ({
  isOpen,
  onClose,
  betslip,
  onRemovePick,
  onClearAll,
  userBalance,
  onPlaceBetSuccess
}) => {
  const [stake, setStake] = useState(25);
  const [betType, setBetType] = useState('single'); // 'single' or 'multi'
  const [placedReceipt, setPlacedReceipt] = useState(null);

  if (!isOpen) return null;

  const totalOdds = betslip.reduce((acc, item) => {
    return betType === 'multi' ? acc * item.odds : Math.max(acc, item.odds);
  }, 1);

  const potentialPayout = (stake * (betslip.length > 0 ? (betType === 'multi' ? totalOdds : (betslip[0]?.odds || 1)) : 0)).toFixed(2);

  const handleQuickStake = (amount) => {
    if (amount === 'max') {
      setStake(userBalance);
    } else {
      setStake(prev => Number(prev || 0) + amount);
    }
  };

  const handlePlaceBet = () => {
    if (stake <= 0 || stake > userBalance || betslip.length === 0) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }

    const receipt = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString(),
      stake: Number(stake),
      odds: Number(totalOdds.toFixed(2)),
      payout: Number(potentialPayout),
      picks: [...betslip]
    };

    setPlacedReceipt(receipt);
    onClearAll(); // Auto-clear the slip immediately upon placing bet
    onPlaceBetSuccess(Number(stake), receipt);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="drawer-title">Bet Slip</h3>
            {betslip.length > 0 && (
              <span className="count-badge-bubble" style={{ background: '#2f68ff', color: '#fff' }}>
                {betslip.length}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {betslip.length > 0 && (
              <button
                type="button"
                className="btn-remove-pick"
                onClick={onClearAll}
                title="Clear all selections"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {placedReceipt ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '20px 0', textAlign: 'center' }}>
            <CheckCircle2 size={54} color="#10b981" />
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>Bet Placed & Slip Auto-Cleared!</h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              Ticket #{placedReceipt.id} • Active in My Bets (Checking Odds API for settlement)
            </p>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Stake:</span>
                <span style={{ fontWeight: '800' }}>${placedReceipt.stake.toFixed(2)} (Deducted)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Odds:</span>
                <span style={{ fontWeight: '800', color: '#60a5fa' }}>{placedReceipt.odds}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Potential Win:</span>
                <span style={{ fontWeight: '800', color: '#10b981' }}>${placedReceipt.payout.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-place-bet"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => {
                setPlacedReceipt(null);
                onClose();
              }}
            >
              Done & Continue Betting
            </button>
          </div>
        ) : betslip.length === 0 ? (
          <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2.5rem' }}>🎟️</span>
            <p style={{ fontWeight: '700', color: '#fff' }}>Your slip is empty</p>
            <p style={{ fontSize: '0.85rem' }}>Click on any match odds (1, X, 2) to add selections instantly!</p>
          </div>
        ) : (
          <>
            {/* Bet Mode Selector: Single vs Accumulator */}
            {betslip.length > 1 && (
              <div className="view-mode-tabs" style={{ width: '100%' }}>
                <button
                  type="button"
                  className={`view-mode-btn ${betType === 'single' ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setBetType('single')}
                >
                  Single
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${betType === 'multi' ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setBetType('multi')}
                >
                  Accumulator ({betslip.length}x)
                </button>
              </div>
            )}

            {/* List of Picks */}
            <div className="betslip-picks-list">
              {betslip.map(pick => (
                <div key={`${pick.matchId}-${pick.outcome}`} className="betslip-pick-card">
                  <div className="pick-meta">
                    <span className="pick-match-title">{pick.matchTitle}</span>
                    <span className="pick-outcome">{pick.selectionName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="pick-odds-val">{pick.odds.toFixed(2)}</span>
                    <button
                      type="button"
                      className="btn-remove-pick"
                      onClick={() => onRemovePick(pick.matchId, pick.outcome)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stake Preset Buttons */}
            <div className="quick-stakes-row">
              {[5, 10, 25, 50].map(amt => (
                <button
                  key={amt}
                  type="button"
                  className="stake-chip-btn"
                  onClick={() => handleQuickStake(amt)}
                >
                  +${amt}
                </button>
              ))}
              <button
                type="button"
                className="stake-chip-btn"
                onClick={() => handleQuickStake('max')}
              >
                Max
              </button>
            </div>

            {/* Stake Input */}
            <div className="stake-input-box">
              <span>$</span>
              <input
                type="number"
                min="1"
                max={userBalance}
                value={stake}
                onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
                placeholder="Stake amount"
              />
            </div>

            {/* Payout Calculation */}
            <div className="payout-calculation-row">
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Total Odds: {totalOdds.toFixed(2)}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffffff' }}>Potential Payout:</div>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#10b981' }}>
                ${potentialPayout}
              </div>
            </div>

            {/* Place Bet Button */}
            <button
              type="button"
              className="btn-place-bet"
              id="btn-confirm-place-bet"
              disabled={stake <= 0 || stake > userBalance || betslip.length === 0}
              onClick={handlePlaceBet}
            >
              <span>Place Bet (${Number(stake).toFixed(2)})</span>
            </button>

            {stake > userBalance && (
              <span style={{ color: '#ff453a', fontSize: '0.78rem', textAlign: 'center' }}>
                Insufficient balance. Current balance is ${userBalance.toLocaleString()}.
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
