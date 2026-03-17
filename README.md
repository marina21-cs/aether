<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AETHER Local Development

This repository runs a Vite frontend plus an Express API server used for webhook handling and Phase 3 intelligence endpoints.

## Run Locally

Prerequisites:
- Node.js 20+

1. Install dependencies:
   `npm install`
2. Create/update `.env.local` from `.env.example`.
3. Add required credentials:
   - Clerk + Supabase values
   - `OPENROUTER_API_KEY`
   - `AI_MODEL` (default: `qwen/qwen3-coder:free`)
4. Start frontend:
   `npm run dev`
5. Start API server (new terminal):
   `npm run webhook`

Frontend runs on `http://localhost:3000` and API/webhook server runs on `http://localhost:3001`.
