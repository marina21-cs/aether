# 08 — Fee Analyzer & Real-Return Calculator — AETHER (Dark SaaS Edition)

> **Navigation:** Previous: [07 Data Ingestion](./07_DATA_INGESTION.md) → Next: [09 Performance History](./09_PERFORMANCE_HISTORY.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar "Fee Scanner")
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 7 (Hidden Fee & Debt Analyzer) + Feature 8 (Real-Return Calculator)
> **Theme:** Dark-mode-only. No light theme variant.

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Fee Analyzer & Real-Return Calculator screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. TWO sections via top tab switcher: "Fee Scanner" and "Real Return." Fee Scanner surfaces hidden costs (UITF management fees, credit card interest, inflation erosion) and quantifies their 10-year impact. Real Return adjusts every return against Philippine CPI. Warning/alert colors justified here.

**Overall Aesthetic:** Dark Mode SaaS — Glassmorphism + Bento Grid. An investigative financial audit. Makes invisible costs visible. The warning amber `#fbbf24` and loss red `#f87171` are justified on this screen — these are real alarm signals. The 10-year cost projection is the gut-punch number. Dense data, explicit severity, constructive suggestions. Luxury fintech, not consumer budgeting. Framer dark templates × Linear precision × Stripe gradient artistry.

**What to avoid:** Light themes, pastel colors, illustration-heavy empty states, rounded-corner "friendly" card grids, anything resembling a consumer budgeting or mobile weather app. NEVER use Inter, Roboto, Arial, Helvetica, Space Grotesk, IBM Plex Mono, or system-ui as fonts.

**Required `<head>` tags:**
```html
<meta name="theme-color" content="#08080f">
<html lang="en" style="color-scheme: dark;">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
```

**Background:** `#08080f` (near-black with violet tint). `color-scheme: dark` on `<html>`.

**Background Glow Blobs (place on page, behind all content, `aria-hidden="true"`):**
- Blob 1: 600px × 600px, top -200px left -100px, `radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)`, `filter: blur(120px)`, `position: fixed`, `pointer-events: none`, `z-index: 0`.
- Blob 2: 400px × 400px, bottom 20% right -100px, `radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)`, same blur/position treatment.

**Typography Rules (mandatory, no exceptions):**
- Headings / brand / hero numbers: Syne (Bold 700 or SemiBold 600).
- Body / labels / UI text / buttons: DM Sans (Regular 400, Medium 500).
- Financial figures: DM Sans Medium 500 with `font-variant-numeric: tabular-nums`.
- Large financial figures (hero numbers): Syne Bold 700.
- NEVER use Inter, IBM Plex Mono, Roboto, Arial, Helvetica, or system-ui.

---

**Left Sidebar (fixed, 240px width, full height):**
Glassmorphism: `#13131f` bg, `backdrop-filter: blur(12px)`, 1px right border `rgba(168,85,247,0.18)`.
- Top (24px padding): "AETHER" Syne Bold 1.1rem `#f1f0ff`, letter-spacing 0.05em, uppercase.
- 32px gap.
- Section label: "MAIN" DM Sans Medium 0.75rem `#4e4c6a`, letter-spacing 0.1em, uppercase, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 8px radius). Inactive: `#9492b0`, hover bg `rgba(255,255,255,0.04)`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.15)`.
  1. Home icon 18px + "Dashboard" DM Sans Regular 0.875rem — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" DM Sans Medium 0.75rem `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px `#fbbf24` beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag DM Sans Medium 0.625rem `#4e4c6a`, bg `rgba(255,255,255,0.04)`, 999px radius, padding 2px 6px.
  7. AlertTriangle icon + "Fee Scanner" — **ACTIVE**.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" DM Sans Medium 0.75rem `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" DM Sans Medium 0.625rem `#4e4c6a`, letter-spacing 0.1em, uppercase. Below: "₱4,287,650" Syne Bold 1.125rem `#f1f0ff`. Below: "▲ +3.06%" DM Sans Medium 0.75rem `#34d399`, `font-variant-numeric: tabular-nums`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always violet (`#7c3aed` border/icon + `rgba(124,58,237,0.15)` bg), inactive `#9492b0`, hover `rgba(255,255,255,0.04)`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `rgba(255,255,255,0.06)`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 16px for cards/panels, 8px for buttons/chips/inputs, 1px borders, Syne for headings, DM Sans for UI copy, DM Sans `tabular-nums` for all numeric values. NEVER use Inter or IBM Plex Mono.
