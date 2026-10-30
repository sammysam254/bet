import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE = 'vertex_supabase_config';

export const getSupabaseConfig = () => {
  const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      /* ignore */
    }
  }
  return {
    url: import.meta.env?.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || '',
    isConnected: false
  };
};

export const saveSupabaseConfig = ({ url, anonKey }) => {
  const isConnected = Boolean(url?.trim() && anonKey?.trim());
  const config = { url: url?.trim() || '', anonKey: anonKey?.trim() || '', isConnected };
  localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(config));
  return config;
};

// Initialize Supabase client dynamically
let supabaseInstance = null;

export const getSupabase = () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err.message);
      return null;
    }
  }
  return supabaseInstance;
};

// Sync Bet to Supabase table 'bets'
export const syncBetToSupabase = async (bet, userEmail) => {
  const supabase = getSupabase();
  if (!supabase) return { synced: false, reason: 'Supabase credentials not configured' };

  try {
    const { data, error } = await supabase.from('bets').insert([
      {
        ticket_id: bet.id,
        user_email: userEmail,
        stake: bet.stake,
        odds: bet.odds,
        payout: bet.payout,
        status: bet.status || 'OPEN',
        picks: bet.picks,
        placed_at: new Date().toISOString()
      }
    ]);
    if (error) throw error;
    return { synced: true, data };
  } catch (err) {
    console.warn('Supabase bet sync error:', err.message);
    return { synced: false, error: err.message };
  }
};

// Sync User Balance to Supabase table 'wallets'
export const syncUserBalanceToSupabase = async (userEmail, balance) => {
  const supabase = getSupabase();
  if (!supabase) return { synced: false };

  try {
    const { data, error } = await supabase
      .from('wallets')
      .upsert({ user_email: userEmail, balance, updated_at: new Date().toISOString() });
    if (error) throw error;
    return { synced: true, data };
  } catch (err) {
    console.warn('Supabase wallet sync error:', err.message);
    return { synced: false, error: err.message };
  }
};
