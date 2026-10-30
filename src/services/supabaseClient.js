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
    isConnected: Boolean(url && anonKey)
  };
};

export const saveSupabaseConfig = ({ url, anonKey }) => {
  const finalUrl = url?.trim() || DEFAULT_SUPABASE_URL;
  const finalKey = anonKey?.trim() || DEFAULT_SUPABASE_ANON_KEY;
  const isConnected = Boolean(finalUrl && finalKey);
  const config = { url: finalUrl, anonKey: finalKey, isConnected };
  localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(config));
  supabaseInstance = null; // reset client instance
  return config;
};

// Initialize Supabase client dynamically with singleton pattern
let supabaseInstance = null;

export const getSupabase = () => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
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
        user_email: userEmail || 'alexander@vertexbet.com',
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
      .upsert({
        user_email: userEmail || 'alexander@vertexbet.com',
        balance,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_email' });
    if (error) {
      console.warn('Supabase wallet sync note:', error.message);
      return { synced: false, error: error.message };
    }
    return { synced: true, data };
  } catch (err) {
    console.warn('Supabase wallet sync error:', err.message);
    return { synced: false, error: err.message };
  }
};
