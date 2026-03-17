# Phase 2 — Core Dashboard · Implementation Guide

**Phase:** 2 of 6 · Core Dashboard
**Weeks:** 5–8
**Prerequisites:** Phase 1 complete, all items in `SETUP_CHECKLIST.md` completed
**Depends on:** Phase 1 (auth, database schema, design system, layout shell)

---

## Context

Phase 2 builds the core product: the net worth dashboard with Bloomberg-style 3-panel layout, manual asset entry, CSV import (COL Financial format), holdings table, allocation view, liabilities tracker, historical net worth chart with PSEi benchmark, and the price cache system (CoinGecko, PSE Edge, BSP forex).

---

## Directory Structure (New Files in Phase 2)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                         # Net worth dashboard (hero + chart + breakdown)
│   │   ├── holdings/
│   │   │   └── page.tsx                     # Holdings table view
│   │   ├── data/
│   │   │   └── page.tsx                     # Data import: CSV upload + manual entry
│   │   └── loading.tsx                      # Loading skeleton for dashboard
│   └── api/
│       └── v1/
│           ├── portfolio/
│           │   ├── net-worth/
│           │   │   └── route.ts             # GET net worth + breakdown
│           │   ├── holdings/
│           │   │   └── route.ts             # GET all holdings
│           │   ├── allocation/
│           │   │   └── route.ts             # GET allocation by class
│           │   └── assets/
│           │       └── route.ts             # POST create, PUT update, DELETE remove
│           ├── liabilities/
│           │   └── route.ts                 # CRUD liabilities
│           ├── data/
│           │   ├── upload-csv/
│           │   │   └── route.ts             # POST CSV upload + parse
│           │   └── audit-log/
│           │       └── route.ts             # GET audit log
│           └── market/
│               └── prices/
│                   └── route.ts             # GET cached prices
├── components/
│   ├── dashboard/
│   │   ├── net-worth-hero.tsx               # Big number + change indicator
│   │   ├── net-worth-chart.tsx              # Line chart + PSEi benchmark
│   │   ├── allocation-bar.tsx               # Stacked horizontal bar
│   │   ├── asset-breakdown.tsx              # Breakdown by asset class
│   │   └── liabilities-summary.tsx          # Liabilities section
│   ├── holdings/
│   │   ├── holdings-table.tsx               # Data table with sorting
│   │   ├── holdings-columns.tsx             # Column definitions
│   │   └── add-asset-dialog.tsx             # Modal form for manual entry
│   ├── data/
│   │   ├── csv-upload.tsx                   # Drag-and-drop CSV upload
│   │   ├── csv-preview.tsx                  # Preview parsed CSV data
│   │   └── manual-entry-form.tsx            # Full manual entry form
│   └── shared/
│       ├── data-table.tsx                   # Reusable data table component
│       ├── stat-card.tsx                    # Glass card with label + value
│       └── page-header.tsx                  # Reusable page header
├── lib/
│   ├── api/
│   │   ├── portfolio.ts                     # Portfolio data fetching functions
│   │   └── prices.ts                        # Price fetching + cache logic
│   ├── parsers/
│   │   └── col-financial.ts                 # COL Financial CSV parser
│   ├── calculations/
│   │   └── net-worth.ts                     # Net worth computation logic
│   └── validators/
│       └── asset.ts                         # Zod schemas for asset validation
└── hooks/
    ├── use-portfolio.ts                     # SWR hook for portfolio data
    └── use-prices.ts                        # SWR hook for price data
```

---

## Step-by-Step Implementation

### Step 1 — Install Phase 2 Dependencies

```bash
# Charts
pnpm add recharts

# Data table
pnpm add @tanstack/react-table

# Data fetching
pnpm add swr

# Validation
pnpm add zod

# File upload
pnpm add react-dropzone

# CSV parsing
pnpm add papaparse
pnpm add -D @types/papaparse

# Date utilities
pnpm add date-fns

# Additional shadcn components
pnpx shadcn@latest add dialog select textarea table badge tabs tooltip
```

---

### Step 2 — Zod Validation Schemas

**src/lib/validators/asset.ts:**

```ts
import { z } from "zod";

