# 04 — AI Advisor — AETHER (Dark Mode SaaS Edition)

> **Navigation:** Previous: [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (via sidebar or right-rail toggle) → Next: [05 Glass Box Engine](./05_GLASS_BOX_ENGINE.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 3 — AI Financial Advisor (Smart Prompting)

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the AI Advisor panel for "AETHER", a wealth management platform — displayed at 1440px desktop width. This is a conversational AI financial advisor that answers questions using the user's actual portfolio data, current Philippine market conditions (BSP rate, CPI, PSEi level), and their declared risk profile. It can appear as: (A) a collapsible right-rail panel (320px) overlaying the dashboard, or (B) a full-page view. Design BOTH states. Dark-mode SaaS aesthetic — glassmorphism cards, bento grid layout, violet accent palette, soft depth via backdrop blur and layered translucency.

---

### GLOBAL SETUP

Add the following to the document `<head>`:
- `<meta name="theme-color" content="#08080f">`
- Google Fonts link: Syne (600;700;800) and DM Sans (400;500;600;700). NEVER use Inter or IBM Plex Mono anywhere.

Add the following to the root `<html>` element:
- `color-scheme: dark;`

Add the following to the global stylesheet:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

NEVER use `transition: all`. Always specify individual properties, e.g. `transition: background-color 0.15s ease, border-color 0.15s ease;`.

All interactive elements must include `touch-action: manipulation;`.

Use `text-wrap: balance;` on all headings and paragraph blocks.

---

### BACKGROUND GLOW BLOBS

Behind all page content, on the `<body>` or a fixed full-screen `<div>` with `pointer-events: none; z-index: 0;`:

- **Blob 1 (top-left):** `width: 600px; height: 600px; background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%); position: fixed; top: -180px; left: -120px; filter: blur(80px);`
- **Blob 2 (bottom-right):** `width: 500px; height: 500px; background: radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%); position: fixed; bottom: -140px; right: -100px; filter: blur(80px);`
- Both blobs: `aria-hidden="true"` since they are purely decorative.

---

### FONT RULES (strict, no exceptions)

| Role | Family | Weight | Tracking |
|---|---|---|---|
| Brand / wordmark | Syne | 700–800 | 0.08em |
| Section labels / nav group headings | Syne | 700 | 0.06em |
| Headings (page titles, panel titles) | Syne | 600–700 | 0 |
| Body copy, nav items, labels, input text | DM Sans | 400–500 | 0 |
| All numeric values (currency, %, rates) | DM Sans | 600–700, `font-variant-numeric: tabular-nums;` | 0 |
| Inline tags, metadata, timestamps | DM Sans | 500 | 0 |
| Monospace-style data | DM Sans `tabular-nums` | 600 | 0 |

---

### COLOR TOKENS (dark mode only)

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#08080f` | Page background |
| `--bg-surface` | `#13131f` | Sidebar, fixed panels |
| `--bg-elevated` | `#1a1a2e` | Raised cards, data panels |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Dividers, inactive borders |
| `--border-glass` | `rgba(168,85,247,0.18)` | Glass card borders |
| `--accent-primary` | `#7c3aed` | Primary violet — active states, focus rings |
| `--accent-bright` | `#a855f7` | Brighter violet — highlights, hover, focus-visible outlines |
| `--accent-glow` | `rgba(124,58,237,0.08)` | Active nav bg, hover tints |
| `--amber` | `#fbbf24` | AI content accent — labels, icons, tags |
| `--green` | `#34d399` | Positive values, confidence |
| `--red` | `#f87171` | Negative values, warnings |
| `--text-primary` | `#f1f0ff` | Primary readable text |
| `--text-secondary` | `#9492b0` | Secondary labels, timestamps |
| `--text-muted` | `#4e4c6a` | Muted captions, placeholders, section labels |

---

### GLASSMORPHISM CARD RECIPE

Every card, panel, and data container in this screen uses the following base:

```css
.glass-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(168,85,247,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
}
```

---

### RADIUS MAP

| Old value | New value |
|---|---|
| `0px` | `8px` |
| `2px` | `8px` |
| `4px` | `16px` |

All cards, buttons, chips, modals, inputs: minimum `8px` radius. Panels and large containers: `16px`.

---

### ACCESSIBILITY REQUIREMENTS (every element)

- Every icon-only button MUST have `aria-label="<descriptive action>"`. Example: `aria-label="Expand to full page"`, `aria-label="Close panel"`, `aria-label="Send message"`.
- All decorative icons (beside labels) MUST have `aria-hidden="true"`.
- Focus-visible outline on all interactive elements: `outline: 2px solid #a855f7; outline-offset: 2px;` triggered via `:focus-visible` (not `:focus`).
- Glow blobs, decorative dividers: `aria-hidden="true"`.
- Use `role="status"` or `aria-live="polite"` on the AI response area so screen readers announce new messages.

---

**Overall Aesthetic:** Treat this like a premium dark SaaS advisor panel — NOT a chatbot bubble interface. Responses appear in a structured format: Answer → Data context → Portfolio basis → Confidence level. No chat bubbles. No rounded message containers with tails. Glassmorphism data cards. Context indicators as small inline tags showing what data the AI used. The amber accent `#fbbf24` dominates AI-authored content — this visually separates AI output from user data. Violet `#7c3aed` marks interactive/active states.

**Background:** `#08080f` page. Right rail panel: glassmorphism surface — `background: rgba(255,255,255,0.04); border-left: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px);`.

**Left Sidebar (fixed, 240px width, full height):**
`#13131f` bg, `border-right: 1px solid rgba(255,255,255,0.06);`.
- Top (24px padding): "AETHER" Syne Bold 16px `#f1f0ff`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 16px radius). Inactive: `#9492b0`, `transition: background-color 0.15s ease;`, hover bg `#1a1a2e`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.08)`.
  1. Home icon 18px + "Dashboard" DM Sans Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" Syne Bold 11px `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — **ACTIVE**. Amber dot 6px `#fbbf24` beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Syne Bold 9px `#4e4c6a`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Syne Bold 11px `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" Syne Bold 10px `#4e4c6a`, letter-spacing 0.06em. Below: "₱4,287,650" DM Sans Bold 18px `#f1f0ff` `font-variant-numeric: tabular-nums;`. Below: "▲ +3.06%" DM Sans Medium 12px `#34d399` `font-variant-numeric: tabular-nums;`.
