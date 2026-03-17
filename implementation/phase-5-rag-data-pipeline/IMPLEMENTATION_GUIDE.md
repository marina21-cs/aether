# Phase 5 — RAG + Data Pipeline · Implementation Guide

**Phase:** 5 of 6 · RAG + Data Pipeline
**Weeks:** 17–24
**Prerequisites:** Phase 1–4 complete, OpenAI API key (for embeddings), pgvector enabled in Supabase
**Depends on:** Phase 3 (AI Advisor), Phase 2 (price cache, portfolio data)

---

## Context

Phase 5 upgrades the AI Advisor with RAG (Retrieval-Augmented Generation) using a curated corpus of 50–100 Philippine financial documents (BSP circulars, PSE disclosures, SEC advisories, PSA CPI data). It also automates the data pipeline — scheduled price/CPI feed refreshes via Supabase Edge Functions and adds PDF report export for users.

**Key architecture decisions:**
- **Vector store:** pgvector in the existing Supabase PostgreSQL instance (no separate infrastructure)
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 dimensions, ~$0.02/1M tokens)
- **Chunking:** 512-token chunks with 50-token overlap
- **Retrieval:** Cosine similarity search via Supabase RPC function
- **Pipeline:** Supabase Edge Functions (Deno) on cron schedules

---

## Directory Structure (New Files in Phase 5)

```
src/
├── app/
│   └── api/
│       └── v1/
│           ├── rag/
│           │   ├── ingest/
│           │   │   └── route.ts             # POST ingest document into corpus
│           │   ├── search/
│           │   │   └── route.ts             # POST semantic search
│           │   └── corpus/
│           │       └── route.ts             # GET list corpus documents
│           ├── export/
│           │   └── pdf/
│           │       └── route.ts             # GET generate PDF report
│           └── advisor/
│               └── ask/
│                   └── route.ts             # Updated: advisor with RAG
├── components/
│   ├── rag/
│   │   ├── corpus-manager.tsx               # Admin view of corpus documents
│   │   └── source-citations.tsx             # Display citations in advisor
│   └── export/
│       └── export-button.tsx                # PDF/CSV export trigger
├── lib/
│   ├── rag/
│   │   ├── embeddings.ts                    # OpenAI embedding generation
│   │   ├── chunker.ts                       # Document chunking logic
│   │   ├── retriever.ts                     # Similarity search
│   │   └── ingest.ts                        # Document ingestion pipeline
│   ├── pipeline/
│   │   ├── price-refresh.ts                 # Price cache refresh logic
│   │   └── cpi-update.ts                    # CPI data update logic
│   └── export/
│       └── pdf-generator.ts                 # PDF report generation
└── types/
    └── rag.ts                               # RAG types
supabase/
├── migrations/
│   └── 003_phase5_rag.sql                   # pgvector extension + market_context table
└── functions/
    ├── refresh-prices/
    │   └── index.ts                         # Edge Function: price cache refresh
    ├── update-cpi/
    │   └── index.ts                         # Edge Function: monthly CPI update
    └── check-alerts/
        └── index.ts                         # Edge Function: alert condition checks
```

---

## Database Migrations

**supabase/migrations/003_phase5_rag.sql:**

```sql
-- ============================================================
-- Phase 5 — pgvector RAG corpus + pipeline tables
-- ============================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Market context / RAG corpus table
CREATE TABLE market_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL
    CHECK (source_type IN (
      'bsp_circular', 'pse_disclosure', 'sec_advisory',
      'psa_cpi', 'news', 'regulation', 'research'
    )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_vector VECTOR(1536),             -- OpenAI text-embedding-3-small
  source_url TEXT,
  published_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  chunk_index INTEGER DEFAULT 0,           -- Which chunk of the original document
  parent_doc_id UUID,                      -- Links chunks to same document
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pipeline run log
CREATE TABLE pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_type TEXT NOT NULL
    CHECK (pipeline_type IN ('price_refresh', 'cpi_update', 'alert_check', 'corpus_ingest')),
  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'success', 'failed')),
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_market_context_vector
  ON market_context USING ivfflat (content_vector vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX idx_market_context_source ON market_context(source_type);
CREATE INDEX idx_market_context_date ON market_context(published_date DESC);
CREATE INDEX idx_market_context_tags ON market_context USING GIN (tags);
CREATE INDEX idx_pipeline_runs_type ON pipeline_runs(pipeline_type, started_at DESC);

-- RLS
ALTER TABLE market_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

-- market_context is read-only for authenticated users (admin writes via service role)
CREATE POLICY "Authenticated users can read market context"
  ON market_context FOR SELECT
  USING (auth.jwt() IS NOT NULL);

-- pipeline_runs: admin only (no user access needed)
CREATE POLICY "No user access to pipeline runs"
  ON pipeline_runs FOR SELECT
  USING (false);
```

