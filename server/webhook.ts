import express from "express";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import Papa from "papaparse";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "qwen/qwen3-coder:free";
const AI_FALLBACK_MODELS = (process.env.AI_FALLBACK_MODELS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(
    (value, index, source) =>
      value.length > 0 && value !== AI_MODEL && source.indexOf(value) === index
  );
const AI_UPSTREAM_MAX_RETRIES = Math.max(
  0,
  Number(process.env.AI_UPSTREAM_MAX_RETRIES || 1)
);
const AI_UPSTREAM_RETRY_BASE_MS = Math.max(
  100,
  Number(process.env.AI_UPSTREAM_RETRY_BASE_MS || 800)
);
const AI_UPSTREAM_RETRY_MAX_MS = Math.max(
  AI_UPSTREAM_RETRY_BASE_MS,
  Number(process.env.AI_UPSTREAM_RETRY_MAX_MS || 6_000)
);
const AI_MAX_TOKENS = Number(process.env.AI_MAX_TOKENS || 1024);
const AI_TEMPERATURE = Number(process.env.AI_TEMPERATURE || 0.3);
const AI_RATE_LIMIT_FREE = Number(process.env.AI_RATE_LIMIT_FREE || 20);
const AI_RATE_LIMIT_PRO = Number(process.env.AI_RATE_LIMIT_PRO || 100);
const AI_CACHE_TTL = Number(process.env.AI_CACHE_TTL || 3_600_000);
const PH_BSP_RATE = Number(process.env.PH_BSP_RATE || 6.25);
const PH_CPI_RATE = Number(process.env.PH_CPI_RATE || 6.1);
const PH_PSEI_LEVEL = Number(process.env.PH_PSEI_LEVEL || 6800);
const APP_URL = process.env.VITE_APP_URL || "http://localhost:3000";
const APP_NAME = process.env.VITE_APP_NAME || "AETHER";
const MARKET_QUOTE_TIMEOUT_MS = Math.max(
  1500,
  Number(process.env.MARKET_QUOTE_TIMEOUT_MS || 6000)
);
const MARKET_QUOTE_CACHE_TTL_MS = Math.max(
  15000,
  Number(process.env.MARKET_QUOTE_CACHE_TTL_MS || 60000)
);

type SubscriptionTier = "free" | "pro";
type ChatRole = "user" | "assistant";

interface OpenRouterMessage {
  role: "system" | ChatRole;
  content: string;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  risk_tolerance: "conservative" | "moderate" | "aggressive";
  base_currency: "PHP" | "USD" | "SGD" | "HKD";
  subscription_tier: SubscriptionTier;
}

interface AssetRow {
  id: string;
  user_id: string;
  asset_class: string;
  ticker_or_name: string;
  quantity: number;
  avg_cost_basis: number | null;
  current_value_php: number;
  annual_fee_pct: number | null;
  notes: string | null;
}

interface LiabilityRow {
  id: string;
  user_id: string;
  outstanding_balance: number;
}

interface AdvisorHistoryMessage {
  role: ChatRole;
  content: string;
}

interface PortfolioContext {
  netWorth: number;
  riskTolerance: string;
  holdings: Array<{
    name: string;
    assetClass: string;
    valuePhp: number;
    allocationPct: number;
  }>;
  allocationByClass: Array<{
    assetClass: string;
    allocationPct: number;
  }>;
  liabilitiesPhp: number;
  bspRate: number;
  cpiRate: number;
  pseiLevel: number;
}

interface SimulationParams {
  initialValue: number;
  expectedReturn: number;
  volatility: number;
  years: number;
  numPaths: number;
  stepsPerYear: number;
  periodicContribution?: number;
}

interface RateEntry {
  count: number;
  resetAt: number;
}

interface CacheEntry {
  response: string;
  expiresAt: number;
}

interface OpenRouterFailure {
  status: number;
  detail: string;
  model: string;
  retryAfterMs: number | null;
}

class OpenRouterUpstreamError extends Error {
  status: number;
  detail: string;
  model: string;
  retryAfterMs: number | null;

  constructor(input: OpenRouterFailure) {
    super(`OpenRouter request failed (${input.status})`);
    this.name = "OpenRouterUpstreamError";
    this.status = input.status;
    this.detail = input.detail;
    this.model = input.model;
    this.retryAfterMs = input.retryAfterMs;
  }
}

type ImportHoldingType =
  | "PH Stocks"
  | "US Stocks"
  | "Crypto"
  | "Cash"
  | "Bonds"
  | "Tangible Assets";

interface ParsedImportHolding {
  name: string;
  ticker: string;
  type: ImportHoldingType;
  qty: number;
  avgCost: number;
  currency: "PHP" | "USD";
  manualPrice: number | null;
  metadata?: Record<string, unknown>;
}

interface SaveAssetsTangibleMetaInput {
  category?: string;
  legalAttested?: boolean;
  proofFileName?: string | null;
  proofFileSize?: number | null;
}

interface SaveAssetsHoldingInput {
  name?: unknown;
  ticker?: unknown;
  type?: unknown;
  qty?: unknown;
  avgCost?: unknown;
  currency?: unknown;
  manualPrice?: unknown;
}

interface SaveAssetsRequestBody {
  userId?: string;
  email?: string | null;
  fullName?: string | null;
  holdings?: SaveAssetsHoldingInput[];
  tangibleMetaByKey?: Record<string, SaveAssetsTangibleMetaInput>;
  usdToPhp?: unknown;
  contextLabel?: unknown;
}

interface CsvHeuristicResult {
  holdings: ParsedImportHolding[];
  detectedColumns: string[];
  skippedRows: number;
  warnings: string[];
}

interface ProfileLookupError {
  status: number;
  code: string;
  message: string;
}

interface LiveMarketQuote {
  symbol: string;
  price: number;
  changePct: number;
  provider: "phisix" | "stooq" | "fred";
  asOf: string | null;
}

interface MarketQuoteResponsePayload {
  quotes: Record<string, LiveMarketQuote>;
  requestedSymbols: string[];
  unavailableSymbols: string[];
  coverage: {
    requested: number;
    live: number;
  };
  fetchedAt: string;
}

interface MarketQuoteCacheEntry {
  expiresAt: number;
  payload: MarketQuoteResponsePayload;
}

const advisorRateLimitStore = new Map<string, RateEntry>();
const advisorCacheStore = new Map<string, CacheEntry>();
const marketQuoteCacheStore = new Map<string, MarketQuoteCacheEntry>();

function nowMs() {
  return Date.now();
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function sanitizeMessage(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function nextUtcMidnight(): number {
  const date = new Date();
  date.setUTCHours(24, 0, 0, 0);
  return date.getTime();
}

function checkAdvisorRateLimit(userId: string, tier: SubscriptionTier) {
  const key = `advisor:${userId}`;
  const limit = tier === "pro" ? AI_RATE_LIMIT_PRO : AI_RATE_LIMIT_FREE;
  const now = nowMs();
  const resetAt = nextUtcMidnight();
  const existing = advisorRateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    advisorRateLimitStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      limit,
      resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    limit,
    resetAt: existing.resetAt,
  };
}

function refundAdvisorRateLimit(userId: string) {
  const key = `advisor:${userId}`;
  const existing = advisorRateLimitStore.get(key);
  if (!existing) return;
  existing.count = Math.max(existing.count - 1, 0);
}

function cleanExpiredAdvisorCache() {
  const now = nowMs();
  for (const [key, entry] of advisorCacheStore.entries()) {
    if (entry.expiresAt <= now) {
      advisorCacheStore.delete(key);
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(retryAfterHeader: string | null): number | null {
  if (!retryAfterHeader) return null;

  const seconds = Number(retryAfterHeader);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.round(seconds * 1000);
  }

  const timestamp = Date.parse(retryAfterHeader);
  if (Number.isFinite(timestamp)) {
    return Math.max(timestamp - nowMs(), 0);
  }

  return null;
}

function shouldRetryOpenRouterStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function shouldRefundRateLimitForUpstream(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function computeOpenRouterRetryDelayMs(
  status: number,
  retryAfterMs: number | null,
  attempt: number
): number {
  if (status === 429 && retryAfterMs !== null) {
    return clampNumber(retryAfterMs, 250, AI_UPSTREAM_RETRY_MAX_MS);
  }

  const exponentialDelay = AI_UPSTREAM_RETRY_BASE_MS * Math.pow(2, attempt);
  return Math.min(exponentialDelay, AI_UPSTREAM_RETRY_MAX_MS);
}

async function requestOpenRouterStreamWithFallback(
  messages: OpenRouterMessage[]
): Promise<{ response: Response; modelUsed: string }> {
  if (!OPENROUTER_API_KEY) {
    throw new OpenRouterUpstreamError({
      status: 503,
      detail: "OPENROUTER_API_KEY is not configured on the server.",
      model: AI_MODEL,
      retryAfterMs: null,
    });
  }

  const modelsToTry = [AI_MODEL, ...AI_FALLBACK_MODELS];
  let lastFailure: OpenRouterFailure | null = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= AI_UPSTREAM_MAX_RETRIES; attempt += 1) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": APP_URL,
            "X-Title": APP_NAME,
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: AI_MAX_TOKENS,
            temperature: AI_TEMPERATURE,
            stream: true,
          }),
        });

        if (response.ok && response.body) {
          return { response, modelUsed: model };
        }

        const detail = response.ok
          ? "OpenRouter returned an empty stream response body."
          : (await response.text()).slice(0, 600);
        const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
        const status = response.ok ? 502 : response.status;

        lastFailure = {
          status,
          detail,
          model,
          retryAfterMs,
        };

        const canRetry =
          attempt < AI_UPSTREAM_MAX_RETRIES && shouldRetryOpenRouterStatus(status);

        if (canRetry) {
          const delayMs = computeOpenRouterRetryDelayMs(status, retryAfterMs, attempt);
          await sleep(delayMs);
          continue;
        }

        break;
      } catch (error) {
        lastFailure = {
          status: 503,
          detail:
            error instanceof Error
              ? error.message
              : "Failed to reach OpenRouter upstream service.",
          model,
          retryAfterMs: null,
        };

        const canRetry =
          attempt < AI_UPSTREAM_MAX_RETRIES && shouldRetryOpenRouterStatus(503);
        if (canRetry) {
          const delayMs = computeOpenRouterRetryDelayMs(503, null, attempt);
          await sleep(delayMs);
          continue;
        }

        break;
      }
    }
  }

  throw new OpenRouterUpstreamError(
    lastFailure || {
      status: 502,
      detail: "OpenRouter request failed without a response.",
      model: AI_MODEL,
      retryAfterMs: null,
    }
  );
}

