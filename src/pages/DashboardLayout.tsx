import { NavLink, Outlet } from "react-router-dom";
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
import { Brain, FileText, LayoutDashboard, Menu, MessageSquare, PieChart } from "lucide-react";
import { CurrencySwitcher } from "@/src/components/currency/currency-switcher";
import { cn } from "@/src/lib/utils";
import { GuidedTour, type GuidedTourStep } from "@/src/components/shared/guided-tour";
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

const mobilePrimaryNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true, tour: "mobile-tab-home" },
  { to: "/dashboard/holdings", label: "Holdings", icon: PieChart, tour: "mobile-tab-holdings" },
  { to: "/dashboard/data", label: "Import", icon: FileText, tour: "mobile-tab-import" },
  { to: "/dashboard/advisor", label: "Advisor", icon: Brain, tour: "mobile-tab-advisor" },
] as const;

const DESKTOP_GUIDED_TOUR_STEPS: GuidedTourStep[] = [
  {
    id: "tour-desktop-dashboard",
    title: "Dashboard Home",
    description: "Use this navigation item to return to your portfolio overview and key insights.",
    target: '[data-tour="nav-dashboard"]',
    placement: "right",
  },
  {
    id: "tour-desktop-holdings",
    title: "Holdings",
    description: "Manage and inspect every position in one place, including performance and allocation details.",
    target: '[data-tour="nav-holdings"]',
    placement: "right",
  },
  {
    id: "tour-desktop-import",
    title: "Data Import",
    description: "Import CSV or mock data here and review parsed results before confirming changes.",
    target: '[data-tour="nav-data-import"]',
    placement: "right",
  },
  {
    id: "tour-desktop-advisor",
    title: "AI Advisor",
    description: "Access advisor guidance and portfolio context to help with decisions.",
    target: '[data-tour="nav-advisor"]',
    placement: "right",
  },
  {
    id: "tour-desktop-total",
    title: "Portfolio Total",
    description: "This area tracks your current total portfolio value in your selected display currency.",
    target: '[data-tour="top-total-portfolio"]',
    placement: "bottom",
  },
  {
    id: "tour-desktop-chat",
    title: "Quick AI Chat",
    description: "Open this to ask questions without leaving your current screen.",
    target: '[data-tour="top-ai-chat"]',
    placement: "bottom",
  },
  {
    id: "tour-desktop-currency",
    title: "Currency Switcher",
    description: "Switch display currency instantly across dashboard analytics and summaries.",
    target: '[data-tour="top-currency-switcher"]',
    placement: "bottom",
  },
  {
    id: "tour-desktop-profile",
    title: "Profile Menu",
    description: "Manage your account session and profile actions from this menu.",
    target: '[data-tour="top-user-menu"]',
    placement: "bottom",
  },
  {
    id: "tour-desktop-settings-tip",
    title: "Re-open Tutorial Anytime",
    description: "Need a refresher? Open Settings and tap Start Tutorial Mode whenever you want.",
    placement: "center",
  },
];

