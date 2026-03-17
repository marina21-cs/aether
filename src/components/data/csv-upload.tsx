import { useCallback, useRef, useState } from "react";
import { useDashboard, type Holding } from "@/src/pages/DashboardLayout";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

type AssetType = Holding["type"];

const VALID_TYPES: AssetType[] = [
  "PH Stocks",
  "US Stocks",
  "Crypto",
  "Cash",
  "Bonds",
  "Tangible Assets",
];

function normalizeType(raw: string): AssetType {
  const lower = raw.trim().toLowerCase();
  if (lower.includes("ph") || lower.includes("pse")) return "PH Stocks";
  if (lower.includes("us") || lower.includes("nyse") || lower.includes("nasdaq")) return "US Stocks";
  if (lower.includes("crypto") || lower.includes("coin") || lower.includes("token")) return "Crypto";
  if (lower.includes("bond") || lower.includes("fixed")) return "Bonds";
  if (lower.includes("tangible") || lower.includes("vehicle") || lower.includes("collectible")) return "Tangible Assets";
  if (lower.includes("cash") || lower.includes("money") || lower.includes("savings")) return "Cash";
  return "PH Stocks";
}

function parseCsvToHoldings(text: string): Holding[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const cols = header.split(",").map((c) => c.trim());

  // Find column indices
  const nameIdx = cols.findIndex((c) => c.includes("name"));
  const tickerIdx = cols.findIndex((c) => c.includes("ticker") || c.includes("symbol"));
  const typeIdx = cols.findIndex((c) => c.includes("type") || c.includes("class"));
  const qtyIdx = cols.findIndex((c) => c.includes("qty") || c.includes("quantity") || c.includes("shares"));
  const costIdx = cols.findIndex((c) => c.includes("cost") || c.includes("avg") || c.includes("price"));

  const results: Holding[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((c) => c.trim());
    if (row.length < 3) continue;

    const name = nameIdx >= 0 ? row[nameIdx] : row[0];
    const ticker = tickerIdx >= 0 ? row[tickerIdx] : row[1];
    const type = typeIdx >= 0 ? normalizeType(row[typeIdx]) : "PH Stocks";
    const qty = qtyIdx >= 0 ? parseFloat(row[qtyIdx]) : parseFloat(row[3] || "0");
    const avgCost = costIdx >= 0 ? parseFloat(row[costIdx]) : parseFloat(row[4] || "0");

    if (!name || !ticker || isNaN(qty) || isNaN(avgCost)) continue;

    const currency = type === "PH Stocks" || type === "Cash" ? "PHP" : "USD";

    results.push({
      name: name.replace(/"/g, ""),
      ticker: ticker.replace(/"/g, "").toUpperCase(),
      type,
      qty,
      avgCost,
      currency: currency as "PHP" | "USD",
      manualPrice: type === "Crypto" ? null : avgCost, // Crypto uses live, others manual
    });
  }

  return results;
}

export function CsvUpload() {
  const { setHoldings } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [importCount, setImportCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setStatus("error");
        setErrorMsg("Please upload a .csv file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = parseCsvToHoldings(text);

          if (parsed.length === 0) {
            setStatus("error");
            setErrorMsg("No valid holdings found in CSV. Expected columns: Name, Ticker, Type, Qty, Avg Cost");
            return;
          }

          setHoldings((prev) => [...prev, ...parsed]);
          setImportCount(parsed.length);
          setStatus("success");

          // Reset after 4 seconds
          setTimeout(() => {
            setStatus("idle");
            setImportCount(0);
          }, 4000);
        } catch {
          setStatus("error");
          setErrorMsg("Failed to parse CSV file");
        }
      };
      reader.readAsText(file);
    },
    [setHoldings]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFile]
  );

  return (
    <div
      className="card-fade-in rounded-[12px] border p-6"
      style={{
        backgroundColor: "#111113",
        borderColor: "rgba(255,255,255,0.07)",
        animationDelay: "300ms",
      }}
    >
      <h3
        className="mb-4 text-sm font-semibold text-text-primary"
        style={{ fontFamily: "TT Bakers, serif" }}
      >
        Import Holdings
      </h3>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-[10px] border-2 border-dashed p-8 transition-all duration-200",
          dragging
            ? "border-accent-primary bg-[rgba(110,231,183,0.06)]"
            : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.02)]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleInputChange}
        />

        {status === "success" ? (
          <>
            <CheckCircle size={32} className="text-accent-primary" />
            <p className="text-sm font-medium text-accent-primary">
              {importCount} holding{importCount !== 1 ? "s" : ""} imported
            </p>
          </>
        ) : status === "error" ? (
          <>
            <X size={32} className="text-accent-danger" />
            <p className="text-sm text-accent-danger">{errorMsg}</p>
          </>
        ) : (
          <>
            <Upload size={32} className="text-text-muted" />
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Drop CSV here or <span className="text-accent-primary underline">browse</span>
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Columns: Name, Ticker, Type, Qty, Avg Cost
              </p>
            </div>
          </>
        )}
      </div>

      {/* Sample CSV hint */}
      <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
        <FileText size={12} />
        <span>Supported: COL Financial, custom CSV formats</span>
      </div>
    </div>
  );
}
