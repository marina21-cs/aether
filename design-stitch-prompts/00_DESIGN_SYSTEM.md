# AETHER — Design System Tokens (Enterprise Web Edition)

> **Purpose:** Single source of truth for all visual tokens across every AETHER design prompt. Web-first (1440px) with dark-mode-first enterprise aesthetic. Copy this into your Stitch session first, or reference it when reviewing any individual page prompt for consistency.

---

## Design Philosophy

**Enterprise Terminal Grade** — The visual confidence of Bloomberg Terminal meets the design clarity of Linear, rendered in a deep navy dark palette with a single electric-blue brand accent. This is a wealth operating system, not a consumer budgeting app. Data density is a feature including visible math, precise numbers to the peso, and benchmark comparisons always present. The net worth number is the hero of every screen.

**References:** Bloomberg Terminal density × Robinhood Pro layout × Linear's precision × Financial Times editorial typography.

**What to avoid:** Pastel colors, illustration-heavy empty states, bottom navigation bars on desktop, rounded-corner "friendly" card grids, anything resembling a consumer budgeting or mobile weather app.

---

## 1. Color Palette (Dark-Mode-First)

### Primary Dark Theme (Default)

| Role | Hex | Usage |
|------|-----|-------|
| **Page Background** | `#0A0F1E` | Deep navy, near-black base — the canvas |
| **Surface / Card BG** | `#111827` | Card and panel backgrounds |
| **Surface Elevated** | `#1A2035` | Modals, dropdowns, hover states |
| **Surface Active** | `#1E293B` | Selected rows, active states |
| **Brand / Primary** | `#2D7FF9` | Electric blue — primary actions, links, key indicators |
| **Brand Muted** | `rgba(45,127,249,0.12)` | Blue tint backgrounds for tags, badges |
| **AI Accent** | `#F59E0B` | Amber — all AI advisor outputs, separates AI from user data |
| **AI Accent Muted** | `rgba(245,158,11,0.12)` | Amber tint for AI content backgrounds |
| **Gains / Positive** | `#00C896` | Cool green — gains, positive returns, confirmations |
| **Losses / Negative** | `#FF4D6A` | Muted red — losses, errors, destructive actions |
| **Neutral / Benchmark** | `#64748B` | Slate gray — benchmark lines, secondary data |
| **Warning** | `#FBBF24` | Amber-yellow — caution states, fee alerts |
| **Text Primary** | `#E2E8F0` | Headlines, body text — never pure white |
| **Text Secondary** | `#94A3B8` | Labels, captions, secondary info |
| **Text Muted** | `#475569` | Placeholders, disabled, timestamps |
| **Border Default** | `#1E293B` | 1px thin borders on cards, dividers |
| **Border Active** | `#334155` | Hover borders, focused inputs |
| **Border Emphasis** | `#2D7FF9` | Active tabs, focused states, selected items |

### Light Theme (Optional Secondary)

| Role | Hex | Usage |
|------|-----|-------|
| **Page Background** | `#F8FAFC` | Cool gray-white canvas |
| **Surface / Card BG** | `#FFFFFF` | Cards, panels |
| **Surface Elevated** | `#F1F5F9` | Secondary panels, input backgrounds |
| **Brand / Primary** | `#2563EB` | Slightly deeper blue for light backgrounds |
| **Text Primary** | `#0F172A` | Near-black headings and body |
| **Text Secondary** | `#64748B` | Labels, secondary info |
| **Border Default** | `#E2E8F0` | Thin subtle borders |
| **Gains** | `#059669` | Deeper green for light bg contrast |
| **Losses** | `#DC2626` | Deeper red for light bg |

---

## 2. Typography

**Three-level hierarchy only.** Large display figure → medium metric label → small supporting text. Nothing else.

