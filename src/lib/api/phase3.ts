import { apiUrl } from "@/src/lib/api/client";

interface ErrorPayload {
  error?: {
    message?: string;
  };
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw.trim()) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const shouldTryJson =
    contentType.includes("application/json") ||
    raw.trim().startsWith("{") ||
    raw.trim().startsWith("[");

  if (!shouldTryJson) {
    return raw;
  }

  try {
    return JSON.parse(raw);
  } catch {
    // Return raw body so callers still get a useful error instead of JSON parse crash.
    return raw;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await parseResponseBody(response)) as (T & ErrorPayload) | string | null;

  if (!response.ok) {
    if (payload && typeof payload === "object" && "error" in payload) {
      const withError = payload as ErrorPayload;
      throw new Error(withError.error?.message || `Request failed (${response.status})`);
    }

    if (typeof payload === "string" && payload.trim().length > 0) {
      throw new Error(payload.slice(0, 240));
    }

    throw new Error(`Request failed (${response.status})`);
  }

  if (payload === null) {
    throw new Error("Empty response from server.");
  }

  if (typeof payload !== "object") {
    throw new Error("Unexpected response format from server.");
  }

  return payload as T;
}

export interface FeeScanResponse {
  totalTenYearCost: number;
  assumptions: {
    annualGrossReturnPct: number;
    years: number;
  };
  results: Array<{
    assetId: string;
    assetName: string;
    assetClass: string;
    currentValuePhp: number;
    annualFeePct: number;
    tenYearCost: number;
    severity: "critical" | "warning" | "info";
    suggestion?: string;
  }>;
}

export interface RealReturnResponse {
  inflationRate: number;
  inflationSource: string;
  results: Array<{
    assetId: string;
    assetName: string;
    assetClass: string;
    nominalReturn: number;
    realReturn: number;
    inflationDrag: number;
    isNegativeReal: boolean;
  }>;
}

export interface GlassBoxResponse {
  weights: Array<{
    name: string;
    assetClass: string;
    weight: number;
  }>;
  covarianceMatrix: number[][];
  variance: number;
  stdDev: number;
  expectedReturn: number;
  riskFreeRate: number;
  sharpeRatio: number;
  assumptions?: {
    returnShiftPct: number;
    volatilityMultiplier: number;
    baseCorrelation: number;
    years: number;
    paths: number;
    monthlyContributionPhp: number;
    marketShockPct: number;
    riskFreeRatePct: number;
    shockedInitialValue: number;
  };
  interpretation?: {
    riskBand: string;
    summary: string;
    keyPoints: string[];
  };
  monteCarlo: {
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
  };
}

export interface GlassBoxQuery {
  returnShiftPct?: number;
  volatilityMultiplier?: number;
  baseCorrelation?: number;
  years?: number;
  paths?: number;
  monthlyContributionPhp?: number;
  marketShockPct?: number;
  riskFreeRatePct?: number;
}

export interface UserSettingsResponse {
  id: string;
  full_name: string | null;
  risk_tolerance: "conservative" | "moderate" | "aggressive";
  base_currency: "PHP" | "USD" | "SGD" | "HKD";
  subscription_tier: "free" | "pro";
}

export async function getFeeScan(userId: string): Promise<FeeScanResponse> {
  const response = await fetch(apiUrl(`/api/v1/analytics/fee-scan?userId=${encodeURIComponent(userId)}`));
  return parseJson<FeeScanResponse>(response);
}

export async function getRealReturn(userId: string): Promise<RealReturnResponse> {
  const response = await fetch(apiUrl(`/api/v1/analytics/real-return?userId=${encodeURIComponent(userId)}`));
  return parseJson<RealReturnResponse>(response);
}

export async function getGlassBox(userId: string, query?: GlassBoxQuery): Promise<GlassBoxResponse> {
  const params = new URLSearchParams({ userId });
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params.set(key, String(value));
    }
  }

  const response = await fetch(apiUrl(`/api/v1/analytics/glass-box?${params.toString()}`));
  return parseJson<GlassBoxResponse>(response);
}

export async function getUserSettings(userId: string): Promise<UserSettingsResponse> {
  const response = await fetch(apiUrl(`/api/v1/user/settings?userId=${encodeURIComponent(userId)}`));
  return parseJson<UserSettingsResponse>(response);
}

export async function updateUserSettings(
  userId: string,
  payload: {
    risk_tolerance?: "conservative" | "moderate" | "aggressive";
    base_currency?: "PHP" | "USD" | "SGD" | "HKD";
  }
): Promise<{ success: boolean }> {
  const response = await fetch(apiUrl("/api/v1/user/risk-profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...payload }),
  });
  return parseJson<{ success: boolean }>(response);
}
