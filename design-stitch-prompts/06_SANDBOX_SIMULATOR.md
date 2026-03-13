# 06 — Sandbox Wealth Simulator — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [05 Glass Box Engine](./05_GLASS_BOX_ENGINE.md) → Next: [07 Data Ingestion](./07_DATA_INGESTION.md)
> **Also accessible from:** [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (sidebar + Quick Action)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 8 (V1.1) — Sandbox Wealth Simulator (What-If)
> **Release:** V1.1 (Post-MVP, Phase 4) — Design now, build after MVP launch

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Sandbox Wealth Simulator screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. This is a "What-If" environment where users build hypothetical financial scenarios and see projected net worth trajectories over 10 years. Completely isolated from real portfolio data. Enterprise terminal-grade aesthetic.

**Overall Aesthetic:** A financial simulation laboratory. Configure inputs on the left, see projections on the right — instant feedback loop. A prominent "SANDBOX MODE" indicator ensures the user never mistakes this for real data. Green accent `#00C896` signals experimentation/simulation throughout. The net worth projection is the hero output.

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
  6. FlaskConical icon + "Simulator" — **ACTIVE**. "V1.1" tag Inter Bold 9px `#475569`.
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

**Sandbox Mode Strip (full main-content width, padding 8px 20px, bg `rgba(0,200,150,0.08)`, 1px bottom border `rgba(0,200,150,0.2)`):**
FlaskConical icon 14px `#00C896` → "SANDBOX MODE — Changes here don't affect your real portfolio." Inter SemiBold 12px `#00C896`.

**Main Content (padding 32px):**

**Two-Column Layout — Scenario Builder (left 40%) + Output (right 60%):**

**Left: Scenario Builder Panel**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "BUILD SCENARIO" Inter SemiBold 11px `#00C896`, letter-spacing 0.06em.
- 16px gap.

**Input Sections (stacked, 16px gap):**

Input 1 — Starting Portfolio:
- Label: "Starting net worth" Inter Medium 12px `#94A3B8` uppercase.
- Value row: "₱4,287,650" IBM Plex Mono Medium 18px `#E2E8F0`. Right: "Use current" badge Inter Medium 11px `#2D7FF9`, `rgba(45,127,249,0.12)` bg, 4px radius, padding 2px 8px.
- 1px divider `#1E293B`.

Input 2 — Monthly Contribution:
- Label: "Monthly savings/investment"
- Slider: 4px track `#1E293B`, filled `#00C896`, 16px thumb `#E2E8F0` circle, 1px border `#334155`.
- Value: "₱15,000/mo" IBM Plex Mono Medium 14px `#E2E8F0` right-aligned.
- Range: ₱0–₱100,000.
- 1px divider.

Input 3 — Hypothetical Allocation:
- Label: "Asset allocation"
- Horizontal stacked bar (8px height, 2px radius, 1px border `#1E293B`):
  PSE 40% `#2D7FF9` — Crypto 15% `#F59E0B` — RE 25% `#00C896` — Cash 10% `#64748B` — UITF 10% `#94A3B8`.
- "Adjust allocation →" Inter Medium 12px `#2D7FF9`.
- 1px divider.

Input 4 — One-Time Events:
- Label: "Scheduled events"
- Event rows: "Sell BTC (₱820K) in Year 2" Inter Regular 13px `#E2E8F0`. Trash icon 14px `#FF4D6A`.
- "Buy property (₱3M) in Year 3" — same.
- "+ Add event" Inter Medium 12px `#00C896`.
- 1px divider.

Input 5 — Time Horizon:
- Label: "Projection years"
- Segmented: [5, 10, 15, 20, 30]. Active "10": `#00C896` bg, `#0A0F1E` text, Inter SemiBold 13px. Inactive: `#1A2035` bg, `#94A3B8` text, 1px border `#1E293B`.
- 24px gap.

"Run Simulation" button — full width, `#00C896` bg, `#0A0F1E` text (dark text on green), Inter SemiBold 14px, height 44px, 0px radius.

**Right: Projection Output (60%, 24px left gap, stacked vertically):**

**Chart Panel:**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "PROJECTED NET WORTH" Inter SemiBold 11px `#00C896`.
- "10-year · 1,000 simulations" Inter Regular 12px `#475569`.
- 16px gap.

**Line Chart (full width, height 320px):**
- X: years 2026–2036, IBM Plex Mono 11px `#475569`.
- Y: ₱0M–₱20M, IBM Plex Mono 11px `#475569`.
- Grid: 1px `#1E293B`.
- **Simulated median:** 2px solid `#00C896` — crisp line.
- **Confidence 50th:** `#00C896` at 12% fill.
- **Confidence 80th:** `#00C896` at 6%.
- **Current trajectory (ref):** 1px dashed `#64748B` labeled "Current path".
- **PSEi benchmark:** 1px solid `#64748B` — always present.
- Event annotations: 1px dashed vertical `#475569` at Year 2 ("Sell BTC") and Year 3 ("Buy property"), labels Inter Regular 10px `#475569`.
- End callout: "₱12.4M" IBM Plex Mono Bold 16px `#00C896`.

**Results Panel (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px.
- "RESULTS" Inter SemiBold 11px `#64748B`.
- 12px gap.
- 3 result rows, 1px `#1E293B` dividers:
  - "Median (50th)" Inter Regular 13px `#94A3B8` → "₱12.4M" IBM Plex Mono Bold 18px `#00C896`. Below: "vs current: +₱4.2M" Inter Regular 12px `#00C896`.
  - "Best case (95th)" → "₱22.1M" `#00C896`.
  - "Worst case (5th)" → "₱4.8M" `#FF4D6A`.
- 16px gap.
- "Probability of reaching ₱10M:" Inter Medium 14px `#E2E8F0` → "68%" IBM Plex Mono Bold 18px `#00C896`. Small progress bar: 4px height, `#1E293B` track, `#00C896` fill at 68%.

**Saved Scenarios (16px top gap):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 16px.
- "SAVED SCENARIOS" Inter SemiBold 11px `#64748B`.
- 2 rows: "Aggressive growth" Inter Medium 13px `#E2E8F0` → "₱18.2M median" IBM Plex Mono 12px `#94A3B8` → "Mar 5" `#475569`. Chevron 14px `#475569`.
- "Compare scenarios →" Inter Medium 13px `#2D7FF9`.

**Key Design Notes:**
- Left-right split: inputs left, output right — instant feedback ergonomics
- Green `#00C896` as sandbox accent — distinct from blue (real data) and amber (AI)
- Sandbox strip at top: unmistakable separation from real portfolio
- PSEi benchmark always on chart — comparisons ever-present
- Fan chart bands: translucent layers signal sophistication
- Event annotations on chart: vertical markers at financial events
- "Run Simulation" in green — the primary action is always clear
- Saved scenarios enable long-term planning and comparison workflows
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER Sandbox Simulator in LIGHT THEME at 1440px.

**Background:** `#F8FAFC`. Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; only switch to light colors.

**Sandbox strip:** bg `rgba(5,150,105,0.06)`, border `rgba(5,150,105,0.15)`. Text `#059669`.

**Panels:** `#FFFFFF` bg, 1px border `#E2E8F0`.
- Labels `#059669`. Input labels `#64748B`. Values `#0F172A`. Slider fill `#059669`. Thumb `#FFFFFF` border `#CBD5E1`.
- Segmented active: `#059669` bg, `#FFFFFF` text. Inactive: `#FFFFFF` bg, `#64748B` text, `#E2E8F0` border.
- "Run Simulation": `#059669` bg, `#FFFFFF` text.

**Chart:** bg `#FFFFFF`. Grid `#E2E8F0`. Median 2px `#059669`. Benchmark `#94A3B8`. Bands `#059669` at 10%, 5%. Current trajectory `#CBD5E1` dashed. Events `#94A3B8`. Callout `#059669`.

**Results:** values green `#059669`, red `#DC2626`. Progress bar `#059669` fill, `#E2E8F0` track.

**Saved:** names `#0F172A`. Details `#64748B`. "Compare" `#2563EB`.
```
