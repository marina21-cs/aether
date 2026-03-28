# PROJECT AETHER
**Next-Generation Wealth Management Platform**
Revised Project Specification — Version 4.1.0 · Production Blueprint

| Field | Value |
|---|---|
| **Project Lead** | Lorenz Gabriel Velasco |
| **Target Market** | PH (Filipino Retail Investors) |
| **Platform** | Web-only (1440px-first, responsive to 768px) |
| **Document Status** | Ready for Development |
| **Last Updated** | March 2026 |
| **Spec Methodology** | SpecCraft Discovery + FeatureSpec Complexity Assessment |

---

## 01 · Executive Summary

**Product:** AETHER — A unified wealth intelligence platform that gives Filipino retail investors a real-time, mathematically transparent view of their entire net worth across all asset classes, with contextual financial literacy guidance built into every decision surface.

**Problem:** Filipino investors manage wealth across disconnected silos — COL Financial, Binance, BDO savings, a condo in BGC — with no single tool that unifies, analyzes, and advises in Philippine context. Global tools (Mint, Personal Capital) are blind to PSE data, BSP rates, and Philippine CPI. Even when data is available, most users still struggle to translate financial jargon into confident action.

**Solution:** A web-first dashboard that consolidates every peso of wealth into one view, surfaces hidden fee erosion, projects future net worth with visible math, and provides AI-powered advice grounded in the user's actual portfolio and Philippine market conditions. Aether adds a built-in literacy layer that explains terms, trade-offs, and risk in plain language at the moment users need it.

**Unique Angle:** Glass Box transparency + contextual financial literacy. Every prediction shows the formula. Every recommendation shows the reasoning. Every critical metric can be explained in plain language. No black boxes.

---

### What Aether IS vs. What It Is NOT

| What Aether **IS** | What Aether is **NOT** |
|---|---|
| A unified net worth tracker across PH asset classes | A trading terminal or brokerage platform |
| A transparent, math-visible forecasting engine | A black-box robo-advisor |
| An AI advisor grounded in your actual portfolio | A generic chatbot with financial opinions |
| A contextual financial literacy system tied to your real data | A static finance course marketplace |
| A Philippines-first product with local context | A US product poorly localized |
| A web dashboard optimized for data density | A mobile app (V1) |

---

## 02 · The Problem — Why Aether Must Exist

### The Core Problem: The Fragmentation Paradox

Filipino investors today manage their wealth across fundamentally disconnected silos: a COL Financial account here, a BTC wallet there, a property in Bulacan valued only by memory, and a savings account losing ground to 6%+ CPI inflation. No single tool exists to unify, analyze, and intelligently advise on this fragmented landscape — and global platforms are blind to Philippine-specific financial context (BSP rates, PSE data, REIT performance, local inflation).

### The Six Pain Points

| # | Pain Point | Impact |
|---|---|---|
| 1 | **Asset Fragmentation** — No single source of truth across PSE, crypto, real estate, cash, UITFs | Every net worth calculation is manual, error-prone, and incomplete |
| 2 | **Geographic AI Blindness** — Global AI tools don't understand BSP rates, PSEi REITs, or PH inflation dynamics | Generic advice that doesn't account for local market conditions |
| 3 | **Black-Box Advisory** — Existing tools issue recommendations with no mathematical justification | Trust deficit — sophisticated Filipino investors want to see the math |
| 4 | **Hidden Wealth Erosion** — UITF fees of 1.5%, savings at 0.25% vs. 6.1% CPI — invisible losses | Users unknowingly lose 5%+ purchasing power annually |
| 5 | **Decision Paralysis** — No way to safely test "What if I sell stocks and buy a rental property?" | Major financial decisions made with incomplete data |
| 6 | **Financial Literacy Gap** — Investors can view numbers but cannot interpret concepts like variance, real returns, and fee drag in PH context | Data exists, but confidence and action quality remain low |

---

## 03 · Target Users

### Primary Persona: The Sophisticated Filipino Investor

- **Age:** 28–45
- **Profile:** PSE account holder, crypto-curious, some real estate, multiple bank accounts
- **Current workflow:** Spreadsheets, multiple broker apps, mental math
- **Net worth range:** ₱1M–₱20M across all assets
- **Pain:** Spends 2+ hours/month manually reconciling across platforms
- **Frequency:** Checks portfolio daily, deep analysis weekly

### Secondary Persona: The High Net Worth Individual (HNI)

- **Profile:** Multiple asset classes including real property, UITFs, time deposits, foreign holdings
- **Pain:** No tool handles the breadth of their portfolio
- **Frequency:** Weekly check-ins, monthly deep reviews
- **Tier:** Pro subscriber (₱499/month)

### Tertiary Persona: The Emerging Investor (Learning-Oriented)

- **Profile:** Early-stage investor with 1-3 asset classes and strong intent to learn before scaling positions
- **Pain:** Understands balances but not the "why" behind inflation-adjusted returns, risk, and fees
- **Frequency:** 3-4 sessions/week, mostly interpretation and planning
- **Tier:** Starts on Free, converts to Pro when scenario simulation and deeper explainers become needed

### Anti-Persona (Not Our User for V1)

- Day traders needing real-time order execution
- Absolute beginners with zero investable assets (Aether is still a wealth platform first, not a standalone beginner finance school)
- Users who only want expense tracking (this is Mint territory, not ours)

---

## 04 · Competitive Differentiation

| Capability | Mint/YNAB | COL Fin. | GCash Invest | ChatGPT | **AETHER** |
|---|:---:|:---:|:---:|:---:|:---:|
| PH-Localized AI Advisory | ✗ | ✗ | ✗ | Partial | ✓ |
| Cross-Asset Net Worth View | Partial | ✗ | ✗ | ✗ | ✓ |
| Transparent ML Models (Glass Box) | ✗ | ✗ | ✗ | ✗ | ✓ |
| Historical PSEi Benchmarking | ✗ | ✓ | ✗ | ✗ | ✓ |
| Monte Carlo Simulator | ✗ | ✗ | ✗ | ✗ | ✓ |
| Inflation-Adjusted Returns | ✗ | ✗ | ✗ | ✗ | ✓ |
| Hidden Fee Detection | ✗ | ✗ | ✗ | ✗ | ✓ |
| Contextual Financial Literacy (in-workflow) | ✗ | ✗ | ✗ | Partial | ✓ |
| Real Estate Tracking | ✗ | ✗ | ✗ | ✗ | ✓ (manual) |

