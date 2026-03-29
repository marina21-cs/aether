export type InsightSeverity = "high" | "medium" | "info";

export type InsightKind = "risk" | "opportunity" | "data";

export interface InsightAction {
  label: string;
  to: string;
  advisorPrompt?: string;
}

export interface ActionableSignals {
  totalPortfolioValue: number;
  holdingsCount: number;
  topAllocationPct: number;
  cashAllocationPct: number;
  liveCoveragePct: number;
  manualPricedCount: number;
  dailyPnl: number;
  bestPerformerPct?: number;
  worstPerformerPct?: number;
  hasCryptoExposure: boolean;
}

export interface ActionableInsight {
  id: string;
  title: string;
  summary: string;
  whyNow: string;
  severity: InsightSeverity;
  kind: InsightKind;
  score: number;
  action: InsightAction;
}
