# Phase 1 — Foundation · Implementation Guide

**Phase:** 1 of 6 · Foundation
**Weeks:** 1–4
**Prerequisites:** All items in `SETUP_CHECKLIST.md` completed, env vars from `ENV_VARIABLES.md` configured
**Depends on:** Nothing (this is the first phase)

---

## Context

Phase 1 scaffolds the entire AETHER application: Next.js 15 App Router with TypeScript strict mode, Tailwind CSS 4 with the AETHER dark glassmorphism design system, Clerk authentication (email/password + Google OAuth), Supabase database with Row-Level Security using Clerk JWTs, and the 4-screen onboarding wizard.

**Key Decision:** This implementation uses **Clerk** for authentication instead of Supabase Auth as mentioned in the original spec. Clerk handles all auth UI and backend; Supabase is used purely as the database with RLS policies that validate Clerk JWTs.

---

## Directory Structure (End of Phase 1)

```
aether/
├── .env.local                          # Environment variables (gitignored)
├── .env.example                        # Template for env vars
├── .gitignore
├── next.config.ts                      # Next.js 15 configuration
├── tailwind.config.ts                  # Tailwind CSS 4 config with AETHER tokens
├── tsconfig.json                       # TypeScript strict mode
├── package.json
├── pnpm-lock.yaml
├── middleware.ts                        # Clerk auth middleware
├── public/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── aether-logo.svg                # AETHER logo (violet square + arrow)
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout — Clerk provider, fonts, metadata
│   │   ├── page.tsx                    # Landing page (redirect to dashboard if signed in)
│   │   ├── globals.css                 # Tailwind directives + CSS custom properties
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx            # Clerk sign-in with AETHER split-screen layout
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx            # Clerk sign-up with AETHER split-screen layout
│   │   ├── onboarding/
│   │   │   └── page.tsx                # 3-step onboarding wizard (risk, currency, welcome)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Dashboard shell — sidebar + main + right rail
│   │   │   └── page.tsx                # Placeholder dashboard (Phase 2)
│   │   └── api/
│   │       └── webhooks/
│   │           └── clerk/
│   │               └── route.ts        # Clerk webhook → upsert profiles
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components (installed via CLI)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── layout/
│   │   │   ├── sidebar.tsx             # 240px glassmorphic sidebar
│   │   │   ├── right-rail.tsx          # 320px collapsible AI advisor rail
│   │   │   └── glow-blobs.tsx          # Background glow blobs (decorative)
│   │   ├── auth/
│   │   │   ├── auth-layout.tsx         # Split-screen auth wrapper
│   │   │   └── brand-panel.tsx         # Left-half branded glass panel
│   │   └── onboarding/
│   │       ├── risk-profile-step.tsx   # Step 1: Conservative/Moderate/Aggressive
│   │       ├── currency-step.tsx       # Step 2: PHP/USD/SGD/HKD
│   │       └── welcome-step.tsx        # Step 3: Welcome modal
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Supabase browser client
│   │   │   ├── server.ts              # Supabase server client (with Clerk JWT)
│   │   │   └── admin.ts               # Supabase service-role client (webhooks only)
│   │   ├── utils.ts                    # cn() utility, formatCurrency, etc.
│   │   └── constants.ts               # App-wide constants
│   └── types/
│       ├── database.ts                 # Supabase generated types
│       └── index.ts                    # App-level type definitions
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql      # All Phase 1 tables + RLS policies
```

---

## Step-by-Step Implementation

### Step 1 — Scaffold Next.js 15 Project

```bash
pnpx create-next-app@latest aether-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd aether-app
```

**tsconfig.json** — Enable strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### Step 2 — Install Dependencies

```bash
# Auth
pnpm add @clerk/nextjs

# Database
pnpm add @supabase/supabase-js

# UI
pnpm add lucide-react class-variance-authority clsx tailwind-merge

# Webhook verification
pnpm add svix

# shadcn/ui init
pnpx shadcn@latest init
# When prompted:
#   Style: Default
#   Base color: Slate
#   CSS variables: Yes
```

Install shadcn/ui components:

```bash
pnpx shadcn@latest add button card input label
```

---

### Step 3 — Environment Variables

Create `.env.local` (see `ENV_VARIABLES.md` for full list):

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Step 4 — Tailwind CSS 4 + AETHER Design Tokens

