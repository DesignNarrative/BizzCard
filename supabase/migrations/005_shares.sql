-- Shares: Track card sharing for referral attribution
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  parent_share_id UUID REFERENCES shares(id),
  sharer_name TEXT,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shares_code ON shares(code);
CREATE INDEX idx_shares_card_id ON shares(card_id);