function getAssetAssumptions(assetClass: string) {
  const assumptions: Record<string, { expectedReturn: number; volatility: number }> = {
    pse_stock: { expectedReturn: 0.1, volatility: 0.22 },
    global_stock: { expectedReturn: 0.09, volatility: 0.18 },
    crypto: { expectedReturn: 0.18, volatility: 0.65 },
    real_estate: { expectedReturn: 0.06, volatility: 0.1 },
    uitf: { expectedReturn: 0.07, volatility: 0.12 },
    cash: { expectedReturn: 0.02, volatility: 0.01 },
    gold: { expectedReturn: 0.04, volatility: 0.15 },
    time_deposit: { expectedReturn: 0.04, volatility: 0.005 },
    other: { expectedReturn: 0.05, volatility: 0.2 },
  };

  return assumptions[assetClass] || assumptions.other;
}

function calculateNetWorth(assets: AssetRow[], liabilities: LiabilityRow[]) {
  const totalAssets = assets.reduce(
    (sum, item) => sum + Number(item.current_value_php || 0),
    0
  );
  const totalLiabilities = liabilities.reduce(
    (sum, item) => sum + Number(item.outstanding_balance || 0),
    0
  );

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  };
}

function buildPortfolioContext(
  profile: ProfileRow,
  assets: AssetRow[],
  liabilities: LiabilityRow[]
): PortfolioContext {
  const totals = calculateNetWorth(assets, liabilities);
  const classTotals = new Map<string, number>();

  for (const asset of assets) {
    const valuePhp = Number(asset.current_value_php || 0);
    classTotals.set(asset.asset_class, (classTotals.get(asset.asset_class) || 0) + valuePhp);
  }

  const allocationByClass = Array.from(classTotals.entries())
    .map(([assetClass, valuePhp]) => ({
      assetClass,
      allocationPct: totals.totalAssets > 0 ? (valuePhp / totals.totalAssets) * 100 : 0,
    }))
    .sort((a, b) => b.allocationPct - a.allocationPct);

  const holdings = assets
    .slice()
    .sort((a, b) => Number(b.current_value_php) - Number(a.current_value_php))
    .slice(0, 20)
    .map((asset) => {
      const valuePhp = Number(asset.current_value_php || 0);
      const notes = parseNotesPayload(asset.notes);
      const ticker = typeof notes?.ticker === "string" ? notes.ticker : asset.ticker_or_name;
      const displayName = typeof notes?.name === "string" ? notes.name : asset.ticker_or_name;
      return {
        name: displayName,
        assetClass: typeof notes?.type === "string" ? notes.type : asset.asset_class,
        valuePhp,
        allocationPct: totals.totalAssets > 0 ? (valuePhp / totals.totalAssets) * 100 : 0,
        ticker,
      };
    });

  return {
    netWorth: totals.netWorth,
    riskTolerance: profile.risk_tolerance,
    holdings: holdings.map((holding) => ({
      name: holding.ticker && holding.ticker !== holding.name ? `${holding.name} (${holding.ticker})` : holding.name,
      assetClass: holding.assetClass,
      valuePhp: holding.valuePhp,
      allocationPct: holding.allocationPct,
    })),
    allocationByClass,
    liabilitiesPhp: totals.totalLiabilities,
    bspRate: PH_BSP_RATE,
    cpiRate: PH_CPI_RATE,
    pseiLevel: PH_PSEI_LEVEL,
  };
}

