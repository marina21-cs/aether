# 02 — Onboarding & Auth — AETHER (Dark SaaS Edition)

> **Navigation:** Previous: [01 Landing Page](./01_LANDING_PAGE.md) | Next: [03 Dashboard](./03_DASHBOARD_NET_WORTH.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Platform:** Web-first (1440px), dark-mode-only.
> **Screens covered:** Sign Up, Risk Profile, Currency Selection, Welcome

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design a premium web onboarding flow for "AETHER", a wealth management platform for Filipino investors — displayed at 1440px desktop width. This is a MULTI-STEP flow shown as 4 connected screens. The user arrives here after clicking "Get Started" on the Landing Page.

---

AESTHETIC & PHILOSOPHY

Dark Mode SaaS — Glassmorphism + Bento Grid. The onboarding feels like stepping into a luxury wealth operating system for the first time — structured, elegant, precise. Translucent glass panels float over a deep violet-tinted dark canvas with soft ambient glow blobs. No playful illustrations, no confetti, no gamified elements. A clean data-entry form framed in a glassmorphic card, centered on a dark canvas. The form area is centered and narrow (max-width 480px) with generous negative space around it — creating focus and sophistication.

References: Framer dark templates, Webflow fintech UI, Linear's precision, Stripe's gradient artistry.

What to avoid: Light themes, pastel colors, illustration-heavy empty states, rounded-corner "friendly" card grids, anything resembling a consumer budgeting app. NEVER use Inter, Roboto, Arial, Helvetica, Space Grotesk, or system-ui as primary fonts.

---

HEAD & GLOBAL SETUP

<html lang="en" style="color-scheme: dark;">
<head>
  <meta name="theme-color" content="#08080f">
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
</head>

CSS Variables (inject into :root):

:root {
  /* Base */
  --bg-primary:      #08080f;
  --bg-secondary:    #0f0f1a;
  --bg-surface:      #13131f;
  --bg-elevated:     #1a1a2e;

  /* Accent — Purple / Violet */
  --accent-primary:  #7c3aed;
  --accent-bright:   #a855f7;
  --accent-glow:     #c084fc;
  --accent-subtle:   rgba(124, 58, 237, 0.15);

  /* Glass */
  --glass-bg:        rgba(255, 255, 255, 0.04);
  --glass-border:    rgba(168, 85, 247, 0.18);
  --glass-shadow:    0 8px 32px rgba(124, 58, 237, 0.12);

  /* Text */
  --text-primary:    #f1f0ff;
  --text-secondary:  #9492b0;
  --text-muted:      #4e4c6a;

  /* Feedback */
  --success:         #34d399;
  --warning:         #fbbf24;
  --error:           #f87171;

  /* Border */
  --border:          rgba(255, 255, 255, 0.06);
  --border-accent:   rgba(168, 85, 247, 0.3);

  /* Fonts */
  --font-display:    'Syne', sans-serif;
  --font-body:       'DM Sans', sans-serif;
}

Body: font-family var(--font-body), background var(--bg-primary), color var(--text-primary), -webkit-font-smoothing antialiased.

---

BACKGROUND GLOW BLOBS (place behind all content, z-index 0, pointer-events none, position fixed, aria-hidden="true"):

Blob 1: 600px circle, top -200px left -100px, radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%), filter blur(120px).
Blob 2: 400px circle, bottom 20% right -100px, radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%), filter blur(120px).

---

ACCESSIBILITY RULES (enforce on every element):

- aria-label on every icon-only button
- aria-hidden="true" on all decorative icons and glow blobs
- focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px — NEVER outline: none without a replacement focus ring
- Never transition: all — only transition specific properties: transform, opacity, border-color, box-shadow, background, color
- touch-action: manipulation on all buttons
- @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
- text-wrap: balance on all headings
- All inputs must have autocomplete, name, and semantic type attributes
- Semantic HTML: <button> for actions, <a> for navigation, never <div onClick>

---

SCREEN 1 — SIGN UP

Split-screen layout, full viewport height.

LEFT HALF (720px):
A branded glass panel. Background: var(--bg-surface) / #13131f with glassmorphism treatment — backdrop-filter: blur(12px), border-right: 1px solid var(--glass-border). Full height. Subtle gradient overlay: var(--bg-primary) at top to var(--bg-surface) at bottom.

