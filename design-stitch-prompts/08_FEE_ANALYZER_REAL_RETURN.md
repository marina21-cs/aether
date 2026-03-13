# 08 — Fee Analyzer & Real-Return Calculator — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [07 Data Ingestion](./07_DATA_INGESTION.md) → Next: [09 Performance History](./09_PERFORMANCE_HISTORY.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar "Fee Scanner")
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 7 (Hidden Fee & Debt Analyzer) + Feature 8 (Real-Return Calculator)

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Fee Analyzer & Real-Return Calculator screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. TWO sections via top tab switcher: "Fee Scanner" and "Real Return." Fee Scanner surfaces hidden costs (UITF management fees, credit card interest, inflation erosion) and quantifies their 10-year impact. Real Return adjusts every return against Philippine CPI. Enterprise terminal-grade. Warning/alert colors justified here.

**Overall Aesthetic:** An investigative financial audit. Makes invisible costs visible. The warning yellow `#FBBF24` and loss red `#FF4D6A` are justified on this screen — these are real alarm signals. The 10-year cost projection is the gut-punch number. Dense data, explicit severity, constructive suggestions.

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
  7. AlertTriangle icon + "Fee Scanner" — **ACTIVE**.
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
- "Wealth Protection" Inter Bold 24px `#E2E8F0`. Info icon 18px `#64748B`.
- 1px divider `#1E293B`, 16px gap.

**Tab Switcher (full width, 1px bottom border `#1E293B`):**
- "Fee Scanner" — active: Inter SemiBold 14px `#E2E8F0`, 2px bottom border `#FBBF24`.
- "Real Return" — inactive: Inter Medium 14px `#475569`.
- 24px gap below tabs.

---

### TAB 1: FEE SCANNER

**Alert Summary (full width, `#111827` bg, 1px border `#FBBF24`, 4px radius, padding 20px):**
- AlertTriangle icon 20px `#FBBF24` → "3 hidden costs detected" Inter SemiBold 16px `#FBBF24`.
- 8px gap.
- **"Estimated 10-year cost: ₱248,000"** IBM Plex Mono Bold 32px `#FF4D6A`. This is the hero number — the alarm.
- 4px gap.
- "Equivalent to 4.7 months of your current salary." Inter Regular 14px `#94A3B8`.

**Two-Column: Flagged Items (left 60%) + Impact Summary (right 40%):**

**Left — Flagged Costs:**
- "FLAGGED COSTS" Inter SemiBold 11px `#FF4D6A`.
- 12px gap.

3 flagged cards stacked, 12px gap:

**Card 1 — UITF Management Fee:**
`#111827` bg, 1px border `#FF4D6A`, 4px radius, padding 16px.
- Top: "BPI Equity Fund UITF" Inter SemiBold 14px `#E2E8F0`. Right: "HIGH" badge Inter Bold 10px `#FF4D6A`, bg `rgba(255,77,106,0.12)`, 4px radius, padding 2px 8px.
- 12px gap.
- Data rows (1px `#1E293B` dividers):
  - "Management fee" Inter Regular 12px `#94A3B8` → "2.15% p.a." IBM Plex Mono Medium 14px `#FF4D6A`.
  - "Benchmark avg" → "0.85% p.a." IBM Plex Mono `#64748B`.
  - "Your investment" → "₱500,000" IBM Plex Mono `#E2E8F0`.
  - "10-year cost" → "₱156,000" IBM Plex Mono Bold 14px `#FF4D6A`.
- 12px gap.
- Suggestion: Lightbulb icon 14px `#00C896` → "Consider FMETF (PSEi ETF) — fee: 0.50% p.a." Inter Regular 13px `#00C896`.

**Card 2 — Savings vs Inflation:**
1px border `#FBBF24`. "BDO Savings" — "MEDIUM" badge `#FBBF24`.
- "Interest" → "0.25% p.a." → "CPI" → "5.8% p.a." `#FF4D6A` → "Real return" → "-5.55% p.a." IBM Plex Mono Bold `#FF4D6A`.
- "10-year erosion" → "₱67,000" `#FF4D6A`.
- Suggestion: "Time deposit 5.5% p.a. or REIT ~5-6% dividend yield." `#00C896`.

**Card 3 — Credit Card:**
1px border `#FF4D6A`. "BPI Gold Mastercard" — "HIGH".
- "Balance" → "₱85,000" → "Annual EIR" → "24.0% p.a." `#FF4D6A` → "10-year cost" → "₱25,000".
- Suggestion: "Prioritize full payoff. ₱28,333/mo eliminates in 3 months." `#00C896`.

**Right — Impact Visualization (24px left gap):**

