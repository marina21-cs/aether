# Phase 3 — Intelligence Layer · Implementation Guide

**Phase:** 3 of 6 · Intelligence Layer (MVP Launch)
**Weeks:** 9–12
**Prerequisites:** Phase 1 + Phase 2 complete, OpenRouter API key obtained
**Depends on:** Phase 2 (portfolio data, price cache, holdings)

---

## Context

Phase 3 is the final MVP phase. It adds the AI Financial Advisor (via OpenRouter + Vercel AI SDK with streaming), the Glass Box Predictive Engine (portfolio variance + Monte Carlo in Web Workers), the Hidden Fee Analyzer, Real-Return Calculator, Performance History with PSEi benchmarking, and the Settings page. After this phase, AETHER launches as a public beta.

---

## Directory Structure (New Files in Phase 3)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── advisor/
│   │   │   └── page.tsx                     # Full-page AI advisor view
│   │   ├── glass-box/
│   │   │   └── page.tsx                     # Glass Box engine page
│   │   ├── performance/
│   │   │   └── page.tsx                     # Performance history page
│   │   ├── fees/
│   │   │   └── page.tsx                     # Fee analyzer page
│   │   └── settings/
│   │       └── page.tsx                     # Settings + profile page
│   └── api/
│       └── v1/
│           ├── advisor/
│           │   └── ask/
│           │       └── route.ts             # POST AI advisor (streaming)
│           ├── analytics/
│           │   ├── real-return/
│           │   │   └── route.ts             # GET inflation-adjusted returns
│           │   ├── fee-scan/
│           │   │   └── route.ts             # GET fee analysis
│           │   └── glass-box/
│           │       └── route.ts             # GET portfolio variance + MC data
│           ├── performance/
│           │   └── history/
│           │       └── route.ts             # GET performance time-series
│           └── user/
│               ├── settings/
│               │   └── route.ts             # GET/PUT user preferences
│               └── risk-profile/
│                   └── route.ts             # PUT risk tolerance
├── components/
│   ├── advisor/
│   │   ├── advisor-chat.tsx                 # Terminal-style AI chat interface
│   │   ├── advisor-message.tsx              # Single message (structured format)
│   │   ├── advisor-input.tsx                # Text input with submit
│   │   └── advisor-disclaimer.tsx           # Mandatory disclaimer
│   ├── glass-box/
│   │   ├── monte-carlo-chart.tsx            # Fan chart with percentile bands
│   │   ├── covariance-heatmap.tsx           # Matrix heatmap visualization
│   │   ├── assumptions-panel.tsx            # Editable assumptions
│   │   └── variance-display.tsx             # Portfolio variance formula
│   ├── analytics/
│   │   ├── fee-analyzer-card.tsx            # Fee scan results
│   │   ├── real-return-table.tsx            # Nominal vs real return
│   │   └── performance-chart.tsx            # Performance with benchmarks
│   └── settings/
│       ├── profile-form.tsx                 # Edit name, risk, currency
│       └── danger-zone.tsx                  # Delete account section
├── lib/
│   ├── ai/
│   │   ├── system-prompt.ts                 # System prompt builder
│   │   ├── portfolio-context.ts             # Portfolio → context string
│   │   └── rate-limiter.ts                  # Per-user query rate limiting
│   ├── calculations/
│   │   ├── monte-carlo.ts                   # Monte Carlo simulation logic
│   │   ├── portfolio-variance.ts            # σp² = wᵀΣw computation
│   │   ├── fee-analyzer.ts                  # Fee compound cost formula
│   │   ├── real-return.ts                   # Inflation-adjusted returns
│   │   └── performance.ts                   # Historical performance calc
│   └── workers/
│       └── monte-carlo.worker.ts            # Web Worker for MC simulation
└── types/
    └── advisor.ts                           # AI advisor types
```

---

## Step-by-Step Implementation

### Step 1 — Install Phase 3 Dependencies

```bash
# AI SDK (OpenRouter uses OpenAI-compatible API)
pnpm add ai @ai-sdk/openai

# Math
pnpm add mathjs

# D3 for Glass Box visualizations
pnpm add d3
pnpm add -D @types/d3
```

---

### Step 2 — AI Advisor Types

**src/types/advisor.ts:**

```ts
export interface AdvisorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  structured?: {
    answer: string;
    data?: string;
    sources?: string[];
    confidence?: "high" | "medium" | "low";
  };
}