- Center-vertically:
  - "AETHER" in Syne Bold 24px var(--text-primary) / #f1f0ff, letter-spacing 0.08em, text-wrap: balance.
  - Below (12px gap): "Your net worth, to the peso." in DM Sans Regular 18px var(--text-muted) / #4e4c6a.
  - Below (48px gap): A vertical stack of 3 trust signals:
    - Lock icon 18px var(--success) / #34d399, aria-hidden="true" → "AES-256 encrypted" DM Sans Medium 14px var(--text-secondary) / #9492b0.
    - Shield icon 18px var(--success) / #34d399, aria-hidden="true" → "Read-only access to brokerages" DM Sans Medium 14px var(--text-secondary) / #9492b0.
    - Eye icon 18px var(--success) / #34d399, aria-hidden="true" → "You control your data" DM Sans Medium 14px var(--text-secondary) / #9492b0.
    Each signal: 12px gap between icon and text, 16px gap between signals.

RIGHT HALF (720px):
Background: var(--bg-primary) / #08080f. Centered content, max-width 400px.

- Top (64px from top): "Create your account" Syne Bold 28px var(--text-primary) / #f1f0ff, text-wrap: balance.
- 8px gap.
- "Free forever. No credit card needed." DM Sans Regular 14px var(--text-muted) / #4e4c6a.
- 32px gap.

FORM FIELDS (stacked, 16px gap):

Each field:
- Label: DM Sans Medium 12px var(--text-secondary) / #9492b0, letter-spacing 0.04em, uppercase. 6px below label.
- Input: height 44px, background var(--bg-elevated) / #1a1a2e, 1px border var(--glass-border), border-radius 8px, padding 0 16px. Text: DM Sans Regular 14px var(--text-primary) / #f1f0ff. Placeholder: var(--text-muted) / #4e4c6a. Attributes: autocomplete, name, semantic type.
- Focus: border var(--accent-bright) / #a855f7, glow 0 0 0 3px rgba(168,85,247,0.15). Use :focus-visible selector.
- Error: border var(--error) / #f87171, error text below in DM Sans Regular 12px var(--error) / #f87171.

Fields:
1. "FULL NAME" — placeholder "Juan dela Cruz" — autocomplete="name" type="text"
2. "EMAIL ADDRESS" — placeholder "juan@email.com" — autocomplete="email" type="email"
3. "PASSWORD" — placeholder "Minimum 8 characters" — autocomplete="new-password" type="password" — visibility toggle: icon-only button with aria-label="Toggle password visibility", eye icon 18px var(--text-muted) / #4e4c6a, right-inside the input.

- 24px gap.
- Primary CTA: "Create account" — background var(--accent-primary) / #7c3aed, text #FFFFFF, DM Sans Medium 14px, height 44px, full width (400px), border-radius 8px. box-shadow: 0 0 20px rgba(124,58,237,0.35). Hover: background var(--accent-bright) / #a855f7, box-shadow 0 0 28px rgba(168,85,247,0.45). Active: transform scale(0.97). focus-visible: outline 2px solid var(--accent-glow), outline-offset 2px. touch-action: manipulation. Transition: background 160ms, box-shadow 160ms, transform 100ms. @media (prefers-reduced-motion: reduce) { transition: none; }
- 16px gap.
- Divider: 1px line var(--border) / rgba(255,255,255,0.06) with "or" centered in DM Sans Regular 12px var(--text-muted) / #4e4c6a, background var(--bg-primary) / #08080f behind text.
- 16px gap.
- Google: "Continue with Google" — glass card treatment: background var(--glass-bg) / rgba(255,255,255,0.04), 1px border var(--glass-border), backdrop-filter blur(12px), height 44px, full width, border-radius 8px. Google "G" icon 18px left, aria-hidden="true". Text: DM Sans Medium 14px var(--text-primary) / #f1f0ff. Hover: border-color var(--border-accent). focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px. touch-action: manipulation.
- 24px gap.
- Legal: "By creating an account, you agree to our Terms of Service and Privacy Policy." DM Sans Regular 12px var(--text-muted) / #4e4c6a. Links underlined var(--accent-primary) / #7c3aed. Link focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px.
- Bottom: "Already have an account? Sign in" DM Sans Regular 14px var(--text-muted) / #4e4c6a, "Sign in" in var(--accent-primary) / #7c3aed. Link focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px.

---

SCREEN 2 — RISK PROFILE SELECTION

Same split layout. Left panel unchanged.

RIGHT HALF CONTENT (max-width 400px centered):

- Progress: 3-step horizontal dots at top — dot 1 filled var(--accent-primary) / #7c3aed with glow box-shadow 0 0 8px rgba(124,58,237,0.4), dot 2 outlined var(--text-muted) / #4e4c6a, dot 3 outlined. Connected by 1px lines var(--border) / rgba(255,255,255,0.06). "Step 1 of 3" DM Sans Regular 12px var(--text-muted) / #4e4c6a below.
- 24px gap.
- "How do you handle risk?" Syne Bold 28px var(--text-primary) / #f1f0ff, text-wrap: balance.
- 8px gap.
- "Calibrates your AI advisor recommendations. Changeable anytime." DM Sans Regular 14px var(--text-muted) / #4e4c6a.
- 32px gap.

