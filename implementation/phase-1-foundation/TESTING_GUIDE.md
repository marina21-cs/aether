# Phase 1 — Testing Guide

What to test, how to test, and expected results for every feature in Phase 1.

---

## 1. Project Scaffold

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.1 | Dev server starts | `pnpm dev` | Server runs at localhost:3000, no errors in terminal |
| 1.2 | TypeScript compiles | `pnpm tsc --noEmit` | Zero TypeScript errors |
| 1.3 | Lint passes | `pnpm lint` | Zero ESLint warnings or errors |
| 1.4 | Build succeeds | `pnpm build` | Production build completes without errors |
| 1.5 | Tailwind works | Add a class like `bg-[#7c3aed]` to a div | Purple background renders |
| 1.6 | Path aliases work | Import from `@/components/...` | No module resolution errors |
| 1.7 | Fonts load | Check network tab for Syne + DM Sans | Fonts load from Google Fonts |

---

## 2. Clerk Authentication

### 2.1 Sign-Up Flow

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.1.1 | Sign-up page renders | Navigate to `/sign-up` | Split-screen layout: branded panel left, sign-up form right |
| 2.1.2 | Email/password signup | Fill form, submit | Account created, redirects to `/onboarding` |
| 2.1.3 | Google OAuth signup | Click "Continue with Google" | Google consent screen → account created → redirects to `/onboarding` |
| 2.1.4 | Validation errors | Submit empty form | Error messages appear below each field |
| 2.1.5 | Password requirements | Enter password < 8 chars | Error: "Password must be at least 8 characters" |
| 2.1.6 | Duplicate email | Sign up with existing email | Error: "Email already in use" |
| 2.1.7 | Dark theme styling | Visual check | Glassmorphic dark theme, violet accents, Syne headings |
| 2.1.8 | Accessibility | Tab through form | Focus rings visible on all interactive elements |

### 2.2 Sign-In Flow

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.2.1 | Sign-in page renders | Navigate to `/sign-in` | Same split-screen layout with sign-in form |
| 2.2.2 | Email/password login | Enter valid credentials | Redirects to `/dashboard` |
| 2.2.3 | Google OAuth login | Click "Continue with Google" | Authenticates and redirects |
| 2.2.4 | Invalid credentials | Enter wrong password | Error message displayed |
| 2.2.5 | "Forgot password" | Click forgot password link | Clerk's password reset flow triggers |

### 2.3 Auth Middleware

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.3.1 | Protected route (logged out) | Navigate to `/dashboard` without auth | Redirects to `/sign-in` |
| 2.3.2 | Protected route (logged in) | Navigate to `/dashboard` with auth | Dashboard renders |
| 2.3.3 | Public routes accessible | Navigate to `/`, `/sign-in`, `/sign-up` | Pages render without auth |
| 2.3.4 | API route protection | Call `GET /api/v1/user/settings` without token | Returns 401 Unauthorized |

### 2.4 Clerk Webhook

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.4.1 | User sync on signup | Create new user via Clerk | Row appears in Supabase `profiles` table |
| 2.4.2 | Webhook signature | Send unsigned POST to `/api/webhooks/clerk` | Returns 400 Bad Request |
| 2.4.3 | User update sync | Update user name in Clerk | `profiles.full_name` updates in Supabase |
| 2.4.4 | User delete sync | Delete user in Clerk | `profiles` row is deleted (cascades to assets, etc.) |

---

## 3. Database (Supabase)

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.1 | Tables exist | Supabase SQL Editor: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'` | All 6 tables present: profiles, assets, liabilities, transactions, audit_log, price_cache |
| 3.2 | RLS enabled | Check each table in Supabase dashboard | RLS toggle is ON for all tables |
| 3.3 | RLS blocks unauthorized | Query `assets` with wrong user JWT | Returns empty result (not other users' data) |
| 3.4 | RLS allows authorized | Query `assets` with correct user JWT | Returns that user's assets only |
| 3.5 | Indexes created | `SELECT indexname FROM pg_indexes WHERE schemaname = 'public'` | All indexes from spec present |
| 3.6 | Foreign keys work | Try to insert asset with non-existent user_id | Fails with foreign key constraint error |
| 3.7 | Cascade delete | Delete a profile | All related assets, liabilities, transactions deleted |

---

## 4. Onboarding Flow

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 4.1 | Redirects after signup | Complete Clerk signup | Lands on first onboarding screen |
| 4.2 | Risk profile selection | Click "Moderate" card | Card highlights with violet border, checkmark appears |
| 4.3 | Only one selection | Click "Moderate" then "Aggressive" | Only "Aggressive" is selected |
| 4.4 | Continue button state | No selection made | Continue button is disabled (muted style) |
| 4.5 | Skip option | Click "Skip for now" | Advances to next screen with default value |
| 4.6 | Currency selection | Select "PHP" | PHP radio button filled violet |
| 4.7 | PHP pre-selected | Load currency screen | PHP is pre-selected by default |
| 4.8 | Welcome modal | Complete all steps | Welcome modal with blurred dashboard background |
| 4.9 | "Connect" button | Click "Connect an account" | Navigates to data ingestion page |
| 4.10 | "Add manually" button | Click "Add manually" | Navigates to manual entry page |
| 4.11 | "Skip for now" | Click skip on welcome | Navigates to dashboard |
| 4.12 | Profile saved | Complete onboarding | Supabase `profiles` row updated: `risk_tolerance`, `base_currency`, `onboarding_complete = true` |
| 4.13 | Progress dots | Navigate through steps | Dots fill progressively with violet glow |
| 4.14 | Already onboarded | Revisit `/onboarding` after completing | Redirects to `/dashboard` |

---

## 5. Design System

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 5.1 | Dark theme | Load any page | Background #08080f, no white backgrounds |
| 5.2 | Fonts correct | Inspect headings vs body text | Headings: Syne, Body: DM Sans |
| 5.3 | Glow blobs | Check for background glow elements | Two violet gradient blobs visible behind content |
| 5.4 | Glass cards | Check card components | Semi-transparent with backdrop blur, violet border glow |
| 5.5 | Button styles | Check primary buttons | Violet background, glow shadow, scale on active |
| 5.6 | Focus rings | Tab through page | 2px solid accent-bright outline on all focusable elements |
| 5.7 | Reduced motion | Enable prefers-reduced-motion in OS | All animations/transitions disabled |
| 5.8 | Responsive (1440px) | Set viewport to 1440px | Full layout renders correctly |
| 5.9 | Responsive (768px) | Set viewport to 768px | Layout adapts, no horizontal scroll |

---

## 6. Landing Page

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 6.1 | Renders | Navigate to `/` | Landing page with hero, features, pricing |
| 6.2 | CTA works | Click "Get Started" | Navigates to `/sign-up` |
| 6.3 | "Sign In" link | Click header sign-in | Navigates to `/sign-in` |
| 6.4 | Navigation | Check header links | Features, Pricing, Docs links scroll or navigate |
| 6.5 | Footer | Scroll to bottom | Footer with proper links, social icons |

---

## How to Run Tests

### Manual Testing
1. Start dev server: `pnpm dev`
2. Open browser at `http://localhost:3000`
3. Walk through each test case above
4. Use browser DevTools (F12) for network, console, and accessibility checks

### Automated (set up in Phase 3)
- Unit tests: Vitest (`pnpm test`)
- E2E tests: Playwright (`pnpm test:e2e`)

### Local Webhook Testing
1. Install ngrok: `npm install -g ngrok`
2. Run: `ngrok http 3000`
3. Copy the ngrok URL into Clerk webhook endpoint
4. Test user creation/update/deletion flows