export interface AdvisorContext {
  netWorth: number;
  holdings: Array<{
    name: string;
    class: string;
    value: number;
    allocationPct: number;
  }>;
  riskTolerance: string;
  bspRate: number;
  cpiRate: number;
  pseiLevel: number;
}
```

---

### Step 3 — System Prompt Builder

**src/lib/ai/system-prompt.ts:**

```ts
import type { AdvisorContext } from "@/types/advisor";

export function buildSystemPrompt(context: AdvisorContext): string {
  const holdingsList = context.holdings
    .map(
      (h) =>
        `  - ${h.name} (${h.class}): ₱${h.value.toLocaleString()} — ${h.allocationPct.toFixed(1)}% of portfolio`
    )
    .join("\n");

  return `You are AETHER AI Advisor — a financial analysis assistant for Filipino retail investors. You provide data-driven insights grounded in the user's actual portfolio and Philippine market conditions.

## User Portfolio Context
- **Total Net Worth:** ₱${context.netWorth.toLocaleString()}
- **Risk Tolerance:** ${context.riskTolerance}
- **Holdings:**
${holdingsList || "  No assets yet."}

## Philippine Market Context
- **BSP Overnight Lending Rate:** ${context.bspRate}%
- **Philippine CPI (Latest):** ${context.cpiRate}%
- **PSEi Index Level:** ${context.pseiLevel.toLocaleString()}

## Response Format
Always structure your response in this order:
1. **Answer** — Direct, concise answer to the question
2. **Data** — Relevant numbers, calculations, or data points that support the answer
3. **Sources** — Where the data comes from (BSP, PSA, PSE, portfolio data)
4. **Confidence** — Your confidence level: HIGH (based on hard data), MEDIUM (informed estimate), LOW (general guidance)

## Rules
- Always reference the user's actual portfolio data when relevant
- Use Philippine Peso (₱) as the primary currency
- Reference BSP rates, PSEi performance, and Philippine CPI when applicable
- Show math when making calculations (Glass Box principle: no black boxes)
- Flag any assumptions explicitly
- Never recommend specific buy/sell actions — provide analysis, not advice
- Never fabricate data — if you don't have specific numbers, say so
- Keep responses concise but thorough — aim for 150–300 words

## Mandatory Disclaimer
End every response with this exact text on a new line:
"_AETHER provides analysis, not licensed financial advice. Consult a registered financial advisor for personal decisions._"`;
}
```

**src/lib/ai/portfolio-context.ts:**

```ts
import type { Asset, Profile } from "@/types/database";
import type { AdvisorContext } from "@/types/advisor";

export function buildPortfolioContext(
  profile: Profile,
  assets: Asset[],
  netWorth: number
): AdvisorContext {
  const totalAssetValue = assets.reduce(
    (sum, a) => sum + Number(a.current_value_php),
    0
  );

  const holdings = assets
    .sort((a, b) => Number(b.current_value_php) - Number(a.current_value_php))
    .slice(0, 20) // Top 20 holdings for context window efficiency
    .map((a) => ({
      name: a.ticker_or_name,
      class: a.asset_class,
      value: Number(a.current_value_php),
      allocationPct:
        totalAssetValue > 0
          ? (Number(a.current_value_php) / totalAssetValue) * 100
          : 0,
    }));

  return {
    netWorth,
    holdings,
    riskTolerance: profile.risk_tolerance,
    // MVP defaults — updated from price_cache or config in later phases
    bspRate: 6.5,
    cpiRate: 6.1,
    pseiLevel: 6800,
  };
}
```

---

### Step 4 — Rate Limiter

**src/lib/ai/rate-limiter.ts:**

```ts
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const LIMITS = {
  free: 20,
  pro: 100,
} as const;

export function checkRateLimit(
  userId: string,
  tier: "free" | "pro"
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = `advisor:${userId}`;
  const limit = LIMITS[tier];

  // Reset at midnight UTC
  const todayMidnight = new Date();
  todayMidnight.setUTCHours(24, 0, 0, 0);
  const resetAt = todayMidnight.getTime();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}
