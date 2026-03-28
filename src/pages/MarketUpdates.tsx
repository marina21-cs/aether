import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDashboard } from "./DashboardLayout";
import {
  CRYPTO_NAME_BY_TICKER,
  TRACKED_CRYPTO_TICKERS,
} from "@/src/lib/market-universe";
import { apiFetch } from "@/src/lib/api/client";

type RegionFilter = "All" | "PH" | "US" | "Global" | "Commodities";
type MarketTheme =
  | "Hot Stocks"
  | "Crypto"
  | "AI Companies"
  | "PH Blue Chips"
  | "US Mega Caps"
  | "Macro & Rates"
  | "Commodities";
type ThemeFilter = "All" | MarketTheme;

interface MarketInstrument {
  symbol: string;
  name: string;
  region: Exclude<RegionFilter, "All">;
  value: number;
  changePct: number;
  themes: MarketTheme[];
}

interface SpotlightRow {
  symbol: string;
  name: string;
  changePct: number;
}

interface SpotlightGroup {
  title: string;
  accentClass: string;
  rows: SpotlightRow[];
}

interface MarketLiveQuote {
  symbol: string;
  price: number;
  changePct: number;
  provider: string;
  asOf: string | null;
}

interface MarketLiveQuoteResponse {
  quotes?: Record<string, MarketLiveQuote>;
  coverage?: {
    requested?: number;
    live?: number;
  };
  fetchedAt?: string;
}

const REGION_FILTERS: RegionFilter[] = ["All", "PH", "US", "Global", "Commodities"];
const THEME_FILTERS: ThemeFilter[] = [
  "All",
  "Hot Stocks",
  "Crypto",
  "AI Companies",
  "PH Blue Chips",
  "US Mega Caps",
  "Macro & Rates",
  "Commodities",
];

