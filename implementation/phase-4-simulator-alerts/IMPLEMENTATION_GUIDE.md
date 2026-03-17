# Phase 4 — Simulator + Alerts · Implementation Guide

**Phase:** 4 of 6 · Simulator + Alerts
**Weeks:** 13–16
**Prerequisites:** Phase 1–3 complete (MVP launched), VAPID keys generated, Resend account
**Depends on:** Phase 3 (Glass Box engine, Monte Carlo, net worth calculations)

---

## Context

Phase 4 adds post-MVP features: Sandbox Wealth Simulator (what-if scenarios isolated from real portfolio), Alert System (web push + in-app notifications), Multi-Currency Display (PHP/USD/SGD toggle), and Weekly Email Digest via Resend. These features enhance user engagement without changing the core MVP.

---

## Directory Structure (New Files in Phase 4)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── simulator/
│   │   │   └── page.tsx                     # Sandbox simulator page
│   │   └── alerts/
│   │       └── page.tsx                     # Alert management page
│   └── api/
│       └── v1/
│           ├── simulator/
│           │   ├── scenarios/
│           │   │   └── route.ts             # CRUD scenarios
│           │   └── run/
│           │       └── route.ts             # POST run simulation
│           ├── alerts/
│           │   ├── route.ts                 # CRUD alerts
│           │   ├── subscribe/
│           │   │   └── route.ts             # POST web push subscription
│           │   └── check/
│           │       └── route.ts             # POST trigger alert checks
│           └── notifications/
│               └── route.ts                 # GET in-app notifications
├── components/
│   ├── simulator/
│   │   ├── scenario-builder.tsx             # Drag sliders, add/remove assets
│   │   ├── scenario-comparison.tsx          # Side-by-side scenario view
│   │   ├── event-timeline.tsx               # Annotated events on projection
│   │   └── scenario-card.tsx                # Saved scenario card
│   ├── alerts/
│   │   ├── alert-list.tsx                   # Active alerts with toggles
│   │   ├── create-alert-form.tsx            # New alert creation
│   │   ├── alert-history.tsx                # Past triggered alerts
│   │   └── push-permission-banner.tsx       # Request push notification permission
│   └── currency/
│       └── currency-switcher.tsx            # PHP/USD/SGD display toggle
├── lib/
│   ├── simulator/
│   │   ├── engine.ts                        # Scenario simulation engine
│   │   └── types.ts                         # Simulator types
│   ├── alerts/
│   │   ├── push.ts                          # Web Push API helpers
│   │   ├── checker.ts                       # Alert condition checker
│   │   └── types.ts                         # Alert types
│   ├── email/
│   │   └── digest.ts                        # Weekly digest email template
│   └── currency/
│       └── converter.ts                     # Multi-currency conversion
└── types/
    ├── simulator.ts                         # Simulator types
    └── alerts.ts                            # Alert types
```

---

## Database Migrations

**supabase/migrations/002_phase4_tables.sql:**

```sql
-- ============================================================
-- Phase 4 — Scenarios, Alerts, Notifications
-- ============================================================

-- Saved simulator scenarios
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_portfolio JSONB NOT NULL,          -- Snapshot of portfolio at creation
  modifications JSONB NOT NULL DEFAULT '[]', -- Array of changes
  events JSONB NOT NULL DEFAULT '[]',     -- Annotated events
  projection_years INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL
    CHECK (alert_type IN (
      'price_target', 'psei_threshold', 'bsp_rate_change',
      'crypto_volatility', 'portfolio_drop', 'portfolio_gain'
    )),
  asset_ticker TEXT,                       -- Optional: specific asset
  condition TEXT NOT NULL
    CHECK (condition IN ('above', 'below', 'change_pct')),
  threshold NUMERIC(18, 8) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- In-app notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Web push subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Indexes
CREATE INDEX idx_scenarios_user ON scenarios(user_id);
CREATE INDEX idx_alerts_user ON alerts(user_id, is_active);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);

