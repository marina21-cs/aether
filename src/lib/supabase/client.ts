import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

// Base client (no auth token — works only with permissive RLS policies)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create a Supabase client with a Clerk JWT attached.
 * Required for RLS policies that check `auth.jwt() ->> 'sub'`.
 *
 * Call this with the token from `session.getToken({ template: "supabase" })`.
 * Once the Clerk JWT template is configured, use this for all authenticated queries.
 */
export function createAuthClient(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
