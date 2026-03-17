import { createClient } from "@supabase/supabase-js";

// Admin client uses service role key — bypasses RLS.
// Only use this server-side (webhook server).
export function createAdminClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