- Note: In State A (right rail), sidebar shows Dashboard as active since the panel overlays dashboard content. In State B (full page), AI Advisor is active as shown above.
- All nav icons: `aria-hidden="true"` (the text label provides the accessible name).

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions. All nav icons `aria-hidden="true"`.
- Keep color behavior EXACTLY: active nav always violet (`#7c3aed` border/icon + `rgba(124,58,237,0.08)` bg), inactive `#9492b0`, hover `#1a1a2e`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then `1px` divider `rgba(255,255,255,0.06)`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius `16px` for cards/panels, `8px` for buttons/chips/inputs, `1px` borders using `rgba(255,255,255,0.06)` or `rgba(168,85,247,0.18)` for glass, Syne for headings/brand/section labels, DM Sans for body copy/nav items/numeric values (with `tabular-nums`). NEVER use Inter or IBM Plex Mono.
- Keep glassmorphism recipe EXACTLY on all card surfaces: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px;`.
- If any screen-specific styling conflicts with this lock, follow this lock.

---

### STATE A — Right Rail Panel (320px, overlaying dashboard)

**Panel Container:**
`width: 320px; position: fixed; right: 0; top: 0; bottom: 0; z-index: 40;`
`background: rgba(255,255,255,0.04); border-left: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`

**Panel Header (padding 16px, border-bottom: 1px solid rgba(255,255,255,0.06)):**
- Brain icon 18px `#fbbf24` `aria-hidden="true"` → "AI ADVISOR" Syne Bold 12px `#fbbf24`, letter-spacing 0.06em.
- Right: Maximize icon 16px `#4e4c6a` inside a button with `aria-label="Expand to full page"` `touch-action: manipulation;` → X close icon 16px `#4e4c6a` inside a button with `aria-label="Close AI advisor panel"` `touch-action: manipulation;`. Both buttons: `:focus-visible { outline: 2px solid #a855f7; outline-offset: 2px; }`.
- Below (8px gap): "Calibrated to: Moderate risk" DM Sans Regular 12px `#4e4c6a`. "Change" link `#7c3aed`, `:hover { color: #a855f7; }`, `:focus-visible { outline: 2px solid #a855f7; outline-offset: 2px; }`.

