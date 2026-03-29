import { useMemo } from "react";
import { Brain, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useContextualLiteracy } from "../hooks/use-contextual-literacy";
import { getGlossaryEntry } from "../literacy-content";
import type { LiteracyContext, LiteracySignals } from "../types";
import { DidYouKnowCard } from "./did-you-know-card";
import { GlossaryTerm } from "./glossary-term";
import { MetricExplainerCard } from "./metric-explainer-card";

interface ContextualLiteracyPanelProps {
  context: LiteracyContext;
  signals: LiteracySignals;
  metricLabel: string;
  metricValue: string;
  metricExplanation: string;
  className?: string;
}

export function ContextualLiteracyPanel({
  context,
  signals,
  metricLabel,
  metricValue,
  metricExplanation,
  className,
}: ContextualLiteracyPanelProps) {
  const { primaryInsight, secondaryInsights, rotateInsight } = useContextualLiteracy(
    context,
    signals
  );

  const glossaryTermPool = useMemo(() => {
    const terms = [
      ...(primaryInsight?.relatedTerms ?? []),
      ...secondaryInsights.flatMap((insight) => insight.relatedTerms),
    ];

    const uniqueResolvedTerms: string[] = [];
    const seen = new Set<string>();

    for (const term of terms) {
      const entry = getGlossaryEntry(term);
      if (!entry) continue;

      const canonicalKey = entry.term.trim().toLowerCase();
      if (seen.has(canonicalKey)) continue;

      seen.add(canonicalKey);
      uniqueResolvedTerms.push(term);

      if (uniqueResolvedTerms.length === 6) {
        break;
      }
    }

    return uniqueResolvedTerms;
  }, [primaryInsight, secondaryInsights]);

  return (
    <section
      className={cn(
        "relative z-20 overflow-visible glass-panel rounded-[16px] border border-accent-primary/25 p-4",
        className
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-primary/30 bg-accent-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent-primary">
          <Brain className="h-3.5 w-3.5" />
          AI Literacy Layer
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
          Context-aware coaching
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <DidYouKnowCard insight={primaryInsight} onRotate={rotateInsight} />
        <MetricExplainerCard
          metricLabel={metricLabel}
          metricValue={metricValue}
          explanation={metricExplanation}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Quick glossary:</span>
        {glossaryTermPool.length === 0 ? (
          <span className="text-xs text-text-muted">No glossary terms available yet.</span>
        ) : (
          glossaryTermPool.map((term, index) => (
            <GlossaryTerm
              key={term}
              term={term}
              side="top"
              align={index > 2 ? "right" : "left"}
              className="cursor-pointer rounded-full border border-glass-border bg-bg-surface px-2 py-0.5 text-xs"
            />
          ))
        )}
      </div>
    </section>
  );
}
