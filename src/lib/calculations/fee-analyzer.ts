export interface FeeScanItem {
  assetId: string;
  assetName: string;
  assetClass: string;
  currentValuePhp: number;
  annualFeePct: number;
  tenYearCost: number;
  severity: "critical" | "warning" | "info";
  suggestion?: string;
}

export function calculateFeeCost(
  principal: number,
  grossAnnualReturn: number,
  annualFeeRate: number,
  years: number
): number {
  const withoutFee = principal * Math.pow(1 + grossAnnualReturn, years);
  const withFee = principal * Math.pow(1 + grossAnnualReturn - annualFeeRate, years);
  return Math.max(withoutFee - withFee, 0);
}

export function feeSeverity(annualFeePct: number): FeeScanItem["severity"] {
  if (annualFeePct >= 1.5) return "critical";
  if (annualFeePct >= 0.75) return "warning";
  return "info";
}