| Role | Font | Weight | Size (Web 1440px) | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------------|-------------|----------------|-------|
| **Display / Net Worth Hero** | IBM Plex Mono | Bold (700) | 48–64px | 1.0 | -0.02em | THE number — always visible, always live |
| **H1 Page Title** | Inter | Bold (700) | 32px | 1.15 | -0.01em | |
| **H2 Section** | Inter | SemiBold (600) | 22px | 1.2 | -0.005em | |
| **H3 Subsection** | Inter | Medium (500) | 16px | 1.3 | 0 | |
| **Body** | Inter | Regular (400) | 14–15px | 1.6 | 0 | |
| **Body Bold** | Inter | SemiBold (600) | 14px | 1.6 | 0 | |
| **Caption / Label** | Inter | Medium (500) | 12px | 1.4 | 0.04em | Uppercase for section labels |
| **Financial Figures** | IBM Plex Mono | Medium (500) | 16px | 1.3 | 0 | ALL money values — must feel precise |
| **Large Financial** | IBM Plex Mono | Bold (700) | 28–40px | 1.1 | -0.01em | Portfolio values, key metrics |
| **Tabular Data** | IBM Plex Mono | Regular (400) | 13px | 1.3 | 0 | Table cells, matrix values |
| **Button Text** | Inter | SemiBold (600) | 14px | 1.0 | 0.01em | |
| **Overline / Tag** | Inter | Bold (700) | 11px | 1.0 | 0.06em | Uppercase section markers |
| **Code / Formula** | IBM Plex Mono | Medium (500) | 14px | 1.4 | 0 | Math formulas, variance equations |

---

## 3. Spacing Scale

```
4px  — micro (icon padding, tight inline gaps)
8px  — xs (tag padding, inline elements)
12px — sm (list item gaps, compact card padding)
16px — md (standard gap between elements)
20px — lg (card internal padding)
24px — xl (section gaps, column gutters)
32px — 2xl (section padding, panel margins)
48px — 3xl (major section separators)
64px — 4xl (page section spacing)
80px — 5xl (hero sections)
```

---

## 4. Border & Radius

### Borders — Thin and Precise
- **Card borders:** `1px solid #1E293B` — thin, structural, not decorative
- **Section dividers:** `1px solid #1E293B` — horizontal rules between sections
- **Active/focus borders:** `1px solid #2D7FF9` — electric blue for focus states
- **Data table borders:** `1px solid #1E293B` — gridlines for tables and matrices

### Border Radius
```
0px  — Data tables, terminal-style containers, primary action buttons
2px  — Input fields, data cells
4px  — Cards, panels, dropdowns
6px  — Modals, tooltips
8px  — Tags, badges, pills
```

**No large radius.** Nothing above 8px. No "friendly" rounded corners. Sharp = professional.

---

## 5. Elevation & Shadows

### Dark Theme (Primary)
```
Elevation 0:  #0A0F1E — base page
Elevation 1:  #111827 — cards, sidebar
Elevation 2:  #1A2035 — dropdowns, popovers
Elevation 3:  #1E293B — modals, overlays
```

Shadows are subtle — rely on background-color elevation, not drop shadows:
```
Shadow SM:  0 1px 3px rgba(0, 0, 0, 0.3)
Shadow MD:  0 4px 12px rgba(0, 0, 0, 0.4)
Shadow LG:  0 8px 24px rgba(0, 0, 0, 0.5)
```

### Light Theme
```
Shadow SM:  0 1px 2px rgba(15, 23, 42, 0.06)
Shadow MD:  0 4px 12px rgba(15, 23, 42, 0.08)
Shadow LG:  0 8px 24px rgba(15, 23, 42, 0.10)
```

---

## 6. Component Patterns (Web-First)

### Layout — Bloomberg/Robinhood Pro Pattern
- **Fixed left sidebar:** 240px wide, `#111827` background, 1px right border `#1E293B`
- **Main content area:** Fills remaining width, scrollable, dense but scannable
- **Collapsible right rail:** 320px, for contextual details (AI advisor, alerts, quick actions)
- **No card-grid aesthetic.** Use horizontal data rows with clear hierarchy instead.

