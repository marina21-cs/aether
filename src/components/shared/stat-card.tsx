import { cn } from "@/src/lib/utils";
import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-glass-border bg-glass-bg p-5 backdrop-blur-[12px] shadow-glass",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
          {label}
        </p>
        {icon && (
          <div className="text-accent-primary">{icon}</div>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-text-primary">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "mt-1 font-body text-sm tabular-nums",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-error",
            changeType === "neutral" && "text-text-muted"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
