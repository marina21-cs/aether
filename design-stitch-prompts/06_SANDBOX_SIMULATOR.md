# 06 — Sandbox Wealth Simulator — AETHER (Dark Mode SaaS Edition)

> **Navigation:** Previous: [05 Glass Box Engine](./05_GLASS_BOX_ENGINE.md) | Next: [07 Data Ingestion](./07_DATA_INGESTION.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar + Quick Action)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 8 (V1.1) — Sandbox Wealth Simulator (What-If)
> **Release:** V1.1 (Post-MVP, Phase 4) — Design now, build after MVP launch

---

## DARK MODE — Web (1440px)

### Prompt (copy below)

```
Design the Sandbox Wealth Simulator screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. This is a "What-If" environment where users build hypothetical financial scenarios and see projected net worth trajectories over 10 years. Completely isolated from real portfolio data. Dark Mode SaaS — Glassmorphism + Bento Grid aesthetic.

**Google Fonts:** Import `Syne` (headings, labels, nav) and `DM Sans` (body text, numeric values — use `font-variant-numeric: tabular-nums` for all numbers). Do NOT use Inter or IBM Plex Mono anywhere.

**Meta & Color Scheme:**
- `<meta name="theme-color" content="#08080f">`
- `color-scheme: dark` on `:root`.

**Overall Aesthetic:** A financial simulation laboratory wrapped in glassmorphism. Configure inputs on the left, see projections on the right — instant feedback loop. A prominent "SANDBOX MODE" indicator ensures the user never mistakes this for real data. Green accent `#34d399` signals experimentation/simulation throughout. The net worth projection is the hero output. Every card and panel uses glassmorphism (`background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px`).

**Background:** `#08080f`. Add two decorative glow blobs behind content, fixed position, `pointer-events: none; aria-hidden="true"`:
- Blob 1: 600px circle, `radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)`, top-left offset (-10%, 5%).
- Blob 2: 500px circle, `radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)`, bottom-right offset (70%, 60%).

**Left Sidebar (fixed, 240px width, full height):**
Glass panel: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4);` 1px right border `rgba(255,255,255,0.06)`.
- Top (24px padding): "AETHER" Syne Bold 16px `#f1f0ff`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 8px radius). Each nav item: `aria-label` describing destination. Inactive: `#9492b0`, hover bg `#1a1a2e`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.08)`.
  1. Home icon 18px + "Dashboard" DM Sans Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" Syne Bold 11px `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px `#fbbf24` beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — **ACTIVE**. "V1.1" tag DM Sans Bold 9px `#4e4c6a`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Syne Bold 11px `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" Syne Bold 10px `#4e4c6a`, letter-spacing 0.06em. Below: "₱4,287,650" DM Sans Bold 18px `#f1f0ff` `font-variant-numeric: tabular-nums`. Below: "▲ +3.06%" DM Sans Medium 12px `#34d399` `font-variant-numeric: tabular-nums`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always purple (`#7c3aed` border/icon + `rgba(124,58,237,0.08)` bg), inactive `#9492b0`, hover `#1a1a2e`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `rgba(255,255,255,0.06)`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 16px for cards/panels, 8px for buttons/chips/inputs, 1px borders `rgba(255,255,255,0.06)`, Syne for headings/labels/nav, DM Sans for body/numeric. Never use Inter or IBM Plex Mono.
- Glassmorphism on every card/panel: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px`.
- Background glow blobs must be present on every screen: `pointer-events: none; aria-hidden="true"`.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Sandbox Mode Strip (full main-content width, padding 8px 20px, bg `rgba(52,211,153,0.08)`, 1px bottom border `rgba(52,211,153,0.2)`, border-radius 8px):**
FlaskConical icon 14px `#34d399` `aria-hidden="true"` + "SANDBOX MODE — Changes here don't affect your real portfolio." DM Sans SemiBold 12px `#34d399`.

**Main Content (padding 32px):**

**Two-Column Layout — Scenario Builder (left 40%) + Output (right 60%):**

