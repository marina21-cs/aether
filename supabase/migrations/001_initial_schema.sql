-- ============================================================
-- AETHER Phase 1 — Initial Schema
-- Auth: Clerk (JWTs synced via webhook)
-- ============================================================

-- Profiles table (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,                -- Clerk user ID (e.g., "user_2abc...")
  email TEXT UNIQUE,
  full_name TEXT,
  risk_tolerance TEXT DEFAULT 'moderate'
    CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  base_currency TEXT DEFAULT 'PHP'
    CHECK (base_currency IN ('PHP', 'USD', 'SGD', 'HKD')),
  subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro')),
  onboarding_complete BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asset_class TEXT NOT NULL
    CHECK (asset_class IN (
      'pse_stock', 'global_stock', 'crypto', 'real_estate',
      'uitf', 'cash', 'gold', 'time_deposit', 'other'
    )),
  ticker_or_name TEXT NOT NULL,
  quantity NUMERIC(18, 8) NOT NULL,
  avg_cost_basis NUMERIC(18, 8),
  current_value_php NUMERIC(18, 2) NOT NULL,
  native_currency TEXT DEFAULT 'PHP',
  is_manual BOOLEAN DEFAULT true,
  annual_fee_pct NUMERIC(5, 4),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Liabilities table
CREATE TABLE IF NOT EXISTS liabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liability_type TEXT NOT NULL
    CHECK (liability_type IN (
      'credit_card', 'personal_loan', 'housing_loan', 'car_loan', 'other'
    )),
  name TEXT NOT NULL,
  outstanding_balance NUMERIC(18, 2) NOT NULL,
  interest_rate_pct NUMERIC(5, 4),
  monthly_payment NUMERIC(18, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  tx_type TEXT NOT NULL
    CHECK (tx_type IN (
      'buy', 'sell', 'dividend', 'rent_income', 'fee', 'deposit', 'withdrawal'
    )),
  amount_php NUMERIC(18, 2) NOT NULL,
  price_per_unit NUMERIC(18, 8),
  quantity NUMERIC(18, 8),
  tx_date TIMESTAMPTZ NOT NULL,
  source TEXT DEFAULT 'manual'
    CHECK (source IN ('manual', 'csv_import', 'api_sync')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Price cache
CREATE TABLE IF NOT EXISTS price_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT UNIQUE NOT NULL,
  price_php NUMERIC(18, 8) NOT NULL,
  source TEXT NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_assets_user ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_liabilities_user ON liabilities(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_asset ON transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(tx_date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_cache_ticker ON price_cache(ticker);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_cache ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((auth.jwt() ->> 'sub') = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = id);

-- Assets: users can CRUD their own assets
CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own assets"
  ON assets FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own assets"
  ON assets FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own assets"
  ON assets FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Liabilities: same pattern
CREATE POLICY "Users can view own liabilities"
  ON liabilities FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own liabilities"
  ON liabilities FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own liabilities"
  ON liabilities FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own liabilities"
  ON liabilities FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Transactions: same pattern
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- Audit log: read-only for users
CREATE POLICY "Users can view own audit log"
  ON audit_log FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Price cache: readable by all authenticated users
CREATE POLICY "Authenticated users can read price cache"
  ON price_cache FOR SELECT
  USING (auth.jwt() IS NOT NULL);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_liabilities_updated_at
  BEFORE UPDATE ON liabilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
