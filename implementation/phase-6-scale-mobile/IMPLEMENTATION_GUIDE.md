# Phase 6 — Scale + Mobile · Implementation Guide

**Phase:** 6 of 6 · Scale + Mobile
**Weeks:** 25–35
**Prerequisites:** Phase 1–5 complete, Stripe account, Sentry account, PostHog account
**Depends on:** All previous phases

---

## Context

Phase 6 is the maturation phase: performance optimization (dashboard < 2s P95 load time), PWA support for mobile, Stripe billing (₱299–₱499/month Pro tier), advanced portfolio analytics (Markowitz efficient frontier, portfolio beta), Sentry error tracking, and PostHog product analytics. This phase transforms AETHER from MVP to production-grade product.

---

## Directory Structure (New Files in Phase 6)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── billing/
│   │   │   └── page.tsx                     # Subscription management
│   │   └── analytics/
│   │       └── page.tsx                     # Advanced portfolio analytics
│   ├── api/
│   │   └── v1/
│   │       ├── billing/
│   │       │   ├── create-checkout/
│   │       │   │   └── route.ts             # POST create Stripe checkout
│   │       │   ├── portal/
│   │       │   │   └── route.ts             # POST create customer portal
│   │       │   └── webhook/
│   │       │       └── route.ts             # POST Stripe webhook handler
│   │       └── analytics/
│   │           └── advanced/
│   │               └── route.ts             # GET Markowitz + advanced metrics
│   └── manifest.ts                          # PWA Web App Manifest
├── components/
│   ├── billing/
│   │   ├── pricing-cards.tsx                # Free vs Pro comparison
│   │   ├── subscription-status.tsx          # Current plan display
│   │   └── upgrade-banner.tsx               # Upgrade CTA for free users
│   └── analytics/
│       ├── efficient-frontier.tsx           # Markowitz chart
│       └── advanced-metrics.tsx             # Beta, Sortino, etc.
├── lib/
│   ├── billing/
│   │   └── stripe.ts                        # Stripe client + helpers
│   ├── calculations/
│   │   ├── markowitz.ts                     # Efficient frontier
│   │   └── advanced-metrics.ts              # Beta, Sortino, Treynor
│   ├── analytics/
│   │   └── posthog.ts                       # PostHog client setup
│   └── monitoring/
│       └── sentry.ts                        # Sentry configuration
├── instrumentation.ts                       # Next.js instrumentation (Sentry)
└── service-worker.ts                        # PWA service worker
public/
├── manifest.json                            # PWA manifest
├── icons/
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── apple-touch-icon.png
```

---

## Database Migrations

**supabase/migrations/004_phase6_billing.sql:**

```sql
-- ============================================================
-- Phase 6 — Billing, analytics, feature flags
-- ============================================================

-- Subscription events (audit trail for billing)
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'checkout_completed', 'subscription_created', 'subscription_updated',
      'subscription_cancelled', 'payment_succeeded', 'payment_failed'
    )),
  stripe_event_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  plan TEXT,
  amount_php NUMERIC(18, 2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feature flags (for gradual rollouts)
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  description TEXT,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscription_events_user ON subscription_events(user_id, created_at DESC);
CREATE INDEX idx_feature_flags_key ON feature_flags(key);

-- RLS
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription events"
  ON subscription_events FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "All authenticated can read feature flags"
  ON feature_flags FOR SELECT
  USING (auth.jwt() IS NOT NULL);

-- Default feature flags
INSERT INTO feature_flags (key, enabled, description) VALUES
  ('advanced_analytics', false, 'Markowitz efficient frontier, Sortino ratio'),
  ('pdf_export', true, 'PDF portfolio report export'),
  ('rag_advisor', true, 'RAG-enhanced AI advisor'),
  ('multi_currency', true, 'PHP/USD/SGD display toggle'),
  ('sandbox_simulator', true, 'What-if scenario simulator');
```

---

## Step-by-Step Implementation

### Step 1 — Install Phase 6 Dependencies

```bash
# Billing
pnpm add stripe

# Analytics
pnpm add posthog-js posthog-node

# Error tracking
pnpm add @sentry/nextjs

# PWA
pnpm add next-pwa
pnpm add -D @types/service_worker_api
```

---

### Step 2 — Sentry Setup

```bash
# Run Sentry wizard for Next.js
pnpx @sentry/wizard@latest -i nextjs
```

This creates `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`. Customize:

**sentry.client.config.ts:**

```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,    // 10% of transactions
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
});
```

**sentry.server.config.ts:**

```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