function buildSystemPrompt(context: PortfolioContext): string {
  const holdingsBlock =
    context.holdings.length > 0
      ? context.holdings
          .map(
            (holding) =>
              `- ${holding.name} (${holding.assetClass}): PHP ${holding.valuePhp.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} (${holding.allocationPct.toFixed(1)}%)`
          )
          .join("\n")
      : "- No holdings found yet.";

  const allocationBlock =
    context.allocationByClass.length > 0
      ? context.allocationByClass
          .slice(0, 8)
          .map((entry) => `- ${entry.assetClass}: ${entry.allocationPct.toFixed(1)}%`)
          .join("\n")
      : "- No allocation data yet.";

  return [
    "You are AETHER AI Advisor, a financial analysis assistant for Filipino retail investors.",
    "You provide analysis grounded on the user's portfolio and Philippine market context.",
    "",
    "Output format (always in this order):",
    "1) Answer",
    "2) Data",
    "3) Sources",
    "4) Confidence",
    "",
    "Rules:",
    "- Use PHP as base currency unless user asks otherwise.",
    "- Explain assumptions and math where relevant (Glass Box principle).",
    "- Never recommend exact buy/sell execution.",
    "- Never claim to execute trades, transfers, tax actions, or account actions.",
    "- Keep responses concise and practical.",
    "",
    "User portfolio context:",
    `- Net worth: PHP ${context.netWorth.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    `- Total liabilities: PHP ${context.liabilitiesPhp.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    `- Risk tolerance: ${context.riskTolerance}`,
    "- Allocation mix:",
    allocationBlock,
    "- Top holdings:",
    holdingsBlock,
    "",
    "Philippine market context:",
    `- BSP policy rate: ${context.bspRate}%`,
    `- PH CPI: ${context.cpiRate}%`,
    `- PSEi level: ${context.pseiLevel}`,
    "",
    "Append this exact disclaimer at the end of every response:",
    "_AETHER provides analysis, not licensed financial advice. Consult a registered financial advisor for personal decisions._",
  ].join("\n");
}

function buildLocalAdvisorFallbackResponse(
  message: string,
  context: PortfolioContext
): string {
  const lowered = message.toLowerCase();
  const topHolding = context.holdings[0];
  const concentrationRisk =
    topHolding && topHolding.allocationPct >= 35
      ? `${topHolding.name} at ${topHolding.allocationPct.toFixed(1)}% is a concentration risk worth monitoring.`
      : "Allocation concentration looks moderate based on current top-holding weights.";

  const answerLines = [
    `Upstream AI is temporarily rate-limited, so this is a local fallback analysis based on your latest portfolio snapshot.`,
    concentrationRisk,
  ];

  if (lowered.includes("fee")) {
    answerLines.push(
      "For fee analysis, prioritize reducing high-expense funds first because fee drag compounds over long horizons."
    );
  }

  if (lowered.includes("inflation") || lowered.includes("real return")) {
    answerLines.push(
      `With CPI at ${context.cpiRate.toFixed(1)}%, assets returning below that level can lose purchasing power in real terms.`
    );
  }

  if (lowered.includes("risk") || lowered.includes("volatility")) {
    answerLines.push(
      `Risk profile is set to ${context.riskTolerance}; keep drawdown tolerance aligned with your highest-volatility exposures.`
    );
  }

  const topHoldingsBlock =
    context.holdings.length > 0
      ? context.holdings
          .slice(0, 3)
          .map(
            (holding) =>
              `- ${holding.name}: PHP ${holding.valuePhp.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} (${holding.allocationPct.toFixed(1)}%)`
          )
          .join("\n")
      : "- No holdings found yet.";

  const allocationBlock =
    context.allocationByClass.length > 0
      ? context.allocationByClass
          .slice(0, 4)
          .map((entry) => `- ${entry.assetClass}: ${entry.allocationPct.toFixed(1)}%`)
          .join("\n")
      : "- No allocation data yet.";

  return [
    "Answer",
    answerLines.join(" "),
    "",
    "Data",
    `- Net worth: PHP ${context.netWorth.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    `- Liabilities: PHP ${context.liabilitiesPhp.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    `- Risk tolerance: ${context.riskTolerance}`,
    "- Allocation mix:",
    allocationBlock,
    "- Top holdings:",
    topHoldingsBlock,
    `- PH macro defaults: BSP ${context.bspRate.toFixed(2)}%, CPI ${context.cpiRate.toFixed(1)}%, PSEi ${context.pseiLevel}`,
    "",
    "Sources",
    "- AETHER local portfolio snapshot (assets/liabilities from your account).",
    "- App-configured Philippine macro defaults for BSP, CPI, and PSEi.",
    "",
    "Confidence",
    "Medium for portfolio structure, lower for live market catalysts until upstream AI service recovers.",
    "",
    "_AETHER provides analysis, not licensed financial advice. Consult a registered financial advisor for personal decisions._",
  ].join("\n");
}

function buildAdvisorCacheKey(userId: string, message: string, context: PortfolioContext): string {
  const fingerprint = [
    context.holdings.length,
    Math.round(context.netWorth),
    context.riskTolerance,
    Math.round(context.pseiLevel),
    Math.round(context.cpiRate * 100),
    Math.round(context.bspRate * 100),
  ].join("|");

  return `${userId}:${sanitizeMessage(message).toLowerCase()}:${fingerprint}`;
}

function calculatePortfolioVariance(weights: number[], covarianceMatrix: number[][]): number {
  let total = 0;
  for (let i = 0; i < weights.length; i += 1) {
    for (let j = 0; j < weights.length; j += 1) {
      total += weights[i] * covarianceMatrix[i][j] * weights[j];
    }
  }
  return total;
}

function runMonteCarloSimulation(params: SimulationParams) {
  const {
    initialValue,
    expectedReturn,
    volatility,
    years,
    numPaths,
    stepsPerYear,
    periodicContribution = 0,
  } = params;
  const totalSteps = years * stepsPerYear;
  const dt = 1 / stepsPerYear;
  const drift = (expectedReturn - (volatility * volatility) / 2) * dt;
  const diffusion = volatility * Math.sqrt(dt);

  function randn() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  const paths: number[][] = [];

  for (let p = 0; p < numPaths; p += 1) {
    const path: number[] = [initialValue];
    let value = initialValue;
    for (let t = 1; t <= totalSteps; t += 1) {
      value = (value + periodicContribution) * Math.exp(drift + diffusion * randn());
      path.push(value);
    }
    paths.push(path);
  }

  const percentile = (values: number[], p: number) => {
    if (values.length === 0) return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const idx = Math.floor((sorted.length - 1) * p);
    return sorted[idx] ?? 0;
  };

  const p10: number[] = [];
  const p25: number[] = [];
  const p50: number[] = [];
  const p75: number[] = [];
  const p90: number[] = [];

  for (let step = 0; step <= totalSteps; step += 1) {
    const valuesAtStep = paths.map((path) => path[step]);
    p10.push(percentile(valuesAtStep, 0.1));
    p25.push(percentile(valuesAtStep, 0.25));
    p50.push(percentile(valuesAtStep, 0.5));
    p75.push(percentile(valuesAtStep, 0.75));
    p90.push(percentile(valuesAtStep, 0.9));
  }

  const timeLabels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
  const finalValues = paths.map((path) => path[path.length - 1]);
  const sortedFinal = finalValues.slice().sort((a, b) => a - b);

  return {
    percentiles: { p10, p25, p50, p75, p90 },
    timeLabels,
    stats: {
      mean: finalValues.reduce((sum, value) => sum + value, 0) / (finalValues.length || 1),
      median: sortedFinal[Math.floor(sortedFinal.length / 2)] || 0,
      min: sortedFinal[0] || 0,
      max: sortedFinal[sortedFinal.length - 1] || 0,
      probLoss:
        finalValues.length > 0
          ? finalValues.filter((value) => value < initialValue).length / finalValues.length
          : 0,
    },
  };
}

function buildGlassBoxInterpretation(input: {
  expectedReturn: number;
  stdDev: number;
  sharpeRatio: number;
  probLoss: number;
  topWeightName: string;
  topWeightPct: number;
  years: number;
}) {
  const {
    expectedReturn,
    stdDev,
    sharpeRatio,
    probLoss,
    topWeightName,
    topWeightPct,
    years,
  } = input;

  const riskBand =
    stdDev >= 0.3 || probLoss >= 0.4
      ? "elevated"
      : stdDev >= 0.18 || probLoss >= 0.25
        ? "moderate"
        : "contained";

  const sharpeView =
    sharpeRatio >= 1
      ? "strong risk-adjusted profile"
      : sharpeRatio >= 0.4
        ? "balanced but could be improved"
        : "weak risk-adjusted profile";

  const summary = `Projected return is ${(expectedReturn * 100).toFixed(1)}% with ${(stdDev * 100).toFixed(1)}% volatility over ${years} years, indicating ${riskBand} risk and ${sharpeView}.`;

  const keyPoints = [
    `${(probLoss * 100).toFixed(1)}% of simulated paths end below the starting value over the selected horizon.`,
    `${topWeightName} is the largest driver at ${topWeightPct.toFixed(1)}% allocation, so concentration management matters.`,
    `Use scenario tweaks (return, volatility, correlation, and contributions) to pressure-test downside resilience before acting.`,
  ];

  return {
    riskBand,
    summary,
    keyPoints,
  };
}

function computeFeeCost(principal: number, grossReturn: number, feeRate: number, years: number) {
  const withoutFee = principal * Math.pow(1 + grossReturn, years);
  const withFee = principal * Math.pow(1 + grossReturn - feeRate, years);
  return Math.max(withoutFee - withFee, 0);
}

function calculateRealReturn(nominalReturn: number, inflationRate: number) {
  return (1 + nominalReturn) / (1 + inflationRate) - 1;
}

function parseNotesPayload(input: string | null): Record<string, unknown> | null {
  if (!input) return null;
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Ignore malformed notes payload.
  }
  return null;
}

function isSupabaseAuthError(error: { message?: string | null } | null | undefined): boolean {
  const message = (error?.message || "").toLowerCase();
  return message.includes("invalid api key") || message.includes("invalid jwt");
}

function mapProfileLookupError(
  error: { code?: string | null; message?: string | null } | null
): ProfileLookupError | null {
  if (!error) return null;

  if (error.code === "PGRST116") {
    return {
      status: 404,
      code: "PROFILE_NOT_FOUND",
      message: "Profile not found for the provided userId.",
    };
  }

  if (isSupabaseAuthError(error)) {
    return {
      status: 503,
      code: "SUPABASE_AUTH_INVALID",
      message:
        "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
    };
  }

  return {
    status: 500,
    code: "PROFILE_LOOKUP_FAILED",
    message: "Unable to verify profile for the provided userId.",
  };
}

const PHISIX_SUPPORTED_SYMBOLS = new Set([
  "BDO",
  "SM",
  "AC",
  "JFC",
  "ALI",
  "ICT",
  "FMETF",
]);

const STOOQ_SYMBOL_BY_MARKET_SYMBOL: Record<string, string> = {
  PSEI: "^PSEI",
  SPX: "^SPX",
  NDX: "^NDQ",
  DJI: "^DJI",
  AAPL: "AAPL.US",
  NVDA: "NVDA.US",
  MSFT: "MSFT.US",
  AMZN: "AMZN.US",
  GOOGL: "GOOGL.US",
  TSLA: "TSLA.US",
  META: "META.US",
  DXY: "DX.F",
};

const FRED_SERIES_BY_MARKET_SYMBOL: Record<string, string> = {
  UST10Y: "DGS10",
  UST2Y: "DGS2",
  BRENT: "DCOILBRENTEU",
  WTI: "DCOILWTICO",
};

async function fetchTextWithTimeout(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MARKET_QUOTE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/plain,text/csv,application/json;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) return null;
    return response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJsonWithTimeout<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MARKET_QUOTE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function compactDateTimeToIso(dateToken: string, timeToken: string): string | null {
  if (!/^\d{8}$/.test(dateToken) || !/^\d{6}$/.test(timeToken)) return null;

  const year = dateToken.slice(0, 4);
  const month = dateToken.slice(4, 6);
  const day = dateToken.slice(6, 8);
  const hour = timeToken.slice(0, 2);
  const minute = timeToken.slice(2, 4);
  const second = timeToken.slice(4, 6);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

function parseStooqLine(input: string): {
  price: number;
  changePct: number;
  asOf: string | null;
} | null {
  const line = input.trim().split(/\r?\n/).find((row) => row.trim().length > 0);
  if (!line || line.includes("N/D")) return null;

  const parts = line.split(",");
  if (parts.length < 7) return null;

  const open = Number(parts[3]);
  const close = Number(parts[6]);
  if (!Number.isFinite(close) || close <= 0) return null;

  const changePct = Number.isFinite(open) && open > 0 ? ((close - open) / open) * 100 : 0;
  const asOf = compactDateTimeToIso(parts[1] || "", parts[2] || "");

  return {
    price: close,
    changePct,
    asOf,
  };
}

function parseFredCsv(input: string): {
  price: number;
  changePct: number;
  asOf: string | null;
} | null {
  if (!input || input.trim().startsWith("<!DOCTYPE")) return null;

  const rows = input
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => {
      const [date, valueRaw] = line.split(",");
      const value = Number(valueRaw);
      if (!date || !Number.isFinite(value)) return null;
      return { date, value };
    })
    .filter((row): row is { date: string; value: number } => row !== null);

  if (rows.length === 0) return null;

  const latest = rows[rows.length - 1];
  const previous = rows.length > 1 ? rows[rows.length - 2] : latest;
  const changePct = previous.value !== 0 ? ((latest.value - previous.value) / previous.value) * 100 : 0;

  return {
    price: latest.value,
    changePct,
    asOf: `${latest.date}T00:00:00Z`,
  };
}

async function fetchPhisixQuotes(symbols: string[]): Promise<Record<string, LiveMarketQuote>> {
  if (symbols.length === 0) return {};

  const payload = await fetchJsonWithTimeout<{
    stocks?: Array<{
      symbol?: string;
      percentChange?: number | string;
      price?: {
        amount?: number | string;
      };
    }>;
    as_of?: string;
  }>("https://phisix-api3.appspot.com/stocks.json");

  if (!payload?.stocks || payload.stocks.length === 0) return {};

  const wanted = new Set(symbols);
  const asOf = typeof payload.as_of === "string" ? payload.as_of : null;
  const quotes: Record<string, LiveMarketQuote> = {};

  for (const row of payload.stocks) {
    const symbol = String(row.symbol || "").toUpperCase();
    if (!symbol || !wanted.has(symbol)) continue;

    const price = Number(row.price?.amount);
    if (!Number.isFinite(price) || price <= 0) continue;

    const changePct = Number(row.percentChange);
    quotes[symbol] = {
      symbol,
      price,
      changePct: Number.isFinite(changePct) ? changePct : 0,
      provider: "phisix",
      asOf,
    };
  }

  return quotes;
}

async function fetchStooqQuote(symbol: string, stooqSymbol: string): Promise<LiveMarketQuote | null> {
  const raw = await fetchTextWithTimeout(
    `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSymbol)}&i=d`
  );
  if (!raw) return null;

  const parsed = parseStooqLine(raw);
  if (!parsed) return null;

  return {
    symbol,
    price: parsed.price,
    changePct: parsed.changePct,
    provider: "stooq",
    asOf: parsed.asOf,
  };
}

async function fetchFredQuote(symbol: string, seriesId: string): Promise<LiveMarketQuote | null> {
  const raw = await fetchTextWithTimeout(
    `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(seriesId)}`
  );
  if (!raw) return null;

  const parsed = parseFredCsv(raw);
  if (!parsed) return null;

  return {
    symbol,
    price: parsed.price,
    changePct: parsed.changePct,
    provider: "fred",
    asOf: parsed.asOf,
  };
}

function buildMarketQuoteCacheKey(symbols: string[]): string {
  return symbols
    .map((symbol) => symbol.trim().toUpperCase())
    .filter((symbol, index, list) => symbol.length > 0 && list.indexOf(symbol) === index)
    .sort()
    .join(",");
}

async function getLiveMarketQuotes(symbols: string[]): Promise<MarketQuoteResponsePayload> {
  const normalizedSymbols = symbols
    .map((symbol) => symbol.trim().toUpperCase())
    .filter((symbol, index, list) => symbol.length > 0 && list.indexOf(symbol) === index);

  const cacheKey = buildMarketQuoteCacheKey(normalizedSymbols);
  const cached = marketQuoteCacheStore.get(cacheKey);
  if (cached && cached.expiresAt > nowMs()) {
    return cached.payload;
  }

  const phisixSymbols = normalizedSymbols.filter((symbol) => PHISIX_SUPPORTED_SYMBOLS.has(symbol));
  const stooqTargets = normalizedSymbols
    .map((symbol) => ({ symbol, providerSymbol: STOOQ_SYMBOL_BY_MARKET_SYMBOL[symbol] }))
    .filter((row): row is { symbol: string; providerSymbol: string } => Boolean(row.providerSymbol));
  const fredTargets = normalizedSymbols
    .map((symbol) => ({ symbol, seriesId: FRED_SERIES_BY_MARKET_SYMBOL[symbol] }))
    .filter((row): row is { symbol: string; seriesId: string } => Boolean(row.seriesId));

  const [phisixQuotes, stooqQuotes, fredQuotes] = await Promise.all([
    fetchPhisixQuotes(phisixSymbols),
    Promise.all(stooqTargets.map((row) => fetchStooqQuote(row.symbol, row.providerSymbol))),
    Promise.all(fredTargets.map((row) => fetchFredQuote(row.symbol, row.seriesId))),
  ]);

  const quotes: Record<string, LiveMarketQuote> = {};

  for (const quote of stooqQuotes) {
    if (!quote) continue;
    quotes[quote.symbol] = quote;
  }

  for (const quote of fredQuotes) {
    if (!quote) continue;
    quotes[quote.symbol] = quote;
  }

  for (const [symbol, quote] of Object.entries(phisixQuotes)) {
    quotes[symbol] = quote;
  }

  const unavailableSymbols = normalizedSymbols.filter((symbol) => !quotes[symbol]);

  const payload: MarketQuoteResponsePayload = {
    quotes,
    requestedSymbols: normalizedSymbols,
    unavailableSymbols,
    coverage: {
      requested: normalizedSymbols.length,
      live: Object.keys(quotes).length,
    },
    fetchedAt: new Date().toISOString(),
  };

  marketQuoteCacheStore.set(cacheKey, {
    expiresAt: nowMs() + MARKET_QUOTE_CACHE_TTL_MS,
    payload,
  });

  return payload;
}

const CSV_ALIASES = {
  name: [
    "name",
    "asset",
    "asset_name",
    "security",
    "instrument",
    "description",
    "particulars",
  ],
  ticker: ["ticker", "symbol", "stock_code", "code", "instrument_code"],
  type: ["type", "asset_type", "asset_class", "category", "class"],
  action: ["action", "side", "transaction_type", "buy_sell", "debit_credit"],
  qty: ["qty", "quantity", "shares", "units", "holding_quantity", "volume"],
  avgCost: [
    "avg_cost",
    "average_cost",
    "avg_price",
    "average_price",
    "cost_basis",
    "cost",
    "buy_price",
    "price_per_unit",
  ],
  manualPrice: ["manual_price", "current_price", "market_price", "last_price", "price"],
  marketValue: ["market_value", "current_value", "value", "amount", "balance", "total_value"],
  currency: ["currency", "ccy", "native_currency", "base_currency"],
} as const;

function normalizeCsvHeader(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s\-/]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function getCsvValue(row: Record<string, unknown>, aliases: readonly string[]): string {
  for (const alias of aliases) {
    const value = row[alias];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function parseLooseNumber(value: string): number {
  const cleaned = value
    .replace(/[₱$,\s]/g, "")
    .replace(/\((.*)\)/, "-$1")
    .replace(/[^0-9.-]/g, "");
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function inferHoldingType(rawType: string, ticker: string, name: string): ImportHoldingType {
  const joined = `${rawType} ${ticker} ${name}`.toLowerCase();

  if (/tangible|vehicle|collectible|jewelry|art|equipment|fixture/.test(joined)) return "Tangible Assets";
  if (/crypto|coin|token|btc|eth|sol|bnb|xrp|ada|dot|avax|doge|usdt|usdc|matic|link|trx/.test(joined)) return "Crypto";
  if (/cash|savings|deposit|money\s*market/.test(joined)) return "Cash";
  if (/bond|fixed\s*income|treasury|td/.test(joined)) return "Bonds";
  if (/us\s*stock|nyse|nasdaq|s&p|dow|aapl|nvda|tsla|msft|amzn|googl|meta|spy|qqq/.test(joined)) return "US Stocks";
  return "PH Stocks";
}

function inferCurrency(rawCurrency: string, type: ImportHoldingType, ticker: string): "PHP" | "USD" {
  const normalized = rawCurrency.toUpperCase();
  if (normalized === "PHP" || normalized === "USD") return normalized;

  if (type === "US Stocks" || type === "Crypto") return "USD";
  if (/AAPL|NVDA|MSFT|TSLA|AMZN|GOOGL|META|SPY|QQQ/.test(ticker.toUpperCase())) return "USD";
  return "PHP";
}

function ensureTicker(rawTicker: string, name: string, index: number): string {
  const fromTicker = rawTicker.replace(/[^A-Za-z0-9._\-/]/g, "").toUpperCase();
  if (fromTicker.length > 0) return fromTicker;

  const fromName = name
    .replace(/[^A-Za-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .map((token) => token.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 8);

  return fromName || `ASSET-${index + 1}`;
}

function toHoldingType(rawType: unknown, ticker: string, name: string): ImportHoldingType {
  if (
    rawType === "PH Stocks" ||
    rawType === "US Stocks" ||
    rawType === "Crypto" ||
    rawType === "Cash" ||
    rawType === "Bonds" ||
    rawType === "Tangible Assets"
  ) {
    return rawType;
  }

  return inferHoldingType(typeof rawType === "string" ? rawType : "", ticker, name);
}

function mapHoldingTypeToAssetClass(type: ImportHoldingType): string {
  if (type === "PH Stocks") return "pse_stock";
  if (type === "US Stocks") return "global_stock";
  if (type === "Crypto") return "crypto";
  if (type === "Cash") return "cash";
  if (type === "Tangible Assets") return "other";
  return "uitf";
}

function normalizeSaveHolding(
  input: SaveAssetsHoldingInput,
  index: number
): ParsedImportHolding | null {
  const nameRaw = typeof input?.name === "string" ? input.name.trim() : "";
  const tickerRaw = typeof input?.ticker === "string" ? input.ticker.trim() : "";
  const fallbackName = nameRaw || tickerRaw;
  if (!fallbackName) return null;

  const ticker = ensureTicker(tickerRaw, fallbackName, index);
  const type = toHoldingType(input?.type, ticker, fallbackName);
  const qty = Number(input?.qty);
  const avgCost = Number(input?.avgCost);
  const manualPriceRaw = Number(input?.manualPrice);
  const currency = inferCurrency(
    typeof input?.currency === "string" ? input.currency : "",
    type,
    ticker
  );

  if (!Number.isFinite(qty) || qty <= 0) return null;

  const resolvedAvgCost = Number.isFinite(avgCost) && avgCost > 0 ? avgCost : 0;
  const resolvedManualPrice =
    Number.isFinite(manualPriceRaw) && manualPriceRaw > 0
      ? manualPriceRaw
      : type === "Crypto"
        ? null
        : resolvedAvgCost;

  return {
    name: fallbackName,
    ticker,
    type,
    qty,
    avgCost: resolvedAvgCost,
    currency,
    manualPrice: resolvedManualPrice,
  };
}

function mapCsvRowToHolding(row: Record<string, unknown>, index: number): ParsedImportHolding | null {
  const nameRaw = getCsvValue(row, CSV_ALIASES.name);
  const tickerRaw = getCsvValue(row, CSV_ALIASES.ticker);
  const actionRaw = getCsvValue(row, CSV_ALIASES.action).toLowerCase();
  const typeRaw = getCsvValue(row, CSV_ALIASES.type);
  const qtyRaw = getCsvValue(row, CSV_ALIASES.qty);
  const avgCostRaw = getCsvValue(row, CSV_ALIASES.avgCost);
  const manualPriceRaw = getCsvValue(row, CSV_ALIASES.manualPrice);
  const marketValueRaw = getCsvValue(row, CSV_ALIASES.marketValue);
  const currencyRaw = getCsvValue(row, CSV_ALIASES.currency);

  let qty = parseLooseNumber(qtyRaw);
  let avgCost = parseLooseNumber(avgCostRaw);
  let manualPrice = parseLooseNumber(manualPriceRaw);
  const marketValue = parseLooseNumber(marketValueRaw);

  const resolvedName = nameRaw || tickerRaw;
  if (!resolvedName) return null;

  const ticker = ensureTicker(tickerRaw, resolvedName, index);
  const type = inferHoldingType(typeRaw, ticker, resolvedName);
  const currency = inferCurrency(currencyRaw, type, ticker);

  const isSellLike = /sell|withdraw|redeem|outflow|debit/.test(actionRaw);
  if (isSellLike && qty > 0) {
    qty = -qty;
  }

  if (qty === 0 && marketValue > 0 && manualPrice > 0) {
    qty = marketValue / manualPrice;
  }

  if (qty === 0 && marketValue > 0 && avgCost > 0) {
    qty = marketValue / avgCost;
  }

  if (type === "Cash" && qty === 0 && marketValue > 0) {
    qty = 1;
    avgCost = marketValue;
    manualPrice = marketValue;
  }

  if (qty === 0) {
    return null;
  }

  if (avgCost <= 0 && manualPrice > 0) {
    avgCost = manualPrice;
  }

  if (manualPrice <= 0 && marketValue > 0) {
    manualPrice = Math.abs(qty) > 0 ? marketValue / Math.abs(qty) : 0;
  }

  const resolvedManualPrice =
    type === "Crypto"
      ? manualPrice > 0
        ? manualPrice
        : null
      : manualPrice > 0
        ? manualPrice
        : avgCost > 0
          ? avgCost
          : null;

  return {
    name: resolvedName,
    ticker,
    type,
    qty,
    avgCost: avgCost > 0 ? avgCost : 0,
    currency,
    manualPrice: resolvedManualPrice,
  };
}

function aggregateHoldings(holdings: ParsedImportHolding[]): ParsedImportHolding[] {
  const map = new Map<string, ParsedImportHolding>();

  for (const holding of holdings) {
    const key = `${holding.ticker}|${holding.type}|${holding.currency}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, { ...holding });
      continue;
    }

    const mergedQty = existing.qty + holding.qty;
    if (mergedQty <= 0) {
      map.delete(key);
      continue;
    }

    const totalCost = existing.avgCost * existing.qty + holding.avgCost * holding.qty;
    existing.qty = mergedQty;
    existing.avgCost = mergedQty > 0 ? Math.max(totalCost / mergedQty, 0) : existing.avgCost;
    existing.manualPrice = holding.manualPrice ?? existing.manualPrice;
    if (holding.name.length > existing.name.length) {
      existing.name = holding.name;
    }
    map.set(key, existing);
  }

  return Array.from(map.values()).filter((holding) => holding.qty > 0);
}

function parseCsvWithHeuristics(csvText: string): CsvHeuristicResult {
  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => normalizeCsvHeader(header),
  });

  const warnings = parsed.errors.map((error) => `Row ${error.row}: ${error.message}`);
  const mapped = parsed.data
    .map((row, index) => mapCsvRowToHolding(row || {}, index))
    .filter((row): row is ParsedImportHolding => row !== null);

  const aggregated = aggregateHoldings(mapped);

  return {
    holdings: aggregated,
    detectedColumns: parsed.meta.fields || [],
    skippedRows: Math.max(parsed.data.length - mapped.length, 0),
    warnings,
  };
}

function cleanJsonFromModel(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = raw.indexOf("{");
  const firstBracket = raw.indexOf("[");
  const start = [firstBrace, firstBracket].filter((value) => value >= 0).sort((a, b) => a - b)[0];
  if (start === undefined) return raw.trim();

  const lastBrace = raw.lastIndexOf("}");
  const lastBracket = raw.lastIndexOf("]");
  const end = Math.max(lastBrace, lastBracket);
  if (end <= start) return raw.trim();
  return raw.slice(start, end + 1).trim();
}

function sanitizeAiHolding(row: Record<string, unknown>, index: number): ParsedImportHolding | null {
  const name = typeof row.name === "string" && row.name.trim().length > 0 ? row.name.trim() : "";
  const tickerRaw = typeof row.ticker === "string" ? row.ticker : "";
  const typeRaw = typeof row.type === "string" ? row.type : "";
  const qtyRaw = row.qty;
  const avgCostRaw = row.avgCost;
  const manualPriceRaw = row.manualPrice;
  const currencyRaw = typeof row.currency === "string" ? row.currency : "";

  if (!name && !tickerRaw) return null;

  const ticker = ensureTicker(tickerRaw, name || tickerRaw, index);
  const type = inferHoldingType(typeRaw, ticker, name);
  const qty = Number(qtyRaw);
  const avgCost = Number(avgCostRaw);
  const manualPrice = manualPriceRaw === null ? null : Number(manualPriceRaw);
  const currency = inferCurrency(currencyRaw, type, ticker);
  const resolvedManualPrice =
    typeof manualPrice === "number" && Number.isFinite(manualPrice) && manualPrice > 0
      ? manualPrice
      : null;

  if (!Number.isFinite(qty) || qty <= 0) return null;

  return {
    name: name || ticker,
    ticker,
    type,
    qty,
    avgCost: Number.isFinite(avgCost) && avgCost > 0 ? avgCost : 0,
    currency,
    manualPrice: resolvedManualPrice,
  };
}

async function parseCsvWithAi(csvText: string): Promise<{ holdings: ParsedImportHolding[]; analysis: string | null } | null> {
  if (!OPENROUTER_API_KEY) return null;

  const prompt = [
    "Convert the CSV content below into portfolio holdings JSON.",
    "Return ONLY valid JSON with this exact shape:",
    "{\"holdings\":[{\"name\":\"\",\"ticker\":\"\",\"type\":\"PH Stocks|US Stocks|Crypto|Cash|Bonds|Tangible Assets\",\"qty\":0,\"avgCost\":0,\"currency\":\"PHP|USD\",\"manualPrice\":null}],\"analysis\":\"short summary\"}",
    "Do not include markdown fences.",
    "CSV:\n" + csvText.slice(0, 32000),
  ].join("\n\n");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": APP_URL,
      "X-Title": APP_NAME,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 900,
      temperature: 0.1,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(cleanJsonFromModel(content)) as
      | { holdings?: Array<Record<string, unknown>>; analysis?: string }
      | Array<Record<string, unknown>>;

    const rawHoldings = Array.isArray(parsed) ? parsed : parsed.holdings || [];
    const holdings = aggregateHoldings(
      rawHoldings
        .map((row, index) => sanitizeAiHolding(row, index))
        .filter((row): row is ParsedImportHolding => row !== null)
    );

    return {
      holdings,
      analysis: Array.isArray(parsed)
        ? null
        : typeof parsed.analysis === "string"
          ? parsed.analysis
          : null,
    };
  } catch {
    return null;
  }
}

function buildImportInsights(holdings: ParsedImportHolding[]): string[] {
  if (holdings.length === 0) return [];

  const phpFx = Number(process.env.USD_TO_PHP_FALLBACK || 56.5);
  const totals = new Map<ImportHoldingType, number>();
  let totalPhp = 0;

  for (const holding of holdings) {
    const unit = holding.manualPrice ?? holding.avgCost;
    const value = unit * holding.qty;
    const valuePhp = holding.currency === "USD" ? value * phpFx : value;
    totalPhp += valuePhp;
    totals.set(holding.type, (totals.get(holding.type) || 0) + valuePhp);
  }

  const typeRank = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  const top = typeRank[0];
  const topShare = totalPhp > 0 && top ? (top[1] / totalPhp) * 100 : 0;

  const insights = [
    `Imported ${holdings.length} holdings with estimated total value PHP ${totalPhp.toLocaleString("en-PH", { maximumFractionDigits: 0 })}.`,
  ];

  if (top) {
    insights.push(`${top[0]} is the largest allocation at ${topShare.toFixed(1)}% of imported value.`);
  }

  const cryptoCount = holdings.filter((holding) => holding.type === "Crypto").length;
  if (cryptoCount > 0) {
    insights.push(`Detected ${cryptoCount} crypto holding${cryptoCount > 1 ? "s" : ""}; live price sync can override manual marks.`);
  }

  return insights;
}

async function generateAiImportSummary(holdings: ParsedImportHolding[]): Promise<string | null> {
  if (!OPENROUTER_API_KEY || holdings.length === 0) return null;

  const compact = holdings.slice(0, 25).map((holding) => ({
    name: holding.name,
    ticker: holding.ticker,
    type: holding.type,
    qty: holding.qty,
    avgCost: holding.avgCost,
    currency: holding.currency,
  }));

  const prompt = [
    "You are an investment analyst.",
    "Provide a concise, practical portfolio import summary in 4 bullet points:",
    "- concentration risks",
    "- asset mix observation",
    "- inflation/fee reminder",
    "- one next action",
    "Keep each bullet short.",
    `Holdings JSON: ${JSON.stringify(compact)}`,
  ].join("\n");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": APP_URL,
      "X-Title": APP_NAME,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 240,
      temperature: 0.2,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return payload.choices?.[0]?.message?.content?.trim() || null;
}

if (!WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing required environment variables: CLERK_WEBHOOK_SECRET, VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Clerk sends JSON, but we need the raw body for signature verification
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).send("Missing svix headers");
    }

    const body = req.body.toString();
    const wh = new Webhook(WEBHOOK_SECRET!);

    let evt: any;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return res.status(400).send("Invalid signature");
    }

    console.log(`Webhook received: ${evt.type}`);

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses?.[0]?.email_address;
        const fullName = [first_name, last_name].filter(Boolean).join(" ");

        const { error } = await supabase.from("profiles").upsert(
          {
            id,
            email,
            full_name: fullName || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (error) {
          console.error("Webhook: Error upserting profile:", error);
          return res.status(500).send("Database error");
        }

        console.log(`Profile upserted for user ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;
        if (id) {
          const { error } = await supabase
            .from("profiles")
            .delete()
            .eq("id", id);

          if (error) {
            console.error("Webhook: Error deleting profile:", error);
            return res.status(500).send("Database error");
          }

          console.log(`Profile deleted for user ${id}`);
        }
        break;
      }
    }

    return res.status(200).send("OK");
  }
);

// JSON body parser for non-webhook API routes.
app.use(express.json({ limit: "5mb" }));

app.get("/api/v1/market/quotes", async (req, res) => {
  try {
    const rawSymbols = String(req.query.symbols || "");
    const symbols = rawSymbols
      .split(",")
      .map((symbol) => symbol.trim().toUpperCase())
      .filter((symbol, index, list) => symbol.length > 0 && list.indexOf(symbol) === index);

    if (symbols.length === 0) {
      return res.status(400).json({
        error: {
          code: "INVALID_SYMBOLS",
          message: "Query parameter symbols is required (comma-separated).",
          status: 400,
        },
      });
    }

    if (symbols.length > 60) {
      return res.status(400).json({
        error: {
          code: "TOO_MANY_SYMBOLS",
          message: "Please request at most 60 symbols per call.",
          status: 400,
        },
      });
    }

    const payload = await getLiveMarketQuotes(symbols);
    return res.status(200).json(payload);
  } catch (error) {
    console.error("Market quotes endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "MARKET_QUOTES_INTERNAL_ERROR",
        message: "Failed to fetch market quotes.",
        status: 500,
      },
    });
  }
});

app.post("/api/v1/data/analyze-csv", async (req, res) => {
  try {
    const { userId, csvText } = req.body as {
      userId?: string;
      csvText?: string;
    };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "A valid userId is required.",
          status: 400,
        },
      });
    }

    if (!csvText || typeof csvText !== "string" || csvText.trim().length < 10) {
      return res.status(400).json({
        error: {
          code: "INVALID_CSV",
          message: "csvText must contain a valid CSV payload.",
          status: 400,
        },
      });
    }

    if (csvText.length > 4_000_000) {
      return res.status(413).json({
        error: {
          code: "CSV_TOO_LARGE",
          message: "CSV payload too large. Please keep uploads below 4MB.",
          status: 413,
        },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    const profileLookupError = mapProfileLookupError(profileError);
    if (profileLookupError) {
      return res.status(profileLookupError.status).json({
        error: {
          code: profileLookupError.code,
          message: profileLookupError.message,
          status: profileLookupError.status,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found for the provided userId.",
          status: 404,
        },
      });
    }

    const heuristic = parseCsvWithHeuristics(csvText);
    let parserUsed: "heuristic" | "ai-fallback" = "heuristic";
    let normalized = heuristic.holdings;
    let aiSummary: string | null = null;

    const shouldTryAiFallback =
      normalized.length === 0 ||
      (heuristic.skippedRows > 0 && normalized.length <= 2);

    if (shouldTryAiFallback) {
      const aiParsed = await parseCsvWithAi(csvText);
      if (aiParsed && aiParsed.holdings.length > 0) {
        parserUsed = "ai-fallback";
        normalized = aiParsed.holdings;
        aiSummary = aiParsed.analysis;
      }
    }

    if (normalized.length === 0) {
      return res.status(422).json({
        error: {
          code: "CSV_PARSE_FAILED",
          message:
            "No holdings could be extracted. Try uploading a holdings/positions export or include columns like name, ticker, qty, and price.",
          status: 422,
        },
        detectedColumns: heuristic.detectedColumns,
        warnings: heuristic.warnings.slice(0, 10),
      });
    }

    if (!aiSummary) {
      aiSummary = await generateAiImportSummary(normalized);
    }

    const insights = buildImportInsights(normalized);

    return res.status(200).json({
      parserUsed,
      detectedColumns: heuristic.detectedColumns,
      skippedRows: heuristic.skippedRows,
      warnings: heuristic.warnings.slice(0, 12),
      insights,
      aiSummary,
      advisorPromptSuggestion:
        "Summarize my current dashboard and holdings, then call out concentration and downside risks.",
      holdings: normalized,
    });
  } catch (error) {
    console.error("CSV analysis endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "CSV_ANALYSIS_INTERNAL_ERROR",
        message: "Failed to analyze CSV upload.",
        status: 500,
      },
    });
  }
});