**tailwind.config.ts:**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#08080f",
          secondary: "#0f0f1a",
          surface: "#13131f",
          elevated: "#1a1a2e",
        },
        accent: {
          primary: "#7c3aed",
          bright: "#a855f7",
          glow: "#c084fc",
          subtle: "rgba(124, 58, 237, 0.15)",
        },
        text: {
          primary: "#f1f0ff",
          secondary: "#9492b0",
          muted: "#4e4c6a",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.04)",
          border: "rgba(168, 85, 247, 0.18)",
        },
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171",
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          accent: "rgba(168, 85, 247, 0.3)",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(124, 58, 237, 0.12)",
        "glass-hover": "0 12px 48px rgba(124, 58, 237, 0.2)",
        glow: "0 0 20px rgba(124, 58, 237, 0.35)",
        "glow-hover": "0 0 28px rgba(168, 85, 247, 0.45)",
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**src/app/globals.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Base */
  --bg-primary: #08080f;
  --bg-secondary: #0f0f1a;
  --bg-surface: #13131f;
  --bg-elevated: #1a1a2e;

  /* Accent — Purple / Violet */
  --accent-primary: #7c3aed;
  --accent-bright: #a855f7;
  --accent-glow: #c084fc;
  --accent-subtle: rgba(124, 58, 237, 0.15);

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(168, 85, 247, 0.18);
  --glass-shadow: 0 8px 32px rgba(124, 58, 237, 0.12);

  /* Text */
  --text-primary: #f1f0ff;
  --text-secondary: #9492b0;
  --text-muted: #4e4c6a;

  /* Feedback */
  --success: #34d399;
  --warning: #fbbf24;
  --error: #f87171;

  /* Border */
  --border: rgba(255, 255, 255, 0.06);
  --border-accent: rgba(168, 85, 247, 0.3);

  /* Fonts */
  --font-display: "Syne", sans-serif;
  --font-body: "DM Sans", sans-serif;
}

html {
  color-scheme: dark;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Financial numbers */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Focus ring utility */
.focus-ring {
  @apply outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright;
}
```

---

### Step 5 — Root Layout with Clerk + Fonts

**src/app/layout.tsx:**

```tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AETHER — Wealth Intelligence for Filipino Investors",
  description:
    "A unified wealth management platform that gives Filipino retail investors a real-time, mathematically transparent view of their entire net worth across all asset classes.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  themeColor: "#08080f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
        <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

### Step 6 — Clerk Middleware

**middleware.ts** (project root):

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

### Step 7 — Supabase Client Setup

**src/lib/supabase/client.ts** (browser client):

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

> Note: Install `@supabase/ssr` alongside `@supabase/supabase-js`:
> ```bash
> pnpm add @supabase/ssr
> ```

**src/lib/supabase/server.ts** (server client with Clerk JWT):

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export async function createServerSupabaseClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in Server Components
          }
        },
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}
```

**src/lib/supabase/admin.ts** (service-role for webhooks):

```ts
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

---

### Step 8 — Utility Functions

**src/lib/utils.ts:**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "PHP"
): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
```

**src/lib/constants.ts:**

```ts
export const APP_NAME = "AETHER";
export const APP_TAGLINE = "Your net worth, to the peso.";

export const RISK_PROFILES = [
  {
    id: "conservative",
    label: "Conservative",
    description: "Preserve capital. Bonds, time deposits, low volatility.",
    icon: "Shield",
    iconColor: "text-success",
  },
  {
    id: "moderate",
    label: "Moderate",
    description: "Balanced growth. Mixed equities and fixed income.",
    icon: "Scale",
    iconColor: "text-accent-primary",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description:
      "Maximize growth. High equity allocation. Comfortable with drawdowns.",
    icon: "TrendingUp",
    iconColor: "text-warning",
  },
] as const;

