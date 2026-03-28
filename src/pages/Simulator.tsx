import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { BookOpen, Lightbulb, Loader2, Play, RotateCcw, Save, Sparkles, Trash2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "@/src/pages/DashboardLayout";
import {
  createSimulatorScenario,
  deleteSimulatorScenario,
  listSimulatorScenarios,
  runSimulatorScenario,
} from "@/src/lib/api/phase4";
import type { Scenario, ScenarioModification, ScenarioSimulationOutput } from "@/src/lib/simulator/types";
import { formatCurrency } from "@/src/lib/utils";

interface SimulatorParams {
  baseNetWorth: number;
  baseReturn: number;
  baseVolatility: number;
  years: number;
  monthlySavings: number;
}

type ExperienceMode = "guided" | "advanced";
type RiskProfileId = "steady" | "balanced" | "growth";

interface RiskProfile {
  id: RiskProfileId;
  label: string;
  description: string;
  baseReturn: number;
  baseVolatility: number;
  equityAllocationPct: number;
}

interface QuickPreset {
  id: string;
  title: string;
  description: string;
  years: number;
  monthlySavings: number;
  baseReturn: number;
  baseVolatility: number;
  equityAllocationPct: number;
  savingsDelta: number;
  event: {
    name: string;
    amount: number;
    type: "inflow" | "outflow";
    yearsFromNow: number;
  } | null;
}

const DEFAULT_PARAMS: SimulatorParams = {
  baseNetWorth: 0,
  baseReturn: 0.08,
  baseVolatility: 0.16,
  years: 10,
  monthlySavings: 20_000,
};

const DEFAULT_RISK_PROFILE: RiskProfileId = "balanced";

const RISK_PROFILES: RiskProfile[] = [
  {
    id: "steady",
    label: "Steady",
    description: "Lower swings, slower growth.",
    baseReturn: 0.06,
    baseVolatility: 0.1,
    equityAllocationPct: 35,
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Middle-ground growth and risk.",
    baseReturn: 0.08,
    baseVolatility: 0.16,
    equityAllocationPct: 60,
  },
  {
    id: "growth",
    label: "Growth",
    description: "Higher upside with bigger drawdowns.",
    baseReturn: 0.11,
    baseVolatility: 0.24,
    equityAllocationPct: 80,
  },
];

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: "starter-plan",
    title: "Starter Plan",
    description: "Beginner-friendly path for a first long-term plan.",
    years: 10,
    monthlySavings: 15_000,
    baseReturn: 0.08,
    baseVolatility: 0.16,
    equityAllocationPct: 60,
    savingsDelta: 0,
    event: null,
  },
  {
    id: "home-in-5-years",
    title: "Home in 5 Years",
    description: "Save consistently while preparing for a large cash outflow.",
    years: 5,
    monthlySavings: 30_000,
    baseReturn: 0.075,
    baseVolatility: 0.14,
    equityAllocationPct: 50,
    savingsDelta: 0,
    event: {
      name: "Down payment",
      amount: 1_500_000,
      type: "outflow",
      yearsFromNow: 5,
    },
  },
  {
    id: "retirement-boost",
    title: "Retirement Boost",
    description: "Long horizon with higher risk tolerance and rising savings.",
    years: 20,
    monthlySavings: 25_000,
    baseReturn: 0.1,
    baseVolatility: 0.22,
    equityAllocationPct: 75,
    savingsDelta: 5_000,
    event: {
      name: "Annual bonus",
      amount: 350_000,
      type: "inflow",
      yearsFromNow: 2,
    },
  },
];

