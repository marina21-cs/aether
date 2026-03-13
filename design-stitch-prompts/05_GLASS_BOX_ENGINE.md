# 05 — Glass Box Predictive Engine — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [04 AI Advisor](./04_AI_ADVISOR_CHAT.md) → Next: [06 Sandbox Simulator](./06_SANDBOX_SIMULATOR.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (via sidebar)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 2 — Glass Box Predictive Engine (Transparent ML)

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Glass Box Predictive Engine screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. This is a quantitative forecasting view that shows the FULL mathematical model behind portfolio predictions — covariance matrix, Monte Carlo simulation, variance formula, confidence intervals. NOTHING is hidden. Every number is auditable. The math is VISIBLE BY DEFAULT — not tucked behind a "Show Details" toggle. This is Aether's biggest differentiator.

**Overall Aesthetic:** The most data-dense screen in the app. Think Bloomberg's quantitative analysis view meets a financial engineering workbook. IBM Plex Mono dominates. Every chart, table, and formula is visible simultaneously. Electric blue `#2D7FF9` as the primary data color. Dense but organized via clear section hierarchy and thin borders.

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
  5. Eye icon + "Glass Box" — **ACTIVE**.
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

**Main Content Area (padding 32px, scrollable):**

**Page Header (top):**
- Left: "Glass Box Engine" Inter Bold 24px `#E2E8F0`. Eye icon 20px `#2D7FF9` inline.
- Right: "Edit assumptions →" Inter Medium 13px `#2D7FF9`.
- Below (8px): "Portfolio: ₱4,287,650 · 5 assets · Moderate risk" Inter Regular 13px `#64748B`.
- 1px divider `#1E293B`, 24px gap.

**Two-Column Layout:**

**Left Column (55%):**

**Section 1 — Monte Carlo Simulation:**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "MONTE CARLO SIMULATION" Inter SemiBold 11px `#2D7FF9`, letter-spacing 0.06em.
- "1,000 paths · 10-year projection" Inter Regular 12px `#475569`.
- 16px gap.

**Fan Chart (full column width, height 320px):**
A time-series fan chart showing projected portfolio value 2026–2036:
- X-axis: years, IBM Plex Mono Regular 11px `#475569`.
- Y-axis: values ₱0M–₱15M, IBM Plex Mono Regular 11px `#475569`.
- Grid lines: 1px solid `#1E293B`.
- **Median line:** 2px solid `#2D7FF9` — crisp, no gradient.
- **PSEi benchmark line:** 1px solid `#64748B` — ALWAYS present for comparison.
- **50th percentile band:** `#2D7FF9` at 15% opacity — translucent layer.
- **80th percentile band:** `#2D7FF9` at 8% opacity — wider, more translucent.
- **95th percentile band:** `#2D7FF9` at 4% opacity — widest, faintest.
- Fan chart layers create a sophisticated confidence visualization — rare in PH tools.
- Start point: solid dot at ₱4.3M (2026), 1px dashed `#475569` horizontal ref line.
- End median callout: "₱8.2M" IBM Plex Mono Bold 14px `#2D7FF9`.

- 16px gap.
- **Outcome Grid** — 4 cells in a row, 1px `#1E293B` borders:
  - "Best Case (95th)" Inter Regular 11px `#475569` → "₱14.8M" IBM Plex Mono Bold 16px `#00C896`.
  - "Median (50th)" → "₱8.2M" IBM Plex Mono Bold 16px `#2D7FF9`.
  - "Worst Case (5th)" → "₱2.1M" IBM Plex Mono Bold 16px `#FF4D6A`.
  - "Prob. of Loss" → "12.3%" IBM Plex Mono Bold 16px `#FBBF24`.
  Each cell: `#1A2035` bg, padding 12px.