```

---

### Step 5 — AI Advisor API Route (Streaming)

**src/app/api/v1/advisor/ask/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { buildPortfolioContext } from "@/lib/ai/portfolio-context";
import { calculateNetWorth } from "@/lib/calculations/net-worth";
import { checkRateLimit } from "@/lib/ai/rate-limiter";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } },
      { status: 401 }
    );
  }

  const supabase = await createServerSupabaseClient();

  // Get user profile for rate limiting
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: { code: "PROFILE_NOT_FOUND", message: "User profile not found", status: 404 } },
      { status: 404 }
    );
  }

  // Rate limit check
  const rateLimit = checkRateLimit(userId, profile.subscription_tier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: `Daily query limit reached. ${profile.subscription_tier === "free" ? "Upgrade to Pro for 100 queries/day." : "Limit resets at midnight UTC."}`,
          status: 429,
        },
      },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { message, conversationHistory = [] } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Message is required", status: 400 } },
      { status: 400 }
    );
  }

  // Build portfolio context
  const [{ data: assets }, { data: liabilities }] = await Promise.all([
    supabase.from("assets").select("*"),
    supabase.from("liabilities").select("*"),
  ]);

  const breakdown = calculateNetWorth(assets || [], liabilities || []);
  const portfolioContext = buildPortfolioContext(profile, assets || [], breakdown.netWorth);
  const systemPrompt = buildSystemPrompt(portfolioContext);

  // Build conversation messages (last 5 turns for context window)
  const messages = [
    ...conversationHistory.slice(-10).map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: message },
  ];

  // Stream response
  const result = streamText({
    model: openrouter("anthropic/claude-sonnet-4"),
    system: systemPrompt,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
```

---

### Step 6 — AI Advisor Chat Component

**src/components/advisor/advisor-disclaimer.tsx:**

```tsx
export function AdvisorDisclaimer() {
  return (
    <div className="border-t border-glass-border px-4 py-2">
      <p className="font-body text-[10px] leading-relaxed text-text-muted">
        AETHER provides analysis, not licensed financial advice. Consult a
        registered financial advisor for personal decisions.
      </p>
    </div>
  );
}
```

**src/components/advisor/advisor-message.tsx:**

```tsx
import { cn } from "@/lib/utils";
import { Brain, User } from "lucide-react";

interface AdvisorMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function AdvisorMessage({ role, content }: AdvisorMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3",
        role === "assistant" && "bg-glass-bg/50"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border",
          role === "assistant"
            ? "border-accent-primary/40 bg-accent-subtle"
            : "border-glass-border bg-bg-elevated"
        )}
      >
        {role === "assistant" ? (
          <Brain size={14} className="text-accent-primary" />
        ) : (
          <User size={14} className="text-text-secondary" />
        )}
      </div>
      <div className="flex-1 pt-0.5">
        <p className="mb-1 font-body text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">
          {role === "assistant" ? "AETHER AI" : "You"}
        </p>
        <div className="font-body text-sm leading-relaxed text-text-primary prose-invert prose-sm max-w-none whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
}
```

**src/components/advisor/advisor-input.tsx:**

```tsx
"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvisorInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export function AdvisorInput({ onSubmit, disabled }: AdvisorInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSubmit(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-glass-border p-3">
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your portfolio..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-[8px] border border-glass-border bg-bg-elevated px-3 py-2 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-accent-bright focus:outline-none focus:ring-2 focus:ring-accent-bright/15 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[8px] transition-all",
            input.trim() && !disabled
              ? "bg-accent-primary text-white shadow-glow hover:bg-accent-bright"
              : "bg-bg-elevated text-text-muted"
          )}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
```

**src/components/advisor/advisor-chat.tsx:**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { AdvisorMessage } from "./advisor-message";
import { AdvisorInput } from "./advisor-input";
import { AdvisorDisclaimer } from "./advisor-disclaimer";
import { Brain } from "lucide-react";