app.post("/api/v1/data/save-assets", async (req, res) => {
  try {
    const {
      userId,
      email,
      fullName,
      holdings,
      tangibleMetaByKey,
      usdToPhp,
      contextLabel,
    } = req.body as SaveAssetsRequestBody;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "A valid userId is required.",
          status: 400,
        },
      });
    }

    if (!Array.isArray(holdings)) {
      return res.status(400).json({
        error: {
          code: "INVALID_HOLDINGS_PAYLOAD",
          message: "holdings must be an array.",
          status: 400,
        },
      });
    }

    const upsertPayload: Record<string, unknown> = {
      id: userId,
      updated_at: new Date().toISOString(),
    };

    if (typeof email === "string") {
      upsertPayload.email = email.trim() || null;
    }

    if (typeof fullName === "string") {
      upsertPayload.full_name = fullName.trim() || null;
    }

    const { error: profileEnsureError } = await supabase
      .from("profiles")
      .upsert(upsertPayload, { onConflict: "id" });

    if (profileEnsureError) {
      if (isSupabaseAuthError(profileEnsureError)) {
        return res.status(503).json({
          error: {
            code: "SUPABASE_AUTH_INVALID",
            message:
              "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
            status: 503,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "PROFILE_ENSURE_FAILED",
          message: "Failed to initialize profile before saving assets.",
          status: 500,
        },
      });
    }

    const normalizedHoldings = holdings
      .map((holding, index) => normalizeSaveHolding(holding, index))
      .filter((holding): holding is ParsedImportHolding => holding !== null);

    const { error: deleteError } = await supabase
      .from("assets")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      if (isSupabaseAuthError(deleteError)) {
        return res.status(503).json({
          error: {
            code: "SUPABASE_AUTH_INVALID",
            message:
              "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
            status: 503,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "ASSET_DELETE_FAILED",
          message: "Unable to clear existing assets before saving.",
          status: 500,
        },
      });
    }

    if (normalizedHoldings.length === 0) {
      return res.status(200).json({
        success: true,
        saved: 0,
      });
    }

    const fxRate = clampNumber(
      Number(usdToPhp || process.env.USD_TO_PHP_FALLBACK || 56.5),
      1,
      500
    );
    const importContext =
      typeof contextLabel === "string" && contextLabel.trim().length > 0
        ? contextLabel.trim()
        : "import_pipeline";

    const rows = normalizedHoldings.map((holding) => {
      const key = `${holding.ticker}::${holding.name}`;
      const tangibleMeta = tangibleMetaByKey?.[key];
      const isTangible = holding.type === "Tangible Assets";
      const unitPrice = holding.manualPrice ?? holding.avgCost;
      const nativeValue = unitPrice * holding.qty;
      const currentValuePhp =
        holding.currency === "USD" ? nativeValue * fxRate : nativeValue;

      return {
        user_id: userId,
        asset_class: mapHoldingTypeToAssetClass(holding.type),
        ticker_or_name: holding.ticker,
        quantity: holding.qty,
        avg_cost_basis: holding.avgCost,
        current_value_php: currentValuePhp,
        native_currency: holding.currency,
        is_manual: holding.manualPrice !== null,
        notes: JSON.stringify({
          ticker: holding.ticker,
          name: holding.name,
          type: holding.type,
          manualPrice: holding.manualPrice,
          is_tangible_asset: isTangible,
          tangible_category: isTangible ? tangibleMeta?.category || "other" : null,
          legal_attested: isTangible ? Boolean(tangibleMeta?.legalAttested) : null,
          proof_file_name: isTangible ? tangibleMeta?.proofFileName || null : null,
          proof_file_size:
            isTangible && Number.isFinite(Number(tangibleMeta?.proofFileSize))
              ? Number(tangibleMeta?.proofFileSize)
              : null,
          legal_notice: isTangible
            ? "I confirm this asset is legally owned by me (or my legal entity), and I have permission to upload related documentation. AETHER tracks analytics only and does not establish legal title or custody."
            : null,
          valuation_method: isTangible ? "user_estimated_value" : null,
          import_context: importContext,
        }),
      };
    });

    const { error: insertError } = await supabase.from("assets").insert(rows);
    if (insertError) {
      if (isSupabaseAuthError(insertError)) {
        return res.status(503).json({
          error: {
            code: "SUPABASE_AUTH_INVALID",
            message:
              "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
            status: 503,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "ASSET_INSERT_FAILED",
          message: "Unable to save assets.",
          status: 500,
        },
      });
    }

    return res.status(200).json({
      success: true,
      saved: rows.length,
    });
  } catch (error) {
    console.error("Save assets endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "SAVE_ASSETS_INTERNAL_ERROR",
        message: "Failed to save assets.",
        status: 500,
      },
    });
  }
});

