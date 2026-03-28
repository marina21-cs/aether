# AETHER Deployment Copy-Paste Sheet

This file is a single checklist + copy-paste source for your Render backend and Vercel frontend.

## 1) Setup Order (Fast + Safe)

1. Deploy backend on Render first.
2. Copy the Render URL (example: https://aether-api.onrender.com).
3. Add Vercel env vars and deploy frontend.
4. Copy your Vercel URL (example: https://aether-xyz.vercel.app).
5. Update Render VITE_APP_URL to your Vercel URL, then redeploy Render.
6. Update Clerk webhook + allowed origins.

## 2) Render Form Values (exact)

- Name: aether-api
- Language: Node
- Branch: main
- Region: Oregon (US West) or Singapore
- Root Directory: leave empty
- Build Command: npm install
- Start Command: npm run webhook
- Health Check Path: /health

If Render cannot find package.json, set Root Directory to: aether

## 3) Render Environment Variables (copy and paste)

Paste this in Render Add from .env:

WEBHOOK_PORT=10000
CLERK_WEBHOOK_SECRET=PASTE_FROM_.env.local
VITE_SUPABASE_URL=https://oydjfbaiuqyhaudywmfh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=PASTE_FROM_.env.local
OPENROUTER_API_KEY=PASTE_FROM_.env.local
AI_MODEL=nvidia/nemotron-3-super-120b-a12b:free
VITE_APP_URL=https://YOUR-VERCEL-APP.vercel.app
VITE_APP_NAME=AETHER
VITE_EXCHANGE_RATE_API_KEY=PASTE_FROM_.env.local
VITE_COINGECKO_API_KEY=PASTE_FROM_.env.local
NEXT_PUBLIC_VAPID_PUBLIC_KEY=PASTE_FROM_.env.local
VAPID_PRIVATE_KEY=PASTE_FROM_.env.local
VAPID_SUBJECT=mailto:admin@aether.ph
RESEND_API_KEY=PASTE_FROM_.env.local
RESEND_FROM_EMAIL=AETHER <onboarding@resend.dev>
ALERT_CHECK_INTERVAL=300000
MAX_ALERTS_FREE=10
MAX_ALERTS_PRO=50
DIGEST_SEND_DAY=1
DIGEST_SEND_HOUR=8
RAG_CHUNK_SIZE=512
RAG_CHUNK_OVERLAP=50
RAG_TOP_K=5
RAG_SIMILARITY_THRESHOLD=0.25
RAG_ADMIN_USER_IDS=

## 4) Vercel Environment Variables (copy and paste)

Paste this in Vercel Project Settings -> Environment Variables:

VITE_CLERK_PUBLISHABLE_KEY=PASTE_FROM_.env.local_or_pk_live
VITE_SUPABASE_URL=https://oydjfbaiuqyhaudywmfh.supabase.co
VITE_SUPABASE_ANON_KEY=PASTE_FROM_.env.local
VITE_APP_URL=https://YOUR-VERCEL-APP.vercel.app
VITE_APP_NAME=AETHER
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com

## 5) Values You Must Replace

- YOUR-RENDER-SERVICE.onrender.com
- YOUR-VERCEL-APP.vercel.app
- Any line marked PASTE_FROM_.env.local

## 6) Quick Verify

1. Render health check: https://YOUR-RENDER-SERVICE.onrender.com/health should return OK.
2. Vercel site opens normally.
3. Frontend API requests target your Render URL.

## 7) Clerk Production Setup

- Webhook endpoint: https://YOUR-RENDER-SERVICE.onrender.com/api/webhooks/clerk
- Allowed origins: add https://YOUR-VERCEL-APP.vercel.app
- Redirect URLs: include your production sign-in/sign-up URLs.

## 8) Fast Extract Helper (local)

Run this from project root to print the exact values you need from .env.local:

grep -E '^(VITE_CLERK_PUBLISHABLE_KEY|VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY|CLERK_WEBHOOK_SECRET|SUPABASE_SERVICE_ROLE_KEY|OPENROUTER_API_KEY|VITE_EXCHANGE_RATE_API_KEY|VITE_COINGECKO_API_KEY|NEXT_PUBLIC_VAPID_PUBLIC_KEY|VAPID_PRIVATE_KEY|RESEND_API_KEY|VITE_APP_NAME)=' .env.local