**Left: Scenario Builder Panel**
Glass panel: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;` padding 20px.
- "BUILD SCENARIO" Syne SemiBold 11px `#34d399`, letter-spacing 0.06em.
- 16px gap.

**Input Sections (stacked, 16px gap):**

Input 1 — Starting Portfolio:
- Label: "Starting net worth" DM Sans Medium 12px `#9492b0` uppercase.
- Value row: "₱4,287,650" DM Sans Medium 18px `#f1f0ff` `font-variant-numeric: tabular-nums`. Right: "Use current" badge DM Sans Medium 11px `#7c3aed`, `rgba(124,58,237,0.12)` bg, 8px radius, padding 2px 8px.
- 1px divider `rgba(255,255,255,0.06)`.

Input 2 — Monthly Contribution:
- Label: "Monthly savings/investment"
- Slider: 4px track `rgba(255,255,255,0.06)`, filled `#34d399`, 16px thumb `#f1f0ff` circle, 1px border `rgba(255,255,255,0.06)`. Thumb: `touch-action: none` for precise dragging.
- Value: "₱15,000/mo" DM Sans Medium 14px `#f1f0ff` `font-variant-numeric: tabular-nums` right-aligned.
- Range: ₱0–₱100,000.
- Slider: `role="slider"`, `aria-label="Monthly savings amount"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- 1px divider `rgba(255,255,255,0.06)`.

Input 3 — Hypothetical Allocation:
- Label: "Asset allocation"
- Horizontal stacked bar (8px height, 8px radius, 1px border `rgba(255,255,255,0.06)`):
  PSE 40% `#7c3aed` — Crypto 15% `#fbbf24` — RE 25% `#34d399` — Cash 10% `#4e4c6a` — UITF 10% `#9492b0`.
- Stacked bar: `role="img"`, `aria-label="Asset allocation: PSE 40%, Crypto 15%, Real Estate 25%, Cash 10%, UITF 10%"`.
- "Adjust allocation →" DM Sans Medium 12px `#7c3aed`.
- 1px divider `rgba(255,255,255,0.06)`.

Input 4 — One-Time Events:
- Label: "Scheduled events"
- Event rows: "Sell BTC (₱820K) in Year 2" DM Sans Regular 13px `#f1f0ff`. Trash icon 14px `#f87171` with `aria-label="Remove event"`.
- "Buy property (₱3M) in Year 3" — same.
- "+ Add event" DM Sans Medium 12px `#34d399`.
- 1px divider `rgba(255,255,255,0.06)`.

Input 5 — Time Horizon:
- Label: "Projection years"
- Segmented control: `role="radiogroup"`, `aria-label="Projection time horizon"`. Each segment: `role="radio"`, `aria-checked`.
- Segments: [5, 10, 15, 20, 30]. Active "10": `#34d399` bg, `#08080f` text, DM Sans SemiBold 13px, 8px radius. Inactive: `#1a1a2e` bg, `#9492b0` text, 1px border `rgba(255,255,255,0.06)`, 8px radius.
- 24px gap.

"Run Simulation" button — full width, `#34d399` bg, `#08080f` text (dark text on green), DM Sans SemiBold 14px, height 44px, 8px radius. `focus-visible: outline 2px solid #34d399; outline-offset 2px`. Hover: brightness(1.1). Active: scale(0.98).

**Right: Projection Output (60%, 24px left gap, stacked vertically):**

**Chart Panel:**
Glass panel: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;` padding 20px.
- "PROJECTED NET WORTH" Syne SemiBold 11px `#34d399`.
- "10-year · 1,000 simulations" DM Sans Regular 12px `#4e4c6a`.
- 16px gap.

