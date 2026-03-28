import { Outlet } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { useEffect, useState, useCallback, createContext, useContext, useRef } from "react";
import { Sidebar } from "@/src/components/layout/sidebar";
import { GlowBlobs } from "@/src/components/layout/glow-blobs";
import { RightRail } from "@/src/components/layout/right-rail";
import { createAuthClient } from "@/src/lib/supabase/client";
import { UserButton } from "@clerk/react";
import { useExchangeRate } from "@/src/hooks/use-exchange-rate";
import { useCryptoPrices } from "@/src/hooks/use-crypto-prices";
import { apiFetch } from "@/src/lib/api/client";
import type { Asset } from "@/src/types/database";
import { MessageSquare } from "lucide-react";
import { CurrencySwitcher } from "@/src/components/currency/currency-switcher";
import {
  convertFromNativeToDisplay,
  currencySymbol,
  type DisplayCurrency,
} from "@/src/lib/currency/converter";

// ─── Types ───────────────────────────────────────────────

export interface Holding {
  name: string;
  ticker: string;
  type: "PH Stocks" | "US Stocks" | "Crypto" | "Cash" | "Bonds" | "Tangible Assets";
  qty: number;
  avgCost: number;
  currency: "PHP" | "USD";
  manualPrice: number | null;
}

interface DashboardFxRates {
  PHP: number;
  EUR: number;
  JPY: number;
  SGD: number;
  HKD: number;
}

function mapAssetClassToHoldingType(assetClass: string): Holding["type"] {
  if (assetClass === "pse_stock") return "PH Stocks";
  if (assetClass === "global_stock") return "US Stocks";
  if (assetClass === "crypto") return "Crypto";
  if (assetClass === "cash") return "Cash";
  if (assetClass === "other") return "Tangible Assets";
  return "Bonds";
}

function isHoldingType(value: unknown): value is Holding["type"] {
  return (
    value === "PH Stocks" ||
    value === "US Stocks" ||
    value === "Crypto" ||
    value === "Cash" ||
    value === "Bonds" ||
    value === "Tangible Assets"
  );
}

function safeParseAssetNotes(notes: string | null) {
  if (!notes) return null;
  try {
    const parsed = JSON.parse(notes);
    if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, unknown>;
  } catch {
    // Ignore malformed note payloads.
  }
  return null;
}

function mapAssetToHolding(asset: Asset): Holding {
  const notePayload = safeParseAssetNotes(asset.notes);
  const ticker = typeof notePayload?.ticker === "string" && notePayload.ticker.length > 0
    ? notePayload.ticker.toUpperCase()
    : asset.ticker_or_name.toUpperCase();
  const name = typeof notePayload?.name === "string" && notePayload.name.length > 0
    ? notePayload.name
    : asset.ticker_or_name;
  const type = typeof notePayload?.type === "string"
    ? (isHoldingType(notePayload.type) ? notePayload.type : mapAssetClassToHoldingType(asset.asset_class))
    : mapAssetClassToHoldingType(asset.asset_class);
  const nativeCurrency = asset.native_currency === "USD" ? "USD" : "PHP";
  const manualPrice = typeof notePayload?.manualPrice === "number"
    ? notePayload.manualPrice
    : asset.is_manual && asset.quantity > 0
      ? asset.current_value_php / asset.quantity
      : null;

  return {
    name,
    ticker,
    type,
    qty: asset.quantity,
    avgCost: asset.avg_cost_basis ?? 0,
    currency: nativeCurrency,
    manualPrice,
  };
}

async function parseApiPayload(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function extractApiErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "error" in payload) {
    const message = (payload as { error?: { message?: string } }).error?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload.slice(0, 240);
  }

  return fallback;
}

// ─── Dashboard Context ───────────────────────────────────

