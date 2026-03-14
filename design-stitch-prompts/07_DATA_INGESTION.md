# 07 — Data Ingestion (Import Data) — AETHER (Dark Mode SaaS Edition)

> **Navigation:** Previous: [06 Sandbox Simulator](./06_SANDBOX_SIMULATOR.md) → Next: [08 Fee Analyzer](./08_FEE_ANALYZER_REAL_RETURN.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar "Import Data" + Quick Action)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 2 — Data Ingestion (CSV Upload + Manual Entry)

---

## DARK MODE — Web (1440px)

### Prompt (copy below)

```
Design the Data Ingestion / Import Data screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. Users upload broker CSVs (COL Financial format), manually add assets (crypto, real estate, gold, cash), and see auto-pricing status. Dark Mode SaaS — Glassmorphism + Bento Grid aesthetic. Security and trust are paramount on this screen.

**Global Setup:**
- `color-scheme: dark` on `:root`.
- `<meta name="theme-color" content="#08080f">`.
- Fonts: Google Fonts `Syne` (headings, labels, nav items) and `DM Sans` (body, descriptions). NEVER use Inter. NEVER use IBM Plex Mono — use `DM Sans` with `font-variant-numeric: tabular-nums` for all numeric values.
- `*, *::before, *::after { transition: none; }` — no `transition: all`. Transitions must be explicit per-property (e.g., `transition: background-color 150ms ease, border-color 150ms ease`).
- `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`.
- `text-wrap: balance` on all headings.
- `touch-action: manipulation` on all interactive elements.

**Background:** `#08080f`.

**Background Glow Blobs (decorative, fixed, behind content):**
- Top-left: radial gradient ellipse, `rgba(124,58,237,0.08)`, 600px wide, blurred 120px, centered at 15% from left 10% from top.
- Bottom-right: radial gradient ellipse, `rgba(52,211,153,0.05)`, 500px wide, blurred 100px, centered at 80% from left 75% from top.
- Both blobs use `position: fixed; pointer-events: none; z-index: 0;` and carry `aria-hidden="true"`.

**Left Sidebar (fixed, 240px width, full height):**
`#13131f` bg, 1px right border `rgba(255,255,255,0.06)`.
- Top (24px padding): "AETHER" Syne Bold 16px `#f1f0ff`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 16px radius). Inactive: `#9492b0`, hover bg `#1a1a2e`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.08)`.
  1. Home icon 18px + "Dashboard" Syne Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — **ACTIVE**.
- 24px gap.
- Section label: "ANALYSIS" Syne Bold 11px `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Syne Bold 9px `#4e4c6a`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Syne Bold 11px `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" Syne Bold 10px `#4e4c6a`, letter-spacing 0.06em. Below: "₱4,287,650" DM Sans Bold 18px `#f1f0ff`, `font-variant-numeric: tabular-nums`. Below: "▲ +3.06%" DM Sans Medium 12px `#34d399`, `font-variant-numeric: tabular-nums`.
- All nav icon buttons carry `aria-label` (e.g., `aria-label="Import Data"`).
- All purely decorative icons carry `aria-hidden="true"`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions. Decorative icons carry `aria-hidden="true"`. Icon-only buttons carry `aria-label`.
- Keep color behavior EXACTLY: active nav always purple (`#7c3aed` border/icon + `rgba(124,58,237,0.08)` bg), inactive `#9492b0`, hover `#1a1a2e`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `rgba(255,255,255,0.06)`, then content blocks.
- Keep foundational tokens EXACTLY:
  - Corner radius: `16px` for cards/panels/modals, `8px` for buttons/chips/inputs, `16px` for nav items.
  - Borders: `1px solid rgba(255,255,255,0.06)` default, `1px solid rgba(168,85,247,0.18)` for glass panels.
  - Glassmorphism on every card/panel: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px`.
  - Fonts: Syne for headings/labels/nav, DM Sans for body/descriptions. DM Sans `tabular-nums` for all numeric values. NEVER use Inter. NEVER use IBM Plex Mono.
  - Focus: `outline: 2px solid #a855f7; outline-offset: 2px` on `:focus-visible`. No default `:focus` outline override.
  - Transitions: explicit per-property only (e.g., `transition: background-color 150ms ease`). NEVER use `transition: all`.
  - `touch-action: manipulation` on all buttons, links, interactive elements.
  - `text-wrap: balance` on all headings.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content (padding 32px):**

**Page Header:**
- "Import Data" Syne Bold 24px `#f1f0ff`, `text-wrap: balance`.
- 8px gap.
- Security strip: Lock icon 14px `#34d399` (carries `aria-hidden="true"`) → "AES-256 encrypted · Read-only access · Credentials never stored in plaintext" DM Sans Medium 12px `#34d399`.
- 1px divider `rgba(255,255,255,0.06)`, 24px gap.

**Two-Column Layout:**

**Left Column (55%) — Connected + Add New:**

**Recent Imports Section:**
- "RECENT IMPORTS" Syne SemiBold 11px `#34d399`, letter-spacing 0.06em.
- 12px gap.
- 1 import row:
  Glassmorphism card: `background: rgba(255,255,255,0.04); border: 1px solid rgba(52,211,153,0.4); backdrop-filter: blur(12px); border-radius: 16px`, padding 14px 16px.
  - Left: Ticker badge 36px, `#1a1a2e` bg, `1px solid rgba(255,255,255,0.06)`, `border-radius: 8px`. "COL" DM Sans Bold 10px `#f1f0ff` `tabular-nums` centered.
  - 12px gap. "COL Financial CSV" Syne SemiBold 14px `#f1f0ff`. Below: "Imported Mar 5 · 42 transactions · 8 holdings" DM Sans Regular 12px `#4e4c6a`.
  - Right: CheckCircle 16px `#34d399` (`aria-hidden="true"`). EllipsisVertical 16px `#4e4c6a` (`aria-label="Import options menu"`).
