# 03 — Dashboard: Net Worth + Allocation — AETHER (Dark Mode SaaS Edition)

> **Navigation:** Previous: [02 Onboarding](./02_ONBOARDING_AUTH.md) → This is the **HOME** screen
> **Accessible from here:** [04 AI Advisor](./04_AI_ADVISOR_CHAT.md) · [05 Glass Box](./05_GLASS_BOX_ENGINE.md) · [06 Simulator](./06_SANDBOX_SIMULATOR.md) · [07 Data Ingestion](./07_DATA_INGESTION.md) · [08 Fee Analyzer](./08_FEE_ANALYZER_REAL_RETURN.md) · [09 Performance](./09_PERFORMANCE_HISTORY.md) · [10 Settings](./10_SETTINGS_PROFILE.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 1 (Omni-Asset Net Worth Dashboard) + Dynamic Allocation View

---

## DARK MODE — Web (1440px)

### Prompt (copy below)

```
Design the main dashboard home screen for "AETHER", a wealth management platform — displayed at 1440px desktop width, dark mode only. This is the central hub. The user sees their total net worth (THE HERO), asset allocation, holdings, and recent activity. Dark Mode SaaS aesthetic — Glassmorphism + Bento Grid. Three-panel Bloomberg-density layout with frosted-glass surfaces, soft violet accents, and generous radius.

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

**Global Head Tags (non-negotiable):**
<meta name="theme-color" content="#08080f">
<meta name="color-scheme" content="dark">
<style>
  :root { color-scheme: dark; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
</style>

**Overall Aesthetic:** A financial command center wrapped in frosted glass. Dense but scannable. The net worth number is the HERO of this screen — large, always visible, always live. Everything else provides context for that number. No card-grid weather-app patterns. Use horizontal data rows with clear hierarchy. DM Sans with `font-variant-numeric: tabular-nums` for ALL financial figures. Glass surfaces with subtle violet glow, generous whitespace between sections.

**Background:** `#08080f` full page.
Two ambient glow blobs absolutely positioned behind content, pointer-events: none, z-index: 0:
  - Blob 1: `radial-gradient(ellipse 600px 400px at 25% 20%, rgba(124,58,237,0.08), transparent)`.
  - Blob 2: `radial-gradient(ellipse 500px 500px at 75% 60%, rgba(168,85,247,0.06), transparent)`.
  These blobs are decorative only — `aria-hidden="true"` on their containers.

**Glass Surface Mixin (reused everywhere):**
```css
.glass-surface {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(168,85,247,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(124,58,237,0.12);
  border-radius: 16px;
}
```

**LAYOUT — Three-Panel Bloomberg Pattern (Glassmorphism):**

**Left Sidebar (fixed, 240px width, full height):**
Glass sidebar: `background: rgba(19,19,31,0.85)`, `border-right: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(16px)`, `box-shadow: 4px 0 24px rgba(124,58,237,0.06)`. No border-radius (full-height flush).
- Top (24px padding): "AETHER" Syne Bold 16px `#f1f0ff`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 8px radius). Inactive: `#9492b0`, hover bg `rgba(255,255,255,0.04)`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.08)`.
  All nav icon-buttons MUST have `aria-label` describing the destination (e.g. `aria-label="Dashboard"`).
  1. Home icon 18px + "Dashboard" DM Sans Medium 14px — **ACTIVE**.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" Syne Bold 11px `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px `#fbbf24` beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Syne Bold 9px `#4e4c6a`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Syne Bold 11px `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom of sidebar (padding 16px): Net worth always visible:
  "NET WORTH" Syne Bold 10px `#4e4c6a`, letter-spacing 0.06em. Below: "₱4,287,650" DM Sans Bold 18px `#f1f0ff` `font-variant-numeric: tabular-nums`. Below: "▲ +3.06%" DM Sans Medium 12px `#34d399` `font-variant-numeric: tabular-nums`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions. Decorative icons use `aria-hidden="true"`. Interactive icon-buttons use `aria-label`.
