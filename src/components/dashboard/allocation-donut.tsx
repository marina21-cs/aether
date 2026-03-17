import { useMemo } from "react";
import { useDashboard, type Holding } from "@/src/pages/DashboardLayout";

const TYPE_COLORS: Record<string, string> = {
  "PH Stocks": "#6EE7B7",
  "US Stocks": "#818CF8",
  Crypto: "#FBB040",
  Cash: "#6EA8FE",
  Bonds: "#F9A8D4",
};

interface Segment {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

export function AllocationDonut() {
  const { holdings, getMarketValue, formatDisplay, getTotalPortfolio } =
    useDashboard();

  const { segments, total } = useMemo(() => {
    const totals: Record<string, number> = {};

    holdings.forEach((h) => {
      const val = getMarketValue(h);
      totals[h.type] = (totals[h.type] || 0) + val;
    });

    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
    const segs: Segment[] = Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([type, value]) => ({
        type,
        value,
        percentage: grandTotal > 0 ? (value / grandTotal) * 100 : 0,
        color: TYPE_COLORS[type] || "#71717A",
      }))
      .sort((a, b) => b.value - a.value);

    return { segments: segs, total: grandTotal };
  }, [holdings, getMarketValue]);

  // SVG donut chart calculations
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // Build arc segments
  let accumulatedOffset = 0;
  const arcs = segments.map((seg) => {
    const length = (seg.percentage / 100) * circumference;
    const gap = segments.length > 1 ? 3 : 0;
    const offset = accumulatedOffset;
    accumulatedOffset += length + gap;

    return {
      ...seg,
      dashArray: `${Math.max(length - gap, 0)} ${circumference}`,
      dashOffset: -offset,
    };
  });

  return (
    <div
      className="card-fade-in rounded-[12px] border p-6"
      style={{
        backgroundColor: "#111113",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <h3
        className="mb-4 text-sm font-semibold text-text-primary"
        style={{ fontFamily: "TT Bakers, serif" }}
      >
        Portfolio Allocation
      </h3>

      <div className="flex flex-col items-center">
        {/* SVG Donut */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            {/* Background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {arcs.map((arc, i) => (
              <circle
                key={arc.type}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={strokeWidth}
                strokeDasharray={arc.dashArray}
                strokeDashoffset={arc.dashOffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{ opacity: 0.9 }}
              />
            ))}
          </svg>

          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-lg font-bold text-text-primary tabular-nums"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {formatDisplay(total)}
            </span>
            <span className="text-[10px] text-text-muted">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {segments.map((seg) => (
            <div key={seg.type} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-text-muted">{seg.type}</span>
              <span
                className="text-xs text-text-secondary tabular-nums"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {seg.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