- 24px gap.

**Add Data Section:**
- "ADD DATA" Syne SemiBold 11px `#4e4c6a`.
- 12px gap.
- 3 method rows (stacked, 8px gap). Each: glassmorphism card — `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px`, padding 16px.

Row A — CSV Import:
- UploadCloud icon 20px `#7c3aed` (`aria-hidden="true"`) → "Import Broker CSV" Syne SemiBold 15px `#f1f0ff`. Below: "COL Financial format or custom CSV. Drag & drop or browse." DM Sans Regular 13px `#9492b0`.
- Right: "Upload →" DM Sans Medium 13px `#7c3aed`.
- Below: format chips "COL .csv" "Custom .csv" — DM Sans Regular 11px `#4e4c6a`, `#1a1a2e` bg, `1px solid rgba(255,255,255,0.06)`, `border-radius: 8px`, padding 2px 8px. 6px gap.

Row B — Manual Entry:
- PencilLine icon 20px `#34d399` (`aria-hidden="true"`) → "Add Asset Manually" Syne SemiBold 15px `#f1f0ff`. "Crypto, real estate (BIR zonal value ref), gold, cash, time deposits, UITFs, insurance." DM Sans Regular 13px `#9492b0`.
- Right: "Add →" DM Sans Medium 13px `#7c3aed`.
- Below: asset pills wrap — "Crypto" "Real Estate" "Gold" "Cash" "Time Deposit" "UITF" "Insurance" "Other" — DM Sans Regular 11px `#9492b0`, `1px solid rgba(255,255,255,0.06)`, `border-radius: 8px`, padding 2px 8px. Active: border `#7c3aed`, bg `rgba(124,58,237,0.08)`.

Row C — Auto-Pricing:
- Activity icon 20px `#34d399` (`aria-hidden="true"`) → "Auto-Pricing (Active)" Syne SemiBold 15px `#f1f0ff`. "Stock and crypto prices update automatically via free APIs." DM Sans Regular 13px `#9492b0`.
- Status dots: "PSE via PSEi" green dot 6px `#34d399` → "Active" `#34d399`. "CoinGecko" → "Active". "BSP Forex" → "Active". Inline, 16px gap. DM Sans Regular 11px.
- Note: read-only info row — no user action needed.

**Right Column (45%, 24px left gap):**

**Import Activity Log:**
Glassmorphism card: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px`, padding 20px.
- "IMPORT LOG" Syne SemiBold 11px `#4e4c6a`.
- 12px gap.
- 5 log entries (stacked, 1px `rgba(255,255,255,0.06)` dividers):
  Each: CheckCircle 14px `#34d399` (`aria-hidden="true"`) → event text DM Sans Regular 13px `#f1f0ff` → timestamp `#4e4c6a` right-aligned.
  1. "COL CSV imported — 42 transactions" — "Mar 5, 2026"
  2. "Manual entry — BTC 0.15 @ ₱4.2M" — "Mar 4"
  3. "Manual entry — Bulacan Property ₱1.8M (BIR zonal ref)" — "Feb 28"
  4. "BSP forex rates updated" — "Feb 28"
  5. "COL CSV imported — 15 transactions" — "Feb 20"

**Data Summary:**
(16px top gap) Glassmorphism card: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px`, padding 20px.
- "DATA SUMMARY" Syne SemiBold 11px `#4e4c6a`.
- Metric rows:
  - "Total holdings" → "12" DM Sans Medium 16px `#f1f0ff`, `font-variant-numeric: tabular-nums`.
  - "CSV imports" → "2" DM Sans `#f1f0ff`, `tabular-nums`.
  - "Manual entries" → "5" DM Sans `#f1f0ff`, `tabular-nums`.
  - "Last price update" → "2 hours ago" DM Sans `#f1f0ff`, `tabular-nums`.
  Labels: DM Sans Regular 13px `#9492b0`.

**Key Design Notes:**
- Security badge prominent at top — trust is critical for credential-handling pages
- Recent imports have green `rgba(52,211,153,0.4)` glass borders — confirmed successful
- Each data method has a distinct icon but consistent glassmorphism layout
- Activity log provides transparency — users see exactly what happened and when
- Toast notifications for sync results (top-right), not modal popups
- Manual entry supports ALL asset types from spec: crypto, real estate (BIR zonal value), gold, cash, deposits, UITFs
- No broker API keys or exchange connections for MVP — CSV + manual only
- Hover on method rows: border `rgba(168,85,247,0.3)`, subtle highlight via `transition: border-color 150ms ease, background-color 150ms ease`
- Focus-visible on all interactive elements: `outline: 2px solid #a855f7; outline-offset: 2px`
- Background glow blobs are decorative (`aria-hidden="true"`, `pointer-events: none`)
- All icon-only buttons have explicit `aria-label`; all decorative icons have `aria-hidden="true"`
- `prefers-reduced-motion: reduce` disables all animation and transition durations
- No `transition: all` anywhere — every transition targets specific properties
```
