# Phase 6 — Testing Guide

What to test for Phase 6 (Scale + Mobile + Stripe + Monitoring).

---

## 1. Performance Optimization

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.1 | Lighthouse score | Run Lighthouse audit | Performance > 90, Accessibility > 95 |
| 1.2 | Dashboard load time | Vercel Analytics / Performance tab | < 2 seconds P95 |
| 1.3 | Largest Contentful Paint | Lighthouse | LCP < 2.5s |
| 1.4 | First Input Delay | Lighthouse | FID < 100ms |
| 1.5 | Cumulative Layout Shift | Lighthouse | CLS < 0.1 |
| 1.6 | Bundle size | `pnpm build` output | Main bundle < 200KB gzipped |
| 1.7 | Code splitting | Check network tab | Pages load only their own JS |
| 1.8 | Image optimization | Check image requests | Served as WebP/AVIF via next/image |
| 1.9 | Font loading | Check FOUT/FOIT | Fonts load without visible flash |
| 1.10 | API response times | Check network tab | All APIs respond < 500ms |
| 1.11 | DB query performance | Supabase dashboard → Performance | No slow queries (> 1s) |

---

## 2. PWA (If Implemented)

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.1 | Installable | Chrome → Install app prompt | Can install as standalone app |
| 2.2 | Manifest | Check `/manifest.json` | Valid manifest with name, icons, theme |
| 2.3 | Service worker | Check Application tab | Service worker registered and active |
| 2.4 | Offline fallback | Disconnect network, reload | Offline page shown (not browser error) |
| 2.5 | Cached pages | Visit dashboard, go offline | Dashboard data from last visit shown |
| 2.6 | App icon | Check home screen/dock | AETHER icon with correct branding |
| 2.7 | Splash screen | Open installed PWA | Branded splash screen appears |

---

## 3. Stripe Billing

### 3.1 Checkout Flow

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.1.1 | Upgrade CTA | Click "Upgrade to Pro" | Redirects to Stripe Checkout |
| 3.1.2 | Checkout page | Stripe Checkout renders | Shows "AETHER Pro — ₱299/month" |
| 3.1.3 | Successful payment | Use test card 4242... | Returns to success page, pro tier activated |
| 3.1.4 | Declined payment | Use test card 4000...0002 | Error message, stays on checkout |
| 3.1.5 | 3D Secure | Use test card 4000...3155 | Auth challenge, then success |
| 3.1.6 | Webhook fires | Complete checkout | `checkout.session.completed` event logged |
| 3.1.7 | Profile updated | After successful payment | `profiles.subscription_tier = 'pro'` |

### 3.2 Feature Gating

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.2.1 | Free tier limits | Add 11th asset (free user) | Error: "Upgrade to Pro for unlimited assets" |
| 3.2.2 | Pro tier no limits | Add >10 assets (pro user) | Assets added without restriction |
| 3.2.3 | AI query limit (free) | Send 21st query | Rate limit message with upgrade CTA |
| 3.2.4 | AI query limit (pro) | Send 101st query | Rate limit message |
| 3.2.5 | Monte Carlo (free) | Run Glass Box | 100 paths only |
| 3.2.6 | Monte Carlo (pro) | Run Glass Box | Full 1,000 paths |
| 3.2.7 | Alert limit (free) | Create 11th alert | Error with upgrade CTA |
| 3.2.8 | PDF export (pro) | Click export | PDF downloads |
| 3.2.9 | PDF export (free) | Click export | Upgrade prompt |

### 3.3 Customer Portal

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.3.1 | Access portal | Click "Manage Subscription" | Redirects to Stripe Customer Portal |
| 3.3.2 | Cancel subscription | Cancel in portal | Subscription ends at period end |
| 3.3.3 | Webhook: cancel | After cancellation | `customer.subscription.deleted` fired |
| 3.3.4 | Tier downgrade | After period ends | Profile reverts to 'free', features gated |
| 3.3.5 | Resubscribe | Re-subscribe from portal | Pro features restored |

### 3.4 Invoice & Payment

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.4.1 | Invoice generated | Monthly renewal | Invoice created in Stripe |
| 3.4.2 | Payment success | Renewal charge | `invoice.payment_succeeded` webhook |
| 3.4.3 | Payment failure | Set up failing card | `invoice.payment_failed` webhook, grace period |
| 3.4.4 | Retry | After initial failure | Stripe retries per retry schedule |

---

## 4. Advanced Analytics (If Implemented)

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 4.1 | Efficient frontier | Navigate to Advanced Analytics | Markowitz frontier chart renders |
| 4.2 | Sharpe ratio | Check portfolio stats | Sharpe ratio displayed with formula |
| 4.3 | Portfolio beta | Check vs PSEi | Beta coefficient calculated and shown |
| 4.4 | Diversification score | Check analysis | Score and breakdown by sector/geography |
| 4.5 | Math visible | Glass Box principle | All formulas and assumptions shown |

### Algorithm Validation

| # | Test | Expected |
|---|------|----------|
| 4.6 | Sharpe ratio: (8% return, 3% rf, 15% vol) | (0.08 - 0.03) / 0.15 = 0.333 |
| 4.7 | Beta: portfolio with only PSEi stocks | Beta ≈ 1.0 |
| 4.8 | Efficient frontier: 2 assets | Hyperbola curve in risk-return space |

---

## 5. Sentry Error Tracking

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 5.1 | Client error captured | Throw error in React component | Error appears in Sentry dashboard |
| 5.2 | Server error captured | Throw error in API route | Server error in Sentry |
| 5.3 | Source maps | Check error in Sentry | Stack trace shows original TypeScript |
| 5.4 | Breadcrumbs | Check error detail | Navigation, clicks, API calls logged |
| 5.5 | User context | Check error | Clerk user ID attached |
| 5.6 | Performance traces | Check Sentry Performance | Route traces with timing |

---

## 6. PostHog Analytics

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 6.1 | Page views | Navigate between pages | Events appear in PostHog |
| 6.2 | Custom events | Create asset | `asset_created` event logged |
| 6.3 | User identification | Sign in | User linked to Clerk ID |
| 6.4 | Session recording | Enable recordings | Browse session visible in PostHog |
| 6.5 | Feature flags | Toggle a flag in PostHog | Feature shows/hides accordingly |
| 6.6 | Funnel | Sign up → Onboarding → Dashboard → Pro | Funnel visible in PostHog |

---

## 7. Deployment & Monitoring

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 7.1 | Vercel deployment | Push to main | Auto-deploys without errors |
| 7.2 | Preview deployments | Create PR | Preview URL generated |
| 7.3 | Environment vars | Check Vercel dashboard | All env vars configured |
| 7.4 | Custom domain | Check DNS | Domain resolves to Vercel |
| 7.5 | SSL/TLS | Check certificate | Valid TLS 1.3 certificate |
| 7.6 | Uptime | Check monitoring | 99.9% uptime target |
| 7.7 | Error rate | Check Sentry | < 0.5% error rate |
