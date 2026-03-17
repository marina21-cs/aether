const COINGECKO_BASE = import.meta.env.VITE_COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3";
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || "";
const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || "";

const CRYPTO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  DOT: "polkadot",
  MATIC: "matic-network",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  XRP: "ripple",
  DOGE: "dogecoin",
  BNB: "binancecoin",
  USDT: "tether",
  USDC: "usd-coin",
};

export interface PriceData {
  ticker: string;
  price_php: number;
  source: string;
  fetched_at: string;
}

/**
 * Fetch crypto prices from CoinGecko in USD, then convert to PHP using exchange rate.
 */
export async function fetchCryptoPrices(
  tickers: string[],
  usdToPhp: number
): Promise<PriceData[]> {
  const ids = tickers
    .map((t) => CRYPTO_IDS[t.toUpperCase()])
    .filter(Boolean);

  if (ids.length === 0) return [];

  const params = new URLSearchParams({
    ids: ids.join(","),
    vs_currencies: "usd",
  });
  if (COINGECKO_API_KEY) {
    params.set("x_cg_demo_api_key", COINGECKO_API_KEY);
  }

  const url = `${COINGECKO_BASE}/simple/price?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error("CoinGecko API error:", response.status);
      return [];
    }

    const data = await response.json();
    const now = new Date().toISOString();

    return tickers
      .map((ticker) => {
        const id = CRYPTO_IDS[ticker.toUpperCase()];
        const priceUsd = data?.[id]?.usd;
        if (!priceUsd) return null;

        return {
          ticker: ticker.toUpperCase(),
          price_php: priceUsd * usdToPhp,
          source: "coingecko",
          fetched_at: now,
        };
      })
      .filter(Boolean) as PriceData[];
  } catch (err) {
    console.error("CoinGecko fetch error:", err);
    return [];
  }
}

/**
 * Fetch USD/PHP exchange rate from ExchangeRate-API.
 */
export async function fetchUsdToPhp(): Promise<number> {
  if (!EXCHANGE_RATE_API_KEY) return 56.5; // fallback

  try {
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`;
    const response = await fetch(url);
    if (!response.ok) return 56.5;

    const data = await response.json();
    return data?.conversion_rates?.PHP ?? 56.5;
  } catch {
    return 56.5;
  }
}

/**
 * Fetch all forex rates relevant to the app.
 */
export async function fetchForexRates(): Promise<PriceData[]> {
  const now = new Date().toISOString();

  if (!EXCHANGE_RATE_API_KEY) {
    return [
      { ticker: "USD/PHP", price_php: 56.5, source: "fallback", fetched_at: now },
      { ticker: "SGD/PHP", price_php: 42.1, source: "fallback", fetched_at: now },
      { ticker: "HKD/PHP", price_php: 7.23, source: "fallback", fetched_at: now },
    ];
  }

  try {
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Exchange rate API error");

    const data = await response.json();
    const rates = data?.conversion_rates ?? {};
    const phpRate = rates.PHP ?? 56.5;

    return [
      { ticker: "USD/PHP", price_php: phpRate, source: "exchangerate-api", fetched_at: now },
      { ticker: "SGD/PHP", price_php: phpRate / (rates.SGD ?? 1.345), source: "exchangerate-api", fetched_at: now },
      { ticker: "HKD/PHP", price_php: phpRate / (rates.HKD ?? 7.81), source: "exchangerate-api", fetched_at: now },
    ];
  } catch {
    return [
      { ticker: "USD/PHP", price_php: 56.5, source: "fallback", fetched_at: now },
      { ticker: "SGD/PHP", price_php: 42.1, source: "fallback", fetched_at: now },
      { ticker: "HKD/PHP", price_php: 7.23, source: "fallback", fetched_at: now },
    ];
  }
}
