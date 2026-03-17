import type { Asset, Liability } from "@/src/types/database";

export interface NetWorthBreakdown {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  byAssetClass: Record<string, { value: number; percentage: number; count: number }>;
  changeToday: number;
  changePercent: number;
}

export function calculateNetWorth(
  assets: Asset[],
  liabilities: Liability[]
): NetWorthBreakdown {
  const totalAssets = assets.reduce(
    (sum, a) => sum + Number(a.current_value_php),
    0
  );
  const totalLiabilities = liabilities.reduce(
    (sum, l) => sum + Number(l.outstanding_balance),
    0
  );
  const netWorth = totalAssets - totalLiabilities;

  const byAssetClass: NetWorthBreakdown["byAssetClass"] = {};
  for (const asset of assets) {
    const cls = asset.asset_class;
    if (!byAssetClass[cls]) {
      byAssetClass[cls] = { value: 0, percentage: 0, count: 0 };
    }
    byAssetClass[cls].value += Number(asset.current_value_php);
    byAssetClass[cls].count += 1;
  }

  for (const cls of Object.keys(byAssetClass)) {
    byAssetClass[cls].percentage =
      totalAssets > 0 ? (byAssetClass[cls].value / totalAssets) * 100 : 0;
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    byAssetClass,
    changeToday: 0,
    changePercent: 0,
  };
}

export const ASSET_CLASS_LABELS: Record<string, string> = {
  pse_stock: "PSE Stocks",
  global_stock: "Global Stocks",
  crypto: "Crypto",
  real_estate: "Real Estate",
  uitf: "UITFs",
  cash: "Cash & Savings",
  gold: "Gold",
  time_deposit: "Time Deposits",
  other: "Other",
};

export const ASSET_CLASS_COLORS: Record<string, string> = {
  pse_stock: "#7c3aed",
  global_stock: "#a855f7",
  crypto: "#f59e0b",
  real_estate: "#10b981",
  uitf: "#3b82f6",
  cash: "#6366f1",
  gold: "#eab308",
  time_deposit: "#14b8a6",
  other: "#6b7280",
};
