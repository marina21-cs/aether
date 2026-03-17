# Phase 5 — Testing Guide

What to test for Phase 5 (RAG + Data Pipeline + PDF Export).

---

## 1. RAG Knowledge Base

### 1.1 Document Ingestion

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.1.1 | Chunk document | Ingest a BSP circular | Document split into ~512-token chunks |
| 1.1.2 | Overlap correct | Check consecutive chunks | ~50-token overlap between adjacent chunks |
| 1.1.3 | Embedding generated | Check market_context table | content_vector column populated (1536 dims) |
| 1.1.4 | Metadata stored | Check row data | source_type, title, published_date, tags all present |
| 1.1.5 | Source URL | Check row | Original URL stored for citation |
| 1.1.6 | Duplicate detection | Ingest same document twice | Second attempt skipped or updates existing |
| 1.1.7 | Large document | Ingest 20-page report | Splits into multiple chunks, all stored |

### 1.2 Retrieval

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.2.1 | Similarity search | Query "What is BSP rate?" | Returns top-K relevant chunks |
| 1.2.2 | Relevance | Check returned chunks | Content relates to BSP monetary policy |
| 1.2.3 | Threshold filter | Query random gibberish | Returns empty (below similarity threshold) |
| 1.2.4 | Top-K respected | Query with many matches | Returns exactly K results |
| 1.2.5 | Score ordering | Check result order | Highest similarity first |
| 1.2.6 | Performance | Measure query time | < 200ms for similarity search |

### 1.3 RAG + AI Advisor Integration

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.3.1 | RAG augmented response | Ask about BSP policy | Response cites specific BSP documents |
| 1.3.2 | Citations shown | Check response format | Source titles and URLs displayed |
| 1.3.3 | No RAG fallback | Ask general portfolio question | Uses smart prompting (no irrelevant RAG injection) |
| 1.3.4 | Context size | Check total prompt size | Portfolio + RAG + conversation < token limit |
| 1.3.5 | Quality improvement | Compare RAG vs non-RAG answers | RAG answers more specific and grounded |

---

## 2. Automated Data Pipeline (Edge Functions)

### 2.1 Price Refresh

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.1.1 | Function deploys | `supabase functions deploy price-refresh` | Deploys without errors |
| 2.1.2 | CoinGecko refresh | Trigger function | Crypto prices updated in price_cache |
| 2.1.3 | PSE refresh | Trigger function | PSE stock prices updated |
| 2.1.4 | BSP forex refresh | Trigger function | Exchange rates updated |
| 2.1.5 | Error handling | Simulate CoinGecko down | Uses cached values, logs error |
| 2.1.6 | Schedule works | Wait 15 minutes | Function auto-triggers |
| 2.1.7 | Rate limit respected | Check API call count | Within CoinGecko free tier limits |

### 2.2 CPI Updater

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.2.1 | Function deploys | Deploy CPI updater | Deploys without errors |
| 2.2.2 | Manual trigger | Invoke function | CPI value updated in config |
| 2.2.3 | Monthly schedule | Check cron config | Runs 1st of every month |
| 2.2.4 | AI context updates | Ask advisor about inflation after update | Uses new CPI value |

### 2.3 Alert Checker (if not covered in Phase 4)

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.3.1 | Evaluates alerts | Create price alert, trigger refresh | Alert fires when threshold crossed |
| 2.3.2 | 5-minute interval | Check execution logs | Runs every 5 minutes |
| 2.3.3 | Multiple users | Create alerts for different users | Each user's alerts evaluated |
| 2.3.4 | Alert dedup | Same condition persists | Alert fires once, not repeatedly |

---

## 3. PDF Report Export

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.1 | Generate report | Click "Export PDF" on dashboard | PDF file downloads |
| 3.2 | Content completeness | Open PDF | Contains: net worth, allocation, holdings, performance, fees |
| 3.3 | Correct data | Compare PDF to dashboard | Numbers match current dashboard values |
| 3.4 | Formatting | Check PDF layout | Professional layout with AETHER branding |
| 3.5 | Charts render | Check charts in PDF | Performance chart and allocation bar visible |
| 3.6 | Disclaimer | Check PDF footer | "AETHER provides analysis, not financial advice" |
| 3.7 | Date stamp | Check PDF header | "Generated on [date]" present |
| 3.8 | File size | Check download | Reasonable size (< 5MB for typical report) |
| 3.9 | Empty portfolio | Generate with no assets | Meaningful empty report or error message |
| 3.10 | API endpoint | POST /api/v1/reports/pdf | Returns PDF binary with correct content-type |

---

## 4. Corpus Management

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 4.1 | Document count | `SELECT COUNT(*) FROM market_context` | 50–100 document chunks stored |
| 4.2 | Source diversity | Check source_type distribution | BSP, PSE, SEC, PSA, news all represented |
| 4.3 | Freshness | Check published_date range | Documents from last 12 months |
| 4.4 | Tags useful | Query by tag | Can filter by topic (e.g., 'interest_rate', 'inflation') |
| 4.5 | No duplicates | Check for duplicate content | No identical content rows |

---

## Algorithm Validation

### Chunking
```
Input: 2000-token document
Expected chunks with size=512, overlap=50:
  Chunk 1: tokens 0-511
  Chunk 2: tokens 462-973
  Chunk 3: tokens 924-1435
  Chunk 4: tokens 1386-1897
  Chunk 5: tokens 1848-1999
Total: 5 chunks
```

### Cosine Similarity
```
Test: embed("BSP monetary policy rate") vs embed("interest rate decision Philippines")
Expected: similarity > 0.8 (highly related)

Test: embed("BSP monetary policy rate") vs embed("recipe for adobo")
Expected: similarity < 0.3 (unrelated)
```