export function AdvisorChat() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({
      api: "/api/v1/advisor/ask",
      body: {},
    });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (message: string) => {
    setInput(message);
    // Need to trigger submit via the form handler
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent);
  };

  return (
    <div className="flex h-full flex-col rounded-[16px] border border-glass-border bg-bg-surface backdrop-blur-[12px]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-glass-border px-4 py-3">
        <Brain size={18} className="text-accent-primary" />
        <span className="font-display text-sm font-semibold text-text-primary">
          AI Advisor
        </span>
        <span className="ml-auto rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-body text-[10px] text-success">
          Online
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
            <Brain size={32} className="text-accent-primary/50" />
            <p className="text-center font-body text-sm text-text-muted">
              Ask me anything about your portfolio, Philippine markets, or
              investment strategy.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "How is my portfolio performing?",
                "What's my risk exposure?",
                "How do BSP rate changes affect me?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSubmit(suggestion)}
                  className="rounded-full border border-glass-border bg-glass-bg px-3 py-1.5 font-body text-xs text-text-secondary hover:border-border-accent hover:text-text-primary transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <AdvisorMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}

        {isLoading && (
          <div className="flex gap-3 px-4 py-3 bg-glass-bg/50">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-accent-primary/40 bg-accent-subtle">
              <Brain size={14} className="text-accent-primary animate-pulse" />
            </div>
            <div className="flex items-center gap-1 pt-2">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-primary" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-primary" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-primary" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <AdvisorInput onSubmit={onSubmit} disabled={isLoading} />

      {/* Disclaimer */}
      <AdvisorDisclaimer />
    </div>
  );
}
```

---

### Step 7 — Glass Box: Portfolio Variance

**src/lib/calculations/portfolio-variance.ts:**

```ts
import { multiply, transpose, matrix, MathCollection } from "mathjs";

/**
 * σp² = wᵀ Σ w
 *
 * Where:
 *   w  = column vector of asset weights (sum = 1)
 *   Σ  = covariance matrix of historical asset returns
 *   σp² = portfolio variance (risk)
 */
export function calculatePortfolioVariance(
  weights: number[],
  covarianceMatrix: number[][]
): number {
  const w = matrix(weights.map((v) => [v]));
  const wT = transpose(w);
  const sigma = matrix(covarianceMatrix);

  const result = multiply(multiply(wT, sigma), w) as MathCollection;
  return (result as any).get([0, 0]);
}

/**
 * Build covariance matrix from historical return series.
 * Each array in `returns` is the daily return series for one asset.
 */
export function buildCovarianceMatrix(returns: number[][]): number[][] {
  const n = returns.length;
  const cov: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const meanI = returns[i].reduce((a, b) => a + b, 0) / returns[i].length;
      const meanJ = returns[j].reduce((a, b) => a + b, 0) / returns[j].length;

      let sum = 0;
      const len = Math.min(returns[i].length, returns[j].length);
      for (let k = 0; k < len; k++) {
        sum += (returns[i][k] - meanI) * (returns[j][k] - meanJ);
      }

      const covariance = sum / (len - 1);
      cov[i][j] = covariance;
      cov[j][i] = covariance; // Symmetric
    }
  }

  return cov;
}

/**
 * Portfolio standard deviation (volatility).
 */
export function portfolioStdDev(variance: number): number {
  return Math.sqrt(variance);
}

/**
 * Sharpe Ratio = (Rp - Rf) / σp
 */
export function sharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  stdDev: number
): number {
  if (stdDev === 0) return 0;
  return (portfolioReturn - riskFreeRate) / stdDev;
}
```

---

### Step 8 — Glass Box: Monte Carlo Simulation

**src/lib/calculations/monte-carlo.ts:**

```ts
/**
 * Monte Carlo Simulation using Geometric Brownian Motion:
 * S(t) = S(0) · exp( (μ - σ²/2) · t + σ · W(t) )
 *
 * Where:
 *   S(0) = initial portfolio value
 *   μ    = expected annual return
 *   σ    = annual volatility
 *   W(t) = Wiener process (Brownian motion)
 *   t    = time in years
 */

export interface MonteCarloParams {
  initialValue: number;
  expectedReturn: number;    // annual, e.g., 0.08 for 8%
  volatility: number;        // annual, e.g., 0.15 for 15%
  years: number;             // simulation horizon
  numPaths: number;          // number of simulation paths
  stepsPerYear: number;      // time steps per year (12 for monthly, 252 for daily)
}

export interface MonteCarloResult {
  paths: number[][];          // [pathIndex][timeStep] = portfolio value
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  timeLabels: string[];       // Year labels
  finalValues: number[];      // Terminal values for all paths
  stats: {
    mean: number;
    median: number;
    min: number;
    max: number;
    probLoss: number;         // Probability of ending below initial value
  };
}

/**
 * Standard normal random using Box-Muller transform.
 */