-- RLS
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own scenarios"
  ON scenarios FOR ALL USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can CRUD own alerts"
  ON alerts FOR ALL USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can manage own push subscriptions"
  ON push_subscriptions FOR ALL USING ((auth.jwt() ->> 'sub') = user_id);

-- Updated_at triggers
CREATE TRIGGER set_scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Step-by-Step Implementation

### Step 1 — Install Phase 4 Dependencies

```bash
# Web Push
pnpm add web-push
pnpm add -D @types/web-push

# Email
pnpm add resend

# Additional UI
pnpx shadcn@latest add switch slider popover
```

---

### Step 2 — Simulator Types

**src/lib/simulator/types.ts:**

```ts
export interface ScenarioModification {
  type: "add_asset" | "remove_asset" | "change_allocation" | "change_savings_rate" | "one_time_event";
  asset?: {
    name: string;
    class: string;
    value: number;
  };
  assetId?: string;
  newAllocationPct?: number;
  savingsRateChange?: number;
  event?: {
    name: string;
    amount: number;
    date: string;
    type: "inflow" | "outflow";
  };
}

export interface Scenario {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  base_portfolio: {
    netWorth: number;
    assets: Array<{ name: string; class: string; value: number; weight: number }>;
  };
  modifications: ScenarioModification[];
  events: Array<{ name: string; amount: number; date: string; type: "inflow" | "outflow" }>;
  projection_years: number;
  created_at: string;
  updated_at: string;
}
```

---

### Step 3 — Simulator Engine

**src/lib/simulator/engine.ts:**

```ts
import { runMonteCarloSimulation } from "@/lib/calculations/monte-carlo";
import type { ScenarioModification } from "./types";

export interface SimulationInput {
  baseNetWorth: number;
  baseReturn: number;
  baseVolatility: number;
  modifications: ScenarioModification[];
  years: number;
  monthlySavings: number;
}

export interface SimulationOutput {
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  timeLabels: string[];
  stats: {
    mean: number;
    median: number;
    min: number;
    max: number;
    probLoss: number;
  };
  events: Array<{ year: number; label: string; impact: number }>;
}

export function runScenarioSimulation(input: SimulationInput): SimulationOutput {
  let adjustedValue = input.baseNetWorth;
  let adjustedReturn = input.baseReturn;
  let adjustedVolatility = input.baseVolatility;
  const eventAnnotations: SimulationOutput["events"] = [];

  // Apply modifications
  for (const mod of input.modifications) {
    switch (mod.type) {
      case "add_asset":
        adjustedValue += mod.asset?.value || 0;
        break;
      case "remove_asset":
        adjustedValue -= mod.asset?.value || 0;
        break;
      case "change_allocation":
        // Shift return/volatility based on target allocation
        if (mod.newAllocationPct !== undefined) {
          const equityShift = (mod.newAllocationPct - 60) / 100; // baseline 60% equity
          adjustedReturn += equityShift * 0.04;
          adjustedVolatility += equityShift * 0.08;
        }
        break;
      case "change_savings_rate":
        // Monthly savings added to initial value as lump sum approximation
        adjustedValue += (mod.savingsRateChange || 0) * 12 * input.years * 0.5;
        break;
      case "one_time_event":
        if (mod.event) {
          const impact = mod.event.type === "inflow" ? mod.event.amount : -mod.event.amount;
          adjustedValue += impact;
          const eventYear = Math.max(1, Math.round(
            (new Date(mod.event.date).getTime() - Date.now()) / (365.25 * 24 * 60 * 60 * 1000)
          ));
          eventAnnotations.push({
            year: eventYear,
            label: mod.event.name,
            impact,
          });
        }
        break;
    }
  }

  // Run Monte Carlo on modified portfolio
  const mcResult = runMonteCarloSimulation({
    initialValue: Math.max(adjustedValue, 0),
    expectedReturn: adjustedReturn,
    volatility: Math.max(adjustedVolatility, 0.01),
    years: input.years,
    numPaths: 1000,
    stepsPerYear: 12,
  });

  return {
    percentiles: mcResult.percentiles,
    timeLabels: mcResult.timeLabels,
    stats: mcResult.stats,
    events: eventAnnotations,
  };
}
```