### Unfair Advantages

1. **Glass Box Transparency** — Every prediction shows σp² = wᵀΣw, the Monte Carlo bands, and the assumptions. Category-defining. No competitor does this.
2. **Philippine Context by Default** — BSP rates, PSA CPI, PSEi benchmarks baked into every calculation and AI response. Not an addon — the foundation.
3. **Omni-Asset Architecture** — PSE equities, crypto, real estate, UITFs, time deposits, cash, gold — all in one schema from day one.
4. **AI That Knows Your Portfolio** — The advisor sees your actual holdings, risk profile, and market conditions before answering. This is not ChatGPT with a finance prompt.
5. **Literacy Embedded in Workflow** — Aether teaches while users make real decisions: metric explainers, plain-language risk interpretation, and PH-specific examples anchored to the portfolio.

---

## 05 · Complete Feature Definitions

### 5.1 · MVP Features (Must Ship — Phase 1–3, Weeks 1–12)

#### FEATURE 1: Omni-Asset Net Worth Dashboard
**Complexity:** Large · **Priority:** P0 — This IS the product

The master financial dashboard that consolidates every asset class and liability into a single, real-time net worth figure in PHP.

- **Net worth hero:** Single large number (₱4,287,650) always visible, with daily/weekly/monthly change
- **Holdings data table:** Horizontal rows (not card grid) — ticker, quantity, value, allocation %, daily change
- **Allocation view:** Stacked horizontal bar by asset class (not donut — too much screen investment for one data point)
- **Liabilities tracker:** Credit cards, loans, mortgages — subtracted from gross assets
- **Historical net worth chart:** Line chart with PSEi benchmark ALWAYS visible as gray reference line
- **Currency:** All values displayed in PHP (base currency), with original currency shown on hover for foreign assets
- **Layout:** Three-panel Bloomberg pattern — 240px sidebar + main content + collapsible 320px right rail (AI advisor)

**Data Sources (MVP):**
- Manual entry for all asset classes
- CSV import (COL Financial transaction format)
- CoinGecko free API for crypto prices (rate-limited, cached)
- PSE Edge delayed data (15-min) for PSE stock prices
- BSP reference exchange rates for USD/PHP, SGD/PHP, HKD/PHP

#### FEATURE 2: Data Ingestion — CSV Upload + Manual Entry
**Complexity:** Medium · **Priority:** P0

- **CSV upload:** User exports from COL Financial → uploads CSV → Aether parses and imports holdings/transactions
- **Manual entry:** Clean form for all asset classes — stocks, crypto, real estate, cash, UITFs, gold, time deposits
- **Real estate valuation:** Manual entry with optional BIR zonal value lookup as sanity-check reference. Displayed as "user-estimated value" — no implied precision
- **Crypto price sync:** CoinGecko free tier, cached for 5 minutes, 50 requests/minute limit
- **PSE price sync:** PSE Edge delayed data, cached for 15 minutes
- **Audit log:** Every data change (automated or manual) logged with timestamp, source, and before/after values for user review

#### FEATURE 3: AI Financial Advisor (Smart Prompting)
**Complexity:** Medium · **Priority:** P0

A conversational AI advisor that answers financial questions with full context of the user's actual portfolio, Philippine market conditions, and risk profile. **No RAG for MVP** — uses smart system prompting with injected context.

- **System prompt injection:** User's current holdings, allocation percentages, risk tolerance, current BSP rate, latest PH CPI figure, PSEi level — injected into every LLM call
- **Provider:** Anthropic Claude API (or OpenAI as fallback). One provider, not both.
- **Interface:** Right-rail panel on dashboard (320px collapsed, expandable to full page). Terminal-style — NOT chat bubbles. Structured responses: Answer → Data → Sources → Confidence
- **Streaming:** Server-sent events for token-by-token response rendering
- **Context window management:** Portfolio summary + last 5 conversation turns + market context = ~4K tokens of system context
- **Literacy mode:** Every response supports "Explain in plain language" and "Explain with PH example" variants without losing numerical accuracy
- **Jargon guardrail:** If advanced terms (variance, Sharpe ratio, fee drag) appear, the advisor auto-attaches short definitions and practical interpretation
- **Guardrails:** Disclaimer on every response: "AETHER provides analysis, not licensed financial advice. Consult a registered financial advisor for personal decisions."
- **Rate limiting:** 20 queries/day on Free tier, 100/day on Pro tier
- **Cost management:** Cache identical queries for 1 hour. Average cost per query: ~$0.01–0.03

#### FEATURE 4: Glass Box Predictive Engine
**Complexity:** Large · **Priority:** P1 (ships in MVP but can be simplified)

Transparent quantitative forecasting that SHOWS the mathematical model — the defining feature.

- **Portfolio variance:** σp² = wᵀΣw displayed with the actual covariance matrix from the user's holdings
- **Monte Carlo simulation:** 1,000 paths over 10-year horizon using Geometric Brownian Motion. Runs in TypeScript on the client using `mathjs` (no Python backend needed for MVP)
- **Visual output:** Fan chart with 10th/50th/90th percentile bands. PSEi benchmark line always visible
- **Assumptions panel:** Editable — expected return, volatility, correlation. User can adjust and see projections update in real-time
- **Math visibility:** Variance formula, covariance matrix heatmap, and assumption inputs are shown BY DEFAULT (not hidden behind "show details")
- **Proxy returns:** For illiquid assets (real estate) where daily prices don't exist, use PSA property price index as proxy

#### FEATURE 5: Hidden Fee Analyzer
**Complexity:** Small · **Priority:** P1

- Scans all holdings for known fee structures (UITF management fees, credit card interest rates)
- Hero metric: "Your fees will cost you ₱X over 10 years" using compound cost formula: P × ((1+r)^n − (1+r−f)^n)
- Flags fees above benchmark thresholds (e.g., UITF > 1% management fee)
- Severity badges: Critical / Warning / Info
- Suggests lower-cost alternatives (e.g., FMETF vs. actively managed equity UITF)

#### FEATURE 6: Real-Return Calculator
**Complexity:** Small · **Priority:** P1

- Adjusts all returns against Philippine CPI: Real Return = ((1 + Nominal) / (1 + Inflation)) − 1
- CPI data: PSA publicly available reports, updated monthly (manual update for MVP, automated in V2)
- Flags savings accounts and time deposits with negative real returns
- Side-by-side nominal vs. real return for every holding

