import type { Alert } from "@/src/lib/alerts/types";

interface PriceRow {
  ticker: string;
  price_php: number;
}

interface AlertCheckResult {
  alert: Alert;
  triggered: boolean;
  currentValue: number;
  message: string;
}

export function checkAlertConditions(
  alerts: Alert[],
  prices: PriceRow[],
  portfolioValue: number,
  previousPortfolioValue: number
): AlertCheckResult[] {
  const priceMap = new Map(prices.map((row) => [row.ticker.toUpperCase(), row.price_php]));
  const results: AlertCheckResult[] = [];

  for (const alert of alerts) {
    if (!alert.is_active) continue;

    let currentValue = 0;
    let triggered = false;
    let message = "";

    switch (alert.alert_type) {
      case "price_target": {
        const ticker = (alert.asset_ticker || "").toUpperCase();
        currentValue = priceMap.get(ticker) || 0;
        triggered = alert.condition === "above"
          ? currentValue >= alert.threshold
          : currentValue <= alert.threshold;
        message = `${ticker || "Asset"} is at ${currentValue.toLocaleString()}`;
        break;
      }
      case "psei_threshold": {
        currentValue = priceMap.get("PSEI") || 0;
        triggered = alert.condition === "above"
          ? currentValue >= alert.threshold
          : currentValue <= alert.threshold;
        message = `PSEi is at ${currentValue.toLocaleString()}`;
        break;
      }
      case "portfolio_drop": {
        currentValue = portfolioValue;
        const base = Math.max(previousPortfolioValue, 1);
        const changePct = ((portfolioValue - previousPortfolioValue) / base) * 100;
        triggered = Math.abs(changePct) >= alert.threshold && changePct < 0;
        message = `Portfolio moved ${changePct.toFixed(2)}%`;
        break;
      }
      case "portfolio_gain": {
        currentValue = portfolioValue;
        const base = Math.max(previousPortfolioValue, 1);
        const changePct = ((portfolioValue - previousPortfolioValue) / base) * 100;
        triggered = changePct >= alert.threshold;
        message = `Portfolio moved ${changePct.toFixed(2)}%`;
        break;
      }
      case "bsp_rate_change": {
        currentValue = 0;
        triggered = false;
        message = "BSP rate checks rely on latest macro feed.";
        break;
      }
      case "crypto_volatility": {
        currentValue = 0;
        triggered = false;
        message = "Crypto volatility checks require historical comparisons.";
        break;
      }
      default:
        break;
    }

    results.push({ alert, triggered, currentValue, message });
  }

  return results;
}
