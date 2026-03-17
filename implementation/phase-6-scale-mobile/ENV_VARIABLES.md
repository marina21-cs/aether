# Phase 6 — Environment Variables

Add these to `.env.local` (in addition to all previous phase variables).

---

```env
# ============================================================
# STRIPE (Billing & Subscriptions)
# ============================================================
# Get from: https://dashboard.stripe.com → Developers → API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx

# Webhook Signing Secret
# Get from: Stripe Dashboard → Developers → Webhooks → [Endpoint]
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Product/Price IDs
# Create at: Stripe Dashboard → Products
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxx

# Customer Portal
STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/xxxx

# ============================================================
# SENTRY (Error Tracking)
# ============================================================
# Get from: https://sentry.io → [Project] → Settings → Client Keys
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxx@o123456.ingest.sentry.io/123456
SENTRY_ORG=your-org
SENTRY_PROJECT=aether
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxxxxxxxxxx

# ============================================================
# POSTHOG (Product Analytics)
# ============================================================
# Get from: https://posthog.com → [Project] → Settings
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ============================================================
# FEATURE FLAGS
# ============================================================
# Controlled via PostHog, but defaults:
ENABLE_ADVANCED_ANALYTICS=false
ENABLE_PWA=false
ENABLE_STRIPE_BILLING=true

# ============================================================
# PERFORMANCE
# ============================================================
# Bundle analyzer (development only)
ANALYZE=false
```

---

## .env.example additions

```env
# Phase 6
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_CUSTOMER_PORTAL_URL=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
ENABLE_ADVANCED_ANALYTICS=false
ENABLE_PWA=false
ENABLE_STRIPE_BILLING=true
ANALYZE=false
```

---

## Security Notes

- `STRIPE_SECRET_KEY` is server-only — NEVER prefix with `NEXT_PUBLIC_`
- `STRIPE_WEBHOOK_SECRET` is server-only — used to verify webhook signatures
- `SENTRY_AUTH_TOKEN` is server-only — used for source map uploads during build
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is safe for client (designed for it)
- `NEXT_PUBLIC_SENTRY_DSN` is safe for client (Sentry expects it)
- `NEXT_PUBLIC_POSTHOG_KEY` is safe for client (PostHog expects it)
