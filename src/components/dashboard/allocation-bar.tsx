import { ASSET_CLASS_LABELS, ASSET_CLASS_COLORS, type NetWorthBreakdown } from "@/src/lib/calculations/net-worth";

interface AllocationBarProps {
  byAssetClass: NetWorthBreakdown["byAssetClass"];
}

export function AllocationBar({ byAssetClass }: AllocationBarProps) {
  const entries = Object.entries(byAssetClass).sort((a, b) => b[1].value - a[1].value);

  if (entries.length === 0) {
    return (
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
        <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
          Asset Allocation
        </p>
        <p className="font-body text-sm text-text-muted">No assets yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
      <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        Asset Allocation
      </p>

      {/* Stacked bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        {entries.map(([cls, data]) => (
          <div
            key={cls}
            style={{
              width: `${data.percentage}%`,
              backgroundColor: ASSET_CLASS_COLORS[cls] || "#6b7280",
            }}
            title={`${ASSET_CLASS_LABELS[cls] || cls}: ${data.percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {entries.map(([cls, data]) => (
          <div key={cls} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ASSET_CLASS_COLORS[cls] || "#6b7280" }}
            />
            <span className="font-body text-xs text-text-secondary">
              {ASSET_CLASS_LABELS[cls] || cls}{" "}
              <span className="tabular-nums text-text-muted">
                {data.percentage.toFixed(1)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