interface DashboardContextValue {
  holdings: Holding[];
  setHoldings: React.Dispatch<React.SetStateAction<Holding[]>>;
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (c: DisplayCurrency) => void;
  usdToPhp: number;
  fxRates: DashboardFxRates | null;
  fxStatus: "fresh" | "stale" | "loading";
  fxLastUpdated: Date | null;
  cryptoPrices: Record<string, number>;
  previousCryptoPrices: Record<string, number>;
  cryptoLoading: boolean;
  cryptoLastUpdated: Date | null;
  /** Convert an amount to the display currency */
  toDisplay: (amount: number, fromCurrency: "PHP" | "USD") => number;
  /** Format a value in the display currency */
  formatDisplay: (amount: number) => string;
  /** Get current price of a holding in its native currency */
  getCurrentPrice: (holding: Holding) => number;
  /** Get current price of a holding in display currency */
  getDisplayPrice: (holding: Holding) => number;
  /** Get market value of a holding in display currency */
  getMarketValue: (holding: Holding) => number;
  /** Get P&L percentage */
  getPnlPercent: (holding: Holding) => number;
  /** Get absolute P&L in display currency */
  getPnlAbsolute: (holding: Holding) => number;
  /** Get total portfolio value in display currency */
  getTotalPortfolio: () => number;
  /** Sidebar collapsed state */
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardLayout");
  return ctx;
}

// ─── PH Clock ────────────────────────────────────────────

function PHClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const phTime = new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setTime(phTime);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-xs text-text-muted"
      style={{ fontFamily: "JetBrains Mono, monospace" }}
    >
      PH {time}
    </span>
  );
}

// ─── Main Layout ─────────────────────────────────────────