---

### Step 4 — Alert Types & Checker

**src/lib/alerts/types.ts:**

```ts
export type AlertType =
  | "price_target"
  | "psei_threshold"
  | "bsp_rate_change"
  | "crypto_volatility"
  | "portfolio_drop"
  | "portfolio_gain";

export type AlertCondition = "above" | "below" | "change_pct";

export interface Alert {
  id: string;
  user_id: string;
  alert_type: AlertType;
  asset_ticker: string | null;
  condition: AlertCondition;
  threshold: number;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  alert_id: string | null;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}
```

**src/lib/alerts/checker.ts:**

```ts
import type { Alert } from "./types";

interface PriceData {
  ticker: string;
  price_php: number;
}

interface CheckResult {
  alert: Alert;
  triggered: boolean;
  currentValue: number;
  message: string;
}

export function checkAlertConditions(
  alerts: Alert[],
  prices: PriceData[],
  portfolioValue: number,
  previousPortfolioValue: number
): CheckResult[] {
  const priceMap = new Map(prices.map((p) => [p.ticker, p.price_php]));
  const results: CheckResult[] = [];

  for (const alert of alerts) {
    if (!alert.is_active) continue;

    let currentValue = 0;
    let triggered = false;
    let message = "";

    switch (alert.alert_type) {
      case "price_target": {
        currentValue = priceMap.get(alert.asset_ticker || "") || 0;
        if (alert.condition === "above") {
          triggered = currentValue >= alert.threshold;
          message = `${alert.asset_ticker} reached ₱${currentValue.toLocaleString()} (target: ₱${alert.threshold.toLocaleString()})`;
        } else {
          triggered = currentValue <= alert.threshold;
          message = `${alert.asset_ticker} dropped to ₱${currentValue.toLocaleString()} (threshold: ₱${alert.threshold.toLocaleString()})`;
        }
        break;
      }

      case "portfolio_drop": {
        currentValue = portfolioValue;
        const changePct = previousPortfolioValue > 0
          ? ((portfolioValue - previousPortfolioValue) / previousPortfolioValue) * 100
          : 0;
        triggered = changePct <= -alert.threshold;
        message = `Portfolio dropped ${Math.abs(changePct).toFixed(1)}% (threshold: ${alert.threshold}%)`;
        break;
      }

      case "portfolio_gain": {
        currentValue = portfolioValue;
        const changePct = previousPortfolioValue > 0
          ? ((portfolioValue - previousPortfolioValue) / previousPortfolioValue) * 100
          : 0;
        triggered = changePct >= alert.threshold;
        message = `Portfolio gained ${changePct.toFixed(1)}% (threshold: ${alert.threshold}%)`;
        break;
      }

      case "psei_threshold": {
        currentValue = priceMap.get("PSEI") || 0;
        triggered = alert.condition === "above"
          ? currentValue >= alert.threshold
          : currentValue <= alert.threshold;
        message = `PSEi at ${currentValue.toLocaleString()} (threshold: ${alert.threshold.toLocaleString()})`;
        break;
      }

      case "crypto_volatility": {
        currentValue = priceMap.get(alert.asset_ticker || "BTC") || 0;
        // Simplified: check 24h change percentage
        triggered = false; // Requires historical data comparison
        message = `${alert.asset_ticker} volatility check`;
        break;
      }

      default:
        continue;
    }

    results.push({ alert, triggered, currentValue, message });
  }

  return results;
}
```

---

### Step 5 — Web Push Helpers

**src/lib/alerts/push.ts:**

