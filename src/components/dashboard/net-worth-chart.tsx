import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface NetWorthChartProps {
  netWorth: number;
}

export function NetWorthChart({ netWorth }: NetWorthChartProps) {
  const hasData = netWorth > 0;
  // Placeholder — historical data will be built from snapshots in a future phase
  const data = [
    { month: "Oct", netWorth: 0 },
    { month: "Nov", netWorth: 0 },
    { month: "Dec", netWorth: 0 },
    { month: "Jan", netWorth: 0 },
    { month: "Feb", netWorth: 0 },
    { month: "Mar", netWorth: hasData ? netWorth : 0 },
  ];

  if (!hasData) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
        <p className="font-body text-sm text-text-muted">
          Add your first asset to see your net worth chart.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
      <p className="mb-4 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        Net Worth Over Time
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "#4e4c6a", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: "#4e4c6a", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : String(v)
            }
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#13131f", borderColor: "rgba(168,85,247,0.18)", borderRadius: "8px" }}
            itemStyle={{ color: "#f1f0ff" }}
            formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, "Net Worth"]}
          />
          <Area type="monotone" dataKey="netWorth" stroke="#7c3aed" strokeWidth={2} fill="url(#netWorthGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
