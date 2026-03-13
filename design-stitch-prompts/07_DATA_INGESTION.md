# 07 — Data Ingestion (Import Data) — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [06 Sandbox Simulator](./06_SANDBOX_SIMULATOR.md) → Next: [08 Fee Analyzer](./08_FEE_ANALYZER_REAL_RETURN.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar "Import Data" + Quick Action)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 2 — Data Ingestion (CSV Upload + Manual Entry)

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Data Ingestion / Import Data screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. Users upload broker CSVs (COL Financial format), manually add assets (crypto, real estate, gold, cash), and see auto-pricing status. Enterprise terminal-grade aesthetic. Security and trust are paramount on this screen.

**Background:** `#0A0F1E`.

**Left Sidebar (fixed, 240px width, full height):**
`#111827` bg, 1px right border `#1E293B`.
- Top (24px padding): "AETHER" Inter Bold 16px `#E2E8F0`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Inter Bold 11px `#475569`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 4px radius). Inactive: `#94A3B8`, hover bg `#1A2035`. Active: `#E2E8F0` text, icon `#2D7FF9`, left 2px border `#2D7FF9`, bg `rgba(45,127,249,0.08)`.
  1. Home icon 18px + "Dashboard" Inter Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — **ACTIVE**.
- 24px gap.
- Section label: "ANALYSIS" Inter Bold 11px `#475569`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Inter Bold 9px `#475569`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Inter Bold 11px `#475569`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" Inter Bold 10px `#475569`, letter-spacing 0.06em. Below: "₱4,287,650" IBM Plex Mono Bold 18px `#E2E8F0`. Below: "▲ +3.06%" IBM Plex Mono Medium 12px `#00C896`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always blue (`#2D7FF9` border/icon + `rgba(45,127,249,0.08)` bg), inactive `#94A3B8`, hover `#1A2035`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `#1E293B`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 4px for cards/buttons/chips, 1px borders, Inter for UI copy, IBM Plex Mono for all numeric values.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content (padding 32px):**

**Page Header:**
- "Import Data" Inter Bold 24px `#E2E8F0`.
- 8px gap.
- Security strip: Lock icon 14px `#00C896` → "AES-256 encrypted · Read-only access · Credentials never stored in plaintext" Inter Medium 12px `#00C896`.
- 1px divider `#1E293B`, 24px gap.

**Two-Column Layout:**

**Left Column (55%) — Connected + Add New:**

**Recent Imports Section:**
- "RECENT IMPORTS" Inter SemiBold 11px `#00C896`, letter-spacing 0.06em.
- 12px gap.
- 1 import row:
  `#111827` bg, 1px border `#00C896`, 4px radius, padding 14px 16px.
  - Left: Ticker badge 36px, `#1A2035` bg, 1px border `#1E293B`, 2px radius. "COL" IBM Plex Mono Bold 10px `#E2E8F0` centered.
  - 12px gap. "COL Financial CSV" Inter SemiBold 14px `#E2E8F0`. Below: "Imported Mar 5 · 42 transactions · 8 holdings" Inter Regular 12px `#475569`.
  - Right: CheckCircle 16px `#00C896`. EllipsisVertical 16px `#64748B` (menu: re-import, delete).
- 24px gap.

**Add Data Section:**
- "ADD DATA" Inter SemiBold 11px `#64748B`.
- 12px gap.
- 3 method rows (stacked, 8px gap). Each: `#111827` bg, 1px border `#1E293B`, 4px radius, padding 16px.

Row A — CSV Import:
- UploadCloud icon 20px `#2D7FF9` → "Import Broker CSV" Inter SemiBold 15px `#E2E8F0`. Below: "COL Financial format or custom CSV. Drag & drop or browse." Inter Regular 13px `#94A3B8`.
- Right: "Upload →" Inter Medium 13px `#2D7FF9`.
- Below: format chips "COL .csv" "Custom .csv" — Inter Regular 11px `#475569`, `#1A2035` bg, 1px border `#1E293B`, 4px radius, padding 2px 8px. 6px gap.

