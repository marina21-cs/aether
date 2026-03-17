import { useMemo, useState } from "react";
import { useUser } from "@clerk/react";
import {
  FileSpreadsheet,
  FileUp,
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  Save,
  ShieldCheck,
  Upload,
  Sparkles,
} from "lucide-react";
import Papa from "papaparse";
import { useDashboard, type Holding } from "./DashboardLayout";
import { cn } from "@/src/lib/utils";
import { apiUrl } from "@/src/lib/api/client";

type TangibleCategory =
  | "vehicle"
  | "collectible"
  | "jewelry"
  | "equipment"
  | "property_fixture"
  | "other";

interface TangibleMeta {
  category: TangibleCategory;
  legalAttested: boolean;
  proofFileName: string | null;
  proofFileSize: number | null;
}

interface CsvAnalyzeResponse {
  parserUsed: "heuristic" | "ai-fallback";
  detectedColumns: string[];
  skippedRows: number;
  warnings: string[];
  insights: string[];
  aiSummary: string | null;
  advisorPromptSuggestion?: string;
  holdings: Array<{
    name: string;
    ticker: string;
    type: string;
    qty: number;
    avgCost: number;
    currency: string;
    manualPrice: number | null;
    metadata?: Record<string, unknown>;
  }>;
}

interface PersistedAssetRow {
  asset_class: string;
  ticker_or_name: string;
  quantity: number;
  avg_cost_basis: number | null;
  current_value_php: number;
  native_currency: string;
  is_manual: boolean;
  notes: string | null;
}

type ManualWizardStep = 1 | 2 | 3;

const LEGAL_ATTESTATION_TEXT =
  "I confirm this asset is legally owned by me (or my legal entity), and I have permission to upload related documentation. AETHER tracks analytics only and does not establish legal title or custody.";

const SAMPLE_HOLDINGS_CSV = [
  "name,ticker,type,qty,avg_cost,manual_price,currency",
  "BDO Unibank,BDO,PH Stocks,120,145.50,151.20,PHP",
  "SM Investments,SM,PH Stocks,15,845.00,889.50,PHP",
  "Apple Inc,AAPL,US Stocks,8,172.40,184.20,USD",
  "Bitcoin,BTC,Crypto,0.125,60000,,USD",
  "Emergency Fund,CASH_PHP,Cash,1,250000,250000,PHP",
  "Corporate Bond Fund,BOND01,Bonds,40,102.35,104.10,USD",
  "Family SUV,SUV2022,Tangible Assets,1,1200000,1180000,PHP",
].join("\n");

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };

    const message = typeof maybeError.message === "string" ? maybeError.message.trim() : "";
    const details = typeof maybeError.details === "string" ? maybeError.details.trim() : "";
    const hint = typeof maybeError.hint === "string" ? maybeError.hint.trim() : "";
    const code = typeof maybeError.code === "string" ? maybeError.code.trim() : "";

    const parts = [message, details, hint ? `Hint: ${hint}` : "", code ? `Code: ${code}` : ""]
      .filter((part) => part.length > 0);

    if (parts.length > 0) {
      return parts.join(" ");
    }
  }

  return fallback;
}

async function parseApiPayload(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function extractApiErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "error" in payload) {
    const message = (payload as { error?: { message?: string } }).error?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload.slice(0, 240);
  }

  return fallback;
}

function buildHoldingKey(holding: Holding): string {
  return `${holding.ticker}::${holding.name}`;
}

function normalizeType(type: string): Holding["type"] {
  const lower = type.toLowerCase();
  if (lower.includes("tangible") || lower.includes("vehicle") || lower.includes("collectible") || lower.includes("jewel") || lower.includes("art") || lower.includes("equipment")) {
    return "Tangible Assets";
  }
  if (lower.includes("ph")) return "PH Stocks";
  if (lower.includes("us")) return "US Stocks";
  if (lower.includes("crypto")) return "Crypto";
  if (lower.includes("cash")) return "Cash";
  return "Bonds";
}

