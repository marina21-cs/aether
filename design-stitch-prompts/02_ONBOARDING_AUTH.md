# 02 — Onboarding & Auth — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [01 Landing Page](./01_LANDING_PAGE.md) → Next: [03 Dashboard](./03_DASHBOARD_NET_WORTH.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Platform:** Web-first (1440px), dark-mode-first.
> **Screens covered:** Sign Up, Login, Risk Profile, Currency Selection, Welcome

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design a premium web onboarding flow for "AETHER", a wealth management platform for Filipino investors — displayed at 1440px desktop width. This is a MULTI-STEP flow shown as 4 connected screens. The user arrives here after clicking "Get Early Access" on the Landing Page.

**Overall Aesthetic:** Enterprise terminal-grade. The onboarding feels like configuring a Bloomberg terminal for the first time — structured, precise, efficient. No playful illustrations, no confetti, no gamified elements. A clean data-entry form on a dark enterprise canvas. The form area is centered and narrow (max-width 480px) with the deep navy background filling the rest — creating focus.

**Background & Canvas:** Deep navy-black `#0A0F1E`. The form area is centered vertically and horizontally on the page.

---

**SCREEN 1 — SIGN UP**

**Left Half (720px):**
A branded panel. Background `#111827`, full height, with a very subtle gradient: `#0A0F1E` at top to `#111827` at bottom.
- Center-vertically: "AETHER" in Inter Bold 24px `#E2E8F0`, letter-spacing 0.08em. Below (12px gap): "Your net worth, to the peso." in Inter Regular 18px `#64748B`.
- Below (48px gap): A vertical stack of 3 trust signals:
  - Lock icon 18px `#00C896` → "AES-256 encrypted" Inter Medium 14px `#94A3B8`.
  - Shield icon 18px `#00C896` → "Read-only access to brokerages" Inter Medium 14px `#94A3B8`.
  - Eye icon 18px `#00C896` → "You control your data" Inter Medium 14px `#94A3B8`.
  Each signal: 12px gap between icon and text, 16px gap between signals.

**Right Half (720px):**
Background `#0A0F1E`. Centered content, max-width 400px.
- Top (64px from top): "Create your account" Inter Bold 28px `#E2E8F0`.
- 8px gap.
- "Free forever. No credit card needed." Inter Regular 14px `#64748B`.
- 32px gap.

**Form Fields (stacked, 16px gap):**
Each field:
- Label: Inter Medium 12px `#94A3B8`, letter-spacing 0.04em, uppercase. 6px below label.
- Input: height 44px, `#1A2035` bg, 1px border `#1E293B`, 2px radius, padding 0 16px. Text: Inter Regular 14px `#E2E8F0`. Placeholder: `#475569`.
- Focus: border `#2D7FF9`, glow `0 0 0 3px rgba(45,127,249,0.15)`.

Fields:
1. "FULL NAME" — placeholder "Juan dela Cruz"
2. "EMAIL ADDRESS" — placeholder "juan@email.com"
3. "PASSWORD" — placeholder "Minimum 8 characters" — visibility toggle eye icon 18px `#64748B` right-inside.

- 24px gap.
- Primary CTA: "Create account" — `#2D7FF9` bg, `#FFFFFF` text, Inter SemiBold 14px, height 44px, full width (400px), 0px radius.
- 16px gap.
- Divider: 1px line `#1E293B` with "or" centered in Inter Regular 12px `#475569`, bg `#0A0F1E` behind text.
- 16px gap.
- Google: "Continue with Google" — `#1A2035` bg, 1px border `#1E293B`, height 44px, full width, 0px radius. Google "G" icon 18px left. Text: Inter Medium 14px `#E2E8F0`.
- 24px gap.
- Legal: "By creating an account, you agree to our Terms of Service and Privacy Policy." Inter Regular 12px `#475569`. Links underlined `#2D7FF9`.
- Bottom: "Already have an account? Sign in" Inter Regular 14px `#64748B`, "Sign in" in `#2D7FF9`.

---

**SCREEN 2 — RISK PROFILE SELECTION**

Same split layout. Left panel unchanged.

**Right Half Content (max-width 400px centered):**
- Progress: 3-step horizontal dots at top — dot 1 filled `#2D7FF9`, dot 2 outlined `#334155`, dot 3 outlined. Connected by 1px lines `#1E293B`. "Step 1 of 3" Inter Regular 12px `#64748B` below.
- 24px gap.
- "How do you handle risk?" Inter Bold 28px `#E2E8F0`.
- 8px gap.
- "Calibrates your AI advisor recommendations. Changeable anytime." Inter Regular 14px `#64748B`.
- 32px gap.

**Risk Cards (stacked, 12px gap):**
Each: `#111827` bg, 1px border `#1E293B`, 4px radius, 16px padding, full width. Click to select.

Card 1 — Conservative:
- Left: Shield icon 20px `#00C896`. 12px gap.
- Right: "Conservative" Inter SemiBold 16px `#E2E8F0`. Below: "Preserve capital. Bonds, time deposits, low volatility." Inter Regular 13px `#94A3B8`.
- Selected state: border `#2D7FF9`, bg `rgba(45,127,249,0.06)`, checkmark icon 18px `#2D7FF9` top-right.

