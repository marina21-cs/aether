import type { ReactNode } from "react";

interface PageHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ badge, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
            {badge}
          </span>
          <h1 className="font-display text-[2.25rem] font-bold text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="h-px w-full bg-border" />
    </div>
  );
}
