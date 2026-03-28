# Vercel Implementation Guide

This guide deploys the AETHER website (Vite + React) to Vercel with production-safe defaults.

## Deployment Model (Recommended)

- Deploy frontend on Vercel.
- Keep API server (`server/webhook.ts`) on a separate Node host (Render, Railway, Fly.io, VM, etc).
- Point frontend requests to that API with `VITE_API_BASE_URL`.

Why this model:
- The frontend is static and deploys cleanly on Vercel.
- The current API server is a long-running Express app, not a native Vercel serverless layout.

## Prerequisites

- Node.js 20+
- Vercel account and Git provider connected
- Working Clerk and Supabase projects
- Backend API already deployed (or at least a stable URL for production)

## 1) Import Project In Vercel

1. Open Vercel dashboard.
2. Click **Add New > Project**.
3. Import this repository.
4. Use these build settings:
	 - Framework Preset: `Vite`
	 - Build Command: `npm run build`
	 - Output Directory: `dist`
	 - Install Command: `npm install`

## 2) Configure Environment Variables

Add these in Vercel Project Settings > Environment Variables.

Required (frontend):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_URL=https://your-frontend-domain.vercel.app
VITE_APP_NAME=AETHER
VITE_API_BASE_URL=https://your-api-domain.com
```

Optional (used by price/features if enabled):

```env
VITE_COINGECKO_API_KEY=
VITE_EXCHANGE_RATE_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
```

Important:
- Do not place server-only secrets in the frontend Vercel project (for example `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `CLERK_SECRET_KEY`, `VAPID_PRIVATE_KEY`).
- Put required variables in both `Preview` and `Production` environments.

## 3) Handle SPA Routes

This app uses `BrowserRouter`, so direct links like `/dashboard/simulator` must resolve to `index.html`.

If deep links return 404 in Vercel, add this file at repo root:

```json
{
	"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 4) Clerk Production Setup

In Clerk dashboard:
- Add your production frontend URL to allowed origins.
- Set production redirect URLs to match app routes (for example `/sign-in`, `/sign-up`, `/onboarding`).

## 5) Deploy

### Option A: Git-based (recommended)

- Push to `main`.
- Vercel auto-builds and deploys.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

## 6) Post-Deploy Validation Checklist

- Landing page loads.
- Sign-in/sign-up works.
- Protected pages load after auth.
- Deep links work (refresh on `/dashboard/...` does not 404).
- API calls from frontend succeed (check Network tab for `/api/v1/...` target URL from `VITE_API_BASE_URL`).
- Supabase reads/writes function as expected.

## 7) Troubleshooting

`Missing VITE_CLERK_PUBLISHABLE_KEY` at runtime:
- Variable is missing in Vercel, or set only for one environment.

Auth works locally but fails in production:
- Clerk allowed origins/redirect URLs are not updated for production domain.

Frontend loads but API calls fail:
- `VITE_API_BASE_URL` is wrong, backend is down, or backend CORS is not allowing your Vercel domain.

Refreshing nested routes gives 404:
- Add `vercel.json` rewrite to `index.html`.

## 8) Release Safety

- Use Vercel Preview deployments for all PRs.
- Keep `main` protected and deploy from reviewed merges.
- Validate Preview before promoting to production.
