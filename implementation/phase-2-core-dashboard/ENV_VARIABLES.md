# Phase 2 — Environment Variables

Add these to `.env.local` (in addition to Phase 1 variables).

---

```env
# ============================================================
# PHASE 2 — EXTERNAL DATA SOURCES
# ============================================================

# CoinGecko API (Crypto Prices)
# Free tier works without a key (10-50 req/min)
# For Demo plan: https://www.coingecko.com/en/api/pricing
COINGECKO_API_KEY=
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3

# Exchange Rate API (for BSP forex rates)
# Get from: https://www.exchangerate-api.com/ (free tier: 1500 req/month)
# Alternative: manual BSP rates updated daily
EXCHANGE_RATE_API_KEY=

# ============================================================
# PRICE CACHE CONFIG
# ============================================================

# How often to refresh crypto prices (in milliseconds)
PRICE_CACHE_CRYPTO_TTL=300000       # 5 minutes (300,000 ms)

# How often to refresh PSE stock prices (in milliseconds)
PRICE_CACHE_PSE_TTL=900000          # 15 minutes (900,000 ms)

# How often to refresh forex rates (in milliseconds)
PRICE_CACHE_FOREX_TTL=86400000      # 24 hours (86,400,000 ms)

# ============================================================
# SUPABASE STORAGE
# ============================================================

# Bucket name for CSV uploads
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=csv-uploads
```

---

## .env.example additions

```env
# Phase 2
COINGECKO_API_KEY=
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
EXCHANGE_RATE_API_KEY=
PRICE_CACHE_CRYPTO_TTL=300000
PRICE_CACHE_PSE_TTL=900000
PRICE_CACHE_FOREX_TTL=86400000
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=csv-uploads
```