export const CURRENCIES = [
  { code: "PHP", name: "Philippine Peso" },
  { code: "USD", name: "US Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
] as const;

export const ASSET_CLASSES = [
  "pse_stock",
  "global_stock",
  "crypto",
  "real_estate",
  "uitf",
  "cash",
  "gold",
  "time_deposit",
  "other",
] as const;
```

---

### Step 9 — Database Schema (Supabase Migration)

**supabase/migrations/001_initial_schema.sql:**

```sql
-- ============================================================
-- AETHER Phase 1 — Initial Schema
-- Auth: Clerk (JWTs synced via webhook)
-- ============================================================

-- Profiles table (synced from Clerk via webhook)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,                -- Clerk user ID (e.g., "user_2abc...")
  email TEXT UNIQUE,
  full_name TEXT,
  risk_tolerance TEXT DEFAULT 'moderate'
    CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  base_currency TEXT DEFAULT 'PHP'
    CHECK (base_currency IN ('PHP', 'USD', 'SGD', 'HKD')),
  subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro')),
  onboarding_complete BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,            -- Added for Phase 6 Stripe
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assets table
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asset_class TEXT NOT NULL
    CHECK (asset_class IN (
      'pse_stock', 'global_stock', 'crypto', 'real_estate',
      'uitf', 'cash', 'gold', 'time_deposit', 'other'
    )),
  ticker_or_name TEXT NOT NULL,
  quantity NUMERIC(18, 8) NOT NULL,
  avg_cost_basis NUMERIC(18, 8),
  current_value_php NUMERIC(18, 2) NOT NULL,
  native_currency TEXT DEFAULT 'PHP',
  is_manual BOOLEAN DEFAULT true,
  annual_fee_pct NUMERIC(5, 4),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Liabilities table
CREATE TABLE liabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liability_type TEXT NOT NULL
    CHECK (liability_type IN (
      'credit_card', 'personal_loan', 'housing_loan', 'car_loan', 'other'
    )),
  name TEXT NOT NULL,
  outstanding_balance NUMERIC(18, 2) NOT NULL,
  interest_rate_pct NUMERIC(5, 4),
  monthly_payment NUMERIC(18, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  tx_type TEXT NOT NULL
    CHECK (tx_type IN (
      'buy', 'sell', 'dividend', 'rent_income', 'fee', 'deposit', 'withdrawal'
    )),
  amount_php NUMERIC(18, 2) NOT NULL,
  price_per_unit NUMERIC(18, 8),
  quantity NUMERIC(18, 8),
  tx_date TIMESTAMPTZ NOT NULL,
  source TEXT DEFAULT 'manual'
    CHECK (source IN ('manual', 'csv_import', 'api_sync')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Price cache
CREATE TABLE price_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT UNIQUE NOT NULL,
  price_php NUMERIC(18, 8) NOT NULL,
  source TEXT NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_assets_user ON assets(user_id);
CREATE INDEX idx_liabilities_user ON liabilities(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_asset ON transactions(asset_id);
CREATE INDEX idx_transactions_date ON transactions(tx_date DESC);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_price_cache_ticker ON price_cache(ticker);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_cache ENABLE ROW LEVEL SECURITY;

-- Helper: Extract Clerk user_id from JWT
-- Clerk sends the user ID as the "sub" claim in the JWT
-- In Supabase, auth.jwt() returns the decoded JWT payload.

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((auth.jwt() ->> 'sub') = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = id);

-- Assets: users can CRUD their own assets
CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own assets"
  ON assets FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own assets"
  ON assets FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own assets"
  ON assets FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Liabilities: same pattern
CREATE POLICY "Users can view own liabilities"
  ON liabilities FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own liabilities"
  ON liabilities FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can update own liabilities"
  ON liabilities FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can delete own liabilities"
  ON liabilities FOR DELETE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Transactions: same pattern
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- Audit log: read-only for users
CREATE POLICY "Users can view own audit log"
  ON audit_log FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Price cache: readable by all authenticated users
CREATE POLICY "Authenticated users can read price cache"
  ON price_cache FOR SELECT
  USING (auth.jwt() IS NOT NULL);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_liabilities_updated_at
  BEFORE UPDATE ON liabilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**How to run:** Go to Supabase Dashboard → SQL Editor → Paste and execute. Or use the Supabase CLI:

```bash
pnpm add -D supabase
pnpx supabase db push
```

**Configure Supabase JWT:** In Supabase Dashboard → Authentication → JWT Configuration, add the Clerk JWKS URL so Supabase can validate Clerk-issued tokens. The JWKS URL is found in Clerk Dashboard → API Keys → Advanced → JWKS URL (e.g., `https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json`).

---

### Step 10 — Clerk Webhook (Profile Sync)

**src/app/api/webhooks/clerk/route.ts:**

```ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createAdminClient();

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      const fullName = [first_name, last_name].filter(Boolean).join(" ");

      const { error } = await supabase.from("profiles").upsert(
        {
          id,
          email,
          full_name: fullName || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Webhook: Error upserting profile:", error);
        return new Response("Database error", { status: 500 });
      }
      break;
    }

    case "user.deleted": {
      const { id } = evt.data;
      if (id) {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Webhook: Error deleting profile:", error);
          return new Response("Database error", { status: 500 });
        }
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
```

---

### Step 11 — Type Definitions

**src/types/database.ts:**

```ts
export type RiskTolerance = "conservative" | "moderate" | "aggressive";
export type BaseCurrency = "PHP" | "USD" | "SGD" | "HKD";
export type SubscriptionTier = "free" | "pro";

export type AssetClass =
  | "pse_stock"
  | "global_stock"
  | "crypto"
  | "real_estate"
  | "uitf"
  | "cash"
  | "gold"
  | "time_deposit"
  | "other";

export type LiabilityType =
  | "credit_card"
  | "personal_loan"
  | "housing_loan"
  | "car_loan"
  | "other";

export type TransactionType =
  | "buy"
  | "sell"
  | "dividend"
  | "rent_income"
  | "fee"
  | "deposit"
  | "withdrawal";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  risk_tolerance: RiskTolerance;
  base_currency: BaseCurrency;
  subscription_tier: SubscriptionTier;
  onboarding_complete: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  asset_class: AssetClass;
  ticker_or_name: string;
  quantity: number;
  avg_cost_basis: number | null;
  current_value_php: number;
  native_currency: string;
  is_manual: boolean;
  annual_fee_pct: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Liability {
  id: string;
  user_id: string;
  liability_type: LiabilityType;
  name: string;
  outstanding_balance: number;
  interest_rate_pct: number | null;
  monthly_payment: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  asset_id: string | null;
  tx_type: TransactionType;
  amount_php: number;
  price_per_unit: number | null;
  quantity: number | null;
  tx_date: string;
  source: "manual" | "csv_import" | "api_sync";
  notes: string | null;
  created_at: string;
}

export interface PriceCache {
  id: string;
  ticker: string;
  price_php: number;
  source: string;
  fetched_at: string;
}
```

---

### Step 12 — Background Glow Blobs Component

**src/components/layout/glow-blobs.tsx:**

```tsx
export function GlowBlobs() {
  return (
    <>
      <div
        className="pointer-events-none fixed -left-[100px] -top-[200px] z-0 h-[600px] w-[600px] rounded-full opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -right-[100px] bottom-[20%] z-0 h-[400px] w-[400px] rounded-full opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
```

---

### Step 13 — Auth Layout (Split-Screen)

**src/components/auth/brand-panel.tsx:**

```tsx
import { Shield, Eye, Lock } from "lucide-react";

const trustSignals = [
  { icon: Lock, text: "AES-256 encrypted" },
  { icon: Shield, text: "Read-only access to brokerages" },
  { icon: Eye, text: "You control your data" },
];

export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative bg-bg-surface border-r border-glass-border backdrop-blur-[12px]">
      <div className="flex flex-col items-center gap-12">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-primary">
            AETHER
          </h1>
          <p className="font-body text-lg text-text-muted">
            Your net worth, to the peso.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col gap-4">
          {trustSignals.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon
                size={18}
                className="text-success flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-body text-sm font-medium text-text-secondary">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**src/components/auth/auth-layout.tsx:**

```tsx
import { GlowBlobs } from "@/components/layout/glow-blobs";
import { BrandPanel } from "./brand-panel";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      <GlowBlobs />
      <BrandPanel />
      <div className="flex w-full items-center justify-center bg-bg-primary px-6 lg:w-1/2">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
```

---

### Step 14 — Sign-Up Page

**src/app/sign-up/[[...sign-up]]/page.tsx:**

```tsx
import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-display text-[28px] font-bold text-text-primary text-wrap-balance">
            Create your account
          </h2>
          <p className="mt-2 font-body text-sm text-text-muted">
            Free forever. No credit card needed.
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-0 w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-glass-bg border border-glass-border backdrop-blur-[12px] rounded-[8px] h-[44px] text-text-primary font-body text-sm font-medium hover:border-border-accent transition-border-color duration-200",
              socialButtonsBlockButtonText: "text-text-primary font-body",
              dividerLine: "bg-border",
              dividerText: "text-text-muted font-body text-xs",
              formFieldLabel:
                "text-text-secondary font-body text-xs font-medium uppercase tracking-[0.04em]",
              formFieldInput:
                "bg-bg-elevated border border-glass-border rounded-[8px] h-[44px] text-text-primary font-body text-sm placeholder:text-text-muted focus:border-accent-bright focus:ring-2 focus:ring-accent-bright/15",
              formButtonPrimary:
                "bg-accent-primary hover:bg-accent-bright rounded-[8px] h-[44px] font-body text-sm font-medium shadow-glow hover:shadow-glow-hover transition-all duration-160 active:scale-[0.97]",
              footerAction: "hidden",
              formFieldInputShowPasswordButton: "text-text-muted",
              identityPreview: "bg-bg-elevated border border-glass-border",
              alert: "bg-bg-elevated border border-error/30 text-error",
            },
          }}
        />
        <p className="font-body text-xs text-text-muted text-center">
          Already have an account?{" "}
          <a href="/sign-in" className="text-accent-primary underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
```

---

### Step 15 — Sign-In Page

**src/app/sign-in/[[...sign-in]]/page.tsx:**

```tsx
import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-display text-[28px] font-bold text-text-primary text-wrap-balance">
            Welcome back
          </h2>
          <p className="mt-2 font-body text-sm text-text-muted">
            Sign in to your AETHER account.
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-0 w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-glass-bg border border-glass-border backdrop-blur-[12px] rounded-[8px] h-[44px] text-text-primary font-body text-sm font-medium hover:border-border-accent transition-border-color duration-200",
              socialButtonsBlockButtonText: "text-text-primary font-body",
              dividerLine: "bg-border",
              dividerText: "text-text-muted font-body text-xs",
              formFieldLabel:
                "text-text-secondary font-body text-xs font-medium uppercase tracking-[0.04em]",
              formFieldInput:
                "bg-bg-elevated border border-glass-border rounded-[8px] h-[44px] text-text-primary font-body text-sm placeholder:text-text-muted focus:border-accent-bright focus:ring-2 focus:ring-accent-bright/15",
              formButtonPrimary:
                "bg-accent-primary hover:bg-accent-bright rounded-[8px] h-[44px] font-body text-sm font-medium shadow-glow hover:shadow-glow-hover transition-all duration-160 active:scale-[0.97]",
              footerAction: "hidden",
              formFieldInputShowPasswordButton: "text-text-muted",
              alert: "bg-bg-elevated border border-error/30 text-error",
            },
          }}
        />
        <p className="font-body text-xs text-text-muted text-center">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-accent-primary underline">
            Create one
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
```

---

### Step 16 — Onboarding Flow (3 Steps)

**src/components/onboarding/risk-profile-step.tsx:**

```tsx
"use client";

