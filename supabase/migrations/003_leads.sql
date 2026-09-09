-- Leads: Customer enquiry submissions
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  
  -- Customer info
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  interest TEXT,
  message TEXT,
  
  -- Source tracking
  source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'shared', 'qr')),
  share_id UUID,
  referrer_name TEXT,
  
  -- CRM-lite
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'not_interested')),
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_card_id ON leads(card_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(card_id, status);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
