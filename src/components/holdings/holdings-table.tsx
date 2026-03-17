import { useState, useMemo, useEffect, useRef } from "react";
import { useDashboard, type Holding } from "@/src/pages/DashboardLayout";
import { cn } from "@/src/lib/utils";
import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  "PH Stocks": "#6EE7B7",
  "US Stocks": "#818CF8",
  Crypto: "#FBB040",
  Cash: "#6EA8FE",
  Bonds: "#F9A8D4",
  "Tangible Assets": "#F97316",
};

const FILTER_OPTIONS = [
  "All",
  "PH Stocks",
  "US Stocks",
  "Crypto",
  "Cash",
  "Bonds",
  "Tangible Assets",
] as const;

type SortKey = "name" | "type" | "marketValue" | "pnl";
type SortDir = "asc" | "desc";

export function HoldingsTable() {
  const {
    holdings,
    cryptoPrices,
    getCurrentPrice,
    getDisplayPrice,
    getMarketValue,
    getPnlPercent,
    getPnlAbsolute,
    formatDisplay,
    toDisplay,
  } = useDashboard();

  const [filter, setFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("marketValue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [flashMap, setFlashMap] = useState<Record<string, "green" | "red" | null>>({});

  // Track price flashes for crypto
  const prevCryptoRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const prev = prevCryptoRef.current;
    const newFlashes: Record<string, "green" | "red" | null> = {};
    let hasFlash = false;

    for (const [ticker, price] of Object.entries(cryptoPrices)) {
      const oldPrice = prev[ticker];
      if (oldPrice != null && oldPrice !== price) {
        newFlashes[ticker] = price > oldPrice ? "green" : "red";
        hasFlash = true;
      }
    }

    prevCryptoRef.current = { ...cryptoPrices };

    if (hasFlash) {
      setFlashMap(newFlashes);
      const timer = setTimeout(() => setFlashMap({}), 1500);
      return () => clearTimeout(timer);
    }
  }, [cryptoPrices]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...holdings];

    if (filter !== "All") {
      list = list.filter((h) => h.type === filter);
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "marketValue":
          cmp = getMarketValue(a) - getMarketValue(b);
          break;
        case "pnl":
          cmp = getPnlPercent(a) - getPnlPercent(b);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [holdings, filter, sortKey, sortDir, getMarketValue, getPnlPercent]);

  function SortHeader({
    label,
    keyName,
    align = "left",
  }: {
    label: string;
    keyName: SortKey;
    align?: "left" | "right";
  }) {
    const active = sortKey === keyName;
    return (
      <th
        className={cn(
          "h-10 cursor-pointer select-none px-3 text-xs font-medium uppercase tracking-wide text-text-muted transition-colors hover:text-text-primary",
          align === "right" ? "text-right" : "text-left"
        )}
        onClick={() => handleSort(keyName)}
      >
        <span className={cn("inline-flex items-center gap-1", align === "right" && "justify-end")}>
          {label}
          {active && (
            <span className="text-accent-primary">
              {sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </span>
          )}
        </span>
      </th>
    );
  }

  return (
    <div
      className="card-fade-in rounded-[12px] border"
      style={{
        backgroundColor: "#111113",
        borderColor: "rgba(255,255,255,0.07)",
        animationDelay: "150ms",
      }}
    >
      {/* Header + Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-3">
        <h3
          className="text-sm font-semibold text-text-primary"
          style={{ fontFamily: "TT Bakers, serif" }}
        >
          Holdings
        </h3>
        <div className="flex gap-1.5">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium transition-all duration-200",
                filter === opt
                  ? "text-[#09090B]"
                  : "text-text-muted hover:bg-[rgba(255,255,255,0.06)] hover:text-text-primary"
              )}
              style={
                filter === opt
                  ? {
                      backgroundColor:
                        opt === "All" ? "#6EE7B7" : TYPE_COLORS[opt] || "#6EE7B7",
                    }
                  : {}
              }
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <SortHeader label="Asset" keyName="name" />
              <SortHeader label="Type" keyName="type" />
              <th className="h-10 px-3 text-right text-xs font-medium uppercase tracking-wide text-text-muted">
                Qty
              </th>
              <th className="h-10 px-3 text-right text-xs font-medium uppercase tracking-wide text-text-muted">
                Avg Cost
              </th>
              <th className="h-10 px-3 text-right text-xs font-medium uppercase tracking-wide text-text-muted">
                Price
              </th>
              <SortHeader label="Market Value" keyName="marketValue" align="right" />
              <SortHeader label="P&L" keyName="pnl" align="right" />
              <th className="h-10 px-3 text-center text-xs font-medium uppercase tracking-wide text-text-muted">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((holding, index) => {
              const pnlPct = getPnlPercent(holding);
              const pnlAbs = getPnlAbsolute(holding);
              const isLive = holding.type === "Crypto" && holding.manualPrice === null;
              const flash = flashMap[holding.ticker];

              return (
                <tr
                  key={`${holding.ticker}-${index}`}
                  className="border-b transition-colors duration-200 hover:bg-[rgba(255,255,255,0.03)]"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                >
                  {/* Asset */}
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-primary">
                        {holding.name}
                      </span>
                      <span
                        className="text-xs text-text-muted"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {holding.ticker}
                      </span>
                    </div>
                  </td>

                  {/* Type badge */}
                  <td className="px-3 py-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: (TYPE_COLORS[holding.type] || "#71717A") + "18",
                        color: TYPE_COLORS[holding.type] || "#71717A",
                      }}
                    >
                      {holding.type}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td
                    className="px-3 py-3 text-right text-sm text-text-secondary tabular-nums"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {holding.qty < 1 ? holding.qty.toFixed(4) : holding.qty.toLocaleString()}
                  </td>

                  {/* Avg Cost */}
                  <td
                    className="px-3 py-3 text-right text-sm text-text-secondary tabular-nums"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {formatDisplay(toDisplay(holding.avgCost, holding.currency))}
                  </td>

                  {/* Current Price — flash on crypto change */}
                  <td
                    className={cn(
                      "px-3 py-3 text-right text-sm text-text-primary tabular-nums",
                      flash === "green" && "flash-green",
                      flash === "red" && "flash-red"
                    )}
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {formatDisplay(getDisplayPrice(holding))}
                  </td>

                  {/* Market Value */}
                  <td
                    className="px-3 py-3 text-right text-sm font-medium text-text-primary tabular-nums"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {formatDisplay(getMarketValue(holding))}
                  </td>

                  {/* P&L */}
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end">
                      <span
                        className={cn(
                          "flex items-center gap-0.5 text-sm font-medium tabular-nums",
                          pnlPct >= 0 ? "text-accent-primary" : "text-accent-danger"
                        )}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {pnlPct >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {Math.abs(pnlPct).toFixed(2)}%
                      </span>
                      <span
                        className={cn(
                          "text-[11px] tabular-nums",
                          pnlAbs >= 0 ? "text-[rgba(110,231,183,0.6)]" : "text-[rgba(248,113,113,0.6)]"
                        )}
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {pnlAbs >= 0 ? "+" : ""}
                        {formatDisplay(pnlAbs)}
                      </span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-3 py-3 text-center">
                    {isLive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(110,231,183,0.12)] px-2 py-0.5 text-[10px] font-semibold text-accent-primary">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-primary pulse-dot" />
                        LIVE
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[10px] font-medium text-text-muted">
                        MANUAL
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-text-muted">
                  No holdings match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