function randn(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Run Monte Carlo simulation.
 */
export function runMonteCarloSimulation(
  params: MonteCarloParams
): MonteCarloResult {
  const { initialValue, expectedReturn, volatility, years, numPaths, stepsPerYear } = params;
  const totalSteps = years * stepsPerYear;
  const dt = 1 / stepsPerYear;
  const drift = (expectedReturn - (volatility * volatility) / 2) * dt;
  const diffusion = volatility * Math.sqrt(dt);

  const paths: number[][] = [];

  for (let p = 0; p < numPaths; p++) {
    const path = [initialValue];
    let value = initialValue;

    for (let t = 1; t <= totalSteps; t++) {
      const shock = randn();
      value = value * Math.exp(drift + diffusion * shock);
      path.push(value);
    }

    paths.push(path);
  }

  // Calculate percentiles at each time step
  const p10: number[] = [];
  const p25: number[] = [];
  const p50: number[] = [];
  const p75: number[] = [];
  const p90: number[] = [];

  for (let t = 0; t <= totalSteps; t++) {
    const values = paths.map((path) => path[t]).sort((a, b) => a - b);
    p10.push(values[Math.floor(numPaths * 0.1)]);
    p25.push(values[Math.floor(numPaths * 0.25)]);
    p50.push(values[Math.floor(numPaths * 0.5)]);
    p75.push(values[Math.floor(numPaths * 0.75)]);
    p90.push(values[Math.floor(numPaths * 0.9)]);
  }

  // Time labels (yearly)
  const timeLabels: string[] = [];
  for (let y = 0; y <= years; y++) {
    timeLabels.push(`Year ${y}`);
  }

  // Final values and stats
  const finalValues = paths.map((path) => path[path.length - 1]);
  const sortedFinal = [...finalValues].sort((a, b) => a - b);

  return {
    paths,
    percentiles: { p10, p25, p50, p75, p90 },
    timeLabels,
    finalValues,
    stats: {
      mean: finalValues.reduce((a, b) => a + b, 0) / numPaths,
      median: sortedFinal[Math.floor(numPaths / 2)],
      min: sortedFinal[0],
      max: sortedFinal[sortedFinal.length - 1],
      probLoss: finalValues.filter((v) => v < initialValue).length / numPaths,
    },
  };
}
```

**src/lib/workers/monte-carlo.worker.ts:**

```ts
/// <reference lib="webworker" />

import { runMonteCarloSimulation, type MonteCarloParams } from "../calculations/monte-carlo";

self.onmessage = (event: MessageEvent<MonteCarloParams>) => {
  const result = runMonteCarloSimulation(event.data);

  // Send only percentiles + stats (not all paths) to reduce message size
  self.postMessage({
    percentiles: result.percentiles,
    timeLabels: result.timeLabels,
    stats: result.stats,
  });
};
```

> **Note:** To use Web Workers with Next.js, you may need to configure `next.config.ts` with `webpack` to handle `.worker.ts` files, or use dynamic `new Worker(new URL(...))` pattern.

---

### Step 9 — Fee Analyzer

**src/lib/calculations/fee-analyzer.ts:**

```ts
/**
 * Fee Compound Cost = P × ((1 + r)^n − (1 + r − f)^n)
 *
 * Where:
 *   P = principal (current value)
 *   r = gross annual return
 *   f = annual fee rate
 *   n = years
 */

export interface FeeAnalysisResult {
  assetName: string;
  assetClass: string;
  currentValue: number;
  annualFeePct: number;
  tenYearCost: number;
  severity: "critical" | "warning" | "info";
  suggestion?: string;
}

export function calculateFeeCost(
  principal: number,
  grossReturn: number,
  annualFee: number,
  years: number
): number {
  const withoutFee = principal * Math.pow(1 + grossReturn, years);
  const withFee = principal * Math.pow(1 + grossReturn - annualFee, years);
  return withoutFee - withFee;
}

const FEE_THRESHOLDS = {
  critical: 1.5,   // > 1.5% annual fee
  warning: 0.75,   // > 0.75% annual fee
};

const SUGGESTIONS: Record<string, string> = {
  uitf: "Consider FMETF (First Metro ETF) with ~0.5% TER as a lower-cost alternative to actively managed UITFs.",
  pse_stock: "PSE stock transaction costs are one-time. Consider if frequent trading fees are eating into returns.",
};

const DEFAULT_GROSS_RETURN = 0.08; // 8% assumed gross return

export function analyzePortfolioFees(
  assets: Array<{
    ticker_or_name: string;
    asset_class: string;
    current_value_php: number;
    annual_fee_pct: number | null;
  }>
): { results: FeeAnalysisResult[]; totalTenYearCost: number } {
  const results: FeeAnalysisResult[] = [];
  let totalTenYearCost = 0;

  for (const asset of assets) {
    const feePct = asset.annual_fee_pct;
    if (!feePct || feePct <= 0) continue;

    const feeDecimal = feePct / 100;
    const tenYearCost = calculateFeeCost(
      Number(asset.current_value_php),
      DEFAULT_GROSS_RETURN,
      feeDecimal,
      10
    );

    totalTenYearCost += tenYearCost;

    const severity: FeeAnalysisResult["severity"] =
      feePct >= FEE_THRESHOLDS.critical
        ? "critical"
        : feePct >= FEE_THRESHOLDS.warning
          ? "warning"
          : "info";

    results.push({
      assetName: asset.ticker_or_name,
      assetClass: asset.asset_class,
      currentValue: Number(asset.current_value_php),
      annualFeePct: feePct,
      tenYearCost,
      severity,
      suggestion: SUGGESTIONS[asset.asset_class],
    });
  }

  results.sort((a, b) => b.tenYearCost - a.tenYearCost);

  return { results, totalTenYearCost };
}
```

---

### Step 10 — Real Return Calculator

**src/lib/calculations/real-return.ts:**

```ts
/**
 * Real Return = ((1 + Nominal Return) / (1 + Inflation Rate)) − 1
 *
 * Source: PSA Philippine CPI
 */

const DEFAULT_PH_CPI = 0.061; // 6.1% — update from PSA data

export interface RealReturnResult {
  assetName: string;
  assetClass: string;
  nominalReturn: number;
  realReturn: number;
  inflationDrag: number;
  isNegativeReal: boolean;
}

export function calculateRealReturn(
  nominalReturn: number,
  inflationRate: number = DEFAULT_PH_CPI
): number {
  return (1 + nominalReturn) / (1 + inflationRate) - 1;
}

export function analyzeRealReturns(
  assets: Array<{
    ticker_or_name: string;
    asset_class: string;
    nominalReturnPct: number;
  }>,
  inflationRate: number = DEFAULT_PH_CPI
): RealReturnResult[] {
  return assets.map((asset) => {
    const nominal = asset.nominalReturnPct / 100;
    const real = calculateRealReturn(nominal, inflationRate);

    return {
      assetName: asset.ticker_or_name,
      assetClass: asset.asset_class,
      nominalReturn: nominal,
      realReturn: real,
      inflationDrag: nominal - real,
      isNegativeReal: real < 0,
    };
  });
}
```

---

### Step 11 — Glass Box API Route

**src/app/api/v1/analytics/glass-box/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculatePortfolioVariance, portfolioStdDev, sharpeRatio } from "@/lib/calculations/portfolio-variance";
import { runMonteCarloSimulation } from "@/lib/calculations/monte-carlo";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } },
      { status: 401 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: assets } = await supabase.from("assets").select("*");

  if (!assets || assets.length === 0) {
    return NextResponse.json({ error: { code: "NO_DATA", message: "No assets to analyze", status: 400 } }, { status: 400 });
  }

  const totalValue = assets.reduce((sum, a) => sum + Number(a.current_value_php), 0);
  const weights = assets.map((a) => Number(a.current_value_php) / totalValue);

  // For MVP, use proxy volatilities per asset class
  const PROXY_VOLATILITY: Record<string, number> = {
    pse_stock: 0.22, global_stock: 0.18, crypto: 0.65,
    real_estate: 0.10, uitf: 0.12, cash: 0.01,
    gold: 0.15, time_deposit: 0.005, other: 0.15,
  };

  const PROXY_RETURN: Record<string, number> = {
    pse_stock: 0.10, global_stock: 0.09, crypto: 0.15,
    real_estate: 0.06, uitf: 0.07, cash: 0.005,
    gold: 0.04, time_deposit: 0.04, other: 0.05,
  };

  // Build simplified diagonal covariance matrix (MVP — no cross-correlations)
  const n = assets.length;
  const covMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    const vol = PROXY_VOLATILITY[assets[i].asset_class] || 0.15;
    covMatrix[i][i] = vol * vol;
  }

  const variance = calculatePortfolioVariance(weights, covMatrix);
  const stdDev = portfolioStdDev(variance);
  const weightedReturn = assets.reduce(
    (sum, a, i) => sum + weights[i] * (PROXY_RETURN[a.asset_class] || 0.05),
    0
  );
  const sharpe = sharpeRatio(weightedReturn, 0.065, stdDev); // BSP rate as risk-free proxy

  // Monte Carlo
  const mcResult = runMonteCarloSimulation({
    initialValue: totalValue,
    expectedReturn: weightedReturn,
    volatility: stdDev,
    years: 10,
    numPaths: 1000,
    stepsPerYear: 12,
  });

  return NextResponse.json({
    variance,
    stdDev,
    weightedReturn,
    sharpeRatio: sharpe,
    weights: assets.map((a, i) => ({
      name: a.ticker_or_name,
      class: a.asset_class,
      weight: weights[i],
    })),
    monteCarlo: {
      percentiles: mcResult.percentiles,
      timeLabels: mcResult.timeLabels,
      stats: mcResult.stats,
    },
  });
}
```

---

### Step 12 — Fee Scan & Real Return API Routes

**src/app/api/v1/analytics/fee-scan/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzePortfolioFees } from "@/lib/calculations/fee-analyzer";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: assets } = await supabase.from("assets").select("ticker_or_name, asset_class, current_value_php, annual_fee_pct");

  const analysis = analyzePortfolioFees(assets || []);
  return NextResponse.json(analysis);
}
```

**src/app/api/v1/analytics/real-return/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzeRealReturns } from "@/lib/calculations/real-return";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: assets } = await supabase.from("assets").select("ticker_or_name, asset_class, avg_cost_basis, current_value_php");

  // Compute nominal return from cost basis
  const withReturns = (assets || [])
    .filter((a) => a.avg_cost_basis && Number(a.avg_cost_basis) > 0)
    .map((a) => ({
      ticker_or_name: a.ticker_or_name,
      asset_class: a.asset_class,
      nominalReturnPct:
        ((Number(a.current_value_php) - Number(a.avg_cost_basis)) /
          Number(a.avg_cost_basis)) *
        100,
    }));

  const results = analyzeRealReturns(withReturns);
  return NextResponse.json(results);
}
```

