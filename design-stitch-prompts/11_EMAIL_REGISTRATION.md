# 11 — Email Registration (Pre-Launch Landing Page) — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [10 Settings](./10_SETTINGS_PROFILE.md) → (Standalone page)
> **Purpose:** Pre-launch email capture page — collect emails before the product is live
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens, 01_LANDING_PAGE.md for brand voice
> **Context:** This is NOT the full landing page. This is a focused "Register Now" page with a single goal: capture email addresses so we can notify users when AETHER launches.

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design a pre-launch email registration page for "AETHER", a wealth management platform — displayed at 1440px desktop width. Single purpose: capture email addresses. Minimal, confident, enterprise. No feature tours, no lengthy copy — just trust, value prop, and an email field. Dark theme.

**Background:** `#0A0F1E`.

**Layout:** Single centered column, max-width 560px, vertically centered in viewport (min-height 100vh, flexbox center). Padding 32px horizontal.

---

**TOP BAR (fixed, full width, height 56px, bg `#0A0F1E` with 80% opacity + backdrop-blur 16px, z-50):**
- Left: "AETHER" Inter Bold 18px `#E2E8F0` tracking -0.02em. Dot separator `#2D7FF9`.
- Right: (empty — no nav links on this page)
- 1px bottom border `#1E293B`.

---

**HERO SECTION (centered, max-width 560px):**

**Badge (top):**
- Pill: `#1A2035` bg, 1px border `#1E293B`, 0px radius, padding 6px 14px.
- "🚀 Launching Soon" Inter Medium 13px `#F59E0B`.
- 24px gap below.

**Headline:**
- "Know your net worth," line 1
- "to the last peso." line 2
- Inter Bold 48px `#E2E8F0`, line-height 1.1, tracking -0.03em.
- 16px gap.

**Subheadline:**
- "AETHER is the intelligent wealth tracker built for Filipinos — AI-powered insights, Glass Box transparency, and real benchmarks against PSEi."
- Inter Regular 17px `#94A3B8`, line-height 1.6, max-width 480px.
- 32px gap.

---

**EMAIL CAPTURE FORM:**

**Input Row (horizontal, 8px gap):**
- Email input: `#111827` bg, 1px border `#1E293B`, 0px radius, height 48px, padding 0 16px, width flex-1.
  - Placeholder: "Enter your email" Inter Regular 15px `#475569`.
  - Focus: border `#2D7FF9`, no glow/shadow ring. Text input `#E2E8F0`.
  - Mail icon 16px `#475569` inside left (optional).
- Submit button: `#2D7FF9` bg, height 48px, padding 0 24px, 0px radius.
  - "Get Early Access" Inter SemiBold 15px `#FFFFFF`.
  - Hover: `#1D6FE8`. Active: scale(0.98).
  - Loading state: spinner replaces text, `#FFFFFF` 16px.

**Privacy note (8px below form):**
- Lock icon 12px `#475569` + "No spam. Unsubscribe anytime." Inter Regular 12px `#475569`.

---

**SUCCESS STATE (replaces form after submission):**
- CheckCircle icon 32px `#00C896`.
- "You're on the list." Inter SemiBold 20px `#E2E8F0`. 4px gap.
- "We'll notify you when AETHER launches. Check your inbox for confirmation." Inter Regular 14px `#94A3B8`.
- 16px gap.
- "Tell a friend →" Inter Medium 13px `#2D7FF9` — opens share/copy-link.

---

**SOCIAL PROOF (32px below form):**
- "Join 2,400+ Filipinos already on the waitlist" Inter Medium 13px `#64748B`.
- 8px gap.
- 5 overlapping avatar circles (32px each, -8px overlap), `#1A2035` bg with colored initials (`#2D7FF9`, `#00C896`, `#F59E0B`, `#FF4D6A`, `#94A3B8`), 2px border `#0A0F1E`. Plus "+2,395" pill `#1A2035` bg `#475569` text.

---

**FEATURE TEASER (40px below social proof, max-width 560px):**
Three feature pills, horizontal, 8px gap, centered:
- "AI Advisor" — Sparkles 14px `#F59E0B` + Inter Medium 13px `#94A3B8`, `#1A2035` bg, 1px border `#1E293B`, padding 8px 16px, 0px radius.
- "Glass Box Engine" — Eye 14px `#2D7FF9` + same style.
- "PSEi Benchmarks" — TrendingUp 14px `#00C896` + same style.

---

**FOOTER (40px below features):**
- "© 2026 AETHER · Built for Filipino investors" Inter Regular 12px `#475569`, centered.

---

**BACKGROUND EFFECTS (subtle, optional):**
- Very faint radial gradient: `#2D7FF9` at 3% opacity, centered behind hero, radius 600px. Creates subtle depth.
- No particles, no animations beyond form interactions.

**Key Design Notes:**
- This is a SINGLE-PURPOSE page — email capture only
- No navigation, no feature sections, no pricing — just trust and conversion
- Vertically centered content creates a "login page" feel — familiar and focused
- The waitlist number creates urgency and social proof
- Feature pills are just teasers — not clickable, just reinforcing what AETHER does
- Success state is immediate, inline — no modal, no redirect
- Mobile responsive: stack input + button vertically below 640px, headline 32px
- Amber badge + blue CTA creates visual hierarchy: attention → action
- Form validation: inline red border `#FF4D6A` + "Please enter a valid email" below input
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER pre-launch email registration page in LIGHT THEME at 1440px. Single centered column, max-width 560px.

**Background:** `#FFFFFF`.

**Top bar:** `#FFFFFF` with 80% opacity + blur. "AETHER" `#0F172A`. Border `#E2E8F0`.

**Badge:** `#F1F5F9` bg, `#E2E8F0` border. "Launching Soon" `#D97706`.

**Headline:** `#0F172A`. Subheadline: `#64748B`.

**Email input:** `#FFFFFF` bg, `#E2E8F0` border. Placeholder `#94A3B8`. Focus border `#2563EB`. Text `#0F172A`.
**Button:** `#2563EB` bg, `#FFFFFF` text. Hover `#1D4ED8`.

**Privacy note:** `#94A3B8`. Lock icon `#CBD5E1`.

**Success:** CheckCircle `#059669`. Title `#0F172A`. Description `#64748B`. Link `#2563EB`.

**Social proof:** Text `#94A3B8`. Avatars `#F1F5F9` bg, `#FFFFFF` border. Pill `#F1F5F9` bg, `#94A3B8` text.

**Feature pills:** `#F8FAFC` bg, `#E2E8F0` border. Icons: amber `#D97706`, blue `#2563EB`, green `#059669`. Text `#64748B`.

**Footer:** `#94A3B8`.

**Background effect:** Very faint radial `#2563EB` at 2% opacity.
```