export const createAssetSchema = z.object({
  asset_class: z.enum([
    "pse_stock", "global_stock", "crypto", "real_estate",
    "uitf", "cash", "gold", "time_deposit", "other",
  ]),
  ticker_or_name: z.string().min(1, "Name is required").max(100),
  quantity: z.number().positive("Quantity must be positive"),
  avg_cost_basis: z.number().positive().nullable().optional(),
  current_value_php: z.number().nonnegative("Value must be non-negative"),
  native_currency: z.string().default("PHP"),
  annual_fee_pct: z.number().min(0).max(100).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export const createLiabilitySchema = z.object({
  liability_type: z.enum([
    "credit_card", "personal_loan", "housing_loan", "car_loan", "other",
  ]),
  name: z.string().min(1, "Name is required").max(100),
  outstanding_balance: z.number().nonnegative("Balance must be non-negative"),
  interest_rate_pct: z.number().min(0).max(100).nullable().optional(),
  monthly_payment: z.number().nonnegative().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type CreateLiabilityInput = z.infer<typeof createLiabilitySchema>;
```

---

### Step 3 — Net Worth Calculation Logic

**src/lib/calculations/net-worth.ts:**

```ts
import type { Asset, Liability } from "@/types/database";

export interface NetWorthBreakdown {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  byAssetClass: Record<string, { value: number; percentage: number; count: number }>;
  changeToday: number;        // placeholder — computed from price_cache diffs
  changePercent: number;
}

export function calculateNetWorth(
  assets: Asset[],
  liabilities: Liability[]
): NetWorthBreakdown {
  const totalAssets = assets.reduce(
    (sum, a) => sum + Number(a.current_value_php),
    0
  );
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + Number(l.outstanding_balance),
    0
  );
  const netWorth = totalAssets - totalLiabilities;

  // Group by asset class
  const byAssetClass: NetWorthBreakdown["byAssetClass"] = {};
  for (const asset of assets) {
    const cls = asset.asset_class;
    if (!byAssetClass[cls]) {
      byAssetClass[cls] = { value: 0, percentage: 0, count: 0 };
    }
    byAssetClass[cls].value += Number(asset.current_value_php);
    byAssetClass[cls].count += 1;
  }

  // Calculate percentages
  for (const cls of Object.keys(byAssetClass)) {
    byAssetClass[cls].percentage =
      totalAssets > 0 ? (byAssetClass[cls].value / totalAssets) * 100 : 0;
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    byAssetClass,
    changeToday: 0,
    changePercent: 0,
  };
}

export const ASSET_CLASS_LABELS: Record<string, string> = {
  pse_stock: "PSE Stocks",
  global_stock: "Global Stocks",
  crypto: "Crypto",
  real_estate: "Real Estate",
  uitf: "UITFs",
  cash: "Cash & Savings",
  gold: "Gold",
  time_deposit: "Time Deposits",
  other: "Other",
};

export const ASSET_CLASS_COLORS: Record<string, string> = {
  pse_stock: "#7c3aed",
  global_stock: "#a855f7",
  crypto: "#f59e0b",
  real_estate: "#10b981",
  uitf: "#3b82f6",
  cash: "#6366f1",
  gold: "#eab308",
  time_deposit: "#14b8a6",
  other: "#6b7280",
};
```

---

### Step 4 — COL Financial CSV Parser

**src/lib/parsers/col-financial.ts:**

```ts
import Papa from "papaparse";

export interface COLTransaction {
  tradeDate: string;
  settlementDate: string;
  stockCode: string;
  action: "BUY" | "SELL";
  quantity: number;
  price: number;
  grossAmount: number;
  fees: number;
  netAmount: number;
}

export interface ParseResult {
  transactions: COLTransaction[];
  errors: string[];
  rowCount: number;
}

export function parseCOLFinancialCSV(csvText: string): ParseResult {
  const errors: string[] = [];

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  if (result.errors.length > 0) {
    errors.push(
      ...result.errors.map(
        (e) => `Row ${e.row}: ${e.message}`
      )
    );
  }

  const transactions: COLTransaction[] = [];

  for (let i = 0; i < result.data.length; i++) {
    const row = result.data[i] as Record<string, string>;

    try {
      // COL Financial CSV columns (common format):
      // Trade Date, Settlement Date, Stock Code, Action, Quantity, Price, Gross Amount, Fees, Net Amount
      const tradeDate =
        row["trade_date"] || row["date"] || row["transaction_date"] || "";
      const stockCode =
        row["stock_code"] || row["symbol"] || row["stock"] || "";
      const action = (
        row["action"] || row["type"] || row["transaction_type"] || ""
      ).toUpperCase();
      const quantity = parseFloat(
        row["quantity"] || row["shares"] || row["qty"] || "0"
      );
      const price = parseFloat(
        row["price"] || row["price_per_share"] || "0"
      );
      const grossAmount = parseFloat(
        row["gross_amount"] || row["gross"] || "0"
      );
      const fees = parseFloat(
        row["fees"] || row["commission"] || row["charges"] || "0"
      );
      const netAmount = parseFloat(
        row["net_amount"] || row["net"] || "0"
      );

      if (!stockCode) {
        errors.push(`Row ${i + 1}: Missing stock code`);
        continue;
      }

      if (!["BUY", "SELL"].includes(action)) {
        errors.push(
          `Row ${i + 1}: Invalid action "${action}" — expected BUY or SELL`
        );
        continue;
      }

      transactions.push({
        tradeDate,
        settlementDate: row["settlement_date"] || "",
        stockCode: stockCode.toUpperCase(),
        action: action as "BUY" | "SELL",
        quantity: Math.abs(quantity),
        price,
        grossAmount: Math.abs(grossAmount || quantity * price),
        fees: Math.abs(fees),
        netAmount: Math.abs(
          netAmount || Math.abs(quantity * price) - Math.abs(fees)
        ),
      });
    } catch {
      errors.push(`Row ${i + 1}: Failed to parse`);
    }
  }

  return {
    transactions,
    errors,
    rowCount: result.data.length,
  };
}
```

---

### Step 5 — Price Fetching Service

**src/lib/api/prices.ts:**

```ts
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const BSP_FOREX_ENDPOINT = "https://www.bsp.gov.ph/statistics/external/Table%2039.aspx";

// CoinGecko IDs for common crypto
const CRYPTO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  DOT: "polkadot",
  MATIC: "matic-network",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  XRP: "ripple",
  DOGE: "dogecoin",
};

export interface PriceData {
  ticker: string;
  price_php: number;
  source: string;
  fetched_at: string;
}

/**
 * Fetch crypto prices from CoinGecko (free tier: 50 req/min).
 * Returns prices in PHP.
 */
export async function fetchCryptoPrices(
  tickers: string[]
): Promise<PriceData[]> {
  const ids = tickers
    .map((t) => CRYPTO_IDS[t.toUpperCase()])
    .filter(Boolean);

  if (ids.length === 0) return [];

  const url = `${COINGECKO_BASE}/simple/price?ids=${ids.join(",")}&vs_currencies=php`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 }, // 5-min cache
  });

  if (!response.ok) {
    console.error("CoinGecko API error:", response.status);
    return [];
  }

  const data = await response.json();
  const now = new Date().toISOString();

  return tickers
    .map((ticker) => {
      const id = CRYPTO_IDS[ticker.toUpperCase()];
      const price = data?.[id]?.php;
      if (!price) return null;

      return {
        ticker: ticker.toUpperCase(),
        price_php: price,
        source: "coingecko",
        fetched_at: now,
      };
    })
    .filter(Boolean) as PriceData[];
}

