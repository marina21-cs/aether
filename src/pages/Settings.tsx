import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { CheckCircle2, Shield, User, AlertTriangle } from "lucide-react";
import {
  getUserSettings,
  updateUserSettings,
  type UserSettingsResponse,
} from "@/src/lib/api/phase3";

type RiskTolerance = "conservative" | "moderate" | "aggressive";
type BaseCurrency = "PHP" | "USD" | "SGD" | "HKD";

const RISK_OPTIONS: Array<{ id: RiskTolerance; label: string; description: string }> = [
  {
    id: "conservative",
    label: "Conservative",
    description: "Capital preservation first, lower volatility preference.",
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Balanced growth with controlled drawdown tolerance.",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description: "Higher growth target with higher volatility tolerance.",
  },
];

const CURRENCY_OPTIONS: BaseCurrency[] = ["PHP", "USD", "SGD", "HKD"];

export function Settings() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserSettingsResponse | null>(null);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>("moderate");
  const [baseCurrency, setBaseCurrency] = useState<BaseCurrency>("PHP");

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    setLoading(true);
    setError(null);

    getUserSettings(user.id)
      .then((payload) => {
        if (!active) return;
        setProfile(payload);
        setRiskTolerance(payload.risk_tolerance);
        setBaseCurrency(payload.base_currency);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load user settings.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  const hasChanges = useMemo(() => {
    if (!profile) return false;
    return (
      profile.risk_tolerance !== riskTolerance || profile.base_currency !== baseCurrency
    );
  }, [profile, riskTolerance, baseCurrency]);

  const saveChanges = async () => {
    if (!user?.id || !hasChanges) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateUserSettings(user.id, {
        risk_tolerance: riskTolerance,
        base_currency: baseCurrency,
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              risk_tolerance: riskTolerance,
              base_currency: baseCurrency,
            }
          : prev
      );

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="font-display text-3xl font-bold text-white">Settings & Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Update risk profile and base currency used across dashboard analytics.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-accent-danger/40 bg-accent-danger/10 px-4 py-3 text-sm text-accent-danger">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article className="glass-panel rounded-2xl border border-glass-border p-6">
          <h2 className="mb-4 flex items-center font-display text-lg font-bold text-text-primary">
            <User className="mr-2 h-5 w-5 text-accent-primary" />
            Account
          </h2>

          <div className="rounded-xl border border-glass-border bg-bg-surface p-4">
            <p className="text-sm font-semibold text-text-primary">{user?.fullName || "AETHER User"}</p>
            <p className="mt-1 text-xs text-text-muted">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div className="mt-4 space-y-2 text-xs text-text-muted">
            <p>
              Subscription tier: <span className="text-text-primary">{profile?.subscription_tier || "free"}</span>
            </p>
            <p>
              Loading status: <span className="text-text-primary">{loading ? "syncing" : "ready"}</span>
            </p>
          </div>
        </article>

        <article className="glass-panel rounded-2xl border border-glass-border p-6 lg:col-span-2">
          <h2 className="mb-4 flex items-center font-display text-lg font-bold text-text-primary">
            <Shield className="mr-2 h-5 w-5 text-accent-secondary" />
            Portfolio Preferences
          </h2>

          <div className="space-y-5">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.08em] text-text-muted">Risk Tolerance</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {RISK_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRiskTolerance(option.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      riskTolerance === option.id
                        ? "border-accent-primary/50 bg-accent-subtle"
                        : "border-glass-border bg-bg-surface hover:border-border-accent"
                    }`}
                  >
                    <p className="text-sm font-semibold text-text-primary">{option.label}</p>
                    <p className="mt-1 text-xs text-text-muted">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.08em] text-text-muted">Base Currency</p>
              <div className="flex flex-wrap gap-2">
                {CURRENCY_OPTIONS.map((currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() => setBaseCurrency(currency)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      baseCurrency === currency
                        ? "border-accent-primary/50 bg-accent-subtle text-text-primary"
                        : "border-glass-border bg-bg-surface text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveChanges}
                disabled={!hasChanges || saving || loading}
                className="rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-[#09090B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {saved && (
                <span className="inline-flex items-center text-sm text-accent-success">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Settings updated
                </span>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-accent-danger/40 bg-accent-danger/10 px-4 py-3 text-xs text-text-secondary">
        <p className="inline-flex items-center font-semibold text-accent-danger">
          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
          Analytics-Only Platform
        </p>
        <p className="mt-1">
          AETHER does not execute trades or move funds. Settings only affect analytics, reporting, and advisor context.
        </p>
      </section>
    </div>
  );
}
