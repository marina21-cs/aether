# 12 — Navigation & App Chrome Consistency — AETHER (Dark Mode SaaS Edition)

> **Purpose:** Master prompt for Google AI Studio that defines the EXACT sidebar navigation, top-bar chrome, and layout shell shared by every authenticated app screen (03–10). Copy this prompt FIRST before generating any inner-app screen to guarantee pixel-identical navigation across Dashboard, Portfolio, Import Data, AI Advisor, Glass Box, Simulator, Fee Scanner, Performance, and Settings.
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Screens governed:** 03 Dashboard, 04 AI Advisor, 05 Glass Box, 06 Simulator, 07 Data Ingestion, 08 Fee Analyzer, 09 Performance, 10 Settings

---

## Prompt (copy below into Google AI Studio)

```
You are designing screens for "AETHER", a wealth management platform for Filipino investors — 1440px desktop width, dark mode only.

EVERY authenticated screen (Dashboard, Portfolio, Import Data, AI Advisor, Glass Box, Simulator, Fee Scanner, Performance, Settings) MUST use the EXACT same left sidebar navigation, page header shell, and background treatment defined below. Do NOT modify, reorder, rename, add, or remove any navigation items. This is the single source of truth for app chrome.

---

### HEAD REQUIREMENTS (non-negotiable, every page)

<meta name="theme-color" content="#08080f">
<html lang="en" style="color-scheme: dark;">

Google Fonts (load in <head>):
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

NEVER use Inter, Roboto, Arial, Helvetica, IBM Plex Mono, Space Grotesk, or system-ui as primary fonts.

---

### CSS VARIABLES (inject into :root on every page)

:root {
  /* Base */
  --bg-primary:    #08080f;
  --bg-secondary:  #0f0f1a;
  --bg-surface:    #13131f;
  --bg-elevated:   #1a1a2e;

  /* Accent — Purple / Violet */
  --accent-primary:   #7c3aed;
  --accent-bright:    #a855f7;
  --accent-glow:      #c084fc;
  --accent-subtle:    rgba(124, 58, 237, 0.15);

  /* Glass */
  --glass-bg:         rgba(255, 255, 255, 0.04);
  --glass-border:     rgba(168, 85, 247, 0.18);
  --glass-shadow:     0 8px 32px rgba(124, 58, 237, 0.12);

  /* Text */
  --text-primary:     #f1f0ff;
  --text-secondary:   #9492b0;
  --text-muted:       #4e4c6a;

  /* Feedback */
  --success:  #34d399;
  --warning:  #fbbf24;
  --error:    #f87171;

  /* Border */
  --border:           rgba(255, 255, 255, 0.06);
  --border-accent:    rgba(168, 85, 247, 0.3);

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
}

---

### GLOBAL RESET & MOTION

* { box-sizing: border-box; margin: 0; padding: 0; }
html { color-scheme: dark; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

NEVER use `transition: all` — always specify exact properties (e.g., `transition: background-color 150ms ease, transform 150ms ease`).

---

### BACKGROUND GLOW BLOBS (present on EVERY authenticated page)

Place immediately after <body> open. Both are purely decorative.

<div class="bg-glow bg-glow-1" aria-hidden="true"></div>
<div class="bg-glow bg-glow-2" aria-hidden="true"></div>

.bg-glow {
  position: fixed; border-radius: 50%; filter: blur(120px);
  pointer-events: none; z-index: 0;
}
.bg-glow-1 {
  width: 600px; height: 600px; top: -200px; left: -100px;
  background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
}
.bg-glow-2 {
  width: 500px; height: 500px; bottom: -140px; right: -100px;
  background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%);
}

---

### LEFT SIDEBAR — EXACT SPECIFICATION (fixed, 240px, full viewport height)

This sidebar is IDENTICAL on screens 03 through 10. The ONLY thing that changes per screen is which nav item has the ACTIVE state.

**Container:**
- Width: 240px, position: fixed, left: 0, top: 0, height: 100vh.
- Background: rgba(19,19,31,0.85).
- Border-right: 1px solid var(--glass-border).
- Backdrop-filter: blur(16px) saturate(1.4).
- -webkit-backdrop-filter: blur(16px) saturate(1.4).
- Box-shadow: 4px 0 24px rgba(124,58,237,0.06).
- Border-radius: 0 (flush to viewport edges).
- Display: flex, flex-direction: column.
- z-index: 50.

---

#### SIDEBAR TOP — Brand

- Padding: 24px.
- "AETHER" — Syne Bold (700), 16px, color var(--text-primary) #f1f0ff, letter-spacing: 0.08em, text-transform: uppercase.
- Optional: 28×28 logo icon (purple rounded-rect with arrow glyph) to the left of brand text, 10px gap.
- 32px gap below brand.

---

#### SIDEBAR SECTION: MAIN

Section label:
- "MAIN" — Syne Bold (700), 11px, color var(--text-muted) #4e4c6a, letter-spacing: 0.06em, text-transform: uppercase, padding: 0 16px.
- 8px gap below label.

Nav items (in this EXACT order):

1. **Dashboard** (Home icon) — Links to: 03_DASHBOARD_NET_WORTH
   - Lucide `Home` icon 18px + "Dashboard" DM Sans Medium (500) 14px.
   - This is the HOME screen of the app.

2. **Portfolio** (BarChart3 icon) — Links to: Portfolio detail/breakdown view
   - Lucide `BarChart3` icon 18px + "Portfolio" DM Sans Medium (500) 14px.
   - Shows detailed asset-by-asset breakdown, individual holdings, allocation percentages.

3. **Import Data** (Upload icon) — Links to: 07_DATA_INGESTION
   - Lucide `Upload` icon 18px + "Import Data" DM Sans Medium (500) 14px.
   - CSV upload, manual entry, broker connection for adding financial data.

24px gap after MAIN section.

---

#### SIDEBAR SECTION: ANALYSIS

Section label:
- "ANALYSIS" — Syne Bold (700), 11px, color var(--text-muted) #4e4c6a, letter-spacing: 0.06em, text-transform: uppercase, padding: 0 16px.
- 8px gap below label.

Nav items (in this EXACT order):

4. **AI Advisor** (Brain icon) — Links to: 04_AI_ADVISOR_CHAT
   - Lucide `Brain` icon 18px + "AI Advisor" DM Sans Medium (500) 14px.
   - Amber notification dot: 6px circle, color var(--warning) #fbbf24, positioned beside label text, aria-hidden="true".
   - Conversational AI financial advisor using user's real portfolio data + PH market context.

5. **Glass Box** (Eye icon) — Links to: 05_GLASS_BOX_ENGINE
   - Lucide `Eye` icon 18px + "Glass Box" DM Sans Medium (500) 14px.
   - Transparent ML predictions — covariance matrix, Monte Carlo, confidence intervals. Full math visible.

6. **Simulator** (FlaskConical icon) — Links to: 06_SANDBOX_SIMULATOR
   - Lucide `FlaskConical` icon 18px + "Simulator" DM Sans Medium (500) 14px.
   - "V1.1" version tag: Syne Bold (700), 9px, color var(--text-muted) #4e4c6a, background: none, positioned right of label.
   - What-If sandbox environment — hypothetical scenarios, projected net worth over 10–30 years. Isolated from real data.

7. **Fee Scanner** (AlertTriangle icon) — Links to: 08_FEE_ANALYZER_REAL_RETURN
   - Lucide `AlertTriangle` icon 18px + "Fee Scanner" DM Sans Medium (500) 14px.
   - Hidden fee detection, debt analyzer, real-return calculator (after inflation, fees, taxes).

8. **Performance** (TrendingUp icon) — Links to: 09_PERFORMANCE_HISTORY
   - Lucide `TrendingUp` icon 18px + "Performance" DM Sans Medium (500) 14px.
   - Historical net worth chart with PSEi benchmark overlay, monthly breakdown table, and alert management (V1.1).

24px gap after ANALYSIS section.

---

#### SIDEBAR SECTION: SETTINGS

Section label:
- "SETTINGS" — Syne Bold (700), 11px, color var(--text-muted) #4e4c6a, letter-spacing: 0.06em, text-transform: uppercase, padding: 0 16px.
- 8px gap below label.

9. **Settings** (Settings icon) — Links to: 10_SETTINGS_PROFILE
   - Lucide `Settings` icon 18px + "Settings" DM Sans Medium (500) 14px.
   - Profile, risk profile, currency preference, notification preferences, connected accounts, data export, security.

---

#### SIDEBAR BOTTOM — Net Worth Ticker (always visible)

- Pinned to bottom of sidebar, padding: 16px.
- "NET WORTH" — Syne Bold (700), 10px, color var(--text-muted) #4e4c6a, letter-spacing: 0.06em, text-transform: uppercase.
- Value: "₱4,287,650" — DM Sans Bold (700), 18px, color var(--text-primary) #f1f0ff, font-variant-numeric: tabular-nums.
- Change: "▲ +3.06%" — DM Sans Medium (500), 12px, color var(--success) #34d399, font-variant-numeric: tabular-nums.
- If negative: "▼ -2.10%" uses color var(--error) #f87171.
- The net worth number is a LIVE summary — always matches the user's current total.

---

#### NAV ITEM STYLING (all 9 items)

Each nav item container:
- Height: 40px.
- Padding: 0 12px.
- Border-radius: 8px.
- Display: flex, align-items: center.
- Gap: 10px (between icon and label).
- Cursor: pointer.
- touch-action: manipulation.
- Transition: background-color 150ms ease, color 150ms ease.

**Inactive state:**
- Icon color: var(--text-secondary) #9492b0.
- Label color: var(--text-secondary) #9492b0.
- Background: transparent.

**Hover state:**
- Background: var(--bg-elevated) #1a1a2e.
- Icon color: var(--text-primary) #f1f0ff.
- Label color: var(--text-primary) #f1f0ff.

**Active state (current page):**
- Left border: 2px solid var(--accent-primary) #7c3aed.
- Background: rgba(124, 58, 237, 0.08).
- Icon color: var(--accent-primary) #7c3aed.
- Label color: var(--text-primary) #f1f0ff.
- Font-weight stays Medium 500 (do NOT bold the active item differently).

**Focus-visible state:**
- Outline: 2px solid var(--accent-bright) #a855f7.
- Outline-offset: 2px.

**Icon rules:**
- All icons: Lucide icon set, 18px size, 1.5px stroke-width.
- All decorative icons: aria-hidden="true".
- All nav items: aria-label describing the destination (e.g., aria-label="Dashboard").
- NEVER substitute icon names — use the EXACT Lucide icons specified above.

**Color behavior:**
- Active nav is ALWAYS purple (var(--accent-primary) #7c3aed) regardless of feature.
- Do NOT recolor active nav to match feature accent (e.g., green for Simulator, amber for AI Advisor). Active is always purple.

---

### PAGE HEADER SHELL (inside main content area, identical structure on every page)

Main content starts at left: 240px (sidebar width), with padding: 32px.

**Row 1 — Title:**
- Left: "[Page Name]" Syne Bold (700), 24px, color var(--text-primary) #f1f0ff, text-wrap: balance.
- Optional left icon: 20px, color var(--accent-primary) #7c3aed, aria-hidden="true", 8px gap before title text.
- Right: Optional action link or button (e.g., "Export", "Edit assumptions") — DM Sans Medium (500), 13px, color var(--accent-bright) #a855f7, hover: color var(--accent-glow) #c084fc.

**Row 2 — Metadata (8px below title):**
- Contextual subtitle — DM Sans Regular (400), 13px, color var(--text-muted) #4e4c6a.
- Numeric values in metadata use font-variant-numeric: tabular-nums.

**Divider (16px below metadata):**
- 1px solid var(--border) rgba(255,255,255,0.06), full width of main content.
- 24px gap below divider before content blocks begin.

---

### GLASSMORPHISM CARD (used for ALL panels, cards, data blocks)

.glass-card {
  background: var(--glass-bg);               /* rgba(255,255,255,0.04) */
  border: 1px solid var(--glass-border);      /* rgba(168,85,247,0.18) */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--glass-shadow);            /* 0 8px 32px rgba(124,58,237,0.12) */
  border-radius: 16px;
  padding: 20px;
}

Alternative higher-opacity cards for data-dense sections:
.glass-card-solid {
  background: rgba(19,19,31,0.6);
  backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid var(--border);            /* rgba(255,255,255,0.06) */
  border-radius: 16px;
  padding: 20px;
}

---

### BORDER RADIUS RULES

- Cards, panels, modals: 16px
- Buttons, inputs, chips, nav items: 8px
- Tags, badges, pills: 12px
- Full-pill shapes (section tags, badges): 999px

---

### TYPOGRAPHY RULES

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Brand / wordmark | Syne | Bold 700 | letter-spacing 0.08em, uppercase |
| Page titles | Syne | Bold 700 | 24px, text-wrap: balance |
| Section labels (sidebar groups) | Syne | Bold 700 | 11px, uppercase, letter-spacing 0.06em |
| Nav labels | DM Sans | Medium 500 | 14px |
| Body text | DM Sans | Regular 400 | 1rem, line-height 1.7 |
| All financial numbers | DM Sans | Bold/Medium | font-variant-numeric: tabular-nums ALWAYS |
| Button text | DM Sans | Medium 500 | 0.875rem |
| Overline tags | DM Sans | Medium 500 | 0.75rem, uppercase, letter-spacing 0.1em |

NEVER use Inter or IBM Plex Mono. If you catch yourself typing Inter or IBM Plex Mono, replace with Syne (headings) or DM Sans (body/numbers).

---

### ACTIVE STATE MAP — Which nav item is active on each screen

| Screen | Active Nav Item (#) | Active Label |
|--------|-------------------|--------------|
| 03 Dashboard & Net Worth | 1 | Dashboard |
| Portfolio Detail | 2 | Portfolio |
| 07 Data Ingestion | 3 | Import Data |
| 04 AI Advisor Chat | 4 | AI Advisor |
| 05 Glass Box Engine | 5 | Glass Box |
| 06 Sandbox Simulator | 6 | Simulator |
| 08 Fee Analyzer & Real Return | 7 | Fee Scanner |
| 09 Performance History & Alerts | 8 | Performance |
| 10 Settings & Profile | 9 | Settings |

When generating any screen, set ONLY the corresponding nav item to active. All other 8 items remain inactive.

---

### ACCESSIBILITY CHECKLIST (enforced on every screen)

- [x] <html lang="en" style="color-scheme: dark;">
- [x] <meta name="theme-color" content="#08080f">
- [x] Every icon button has aria-label
- [x] All decorative SVGs/icons have aria-hidden="true"
- [x] focus-visible on all interactive elements — outline: 2px solid #a855f7, outline-offset: 2px
- [x] Semantic HTML: <button> for actions, <a> for navigation, never <div onClick>
- [x] Heading hierarchy: single h1 per page
- [x] @media (prefers-reduced-motion: reduce) disables all transitions/animations
- [x] NEVER transition: all — only specific properties
- [x] touch-action: manipulation on all buttons and interactive controls
- [x] text-wrap: balance on all headings
- [x] font-variant-numeric: tabular-nums on ALL financial figures
- [x] min-width: 0 on flex children containing text
- [x] Background glow blobs present with pointer-events: none and aria-hidden="true"

---

### HOW TO USE THIS PROMPT

1. Paste this entire prompt into Google AI Studio FIRST.
2. Then add a second message specifying WHICH SCREEN to generate (e.g., "Now design the Dashboard screen — nav item 1 (Dashboard) is ACTIVE").
3. The AI will produce a screen with the EXACT same sidebar, page header, background, and tokens — only the main content area changes.
4. For screen-specific content, refer to the individual prompt files:
   - 03_DASHBOARD_NET_WORTH.md → Dashboard home (nav 1 active)
   - 04_AI_ADVISOR_CHAT.md → AI Advisor (nav 4 active)
   - 05_GLASS_BOX_ENGINE.md → Glass Box (nav 5 active)
   - 06_SANDBOX_SIMULATOR.md → Simulator (nav 6 active)
   - 07_DATA_INGESTION.md → Import Data (nav 3 active)
   - 08_FEE_ANALYZER_REAL_RETURN.md → Fee Scanner (nav 7 active)
   - 09_PERFORMANCE_HISTORY.md → Performance (nav 8 active)
   - 10_SETTINGS_PROFILE.md → Settings (nav 9 active)

---

### KEY DESIGN RULES SUMMARY

- Sidebar is 240px fixed left, glassmorphism, NEVER changes layout
- 9 nav items in 3 groups (MAIN: 3, ANALYSIS: 5, SETTINGS: 1) — NEVER add/remove/reorder
- Active state is ALWAYS purple #7c3aed — never feature-colored
- Net worth ticker pinned to sidebar bottom — always visible, always live
- All cards are glassmorphism panels (blur + translucent bg + subtle violet border)
- Background #08080f with two fixed glow blobs (purple radial gradients)
- Fonts: Syne for headings/brand/nav-groups, DM Sans for everything else
- All numbers: DM Sans with font-variant-numeric: tabular-nums
- Border-radius: 16px cards, 8px buttons/inputs, 12px tags, 999px pills
- No Inter. No IBM Plex Mono. No light theme. No pastel. No friendly consumer UI.
```