import { Shield, Scale, TrendingUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RISK_PROFILES } from "@/lib/constants";
import type { RiskTolerance } from "@/types/database";

const iconMap = {
  Shield,
  Scale,
  TrendingUp,
};

interface RiskProfileStepProps {
  selected: RiskTolerance | null;
  onSelect: (value: RiskTolerance) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function RiskProfileStep({
  selected,
  onSelect,
  onContinue,
  onSkip,
}: RiskProfileStepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-[28px] font-bold text-text-primary text-wrap-balance">
          How do you handle risk?
        </h2>
        <p className="mt-2 font-body text-sm text-text-muted">
          Calibrates your AI advisor recommendations. Changeable anytime.
        </p>
      </div>

      {/* Risk Cards */}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Risk tolerance">
        {RISK_PROFILES.map((profile) => {
          const Icon = iconMap[profile.icon as keyof typeof iconMap];
          const isSelected = selected === profile.id;

          return (
            <button
              key={profile.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(profile.id as RiskTolerance)}
              className={cn(
                "relative flex items-start gap-3 rounded-[16px] border p-4 text-left backdrop-blur-[12px] transition-[border-color,box-shadow,transform] duration-200",
                "bg-glass-bg hover:-translate-y-0.5",
                isSelected
                  ? "border-accent-primary bg-accent-subtle shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                  : "border-glass-border hover:border-border-accent hover:shadow-[0_12px_48px_rgba(124,58,237,0.15)]"
              )}
            >
              <Icon
                size={20}
                className={cn("mt-0.5 flex-shrink-0", profile.iconColor)}
                aria-hidden="true"
              />
              <div>
                <span className="font-display text-base font-semibold text-text-primary">
                  {profile.label}
                </span>
                <p className="mt-0.5 font-body text-[13px] text-text-secondary">
                  {profile.description}
                </p>
              </div>
              {isSelected && (
                <Check
                  size={18}
                  className="absolute right-4 top-4 text-accent-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={onContinue}
          disabled={!selected}
          className={cn(
            "h-[44px] w-full rounded-[8px] font-body text-sm font-medium transition-[background,box-shadow,transform] duration-160 active:scale-[0.97]",
            selected
              ? "bg-accent-primary text-white shadow-glow hover:bg-accent-bright hover:shadow-glow-hover"
              : "cursor-not-allowed bg-bg-elevated text-text-muted"
          )}
        >
          Continue
        </button>
        <button
          onClick={onSkip}
          className="font-body text-sm font-medium text-text-muted hover:text-text-secondary focus-ring"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
```

**src/components/onboarding/currency-step.tsx:**

```tsx
"use client";

import { cn } from "@/lib/utils";
import { CURRENCIES } from "@/lib/constants";
import type { BaseCurrency } from "@/types/database";

interface CurrencyStepProps {
  selected: BaseCurrency;
  onSelect: (value: BaseCurrency) => void;
  onFinish: () => void;
}

export function CurrencyStep({
  selected,
  onSelect,
  onFinish,
}: CurrencyStepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-[28px] font-bold text-text-primary text-wrap-balance">
          What&apos;s your base currency?
        </h2>
        <p className="mt-2 font-body text-sm text-text-muted">
          All assets converted to this for display. PHP recommended for PH
          investors.
        </p>
      </div>

      {/* Currency Options */}
      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Base currency">
        {CURRENCIES.map((currency) => {
          const isSelected = selected === currency.code;

          return (
            <button
              key={currency.code}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(currency.code as BaseCurrency)}
              className={cn(
                "flex h-12 items-center justify-between rounded-[16px] border px-4 backdrop-blur-[12px] transition-[border-color,box-shadow] duration-200",
                "bg-glass-bg",
                isSelected
                  ? "border-accent-primary bg-accent-subtle"
                  : "border-glass-border hover:border-border-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-body text-sm font-medium text-text-primary">
                  {currency.code}
                </span>
                <span className="font-body text-sm text-text-secondary">
                  {currency.name}
                </span>
              </div>
              <div
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center rounded-full border",
                  isSelected
                    ? "border-accent-primary bg-accent-primary"
                    : "border-text-muted"
                )}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action */}
      <button
        onClick={onFinish}
        className="h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] focus-ring"
      >
        Finish setup
      </button>
    </div>
  );
}
```

**src/components/onboarding/welcome-step.tsx:**

```tsx
"use client";

import { Sparkles } from "lucide-react";

interface WelcomeStepProps {
  onConnect: () => void;
  onManual: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onConnect, onManual, onSkip }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 rounded-[20px] border border-glass-border bg-glass-bg p-8 backdrop-blur-[12px] shadow-glass">
      <Sparkles size={24} className="text-accent-primary" aria-hidden="true" />

      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-display text-2xl font-bold text-text-primary text-wrap-balance">
          Welcome to AETHER.
        </h2>
        <p className="max-w-[360px] font-body text-[15px] leading-[1.7] text-text-secondary">
          Connect your first account or add assets manually. Your financial
          co-pilot is ready.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onConnect}
          className="h-[44px] w-full rounded-[8px] bg-accent-primary font-body text-sm font-medium text-white shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97] focus-ring"
        >
          Connect an account
        </button>
        <button
          onClick={onManual}
          className="h-[44px] w-full rounded-[8px] border border-accent-primary font-body text-sm font-medium text-accent-primary transition-[background,border-color] duration-160 hover:border-accent-bright hover:bg-accent-subtle focus-ring"
        >
          Add manually
        </button>
        <button
          onClick={onSkip}
          className="font-body text-sm font-medium text-text-muted hover:text-text-secondary focus-ring"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
```

---

### Step 17 — Onboarding Page

**src/app/onboarding/page.tsx:**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { GlowBlobs } from "@/components/layout/glow-blobs";
import { BrandPanel } from "@/components/auth/brand-panel";
import { RiskProfileStep } from "@/components/onboarding/risk-profile-step";
import { CurrencyStep } from "@/components/onboarding/currency-step";
import { WelcomeStep } from "@/components/onboarding/welcome-step";
import type { RiskTolerance, BaseCurrency } from "@/types/database";

type Step = "risk" | "currency" | "welcome";

const STEPS: Step[] = ["risk", "currency", "welcome"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState<Step>("risk");
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | null>(
    null
  );
  const [baseCurrency, setBaseCurrency] = useState<BaseCurrency>("PHP");

  const currentStepIndex = STEPS.indexOf(step);

  async function saveOnboarding() {
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          risk_tolerance: riskTolerance || "moderate",
          base_currency: baseCurrency,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Onboarding save error:", error);
    }
  }

  async function handleFinishSetup() {
    await saveOnboarding();
    setStep("welcome");
  }

  async function handleComplete() {
    await saveOnboarding();
    router.push("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen">
      <GlowBlobs />
      <BrandPanel />
      <div className="flex w-full flex-col items-center justify-center bg-bg-primary px-6 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Progress Dots */}
          {step !== "welcome" && (
            <div className="mb-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {STEPS.slice(0, 3).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        i <= currentStepIndex
                          ? "bg-accent-primary shadow-[0_0_8px_rgba(124,58,237,0.4)]"
                          : "border border-text-muted"
                      }`}
                    />
                    {i < 2 && (
                      <div className="h-px w-8 bg-border" />
                    )}
                  </div>
                ))}
              </div>
              <p className="font-body text-xs text-text-muted">
                Step {currentStepIndex + 1} of 3
              </p>
            </div>
          )}

          {/* Step Content */}
          {step === "risk" && (
            <RiskProfileStep
              selected={riskTolerance}
              onSelect={setRiskTolerance}
              onContinue={() => setStep("currency")}
              onSkip={() => setStep("currency")}
            />
          )}
          {step === "currency" && (
            <CurrencyStep
              selected={baseCurrency}
              onSelect={setBaseCurrency}
              onFinish={handleFinishSetup}
            />
          )}
          {step === "welcome" && (
            <WelcomeStep
              onConnect={handleComplete}
              onManual={handleComplete}
              onSkip={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 18 — Onboarding API Route

**src/app/api/onboarding/route.ts:**

```ts
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { risk_tolerance, base_currency } = body;

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      risk_tolerance,
      base_currency,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
```

---

### Step 19 — Dashboard Shell Layout

**src/components/layout/sidebar.tsx:**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  Brain,
  Calculator,
  TrendingUp,
  Settings,
  FileText,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/holdings", label: "Holdings", icon: PieChart },
  { href: "/dashboard/data", label: "Data Import", icon: FileText },
];

const analysisNav = [
  { href: "/dashboard/advisor", label: "AI Advisor", icon: Brain },
  { href: "/dashboard/glass-box", label: "Glass Box", icon: Calculator },
  { href: "/dashboard/performance", label: "Performance", icon: TrendingUp },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
];

const settingsNav = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof mainNav;
  pathname: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="mb-1 px-3 font-body text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
        {label}
      </span>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-[8px] px-3 font-body text-sm transition-[background,color] duration-160",
              isActive
                ? "border-l-2 border-accent-primary bg-accent-subtle text-text-primary"
                : "text-text-secondary hover:bg-glass-bg hover:text-text-primary"
            )}
          >
            <item.icon
              size={18}
              className={cn(
                "flex-shrink-0",
                isActive ? "text-accent-primary" : ""
              )}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col border-r border-glass-border bg-bg-surface backdrop-blur-[12px]">
      {/* Brand */}
      <div className="flex h-16 items-center px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          aria-label="AETHER Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="8" fill="#7c3aed" />
            <path
              d="M8 14h12M14 8l6 6-6 6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-[1.1rem] font-bold tracking-[0.05em] text-text-primary">
            AETHER
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <NavSection label="Main" items={mainNav} pathname={pathname} />
        <NavSection label="Analysis" items={analysisNav} pathname={pathname} />
        <NavSection label="Account" items={settingsNav} pathname={pathname} />
      </nav>

      {/* Net Worth (bottom) — populated in Phase 2 */}
      <div className="border-t border-glass-border px-5 py-4">
        <p className="font-body text-xs text-text-muted">Net Worth</p>
        <p className="mt-1 font-display text-lg font-bold tabular-nums text-text-primary">
          —
        </p>
      </div>
    </aside>
  );
}
```

**src/components/layout/right-rail.tsx:**

```tsx
"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function RightRail() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button (visible when collapsed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-[8px] border border-glass-border bg-bg-elevated text-text-secondary shadow-glass transition-colors hover:border-border-accent hover:text-text-primary focus-ring"
          aria-label="Open AI Advisor"
        >
          <MessageSquare size={18} aria-hidden="true" />
        </button>
      )}

      {/* Right Rail Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 flex h-screen w-[320px] flex-col border-l border-glass-border bg-bg-surface backdrop-blur-[12px] transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-glass-border px-4">
          <div className="flex items-center gap-2">
            <MessageSquare
              size={18}
              className="text-accent-primary"
              aria-hidden="true"
            />
            <span className="font-display text-sm font-semibold text-text-primary">
              AI Advisor
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-text-muted hover:bg-glass-bg hover:text-text-primary focus-ring"
            aria-label="Close AI Advisor"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content — placeholder for Phase 3 */}
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center font-body text-sm text-text-muted">
            AI Advisor will be available in Phase 3.
          </p>
        </div>
      </aside>
    </>
  );
}
```

**src/app/dashboard/layout.tsx:**

```tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/layout/sidebar";
import { RightRail } from "@/components/layout/right-rail";
import { GlowBlobs } from "@/components/layout/glow-blobs";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check onboarding status
  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", userId)
    .single();

  if (!profile?.onboarding_complete) {
    redirect("/onboarding");
  }

  return (
    <div className="relative min-h-screen bg-bg-primary">
      <GlowBlobs />
      <Sidebar />
      <main className="ml-[240px] min-h-screen p-6">{children}</main>
      <RightRail />
    </div>
  );
}
```

**src/app/dashboard/page.tsx** (placeholder):

```tsx
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-glass-border bg-accent-subtle px-3.5 py-1 font-body text-xs font-medium uppercase tracking-[0.1em] text-accent-glow">
          Dashboard
        </span>
        <h1 className="font-display text-[2.25rem] font-bold text-text-primary text-wrap-balance">
          Net Worth Overview
        </h1>
      </div>
      <div className="h-px w-full bg-border" />

      {/* Placeholder card */}
      <div className="rounded-[16px] border border-glass-border bg-glass-bg p-8 backdrop-blur-[12px] shadow-glass">
        <p className="text-center font-body text-text-secondary">
          Dashboard content will be implemented in Phase 2.
        </p>
      </div>
    </div>
  );
}
```

---

### Step 20 — Landing Page (Redirect)

**src/app/page.tsx:**

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg-primary px-6">
      {/* Brand */}
      <div className="flex flex-col items-center gap-4">
        <svg
          width="48"
          height="48"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <rect width="28" height="28" rx="8" fill="#7c3aed" />
          <path
            d="M8 14h12M14 8l6 6-6 6"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="font-display text-4xl font-bold tracking-[0.05em] text-text-primary">
          AETHER
        </h1>
        <p className="font-body text-lg text-text-secondary">
          Wealth intelligence for Filipino investors.
        </p>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href="/sign-up"
          className="flex h-[44px] items-center rounded-[8px] bg-accent-primary px-6 font-body text-sm font-medium text-white shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
        >
          Get Started
        </Link>
        <Link
          href="/sign-in"
          className="flex h-[44px] items-center rounded-[8px] border border-border bg-transparent px-6 font-body text-sm font-medium text-text-secondary transition-[color,border-color,background] duration-160 hover:border-border-accent hover:bg-glass-bg hover:text-text-primary"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
```