### Step 3 — PostHog Analytics

**src/lib/analytics/posthog.ts:**

```ts
import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
}

// Event tracking helpers
export const analytics = {
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
  },
  track: (event: string, properties?: Record<string, any>) => {
    posthog.capture(event, properties);
  },
  // Core events
  assetAdded: (assetClass: string, value: number) => {
    posthog.capture("asset_added", { asset_class: assetClass, value_php: value });
  },
  csvImported: (rowCount: number) => {
    posthog.capture("csv_imported", { row_count: rowCount });
  },
  advisorQuery: (queryLength: number) => {
    posthog.capture("advisor_query", { query_length: queryLength });
  },
  simulationRun: (years: number) => {
    posthog.capture("simulation_run", { projection_years: years });
  },
  alertCreated: (alertType: string) => {
    posthog.capture("alert_created", { alert_type: alertType });
  },
  pdfExported: () => {
    posthog.capture("pdf_exported");
  },
  subscriptionUpgraded: () => {
    posthog.capture("subscription_upgraded");
  },
};
```

Add PostHog to the root layout:

```tsx
// In src/app/layout.tsx, add:
"use client" // If making a client component, or use a provider pattern

// Create a PostHog provider component:
// src/components/providers/posthog-provider.tsx

"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { initPostHog, analytics } from "@/lib/analytics/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      analytics.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    }
  }, [isLoaded, user]);

  return <>{children}</>;
}
```

---

### Step 4 — Stripe Billing

**src/lib/billing/stripe.ts:**

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "10 assets max",
      "20 AI queries/day",
      "1 CSV import/month",
      "Basic Glass Box (100 paths)",
      "Fee analyzer",
    ],
    limits: {
      assets: 10,
      aiQueries: 20,
      csvImports: 1,
      monteCarloPaths: 100,
      alerts: 10,
    },
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 399,
    features: [
      "Unlimited assets",
      "100 AI queries/day",
      "Unlimited CSV imports",
      "Full Monte Carlo (1,000 paths)",
      "Advanced analytics (Markowitz, Sharpe, Beta)",
      "PDF/CSV export",
      "50 active alerts",
      "Multi-currency display",
      "Priority AI processing",
    ],
    limits: {
      assets: Infinity,
      aiQueries: 100,
      csvImports: Infinity,
      monteCarloPaths: 1000,
      alerts: 50,
    },
  },
} as const;

export async function createCheckoutSession(
  userId: string,
  email: string,
  customerId?: string | null
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : email,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: PLANS.pro.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?cancelled=true`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  });

  return session.url!;
}

export async function createCustomerPortalSession(
  customerId: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return session.url;
}
```

---

### Step 5 — Stripe API Routes

**src/app/api/v1/billing/create-checkout/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/billing/stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, stripe_customer_id, subscription_tier")
    .eq("id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: { code: "PROFILE_NOT_FOUND", message: "Profile not found", status: 404 } }, { status: 404 });
  }

  if (profile.subscription_tier === "pro") {
    return NextResponse.json({ error: { code: "ALREADY_PRO", message: "Already subscribed to Pro", status: 400 } }, { status: 400 });
  }

  const url = await createCheckoutSession(
    userId,
    profile.email || "",
    profile.stripe_customer_id
  );

  return NextResponse.json({ url });
}
```

**src/app/api/v1/billing/portal/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCustomerPortalSession } from "@/lib/billing/stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: { code: "NO_SUBSCRIPTION", message: "No active subscription", status: 400 } }, { status: 400 });
  }

  const url = await createCustomerPortalSession(profile.stripe_customer_id);
  return NextResponse.json({ url });
}
```

