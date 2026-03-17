import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/src/lib/utils";
import type { NetWorthBreakdown } from "@/src/lib/calculations/net-worth";

interface NetWorthHeroProps {
  breakdown: NetWorthBreakdown;
  baseCurrency?: string;
}

export function NetWorthHero({ breakdown, baseCurrency = "PHP" }: NetWorthHeroProps) {
  const isPositive = breakdown.changeToday >= 0;

  return (
    <div className="rounded-[20px] border border-glass-border bg-glass-bg p-8 backdrop-blur-[12px] shadow-glass">
      <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        Net Worth
      </p>
      <div className="mt-3 flex items-baseline gap-3">
        <h2 className="font-display text-[3rem] font-bold tabular-nums leading-none text-text-primary">
          {formatCurrency(breakdown.netWorth, baseCurrency)}
        </h2>
        {breakdown.changeToday !== 0 && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-body text-sm font-medium tabular-nums ${
              isPositive
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}{formatPercentage(breakdown.changePercent)}
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="font-body text-xs text-text-muted">Total Assets</p>
          <p className="mt-1 font-display text-lg font-bold tabular-nums text-success">
            {formatCurrency(breakdown.totalAssets, baseCurrency)}
          </p>
        </div>
        <div>
          <p className="font-body text-xs text-text-muted">Total Liabilities</p>
          <p className="mt-1 font-display text-lg font-bold tabular-nums text-error">
            {formatCurrency(breakdown.totalLiabilities, baseCurrency)}
          </p>
        </div>
      </div>
    </div>
  );
}