app.get("/api/v1/data/assets", async (req, res) => {
  try {
    const userId = String(req.query.userId || "").trim();

    if (!userId) {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "Query parameter userId is required.",
          status: 400,
        },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    const profileLookupError = mapProfileLookupError(profileError);
    if (profileLookupError) {
      return res.status(profileLookupError.status).json({
        error: {
          code: profileLookupError.code,
          message: profileLookupError.message,
          status: profileLookupError.status,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found for the provided userId.",
          status: 404,
        },
      });
    }

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      if (isSupabaseAuthError(error)) {
        return res.status(503).json({
          error: {
            code: "SUPABASE_AUTH_INVALID",
            message:
              "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
            status: 503,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "ASSET_FETCH_FAILED",
          message: "Unable to fetch saved assets.",
          status: 500,
        },
      });
    }

    return res.status(200).json({
      assets: data || [],
    });
  } catch (error) {
    console.error("Load assets endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "LOAD_ASSETS_INTERNAL_ERROR",
        message: "Failed to load assets.",
        status: 500,
      },
    });
  }
});

app.post("/api/v1/advisor/ask", async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(503).json({
        error: {
          code: "MISSING_OPENROUTER_KEY",
          message: "OPENROUTER_API_KEY is not configured on the server.",
          status: 503,
        },
      });
    }

    const { userId, message, conversationHistory = [] } = req.body as {
      userId?: string;
      message?: string;
      conversationHistory?: AdvisorHistoryMessage[];
    };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "A valid userId is required.",
          status: 400,
        },
      });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_MESSAGE",
          message: "A non-empty message is required.",
          status: 400,
        },
      });
    }

    const normalizedMessage = sanitizeMessage(message);
    if (!normalizedMessage) {
      return res.status(400).json({
        error: {
          code: "EMPTY_MESSAGE",
          message: "Message cannot be empty.",
          status: 400,
        },
      });
    }

    if (normalizedMessage.length > 5000) {
      return res.status(400).json({
        error: {
          code: "MESSAGE_TOO_LONG",
          message: "Message is too long. Please keep it under 5000 characters.",
          status: 400,
        },
      });
    }

    const [{ data: profile, error: profileError }, { data: assets, error: assetsError }, { data: liabilities, error: liabilitiesError }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, risk_tolerance, base_currency, subscription_tier")
          .eq("id", userId)
          .single(),
        supabase
          .from("assets")
          .select("id, user_id, asset_class, ticker_or_name, quantity, avg_cost_basis, current_value_php, annual_fee_pct, notes")
          .eq("user_id", userId),
        supabase
          .from("liabilities")
          .select("id, user_id, outstanding_balance")
          .eq("user_id", userId),
      ]);

    const profileLookupError = mapProfileLookupError(profileError);
    if (profileLookupError) {
      return res.status(profileLookupError.status).json({
        error: {
          code: profileLookupError.code,
          message: profileLookupError.message,
          status: profileLookupError.status,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found for the provided userId.",
          status: 404,
        },
      });
    }

    if (assetsError || liabilitiesError) {
      return res.status(500).json({
        error: {
          code: "PORTFOLIO_FETCH_FAILED",
          message: "Unable to load portfolio context.",
          status: 500,
        },
      });
    }

    const tier: SubscriptionTier = profile.subscription_tier === "pro" ? "pro" : "free";
    const rateCheck = checkAdvisorRateLimit(userId, tier);

    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message:
            tier === "free"
              ? "Daily advisor limit reached for free tier (20/day). Upgrade to Pro for higher limits."
              : "Daily advisor limit reached. Try again after reset.",
          status: 429,
        },
        rateLimit: {
          limit: rateCheck.limit,
          remaining: rateCheck.remaining,
          resetAt: rateCheck.resetAt,
        },
      });
    }

    const safeAssets = (assets || []) as AssetRow[];
    const safeLiabilities = (liabilities || []) as LiabilityRow[];
    const portfolioContext = buildPortfolioContext(profile as ProfileRow, safeAssets, safeLiabilities);

    cleanExpiredAdvisorCache();
    const cacheKey = buildAdvisorCacheKey(userId, normalizedMessage, portfolioContext);
    const cached = advisorCacheStore.get(cacheKey);

    res.setHeader("X-RateLimit-Limit", String(rateCheck.limit));
    res.setHeader("X-RateLimit-Remaining", String(rateCheck.remaining));
    res.setHeader("X-RateLimit-Reset", String(rateCheck.resetAt));

    if (cached && cached.expiresAt > nowMs()) {
      res.setHeader("X-Advisor-Cache", "HIT");
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.write(cached.response);
      return res.end();
    }

    const sanitizedHistory = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .filter(
        (item) =>
          item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string" &&
          item.content.trim().length > 0
      )
      .slice(-10)
      .map((item) => ({
        role: item.role,
        content: sanitizeMessage(item.content).slice(0, 4_000),
      }));

    const messagesForModel: OpenRouterMessage[] = [
      { role: "system", content: buildSystemPrompt(portfolioContext) },
      ...sanitizedHistory,
      { role: "user", content: normalizedMessage },
    ];

    let upstreamResult: { response: Response; modelUsed: string };
    try {
      upstreamResult = await requestOpenRouterStreamWithFallback(messagesForModel);
    } catch (error) {
      if (error instanceof OpenRouterUpstreamError) {
        if (shouldRefundRateLimitForUpstream(error.status)) {
          refundAdvisorRateLimit(userId);
        }

        if (shouldRetryOpenRouterStatus(error.status)) {
          const fallbackResponse = buildLocalAdvisorFallbackResponse(
            normalizedMessage,
            portfolioContext
          );
          res.setHeader("X-Advisor-Cache", "MISS");
          res.setHeader("X-AI-Mode", "local-fallback");
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.setHeader("Connection", "keep-alive");
          res.write(fallbackResponse);
          return res.end();
        }

        if (error.status === 429 && error.retryAfterMs !== null) {
          const retryAfterSeconds = Math.max(
            1,
            Math.ceil(error.retryAfterMs / 1000)
          );
          res.setHeader("Retry-After", String(retryAfterSeconds));
        }

        return res.status(502).json({
          error: {
            code: "OPENROUTER_ERROR",
            message: `OpenRouter request failed (${error.status}).`,
            detail: error.detail.slice(0, 600),
            status: 502,
          },
        });
      }

      throw error;
    }

    const upstreamResponse = upstreamResult.response;

    res.setHeader("X-Advisor-Cache", "MISS");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Connection", "keep-alive");

    if (!upstreamResponse.body) {
      res.setHeader("X-AI-Mode", "local-fallback");
      const fallbackResponse = buildLocalAdvisorFallbackResponse(
        normalizedMessage,
        portfolioContext
      );
      res.write(fallbackResponse);
      return res.end();
    }

    res.setHeader("X-AI-Mode", "openrouter");
    res.setHeader("X-AI-Model", upstreamResult.modelUsed);

    const reader = upstreamResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payloadChunk = trimmed.slice(5).trim();
        if (!payloadChunk || payloadChunk === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payloadChunk) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };

          const token = parsed.choices?.[0]?.delta?.content;
          if (typeof token === "string" && token.length > 0) {
            fullResponse += token;
            res.write(token);
          }
        } catch {
          // Ignore malformed chunks and continue streaming.
        }
      }
    }

    if (fullResponse.trim().length > 0) {
      advisorCacheStore.set(cacheKey, {
        response: fullResponse,
        expiresAt: nowMs() + AI_CACHE_TTL,
      });
    }

    return res.end();
  } catch (error) {
    console.error("Advisor endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "ADVISOR_INTERNAL_ERROR",
        message: "Advisor is temporarily unavailable.",
        status: 500,
      },
    });
  }
});