**Conversation Area (scrollable, padding 16px, flex-grow, `aria-live="polite"`):**

**AI Welcome Entry:**
- Horizontal rule: `1px solid rgba(255,255,255,0.06)` `aria-hidden="true"`. "Session started · Mar 10, 2026" centered DM Sans Regular 11px `#4e4c6a`, `text-wrap: balance;`. Horizontal rule `aria-hidden="true"`.
- 12px gap.
- "AETHER AI" label Syne Bold 11px `#fbbf24`. Timestamp "Just now" DM Sans Regular 11px `#4e4c6a`.
- 8px gap.
- Response text block (no bubble, no border — just text on dark bg):
  "Magandang araw. I answer using your actual portfolio, Philippine market data, and BSP/PSE context. Ask me anything about your wealth." DM Sans Regular 14px `#f1f0ff`, line-height 1.6, `text-wrap: balance;`.

**User Query:**
- 16px gap.
- "YOU" label Syne Bold 11px `#4e4c6a`.
- 8px gap.
- Query text: "Should I put more money into PSEi index funds right now?" DM Sans Regular 14px `#9492b0`, line-height 1.6.

**AI Structured Response:**
- 16px gap.
- "AETHER AI" label Syne Bold 11px `#fbbf24`.
- 8px gap.
- **Answer block:**
  "Based on the latest PSE data and BSP monetary policy:" DM Sans Regular 14px `#f1f0ff`, `text-wrap: balance;`.
  - 12px gap.
  - **Data panel** — glassmorphism card: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px;` padding 12px:
    - Horizontal data rows, `1px solid rgba(255,255,255,0.06)` dividers:
    - "PSEi 30-day" DM Sans Regular 12px `#9492b0` → "▲ +2.4%" DM Sans SemiBold 13px `#34d399` `font-variant-numeric: tabular-nums;`.
    - "BSP Key Rate" DM Sans Regular 12px `#9492b0` → "6.25%" DM Sans SemiBold 13px `#f1f0ff` `font-variant-numeric: tabular-nums;`.
    - "PH CPI (latest)" DM Sans Regular 12px `#9492b0` → "5.8% YoY" DM Sans SemiBold 13px `#f87171` `font-variant-numeric: tabular-nums;`.
  - 12px gap.
  - "The PSEi shows recovery momentum. With inflation above BSP target, real returns on equity may be compressed. For moderate risk, gradual peso-cost averaging recommended over lump-sum entry." DM Sans Regular 14px `#f1f0ff`, line-height 1.6, `text-wrap: balance;`.
  - 16px gap.
  - **Sources** — inline context tags, horizontal wrap, 6px gap between tags:
    - Each tag: glassmorphism chip — `background: rgba(251,191,36,0.10); border: 1px solid rgba(251,191,36,0.20); backdrop-filter: blur(8px); border-radius: 16px;` padding 2px 8px.
    - Briefcase icon 10px `#fbbf24` `aria-hidden="true"` → "Your Portfolio (12 holdings)" DM Sans Medium 11px `#fbbf24`.
    - "BSP Rate: 6.25%" same styling, `font-variant-numeric: tabular-nums;`.
    - "PH CPI: 5.8% YoY" same styling, `font-variant-numeric: tabular-nums;`.
  - 8px gap.
  - **Confidence:** CheckCircle icon 12px `#34d399` `aria-hidden="true"` → "Portfolio-aware · Market-current" DM Sans Regular 11px `#34d399`.
  - 4px gap.
  - **Disclaimer:** "Analysis only — not licensed financial advice" DM Sans Regular 10px `#4e4c6a`.