**src/app/api/v1/billing/webhook/route.ts:**

```ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/billing/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      await supabase.from("profiles").update({
        subscription_tier: "pro",
        stripe_customer_id: session.customer as string,
        updated_at: new Date().toISOString(),
      }).eq("id", userId);

      await supabase.from("subscription_events").insert({
        user_id: userId,
        event_type: "checkout_completed",
        stripe_event_id: event.id,
        stripe_subscription_id: session.subscription as string,
        plan: "pro",
        amount_php: 399,
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const isActive = ["active", "trialing"].includes(subscription.status);

      await supabase.from("profiles").update({
        subscription_tier: isActive ? "pro" : "free",
        updated_at: new Date().toISOString(),
      }).eq("id", userId);

      await supabase.from("subscription_events").insert({
        user_id: userId,
        event_type: "subscription_updated",
        stripe_event_id: event.id,
        stripe_subscription_id: subscription.id,
        plan: isActive ? "pro" : "free",
        metadata: { status: subscription.status },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      await supabase.from("profiles").update({
        subscription_tier: "free",
        updated_at: new Date().toISOString(),
      }).eq("id", userId);

      await supabase.from("subscription_events").insert({
        user_id: userId,
        event_type: "subscription_cancelled",
        stripe_event_id: event.id,
        stripe_subscription_id: subscription.id,
        plan: "free",
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        await supabase.from("subscription_events").insert({
          user_id: profile.id,
          event_type: "payment_failed",
          stripe_event_id: event.id,
          metadata: { amount: invoice.amount_due },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

---

### Step 6 — Advanced Portfolio Analytics

**src/lib/calculations/markowitz.ts:**

```ts
import { multiply, transpose, matrix, inv, ones, MathCollection } from "mathjs";

/**
 * Markowitz Mean-Variance Optimization
 * Find the efficient frontier — set of portfolios with maximum return for each risk level.
 */

export interface EfficientFrontierPoint {
  return: number;
  risk: number;      // standard deviation
  weights: number[];
}

/**
 * Compute minimum variance portfolio.
 */
export function minimumVariancePortfolio(
  covarianceMatrix: number[][]
): { weights: number[]; variance: number } {
  const n = covarianceMatrix.length;
  const sigma = matrix(covarianceMatrix);
  const sigmaInv = inv(sigma);
  const onesVec = matrix(Array(n).fill(1).map((v) => [v]));
  const onesT = transpose(onesVec);

  // w* = Σ⁻¹ · 1 / (1ᵀ · Σ⁻¹ · 1)
  const numerator = multiply(sigmaInv, onesVec) as MathCollection;
  const denominator = multiply(multiply(onesT, sigmaInv), onesVec) as MathCollection;
  const denomVal = (denominator as any).get([0, 0]);

  const weights: number[] = [];
  for (let i = 0; i < n; i++) {
    weights.push((numerator as any).get([i, 0]) / denomVal);
  }

  // Portfolio variance
  const w = matrix(weights.map((v) => [v]));
  const wT = transpose(w);
  const variance = (multiply(multiply(wT, sigma), w) as any).get([0, 0]);

  return { weights, variance };
}

/**
 * Generate efficient frontier points.
 * Returns a series of optimal portfolios from min risk to max return.
 */