**Line Chart (full width, height 320px):**
- X: years 2026–2036, DM Sans 11px `#4e4c6a` `font-variant-numeric: tabular-nums`.
- Y: ₱0M–₱20M, DM Sans 11px `#4e4c6a` `font-variant-numeric: tabular-nums`.
- Grid: 1px `rgba(255,255,255,0.06)`.
- **Simulated median:** 2px solid `#34d399` — crisp line.
- **Confidence 50th:** `#34d399` at 12% fill.
- **Confidence 80th:** `#34d399` at 6%.
- **Current trajectory (ref):** 1px dashed `#4e4c6a` labeled "Current path".
- **PSEi benchmark:** 1px solid `#4e4c6a` — always present.
- Event annotations: 1px dashed vertical `#4e4c6a` at Year 2 ("Sell BTC") and Year 3 ("Buy property"), labels DM Sans Regular 10px `#4e4c6a`.
- End callout: "₱12.4M" DM Sans Bold 16px `#34d399` `font-variant-numeric: tabular-nums`.
- Chart container: `role="img"`, `aria-label="Projected net worth line chart showing median trajectory reaching ₱12.4M over 10 years with confidence bands"`.

**Results Panel (16px top gap):**
Glass panel: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;` padding 20px.
- "RESULTS" Syne SemiBold 11px `#4e4c6a`.
- 12px gap.
- 3 result rows, 1px `rgba(255,255,255,0.06)` dividers:
  - "Median (50th)" DM Sans Regular 13px `#9492b0` → "₱12.4M" DM Sans Bold 18px `#34d399` `font-variant-numeric: tabular-nums`. Below: "vs current: +₱4.2M" DM Sans Regular 12px `#34d399`.
  - "Best case (95th)" → "₱22.1M" `#34d399`.
  - "Worst case (5th)" → "₱4.8M" `#f87171`.
- 16px gap.
- "Probability of reaching ₱10M:" DM Sans Medium 14px `#f1f0ff` → "68%" DM Sans Bold 18px `#34d399` `font-variant-numeric: tabular-nums`. Small progress bar: 4px height, 8px radius, `rgba(255,255,255,0.06)` track, `#34d399` fill at 68%. Progress bar: `role="progressbar"`, `aria-valuenow="68"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Probability of reaching ₱10M goal"`.

**Saved Scenarios (16px top gap):**
Glass panel: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px) saturate(1.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;` padding 16px.
- "SAVED SCENARIOS" Syne SemiBold 11px `#4e4c6a`.
- 2 rows: "Aggressive growth" DM Sans Medium 13px `#f1f0ff` → "₱18.2M median" DM Sans 12px `#9492b0` `font-variant-numeric: tabular-nums` → "Mar 5" `#4e4c6a`. Chevron 14px `#4e4c6a` `aria-hidden="true"`.
- "Compare scenarios →" DM Sans Medium 13px `#7c3aed`.

**Accessibility Checklist (Stitch, enforce all):**
- Every interactive element has a visible `focus-visible` ring: `outline: 2px solid #7c3aed; outline-offset: 2px`. No element may be focusable without a visible focus indicator.
- All decorative icons use `aria-hidden="true"`. All functional icons have `aria-label`.
- No use of `transition: all` — always specify exact properties (e.g., `transition: background-color 150ms ease, transform 150ms ease`).
- `touch-action: manipulation` on all buttons and interactive controls. `touch-action: none` on slider thumbs.
- `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }` — always present globally.
- Use `text-wrap: balance` on all headings and labels.
- Glow blobs: `pointer-events: none; aria-hidden="true"`.
- Form inputs have associated `<label>` elements or `aria-label`.
- Color contrast ratios meet WCAG AA for all text on glassmorphism backgrounds.

**Key Design Notes:**
- Left-right split: inputs left, output right — instant feedback ergonomics
- Green `#34d399` as sandbox accent — distinct from purple (primary/nav) and amber (AI)
- Sandbox strip at top: unmistakable separation from real portfolio
- PSEi benchmark always on chart — comparisons ever-present
- Fan chart bands: translucent layers signal sophistication
- Event annotations on chart: vertical markers at financial events
- "Run Simulation" in green — the primary action is always clear
- Saved scenarios enable long-term planning and comparison workflows
- Glassmorphism panels with subtle purple and green glow blobs create depth without distraction
- All numeric values use DM Sans with tabular-nums for perfect column alignment
```