/**
 * Fetch PSE stock prices via PSE Edge.
 * PSE Edge provides delayed (15-min) data.
 */
export async function fetchPSEPrices(
  tickers: string[]
): Promise<PriceData[]> {
  const results: PriceData[] = [];
  const now = new Date().toISOString();

  for (const ticker of tickers) {
    try {
      // PSE Edge security info endpoint
      const url = `https://edge.pse.com.ph/companyPage/stockData.do?cmpy=${encodeURIComponent(ticker)}`;

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 900 }, // 15-min cache
      });

      if (!response.ok) continue;

      const data = await response.json();
      const lastPrice = data?.records?.[0]?.lastTradedPrice;

      if (lastPrice) {
        results.push({
          ticker: ticker.toUpperCase(),
          price_php: parseFloat(String(lastPrice).replace(/,/g, "")),
          source: "pse_edge",
          fetched_at: now,
        });
      }
    } catch {
      console.error(`PSE Edge: Failed to fetch ${ticker}`);
    }
  }

  return results;
}

/**
 * Get forex rates from BSP reference rates.
 * For MVP, using a static endpoint or fallback values.
 */
export async function fetchForexRates(): Promise<PriceData[]> {
  const now = new Date().toISOString();

  // Fallback rates if BSP endpoint is unavailable
  const fallbackRates: Record<string, number> = {
    "USD/PHP": 56.5,
    "SGD/PHP": 42.1,
    "HKD/PHP": 7.23,
  };

  try {
    // BSP API or scraping implementation here
    // For MVP, use fallback rates and update manually
    return Object.entries(fallbackRates).map(([ticker, rate]) => ({
      ticker,
      price_php: rate,
      source: "bsp_forex",
      fetched_at: now,
    }));
  } catch {
    return Object.entries(fallbackRates).map(([ticker, rate]) => ({
      ticker,
      price_php: rate,
      source: "bsp_forex_fallback",
      fetched_at: now,
    }));
  }
}

/**
 * Refresh all prices and upsert into price_cache table.
 */
export async function refreshPriceCache(
  supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
  cryptoTickers: string[],
  pseTickers: string[]
) {
  const [cryptoPrices, psePrices, forexRates] = await Promise.all([
    fetchCryptoPrices(cryptoTickers),
    fetchPSEPrices(pseTickers),
    fetchForexRates(),
  ]);

  const allPrices = [...cryptoPrices, ...psePrices, ...forexRates];

  if (allPrices.length > 0) {
    const { error } = await supabase.from("price_cache").upsert(
      allPrices.map((p) => ({
        ticker: p.ticker,
        price_php: p.price_php,
        source: p.source,
        fetched_at: p.fetched_at,
      })),
      { onConflict: "ticker" }
    );

    if (error) {
      console.error("Failed to update price cache:", error);
    }
  }

  return allPrices;
}
```

---

### Step 6 — Portfolio Data Fetching

**src/lib/api/portfolio.ts:**

```ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateNetWorth } from "@/lib/calculations/net-worth";
import type { Asset, Liability } from "@/types/database";

export async function getPortfolioData() {
  const supabase = await createServerSupabaseClient();

  const [assetsResult, liabilitiesResult] = await Promise.all([
    supabase.from("assets").select("*").order("current_value_php", { ascending: false }),
    supabase.from("liabilities").select("*").order("outstanding_balance", { ascending: false }),
  ]);

  const assets = (assetsResult.data as Asset[]) || [];
  const liabilities = (liabilitiesResult.data as Liability[]) || [];
  const breakdown = calculateNetWorth(assets, liabilities);

  return { assets, liabilities, breakdown };
}