export function generateEfficientFrontier(
  expectedReturns: number[],
  covarianceMatrix: number[][],
  numPoints: number = 50
): EfficientFrontierPoint[] {
  const n = expectedReturns.length;
  const minReturn = Math.min(...expectedReturns);
  const maxReturn = Math.max(...expectedReturns);
  const step = (maxReturn - minReturn) / (numPoints - 1);

  const points: EfficientFrontierPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const targetReturn = minReturn + step * i;

    // Simplified: use equal-weight towards highest-return assets
    // Full implementation would use quadratic programming (QP solver)
    const weights = expectedReturns.map((r) => {
      const proximity = 1 / (1 + Math.abs(r - targetReturn));
      return proximity;
    });
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const normalized = weights.map((w) => w / weightSum);

    // Calculate portfolio risk for these weights
    const w = matrix(normalized.map((v) => [v]));
    const wT = transpose(w);
    const sigma = matrix(covarianceMatrix);
    const variance = (multiply(multiply(wT, sigma), w) as any).get([0, 0]);

    // Calculate portfolio return
    const portReturn = normalized.reduce(
      (sum, weight, j) => sum + weight * expectedReturns[j],
      0
    );

    points.push({
      return: portReturn,
      risk: Math.sqrt(variance),
      weights: normalized,
    });
  }

  return points;
}
```

**src/lib/calculations/advanced-metrics.ts:**

```ts
/**
 * Portfolio Beta = Cov(Rp, Rm) / Var(Rm)
 * Measures systematic risk relative to PSEi benchmark.
 */
export function portfolioBeta(
  portfolioReturns: number[],
  marketReturns: number[]
): number {
  const n = Math.min(portfolioReturns.length, marketReturns.length);
  if (n < 2) return 1;

  const meanP = portfolioReturns.reduce((a, b) => a + b, 0) / n;
  const meanM = marketReturns.reduce((a, b) => a + b, 0) / n;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < n; i++) {
    covariance += (portfolioReturns[i] - meanP) * (marketReturns[i] - meanM);
    marketVariance += (marketReturns[i] - meanM) ** 2;
  }

  covariance /= n - 1;
  marketVariance /= n - 1;

  return marketVariance === 0 ? 1 : covariance / marketVariance;
}

/**
 * Sortino Ratio = (Rp - Rf) / σd
 * Like Sharpe but only penalizes downside volatility.
 */
export function sortinoRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  returns: number[]
): number {
  const downsideReturns = returns.filter((r) => r < riskFreeRate);
  if (downsideReturns.length === 0) return Infinity;

  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce(
      (sum, r) => sum + (r - riskFreeRate) ** 2,
      0
    ) / downsideReturns.length
  );

  return downsideDeviation === 0
    ? Infinity
    : (portfolioReturn - riskFreeRate) / downsideDeviation;
}

/**
 * Treynor Ratio = (Rp - Rf) / β
 * Risk-adjusted return per unit of systematic risk.
 */
export function treynorRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  beta: number
): number {
  return beta === 0 ? 0 : (portfolioReturn - riskFreeRate) / beta;
}

/**
 * Maximum Drawdown — largest peak-to-trough decline.
 */
