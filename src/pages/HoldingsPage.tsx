import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Database, LineChart, Plus, Upload } from "lucide-react";
import { useDashboard } from "./DashboardLayout";
import { HoldingsTable } from "@/src/components/holdings/holdings-table";
import { AddAssetDialog } from "@/src/components/holdings/add-asset-dialog";

export default function HoldingsPage() {
  const { holdings, getMarketValue, formatDisplay, cryptoPrices } = useDashboard();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const totalValue = useMemo(
    () => holdings.reduce((sum, holding) => sum + getMarketValue(holding), 0),
    [holdings, getMarketValue]
  );

  const livePricedCount = useMemo(
    () =>
      holdings.filter(
        (holding) =>
          holding.type === "Crypto" && typeof cryptoPrices[holding.ticker] === "number"
      ).length,
    [holdings, cryptoPrices]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
          Holdings
        </span>
        <h1 className="font-display text-[2.25rem] font-bold text-text-primary">Positions</h1>
        <p className="font-body text-sm text-text-muted">
          Detailed positions with sortable market value and P&L columns.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-[14px] p-4">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Holdings</p>
          <p
            className="mt-2 text-right text-xl font-bold text-text-primary tabular-nums"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {holdings.length}
          </p>
        </div>

        <div className="glass-panel rounded-[14px] p-4">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Portfolio Value</p>
          <p
            className="mt-2 text-right text-xl font-bold text-text-primary tabular-nums"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {formatDisplay(totalValue)}
          </p>
        </div>

        <div className="glass-panel rounded-[14px] p-4">
          <p className="text-xs uppercase tracking-[0.08em] text-text-muted">Live Priced</p>
          <p
            className="mt-2 text-right text-xl font-bold text-accent-primary tabular-nums"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {livePricedCount}/{holdings.length || 0}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setAddDialogOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
        >
          <Plus size={13} />
          Add Asset
        </button>
        <Link
          to="/dashboard/data"
          className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
        >
          <Upload size={13} />
          Import CSV
        </Link>
        <Link
          to="/dashboard/market"
          className="inline-flex items-center gap-1 rounded-full border border-glass-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-white/5"
        >
          <LineChart size={13} />
          Open Market Updates
        </Link>
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <Database size={13} />
          Values auto-refresh from your live feeds
        </span>
      </div>

      <HoldingsTable />
      <AddAssetDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
    </div>
  );
}