---

### Step 21 — next.config.ts

**next.config.ts:**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
```

---

## Verification Checklist

After completing all steps above, verify:

- [ ] `pnpm dev` starts without errors
- [ ] Visiting `/` shows landing page (or redirects to dashboard if signed in)
- [ ] Visiting `/sign-up` shows split-screen signup with AETHER branding
- [ ] Visiting `/sign-in` shows split-screen signin with AETHER branding
- [ ] Can create an account via email/password
- [ ] Can sign in via Google OAuth
- [ ] After signup, user is redirected to `/onboarding`
- [ ] Clerk webhook fires `user.created` → profile row appears in Supabase `profiles` table
- [ ] Onboarding Step 1 (Risk Profile): Three glassmorphic cards, selectable with violet highlight
- [ ] Onboarding Step 2 (Currency): Four currency options, PHP pre-selected
- [ ] Onboarding Step 3 (Welcome): Glass modal with three CTAs
- [ ] After onboarding, `profiles.onboarding_complete = true` in Supabase
- [ ] Visiting `/dashboard` shows sidebar + main content + right rail toggle
- [ ] Sidebar has AETHER brand, navigation sections (Main, Analysis, Account)
- [ ] Right rail opens/closes correctly
- [ ] Background glow blobs visible on all pages
- [ ] Fonts: Syne for headings, DM Sans for body text
- [ ] Color scheme: dark background `#08080f`, violet accents `#7c3aed`
- [ ] All interactive elements have visible focus rings
- [ ] RLS policies work: users can only see their own data in Supabase
- [ ] `pnpm build` succeeds without errors