export async function getPriceCache() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("price_cache").select("*");
  return data || [];
}
```

---

### Step 7 — SWR Hooks

**src/hooks/use-portfolio.ts:**

```ts
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useNetWorth() {
  return useSWR("/api/v1/portfolio/net-worth", fetcher, {
    refreshInterval: 60000, // Refresh every 60 seconds
    revalidateOnFocus: true,
  });
}

export function useHoldings() {
  return useSWR("/api/v1/portfolio/holdings", fetcher, {
    refreshInterval: 60000,
  });
}

export function useAllocation() {
  return useSWR("/api/v1/portfolio/allocation", fetcher, {
    refreshInterval: 60000,
  });
}
```

**src/hooks/use-prices.ts:**

```ts
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePrices() {
  return useSWR("/api/v1/market/prices", fetcher, {
    refreshInterval: 300000, // 5 minutes
  });
}
```

---

### Step 8 — API Routes

**src/app/api/v1/portfolio/net-worth/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateNetWorth } from "@/lib/calculations/net-worth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();

  const [{ data: assets, error: assetsErr }, { data: liabilities, error: liabilitiesErr }] = await Promise.all([
    supabase.from("assets").select("*"),
    supabase.from("liabilities").select("*"),
  ]);

  if (assetsErr || liabilitiesErr) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to fetch data", status: 500 } }, { status: 500 });
  }

  const breakdown = calculateNetWorth(assets || [], liabilities || []);
  return NextResponse.json(breakdown);
}
```

**src/app/api/v1/portfolio/holdings/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = (page - 1) * limit;

  const supabase = await createServerSupabaseClient();

  const { data, error, count } = await supabase
    .from("assets")
    .select("*", { count: "exact" })
    .order("current_value_php", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to fetch holdings", status: 500 } }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    pagination: { page, limit, total: count || 0 },
  });
}
```

**src/app/api/v1/portfolio/allocation/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: assets, error } = await supabase.from("assets").select("asset_class, current_value_php");

  if (error) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to fetch allocation", status: 500 } }, { status: 500 });
  }

  const total = (assets || []).reduce((sum, a) => sum + Number(a.current_value_php), 0);

  const allocation: Record<string, { value: number; percentage: number }> = {};
  for (const asset of assets || []) {
    const cls = asset.asset_class;
    if (!allocation[cls]) allocation[cls] = { value: 0, percentage: 0 };
    allocation[cls].value += Number(asset.current_value_php);
  }

  for (const cls of Object.keys(allocation)) {
    allocation[cls].percentage = total > 0 ? (allocation[cls].value / total) * 100 : 0;
  }

  return NextResponse.json({ total, allocation });
}
```

**src/app/api/v1/portfolio/assets/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAssetSchema } from "@/lib/validators/asset";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createAssetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({
      error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message, status: 400, details: parsed.error.issues },
    }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("assets")
    .insert({ user_id: userId, ...parsed.data })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to create asset", status: 500 } }, { status: 500 });
  }

  // Audit log
  await supabase.from("audit_log").insert({
    user_id: userId,
    action: "asset_created",
    entity_type: "asset",
    entity_id: data.id,
    new_value: data,
  });

  return NextResponse.json(data, { status: 201 });
}
```

**src/app/api/v1/data/upload-csv/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseCOLFinancialCSV } from "@/lib/parsers/col-financial";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: { code: "NO_FILE", message: "No file provided", status: 400 } }, { status: 400 });
  }

  if (!file.name.endsWith(".csv")) {
    return NextResponse.json({ error: { code: "INVALID_FILE", message: "Only CSV files are accepted", status: 400 } }, { status: 400 });
  }

  const text = await file.text();
  const { transactions, errors, rowCount } = parseCOLFinancialCSV(text);

  if (transactions.length === 0) {
    return NextResponse.json({
      error: { code: "PARSE_ERROR", message: "No valid transactions found", status: 400, details: errors },
    }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  // Group by stock to create/update asset entries
  const stockMap = new Map<string, { quantity: number; totalCost: number }>();
  for (const tx of transactions) {
    const existing = stockMap.get(tx.stockCode) || { quantity: 0, totalCost: 0 };
    if (tx.action === "BUY") {
      existing.quantity += tx.quantity;
      existing.totalCost += tx.netAmount;
    } else {
      existing.quantity -= tx.quantity;
      existing.totalCost -= tx.netAmount;
    }
    stockMap.set(tx.stockCode, existing);
  }

  const assetsToInsert = Array.from(stockMap.entries())
    .filter(([, data]) => data.quantity > 0)
    .map(([ticker, data]) => ({
      user_id: userId,
      asset_class: "pse_stock" as const,
      ticker_or_name: ticker,
      quantity: data.quantity,
      avg_cost_basis: data.totalCost / data.quantity,
      current_value_php: data.totalCost, // Will be updated by price cache
      native_currency: "PHP",
      is_manual: false,
    }));

  if (assetsToInsert.length > 0) {
    const { error } = await supabase.from("assets").insert(assetsToInsert);
    if (error) {
      return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to import assets", status: 500 } }, { status: 500 });
    }
  }

  // Insert individual transactions
  const txToInsert = transactions.map((tx) => ({
    user_id: userId,
    tx_type: tx.action.toLowerCase() as "buy" | "sell",
    amount_php: tx.netAmount,
    price_per_unit: tx.price,
    quantity: tx.quantity,
    tx_date: new Date(tx.tradeDate).toISOString(),
    source: "csv_import" as const,
    notes: `COL Financial import: ${tx.stockCode}`,
  }));

  await supabase.from("transactions").insert(txToInsert);

  // Audit log
  await supabase.from("audit_log").insert({
    user_id: userId,
    action: "csv_imported",
    entity_type: "asset",
    entity_id: "00000000-0000-0000-0000-000000000000",
    new_value: { file: file.name, rows: rowCount, imported: assetsToInsert.length },
  });

  return NextResponse.json({
    imported: assetsToInsert.length,
    transactions: transactions.length,
    errors,
    rowCount,
  });
}
```