**Cost Breakdown Bar:**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "10-YEAR COST BREAKDOWN" Inter SemiBold 11px `#64748B`.
- 12px gap.
- Horizontal stacked bar (12px height, 2px radius):
  - UITF fees 63% `#FF4D6A`, Inflation 27% `#FBBF24`, Credit 10% `#FF4D6A`.
- Labels below each segment, Inter Regular 11px, matching colors.
- "₱248K total" IBM Plex Mono Bold 16px `#FF4D6A` right-aligned below.

**Net Worth Impact Chart (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "NET WORTH IMPACT" Inter SemiBold 11px `#64748B`.
- Line chart (280px height):
  - "With hidden costs" — 2px `#FF4D6A` descending line.
  - "After optimization" — 2px `#00C896` line (higher trajectory).
  - Gap between lines shaded `#00C896` at 8% — "₱248K saved".
  - Grid `#1E293B`. Axes IBM Plex Mono 11px `#475569`.

---

### TAB 2: REAL RETURN

**Inflation Context:**
Full width, `#111827` bg, 1px border `#1E293B`, 4px radius, padding 16px.
- "PH CPI INFLATION" Inter SemiBold 11px `#64748B`.
- "5.8% YoY (Feb 2026)" IBM Plex Mono Bold 28px `#FF4D6A`.
- "Source: Philippine Statistics Authority · Mar 2026" Inter Regular 11px `#475569`.

**Real Return Data Table (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius.
- Header: bg `#1A2035`, Inter SemiBold 12px `#64748B` uppercase. Columns: "Asset" / "Nominal Return" / "Real Return" / "Status".
- Data rows (1px `#1E293B` dividers, padding 12px 16px, hover `#1A2035`):
  1. "JFC" `#E2E8F0` → "+8.2%" `#00C896` → "+2.4%" `#00C896` → CheckCircle `#00C896`.
  2. "BTC" → "+15.1%" `#00C896` → "+9.3%" `#00C896` → Check.
  3. "AREIT" → "+5.8%" `#00C896` → "0.0%" `#64748B` → Minus `#FBBF24`.
  4. "BDO Savings" → "+0.25%" `#64748B` → "-5.55%" `#FF4D6A` Bold → X `#FF4D6A`.
  5. "Time Dep." → "+5.5%" `#00C896` → "-0.3%" `#FBBF24` → AlertTriangle `#FBBF24`.
  All values IBM Plex Mono Medium 13px.

**Purchasing Power Chart (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "PURCHASING POWER OF ₱1M" Inter SemiBold 11px `#64748B`.
- Line chart (240px height):
  - Savings 0.25%: 1px dashed `#FF4D6A` descending to ~₱570K.
  - Time deposit 5.5%: 1px solid `#64748B` flat ~₱970K.
  - Equity 8.2%: 2px solid `#00C896` rising to ~₱1.2M.
  - PSEi benchmark: 1px `#64748B` for reference.
  - Grid `#1E293B`. Legend below chart.

**Key Design Notes:**
- Warning/alarm colors JUSTIFIED here: `#FBBF24` yellow and `#FF4D6A` red for real financial threats
- 10-year cost number is THE HERO of Fee Scanner — large, red, alarming on purpose
- Salary equivalence ("4.7 months") makes abstract costs viscerally real
- Every flagged cost includes a CONSTRUCTIVE suggestion in green `#00C896`
- Real Return table: nominal vs real comparison is the "aha moment"
- Data table with row hover highlight — Bloomberg-grade density
- Purchasing power chart: 10-year erosion visualization is the long-term gut-punch
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER Fee Analyzer in LIGHT THEME at 1440px.

**Background:** `#F8FAFC`. Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; only switch to light colors.

**Tabs:** Active `#0F172A`, 2px border `#D97706`. Inactive `#94A3B8`. Line `#E2E8F0`.

**Alert:** `#FFFFFF` bg, 1px border `#D97706`. Triangle `#D97706`. "3 hidden costs" `#D97706`. 10-year cost `#DC2626` IBM Plex Mono Bold. Equivalence `#64748B`.

**Flagged cards:** HIGH: 1px border `#DC2626`. MEDIUM: border `#D97706`. Badges: `#DC2626` / `#D97706` text with tint bg. Values `#0F172A`. Bad values `#DC2626`. Suggestions `#059669`.

**Bar:** `#FFFFFF` bg. Segments `#DC2626`, `#D97706`. Total `#DC2626`.

**Real Return table:** `#FFFFFF` bg, `#E2E8F0` border. Header `#F1F5F9`. Names `#0F172A`. Green `#059669`. Red `#DC2626`. Warning `#D97706`. Neutral `#64748B`.

**Charts:** bg `#FFFFFF`. Grid `#E2E8F0`. Red line `#DC2626`. Green `#059669`. Gray `#94A3B8`.
```