app.get("/api/v1/analytics/glass-box", async (req, res) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "Query parameter userId is required.",
          status: 400,
        },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    const profileLookupError = mapProfileLookupError(profileError);
    if (profileLookupError) {
      return res.status(profileLookupError.status).json({
        error: {
          code: profileLookupError.code,
          message: profileLookupError.message,
          status: profileLookupError.status,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found for the provided userId.",
          status: 404,
        },
      });
    }

    const { data: assets, error } = await supabase
      .from("assets")
      .select("id, user_id, asset_class, ticker_or_name, quantity, avg_cost_basis, current_value_php, annual_fee_pct, notes")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: {
          code: "ASSET_FETCH_FAILED",
          message: "Unable to fetch assets for Glass Box analysis.",
          status: 500,
        },
      });
    }

    const safeAssets = ((assets || []) as AssetRow[]).filter(
      (asset) => Number(asset.current_value_php) > 0
    );

    if (safeAssets.length === 0) {
      return res.status(400).json({
        error: {
          code: "NO_ASSETS",
          message: "At least one asset is required for Glass Box analysis.",
          status: 400,
        },
      });
    }

    const totalValue = safeAssets.reduce(
      (sum, asset) => sum + Number(asset.current_value_php || 0),
      0
    );

    const defaultMonteCarloPaths = Number(process.env.MONTE_CARLO_PATHS || 1000);
    const defaultMonteCarloYears = Number(process.env.MONTE_CARLO_HORIZON_YEARS || 10);

    const returnShiftPct = clampNumber(Number(req.query.returnShiftPct || 0), -20, 20) / 100;
    const volatilityMultiplier = clampNumber(Number(req.query.volatilityMultiplier || 1), 0.5, 3);
    const baseCorrelation = clampNumber(Number(req.query.baseCorrelation || 0.15), 0, 0.95);
    const monteCarloPaths = Math.round(
      clampNumber(Number(req.query.paths || defaultMonteCarloPaths), 100, 5000)
    );
    const monteCarloYears = Math.round(
      clampNumber(Number(req.query.years || defaultMonteCarloYears), 1, 30)
    );
    const monthlyContributionPhp = clampNumber(
      Number(req.query.monthlyContributionPhp || 0),
      0,
      1_000_000
    );
    const marketShockPct = clampNumber(Number(req.query.marketShockPct || 0), -80, 80) / 100;
    const riskFreeRatePct = clampNumber(Number(req.query.riskFreeRatePct || PH_BSP_RATE), 0, 25);

    const shockedInitialValue = Math.max(totalValue * (1 + marketShockPct), 0);
    const weights = safeAssets.map((asset) => Number(asset.current_value_php || 0) / totalValue);
    const assumptions = safeAssets.map((asset) => {
      const base = getAssetAssumptions(asset.asset_class);
      return {
        expectedReturn: base.expectedReturn,
        volatility: base.volatility * volatilityMultiplier,
      };
    });

    const covarianceMatrix: number[][] = Array.from(
      { length: safeAssets.length },
      (_, i) =>
        Array.from({ length: safeAssets.length }, (_, j) => {
          if (i === j) {
            return assumptions[i].volatility * assumptions[i].volatility;
          }
          return baseCorrelation * assumptions[i].volatility * assumptions[j].volatility;
        })
    );

    const variance = calculatePortfolioVariance(weights, covarianceMatrix);
    const stdDev = Math.sqrt(Math.max(variance, 0));
    const expectedReturnBase = assumptions.reduce(
      (sum, assumption, index) => sum + assumption.expectedReturn * weights[index],
      0
    );
    const expectedReturn = expectedReturnBase + returnShiftPct;
    const riskFreeRate = riskFreeRatePct / 100;
    const sharpeRatio = stdDev > 0 ? (expectedReturn - riskFreeRate) / stdDev : 0;

    const simulation = runMonteCarloSimulation({
      initialValue: shockedInitialValue,
      expectedReturn,
      volatility: stdDev,
      years: monteCarloYears,
      numPaths: monteCarloPaths,
      stepsPerYear: 12,
      periodicContribution: monthlyContributionPhp,
    });

    const topWeightIndex = weights.reduce(
      (bestIndex, value, index) => (value > weights[bestIndex] ? index : bestIndex),
      0
    );

    const interpretation = buildGlassBoxInterpretation({
      expectedReturn,
      stdDev,
      sharpeRatio,
      probLoss: simulation.stats.probLoss,
      topWeightName: safeAssets[topWeightIndex]?.ticker_or_name || "Top holding",
      topWeightPct: (weights[topWeightIndex] || 0) * 100,
      years: monteCarloYears,
    });

    return res.status(200).json({
      weights: safeAssets.map((asset, index) => ({
        name: asset.ticker_or_name,
        assetClass: asset.asset_class,
        weight: weights[index],
      })),
      covarianceMatrix,
      variance,
      stdDev,
      expectedReturn,
      riskFreeRate,
      sharpeRatio,
      assumptions: {
        returnShiftPct,
        volatilityMultiplier,
        baseCorrelation,
        years: monteCarloYears,
        paths: monteCarloPaths,
        monthlyContributionPhp,
        marketShockPct,
        riskFreeRatePct,
        shockedInitialValue,
      },
      interpretation,
      monteCarlo: simulation,
    });
  } catch (error) {
    console.error("Glass Box endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "GLASS_BOX_INTERNAL_ERROR",
        message: "Failed to run Glass Box analysis.",
        status: 500,
      },
    });
  }
});