**src/app/api/v1/market/prices/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("price_cache")
    .select("*")
    .order("fetched_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to fetch prices", status: 500 } }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
```

---

### Step 9 — Shared UI Components

**src/components/shared/page-header.tsx:**

```tsx
interface PageHeaderProps {
  badge: string;
  title: string;
  description?: string;
}

export function PageHeader({ badge, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
        {badge}
      </span>
      <h1 className="font-display text-[2.25rem] font-bold text-text-primary text-wrap-balance">
        {title}
      </h1>
      {description && (
        <p className="font-body text-sm text-text-secondary">{description}</p>
      )}
    </div>
  );
}
```

**src/components/shared/stat-card.tsx:**

```tsx
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ label, value, subValue, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]",
        className
      )}
    >
      <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-text-primary">
        {value}
      </p>
      {subValue && (
        <p
          className={cn(
            "mt-1 font-body text-sm font-medium tabular-nums",
            trend === "up" && "text-success",
            trend === "down" && "text-error",
            trend === "neutral" && "text-text-muted"
          )}
        >
          {subValue}
        </p>
      )}
    </div>
  );
}
```

---

### Step 10 — Net Worth Hero Component

**src/components/dashboard/net-worth-hero.tsx:**

```tsx
"use client";

import { useNetWorth } from "@/hooks/use-portfolio";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";

export function NetWorthHero() {
  const { data, isLoading } = useNetWorth();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[120px] animate-pulse rounded-[16px] border border-glass-border bg-glass-bg"
          />
        ))}
      </div>
    );
  }

  const trend =
    data.changePercent > 0 ? "up" : data.changePercent < 0 ? "down" : "neutral";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        label="Net Worth"
        value={formatCurrency(data.netWorth)}
        subValue={`${formatPercentage(data.changePercent)} today`}
        trend={trend}
        className="md:col-span-2 border-accent-primary/30"
      />
      <StatCard
        label="Total Assets"
        value={formatCurrency(data.totalAssets)}
        subValue={`${Object.keys(data.byAssetClass).length} asset classes`}
        trend="neutral"
      />
      <StatCard
        label="Total Liabilities"
        value={formatCurrency(data.totalLiabilities)}
        trend="neutral"
      />
    </div>
  );
}
```

---

### Step 11 — Allocation Bar

**src/components/dashboard/allocation-bar.tsx:**

```tsx
"use client";

import { useAllocation } from "@/hooks/use-portfolio";
import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS } from "@/lib/calculations/net-worth";
import { formatCurrency } from "@/lib/utils";