### Cards
- **Web:** `1px solid #1E293B` border, `4px` radius, `#111827` background, `20px` padding
- **Hover:** Border `#334155`, subtle `translateY(-1px)`, Shadow SM
- **Active/Selected:** Border `#2D7FF9`, background `rgba(45,127,249,0.04)`

### Buttons
| Type | Style |
|------|-------|
| **Primary** | Background: `#2D7FF9`, Text: `#FFFFFF`, no border, `0px` radius, height `40px`, padding `0 20px` |
| **Secondary** | Background: transparent, Text: `#2D7FF9`, `1px solid #2D7FF9` border, `0px` radius |
| **Ghost** | Background: transparent, Text: `#94A3B8`, no border, hover: text `#E2E8F0` |
| **Destructive** | Background: `#FF4D6A`, Text: `#FFFFFF`, no border, `0px` radius |
| **AI Action** | Background: `rgba(245,158,11,0.12)`, Text: `#F59E0B`, `1px solid rgba(245,158,11,0.3)` |

### Left Sidebar Navigation (Web)
- Width: 240px, fixed position, full height
- Background: `#111827`, 1px right border `#1E293B`
- Logo: "AETHER" in Inter Bold 16px `#E2E8F0`, letter-spacing 0.08em, uppercase, top of sidebar
- Nav items: Inter Medium 14px, `#94A3B8`, 40px height, 12px left padding
- Active item: text `#E2E8F0`, left 2px border `#2D7FF9`, background `rgba(45,127,249,0.08)`
- Hover item: background `#1A2035`, text `#E2E8F0`
- Icons: Lucide, 18px, 1.5px stroke, left of label, 10px gap
- Sections: "MAIN", "ANALYSIS", "SETTINGS" as overline labels, Inter Bold 11px `#475569`
- Net worth always visible at bottom of sidebar: IBM Plex Mono Bold 18px `#E2E8F0`

### Data Tables
- Header row: `#1A2035` background, Inter SemiBold 12px `#94A3B8` uppercase
- Data rows: `#111827` background, 1px bottom border `#1E293B`
- Hover row: background `#1A2035` with subtle highlight
- Numbers: IBM Plex Mono Regular 13px `#E2E8F0`
- Positive values: `#00C896`, Negative: `#FF4D6A`

### Input Fields
- Height: 40px, background `#1A2035`, 1px border `#1E293B`, 2px radius
- Text: Inter Regular 14px `#E2E8F0`, placeholder `#475569`
- Focus: border `#2D7FF9`, subtle glow `0 0 0 3px rgba(45,127,249,0.15)`

---

## 7. Icon System

- **Style:** Lucide Icons — outlined, consistent 1.5px stroke
- **Sizes:** 14px (inline), 18px (nav, list items), 20px (actions), 24px (empty states)
- **Color:** Inherits text color; Brand blue `#2D7FF9` for active nav; Amber `#F59E0B` for AI; `#00C896`/`#FF4D6A` for gain/loss indicators

---

## 8. Chart & Data Visualization (Recharts / D3)

**Style: Minimal, high-contrast. No gradients on line charts — crisp lines only.**

