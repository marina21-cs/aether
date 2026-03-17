import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/react";
import { supabase } from "@/src/lib/supabase/client";
import { calculateNetWorth, type NetWorthBreakdown } from "@/src/lib/calculations/net-worth";
import type { Asset, Liability } from "@/src/types/database";

interface PortfolioData {
  assets: Asset[];
  liabilities: Liability[];
  breakdown: NetWorthBreakdown;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePortfolio(): PortfolioData {
  const { user } = useUser();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const [assetsResult, liabilitiesResult] = await Promise.all([
        supabase
          .from("assets")
          .select("*")
          .eq("user_id", user.id)
          .order("current_value_php", { ascending: false }),
        supabase
          .from("liabilities")
          .select("*")
          .eq("user_id", user.id)
          .order("outstanding_balance", { ascending: false }),
      ]);

      if (assetsResult.error) throw assetsResult.error;
      if (liabilitiesResult.error) throw liabilitiesResult.error;

      setAssets((assetsResult.data as Asset[]) ?? []);
      setLiabilities((liabilitiesResult.data as Liability[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch portfolio");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const breakdown = calculateNetWorth(assets, liabilities);

  return { assets, liabilities, breakdown, isLoading, error, refetch: fetchData };
}
