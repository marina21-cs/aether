import { formatCurrency } from "@/src/lib/utils";
import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS, type NetWorthBreakdown } from "@/src/lib/calculations/net-worth";

interface AssetBreakdownProps {
  byAssetClass: NetWorthBreakdown["byAssetClass"];
  baseCurrency?: string;
}

export function AssetBreakdown({ byAssetClass, baseCurrency = "PHP" }: AssetBreakdownProps) {
  const entries = Object.entries(byAssetClass).sort((a, b) => b[1].value - a[1].value);

  if (entries.length === 0) {
    return (
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
        <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
          Breakdown by Class
        </p>
        <p className="font-body text-sm text-text-muted">No assets to display.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
      <p className="mb-4 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        Breakdown by Class
      </p>
      <div className="flex flex-col gap-3">
        {entries.map(([cls, data]) => (
          <div key={cls} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: ASSET_CLASS_COLORS[cls] || "#6b7280" }}
              />
              <span className="font-body text-sm text-text-secondary">
                {ASSET_CLASS_LABELS[cls] || cls}
              </span>
              <span className="rounded-full border border-glass-border bg-bg-elevated px-2 py-0.5 font-body text-[10px] tabular-nums text-text-muted">
                {data.count} {data.count === 1 ? "asset" : "assets"}
              </span>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-bold tabular-nums text-text-primary">
                {formatCurrency(data.value, baseCurrency)}
              </p>
              <p className="font-body text-[10px] tabular-nums text-text-muted">
                {data.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
