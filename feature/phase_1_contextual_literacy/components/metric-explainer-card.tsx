import { BarChart3 } from "lucide-react";

interface MetricExplainerCardProps {
  metricLabel: string;
  metricValue: string;
  explanation: string;
}

export function MetricExplainerCard({
  metricLabel,
  metricValue,
  explanation,
}: MetricExplainerCardProps) {
  return (
    <article className="rounded-[12px] border border-glass-border bg-bg-surface/90 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.08em] text-text-muted">{metricLabel}</p>
        <BarChart3 className="h-4 w-4 text-accent-secondary" />
      </div>
      <p
        className="mt-1 text-lg font-semibold tabular-nums text-text-primary"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        {metricValue}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-text-secondary">{explanation}</p>
    </article>
  );
}
