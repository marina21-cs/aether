import { useState } from "react";
import { useUser } from "@clerk/react";
import { Plus, X } from "lucide-react";
import { useDashboard, type Holding } from "@/src/pages/DashboardLayout";
import { apiFetch } from "@/src/lib/api/client";

interface AddAssetDialogProps {
	open: boolean;
	onClose: () => void;
}

interface DraftState {
	name: string;
	ticker: string;
	type: Holding["type"];
	currency: "PHP" | "USD";
	qty: string;
	avgCost: string;
	manualPrice: string;
	useLivePriceForCrypto: boolean;
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

function defaultCurrency(type: Holding["type"]): "PHP" | "USD" {
	if (type === "US Stocks" || type === "Crypto") return "USD";
	return "PHP";
}

const INITIAL_DRAFT: DraftState = {
	name: "",
	ticker: "",
	type: "PH Stocks",
	currency: "PHP",
	qty: "",
	avgCost: "",
	manualPrice: "",
	useLivePriceForCrypto: true,
};

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

function toErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof Error && error.message.trim().length > 0) {
		return error.message;
	}

	if (typeof error === "string" && error.trim().length > 0) {
		return error;
	}

	return fallback;
}

export function AddAssetDialog({ open, onClose }: AddAssetDialogProps) {
	const { user } = useUser();
	const { holdings, setHoldings, usdToPhp } = useDashboard();
	const [draft, setDraft] = useState<DraftState>(INITIAL_DRAFT);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	if (!open) return null;

	const closeAndReset = () => {
		setDraft(INITIAL_DRAFT);
		setError(null);
		onClose();
	};

	const persistHoldings = async (nextHoldings: Holding[]) => {
		if (!user) return;

		const response = await apiFetch("/api/v1/data/save-assets", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: user.id,
				email: user.primaryEmailAddress?.emailAddress ?? null,
				fullName: user.fullName ?? null,
				holdings: nextHoldings,
				tangibleMetaByKey: {},
				usdToPhp,
				contextLabel: "holdings_add_dialog",
			}),
		});

		const payload = await parseApiPayload(response);
		if (!response.ok) {
			throw new Error(extractApiErrorMessage(payload, "Failed to save asset."));
		}
	};

	const onAdd = async () => {
		if (isSaving) return;
		setError(null);

		const name = draft.name.trim();
		const ticker = (draft.ticker.trim() || inferTicker(name)).toUpperCase();
		const qty = Number(draft.qty);
		const avgCost = Number(draft.avgCost);
		const manualPriceInput = Number(draft.manualPrice);

		if (!name) {
			setError("Asset name is required.");
			return;
		}

		if (!Number.isFinite(qty) || qty <= 0) {
			setError("Quantity must be greater than zero.");
			return;
		}

		if (!Number.isFinite(avgCost) || avgCost < 0) {
			setError("Average cost must be zero or greater.");
			return;
		}

		if (
			draft.manualPrice.trim().length > 0 &&
			(!Number.isFinite(manualPriceInput) || manualPriceInput <= 0)
		) {
			setError("Manual price must be greater than zero.");
			return;
		}

		const resolvedManualPrice =
			draft.type === "Crypto" && draft.useLivePriceForCrypto
				? null
				: Number.isFinite(manualPriceInput) && manualPriceInput > 0
					? manualPriceInput
					: avgCost;

		const newHolding: Holding = {
			name,
			ticker,
			type: draft.type,
			qty,
			avgCost,
			currency: draft.currency,
			manualPrice: resolvedManualPrice,
		};

		const nextHoldings = [...holdings, newHolding];

		try {
			setIsSaving(true);
			await persistHoldings(nextHoldings);
			setHoldings(nextHoldings);
			closeAndReset();
		} catch (saveError) {
			setError(toErrorMessage(saveError, "Failed to save this asset to your account."));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
			<div className="w-full max-w-lg rounded-2xl border border-glass-border bg-bg-surface p-5 shadow-glass">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-display text-lg font-bold text-text-primary">Add Asset</h2>
					<button
						type="button"
						onClick={closeAndReset}
						disabled={isSaving}
						className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-glass-border text-text-muted hover:bg-white/5"
						aria-label="Close add asset dialog"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<input
						type="text"
						value={draft.name}
						onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
						placeholder="Asset name"
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
					/>

					<input
						type="text"
						value={draft.ticker}
						onChange={(event) =>
							setDraft((prev) => ({ ...prev, ticker: event.target.value.toUpperCase() }))
						}
						placeholder="Ticker/Symbol (optional)"
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
					/>

					<select
						value={draft.type}
						onChange={(event) => {
							const type = event.target.value as Holding["type"];
							setDraft((prev) => ({
								...prev,
								type,
								currency: defaultCurrency(type),
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
						value={draft.currency}
						onChange={(event) =>
							setDraft((prev) => ({ ...prev, currency: event.target.value as "PHP" | "USD" }))
						}
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary focus:border-accent-primary/60 focus:outline-none"
					>
						<option value="PHP">PHP</option>
						<option value="USD">USD</option>
					</select>

					<input
						type="number"
						min="0"
						step="0.0001"
						value={draft.qty}
						onChange={(event) => setDraft((prev) => ({ ...prev, qty: event.target.value }))}
						placeholder="Quantity"
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
					/>

					<input
						type="number"
						min="0"
						step="0.0001"
						value={draft.avgCost}
						onChange={(event) => setDraft((prev) => ({ ...prev, avgCost: event.target.value }))}
						placeholder="Average cost"
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
					/>

					<input
						type="number"
						min="0"
						step="0.0001"
						value={draft.manualPrice}
						onChange={(event) =>
							setDraft((prev) => ({ ...prev, manualPrice: event.target.value }))
						}
						placeholder="Manual/current price"
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none md:col-span-2"
					/>

					{draft.type === "Crypto" && (
						<label className="md:col-span-2 flex items-center gap-2 rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-secondary">
							<input
								type="checkbox"
								checked={draft.useLivePriceForCrypto}
								onChange={(event) =>
									setDraft((prev) => ({ ...prev, useLivePriceForCrypto: event.target.checked }))
								}
							/>
							Use live crypto feed instead of fixed manual price
						</label>
					)}
				</div>

				{error && (
					<p className="mt-3 rounded-lg border border-accent-danger/40 bg-accent-danger/10 px-3 py-2 text-xs text-accent-danger">
						{error}
					</p>
				)}

				<div className="mt-4 flex items-center justify-end gap-2">
					<button
						type="button"
						onClick={closeAndReset}
						disabled={isSaving}
						className="rounded-lg border border-glass-border bg-bg-dark px-3 py-2 text-xs text-text-secondary disabled:cursor-not-allowed disabled:opacity-60"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onAdd}
						disabled={isSaving}
						className="inline-flex items-center gap-1 rounded-lg bg-accent-primary px-3 py-2 text-xs font-semibold text-[#09090B] hover:bg-accent-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSaving ? (
							"Saving..."
						) : (
							<>
								<Plus className="h-3.5 w-3.5" /> Add Asset
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