- Sidebar uses glassmorphism: `#13131f` bg, `backdrop-filter: blur(12px)`, 1px right border `rgba(168,85,247,0.18)`.
- All cards/panels use glassmorphism: `rgba(255,255,255,0.04)` bg, `1px solid rgba(168,85,247,0.18)` border, `backdrop-filter: blur(12px)`, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`, 16px radius.
- Card hover: border `rgba(168,85,247,0.35)`, shadow `0 12px 48px rgba(124,58,237,0.2)`, `transform: translateY(-2px)`.
- `<meta name="theme-color" content="#08080f">` and `color-scheme: dark` on `<html>`.
- Background glow blobs on every page (`aria-hidden="true"`).
- If any screen-specific styling conflicts with this lock, follow this lock.

---

**Main Content (padding 32px):**

**Page Header:**
- "Wealth Protection" Syne Bold 2.25rem `#f1f0ff`. Info icon 18px `#4e4c6a`.
- 1px divider `rgba(255,255,255,0.06)`, 16px gap.

**Tab Switcher (full width, 1px bottom border `rgba(255,255,255,0.06)`):**
- "Fee Scanner" — active: DM Sans Medium 0.875rem `#f1f0ff`, 2px bottom border `#fbbf24`.
- "Real Return" — inactive: DM Sans Regular 0.875rem `#4e4c6a`.
- Focus-visible on tabs: `outline: 2px solid #a855f7; outline-offset: 2px`.
- `role="tablist"` on container; `role="tab"` + `aria-selected` on each tab; `role="tabpanel"` on content.
- 24px gap below tabs.

---

### TAB 1: FEE SCANNER