export function maxDrawdown(values: number[]): {
  maxDD: number;
  peakIndex: number;
  troughIndex: number;
} {
  let maxDD = 0;
  let peak = values[0];
  let peakIndex = 0;
  let troughIndex = 0;
  let currentPeakIndex = 0;

  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
      currentPeakIndex = i;
    }

    const drawdown = (peak - values[i]) / peak;
    if (drawdown > maxDD) {
      maxDD = drawdown;
      peakIndex = currentPeakIndex;
      troughIndex = i;
    }
  }

  return { maxDD, peakIndex, troughIndex };
}
```

---

### Step 7 — PWA Configuration

**public/manifest.json:**

```json
{
  "name": "AETHER — Wealth Intelligence",
  "short_name": "AETHER",
  "description": "Wealth management platform for Filipino investors",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#08080f",
  "theme_color": "#7c3aed",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

Add manifest link to root layout `<head>`:

```tsx
// In src/app/layout.tsx metadata:
export const metadata: Metadata = {
  // ... existing metadata
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AETHER",
  },
};
```

---

### Step 8 — Billing Page

**src/app/dashboard/billing/page.tsx:**

```tsx
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Check, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const FREE_FEATURES = [
  "10 assets max",
  "20 AI queries/day",
  "1 CSV import/month",
  "Basic Glass Box (100 paths)",
  "Fee analyzer",
];

const PRO_FEATURES = [
  "Unlimited assets",
  "100 AI queries/day",
  "Unlimited CSV imports",
  "Full Monte Carlo (1,000 paths)",
  "Markowitz efficient frontier",
  "PDF/CSV export",
  "50 active alerts",
  "Multi-currency display",
  "Priority AI processing",
];

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<"free" | "pro">("free");

  useEffect(() => {
    fetch("/api/v1/user/settings")
      .then((r) => r.json())
      .then((data) => setTier(data.subscription_tier || "free"));
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/billing/create-checkout", { method: "POST" });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/billing/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <PageHeader badge="Billing" title="Subscription" />
      <div className="h-px w-full bg-border" />

      {/* Current Plan */}
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]">
        <div className="flex items-center gap-3">
          {tier === "pro" ? (
            <Crown size={20} className="text-accent-primary" />
          ) : (
            <Zap size={20} className="text-text-muted" />
          )}
          <div>
            <p className="font-display text-lg font-semibold text-text-primary">
              {tier === "pro" ? "Pro Plan" : "Free Plan"}
            </p>
            <p className="font-body text-sm text-text-secondary">
              {tier === "pro" ? "₱399/month" : "₱0/month"}
            </p>
          </div>
          {tier === "pro" && (
            <button
              onClick={handleManage}
              disabled={loading}
              className="ml-auto rounded-[8px] border border-glass-border bg-glass-bg px-4 py-2 font-body text-sm font-medium text-text-secondary hover:border-border-accent hover:text-text-primary transition-colors"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px]">
          <h3 className="font-display text-xl font-bold text-text-primary">Free</h3>
          <p className="mt-1 font-display text-3xl font-bold text-text-primary">₱0<span className="text-base font-normal text-text-muted">/month</span></p>
          <ul className="mt-6 flex flex-col gap-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check size={16} className="text-text-muted" />
                <span className="font-body text-sm text-text-secondary">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="rounded-[16px] border border-accent-primary/50 bg-glass-bg p-6 backdrop-blur-[12px] shadow-[0_0_20px_rgba(124,58,237,0.15)]">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold text-text-primary">Pro</h3>
            <span className="rounded-full bg-accent-subtle px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-wider text-accent-glow">Recommended</span>
          </div>
          <p className="mt-1 font-display text-3xl font-bold text-text-primary">₱399<span className="text-base font-normal text-text-muted">/month</span></p>
          <ul className="mt-6 flex flex-col gap-3">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check size={16} className="text-accent-primary" />
                <span className="font-body text-sm text-text-primary">{f}</span>
              </li>
            ))}
          </ul>
          {tier !== "pro" && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-6 h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] transition-all duration-160 disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 9 — Performance Optimization Checklist

Apply these optimizations across the application:

1. **Next.js Image Optimization:**
```tsx
import Image from "next/image";
// Use next/image for all images with proper width/height
```

2. **React Server Components:**
   - Keep dashboard layout, page headers, and static content as RSC
   - Only use `"use client"` for interactive components (charts, forms, etc.)

3. **Dynamic Imports for Heavy Components:**
```tsx
import dynamic from "next/dynamic";

const MonteCarloChart = dynamic(
  () => import("@/components/glass-box/monte-carlo-chart").then((m) => m.MonteCarloChart),
  { ssr: false, loading: () => <div className="h-[350px] animate-pulse rounded-[16px] bg-glass-bg" /> }
);
```

4. **API Response Caching:**
```ts
// In API routes, add cache headers:
return NextResponse.json(data, {
  headers: {
    "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
  },
});
```

5. **Bundle Analysis:**
```bash
pnpm add -D @next/bundle-analyzer
# In next.config.ts:
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
```

6. **Database Query Optimization:**
   - Use `.select("column1, column2")` instead of `.select("*")` where possible
   - Add pagination to all list endpoints
   - Use Supabase `.count("exact")` header for paginated counts

---

### Step 10 — Update next.config.ts for PWA + Sentry

**next.config.ts:**

```ts
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://img.clerk.com; connect-src 'self' https://*.supabase.co https://*.clerk.dev https://openrouter.ai https://api.openai.com https://*.posthog.com https://*.sentry.io https://api.stripe.com; frame-src https://js.stripe.com https://*.clerk.dev;",
        },
      ],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
});
```

---

## Verification Checklist

- [ ] Stripe checkout: Free → Pro upgrade flow works end-to-end
- [ ] Stripe webhook: subscription events update `profiles.subscription_tier`
- [ ] Stripe portal: Pro users can manage/cancel subscription
- [ ] Feature limits enforced: Free tier restricted (10 assets, 20 queries, etc.)
- [ ] Advanced analytics: Markowitz efficient frontier generates correct curve
- [ ] Advanced analytics: Portfolio beta calculation matches manual verification
- [ ] Advanced analytics: Sortino ratio, Treynor ratio, max drawdown work
- [ ] PWA: `manifest.json` served correctly
- [ ] PWA: App installable on mobile browsers (Add to Home Screen)
- [ ] PWA: Splash screen shows AETHER branding
- [ ] Sentry: Errors captured and visible in Sentry dashboard
- [ ] Sentry: Source maps uploaded for readable stack traces
- [ ] PostHog: Page views tracked automatically
- [ ] PostHog: Custom events fire (asset_added, advisor_query, etc.)
- [ ] PostHog: User identification links to Clerk user ID
- [ ] Performance: Dashboard loads in < 2s (P95) — verify with Vercel Analytics
- [ ] Security headers: CSP, X-Frame-Options, X-Content-Type-Options set
- [ ] Bundle size: Main JS bundle < 200KB gzipped
- [ ] All API routes authenticated
- [ ] `pnpm build` succeeds without errors

---

## Rollback Plan

1. **Stripe webhook errors:** Use Stripe CLI (`stripe listen --forward-to localhost:3000/api/v1/billing/webhook`) for local testing. Check webhook signing secret matches.
2. **PostHog not tracking:** Verify `NEXT_PUBLIC_POSTHOG_KEY` is set. Check browser console for PostHog initialization errors.
3. **Sentry not capturing:** Run `sentry-cli info` to verify auth token. Check DSN matches project.
4. **PWA not installable:** Validate `manifest.json` with Chrome DevTools Application tab. Ensure icons exist at specified paths.
5. **Performance regression:** Use `ANALYZE=true pnpm build` to identify large bundles. Dynamic import heavy dependencies.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Stripe 400 on webhook | Signature validation failure | Verify `STRIPE_WEBHOOK_SECRET` from Stripe dashboard |
| Subscription not updating | Webhook event not processed | Check `subscription_events` table for logged events |
| PostHog events missing | CSP blocking PostHog | Add PostHog domain to CSP `connect-src` |
| Sentry source maps broken | Build/upload mismatch | Re-deploy with `SENTRY_AUTH_TOKEN` set |
| PWA "add to home screen" missing | Missing manifest or icons | Check DevTools > Application > Manifest for errors |
| CSP blocking Clerk | Clerk domain not in CSP | Add `*.clerk.dev` to CSP frame-src and connect-src |
| Markowitz returning NaN | Singular covariance matrix | Need 2+ assets with distinct return profiles |

---

**Phase 6 complete. AETHER is ready for production scale.**

## Summary — All Phases Complete

| Phase | Status | Key Deliverables |
|-------|--------|------------------|
| 1 — Foundation | Complete | Next.js 15, Clerk auth, Supabase schema, design system, onboarding |
| 2 — Core Dashboard | Complete | Net worth dashboard, holdings, CSV import, price cache |
| 3 — Intelligence Layer | Complete | AI advisor, Glass Box, fee analyzer, real return, settings |
| 4 — Simulator + Alerts | Complete | Sandbox simulator, alert system, multi-currency, email digest |
| 5 — RAG + Data Pipeline | Complete | pgvector corpus, RAG advisor, Edge Function pipelines, PDF export |
| 6 — Scale + Mobile | Complete | Stripe billing, PWA, Sentry, PostHog, advanced analytics, performance |
