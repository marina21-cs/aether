import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useActionableInsights } from "../hooks/use-actionable-insights";
import type { ActionableSignals, InsightKind, InsightSeverity } from "../types";

interface ActionableInsightsPanelProps {
  signals: ActionableSignals;
  className?: string;
  maxItems?: number;
}

const SEVERITY_STYLES: Record<InsightSeverity, { badge: string; border: string; dot: string }> = {
  high: {
    badge: "border-accent-danger/40 bg-accent-danger/15 text-accent-danger",
    border: "border-accent-danger/30",
    dot: "bg-accent-danger",
  },
  medium: {
    badge: "border-accent-warning/40 bg-accent-warning/15 text-accent-warning",
    border: "border-accent-warning/30",
    dot: "bg-accent-warning",
  },
  info: {
    badge: "border-accent-primary/40 bg-accent-subtle text-accent-primary",
    border: "border-accent-primary/30",
    dot: "bg-accent-primary",
  },
};

const KIND_LABEL: Record<InsightKind, string> = {
  risk: "Risk",
  opportunity: "Opportunity",
  data: "Data Quality",
};

function toAdvisorRoute(prompt?: string): string {
  if (!prompt) return "/dashboard/advisor";
  return `/dashboard/advisor?prompt=${encodeURIComponent(prompt)}`;
}

export function ActionableInsightsPanel({
  signals,
  className,
  maxItems = 3,
}: ActionableInsightsPanelProps) {
  const { primaryInsight, secondaryInsights } = useActionableInsights(signals);
  const renderedInsights = [primaryInsight, ...secondaryInsights]
    .filter((insight): insight is NonNullable<typeof insight> => insight !== null)
    .slice(0, Math.max(1, maxItems));

  return (
    <section
      className={cn(
        "glass-panel card-fade-in rounded-[16px] border border-accent-primary/20 p-5",
        className
      )}
      style={{ animationDelay: "20ms" }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-primary/30 bg-accent-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-accent-primary">
            <Lightbulb className="h-3.5 w-3.5" />
            Actionable Insights
          </span>
          <p className="mt-2 text-xs text-text-muted">
            Prioritized signals from your current portfolio state.
          </p>
        </div>

        <Link
          to="/dashboard/advisor"
          className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
        >
          Open AI Advisor
          <ArrowRight size={13} />
        </Link>
      </div>

      {renderedInsights.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-glass-border bg-bg-surface p-4 text-sm text-text-muted">
          Insights will appear once portfolio signals are available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {renderedInsights.map((insight) => {
            const style = SEVERITY_STYLES[insight.severity];

            return (
              <article
                key={insight.id}
                className={cn(
                  "rounded-[12px] border bg-bg-surface p-3",
                  style.border
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]", style.badge)}>
                    {KIND_LABEL[insight.kind]}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] text-text-muted">
                    <span className={cn("inline-block h-2 w-2 rounded-full", style.dot)} />
                    {insight.severity}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-text-primary">{insight.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">{insight.summary}</p>

                <div className="mt-2 rounded-lg border border-glass-border bg-bg-primary/60 px-2.5 py-2">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Why now</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">{insight.whyNow}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={insight.action.to}
                    className="inline-flex items-center gap-1 rounded-full border border-glass-border px-2.5 py-1 text-[11px] font-medium text-text-primary hover:bg-white/5"
                  >
                    {insight.action.label}
                  </Link>
                  <Link
                    to={toAdvisorRoute(insight.action.advisorPrompt)}
                    className="inline-flex items-center gap-1 rounded-full border border-accent-primary/30 bg-accent-subtle px-2.5 py-1 text-[11px] font-medium text-accent-primary hover:bg-accent-subtle/70"
                  >
                    <Sparkles size={12} />
                    Ask Advisor
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
