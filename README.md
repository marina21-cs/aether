
# AETHER

AETHER is a personal wealth intelligence platform focused on Filipino investors. It combines portfolio tracking, scenario simulation, market context retrieval, and AI-assisted guidance in one web app.

## What AETHER Does

- Portfolio hub for equities, crypto, cash, and tangible assets
- Monte Carlo simulation with conservative, typical, and optimistic outcome ranges
- Glass Box analytics that show assumptions and risk math in plain language
- AI advisor with streaming responses and portfolio-aware context
- Alerts and notifications for price targets, portfolio moves, and macro triggers
- Free RAG pipeline for Philippine market context retrieval

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Auth: Clerk
- Database and storage: Supabase
- API server: Express + TypeScript
- Charts and UI: Recharts + Lucide
- AI: OpenRouter-compatible model integration

## Project Architecture

- Frontend app runs on port `3000`
- API and webhook server runs on port `3001`
- Frontend calls backend routes via `VITE_API_BASE_URL` (or local proxy in dev)

## Local Setup

Prerequisites:
- Node.js 20+

1. Install dependencies.

```bash
npm install
```

2. Create local environment file.

```bash
cp .env.example .env.local
```

3. Fill required credentials in `.env.local`.

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLERK_WEBHOOK_SECRET`
- `OPENROUTER_API_KEY`
- `AI_MODEL` (default: `qwen/qwen3-coder:free`)

4. Start frontend.

```bash
npm run dev
```

5. Start API server in a second terminal.

```bash
npm run webhook
```

App URLs:
- Frontend: `http://localhost:3000`
- API server: `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build production frontend assets
- `npm run preview` - Preview built frontend
- `npm run lint` - Type-check project
- `npm run webhook` - Run Express API and webhook server

## Phase 5: Free RAG + Data Pipeline

This repository includes a retrieval-first RAG flow that does not require paid embedding APIs.

### Quick Start

1. Apply Supabase migrations.

```bash
supabase db push
```

2. Confirm Phase 5 variables are present in `.env.local`.
3. Run frontend and API server.

### Phase 5 API Endpoints

- `POST /api/v1/rag/ingest` - Ingest corpus document (admin/pro)
- `POST /api/v1/rag/search` - Search indexed market context
- `GET /api/v1/rag/corpus` - List corpus chunks
- `POST /api/v1/pipeline/price-refresh` - Refresh free-source price and FX cache (admin/pro)
- `POST /api/v1/pipeline/cpi-update` - Update CPI snapshot (admin/pro)

The advisor route `POST /api/v1/advisor/ask` automatically uses RAG context when relevant sources are found.

## Deployment Notes

- Frontend deploy target: Vercel
- Current API server is long-running Express, deploy separately (Render, Railway, Fly.io, VM, or similar)
- Point frontend to API host using `VITE_API_BASE_URL`

Detailed deployment runbook is available in `feature/vercel_implementation_guide/README.md`.