#### FEATURE 7: Financial Literacy Layer (Contextual Learn-While-Doing)
**Complexity:** Medium · **Priority:** P1

Embedded literacy that improves decision quality inside core workflows, without turning the product into a generic course platform.

- **Inline explainers:** Any key metric (allocation %, volatility, real return, fee drag) is clickable for a plain-language definition + "why this matters"
- **Decision cards:** For common user decisions (rebalance, add cash, reduce fees), show trade-offs, risk reminders, and confidence cues
- **PH context examples:** Explainers use BSP/PSA/PSE examples rather than US-only assumptions
- **Adaptive depth:** Two modes in settings — Concise (one-screen summary) and Guided (step-by-step interpretation)
- **Weekly literacy digest:** In-app recap of 3 concepts based on recent user behavior and portfolio composition

#### FEATURE 8: Historical Performance Tracking
**Complexity:** Medium · **Priority:** P1

- Time-series net worth chart with adjustable range: 1M, 3M, 6M, 1Y, 3Y, All
- PSEi benchmark ALWAYS visible as gray reference line
- BTC as optional secondary benchmark (dashed)
- Transaction annotations on the timeline (buy/sell events marked)
- Period summary: total return, return vs. PSEi, return vs. BTC
- Monthly breakdown data table with change % and benchmark comparison
- Downloadable as CSV or PDF

---

### 5.2 · V1.1 Features (Post-Launch, Weeks 13–20)

#### FEATURE 9: Sandbox Wealth Simulator
**Complexity:** Large

"What-if" simulation environment isolated from real portfolio data.
- Scenario builder: adjust allocations, add/remove assets, change savings rate, add one-time events
- Projects multi-year net worth trajectory with Monte Carlo confidence bands
- Save/compare multiple scenarios
- Event annotations: "Bought condo," "Increased SIP by ₱10K"

#### FEATURE 10: PSEi & Benchmark Alert System
**Complexity:** Medium

- Push notifications (web) and in-app alerts
- Trigger types: stock price target, PSEi threshold, BSP rate change, crypto volatility, portfolio drop
- Toggle-based alert management with alert history
- Max 10 active alerts on Free, 50 on Pro

#### FEATURE 11: Multi-Currency Display
**Complexity:** Small

- Toggle display currency: PHP, USD, SGD
- BSP reference rates for conversion (daily update)
- Foreign holdings show original currency + PHP equivalent

---

### 5.3 · V2 Features (Backlog — When Revenue Justifies)

| Feature | Complexity | Trigger |
|---|---|---|
| **RAG AI Advisor** — pgvector knowledge base with curated BSP/PSE/SEC corpus (50–100 docs) | Large | When monthly update cadence is established and user queries reveal retrieval gaps |
| **Guided Learning Paths + Readiness Scoring** — personalized literacy tracks and comprehension checkpoints | Medium | When >30% of WAU engage with literacy cards weekly |
| **Automated Broker Sync** — BSP Open Finance Framework integration | Large | When BSP Open Finance APIs stabilize and COL/FirstMetro participate |
| **React Native Mobile App** — or PWA with full offline support | Epic | When web DAU exceeds 1,000 and mobile usage data justifies |
| **Advanced Portfolio Optimization** — Markowitz efficient frontier, Black-Litterman model | Medium | When Pro subscriber base exceeds 100 |
| **Social/Sharing** — Share portfolio performance (anonymized) with trusted contacts | Medium | Community demand signal |
| **Emergency Access** — Trusted contact read-only access with 7-day inactivity trigger | Medium | When user base includes HNI segment |
| **Automated CPI/Market Data Pipeline** — Scheduled scraping/API pulls for PSA, PSE, BSP data | Medium | When manual monthly updates become a bottleneck |

### 5.4 · Anti-Features (Explicitly Out of Scope, Forever)

- **Trade execution** — Aether will NEVER place trades. It is analytics-only. This avoids SEC/BSP licensing.
- **Expense tracking** — This is not Mint. We track assets and investments, not daily spending.
- **Crypto trading** — No swap, no DEX, no wallet connect. Price display only.
- **Robo-advisory** — We show the math and let the user decide. We don't auto-rebalance portfolios.
- **Generic course marketplace** — Literacy is contextual and portfolio-linked, not a standalone textbook catalog.

### 5.5 · Financial Literacy Operating Model (MVP)

Financial literacy is a product system, not just UI copy. This model defines what gets taught, when it appears, and how quality is controlled.

#### Literacy Objectives (User Outcomes)

- Users can explain the difference between nominal and real return after seeing their own portfolio data.
- Users can identify at least one high-fee holding and understand long-term fee drag impact.
- Users can interpret basic risk signals (volatility bands, downside scenarios) before making allocation changes.

#### Trigger-to-Content Rules

- **Real-return trigger:** If an asset has negative real return for 2 consecutive months, show inflation explainer + action card.
- **Fee trigger:** If `annual_fee_pct > 0.01`, show fee drag explainer + lower-cost alternatives card.
- **Risk trigger:** If portfolio concentration exceeds 35% in a single asset class, show diversification explainer + scenario suggestion.
- **Volatility trigger:** If projected 10th percentile drawdown crosses user risk tolerance threshold, show risk interpretation card.

#### Content Quality Standards

- **Readability:** Concise mode aims for Grade 8-10 reading level; Guided mode can use advanced terms with inline definitions.
- **Local relevance:** Examples must use PH context (BSP rate moves, PSA CPI, PSEi comparisons) when available.
- **Source traceability:** Literacy cards include a short source label (Model, Portfolio Data, BSP/PSA/PSE reference).
- **No certainty language:** Cards and AI explanations avoid promises (for example: no "guaranteed" or "risk-free").

#### Governance

- Quarterly editorial review for top 30 literacy cards by usage.
- Finance domain reviewer signs off on high-impact cards (risk, inflation, fee guidance).
- Any card with poor helpfulness score is revised within one sprint.

---

## 06 · Technical Architecture

