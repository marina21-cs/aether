-- ============================================================
-- Temporary permissive policies for profiles table
-- These allow the anon key to manage profiles before
-- the Clerk JWT template for Supabase is configured.
--
-- TODO: Remove these once Clerk JWT template "supabase" is set up,
-- and the original JWT-based policies will handle access control.
-- ============================================================

-- Allow anon key to INSERT profiles (for client-side onboarding)
CREATE POLICY "Allow anon insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Allow anon key to SELECT profiles
CREATE POLICY "Allow anon select profiles"
  ON profiles FOR SELECT
  USING (true);

-- Allow anon key to UPDATE profiles
CREATE POLICY "Allow anon update profiles"
  ON profiles FOR UPDATE
  USING (true);