---

### Step 13 — Monte Carlo Fan Chart

**src/components/glass-box/monte-carlo-chart.tsx:**

```tsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface MonteCarloChartProps {
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  timeLabels: string[];
}

export function MonteCarloChart({ percentiles, timeLabels }: MonteCarloChartProps) {
  // Only sample yearly data points for display
  const stepsPerYear = Math.floor(percentiles.p50.length / timeLabels.length) || 1;

  const data = timeLabels.map((label, i) => {
    const idx = i * stepsPerYear;
    return {
      year: label,
      p10: percentiles.p10[idx] || 0,
      p25: percentiles.p25[idx] || 0,
      p50: percentiles.p50[idx] || 0,
      p75: percentiles.p75[idx] || 0,
      p90: percentiles.p90[idx] || 0,
    };
  });

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
            Monte Carlo Projection
          </p>
          <p className="mt-0.5 font-body text-[11px] text-text-muted">
            S(t) = S(0) · exp( (μ - σ²/2) · t + σ · W(t) ) — 1,000 paths, 10yr
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <XAxis
            dataKey="year"
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
              fontSize: "11px",
              color: "#f1f0ff",
            }}
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === "p90" ? "90th %ile" :
              name === "p75" ? "75th %ile" :
              name === "p50" ? "Median" :
              name === "p25" ? "25th %ile" :
              "10th %ile",
            ]}
          />

          {/* 10th-90th band (lightest) */}
          <Area type="monotone" dataKey="p90" stroke="none" fill="rgba(124,58,237,0.08)" />
          <Area type="monotone" dataKey="p10" stroke="none" fill="#08080f" />

          {/* 25th-75th band (medium) */}
          <Area type="monotone" dataKey="p75" stroke="none" fill="rgba(124,58,237,0.15)" />
          <Area type="monotone" dataKey="p25" stroke="none" fill="#08080f" />

          {/* Median line */}
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="none"
            dot={false}
          />

          {/* Initial value reference */}
          <ReferenceLine
            y={data[0]?.p50 || 0}
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-6">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-6 rounded-full bg-accent-primary" />
          <span className="font-body text-[10px] text-text-muted">Median (50th)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-6 rounded-full bg-accent-primary/30" />
          <span className="font-body text-[10px] text-text-muted">25th–75th</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-6 rounded-full bg-accent-primary/10" />
          <span className="font-body text-[10px] text-text-muted">10th–90th</span>
        </div>
      </div>
    </div>
  );
}
```