Card 2 — Moderate:
- Scale icon 20px `#2D7FF9`. "Moderate" — "Balanced growth. Mixed equities and fixed income."
- Selected state: same blue treatment.

Card 3 — Aggressive:
- TrendingUp icon 20px `#F59E0B`. "Aggressive" — "Maximize growth. High equity allocation. Comfortable with drawdowns."
- Selected state: same.

- 32px gap.
- "Continue" — full width, `#2D7FF9` bg. Disabled if nothing selected: `#1A2035` bg, `#475569` text.
- 12px gap.
- "Skip for now" ghost link, Inter Medium 14px `#475569`.

---

**SCREEN 3 — BASE CURRENCY SELECTION**

Same layout. Progress: dots 1-2 filled, dot 3 outlined. "Step 2 of 3."

- "What's your base currency?" Inter Bold 28px `#E2E8F0`.
- "All assets converted to this for display. PHP recommended for PH investors." Inter Regular 14px `#64748B`.
- 32px gap.

**Currency Options (stacked, 8px gap):**
Each: `#111827` bg, 1px border `#1E293B`, 4px radius, height 48px, padding 0 16px. Full width.
- Left: Currency code "PHP" Inter SemiBold 14px `#E2E8F0`. 8px gap. "Philippine Peso" Inter Regular 14px `#94A3B8`.
- Right: Radio circle 18px, 1px border `#334155`. Selected: filled `#2D7FF9`.

Options: PHP (pre-selected, border `#2D7FF9`), USD, SGD, HKD.

- 32px gap.
- "Finish setup" — full width, `#2D7FF9` bg.

---

**SCREEN 4 — WELCOME / FIRST-TIME DASHBOARD HINT**

All 3 progress dots filled. The background transitions to show the actual dashboard blurred at `blur(12px)` with `rgba(10,15,30,0.7)` overlay.

**Center modal (max-width 480px, centered):**
`#111827` bg, 1px border `#1E293B`, 4px radius, padding 32px.
- Top: Sparkles icon 24px `#2D7FF9`, centered.
- 16px gap.
- "Welcome to AETHER." Inter Bold 24px `#E2E8F0`, centered.
- 12px gap.
- "Connect your first account or add assets manually. Your financial co-pilot is ready." Inter Regular 15px `#94A3B8`, centered, line-height 1.6. Max-width 360px.
- 32px gap.
- Primary: "Connect an account" — `#2D7FF9` bg, full width.
- 12px gap.
- Secondary: "Add manually" — transparent, 1px border `#2D7FF9`, text `#2D7FF9`.
- 12px gap.
- Ghost: "Skip for now" Inter Medium 14px `#475569`, centered.

**Key Design Notes:**
- Split-screen layout: branded panel left, form right — enterprise auth pattern (Linear, Vercel)
- Dark canvas `#0A0F1E` with `#111827` surfaces — no pastel, no white
- Form area narrow (400px max) for focused data entry — generous dark space around it
- Progress indicator: horizontal dots, not a progress bar — cleaner
- Risk cards use single-select with blue highlight — no multi-color
- All inputs 44px height, 2px radius — sharp, professional
- Error states: border `#FF4D6A`, error text below in Inter Regular 12px `#FF4D6A`
- No illustrations, no mascots, no playful elements — enterprise trust
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER onboarding flow in LIGHT THEME at 1440px.

**Left Panel:** `#F1F5F9` bg. "AETHER" `#0F172A`. Tagline `#64748B`. Trust signals: icons `#059669`, text `#64748B`.

**Right Panel:** `#F8FAFC` bg.
- Headlines `#0F172A`. Subtexts `#64748B`.
- Inputs: `#FFFFFF` bg, 1px border `#E2E8F0`, text `#0F172A`, placeholder `#94A3B8`. Focus: border `#2563EB`.
- Primary CTA: `#2563EB` bg, `#FFFFFF` text.
- Google button: `#FFFFFF` bg, 1px border `#E2E8F0`, text `#0F172A`.
- Divider: `#E2E8F0`. "or" `#94A3B8`.
- Legal: `#94A3B8`. Links `#2563EB`.

**Risk Cards:** `#FFFFFF` bg, 1px border `#E2E8F0`. Selected: border `#2563EB`, bg `rgba(37,99,235,0.04)`. Titles `#0F172A`. Descriptions `#64748B`.

**Currency:** `#FFFFFF` bg, border `#E2E8F0`. Selected radio `#2563EB`. Text `#0F172A`.

**Welcome Modal:** `#FFFFFF` bg, 1px border `#E2E8F0`. Overlay `rgba(248,250,252,0.8)` blur. Headline `#0F172A`. Body `#64748B`. CTA `#2563EB`.

**Light Theme Notes:**
- Clean, minimal light canvas — `#F8FAFC` background
- All surfaces `#FFFFFF` with `#E2E8F0` borders
- Deeper blue `#2563EB` for better light-bg contrast
- Same layout, forms, and spacing — color inversion only
```