const MOBILE_GUIDED_TOUR_STEPS: GuidedTourStep[] = [
  {
    id: "tour-mobile-menu",
    title: "Navigation Menu",
    description: "Tap here to open the full sidebar navigation on mobile.",
    target: '[data-tour="top-open-nav"]',
    placement: "bottom",
  },
  {
    id: "tour-mobile-home",
    title: "Home Tab",
    description: "Use the bottom tabs for quick navigation between the most used sections.",
    target: '[data-tour="mobile-tab-home"]',
    placement: "top",
  },
  {
    id: "tour-mobile-holdings",
    title: "Holdings Tab",
    description: "Open your positions list, pricing, and allocation details.",
    target: '[data-tour="mobile-tab-holdings"]',
    placement: "top",
  },
  {
    id: "tour-mobile-import",
    title: "Import Tab",
    description: "Import your data or mock files without leaving the app.",
    target: '[data-tour="mobile-tab-import"]',
    placement: "top",
  },
  {
    id: "tour-mobile-advisor",
    title: "Advisor Tab",
    description: "Jump to AI advisor tools and recommendations.",
    target: '[data-tour="mobile-tab-advisor"]',
    placement: "top",
  },
  {
    id: "tour-mobile-chat",
    title: "AI Chat Shortcut",
    description: "This button opens quick advisor chat from any dashboard screen.",
    target: '[data-tour="top-ai-chat"]',
    placement: "bottom",
  },
  {
    id: "tour-mobile-currency",
    title: "Currency Control",
    description: "Switch currencies here to compare values in your preferred display.",
    target: '[data-tour="top-currency-switcher"]',
    placement: "bottom",
  },
  {
    id: "tour-mobile-profile",
    title: "Profile",
    description: "Open your user menu for account actions.",
    target: '[data-tour="top-user-menu"]',
    placement: "bottom",
  },
  {
    id: "tour-mobile-settings-tip",
    title: "Tutorial Mode",
    description: "Returning users can activate this walkthrough again anytime from Settings.",
    placement: "center",
  },
];

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
  /** Launch the guided onboarding/tutorial flow */
  startGuidedTour: () => void;
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
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [guidedTourOpen, setGuidedTourOpen] = useState(false);
  const lastHydratedUserIdRef = useRef<string | null>(null);
  const completedHydrationUserIdRef = useRef<string | null>(null);
  const guidedTourStorageKey = user?.id ? `aether:dashboard-tour-seen:${user.id}` : null;

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const syncViewportMode = () => {
      const isMobile = mediaQuery.matches;
      setIsMobileViewport(isMobile);
      if (!isMobile) {
        setMobileSidebarOpen(false);
      }
    };

    syncViewportMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewportMode);
      return () => mediaQuery.removeEventListener("change", syncViewportMode);
    }

    mediaQuery.addListener(syncViewportMode);
    return () => mediaQuery.removeListener(syncViewportMode);
  }, []);

  const startGuidedTour = useCallback(() => {
    setSidebarCollapsed(false);
    setMobileSidebarOpen(false);
    setGuidedTourOpen(true);
  }, []);

  const markGuidedTourSeen = useCallback(() => {
    if (!guidedTourStorageKey) return;
    window.localStorage.setItem(guidedTourStorageKey, "1");
  }, [guidedTourStorageKey]);

  useEffect(() => {
    if (!isLoaded || !user?.id || !guidedTourStorageKey) return;

    const alreadySeen = window.localStorage.getItem(guidedTourStorageKey) === "1";
    if (!alreadySeen) {
      startGuidedTour();
    }
  }, [guidedTourStorageKey, isLoaded, startGuidedTour, user?.id]);

  const guidedTourSteps = useMemo(
    () => (isMobileViewport ? MOBILE_GUIDED_TOUR_STEPS : DESKTOP_GUIDED_TOUR_STEPS),
    [isMobileViewport]
  );

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
    startGuidedTour,
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

  const sidebarWidth = isMobileViewport ? 0 : sidebarCollapsed ? 72 : 240;

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative min-h-screen" style={{ backgroundColor: "#09090B" }}>
        <GlowBlobs />
        {isMobileViewport && mobileSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40"
            aria-label="Close navigation overlay"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <Sidebar
          fxRate={usdToPhp}
          fxStatus={fxStatus === "loading" ? "fresh" : fxStatus}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobileViewport}
          mobileOpen={mobileSidebarOpen}
          onRequestCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main
          className="layout-shift-transition min-h-screen"
          style={{
            marginLeft: sidebarWidth,
            padding: isMobileViewport
              ? "0 12px calc(104px + env(safe-area-inset-bottom)) 12px"
              : "0 24px 24px 24px",
          }}
        >
          {/* Top Bar */}
          <div
            className="motion-reveal sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4"
            style={{
              backgroundColor: "rgba(9,9,11,0.85)",
              backdropFilter: "blur(12px)",
              paddingTop: isMobileViewport ? "calc(env(safe-area-inset-top) + 8px)" : undefined,
            }}
          >
            {/* Left: Portfolio total */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              {isMobileViewport && (
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  data-tour="top-open-nav"
                  className="motion-tap inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-glass-border bg-bg-surface text-text-primary transition-colors hover:border-border-accent hover:bg-white/5"
                  aria-label="Open navigation"
                >
                  <Menu size={16} aria-hidden="true" />
                </button>
              )}
              <div data-tour="top-total-portfolio">
                <p className="text-xs font-medium text-text-muted">Total Portfolio</p>
                <p
                  className="currency-fade tabular-nums text-base font-bold text-text-primary sm:text-xl"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  {formatDisplay(getTotalPortfolio())}
                </p>
              </div>
            </div>

            {/* Right: clock + toggle + avatar */}
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-4">
              <div className="hidden lg:block">
                <PHClock />
              </div>
              <button
                type="button"
                onClick={() => setAdvisorOpen(true)}
                data-tour="top-ai-chat"
                className="motion-tap inline-flex h-11 items-center gap-2 rounded-full border border-glass-border bg-bg-surface px-2.5 text-xs font-medium text-text-primary transition-colors hover:border-border-accent hover:bg-white/5 sm:px-3"
                aria-label="Open AI Advisor"
              >
                <MessageSquare size={14} className="text-accent-primary" aria-hidden="true" />
                <span className="hidden sm:inline">AI Chat</span>
              </button>
              <div data-tour="top-currency-switcher">
                <CurrencySwitcher value={displayCurrency} onChange={setDisplayCurrency} />
              </div>
              <div data-tour="top-user-menu">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-11 h-11",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <Outlet />
        </main>

        {isMobileViewport && (
          <nav
            className="motion-reveal motion-reveal-delay-2 fixed inset-x-0 bottom-0 z-20 border-t border-glass-border bg-bg-surface/95 backdrop-blur-xl"
            aria-label="Primary navigation"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="mx-auto grid h-[84px] max-w-5xl grid-cols-4 items-center px-2">
              {mobilePrimaryNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  data-tour={item.tour}
                  className={({ isActive }) =>
                    cn(
                      "motion-tap flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-200",
                      isActive ? "text-accent-primary" : "text-text-muted"
                    )
                  }
                >
                  <item.icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        )}

        <GuidedTour
          open={guidedTourOpen}
          steps={guidedTourSteps}
          onClose={() => {
            setGuidedTourOpen(false);
            markGuidedTourSeen();
          }}
          onFinish={() => {
            setGuidedTourOpen(false);
            markGuidedTourSeen();
          }}
        />

        <RightRail isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} />
      </div>
    </DashboardContext.Provider>
  );
}