---

### Step 14 — Settings Page

**src/app/dashboard/settings/page.tsx:**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { PageHeader } from "@/components/shared/page-header";
import { RISK_PROFILES, CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { RiskTolerance, BaseCurrency } from "@/types/database";

export default function SettingsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    risk_tolerance: "moderate" as RiskTolerance,
    base_currency: "PHP" as BaseCurrency,
  });

  useEffect(() => {
    fetch("/api/v1/user/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.risk_tolerance) setSettings(data);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await fetch("/api/v1/user/risk-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <PageHeader badge="Settings" title="Account Settings" />
      <div className="h-px w-full bg-border" />

      {/* Profile */}
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px]">
        <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle border border-accent-primary/30">
            <span className="font-display text-lg font-bold text-accent-primary">
              {user?.firstName?.[0] || "A"}
            </span>
          </div>
          <div>
            <p className="font-body text-sm font-medium text-text-primary">
              {user?.fullName || "AETHER User"}
            </p>
            <p className="font-body text-xs text-text-muted">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="mb-5">
          <label className="font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary mb-2 block">
            Risk Tolerance
          </label>
          <div className="flex gap-2">
            {RISK_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => setSettings({ ...settings, risk_tolerance: p.id as RiskTolerance })}
                className={cn(
                  "flex-1 rounded-[8px] border px-3 py-2 font-body text-sm transition-colors",
                  settings.risk_tolerance === p.id
                    ? "border-accent-primary bg-accent-subtle text-text-primary"
                    : "border-glass-border bg-bg-elevated text-text-secondary hover:border-border-accent"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Base Currency */}
        <div className="mb-5">
          <label className="font-body text-xs font-medium uppercase tracking-[0.04em] text-text-secondary mb-2 block">
            Base Currency
          </label>
          <select
            value={settings.base_currency}
            onChange={(e) => setSettings({ ...settings, base_currency: e.target.value as BaseCurrency })}
            className="w-full rounded-[8px] border border-glass-border bg-bg-elevated px-3 py-2 font-body text-sm text-text-primary"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] transition-all duration-160 disabled:opacity-50"
        >
          {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="rounded-[16px] border border-error/30 bg-error/5 p-6">
        <h3 className="font-display text-lg font-semibold text-error mb-2">Danger Zone</h3>
        <p className="font-body text-sm text-text-secondary mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="rounded-[8px] border border-error/50 px-4 py-2 font-body text-sm font-medium text-error hover:bg-error/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
```

---

### Step 15 — User Settings API Routes

**src/app/api/v1/user/settings/route.ts:**

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
    .from("profiles")
    .select("risk_tolerance, base_currency, subscription_tier, full_name")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to fetch settings", status: 500 } }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

**src/app/api/v1/user/risk-profile/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateSchema = z.object({
  risk_tolerance: z.enum(["conservative", "moderate", "aggressive"]).optional(),
  base_currency: z.enum(["PHP", "USD", "SGD", "HKD"]).optional(),
});

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message, status: 400 } }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: { code: "DB_ERROR", message: "Failed to update", status: 500 } }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

---

## Verification Checklist

- [ ] AI Advisor: Streaming response renders token-by-token
- [ ] AI Advisor: Portfolio context injected into system prompt (verify via logs)
- [ ] AI Advisor: Rate limiting works — free users blocked after 20 queries/day
- [ ] AI Advisor: Disclaimer visible on every response
- [ ] AI Advisor: Suggested prompts clickable and trigger queries
- [ ] Glass Box: Portfolio variance (σp²) calculates correctly for multi-asset portfolios
- [ ] Glass Box: Monte Carlo simulation runs 1,000 paths without freezing UI
- [ ] Glass Box: Fan chart shows 10th/25th/50th/75th/90th percentile bands
- [ ] Glass Box: Sharpe ratio calculation matches expected formula
- [ ] Fee Analyzer: Detects fees on UITFs and mutual funds
- [ ] Fee Analyzer: 10-year compound cost formula gives correct results
- [ ] Fee Analyzer: Severity badges display (critical/warning/info)
- [ ] Real Return: Inflation-adjusted returns calculated correctly
- [ ] Real Return: Savings accounts flagged for negative real returns
- [ ] Settings: Risk tolerance and currency changes persist
- [ ] All API routes authenticated and return 401 for unauthenticated requests
- [ ] `pnpm build` succeeds without errors
- [ ] App ready for MVP launch

---

## Rollback Plan

1. **AI streaming fails:** Check `OPENROUTER_API_KEY` env var. Verify `ai` and `@ai-sdk/openai` versions are compatible. Test with curl against `https://openrouter.ai/api/v1/chat/completions` first.
2. **Monte Carlo freezes browser:** Move computation to Web Worker. Reduce path count for free tier (100 paths).
3. **Glass Box NaN values:** Check for division by zero in variance/Sharpe calculations. Ensure at least 2 assets exist.
4. **Rate limiter resets:** The in-memory store resets on server restart. For production, move to Redis or Supabase table.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| AI returns empty response | API key invalid or quota exceeded | Check OpenRouter dashboard for key status and credits |
| "Rate limited" immediately | In-memory store corrupted | Restart dev server to reset rate limit store |
| Monte Carlo all paths identical | Random seed issue | Verify `Math.random()` is being called, not a fixed seed |
| Fee analyzer shows no results | No assets have `annual_fee_pct` set | Ensure UITF/mutual fund entries include fee percentage |
| Covariance matrix singular | Only one asset or identical assets | Need 2+ distinct asset classes for meaningful variance |

---

**Phase 3 complete — MVP ready for launch. Proceed to `phase-4-simulator-alerts/IMPLEMENTATION_GUIDE.md`.**
