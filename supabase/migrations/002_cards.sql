-- Cards: One card per user (V1), expandable to many later
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Identity
  name TEXT NOT NULL,
  designation TEXT,
  company TEXT,
  about TEXT,
  logo_url TEXT,
  profile_photo_url TEXT,
  
  -- Contact
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  
  -- Location
  address TEXT,
  map_url TEXT,
  map_latitude DECIMAL(10,8),
  map_longitude DECIMAL(11,8),
  
  -- Social Media (all optional)
  instagram TEXT,
  facebook TEXT,
  linkedin TEXT,
  youtube TEXT,
  twitter TEXT,
  google_reviews_url TEXT,
  
  -- Custom Links (JSON array)
  custom_links JSONB DEFAULT '[]',
  
  -- Services (JSON array of strings)
  services JSONB DEFAULT '[]',
  
  -- Appearance
  theme TEXT DEFAULT 'default',
  accent_color TEXT DEFAULT '#2563eb',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
  is_published BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- V1: one card per user
  UNIQUE(user_id)
);

CREATE INDEX idx_cards_id_published ON cards(id) WHERE is_published = true;
CREATE INDEX idx_cards_user_id ON cards(user_id);

CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
