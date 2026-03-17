# AETHER — Implementation Guide (All Phases)

**Project:** AETHER — Next-Generation Wealth Management Platform for Filipino Investors
**Auth Provider:** Clerk (Email/Password + Google OAuth)
**Database:** Supabase (PostgreSQL 16 + pgvector)
**Framework:** Next.js 15 (App Router) — migrating from current Vite + React scaffold
**Hosting:** Vercel
**Design System:** Dark SaaS Glassmorphism — Syne + DM Sans, violet accent (#7c3aed)

---

## Phase Overview

| Phase | Name | Weeks | Folder | Status |
|-------|------|-------|--------|--------|
| **1** | **Foundation** | 1–4 | `phase-1-foundation/` | Not Started |
| **2** | **Core Dashboard** | 5–8 | `phase-2-core-dashboard/` | Not Started |
| **3** | **Intelligence Layer** | 9–12 | `phase-3-intelligence-layer/` | Not Started |
| — | **MVP LAUNCH** | Week 12 | — | — |
| **4** | **Simulator + Alerts** | 13–16 | `phase-4-simulator-alerts/` | Not Started |
| **5** | **RAG + Data Pipeline** | 17–24 | `phase-5-rag-data-pipeline/` | Not Started |
| **6** | **Scale + Mobile** | 25–35 | `phase-6-scale-mobile/` | Not Started |

---

## Critical Path

```
Phase 1 (Foundation)
  ├── Next.js 15 scaffold + Tailwind 4 + design system tokens
  ├── Clerk auth (signup slides, login, Google OAuth)
  ├── Supabase schema + RLS (with Clerk JWT)
  └── Onboarding flow (4 screens)
        │
        ▼
Phase 2 (Core Dashboard)
  ├── 3-panel Bloomberg layout (sidebar + main + right rail)
  ├── Net worth dashboard + holdings table
  ├── Manual asset entry + CSV import (COL Financial)
  └── Price cache (CoinGecko + PSE Edge + BSP forex)
        │
        ▼
Phase 3 (Intelligence Layer)
  ├── AI advisor (Claude API + Vercel AI SDK + streaming)
  ├── Glass Box engine (Monte Carlo + covariance + Web Workers)
  ├── Fee analyzer + real-return calculator
  └── Performance history with benchmarks
        │
        ▼
  *** MVP LAUNCH (Week 12) ***
        │
        ▼
Phase 4 (Simulator + Alerts)
  ├── Sandbox wealth simulator
  ├── Alert system (web push + in-app)
  ├── Multi-currency display
  └── Weekly email digest (Resend)
        │
        ▼
Phase 5 (RAG + Data Pipeline)
  ├── pgvector corpus (50–100 PH financial docs)
  ├── RAG retrieval in advisor
  ├── Automated price/CPI feeds (Edge Functions)
  └── PDF report export
        │
        ▼
Phase 6 (Scale + Mobile)
  ├── Performance optimization (< 2s P95)
  ├── PWA / React Native evaluation
  ├── Stripe billing (Free + Pro tiers)
  ├── Advanced analytics (Markowitz, Sharpe)
  └── Sentry + PostHog + monitoring
```

---

## Per-Phase File Structure

Each phase folder contains:

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_GUIDE.md` | Full BuildCraft-format implementation instructions |
| `SETUP_CHECKLIST.md` | Action items for API keys, accounts, configuration |
| `TESTING_GUIDE.md` | What to test, how to test, expected results |
| `ENV_VARIABLES.md` | Environment variables needed for this phase |

---

## Auth Decision: Clerk (Not Supabase Auth)

The original spec called for Supabase Auth. This implementation uses **Clerk** instead:

| Concern | How It's Handled |
|---------|-----------------|
| **User signup/login** | Clerk handles all auth UI + backend |
| **Google OAuth** | Configured in Clerk dashboard |
| **JWT for Supabase RLS** | Clerk JWT template syncs `sub` claim to Supabase `auth.uid()` |
| **User sync to `profiles` table** | Clerk webhook → `/api/webhooks/clerk` → upserts `profiles` row |
| **Session management** | Clerk middleware protects routes, provides `userId` server-side |
| **Signup/Login slides** | Clerk's custom sign-up wrapped in AETHER's glassmorphic split-screen layout |

---

## Design System Quick Reference

| Token | Value |
|-------|-------|
| `--bg-primary` | `#08080f` |
| `--bg-surface` | `#13131f` |
| `--bg-elevated` | `#1a1a2e` |
| `--accent-primary` | `#7c3aed` |
| `--accent-bright` | `#a855f7` |
| `--text-primary` | `#f1f0ff` |
| `--text-secondary` | `#9492b0` |
| `--text-muted` | `#4e4c6a` |
| `--glass-bg` | `rgba(255,255,255,0.04)` |
| `--glass-border` | `rgba(168,85,247,0.18)` |
| Font display | Syne (400/600/700/800) |
| Font body | DM Sans (300/400/500) |

---

## How to Execute

1. **Start with Phase 1.** Read `phase-1-foundation/SETUP_CHECKLIST.md` first for required accounts/keys.
2. **Complete the SETUP_CHECKLIST** before running any code generation.
3. **Follow IMPLEMENTATION_GUIDE.md** step by step within each phase.
4. **Run the VERIFICATION CHECKLIST** at the end of each phase before proceeding.
5. **Do NOT skip phases.** Each phase depends on the previous one.
6. **After Phase 3 (Week 12):** You have an MVP ready for launch.
