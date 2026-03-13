# 03 — Dashboard: Net Worth + Allocation — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [02 Onboarding](./02_ONBOARDING_AUTH.md) → This is the **HOME** screen
> **Accessible from here:** [04 AI Advisor](./04_AI_ADVISOR_CHAT.md) · [05 Glass Box](./05_GLASS_BOX_ENGINE.md) · [06 Simulator](./06_SANDBOX_SIMULATOR.md) · [07 Data Ingestion](./07_DATA_INGESTION.md) · [08 Fee Analyzer](./08_FEE_ANALYZER_REAL_RETURN.md) · [09 Performance](./09_PERFORMANCE_HISTORY.md) · [10 Settings](./10_SETTINGS_PROFILE.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 1 (Omni-Asset Net Worth Dashboard) + Dynamic Allocation View

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the main dashboard home screen for "AETHER", a wealth management platform — displayed at 1440px desktop width with dark theme. This is the central hub. The user sees their total net worth (THE HERO), asset allocation, holdings, and recent activity. Enterprise terminal-grade aesthetic. Bloomberg/Robinhood Pro layout pattern.

**Overall Aesthetic:** A financial command center. Dense but scannable. The net worth number is the HERO of this screen — large, always visible, always live. Everything else provides context for that number. No card-grid weather-app patterns. Use horizontal data rows with clear hierarchy. IBM Plex Mono for ALL financial figures. Thin borders, generous whitespace between sections.

**Background:** Deep navy-black `#0A0F1E` full page.

**LAYOUT — Three-Panel Bloomberg Pattern:**

**Left Sidebar (fixed, 240px width, full height):**
`#111827` bg, 1px right border `#1E293B`.
- Top (24px padding): "AETHER" Inter Bold 16px `#E2E8F0`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Inter Bold 11px `#475569`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 4px radius). Inactive: `#94A3B8`, hover bg `#1A2035`. Active: `#E2E8F0` text, icon `#2D7FF9`, left 2px border `#2D7FF9`, bg `rgba(45,127,249,0.08)`.
  1. Home icon 18px + "Dashboard" Inter Medium 14px — **ACTIVE**.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
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
- Bottom of sidebar (padding 16px): Net worth always visible:
  "NET WORTH" Inter Bold 10px `#475569`, letter-spacing 0.06em. Below: "₱4,287,650" IBM Plex Mono Bold 18px `#E2E8F0`. Below: "▲ +3.06%" IBM Plex Mono Medium 12px `#00C896`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always blue (`#2D7FF9` border/icon + `rgba(45,127,249,0.08)` bg), inactive `#94A3B8`, hover `#1A2035`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `#1E293B`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 4px for cards/buttons/chips, 1px borders, Inter for UI copy, IBM Plex Mono for all numeric values.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content Area (fills remaining width minus sidebar, scrollable, padding 32px):**

**Net Worth Hero Section (top of main area):**
- Left block:
  - "TOTAL NET WORTH" Inter Bold 11px `#64748B`, letter-spacing 0.06em, uppercase.
  - 8px gap.
  - **"₱4,287,650.00"** in IBM Plex Mono Bold 52px `#E2E8F0`. The peso sign at 36px. This is THE visual anchor — the largest element on screen. It animates/counts up on page load (800ms ease-out).
  - 8px gap.
  - Change row: Up-arrow triangle 10px `#00C896` → "+₱127,340.00 (+3.06%)" IBM Plex Mono Medium 16px `#00C896` → "this month" Inter Regular 13px `#475569`. 8px gap. "PHP" currency badge: Inter Bold 10px `#2D7FF9`, bg `rgba(45,127,249,0.12)`, padding 2px 8px, 4px radius.
- Right block (right-aligned):
  - Three stat chips horizontal, 16px gap:
    - "Assets" label Inter Medium 11px `#475569` → "₱5,127,650" IBM Plex Mono Medium 16px `#E2E8F0`.
    - "Liabilities" → "₱840,000" IBM Plex Mono `#E2E8F0`.
    - "Real Return" → "+1.2%" IBM Plex Mono Medium 16px `#00C896` (green if positive, `#FF4D6A` if negative).
  Separated by 1px vertical `#1E293B` dividers.

- 1px horizontal divider `#1E293B`, 24px vertical spacing.

**Two-Column Layout Below Hero:**

**Left Column (60% width):**

**Holdings Table (1px border `#1E293B`, 4px radius, `#111827` bg):**
- Header row: bg `#1A2035`, padding 12px 16px, 1px bottom border `#1E293B`.
  - "YOUR HOLDINGS" Inter SemiBold 11px `#64748B` uppercase. Right: "12 total" Inter Regular 12px `#475569`. Filter icon 16px `#64748B`.
- Data rows (each: padding 12px 16px, 1px bottom border `#1E293B`, hover bg `#1A2035`):
  Row layout per holding:
  - Left: Ticker badge — 40px width, 24px height, `#1A2035` bg, 1px border `#1E293B`, 2px radius. "JFC" IBM Plex Mono Bold 11px `#E2E8F0` centered.
  - 12px gap. "Jollibee Foods Corp" Inter Medium 14px `#E2E8F0`. Below ticker: "500 shares · PSE" Inter Regular 12px `#475569`.
  - Right-aligned: "₱287,500.00" IBM Plex Mono Medium 14px `#E2E8F0`. Below: "▲ +4.2%" IBM Plex Mono Regular 12px `#00C896`.

  Holdings:
  1. JFC — Jollibee Foods Corp — ₱287,500.00 — ▲ +4.2%
  2. BTC — Bitcoin — ₱820,000.00 — ▼ -1.8% (in `#FF4D6A`)
  3. AREIT — AREIT Inc. — ₱150,000.00 — ▲ +2.1%
  4. BDO — BDO Savings — ₱425,000.00 — ▲ +0.3%
  5. PROP — Bulacan Property — ₱1,800,000.00 — ▲ +8.5%

