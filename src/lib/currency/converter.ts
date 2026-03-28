export type DisplayCurrency = "PHP" | "USD" | "SGD";

export interface FxRateSnapshot {
  PHP: number;
  SGD: number;
}

const FALLBACK_USD_TO_PHP = 56.5;
const FALLBACK_USD_TO_SGD = 1.34;

function getUsdToPhp(rates?: FxRateSnapshot | null): number {
  return rates?.PHP || FALLBACK_USD_TO_PHP;
}

function getUsdToSgd(rates?: FxRateSnapshot | null): number {
  return rates?.SGD || FALLBACK_USD_TO_SGD;
}

export function convertFromNativeToDisplay(
  amount: number,
  nativeCurrency: "PHP" | "USD",
  displayCurrency: DisplayCurrency,
  rates?: FxRateSnapshot | null
): number {
  const usdToPhp = getUsdToPhp(rates);
  const usdToSgd = getUsdToSgd(rates);

  const amountUsd = nativeCurrency === "USD" ? amount : amount / usdToPhp;

  if (displayCurrency === "USD") return amountUsd;
  if (displayCurrency === "SGD") return amountUsd * usdToSgd;
  return amountUsd * usdToPhp;
}

export function currencySymbol(currency: DisplayCurrency): string {
  if (currency === "USD") return "$";
  if (currency === "SGD") return "S$";
  return "₱";
}