### 6.1 · Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR for SEO on landing/marketing pages, RSC for dashboard performance, API routes for backend logic — one codebase, one deployment |
| **Language** | TypeScript (strict mode) | End-to-end type safety, single language across frontend and backend |
| **Styling** | Tailwind CSS 4 | Utility-first, matches enterprise design system, fast iteration, minimal CSS bundle |
| **UI Components** | shadcn/ui + custom components | Accessible, unstyled primitives that match the enterprise terminal aesthetic from the design system |
| **Charts** | Recharts (primary) + D3.js (Glass Box) | Recharts for standard line/bar charts, D3 for the Monte Carlo fan chart and covariance heatmap |
| **Math** | mathjs | Client-side matrix operations and Monte Carlo simulation — eliminates need for Python backend |
| **Database** | Supabase (PostgreSQL 16) | Managed PostgreSQL with pgvector extension, Row-Level Security, built-in auth, realtime subscriptions — replaces 4 separate services |
| **Auth** | Supabase Auth | Email/password + Google OAuth. JWT with RLS. Magic link for passwordless option |
| **Vector Store** | pgvector (V2) | Same PostgreSQL instance — no separate vector DB infrastructure needed |
| **AI Provider** | Anthropic Claude API (via Vercel AI SDK) | Streaming responses, structured output, tool calling. Vercel AI SDK handles SSE, token counting, and provider abstraction |
| **File Storage** | Supabase Storage | CSV uploads, exported reports, profile images |
| **Edge Functions** | Supabase Edge Functions (Deno) | Scheduled jobs: price cache refresh, CPI update, alert checks |
| **Hosting** | Vercel | Zero-config Next.js deployment, edge network, preview deployments, analytics |
| **DNS/CDN** | Cloudflare (free tier) | DNS, DDoS protection, edge caching for static assets |
| **Email** | Resend | Transactional emails: welcome, alerts, weekly digest. 3,000/month free |
| **Analytics** | PostHog (self-serve) | Product analytics, feature flags, session replay. Free tier generous |
| **Error Tracking** | Sentry | Error monitoring with source maps. Free tier covers MVP usage |

### 6.2 · Why This Stack (Decision Log)

**Why NOT FastAPI + Python backend?**
The original spec called for FastAPI + Redis + Celery + PostgreSQL — four services to deploy, monitor, and maintain. For a solo/2-person team shipping in 12 weeks, this is overengineered. Supabase Edge Functions + Next.js API routes cover all MVP backend needs. The Glass Box math (matrix operations, Monte Carlo) runs fine in TypeScript via `mathjs`. If computation becomes a bottleneck at scale, add a Python microservice in V2 — but don't build it before you have users.

**Why NOT LangChain + LlamaIndex?**
In 2026, LangChain is increasingly seen as over-abstracted for focused use cases. Aether's AI advisor has one job: answer financial questions with portfolio context. The Vercel AI SDK provides streaming, structured output, and provider switching (Anthropic ↔ OpenAI) with far less complexity. RAG retrieval (V2) can be added as a simple pgvector similarity search in a Supabase RPC function — no orchestration framework needed.

**Why Supabase over Firebase/Appwrite?**
PostgreSQL is the right database for financial data (ACID compliance, complex joins, pgvector for V2 RAG). Supabase gives you PostgreSQL with RLS, auth, realtime, storage, and edge functions in one platform. Firebase's Firestore is document-based and doesn't support the relational queries Aether needs (JOIN assets ON transactions, WHERE user_id with RLS).

**Why Vercel over Railway/Render?**
Next.js on Vercel is zero-config. Preview deployments per PR, edge network, built-in analytics. The Next.js + Vercel combination is the most battle-tested deployment path in the ecosystem.

