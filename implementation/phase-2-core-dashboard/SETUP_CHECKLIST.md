# Phase 2 — Setup Checklist

Complete these items before starting Phase 2 implementation.

---

## Prerequisites

- [ ] **Phase 1 fully complete** — All verification checks pass
- [ ] Clerk auth working (signup, login, Google OAuth)
- [ ] Supabase tables created with RLS
- [ ] Onboarding flow functional
- [ ] Design system tokens applied

---

## 1. API Keys & External Services

### CoinGecko (Crypto Prices)
- [ ] Go to [coingecko.com/en/api](https://www.coingecko.com/en/api)
- [ ] Free tier: No API key needed (rate limit: 10-50 calls/minute)
- [ ] For higher limits: Create account, get API key (Demo plan)
- [ ] Base URL: `https://api.coingecko.com/api/v3`
- [ ] Test endpoint: `GET /simple/price?ids=bitcoin&vs_currencies=php`
- [ ] Expected response: `{ "bitcoin": { "php": 5234567 } }`

### PSE Edge (Philippine Stock Exchange)
- [ ] Access delayed PSE data from PSE Edge
- [ ] Verify data availability: [edge.pse.com.ph](https://edge.pse.com.ph)
- [ ] Note: No official API — will need to scrape or use proxy service
- [ ] Alternative: Use a Philippine stock data API if available
- [ ] Test: Can you get JFC (Jollibee) stock price?

### BSP Exchange Rates
- [ ] BSP publishes reference exchange rates daily
- [ ] Source: [bsp.gov.ph](https://www.bsp.gov.ph/statistics/external/Table%2011a%20-%20Reference%20Exchange%20Rate%20Bulletin.aspx)
- [ ] For MVP: Manual entry or static rates, refreshed daily
- [ ] Alternative: Use a forex API (exchangerate-api.com free tier)

---

## 2. Environment Variables to Add

```env
# Add to .env.local (in addition to Phase 1 variables)

# CoinGecko (optional — free tier works without key)
COINGECKO_API_KEY=
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3

# Exchange Rate API (if using instead of manual BSP rates)
EXCHANGE_RATE_API_KEY=
```

---

## 3. Dependencies to Install

```bash
pnpm add recharts                    # Charts (line, bar, area)
pnpm add @tanstack/react-table       # Data table (sortable, paginated)
pnpm add @tanstack/react-query       # Server state management
pnpm add zod                         # Schema validation (if not installed in Phase 1)
pnpm add papaparse                   # CSV parsing (for COL Financial import)
pnpm add @types/papaparse -D         # TypeScript types for papaparse
pnpm add date-fns                    # Date formatting & manipulation
pnpm add zustand                     # Client state management
```

---

## 4. COL Financial CSV Format

Before implementing the CSV parser, get a sample COL Financial export:

- [ ] Log into COL Financial (col.colfinancial.com)
- [ ] Export transaction history as CSV
- [ ] Note the column format (typical columns):
  - Date, Stock Code, Buy/Sell, Quantity, Price, Amount, Fees
- [ ] Save a sample CSV for testing the parser
- [ ] If no COL account: Create a mock CSV matching the format

---

## 5. Database Seed Data

Prepare test data for development:

- [ ] Create seed script with sample assets:
  - 3 PSE stocks (JFC, SM, ALI)
  - 1 crypto (BTC)
  - 1 real estate entry
  - 1 UITF entry
  - 2 bank accounts (BDO, BPI)
  - 1 gold holding
  - 1 time deposit
- [ ] Create sample liabilities:
  - 1 credit card
  - 1 housing loan
- [ ] Create sample transactions (buy/sell events)
- [ ] Create initial price cache entries

---

## 6. Design Assets

- [ ] Review `design-stitch-prompts/03_DASHBOARD_NET_WORTH.md` for dashboard layout specs
- [ ] Review `design-stitch-prompts/07_DATA_INGESTION.md` for CSV upload and manual entry specs
- [ ] Review `design-stitch-prompts/12_NAVIGATION_CONSISTENCY.md` for sidebar navigation specs
- [ ] Prepare asset class icons (from Lucide):
  - TrendingUp (stocks), Bitcoin (crypto), Home (real estate), Banknote (cash)
  - BarChart3 (UITFs), CircleDollarSign (gold), Clock (time deposits)

---

## 7. Pre-Implementation Verification

- [ ] Supabase: Can you INSERT and SELECT from `assets` table with RLS?
- [ ] Clerk: Can you get the authenticated user ID in an API route?
- [ ] CoinGecko: Does the test API call return BTC price in PHP?
- [ ] File upload: Does Supabase Storage bucket exist for CSV uploads?

---

**Once all checkboxes are checked, proceed to `IMPLEMENTATION_GUIDE.md`.**
