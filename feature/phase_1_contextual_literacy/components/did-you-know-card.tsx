import { Lightbulb, RefreshCw } from "lucide-react";
import type { LiteracyInsight } from "../types";

interface DidYouKnowCardProps {
  insight: LiteracyInsight | null;
  onRotate?: () => void;
}

export function DidYouKnowCard({ insight, onRotate }: DidYouKnowCardProps) {
  if (!insight) {
    return (
      <article className="rounded-[12px] border border-glass-border bg-bg-surface/80 p-4">
        <p className="text-sm text-text-secondary">
          No literacy tips available yet. Add more portfolio data to unlock personalized coaching.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-[12px] border border-accent-primary/35 bg-[linear-gradient(135deg,rgba(110,231,183,0.14),rgba(17,17,19,0.95))] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent-primary/40 bg-accent-subtle text-accent-primary">
            <Lightbulb className="h-4 w-4" />
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-accent-primary">
            Did You Know
          </p>
        </div>

        {onRotate && (
          <button
            type="button"
            onClick={onRotate}
            className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-bg-surface/90 px-2.5 py-1 text-[11px] text-text-primary hover:bg-white/5"
          >
            <RefreshCw className="h-3 w-3" />
            Another Tip
          </button>
        )}
      </div>

      <h3 className="mt-2 text-sm font-semibold text-text-primary">{insight.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{insight.body}</p>
      <p className="mt-2 rounded-[10px] border border-glass-border bg-bg-surface/80 px-3 py-2 text-xs text-text-muted">
        Why this matters: {insight.whyItMatters}
      </p>
    </article>
  );
}
