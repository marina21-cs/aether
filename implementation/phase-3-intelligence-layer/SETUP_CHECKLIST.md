# Phase 3 — Setup Checklist

Complete these items before starting Phase 3 implementation.

---

## Prerequisites

- [ ] **Phase 1 + Phase 2 fully complete** — All verification checks pass
- [ ] Dashboard renders with holdings, allocation, net worth
- [ ] Manual entry and CSV import working
- [ ] Price cache operational (CoinGecko + PSE + BSP forex)
- [ ] All API routes functional with auth

---

## 1. API Keys & External Services

### OpenRouter (AI Advisor)
- [ ] Create account at [openrouter.ai](https://openrouter.ai)
- [ ] Go to Keys → Create new key
- [ ] Copy API key → `OPENROUTER_API_KEY`
- [ ] Add credits (pay-as-you-go)
- [ ] Browse available models at [openrouter.ai/models](https://openrouter.ai/models)
- [ ] Default model: `anthropic/claude-sonnet-4` — can be changed without code changes
- [ ] Estimated cost per query: ~$0.01–0.03 (varies by model)
- [ ] Test: Make a test API call to verify key works

### Vercel AI SDK
- [ ] Install: `pnpm add ai @ai-sdk/openai` (OpenRouter uses OpenAI-compatible API)
- [ ] Verify streaming works in Next.js API routes

---

## 2. Environment Variables to Add

```env
# Add to .env.local (in addition to Phase 1+2 variables)

# ============================================================
# OPENROUTER AI
# ============================================================
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxx

# AI Advisor Config
AI_MODEL=anthropic/claude-sonnet-4
AI_MAX_TOKENS=1024
AI_TEMPERATURE=0.3
AI_RATE_LIMIT_FREE=20      # queries per day (free tier)
AI_RATE_LIMIT_PRO=100       # queries per day (pro tier)
AI_CACHE_TTL=3600000         # 1 hour cache for identical queries (ms)

# ============================================================
# PHILIPPINE MARKET DATA
# ============================================================
# Current BSP overnight rate (update manually for MVP)
PH_BSP_RATE=6.25

# Current PH CPI inflation rate (update monthly from PSA)
PH_CPI_RATE=6.1

# Current PSEi level (cached, auto-updated by price cache)
# No env var needed — pulled from price_cache table
```

---

## 3. Dependencies to Install

```bash
# AI & Streaming
pnpm add ai @ai-sdk/openai              # Vercel AI SDK + OpenAI-compatible provider (for OpenRouter)

# Math & Computation
pnpm add mathjs                        # Matrix operations, Monte Carlo math
pnpm add @types/mathjs -D             # TypeScript types (if not bundled)

# Charts & Visualization
pnpm add d3                            # D3.js for Glass Box custom charts
pnpm add @types/d3 -D                 # TypeScript types for D3
# (Recharts already installed in Phase 2)

# PDF Export (for performance history download)
pnpm add jspdf jspdf-autotable        # PDF generation
```

---

## 4. Philippine Market Data to Prepare

Before the AI advisor can give contextualized advice, prepare this data:

- [ ] **BSP Overnight Rate** — Check latest from [bsp.gov.ph](https://www.bsp.gov.ph)
  - Current rate (as of your build date): ____%
  - Store in Supabase config table or env var

- [ ] **PH CPI Rate** — Check latest from [psa.gov.ph](https://psa.gov.ph)
  - Current CPI YoY: ____%
  - Store in Supabase config table or env var

- [ ] **PSEi Level** — Current composite index level
  - Should already be in price_cache from Phase 2
  - Verify: `SELECT price_php FROM price_cache WHERE ticker = 'PSEI'`

- [ ] **Common UITF fee rates** — Research for fee analyzer:
  - Equity UITFs: typically 1.0-2.0% management fee
  - Bond UITFs: typically 0.5-1.0%
  - Money market UITFs: typically 0.25-0.5%
  - Create a reference table of common UITF products and fees

---

## 5. AI System Prompt Draft

Draft the system prompt template (will be refined in implementation):

```
You are AETHER's AI financial advisor for Filipino investors.

PORTFOLIO CONTEXT:
- Total net worth: ₱{netWorth}
- Allocation: {allocationBreakdown}
- Risk tolerance: {riskTolerance}
- Top holdings: {topHoldings}

MARKET CONTEXT:
- BSP overnight rate: {bspRate}%
- PH CPI: {cpiRate}%
- PSEi level: {pseiLevel}

RULES:
1. Always ground advice in the user's actual portfolio
2. Reference Philippine-specific context (BSP, PSE, PH CPI)
3. Show the math behind any calculation
4. Never recommend specific buy/sell actions
5. Include confidence level: High / Medium / Low
6. Format: Answer → Data → Sources → Confidence

DISCLAIMER (append to every response):
"AETHER provides analysis, not licensed financial advice.
Consult a registered financial advisor for personal decisions."
```

---

## 6. Glass Box — Test Data

Prepare test scenarios for Monte Carlo validation:

- [ ] Simple 2-asset portfolio (BTC + JFC) with known returns
- [ ] Expected return and volatility values for common PH assets:
  - PSEi composite: ~8% avg annual return, ~18% volatility
  - BTC: ~40% avg annual return, ~70% volatility
  - PH time deposits: ~4% return, ~0.5% volatility
  - Real estate (PH): ~6% return, ~10% volatility
- [ ] Covariance matrix for test assets (at least 2x2)
- [ ] Expected Monte Carlo output range for validation

---

## 7. Pre-Implementation Verification

- [ ] OpenRouter API: Can you make a `POST /api/v1/chat/completions` call via OpenRouter and get a response?
- [ ] mathjs: Can you compute a 3x3 matrix multiplication in TypeScript?
- [ ] Web Workers: Does your Next.js setup support Web Workers?
- [ ] D3.js: Can you render a basic SVG chart in your React component?
- [ ] Streaming: Does Server-Sent Events work through `/api/v1/advisor/ask`?

---

**Once all checkboxes are checked, proceed to `IMPLEMENTATION_GUIDE.md`.**
