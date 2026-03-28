import { cn } from "@/src/lib/utils";
import type { DisplayCurrency } from "@/src/lib/currency/converter";

const CURRENCIES: DisplayCurrency[] = ["PHP", "USD", "SGD"];

interface CurrencySwitcherProps {
  value: DisplayCurrency;
  onChange: (currency: DisplayCurrency) => void;
}

export function CurrencySwitcher({ value, onChange }: CurrencySwitcherProps) {
  return (
    <div
      className="flex min-h-[44px] items-center rounded-full p-0.5"
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
    >
      {CURRENCIES.map((currency) => (
        <button
          key={currency}
          onClick={() => onChange(currency)}
          className={cn(
            "h-10 min-w-[54px] rounded-full px-2.5 text-[11px] font-medium transition-all duration-200 sm:px-3 sm:text-xs",
            value === currency
              ? currency === "USD"
                ? "bg-accent-secondary text-white"
                : "bg-accent-primary text-[#09090B]"
              : "text-text-muted hover:text-text-primary"
          )}
          style={{ fontFamily: "JetBrains Mono, monospace" }}
          type="button"
        >
          {currency === "PHP" ? "₱ PHP" : currency === "USD" ? "$ USD" : "S$ SGD"}
        </button>
      ))}
    </div>
  );
}
