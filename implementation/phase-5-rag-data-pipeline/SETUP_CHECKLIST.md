# Phase 5 — Setup Checklist

Complete these items before starting Phase 5 implementation.

---

## Prerequisites

- [ ] **Phases 1–4 fully complete**
- [ ] Simulator, alerts, multi-currency, email digest all working
- [ ] All previous verification checks pass

---

## 1. API Keys & External Services

### OpenAI (Embeddings)
- [ ] Create account at [platform.openai.com](https://platform.openai.com)
- [ ] Go to API Keys → Create new secret key
- [ ] Copy API key → `OPENAI_API_KEY`
- [ ] Enable billing (embeddings are cheap: ~$0.02 per 1M tokens)
- [ ] Model to use: `text-embedding-3-small` (1536 dimensions)
- [ ] Test: Generate an embedding for a test string

### pgvector Extension (Supabase)
- [ ] Enable pgvector in Supabase:
  - Go to Supabase Dashboard → Database → Extensions
  - Search for "vector" and enable it
  - Or run: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Verify: `SELECT * FROM pg_extension WHERE extname = 'vector';`

---

## 2. Environment Variables to Add

```env
# ============================================================
# OPENAI (Embeddings for RAG)
# ============================================================
# Get from: https://platform.openai.com → API Keys
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_EMBEDDING_DIMENSIONS=1536

# ============================================================
# RAG CONFIGURATION
# ============================================================
RAG_CHUNK_SIZE=512              # Tokens per chunk
RAG_CHUNK_OVERLAP=50            # Token overlap between chunks
RAG_TOP_K=5                      # Number of similar chunks to retrieve
RAG_SIMILARITY_THRESHOLD=0.7    # Minimum cosine similarity score
```

---

## 3. Dependencies to Install

```bash
pnpm add openai                      # OpenAI SDK for embeddings
pnpm add @react-pdf/renderer         # PDF generation with React components
pnpm add pdf-lib                     # Alternative: low-level PDF manipulation
pnpm add gpt-tokenizer               # Token counting for chunking
```

---

## 4. Philippine Financial Document Corpus

Curate 50–100 documents for the RAG knowledge base:

### BSP (Bangko Sentral ng Pilipinas)
- [ ] Latest monetary policy statement (rate decisions)
- [ ] BSP circulars on consumer lending rates
- [ ] Financial stability report
- [ ] BSP reference exchange rate methodology
- [ ] Open Finance Framework documentation
- Source: [bsp.gov.ph](https://www.bsp.gov.ph)

### PSE (Philippine Stock Exchange)
- [ ] PSEi constituent list and methodology
- [ ] Top REIT disclosures (AREIT, DDMP, FILRT, RCR)
- [ ] PSE market rules summary
- [ ] Blue chip company profiles (TOP 30)
- Source: [edge.pse.com.ph](https://edge.pse.com.ph)

### SEC (Securities and Exchange Commission)
- [ ] UITF registration and fee disclosures
- [ ] Investment advisory regulations
- [ ] SEC advisories on investment scams
- Source: [sec.gov.ph](https://www.sec.gov.ph)

### PSA (Philippine Statistics Authority)
- [ ] Monthly CPI reports (last 12 months)
- [ ] Property price index reports
- [ ] Economic performance summaries
- Source: [psa.gov.ph](https://psa.gov.ph)

### General PH Finance
- [ ] FMETF (First Metro ETF) prospectus summary
- [ ] Common UITF product sheets (BPI, BDO, Metro)
- [ ] Pag-IBIG MP2 guide
- [ ] SSS investment fund options
- [ ] Tax-related: capital gains tax on PSE, real property tax

### Storage
- [ ] Store raw documents as markdown or plain text
- [ ] Create a `/data/corpus/` directory for source files
- [ ] Track document metadata (source, date, URL, tags)

---

## 5. Supabase Edge Functions

```bash
# Create new Edge Functions
supabase functions new price-refresh
supabase functions new cpi-updater
supabase functions new alert-checker   # (if not created in Phase 4)

# Test locally
supabase functions serve price-refresh --env-file .env.local
```

---

## 6. PDF Report Template

Prepare the report structure:
- [ ] Page 1: Portfolio Summary (net worth, allocation pie/bar)
- [ ] Page 2: Holdings Detail Table
- [ ] Page 3: Performance Chart (last 12 months)
- [ ] Page 4: Fee Analysis Summary
- [ ] Page 5: Real Return Analysis
- [ ] Footer: Disclaimer, generation date, AETHER branding

---

## 7. Pre-Implementation Verification

- [ ] pgvector: Can you create a table with a VECTOR(1536) column?
- [ ] OpenAI: Can you generate an embedding and store it in pgvector?
- [ ] Similarity search: Can you run a cosine similarity query?
- [ ] Edge Functions: Do they deploy and run on schedule?
- [ ] PDF: Can you generate a basic PDF with React PDF?

---

**Once all checkboxes are checked, proceed to `IMPLEMENTATION_GUIDE.md`.**