export function AllocationBar() {
  const { data, isLoading } = useAllocation();

  if (isLoading || !data) {
    return (
      <div className="h-[140px] animate-pulse rounded-[16px] border border-glass-border bg-glass-bg" />
    );
  }

  const entries = Object.entries(data.allocation || {}).sort(
    (a, b) => b[1].value - a[1].value
  );

  if (entries.length === 0) {
    return (
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px]">
        <p className="font-body text-sm text-text-muted">
          No assets yet. Add assets to see your allocation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]">
      <p className="mb-4 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        Asset Allocation
      </p>

      {/* Stacked horizontal bar */}
      <div className="flex h-6 w-full overflow-hidden rounded-full">
        {entries.map(([cls, { percentage }]) => (
          <div
            key={cls}
            className="transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: ASSET_CLASS_COLORS[cls] || "#6b7280",
              minWidth: percentage > 0 ? "4px" : "0",
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
        {entries.map(([cls, { value, percentage }]) => (
          <div key={cls} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: ASSET_CLASS_COLORS[cls] || "#6b7280" }}
            />
            <div className="flex flex-col">
              <span className="font-body text-xs text-text-secondary">
                {ASSET_CLASS_LABELS[cls] || cls}
              </span>
              <span className="font-body text-xs font-medium tabular-nums text-text-primary">
                {formatCurrency(value)} ({percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Step 12 — Net Worth Chart

**src/components/dashboard/net-worth-chart.tsx:**

```tsx
"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

const RANGES = ["1M", "3M", "6M", "1Y", "All"] as const;
type Range = (typeof RANGES)[number];

// Placeholder data — replace with real API data in production
const placeholderData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2026, 2, i + 1).toISOString().split("T")[0],
  netWorth: 4000000 + Math.random() * 500000,
  psei: 6800 + Math.random() * 400,
}));

export function NetWorthChart() {
  const [range, setRange] = useState<Range>("1M");

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
          Net Worth History
        </p>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-[6px] px-2.5 py-1 font-body text-xs font-medium transition-colors",
                range === r
                  ? "bg-accent-subtle text-accent-glow"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={placeholderData}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#4e4c6a" }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#4e4c6a" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₱${(v / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid rgba(168,85,247,0.18)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f1f0ff",
            }}
            formatter={(value: number) => [formatCurrency(value), "Net Worth"]}
          />
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#7c3aed", stroke: "#a855f7", strokeWidth: 2 }}
          />
          {/* PSEi benchmark reference line */}
          <ReferenceLine
            y={7000}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 4"
            label={{
              value: "PSEi",
              position: "right",
              fill: "#4e4c6a",
              fontSize: 10,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

### Step 13 — Holdings Table

**src/components/holdings/holdings-table.tsx:**

```tsx
"use client";

import { useState } from "react";
import { useHoldings } from "@/hooks/use-portfolio";
import { formatCurrency, cn } from "@/lib/utils";
import { ASSET_CLASS_LABELS } from "@/lib/calculations/net-worth";
import { ArrowUpDown } from "lucide-react";
import type { Asset } from "@/types/database";

type SortKey = "ticker_or_name" | "asset_class" | "current_value_php" | "quantity";
type SortDir = "asc" | "desc";

export function HoldingsTable() {
  const { data, isLoading } = useHoldings();
  const [sortKey, setSortKey] = useState<SortKey>("current_value_php");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const holdings: Asset[] = data?.data || [];
  const sorted = [...holdings].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const modifier = sortDir === "asc" ? 1 : -1;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * modifier;
    }
    return String(aVal).localeCompare(String(bVal)) * modifier;
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-[8px] bg-glass-bg" />
        ))}
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-8 text-center backdrop-blur-[12px]">
        <p className="font-body text-sm text-text-muted">
          No holdings yet. Add your first asset manually or import a CSV.
        </p>
      </div>
    );
  }

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted hover:text-text-secondary"
    >
      {label}
      <ArrowUpDown size={12} className={cn(sortKey === field && "text-accent-primary")} />
    </button>
  );

  return (
    <div className="overflow-x-auto rounded-[16px] border border-glass-border bg-glass-bg backdrop-blur-[12px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-glass-border">
            <th className="px-5 py-3 text-left"><SortHeader label="Asset" field="ticker_or_name" /></th>
            <th className="px-5 py-3 text-left"><SortHeader label="Class" field="asset_class" /></th>
            <th className="px-5 py-3 text-right"><SortHeader label="Quantity" field="quantity" /></th>
            <th className="px-5 py-3 text-right"><SortHeader label="Value (PHP)" field="current_value_php" /></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((asset) => (
            <tr key={asset.id} className="border-b border-glass-border/50 hover:bg-accent-subtle/30 transition-colors">
              <td className="px-5 py-3">
                <span className="font-body text-sm font-medium text-text-primary">
                  {asset.ticker_or_name}
                </span>
              </td>
              <td className="px-5 py-3">
                <span className="font-body text-xs text-text-secondary">
                  {ASSET_CLASS_LABELS[asset.asset_class] || asset.asset_class}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className="font-body text-sm tabular-nums text-text-primary">
                  {Number(asset.quantity).toLocaleString()}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <span className="font-body text-sm font-medium tabular-nums text-text-primary">
                  {formatCurrency(Number(asset.current_value_php))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Step 14 — CSV Upload Component

**src/components/data/csv-upload.tsx:**

```tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSVUploadProps {
  onSuccess?: (result: { imported: number; transactions: number; errors: string[] }) => void;
}

export function CSVUpload({ onSuccess }: CSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    transactions: number;
    errors: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/data/upload-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || "Upload failed");
        return;
      }

      setResult(data);
      onSuccess?.(data);
    } catch {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[16px] border-2 border-dashed p-10 transition-colors",
          isDragActive
            ? "border-accent-primary bg-accent-subtle"
            : "border-glass-border bg-glass-bg hover:border-border-accent",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <Upload size={32} className="text-text-muted" aria-hidden="true" />
        <div className="text-center">
          <p className="font-body text-sm font-medium text-text-primary">
            {isDragActive ? "Drop your CSV here" : "Drag & drop your COL Financial CSV"}
          </p>
          <p className="mt-1 font-body text-xs text-text-muted">
            Or click to browse. Max 5MB.
          </p>
        </div>
      </div>

      {/* Success */}
      {result && (
        <div className="flex items-start gap-3 rounded-[12px] border border-success/30 bg-success/5 p-4">
          <Check size={18} className="mt-0.5 text-success" />
          <div>
            <p className="font-body text-sm font-medium text-text-primary">
              Import successful
            </p>
            <p className="font-body text-xs text-text-secondary">
              {result.imported} assets imported from {result.transactions} transactions.
            </p>
            {result.errors.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer font-body text-xs text-warning">
                  {result.errors.length} warnings
                </summary>
                <ul className="mt-1 space-y-0.5">
                  {result.errors.map((err, i) => (
                    <li key={i} className="font-body text-xs text-text-muted">{err}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-[12px] border border-error/30 bg-error/5 p-4">
          <AlertCircle size={18} className="mt-0.5 text-error" />
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}
    </div>
  );
}
```

---

### Step 15 — Manual Entry Form

**src/components/data/manual-entry-form.tsx:**

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ASSET_CLASS_LABELS } from "@/lib/calculations/net-worth";
import { ASSET_CLASSES } from "@/lib/constants";
import type { AssetClass } from "@/types/database";

interface ManualEntryFormProps {
  onSuccess?: () => void;
}

export function ManualEntryForm({ onSuccess }: ManualEntryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    asset_class: "pse_stock" as AssetClass,
    ticker_or_name: "",
    quantity: "",
    avg_cost_basis: "",
    current_value_php: "",
    native_currency: "PHP",
    annual_fee_pct: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/portfolio/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: parseFloat(form.quantity),
          avg_cost_basis: form.avg_cost_basis ? parseFloat(form.avg_cost_basis) : null,
          current_value_php: parseFloat(form.current_value_php),
          annual_fee_pct: form.annual_fee_pct ? parseFloat(form.annual_fee_pct) : null,
          notes: form.notes || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error?.message || "Failed to add asset");
        return;
      }

      // Reset form
      setForm({
        asset_class: "pse_stock",
        ticker_or_name: "",
        quantity: "",
        avg_cost_basis: "",
        current_value_php: "",
        native_currency: "PHP",
        annual_fee_pct: "",
        notes: "",
      });

      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-[8px] border border-glass-border bg-bg-elevated px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-bright focus:outline-none focus:ring-2 focus:ring-accent-bright/15";

  const labelClass =
    "font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Asset Class */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Asset Class</label>
        <select
          value={form.asset_class}
          onChange={(e) => setForm({ ...form, asset_class: e.target.value as AssetClass })}
          className={inputClass}
        >
          {ASSET_CLASSES.map((cls) => (
            <option key={cls} value={cls}>
              {ASSET_CLASS_LABELS[cls] || cls}
            </option>
          ))}
        </select>
      </div>

      {/* Ticker / Name */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Ticker or Name</label>
        <input
          type="text"
          value={form.ticker_or_name}
          onChange={(e) => setForm({ ...form, ticker_or_name: e.target.value })}
          placeholder="e.g., JFC, Bitcoin, Condo BGC"
          className={inputClass}
          required
        />
      </div>

      {/* Quantity + Value row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Quantity</label>
          <input
            type="number"
            step="any"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="0"
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Current Value (PHP)</label>
          <input
            type="number"
            step="0.01"
            value={form.current_value_php}
            onChange={(e) => setForm({ ...form, current_value_php: e.target.value })}
            placeholder="0.00"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Cost Basis + Fee row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Avg Cost Basis (optional)</label>
          <input
            type="number"
            step="any"
            value={form.avg_cost_basis}
            onChange={(e) => setForm({ ...form, avg_cost_basis: e.target.value })}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Annual Fee % (optional)</label>
          <input
            type="number"
            step="0.01"
            value={form.annual_fee_pct}
            onChange={(e) => setForm({ ...form, annual_fee_pct: e.target.value })}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any notes about this asset..."
          rows={2}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      {/* Error */}
      {error && <p className="font-body text-sm text-error">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "h-[44px] w-full rounded-[8px] font-body text-sm font-medium transition-all duration-160",
          loading
            ? "cursor-not-allowed bg-bg-elevated text-text-muted"
            : "bg-accent-primary text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
        )}
      >
        {loading ? "Adding..." : "Add Asset"}
      </button>
    </form>
  );
}
```

---

### Step 16 — Dashboard Page

**src/app/dashboard/page.tsx:**

```tsx
import { NetWorthHero } from "@/components/dashboard/net-worth-hero";
import { NetWorthChart } from "@/components/dashboard/net-worth-chart";
import { AllocationBar } from "@/components/dashboard/allocation-bar";
import { PageHeader } from "@/components/shared/page-header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader badge="Dashboard" title="Net Worth Overview" />
      <div className="h-px w-full bg-border" />
      <NetWorthHero />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <NetWorthChart />
        </div>
        <div>
          <AllocationBar />
        </div>
      </div>
    </div>
  );
}
```

---

### Step 17 — Holdings Page

**src/app/dashboard/holdings/page.tsx:**

```tsx
"use client";

