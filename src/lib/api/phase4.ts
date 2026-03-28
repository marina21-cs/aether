import { apiFetch } from "@/src/lib/api/client";
import type {
  Alert,
  AlertCondition,
  AlertHistoryEntry,
  AlertType,
  NotificationEntry,
} from "@/src/lib/alerts/types";
import type {
  Scenario,
  ScenarioModification,
  ScenarioSimulationOutput,
} from "@/src/lib/simulator/types";

interface ErrorPayload {
  error?: {
    message?: string;
  };
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw.trim()) return null;

  const contentType = response.headers.get("content-type") || "";
  const shouldTryJson =
    contentType.includes("application/json") ||
    raw.trim().startsWith("{") ||
    raw.trim().startsWith("[");

  if (!shouldTryJson) return raw;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await parseResponseBody(response)) as (T & ErrorPayload) | string | null;

  if (!response.ok) {
    if (payload && typeof payload === "object" && "error" in payload) {
      const withError = payload as ErrorPayload;
      throw new Error(withError.error?.message || `Request failed (${response.status})`);
    }

    if (typeof payload === "string" && payload.trim().length > 0) {
      throw new Error(payload.slice(0, 240));
    }

    throw new Error(`Request failed (${response.status})`);
  }

  if (payload === null || typeof payload !== "object") {
    throw new Error("Unexpected response format from server.");
  }

  return payload as T;
}

export async function runSimulatorScenario(payload: {
  userId: string;
  baseNetWorth: number;
  baseReturn: number;
  baseVolatility: number;
  years: number;
  monthlySavings: number;
  modifications: ScenarioModification[];
}): Promise<ScenarioSimulationOutput> {
  const response = await apiFetch("/api/v1/simulator/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJson<ScenarioSimulationOutput>(response);
}

export async function listSimulatorScenarios(userId: string): Promise<Scenario[]> {
  const response = await apiFetch(
    `/api/v1/simulator/scenarios?userId=${encodeURIComponent(userId)}`
  );
  const payload = await parseJson<{ scenarios: Scenario[] }>(response);
  return payload.scenarios || [];
}

export async function createSimulatorScenario(payload: {
  userId: string;
  name: string;
  description?: string;
  projection_years: number;
  base_portfolio: {
    netWorth: number;
  };
  modifications: ScenarioModification[];
}): Promise<Scenario> {
  const response = await apiFetch("/api/v1/simulator/scenarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const parsed = await parseJson<{ scenario: Scenario }>(response);
  return parsed.scenario;
}

export async function deleteSimulatorScenario(userId: string, scenarioId: string): Promise<void> {
  const response = await apiFetch(
    `/api/v1/simulator/scenarios/${encodeURIComponent(scenarioId)}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  );

  await parseJson<{ success: boolean }>(response);
}

export async function listAlerts(userId: string): Promise<Alert[]> {
  const response = await apiFetch(
    `/api/v1/alerts?userId=${encodeURIComponent(userId)}`
  );
  const payload = await parseJson<{ alerts: Alert[] }>(response);
  return payload.alerts || [];
}

export async function createAlert(payload: {
  userId: string;
  alert_type: AlertType;
  condition: AlertCondition;
  threshold: number;
  asset_ticker?: string | null;
}): Promise<Alert> {
  const response = await apiFetch("/api/v1/alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const parsed = await parseJson<{ alert: Alert }>(response);
  return parsed.alert;
}

export async function updateAlert(payload: {
  userId: string;
  alertId: string;
  is_active?: boolean;
  condition?: AlertCondition;
  threshold?: number;
}): Promise<Alert> {
  const { userId, alertId, ...rest } = payload;
  const response = await apiFetch(`/api/v1/alerts/${encodeURIComponent(alertId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...rest }),
  });

  const parsed = await parseJson<{ alert: Alert }>(response);
  return parsed.alert;
}

export async function deleteAlert(userId: string, alertId: string): Promise<void> {
  const response = await apiFetch(
    `/api/v1/alerts/${encodeURIComponent(alertId)}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  );

  await parseJson<{ success: boolean }>(response);
}

export async function listAlertHistory(userId: string): Promise<AlertHistoryEntry[]> {
  const response = await apiFetch(
    `/api/v1/alerts/history?userId=${encodeURIComponent(userId)}`
  );
  const payload = await parseJson<{ history: AlertHistoryEntry[] }>(response);
  return payload.history || [];
}

export async function runAlertCheck(userId: string, previousPortfolioValue?: number): Promise<{
  triggeredCount: number;
  intervalMs: number;
}> {
  const response = await apiFetch("/api/v1/alerts/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, previousPortfolioValue }),
  });

  return parseJson<{ triggeredCount: number; intervalMs: number }>(response);
}

export async function listNotifications(userId: string): Promise<NotificationEntry[]> {
  const response = await apiFetch(
    `/api/v1/notifications?userId=${encodeURIComponent(userId)}`
  );
  const payload = await parseJson<{ notifications: NotificationEntry[] }>(response);
  return payload.notifications || [];
}

export async function markNotificationsRead(userId: string, notificationId?: string): Promise<void> {
  const response = await apiFetch("/api/v1/notifications/read", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, notificationId }),
  });

  await parseJson<{ success: boolean }>(response);
}

export async function sendTestDigest(userId: string): Promise<void> {
  const response = await apiFetch("/api/v1/digest/send-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  await parseJson<{ success: boolean }>(response);
}