export function Simulator() {
  const { user } = useUser();
  const { holdings, usdToPhp } = useDashboard();

  const [params, setParams] = useState<SimulatorParams>(DEFAULT_PARAMS);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("guided");
  const [riskProfileId, setRiskProfileId] = useState<RiskProfileId>(DEFAULT_RISK_PROFILE);
  const [activePresetId, setActivePresetId] = useState<string>("starter-plan");
  const [scenarioName, setScenarioName] = useState("My Scenario");
  const [addedAssetPhp, setAddedAssetPhp] = useState(0);
  const [removedAssetPhp, setRemovedAssetPhp] = useState(0);
  const [equityAllocationPct, setEquityAllocationPct] = useState(60);
  const [savingsDelta, setSavingsDelta] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventAmount, setEventAmount] = useState(0);
  const [eventType, setEventType] = useState<"inflow" | "outflow">("outflow");
  const [eventYearsFromNow, setEventYearsFromNow] = useState(2);

  const [result, setResult] = useState<ScenarioSimulationOutput | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const portfolioNetWorthPhp = useMemo(() => {
    return holdings.reduce((sum, holding) => {
      const unitPrice = holding.manualPrice ?? holding.avgCost;
      const nativeValue = unitPrice * holding.qty;
      return sum + (holding.currency === "USD" ? nativeValue * usdToPhp : nativeValue);
    }, 0);
  }, [holdings, usdToPhp]);

  useEffect(() => {
    if (params.baseNetWorth > 0) return;
    if (portfolioNetWorthPhp <= 0) return;
    setParams((prev) => ({ ...prev, baseNetWorth: Math.round(portfolioNetWorthPhp) }));
  }, [portfolioNetWorthPhp, params.baseNetWorth]);

  const activeRiskProfile = useMemo(
    () => RISK_PROFILES.find((profile) => profile.id === riskProfileId) || RISK_PROFILES[1],
    [riskProfileId]
  );

  async function loadScenarios() {
    if (!user?.id) return;
    try {
      const rows = await listSimulatorScenarios(user.id);
      setSavedScenarios(rows);
    } catch {
      // Keep simulator usable even if scenario list load fails.
    }
  }

  useEffect(() => {
    loadScenarios();
  }, [user?.id]);

  const modifications = useMemo<ScenarioModification[]>(() => {
    const rows: ScenarioModification[] = [];
    if (addedAssetPhp > 0) {
      rows.push({
        type: "add_asset",
        asset: {
          name: "New Asset",
          value: addedAssetPhp,
        },
      });
    }
    if (removedAssetPhp > 0) {
      rows.push({
        type: "remove_asset",
        asset: {
          name: "Removed Asset",
          value: removedAssetPhp,
        },
      });
    }

    rows.push({
      type: "change_allocation",
      newAllocationPct: equityAllocationPct,
    });

    if (savingsDelta !== 0) {
      rows.push({
        type: "change_savings_rate",
        savingsRateChange: savingsDelta,
      });
    }

    if (eventName.trim() && eventAmount > 0) {
      const eventDate = new Date();
      eventDate.setFullYear(eventDate.getFullYear() + Math.max(1, Math.round(eventYearsFromNow)));
      rows.push({
        type: "one_time_event",
        event: {
          name: eventName.trim(),
          amount: eventAmount,
          type: eventType,
          date: eventDate.toISOString(),
        },
      });
    }

    return rows;
  }, [addedAssetPhp, equityAllocationPct, eventAmount, eventName, eventType, eventYearsFromNow, removedAssetPhp, savingsDelta]);

  const chartData = useMemo(() => {
    if (!result) return [];

    const stepsPerYear =
      result.timeLabels.length > 1
        ? Math.max(Math.floor((result.percentiles.p50.length - 1) / (result.timeLabels.length - 1)), 1)
        : 1;

    return result.timeLabels.map((label, index) => {
      const sourceIndex = Math.min(index * stepsPerYear, result.percentiles.p50.length - 1);
      const p10 = result.percentiles.p10[sourceIndex];
      const p90 = result.percentiles.p90[sourceIndex];
      return {
        label,
        p10,
        p50: result.percentiles.p50[sourceIndex],
        p90,
        // Recharts supports range areas as [low, high], letting us render the band directly.
        range: [p10, p90] as [number, number],
      };
    });
  }, [result]);

  async function handleRunSimulation() {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = await runSimulatorScenario({
        userId: user.id,
        ...params,
        modifications,
      });
      setResult(payload);
      setSuccess("Simulation complete.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run simulation.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveScenario() {
    if (!user?.id) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await createSimulatorScenario({
        userId: user.id,
        name: scenarioName.trim() || "Untitled Scenario",
        projection_years: params.years,
        base_portfolio: {
          netWorth: params.baseNetWorth,
          parameters: params,
          saved_modifications: modifications,
        } as unknown as { netWorth: number },
        modifications,
      });

      setSavedScenarios((prev) => [created, ...prev]);
      setSuccess("Scenario saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save scenario.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteScenario(scenarioId: string) {
    if (!user?.id) return;
    try {
      await deleteSimulatorScenario(user.id, scenarioId);
      setSavedScenarios((prev) => prev.filter((scenario) => scenario.id !== scenarioId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete scenario.");
    }
  }

  function applySavedScenario(scenario: Scenario) {
    const raw = scenario.base_portfolio as Record<string, unknown>;
    const rawParams = (raw.parameters || null) as Partial<SimulatorParams> | null;
    let loadedReturn = params.baseReturn;

    if (rawParams) {
      loadedReturn = Number(rawParams.baseReturn || params.baseReturn);
      setParams((prev) => ({
        ...prev,
        baseNetWorth: Number(rawParams.baseNetWorth || prev.baseNetWorth),
        baseReturn: Number(rawParams.baseReturn || prev.baseReturn),
        baseVolatility: Number(rawParams.baseVolatility || prev.baseVolatility),
        years: Number(rawParams.years || prev.years),
        monthlySavings: Number(rawParams.monthlySavings || prev.monthlySavings),
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        baseNetWorth: Number(raw.netWorth || prev.baseNetWorth),
        years: Number(scenario.projection_years || prev.years),
      }));
    }

    if (loadedReturn <= 0.065) {
      setRiskProfileId("steady");
    } else if (loadedReturn <= 0.095) {
      setRiskProfileId("balanced");
    } else {
      setRiskProfileId("growth");
    }
    setActivePresetId("");

    setSuccess(`Loaded scenario: ${scenario.name}`);
  }

  function resetControls() {
    setParams((prev) => ({
      ...DEFAULT_PARAMS,
      baseNetWorth: Math.round(portfolioNetWorthPhp || prev.baseNetWorth),
    }));
    setExperienceMode("guided");
    setRiskProfileId(DEFAULT_RISK_PROFILE);
    setActivePresetId("starter-plan");
    setAddedAssetPhp(0);
    setRemovedAssetPhp(0);
    setEquityAllocationPct(60);
    setSavingsDelta(0);
    setEventName("");
    setEventAmount(0);
    setEventType("outflow");
    setEventYearsFromNow(2);
    setResult(null);
    setSuccess(null);
    setError(null);
  }

  function applyRiskProfile(profileId: RiskProfileId) {
    const profile = RISK_PROFILES.find((row) => row.id === profileId);
    if (!profile) return;
    setRiskProfileId(profileId);
    setActivePresetId("");
    setParams((prev) => ({
      ...prev,
      baseReturn: profile.baseReturn,
      baseVolatility: profile.baseVolatility,
    }));
    setEquityAllocationPct(profile.equityAllocationPct);
  }

  function applyPreset(presetId: string) {
    const preset = QUICK_PRESETS.find((row) => row.id === presetId);
    if (!preset) return;

    setActivePresetId(preset.id);
    setExperienceMode("guided");
    setParams((prev) => ({
      ...prev,
      years: preset.years,
      monthlySavings: preset.monthlySavings,
      baseReturn: preset.baseReturn,
      baseVolatility: preset.baseVolatility,
    }));
    setEquityAllocationPct(preset.equityAllocationPct);
    setSavingsDelta(preset.savingsDelta);

    if (preset.event) {
      setEventName(preset.event.name);
      setEventAmount(preset.event.amount);
      setEventType(preset.event.type);
      setEventYearsFromNow(preset.event.yearsFromNow);
    } else {
      setEventName("");
      setEventAmount(0);
      setEventType("outflow");
      setEventYearsFromNow(2);
    }

    if (preset.baseReturn <= 0.065) {
      setRiskProfileId("steady");
    } else if (preset.baseReturn <= 0.095) {
      setRiskProfileId("balanced");
    } else {
      setRiskProfileId("growth");
    }

    setSuccess(`Loaded preset: ${preset.title}`);
    setError(null);
  }

  const finalPercentiles = useMemo(() => {
    if (!result || result.percentiles.p50.length === 0) {
      return null;
    }

    const finalIndex = result.percentiles.p50.length - 1;
    return {
      conservative: result.percentiles.p10[finalIndex],
      typical: result.percentiles.p50[finalIndex],
      optimistic: result.percentiles.p90[finalIndex],
      probLoss: result.stats.probLoss,
    };
  }, [result]);

  const plainLanguageSummary = useMemo(() => {
    if (!finalPercentiles) return null;

    const outOfTen = Math.round(finalPercentiles.probLoss * 10);
    const confidenceBand = Math.max(
      finalPercentiles.optimistic - finalPercentiles.conservative,
      0
    );

    let riskMessage = "Risk level looks manageable under these assumptions.";
    if (finalPercentiles.probLoss >= 0.35) {
      riskMessage = "Risk is elevated. Consider lowering volatility or extending your timeline.";
    } else if (finalPercentiles.probLoss >= 0.2) {
      riskMessage = "Risk is moderate. This plan may work, but keep a buffer and review regularly.";
    }

    return {
      outOfTen,
      confidenceBand,
      riskMessage,
      typicalVsStart: finalPercentiles.typical - params.baseNetWorth,
    };
  }, [finalPercentiles, params.baseNetWorth]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold text-white">Sandbox Wealth Simulator</h1>
        <p className="text-sm text-text-secondary">
          Test future outcomes with plain-language assumptions so you can understand trade-offs before making real decisions.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-accent-danger/40 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-accent-primary/40 bg-accent-primary/10 px-4 py-3 text-sm text-accent-primary">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="glass-panel self-start rounded-2xl border border-glass-border p-5 xl:sticky xl:top-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-text-primary">Scenario Controls</h2>
            {experienceMode === "advanced" && (
              <button
                type="button"
                onClick={resetControls}
                className="inline-flex items-center gap-1 rounded-lg border border-glass-border bg-bg-surface px-2.5 py-1.5 text-xs text-text-primary hover:bg-white/5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs text-text-muted">
            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 text-accent-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-primary">Beginner Flow</p>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    1) Pick a preset or risk style. 2) Set savings and years. 3) Run simulation and compare outcomes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExperienceMode((prev) => (prev === "guided" ? "advanced" : "guided"))}
              className="w-full rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition-[background,border-color,color] hover:bg-white/5"
            >
              {experienceMode === "guided" ? "Show Advanced Settings" : "Hide Advanced Settings"}
            </button>

            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <p className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-text-primary">
                <Sparkles className="h-3.5 w-3.5 text-accent-primary" /> Quick Presets
              </p>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_PRESETS.map((preset) => {
                  const isActivePreset = preset.id === activePresetId;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition-[background,border-color,color] ${
                        isActivePreset
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

            {experienceMode === "guided" ? (
              <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Starting Wealth</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{formatCurrency(params.baseNetWorth || 0, "PHP")}</p>
                <p className="mt-1 text-[11px] text-text-muted">
                  Pulled from your current portfolio. Switch to advanced mode if you want to edit this.
                </p>
              </div>
            ) : (
              <label className="block">
                Starting Wealth (PHP)
                <input
                  type="number"
                  min={0}
                  value={params.baseNetWorth}
                  onChange={(event) => setParams((prev) => ({ ...prev, baseNetWorth: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                />
                <span className="mt-1 block text-[11px] text-text-muted">Your current total portfolio value.</span>
              </label>
            )}

            <label className="block">
              Monthly Contribution (PHP)
              <input
                type="number"
                min={0}
                value={params.monthlySavings}
                onChange={(event) => setParams((prev) => ({ ...prev, monthlySavings: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
              />
              <span className="mt-1 block text-[11px] text-text-muted">How much you add to investments each month.</span>
            </label>

            <label className="block">
              Time Horizon (Years)
              <input
                type="number"
                min={1}
                max={40}
                value={params.years}
                onChange={(event) => setParams((prev) => ({ ...prev, years: Number(event.target.value) }))}
                className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
              />
              <span className="mt-1 block text-[11px] text-text-muted">How far into the future you want to model.</span>
            </label>

            <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
              <p className="mb-2 text-xs font-medium text-text-primary">Risk Style</p>
              <div className="grid grid-cols-1 gap-2">
                {RISK_PROFILES.map((profile) => {
                  const isActive = profile.id === riskProfileId;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => applyRiskProfile(profile.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition-[background,border-color,color] ${
                        isActive
                          ? "border-accent-primary bg-accent-primary/10"
                          : "border-glass-border bg-bg-dark hover:bg-white/5"
                      }`}
                    >
                      <p className="text-xs font-semibold text-text-primary">{profile.label}</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">{profile.description}</p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-text-muted">
                Active assumptions: {(activeRiskProfile.baseReturn * 100).toFixed(1)}% return, {(activeRiskProfile.baseVolatility * 100).toFixed(1)}% volatility, {activeRiskProfile.equityAllocationPct}% equity mix.
              </p>
            </div>

            {experienceMode === "advanced" && (
              <>
                <label className="block">
                  Expected Annual Return (%)
                  <input
                    type="number"
                    step="0.1"
                    value={(params.baseReturn * 100).toFixed(2)}
                    onChange={(event) => setParams((prev) => ({ ...prev, baseReturn: Number(event.target.value) / 100 }))}
                    className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                  <span className="mt-1 block text-[11px] text-text-muted">Average growth you expect each year.</span>
                </label>

                <label className="block">
                  Risk Level (Volatility %)
                  <input
                    type="number"
                    step="0.1"
                    value={(params.baseVolatility * 100).toFixed(2)}
                    onChange={(event) => setParams((prev) => ({ ...prev, baseVolatility: Number(event.target.value) / 100 }))}
                    className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                  <span className="mt-1 block text-[11px] text-text-muted">Higher values mean larger ups and downs.</span>
                </label>

                <label className="block">
                  Add One-Time Investment (PHP)
                  <input
                    type="number"
                    min={0}
                    value={addedAssetPhp}
                    onChange={(event) => setAddedAssetPhp(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                </label>

                <label className="block">
                  Remove One-Time Amount (PHP)
                  <input
                    type="number"
                    min={0}
                    value={removedAssetPhp}
                    onChange={(event) => setRemovedAssetPhp(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                </label>

                <label className="block">
                  Equity Mix (%)
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={equityAllocationPct}
                    onChange={(event) => setEquityAllocationPct(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                  <span className="mt-1 block text-[11px] text-text-muted">Higher equity can raise both return and risk.</span>
                </label>

                <label className="block">
                  Monthly Savings Change (PHP)
                  <input
                    type="number"
                    value={savingsDelta}
                    onChange={(event) => setSavingsDelta(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                </label>
              </>
            )}

            {experienceMode === "advanced" && (
              <div className="rounded-lg border border-glass-border bg-bg-surface p-3">
                <p className="mb-1 text-xs font-medium text-text-primary">Optional One-Time Event</p>
                <p className="mb-2 text-[11px] text-text-muted">Example: tuition payment, car purchase, or bonus.</p>
                <div className="space-y-2">
                  <input
                    value={eventName}
                    onChange={(event) => setEventName(event.target.value)}
                    placeholder="Event label"
                    className="w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                  <input
                    type="number"
                    min={0}
                    value={eventAmount}
                    onChange={(event) => setEventAmount(Number(event.target.value))}
                    placeholder="Amount (PHP)"
                    className="w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={eventType}
                      onChange={(event) => setEventType(event.target.value as "inflow" | "outflow")}
                      className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                    >
                      <option value="outflow">Outflow</option>
                      <option value="inflow">Inflow</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={eventYearsFromNow}
                      onChange={(event) => setEventYearsFromNow(Number(event.target.value))}
                      placeholder="Years"
                      className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-3 py-2 text-sm font-semibold text-[#09090B] hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleRunSimulation}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Simulation
            </button>

            {experienceMode === "advanced" && (
              <div className="rounded-lg border border-glass-border bg-bg-surface p-2">
                <input
                  value={scenarioName}
                  onChange={(event) => setScenarioName(event.target.value)}
                  className="h-9 w-full min-w-0 rounded-lg border border-glass-border bg-bg-dark px-3 text-xs text-text-primary"
                  placeholder="Scenario name"
                />
                <button
                  type="button"
                  className="mt-2 inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-glass-border bg-bg-dark px-3 text-xs text-text-primary hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSaveScenario}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save Scenario
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="glass-panel rounded-2xl border border-glass-border p-5">
            <div className="mb-4">
              <h2 className="font-display text-lg font-bold text-text-primary">Projection Range</h2>
              <p className="text-xs text-text-muted">Shaded area shows a range of outcomes from conservative to optimistic paths.</p>
            </div>
            {!result ? (
              <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-glass-border text-sm text-text-muted">
                Run simulation to see projected outcomes.
              </div>
            ) : (
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sim-band" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent-secondary)" stopOpacity={0.26} />
                        <stop offset="95%" stopColor="var(--color-accent-secondary)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--color-text-muted)" tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="var(--color-text-muted)"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: number) => `₱${(value / 1_000_000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#13131F",
                        borderColor: "rgba(255,255,255,0.12)",
                        borderRadius: "10px",
                      }}
                      formatter={(value, key) => {
                        if (Array.isArray(value) && value.length === 2) {
                          const low = Number(value[0]);
                          const high = Number(value[1]);
                          if (Number.isFinite(low) && Number.isFinite(high)) {
                            return [`${formatCurrency(low, "PHP")} - ${formatCurrency(high, "PHP")}`, "RANGE"];
                          }
                        }

                        const numeric =
                          typeof value === "number"
                            ? value
                            : typeof value === "string"
                              ? Number(value)
                              : 0;
                        return [
                          formatCurrency(Number.isFinite(numeric) ? numeric : 0, "PHP"),
                          String(key).toUpperCase(),
                        ];
                      }}
                    />
                    <Area type="monotone" dataKey="range" stroke="transparent" fill="url(#sim-band)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="p50" stroke="var(--color-accent-secondary)" fill="none" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${experienceMode === "advanced" ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
            <div className="glass-panel rounded-xl border border-glass-border p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-text-muted">
                {experienceMode === "guided" ? "Cautious Outcome" : "Conservative"}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">10th percentile</p>
              <p className="mt-2 text-lg font-semibold text-accent-danger">
                {finalPercentiles ? formatCurrency(finalPercentiles.conservative, "PHP") : "-"}
              </p>
            </div>
            <div className="glass-panel rounded-xl border border-glass-border p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Typical</p>
              <p className="mt-1 text-[11px] text-text-muted">50th percentile</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                {finalPercentiles ? formatCurrency(finalPercentiles.typical, "PHP") : "-"}
              </p>
            </div>
            {experienceMode === "advanced" && (
              <div className="glass-panel rounded-xl border border-glass-border p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Optimistic</p>
                <p className="mt-1 text-[11px] text-text-muted">90th percentile</p>
                <p className="mt-2 text-lg font-semibold text-accent-primary">
                  {finalPercentiles ? formatCurrency(finalPercentiles.optimistic, "PHP") : "-"}
                </p>
              </div>
            )}
            <div className="glass-panel rounded-xl border border-glass-border p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Chance of Loss</p>
              <p className="mt-1 text-[11px] text-text-muted">Ending below starting wealth</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                {finalPercentiles ? `${(finalPercentiles.probLoss * 100).toFixed(1)}%` : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-glass-border bg-bg-surface p-4">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <BookOpen className="h-4 w-4 text-accent-primary" /> Plain-Language Readout
            </h3>
            {!plainLanguageSummary || !finalPercentiles ? (
              <p className="mt-2 text-xs text-text-secondary">
                Run a simulation to get a beginner-friendly interpretation of your plan.
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-text-secondary md:grid-cols-2">
                <p>
                  Typical result: <span className="font-semibold text-text-primary">{formatCurrency(finalPercentiles.typical, "PHP")}</span> after {params.years} years.
                </p>
                <p>
                  Change from your starting wealth: <span className="font-semibold text-text-primary">{formatCurrency(plainLanguageSummary.typicalVsStart, "PHP")}</span>.
                </p>
                <p>
                  Loss odds: around <span className="font-semibold text-text-primary">{plainLanguageSummary.outOfTen} out of 10</span> paths finish below where you started.
                </p>
                <p>
                  Outcome range width (conservative to optimistic): <span className="font-semibold text-text-primary">{formatCurrency(plainLanguageSummary.confidenceBand, "PHP")}</span>.
                </p>
              </div>
            )}
            {plainLanguageSummary && (
              <p className="mt-3 rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-primary">
                {plainLanguageSummary.riskMessage}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-glass-border bg-bg-surface p-4">
            <h3 className="text-sm font-semibold text-text-primary">How to read this</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-text-secondary md:grid-cols-2">
              <p><span className="font-semibold text-text-primary">Conservative:</span> A cautious estimate, useful for planning downside risk.</p>
              <p><span className="font-semibold text-text-primary">Typical:</span> The middle outcome if current assumptions are broadly correct.</p>
              <p><span className="font-semibold text-text-primary">Optimistic:</span> A strong outcome, not guaranteed, but possible.</p>
              <p><span className="font-semibold text-text-primary">Chance of loss:</span> How often simulations end below your starting wealth.</p>
            </div>
            <p className="mt-3 text-[11px] text-text-muted">
              Percentile = position in many simulated futures. For example, 50th percentile means half the simulated outcomes are above it, half are below.
            </p>
          </div>
        </section>
      </div>

      {experienceMode === "advanced" ? (
        <section className="glass-panel rounded-2xl border border-glass-border p-5">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Saved Scenarios</h2>
          {savedScenarios.length === 0 ? (
            <div className="rounded-xl border border-dashed border-glass-border p-4 text-sm text-text-muted">
              No saved scenarios yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {savedScenarios.slice(0, 8).map((scenario) => (
                <div key={scenario.id} className="rounded-lg border border-glass-border bg-bg-surface p-3">
                  <p className="text-sm font-semibold text-text-primary">{scenario.name}</p>
                  <p className="mt-1 text-xs text-text-muted">{new Date(scenario.created_at).toLocaleString()}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-glass-border px-2 py-1 text-xs text-text-primary hover:bg-white/5"
                      onClick={() => applySavedScenario(scenario)}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md border border-accent-danger/40 px-2 py-1 text-xs text-accent-danger hover:bg-accent-danger/10"
                      onClick={() => handleDeleteScenario(scenario.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="rounded-xl border border-glass-border bg-bg-surface px-4 py-3 text-xs text-text-secondary">
          Saved scenario management is hidden in Guided mode to keep the flow simple. Use "Show Advanced Settings" if you want save/load tools.
        </section>
      )}
    </div>
  );
}
