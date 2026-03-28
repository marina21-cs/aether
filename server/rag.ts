import { createHash, randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const RAG_SOURCE_TYPES = [
  "bsp_circular",
  "pse_disclosure",
  "sec_advisory",
  "psa_cpi",
  "news",
  "regulation",
  "research",
] as const;

export type RagSourceType = (typeof RAG_SOURCE_TYPES)[number];

export interface RagIngestRequest {
  title: string;
  content: string;
  source_type: RagSourceType;
  source_url?: string | null;
  published_date: string;
  tags?: string[];
}

export interface RagSearchResult {
  id: string;
  title: string;
  content: string;
  source_type: RagSourceType;
  source_url: string | null;
  published_date: string;
  tags: string[];
  chunk_index: number;
  parent_doc_id: string;
  similarity: number;
}

interface MarketContextRow {
  id: string;
  title: string;
  content: string;
  source_type: RagSourceType;
  source_url: string | null;
  published_date: string;
  tags: string[] | null;
  chunk_index: number;
  parent_doc_id: string;
}

interface SearchOptions {
  supabase: SupabaseClient;
  query: string;
  topK?: number;
  similarityThreshold?: number;
  sourceTypes?: RagSourceType[];
  tags?: string[];
}

interface IngestOptions {
  supabase: SupabaseClient;
  request: RagIngestRequest;
  chunkSizeTokens?: number;
  overlapTokens?: number;
}

const DEFAULT_CHUNK_SIZE = 512;
const DEFAULT_CHUNK_OVERLAP = 50;
const MAX_CONTENT_CHARS = 200_000;
const MAX_SCANNED_ROWS = 500;

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function normalizeWhitespace(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

function tokenizeQuery(input: string): string[] {
  const normalized = input.toLowerCase();
  const tokens = normalized
    .split(/[^a-z0-9_]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);

  const unique: string[] = [];
  for (const token of tokens) {
    if (!unique.includes(token)) unique.push(token);
    if (unique.length >= 12) break;
  }

  return unique;
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while (true) {
    index = haystack.indexOf(needle, index);
    if (index === -1) break;
    count += 1;
    index += needle.length;
    if (count >= 12) break;
  }
  return count;
}

function toDateOnlyOrThrow(input: string): string {
  const date = new Date(input);
  if (!Number.isFinite(date.getTime())) {
    throw new Error("published_date must be a valid date string.");
  }
  return date.toISOString().slice(0, 10);
}

function computeDocumentKey(input: {
  source_type: RagSourceType;
  title: string;
  source_url: string | null;
  published_date: string;
}): string {
  const payload = [
    input.source_type,
    input.title.toLowerCase(),
    (input.source_url || "").toLowerCase(),
    input.published_date,
  ].join("|");

  return createHash("sha256").update(payload).digest("hex");
}

export function normalizeRagSourceType(input: unknown): RagSourceType | null {
  if (typeof input !== "string") return null;
  return RAG_SOURCE_TYPES.includes(input as RagSourceType)
    ? (input as RagSourceType)
    : null;
}

export function normalizeRagTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  const tags: string[] = [];
  for (const entry of input) {
    if (typeof entry !== "string") continue;
    const normalized = entry.trim().toLowerCase();
    if (!normalized || normalized.length > 64) continue;
    if (!tags.includes(normalized)) tags.push(normalized);
    if (tags.length >= 30) break;
  }

  return tags;
}

export function chunkDocumentText(
  text: string,
  chunkSizeTokens: number = DEFAULT_CHUNK_SIZE,
  overlapTokens: number = DEFAULT_CHUNK_OVERLAP
): string[] {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) return [];

  const safeChunkSize = Math.max(64, Math.floor(chunkSizeTokens));
  const safeOverlap = clampNumber(Math.floor(overlapTokens), 0, safeChunkSize - 1);

  const charChunkSize = safeChunkSize * 4;
  const charOverlap = safeOverlap * 4;

  if (cleaned.length <= charChunkSize) {
    return [cleaned];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = Math.min(start + charChunkSize, cleaned.length);

    if (end < cleaned.length) {
      const sentenceBreak = cleaned.lastIndexOf(". ", end);
      const newlineBreak = cleaned.lastIndexOf("\n", end);
      const breakpoint = Math.max(sentenceBreak, newlineBreak);

      if (breakpoint > start + Math.floor(charChunkSize * 0.5)) {
        end = breakpoint + 1;
      }
    }

    const chunk = cleaned.slice(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end >= cleaned.length) {
      break;
    }

    start = Math.max(end - charOverlap, start + 1);
  }

  return chunks;
}

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

