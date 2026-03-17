import { useMemo, useState } from "react";
import { Download, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "./DashboardLayout";
import { buildPerformanceSeries } from "@/src/lib/calculations/performance";
import { formatCurrency } from "@/src/lib/utils";

type RangeKey = "1M" | "3M" | "6M" | "1Y" | "3Y" | "ALL";

const RANGE_POINTS: Record<RangeKey, number> = {
  "1M": 2,
  "3M": 4,
  "6M": 7,
  "1Y": 12,
  "3Y": 12,
  ALL: 12,
};

export function Performance() {
  const { getTotalPortfolio } = useDashboard();
  const [range, setRange] = useState<RangeKey>("1Y");
  const [showBtc, setShowBtc] = useState(false);

  const currentValue = getTotalPortfolio();

  const series = useMemo(() => buildPerformanceSeries(currentValue), [currentValue]);

  const chartData = useMemo(() => {
    const keep = RANGE_POINTS[range];
    return series.slice(Math.max(series.length - keep, 0));
  }, [series, range]);

  const summary = useMemo(() => {
    if (chartData.length < 2) {
      return {
        portfolioReturn: 0,
        pseiReturn: 0,
        btcReturn: 0,
      };
    }

    const first = chartData[0];
    const last = chartData[chartData.length - 1];

    const returnPct = (end: number, start: number) => {
      if (start <= 0) return 0;
      return ((end - start) / start) * 100;
    };

    return {
      portfolioReturn: returnPct(last.portfolio, first.portfolio),
      pseiReturn: returnPct(last.psei, first.psei),
      btcReturn: returnPct(last.btc, first.btc),
    };
  }, [chartData]);

  const csvRows = useMemo(() => {
    return [
      ["label", "portfolio", "psei", "btc"],
      ...chartData.map((row) => [
        row.label,
        row.portfolio.toFixed(2),
        row.psei.toFixed(2),
        row.btc.toFixed(2),
      ]),
    ];
  }, [chartData]);

  const downloadCsv = () => {
    const csv = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `aether-performance-${range.toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Performance History</h1>
          <p className="text-sm text-text-secondary">
            Portfolio trend with required PSEi benchmark baseline and optional BTC comparison.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-glass-border bg-glass-bg px-4 py-2 text-sm text-text-primary hover:bg-white/5"
        >
          <Download className="h-4 w-4" /> Download CSV
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Portfolio Return</p>
          <p className="mt-2 text-2xl font-bold text-accent-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {summary.portfolioReturn >= 0 ? "+" : ""}
            {summary.portfolioReturn.toFixed(2)}%
          </p>
          <p className="mt-1 text-[11px] text-text-muted">Range: {range}</p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Vs PSEi</p>
          <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {(summary.portfolioReturn - summary.pseiReturn >= 0 ? "+" : "") +
              (summary.portfolioReturn - summary.pseiReturn).toFixed(2)}%
          </p>
          <p className="mt-1 text-[11px] text-text-muted">PSEi always-on reference line</p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Current Value</p>
          <p className="mt-2 text-2xl font-bold text-accent-success tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {formatCurrency(currentValue)}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">Synthetic MVP timeline from current snapshot</p>
        </article>
      </section>

      <section className="glass-panel rounded-2xl border border-glass-border p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-text-primary">Net Worth Trajectory</h2>

          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-glass-border bg-bg-dark/50 p-1">
              {(["1M", "3M", "6M", "1Y", "3Y", "ALL"] as RangeKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRange(key)}
                  className={`rounded-md px-3 py-1 text-xs transition-colors ${
                    range === key
                      ? "bg-glass-bg text-white border border-glass-border"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowBtc((prev) => !prev)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                showBtc
                  ? "border-accent-warning/50 bg-accent-warning/10 text-accent-warning"
                  : "border-glass-border bg-bg-surface text-text-secondary"
              }`}
            >
              {showBtc ? "BTC On" : "BTC Off"}
            </button>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="var(--color-text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₱${(Number(value) / 1_000_000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-glass-border)",
                  borderRadius: "8px",
                }}
                formatter={(value: unknown, name: unknown) => {
                  const numeric = typeof value === "number" ? value : Number(value);
                  return [
                    formatCurrency(Number.isFinite(numeric) ? numeric : 0),
                    String(name || "Value"),
                  ];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="portfolio"
                stroke="var(--color-accent-primary)"
                strokeWidth={3}
                dot={false}
                name="Portfolio"
              />
              <Line
                type="monotone"
                dataKey="psei"
                stroke="var(--color-text-muted)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                name="PSEi"
              />
              {showBtc && (
                <Line
                  type="monotone"
                  dataKey="btc"
                  stroke="var(--color-accent-warning)"
                  strokeWidth={2}
                  strokeDasharray="3 5"
                  dot={false}
                  name="BTC"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass-panel rounded-2xl border border-glass-border p-6">
        <h2 className="mb-3 flex items-center font-display text-lg font-bold text-text-primary">
          <TrendingUp className="mr-2 h-4 w-4 text-accent-secondary" />
          Period Summary ({range})
        </h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-sm text-text-secondary">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Portfolio</p>
            <p className="mt-1 text-base font-semibold text-text-primary">
              {summary.portfolioReturn >= 0 ? "+" : ""}
              {summary.portfolioReturn.toFixed(2)}%
            </p>
          </div>

          <div className="rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-sm text-text-secondary">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">PSEi</p>
            <p className="mt-1 text-base font-semibold text-text-primary">
              {summary.pseiReturn >= 0 ? "+" : ""}
              {summary.pseiReturn.toFixed(2)}%
            </p>
          </div>

          <div className="rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-sm text-text-secondary">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">BTC (optional)</p>
            <p className="mt-1 text-base font-semibold text-text-primary">
              {summary.btcReturn >= 0 ? "+" : ""}
              {summary.btcReturn.toFixed(2)}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