- Bottom row: "View all 12 holdings →" Inter Medium 13px `#2D7FF9`, padding 12px 16px.

**Recent Activity (16px top gap, 1px border `#1E293B`, 4px radius, `#111827` bg):**
- Header: bg `#1A2035` padding 12px 16px. "RECENT ACTIVITY" Inter SemiBold 11px `#64748B`.
- 3 rows:
  - Each: small icon 18px in `#1A2035` rounded container → "Bought JFC" Inter Medium 13px `#E2E8F0` → "Mar 5, 2026 · Manual" `#475569` → right: "-₱28,750" IBM Plex Mono Medium 13px `#E2E8F0`.
  - Buy: ArrowDown icon `#00C896`. Sell: ArrowUp `#FF4D6A`. Dividend: Coins `#F59E0B`.

**Right Column (40% width, 24px left gap):**

**Allocation Panel (1px border `#1E293B`, 4px radius, `#111827` bg, padding 20px):**
- "ALLOCATION" Inter SemiBold 11px `#64748B`. Right: "5 classes" Inter Regular 12px `#475569`.
- 16px gap.
- Horizontal stacked bar (full width, 8px height, 2px radius):
  - PSE Stocks 35% `#2D7FF9` — Crypto 20% `#F59E0B` — Real Estate 25% `#00C896` — Cash 12% `#64748B` — UITFs 8% `#94A3B8`.
- 16px gap.
- Legend rows (stacked, 8px gap):
  - Each: 8px square color swatch (2px radius) → asset name Inter Medium 13px `#E2E8F0` → right: "35%" IBM Plex Mono Medium 13px `#94A3B8` → "₱1,794,678" IBM Plex Mono Medium 13px `#E2E8F0`.

**Quick Actions (16px top gap):**
Horizontal row, 8px gap:
1. "Add Asset" — `#111827` bg, 1px border `#1E293B`, 4px radius, padding 8px 16px. Plus icon 16px `#2D7FF9` → Inter Medium 13px `#E2E8F0`. Hover: border `#334155`.
2. "Import CSV" — Upload icon `#2D7FF9`.
3. "Ask AI" — Brain icon `#F59E0B`. 
4. "Simulate" — FlaskConical icon `#00C896`.

**AI Advisor Toggle (16px top gap):**
A small card: `#111827` bg, 1px border `#1E293B`, 4px radius, padding 16px.
- Brain icon 18px `#F59E0B` → "AI ADVISOR" Inter Bold 11px `#F59E0B` → right: "Open" Inter Medium 12px `#2D7FF9`.
- Below (8px): "Ask about your portfolio or market conditions" Inter Regular 12px `#475569`.
- Tapping "Open" expands the right rail panel (see 04_AI_ADVISOR_CHAT.md).

**Key Design Notes:**
- Three-panel layout: fixed sidebar (240px) + main content + optional right rail (320px for AI advisor)
- NET WORTH IS THE HERO: 52px IBM Plex Mono Bold, counts up on load, always visible in sidebar too
- Holdings as horizontal data rows (table), NOT card grids — dense, scannable, Bloomberg-style
- Allocation as stacked bar, not donut chart — denser, more precise, better data-to-ink ratio
- All numbers in IBM Plex Mono — tabular alignment, precise rendering
- Thin 1px `#1E293B` borders everywhere — no thick brutalist borders
- Hover: subtle row highlight `#1A2035` — micro-interaction quality signal
- Toast notifications (top-right) for sync status, never modal popups
- Skeleton loaders match exact data shape when loading
- The PSEi benchmark line is NOT on this screen but is always present on performance charts
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER dashboard in LIGHT THEME at 1440px.

**Background:** `#F8FAFC`.

**Sidebar:** Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above. Light colors only: `#FFFFFF` bg, 1px right border `#E2E8F0`, brand `#0F172A`, inactive labels `#64748B`, active state `#0F172A` text + icon `#2563EB` + left border `#2563EB` + bg `rgba(37,99,235,0.06)`, hover bg `#F1F5F9`, section labels `#94A3B8`.

**Net Worth Hero:** "₱4,287,650.00" IBM Plex Mono Bold 52px `#0F172A`. Change: `#059669` green. Stats: numbers `#0F172A`, labels `#94A3B8`. Dividers `#E2E8F0`.

**Holdings Table:** `#FFFFFF` bg, 1px border `#E2E8F0`. Header bg `#F1F5F9`. Ticker badges `#F1F5F9` bg, `#E2E8F0` border. Names `#0F172A`. Values `#0F172A` IBM Plex Mono. Positive `#059669`. Negative `#DC2626`. Row hover `#F8FAFC`. Dividers `#E2E8F0`.

**Allocation:** `#FFFFFF` bg, 1px border `#E2E8F0`. Bar colors: blue `#2563EB`, amber `#F59E0B`, green `#059669`, gray `#94A3B8`, light gray `#CBD5E1`. Legend names `#0F172A`.

**Quick Actions:** `#FFFFFF` bg, 1px border `#E2E8F0`. Icons: blue, amber, green. Text `#0F172A`. Hover border `#CBD5E1`.

**Recent Activity:** `#FFFFFF` bg, 1px border `#E2E8F0`. Text `#0F172A`. Dates `#94A3B8`.

**Light Theme Notes:**
- `#F8FAFC` page, `#FFFFFF` surfaces, `#E2E8F0` borders
- Deeper colors for text `#0F172A` and accents `#2563EB`
- Same layout, same data density, same IBM Plex Mono for numbers
- Holdings table remains horizontal rows — not card grid even in light mode
```
