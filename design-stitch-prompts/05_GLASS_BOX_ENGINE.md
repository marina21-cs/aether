# 05 — Glass Box Predictive Engine — AETHER (Dark Mode SaaS Edition)

> **Navigation:** Previous: [04 AI Advisor](./04_AI_ADVISOR_CHAT.md) → Next: [06 Sandbox Simulator](./06_SANDBOX_SIMULATOR.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (via sidebar)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 2 — Glass Box Predictive Engine (Transparent ML)

---

## DARK MODE — Web (1440px)

### Prompt (copy below)

```
Design the Glass Box Predictive Engine screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. This is a quantitative forecasting view that shows the FULL mathematical model behind portfolio predictions — covariance matrix, Monte Carlo simulation, variance formula, confidence intervals. NOTHING is hidden. Every number is auditable. The math is VISIBLE BY DEFAULT — not tucked behind a "Show Details" toggle. This is Aether's biggest differentiator.

**Overall Aesthetic:** Dark Mode SaaS — Glassmorphism + Bento Grid. The most data-dense screen in the app. Think Bloomberg's quantitative analysis view meets a modern glassmorphic fintech dashboard. DM Sans with `font-variant-numeric: tabular-nums` dominates numeric data; Syne is used for headings and brand type. Every chart, table, and formula is visible simultaneously. Violet `#7c3aed` as the primary data color, with bright violet `#a855f7` for interactive highlights and `#c084fc` for glows. Dense but organized via clear section hierarchy, frosted-glass panels, and generous `border-radius: 16px`.

**Global Head / Meta:**
- `<meta name="theme-color" content="#08080f">`
- On `<html>`: `color-scheme: dark`.
- Google Fonts: `Syne:wght@600;700;800` and `DM+Sans:wght@400;500;600;700` — NEVER load or reference Inter or IBM Plex Mono.

**Background:** `#08080f`.
Behind all content, place two decorative glow blobs (CSS pseudo-elements or absolutely-positioned `<div>`s, `aria-hidden="true"`, `pointer-events: none`):
- Blob 1 (top-left quadrant): radial-gradient ellipse, `rgba(124,58,237,0.12)` center fading to transparent, ~600px diameter, positioned at roughly 15% from left, 10% from top.
- Blob 2 (bottom-right quadrant): radial-gradient ellipse, `rgba(168,85,247,0.08)` center fading to transparent, ~500px diameter, positioned at roughly 75% from left, 70% from top.
Both blobs use `filter: blur(80px)` for a soft ambient glow.

**Accessibility Baseline (apply globally on this screen):**
- Every interactive element must have an explicit `aria-label`.
- Decorative icons use `aria-hidden="true"`.
- Focus style on all interactive elements: `outline: 2px solid #a855f7; outline-offset: 2px` — use `:focus-visible` only (no bare `:focus`).
- NEVER use `transition: all` — always name specific properties (e.g., `transition: background-color 0.15s ease, box-shadow 0.15s ease`).
- All clickable/tappable elements: `touch-action: manipulation`.
- Wrap every `transition` and `animation` declaration inside `@media (prefers-reduced-motion: no-preference) { ... }`. Under `prefers-reduced-motion: reduce`, set `transition-duration: 0.01ms` and `animation-duration: 0.01ms`.
- Long text headings: `text-wrap: balance`.

**Left Sidebar (fixed, 240px width, full height):**
`#13131f` bg, `1px solid rgba(255,255,255,0.06)` right border, `border-radius: 0` (flush to viewport edge).
- Top (24px padding): "AETHER" Syne Bold 16px `#f1f0ff`, letter-spacing 0.08em, uppercase, `text-wrap: balance`.
- 32px gap.
- Section label: "MAIN" DM Sans Bold 11px `#4e4c6a`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, `border-radius: 8px`). Each nav item: `touch-action: manipulation`. Inactive: `#9492b0` text, `focus-visible` outline `#a855f7`. Hover: bg `#1a1a2e`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.08)`.
  1. Home icon 18px + "Dashboard" DM Sans Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" DM Sans Bold 11px `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px `#fbbf24` beside label, `aria-hidden="true"`.
  5. Eye icon + "Glass Box" — **ACTIVE**.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag DM Sans Bold 9px `#4e4c6a`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" DM Sans Bold 11px `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" DM Sans Bold 10px `#4e4c6a`, letter-spacing 0.06em. Below: "₱4,287,650" DM Sans Bold 18px `#f1f0ff` with `font-variant-numeric: tabular-nums`. Below: "▲ +3.06%" DM Sans Medium 12px `#34d399` with `font-variant-numeric: tabular-nums`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions. All decorative icons carry `aria-hidden="true"`.