export default function DashboardLayout() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("PHP");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const lastHydratedUserIdRef = useRef<string | null>(null);
  const completedHydrationUserIdRef = useRef<string | null>(null);

  const {
    usdToPhp,
    status: fxStatus,
    rates: fxRates,
    lastUpdated: fxLastUpdated,
  } = useExchangeRate();
  const {
    prices: cryptoPrices,
    previousPrices: previousCryptoPrices,
    loading: cryptoLoading,
    lastUpdated: cryptoLastUpdated,
  } = useCryptoPrices();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setCheckingOnboarding(false);
      setHoldings([]);
      lastHydratedUserIdRef.current = null;
      completedHydrationUserIdRef.current = null;
      return;
    }

    let cancelled = false;
    const fallbackController = new AbortController();
    const userId = user.id;

    if (lastHydratedUserIdRef.current !== userId) {
      // Prevent stale holdings from a previous account while new account data is loading.
      setHoldings([]);
      lastHydratedUserIdRef.current = userId;
      completedHydrationUserIdRef.current = null;
    }

    if (completedHydrationUserIdRef.current === userId) {
      setCheckingOnboarding(false);
      return;
    }

    async function hydrateDashboardState() {
      setCheckingOnboarding(true);
      try {
        let hydratedAssets: Asset[] | null = null;

        try {
          const token = (await getToken({ template: "supabase" })) || (await getToken());
          if (token) {
            const authClient = createAuthClient(token);
            const { data, error } = await authClient
              .from("assets")
              .select("*")
              .eq("user_id", userId)
              .order("updated_at", { ascending: false });

            if (error) {
              throw error;
            }

            if (Array.isArray(data)) {
              hydratedAssets = data as Asset[];
            }
          }
        } catch {
          // Fallback to backend API below when direct Supabase read is unavailable.
        }

        if (!hydratedAssets) {
          const fallbackTimeoutId = window.setTimeout(() => {
            fallbackController.abort();
          }, 8000);

          let response: Response;
          let payload: unknown;
          try {
            response = await apiFetch(
              `/api/v1/data/assets?userId=${encodeURIComponent(userId)}`,
              {
              signal: fallbackController.signal,
              }
            );
            payload = await parseApiPayload(response);
          } finally {
            window.clearTimeout(fallbackTimeoutId);
          }

          if (!response.ok) {
            throw new Error(
              extractApiErrorMessage(payload, "Failed to load saved holdings.")
            );
          }

          const assets =
            payload && typeof payload === "object" && "assets" in payload
              ? (payload as { assets?: Asset[] }).assets
              : null;

          hydratedAssets = Array.isArray(assets) ? assets : [];
        }

        if (!cancelled) {
          setHoldings(hydratedAssets.map(mapAssetToHolding));
        }
      } catch {
        if (!cancelled) {
          // Keep dashboard usable but avoid showing stale cross-account data.
          setHoldings([]);
        }
      } finally {
        if (!cancelled) {
          completedHydrationUserIdRef.current = userId;
          setCheckingOnboarding(false);
        }
      }
    }

    hydrateDashboardState();

    return () => {
      cancelled = true;
      fallbackController.abort();
    };
  }, [user, isLoaded, getToken]);

  // ─── Conversion helpers ────────────────────

  const toDisplay = useCallback(
    (amount: number, fromCurrency: "PHP" | "USD") => {
      return convertFromNativeToDisplay(amount, fromCurrency, displayCurrency, {
        PHP: fxRates?.PHP ?? usdToPhp,
        SGD: fxRates?.SGD ?? 1.34,
      });
    },
    [displayCurrency, fxRates, usdToPhp]
  );

  const formatDisplay = useCallback(
    (amount: number) => {
      const prefix = currencySymbol(displayCurrency);
      if (Math.abs(amount) >= 1_000_000) {
        return `${prefix}${(amount / 1_000_000).toFixed(2)}M`;
      }
      return `${prefix}${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [displayCurrency]
  );

  const getCurrentPrice = useCallback(
    (holding: Holding): number => {
      if (holding.type === "Crypto" && holding.manualPrice === null) {
        return cryptoPrices[holding.ticker] ?? holding.avgCost;
      }
      return holding.manualPrice ?? holding.avgCost;
    },
    [cryptoPrices]
  );

  const getDisplayPrice = useCallback(
    (holding: Holding): number => {
      const price = getCurrentPrice(holding);
      return toDisplay(price, holding.currency);
    },
    [getCurrentPrice, toDisplay]
  );

  const getMarketValue = useCallback(
    (holding: Holding): number => {
      const price = getCurrentPrice(holding);
      const nativeValue = price * holding.qty;
      return toDisplay(nativeValue, holding.currency);
    },
    [getCurrentPrice, toDisplay]
  );

  const getPnlPercent = useCallback(
    (holding: Holding): number => {
      const current = getCurrentPrice(holding);
      if (holding.avgCost === 0) return 0;
      return ((current - holding.avgCost) / holding.avgCost) * 100;
    },
    [getCurrentPrice]
  );

  const getPnlAbsolute = useCallback(
    (holding: Holding): number => {
      const current = getCurrentPrice(holding);
      const pnlNative = (current - holding.avgCost) * holding.qty;
      return toDisplay(pnlNative, holding.currency);
    },
    [getCurrentPrice, toDisplay]
  );

  const getTotalPortfolio = useCallback(() => {
    return holdings.reduce((sum, h) => sum + getMarketValue(h), 0);
  }, [holdings, getMarketValue]);

  const contextValue: DashboardContextValue = {
    holdings,
    setHoldings,
    displayCurrency,
    setDisplayCurrency,
    usdToPhp,
    fxRates,
    fxStatus,
    fxLastUpdated,
    cryptoPrices,
    previousCryptoPrices,
    cryptoLoading,
    cryptoLastUpdated,
    toDisplay,
    formatDisplay,
    getCurrentPrice,
    getDisplayPrice,
    getMarketValue,
    getPnlPercent,
    getPnlAbsolute,
    getTotalPortfolio,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  if (!isLoaded || checkingOnboarding) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#09090B" }}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-primary border-t-transparent" />
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? 72 : 240;

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#09090B" }}>
        <GlowBlobs />
        <Sidebar
          fxRate={usdToPhp}
          fxStatus={fxStatus === "loading" ? "fresh" : fxStatus}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className="min-h-screen transition-all duration-300"
          style={{ marginLeft: sidebarWidth, padding: "0 24px 24px 24px" }}
        >
          {/* Top Bar */}
          <div
            className="sticky top-0 z-30 flex items-center justify-between py-4"
            style={{
              backgroundColor: "rgba(9,9,11,0.85)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Left: Portfolio total */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-text-muted font-medium">Total Portfolio</p>
                <p
                  className="text-xl font-bold text-text-primary currency-fade tabular-nums"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {formatDisplay(getTotalPortfolio())}
                </p>
              </div>
            </div>

            {/* Right: clock + toggle + avatar */}
            <div className="flex items-center gap-4">
              <PHClock />
              <button
                type="button"
                onClick={() => setAdvisorOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-glass-border bg-bg-surface px-3 text-xs font-medium text-text-primary transition-colors hover:border-border-accent hover:bg-white/5"
                aria-label="Open AI Advisor"
              >
                <MessageSquare size={14} className="text-accent-primary" aria-hidden="true" />
                AI Chat
              </button>
              <CurrencySwitcher value={displayCurrency} onChange={setDisplayCurrency} />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </div>

          <Outlet />
        </main>

        <RightRail isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} />
      </div>
    </DashboardContext.Provider>
  );
}
