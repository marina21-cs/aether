import { useState, useEffect, useCallback, useRef } from "react";

interface ExchangeRateData {
  PHP: number;
  EUR: number;
  JPY: number;
  SGD: number;
  HKD: number;
}

interface UseExchangeRateReturn {
  rates: ExchangeRateData | null;
  usdToPhp: number;
  status: "fresh" | "stale" | "loading";
  lastUpdated: Date | null;
  refresh: () => void;
}

const FALLBACK_RATES: ExchangeRateData = {
  PHP: 56.5,
  EUR: 0.92,
  JPY: 149.5,
  SGD: 1.34,
  HKD: 7.81,
};

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export function useExchangeRate(): UseExchangeRateReturn {
  const [rates, setRates] = useState<ExchangeRateData | null>(null);
  const [status, setStatus] = useState<"fresh" | "stale" | "loading">("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRates = useCallback(async () => {
    if (!API_KEY) {
      setRates((prev) => prev ?? FALLBACK_RATES);
      setStatus("stale");
      return;
    }

    try {
      const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const cr = data?.conversion_rates;
      if (!cr) throw new Error("No conversion_rates in response");

      setRates({
        PHP: cr.PHP ?? FALLBACK_RATES.PHP,
        EUR: cr.EUR ?? FALLBACK_RATES.EUR,
        JPY: cr.JPY ?? FALLBACK_RATES.JPY,
        SGD: cr.SGD ?? FALLBACK_RATES.SGD,
        HKD: cr.HKD ?? FALLBACK_RATES.HKD,
      });
      setStatus("fresh");
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Exchange rate fetch failed:", err);
      setRates((prev) => prev ?? FALLBACK_RATES);
      setStatus("stale");
    }
  }, []);

  useEffect(() => {
    fetchRates();
    intervalRef.current = setInterval(fetchRates, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchRates]);

  return {
    rates,
    usdToPhp: rates?.PHP ?? FALLBACK_RATES.PHP,
    status,
    lastUpdated,
    refresh: fetchRates,
  };
}
