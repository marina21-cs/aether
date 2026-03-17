-- ============================================================
-- Temporary permissive policies for assets table
-- These allow anon/auth fallback clients to manage assets before
-- Clerk JWT template "supabase" is fully configured.
--
-- TODO: Remove these once JWT-based policies are verified in production.
-- ============================================================

-- Allow fallback clients to SELECT assets
CREATE POLICY "Allow anon select assets"
  ON assets FOR SELECT
  USING (true);

-- Allow fallback clients to INSERT assets
CREATE POLICY "Allow anon insert assets"
  ON assets FOR INSERT
  WITH CHECK (true);

-- Allow fallback clients to UPDATE assets
CREATE POLICY "Allow anon update assets"
  ON assets FOR UPDATE
  USING (true);

-- Allow fallback clients to DELETE assets
CREATE POLICY "Allow anon delete assets"
  ON assets FOR DELETE
  USING (true);
