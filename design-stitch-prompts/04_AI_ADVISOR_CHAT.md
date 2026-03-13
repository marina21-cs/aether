# 04 — AI Advisor — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [03 Dashboard](./03_DASHBOARD_NET_WORTH.md) (via sidebar or right-rail toggle) → Next: [05 Glass Box Engine](./05_GLASS_BOX_ENGINE.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Feature covered:** Feature 3 — AI Financial Advisor (Smart Prompting)

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the AI Advisor panel for "AETHER", a wealth management platform — displayed at 1440px desktop width. This is a conversational AI financial advisor that answers questions using the user's actual portfolio data, current Philippine market conditions (BSP rate, CPI, PSEi level), and their declared risk profile. It can appear as: (A) a collapsible right-rail panel (320px) overlaying the dashboard, or (B) a full-page view. Design BOTH states. Enterprise terminal-grade aesthetic.

**Overall Aesthetic:** Treat this like a Bloomberg terminal chat — NOT a chatbot bubble interface. Responses appear in a structured format: Answer → Data context → Portfolio basis → Confidence level. No chat bubbles. No rounded message containers. Monochrome input field. Context indicators as small inline tags showing what data the AI used. The amber accent `#F59E0B` dominates — this visually separates AI content from user data.

**Background:** `#0A0F1E` page. Right rail panel: `#111827` bg, 1px left border `#1E293B`.

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
  4. Brain icon + "AI Advisor" — **ACTIVE**. Amber dot 6px beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Inter Bold 9px `#475569`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Inter Bold 11px `#475569`. 8px gap.
  9. Settings icon + "Settings" — inactive.
- Bottom (padding 16px): "NET WORTH" Inter Bold 10px `#475569`, letter-spacing 0.06em. Below: "₱4,287,650" IBM Plex Mono Bold 18px `#E2E8F0`. Below: "▲ +3.06%" IBM Plex Mono Medium 12px `#00C896`.
- Note: In State A (right rail), sidebar shows Dashboard as active since the panel overlays dashboard content. In State B (full page), AI Advisor is active as shown above.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always blue (`#2D7FF9` border/icon + `rgba(45,127,249,0.08)` bg), inactive `#94A3B8`, hover `#1A2035`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `#1E293B`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 4px for cards/buttons/chips, 1px borders, Inter for UI copy, IBM Plex Mono for all numeric values.
- If any screen-specific styling conflicts with this lock, follow this lock.

---

### STATE A — Right Rail Panel (320px, overlaying dashboard)

**Panel Header (padding 16px, 1px bottom border `#1E293B`):**
- Brain icon 18px `#F59E0B` → "AI ADVISOR" Inter Bold 12px `#F59E0B`, letter-spacing 0.06em.
- Right: Maximize icon 16px `#64748B` (expands to full page) → X close icon 16px `#64748B`.
- Below (8px gap): "Calibrated to: Moderate risk" Inter Regular 12px `#475569`. "Change" link `#2D7FF9`.

**Conversation Area (scrollable, padding 16px, flex-grow):**

**AI Welcome Entry:**
- Horizontal rule: 1px `#1E293B`. "Session started · Mar 10, 2026" centered Inter Regular 11px `#475569`. Horizontal rule.
- 12px gap.
- "AETHER AI" label Inter Bold 11px `#F59E0B`. Timestamp "Just now" `#475569`.
- 8px gap.
- Response text block (no bubble, no border — just text on dark bg):
  "Magandang araw. I answer using your actual portfolio, Philippine market data, and BSP/PSE context. Ask me anything about your wealth." Inter Regular 14px `#E2E8F0`, line-height 1.6.

**User Query:**
- 16px gap.
- "YOU" label Inter Bold 11px `#64748B`.
- 8px gap.
- Query text: "Should I put more money into PSEi index funds right now?" Inter Regular 14px `#94A3B8`, line-height 1.6.

**AI Structured Response:**
- 16px gap.
- "AETHER AI" label `#F59E0B`.
- 8px gap.
- **Answer block:**
  "Based on the latest PSE data and BSP monetary policy:" Inter Regular 14px `#E2E8F0`.
  - 12px gap.
  - **Data panel** — `#1A2035` bg, 1px border `#1E293B`, 2px radius, padding 12px:
    - Horizontal data rows, 1px `#1E293B` dividers:
    - "PSEi 30-day" Inter Regular 12px `#94A3B8` → "▲ +2.4%" IBM Plex Mono SemiBold 13px `#00C896`.
    - "BSP Key Rate" → "6.25%" IBM Plex Mono `#E2E8F0`.
    - "PH CPI (latest)" → "5.8% YoY" IBM Plex Mono `#FF4D6A`.
  - 12px gap.
  - "The PSEi shows recovery momentum. With inflation above BSP target, real returns on equity may be compressed. For moderate risk, gradual peso-cost averaging recommended over lump-sum entry." Inter Regular 14px `#E2E8F0`, line-height 1.6.
  - 16px gap.
  - **Sources** — inline context tags, horizontal wrap:
    - Each tag: `rgba(245,158,11,0.12)` bg, 1px border `rgba(245,158,11,0.2)`, 4px radius, padding 2px 8px.
    - Briefcase icon 10px `#F59E0B` → "Your Portfolio (12 holdings)" Inter Medium 11px `#F59E0B`.
    - "BSP Rate: 6.25%" same styling.
    - "PH CPI: 5.8% YoY" same styling.
    - 6px gap between tags.
  - 8px gap.
  - **Confidence:** CheckCircle icon 12px `#00C896` → "Portfolio-aware · Market-current" Inter Regular 11px `#00C896`.