---

## Step-by-Step Implementation

### Step 1 — Install Phase 5 Dependencies

```bash
# OpenAI for embeddings
pnpm add openai

# PDF generation
pnpm add @react-pdf/renderer
pnpm add -D @types/react-pdf

# Alternatively for server-side PDF:
pnpm add jspdf jspdf-autotable
pnpm add -D @types/jspdf
```

---

### Step 2 — RAG Types

**src/types/rag.ts:**

```ts
export interface MarketContextDoc {
  id: string;
  source_type: string;
  title: string;
  content: string;
  source_url: string | null;
  published_date: string;
  tags: string[];
  chunk_index: number;
  parent_doc_id: string | null;
  token_count: number | null;
  created_at: string;
}

export interface RetrievalResult {
  id: string;
  title: string;
  content: string;
  source_type: string;
  source_url: string | null;
  published_date: string;
  similarity: number;
}

export interface IngestRequest {
  title: string;
  content: string;
  source_type: string;
  source_url?: string;
  published_date: string;
  tags?: string[];
}
```

---

### Step 3 — Document Chunker

**src/lib/rag/chunker.ts:**

```ts
const CHUNK_SIZE = 512;      // tokens (approx 4 chars per token)
const CHUNK_OVERLAP = 50;    // overlap tokens

/**
 * Split document into overlapping chunks.
 * Uses simple character-based splitting with sentence boundary awareness.
 */
export function chunkDocument(
  text: string,
  chunkSize: number = CHUNK_SIZE,
  overlap: number = CHUNK_OVERLAP
): string[] {
  const charChunkSize = chunkSize * 4;   // approximate chars per token
  const charOverlap = overlap * 4;

  if (text.length <= charChunkSize) {
    return [text.trim()];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + charChunkSize;

    // Try to break at sentence boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(". ", end);
      const lastNewline = text.lastIndexOf("\n", end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > start + charChunkSize * 0.5) {
        end = breakPoint + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start = end - charOverlap;
  }

  return chunks;
}

/**
 * Estimate token count (rough: 1 token ≈ 4 characters for English).
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
```

---

### Step 4 — Embeddings Service

**src/lib/rag/embeddings.ts:**

```ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

/**
 * Generate embedding vector for a text string.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts (batch).
 * OpenAI supports up to 2048 inputs per request.
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const batchSize = 100;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    allEmbeddings.push(...response.data.map((d) => d.embedding));
  }

  return allEmbeddings;
}
```

---

### Step 5 — Document Ingestion Pipeline

**src/lib/rag/ingest.ts:**

```ts
import { createAdminClient } from "@/lib/supabase/admin";
import { chunkDocument, estimateTokens } from "./chunker";
import { generateEmbeddings } from "./embeddings";
import type { IngestRequest } from "@/types/rag";

export async function ingestDocument(request: IngestRequest): Promise<{
  chunks: number;
  parentId: string;
}> {
  const supabase = createAdminClient();
  const parentId = crypto.randomUUID();

  // Chunk the document
  const chunks = chunkDocument(request.content);

  // Generate embeddings for all chunks
  const embeddings = await generateEmbeddings(chunks);

  // Insert all chunks with embeddings
  const records = chunks.map((chunk, index) => ({
    source_type: request.source_type,
    title: `${request.title}${chunks.length > 1 ? ` [${index + 1}/${chunks.length}]` : ""}`,
    content: chunk,
    content_vector: `[${embeddings[index].join(",")}]`,
    source_url: request.source_url || null,
    published_date: request.published_date,
    tags: request.tags || [],
    chunk_index: index,
    parent_doc_id: parentId,
    token_count: estimateTokens(chunk),
  }));

  const { error } = await supabase.from("market_context").insert(records);

  if (error) {
    throw new Error(`Failed to ingest document: ${error.message}`);
  }

  // Log pipeline run
  await supabase.from("pipeline_runs").insert({
    pipeline_type: "corpus_ingest",
    status: "success",
    records_processed: chunks.length,
  });

  return { chunks: chunks.length, parentId };
}
```