Row B — Manual Entry:
- PencilLine icon 20px `#00C896` → "Add Asset Manually" Inter SemiBold 15px `#E2E8F0`. "Crypto, real estate (BIR zonal value ref), gold, cash, time deposits, UITFs, insurance." Inter Regular 13px `#94A3B8`.
- Right: "Add →" `#2D7FF9`.
- Below: asset pills wrap — "Crypto" "Real Estate" "Gold" "Cash" "Time Deposit" "UITF" "Insurance" "Other" — Inter Regular 11px `#94A3B8`, 1px border `#1E293B`, 4px radius, padding 2px 8px. Active: border `#2D7FF9`, bg `rgba(45,127,249,0.08)`.

Row C — Auto-Pricing:
- Activity icon 20px `#00C896` → "Auto-Pricing (Active)" Inter SemiBold 15px `#E2E8F0`. "Stock and crypto prices update automatically via free APIs." Inter Regular 13px `#94A3B8`.
- Status dots: "PSE via PSEi" green dot 6px `#00C896` → "Active" `#00C896`. "CoinGecko" → "Active". "BSP Forex" → "Active". Inline, 16px gap. Inter Regular 11px.
- Note: read-only info row — no user action needed.

**Right Column (45%, 24px left gap):**

**Import Activity Log:**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "IMPORT LOG" Inter SemiBold 11px `#64748B`.
- 12px gap.
- 5 log entries (stacked, 1px `#1E293B` dividers):
  Each: CheckCircle 14px `#00C896` → event text Inter Regular 13px `#E2E8F0` → timestamp `#475569` right-aligned.
  1. "COL CSV imported — 42 transactions" — "Mar 5, 2026"
  2. "Manual entry — BTC 0.15 @ ₱4.2M" — "Mar 4"
  3. "Manual entry — Bulacan Property ₱1.8M (BIR zonal ref)" — "Feb 28"
  4. "BSP forex rates updated" — "Feb 28"
  5. "COL CSV imported — 15 transactions" — "Feb 20"

**Data Summary:**
(16px top gap) `#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "DATA SUMMARY" Inter SemiBold 11px `#64748B`.
- Metric rows:
  - "Total holdings" → "12" IBM Plex Mono Medium 16px `#E2E8F0`.
  - "CSV imports" → "2" IBM Plex Mono `#E2E8F0`.
  - "Manual entries" → "5" IBM Plex Mono `#E2E8F0`.
  - "Last price update" → "2 hours ago" IBM Plex Mono `#E2E8F0`.
  Labels: Inter Regular 13px `#94A3B8`.

**Key Design Notes:**
- Security badge prominent at top — trust is critical for credential-handling pages
- Recent imports have green `#00C896` borders — confirmed successful
- Each data method has a distinct icon but consistent layout
- Activity log provides transparency — users see exactly what happened and when
- Toast notifications for sync results (top-right), not modal popups
- Manual entry supports ALL asset types from spec: crypto, real estate (BIR zonal value), gold, cash, deposits, UITFs
- No broker API keys or exchange connections for MVP — CSV + manual only
- Hover on method rows: border `#334155`, subtle highlight
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER Data Ingestion in LIGHT THEME at 1440px.

**Background:** `#F8FAFC`. Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; only switch to light colors.

**Security strip:** lock `#059669`, text `#059669`.

**Recent Imports:** Cards `#FFFFFF` bg, 1px border `#059669`. Ticker `#F1F5F9` bg. Names `#0F172A`. Status `#64748B`. Check `#059669`.

**Methods:** `#FFFFFF` bg, 1px border `#E2E8F0`. Icons: blue `#2563EB`, green `#059669`. Titles `#0F172A`. Descriptions `#64748B`. Actions `#2563EB`. Chips: `#F1F5F9` bg, `#E2E8F0` border. Active: `#2563EB` border.

**Log:** `#FFFFFF` bg, `#E2E8F0` border. Checks `#059669`. Text `#0F172A`. Times `#94A3B8`.

**Summary:** `#FFFFFF` bg. Labels `#64748B`. Values `#0F172A`.
```
