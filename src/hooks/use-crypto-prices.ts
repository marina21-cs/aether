import { useState, useEffect, useCallback, useRef } from "react";
import { COINGECKO_ID_BY_TICKER } from "@/src/lib/market-universe";

interface CryptoPriceMap {
  [ticker: string]: number; // price in USD
}

interface UseCryptoPricesReturn {
  prices: CryptoPriceMap;
  previousPrices: CryptoPriceMap;
  loading: boolean;
  lastUpdated: Date | null;
  refresh: () => void;
}

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const REFRESH_INTERVAL = 60 * 1000; // 60 seconds

export function useCryptoPrices(): UseCryptoPricesReturn {
  const [prices, setPrices] = useState<CryptoPriceMap>({});
  const [previousPrices, setPreviousPrices] = useState<CryptoPriceMap>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = Object.values(COINGECKO_ID_BY_TICKER).join(",");
      const params = new URLSearchParams({
        vs_currencies: "usd",
        ids,
      });
      if (API_KEY) {
        params.set("x_cg_demo_api_key", API_KEY);
      }

      const url = `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`;
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.error("CoinGecko API error:", response.status);
        return;
      }

      const data = await response.json();

      setPrices((prev) => {
        setPreviousPrices(prev);

        const newPrices: CryptoPriceMap = {};
        for (const [ticker, coinId] of Object.entries(COINGECKO_ID_BY_TICKER)) {
          const priceUsd = data?.[coinId]?.usd;
          if (priceUsd != null) {
            newPrices[ticker] = priceUsd;
          }
        }
        return newPrices;
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error("CoinGecko fetch error:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrices]);

  return {
    prices,
    previousPrices,
    loading,
    lastUpdated,
    refresh: fetchPrices,
  };
}
