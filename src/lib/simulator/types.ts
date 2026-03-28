export interface ScenarioEvent {
  name: string;
  amount: number;
  date: string;
  type: "inflow" | "outflow";
}

export interface ScenarioModification {
  type:
    | "add_asset"
    | "remove_asset"
    | "change_allocation"
    | "change_savings_rate"
    | "one_time_event";
  asset?: {
    name: string;
    ticker?: string;
    class?: string;
    value?: number;
    quantity?: number;
  };
  newAllocationPct?: number;
  savingsRateChange?: number;
  event?: ScenarioEvent;
}

export interface Scenario {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  base_portfolio: {
    netWorth: number;
    holdings?: Array<{
      name: string;
      ticker?: string;
      value: number;
      class?: string;
    }>;
  };
  projection_years: number;
  created_at: string;
  updated_at: string;
  modifications?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
}

export interface ScenarioSimulationStats {
  mean: number;
  median: number;
  min: number;
  max: number;
  probLoss: number;
}

export interface ScenarioSimulationOutput {
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  timeLabels: string[];
  stats: ScenarioSimulationStats;
  events: Array<{
    year: number;
    label: string;
    impact: number;
  }>;
}
