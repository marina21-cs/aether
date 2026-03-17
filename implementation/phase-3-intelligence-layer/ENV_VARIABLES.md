# Phase 3 — Environment Variables

Add these to `.env.local` (in addition to Phase 1+2 variables).

---

```env
# ============================================================
# OPENROUTER AI (AI Financial Advisor)
# ============================================================
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxx

# Model configuration — browse models at https://openrouter.ai/models
AI_MODEL=anthropic/claude-sonnet-4
AI_MAX_TOKENS=1024
AI_TEMPERATURE=0.3

# Rate limiting
AI_RATE_LIMIT_FREE=20          # Max queries/day for free tier users
AI_RATE_LIMIT_PRO=100           # Max queries/day for pro tier users

# Caching
AI_CACHE_TTL=3600000            # Cache identical queries for 1 hour (ms)

# ============================================================
# PHILIPPINE MARKET CONTEXT (Manual updates for MVP)
# ============================================================
# BSP overnight lending rate — update when BSP announces changes
# Source: https://www.bsp.gov.ph
PH_BSP_RATE=6.25

# PSA Consumer Price Index (YoY%) — update monthly
# Source: https://psa.gov.ph
PH_CPI_RATE=6.1

# ============================================================
# GLASS BOX ENGINE CONFIG
# ============================================================
# Monte Carlo defaults
MONTE_CARLO_PATHS=1000          # Number of simulation paths (production)
MONTE_CARLO_PREVIEW_PATHS=100   # Quick preview paths
MONTE_CARLO_HORIZON_YEARS=10    # Default projection horizon
```

---

## .env.example additions

```env
# Phase 3
OPENROUTER_API_KEY=
AI_MODEL=anthropic/claude-sonnet-4
AI_MAX_TOKENS=1024
AI_TEMPERATURE=0.3
AI_RATE_LIMIT_FREE=20
AI_RATE_LIMIT_PRO=100
AI_CACHE_TTL=3600000
PH_BSP_RATE=6.25
PH_CPI_RATE=6.1
MONTE_CARLO_PATHS=1000
MONTE_CARLO_PREVIEW_PATHS=100
MONTE_CARLO_HORIZON_YEARS=10
```

---

## Security Notes

- `OPENROUTER_API_KEY` is server-only — NEVER prefix with `NEXT_PUBLIC_`
- All AI requests must go through your API route, not directly from client
- OpenRouter supports 200+ models — you can switch models without code changes
- Rate limit the AI endpoint to prevent cost overruns
- Cache identical queries to reduce API costs