- Keep color behavior EXACTLY: active nav always violet (`#7c3aed` border/icon + `rgba(124,58,237,0.08)` bg), inactive `#9492b0`, hover `rgba(255,255,255,0.04)`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `rgba(255,255,255,0.06)`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 16px for cards, 8px for buttons/inputs/chips, glass surfaces everywhere, 1px borders using `rgba(168,85,247,0.18)` or `rgba(255,255,255,0.06)`, Syne for headings/brand, DM Sans for UI copy, DM Sans `font-variant-numeric: tabular-nums` for all numeric values.
- Keep glass surface treatment EXACTLY: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`, `border-radius: 16px`.
- Accessibility tokens EXACTLY: `focus-visible: outline 2px solid #a855f7, outline-offset 2px`. Never use `outline: none` without a `focus-visible` replacement. Never use `transition: all` — always specify exact properties (e.g. `transition: background-color 0.15s ease, border-color 0.15s ease`). All interactive elements: `touch-action: manipulation`.
- NEVER reference Inter, Roboto, Arial, Helvetica, or Space Grotesk anywhere.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content Area (fills remaining width minus sidebar, scrollable, padding 32px, position: relative, z-index: 1):**

**Net Worth Hero Section (top of main area):**
- Left block:
  - "TOTAL NET WORTH" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em, uppercase.
  - 8px gap.
  - **"₱4,287,650.00"** in DM Sans Bold 52px `#f1f0ff` `font-variant-numeric: tabular-nums`. The peso sign at 36px. This is THE visual anchor — the largest element on screen. It animates/counts up on page load (800ms ease-out). Heading uses `text-wrap: balance`. `@media (prefers-reduced-motion: reduce)` — skip the count-up, render final value instantly.
  - 8px gap.
  - Change row: Up-arrow triangle 10px `#34d399` `aria-hidden="true"` → "+₱127,340.00 (+3.06%)" DM Sans Medium 16px `#34d399` `font-variant-numeric: tabular-nums` → "this month" DM Sans Regular 13px `#4e4c6a`. 8px gap. "PHP" currency badge: Syne Bold 10px `#7c3aed`, bg `rgba(124,58,237,0.12)`, padding 2px 8px, 8px radius.
- Right block (right-aligned):
  - Three stat chips horizontal, 16px gap:
    - "Assets" label DM Sans Medium 11px `#4e4c6a` → "₱5,127,650" DM Sans Medium 16px `#f1f0ff` `font-variant-numeric: tabular-nums`.
    - "Liabilities" → "₱840,000" DM Sans Medium 16px `#f1f0ff` `font-variant-numeric: tabular-nums`.
    - "Real Return" → "+1.2%" DM Sans Medium 16px `#34d399` `font-variant-numeric: tabular-nums` (green if positive, `#f87171` if negative).
  Separated by 1px vertical `rgba(255,255,255,0.06)` dividers.

- 1px horizontal divider `rgba(255,255,255,0.06)`, 24px vertical spacing.

**Two-Column Layout Below Hero:**

**Left Column (60% width):**

**Holdings Table (glass surface: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, `box-shadow: 0 8px 32px rgba(124,58,237,0.12)`, `border-radius: 16px`, `#13131f` bg fallback for no-backdrop-filter):**
- Header row: bg `rgba(255,255,255,0.03)`, padding 12px 16px, 1px bottom border `rgba(255,255,255,0.06)`.
  - "YOUR HOLDINGS" Syne SemiBold 11px `#4e4c6a` uppercase, `text-wrap: balance`. Right: "12 total" DM Sans Regular 12px `#4e4c6a`. Filter icon-button 16px `#4e4c6a` with `aria-label="Filter holdings"`.