### 6.3 · System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Next.js SSR  │  │  API Routes  │  │  Edge Middleware   │  │
│  │  (Dashboard)  │  │  (/api/v1/*) │  │  (Auth + Rate Limit)│ │
│  └──────┬───────┘  └──────┬───────┘  └───────────────────┘  │
│         │                  │                                  │
└─────────┼──────────────────┼─────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                       SUPABASE                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │PostgreSQL │  │   Auth   │  │ Storage  │  │  Realtime   │  │
│  │+ pgvector │  │  + RLS   │  │  (CSV)   │  │(dashboard) │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             Edge Functions (Deno)                     │   │
│  │  • Price cache refresh (every 15 min)                │   │
│  │  • CPI data update (monthly)                         │   │
│  │  • Alert threshold checks (every 5 min)              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌──────────────┐   ┌──────────────────┐
│  Anthropic   │   │  External APIs   │
│  Claude API  │   │  • CoinGecko     │
│  (AI Advisor)│   │  • PSE Edge      │
│              │   │  • BSP Rates     │
└──────────────┘   └──────────────────┘
```

### 6.4 · API Design

All API routes under `/api/v1/`. Authentication via Supabase JWT in Authorization header. Rate limiting enforced at middleware level.

| Method | Endpoint | Purpose | Auth | Rate Limit |
|---|---|---|---|---|
| GET | `/api/v1/portfolio/net-worth` | Total net worth + breakdown by class + period change | Required | 60/min |
| GET | `/api/v1/portfolio/holdings` | All holdings with current values, paginated | Required | 60/min |
| GET | `/api/v1/portfolio/allocation` | Allocation by class, sector, geography, liquidity | Required | 60/min |
| POST | `/api/v1/portfolio/assets` | Create a new asset (manual entry) | Required | 30/min |
| PUT | `/api/v1/portfolio/assets/:id` | Update asset details or value | Required | 30/min |
| DELETE | `/api/v1/portfolio/assets/:id` | Remove an asset | Required | 10/min |
| POST | `/api/v1/data/upload-csv` | Upload and parse COL Financial CSV | Required | 5/min |
| GET | `/api/v1/data/audit-log` | Data change history, paginated | Required | 30/min |
| POST | `/api/v1/advisor/ask` | Send question to AI advisor, returns streaming response | Required | Free: 20/day, Pro: 100/day |
| GET | `/api/v1/literacy/modules` | Fetch contextual literacy cards by topic and user portfolio gaps | Required | 60/min |
| POST | `/api/v1/literacy/explain` | Explain a metric or term in plain language with PH examples | Required | 30/min |
| GET | `/api/v1/analytics/real-return` | Inflation-adjusted return per asset | Required | 30/min |
| GET | `/api/v1/analytics/fee-scan` | Fee analysis with 10-year projections | Required | 30/min |
| GET | `/api/v1/analytics/glass-box` | Portfolio variance, covariance matrix, Monte Carlo data | Required | 10/min |
| GET | `/api/v1/performance/history` | Time-series net worth with benchmark comparisons | Required | 30/min |
| PUT | `/api/v1/user/risk-profile` | Update risk tolerance | Required | 10/min |
| GET | `/api/v1/user/settings` | User preferences, profile | Required | 30/min |
| GET | `/api/v1/market/prices` | Cached current prices (PSE, crypto, forex) | Required | 120/min |

**Error format (consistent across all endpoints):**
```json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "Asset with ID xyz does not exist or does not belong to this user.",
    "status": 404
  }
}
```

---

## 07 · Database Schema

All tables enforce Row-Level Security (RLS). Users can only access their own data. All timestamps are `TIMESTAMPTZ` in UTC.

### Table: `profiles`
Extends Supabase Auth `auth.users` with application data.

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | References `auth.users(id)` | Supabase Auth UID |
| full_name | TEXT | Optional | Display name |
| risk_tolerance | TEXT | `CHECK (risk_tolerance IN ('conservative','moderate','aggressive'))`, default `'moderate'` | Investment risk profile |
| literacy_mode | TEXT | `CHECK (literacy_mode IN ('concise','guided'))`, default `'guided'` | Controls educational detail level across UI and AI responses |
| preferred_language | TEXT | `CHECK (preferred_language IN ('english','taglish'))`, default `'english'` | Preferred language style for explainers |
| base_currency | TEXT | `CHECK (base_currency IN ('PHP','USD','SGD'))`, default `'PHP'` | Display currency |
| subscription_tier | TEXT | `CHECK (subscription_tier IN ('free','pro'))`, default `'free'` | Billing tier |
| onboarding_complete | BOOLEAN | Default `false` | Has user completed setup wizard |
| created_at | TIMESTAMPTZ | Default `now()` | Account creation |
| updated_at | TIMESTAMPTZ | Default `now()` | Last profile update |

### Table: `assets`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | Asset identifier |
| user_id | UUID FK | References `profiles(id)` ON DELETE CASCADE | Owner |
| asset_class | TEXT | `CHECK (asset_class IN ('pse_stock','global_stock','crypto','real_estate','uitf','cash','gold','time_deposit','other'))` | Asset category |
| ticker_or_name | TEXT | NOT NULL | Ticker symbol or descriptive name (e.g., "JFC", "Bitcoin", "Condo BGC") |
| quantity | NUMERIC(18,8) | NOT NULL | Supports crypto fractional precision |
| avg_cost_basis | NUMERIC(18,8) | Optional | Average buy price in native currency |
| current_value_php | NUMERIC(18,2) | NOT NULL | Latest value in PHP |
| native_currency | TEXT | Default `'PHP'` | ISO 4217 code of the asset's native currency |
| is_manual | BOOLEAN | Default `true` | True if manually entered, false if from CSV/API |
| annual_fee_pct | NUMERIC(5,4) | Optional | Annual management fee (for UITFs, mutual funds) |
| notes | TEXT | Optional | User annotation |
| created_at | TIMESTAMPTZ | Default `now()` | When asset was added |
| updated_at | TIMESTAMPTZ | Default `now()` | Last value update |

### Table: `liabilities`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | Liability identifier |
| user_id | UUID FK | References `profiles(id)` ON DELETE CASCADE | Owner |
| liability_type | TEXT | `CHECK (liability_type IN ('credit_card','personal_loan','housing_loan','car_loan','other'))` | Category |
| name | TEXT | NOT NULL | e.g., "BDO Credit Card", "Pag-IBIG Housing Loan" |
| outstanding_balance | NUMERIC(18,2) | NOT NULL | Current balance in PHP |
| interest_rate_pct | NUMERIC(5,4) | Optional | Annual interest rate |
| monthly_payment | NUMERIC(18,2) | Optional | Regular payment amount |
| notes | TEXT | Optional | |
| created_at | TIMESTAMPTZ | Default `now()` | |
| updated_at | TIMESTAMPTZ | Default `now()` | |

### Table: `transactions`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | Transaction ID |
| user_id | UUID FK | References `profiles(id)` ON DELETE CASCADE | Owner |
| asset_id | UUID FK | References `assets(id)` ON DELETE CASCADE | Related asset |
| tx_type | TEXT | `CHECK (tx_type IN ('buy','sell','dividend','rent_income','fee','deposit','withdrawal'))` | |
| amount_php | NUMERIC(18,2) | NOT NULL | PHP equivalent at time of transaction |
| price_per_unit | NUMERIC(18,8) | Optional | In asset native currency |
| quantity | NUMERIC(18,8) | Optional | Units transacted |
| tx_date | TIMESTAMPTZ | NOT NULL | When the transaction occurred |
| source | TEXT | `CHECK (source IN ('manual','csv_import','api_sync'))` | How this data entered the system |
| notes | TEXT | Optional | User annotation |
| created_at | TIMESTAMPTZ | Default `now()` | When record was created |

### Table: `audit_log`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | |
| user_id | UUID FK | References `profiles(id)` | Who |
| action | TEXT | NOT NULL | `'asset_created'`, `'asset_updated'`, `'csv_imported'`, `'price_refreshed'` |
| entity_type | TEXT | NOT NULL | `'asset'`, `'liability'`, `'transaction'` |
| entity_id | UUID | NOT NULL | ID of the affected record |
| old_value | JSONB | Optional | Previous state (for updates) |
| new_value | JSONB | Optional | New state (for updates) |
| ip_address | INET | Optional | Client IP (logged for compliance) |
| created_at | TIMESTAMPTZ | Default `now()` | When the action occurred |

### Table: `price_cache`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | |
| ticker | TEXT | UNIQUE NOT NULL | e.g., "JFC", "BTC", "USD/PHP" |
| price_php | NUMERIC(18,8) | NOT NULL | Latest price in PHP |
| source | TEXT | NOT NULL | `'pse_edge'`, `'coingecko'`, `'bsp_forex'` |
| fetched_at | TIMESTAMPTZ | Default `now()` | When this price was fetched |

### Table: `market_context` (V2 — RAG corpus)

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | |
| source_type | TEXT | NOT NULL | `'bsp_circular'`, `'pse_disclosure'`, `'sec_advisory'`, `'psa_cpi'`, `'news'` |
| title | TEXT | NOT NULL | Document title for citation |
| content | TEXT | NOT NULL | Full text content |
| content_vector | VECTOR(1536) | | OpenAI text-embedding-3-small |
| source_url | TEXT | Optional | Original URL for verification |
| published_date | DATE | NOT NULL | Publication date |
| tags | TEXT[] | | e.g., `['bsp','interest_rate','monetary_policy']` |
| created_at | TIMESTAMPTZ | Default `now()` | When ingested |

### Table: `literacy_progress`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID PK | Default `gen_random_uuid()` | Progress record ID |
| user_id | UUID FK | References `profiles(id)` ON DELETE CASCADE | Owner |
| module_slug | TEXT | NOT NULL | Unique module key (e.g., `real-return-basics`) |
| status | TEXT | `CHECK (status IN ('not_started','in_progress','completed'))`, default `'not_started'` | Completion status |
| quiz_score | NUMERIC(5,2) | Optional | Optional comprehension score (%) |
| last_viewed_at | TIMESTAMPTZ | Default `now()` | Last time module was opened |
| completed_at | TIMESTAMPTZ | Optional | Completion timestamp |
| created_at | TIMESTAMPTZ | Default `now()` | Record creation |

### Indexes

```sql
CREATE INDEX idx_assets_user ON assets(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_asset ON transactions(asset_id);
CREATE INDEX idx_transactions_date ON transactions(tx_date DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_price_cache_ticker ON price_cache(ticker);
CREATE INDEX idx_literacy_progress_user ON literacy_progress(user_id, module_slug);
-- V2: CREATE INDEX idx_market_context_vector ON market_context USING ivfflat (content_vector vector_cosine_ops);
```

---

## 08 · The Glass Box Mathematical Engine

### 8.1 · Portfolio Variance Model

```
σp² = wᵀ Σ w

Where:
  σp²  = portfolio variance (risk)
  w    = column vector of asset weights (sum = 1)
  wᵀ   = transpose of w
  Σ    = covariance matrix of historical asset returns
```

**Implementation (MVP):** Runs client-side in TypeScript using `mathjs`. The covariance matrix is computed from the `price_cache` historical data (stored as daily snapshots). For illiquid assets (real estate), use PSA property price index as a proxy for daily returns.

**Display:** The actual Σ matrix is rendered as a color-coded heatmap on the Glass Box screen. Users see the math, not just the result.

### 8.2 · Monte Carlo Simulation

```
S(t) = S(0) · exp( (μ - σ²/2) · t + σ · W(t) )

Where:
  S(0) = current portfolio value
  μ    = expected annual return (editable assumption)
  σ    = annual volatility (from covariance model)
  W(t) = Wiener process (standard Brownian motion)
  t    = time in years
```

**Default:** 1,000 paths, 10-year horizon. Returns 10th/50th/90th percentile bands.

**Implementation (MVP):** TypeScript + `mathjs` running in a Web Worker to avoid blocking the UI thread. Progressive rendering — show 100-path preview immediately, then refine to 1,000.

### 8.3 · Real Return

```
Real Return = ((1 + Nominal Return) / (1 + Inflation Rate)) − 1
```

**Source:** PSA Philippine CPI, updated monthly. For MVP, manually update the CPI value in a Supabase config table. Automate in V2.

### 8.4 · Fee Compound Cost

```
Cost of Fee = P × ((1 + r)^n − (1 + r − f)^n)

Where:
  P = principal, r = gross return, f = annual fee rate, n = years
```

---

## 09 · Security & Compliance

### 9.1 · Security Architecture (Production Tier)

| Control | Implementation |
|---|---|
| **Authentication** | Supabase Auth — email/password + Google OAuth, JWT with refresh tokens |
| **Authorization** | PostgreSQL Row-Level Security — every table policy: `auth.uid() = user_id` |
| **Encryption in transit** | TLS 1.3 enforced, HSTS headers via Vercel |
| **Encryption at rest** | Supabase encrypts all data at rest by default (AES-256) |
| **API rate limiting** | Edge middleware: per-user limits (see API table), IP-based throttling |
| **Input validation** | Zod schemas on every API route — type-safe request validation |
| **CORS** | Strict origin whitelist: production domain only |
| **Secrets management** | Vercel environment variables (encrypted) + Supabase vault for API keys |
| **Financial data** | No trade execution capability — read-only analytics. No brokerage API keys stored. CSV uploads only. |
| **Audit logging** | Every data mutation logged to `audit_log` table with user_id, IP, timestamp |
| **No plaintext financial data in API responses** | Cost basis and sensitive values encrypted at column level where needed |

### 9.2 · Regulatory Compliance

| Regulation | Compliance Approach |
|---|---|
| **Philippine Data Privacy Act (RA 10173)** | Right to deletion (account delete flow), breach notification within 72 hours, privacy policy with NPC-compliant disclosures |
| **NPC Registration** | Register as personal information controller prior to public launch |
| **BSP / SEC** | Aether is an analytics tool, NOT a licensed investment advisor or broker. No trades, no financial product sales. Disclaimers on all AI advisor responses. |
| **Cookie consent** | PostHog analytics requires opt-in consent banner |

### 9.3 · Read-Only Principle

**Aether cannot execute any financial transaction on the user's behalf.** This is a core architectural constraint, not just a policy. There are:
- No trade execution endpoints
- No brokerage write-API integrations
- No wallet-connect or DEX integrations
- No auto-rebalancing capability

This keeps Aether firmly in the "analytics tool" category, minimizing SEC/BSP licensing requirements.

---

## 10 · Development Roadmap

### 10.1 · Phased Plan (Solo/2-Person Team)

| Phase | Name | Weeks | Key Deliverables |
|---|---|---|---|
| **1** | **Foundation** | 1–4 | Supabase setup (schema, RLS, auth), Next.js scaffold, design system implementation (tokens from 00_DESIGN_SYSTEM.md), landing page, email registration page, onboarding flow (4 screens), literacy taxonomy + content standards v1 |
| **2** | **Core Dashboard** | 5–8 | Net worth dashboard (3-panel layout), manual asset entry, CSV import (COL parser), holdings table, allocation view, price cache (CoinGecko + PSE Edge + BSP forex), historical net worth chart |
| **3** | **Intelligence Layer** | 9–12 | AI advisor (smart prompting + streaming), Glass Box engine (variance model + Monte Carlo in Web Worker), fee analyzer, real-return calculator, financial literacy layer (inline explainers + weekly digest), literacy trigger engine + helpfulness feedback loop, performance history with PSEi benchmark, settings page |
| — | **MVP LAUNCH** | Week 12 | Public beta with core feature set. Free tier + Pro subscription (₱299–₱499/month) |
| **4** | **Simulator + Alerts** | 13–16 | Sandbox wealth simulator, alert system (web push + in-app), multi-currency display, weekly email digest |
| **5** | **RAG + Data Pipeline** | 17–24 | pgvector corpus (50–100 curated PH financial docs), RAG retrieval integrated into advisor, guided literacy paths, automated CPI/price feeds via Edge Functions, PDF report export |
| **6** | **Scale + Mobile** | 25–35 | Performance optimization, PWA or React Native evaluation, advanced portfolio analytics, BSP Open Finance integration (when available) |

### 10.2 · MVP Definition (Phase 1–3, 12 Weeks)

The MVP is a functional web dashboard that a Filipino investor can use to replace their portfolio spreadsheet:

- [x] User registration and secure login (Supabase Auth)
- [x] Manual asset entry for all asset classes
- [x] CSV import of COL Financial transaction history
- [x] Live PSE stock prices (delayed 15 min) and crypto prices (CoinGecko)
- [x] Net worth calculation with allocation breakdown
- [x] Historical net worth chart with PSEi benchmark
- [x] AI financial advisor (smart prompting, 20 queries/day free)
- [x] Glass Box: portfolio variance model with visible math
- [x] Glass Box: Monte Carlo simulation (1,000 paths, client-side)
- [x] Fee analyzer with 10-year compound cost projection
- [x] Real-return calculator (nominal vs. CPI-adjusted)
- [x] Contextual financial literacy cards for risk, fees, inflation, and diversification
- [x] AI advisor plain-language explain mode with PH examples
- [x] Performance history with monthly breakdown
- [x] Settings & profile management
- [x] Enterprise terminal-grade UI (dark theme first, light theme available)

### 10.3 · What's NOT in MVP (and Why)

| Feature | Why Deferred |
|---|---|
| Sandbox simulator | Important but not launch-blocking — users need the dashboard before they need hypotheticals |
| Alert system | Requires web push infrastructure; users need to see their data before they set thresholds |
| RAG knowledge base | Smart prompting covers 90% of value; RAG adds retrieval precision but needs a curated corpus first |
| Full course-style financial academy | High content and compliance overhead; start with contextual literacy in real workflows first |
| Automated broker sync | COL Financial has no API; BSP Open Finance is still maturing |
| Mobile app | Web-first confirms product-market fit before investing in native mobile |
| Emergency access | HNI feature — defer until that user segment is validated |

---

## 11 · Monetization

### Pricing Structure

| Tier | Price | Limits | Features |
|---|---|---|---|
| **Free** | ₱0 | 10 assets, 20 AI queries/day, 1 CSV import/month | Dashboard, manual entry, basic charts, Glass Box (100 paths), fee analyzer, core literacy cards |
| **Pro** | ₱299–₱499/month | Unlimited assets, 100 AI queries/day, unlimited CSV imports | Full Monte Carlo (1,000 paths), performance history, export PDF/CSV, priority AI, multi-currency, alerts (V1.1), advanced explainers and guided literacy mode |

### Revenue Math (Conservative)

| Metric | Value |
|---|---|
| Target Pro subscribers (6 months post-launch) | 200 |
| ARPU | ₱399/month |
| Monthly revenue | ₱79,800 (~$1,400 USD) |
| API costs (Anthropic + CoinGecko premium) | ~$200/month |
| Infrastructure (Vercel Pro + Supabase Pro) | ~$50/month |
| Net to fund development | ~$1,150/month |

Payment processing: **Stripe** (available in PH via Stripe Atlas or through PayMongo as local processor). Subscription management via Stripe Billing.

---

## 12 · Success Metrics

| Metric | Target (6 months) | How Measured |
|---|---|---|
| **Registered users** | 2,000+ | Supabase Auth count |
| **Weekly active users** | 400+ (20% of registered) | PostHog WAU |
| **Pro subscribers** | 200+ (10% conversion) | Stripe dashboard |
| **Avg. session duration** | > 5 minutes | PostHog |
| **AI advisor usage** | > 3 queries/session average | API route analytics |
| **CSV imports completed** | > 500 total | Audit log count |
| **Literacy card engagement** | > 35% of WAU open at least 1 explainer/week | PostHog custom events |
| **Concept comprehension lift** | +20% improvement from onboarding quiz to 30-day check-in | In-app literacy checkpoints |
| **Literacy helpfulness score** | >= 4.2/5 average | In-app thumbs-up/down + optional 5-point rating |
| **NPS score** | > 40 | In-app survey (quarterly) |
| **Dashboard load time** | < 2 seconds (P95) | Vercel Analytics |
| **API error rate** | < 0.5% | Sentry |

---

## 13 · Open Questions & Risks

### Open Questions

| # | Question | Default Decision | Revisit When |
|---|---|---|---|
| 1 | Should Glass Box Monte Carlo run server-side for heavier simulations (10K paths)? | Client-side (Web Worker) for MVP — fast enough for 1K paths | If users request 10K+ paths or client devices struggle |
| 2 | Which AI provider — Anthropic or OpenAI? | Anthropic Claude (better at financial reasoning, lower hallucination) | If Anthropic pricing becomes unfavorable or Claude quality drops |
| 3 | PayMongo vs. Stripe for PH payment processing? | Stripe (broader feature set, subscription billing built-in) | If Stripe PH onboarding is blocked — PayMongo is the fallback |
| 4 | PSE Edge data access — free tier sufficient? | Yes (delayed data acceptable for portfolio tracking) | If users demand real-time for active PSE positions |
| 5 | BIR zonal value API — does a public one exist? | No reliable API — use a static lookup table from BIR published data, updated annually | If BIR publishes an open data API |
| 6 | Should literacy default language be English, Taglish, or adaptive? | English default with user-selectable Taglish mode | After first 200 active users and feedback review |
| 7 | Should literacy cards include quick comprehension checks in MVP or V1.1? | V1.1 to avoid onboarding friction in initial launch | If comprehension lift metric is below +10% by month 2 |

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| PSE Edge changes free tier terms | Medium | High | Cache aggressively, fallback to Yahoo Finance PH data |
| CoinGecko rate limits on free tier | Medium | Medium | 5-minute cache, upgrade to paid when revenue covers it |
| AI advisor gives incorrect financial advice | Medium | High | Mandatory disclaimer on every response, confidence scoring, no auto-execution |
| Literacy content becomes generic or inaccurate | Medium | High | Editorial review workflow, cited PH sources, quarterly content QA with domain advisor |
| Low conversion from Free to Pro | High | High | Ensure free tier is useful enough to retain but limited enough to motivate upgrade |
| BSP Open Finance delays | High | Low | Not a dependency for MVP — CSV + manual entry is the launch strategy |
| Solo developer burnout on 12-week timeline | Medium | Critical | Ruthless MVP scope — cut any feature that isn't in the Phase 1–3 table |

---

## 14 · Recommended Skills

Skills from `.agent/skills/skills/[skill-id]/SKILL.md` the implementing agent should load at each phase:

### Phase 1: Foundation (Weeks 1–4)

| Skill | Purpose |
|---|---|
| `architecture` | Architectural decisions: project structure, folder conventions, ADR documentation |
| `nextjs-best-practices` | Next.js 15 App Router patterns, RSC, layouts, loading states, error boundaries |
| `nextjs-supabase-auth` | Supabase Auth integration with Next.js middleware, RLS setup, protected routes |
| `tailwind-patterns` | Tailwind CSS configuration, design token implementation, dark mode setup |
| `typescript-expert` | Strict TypeScript setup, type safety across frontend/backend, Zod schemas |
| `database-design` | PostgreSQL schema design, indexing strategy, RLS policy patterns |
| `frontend-design` | Enterprise terminal-grade UI implementation from design system tokens |
| `ui-ux-pro-max` | UX patterns for dashboard layout, data density, Bloomberg-style interface |
| `signup-flow-cro` | Email registration page optimization, conversion rate patterns |
| `onboarding-cro` | 4-screen onboarding wizard — risk profile, currency, welcome |

### Phase 2: Core Dashboard (Weeks 5–8)

| Skill | Purpose |
|---|---|
| `react-patterns` | Component architecture for dashboard — data tables, charts, sidebar navigation |
| `react-ui-patterns` | Reusable patterns for holdings table, allocation bar, net worth hero |
| `claude-d3js-skill` | D3.js for custom financial charts — net worth timeline, allocation visualization |
| `cc-skill-frontend-patterns` | State management, data fetching patterns, optimistic updates |
| `api-patterns` | REST API design for portfolio endpoints, pagination, error handling |
| `api-security-best-practices` | Rate limiting, input validation, CORS, JWT handling |
| `form-cro` | Manual asset entry forms — validation, UX, error states |
| `web-performance-optimization` | Dashboard load time < 2s, chart rendering performance, caching strategy |

### Phase 3: Intelligence Layer (Weeks 9–12)

| Skill | Purpose |
|---|---|
| `ai-wrapper-product` | AI advisor architecture — system prompts, cost management, rate limiting, caching |
| `ai-product` | LLM integration patterns, streaming UI, structured output, guardrails |
| `prompt-engineer` | System prompt design for financial advisor with portfolio context injection |
| `copywriting` | Plain-language explanation quality for finance concepts without losing precision |
| `i18n-localization` | English/Taglish literacy delivery strategy and terminology consistency |
| `clean-code` | Code quality for math-heavy Glass Box module — readable, testable |
| `testing-patterns` | Unit tests for Monte Carlo, variance calculation, fee analyzer math |
| `tdd-workflow` | Test-driven development for financial calculations (correctness is critical) |
| `cc-skill-security-review` | Security review before launch — auth flows, RLS policies, API surface |

### Phase 4–5: Post-Launch

| Skill | Purpose |
|---|---|
| `rag-implementation` | pgvector setup, document chunking, embedding, retrieval for V2 RAG advisor |
| `rag-engineer` | RAG architecture — corpus curation, retrieval strategy, citation generation |
| `stripe-integration` | Subscription billing, webhooks, customer portal, PH payment methods |
| `pricing-strategy` | Free vs. Pro tier optimization, conversion rate analysis |
| `launch-strategy` | Product launch playbook — PH tech community, Reddit r/phinvest, social |
| `seo-fundamentals` | Landing page SEO, meta tags, structured data for financial tool |
| `analytics-tracking` | PostHog event tracking plan — feature usage, conversion funnel, retention |
| `vercel-deployment` | Production deployment, preview environments, env management, monitoring |
| `plaid-fintech` | Reference for open banking integration patterns (when BSP Open Finance matures) |

---

## 15 · Design System Reference

All UI screens follow the Enterprise Terminal Grade design system documented in the design-stitch-prompts:

| # | Prompt File | Screen |
|---|---|---|
| 00 | `design-stitch-prompts/00_DESIGN_SYSTEM.md` | Master tokens — colors, typography, spacing, components |
| 01 | `design-stitch-prompts/01_LANDING_PAGE.md` | Marketing landing page |
| 02 | `design-stitch-prompts/02_ONBOARDING_AUTH.md` | Auth + onboarding wizard |
| 03 | `design-stitch-prompts/03_DASHBOARD_NET_WORTH.md` | Dashboard — net worth, holdings, allocation |
| 04 | `design-stitch-prompts/04_AI_ADVISOR_CHAT.md` | AI advisor (right rail + full page) |
| 05 | `design-stitch-prompts/05_GLASS_BOX_ENGINE.md` | Glass Box — variance, Monte Carlo, assumptions |
| 06 | `design-stitch-prompts/06_SANDBOX_SIMULATOR.md` | Sandbox simulator (V1.1) |
| 07 | `design-stitch-prompts/07_DATA_INGESTION.md` | CSV upload, manual entry, connected sources |
| 08 | `design-stitch-prompts/08_FEE_ANALYZER_REAL_RETURN.md` | Fee analyzer + real-return calculator |
| 09 | `design-stitch-prompts/09_PERFORMANCE_HISTORY.md` | Performance charts + alert management |
| 10 | `design-stitch-prompts/10_SETTINGS_PROFILE.md` | Settings, profile, danger zone |
| 11 | `design-stitch-prompts/11_EMAIL_REGISTRATION.md` | Pre-launch email capture page |

**Design principles:** Dark-mode-first (#0A0F1E base), 1440px primary width, Bloomberg/Robinhood Pro pattern (3-panel layout), data density over simplicity, math visible by default, PSEi benchmark always on charts.