async function beginPipelineRun(
  supabase: SupabaseClient,
  pipelineType: "corpus_ingest",
  metadata: Record<string, unknown>
): Promise<string | null> {
  const runId = randomUUID();
  const { error } = await supabase.from("pipeline_runs").insert({
    id: runId,
    pipeline_type: pipelineType,
    status: "running",
    metadata,
  });

  if (error) {
    return null;
  }

  return runId;
}

async function finishPipelineRun(
  supabase: SupabaseClient,
  runId: string | null,
  payload: {
    status: "success" | "failed";
    recordsProcessed: number;
    errorMessage?: string;
  }
): Promise<void> {
  if (!runId) return;

  await supabase
    .from("pipeline_runs")
    .update({
      status: payload.status,
      records_processed: payload.recordsProcessed,
      error_message: payload.errorMessage || null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", runId);
}

export async function ingestRagDocument({
  supabase,
  request,
  chunkSizeTokens,
  overlapTokens,
}: IngestOptions): Promise<{
  parentDocId: string;
  chunks: number;
  replaced: boolean;
  documentKey: string;
}> {
  const title = request.title.trim();
  const content = normalizeWhitespace(request.content);
  const sourceUrl = request.source_url?.trim() || null;
  const publishedDate = toDateOnlyOrThrow(request.published_date);
  const tags = normalizeRagTags(request.tags);

  if (!title) {
    throw new Error("title is required.");
  }

  if (content.length < 20) {
    throw new Error("content must be at least 20 characters.");
  }

  if (content.length > MAX_CONTENT_CHARS) {
    throw new Error(`content is too large (${MAX_CONTENT_CHARS} characters max).`);
  }

  const safeChunkSize = Math.max(64, Math.floor(chunkSizeTokens || DEFAULT_CHUNK_SIZE));
  const safeOverlap = clampNumber(
    Math.floor(overlapTokens || DEFAULT_CHUNK_OVERLAP),
    0,
    safeChunkSize - 1
  );

  const chunks = chunkDocumentText(content, safeChunkSize, safeOverlap);
  if (chunks.length === 0) {
    throw new Error("content could not be chunked.");
  }

  const documentKey = computeDocumentKey({
    source_type: request.source_type,
    title,
    source_url: sourceUrl,
    published_date: publishedDate,
  });

  const runId = await beginPipelineRun(supabase, "corpus_ingest", {
    source_type: request.source_type,
    title,
    published_date: publishedDate,
    document_key: documentKey,
  });

  try {
    const { count: existingCount, error: countError } = await supabase
      .from("market_context")
      .select("id", { head: true, count: "exact" })
      .eq("document_key", documentKey);

    if (countError) {
      throw new Error(`Failed to check duplicates: ${countError.message}`);
    }

    const replaced = Boolean((existingCount || 0) > 0);
    if (replaced) {
      const { error: deleteError } = await supabase
        .from("market_context")
        .delete()
        .eq("document_key", documentKey);

      if (deleteError) {
        throw new Error(`Failed to replace existing document: ${deleteError.message}`);
      }
    }

    const parentDocId = randomUUID();
    const rows = chunks.map((chunk, index) => ({
      source_type: request.source_type,
      title: chunks.length > 1 ? `${title} [${index + 1}/${chunks.length}]` : title,
      content: chunk,
      source_url: sourceUrl,
      published_date: publishedDate,
      tags,
      chunk_index: index,
      parent_doc_id: parentDocId,
      token_count: estimateTokenCount(chunk),
      document_key: documentKey,
      content_sha256: createHash("sha256").update(chunk).digest("hex"),
    }));

    const batchSize = 100;
    for (let index = 0; index < rows.length; index += batchSize) {
      const batch = rows.slice(index, index + batchSize);
      const { error: insertError } = await supabase.from("market_context").insert(batch);
      if (insertError) {
        throw new Error(`Failed to ingest chunks: ${insertError.message}`);
      }
    }

    await finishPipelineRun(supabase, runId, {
      status: "success",
      recordsProcessed: rows.length,
    });

    return {
      parentDocId,
      chunks: rows.length,
      replaced,
      documentKey,
    };
  } catch (error) {
    await finishPipelineRun(supabase, runId, {
      status: "failed",
      recordsProcessed: 0,
      errorMessage: error instanceof Error ? error.message : "Unknown ingest error",
    });
    throw error;
  }
}

async function searchViaRpc({
  supabase,
  query,
  topK,
  sourceTypes,
  tags,
}: {
  supabase: SupabaseClient;
  query: string;
  topK: number;
  sourceTypes: RagSourceType[];
  tags: string[];
}): Promise<RagSearchResult[] | null> {
  const { data, error } = await supabase.rpc("search_market_context", {
    query_text: query,
    match_count: topK,
    filter_source_types: sourceTypes.length > 0 ? sourceTypes : null,
    filter_tags: tags.length > 0 ? tags : null,
  });

  if (error) {
    return null;
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((row) => row && typeof row === "object")
    .map((row) => {
      const typed = row as Record<string, unknown>;
      return {
        id: String(typed.id || ""),
        title: String(typed.title || "Untitled"),
        content: String(typed.content || ""),
        source_type: normalizeRagSourceType(typed.source_type) || "research",
        source_url:
          typeof typed.source_url === "string" && typed.source_url.trim().length > 0
            ? typed.source_url
            : null,
        published_date: String(typed.published_date || ""),
        tags: Array.isArray(typed.tags)
          ? typed.tags
              .map((tag) => String(tag || "").trim().toLowerCase())
              .filter((tag) => tag.length > 0)
          : [],
        chunk_index: Number(typed.chunk_index || 0),
        parent_doc_id: String(typed.parent_doc_id || typed.id || ""),
        similarity: Number(typed.similarity || 0),
      } satisfies RagSearchResult;
    })
    .filter((row) => row.id.length > 0);
}

async function searchFallback({
  supabase,
  query,
  topK,
  similarityThreshold,
  sourceTypes,
  tags,
}: {
  supabase: SupabaseClient;
  query: string;
  topK: number;
  similarityThreshold: number;
  sourceTypes: RagSourceType[];
  tags: string[];
}): Promise<RagSearchResult[]> {
  const rowLimit = Math.min(MAX_SCANNED_ROWS, Math.max(topK * 40, 120));

  let queryBuilder = supabase
    .from("market_context")
    .select("id, title, content, source_type, source_url, published_date, tags, chunk_index, parent_doc_id")
    .order("published_date", { ascending: false })
    .limit(rowLimit);

  if (sourceTypes.length > 0) {
    queryBuilder = queryBuilder.in("source_type", sourceTypes);
  }

  if (tags.length > 0) {
    queryBuilder = queryBuilder.overlaps("tags", tags);
  }

  const { data, error } = await queryBuilder;
  if (error) {
    throw new Error(`Failed to search market context: ${error.message}`);
  }

  const rows = (Array.isArray(data) ? data : []) as MarketContextRow[];
  if (rows.length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const tokens = tokenizeQuery(queryLower);
  const scored: Array<RagSearchResult & { parentKey: string }> = [];

  for (const row of rows) {
    const titleLower = row.title.toLowerCase();
    const contentLower = row.content.toLowerCase();
    const rowTags = Array.isArray(row.tags)
      ? row.tags.map((tag) => String(tag || "").toLowerCase())
      : [];

    let score = 0;

    if (titleLower.includes(queryLower)) score += 4;
    if (contentLower.includes(queryLower)) score += 2;

    for (const token of tokens) {
      if (titleLower.includes(token)) score += 1.5;
      score += Math.min(countOccurrences(contentLower, token), 4) * 0.4;
      if (rowTags.includes(token)) score += 0.5;
    }

    const publishedAt = Date.parse(row.published_date || "");
    if (Number.isFinite(publishedAt)) {
      const ageDays = Math.max((Date.now() - publishedAt) / 86_400_000, 0);
      score += Math.max(0, 0.6 - ageDays / 3650);
    }

    const normalizedScore = score / Math.max(tokens.length + 1, 1);
    if (normalizedScore < similarityThreshold) continue;

    scored.push({
      id: row.id,
      title: row.title,
      content: row.content,
      source_type: row.source_type,
      source_url: row.source_url,
      published_date: row.published_date,
      tags: rowTags,
      chunk_index: Number(row.chunk_index || 0),
      parent_doc_id: row.parent_doc_id,
      similarity: Number(normalizedScore.toFixed(4)),
      parentKey: row.parent_doc_id || row.id,
    });
  }

  scored.sort((left, right) => {
    if (right.similarity !== left.similarity) {
      return right.similarity - left.similarity;
    }
    const rightDate = Date.parse(right.published_date || "") || 0;
    const leftDate = Date.parse(left.published_date || "") || 0;
    return rightDate - leftDate;
  });

  const deduped: RagSearchResult[] = [];
  const seenParents = new Set<string>();

  for (const row of scored) {
    if (seenParents.has(row.parentKey)) continue;
    seenParents.add(row.parentKey);

    deduped.push({
      id: row.id,
      title: row.title,
      content: row.content.length > 1600 ? `${row.content.slice(0, 1600)}...` : row.content,
      source_type: row.source_type,
      source_url: row.source_url,
      published_date: row.published_date,
      tags: row.tags,
      chunk_index: row.chunk_index,
      parent_doc_id: row.parent_doc_id,
      similarity: row.similarity,
    });

    if (deduped.length >= topK) break;
  }

  return deduped;
}

export async function searchRagContext({
  supabase,
  query,
  topK = 5,
  similarityThreshold = 0.25,
  sourceTypes = [],
  tags = [],
}: SearchOptions): Promise<RagSearchResult[]> {
  const cleanedQuery = query.trim();
  if (!cleanedQuery) return [];

  const safeTopK = Math.max(1, Math.min(10, Math.round(topK)));
  const safeThreshold = clampNumber(similarityThreshold, 0, 5);
  const normalizedTypes = sourceTypes
    .map((entry) => normalizeRagSourceType(entry))
    .filter((entry): entry is RagSourceType => entry !== null);
  const normalizedTags = normalizeRagTags(tags);

  const rpcResults = await searchViaRpc({
    supabase,
    query: cleanedQuery,
    topK: safeTopK,
    sourceTypes: normalizedTypes,
    tags: normalizedTags,
  });

  if (rpcResults !== null) {
    return rpcResults;
  }

  return searchFallback({
    supabase,
    query: cleanedQuery,
    topK: safeTopK,
    similarityThreshold: safeThreshold,
    sourceTypes: normalizedTypes,
    tags: normalizedTags,
  });
}

export function formatRagContextForPrompt(results: RagSearchResult[]): string {
  if (results.length === 0) return "";

  const blocks = results
    .map((result, index) => {
      const lines = [
        `[Source ${index + 1}] ${result.title}`,
        `Type: ${result.source_type}`,
        `Published: ${result.published_date}`,
        `Relevance score: ${result.similarity.toFixed(3)}`,
        result.content,
      ];

      if (result.source_url) {
        lines.push(`URL: ${result.source_url}`);
      }

      if (result.tags.length > 0) {
        lines.push(`Tags: ${result.tags.join(", ")}`);
      }

      return lines.join("\n");
    })
    .join("\n\n---\n\n");

  return [
    "",
    "Retrieved Philippine Market Context (RAG Corpus):",
    blocks,
    "",
    "RAG Rules:",
    "- Cite corpus-backed claims using [Source N].",
    "- If corpus context is missing or stale, explicitly say so.",
    "- Prefer these sources over generic model memory for PH-specific questions.",
  ].join("\n");
}