- Data rows (each: padding 12px 16px, 1px bottom border `rgba(255,255,255,0.06)`, hover bg `rgba(255,255,255,0.03)`, `transition: background-color 0.15s ease`):
  Row layout per holding:
  - Left: Ticker badge — 40px width, 24px height, `rgba(255,255,255,0.04)` bg, 1px border `rgba(255,255,255,0.06)`, 8px radius. "JFC" DM Sans Bold 11px `#f1f0ff` `font-variant-numeric: tabular-nums` centered.
  - 12px gap. "Jollibee Foods Corp" DM Sans Medium 14px `#f1f0ff`. Below ticker: "500 shares · PSE" DM Sans Regular 12px `#4e4c6a`.
  - Right-aligned: "₱287,500.00" DM Sans Medium 14px `#f1f0ff` `font-variant-numeric: tabular-nums`. Below: "▲ +4.2%" DM Sans Regular 12px `#34d399` `font-variant-numeric: tabular-nums`.

  Holdings:
  1. JFC — Jollibee Foods Corp — ₱287,500.00 — ▲ +4.2%
  2. BTC — Bitcoin — ₱820,000.00 — ▼ -1.8% (in `#f87171`)
  3. AREIT — AREIT Inc. — ₱150,000.00 — ▲ +2.1%
  4. BDO — BDO Savings — ₱425,000.00 — ▲ +0.3%
  5. PROP — Bulacan Property — ₱1,800,000.00 — ▲ +8.5%

- Bottom row: "View all 12 holdings →" DM Sans Medium 13px `#7c3aed`, padding 12px 16px. `focus-visible: outline 2px solid #a855f7, outline-offset 2px`.

**Recent Activity (16px top gap, glass surface: same glass mixin as Holdings):**
- Header: bg `rgba(255,255,255,0.03)` padding 12px 16px. "RECENT ACTIVITY" Syne SemiBold 11px `#4e4c6a`, `text-wrap: balance`.
- 3 rows:
  - Each: small icon 18px in `rgba(255,255,255,0.04)` rounded (8px radius) container with `aria-hidden="true"` → "Bought JFC" DM Sans Medium 13px `#f1f0ff` → "Mar 5, 2026 · Manual" DM Sans Regular 12px `#4e4c6a` → right: "-₱28,750" DM Sans Medium 13px `#f1f0ff` `font-variant-numeric: tabular-nums`.
  - Buy: ArrowDown icon `#34d399`. Sell: ArrowUp `#f87171`. Dividend: Coins `#fbbf24`.
  - Row hover: `background-color: rgba(255,255,255,0.03)`, `transition: background-color 0.15s ease`.

**Right Column (40% width, 24px left gap):**

**Allocation Panel (glass surface: same glass mixin, padding 20px):**
- "ALLOCATION" Syne SemiBold 11px `#4e4c6a`, `text-wrap: balance`. Right: "5 classes" DM Sans Regular 12px `#4e4c6a`.
- 16px gap.
- Horizontal stacked bar (full width, 8px height, 8px radius):
  - PSE Stocks 35% `#7c3aed` — Crypto 20% `#fbbf24` — Real Estate 25% `#34d399` — Cash 12% `#4e4c6a` — UITFs 8% `#9492b0`.
- 16px gap.
- Legend rows (stacked, 8px gap):
  - Each: 8px square color swatch (8px radius) → asset name DM Sans Medium 13px `#f1f0ff` → right: "35%" DM Sans Medium 13px `#9492b0` `font-variant-numeric: tabular-nums` → "₱1,794,678" DM Sans Medium 13px `#f1f0ff` `font-variant-numeric: tabular-nums`.