**Alert Summary (full width, glassmorphism card: `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(12px)`, 1px border `#fbbf24`, 16px radius, padding 20px, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`):**
- AlertTriangle icon 20px `#fbbf24` → "3 hidden costs detected" DM Sans Medium 1rem `#fbbf24`.
- 8px gap.
- **"Estimated 10-year cost: ₱248,000"** Syne Bold 2rem `#f87171`. This is the hero number — the alarm.
- 4px gap.
- "Equivalent to 4.7 months of your current salary." DM Sans Regular 0.875rem `#9492b0`.

**Two-Column: Flagged Items (left 60%) + Impact Summary (right 40%):**

**Left — Flagged Costs:**
- "FLAGGED COSTS" DM Sans Medium 0.75rem `#f87171`, letter-spacing 0.1em, uppercase.
- 12px gap.

3 flagged cards stacked, 12px gap:

**Card 1 — UITF Management Fee:**
Glassmorphism: `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(12px)`, 1px border `#f87171`, 16px radius, padding 16px, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`.
- Top: "BPI Equity Fund UITF" DM Sans Medium 0.875rem `#f1f0ff`. Right: "HIGH" badge DM Sans Medium 0.625rem `#f87171`, bg `rgba(248,113,113,0.12)`, 12px radius, padding 2px 8px.
- 12px gap.
- Data rows (1px `rgba(255,255,255,0.06)` dividers):
  - "Management fee" DM Sans Regular 0.75rem `#9492b0` → "2.15% p.a." DM Sans Medium 0.875rem `#f87171` `tabular-nums`.
  - "Benchmark avg" → "0.85% p.a." DM Sans Medium `#4e4c6a` `tabular-nums`.
  - "Your investment" → "₱500,000" DM Sans Medium `#f1f0ff` `tabular-nums`.
  - "10-year cost" → "₱156,000" DM Sans Medium 0.875rem `#f87171` `tabular-nums`.
- 12px gap.
- Suggestion: Lightbulb icon 14px `#34d399` → "Consider FMETF (PSEi ETF) — fee: 0.50% p.a." DM Sans Regular 0.8125rem `#34d399`.

**Card 2 — Savings vs Inflation:**
1px border `#fbbf24`, 16px radius, same glassmorphism bg. "BDO Savings" — "MEDIUM" badge DM Sans Medium 0.625rem `#fbbf24`, bg `rgba(251,191,36,0.12)`, 12px radius.
- "Interest" → "0.25% p.a." `tabular-nums` → "CPI" → "5.8% p.a." `#f87171` `tabular-nums` → "Real return" → "-5.55% p.a." DM Sans Medium `#f87171` `tabular-nums`.
- "10-year erosion" → "₱67,000" `#f87171` `tabular-nums`.
- Suggestion: "Time deposit 5.5% p.a. or REIT ~5-6% dividend yield." `#34d399`.

**Card 3 — Credit Card:**
1px border `#f87171`, 16px radius, same glassmorphism bg. "BPI Gold Mastercard" — "HIGH" badge `#f87171`.
- "Balance" → "₱85,000" `tabular-nums` → "Annual EIR" → "24.0% p.a." `#f87171` `tabular-nums` → "10-year cost" → "₱25,000" `tabular-nums`.
- Suggestion: "Prioritize full payoff. ₱28,333/mo eliminates in 3 months." `#34d399`.

**Right — Impact Visualization (24px left gap):**

**Cost Breakdown Bar:**
Glassmorphism card: `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(12px)`, 1px border `rgba(168,85,247,0.18)`, 16px radius, padding 20px, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`.
- "10-YEAR COST BREAKDOWN" DM Sans Medium 0.75rem `#4e4c6a`, letter-spacing 0.1em, uppercase.
- 12px gap.
- Horizontal stacked bar (12px height, 8px radius):
  - UITF fees 63% `#f87171`, Inflation 27% `#fbbf24`, Credit 10% `#f87171`.
- Labels below each segment, DM Sans Regular 0.6875rem, matching colors.
- "₱248K total" DM Sans Medium 1rem `#f87171` `tabular-nums` right-aligned below.
- `role="img"` with `aria-label="Cost breakdown: UITF fees 63%, Inflation erosion 27%, Credit card interest 10%"`.

**Net Worth Impact Chart (16px top gap):**
Glassmorphism card: same as above.
- "NET WORTH IMPACT" DM Sans Medium 0.75rem `#4e4c6a`, letter-spacing 0.1em, uppercase.
- Line chart (280px height):
  - "With hidden costs" — 2px `#f87171` descending line.
  - "After optimization" — 2px `#34d399` line (higher trajectory).
  - Gap between lines shaded `#34d399` at 8% opacity — "₱248K saved" DM Sans Medium 0.75rem `#34d399`.
  - Grid lines `rgba(255,255,255,0.06)`. Axis labels DM Sans Regular 0.6875rem `#4e4c6a` `tabular-nums`.
- `role="img"` with `aria-label="Line chart showing net worth projection with and without hidden costs over 10 years. Optimization saves approximately ₱248,000."`.

---

### TAB 2: REAL RETURN

**Inflation Context:**
Full width, glassmorphism card: `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(12px)`, 1px border `rgba(168,85,247,0.18)`, 16px radius, padding 16px, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`.
- "PH CPI INFLATION" DM Sans Medium 0.75rem `#4e4c6a`, letter-spacing 0.1em, uppercase.
- "5.8% YoY (Feb 2026)" Syne Bold 1.75rem `#f87171`.
- "Source: Philippine Statistics Authority · Mar 2026" DM Sans Regular 0.6875rem `#4e4c6a`.

**Real Return Data Table (16px top gap):**
Glassmorphism card: `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(12px)`, 1px border `rgba(168,85,247,0.18)`, 16px radius, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`.
- Header row: bg `#1a1a2e`, DM Sans Medium 0.75rem `#4e4c6a` uppercase, letter-spacing 0.06em. Columns: "Asset" / "Nominal Return" / "Real Return" / "Status".
- Data rows (1px `rgba(255,255,255,0.06)` dividers, padding 12px 16px, hover bg `rgba(255,255,255,0.04)`):
  1. "JFC" `#f1f0ff` → "+8.2%" `#34d399` → "+2.4%" `#34d399` → CheckCircle `#34d399`.
  2. "BTC" → "+15.1%" `#34d399` → "+9.3%" `#34d399` → CheckCircle `#34d399`.
  3. "AREIT" → "+5.8%" `#34d399` → "0.0%" `#4e4c6a` → Minus `#fbbf24`.
  4. "BDO Savings" → "+0.25%" `#4e4c6a` → "-5.55%" `#f87171` DM Sans Medium → XCircle `#f87171`.
  5. "Time Dep." → "+5.5%" `#34d399` → "-0.3%" `#fbbf24` → AlertTriangle `#fbbf24`.
  All values DM Sans Medium 0.8125rem `tabular-nums`.
- Table uses `<table>` with proper `<thead>`, `<tbody>`, `<th scope="col">`, `<td>` semantic markup.

**Purchasing Power Chart (16px top gap):**
Glassmorphism card: `rgba(255,255,255,0.04)` bg, `backdrop-filter: blur(12px)`, 1px border `rgba(168,85,247,0.18)`, 16px radius, padding 20px, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`.
- "PURCHASING POWER OF ₱1M" DM Sans Medium 0.75rem `#4e4c6a`, letter-spacing 0.1em, uppercase.
- Line chart (240px height):
  - Savings 0.25%: 1px dashed `#f87171` descending to ~₱570K.
  - Time deposit 5.5%: 1px solid `#4e4c6a` flat ~₱970K.
  - Equity 8.2%: 2px solid `#34d399` rising to ~₱1.2M.
  - PSEi benchmark: 1px `#4e4c6a` dashed for reference.
  - Grid lines `rgba(255,255,255,0.06)`. Legend below chart, DM Sans Regular 0.75rem.
  - Axis labels DM Sans Regular 0.6875rem `#4e4c6a` `tabular-nums`.
- `role="img"` with `aria-label="Line chart showing purchasing power of 1 million pesos over 10 years across savings, time deposit, and equity investment scenarios adjusted for 5.8% CPI inflation."`.

---

### ACCESSIBILITY CHECKLIST (enforce in output)

| Rule | Requirement |
|------|-------------|
| Icon buttons | `aria-label` on every `<button>` with only an icon |
| Decorative icons | `aria-hidden="true"` on all decorative SVGs |
| Focus states | `focus-visible:` ring using `#a855f7` — never `outline: none` without replacement |
| Semantic HTML | `<button>` for actions, `<a>` for navigation, never `<div onClick>` |
| Tab switcher | `role="tablist"` container, `role="tab"` + `aria-selected` on tabs, `role="tabpanel"` + `aria-labelledby` on panels |
| Data table | `<table>` with `<thead>`, `<th scope="col">`, `<tbody>`, `<td>` — never div-based tables |
| Charts | `role="img"` with descriptive `aria-label` on every chart/visualization |
| Headings | Hierarchical `h1 → h2 → h3` — one `h1` per page |
| Motion | `@media (prefers-reduced-motion: reduce)` disables all transitions/animations |
| Animations | Only `transform` + `opacity` — never `transition: all` |
| Typography | `text-wrap: balance` on headings |
| Dark mode | `color-scheme: dark` on `<html>`; `<meta name="theme-color" content="#08080f">` |
| Touch | `touch-action: manipulation` on all interactive elements |
| Overflow | `min-width: 0` on flex children with text; `text-overflow: ellipsis` or `overflow-wrap: break-word` on dynamic content |
| Color contrast | All text meets WCAG 2.1 AA minimum (4.5:1 for body, 3:1 for large text). `#f1f0ff` on `#08080f` = 17.2:1. `#9492b0` on `#08080f` = 5.8:1. `#4e4c6a` used only for non-essential labels, never for critical information. |
| Status indicators | Never convey status by color alone — always pair with icon or text label |

---

### KEY DESIGN NOTES

- Warning/alarm colors JUSTIFIED here: `#fbbf24` amber and `#f87171` red for real financial threats
- 10-year cost number is THE HERO of Fee Scanner — large, red (Syne Bold 2rem), alarming on purpose
- Salary equivalence ("4.7 months") makes abstract costs viscerally real
- Every flagged cost includes a CONSTRUCTIVE suggestion in green `#34d399`
- Real Return table: nominal vs real comparison is the "aha moment"
- Data table with row hover highlight — Bloomberg-grade density with glassmorphism polish
- Purchasing power chart: 10-year erosion visualization is the long-term gut-punch
- ALL cards/panels use glassmorphism: glass bg + purple-tinted border + blur + shadow + 16px radius
- NO light theme — this is a dark-mode-only design
- Glow blobs provide subtle ambient depth behind content
- Syne for all headings and hero numbers; DM Sans for all body/labels/UI; NEVER Inter or IBM Plex Mono
```