- Keep color behavior EXACTLY: active nav always violet (`#7c3aed` border/icon + `rgba(124,58,237,0.08)` bg), inactive `#9492b0`, hover `#1a1a2e`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then `1px solid rgba(255,255,255,0.06)` divider, then content blocks.
- Keep foundational tokens EXACTLY: `border-radius: 16px` for cards/panels, `border-radius: 8px` for buttons/chips/nav-items, `1px solid rgba(255,255,255,0.06)` or `1px solid rgba(168,85,247,0.18)` borders, Syne for headings/brand, DM Sans for UI copy, DM Sans with `font-variant-numeric: tabular-nums` for all numeric values. NEVER use Inter or IBM Plex Mono.
- All cards/panels: glassmorphism — `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border-radius: 16px`.
- Focus ring: `outline: 2px solid #a855f7; outline-offset: 2px` on `:focus-visible` only.
- `touch-action: manipulation` on every interactive element.
- `color-scheme: dark` on `<html>`.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content Area (padding 32px, scrollable):**

**Page Header (top):**
- Left: "Glass Box Engine" Syne Bold 24px `#f1f0ff`, `text-wrap: balance`. Eye icon 20px `#7c3aed` inline, `aria-hidden="true"`.
- Right: "Edit assumptions →" DM Sans Medium 13px `#a855f7`, `aria-label="Edit simulation assumptions"`, `touch-action: manipulation`, hover: `color: #c084fc`.
- Below (8px): "Portfolio: ₱4,287,650 · 5 assets · Moderate risk" DM Sans Regular 13px `#4e4c6a`, with `font-variant-numeric: tabular-nums` on numeric spans.
- `1px solid rgba(255,255,255,0.06)` divider, 24px gap.

**Two-Column Layout:**

**Left Column (55%):**

**Section 1 — Monte Carlo Simulation:**
Glassmorphism card: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border-radius: 16px`, padding 20px.
- "MONTE CARLO SIMULATION" DM Sans SemiBold 11px `#7c3aed`, letter-spacing 0.06em, `aria-hidden="true"` (the card itself has `aria-label="Monte Carlo Simulation — 1000 paths, 10-year projection"`).
- "1,000 paths · 10-year projection" DM Sans Regular 12px `#4e4c6a`.
- 16px gap.

**Fan Chart (full column width, height 320px, `role="img"`, `aria-label="Fan chart showing projected portfolio value from 2026 to 2036 across confidence intervals"`):**
A time-series fan chart showing projected portfolio value 2026–2036:
- X-axis: years, DM Sans Regular 11px `#4e4c6a` with `font-variant-numeric: tabular-nums`.
- Y-axis: values ₱0M–₱15M, DM Sans Regular 11px `#4e4c6a` with `font-variant-numeric: tabular-nums`.
- Grid lines: `1px solid rgba(255,255,255,0.06)`.
- **Median line:** 2px solid `#7c3aed` — crisp, no gradient.
- **PSEi benchmark line:** 1px solid `#4e4c6a` — ALWAYS present for comparison. Label: "PSEi" DM Sans Regular 10px `#4e4c6a`.
- **50th percentile band:** `rgba(124,58,237,0.15)` — translucent violet layer.
- **80th percentile band:** `rgba(124,58,237,0.08)` — wider, more translucent.
- **95th percentile band:** `rgba(124,58,237,0.04)` — widest, faintest.
- Fan chart layers create a sophisticated confidence visualization — rare in PH tools.
- Start point: solid dot at ₱4.3M (2026), `1px dashed #4e4c6a` horizontal ref line.
- End median callout: "₱8.2M" DM Sans Bold 14px `#a855f7` with `font-variant-numeric: tabular-nums`.

- 16px gap.
- **Outcome Grid** — 4 cells in a row (CSS Grid or flexbox), gap 8px:
  Each cell: glassmorphism — `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `border-radius: 16px`, padding 12px.
  - "Best Case (95th)" DM Sans Regular 11px `#4e4c6a` → "₱14.8M" DM Sans Bold 16px `#34d399` with `font-variant-numeric: tabular-nums`.
  - "Median (50th)" → "₱8.2M" DM Sans Bold 16px `#a855f7` with `font-variant-numeric: tabular-nums`.
  - "Worst Case (5th)" → "₱2.1M" DM Sans Bold 16px `#f87171` with `font-variant-numeric: tabular-nums`.
  - "Prob. of Loss" → "12.3%" DM Sans Bold 16px `#fbbf24` with `font-variant-numeric: tabular-nums`.

