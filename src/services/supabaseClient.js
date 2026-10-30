import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE = 'vertex_supabase_config';

// Permanent verified production Supabase endpoints
const DEFAULT_SUPABASE_URL = 'https://kymelbbjlnuoikqcujpf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bWVsYmJqbG51b2lrcWN1anBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODEyMzYsImV4cCI6MjEwODk1NzIzNn0.CmTTiYKodhPFztTltTkjIG8hj2irZRxyYxa0SPwscSk';

export const getSupabaseConfig = () => {
  const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { ...parsed, isConnected: true };
      }
    } catch (e) {
      /* ignore */
    }
  }

  const envUrl = import.meta.env?.VITE_SUPABASE_URL;
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

  const url = (envUrl && !envUrl.includes('your-project')) ? envUrl : DEFAULT_SUPABASE_URL;
  const anonKey = (envKey && !envKey.includes('your_supabase')) ? envKey : DEFAULT_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isConnected: true
  };
};

// Singleton Supabase Client
let supabaseInstance = null;

export const getSupabase = () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err.message);
      return null;
    }
  }
  return supabaseInstance;
};

// ============================================================================
// REAL SUPABASE AUTHENTICATION
// ============================================================================

export const signUpUser = async ({ email, password, fullName }) => {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split('@')[0],
        avatar_url: '/assets/user.jpg'
      }
    }
  });

  if (error) throw error;

  // Real initial wallet record creation
  if (data?.user) {
    try {
      await supabase.from('wallets').upsert({
        user_id: data.user.id,
        user_email: data.user.email,
        balance: 1356.00,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email' });

      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName || data.user.email.split('@')[0],
        avatar_url: '/assets/user.jpg',
        vip_level: 3
      }, { onConflict: 'id' });
    } catch (e) {
      console.warn('Initial wallet/profile seed note:', e.message);
    }
  }

  return data;
};

export const signInUser = async ({ email, password }) => {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Retrieve actual wallet balance from Supabase database
  let balance = 1356.00;
  try {
    const { data: walletData } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_email', email)
      .maybeSingle();

    if (walletData && typeof walletData.balance === 'number') {
      balance = walletData.balance;
    }
  } catch (e) {
    // Graceful fallback
  }

  const profile = {
    id: data.user.id,
    name: data.user.user_metadata?.full_name || email.split('@')[0],
    email: data.user.email,
    avatar: data.user.user_metadata?.avatar_url || '/assets/user.jpg',
    balance
  };

  return { session: data.session, user: data.user, profile };
};

export const signOutUser = async () => {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('Supabase signout note:', e.message);
  }
};

export const getCurrentUserSession = async () => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    let balance = 1356.00;
    try {
      const { data: walletData } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_email', session.user.email)
        .maybeSingle();

      if (walletData && typeof walletData.balance === 'number') {
        balance = walletData.balance;
      }
    } catch (_) {}

    return {
      name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
      email: session.user.email,
      avatar: session.user.user_metadata?.avatar_url || '/assets/user.jpg',
      balance
    };
  } catch (e) {
    return null;
  }
};

// ============================================================================
// REAL DATABASE SYNC (BETS & WALLET)
// ============================================================================

export const syncBetToSupabase = async (bet, userEmail) => {
  const supabase = getSupabase();
  if (!supabase) return { synced: false, reason: 'Supabase client unavailable' };

  try {
    const { data, error } = await supabase.from('bets').insert([
      {
        ticket_id: bet.id,
        user_email: userEmail || 'player@vertexbet.com',
        stake: bet.stake,
        odds: bet.odds,
        payout: bet.payout,
        status: bet.status || 'OPEN',
        picks: bet.picks,
        placed_at: new Date().toISOString()
      }
    ]);
    if (error) {
      console.warn('Supabase bet sync note:', error.message);
      return { synced: false, error: error.message };
    }
    return { synced: true, data };
  } catch (err) {
    return { synced: false, error: err.message };
  }
};

export const syncUserBalanceToSupabase = async (userEmail, balance) => {
  const supabase = getSupabase();
  if (!supabase) return { synced: false };

  try {
    const { data, error } = await supabase
      .from('wallets')
      .upsert({
        user_email: userEmail || 'player@vertexbet.com',
        balance,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email' });
    if (error) {
      return { synced: false, error: error.message };
    }
    return { synced: true, data };
  } catch (err) {
    return { synced: false, error: err.message };
  }
};

export const fetchUserBetsFromSupabase = async (userEmail) => {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_email', userEmail)
      .order('placed_at', { ascending: false });

    if (error || !Array.isArray(data)) return [];
    return data;
  } catch (e) {
    return [];
  }
};
