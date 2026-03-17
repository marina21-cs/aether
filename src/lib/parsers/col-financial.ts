import Papa from "papaparse";

export interface COLTransaction {
  tradeDate: string;
  settlementDate: string;
  stockCode: string;
  action: "BUY" | "SELL";
  quantity: number;
  price: number;
  grossAmount: number;
  fees: number;
  netAmount: number;
}

export interface ParseResult {
  transactions: COLTransaction[];
  errors: string[];
  rowCount: number;
}

export function parseCOLFinancialCSV(csvText: string): ParseResult {
  const errors: string[] = [];

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  if (result.errors.length > 0) {
    errors.push(
      ...result.errors.map((e) => `Row ${e.row}: ${e.message}`)
    );
  }

  const transactions: COLTransaction[] = [];

  for (let i = 0; i < result.data.length; i++) {
    const row = result.data[i] as Record<string, string>;

    try {
      const tradeDate =
        row["trade_date"] || row["date"] || row["transaction_date"] || "";
      const stockCode =
        row["stock_code"] || row["symbol"] || row["stock"] || "";
      const action = (
        row["action"] || row["type"] || row["transaction_type"] || ""
      ).toUpperCase();
      const quantity = parseFloat(
        row["quantity"] || row["shares"] || row["qty"] || "0"
      );
      const price = parseFloat(
        row["price"] || row["price_per_share"] || "0"
      );
      const grossAmount = parseFloat(
        row["gross_amount"] || row["gross"] || "0"
      );
      const fees = parseFloat(
        row["fees"] || row["commission"] || row["charges"] || "0"
      );
      const netAmount = parseFloat(
        row["net_amount"] || row["net"] || "0"
      );

      if (!stockCode) {
        errors.push(`Row ${i + 1}: Missing stock code`);
        continue;
      }

      if (!["BUY", "SELL"].includes(action)) {
        errors.push(
          `Row ${i + 1}: Invalid action "${action}" — expected BUY or SELL`
        );
        continue;
      }

      transactions.push({
        tradeDate,
        settlementDate: row["settlement_date"] || "",
        stockCode: stockCode.toUpperCase(),
        action: action as "BUY" | "SELL",
        quantity: Math.abs(quantity),
        price,
        grossAmount: Math.abs(grossAmount || quantity * price),
        fees: Math.abs(fees),
        netAmount: Math.abs(
          netAmount || Math.abs(quantity * price) - Math.abs(fees)
        ),
      });
    } catch {
      errors.push(`Row ${i + 1}: Failed to parse`);
    }
  }

  return { transactions, errors, rowCount: result.data.length };
}
