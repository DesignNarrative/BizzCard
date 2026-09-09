-- =========================================================
-- BIZCARD COMPLETE DATABASE SCHEMA & SECURITY POLICIES
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click RUN
-- =========================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile trigger on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at helper
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 2. CARDS TABLE
CREATE TABLE IF NOT EXISTS public.cards (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Identity
  name TEXT NOT NULL,
  designation TEXT,
  company TEXT,
  about TEXT,
  logo_url TEXT,
  profile_photo_url TEXT,
  
  -- Contact Details
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  
  -- Location
  address TEXT,
  map_url TEXT,
  map_latitude DECIMAL(10,8),
  map_longitude DECIMAL(11,8),
  
  -- Social Media
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  youtube TEXT,
  twitter TEXT,
  google_reviews_url TEXT,
  
  -- Custom Links (JSON array)
  custom_links JSONB DEFAULT '[]',
  
  -- Services (JSON array)
  services JSONB DEFAULT '[]',
  
  -- Appearance
  theme TEXT DEFAULT 'default',
  accent_color TEXT DEFAULT '#2563eb',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
  is_published BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_cards_id_published ON public.cards(id) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);

DROP TRIGGER IF EXISTS cards_updated_at ON public.cards;
CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 3. LEADS TABLE (Customer Enquiries)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  interest TEXT,
  message TEXT,
  
  source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'shared', 'qr')),
  share_id UUID,
  referrer_name TEXT,
  
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'not_interested')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_card_id ON public.leads(card_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(card_id, status);

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 4. INTERACTIONS TABLE (Analytics Tracking)
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'view', 'save_contact', 'call', 'whatsapp', 'email',
    'website', 'directions', 'social', 'custom_link', 'share', 'enquiry'
  )),
  
  link_label TEXT,
  share_id UUID,
  device_type TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interactions_card_created ON public.interactions(card_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON public.interactions(card_id, type);


-- 5. SHARES TABLE (Referral / Share Chains)
CREATE TABLE IF NOT EXISTS public.shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  parent_share_id UUID REFERENCES public.shares(id),
  sharer_name TEXT,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shares_code ON public.shares(code);
CREATE INDEX IF NOT EXISTS idx_shares_card_id ON public.shares(card_id);


-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Cards Policies
DROP POLICY IF EXISTS "Owner can manage own cards" ON public.cards;
CREATE POLICY "Owner can manage own cards"
  ON public.cards FOR ALL USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Anyone can view published cards" ON public.cards;
CREATE POLICY "Anyone can view published cards"
  ON public.cards FOR SELECT USING (is_published = true AND status = 'active');

-- Leads Policies
DROP POLICY IF EXISTS "Card owner can view leads" ON public.leads;
CREATE POLICY "Card owner can view leads"
  ON public.leads FOR SELECT TO authenticated USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Card owner can update leads" ON public.leads;
CREATE POLICY "Card owner can update leads"
  ON public.leads FOR UPDATE TO authenticated USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Anyone can submit enquiry" ON public.leads;
CREATE POLICY "Anyone can submit enquiry"
  ON public.leads FOR INSERT WITH CHECK (true);

-- Interactions Policies
DROP POLICY IF EXISTS "Anyone can log interaction" ON public.interactions;
CREATE POLICY "Anyone can log interaction"
  ON public.interactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Card owner can view interactions" ON public.interactions;
CREATE POLICY "Card owner can view interactions"
  ON public.interactions FOR SELECT TO authenticated USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = (SELECT auth.uid()))
  );

-- Shares Policies
DROP POLICY IF EXISTS "Anyone can create share" ON public.shares;
CREATE POLICY "Anyone can create share"
  ON public.shares FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Card owner can view shares" ON public.shares;
CREATE POLICY "Card owner can view shares"
  ON public.shares FOR SELECT TO authenticated USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = (SELECT auth.uid()))
  );