---

## Rollback Plan

If any step fails:

1. **Auth issues:** Check Clerk dashboard for correct API keys, ensure JWT template "supabase" is configured with `sub` claim.
2. **Database issues:** Drop all tables and re-run migration SQL. Ensure Supabase JWKS URL matches Clerk's.
3. **Styling issues:** Verify Tailwind config has all AETHER tokens. Check that CSS variables are defined in `globals.css`.
4. **Webhook issues:** Use ngrok for local testing (`ngrok http 3000`). Set the ngrok URL as webhook endpoint in Clerk dashboard.
5. **Build errors:** Run `pnpm tsc --noEmit` to check TypeScript errors separately from the build.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| "Clerk: Missing publishable key" | Env var not loaded | Restart dev server after adding `.env.local` |
| "Invalid JWT" in Supabase | JWKS not configured | Add Clerk JWKS URL in Supabase Auth settings |
| Webhook returns 400 | Signature mismatch | Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard |
| RLS blocks all queries | JWT `sub` not mapping | Check Clerk JWT template includes `sub: {{user.id}}` |
| Fonts not loading | next/font issue | Ensure `variable` prop is set and applied to `<html>` |
| Glass effects not visible | Browser compat | Ensure `-webkit-backdrop-filter` is included alongside `backdrop-filter` |
| Onboarding redirect loop | Profile not created yet | Ensure webhook runs before user hits `/dashboard` |

---

**Phase 1 complete. Proceed to `phase-2-core-dashboard/IMPLEMENTATION_GUIDE.md`.**
