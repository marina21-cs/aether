export interface TrackedCryptoAsset {
  ticker: string;
  name: string;
  coingeckoId: string;
}

export const TRACKED_CRYPTO: TrackedCryptoAsset[] = [
  { ticker: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  { ticker: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
  { ticker: "SOL", name: "Solana", coingeckoId: "solana" },
  { ticker: "BNB", name: "BNB", coingeckoId: "binancecoin" },
  { ticker: "XRP", name: "XRP", coingeckoId: "ripple" },
  { ticker: "ADA", name: "Cardano", coingeckoId: "cardano" },
  { ticker: "AVAX", name: "Avalanche", coingeckoId: "avalanche-2" },
  { ticker: "DOGE", name: "Dogecoin", coingeckoId: "dogecoin" },
];

export const TRACKED_CRYPTO_TICKERS = TRACKED_CRYPTO.map((asset) => asset.ticker);

export const COINGECKO_ID_BY_TICKER: Record<string, string> = TRACKED_CRYPTO.reduce<
  Record<string, string>
>((map, asset) => {
  map[asset.ticker] = asset.coingeckoId;
  return map;
}, {});

export const CRYPTO_NAME_BY_TICKER: Record<string, string> = TRACKED_CRYPTO.reduce<
  Record<string, string>
>((map, asset) => {
  map[asset.ticker] = asset.name;
  return map;
}, {});