---

### Step 6 — RAG Retriever

**src/lib/rag/retriever.ts:**

```ts
import { createAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "./embeddings";
import type { RetrievalResult } from "@/types/rag";

const DEFAULT_TOP_K = 5;
const SIMILARITY_THRESHOLD = 0.7;

/**
 * Retrieve relevant documents from the corpus using cosine similarity.
 * Uses a Supabase RPC function for efficient vector search.
 */
export async function retrieveRelevantDocs(
  query: string,
  topK: number = DEFAULT_TOP_K,
  filters?: {
    sourceTypes?: string[];
    tags?: string[];
  }
): Promise<RetrievalResult[]> {
  const queryEmbedding = await generateEmbedding(query);
  const supabase = createAdminClient();

  // Use RPC function for vector similarity search
  const { data, error } = await supabase.rpc("match_market_context", {
    query_embedding: queryEmbedding,
    match_threshold: SIMILARITY_THRESHOLD,
    match_count: topK,
    filter_source_types: filters?.sourceTypes || null,
  });

  if (error) {
    console.error("RAG retrieval error:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    source_type: row.source_type,
    source_url: row.source_url,
    published_date: row.published_date,
    similarity: row.similarity,
  }));
}

/**
 * Format retrieved documents into context for the AI advisor.
 */
export function formatRetrievedContext(docs: RetrievalResult[]): string {
  if (docs.length === 0) return "";

  const formattedDocs = docs
    .map(
      (doc, i) =>
        `[Source ${i + 1}] ${doc.title} (${doc.source_type}, ${doc.published_date})
