-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING ((SELECT auth.uid()) = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING ((SELECT auth.uid()) = id);

-- CARDS
CREATE POLICY "Owner can manage own cards"
  ON cards FOR ALL USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Anyone can view published cards"
  ON cards FOR SELECT TO anon USING (is_published = true AND status = 'active');

-- LEADS
CREATE POLICY "Card owner can view leads"
  ON leads FOR SELECT TO authenticated USING (
    card_id IN (SELECT id FROM cards WHERE user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Card owner can update leads"
  ON leads FOR UPDATE TO authenticated USING (
    card_id IN (SELECT id FROM cards WHERE user_id = (SELECT auth.uid()))
  );
CREATE POLICY "Anyone can submit enquiry"
  ON leads FOR INSERT WITH CHECK (true);

-- INTERACTIONS
CREATE POLICY "Anyone can log interaction"
  ON interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Card owner can view interactions"
  ON interactions FOR SELECT TO authenticated USING (
    card_id IN (SELECT id FROM cards WHERE user_id = (SELECT auth.uid()))
  );

-- SHARES
CREATE POLICY "Anyone can create share"
  ON shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Card owner can view shares"
  ON shares FOR SELECT TO authenticated USING (
    card_id IN (SELECT id FROM cards WHERE user_id = (SELECT auth.uid()))
  );
