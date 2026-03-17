import { z } from "zod";

export const createAssetSchema = z.object({
  asset_class: z.enum([
    "pse_stock", "global_stock", "crypto", "real_estate",
    "uitf", "cash", "gold", "time_deposit", "other",
  ]),
  ticker_or_name: z.string().min(1, "Name is required").max(100),
  quantity: z.number().positive("Quantity must be positive"),
  avg_cost_basis: z.number().positive().nullable().optional(),
  current_value_php: z.number().nonnegative("Value must be non-negative"),
  native_currency: z.string().default("PHP"),
  annual_fee_pct: z.number().min(0).max(100).nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export const createLiabilitySchema = z.object({
  liability_type: z.enum([
    "credit_card", "personal_loan", "housing_loan", "car_loan", "other",
  ]),
  name: z.string().min(1, "Name is required").max(100),
  outstanding_balance: z.number().nonnegative("Balance must be non-negative"),
  interest_rate_pct: z.number().min(0).max(100).nullable().optional(),
  monthly_payment: z.number().nonnegative().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type CreateLiabilityInput = z.infer<typeof createLiabilitySchema>;