```ts
import webpush from "web-push";

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_CONTACT_EMAIL || "hello@aether.ph"}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth_key: string;
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: { title: string; body: string; url?: string }
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth_key,
        },
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (error: any) {
    if (error.statusCode === 410) {
      // Subscription expired — should be removed from DB
      return false;
    }
    console.error("Push notification failed:", error);
    return false;
  }
}
```

---

### Step 6 — Multi-Currency Converter

**src/lib/currency/converter.ts:**

```ts
export type DisplayCurrency = "PHP" | "USD" | "SGD";

// Rates are fetched from price_cache; these are fallbacks
const FALLBACK_RATES: Record<string, number> = {
  "PHP/PHP": 1,
  "USD/PHP": 56.5,
  "SGD/PHP": 42.1,
  "PHP/USD": 1 / 56.5,
  "PHP/SGD": 1 / 42.1,
  "USD/USD": 1,
  "SGD/SGD": 1,
  "USD/SGD": 56.5 / 42.1,
  "SGD/USD": 42.1 / 56.5,
};

export function convertCurrency(
  amountPhp: number,
  targetCurrency: DisplayCurrency,
  rates?: Record<string, number>
): number {
  if (targetCurrency === "PHP") return amountPhp;

  const rateKey = `PHP/${targetCurrency}`;
  const rate = rates?.[rateKey] || FALLBACK_RATES[rateKey] || 1;
  return amountPhp * rate;
}

export function getCurrencySymbol(currency: DisplayCurrency): string {
  switch (currency) {
    case "PHP": return "₱";
    case "USD": return "$";
    case "SGD": return "S$";
    default: return "₱";
  }
}

export function formatInCurrency(
  amountPhp: number,
  currency: DisplayCurrency,
  rates?: Record<string, number>
): string {
  const converted = convertCurrency(amountPhp, currency, rates);
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
```

---

### Step 7 — Currency Switcher Component

**src/components/currency/currency-switcher.tsx:**

```tsx
"use client";

import { cn } from "@/lib/utils";
import type { DisplayCurrency } from "@/lib/currency/converter";

const currencies: DisplayCurrency[] = ["PHP", "USD", "SGD"];

interface CurrencySwitcherProps {
  value: DisplayCurrency;
  onChange: (currency: DisplayCurrency) => void;
}

export function CurrencySwitcher({ value, onChange }: CurrencySwitcherProps) {
  return (
    <div className="flex rounded-[8px] border border-glass-border bg-glass-bg p-0.5">
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={cn(
            "rounded-[6px] px-3 py-1 font-body text-xs font-medium transition-colors",
            value === c
              ? "bg-accent-subtle text-accent-glow"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
```

---

### Step 8 — Weekly Email Digest

**src/lib/email/digest.ts:**

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface DigestData {
  userName: string;
  email: string;
  netWorth: number;
  weeklyChange: number;
  weeklyChangePct: number;
  topGainers: Array<{ name: string; changePct: number }>;
  topLosers: Array<{ name: string; changePct: number }>;
  alertsTriggered: number;
}

