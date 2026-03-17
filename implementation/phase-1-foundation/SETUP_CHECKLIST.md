# Phase 1 — Setup Checklist

Complete every item below BEFORE starting the implementation guide. Check off each item as you go.

---

## 1. Accounts to Create

- [ ] **Clerk** — Create account at [clerk.com](https://clerk.com)
  - [ ] Create a new Clerk application (name: "AETHER")
  - [ ] Enable **Email/Password** sign-in method
  - [ ] Enable **Google OAuth** sign-in method
    - [ ] Go to Google Cloud Console → Create OAuth 2.0 Client ID
    - [ ] Set authorized redirect URI to: `https://<your-clerk-domain>/v1/oauth_callback`
    - [ ] Copy Client ID and Client Secret into Clerk dashboard → Social Connections → Google
  - [ ] Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from Clerk dashboard → API Keys
  - [ ] Copy `CLERK_SECRET_KEY` from Clerk dashboard → API Keys
  - [ ] Set up Clerk JWT Template for Supabase:
    - [ ] Go to Clerk dashboard → JWT Templates → Create template
    - [ ] Name: "supabase"
    - [ ] Claims: `{ "sub": "{{user.id}}", "email": "{{user.primary_email_address}}", "role": "authenticated" }`
    - [ ] Copy the JWKS endpoint URL (needed for Supabase)

- [ ] **Supabase** — Create account at [supabase.com](https://supabase.com)
  - [ ] Create a new project (name: "aether", region: closest to PH — Singapore)
  - [ ] Set a strong database password and save it
  - [ ] Copy `SUPABASE_URL` from Settings → API
  - [ ] Copy `SUPABASE_ANON_KEY` from Settings → API → anon/public key
  - [ ] Copy `SUPABASE_SERVICE_ROLE_KEY` from Settings → API → service_role key (KEEP SECRET)
  - [ ] Configure Supabase to accept Clerk JWTs:
    - [ ] Go to Supabase → Authentication → Providers
    - [ ] Under "JWT Secret", replace with Clerk's JWKS: set `SUPABASE_JWT_SECRET` or use the Clerk JWT verification
    - [ ] Alternative: Use Supabase's `auth.jwt()` function with Clerk's public key

- [ ] **Vercel** — Create account at [vercel.com](https://vercel.com)
  - [ ] Connect your GitHub repository
  - [ ] Configure environment variables (add all from ENV_VARIABLES.md)

- [ ] **GitHub** — Repository setup
  - [ ] Create GitHub repository for AETHER
  - [ ] Initialize with .gitignore for Next.js
  - [ ] Set up branch protection on `main`

---

## 2. Local Development Setup

- [ ] **Node.js** — Ensure v20+ installed (`node -v`)
- [ ] **pnpm** — Install pnpm (`npm install -g pnpm`) — recommended over npm for speed
- [ ] **Git** — Ensure git is configured with your email and name

---

## 3. Domain & DNS (Can defer to later)

- [ ] Register domain for AETHER (optional for dev)
- [ ] Set up Cloudflare DNS (free tier) if using custom domain
- [ ] Add domain to Vercel project
- [ ] Add domain to Clerk (Settings → Domains)

---

## 4. Clerk Webhook Setup

- [ ] In Clerk dashboard → Webhooks → Add Endpoint
  - [ ] URL: `https://<your-domain>/api/webhooks/clerk` (use ngrok for local dev)
  - [ ] Events to subscribe: `user.created`, `user.updated`, `user.deleted`
  - [ ] Copy the **Webhook Signing Secret** → `CLERK_WEBHOOK_SECRET`

---

## 5. Verify All Keys Are Collected

Before proceeding, confirm you have ALL of these values:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Design Assets to Prepare

- [ ] Google Fonts loaded: Syne (400/600/700/800) + DM Sans (300/400/500)
- [ ] Lucide React icons library installed
- [ ] AETHER logo SVG (violet square with arrow icon from design system)
- [ ] Favicon (derived from logo, 32x32 and 16x16)

---

## 7. Post-Setup Verification

After completing all items above:

- [ ] Clerk test: Can you sign up on the Clerk test page?
- [ ] Supabase test: Can you query `SELECT 1` from the SQL editor?
- [ ] Clerk → Supabase JWT: Can you verify a Clerk JWT claims include `sub` and `email`?
- [ ] Webhook test: Using ngrok, does a test user creation trigger the webhook endpoint?

---

**Once all checkboxes are checked, proceed to `IMPLEMENTATION_GUIDE.md`.**
