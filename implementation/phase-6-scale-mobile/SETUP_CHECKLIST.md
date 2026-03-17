# Phase 6 — Setup Checklist

Complete these items before starting Phase 6 implementation.

---

## Prerequisites

- [ ] **Phases 1–5 fully complete**
- [ ] RAG advisor working, data pipeline automated, PDF export functional
- [ ] Product is live with real users
- [ ] All previous verification checks pass

---

## 1. API Keys & External Services

### Stripe (Billing)
- [ ] Create Stripe account at [stripe.com](https://stripe.com)
  - For Philippines: Use Stripe Atlas or PayMongo as Stripe partner
- [ ] Switch to Live mode (after testing in Test mode)
- [ ] Copy keys from Stripe Dashboard → Developers → API Keys:
  - `STRIPE_PUBLISHABLE_KEY` (public, starts with `pk_`)
  - `STRIPE_SECRET_KEY` (secret, starts with `sk_`)
- [ ] Create Products and Prices:
  - [ ] Product: "AETHER Pro"
  - [ ] Price: ₱299/month recurring (or ₱499/month — test both)
  - [ ] Copy the Price ID → `STRIPE_PRO_PRICE_ID`
- [ ] Set up Stripe Customer Portal:
  - [ ] Enable at Settings → Billing → Customer Portal
  - [ ] Allow subscription cancellation and plan changes
- [ ] Set up Webhook:
  - [ ] URL: `https://your-domain.com/api/webhooks/stripe`
  - [ ] Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
  - [ ] Copy Webhook Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Sentry (Error Tracking)
- [ ] Create account at [sentry.io](https://sentry.io)
- [ ] Create project → Select "Next.js"
- [ ] Copy DSN → `NEXT_PUBLIC_SENTRY_DSN`
- [ ] Install Sentry Next.js SDK
- [ ] Free tier: 5K errors/month, 10K transactions

### PostHog (Analytics)
- [ ] Create account at [posthog.com](https://posthog.com) (or self-host)
- [ ] Create project
- [ ] Copy Project API Key → `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] Copy Host URL → `NEXT_PUBLIC_POSTHOG_HOST`
- [ ] Free tier: 1M events/month, session recordings

---

## 2. Environment Variables to Add

```env
# ============================================================
# STRIPE (Billing)
# ============================================================
# Get from: https://dashboard.stripe.com → Developers → API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxx

# Customer Portal
STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/xxxx

# ============================================================
# SENTRY (Error Tracking)
# ============================================================
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxx@o123456.ingest.sentry.io/123456
SENTRY_ORG=your-org
SENTRY_PROJECT=aether

# ============================================================
# POSTHOG (Analytics)
# ============================================================
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 3. Dependencies to Install

```bash
# Stripe
pnpm add stripe @stripe/stripe-js     # Stripe server SDK + client

# Sentry
pnpm add @sentry/nextjs               # Sentry Next.js integration

# PostHog
pnpm add posthog-js posthog-node      # PostHog client + server

# Performance
pnpm add @next/bundle-analyzer         # Bundle analysis
pnpm add sharp                         # Image optimization

# PWA (if going PWA route)
pnpm add next-pwa                      # PWA support for Next.js
# OR
pnpm add @ducanh2912/next-pwa          # Alternative maintained fork
```

---

## 4. Stripe Configuration Steps

### Test Mode (do first)
- [ ] Create test product + price in Test mode
- [ ] Test checkout flow with Stripe test cards:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - Auth required: `4000 0025 0000 3155`
- [ ] Verify webhook events fire correctly
- [ ] Test customer portal (cancel/resubscribe)

### Live Mode (when ready)
- [ ] Create same products in Live mode
- [ ] Update all keys to live prefixes
- [ ] Verify webhook with live endpoint
- [ ] Test with a real ₱1 subscription (refund after)

---

## 5. Sentry Configuration

- [ ] Run Sentry wizard: `npx @sentry/wizard@latest -i nextjs`
- [ ] This creates: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- [ ] Upload source maps during build
- [ ] Test: Throw an error in a component, verify it appears in Sentry dashboard

---

## 6. PostHog Tracking Plan

Define events to track before implementation:

- [ ] **Page Views:** Auto-capture
- [ ] **Auth Events:** `user_signed_up`, `user_signed_in`, `user_signed_out`
- [ ] **Dashboard:** `dashboard_viewed`, `net_worth_checked`
- [ ] **Assets:** `asset_created`, `asset_updated`, `asset_deleted`, `csv_imported`
- [ ] **AI Advisor:** `advisor_query_sent`, `advisor_rate_limited`
- [ ] **Glass Box:** `monte_carlo_run`, `assumptions_changed`
- [ ] **Simulator:** `scenario_created`, `scenario_compared`
- [ ] **Billing:** `upgrade_initiated`, `upgrade_completed`, `downgrade_initiated`
- [ ] **Feature Flags:** Set up flags for gradual feature rollout

---

## 7. Pre-Implementation Verification

- [ ] Stripe: Can you create a checkout session and redirect?
- [ ] Sentry: Does an unhandled error show up in the dashboard?
- [ ] PostHog: Does a page view event appear in the dashboard?
- [ ] Bundle size: What is the current bundle size? (`pnpm build && pnpm analyze`)
- [ ] Lighthouse: What's the current Lighthouse score?

---

**Once all checkboxes are checked, proceed to `IMPLEMENTATION_GUIDE.md`.**
