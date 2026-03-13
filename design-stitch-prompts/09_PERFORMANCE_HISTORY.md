# 09 — Performance History & Alerts — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [08 Fee Analyzer](./08_FEE_ANALYZER_REAL_RETURN.md) → Next: [10 Settings](./10_SETTINGS_PROFILE.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar "Performance")
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 7 (Historical Performance Tracking) + Feature 9 (V1.1 — PSEi & Benchmark Alert System)
> **Note:** Performance tab is MVP. Alerts tab ships in V1.1 (Phase 4).

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Performance History & Alerts screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. TWO sections via top tabs: "Performance" and "Alerts." Performance shows time-series net worth with PSEi benchmark always present. Alerts manages push notification thresholds. Enterprise terminal-grade.

**Background:** `#0A0F1E`.

**Left Sidebar (fixed, 240px width, full height):**
`#111827` bg, 1px right border `#1E293B`.
- Top (24px padding): "AETHER" Inter Bold 16px `#E2E8F0`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Inter Bold 11px `#475569`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 4px radius). Inactive: `#94A3B8`, hover bg `#1A2035`. Active: `#E2E8F0` text, icon `#2D7FF9`, left 2px border `#2D7FF9`, bg `rgba(45,127,249,0.08)`.
  1. Home icon 18px + "Dashboard" Inter Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" Inter Bold 11px `#475569`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Inter Bold 9px `#475569`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — **ACTIVE**.
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
- "Performance & Alerts" Inter Bold 24px `#E2E8F0`. Download icon 18px `#64748B` (exports PDF/CSV).
- 1px divider `#1E293B`, 16px gap.

**Tab Switcher:**
- "Performance" — active: Inter SemiBold 14px `#E2E8F0`, 2px bottom border `#2D7FF9`.
- "Alerts" — inactive: Inter Medium 14px `#475569`.
- 24px gap.

---

### TAB 1: PERFORMANCE

**Time Range Row:**
Horizontal chips, 6px gap:
- "1M" "3M" "6M" "1Y" "3Y" "ALL"
- Active "1Y": `#2D7FF9` bg, `#FFFFFF` text, Inter SemiBold 13px, 0px radius, 32px height, padding 0 14px.
- Inactive: `#1A2035` bg, `#94A3B8` text, 1px border `#1E293B`.