${doc.content}
${doc.source_url ? `URL: ${doc.source_url}` : ""}`
    )
    .join("\n\n---\n\n");

  return `\n\n## Retrieved Philippine Market Context\nThe following documents were retrieved from AETHER's curated corpus based on relevance to the query:\n\n${formattedDocs}`;
}
```

**Supabase RPC function** — run this SQL in the Supabase SQL editor:

```sql
CREATE OR REPLACE FUNCTION match_market_context(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  filter_source_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source_type TEXT,
  source_url TEXT,
  published_date DATE,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id,
    mc.title,
    mc.content,
    mc.source_type,
    mc.source_url,
    mc.published_date,
    1 - (mc.content_vector <=> query_embedding) AS similarity
  FROM market_context mc
  WHERE
    mc.content_vector IS NOT NULL
    AND 1 - (mc.content_vector <=> query_embedding) > match_threshold
    AND (filter_source_types IS NULL OR mc.source_type = ANY(filter_source_types))
  ORDER BY mc.content_vector <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

### Step 7 — Updated AI Advisor with RAG

Update the existing advisor route to include RAG retrieval:

**src/app/api/v1/advisor/ask/route.ts** (updated):

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { buildPortfolioContext } from "@/lib/ai/portfolio-context";
import { calculateNetWorth } from "@/lib/calculations/net-worth";
import { checkRateLimit } from "@/lib/ai/rate-limiter";
import { retrieveRelevantDocs, formatRetrievedContext } from "@/lib/rag/retriever";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } },
      { status: 401 }
    );
  }

  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: { code: "PROFILE_NOT_FOUND", message: "User profile not found", status: 404 } },
      { status: 404 }
    );
  }

  const rateLimit = checkRateLimit(userId, profile.subscription_tier);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Daily query limit reached", status: 429 } },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { message, conversationHistory = [] } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Message is required", status: 400 } },
      { status: 400 }
    );
  }

  // Build portfolio context
  const [{ data: assets }, { data: liabilities }] = await Promise.all([
    supabase.from("assets").select("*"),
    supabase.from("liabilities").select("*"),
  ]);

  const breakdown = calculateNetWorth(assets || [], liabilities || []);
  const portfolioContext = buildPortfolioContext(profile, assets || [], breakdown.netWorth);
  let systemPrompt = buildSystemPrompt(portfolioContext);

  // RAG: Retrieve relevant documents
  const retrievedDocs = await retrieveRelevantDocs(message, 5);
  if (retrievedDocs.length > 0) {
    systemPrompt += formatRetrievedContext(retrievedDocs);
    systemPrompt += `\n\nIMPORTANT: When using information from the retrieved documents above, cite the source by number (e.g., [Source 1]). Always prefer retrieved data over general knowledge for Philippine-specific context.`;
  }

  const messages = [
    ...conversationHistory.slice(-10).map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user" as const, content: message },
  ];

  const result = streamText({
    model: openrouter("anthropic/claude-sonnet-4"),
    system: systemPrompt,
    messages,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
```

---

### Step 8 — RAG Ingestion API Route

**src/app/api/v1/rag/ingest/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ingestDocument } from "@/lib/rag/ingest";
import { z } from "zod";

const ingestSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
  source_type: z.enum(["bsp_circular", "pse_disclosure", "sec_advisory", "psa_cpi", "news", "regulation", "research"]),
  source_url: z.string().url().optional(),
  published_date: z.string(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  // Admin-only: check if user has admin privileges
  // For MVP, restrict to specific user IDs or add an admin flag to profiles
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  // For now, only pro users can ingest (production: add admin role)
  if (profile?.subscription_tier !== "pro") {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin access required", status: 403 } }, { status: 403 });
  }

  const body = await request.json();
  const parsed = ingestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message, status: 400 } }, { status: 400 });
  }

  try {
    const result = await ingestDocument(parsed.data);
    return NextResponse.json({ success: true, chunks: result.chunks, parentId: result.parentId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: { code: "INGEST_ERROR", message: error.message, status: 500 } }, { status: 500 });
  }
}
```

---

### Step 9 — Data Pipeline Edge Functions

**supabase/functions/refresh-prices/index.ts:**

```ts
// Supabase Edge Function — runs every 15 minutes
// Deploy: supabase functions deploy refresh-prices
// Schedule: supabase functions schedule refresh-prices --cron "*/15 * * * *"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const COINGECKO_API = "https://api.coingecko.com/api/v3";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const runId = crypto.randomUUID();
  await supabase.from("pipeline_runs").insert({
    id: runId,
    pipeline_type: "price_refresh",
    status: "running",
  });

  try {
    // Get unique tickers from user assets
    const { data: assets } = await supabase
      .from("assets")
      .select("asset_class, ticker_or_name")
      .not("asset_class", "in", '("cash","real_estate","other")');

    const cryptoTickers = new Set<string>();
    const pseTickers = new Set<string>();

    for (const asset of assets || []) {
      if (asset.asset_class === "crypto") {
        cryptoTickers.add(asset.ticker_or_name.toUpperCase());
      } else if (asset.asset_class === "pse_stock") {
        pseTickers.add(asset.ticker_or_name.toUpperCase());
      }
    }

    let processed = 0;

    // Fetch crypto prices
    if (cryptoTickers.size > 0) {
      const CRYPTO_IDS: Record<string, string> = {
        BTC: "bitcoin", ETH: "ethereum", SOL: "solana",
        ADA: "cardano", XRP: "ripple", DOT: "polkadot",
      };
      const ids = Array.from(cryptoTickers)
        .map((t) => CRYPTO_IDS[t])
        .filter(Boolean);

      if (ids.length > 0) {
        const resp = await fetch(`${COINGECKO_API}/simple/price?ids=${ids.join(",")}&vs_currencies=php`);
        if (resp.ok) {
          const data = await resp.json();
          const upserts = Array.from(cryptoTickers)
            .map((ticker) => {
              const id = CRYPTO_IDS[ticker];
              const price = data?.[id]?.php;
              if (!price) return null;
              return { ticker, price_php: price, source: "coingecko", fetched_at: new Date().toISOString() };
            })
            .filter(Boolean);

          if (upserts.length > 0) {
            await supabase.from("price_cache").upsert(upserts, { onConflict: "ticker" });
            processed += upserts.length;
          }
        }
      }
    }

    // Fetch BSP forex rates (simplified)
    const forexRates = [
      { ticker: "USD/PHP", price_php: 56.5, source: "bsp_forex", fetched_at: new Date().toISOString() },
      { ticker: "SGD/PHP", price_php: 42.1, source: "bsp_forex", fetched_at: new Date().toISOString() },
      { ticker: "HKD/PHP", price_php: 7.23, source: "bsp_forex", fetched_at: new Date().toISOString() },
    ];
    await supabase.from("price_cache").upsert(forexRates, { onConflict: "ticker" });
    processed += forexRates.length;

    await supabase.from("pipeline_runs").update({
      status: "success",
      records_processed: processed,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    return new Response(JSON.stringify({ success: true, processed }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    await supabase.from("pipeline_runs").update({
      status: "failed",
      error_message: error.message,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

**supabase/functions/update-cpi/index.ts:**

```ts
// Supabase Edge Function — runs monthly
// Deploy: supabase functions deploy update-cpi
// Schedule: supabase functions schedule update-cpi --cron "0 8 1 * *"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async () => {
  const runId = crypto.randomUUID();
  await supabase.from("pipeline_runs").insert({
    id: runId,
    pipeline_type: "cpi_update",
    status: "running",
  });

  try {
    // PSA CPI data — for MVP, manually update this value
    // In production, scrape from PSA website or use an API if available
    const latestCPI = {
      ticker: "PH_CPI",
      price_php: 6.1, // CPI percentage stored as price_php for simplicity
      source: "psa_cpi",
      fetched_at: new Date().toISOString(),
    };

    await supabase.from("price_cache").upsert(latestCPI, { onConflict: "ticker" });

    await supabase.from("pipeline_runs").update({
      status: "success",
      records_processed: 1,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    await supabase.from("pipeline_runs").update({
      status: "failed",
      error_message: error.message,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

---

### Step 10 — PDF Report Export

**src/lib/export/pdf-generator.ts:**

```ts
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { Asset, Liability } from "@/types/database";
import type { NetWorthBreakdown } from "@/lib/calculations/net-worth";
import { ASSET_CLASS_LABELS } from "@/lib/calculations/net-worth";

interface ReportData {
  userName: string;
  generatedAt: string;
  breakdown: NetWorthBreakdown;
  assets: Asset[];
  liabilities: Liability[];
}

export function generatePortfolioReport(data: ReportData): ArrayBuffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(124, 58, 237); // violet accent
  doc.text("AETHER", 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Portfolio Report", 14, 28);
  doc.text(`Generated: ${data.generatedAt}`, 14, 34);
  doc.text(`Prepared for: ${data.userName}`, 14, 40);

  // Divider
  doc.setDrawColor(124, 58, 237);
  doc.line(14, 44, pageWidth - 14, 44);

  // Net Worth Summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Net Worth Summary", 14, 54);

  const formatPHP = (n: number) =>
    `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const summaryData = [
    ["Total Assets", formatPHP(data.breakdown.totalAssets)],
    ["Total Liabilities", formatPHP(data.breakdown.totalLiabilities)],
    ["Net Worth", formatPHP(data.breakdown.netWorth)],
  ];

  (doc as any).autoTable({
    startY: 58,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [124, 58, 237] },
    margin: { left: 14, right: 14 },
  });

  // Asset Allocation
  let currentY = (doc as any).lastAutoTable.finalY + 14;
  doc.setFontSize(14);
  doc.text("Asset Allocation", 14, currentY);

  const allocationData = Object.entries(data.breakdown.byAssetClass).map(
    ([cls, { value, percentage }]) => [
      ASSET_CLASS_LABELS[cls] || cls,
      formatPHP(value),
      `${percentage.toFixed(1)}%`,
    ]
  );

  (doc as any).autoTable({
    startY: currentY + 4,
    head: [["Asset Class", "Value (PHP)", "Allocation"]],
    body: allocationData,
    theme: "grid",
    headStyles: { fillColor: [124, 58, 237] },
    margin: { left: 14, right: 14 },
  });

  // Holdings Detail
  currentY = (doc as any).lastAutoTable.finalY + 14;

  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(14);
  doc.text("Holdings Detail", 14, currentY);

  const holdingsData = data.assets.map((a) => [
    a.ticker_or_name,
    ASSET_CLASS_LABELS[a.asset_class] || a.asset_class,
    Number(a.quantity).toLocaleString(),
    formatPHP(Number(a.current_value_php)),
  ]);

  (doc as any).autoTable({
    startY: currentY + 4,
    head: [["Asset", "Class", "Quantity", "Value (PHP)"]],
    body: holdingsData,
    theme: "grid",
    headStyles: { fillColor: [124, 58, 237] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "AETHER — Wealth Intelligence for Filipino Investors | This is not financial advice.",
      14,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 40,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  return doc.output("arraybuffer");
}
```

**src/app/api/v1/export/pdf/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calculateNetWorth } from "@/lib/calculations/net-worth";
import { generatePortfolioReport } from "@/lib/export/pdf-generator";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required", status: 401 } }, { status: 401 });
  }

  const supabase = await createServerSupabaseClient();

  const [{ data: profile }, { data: assets }, { data: liabilities }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", userId).single(),
    supabase.from("assets").select("*").order("current_value_php", { ascending: false }),
    supabase.from("liabilities").select("*"),
  ]);

  const breakdown = calculateNetWorth(assets || [], liabilities || []);

  const pdfBuffer = generatePortfolioReport({
    userName: profile?.full_name || "AETHER User",
    generatedAt: new Date().toLocaleDateString("en-PH", {
      year: "numeric", month: "long", day: "numeric",
    }),
    breakdown,
    assets: assets || [],
    liabilities: liabilities || [],
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="aether-portfolio-${new Date().toISOString().split("T")[0]}.pdf"`,
    },
  });
}
```

---

### Step 11 — Export Button Component

**src/components/export/export-button.tsx:**

```tsx
"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: "pdf" | "csv") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/export/${format}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aether-portfolio-${new Date().toISOString().split("T")[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("pdf")}
        disabled={loading}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-[8px] border border-glass-border bg-glass-bg px-3 font-body text-xs font-medium text-text-secondary transition-colors",
          "hover:border-border-accent hover:text-text-primary",
          loading && "opacity-50"
        )}
      >
        <Download size={14} />
        PDF
      </button>
    </div>
  );
}
```

---

## Corpus Seeding Guide

To populate the RAG corpus with initial Philippine financial documents:

1. **BSP Circulars** — Download key circulars from bsp.gov.ph (monetary policy, rate decisions)
2. **PSE Disclosures** — Major PSEi company disclosures from edge.pse.com.ph
3. **SEC Advisories** — Investment scam warnings, market advisories from sec.gov.ph
4. **PSA CPI Data** — Monthly CPI reports from psa.gov.ph
5. **PH Financial News** — Curated articles from Business World, Inquirer Business

Use the `/api/v1/rag/ingest` endpoint or create a script:

```bash
# Example: Ingest a BSP circular
curl -X POST http://localhost:3000/api/v1/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "title": "BSP Monetary Policy Decision - March 2026",
    "content": "The Bangko Sentral ng Pilipinas (BSP) maintained... [full text]",
    "source_type": "bsp_circular",
    "source_url": "https://www.bsp.gov.ph/...",
    "published_date": "2026-03-01",
    "tags": ["bsp", "monetary_policy", "interest_rate"]
  }'