| Element | Dark Theme | Light Theme |
|---------|-----------|-------------|
| **User portfolio line** | `#2D7FF9` electric blue, 2px solid | `#2563EB` |
| **PSEi benchmark line** | `#64748B` slate gray, 1px solid (always visible by default) | `#94A3B8` |
| **Secondary benchmark** | `#94A3B8` lighter gray, 1px dashed | `#CBD5E1` |
| **Gains area** | `#00C896` at 12% opacity | `#059669` at 10% |
| **Losses area** | `#FF4D6A` at 12% opacity | `#DC2626` at 10% |
| **AI projection line** | `#F59E0B` amber, 1px dashed | same |
| **Monte Carlo median** | `#2D7FF9` 2px solid | same |
| **Monte Carlo 50th band** | `#2D7FF9` at 15% opacity | same |
| **Monte Carlo 80th band** | `#2D7FF9` at 8% opacity | same |
| **Monte Carlo 95th band** | `#2D7FF9` at 4% opacity (translucent fan layers) | same |
| **Grid lines** | `#1E293B` 1px solid | `#E2E8F0` |
| **Axis labels** | `#64748B` IBM Plex Mono 11px | `#94A3B8` |
| **Value labels** | `#E2E8F0` IBM Plex Mono 12px | `#0F172A` |

**Key chart rules:**
- PSEi benchmark line ALWAYS visible in gray — comparisons always present
- No gradient fills on line charts — use flat translucent area fills only
- Monte Carlo fan charts use translucent layered bands — signals sophistication
- All axis values in IBM Plex Mono for precise number rendering
- Arrows (▲/▼) next to percentage changes, not color alone

---

## 9. Page Navigation Map

```
11 Email Registration Landing (Pre-Launch)
 └──→ 01 Landing Page (Product)
       └──→ 02 Onboarding & Auth
             └──→ 03 Dashboard (Net Worth + Allocation)  ← HOME
                   ├──→ 04 AI Advisor (Right Rail Panel)
                   ├──→ 05 Glass Box Predictive Engine
                   ├──→ 06 Sandbox Wealth Simulator         ← V1.1
                   ├──→ 07 Data Ingestion (CSV + Manual)
                   ├──→ 08 Fee Analyzer & Real Return
                   ├──→ 09 Performance History & Alerts     ← Alerts tab V1.1
                   └──→ 10 Settings & Profile
```

All inner pages (04–10) accessible from the Dashboard (03) via left sidebar navigation. The Dashboard is the central hub. The AI Advisor (04) is also accessible as a collapsible right-rail panel on any screen.

**MVP (Phase 1–3):** Screens 01–05, 07–10 (Performance tab only), 11.
**V1.1 (Phase 4):** Screen 06 (Sandbox Simulator), 09 Alerts tab.
**V2:** RAG-powered AI advisor, automated broker sync, mobile app.

---

## 10. Web-First Layout System (1440px Primary)

| Element | Web (1440px) | Tablet (768px) | Mobile (375px) |
|---------|-------------|----------------|----------------|
| **Layout** | Fixed left sidebar 240px + main content + optional right rail 320px | Collapsed sidebar (icon-only 64px) + main content | Full-width single column, hamburger menu |
| **Navigation** | Left sidebar with labels | Left sidebar icon-only | Top bar + hamburger drawer |
| **Content max-width** | Fluid within main area, sections max 960px | Full width minus sidebar | Full width, 16px margins |
| **Data tables** | Full horizontal data rows, dense | Scrollable horizontal if needed | Stacked cards instead of rows |
| **Charts** | 400–600px height, side-by-side when paired | Full width, stacked | Full width, 200px height |
| **Typography** | Web sizes (see above) | Scale down 10% | Mobile sizes |
| **Right rail** | 320px collapsible panel | Hidden, toggle button | Full-screen sheet |

---

## 11. Micro-Interactions

- **Net worth counter:** Animates on load — number counts up to current value (easing, 800ms)
- **Skeleton loaders:** Match exact shape and size of actual data — no generic pulsing blocks
- **Row hover:** Subtle `#1A2035` background highlight on data table rows
- **Toast notifications:** Slide in from top-right for pipeline ingestion results, sync status — NEVER modal popups
- **Tab transitions:** Instant content swap, no slide animations — Bloomberg-speed
- **Chart data points:** Tooltip on hover showing exact value + date in IBM Plex Mono
- **Loading states:** Thin progress bar at top of main content area (2px, `#2D7FF9`)
