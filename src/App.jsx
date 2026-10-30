import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { MatchDetailScreen } from './components/MatchDetailScreen';
import { BetSlipModal } from './components/BetSlipModal';
import { SearchModal, NotificationModal, DepositModal } from './components/HeaderModals';
import { MyBetsModal } from './components/MyBetsModal';
import { SportsbookMenuModal } from './components/SportsbookMenuModal';
import { DesktopLanding } from './components/DesktopLanding';
import { DesktopSportsbookView } from './components/DesktopSportsbookView';
import { FEATURED_MATCH, INITIAL_BET_HISTORY } from './data/mockData';
import { syncBetToSupabase, syncUserBalanceToSupabase, signOutUser } from './services/supabaseClient';
import { checkBetSettlements } from './services/oddsApi';
import confetti from 'canvas-confetti';

// Custom hook to detect mobile vs desktop screens automatically
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export function App() {
  const isMobile = useIsMobile();

  // Authentication & User State (with localStorage persistence)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vertex_auth') === 'true';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('vertex_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      name: 'Alexander Vance',
      email: 'alexander@vertexbet.com',
      avatar: '/assets/user.jpg',
      balance: 1356
    };
  });

  // Betting & Wallet History State
  const [activeBets, setActiveBets] = useState(() => {
    const saved = localStorage.getItem('vertex_active_bets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const [betHistory, setBetHistory] = useState(() => {
    const saved = localStorage.getItem('vertex_bet_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BET_HISTORY;
  });

  // Mobile navigation state: 'welcome', 'auth', 'home', 'details'
  const [activeMobileScreen, setActiveMobileScreen] = useState(() => {
    return localStorage.getItem('vertex_auth') === 'true' ? 'home' : 'welcome';
  });
  const [transitionDirection, setTransitionDirection] = useState('enter');

  const [selectedMatch, setSelectedMatch] = useState(FEATURED_MATCH);
  const [activeDockTab, setActiveDockTab] = useState('home');
  const [betslip, setBetslip] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isMyBetsOpen, setIsMyBetsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('vertex_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('vertex_user', JSON.stringify(userProfile));
    localStorage.setItem('vertex_active_bets', JSON.stringify(activeBets));
    localStorage.setItem('vertex_bet_history', JSON.stringify(betHistory));
  }, [isAuthenticated, userProfile, activeBets, betHistory]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUserProfile(prev => ({ ...prev, ...userData }));
    setTransitionDirection('enter');
    setActiveMobileScreen('home');
    showToast(`Welcome back, ${userData.name}! $${userData.balance.toLocaleString()} ready to bet.`);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Sign out:', e);
    }
    setIsAuthenticated(false);
    setTransitionDirection('slide-left');
    setActiveMobileScreen('welcome');
    localStorage.removeItem('vertex_auth');
    localStorage.removeItem('vertex_user');
    showToast('Signed out successfully.');
  };

  // Screen Navigation Handlers
  const handleGetStarted = () => {
    setTransitionDirection('slide-right');
    setActiveMobileScreen('auth');
  };

  const handleOpenMatchDetails = (match) => {
    setSelectedMatch(match || FEATURED_MATCH);
    setTransitionDirection('slide-right');
    setActiveMobileScreen('details');
  };

  const handleBackToHome = () => {
    setTransitionDirection('slide-left');
    setActiveMobileScreen('home');
  };

  // Odds & Bet Slip Handlers
  const handleToggleOddSelection = (selection) => {
    setBetslip(prev => {
      const exists = prev.some(
        item => item.matchId === selection.matchId && item.outcome === selection.outcome
      );
      if (exists) {
        showToast('Removed from Bet Slip');
        return prev.filter(
          item => !(item.matchId === selection.matchId && item.outcome === selection.outcome)
        );
      } else {
        showToast(`Added ${selection.selectionName} (${selection.odds}) to Slip`);
        return [...prev, selection];
      }
    });
  };

  const handleRemovePick = (matchId, outcome) => {
    setBetslip(prev => prev.filter(p => !(p.matchId === matchId && p.outcome === outcome)));
  };

  const handleClearAllPicks = () => {
    setBetslip([]);
  };

  // Real Bet Placement with Wallet Deduction, Auto Slip Clear, and Supabase Sync
  const handlePlaceBetSuccess = (stakeAmount, receipt) => {
    const newBalance = Math.max(0, userProfile.balance - stakeAmount);
    setUserProfile(prev => ({
      ...prev,
      balance: newBalance
    }));

    const newOpenBet = {
      ...receipt,
      status: 'OPEN'
    };

    setActiveBets(prev => [newOpenBet, ...prev]);
    setBetslip([]); // Auto clear slip immediately

    // Sync to Supabase in background
    syncBetToSupabase(newOpenBet, userProfile.email);
    syncUserBalanceToSupabase(userProfile.email, newBalance);

    showToast(`Bet placed! $${stakeAmount.toFixed(2)} deducted. Slip cleared.`);
  };

  // Automated Bet Settlement Handler (Checks Odds API Scores & Credits Wallet Immediately)
  const handleSettleMatch = async (settlementInfo = null, preSettledResults = null) => {
    if (activeBets.length === 0) {
      if (settlementInfo) showToast('No open bets to settle right now.');
      return;
    }

    const settledList = preSettledResults || await checkBetSettlements(activeBets, settlementInfo);

    if (settledList.length === 0) {
      if (settlementInfo) showToast('Checked Odds API: No finished matches found yet.');
      return;
    }

    let totalWinnings = 0;
    const settledBetIds = settledList.map(s => s.betId);

    settledList.forEach(item => {
      if (item.status === 'WON') {
        totalWinnings += item.payout;
      }
    });

    if (totalWinnings > 0) {
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch (e) { /* ignore */ }

      const updatedBalance = userProfile.balance + totalWinnings;
      setUserProfile(prev => ({
        ...prev,
        balance: updatedBalance
      }));

      // Sync wallet update to Supabase
      syncUserBalanceToSupabase(userProfile.email, updatedBalance);
      showToast(`🏆 Match Finished! Bet WON: +$${totalWinnings.toFixed(2)} credited to your wallet!`);
    } else {
      showToast('Match finished. Bet settled as LOST.');
    }

    // Move settled bets from activeBets to betHistory
    setActiveBets(prev => prev.filter(b => !settledBetIds.includes(b.id)));
    setBetHistory(prev => [
      ...settledList.map(s => ({
        id: s.betId,
        timestamp: s.settledAt,
        status: s.status,
        stake: s.stake,
        odds: s.payout ? (s.payout / s.stake).toFixed(2) : 1.84,
        payout: s.payout,
        picks: [{ selectionName: `${s.selectionName} (${s.finalScore || 'FT'})`, odds: s.payout ? (s.payout / s.stake) : 1.84 }]
      })),
      ...prev
    ]);
  };

  // System automated Odds API settlement check (Continuous 1-second interval)
  useEffect(() => {
    if (activeBets.length === 0) return;
    const interval = setInterval(async () => {
      const results = await checkBetSettlements(activeBets);
      if (results && results.length > 0) {
        handleSettleMatch(null, results);
      }
    }, 1000); // System checks every second for completed matches!
    return () => clearInterval(interval);
  }, [activeBets, userProfile.balance]);

  // Early Cashout Handler
  const handleCashOutBet = (bet) => {
    const cashoutAmount = Number((bet.stake * 1.35).toFixed(2));
    const newBalance = userProfile.balance + cashoutAmount;

    // Credit balance & sync to Supabase
    setUserProfile(prev => ({
      ...prev,
      balance: newBalance
    }));
    syncUserBalanceToSupabase(userProfile.email, newBalance);

    // Remove from active bets and add to settled history
    setActiveBets(prev => prev.filter(b => b.id !== bet.id));
    setBetHistory(prev => [
      {
        ...bet,
        status: 'CASHED OUT',
        payout: cashoutAmount,
        timestamp: 'Just now'
      },
      ...prev
    ]);

    showToast(`Cashed out! +$${cashoutAmount.toFixed(2)} added to balance.`);
  };

  const handleDepositSuccess = (amount) => {
    const newBal = userProfile.balance + amount;
    setUserProfile(prev => ({
      ...prev,
      balance: newBal
    }));
    syncUserBalanceToSupabase(userProfile.email, newBal);
    showToast(`+$${amount} deposited to balance!`);
  };

  // Screen animation class helper
  const getScreenAnimationClass = () => {
    if (transitionDirection === 'slide-right') return 'screen-slide-right';
    if (transitionDirection === 'slide-left') return 'screen-slide-left';
    return 'screen-transition-enter';
  };

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <Zap size={16} color="#60a5fa" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. MOBILE EXPERIENCE (Phones & Screens <= 900px)           */}
      {/* ========================================================= */}
      {isMobile ? (
        <div className="mobile-app-viewport">
          {/* Welcome Screen (First screen when user opens site) */}
          {!isAuthenticated && activeMobileScreen === 'welcome' && (
            <div className={getScreenAnimationClass()}>
              <WelcomeScreen onGetStarted={handleGetStarted} />
            </div>
          )}

          {/* Auth Screen (Triggered by 'Get started') */}
          {!isAuthenticated && activeMobileScreen === 'auth' && (
            <div className={getScreenAnimationClass()}>
              <AuthScreen
                onAuthSuccess={handleAuthSuccess}
                onBack={() => {
                  setTransitionDirection('slide-left');
                  setActiveMobileScreen('welcome');
                }}
              />
            </div>
          )}

          {/* Home Dashboard Screen (Shown once authenticated) */}
          {isAuthenticated && activeMobileScreen === 'home' && (
            <div className={getScreenAnimationClass()}>
              <HomeScreen
                userBalance={userProfile.balance}
                onOpenMatchDetails={handleOpenMatchDetails}
                onOpenBetSlip={() => setIsBetSlipOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenNotifications={() => setIsNotifOpen(true)}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenMenu={() => setIsMenuOpen(true)}
                onOpenMyBets={() => setIsMyBetsOpen(true)}
                onSignOut={handleSignOut}
                betslip={betslip}
                onToggleOddSelection={handleToggleOddSelection}
                activeTab={activeDockTab}
                setActiveTab={(tab) => {
                  if (tab === 'home') setActiveMobileScreen('home');
                  if (tab === 'mybets') setIsMyBetsOpen(true);
                  if (tab === 'betslip') setIsBetSlipOpen(true);
                  if (tab === 'search') setIsSearchOpen(true);
                  if (tab === 'menu') setIsMenuOpen(true);
                  setActiveDockTab(tab);
                }}
              />
            </div>
          )}

          {/* Match Details & Live Stats Screen */}
          {isAuthenticated && activeMobileScreen === 'details' && (
            <div className={getScreenAnimationClass()}>
              <MatchDetailScreen
                match={selectedMatch}
                onBack={handleBackToHome}
                betslip={betslip}
                onToggleOddSelection={handleToggleOddSelection}
              />
            </div>
          )}
        </div>
      ) : (
        /* ========================================================= */
        /* 2. DESKTOP EXPERIENCE (Screens > 900px)                   */
        /* ========================================================= */
        isAuthenticated ? (
          <DesktopSportsbookView
            userBalance={userProfile.balance}
            onOpenDeposit={() => setIsDepositOpen(true)}
            onOpenNotifications={() => setIsNotifOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onSignOut={handleSignOut}
            betslip={betslip}
            onToggleOddSelection={handleToggleOddSelection}
            onOpenMatchDetails={handleOpenMatchDetails}
            onOpenApiSettings={() => setIsMenuOpen(true)}
            activeBets={activeBets}
            betHistory={betHistory}
            onPlaceBetSuccess={handlePlaceBetSuccess}
            onCashOutBet={handleCashOutBet}
            onClearAllPicks={handleClearAllPicks}
            onSettleMatchDemo={handleSettleMatch}
          />
        ) : (
          <DesktopLanding onAuthSuccess={handleAuthSuccess} />
        )
      )}

      {/* Global Interactive Modals (Shared across mobile & desktop) */}
      <BetSlipModal
        isOpen={isBetSlipOpen}
        onClose={() => setIsBetSlipOpen(false)}
        betslip={betslip}
        onRemovePick={handleRemovePick}
        onClearAll={handleClearAllPicks}
        userBalance={userProfile.balance}
        onPlaceBetSuccess={handlePlaceBetSuccess}
      />

      <MyBetsModal
        isOpen={isMyBetsOpen}
        onClose={() => setIsMyBetsOpen(false)}
        activeBets={activeBets}
        betHistory={betHistory}
        onCashOutBet={handleCashOutBet}
        onSettleMatchDemo={handleSettleMatch}
      />

      <SportsbookMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userProfile={userProfile}
        onOpenMyBets={() => setIsMyBetsOpen(true)}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onSignOut={handleSignOut}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectMatch={(match) => {
          setSelectedMatch(match);
          if (isMobile) {
            setActiveMobileScreen('details');
          }
        }}
      />

      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        currentBalance={userProfile.balance}
        onDepositSuccess={handleDepositSuccess}
      />
    </div>
  );
}

export default App;