app.get("/api/v1/analytics/fee-scan", async (req, res) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "Query parameter userId is required.",
          status: 400,
        },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    const profileLookupError = mapProfileLookupError(profileError);
    if (profileLookupError) {
      return res.status(profileLookupError.status).json({
        error: {
          code: profileLookupError.code,
          message: profileLookupError.message,
          status: profileLookupError.status,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found for the provided userId.",
          status: 404,
        },
      });
    }

    const { data: assets, error } = await supabase
      .from("assets")
      .select("id, user_id, asset_class, ticker_or_name, quantity, avg_cost_basis, current_value_php, annual_fee_pct, notes")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: {
          code: "ASSET_FETCH_FAILED",
          message: "Unable to fetch assets for fee scan.",
          status: 500,
        },
      });
    }

    const safeAssets = (assets || []) as AssetRow[];
    let totalTenYearCost = 0;
    const results = safeAssets
      .filter((asset) => Number(asset.annual_fee_pct || 0) > 0)
      .map((asset) => {
        const annualFeePct = Number(asset.annual_fee_pct || 0);
        const tenYearCost = computeFeeCost(
          Number(asset.current_value_php || 0),
          0.08,
          annualFeePct / 100,
          10
        );
        totalTenYearCost += tenYearCost;

        let severity: "critical" | "warning" | "info" = "info";
        if (annualFeePct >= 1.5) severity = "critical";
        else if (annualFeePct >= 0.75) severity = "warning";

        let suggestion = "";
        if (asset.asset_class === "uitf") {
          suggestion = "Consider lower-fee index alternatives (e.g., FMETF) if aligned with your strategy.";
        } else if (asset.asset_class === "other") {
          const notes = parseNotesPayload(asset.notes);
          if (notes?.is_tangible_asset === true) {
            suggestion = "Review valuation method annually and keep ownership documents updated.";
          }
        }

        return {
          assetId: asset.id,
          assetName: asset.ticker_or_name,
          assetClass: asset.asset_class,
          currentValuePhp: Number(asset.current_value_php || 0),
          annualFeePct,
          tenYearCost,
          severity,
          suggestion,
        };
      })
      .sort((a, b) => b.tenYearCost - a.tenYearCost);

    return res.status(200).json({
      totalTenYearCost,
      assumptions: {
        annualGrossReturnPct: 8,
        years: 10,
      },
      results,
    });
  } catch (error) {
    console.error("Fee scan endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "FEE_SCAN_INTERNAL_ERROR",
        message: "Failed to run fee scan.",
        status: 500,
      },
    });
  }
});

