export type LiteracyContext = "dashboard" | "assets" | "liabilities";

export interface LiteracySignals {
  totalPortfolioValue?: number;
  holdingsCount?: number;
  liveCoveragePct?: number;
  topAllocationPct?: number;
  dailyPnl?: number;
  weightedAnnualFeePct?: number;
  negativeRealCount?: number;
  projectedFeeCost?: number;
  highInterestLiabilityCount?: number;
}

export interface LiteracyInsight {
  id: string;
  title: string;
  body: string;
  whyItMatters: string;
  score: number;
  relatedTerms: string[];
}

export interface GlossaryEntry {
  term: string;
  shortDefinition: string;
  plainDefinition: string;
  whyItMatters: string;
}
