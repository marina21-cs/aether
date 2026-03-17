# Phase 4 — Setup Checklist

Complete these items before starting Phase 4 implementation.

---

## Prerequisites

- [ ] **Phases 1–3 fully complete** — MVP functional
- [ ] Authentication, dashboard, AI advisor, Glass Box, fee analyzer all working
- [ ] All Phase 3 verification checks pass

---

## 1. API Keys & External Services

### Web Push (VAPID Keys)
- [ ] Generate VAPID keys for Web Push API:
  ```bash
  npx web-push generate-vapid-keys
  ```
- [ ] Copy `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`
- [ ] Set `VAPID_SUBJECT` to `mailto:your-email@domain.com`

### Resend (Email Service)
- [ ] Create account at [resend.com](https://resend.com)
- [ ] Get API key from dashboard → `RESEND_API_KEY`
- [ ] Verify sender domain (or use onboarding@resend.dev for testing)
- [ ] Free tier: 3,000 emails/month, 100/day
- [ ] Test: Send a test email via API

### BSP Exchange Rates (for multi-currency)
- [ ] Ensure forex rates are updating in price_cache (from Phase 2)
- [ ] Verify rates for: USD/PHP, SGD/PHP, HKD/PHP

---

## 2. Environment Variables to Add

```env
# ============================================================
# WEB PUSH (VAPID)
# ============================================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ
VAPID_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_SUBJECT=mailto:admin@aether.ph

# ============================================================
# RESEND (Email)
# ============================================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=AETHER <digest@aether.ph>

# ============================================================
# ALERTS CONFIG
# ============================================================
ALERT_CHECK_INTERVAL=300000       # 5 minutes (ms)
MAX_ALERTS_FREE=10
MAX_ALERTS_PRO=50
```

---

## 3. Dependencies to Install

```bash
pnpm add web-push                    # Web Push notifications
pnpm add resend                      # Resend email SDK
pnpm add @types/web-push -D         # TypeScript types
pnpm add react-email                 # Email templates with React
pnpm add @react-email/components    # Email component library
```

---

## 4. Database Schema Additions

New tables needed for Phase 4:

- [ ] `scenarios` — Saved simulator scenarios
- [ ] `scenario_assets` — Assets within a scenario
- [ ] `scenario_events` — One-time events in scenarios
- [ ] `alerts` — User-defined alert rules
- [ ] `alert_history` — Triggered alert log
- [ ] `push_subscriptions` — Web push subscription data
- [ ] `notification_preferences` — User notification settings

---

## 5. Supabase Edge Functions

- [ ] Set up Supabase CLI for Edge Function development:
  ```bash
  npm install -g supabase
  supabase init  # if not already initialized
  supabase functions new alert-checker
  supabase functions new weekly-digest
  ```
- [ ] Verify Edge Functions can access Supabase database
- [ ] Test local Edge Function execution

---

## 6. Pre-Implementation Verification

- [ ] Web Push: Can you generate a push subscription in the browser?
- [ ] Resend: Does a test email send and arrive?
- [ ] Edge Functions: Does `supabase functions serve` work locally?
- [ ] Monitor BSP rate feed — is it updating correctly for multi-currency?

---

**Once all checkboxes are checked, proceed to `IMPLEMENTATION_GUIDE.md`.**
