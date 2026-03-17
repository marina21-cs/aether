import { CreditCard } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import type { Liability } from "@/src/types/database";

const LIABILITY_LABELS: Record<string, string> = {
  credit_card: "Credit Card",
  personal_loan: "Personal Loan",
  housing_loan: "Housing Loan",
  car_loan: "Car Loan",
  other: "Other",
};

interface LiabilitiesSummaryProps {
  liabilities: Liability[];
  baseCurrency?: string;
}

export function LiabilitiesSummary({ liabilities, baseCurrency = "PHP" }: LiabilitiesSummaryProps) {
  if (liabilities.length === 0) {
    return (
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
        <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
          Liabilities
        </p>
        <p className="font-body text-sm text-text-muted">No liabilities recorded.</p>
      </div>
    );
  }

  const total = liabilities.reduce((sum, l) => sum + Number(l.outstanding_balance), 0);

  return (
    <div className="rounded-[16px] border border-glass-border bg-glass-bg p-6 backdrop-blur-[12px] shadow-glass">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
          Liabilities
        </p>
        <p className="font-display text-lg font-bold tabular-nums text-error">
          {formatCurrency(total, baseCurrency)}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {liabilities.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between rounded-[8px] border border-glass-border bg-bg-elevated px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-error" />
              <div>
                <p className="font-body text-sm font-medium text-text-primary">{l.name}</p>
                <p className="font-body text-xs text-text-muted">
                  {LIABILITY_LABELS[l.liability_type] || l.liability_type}
                  {l.interest_rate_pct ? ` · ${Number(l.interest_rate_pct).toFixed(1)}% APR` : ""}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-bold tabular-nums text-text-primary">
                {formatCurrency(Number(l.outstanding_balance), baseCurrency)}
              </p>
              {l.monthly_payment && (
                <p className="font-body text-[10px] tabular-nums text-text-muted">
                  {formatCurrency(Number(l.monthly_payment), baseCurrency)}/mo
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