**Performance Chart (16px top, `#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px):**
- "NET WORTH OVER TIME" Inter SemiBold 11px `#2D7FF9`.
- "Mar 2025 → Mar 2026 · ▲ +₱487,000 (+12.8%)" Inter Regular 13px `#00C896`.
- 16px gap.

**Line Chart (full width, height 360px):**
- X: months Mar '25–Mar '26, IBM Plex Mono 11px `#475569`.
- Y: ₱ values ₱3M–₱5M, IBM Plex Mono 11px `#475569`.
- Grid: 1px `#1E293B`.
- **User portfolio line:** 2px solid `#2D7FF9` with area fill `#2D7FF9` at 6%.
- **PSEi benchmark:** 1px solid `#64748B` — ALWAYS VISIBLE BY DEFAULT.
- **BTC benchmark:** 1px dashed `#94A3B8`.
- Transaction annotations: small diamond dots on user line at key dates:
  "Bought JFC" "Sold BTC" "Property revalued" — labels Inter Regular 10px `#475569` with 4px connector lines.
- Legend row below: line samples + "Your Portfolio" `#2D7FF9`, "PSEi" `#64748B`, "BTC" `#94A3B8` — Inter Regular 12px.

**Period Summary (16px top, horizontal row of 3 cards, 12px gap):**
Each: `#111827` bg, 1px border `#1E293B`, 4px radius, padding 16px, flex-1.
- "Total Return" Inter Regular 12px `#64748B` → "▲ +12.8%" IBM Plex Mono Bold 22px `#00C896`. Below: "+₱487K" Inter Regular 12px `#475569`.
- "vs PSEi" → "▲ +4.2%" `#00C896`. "Outperformed".
- "vs BTC" → "▼ -8.1%" `#FF4D6A`. "Underperformed".

**Monthly Breakdown Table (16px top, `#111827` bg, 1px border `#1E293B`, 4px radius):**
- Header: bg `#1A2035`. "MONTHLY BREAKDOWN" Inter SemiBold 11px `#64748B`. "Export CSV" `#2D7FF9` right.
- Column headers: "Month" / "Net Worth" / "Change" / "vs PSEi" — Inter SemiBold 12px `#64748B`.
- 6 data rows (1px `#1E293B` dividers, hover `#1A2035`):
  - "Mar 2026" Inter Regular 13px `#E2E8F0` → "₱4,287,650" IBM Plex Mono Medium 13px `#E2E8F0` → "▲ +3.06%" `#00C896` → "+1.2%" `#00C896`.
  - Feb: ₱4,160,310 → +1.8% → +0.5%.
  - Jan: ₱4,086,750 → -0.4% `#FF4D6A` → -1.1% `#FF4D6A`.
  - Dec: ₱4,103,200 → +2.1% → +0.8%.
  - Nov: ₱4,019,400 → +1.5% → +0.3%.
  - Oct: ₱3,960,000 → +0.9% → -0.2%.
- "Show all months ↓" Inter Medium 13px `#2D7FF9`, padding 12px 16px.

---

### TAB 2: ALERTS

**Active Alerts (full width):**
- "5 ACTIVE ALERTS" Inter SemiBold 11px `#F59E0B`. Right: "+ New alert" Inter Medium 13px `#2D7FF9`.
- 16px gap.

**Alert Rows (stacked, 8px gap):**
Each: `#111827` bg, 1px border `#1E293B`, 4px radius, padding 14px 16px. Toggle on right.

1. TrendingUp 16px `#00C896` → "JFC hits ₱280" Inter SemiBold 14px `#E2E8F0`. Below: "Current: ₱265 · Target: ₱280" Inter Regular 12px `#475569`. Toggle ON: track `#00C896`.

2. BarChart 16px `#2D7FF9` → "PSEi crosses 7,500". "Current: 7,312 · Threshold: 7,500". Toggle ON.

3. Activity 16px `#F59E0B` → "BTC 24h vol > 10%". "Current: 6.2% · Threshold: 10%". Toggle ON.

4. Landmark 16px `#2D7FF9` → "BSP rate change". "Next meeting: Apr 10, 2026". Toggle ON.

5. AlertTriangle 16px `#FF4D6A` → "Portfolio drops > 5%/week". "Protection alert · Push". Toggle ON.

Toggle styling: 40px × 20px track. ON: `#00C896` track, white thumb. OFF: `#1E293B` track, `#475569` thumb.

**Alert History (24px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 16px.
- "RECENT TRIGGERS" Inter SemiBold 11px `#64748B`.
- 3 rows (1px `#1E293B` dividers):
  - Bell 14px `#F59E0B` → "BSP held rate at 6.25%" Inter Regular 13px `#E2E8F0` → "Feb 13, 2026" `#475569`.
  - "JFC reached ₱260 (near target)" → "Feb 10".
  - "BTC 24h vol hit 11.3%" → "Jan 28".

**Key Design Notes:**
- Performance chart: PSEi benchmark ALWAYS visible in gray — comparisons ever-present
- Transaction annotations connect chart data to real financial events
- Period summary: instant benchmark comparison — did you outperform?
- Monthly table: dense data rows with hover, "vs PSEi" column — Bloomberg-grade
- Alerts: toggle-based cards, familiar iOS pattern adapted to enterprise dark
- Color coding: green `#00C896` stocks, blue `#2D7FF9` market, amber `#F59E0B` crypto, red `#FF4D6A` protection
- Toast notifications for triggered alerts — never modal popups
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER Performance & Alerts in LIGHT THEME at 1440px.

**Background:** `#F8FAFC`. Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; only switch to light colors.

**Tabs:** Active `#0F172A`, 2px border `#2563EB`. Inactive `#94A3B8`.

**Time chips:** Active `#2563EB` bg, `#FFFFFF` text. Inactive `#FFFFFF` bg, `#64748B` text, `#E2E8F0` border.

**Chart:** `#FFFFFF` bg. Grid `#E2E8F0`. Portfolio 2px `#2563EB`, fill 4%. PSEi `#94A3B8`. BTC `#CBD5E1` dashed. Annotations `#94A3B8`. Axis `#94A3B8`.

**Summary cards:** `#FFFFFF` bg, `#E2E8F0` border. Green `#059669`. Red `#DC2626`. Labels `#94A3B8`.

**Table:** `#FFFFFF` bg, `#E2E8F0` border. Header `#F1F5F9`. Text `#0F172A`. Green `#059669`. Red `#DC2626`. Hover `#F8FAFC`. "Export" `#2563EB`.

**Alerts:** Cards `#FFFFFF`, `#E2E8F0` border. Titles `#0F172A`. Details `#64748B`. Toggle ON `#059669`. History text `#0F172A`.
```