function inferTicker(name: string): string {
  const compact = name
    .replace(/[^A-Za-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((token) => token.slice(0, 1).toUpperCase())
    .join("");

  return compact || `ASSET-${Date.now().toString().slice(-4)}`;
}

function toHoldingType(type: string): Holding["type"] {
  if (
    type === "PH Stocks" ||
    type === "US Stocks" ||
    type === "Crypto" ||
    type === "Cash" ||
    type === "Bonds" ||
    type === "Tangible Assets"
  ) {
    return type;
  }
  return normalizeType(type);
}

function safeJsonParse(input: string | null): Record<string, unknown> | null {
  if (!input) return null;
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Ignore malformed JSON notes.
  }
  return null;
}

function parseLooseNumber(raw: string | undefined): number {
  const text = (raw || "").trim();
  if (!text) return 0;

  const cleaned = text
    .replace(/[\u20b1$,\s]/g, "")
    .replace(/^\((.*)\)$/, "-$1")
    .replace(/[^0-9.-]/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

function inferCurrency(
  rawCurrency: string | undefined,
  resolvedType: Holding["type"],
  ticker: string
): "PHP" | "USD" {
  const normalized = (rawCurrency || "").toUpperCase().trim();
  if (normalized === "USD") return "USD";
  if (normalized === "PHP") return "PHP";

  if (resolvedType === "US Stocks" || resolvedType === "Crypto") return "USD";
  if (/AAPL|NVDA|MSFT|TSLA|AMZN|GOOGL|META|SPY|QQQ/.test(ticker.toUpperCase())) return "USD";
  return "PHP";
}

function fallbackParseCsv(text: string): Holding[] {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) =>
      header
        .trim()
        .toLowerCase()
        .replace(/[\s\-/]+/g, "_")
        .replace(/[^a-z0-9_]/g, ""),
  });

  const rows = parsed.data
    .map((row) => {
      const name =
        row.name ||
        row.asset ||
        row.asset_name ||
        row.description ||
        row.instrument ||
        row.particulars ||
        "";
      const ticker =
        row.ticker ||
        row.symbol ||
        row.stock_code ||
        row.code ||
        row.instrument_code ||
        inferTicker(name);
      const type = row.type || row.asset_type || row.category || row.class || "PH Stocks";
      let qty = parseLooseNumber(
        row.qty || row.quantity || row.shares || row.units || row.holding_quantity || row.volume
      );
      let avgCost = parseLooseNumber(
        row.avg_cost ||
          row.average_cost ||
          row.avg_price ||
          row.average_price ||
          row.cost_basis ||
          row.cost ||
          row.buy_price ||
          row.price_per_unit
      );
      let manualPrice = parseLooseNumber(
        row.manual_price || row.current_price || row.market_price || row.last_price || row.price
      );
      const marketValue = parseLooseNumber(
        row.market_value || row.current_value || row.value || row.amount || row.balance || row.total_value
      );

      if (!name && !ticker) return null;

      const resolvedType = toHoldingType(type);

      if (qty <= 0 && marketValue > 0) {
        if (manualPrice > 0) {
          qty = marketValue / manualPrice;
        } else if (avgCost > 0) {
          qty = marketValue / avgCost;
        }
      }

      if (resolvedType === "Cash" && qty <= 0 && marketValue > 0) {
        qty = 1;
        avgCost = marketValue;
        manualPrice = marketValue;
      }

      if (qty <= 0) return null;

      if (avgCost <= 0 && manualPrice > 0) {
        avgCost = manualPrice;
      }

      if (manualPrice <= 0 && marketValue > 0) {
        manualPrice = marketValue / qty;
      }

      const resolvedAvgCost = Number.isFinite(avgCost) && avgCost > 0 ? avgCost : 0;
      const resolvedManualPrice =
        resolvedType === "Crypto"
          ? Number.isFinite(manualPrice) && manualPrice > 0
            ? manualPrice
            : null
          : Number.isFinite(manualPrice) && manualPrice > 0
            ? manualPrice
            : resolvedAvgCost;

      const holding: Holding = {
        name: name || ticker,
        ticker: String(ticker).toUpperCase(),
        type: resolvedType,
        qty,
        avgCost: resolvedAvgCost,
        currency: inferCurrency(row.currency || row.ccy, resolvedType, String(ticker)),
        manualPrice: resolvedManualPrice,
      };

      return holding;
    })
    .filter((row): row is Holding => row !== null);

  return rows;
}

  function mapAssetClassToType(assetClass: string): Holding["type"] {
  if (assetClass === "pse_stock") return "PH Stocks";
  if (assetClass === "global_stock") return "US Stocks";
  if (assetClass === "crypto") return "Crypto";
  if (assetClass === "cash") return "Cash";
  if (assetClass === "other") return "Tangible Assets";
  return "Bonds";
}

