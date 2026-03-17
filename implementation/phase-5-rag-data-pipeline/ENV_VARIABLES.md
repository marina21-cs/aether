# Phase 5 — Environment Variables

Add these to `.env.local` (in addition to Phase 1+2+3+4 variables).

---

```env
# ============================================================
# OPENAI (Embeddings for RAG Knowledge Base)
# ============================================================
# Get from: https://platform.openai.com → API Keys
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

# Embedding model config
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536

# ============================================================
# RAG CONFIGURATION
# ============================================================
# Document chunking
RAG_CHUNK_SIZE=512              # Max tokens per chunk
RAG_CHUNK_OVERLAP=50            # Overlap tokens between chunks

# Retrieval
RAG_TOP_K=5                     # Number of chunks to retrieve per query
RAG_SIMILARITY_THRESHOLD=0.7    # Minimum cosine similarity (0-1)

# ============================================================
# EDGE FUNCTION SCHEDULES (Supabase cron)
# ============================================================
# Price refresh: every 15 minutes
PRICE_REFRESH_CRON=*/15 * * * *

# CPI update: 1st of every month at 9 AM PHT
CPI_UPDATE_CRON=0 1 1 * *

# Alert checker: every 5 minutes
ALERT_CHECK_CRON=*/5 * * * *
```

---

## .env.example additions

```env
# Phase 5
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536
RAG_CHUNK_SIZE=512
RAG_CHUNK_OVERLAP=50
RAG_TOP_K=5
RAG_SIMILARITY_THRESHOLD=0.7
PRICE_REFRESH_CRON=*/15 * * * *
CPI_UPDATE_CRON=0 1 1 * *
ALERT_CHECK_CRON=*/5 * * * *
```

---

## Security Notes

- `OPENAI_API_KEY` is server-only — NEVER expose to client
- Embedding API calls should only happen during ingestion (one-time) and queries
- Rate limit embedding generation to avoid unexpected costs
- Monitor OpenAI usage dashboard for cost tracking
