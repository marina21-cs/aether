export type AlertType =
  | "price_target"
  | "psei_threshold"
  | "bsp_rate_change"
  | "crypto_volatility"
  | "portfolio_drop"
  | "portfolio_gain";

export type AlertCondition = "above" | "below" | "change_pct";

export interface Alert {
  id: string;
  user_id: string;
  alert_type: AlertType;
  asset_ticker: string | null;
  condition: AlertCondition;
  threshold: number;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export interface AlertHistoryEntry {
  id: string;
  alert_id: string;
  user_id: string;
  triggered_value: number | null;
  message: string;
  created_at: string;
}

export interface NotificationEntry {
  id: string;
  user_id: string;
  alert_id: string | null;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}
