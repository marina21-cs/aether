import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, BarChart3, Wallet } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useDashboard, type Holding } from "./DashboardLayout";
import { TRACKED_CRYPTO_TICKERS } from "@/src/lib/market-universe";
import {
  ContextualLiteracyPanel,
  GlossaryTerm,
} from "@/creation/feature/phase_1_contextual_literacy/index.ts";
import { ActionableInsightsPanel } from "@/creation/feature/phase_3_actionable_insights";

const TYPE_COLORS: Record<Holding["type"], string> = {
  "PH Stocks": "#6EE7B7",
  "US Stocks": "#818CF8",
  Crypto: "#FBB040",
  Cash: "#6EA8FE",
  Bonds: "#F9A8D4",
  "Tangible Assets": "#F97316",
};

function formatUpdateTime(date: Date | null) {
  if (!date) return "waiting for first update";
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function DashboardPage() {
  const {
    holdings,
    formatDisplay,
    getMarketValue,
    getPnlPercent,
    getPnlAbsolute,
    getTotalPortfolio,
    previousCryptoPrices,
    cryptoPrices,
    fxStatus,
    fxLastUpdated,
    cryptoLastUpdated,
    fxRates,
  } = useDashboard();

  const rows = useMemo(() => {
    return holdings.map((holding) => {
      const marketValue = getMarketValue(holding);
      const pnlPercent = getPnlPercent(holding);
      const pnlAbsolute = getPnlAbsolute(holding);

      return {
        ...holding,
        marketValue,
        pnlPercent,
        pnlAbsolute,
      };
    });
  }, [holdings, getMarketValue, getPnlPercent, getPnlAbsolute]);

  const allocation = useMemo(() => {
    const totals: Record<Holding["type"], number> = {
      "PH Stocks": 0,
      "US Stocks": 0,
      Crypto: 0,
      Cash: 0,
      Bonds: 0,
      "Tangible Assets": 0,
    };

    rows.forEach((row) => {
      totals[row.type] += row.marketValue;
    });

    const totalValue = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return (Object.keys(totals) as Holding["type"][]).map((type) => ({
      type,
      value: totals[type],
      percent: totalValue > 0 ? (totals[type] / totalValue) * 100 : 0,
    }));
  }, [rows]);

  const totalPnl = useMemo(() => rows.reduce((sum, row) => sum + row.pnlAbsolute, 0), [rows]);

  const liveCryptoCount = useMemo(
    () =>
      TRACKED_CRYPTO_TICKERS.filter(
        (ticker) => typeof cryptoPrices[ticker] === "number"
      ).length,
    [cryptoPrices]
  );

  const topLiveMover = useMemo(() => {
    const movers = TRACKED_CRYPTO_TICKERS
      .map((ticker) => {
        const now = cryptoPrices[ticker];
        const prev = previousCryptoPrices[ticker];
        if (!(typeof now === "number" && typeof prev === "number" && prev > 0)) {
          return null;
        }

        return {
          ticker,
          changePct: ((now - prev) / prev) * 100,
        };
      })
      .filter((item): item is { ticker: string; changePct: number } => item !== null);

    if (movers.length === 0) return null;

    return movers.sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))[0];
  }, [cryptoPrices, previousCryptoPrices]);

  const manualPricedCount = useMemo(
    () => rows.filter((row) => !(row.type === "Crypto" && typeof cryptoPrices[row.ticker] === "number")).length,
    [rows, cryptoPrices]
  );

  const topHoldings = useMemo(
    () => [...rows].sort((a, b) => b.marketValue - a.marketValue).slice(0, 6),
    [rows]
  );

  const bestPerformer = useMemo(() => {
    if (rows.length === 0) return null;
    return [...rows].sort((a, b) => b.pnlPercent - a.pnlPercent)[0];
  }, [rows]);

  const worstPerformer = useMemo(() => {
    if (rows.length === 0) return null;
    return [...rows].sort((a, b) => a.pnlPercent - b.pnlPercent)[0];
  }, [rows]);

  const totalPortfolioValue = useMemo(() => getTotalPortfolio(), [getTotalPortfolio]);

  const liveCoveragePct = useMemo(() => {
    if (rows.length === 0) return 0;
    return ((rows.length - manualPricedCount) / rows.length) * 100;
  }, [rows.length, manualPricedCount]);

  const topAllocationPct = useMemo(() => {
    if (allocation.length === 0) return 0;
    return allocation.reduce((maxPercent, bucket) => Math.max(maxPercent, bucket.percent), 0);
  }, [allocation]);

  const cashAllocationPct = useMemo(
    () => allocation.find((bucket) => bucket.type === "Cash")?.percent ?? 0,
    [allocation]
  );

  const hasCryptoExposure = useMemo(
    () => rows.some((row) => row.type === "Crypto" && row.marketValue > 0),
    [rows]
  );

  const inflationDragEstimate = useMemo(
    () => totalPortfolioValue * 0.042,
    [totalPortfolioValue]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
          Dashboard
        </span>
        <h1 className="font-display text-[2.25rem] font-bold text-text-primary">Portfolio Overview</h1>
        <p className="font-body text-sm text-text-muted">
          Simplified summary with live market pulse and top positions. Track{" "}
          <GlossaryTerm term="asset allocation" /> and protect against{" "}
          <GlossaryTerm term="inflation drag" />.
        </p>
      </div>

      <ContextualLiteracyPanel
        context="dashboard"
        signals={{
          totalPortfolioValue,
          holdingsCount: rows.length,
          liveCoveragePct,
          topAllocationPct,
          dailyPnl: totalPnl,
        }}
        metricLabel="Estimated yearly inflation drag"
        metricValue={formatDisplay(inflationDragEstimate)}
        metricExplanation="If your portfolio grows slower than inflation, this is the rough buying-power loss over one year."
      />

      <ActionableInsightsPanel
        signals={{
          totalPortfolioValue,
          holdingsCount: rows.length,
          topAllocationPct,
          cashAllocationPct,
          liveCoveragePct,
          manualPricedCount,
          dailyPnl: totalPnl,
          bestPerformerPct: bestPerformer?.pnlPercent,
          worstPerformerPct: worstPerformer?.pnlPercent,
          hasCryptoExposure,
        }}
      />

      <section className="glass-panel card-fade-in rounded-[16px] p-5" style={{ animationDelay: "40ms" }}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-text-primary">Important Live Updates</h2>
          <Link
            to="/dashboard/market"
            className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
          >
            Open Full Market Updates
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-[12px] border border-glass-border bg-bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-text-muted">FX Pulse</p>
            <p className="mt-1 text-base font-semibold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              USD/PHP {((fxRates?.PHP ?? 56.5)).toFixed(2)}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted">
              <span className={cn("inline-block h-2 w-2 rounded-full", fxStatus === "fresh" ? "bg-accent-primary pulse-dot" : "bg-accent-warning")} />
              {fxStatus === "fresh" ? "live" : "stale"} • {formatUpdateTime(fxLastUpdated)}
            </p>
          </div>

          <div className="rounded-[12px] border border-glass-border bg-bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Crypto Pulse</p>
            <p className="mt-1 text-base font-semibold text-accent-warning tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {liveCryptoCount}/{TRACKED_CRYPTO_TICKERS.length} live • {formatUpdateTime(cryptoLastUpdated)}
            </p>
            <p className="mt-1 text-xs text-text-muted tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {topLiveMover ? (
                <>
                  {topLiveMover.changePct >= 0 ? "Top gain" : "Top drop"} {topLiveMover.ticker} {topLiveMover.changePct >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(topLiveMover.changePct).toFixed(2)}%
                </>
              ) : (
                "No active crypto ticks yet"
              )}
            </p>
          </div>

          <div className="rounded-[12px] border border-glass-border bg-bg-surface p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Pricing Coverage</p>
            <p className="mt-1 text-base font-semibold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              {rows.length - manualPricedCount}/{rows.length || 0} live priced
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted">
              <Activity size={12} className="text-accent-primary" />
              Manual priced holdings: {manualPricedCount}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="glass-panel card-fade-in rounded-[16px] p-5" style={{ animationDelay: "80ms" }}>
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">Total Portfolio</p>
          <p className="mt-2 text-right text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {formatDisplay(totalPortfolioValue)}
          </p>
        </div>

        <div className="glass-panel card-fade-in rounded-[16px] p-5" style={{ animationDelay: "120ms" }}>
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">Today's P&L</p>
          <p className={cn("mt-2 text-right text-2xl font-bold tabular-nums", totalPnl >= 0 ? "text-accent-primary" : "text-accent-danger")} style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {totalPnl >= 0 ? "▲" : "▼"} {formatDisplay(Math.abs(totalPnl))}
          </p>
        </div>

        <div className="glass-panel card-fade-in rounded-[16px] p-5" style={{ animationDelay: "160ms" }}>
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted">Best Performer</p>
          <p className="mt-2 text-right text-2xl font-bold text-accent-secondary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {bestPerformer ? `▲ ${bestPerformer.pnlPercent.toFixed(2)}%` : "-"}
          </p>
          <p className="mt-1 text-right text-xs text-text-muted">{bestPerformer ? bestPerformer.ticker : "No holdings yet"}</p>
        </div>

        <div className="glass-panel card-fade-in rounded-[16px] p-5" style={{ animationDelay: "200ms" }}>
          <p className="font-body text-xs uppercase tracking-[0.08em] text-text-muted"># Holdings</p>
          <p className="mt-2 text-right text-2xl font-bold text-accent-warning tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {rows.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <section className="glass-panel card-fade-in rounded-[16px] p-5 xl:col-span-5" style={{ animationDelay: "240ms" }}>
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Asset Mix</h2>
          <div className="flex flex-col gap-3">
            {allocation
              .filter((item) => item.value > 0)
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <div key={item.type}>
                  <div className="mb-1 flex items-center justify-between text-xs text-text-muted">
                    <div className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[item.type] }} />
                      <span>{item.type}</span>
                    </div>
                    <span
                      className="tabular-nums text-text-primary"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {item.percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(item.percent, 2)}%`, backgroundColor: TYPE_COLORS[item.type] }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="glass-panel card-fade-in rounded-[16px] p-5 xl:col-span-7" style={{ animationDelay: "280ms" }}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-text-primary">Top Holdings</h2>
            <Link
              to="/dashboard/holdings"
              className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
            >
              Open Full Holdings
              <ArrowRight size={14} />
            </Link>
          </div>

          {topHoldings.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-glass-border bg-bg-surface p-8 text-center text-sm text-text-muted">
              No holdings loaded yet. Add data in Data Import.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse">
                <thead>
                  <tr className="border-b border-glass-border text-xs uppercase tracking-[0.08em] text-text-muted">
                    <th className="px-2 py-3 text-left">Asset</th>
                    <th className="px-2 py-3 text-left">Type</th>
                    <th className="px-2 py-3 text-right">Market Value</th>
                    <th className="px-2 py-3 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {topHoldings.map((row) => {
                    const pnlUp = row.pnlPercent >= 0;
                    return (
                      <tr key={`${row.ticker}-${row.name}`} className="border-b border-glass-border/70 hover:bg-white/[0.03]">
                        <td className="px-2 py-3">
                          <p className="text-sm text-text-primary">{row.name}</p>
                          <p
                            className="text-xs text-text-muted tabular-nums"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                          >
                            {row.ticker}
                          </p>
                        </td>
                        <td className="px-2 py-3 text-xs text-text-muted">{row.type}</td>
                        <td
                          className="px-2 py-3 text-right text-sm text-text-primary tabular-nums"
                          style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                          {formatDisplay(row.marketValue)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          <p
                            className={cn("text-sm font-semibold tabular-nums", pnlUp ? "text-accent-primary" : "text-accent-danger")}
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                          >
                            {pnlUp ? "▲" : "▼"} {Math.abs(row.pnlPercent).toFixed(2)}%
                          </p>
                          <p
                            className="mt-0.5 text-xs text-text-muted tabular-nums"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                          >
                            {formatDisplay(row.pnlAbsolute)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="flex flex-wrap items-center gap-2">
        <Link
          to="/dashboard/holdings"
          className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
        >
          <Wallet size={13} />
          Manage Holdings
        </Link>
        <Link
          to="/dashboard/performance"
          className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
        >
          <BarChart3 size={13} />
          View Performance
        </Link>
      </section>
    </div>
  );
}
