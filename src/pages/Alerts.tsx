import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import { Bell, Loader2, Mail, RefreshCcw, ShieldAlert, Trash2 } from "lucide-react";
import {
  createAlert,
  deleteAlert,
  listAlertHistory,
  listAlerts,
  runAlertCheck,
  sendTestDigest,
  updateAlert,
} from "@/src/lib/api/phase4";
import { registerPushSubscription } from "@/src/lib/alerts/push";
import type { Alert, AlertCondition, AlertHistoryEntry, AlertType } from "@/src/lib/alerts/types";
import { cn } from "@/src/lib/utils";

const ALERT_TYPE_OPTIONS: Array<{ value: AlertType; label: string }> = [
  { value: "price_target", label: "Price target" },
  { value: "psei_threshold", label: "PSEi threshold" },
  { value: "bsp_rate_change", label: "BSP rate change" },
  { value: "crypto_volatility", label: "Crypto volatility" },
  { value: "portfolio_drop", label: "Portfolio drop" },
  { value: "portfolio_gain", label: "Portfolio gain" },
];

const CONDITION_OPTIONS: Array<{ value: AlertCondition; label: string }> = [
  { value: "above", label: "Above" },
  { value: "below", label: "Below" },
  { value: "change_pct", label: "Change %" },
];