app.get("/api/v1/analytics/real-return", async (req, res) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "Query parameter userId is required.",
          status: 400,
        },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    const profileLookupError = mapProfileLookupError(profileError);
    if (profileLookupError) {
      return res.status(profileLookupError.status).json({
        error: {
          code: profileLookupError.code,
          message: profileLookupError.message,
          status: profileLookupError.status,
        },
      });
    }

    if (!profile) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Profile not found for the provided userId.",
          status: 404,
        },
      });
    }

    const { data: assets, error } = await supabase
      .from("assets")
      .select("id, user_id, asset_class, ticker_or_name, quantity, avg_cost_basis, current_value_php, annual_fee_pct, notes")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: {
          code: "ASSET_FETCH_FAILED",
          message: "Unable to fetch assets for real-return analysis.",
          status: 500,
        },
      });
    }

    const inflationRate = PH_CPI_RATE / 100;
    const rows = ((assets || []) as AssetRow[])
      .filter((asset) => Number(asset.current_value_php) > 0)
      .map((asset) => {
        const quantity = Number(asset.quantity || 0);
        const avgCost = Number(asset.avg_cost_basis || 0);
        const currentValue = Number(asset.current_value_php || 0);
        const currentPrice = quantity > 0 ? currentValue / quantity : 0;

        let nominalReturn = 0;
        if (avgCost > 0 && currentPrice > 0) {
          nominalReturn = (currentPrice - avgCost) / avgCost;
        } else {
          nominalReturn = getAssetAssumptions(asset.asset_class).expectedReturn;
        }

        const realReturn = calculateRealReturn(nominalReturn, inflationRate);
        return {
          assetId: asset.id,
          assetName: asset.ticker_or_name,
          assetClass: asset.asset_class,
          nominalReturn,
          realReturn,
          inflationDrag: nominalReturn - realReturn,
          isNegativeReal: realReturn < 0,
        };
      });

    return res.status(200).json({
      inflationRate,
      inflationSource: "PSA CPI",
      results: rows,
    });
  } catch (error) {
    console.error("Real-return endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "REAL_RETURN_INTERNAL_ERROR",
        message: "Failed to compute real returns.",
        status: 500,
      },
    });
  }
});

app.post("/api/v1/user/ensure-profile", async (req, res) => {
  try {
    const {
      userId,
      email,
      fullName,
      risk_tolerance,
      base_currency,
      onboarding_complete,
    } = req.body as {
      userId?: string;
      email?: string | null;
      fullName?: string | null;
      risk_tolerance?: "conservative" | "moderate" | "aggressive";
      base_currency?: "PHP" | "USD" | "SGD" | "HKD";
      onboarding_complete?: boolean;
    };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "A valid userId is required.",
          status: 400,
        },
      });
    }

    const validRiskTolerance = ["conservative", "moderate", "aggressive"];
    const validCurrencies = ["PHP", "USD", "SGD", "HKD"];

    if (risk_tolerance && !validRiskTolerance.includes(risk_tolerance)) {
      return res.status(400).json({
        error: {
          code: "INVALID_RISK_TOLERANCE",
          message: "risk_tolerance must be conservative, moderate, or aggressive.",
          status: 400,
        },
      });
    }

    if (base_currency && !validCurrencies.includes(base_currency)) {
      return res.status(400).json({
        error: {
          code: "INVALID_BASE_CURRENCY",
          message: "base_currency must be one of PHP, USD, SGD, or HKD.",
          status: 400,
        },
      });
    }

    const upsertPayload: Record<string, unknown> = {
      id: userId,
      updated_at: new Date().toISOString(),
    };

    if (typeof email === "string") {
      upsertPayload.email = email.trim() || null;
    } else if (email === null) {
      upsertPayload.email = null;
    }

    if (typeof fullName === "string") {
      upsertPayload.full_name = fullName.trim() || null;
    } else if (fullName === null) {
      upsertPayload.full_name = null;
    }

    if (risk_tolerance) {
      upsertPayload.risk_tolerance = risk_tolerance;
    }

    if (base_currency) {
      upsertPayload.base_currency = base_currency;
    }

    if (typeof onboarding_complete === "boolean") {
      upsertPayload.onboarding_complete = onboarding_complete;
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(upsertPayload, { onConflict: "id" })
      .select("id, onboarding_complete, risk_tolerance, base_currency, subscription_tier")
      .single();

    if (error) {
      if (isSupabaseAuthError(error)) {
        return res.status(503).json({
          error: {
            code: "SUPABASE_AUTH_INVALID",
            message:
              "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
            status: 503,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "PROFILE_ENSURE_FAILED",
          message: "Failed to initialize profile.",
          status: 500,
        },
      });
    }

    if (!data) {
      return res.status(500).json({
        error: {
          code: "PROFILE_ENSURE_FAILED",
          message: "Failed to initialize profile.",
          status: 500,
        },
      });
    }

    return res.status(200).json({
      success: true,
      profile: data,
    });
  } catch (error) {
    console.error("Ensure profile endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "PROFILE_ENSURE_INTERNAL_ERROR",
        message: "Failed to ensure profile.",
        status: 500,
      },
    });
  }
});

app.get("/api/v1/user/settings", async (req, res) => {
  try {
    const userId = String(req.query.userId || "").trim();
    if (!userId) {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "Query parameter userId is required.",
          status: 400,
        },
      });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, risk_tolerance, base_currency, subscription_tier")
      .eq("id", userId)
      .single();

    if (error) {
      const profileLookupError = mapProfileLookupError(error);
      if (profileLookupError) {
        return res.status(profileLookupError.status).json({
          error: {
            code: profileLookupError.code,
            message: profileLookupError.message,
            status: profileLookupError.status,
          },
        });
      }
    }

    if (!data) {
      return res.status(404).json({
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "User settings not found.",
          status: 404,
        },
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("User settings endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "USER_SETTINGS_INTERNAL_ERROR",
        message: "Failed to fetch user settings.",
        status: 500,
      },
    });
  }
});

app.put("/api/v1/user/risk-profile", async (req, res) => {
  try {
    const { userId, risk_tolerance, base_currency } = req.body as {
      userId?: string;
      risk_tolerance?: "conservative" | "moderate" | "aggressive";
      base_currency?: "PHP" | "USD" | "SGD" | "HKD";
    };

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_USER_ID",
          message: "A valid userId is required.",
          status: 400,
        },
      });
    }

    const validRiskTolerance = ["conservative", "moderate", "aggressive"];
    const validCurrencies = ["PHP", "USD", "SGD", "HKD"];

    if (risk_tolerance && !validRiskTolerance.includes(risk_tolerance)) {
      return res.status(400).json({
        error: {
          code: "INVALID_RISK_TOLERANCE",
          message: "risk_tolerance must be conservative, moderate, or aggressive.",
          status: 400,
        },
      });
    }

    if (base_currency && !validCurrencies.includes(base_currency)) {
      return res.status(400).json({
        error: {
          code: "INVALID_BASE_CURRENCY",
          message: "base_currency must be one of PHP, USD, SGD, HKD.",
          status: 400,
        },
      });
    }

    const updates: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (risk_tolerance) updates.risk_tolerance = risk_tolerance;
    if (base_currency) updates.base_currency = base_currency;

    const { error } = await supabase.from("profiles").update(updates).eq("id", userId);

    if (error) {
      if (isSupabaseAuthError(error)) {
        return res.status(503).json({
          error: {
            code: "SUPABASE_AUTH_INVALID",
            message:
              "Server data access is not configured correctly. Update SUPABASE_SERVICE_ROLE_KEY and restart the webhook API.",
            status: 503,
          },
        });
      }

      return res.status(500).json({
        error: {
          code: "PROFILE_UPDATE_FAILED",
          message: "Failed to update profile settings.",
          status: 500,
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Risk profile endpoint error:", error);
    return res.status(500).json({
      error: {
        code: "RISK_PROFILE_INTERNAL_ERROR",
        message: "Failed to update risk profile.",
        status: 500,
      },
    });
  }
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

async function startServer() {
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error && isSupabaseAuthError(error)) {
      console.error(
        "Invalid Supabase credentials: SUPABASE_SERVICE_ROLE_KEY is rejected by Supabase. Update .env.local and restart."
      );
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Webhook server running on port ${PORT}`);
      console.log(`Endpoint: http://localhost:${PORT}/api/webhooks/clerk`);
      console.log(`Phase 3 API: http://localhost:${PORT}/api/v1/*`);
      console.log(`Advisor model: ${AI_MODEL}`);
      console.log(
        `Advisor fallback models: ${
          AI_FALLBACK_MODELS.length > 0
            ? AI_FALLBACK_MODELS.join(", ")
            : "(disabled)"
        }`
      );
      console.log(
        `Advisor upstream retries: ${AI_UPSTREAM_MAX_RETRIES} (base ${AI_UPSTREAM_RETRY_BASE_MS}ms, max ${AI_UPSTREAM_RETRY_MAX_MS}ms)`
      );
    });
  } catch (error) {
    console.error("Failed to initialize webhook server:", error);
    process.exit(1);
  }
}

startServer();