const MARKET_UNIVERSE: MarketInstrument[] = [
  {
    symbol: "PSEI",
    name: "Philippine Stock Exchange Index",
    region: "PH",
    value: 6924.22,
    changePct: 0.72,
    themes: ["PH Blue Chips"],
  },
  {
    symbol: "BDO",
    name: "BDO Unibank",
    region: "PH",
    value: 138.6,
    changePct: 1.24,
    themes: ["PH Blue Chips", "Hot Stocks"],
  },
  {
    symbol: "SM",
    name: "SM Investments",
    region: "PH",
    value: 975.0,
    changePct: 0.88,
    themes: ["PH Blue Chips", "Hot Stocks"],
  },
  {
    symbol: "AC",
    name: "Ayala Corp",
    region: "PH",
    value: 598.0,
    changePct: -0.56,
    themes: ["PH Blue Chips"],
  },
  {
    symbol: "JFC",
    name: "Jollibee Foods Corp",
    region: "PH",
    value: 256.0,
    changePct: 1.14,
    themes: ["PH Blue Chips", "Hot Stocks"],
  },
  {
    symbol: "ALI",
    name: "Ayala Land",
    region: "PH",
    value: 34.2,
    changePct: 0.66,
    themes: ["PH Blue Chips"],
  },
  {
    symbol: "ICT",
    name: "ICTSI",
    region: "PH",
    value: 252.6,
    changePct: -0.39,
    themes: ["PH Blue Chips"],
  },
  {
    symbol: "FMETF",
    name: "First Metro ETF",
    region: "PH",
    value: 112.3,
    changePct: 0.41,
    themes: ["PH Blue Chips"],
  },
  {
    symbol: "SPX",
    name: "S&P 500",
    region: "US",
    value: 5321.56,
    changePct: 0.41,
    themes: ["US Mega Caps"],
  },
  {
    symbol: "NDX",
    name: "Nasdaq 100",
    region: "US",
    value: 18802.77,
    changePct: 0.93,
    themes: ["US Mega Caps", "Hot Stocks"],
  },
  {
    symbol: "DJI",
    name: "Dow Jones Industrial Average",
    region: "US",
    value: 39810.11,
    changePct: 0.27,
    themes: ["US Mega Caps"],
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    region: "US",
    value: 189.3,
    changePct: 0.67,
    themes: ["US Mega Caps", "Hot Stocks"],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    region: "US",
    value: 875.0,
    changePct: 1.81,
    themes: ["US Mega Caps", "AI Companies", "Hot Stocks"],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp",
    region: "US",
    value: 412.8,
    changePct: 0.59,
    themes: ["US Mega Caps", "AI Companies"],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc",
    region: "US",
    value: 178.3,
    changePct: 0.74,
    themes: ["US Mega Caps", "AI Companies", "Hot Stocks"],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc",
    region: "US",
    value: 168.2,
    changePct: 0.51,
    themes: ["US Mega Caps", "AI Companies"],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc",
    region: "US",
    value: 189.1,
    changePct: -1.12,
    themes: ["US Mega Caps", "Hot Stocks"],
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    region: "US",
    value: 486.3,
    changePct: 0.64,
    themes: ["US Mega Caps", "AI Companies"],
  },
  {
    symbol: "DXY",
    name: "US Dollar Index",
    region: "Global",
    value: 103.4,
    changePct: -0.18,
    themes: ["Macro & Rates"],
  },
  {
    symbol: "UST10Y",
    name: "US 10Y Treasury Yield",
    region: "Global",
    value: 4.21,
    changePct: 0.05,
    themes: ["Macro & Rates"],
  },
  {
    symbol: "UST2Y",
    name: "US 2Y Treasury Yield",
    region: "Global",
    value: 4.58,
    changePct: 0.03,
    themes: ["Macro & Rates"],
  },
  {
    symbol: "GOLD",
    name: "Gold Spot",
    region: "Commodities",
    value: 2182.7,
    changePct: 0.44,
    themes: ["Commodities"],
  },
  {
    symbol: "BRENT",
    name: "Brent Crude",
    region: "Commodities",
    value: 82.16,
    changePct: -0.37,
    themes: ["Commodities"],
  },
  {
    symbol: "WTI",
    name: "WTI Crude",
    region: "Commodities",
    value: 78.42,
    changePct: -0.34,
    themes: ["Commodities"],
  },
];

const FX_FALLBACK = {
  PHP: 56.5,
  EUR: 0.92,
  JPY: 149.5,
  SGD: 1.34,
  HKD: 7.81,
};

const LIVE_MARKET_REFRESH_MS = 60 * 1000;

function formatUpdateTime(date: Date | null) {
  if (!date) return "Waiting for first feed update";
  const value = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
  return `${value} GMT+8`;
}

