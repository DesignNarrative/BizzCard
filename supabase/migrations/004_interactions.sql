-- Interactions: Track what customers do on the card
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'view', 'save_contact', 'call', 'whatsapp', 'email',
    'website', 'directions', 'social', 'custom_link', 'share', 'enquiry'
  )),
  
  link_label TEXT,
  share_id UUID,
  device_type TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interactions_card_created ON interactions(card_id, created_at DESC);
CREATE INDEX idx_interactions_type ON interactions(card_id, type);
