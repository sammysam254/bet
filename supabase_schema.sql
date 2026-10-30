-- ==============================================================================
-- VERTEX BETTING - PRODUCTION SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kymelbbjlnuoikqcujpf/sql
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT DEFAULT '/assets/user.jpg',
  vip_level INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  user_email TEXT UNIQUE NOT NULL,
  balance NUMERIC(12, 2) DEFAULT 1356.00,
  currency TEXT DEFAULT 'USD',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bets Table
CREATE TABLE IF NOT EXISTS public.bets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  stake NUMERIC(10, 2) NOT NULL,
  odds NUMERIC(8, 2) NOT NULL,
  payout NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'OPEN', -- 'OPEN', 'WON', 'LOST', 'CASHOUT'
  picks JSONB NOT NULL DEFAULT '[]'::jsonb,
  placed_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- 5. Open/Authenticated Access Policies for Profiles
DROP POLICY IF EXISTS "Allow select on profiles" ON public.profiles;
CREATE POLICY "Allow select on profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert on profiles" ON public.profiles;
CREATE POLICY "Allow insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on profiles" ON public.profiles;
CREATE POLICY "Allow update on profiles" ON public.profiles FOR UPDATE USING (true);

-- 6. Open/Authenticated Access Policies for Wallets
DROP POLICY IF EXISTS "Allow select on wallets" ON public.wallets;
CREATE POLICY "Allow select on wallets" ON public.wallets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert on wallets" ON public.wallets;
CREATE POLICY "Allow insert on wallets" ON public.wallets FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on wallets" ON public.wallets;
CREATE POLICY "Allow update on wallets" ON public.wallets FOR UPDATE USING (true);

-- 7. Open/Authenticated Access Policies for Bets
DROP POLICY IF EXISTS "Allow select on bets" ON public.bets;
CREATE POLICY "Allow select on bets" ON public.bets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert on bets" ON public.bets;
CREATE POLICY "Allow insert on bets" ON public.bets FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update on bets" ON public.bets;
CREATE POLICY "Allow update on bets" ON public.bets FOR UPDATE USING (true);

-- 8. Auto-Create Profile & Wallet on Auth Signup Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, vip_level)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/assets/user.jpg'),
    3
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.wallets (user_id, user_email, balance)
  VALUES (
    NEW.id,
    NEW.email,
    1356.00
  )
  ON CONFLICT (user_email) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
