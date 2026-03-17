import { cn } from "@/src/lib/utils";
import { CURRENCIES } from "@/src/lib/constants";
import type { BaseCurrency } from "@/src/types/database";

interface CurrencyStepProps {
  selected: BaseCurrency;
  onSelect: (value: BaseCurrency) => void;
  onFinish: () => void;
}

export function CurrencyStep({
  selected,
  onSelect,
  onFinish,
}: CurrencyStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-[28px] font-bold text-text-primary">
          What&apos;s your base currency?
        </h2>
        <p className="mt-2 font-body text-sm text-text-muted">
          All assets converted to this for display. PHP recommended for PH
          investors.
        </p>
      </div>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Base currency">
        {CURRENCIES.map((currency) => {
          const isSelected = selected === currency.code;

          return (
            <button
              key={currency.code}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(currency.code as BaseCurrency)}
              className={cn(
                "flex h-12 items-center justify-between rounded-[16px] border px-4 backdrop-blur-[12px] transition-[border-color,box-shadow] duration-200",
                "bg-glass-bg",
                isSelected
                  ? "border-accent-primary bg-accent-subtle"
                  : "border-glass-border hover:border-border-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-medium text-text-primary">
                  {currency.code}
                </span>
                <span className="font-body text-sm text-text-secondary">
                  {currency.name}
                </span>
              </div>
              <div
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center rounded-full border",
                  isSelected
                    ? "border-accent-primary bg-accent-primary"
                    : "border-text-muted"
                )}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onFinish}
        className="h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] focus-ring"
      >
        Finish setup
      </button>
    </div>
  );
}