**Quick Actions (16px top gap):**
Horizontal row, 8px gap:
1. "Add Asset" — glass surface: `rgba(255,255,255,0.04)` bg, `1px solid rgba(168,85,247,0.18)`, `backdrop-filter: blur(12px)`, 8px radius, padding 8px 16px. Plus icon 16px `#7c3aed` `aria-hidden="true"` → DM Sans Medium 13px `#f1f0ff`. Hover: border `rgba(168,85,247,0.32)`, `transition: border-color 0.15s ease, background-color 0.15s ease`. `focus-visible: outline 2px solid #a855f7, outline-offset 2px`. `touch-action: manipulation`.
2. "Import CSV" — Upload icon `#7c3aed` `aria-hidden="true"`. Same glass button style.
3. "Ask AI" — Brain icon `#fbbf24` `aria-hidden="true"`. Same glass button style.
4. "Simulate" — FlaskConical icon `#34d399` `aria-hidden="true"`. Same glass button style.
All quick action buttons MUST have `aria-label` matching their visible text (e.g. `aria-label="Add Asset"`).

**AI Advisor Toggle (16px top gap):**
A glass card: same glass surface mixin, padding 16px.
- Brain icon 18px `#fbbf24` `aria-hidden="true"` → "AI ADVISOR" Syne Bold 11px `#fbbf24` → right: "Open" DM Sans Medium 12px `#7c3aed`, `focus-visible: outline 2px solid #a855f7, outline-offset 2px`, `touch-action: manipulation`.
- Below (8px): "Ask about your portfolio or market conditions" DM Sans Regular 12px `#4e4c6a`.
- Tapping "Open" expands the right rail panel (see 04_AI_ADVISOR_CHAT.md).

**Accessibility Enforcement (non-negotiable):**
- Every icon-only button has `aria-label`.
- Every decorative icon/illustration has `aria-hidden="true"`.
- Focus ring: `focus-visible: outline 2px solid #a855f7, outline-offset 2px` on ALL interactive elements. Never `outline: none` without replacement.
- No `transition: all` anywhere. Always specify exact properties: `transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease`.
- All buttons/links: `touch-action: manipulation`.
- `@media (prefers-reduced-motion: reduce)` — disable all animations, count-ups render final value, no transitions.
- `text-wrap: balance` on all section headings and the hero net worth label.
- Color contrast: `#f1f0ff` on `#08080f` = 17.2:1. `#9492b0` on `#08080f` = 5.8:1. `#4e4c6a` on `#08080f` = 3.2:1 (decorative/label only, never body text).

**Key Design Notes:**
- Three-panel layout: fixed glass sidebar (240px) + main content + optional right rail (320px for AI advisor)
- NET WORTH IS THE HERO: 52px DM Sans Bold with tabular-nums, counts up on load (respects prefers-reduced-motion), always visible in sidebar too
- Holdings as horizontal data rows (table), NOT card grids — dense, scannable, Bloomberg-density
- Allocation as stacked bar, not donut chart — denser, more precise, better data-to-ink ratio
- All numbers in DM Sans with `font-variant-numeric: tabular-nums` — tabular alignment, precise rendering
- Glass surfaces everywhere: sidebar, cards, panels, buttons — all use `rgba(255,255,255,0.04)` bg + `rgba(168,85,247,0.18)` border + `backdrop-filter: blur(12px)` + violet box-shadow
- Ambient glow blobs behind content for depth — purely decorative, `aria-hidden`
- Hover: subtle glass brightening `rgba(255,255,255,0.03)` — micro-interaction quality signal, always specify `transition: background-color 0.15s ease`
- Toast notifications (top-right) for sync status, never modal popups — toasts also use glass surface
- Skeleton loaders match exact data shape when loading — skeleton shimmer uses `rgba(124,58,237,0.08)`
- The PSEi benchmark line is NOT on this screen but is always present on performance charts
- `color-scheme: dark` enforced at `:root`
- `<meta name="theme-color" content="#08080f">` in document head
- Background glow blobs use `position: fixed`, `pointer-events: none`, `z-index: 0`
- NEVER reference Inter, Roboto, Arial, Helvetica, or Space Grotesk — only Syne and DM Sans
```