export function Alerts() {
  const { user } = useUser();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<AlertHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<{
    alert_type: AlertType;
    condition: AlertCondition;
    threshold: string;
    asset_ticker: string;
  }>({
    alert_type: "price_target",
    condition: "above",
    threshold: "",
    asset_ticker: "",
  });

  const activeCount = useMemo(() => alerts.filter((item) => item.is_active).length, [alerts]);

  async function hydrate() {
    if (!user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [alertRows, historyRows] = await Promise.all([
        listAlerts(user.id),
        listAlertHistory(user.id),
      ]);
      setAlerts(alertRows);
      setHistory(historyRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    hydrate();
  }, [user?.id]);

  async function handleCreateAlert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user?.id) return;

    setError(null);
    setSuccess(null);

    const threshold = Number(form.threshold);
    if (!Number.isFinite(threshold) || threshold <= 0) {
      setError("Threshold must be a positive number.");
      return;
    }

    setBusyAction("create-alert");
    try {
      const created = await createAlert({
        userId: user.id,
        alert_type: form.alert_type,
        condition: form.condition,
        threshold,
        asset_ticker: form.asset_ticker.trim() ? form.asset_ticker.trim().toUpperCase() : null,
      });

      setAlerts((prev) => [created, ...prev]);
      setForm({
        alert_type: "price_target",
        condition: "above",
        threshold: "",
        asset_ticker: "",
      });
      setSuccess("Alert created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alert.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleToggleAlert(alert: Alert) {
    if (!user?.id) return;
    setError(null);
    setSuccess(null);
    setBusyAction(`toggle-${alert.id}`);

    try {
      const updated = await updateAlert({
        userId: user.id,
        alertId: alert.id,
        is_active: !alert.is_active,
      });

      setAlerts((prev) => prev.map((item) => (item.id === alert.id ? updated : item)));
      setSuccess(updated.is_active ? "Alert enabled." : "Alert disabled.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update alert.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleDeleteAlert(alertId: string) {
    if (!user?.id) return;
    setError(null);
    setSuccess(null);
    setBusyAction(`delete-${alertId}`);

    try {
      await deleteAlert(user.id, alertId);
      setAlerts((prev) => prev.filter((item) => item.id !== alertId));
      setSuccess("Alert removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete alert.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handlePushEnable() {
    if (!user?.id) return;
    setError(null);
    setSuccess(null);
    setBusyAction("push-enable");

    try {
      await registerPushSubscription(user.id);
      setSuccess("Push notifications enabled for this browser.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable push notifications.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleRunChecks() {
    if (!user?.id) return;
    setError(null);
    setSuccess(null);
    setBusyAction("run-checks");

    try {
      const result = await runAlertCheck(user.id);
      setSuccess(`Alert check complete: ${result.triggeredCount} triggered.`);
      await hydrate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run alert checks.");
    } finally {
      setBusyAction(null);
    }
  }

  async function handleSendDigest() {
    if (!user?.id) return;
    setError(null);
    setSuccess(null);
    setBusyAction("send-digest");

    try {
      await sendTestDigest(user.id);
      setSuccess("Test digest sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send test digest.");
    } finally {
      setBusyAction(null);
    }
  }

  const buttonBase =
    "inline-flex items-center gap-2 rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-white">
          <Bell className="h-7 w-7 text-accent-primary" />
          Alert Control Center
        </h1>
        <p className="text-sm text-text-secondary">
          Create market and portfolio alerts, trigger checks manually, and manage delivery channels.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Active Alerts</p>
          <p className="mt-2 text-3xl font-bold text-text-primary tabular-nums">{activeCount}</p>
          <p className="mt-1 text-xs text-text-muted">Total configured: {alerts.length}</p>
        </div>
        <div className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Triggered Log</p>
          <p className="mt-2 text-3xl font-bold text-accent-secondary tabular-nums">{history.length}</p>
          <p className="mt-1 text-xs text-text-muted">Latest history entries</p>
        </div>
        <div className="glass-panel rounded-2xl border border-glass-border p-5">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Actions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={buttonBase}
              onClick={handleRunChecks}
              disabled={busyAction === "run-checks"}
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Run Check
            </button>
            <button
              type="button"
              className={buttonBase}
              onClick={handlePushEnable}
              disabled={busyAction === "push-enable"}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Enable Push
            </button>
            <button
              type="button"
              className={buttonBase}
              onClick={handleSendDigest}
              disabled={busyAction === "send-digest"}
            >
              <Mail className="h-3.5 w-3.5" />
              Send Test Digest
            </button>
          </div>
        </div>
      </section>

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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form onSubmit={handleCreateAlert} className="glass-panel rounded-2xl border border-glass-border p-5 xl:col-span-1">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Create New Alert</h2>
          <div className="space-y-3">
            <label className="block text-xs text-text-muted">
              Type
              <select
                value={form.alert_type}
                onChange={(event) => setForm((prev) => ({ ...prev, alert_type: event.target.value as AlertType }))}
                className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
              >
                {ALERT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs text-text-muted">
              Asset Ticker (optional)
              <input
                value={form.asset_ticker}
                onChange={(event) => setForm((prev) => ({ ...prev, asset_ticker: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                placeholder="e.g. BTC, JFC, FMETF"
              />
            </label>

            <label className="block text-xs text-text-muted">
              Condition
              <select
                value={form.condition}
                onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value as AlertCondition }))}
                className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
              >
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs text-text-muted">
              Threshold
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.threshold}
                onChange={(event) => setForm((prev) => ({ ...prev, threshold: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary"
                placeholder="0"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-3 py-2 text-sm font-semibold text-[#09090B] transition-colors hover:bg-accent-primary/90 disabled:opacity-60"
            disabled={busyAction === "create-alert"}
          >
            {busyAction === "create-alert" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create Alert
          </button>
        </form>

        <div className="glass-panel rounded-2xl border border-glass-border p-5 xl:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Configured Alerts</h2>

          {loading ? (
            <div className="flex h-40 items-center justify-center text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-glass-border p-6 text-center text-sm text-text-muted">
              No alerts configured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const typeLabel = ALERT_TYPE_OPTIONS.find((option) => option.value === alert.alert_type)?.label || alert.alert_type;
                return (
                  <div
                    key={alert.id}
                    className="flex flex-col gap-3 rounded-xl border border-glass-border bg-bg-surface p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-text-primary">
                        {typeLabel}
                        {alert.asset_ticker ? ` • ${alert.asset_ticker}` : ""}
                      </p>
                      <p className="text-xs text-text-muted">
                        {alert.condition} {alert.threshold}
                        {alert.last_triggered_at
                          ? ` • Last triggered: ${new Date(alert.last_triggered_at).toLocaleString()}`
                          : " • Not triggered yet"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAlert(alert)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          alert.is_active
                            ? "bg-accent-primary/20 text-accent-primary"
                            : "bg-white/10 text-text-muted"
                        )}
                        disabled={busyAction === `toggle-${alert.id}`}
                      >
                        {alert.is_active ? "Active" : "Paused"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-accent-danger/40 px-2 py-1 text-xs text-accent-danger hover:bg-accent-danger/10"
                        disabled={busyAction === `delete-${alert.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="glass-panel rounded-2xl border border-glass-border p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Trigger History</h2>
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-glass-border p-6 text-center text-sm text-text-muted">
            No alert history yet.
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 12).map((entry) => (
              <div key={entry.id} className="rounded-lg border border-glass-border bg-bg-surface p-3">
                <p className="text-sm text-text-primary">{entry.message}</p>
                <p className="mt-1 text-xs text-text-muted">{new Date(entry.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
