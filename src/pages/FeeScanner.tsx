import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import {
  AlertTriangle,
  BadgeAlert,
  Download,
  TrendingDown,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getFeeScan,
  getRealReturn,
  type FeeScanResponse,
  type RealReturnResponse,
} from "@/src/lib/api/phase3";
import { formatCurrency } from "@/src/lib/utils";
import {
  ContextualLiteracyPanel,
  GlossaryTerm,
} from "@/creation/feature/phase_1_contextual_literacy/index.ts";

const SEVERITY_COLOR: Record<"critical" | "warning" | "info", string> = {
  critical: "#F87171",
  warning: "#FBB040",
  info: "#60A5FA",
};

function percent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function FeeScanner() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feeData, setFeeData] = useState<FeeScanResponse | null>(null);
  const [realReturnData, setRealReturnData] = useState<RealReturnResponse | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([getFeeScan(user.id), getRealReturn(user.id)])
      .then(([fees, realReturns]) => {
        if (!active) return;
        setFeeData(fees);
        setRealReturnData(realReturns);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load fee analytics.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const weightedAnnualFeePct = useMemo(() => {
    if (!feeData || feeData.results.length === 0) return 0;
    const totalValue = feeData.results.reduce((sum, row) => sum + row.currentValuePhp, 0);
    if (totalValue <= 0) return 0;
    const weighted = feeData.results.reduce(
      (sum, row) => sum + row.annualFeePct * row.currentValuePhp,
      0
    );
    return weighted / totalValue;
  }, [feeData]);

  const negativeRealCount = useMemo(() => {
    if (!realReturnData) return 0;
    return realReturnData.results.filter((row) => row.isNegativeReal).length;
  }, [realReturnData]);

  const topFeeRows = useMemo(() => {
    if (!feeData) return [];
    return feeData.results.slice(0, 6);
  }, [feeData]);

  const realReturnChartData = useMemo(() => {
    if (!realReturnData) return [];
    return realReturnData.results.slice(0, 8).map((row) => ({
      asset: row.assetName,
      nominal: Number((row.nominalReturn * 100).toFixed(2)),
      real: Number((row.realReturn * 100).toFixed(2)),
    }));
  }, [realReturnData]);

  return (
    <div className="relative mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500 overflow-visible">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Fee Analyzer & Real Return</h1>
          <p className="text-sm text-text-secondary">
            Quantify <GlossaryTerm term="fee drag" /> and <GlossaryTerm term="real return" /> with plain-language coaching.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-glass-border bg-glass-bg px-4 py-2 text-sm text-text-primary hover:bg-white/5"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4" /> Export Snapshot (Print)
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-accent-danger/40 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
          {error}
        </div>
      )}

      <ContextualLiteracyPanel
        context="liabilities"
        signals={{
          weightedAnnualFeePct,
          negativeRealCount,
          projectedFeeCost: feeData?.totalTenYearCost ?? 0,
          holdingsCount: feeData?.results.length ?? 0,
        }}
        metricLabel="Potential 10-year fee drag"
        metricValue={loading || !feeData ? "Loading..." : formatCurrency(feeData.totalTenYearCost)}
        metricExplanation="Fees compound over time. Lowering recurring costs can improve long-term outcomes without increasing market risk."
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">10-Year Fee Cost</p>
          <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {loading || !feeData ? "..." : formatCurrency(feeData.totalTenYearCost)}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Estimated <GlossaryTerm term="fee drag" side="top" /> over 10 years.
          </p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Weighted Annual Fee</p>
          <p className="mt-2 text-2xl font-bold text-accent-warning tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {loading ? "..." : `${weightedAnnualFeePct.toFixed(2)}%`}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Blended <GlossaryTerm term="annual fee" side="top" /> by current asset value.
          </p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Negative Real Return Holdings</p>
          <p className="mt-2 text-2xl font-bold text-accent-danger tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {loading ? "..." : negativeRealCount}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Holdings where <GlossaryTerm term="real return" side="top" /> is below zero.
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="glass-panel rounded-2xl border border-glass-border p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Top Fee Drag Contributors</h2>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topFeeRows} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
                <XAxis dataKey="assetName" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-16} textAnchor="end" height={72} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${(Number(value) / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg-card)",
                    borderColor: "var(--color-glass-border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: unknown) => {
                    const numeric = typeof value === "number" ? value : Number(value);
                    return [formatCurrency(Number.isFinite(numeric) ? numeric : 0), "10Y fee cost"];
                  }}
                />
                <Bar dataKey="tenYearCost" radius={[6, 6, 0, 0]}>
                  {topFeeRows.map((row) => (
                    <Cell key={row.assetId} fill={SEVERITY_COLOR[row.severity]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Fee Alerts</h2>

          <div className="space-y-3">
            {(feeData?.results || []).slice(0, 6).map((row) => (
              <div key={row.assetId} className="rounded-lg border border-glass-border bg-bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary">{row.assetName}</p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]"
                    style={{
                      color: SEVERITY_COLOR[row.severity],
                      backgroundColor: `${SEVERITY_COLOR[row.severity]}1a`,
                    }}
                  >
                    {row.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {row.annualFeePct.toFixed(2)}% annual fee • {formatCurrency(row.tenYearCost)} projected drag
                </p>
                {row.suggestion && (
                  <p className="mt-1 text-[11px] text-text-secondary">{row.suggestion}</p>
                )}
              </div>
            ))}

            {!loading && (feeData?.results.length || 0) === 0 && (
              <div className="rounded-lg border border-accent-success/40 bg-accent-success/10 px-3 py-2 text-sm text-text-secondary">
                No fee-bearing holdings detected in the current dataset.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="glass-panel rounded-2xl border border-glass-border p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Nominal vs Real Return</h2>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={realReturnChartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
              <XAxis dataKey="asset" stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-16} textAnchor="end" height={72} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-bg-card)",
                  borderColor: "var(--color-glass-border)",
                  borderRadius: "8px",
                }}
                formatter={(value: unknown, name: unknown) => {
                  const numeric = typeof value === "number" ? value : Number(value);
                  const safe = Number.isFinite(numeric) ? numeric : 0;
                  return [`${safe.toFixed(2)}%`, String(name || "Value")];
                }}
              />
              <Legend />
              <Bar dataKey="nominal" fill="var(--color-accent-secondary)" radius={[5, 5, 0, 0]} name="Nominal" />
              <Bar dataKey="real" fill="var(--color-accent-primary)" radius={[5, 5, 0, 0]} name="Real (Inflation-adjusted)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {(realReturnData?.results || []).slice(0, 8).map((row) => (
            <div key={row.assetId} className="flex items-start gap-2 rounded-lg border border-glass-border bg-bg-surface p-3">
              {row.isNegativeReal ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 text-accent-danger" />
              ) : (
                <BadgeAlert className="mt-0.5 h-4 w-4 text-accent-success" />
              )}
              <div>
                <p className="text-sm font-medium text-text-primary">{row.assetName}</p>
                <p className="text-xs text-text-muted">
                  Nominal {percent(row.nominalReturn)} • Real {percent(row.realReturn)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-accent-warning/40 bg-accent-warning/10 px-4 py-3 text-xs text-text-secondary">
        <p className="inline-flex items-center font-semibold text-accent-warning">
          <TrendingDown className="mr-1 h-3.5 w-3.5" />
          CPI Source
        </p>
        <p className="mt-1">
          Real return values use Philippine CPI from PSA as configured in your Phase 3 environment variables.
        </p>
      </section>
    </div>
  );
}