RISK CARDS (stacked, 12px gap):
Each card is a glassmorphic surface: background var(--glass-bg) / rgba(255,255,255,0.04), 1px border var(--glass-border), border-radius 16px, backdrop-filter blur(12px), box-shadow var(--glass-shadow), padding 16px, full width. Click/tap to select. role="radio" within a role="radiogroup". Transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease. @media (prefers-reduced-motion: reduce) { transition: none; }

Card 1 — Conservative:
- Left: Shield icon 20px var(--success) / #34d399, aria-hidden="true". 12px gap.
- Right: "Conservative" Syne SemiBold 16px var(--text-primary) / #f1f0ff. Below: "Preserve capital. Bonds, time deposits, low volatility." DM Sans Regular 13px var(--text-secondary) / #9492b0.
- Selected state: border var(--accent-primary) / #7c3aed, border-color with glow: box-shadow 0 0 20px rgba(124,58,237,0.2), background rgba(124,58,237,0.06), checkmark icon 18px var(--accent-primary) / #7c3aed top-right, aria-checked="true".

Card 2 — Moderate:
- Scale icon 20px var(--accent-primary) / #7c3aed, aria-hidden="true". "Moderate" — "Balanced growth. Mixed equities and fixed income."
- Selected state: same violet treatment.

Card 3 — Aggressive:
- TrendingUp icon 20px var(--warning) / #fbbf24, aria-hidden="true". "Aggressive" — "Maximize growth. High equity allocation. Comfortable with drawdowns."
- Selected state: same violet treatment.

Hover (all cards): border-color rgba(168,85,247,0.35), transform translateY(-2px), box-shadow 0 12px 48px rgba(124,58,237,0.15).

- 32px gap.
- "Continue" — full width, background var(--accent-primary) / #7c3aed, border-radius 8px, height 44px, DM Sans Medium 14px #FFFFFF. box-shadow: 0 0 20px rgba(124,58,237,0.35). touch-action: manipulation. Disabled state (nothing selected): background var(--bg-elevated) / #1a1a2e, text var(--text-muted) / #4e4c6a, cursor not-allowed, box-shadow none.
- 12px gap.
- "Skip for now" ghost link, DM Sans Medium 14px var(--text-muted) / #4e4c6a. Hover: var(--text-secondary). focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px.

---

SCREEN 3 — BASE CURRENCY SELECTION

Same layout. Progress: dots 1–2 filled var(--accent-primary) with glow, dot 3 outlined. "Step 2 of 3."

- "What's your base currency?" Syne Bold 28px var(--text-primary) / #f1f0ff, text-wrap: balance.
- "All assets converted to this for display. PHP recommended for PH investors." DM Sans Regular 14px var(--text-muted) / #4e4c6a.
- 32px gap.

CURRENCY OPTIONS (stacked, 8px gap, role="radiogroup"):
Each option: glassmorphic surface — background var(--glass-bg) / rgba(255,255,255,0.04), 1px border var(--glass-border), border-radius 16px, backdrop-filter blur(12px), height 48px, padding 0 16px. Full width. role="radio". Transition: border-color 200ms ease, box-shadow 200ms ease. @media (prefers-reduced-motion: reduce) { transition: none; }
- Left: Currency code "PHP" DM Sans Medium 14px var(--text-primary) / #f1f0ff. 8px gap. "Philippine Peso" DM Sans Regular 14px var(--text-secondary) / #9492b0.
- Right: Radio circle 18px, 1px border var(--text-muted) / #4e4c6a. Selected: filled var(--accent-primary) / #7c3aed with inner white dot.