function toTangibleCategory(raw: unknown): TangibleCategory {
  if (
    raw === "vehicle" ||
    raw === "collectible" ||
    raw === "jewelry" ||
    raw === "equipment" ||
    raw === "property_fixture"
  ) {
    return raw;
  }
  return "other";
}

export function ImportData() {
  const { user } = useUser();
  const { holdings, setHoldings, usdToPhp, formatDisplay, getTotalPortfolio } = useDashboard();

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [aiImportSummary, setAiImportSummary] = useState<string | null>(null);
  const [advisorPromptHint, setAdvisorPromptHint] = useState<string | null>(null);

  const [tangibleMetaByKey, setTangibleMetaByKey] = useState<Record<string, TangibleMeta>>({});
  const [manualStep, setManualStep] = useState<ManualWizardStep>(1);
  const [manualDraft, setManualDraft] = useState({
    name: "",
    ticker: "",
    type: "PH Stocks" as Holding["type"],
    currency: "PHP" as "PHP" | "USD",
    qty: "",
    avgCost: "",
    manualPrice: "",
    useLivePriceForCrypto: true,
    category: "vehicle" as TangibleCategory,
    legalAttested: false,
    proofFile: null as File | null,
  });

  const totalValue = getTotalPortfolio();

  const tangibleCount = useMemo(
    () => holdings.filter((holding) => holding.type === "Tangible Assets").length,
    [holdings]
  );

  const resetManualDraft = () => {
    setManualStep(1);
    setManualDraft({
      name: "",
      ticker: "",
      type: "PH Stocks",
      currency: "PHP",
      qty: "",
      avgCost: "",
      manualPrice: "",
      useLivePriceForCrypto: true,
      category: "vehicle",
      legalAttested: false,
      proofFile: null,
    });
  };

  const persistHoldingsToSupabase = async (
    holdingsToSave: Holding[],
    tangibleMetaMap: Record<string, TangibleMeta>,
    contextLabel: string
  ) => {
    if (!user) {
      return;
    }

    const response = await fetch(apiUrl("/api/v1/data/save-assets"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? null,
        fullName: user.fullName ?? null,
        holdings: holdingsToSave,
        tangibleMetaByKey: tangibleMetaMap,
        usdToPhp,
        contextLabel,
      }),
    });

    const payload = await parseApiPayload(response);
    if (!response.ok) {
      throw new Error(extractApiErrorMessage(payload, "Failed to save holdings."));
    }
  };

  const applyImportedHoldings = async (
    nextHoldings: Holding[],
    nextTangibleMeta: Record<string, TangibleMeta>,
    statusMessage: string
  ) => {
    setHoldings(nextHoldings);
    setTangibleMetaByKey(nextTangibleMeta);

    if (!user) {
      setStatus(statusMessage);
      return;
    }

    setBusy(true);
    try {
      await persistHoldingsToSupabase(nextHoldings, nextTangibleMeta, "import_pipeline");
      setStatus(`${statusMessage} Synced to Supabase and now visible in Dashboard and Holdings.`);
    } catch (error) {
      const detail = toErrorMessage(error, "Failed to sync imported holdings.");
      setStatus(`${statusMessage} Loaded locally. Supabase sync failed: ${detail}`);
    } finally {
      setBusy(false);
    }
  };

  const onDownloadSampleCsv = () => {
    downloadTextFile("aether_sample_holdings.csv", SAMPLE_HOLDINGS_CSV);
    setStatus("Downloaded sample holdings CSV.");
  };

  const analyzeCsvOnServer = async (csvText: string): Promise<CsvAnalyzeResponse> => {
    const response = await fetch(apiUrl("/api/v1/data/analyze-csv"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        csvText,
      }),
    });

    const raw = await response.text();
    let payload: unknown = null;
    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? (payload as { error?: { message?: string } }).error?.message
          : "CSV analysis failed.";
      throw new Error(message || "CSV analysis failed.");
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Unexpected CSV analysis response from server.");
    }

    return payload as CsvAnalyzeResponse;
  };

  const onCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setStatus(`Analyzing ${file.name}...`);

    try {
      const csvText = await file.text();
      let parsedHoldings: Holding[] = [];
      let nextMetaMap: Record<string, TangibleMeta> = {};
      let parserLabel = "fallback";

      try {
        if (!user?.id) {
          throw new Error("No authenticated user for server-side CSV analysis.");
        }

        const analysis = await analyzeCsvOnServer(csvText);
        parserLabel = analysis.parserUsed;
        parsedHoldings = [];
        nextMetaMap = {};

        for (const item of analysis.holdings) {
          const resolvedName = String(item.name || item.ticker || "").trim();
          const resolvedTicker = String(item.ticker || inferTicker(resolvedName)).toUpperCase();
          if (!resolvedName && !resolvedTicker) continue;

          const normalizedType = toHoldingType(item.type);
          const currency = item.currency === "USD" ? "USD" : "PHP";
          const manualPrice =
            normalizedType === "Crypto"
              ? item.manualPrice
              : item.manualPrice ?? item.avgCost;
          const qty = Number(item.qty) || 0;
          if (qty <= 0) continue;

          const holding: Holding = {
            name: resolvedName || resolvedTicker,
            ticker: resolvedTicker,
            type: normalizedType,
            qty,
            avgCost: Number(item.avgCost) || 0,
            currency,
            manualPrice,
          };

          parsedHoldings.push(holding);

          if (holding.type === "Tangible Assets") {
            const rawMeta = item.metadata || {};
            nextMetaMap[buildHoldingKey(holding)] = {
              category: toTangibleCategory(rawMeta.tangible_category),
              legalAttested: rawMeta.legal_attested === false ? false : true,
              proofFileName:
                typeof rawMeta.proof_file_name === "string" ? rawMeta.proof_file_name : null,
              proofFileSize:
                typeof rawMeta.proof_file_size === "number" ? rawMeta.proof_file_size : null,
            };
          }
        }

        setAiImportSummary(analysis.aiSummary || analysis.insights.join(" "));
        setAdvisorPromptHint(analysis.advisorPromptSuggestion || null);

        const parsedWarnings = analysis.warnings.length > 0
          ? ` (${analysis.warnings.length} parsing warning${analysis.warnings.length > 1 ? "s" : ""})`
          : "";

        if (parsedHoldings.length === 0) {
          throw new Error("No valid holdings found in uploaded CSV.");
        }

        await applyImportedHoldings(
          parsedHoldings,
          nextMetaMap,
          `Loaded ${parsedHoldings.length} holdings via ${parserLabel} parser${parsedWarnings}.`
        );
      } catch {
        parsedHoldings = fallbackParseCsv(csvText);
        if (parsedHoldings.length === 0) {
          throw new Error("No valid holdings found in uploaded CSV.");
        }
        setAiImportSummary(null);
        setAdvisorPromptHint(null);
        await applyImportedHoldings(
          parsedHoldings,
          nextMetaMap,
          `Loaded ${parsedHoldings.length} holdings using local fallback parser.`
        );
      }
    } catch (error) {
      setStatus(toErrorMessage(error, "Failed to read CSV upload."));
    } finally {
      setBusy(false);
    }

    event.target.value = "";
  };

  const onAddManualHolding = async () => {
    const name = manualDraft.name.trim();
    const ticker = (manualDraft.ticker.trim() || inferTicker(name)).toUpperCase();
    const qty = Number(manualDraft.qty);
    const avgCost = Number(manualDraft.avgCost);
    const manualPrice = Number(manualDraft.manualPrice);

    if (!name) {
      setStatus("Asset name is required.");
      return;
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      setStatus("Quantity must be greater than zero.");
      return;
    }

    if (!Number.isFinite(avgCost) || avgCost < 0) {
      setStatus("Average cost must be zero or greater.");
      return;
    }

    if (manualDraft.type === "Tangible Assets" && !manualDraft.legalAttested) {
      setStatus("Tangible assets require legal attestation before adding.");
      return;
    }

    const resolvedManualPrice =
      manualDraft.type === "Crypto" && manualDraft.useLivePriceForCrypto
        ? null
        : Number.isFinite(manualPrice) && manualPrice > 0
          ? manualPrice
          : avgCost;

    const newHolding: Holding = {
      name,
      ticker,
      type: manualDraft.type,
      qty,
      avgCost,
      currency: manualDraft.currency,
      manualPrice: resolvedManualPrice,
    };

    const nextHoldings = [...holdings, newHolding];
    const key = buildHoldingKey(newHolding);
    const nextMeta = {
      ...tangibleMetaByKey,
      ...(manualDraft.type === "Tangible Assets"
        ? {
            [key]: {
              category: manualDraft.category,
              legalAttested: manualDraft.legalAttested,
              proofFileName: manualDraft.proofFile?.name || null,
              proofFileSize: manualDraft.proofFile?.size || null,
            },
          }
        : {}),
    };

    setBusy(true);
    try {
      setHoldings(nextHoldings);
      setTangibleMetaByKey(nextMeta);
      await persistHoldingsToSupabase(nextHoldings, nextMeta, "manual_wizard");
      setStatus("Manual holding added and synced to Dashboard + Holdings.");
      resetManualDraft();
    } catch (error) {
      setStatus(toErrorMessage(error, "Failed to save manual holding."));
    } finally {
      setBusy(false);
    }
  };

  const onSaveToSupabase = async () => {
    if (!user) {
      setStatus("Sign in first to save your holdings.");
      return;
    }

    if (holdings.length === 0) {
      setStatus("No holdings to save yet.");
      return;
    }

    try {
      setBusy(true);
      setStatus("Saving holdings to Supabase...");
      await persistHoldingsToSupabase(holdings, tangibleMetaByKey, "manual_save");
      setStatus(`Saved ${holdings.length} holdings to Supabase.`);
    } catch (error) {
      setStatus(toErrorMessage(error, "Failed to save holdings."));
    } finally {
      setBusy(false);
    }
  };

  const onLoadFromSupabase = async () => {
    if (!user) {
      setStatus("Sign in first to load holdings.");
      return;
    }

    setBusy(true);
    setStatus("Loading holdings from Supabase...");

    try {
      const response = await fetch(
        apiUrl(`/api/v1/data/assets?userId=${encodeURIComponent(user.id)}`)
      );
      const payload = await parseApiPayload(response);
      if (!response.ok) {
        throw new Error(extractApiErrorMessage(payload, "Failed to load holdings."));
      }

      const data =
        payload && typeof payload === "object" && "assets" in payload
          ? (payload as { assets?: PersistedAssetRow[] }).assets
          : null;

      if (!data || data.length === 0) {
        setStatus("No saved holdings found in Supabase yet. Upload a CSV or add assets manually.");
        return;
      }

      const nextTangibleMeta: Record<string, TangibleMeta> = {};

      const hydrated: Holding[] = data.map((asset) => {
        const notes = safeJsonParse(asset.notes);
        const isTangible = notes?.is_tangible_asset === true;

        const typeFromNotes =
          typeof notes?.type === "string"
            ? (notes.type as Holding["type"])
            : mapAssetClassToType(asset.asset_class);

        const resolvedType: Holding["type"] =
          isTangible || typeFromNotes === "Tangible Assets"
            ? "Tangible Assets"
            : typeFromNotes;

        const holding: Holding = {
          name: typeof notes?.name === "string" ? notes.name : asset.ticker_or_name,
          ticker:
            typeof notes?.ticker === "string"
              ? notes.ticker
              : asset.ticker_or_name,
          type: resolvedType,
          qty: Number(asset.quantity) || 0,
          avgCost: Number(asset.avg_cost_basis) || 0,
          currency: asset.native_currency === "USD" ? "USD" : "PHP",
          manualPrice:
            typeof notes?.manualPrice === "number"
              ? notes.manualPrice
              : asset.is_manual && asset.quantity > 0
                ? Number(asset.current_value_php) / Number(asset.quantity)
                : null,
        };

        if (holding.type === "Tangible Assets") {
          nextTangibleMeta[buildHoldingKey(holding)] = {
            category: toTangibleCategory(notes?.tangible_category),
            legalAttested: notes?.legal_attested === false ? false : true,
            proofFileName:
              typeof notes?.proof_file_name === "string"
                ? notes.proof_file_name
                : null,
            proofFileSize:
              typeof notes?.proof_file_size === "number"
                ? notes.proof_file_size
                : null,
          };
        }

        return holding;
      });

      setHoldings(hydrated);
      setTangibleMetaByKey(nextTangibleMeta);
      setStatus(`Loaded ${hydrated.length} holdings from Supabase.`);
    } catch (error) {
      setStatus(toErrorMessage(error, "Failed to load holdings."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
          Data Ingestion
        </span>
        <h1 className="font-display text-3xl font-bold text-text-primary">CSV Holdings + Tangible Assets</h1>
        <p className="text-sm text-text-secondary">
          Upload broker or bank CSV data, let AI normalize it, and auto-sync to Dashboard + Holdings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="glass-panel rounded-2xl border border-glass-border p-6 lg:col-span-2">
          <h2 className="mb-4 flex items-center font-display text-lg font-bold text-text-primary">
            <Upload className="mr-2 h-5 w-5 text-accent-primary" />
            CSV + AI Import Pipeline
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-glass-border bg-bg-surface px-4 py-3 text-sm text-text-primary hover:bg-white/5">
              <FileSpreadsheet className="h-4 w-4" /> Upload CSV
              <input type="file" accept=".csv" className="hidden" onChange={onCsvUpload} />
            </label>

            <button
              type="button"
              onClick={onDownloadSampleCsv}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-glass-border bg-bg-surface px-4 py-3 text-sm text-text-primary hover:bg-white/5"
            >
              <Download className="h-4 w-4" /> Download Sample CSV
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={onLoadFromSupabase}
              className="rounded-xl border border-glass-border bg-bg-surface px-4 py-3 text-sm text-text-primary hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Load From Supabase
            </button>
          </div>

          {aiImportSummary && (
            <div className="mt-4 rounded-xl border border-accent-secondary/40 bg-accent-secondary/10 p-4 text-sm text-text-secondary">
              <p className="inline-flex items-center font-semibold text-accent-secondary">
                <Sparkles className="mr-1 h-4 w-4" /> AI Import Analysis
              </p>
              <p className="mt-1 whitespace-pre-wrap">{aiImportSummary}</p>
              {advisorPromptHint && (
                <p className="mt-2 text-xs text-text-muted">
                  Suggested advisor prompt: <span className="font-medium text-text-secondary">{advisorPromptHint}</span>
                </p>
              )}
            </div>
          )}

          <div className="mt-3">
            <button
              type="button"
              disabled={busy || holdings.length === 0}
              onClick={onSaveToSupabase}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-semibold text-[#09090B] hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> Save Holdings To Supabase
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-glass-border bg-bg-surface p-4">
            <h3 className="mb-3 flex items-center text-sm font-semibold text-text-primary">
              <Plus className="mr-2 h-4 w-4 text-accent-warning" />
              Manual Add Wizard (Slides)
            </h3>

            <div className="mb-3 flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={`manual-step-${step}`}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    manualStep >= step ? "bg-accent-warning" : "bg-glass-border"
                  )}
                />
              ))}
              <span className="ml-2 text-xs text-text-muted">Step {manualStep} of 3</span>
            </div>

            {manualStep === 1 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={manualDraft.name}
                  onChange={(event) =>
                    setManualDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Asset name"
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
                />

                <input
                  type="text"
                  value={manualDraft.ticker}
                  onChange={(event) =>
                    setManualDraft((prev) => ({ ...prev, ticker: event.target.value.toUpperCase() }))
                  }
                  placeholder="Ticker/Symbol (optional)"
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
                />

                <select
                  value={manualDraft.type}
                  onChange={(event) => {
                    const type = event.target.value as Holding["type"];
                    setManualDraft((prev) => ({
                      ...prev,
                      type,
                      currency: type === "US Stocks" || type === "Crypto" ? "USD" : "PHP",
                    }));
                  }}
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary focus:border-accent-primary/60 focus:outline-none"
                >
                  <option value="PH Stocks">PH Stocks</option>
                  <option value="US Stocks">US Stocks</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Cash">Cash</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Tangible Assets">Tangible Assets</option>
                </select>

                <select
                  value={manualDraft.currency}
                  onChange={(event) =>
                    setManualDraft((prev) => ({ ...prev, currency: event.target.value as "PHP" | "USD" }))
                  }
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary focus:border-accent-primary/60 focus:outline-none"
                >
                  <option value="PHP">PHP</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            )}

            {manualStep === 2 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={manualDraft.qty}
                  onChange={(event) =>
                    setManualDraft((prev) => ({ ...prev, qty: event.target.value }))
                  }
                  placeholder="Quantity"
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
                />

                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={manualDraft.avgCost}
                  onChange={(event) =>
                    setManualDraft((prev) => ({ ...prev, avgCost: event.target.value }))
                  }
                  placeholder="Average cost"
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
                />

                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={manualDraft.manualPrice}
                  onChange={(event) =>
                    setManualDraft((prev) => ({ ...prev, manualPrice: event.target.value }))
                  }
                  placeholder="Manual/current price"
                  className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
                />

                {manualDraft.type === "Crypto" && (
                  <label className="flex items-center gap-2 rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-secondary">
                    <input
                      type="checkbox"
                      checked={manualDraft.useLivePriceForCrypto}
                      onChange={(event) =>
                        setManualDraft((prev) => ({ ...prev, useLivePriceForCrypto: event.target.checked }))
                      }
                    />
                    Use live crypto feed instead of fixed manual price
                  </label>
                )}
              </div>
            )}

            {manualStep === 3 && (
              <div className="space-y-3">
                {manualDraft.type === "Tangible Assets" && (
                  <>
                    <select
                      value={manualDraft.category}
                      onChange={(event) =>
                        setManualDraft((prev) => ({
                          ...prev,
                          category: event.target.value as TangibleCategory,
                        }))
                      }
                      className="w-full rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary focus:border-accent-primary/60 focus:outline-none"
                    >
                      <option value="vehicle">Vehicle</option>
                      <option value="collectible">Collectible</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="equipment">Equipment</option>
                      <option value="property_fixture">Property Fixture</option>
                      <option value="other">Other</option>
                    </select>

                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-secondary hover:bg-white/[0.03]">
                      <FileUp className="h-4 w-4 text-accent-secondary" />
                      <span>
                        {manualDraft.proofFile
                          ? `Proof attached: ${manualDraft.proofFile.name}`
                          : "Attach optional proof file (PDF/JPG/PNG)"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null;
                          setManualDraft((prev) => ({ ...prev, proofFile: file }));
                        }}
                      />
                    </label>

                    <label
                      className={cn(
                        "flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed",
                        manualDraft.legalAttested
                          ? "border-accent-success/40 bg-accent-success/10 text-text-primary"
                          : "border-glass-border bg-bg-dark text-text-secondary"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={manualDraft.legalAttested}
                        onChange={(event) =>
                          setManualDraft((prev) => ({ ...prev, legalAttested: event.target.checked }))
                        }
                        className="mt-0.5"
                      />
                      <span>{LEGAL_ATTESTATION_TEXT}</span>
                    </label>
                  </>
                )}

                <div className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-secondary">
                  <p className="font-medium text-text-primary">Review</p>
                  <p className="mt-1">{manualDraft.name || "Unnamed"} • {(manualDraft.ticker || inferTicker(manualDraft.name)).toUpperCase()} • {manualDraft.type}</p>
                  <p>
                    Qty {manualDraft.qty || "0"} • Avg {manualDraft.avgCost || "0"} • Currency {manualDraft.currency}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setManualStep((prev) => (prev > 1 ? ((prev - 1) as ManualWizardStep) : prev))}
                disabled={manualStep === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-secondary disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>

              {manualStep < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (manualStep === 1 && !manualDraft.name.trim()) {
                      setStatus("Manual wizard: add asset name before moving to the next step.");
                      return;
                    }
                    if (manualStep === 2) {
                      const qty = Number(manualDraft.qty);
                      if (!Number.isFinite(qty) || qty <= 0) {
                        setStatus("Manual wizard: quantity must be greater than zero.");
                        return;
                      }
                    }
                    setManualStep((prev) => ((prev + 1) as ManualWizardStep));
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-2 text-xs font-semibold text-[#09090B] hover:bg-accent-primary/90"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onAddManualHolding}
                  className="inline-flex items-center gap-1 rounded-lg border border-accent-warning/40 bg-accent-warning/10 px-3 py-2 text-xs font-medium text-accent-warning hover:bg-accent-warning/20 disabled:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" /> Add to Dashboard
                </button>
              )}
            </div>
          </div>

          {status && (
            <p className="mt-4 rounded-lg border border-glass-border bg-bg-surface px-3 py-2 text-sm text-text-secondary">
              {status}
            </p>
          )}
        </section>

        <section className="glass-panel rounded-2xl border border-glass-border p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Portfolio Snapshot</h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>Loaded Holdings</span>
              <span className="tabular-nums text-text-primary" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {holdings.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tangible Assets</span>
              <span className="tabular-nums text-accent-warning" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {tangibleCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Total (PHP)</span>
              <span className="tabular-nums text-text-primary" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {formatDisplay(totalValue)}
              </span>
            </div>
            <div className="rounded-lg border border-glass-border bg-bg-surface p-3 text-xs">
              Recognized CSV styles: holdings exports, bank position exports, and custom headers mapped by AI/heuristics.
            </div>
            <div className="rounded-lg border border-accent-success/30 bg-accent-success/10 p-3 text-xs text-text-secondary">
              <p className="inline-flex items-center font-semibold text-accent-success">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Tangible Asset Legal Scope
              </p>
              <p className="mt-1">
                Tangible assets are stored as user-declared analytics entries. AETHER does not verify title, custody, or transfer rights.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
