-- ============================================================
-- AETHER Phase 5 — Free RAG + Data Pipeline
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS market_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL
    CHECK (source_type IN (
      'bsp_circular',
      'pse_disclosure',
      'sec_advisory',
      'psa_cpi',
      'news',
      'regulation',
      'research'
    )),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  published_date DATE NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  chunk_index INTEGER NOT NULL DEFAULT 0,
  parent_doc_id UUID NOT NULL,
  token_count INTEGER,
  document_key TEXT NOT NULL,
  content_sha256 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_type TEXT NOT NULL
    CHECK (pipeline_type IN ('price_refresh', 'cpi_update', 'alert_check', 'corpus_ingest')),
  status TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'success', 'failed')),
  records_processed INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_market_context_document_chunk
  ON market_context(document_key, chunk_index);

CREATE INDEX IF NOT EXISTS idx_market_context_source_date
  ON market_context(source_type, published_date DESC);

CREATE INDEX IF NOT EXISTS idx_market_context_parent_doc
  ON market_context(parent_doc_id);

CREATE INDEX IF NOT EXISTS idx_market_context_tags_gin
  ON market_context USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_market_context_title_trgm
  ON market_context USING GIN(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_market_context_content_trgm
  ON market_context USING GIN(content gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_type_started
  ON pipeline_runs(pipeline_type, started_at DESC);

ALTER TABLE market_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read market context" ON market_context;
CREATE POLICY "Authenticated users can read market context"
  ON market_context FOR SELECT
  USING (auth.jwt() IS NOT NULL);

DROP POLICY IF EXISTS "No user access to pipeline runs" ON pipeline_runs;
CREATE POLICY "No user access to pipeline runs"
  ON pipeline_runs FOR SELECT
  USING (false);

CREATE OR REPLACE FUNCTION search_market_context(
  query_text TEXT,
  match_count INT DEFAULT 5,
  filter_source_types TEXT[] DEFAULT NULL,
  filter_tags TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source_type TEXT,
  source_url TEXT,
  published_date DATE,
  tags TEXT[],
  chunk_index INTEGER,
  parent_doc_id UUID,
  similarity DOUBLE PRECISION
)
LANGUAGE SQL
STABLE
AS $$
  WITH scored AS (
    SELECT
      mc.id,
      mc.title,
      mc.content,
      mc.source_type,
      mc.source_url,
      mc.published_date,
      mc.tags,
      mc.chunk_index,
      mc.parent_doc_id,
      (
        ts_rank(
          to_tsvector('simple', coalesce(mc.title, '') || ' ' || coalesce(mc.content, '')),
          plainto_tsquery('simple', query_text)
        ) * 0.7
        + GREATEST(
          similarity(lower(mc.title), lower(query_text)),
          similarity(lower(mc.content), lower(query_text))
        ) * 0.3
      ) AS score
    FROM market_context mc
    WHERE
      (
        filter_source_types IS NULL
        OR mc.source_type = ANY(filter_source_types)
      )
      AND (
        filter_tags IS NULL
        OR mc.tags && filter_tags
      )
  )
  SELECT
    scored.id,
    scored.title,
    scored.content,
    scored.source_type,
    scored.source_url,
    scored.published_date,
    scored.tags,
    scored.chunk_index,
    scored.parent_doc_id,
    scored.score AS similarity
  FROM scored
  WHERE scored.score > 0
  ORDER BY scored.score DESC, scored.published_date DESC
  LIMIT GREATEST(match_count, 1);
$$;