**Section 2 — Covariance Matrix (16px top gap):**
Glassmorphism card: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border-radius: 16px`, padding 20px.
- "COVARIANCE MATRIX (Σ)" DM Sans SemiBold 11px `#7c3aed`.
- "Annualized · 3-year monthly returns" DM Sans Regular 11px `#4e4c6a`.
- 12px gap.
- **Matrix table — 5×5 grid (`role="table"`, `aria-label="Covariance matrix for JFC, BTC, AREIT, BDO, PROP"`):**
  - Corner: empty. Headers: "JFC", "BTC", "AREIT", "BDO", "PROP" DM Sans Bold 11px `#9492b0`.
  - Each cell: DM Sans Regular 12px `#f1f0ff` with `font-variant-numeric: tabular-nums`, padding 8px, `1px solid rgba(255,255,255,0.06)` border.
  - Diagonal (variance): bg `rgba(124,58,237,0.08)`, text `#a855f7`.
  - High correlation (>0.5): bg `rgba(251,191,36,0.06)`.
  - Negative correlation: bg `rgba(52,211,153,0.06)`.
  - Example: JFC/JFC: 0.052, JFC/BTC: 0.018, BTC/BTC: 0.245.
  - Heat-map coloring makes patterns visible at a glance.

**Right Column (45%, 24px left gap):**

**Section 3 — Portfolio Variance Formula:**
Glassmorphism card: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border-radius: 16px`, padding 20px.
- "PORTFOLIO VARIANCE" DM Sans SemiBold 11px `#7c3aed`.
- 12px gap.
- **Formula block** — `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 8px`, padding 16px, centered:
  - "σ²ₚ = wᵀΣw" DM Sans Bold 24px `#f1f0ff` with `font-variant-numeric: tabular-nums`.
  - 4px gap.
  - "Portfolio variance = weights × covariance matrix × weights" DM Sans Regular 12px `#4e4c6a`.
- 16px gap.
- **Metric rows** (stacked, `1px solid rgba(255,255,255,0.06)` dividers):
  - "Portfolio σ (annual)" DM Sans Regular 13px `#9492b0` → "18.4%" DM Sans Medium 16px `#f1f0ff` with `font-variant-numeric: tabular-nums`.
  - "Expected return" → "9.2%" DM Sans Medium 16px `#34d399` with `font-variant-numeric: tabular-nums`.
  - "Sharpe Ratio" → "0.72" DM Sans Medium 16px `#a855f7` with `font-variant-numeric: tabular-nums`.
  - "Risk-free rate (BSP)" → "6.25%" DM Sans Medium 16px `#f1f0ff` with `font-variant-numeric: tabular-nums`.

**Section 4 — Assumptions Panel (16px top gap):**
Glassmorphism card: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `-webkit-backdrop-filter: blur(12px)`, `border-radius: 16px`, padding 20px.
- "ASSUMPTIONS" DM Sans SemiBold 11px `#4e4c6a`. "These parameters drive the simulation." DM Sans Regular 12px `#4e4c6a`.
- 12px gap.
- Editable parameter rows (`1px solid rgba(255,255,255,0.06)` dividers, padding 10px 0):
  - "Expected annual return" DM Sans Regular 13px `#9492b0` → "9.2%" DM Sans Medium 14px `#f1f0ff` with `font-variant-numeric: tabular-nums` + pencil icon 14px `#a855f7` (`aria-hidden="true"`). Row itself: `aria-label="Expected annual return: 9.2%, click to edit"`, `touch-action: manipulation`.
  - "Annual volatility" → "18.4%" (same pattern).
  - "Risk-free rate (BSP)" → "6.25%" (same pattern).
  - "Simulation paths" → "1,000" (same pattern).
  - "Projection years" → "10" (same pattern).
  - Each value editable — clicking opens inline edit with `outline: 2px solid #a855f7; outline-offset: 2px` focus border on `:focus-visible`, input `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `border-radius: 8px`, `color: #f1f0ff`, `font-variant-numeric: tabular-nums`.

**Key Design Notes:**
- MATH VISIBLE BY DEFAULT — covariance matrix, formula, Monte Carlo ALL on screen simultaneously
- No "Show Details" toggles — data density IS the feature, trust IS transparency
- Monte Carlo fan chart uses translucent layered violet bands — signals quant sophistication with glassmorphic aesthetic
- PSEi benchmark line ALWAYS on the fan chart in muted `#4e4c6a` for instant comparison
- Covariance matrix uses heat-map coloring: violet diagonal, amber high-correlation, green negative
- Two-column layout maximizes information density on desktop
- All values in DM Sans with `font-variant-numeric: tabular-nums` — precise, tabular-aligned, auditable
- Assumptions explicitly editable — users can stress-test the model
- This screen competes with Bloomberg Level 2 data — positioned as professional-grade
- Glassmorphism cards with `backdrop-filter: blur(12px)` and violet-tinted borders create depth without sacrificing readability
- Background glow blobs (`aria-hidden="true"`) add ambient energy; they are purely decorative
- All transitions wrapped in `@media (prefers-reduced-motion: no-preference)` — never use `transition: all`
- NEVER reference Inter or IBM Plex Mono anywhere — Syne for headings/brand, DM Sans for everything else
```