export async function sendWeeklyDigest(data: DigestData): Promise<boolean> {
  const changeColor = data.weeklyChangePct >= 0 ? "#34d399" : "#f87171";
  const changeSign = data.weeklyChangePct >= 0 ? "+" : "";

  try {
    await resend.emails.send({
      from: "AETHER <digest@aether.ph>",
      to: data.email,
      subject: `Weekly Portfolio Digest — ${changeSign}${data.weeklyChangePct.toFixed(1)}% this week`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; background: #08080f; color: #f1f0ff; padding: 32px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-family: 'Syne', sans-serif; font-size: 24px; letter-spacing: 0.05em; color: #f1f0ff;">AETHER</h1>
            <p style="color: #9492b0; font-size: 14px;">Weekly Portfolio Digest</p>
          </div>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #9492b0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Net Worth</p>
            <p style="font-size: 32px; font-weight: bold; margin: 8px 0;">₱${data.netWorth.toLocaleString()}</p>
            <p style="color: ${changeColor}; font-size: 16px; font-weight: 500;">
              ${changeSign}₱${Math.abs(data.weeklyChange).toLocaleString()} (${changeSign}${data.weeklyChangePct.toFixed(2)}%)
            </p>
          </div>

          ${data.topGainers.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <p style="color: #9492b0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Top Gainers</p>
            ${data.topGainers.map((g) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span>${g.name}</span>
                <span style="color: #34d399;">+${g.changePct.toFixed(1)}%</span>
              </div>
            `).join("")}
          </div>
          ` : ""}

          ${data.topLosers.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <p style="color: #9492b0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Top Losers</p>
            ${data.topLosers.map((l) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span>${l.name}</span>
                <span style="color: #f87171;">${l.changePct.toFixed(1)}%</span>
              </div>
            `).join("")}
          </div>
          ` : ""}

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              View Dashboard
            </a>
          </div>

          <p style="color: #4e4c6a; font-size: 11px; text-align: center; margin-top: 32px;">
            You're receiving this because you have an AETHER account. Unsubscribe in Settings.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send digest:", error);
    return false;
  }
}
```

---

### Step 9 — Simulator API Routes

**src/app/api/v1/simulator/scenarios/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("scenarios")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: { code: "DB_ERROR", message: error.message, status: 500 } }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });

  const body = await request.json();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("scenarios")
    .insert({
      user_id: userId,
      name: body.name,
      description: body.description || null,
      base_portfolio: body.base_portfolio,
      modifications: body.modifications || [],
      events: body.events || [],
      projection_years: body.projection_years || 10,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: { code: "DB_ERROR", message: error.message, status: 500 } }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

**src/app/api/v1/simulator/run/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { runScenarioSimulation } from "@/lib/simulator/engine";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });

  const body = await request.json();

  const result = runScenarioSimulation({
    baseNetWorth: body.baseNetWorth,
    baseReturn: body.baseReturn || 0.08,
    baseVolatility: body.baseVolatility || 0.15,
    modifications: body.modifications || [],
    years: body.years || 10,
    monthlySavings: body.monthlySavings || 0,
  });

  return NextResponse.json(result);
}
```

---

### Step 10 — Alerts API Routes

**src/app/api/v1/alerts/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const createAlertSchema = z.object({
  alert_type: z.enum(["price_target", "psei_threshold", "bsp_rate_change", "crypto_volatility", "portfolio_drop", "portfolio_gain"]),
  asset_ticker: z.string().nullable().optional(),
  condition: z.enum(["above", "below", "change_pct"]),
  threshold: z.number().positive(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });

  // Check alert limits
  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", userId).single();
  const { count } = await supabase.from("alerts").select("*", { count: "exact", head: true }).eq("is_active", true);

  const limit = profile?.subscription_tier === "pro" ? 50 : 10;
  if ((count || 0) >= limit) {
    return NextResponse.json({ error: { code: "LIMIT_REACHED", message: `Maximum ${limit} active alerts allowed`, status: 400 } }, { status: 400 });
  }

  const body = await request.json();
  const parsed = createAlertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message, status: 400 } }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("alerts")
    .insert({ user_id: userId, ...parsed.data })
    .select()
    .single();

  if (error) return NextResponse.json({ error: { code: "DB_ERROR", message: error.message, status: 500 } }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

---

### Step 11 — Simulator Page

**src/app/dashboard/simulator/page.tsx:**

```tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { MonteCarloChart } from "@/components/glass-box/monte-carlo-chart";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, Play, Save } from "lucide-react";

interface Modification {
  type: string;
  label: string;
  value: number;
}

export default function SimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [params, setParams] = useState({
    baseNetWorth: 4000000,
    baseReturn: 0.08,
    baseVolatility: 0.15,
    years: 10,
    monthlySavings: 20000,
  });
  const [modifications, setModifications] = useState<Modification[]>([]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/simulator/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...params, modifications }),
      });
      const data = await response.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-[8px] border border-glass-border bg-bg-elevated px-3 py-2 font-body text-sm text-text-primary focus:border-accent-bright focus:outline-none";
  const labelClass = "font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader badge="Simulator" title="Sandbox Wealth Simulator" description="Test what-if scenarios without affecting your real portfolio." />
      <div className="h-px w-full bg-border" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Controls */}
        <div className="rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]">
          <h3 className="font-display text-base font-semibold text-text-primary mb-4">Parameters</h3>

          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Starting Net Worth (₱)</label>
              <input type="number" value={params.baseNetWorth} onChange={(e) => setParams({ ...params, baseNetWorth: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Expected Annual Return (%)</label>
              <input type="number" step="0.01" value={(params.baseReturn * 100).toFixed(1)} onChange={(e) => setParams({ ...params, baseReturn: Number(e.target.value) / 100 })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Volatility (%)</label>
              <input type="number" step="0.01" value={(params.baseVolatility * 100).toFixed(1)} onChange={(e) => setParams({ ...params, baseVolatility: Number(e.target.value) / 100 })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Monthly Savings (₱)</label>
              <input type="number" value={params.monthlySavings} onChange={(e) => setParams({ ...params, monthlySavings: Number(e.target.value) })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Projection Years</label>
              <input type="number" min={1} max={30} value={params.years} onChange={(e) => setParams({ ...params, years: Number(e.target.value) })} className={inputClass} />
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="mt-5 flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] transition-all duration-160 disabled:opacity-50"
          >
            <Play size={16} />
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </div>

        {/* Results */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {result ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard label="Median (10yr)" value={formatCurrency(result.stats.median)} trend="neutral" />
                <StatCard label="Best Case (90th)" value={formatCurrency(result.stats.max)} trend="up" />
                <StatCard label="Worst Case (10th)" value={formatCurrency(result.stats.min)} trend="down" />
                <StatCard label="Prob. of Loss" value={`${(result.stats.probLoss * 100).toFixed(1)}%`} trend={result.stats.probLoss > 0.3 ? "down" : "up"} />
              </div>
              <MonteCarloChart percentiles={result.percentiles} timeLabels={result.timeLabels} />
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-[16px] border border-glass-border bg-glass-bg backdrop-blur-[12px]">
              <p className="font-body text-sm text-text-muted">
                Configure parameters and run a simulation to see projections.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 12 — Alerts Page

**src/app/dashboard/alerts/page.tsx:**

```tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { Bell, Plus, Trash2 } from "lucide-react";
import type { Alert, AlertType } from "@/lib/alerts/types";

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  price_target: "Price Target",
  psei_threshold: "PSEi Threshold",
  bsp_rate_change: "BSP Rate Change",
  crypto_volatility: "Crypto Volatility",
  portfolio_drop: "Portfolio Drop",
  portfolio_gain: "Portfolio Gain",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    alert_type: "price_target" as AlertType,
    asset_ticker: "",
    condition: "above" as "above" | "below" | "change_pct",
    threshold: "",
  });

  useEffect(() => {
    fetch("/api/v1/alerts").then((r) => r.json()).then(setAlerts);
  }, []);

  const createAlert = async () => {
    const response = await fetch("/api/v1/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        threshold: parseFloat(form.threshold),
        asset_ticker: form.asset_ticker || null,
      }),
    });
    if (response.ok) {
      const newAlert = await response.json();
      setAlerts([newAlert, ...alerts]);
      setShowForm(false);
      setForm({ alert_type: "price_target", asset_ticker: "", condition: "above", threshold: "" });
    }
  };

  const inputClass = "w-full rounded-[8px] border border-glass-border bg-bg-elevated px-3 py-2 font-body text-sm text-text-primary focus:border-accent-bright focus:outline-none";

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <PageHeader badge="Alerts" title="Alert Management" description="Get notified when market conditions change." />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex h-10 items-center gap-2 rounded-[8px] bg-accent-primary px-4 font-body text-sm font-medium text-white shadow-glow hover:bg-accent-bright transition-all"
        >
          <Plus size={16} /> New Alert
        </button>
      </div>
      <div className="h-px w-full bg-border" />

      {/* Create Alert Form */}
      {showForm && (
        <div className="rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary mb-1 block">Type</label>
              <select value={form.alert_type} onChange={(e) => setForm({ ...form, alert_type: e.target.value as AlertType })} className={inputClass}>
                {Object.entries(ALERT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary mb-1 block">Asset Ticker</label>
              <input value={form.asset_ticker} onChange={(e) => setForm({ ...form, asset_ticker: e.target.value })} placeholder="e.g., BTC, JFC" className={inputClass} />
            </div>
            <div>
              <label className="font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary mb-1 block">Condition</label>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value as any })} className={inputClass}>
                <option value="above">Above</option>
                <option value="below">Below</option>
                <option value="change_pct">Change %</option>
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary mb-1 block">Threshold</label>
              <input type="number" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} placeholder="0" className={inputClass} />
            </div>
          </div>
          <button onClick={createAlert} className="mt-4 h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow hover:bg-accent-bright active:scale-[0.97] transition-all">
            Create Alert
          </button>
        </div>
      )}

      {/* Alert List */}
      <div className="flex flex-col gap-3">
        {alerts.length === 0 ? (
          <div className="rounded-[16px] border border-glass-border bg-glass-bg p-8 text-center">
            <Bell size={32} className="mx-auto mb-3 text-text-muted" />
            <p className="font-body text-sm text-text-muted">No alerts configured yet.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between rounded-[12px] border border-glass-border bg-glass-bg px-4 py-3 backdrop-blur-[12px]">
              <div>
                <p className="font-body text-sm font-medium text-text-primary">
                  {ALERT_TYPE_LABELS[alert.alert_type]}
                  {alert.asset_ticker && ` — ${alert.asset_ticker}`}
                </p>
                <p className="font-body text-xs text-text-muted">
                  {alert.condition} {alert.threshold}
                  {alert.last_triggered_at && ` · Last triggered: ${new Date(alert.last_triggered_at).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", alert.is_active ? "bg-success" : "bg-text-muted")} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## Verification Checklist

- [ ] Simulator: Can configure parameters (net worth, return, volatility, years)
- [ ] Simulator: Monte Carlo runs and displays fan chart correctly
- [ ] Simulator: Statistics panel shows median, best/worst case, probability of loss
- [ ] Simulator: Scenarios can be saved and loaded
- [ ] Alerts: Can create alerts of each type (price target, portfolio drop, etc.)
- [ ] Alerts: Alert limits enforced (10 free, 50 pro)
- [ ] Alerts: Active/inactive toggle works
- [ ] Web Push: Browser permission request displays
- [ ] Web Push: Notifications deliver when alert triggers
- [ ] Multi-currency: PHP/USD/SGD switcher updates all displayed values
- [ ] Email digest: Weekly summary email sends with correct data and AETHER styling
- [ ] All new tables have RLS policies applied
- [ ] New API routes reject unauthenticated requests
- [ ] `pnpm build` succeeds

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Web push "denied" | User blocked notifications | Must re-enable in browser settings |
| Resend 403 | Domain not verified | Verify sending domain in Resend dashboard |
| Simulator NaN | Invalid parameters (0 volatility, negative value) | Add input validation with min values |
| VAPID key error | Keys not generated | Run `npx web-push generate-vapid-keys` |
| Alert never triggers | Checker not running | Set up Supabase Edge Function or cron to call `/api/v1/alerts/check` |

---

**Phase 4 complete. Proceed to `phase-5-rag-data-pipeline/IMPLEMENTATION_GUIDE.md`.**