**Section 2 — Covariance Matrix (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "COVARIANCE MATRIX (Σ)" Inter SemiBold 11px `#2D7FF9`.
- "Annualized · 3-year monthly returns" Inter Regular 11px `#475569`.
- 12px gap.
- **Matrix table — 5×5 grid:**
  - Corner: empty. Headers: "JFC", "BTC", "AREIT", "BDO", "PROP" IBM Plex Mono Bold 11px `#94A3B8`.
  - Each cell: IBM Plex Mono Regular 12px `#E2E8F0`, padding 8px, 1px border `#1E293B`.
  - Diagonal (variance): bg `rgba(45,127,249,0.08)`, text `#2D7FF9`.
  - High correlation (>0.5): bg `rgba(245,158,11,0.06)`.
  - Negative correlation: bg `rgba(0,200,150,0.06)`.
  - Example: JFC/JFC: 0.052, JFC/BTC: 0.018, BTC/BTC: 0.245.
  - Heat-map coloring makes patterns visible at a glance.

**Right Column (45%, 24px left gap):**

**Section 3 — Portfolio Variance Formula:**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "PORTFOLIO VARIANCE" Inter SemiBold 11px `#2D7FF9`.
- 12px gap.
- **Formula block** — `#1A2035` bg, 1px border `#1E293B`, 2px radius, padding 16px, centered:
  - "σ²ₚ = wᵀΣw" IBM Plex Mono Bold 24px `#E2E8F0`.
  - 4px gap.
  - "Portfolio variance = weights × covariance matrix × weights" Inter Regular 12px `#475569`.
- 16px gap.
- **Metric rows** (stacked, 1px `#1E293B` dividers):
  - "Portfolio σ (annual)" Inter Regular 13px `#94A3B8` → "18.4%" IBM Plex Mono Medium 16px `#E2E8F0`.
  - "Expected return" → "9.2%" IBM Plex Mono `#00C896`.
  - "Sharpe Ratio" → "0.72" IBM Plex Mono `#2D7FF9`.
  - "Risk-free rate (BSP)" → "6.25%" IBM Plex Mono `#E2E8F0`.

**Section 4 — Assumptions Panel (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "ASSUMPTIONS" Inter SemiBold 11px `#64748B`. "These parameters drive the simulation."
- 12px gap.
- Editable parameter rows (1px `#1E293B` dividers, padding 10px 0):
  - "Expected annual return" Inter Regular 13px `#94A3B8` → "9.2%" IBM Plex Mono Medium 14px `#E2E8F0` + pencil icon 14px `#2D7FF9`.
  - "Annual volatility" → "18.4%"
  - "Risk-free rate (BSP)" → "6.25%"
  - "Simulation paths" → "1,000"
  - "Projection years" → "10"
  - Each value editable — clicking opens inline edit with `#2D7FF9` focus border.

**Key Design Notes:**
- MATH VISIBLE BY DEFAULT — covariance matrix, formula, Monte Carlo ALL on screen simultaneously
- No "Show Details" toggles — data density IS the feature, trust IS transparency
- Monte Carlo fan chart uses translucent layered bands — signals quant sophistication
- PSEi benchmark line ALWAYS on the fan chart in gray `#64748B` for instant comparison
- Covariance matrix uses heat-map coloring: blue diagonal, amber high-correlation, green negative
- Two-column layout maximizes information density on desktop
- All values in IBM Plex Mono — precise, tabular-aligned, auditable
- Assumptions explicitly editable — users can stress-test the model
- This screen competes with Bloomberg Level 2 data — positioned as professional-grade
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER Glass Box Engine in LIGHT THEME at 1440px.

**Background:** `#F8FAFC`. Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; only switch to light colors.

**Cards:** `#FFFFFF` bg, 1px border `#E2E8F0`. Section labels `#2563EB`.

**Fan Chart:** bg `#FFFFFF`. Grid `#E2E8F0`. Median: 2px `#2563EB`. Benchmark: 1px `#94A3B8`. Bands: `#2563EB` at 12%, 6%, 3%. Axis labels `#94A3B8`. Callout `#2563EB`.

**Outcome Grid:** cells `#F1F5F9` bg, `#E2E8F0` border. Best `#059669`. Median `#2563EB`. Worst `#DC2626`. Warning `#D97706`.

**Covariance Matrix:** cells 1px `#E2E8F0` border. Headers `#64748B`. Values `#0F172A`. Diagonal: bg `rgba(37,99,235,0.06)`, text `#2563EB`. High corr: `rgba(245,158,11,0.06)`. Negative: `rgba(5,150,105,0.06)`.

**Formula:** `#F1F5F9` bg. Formula text `#0F172A`. Explanation `#64748B`. Metrics: values `#0F172A`, return `#059669`, Sharpe `#2563EB`.

**Assumptions:** values `#0F172A`. Edit icons `#2563EB`. Dividers `#E2E8F0`.

**Light Theme Notes:**
- Same data density — nothing hidden in light mode either
- Heat-map colors work equally well on light: subtle tints on white cells
- Blue `#2563EB` as primary data/accent color throughout
```
