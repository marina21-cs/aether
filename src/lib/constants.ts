export const APP_NAME = "AETHER";
export const APP_TAGLINE = "Your net worth, to the peso.";

export const RISK_PROFILES = [
  {
    id: "conservative",
    label: "Conservative",
    description: "Preserve capital. Bonds, time deposits, low volatility.",
    icon: "Shield",
    iconColor: "text-success",
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Balanced growth. Mixed equities and fixed income.",
    icon: "Scale",
    iconColor: "text-accent-primary",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description:
      "Maximize growth. High equity allocation. Comfortable with drawdowns.",
    icon: "TrendingUp",
    iconColor: "text-warning",
  },
] as const;

export const CURRENCIES = [
  { code: "PHP", name: "Philippine Peso" },
  { code: "USD", name: "US Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
] as const;

export const ASSET_CLASSES = [
  "pse_stock",
  "global_stock",
  "crypto",
  "real_estate",
  "uitf",
  "cash",
  "gold",
  "time_deposit",
  "other",
] as const;
