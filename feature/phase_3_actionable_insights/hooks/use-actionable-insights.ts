import { useMemo } from "react";
import { buildActionableInsights } from "../insight-engine";
import type { ActionableInsight, ActionableSignals } from "../types";

interface UseActionableInsightsResult {
  insights: ActionableInsight[];
  primaryInsight: ActionableInsight | null;
  secondaryInsights: ActionableInsight[];
}

export function useActionableInsights(
  signals: ActionableSignals
): UseActionableInsightsResult {
  const signalKey = useMemo(() => JSON.stringify(signals), [signals]);

  const insights = useMemo(
    () => buildActionableInsights(signals),
    [signalKey]
  );

  return {
    insights,
    primaryInsight: insights[0] ?? null,
    secondaryInsights: insights.slice(1, 4),
  };
}