**Suggested Follow-ups (12px gap below response):**
Horizontal row, 6px gap:
- "Run Monte Carlo on PSEi" — `#1A2035` bg, 1px border `#1E293B`, 4px radius, padding 4px 10px. Inter Medium 12px `#F59E0B`. Taps → 05 Glass Box.
- "Compare with REIT returns" — same.

**Input Area (fixed bottom of panel, padding 12px 16px, 1px top border `#1E293B`, bg `#111827`):**
- Rate limit: "18 of 20 queries today" Inter Regular 11px `#475569`, right-aligned above input. Pro users see "92 of 100".
- Input: `#1A2035` bg, 1px border `#1E293B`, 2px radius, height 40px, padding 0 12px. Inter Regular 14px `#E2E8F0`. Placeholder: "Ask about your portfolio..." `#475569`. Focus: border `#F59E0B`.
- Right: Send icon 18px `#F59E0B` in a 36px square button, `rgba(245,158,11,0.12)` bg, 4px radius.

---

### STATE B — Full Page View

Same sidebar as defined above, with "AI Advisor" (item 4) as **ACTIVE**.

**Main Content Area (max-width 720px centered, padding 32px):**
Same conversation layout as right rail but with more width and breathing room.
- Messages use full width (720px max).
- Data panels expand to full width.
- Source tags wrap naturally.
- Suggested follow-ups can have 3-4 items per row.

**Right side (optional, 280px):**
A static "Portfolio Context" panel:
- "ACTIVE PORTFOLIO" Inter Bold 11px `#64748B`.
- Summary: net worth, top 3 holdings, risk profile — compact data block.
- This gives the AI additional context visibility to the user.

**Key Design Notes:**
- NO CHAT BUBBLES. Messages are structured text blocks. User queries in `#94A3B8`, AI responses in `#E2E8F0`.
- Bloomberg terminal chat aesthetic: answer → data → context basis → confidence
- AI content uses amber `#F59E0B` accent — visually distinct from user data (which uses blue)
- Data panels inside responses: `#1A2035` bg with structured rows — not free-form text
- Context indicators ALWAYS visible — shows what data the AI used to form its response (portfolio, BSP rate, CPI)
- Confidence level explicitly shown — transparency is the product
- Rate limit counter visible in input area — Free: 20/day, Pro: 100/day
- Input field focus uses amber border — signaling AI interaction mode
- Disclaimer after every AI response: "Analysis only — not licensed financial advice" Inter Regular 10px `#475569`
- Monochrome, structured, dense — not playful, not conversational-UI
- Suggested follow-ups bridge to Glass Box (05) and Simulator (06)
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER AI Advisor in LIGHT THEME at 1440px.

**Right Rail Panel:** `#FFFFFF` bg, 1px left border `#E2E8F0`.
Header: brain icon `#F59E0B`. "AI ADVISOR" `#F59E0B`. Controls `#94A3B8`.

**Messages:**
- "AETHER AI" label `#F59E0B`. Response text `#0F172A`.
- "YOU" label `#94A3B8`. Query text `#64748B`.
- Data panels: `#F1F5F9` bg, 1px border `#E2E8F0`. Labels `#64748B`. Values: green `#059669`, red `#DC2626`, neutral `#0F172A`.
- Source tags: `rgba(245,158,11,0.08)` bg, 1px border `rgba(245,158,11,0.2)`. Text `#D97706` (darker amber for light bg).
- Confidence: `#059669` text and icon.
- Suggested follow-ups: `#FFFFFF` bg, 1px border `#E2E8F0`. Text `#D97706`.

**Input:** `#F1F5F9` bg, 1px border `#E2E8F0`, text `#0F172A`, placeholder `#94A3B8`. Focus: border `#F59E0B`. Send: `rgba(245,158,11,0.12)` bg, icon `#F59E0B`.

**Full Page:** Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; active item remains "AI Advisor". Light colors only: `#FFFFFF` sidebar bg, 1px right border `#E2E8F0`, inactive labels `#64748B`, active state `#0F172A` text + icon `#2563EB` + left border `#2563EB` + bg `rgba(37,99,235,0.06)`. Content `#F8FAFC` bg. Portfolio context panel `#FFFFFF` bg.

**Light Theme Notes:**
- Amber accent remains `#F59E0B` / `#D97706` for AI — consistent across themes
- Data density identical — same structured format
- Messages as text blocks not bubbles — same in both themes
```