```

---

## Verification Checklist

- [ ] pgvector extension enabled in Supabase
- [ ] `match_market_context` RPC function created and working
- [ ] Document ingestion: text chunked into 512-token overlapping chunks
- [ ] Embeddings generated via OpenAI `text-embedding-3-small`
- [ ] RAG retrieval: relevant docs returned for financial queries
- [ ] AI Advisor now includes retrieved context in system prompt
- [ ] AI Advisor cites sources with `[Source N]` format
- [ ] Price refresh Edge Function runs on schedule (every 15 min)
- [ ] CPI update Edge Function runs monthly
- [ ] Pipeline runs logged in `pipeline_runs` table
- [ ] PDF export generates correctly formatted report
- [ ] PDF includes: net worth summary, allocation, holdings detail
- [ ] Corpus has at least 50 seeded documents
- [ ] `pnpm build` succeeds

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "vector type not found" | pgvector not enabled | Run `CREATE EXTENSION IF NOT EXISTS vector;` in SQL editor |
| Low retrieval quality | Chunks too large or threshold too high | Reduce chunk size to 256 tokens; lower threshold to 0.6 |
| OpenAI 429 rate limit | Too many embedding requests | Add retry with backoff; batch requests |
| Edge Function timeout | Long-running price fetches | Add timeout handling; process in smaller batches |
| PDF blank pages | Content overflow | Check `currentY` calculations; add page break logic |
| ivfflat index slow | Not enough rows | Index works best with 1000+ rows; use sequential scan for < 1000 |

---

**Phase 5 complete. Proceed to `phase-6-scale-mobile/IMPLEMENTATION_GUIDE.md`.**
