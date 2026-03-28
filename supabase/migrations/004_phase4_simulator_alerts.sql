-- ============================================================
-- AETHER Phase 4 — Simulator + Alerts
-- ============================================================

-- Saved scenario containers
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  projection_years INTEGER NOT NULL DEFAULT 10,
  base_portfolio JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Per-scenario asset adjustments (add/remove/reweight)
CREATE TABLE IF NOT EXISTS scenario_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  asset_name TEXT NOT NULL,
  asset_ticker TEXT,
  asset_class TEXT,
  operation TEXT NOT NULL
    CHECK (operation IN ('add', 'remove', 'update_allocation', 'update_value')),
  quantity_delta NUMERIC(18, 8),
  value_php_delta NUMERIC(18, 2),
  target_allocation_pct NUMERIC(7, 4),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Per-scenario one-time events (e.g. buy condo, inheritance)
CREATE TABLE IF NOT EXISTS scenario_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('inflow', 'outflow')),
  amount_php NUMERIC(18, 2) NOT NULL,
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL
    CHECK (alert_type IN (
      'price_target',
      'psei_threshold',
      'bsp_rate_change',
      'crypto_volatility',
      'portfolio_drop',
      'portfolio_gain'
    )),
  asset_ticker TEXT,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below', 'change_pct')),
  threshold NUMERIC(18, 8) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  triggered_value NUMERIC(18, 8),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  enable_in_app BOOLEAN NOT NULL DEFAULT true,
  enable_push BOOLEAN NOT NULL DEFAULT true,
  enable_email_digest BOOLEAN NOT NULL DEFAULT true,
  digest_day SMALLINT NOT NULL DEFAULT 1,
  digest_hour SMALLINT NOT NULL DEFAULT 8,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scenarios_user ON scenarios(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_scenario_assets_scenario ON scenario_assets(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenario_events_scenario ON scenario_events(scenario_id, event_date);
CREATE INDEX IF NOT EXISTS idx_alerts_user_active ON alerts(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_alert_history_user ON alert_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(user_id);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own scenarios"
  ON scenarios FOR ALL
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can CRUD own scenario assets"
  ON scenario_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM scenarios s
      WHERE s.id = scenario_assets.scenario_id
        AND (auth.jwt() ->> 'sub') = s.user_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM scenarios s
      WHERE s.id = scenario_assets.scenario_id
        AND (auth.jwt() ->> 'sub') = s.user_id
    )
  );

CREATE POLICY "Users can CRUD own scenario events"
  ON scenario_events FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM scenarios s
      WHERE s.id = scenario_events.scenario_id
        AND (auth.jwt() ->> 'sub') = s.user_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM scenarios s
      WHERE s.id = scenario_events.scenario_id
        AND (auth.jwt() ->> 'sub') = s.user_id
    )
  );

CREATE POLICY "Users can CRUD own alerts"
  ON alerts FOR ALL
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read own alert history"
  ON alert_history FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own alert history"
  ON alert_history FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can manage own push subscriptions"
  ON push_subscriptions FOR ALL
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences FOR ALL
  USING ((auth.jwt() ->> 'sub') = user_id)
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE TRIGGER set_scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