**Suggested Follow-ups (12px gap below response):**
Horizontal row, 6px gap:
- "Run Monte Carlo on PSEi" — glassmorphism chip: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(8px); border-radius: 16px;` padding 4px 10px. DM Sans Medium 12px `#fbbf24`. `touch-action: manipulation;` `:hover { background: rgba(124,58,237,0.08); border-color: rgba(168,85,247,0.30); }` `:focus-visible { outline: 2px solid #a855f7; outline-offset: 2px; }`. Taps → 05 Glass Box.
- "Compare with REIT returns" — same styling.

**Input Area (fixed bottom of panel, padding 12px 16px, border-top: 1px solid rgba(255,255,255,0.06), bg `#13131f`):**
- Rate limit: "18 of 20 queries today" DM Sans Regular 11px `#4e4c6a`, right-aligned above input, `font-variant-numeric: tabular-nums;`. Pro users see "92 of 100".
- Input: `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;` height 40px, padding 0 12px. DM Sans Regular 14px `#f1f0ff`. Placeholder: "Ask about your portfolio..." `#4e4c6a`. `:focus-visible { border-color: #fbbf24; outline: none; box-shadow: 0 0 0 2px rgba(251,191,36,0.20); }`.
- Right: Send icon 18px `#fbbf24` in a 36px square button `aria-label="Send message"` `touch-action: manipulation;`, `background: rgba(251,191,36,0.10); border-radius: 8px;` `:hover { background: rgba(251,191,36,0.18); }` `:focus-visible { outline: 2px solid #a855f7; outline-offset: 2px; }`.

---

### STATE B — Full Page View

Same sidebar as defined above, with "AI Advisor" (item 4) as **ACTIVE**.

**Main Content Area (max-width 720px centered, padding 32px):**
Same conversation layout as right rail but with more width and breathing room.
- Messages use full width (720px max).
- Data panels (glassmorphism cards) expand to full width.
- Source tags wrap naturally.
- Suggested follow-ups can have 3-4 items per row.
- All glassmorphism, color, font, and accessibility rules from State A carry over identically.

**Right side (optional, 280px) — Portfolio Context Panel:**
Glassmorphism card: `background: rgba(255,255,255,0.04); border: 1px solid rgba(168,85,247,0.18); backdrop-filter: blur(12px); border-radius: 16px;` padding 16px.
- "ACTIVE PORTFOLIO" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em.
- Summary: net worth (`DM Sans Bold, tabular-nums, #f1f0ff`), top 3 holdings, risk profile — compact data block with `1px solid rgba(255,255,255,0.06)` row dividers.
- This gives the AI additional context visibility to the user.

**Key Design Notes:**
- NO CHAT BUBBLES. Messages are structured text blocks. User queries in `#9492b0`, AI responses in `#f1f0ff`.
- Premium dark SaaS aesthetic: answer → data → context basis → confidence. Glass cards for data, not flat blocks.
- AI content uses amber `#fbbf24` accent — visually distinct from user data (which uses violet)
- Data panels inside responses: glassmorphism cards (`rgba(255,255,255,0.04)` bg + `rgba(168,85,247,0.18)` border + `backdrop-filter: blur(12px)` + `border-radius: 16px`) with structured rows — not free-form text
- Context indicators ALWAYS visible — shows what data the AI used to form its response (portfolio, BSP rate, CPI)
- Confidence level explicitly shown — transparency is the product
- Rate limit counter visible in input area — Free: 20/day, Pro: 100/day
- Input field focus uses amber border + glow — signaling AI interaction mode
- Disclaimer after every AI response: "Analysis only — not licensed financial advice" DM Sans Regular 10px `#4e4c6a`
- Glassmorphism depth, structured, dense — not playful, not conversational-UI
- Suggested follow-ups bridge to Glass Box (05) and Simulator (06)
- Every icon-only button has `aria-label`. Every decorative icon has `aria-hidden="true"`.
- All transitions specify individual properties — NEVER `transition: all`.
- All interactive elements use `touch-action: manipulation;`.
- `@media (prefers-reduced-motion: reduce)` is applied globally to disable animations.
- Headings and paragraph blocks use `text-wrap: balance;`.
- Background glow blobs are always rendered behind content with `aria-hidden="true"` and `pointer-events: none;`.
```