export default function MarketUpdates() {
  const {
    displayCurrency,
    formatDisplay,
    usdToPhp,
    fxRates,
    fxStatus,
    fxLastUpdated,
    cryptoPrices,
    previousCryptoPrices,
    cryptoLastUpdated,
    holdings,
  } = useDashboard();

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<RegionFilter>("All");
  const [theme, setTheme] = useState<ThemeFilter>("All");
  const [liveBoardQuotes, setLiveBoardQuotes] = useState<Record<string, MarketLiveQuote>>({});
  const [liveCoverage, setLiveCoverage] = useState({
    requested: MARKET_UNIVERSE.length,
    live: 0,
  });
  const [marketLastUpdated, setMarketLastUpdated] = useState<Date | null>(null);

  const marketBoardSymbols = useMemo(() => {
    return MARKET_UNIVERSE.map((row) => row.symbol);
  }, []);

  const refreshLiveBoardQuotes = useCallback(async () => {
    try {
      const response = await apiFetch(
        `/api/v1/market/quotes?symbols=${encodeURIComponent(marketBoardSymbols.join(","))}`
      );

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as MarketLiveQuoteResponse;
      const incomingQuotes = payload.quotes && typeof payload.quotes === "object" ? payload.quotes : {};
      const sanitized: Record<string, MarketLiveQuote> = {};

      for (const [symbol, quote] of Object.entries(incomingQuotes)) {
        if (!quote || typeof quote !== "object") continue;
        const price = Number(quote.price);
        const changePct = Number(quote.changePct);
        if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(changePct)) continue;

        sanitized[symbol.toUpperCase()] = {
          symbol: symbol.toUpperCase(),
          price,
          changePct,
          provider: typeof quote.provider === "string" ? quote.provider : "unknown",
          asOf: typeof quote.asOf === "string" ? quote.asOf : null,
        };
      }

      setLiveBoardQuotes(sanitized);
      setLiveCoverage({
        requested:
          typeof payload.coverage?.requested === "number"
            ? payload.coverage.requested
            : marketBoardSymbols.length,
        live:
          typeof payload.coverage?.live === "number"
            ? payload.coverage.live
            : Object.keys(sanitized).length,
      });

      const fetchedAt = payload.fetchedAt ? new Date(payload.fetchedAt) : new Date();
      setMarketLastUpdated(Number.isNaN(fetchedAt.getTime()) ? new Date() : fetchedAt);
    } catch {
      // Keep last successful snapshot if provider is temporarily unavailable.
    }
  }, [marketBoardSymbols]);

  useEffect(() => {
    refreshLiveBoardQuotes();
    const intervalId = window.setInterval(refreshLiveBoardQuotes, LIVE_MARKET_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, [refreshLiveBoardQuotes]);

  const fxBoard = useMemo(() => {
    const rates = fxRates ?? FX_FALLBACK;
    return [
      { pair: "USD/PHP", value: rates.PHP },
      { pair: "EUR/PHP", value: rates.PHP / rates.EUR },
      { pair: "JPY/PHP", value: rates.PHP / rates.JPY },
      { pair: "SGD/PHP", value: rates.PHP / rates.SGD },
      { pair: "HKD/PHP", value: rates.PHP / rates.HKD },
      { pair: "PHP/USD", value: 1 / rates.PHP },
      { pair: "USD/SGD", value: rates.SGD },
      { pair: "USD/HKD", value: rates.HKD },
    ];
  }, [fxRates]);

  const cryptoTape = useMemo(() => {
    const usdToSgd = fxRates?.SGD ?? FX_FALLBACK.SGD;
    return TRACKED_CRYPTO_TICKERS.map((ticker) => {
      const usdPrice = cryptoPrices[ticker];
      const previous = previousCryptoPrices[ticker];
      const changePct =
        typeof usdPrice === "number" && typeof previous === "number" && previous > 0
          ? ((usdPrice - previous) / previous) * 100
          : 0;
      const displayPrice =
        typeof usdPrice === "number"
          ? displayCurrency === "PHP"
            ? usdPrice * usdToPhp
            : displayCurrency === "SGD"
              ? usdPrice * usdToSgd
              : usdPrice
          : null;

      return {
        ticker,
        name: CRYPTO_NAME_BY_TICKER[ticker] || ticker,
        displayPrice,
        changePct,
        hasLive: typeof usdPrice === "number",
      };
    });
  }, [cryptoPrices, previousCryptoPrices, displayCurrency, fxRates?.SGD, usdToPhp]);

  const sortedCryptoTape = useMemo(() => {
    return [...cryptoTape].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
  }, [cryptoTape]);

  const cryptoMarketRows = useMemo<MarketInstrument[]>(() => {
    return sortedCryptoTape
      .filter((row) => row.hasLive && typeof row.displayPrice === "number")
      .map((row) => ({
        symbol: row.ticker,
        name: row.name,
        region: "Global",
        value: row.displayPrice as number,
        changePct: row.changePct,
        themes: row.changePct >= 0 ? ["Crypto", "Hot Stocks"] : ["Crypto"],
      }));
  }, [sortedCryptoTape]);

  const liveAdjustedUniverse = useMemo(() => {
    return MARKET_UNIVERSE.map((row) => {
      const live = liveBoardQuotes[row.symbol];
      if (!live) return row;

      return {
        ...row,
        value: live.price,
        changePct: live.changePct,
      };
    });
  }, [liveBoardQuotes]);

  const boardUniverse = useMemo(() => {
    return [...liveAdjustedUniverse, ...cryptoMarketRows];
  }, [cryptoMarketRows, liveAdjustedUniverse]);

  const filteredUniverse = useMemo(() => {
    const query = search.trim().toLowerCase();
    return boardUniverse.filter((item) => {
      const regionPass = region === "All" || item.region === region;
      const themePass = theme === "All" || item.themes.includes(theme);
      const queryPass =
        query.length === 0 ||
        item.symbol.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query);
      return regionPass && themePass && queryPass;
    });
  }, [boardUniverse, search, region, theme]);

  const visibleCryptoTape = useMemo(() => {
    if (theme === "Crypto") {
      return sortedCryptoTape;
    }
    if (theme === "Hot Stocks") {
      return sortedCryptoTape.filter((row) => row.hasLive).slice(0, 5);
    }
    return sortedCryptoTape;
  }, [sortedCryptoTape, theme]);

  const spotlightGroups = useMemo<SpotlightGroup[]>(() => {
    const hotRows = [...boardUniverse]
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 4)
      .map((row) => ({
        symbol: row.symbol,
        name: row.name,
        changePct: row.changePct,
      }));

    const aiRows = liveAdjustedUniverse.filter((row) => row.themes.includes("AI Companies"))
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 4)
      .map((row) => ({
        symbol: row.symbol,
        name: row.name,
        changePct: row.changePct,
      }));

    const cryptoRows = sortedCryptoTape
      .filter((row) => row.hasLive)
      .slice(0, 4)
      .map((row) => ({
        symbol: row.ticker,
        name: row.name,
        changePct: row.changePct,
      }));

    const macroRows = liveAdjustedUniverse.filter(
      (row) => row.themes.includes("Macro & Rates") || row.themes.includes("Commodities")
    )
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
      .slice(0, 4)
      .map((row) => ({
        symbol: row.symbol,
        name: row.name,
        changePct: row.changePct,
      }));

    return [
      { title: "Hot Stocks", accentClass: "text-accent-primary", rows: hotRows },
      { title: "AI Companies", accentClass: "text-accent-secondary", rows: aiRows },
      { title: "Crypto Movers", accentClass: "text-accent-warning", rows: cryptoRows },
      { title: "Macro + Commodities", accentClass: "text-text-primary", rows: macroRows },
    ];
  }, [boardUniverse, liveAdjustedUniverse, sortedCryptoTape]);

  const topMovers = useMemo(() => {
    const source = filteredUniverse.length > 0 ? filteredUniverse : boardUniverse;
    const sorted = [...source].sort(
      (a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)
    );
    return sorted.slice(0, 5);
  }, [boardUniverse, filteredUniverse]);

  const holdingsLinked = useMemo(() => {
    const allSymbols = new Set([
      ...boardUniverse.map((row) => row.symbol),
      ...TRACKED_CRYPTO_TICKERS,
    ]);
    return holdings.filter((holding) => allSymbols.has(holding.ticker)).length;
  }, [boardUniverse, holdings]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
          Market Updates
        </span>
        <h1 className="font-display text-[2.25rem] font-bold text-text-primary">Full Market Explorer</h1>
        <p className="font-body text-sm text-text-muted">
          Live crypto and FX feeds, plus expanded market boards for quick exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-panel rounded-[16px] p-5">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">FX Feed</p>
          <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            $1 = {displayCurrency === "PHP"
              ? `₱${(fxRates?.PHP ?? FX_FALLBACK.PHP).toFixed(2)}`
              : displayCurrency === "SGD"
                ? `S$${(fxRates?.SGD ?? FX_FALLBACK.SGD).toFixed(2)}`
                : `$${(1).toFixed(2)}`}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted">
            <span className={cn("inline-block h-2 w-2 rounded-full", fxStatus === "fresh" ? "bg-accent-primary pulse-dot" : "bg-accent-warning")} />
            {fxStatus === "fresh" ? "live" : "stale"} · {formatUpdateTime(fxLastUpdated)}
          </p>
        </div>

        <div className="glass-panel rounded-[16px] p-5">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">Crypto Feed</p>
          <p className="mt-2 text-2xl font-bold text-accent-warning tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {cryptoTape.filter((row) => row.hasLive).length}/{TRACKED_CRYPTO_TICKERS.length} LIVE
          </p>
          <p className="mt-1 text-xs text-text-muted">Updated {formatUpdateTime(cryptoLastUpdated)}</p>
        </div>

        <div className="glass-panel rounded-[16px] p-5">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">Market Universe</p>
          <p className="mt-2 text-2xl font-bold text-accent-secondary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {MARKET_UNIVERSE.length + TRACKED_CRYPTO_TICKERS.length} symbols
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {liveCoverage.live}/{liveCoverage.requested} live board quotes · {formatUpdateTime(marketLastUpdated)}
          </p>
        </div>

        <div className="glass-panel rounded-[16px] p-5">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">Portfolio Linked</p>
          <p className="mt-2 text-2xl font-bold text-accent-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {holdingsLinked} tracked
          </p>
          <p className="mt-1 text-xs text-text-muted">Holdings mapped to market board</p>
        </div>
      </div>

      <section className="glass-panel rounded-[16px] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-text-primary">Category Radar</h2>
          <p className="text-xs text-text-muted">Hot Stocks, Crypto, AI Companies, and macro watchlists</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {spotlightGroups.map((group) => (
            <div key={group.title} className="rounded-[12px] border border-glass-border bg-bg-surface p-3">
              <p className={cn("text-xs font-semibold uppercase tracking-[0.08em]", group.accentClass)}>
                {group.title}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {group.rows.map((row) => {
                  const up = row.changePct >= 0;
                  return (
                    <div key={`${group.title}-${row.symbol}`} className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-text-primary">{row.symbol}</p>
                        <p className="text-xs text-text-muted">{row.name}</p>
                      </div>
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          up ? "text-accent-primary" : "text-accent-danger"
                        )}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {up ? "▲" : "▼"} {Math.abs(row.changePct).toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section className="glass-panel rounded-[16px] p-5 xl:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-text-primary">Market Board</h2>
              <p className="text-xs text-text-muted">
                Live updates every 60s where provider coverage is available.
              </p>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="flex h-9 items-center gap-2 rounded-full border border-glass-border bg-bg-surface px-3 md:w-[260px]">
                <Search size={14} className="text-text-muted" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search symbol or name"
                  className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {REGION_FILTERS.map((item) => (
              <button
                key={item}
                onClick={() => setRegion(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  region === item
                    ? "border-accent-primary bg-accent-subtle text-accent-primary"
                    : "border-glass-border text-text-muted hover:text-text-primary"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {THEME_FILTERS.map((item) => (
              <button
                key={item}
                onClick={() => setTheme(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  theme === item
                    ? "border-accent-warning bg-accent-subtle text-accent-warning"
                    : "border-glass-border text-text-muted hover:text-text-primary"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="px-2 py-3 text-left text-xs text-text-muted">Symbol</th>
                  <th className="px-2 py-3 text-left text-xs text-text-muted">Name</th>
                  <th className="px-2 py-3 text-left text-xs text-text-muted">Region</th>
                  <th className="px-2 py-3 text-left text-xs text-text-muted">Themes</th>
                  <th className="px-2 py-3 text-right text-xs text-text-muted">Last</th>
                  <th className="px-2 py-3 text-right text-xs text-text-muted">Change</th>
                </tr>
              </thead>
              <tbody>
                {filteredUniverse.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-6 text-center text-sm text-text-muted">
                      No symbols match this region/category filter.
                    </td>
                  </tr>
                ) : (
                  filteredUniverse.map((row) => {
                    const up = row.changePct >= 0;
                    return (
                      <tr key={row.symbol} className="border-b border-glass-border/70 hover:bg-white/[0.03]">
                        <td className="px-2 py-3 text-sm text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {row.symbol}
                        </td>
                        <td className="px-2 py-3 text-sm text-text-secondary">{row.name}</td>
                        <td className="px-2 py-3 text-xs text-text-muted">{row.region}</td>
                        <td className="px-2 py-3 text-xs text-text-muted">{row.themes.join(" · ")}</td>
                        <td className="px-2 py-3 text-right text-sm text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {row.value.toLocaleString("en-US", {
                            minimumFractionDigits: row.value > 100 ? 2 : 3,
                            maximumFractionDigits: row.value > 100 ? 2 : 3,
                          })}
                        </td>
                        <td className={cn("px-2 py-3 text-right text-sm tabular-nums", up ? "text-accent-primary" : "text-accent-danger")} style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {up ? <ArrowUpRight size={13} className="inline mr-0.5" /> : <ArrowDownRight size={13} className="inline mr-0.5" />}
                          {Math.abs(row.changePct).toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-panel rounded-[16px] p-5 xl:col-span-4">
          <h2 className="mb-2 font-display text-lg font-bold text-text-primary">Live Crypto Tape</h2>
          <p className="mb-4 text-xs text-text-muted">
            {theme === "Crypto" ? "Crypto category mode" : "Always-on crypto stream"}
          </p>
          <div className="flex flex-col gap-3">
            {visibleCryptoTape.map((row) => {
              const up = row.changePct >= 0;
              return (
                <div key={row.ticker} className="rounded-[12px] border border-glass-border bg-bg-surface p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-primary">{row.name}</p>
                      <p className="text-xs text-text-muted tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {row.ticker}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-subtle px-2 py-[2px] text-[10px] font-semibold text-accent-primary">
                      <Activity size={10} /> LIVE
                    </span>
                  </div>

                  <p className="mt-2 text-base font-semibold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {typeof row.displayPrice === "number" ? formatDisplay(row.displayPrice) : "Waiting..."}
                  </p>

                  <p className={cn("mt-1 text-xs tabular-nums", up ? "text-accent-primary" : "text-accent-danger")} style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {up ? "▲" : "▼"} {Math.abs(row.changePct).toFixed(2)}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section className="glass-panel rounded-[16px] p-5 xl:col-span-6">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">FX Cross Matrix</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {fxBoard.map((row) => (
              <div key={row.pair} className="flex items-center justify-between rounded-[10px] border border-glass-border bg-bg-surface px-3 py-2">
                <span className="text-xs text-text-muted tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {row.pair}
                </span>
                <span className="text-sm text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {row.value.toFixed(row.value > 10 ? 4 : 6)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel rounded-[16px] p-5 xl:col-span-6">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
            {theme === "All" ? "Top Movers Snapshot" : `${theme} Movers`}
          </h2>
          <div className="flex flex-col gap-2">
            {topMovers.map((row) => {
              const up = row.changePct >= 0;
              return (
                <div key={row.symbol} className="flex items-center justify-between rounded-[10px] border border-glass-border bg-bg-surface px-3 py-2">
                  <div>
                    <p className="text-sm text-text-primary">{row.symbol}</p>
                    <p className="text-xs text-text-muted">{row.name}</p>
                  </div>
                  <span className={cn("text-sm tabular-nums", up ? "text-accent-primary" : "text-accent-danger")} style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {up ? "▲" : "▼"} {Math.abs(row.changePct).toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
