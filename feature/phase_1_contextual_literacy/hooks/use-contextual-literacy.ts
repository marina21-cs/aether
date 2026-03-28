import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildContextualInsights,
  getGlossaryEntry,
} from "../literacy-content";
import type {
  GlossaryEntry,
  LiteracyContext,
  LiteracyInsight,
  LiteracySignals,
} from "../types";

interface UseContextualLiteracyResult {
  insights: LiteracyInsight[];
  primaryInsight: LiteracyInsight | null;
  secondaryInsights: LiteracyInsight[];
  rotateInsight: () => void;
  lookupTerm: (term: string) => GlossaryEntry | null;
}

export function useContextualLiteracy(
  context: LiteracyContext,
  signals: LiteracySignals
): UseContextualLiteracyResult {
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  const signalKey = useMemo(() => JSON.stringify(signals), [signals]);

  const insights = useMemo(
    () => buildContextualInsights(context, signals),
    [context, signalKey]
  );

  useEffect(() => {
    setActiveInsightIndex(0);
  }, [context, signalKey]);

  const safeIndex = insights.length === 0 ? 0 : activeInsightIndex % insights.length;

  const primaryInsight = insights.length === 0 ? null : insights[safeIndex];

  const secondaryInsights = useMemo(() => {
    if (insights.length <= 1) return [];

    return insights.filter((_, index) => index !== safeIndex).slice(0, 2);
  }, [insights, safeIndex]);

  const rotateInsight = useCallback(() => {
    setActiveInsightIndex((previous) => {
      if (insights.length <= 1) return 0;
      return (previous + 1) % insights.length;
    });
  }, [insights.length]);

  return {
    insights,
    primaryInsight,
    secondaryInsights,
    rotateInsight,
    lookupTerm: getGlossaryEntry,
  };
}
