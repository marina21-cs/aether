import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { Eye, Sigma, Activity, TrendingUp, ShieldAlert, Play, RotateCcw, SlidersHorizontal, FileText } from "lucide-react";
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
import { getGlassBox, type GlassBoxQuery, type GlassBoxResponse } from "@/src/lib/api/phase3";
import { formatCurrency } from "@/src/lib/utils";

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

const DEFAULT_CONTROLS: Required<GlassBoxQuery> = {
  returnShiftPct: 0,
  volatilityMultiplier: 1,
  baseCorrelation: 0.15,
  years: 10,
  paths: 1000,
  monthlyContributionPhp: 0,
  marketShockPct: 0,
  riskFreeRatePct: 6.25,
};

export function GlassBox() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GlassBoxResponse | null>(null);
  const [controls, setControls] = useState<Required<GlassBoxQuery>>(DEFAULT_CONTROLS);
  const [appliedControls, setAppliedControls] = useState<Required<GlassBoxQuery>>(DEFAULT_CONTROLS);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    setLoading(true);
    setError(null);

    getGlassBox(user.id, appliedControls)
      .then((payload) => {
        if (!active) return;
        setData(payload);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load Glass Box analytics.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id, appliedControls]);

  const chartData = useMemo(() => {
    if (!data) return [];
    const { percentiles, timeLabels } = data.monteCarlo;
    const stepsPerYear =
      timeLabels.length > 1
        ? Math.max(Math.floor((percentiles.p50.length - 1) / (timeLabels.length - 1)), 1)
        : 1;

    return timeLabels.map((label, index) => {
      const sourceIndex = Math.min(index * stepsPerYear, percentiles.p50.length - 1);
      return {
        label,
        p10: percentiles.p10[sourceIndex],
        p25: percentiles.p25[sourceIndex],
        p50: percentiles.p50[sourceIndex],
        p75: percentiles.p75[sourceIndex],
        p90: percentiles.p90[sourceIndex],
      };
    });
  }, [data]);

  const maxCovariance = useMemo(() => {
    if (!data || data.covarianceMatrix.length === 0) return 1;
    return Math.max(
      ...data.covarianceMatrix.flat().map((value) => Math.abs(value)),
      0.000001
    );
  }, [data]);

  const isScenarioDirty = useMemo(() => {
    return JSON.stringify(controls) !== JSON.stringify(appliedControls);
  }, [controls, appliedControls]);

  const runScenario = () => {
    setAppliedControls(controls);
  };

  const resetScenario = () => {
    setControls(DEFAULT_CONTROLS);
    setAppliedControls(DEFAULT_CONTROLS);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="flex items-center font-display text-3xl font-bold text-white">
          <Eye className="mr-3 h-8 w-8 text-accent-secondary" />
          Glass Box Engine
        </h1>
        <p className="text-sm text-text-secondary">
          Transparent risk math with visible assumptions, covariance matrix, and Monte Carlo percentiles.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-accent-danger/40 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
          {error}
        </div>
      )}

      <section className="glass-panel rounded-2xl border border-glass-border p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center font-display text-lg font-bold text-text-primary">
            <SlidersHorizontal className="mr-2 h-4 w-4 text-accent-primary" />
            Scenario Controls (Spec-aligned)
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetScenario}
              className="inline-flex items-center gap-1 rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-xs font-medium text-text-primary hover:bg-white/5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              type="button"
              onClick={runScenario}
              className="inline-flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-2 text-xs font-semibold text-[#09090B] hover:bg-accent-primary/90"
            >
              <Play className="h-3.5 w-3.5" /> Run Scenario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Return Shift (%)
            <input
              type="number"
              min={-20}
              max={20}
              step={0.25}
              value={controls.returnShiftPct}
              onChange={(event) => setControls((prev) => ({ ...prev, returnShiftPct: round(Number(event.target.value), 2) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Volatility Multiplier
            <input
              type="number"
              min={0.5}
              max={3}
              step={0.05}
              value={controls.volatilityMultiplier}
              onChange={(event) => setControls((prev) => ({ ...prev, volatilityMultiplier: round(Number(event.target.value), 2) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Base Correlation
            <input
              type="number"
              min={0}
              max={0.95}
              step={0.01}
              value={controls.baseCorrelation}
              onChange={(event) => setControls((prev) => ({ ...prev, baseCorrelation: round(Number(event.target.value), 2) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Risk-free Rate (%)
            <input
              type="number"
              min={0}
              max={25}
              step={0.05}
              value={controls.riskFreeRatePct}
              onChange={(event) => setControls((prev) => ({ ...prev, riskFreeRatePct: round(Number(event.target.value), 2) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Horizon (Years)
            <input
              type="number"
              min={1}
              max={30}
              step={1}
              value={controls.years}
              onChange={(event) => setControls((prev) => ({ ...prev, years: Math.round(Number(event.target.value) || 1) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Monte Carlo Paths
            <input
              type="number"
              min={100}
              max={5000}
              step={100}
              value={controls.paths}
              onChange={(event) => setControls((prev) => ({ ...prev, paths: Math.round(Number(event.target.value) || 100) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Monthly Contribution (PHP)
            <input
              type="number"
              min={0}
              max={1000000}
              step={1000}
              value={controls.monthlyContributionPhp}
              onChange={(event) => setControls((prev) => ({ ...prev, monthlyContributionPhp: Math.round(Number(event.target.value) || 0) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>

          <label className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-muted">
            Immediate Market Shock (%)
            <input
              type="number"
              min={-80}
              max={80}
              step={0.5}
              value={controls.marketShockPct}
              onChange={(event) => setControls((prev) => ({ ...prev, marketShockPct: round(Number(event.target.value), 1) }))}
              className="mt-1 w-full rounded-md border border-glass-border bg-bg-dark px-2 py-1.5 text-sm text-text-primary"
            />
          </label>
        </div>

        {isScenarioDirty && (
          <p className="mt-2 text-xs text-accent-warning">
            Controls changed. Click <span className="font-semibold">Run Scenario</span> to recompute projections.
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Variance (σp²)</p>
          <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? data.variance.toFixed(6) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">σp² = wᵀΣw</p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Volatility (σ)</p>
          <p className="mt-2 text-2xl font-bold text-accent-warning tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? formatPercent(data.stdDev) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">Annualized proxy estimate</p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Expected Return (μ)</p>
          <p className="mt-2 text-2xl font-bold text-accent-success tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? formatPercent(data.expectedReturn) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">Weighted by current allocation</p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Sharpe Ratio</p>
          <p className="mt-2 text-2xl font-bold text-accent-secondary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? data.sharpeRatio.toFixed(2) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">Risk-free proxy: BSP rate</p>
        </article>
      </section>

      <section className="glass-panel rounded-2xl border border-glass-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-text-primary">Monte Carlo Projection</h2>
          <span className="text-xs text-text-muted">10th / 25th / 50th / 75th / 90th percentiles</span>
        </div>

        <div className="h-[340px] w-full">
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
                    String(name || "Value").toUpperCase(),
                  ];
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="p10" stroke="rgba(248,113,113,0.8)" dot={false} name="10th" strokeWidth={1.8} />
              <Line type="monotone" dataKey="p25" stroke="rgba(245,158,11,0.8)" dot={false} name="25th" strokeWidth={1.8} />
              <Line type="monotone" dataKey="p50" stroke="var(--color-accent-primary)" dot={false} name="50th (median)" strokeWidth={2.8} />
              <Line type="monotone" dataKey="p75" stroke="rgba(16,185,129,0.8)" dot={false} name="75th" strokeWidth={1.8} />
              <Line type="monotone" dataKey="p90" stroke="rgba(59,130,246,0.8)" dot={false} name="90th" strokeWidth={1.8} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {data && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Mean Terminal</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">{formatCurrency(data.monteCarlo.stats.mean)}</p>
            </div>
            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Median Terminal</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">{formatCurrency(data.monteCarlo.stats.median)}</p>
            </div>
            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Worst / Best</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                {formatCurrency(data.monteCarlo.stats.min)} / {formatCurrency(data.monteCarlo.stats.max)}
              </p>
            </div>
            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Probability of Loss</p>
              <p className="mt-1 text-sm font-semibold text-accent-danger">{formatPercent(data.monteCarlo.stats.probLoss)}</p>
            </div>
          </div>
        )}

        {data?.assumptions && (
          <div className="mt-4 rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-secondary">
            Scenario assumptions: shift {data.assumptions.returnShiftPct.toFixed(2)}%, volatility x{data.assumptions.volatilityMultiplier.toFixed(2)},
            correlation {data.assumptions.baseCorrelation.toFixed(2)}, horizon {data.assumptions.years} years, paths {data.assumptions.paths},
            monthly contribution {formatCurrency(data.assumptions.monthlyContributionPhp)}, market shock {(data.assumptions.marketShockPct * 100).toFixed(1)}%.
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="glass-panel rounded-2xl border border-glass-border p-5 lg:col-span-1">
          <h3 className="mb-3 flex items-center font-display text-lg font-bold text-text-primary">
            <Activity className="mr-2 h-4 w-4 text-accent-primary" />
            Weights (w)
          </h3>

          <div className="space-y-2">
            {data?.weights.map((weightRow) => (
              <div key={`${weightRow.name}-${weightRow.assetClass}`} className="flex items-center justify-between rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-sm">
                <span className="truncate text-text-secondary">{weightRow.name}</span>
                <span className="ml-3 tabular-nums text-text-primary" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  {formatPercent(weightRow.weight)}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5 lg:col-span-2">
          <h3 className="mb-3 flex items-center font-display text-lg font-bold text-text-primary">
            <Sigma className="mr-2 h-4 w-4 text-accent-secondary" />
            Covariance Matrix (Σ)
          </h3>

          {loading && (
            <p className="text-sm text-text-muted">Running covariance and simulation...</p>
          )}

          {!loading && data && (
            <div className="overflow-x-auto">
              <table className="min-w-[520px] border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left text-text-muted">Asset</th>
                    {data.weights.map((_, colIndex) => (
                      <th key={`col-${colIndex}`} className="px-2 py-2 text-center text-text-muted">
                        A{colIndex + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.covarianceMatrix.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      <td className="px-2 py-2 text-text-secondary">A{rowIndex + 1}</td>
                      {row.map((value, colIndex) => {
                        const intensity = Math.min(Math.abs(value) / maxCovariance, 1);
                        const background = `rgba(110, 231, 183, ${0.08 + intensity * 0.42})`;
                        return (
                          <td
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="px-2 py-2 text-center tabular-nums text-text-primary"
                            style={{ backgroundColor: background, fontFamily: "JetBrains Mono, monospace" }}
                          >
                            {value.toFixed(4)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !data && !error && (
            <div className="rounded-lg border border-accent-warning/40 bg-accent-warning/10 p-4 text-sm text-text-secondary">
              Add at least one asset to view Glass Box analytics.
            </div>
          )}
        </article>
      </section>

      <section className="rounded-xl border border-accent-warning/40 bg-accent-warning/10 px-4 py-3 text-xs text-text-secondary">
        <p className="inline-flex items-center font-semibold text-accent-warning">
          <ShieldAlert className="mr-1 h-3.5 w-3.5" />
          Assumptions Notice
        </p>
        <p className="mt-1">
          This MVP uses proxy expected returns, volatilities, and correlations per asset class. Use the results for directional planning, not guaranteed outcomes.
        </p>
      </section>

      {data?.interpretation && (
        <section className="glass-panel rounded-2xl border border-glass-border p-5">
          <h2 className="mb-2 flex items-center font-display text-lg font-bold text-text-primary">
            <FileText className="mr-2 h-4 w-4 text-accent-secondary" />
            Computation Summary & Interpretation
          </h2>
          <p className="text-sm text-text-secondary">{data.interpretation.summary}</p>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            {data.interpretation.keyPoints.map((point, index) => (
              <li key={`interpretation-${index}`} className="rounded-lg border border-glass-border bg-bg-surface px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