Options: PHP (pre-selected, border var(--accent-primary) / #7c3aed, background rgba(124,58,237,0.06), aria-checked="true"), USD, SGD, HKD.

Hover (unselected): border-color var(--border-accent) / rgba(168,85,247,0.3).

- 32px gap.
- "Finish setup" — full width, background var(--accent-primary) / #7c3aed, border-radius 8px, height 44px. DM Sans Medium 14px #FFFFFF. box-shadow: 0 0 20px rgba(124,58,237,0.35). touch-action: manipulation. focus-visible: outline 2px solid var(--accent-glow), outline-offset 2px.

---

SCREEN 4 — WELCOME / FIRST-TIME DASHBOARD HINT

All 3 progress dots filled var(--accent-primary) with glow. The background transitions to show the actual dashboard blurred at blur(16px) with rgba(8,8,15,0.75) overlay.

CENTER MODAL (max-width 480px, centered):
Full glassmorphism treatment: background var(--glass-bg) / rgba(255,255,255,0.04), 1px border var(--glass-border), border-radius 20px, backdrop-filter blur(12px), -webkit-backdrop-filter blur(12px), box-shadow var(--glass-shadow) / 0 8px 32px rgba(124,58,237,0.12), padding 32px.

- Top: Sparkles icon 24px var(--accent-primary) / #7c3aed, centered, aria-hidden="true".
- 16px gap.
- "Welcome to AETHER." Syne Bold 24px var(--text-primary) / #f1f0ff, centered, text-wrap: balance.
- 12px gap.
- "Connect your first account or add assets manually. Your financial co-pilot is ready." DM Sans Regular 15px var(--text-secondary) / #9492b0, centered, line-height 1.7. Max-width 360px.
- 32px gap.
- Primary: "Connect an account" — background var(--accent-primary) / #7c3aed, #FFFFFF text, full width, border-radius 8px, height 44px. box-shadow: 0 0 20px rgba(124,58,237,0.35). touch-action: manipulation. focus-visible: outline 2px solid var(--accent-glow), outline-offset 2px.
- 12px gap.
- Secondary: "Add manually" — background transparent, 1px border var(--accent-primary) / #7c3aed, text var(--accent-primary) / #7c3aed, DM Sans Medium 14px, full width, border-radius 8px, height 44px. Hover: background var(--accent-subtle) / rgba(124,58,237,0.15), border-color var(--accent-bright). touch-action: manipulation. focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px.
- 12px gap.
- Ghost: "Skip for now" DM Sans Medium 14px var(--text-muted) / #4e4c6a, centered. Hover: var(--text-secondary). focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px.

---

KEY DESIGN NOTES

Layout:
- Split-screen layout: branded glass panel left, form right — enterprise auth pattern (Linear, Vercel, Stripe)
- Dark canvas var(--bg-primary) / #08080f with var(--bg-surface) / #13131f glass surfaces — no pastel, no white, no light theme
- Form area narrow (400px max) for focused data entry — generous dark space around it
- Progress indicator: horizontal dots with violet glow, not a progress bar — cleaner
- Risk cards and currency options use glassmorphic surfaces with single-select violet highlight
- All inputs 44px height, 8px radius — modern, refined
- Background glow blobs visible on all screens, behind content

Typography:
- Headings: Syne Bold (700) — never Inter, Roboto, or system-ui
- Body / labels / buttons: DM Sans — Regular (400) for body, Medium (500) for labels and buttons
- Financial numbers: DM Sans Medium with font-variant-numeric: tabular-nums
- text-wrap: balance on all headings

Glassmorphism:
- All card surfaces: background var(--glass-bg), border 1px solid var(--glass-border), backdrop-filter blur(12px), box-shadow var(--glass-shadow), border-radius 16px
- Left branded panel: var(--bg-surface) with backdrop-filter blur(12px), border-right 1px solid var(--glass-border)
- Welcome modal: full glass treatment with 20px radius

Colors:
- Primary accent: var(--accent-primary) / #7c3aed (violet) — CTAs, selected states, links, progress dots
- Bright accent: var(--accent-bright) / #a855f7 — hover states, focus rings
- Glow accent: var(--accent-glow) / #c084fc — gradient highlights
- Trust signal icons: var(--success) / #34d399
- Aggressive risk icon: var(--warning) / #fbbf24
- Errors: var(--error) / #f87171 — input error borders and text
- Text hierarchy: var(--text-primary) #f1f0ff → var(--text-secondary) #9492b0 → var(--text-muted) #4e4c6a

Accessibility:
- aria-label on all icon-only buttons (password toggle, etc.)
- aria-hidden="true" on all decorative icons and glow blobs
- focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px — on every interactive element
- NEVER outline: none without a visible focus replacement
- NEVER transition: all — only transition specific properties (transform, opacity, border-color, box-shadow, background, color)
- touch-action: manipulation on all buttons
- @media (prefers-reduced-motion: reduce) disables all transitions and animations
- text-wrap: balance on all headings
- role="radiogroup" on risk cards and currency options, role="radio" + aria-checked on each option
- All inputs: autocomplete, name, semantic type attributes
- Semantic HTML: <button> for actions, <a> for navigation

Motion:
- Card hover: transform translateY(-2px), border-color brighten, box-shadow deepen — 200ms ease
- Button active: transform scale(0.97) — 100ms
- All gated behind @media (prefers-reduced-motion: reduce)
- Never animate layout properties (width, height, top, left, margin, padding)
```
