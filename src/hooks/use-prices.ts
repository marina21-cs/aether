import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase/client";
import { fetchCryptoPrices, fetchUsdToPhp, fetchForexRates, type PriceData } from "@/src/lib/api/prices";

interface PricesState {
  prices: PriceData[];
  usdToPhp: number;
  isLoading: boolean;
  error: string | null;
  refreshPrices: (cryptoTickers?: string[]) => Promise<void>;
}

export function usePrices(): PricesState {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [usdToPhp, setUsdToPhp] = useState(56.5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPrices = useCallback(async (cryptoTickers: string[] = ["BTC", "ETH", "SOL"]) => {
    setIsLoading(true);
    setError(null);

    try {
      const rate = await fetchUsdToPhp();
      setUsdToPhp(rate);

      const [cryptoPrices, forexRates] = await Promise.all([
        fetchCryptoPrices(cryptoTickers, rate),
        fetchForexRates(),
      ]);

      const allPrices = [...cryptoPrices, ...forexRates];
      setPrices(allPrices);

      // Cache prices in Supabase
      if (allPrices.length > 0) {
        await supabase.from("price_cache").upsert(
          allPrices.map((p) => ({
            ticker: p.ticker,
            price_php: p.price_php,
            source: p.source,
            fetched_at: p.fetched_at,
          })),
          { onConflict: "ticker" }
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prices");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load cached prices first
    supabase
      .from("price_cache")
      .select("*")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPrices(data.map((d) => ({
            ticker: d.ticker,
            price_php: Number(d.price_php),
            source: d.source,
            fetched_at: d.fetched_at,
          })));
        }
      });

    refreshPrices();
  }, [refreshPrices]);

  return { prices, usdToPhp, isLoading, error, refreshPrices };
}
