import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import {
  Activity,
  BookOpen,
  Eye,
  FileText,
  Lightbulb,
  Play,
  RotateCcw,
  ShieldAlert,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
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

type ExperienceMode = "guided" | "advanced";
type RiskStyleId = "defensive" | "balanced" | "growth";

interface RiskStyle {
  id: RiskStyleId;
  label: string;
  description: string;
  returnShiftPct: number;
  volatilityMultiplier: number;
  baseCorrelation: number;
}

interface GlassPreset {
  id: string;
  title: string;
  description: string;
  values: Pick<Required<GlassBoxQuery>, "years" | "monthlyContributionPhp" | "returnShiftPct" | "volatilityMultiplier" | "marketShockPct" | "baseCorrelation">;
}

const DEFAULT_RISK_STYLE: RiskStyleId = "balanced";

const RISK_STYLES: RiskStyle[] = [
  {
    id: "defensive",
    label: "Defensive",
    description: "Lower swings, more stable paths.",
    returnShiftPct: -0.75,
    volatilityMultiplier: 0.8,
    baseCorrelation: 0.1,
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Middle-ground assumptions.",
    returnShiftPct: 0,
    volatilityMultiplier: 1,
    baseCorrelation: 0.15,
  },
  {
    id: "growth",
    label: "Growth",
    description: "Higher upside with larger swings.",
    returnShiftPct: 1.5,
    volatilityMultiplier: 1.25,
    baseCorrelation: 0.22,
  },
];

const GLASS_PRESETS: GlassPreset[] = [
  {
    id: "base-case",
    title: "Base Case",
    description: "A realistic baseline scenario for regular investing.",
    values: {
      years: 10,
      monthlyContributionPhp: 20_000,
      returnShiftPct: 0,
      volatilityMultiplier: 1,
      marketShockPct: 0,
      baseCorrelation: 0.15,
    },
  },
  {
    id: "steady-growth",
    title: "Steady Growth",
    description: "Conservative assumptions with consistent contributions.",
    values: {
      years: 12,
      monthlyContributionPhp: 25_000,
      returnShiftPct: -0.5,
      volatilityMultiplier: 0.85,
      marketShockPct: 0,
      baseCorrelation: 0.12,
    },
  },
  {
    id: "stress-test",
    title: "Stress Test",
    description: "See portfolio resilience under a market drawdown.",
    values: {
      years: 8,
      monthlyContributionPhp: 20_000,
      returnShiftPct: -2,
      volatilityMultiplier: 1.5,
      marketShockPct: -20,
      baseCorrelation: 0.35,
    },
  },
];

export function GlassBox() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GlassBoxResponse | null>(null);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("guided");
  const [riskStyleId, setRiskStyleId] = useState<RiskStyleId>(DEFAULT_RISK_STYLE);
  const [activePresetId, setActivePresetId] = useState<string>("base-case");
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

  const activeRiskStyle = useMemo(
    () => RISK_STYLES.find((style) => style.id === riskStyleId) || RISK_STYLES[1],
    [riskStyleId]
  );

  const runScenario = () => {
    setAppliedControls(controls);
  };

  const resetScenario = () => {
    setControls(DEFAULT_CONTROLS);
    setAppliedControls(DEFAULT_CONTROLS);
    setExperienceMode("guided");
    setRiskStyleId(DEFAULT_RISK_STYLE);
    setActivePresetId("base-case");
  };

  const applyRiskStyle = (styleId: RiskStyleId) => {
    const style = RISK_STYLES.find((row) => row.id === styleId);
    if (!style) return;
    setRiskStyleId(styleId);
    setActivePresetId("");
    setControls((prev) => ({
      ...prev,
      returnShiftPct: style.returnShiftPct,
      volatilityMultiplier: style.volatilityMultiplier,
      baseCorrelation: style.baseCorrelation,
    }));
  };

  const applyPreset = (presetId: string) => {
    const preset = GLASS_PRESETS.find((row) => row.id === presetId);
    if (!preset) return;

    setExperienceMode("guided");
    setActivePresetId(preset.id);
    setControls((prev) => ({
      ...prev,
      years: preset.values.years,
      monthlyContributionPhp: preset.values.monthlyContributionPhp,
      returnShiftPct: preset.values.returnShiftPct,
      volatilityMultiplier: preset.values.volatilityMultiplier,
      marketShockPct: preset.values.marketShockPct,
      baseCorrelation: preset.values.baseCorrelation,
    }));

    if (preset.values.volatilityMultiplier <= 0.9) {
      setRiskStyleId("defensive");
    } else if (preset.values.volatilityMultiplier <= 1.15) {
      setRiskStyleId("balanced");
    } else {
      setRiskStyleId("growth");
    }
  };

  const plainLanguageReadout = useMemo(() => {
    if (!data || data.monteCarlo.percentiles.p50.length === 0) return null;

    const finalIndex = data.monteCarlo.percentiles.p50.length - 1;
    const conservative = data.monteCarlo.percentiles.p10[finalIndex];
    const typical = data.monteCarlo.percentiles.p50[finalIndex];
    const optimistic = data.monteCarlo.percentiles.p90[finalIndex];
    const lossOdds = data.monteCarlo.stats.probLoss;
    const outOfTen = Math.round(lossOdds * 10);

    let guidance = "Current setup looks balanced for long-term compounding.";
    if (lossOdds >= 0.35) {
      guidance = "Risk looks high. Consider lowering volatility, extending years, or increasing monthly contributions.";
    } else if (lossOdds >= 0.2) {
      guidance = "Risk is moderate. Keep a cash buffer and review assumptions each quarter.";
    }

    return {
      conservative,
      typical,
      optimistic,
      outOfTen,
      guidance,
      rangeWidth: Math.max(optimistic - conservative, 0),
    };
  }, [data]);

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
            Scenario Setup
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

        <div className="space-y-3 text-xs text-text-muted">
          <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 text-accent-primary" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-primary">Simple Flow</p>
                <p className="mt-1 text-[11px] text-text-secondary">
                  1) Pick a preset or risk style. 2) Set years and monthly contribution. 3) Run scenario and review outcome range.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setExperienceMode("guided")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-[background,border-color,color] ${
                experienceMode === "guided"
                  ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                  : "border-glass-border bg-bg-surface text-text-secondary hover:bg-white/5"
              }`}
            >
              Guided
            </button>
            <button
              type="button"
              onClick={() => setExperienceMode("advanced")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-[background,border-color,color] ${
                experienceMode === "advanced"
                  ? "border-accent-primary bg-accent-primary/15 text-accent-primary"
                  : "border-glass-border bg-bg-surface text-text-secondary hover:bg-white/5"
              }`}
            >
              Advanced
            </button>
          </div>

          <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
            <p className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-text-primary">
              <Sparkles className="h-3.5 w-3.5 text-accent-primary" /> Quick Presets
            </p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {GLASS_PRESETS.map((preset) => {
                const isActive = preset.id === activePresetId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`rounded-lg border px-3 py-2 text-left transition-[background,border-color,color] ${
                      isActive
                        ? "border-accent-primary bg-accent-primary/10"
                        : "border-glass-border bg-bg-dark hover:bg-white/5"
                    }`}
                  >
                    <p className="text-xs font-semibold text-text-primary">{preset.title}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          </div>

          <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
            <p className="mb-2 text-xs font-medium text-text-primary">Risk Style</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {RISK_STYLES.map((style) => {
                const isActive = style.id === riskStyleId;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => applyRiskStyle(style.id)}
                    className={`rounded-lg border px-3 py-2 text-left transition-[background,border-color,color] ${
                      isActive
                        ? "border-accent-primary bg-accent-primary/10"
                        : "border-glass-border bg-bg-dark hover:bg-white/5"
                    }`}
                  >
                    <p className="text-xs font-semibold text-text-primary">{style.label}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">{style.description}</p>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-text-muted">
              Active assumptions: shift {activeRiskStyle.returnShiftPct.toFixed(2)}%, volatility x{activeRiskStyle.volatilityMultiplier.toFixed(2)}, correlation {activeRiskStyle.baseCorrelation.toFixed(2)}.
            </p>
          </div>

          {experienceMode === "advanced" && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
          )}
        </div>

        {isScenarioDirty && (
          <p className="mt-2 text-xs text-accent-warning">
            Controls changed. Click <span className="font-semibold">Run Scenario</span> to recompute projections.
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">
            {experienceMode === "guided" ? "Expected Annual Growth" : "Expected Return (μ)"}
          </p>
          <p className="mt-2 text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? formatPercent(data.expectedReturn) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            {experienceMode === "guided" ? "Average return under current assumptions." : "Weighted by current allocation."}
          </p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">
            {experienceMode === "guided" ? "Portfolio Swing" : "Volatility (σ)"}
          </p>
          <p className="mt-2 text-2xl font-bold text-accent-warning tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? formatPercent(data.stdDev) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            {experienceMode === "guided" ? "Higher means bigger ups and downs." : "Annualized proxy estimate."}
          </p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Chance of Loss</p>
          <p className="mt-2 text-2xl font-bold text-accent-danger tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? formatPercent(data.monteCarlo.stats.probLoss) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">Probability of ending below today&apos;s value.</p>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">
            {experienceMode === "guided" ? "Risk-Adjusted Score" : "Sharpe Ratio"}
          </p>
          <p className="mt-2 text-2xl font-bold text-accent-secondary tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            {data ? data.sharpeRatio.toFixed(2) : "..."}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            {experienceMode === "guided" ? "Higher means better return per unit of risk." : "Risk-free proxy: BSP rate."}
          </p>
        </article>
      </section>

      <section className="glass-panel rounded-2xl border border-glass-border p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-text-primary">Outcome Projection</h2>
          <span className="text-xs text-text-muted">Conservative / Typical / Optimistic paths</span>
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
              <Line type="monotone" dataKey="p10" stroke="rgba(248,113,113,0.8)" dot={false} name="10th" strokeWidth={1.8} />
              <Line type="monotone" dataKey="p50" stroke="var(--color-accent-primary)" dot={false} name="typical" strokeWidth={2.8} />
              <Line type="monotone" dataKey="p90" stroke="rgba(59,130,246,0.8)" dot={false} name="optimistic" strokeWidth={1.8} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 rounded-lg border border-glass-border bg-bg-surface p-4">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
            <BookOpen className="h-4 w-4 text-accent-primary" /> Plain-Language Readout
          </h3>
          {!plainLanguageReadout ? (
            <p className="mt-2 text-xs text-text-secondary">Run scenario to see an easy interpretation.</p>
          ) : (
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-text-secondary md:grid-cols-2">
              <p>
                Typical outcome: <span className="font-semibold text-text-primary">{formatCurrency(plainLanguageReadout.typical)}</span>.
              </p>
              <p>
                Conservative to optimistic range: <span className="font-semibold text-text-primary">{formatCurrency(plainLanguageReadout.rangeWidth)}</span> wide.
              </p>
              <p>
                Loss odds: around <span className="font-semibold text-text-primary">{plainLanguageReadout.outOfTen} out of 10</span> scenarios.
              </p>
              <p>
                Conservative case: <span className="font-semibold text-text-primary">{formatCurrency(plainLanguageReadout.conservative)}</span>.
              </p>
            </div>
          )}
          {plainLanguageReadout && (
            <p className="mt-3 rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-primary">
              {plainLanguageReadout.guidance}
            </p>
          )}
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

        {experienceMode === "advanced" && data?.assumptions && (
          <div className="mt-4 rounded-lg border border-glass-border bg-bg-surface p-3 text-xs text-text-secondary">
            Scenario assumptions: shift {data.assumptions.returnShiftPct.toFixed(2)}%, volatility x{data.assumptions.volatilityMultiplier.toFixed(2)},
            correlation {data.assumptions.baseCorrelation.toFixed(2)}, horizon {data.assumptions.years} years, paths {data.assumptions.paths},
            monthly contribution {formatCurrency(data.assumptions.monthlyContributionPhp)}, market shock {(data.assumptions.marketShockPct * 100).toFixed(1)}%.
          </div>
        )}
      </section>

      {experienceMode === "advanced" ? (
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
      ) : (
        <section className="rounded-xl border border-glass-border bg-bg-surface px-4 py-3 text-xs text-text-secondary">
          Advanced tables (weights and covariance matrix) are hidden in Guided mode. Switch to Advanced if you want to inspect the math details.
        </section>
      )}

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