import { useState } from "react";
import { HoldingsTable } from "@/components/holdings/holdings-table";
import { ManualEntryForm } from "@/components/data/manual-entry-form";
import { PageHeader } from "@/components/shared/page-header";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HoldingsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <PageHeader badge="Holdings" title="Your Assets" />
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex h-10 items-center gap-2 rounded-[8px] px-4 font-body text-sm font-medium transition-all duration-160",
            showForm
              ? "border border-glass-border bg-glass-bg text-text-secondary"
              : "bg-accent-primary text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
          )}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Asset"}
        </button>
      </div>
      <div className="h-px w-full bg-border" />

      {showForm && (
        <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px]">
          <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">
            Add New Asset
          </h3>
          <ManualEntryForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <HoldingsTable />
    </div>
  );
}
```

---

### Step 18 — Data Import Page

**src/app/dashboard/data/page.tsx:**

```tsx
"use client";

import { useState } from "react";
import { CSVUpload } from "@/components/data/csv-upload";
import { ManualEntryForm } from "@/components/data/manual-entry-form";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

type Tab = "csv" | "manual";

export default function DataImportPage() {
  const [tab, setTab] = useState<Tab>("csv");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge="Data Import"
        title="Import Your Portfolio"
        description="Upload a COL Financial CSV or add assets manually."
      />
      <div className="h-px w-full bg-border" />

      {/* Tabs */}
      <div className="flex gap-1 rounded-[8px] border border-glass-border bg-glass-bg p-1">
        {(["csv", "manual"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-[6px] py-2 font-body text-sm font-medium transition-colors",
              tab === t
                ? "bg-accent-subtle text-accent-glow"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            {t === "csv" ? "CSV Upload" : "Manual Entry"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px]">
        {tab === "csv" && <CSVUpload />}
        {tab === "manual" && <ManualEntryForm />}
      </div>
    </div>
  );
}
```

---

### Step 19 — Dashboard Loading Skeleton

**src/app/dashboard/loading.tsx:**

```tsx
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-6 w-24 animate-pulse rounded bg-glass-bg" />
        <div className="h-10 w-64 animate-pulse rounded bg-glass-bg" />
      </div>
      <div className="h-px w-full bg-border" />
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-[120px] animate-pulse rounded-[16px] border border-glass-border bg-glass-bg",
              i === 0 && "md:col-span-2"
            )}
          />
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="h-[380px] animate-pulse rounded-[16px] border border-glass-border bg-glass-bg" />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
```

---

## Clerk JWT Template Setup

For RLS to work with Clerk, you need a JWT template in Clerk dashboard:

1. Go to **Clerk Dashboard** → **JWT Templates** → **New Template**
2. Name: `supabase`
3. Claims:
```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "aud": "authenticated",
  "role": "authenticated"
}
```
4. Set the signing algorithm to match your Supabase JWT secret, or configure Supabase to use Clerk's JWKS endpoint.

---

## Verification Checklist

- [ ] Dashboard loads and shows net worth hero cards (zeros when no data)
- [ ] Allocation bar renders correctly when assets exist
- [ ] Net worth chart renders with placeholder data
- [ ] Holdings table displays all assets with sorting
- [ ] Manual entry form: can add asset of each class
- [ ] Asset appears in holdings table after adding
- [ ] CSV upload: drag-and-drop works, file validation enforced
- [ ] COL Financial CSV parses correctly — stock codes, buy/sell quantities
- [ ] Imported CSV creates asset entries and transaction records
- [ ] Audit log records created for asset creation and CSV imports
- [ ] `/api/v1/portfolio/net-worth` returns correct breakdown
- [ ] `/api/v1/portfolio/holdings` returns paginated results
- [ ] `/api/v1/portfolio/allocation` returns percentages totaling ~100%
- [ ] `/api/v1/market/prices` returns cached price data
- [ ] All API routes reject unauthenticated requests with 401
- [ ] RLS ensures users only see their own data
- [ ] Price cache: CoinGecko returns PHP prices for crypto
- [ ] SWR hooks auto-refresh data at configured intervals
- [ ] `pnpm build` succeeds without errors

---

## Rollback Plan

1. **API 500 errors:** Check Supabase RLS policies. Ensure the Clerk JWT `sub` claim maps to `user_id` in the query context.
2. **CSV parse failures:** Test with a real COL Financial CSV. Adjust column name mappings in `col-financial.ts` to match actual headers.
3. **Chart rendering blank:** Verify Recharts is installed. Check that data array is not empty. Wrap chart in `"use client"` component.
4. **SWR showing stale data:** Clear browser cache. Check `refreshInterval` values in hooks.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Holdings table empty after adding asset | SWR cache stale | Call `mutate()` after POST or add `revalidateOnMount: true` |
| CSV upload 413 error | File too large | Check Vercel body size limit (default 4.5MB). Compress or split CSV. |
| "NaN" in net worth display | String instead of number from DB | Wrap with `Number()` before arithmetic |
| Chart not responsive | Missing `ResponsiveContainer` | Ensure chart is inside `<ResponsiveContainer width="100%" height={300}>` |
| Allocation percentages don't sum to 100% | Floating point | Use `.toFixed(1)` for display; store raw values |

---

**Phase 2 complete. Proceed to `phase-3-intelligence-layer/IMPLEMENTATION_GUIDE.md`.**
