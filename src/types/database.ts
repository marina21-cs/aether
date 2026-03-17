export type RiskTolerance = "conservative" | "moderate" | "aggressive";
export type BaseCurrency = "PHP" | "USD" | "SGD" | "HKD";
export type SubscriptionTier = "free" | "pro";

export type AssetClass =
  | "pse_stock"
  | "global_stock"
  | "crypto"
  | "real_estate"
  | "uitf"
  | "cash"
  | "gold"
  | "time_deposit"
  | "other";

export type LiabilityType =
  | "credit_card"
  | "personal_loan"
  | "housing_loan"
  | "car_loan"
  | "other";

export type TransactionType =
  | "buy"
  | "sell"
  | "dividend"
  | "rent_income"
  | "fee"
  | "deposit"
  | "withdrawal";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  risk_tolerance: RiskTolerance;
  base_currency: BaseCurrency;
  subscription_tier: SubscriptionTier;
  onboarding_complete: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  asset_class: AssetClass;
  ticker_or_name: string;
  quantity: number;
  avg_cost_basis: number | null;
  current_value_php: number;
  native_currency: string;
  is_manual: boolean;
  annual_fee_pct: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Liability {
  id: string;
  user_id: string;
  liability_type: LiabilityType;
  name: string;
  outstanding_balance: number;
  interest_rate_pct: number | null;
  monthly_payment: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  asset_id: string | null;
  tx_type: TransactionType;
  amount_php: number;
  price_per_unit: number | null;
  quantity: number | null;
  tx_date: string;
  source: "manual" | "csv_import" | "api_sync";
  notes: string | null;
  created_at: string;
}

export interface PriceCache {
  id: string;
  ticker: string;
  price_php: number;
  source: string;
  fetched_at: string;
}
