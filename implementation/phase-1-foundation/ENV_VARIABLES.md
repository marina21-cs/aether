# Phase 1 — Environment Variables

Create a `.env.local` file in the project root with these values.

---

## Required for Phase 1

```env
# ============================================================
# CLERK AUTH
# ============================================================
# Get from: https://dashboard.clerk.com → [Your App] → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

# Clerk Webhook Secret
# Get from: https://dashboard.clerk.com → Webhooks → [Endpoint] → Signing Secret
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Clerk redirect URLs (customize as needed)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ============================================================
# SUPABASE
# ============================================================
# Get from: https://supabase.com → [Project] → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxx

# ============================================================
# APP CONFIG
# ============================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AETHER
```

---

## .env.example (commit this to git)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AETHER
```

---

## Security Notes

- **NEVER** commit `.env.local` to git
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — only use server-side
- `CLERK_SECRET_KEY` is server-only — never expose to client
- `CLERK_WEBHOOK_SECRET` is for verifying webhook signatures
- All `NEXT_PUBLIC_*` variables are exposed to the browser — only put non-secret values there
