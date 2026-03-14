# AETHER — Design System Tokens (Dark SaaS Edition)

> **Purpose:** Single source of truth for all visual tokens across every AETHER design prompt. Web-first (1440px), dark-mode-only. Glassmorphism + Bento Grid + 3D Hero aesthetic. Copy this into your Stitch session first, or reference it when reviewing any individual page prompt for consistency.

---

## Design Philosophy

**Dark Mode SaaS — Glassmorphism + Bento Grid + 3D Hero.** Luxury fintech meets minimal precision. The visual confidence of Framer/Webflow dark fintech templates (2024–2025 era) rendered in a deep violet-tinted dark palette with purple/violet accents. This is a wealth operating system, not a consumer budgeting app. Data density is a feature — visible math, precise numbers to the peso, and benchmark comparisons always present. The net worth number is the hero of every screen.

**References:** Framer dark templates × Webflow fintech UI × Linear's precision × Stripe's gradient artistry.

**What to avoid:** Light themes, pastel colors, illustration-heavy empty states, rounded-corner "friendly" card grids, anything resembling a consumer budgeting or mobile weather app. NEVER use Inter, Roboto, Arial, Helvetica, Space Grotesk, or system-ui as primary fonts.

---

## 1. Color Palette (Dark-Mode-Only)

### CSS Variables (inject into every prompt's `:root`)

```css
:root {
  /* Base */
  --bg-primary:    #08080f;   /* near-black with violet tint */
  --bg-secondary:  #0f0f1a;
  --bg-surface:    #13131f;
  --bg-elevated:   #1a1a2e;

  /* Accent — Purple / Violet */
  --accent-primary:   #7c3aed;   /* violet-600 */
  --accent-bright:    #a855f7;   /* purple-500  */
  --accent-glow:      #c084fc;   /* purple-400  */
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
}
```

---

## 2. Typography

**Mandatory — no exceptions.**

```css
/* Load in <head> — Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

/* Rules */
--font-display: 'Syne', sans-serif;      /* All headings, nav brand, hero */
--font-body:    'DM Sans', sans-serif;   /* All body copy, labels, UI text */

/* Scale */
--text-xs:   0.75rem;
--text-sm:   0.875rem;
--text-base: 1rem;
--text-lg:   1.125rem;
--text-xl:   1.25rem;
--text-2xl:  1.5rem;
--text-3xl:  1.875rem;
--text-4xl:  2.25rem;
--text-5xl:  3rem;
--text-6xl:  3.75rem;
--text-hero: clamp(3rem, 7vw, 5.5rem);
```

| Role | Font | Weight | Size (Web 1440px) | Notes |
|------|------|--------|-------------------|-------|
| **Display / Hero** | Syne | Bold (700) / Extra Bold (800) | clamp(3rem, 7vw, 5.5rem) | Hero headlines, page titles |
| **H1 Page Title** | Syne | Bold (700) | 2.25rem | |
| **H2 Section** | Syne | SemiBold (600) | 1.875rem | |
| **H3 Subsection** | Syne | SemiBold (600) | 1.5rem | |
| **Body** | DM Sans | Regular (400) | 1rem | Line-height 1.7 |
| **Body Bold** | DM Sans | Medium (500) | 1rem | |
| **Caption / Label** | DM Sans | Medium (500) | 0.75rem | Uppercase for section tags |
| **Financial Figures** | DM Sans | Medium (500) | 1rem | Tabular nums |
| **Large Financial** | Syne | Bold (700) | 1.875rem–2.25rem | Portfolio values, key metrics |
| **Button Text** | DM Sans | Medium (500) | 0.875rem | |
| **Overline / Tag** | DM Sans | Medium (500) | 0.75rem | Uppercase, letter-spacing 0.1em |

**NEVER use:** Inter, Roboto, Arial, Helvetica, Space Grotesk, system-ui as primary fonts.

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

### Borders — Glass and Subtle
- **Card borders:** `1px solid var(--glass-border)` — glassmorphism effect
- **Section dividers:** `1px solid var(--border)` — barely visible
- **Active/focus borders:** `2px solid var(--accent-bright)` — purple for focus states
- **Data table borders:** `1px solid var(--border)` — subtle gridlines

### Border Radius
```
8px  — Buttons, inputs, small chips
12px — Tags, badges, pills
16px — Cards, panels, dropdowns
20px — Modals, tooltips
999px — Pill shapes, section tags
```

---

## 5. Elevation & Shadows (Glassmorphism)

```css
/* Glass cards */
.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--glass-shadow);
  padding: 2rem;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}
.card:hover {
  border-color: rgba(168, 85, 247, 0.35);
  box-shadow: 0 12px 48px rgba(124, 58, 237, 0.2);
  transform: translateY(-2px);
}
```

---

## 6. Component Patterns (Web-First)

### Navbar — IDENTICAL across every prompt/section

```html
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="Home">
      <svg class="nav-logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="var(--accent-primary)"/>
        <path d="M8 14h12M14 8l6 6-6 6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-brand-name">BRAND</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="#features" class="nav-link">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="currentColor" opacity=".6"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity=".6"/></svg>
        Features
      </a></li>
      <li><a href="#pricing" class="nav-link">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v6M6 7h3.5a1.5 1.5 0 010 3H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        Pricing
      </a></li>
      <li><a href="#docs" class="nav-link">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 2h6l3 3v9H4V2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 2v4h4" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
        Docs
      </a></li>
    </ul>
    <div class="nav-actions">
      <a href="#login" class="btn-ghost">Sign In</a>
      <a href="#signup" class="btn-primary">Get Started</a>
    </div>
    <button class="nav-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>
```

```css
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 0 clamp(1rem, 4vw, 2.5rem);
  background: rgba(8, 8, 15, 0.72);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--border);
  color-scheme: dark;
}
.nav-inner {
  max-width: 1280px; margin: 0 auto; height: 64px;
  display: flex; align-items: center; gap: 2rem;
}
.nav-brand {
  display: flex; align-items: center; gap: 10px; text-decoration: none;
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 700;
  letter-spacing: 0.05em; color: var(--text-primary); flex-shrink: 0;
}
.nav-links {
  display: flex; align-items: center; gap: 0.25rem;
  list-style: none; margin: 0; padding: 0; margin-left: auto;
}
.nav-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px;
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: 400;
  color: var(--text-secondary); text-decoration: none;
  transition: color 160ms ease, background 160ms ease;
}
.nav-link:hover { color: var(--text-primary); background: var(--glass-bg); }
.nav-link:focus-visible { outline: 2px solid var(--accent-bright); outline-offset: 2px; }
.nav-actions { display: flex; align-items: center; gap: 8px; margin-left: 1.5rem; }
.btn-ghost {
  padding: 7px 16px; border-radius: 8px;
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
  color: var(--text-secondary); text-decoration: none;
  border: 1px solid var(--border);
  transition: color 160ms, border-color 160ms, background 160ms;
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--border-accent); background: var(--glass-bg); }
.btn-ghost:focus-visible { outline: 2px solid var(--accent-bright); outline-offset: 2px; }
.btn-primary {
  padding: 7px 18px; border-radius: 8px;
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: 500;
  color: #fff; text-decoration: none;
  background: var(--accent-primary); border: 1px solid transparent;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.35);
  transition: background 160ms, box-shadow 160ms, transform 100ms;
  touch-action: manipulation;
}
.btn-primary:hover { background: var(--accent-bright); box-shadow: 0 0 28px rgba(168, 85, 247, 0.45); }
.btn-primary:active { transform: scale(0.97); }
.btn-primary:focus-visible { outline: 2px solid var(--accent-glow); outline-offset: 2px; }
.nav-toggle { display: none; background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 8px; border-radius: 6px; }
.nav-toggle:focus-visible { outline: 2px solid var(--accent-bright); outline-offset: 2px; }
@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-toggle { display: flex; margin-left: auto; }
}
```

### Section Header — IDENTICAL template for every section

```html
<header class="section-header">
  <span class="section-tag">[TAG]</span>
  <h2 class="section-headline">[HEADLINE]</h2>
  <p class="section-sub">[SUBLINE]</p>
</header>
```

```css
.section-header {
  text-align: center; max-width: 640px; margin: 0 auto 4rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.section-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 14px; border-radius: 999px;
  font-family: var(--font-body); font-size: var(--text-xs); font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--accent-glow); background: var(--accent-subtle);
  border: 1px solid var(--glass-border);
}
.section-headline {
  font-family: var(--font-display); font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700; color: var(--text-primary); line-height: 1.15;
  text-wrap: balance; margin: 0;
}
.section-headline em {
  font-style: normal;
  background: linear-gradient(135deg, var(--accent-bright), var(--accent-glow));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.section-sub {
  font-family: var(--font-body); font-size: var(--text-base); font-weight: 300;
  color: var(--text-secondary); line-height: 1.7; max-width: 520px; margin: 0;
  text-pretty: auto;
}
```

### Glass Card — Base component

```css
.card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--glass-shadow);
  padding: 2rem;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}
.card:hover {
  border-color: rgba(168, 85, 247, 0.35);
  box-shadow: 0 12px 48px rgba(124, 58, 237, 0.2);
  transform: translateY(-2px);
}
```

### Buttons

| Type | Style |
|------|-------|
| **Primary** | Background: `var(--accent-primary)`, Text: `#fff`, border-radius `8px`, height `40px`, `box-shadow: 0 0 20px rgba(124, 58, 237, 0.35)` |
| **Secondary/Ghost** | Background: transparent, Text: `var(--text-secondary)`, `1px solid var(--border)`, border-radius `8px` |
| **Destructive** | Background: `var(--error)`, Text: `#fff`, border-radius `8px` |

### Input Fields
- Height: 40px, background `var(--bg-elevated)`, 1px border `var(--glass-border)`, 8px radius
- Text: DM Sans Regular 1rem `var(--text-primary)`, placeholder `var(--text-muted)`
- Focus: border `var(--accent-bright)`, glow `0 0 0 3px rgba(168, 85, 247, 0.15)`

---

## 7. Page Layout

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html { color-scheme: dark; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
section { padding: clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem); }
.container { max-width: 1280px; margin: 0 auto; }
.bg-glow {
  position: fixed; border-radius: 50%; filter: blur(120px);
  pointer-events: none; z-index: 0;
}
.bg-glow-1 {
  width: 600px; height: 600px; top: -200px; left: -100px;
  background: radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%);
}
.bg-glow-2 {
  width: 400px; height: 400px; bottom: 20%; right: -100px;
  background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
}
```

### `<head>` Required Tags

```html
<meta name="theme-color" content="#08080f">
<html lang="en" style="color-scheme: dark;">
```

### Background Glow Blobs — place on every page

```html
<div class="bg-glow bg-glow-1" aria-hidden="true"></div>
<div class="bg-glow bg-glow-2" aria-hidden="true"></div>
```

---

## 8. Footer — CONSISTENT across all prompts

```html
<footer class="footer" role="contentinfo">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="/" class="nav-brand" aria-label="Home">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect width="28" height="28" rx="8" fill="var(--accent-primary)"/>
          <path d="M8 14h12M14 8l6 6-6 6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="nav-brand-name">BRAND</span>
      </a>
      <p class="footer-tagline">Built for the next generation.</p>
    </div>
    <nav class="footer-links" aria-label="Footer navigation">
      <div class="footer-col">
        <span class="footer-col-title">Product</span>
        <a href="#features" class="footer-link">Features</a>
        <a href="#pricing" class="footer-link">Pricing</a>
        <a href="#changelog" class="footer-link">Changelog</a>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Company</span>
        <a href="#about" class="footer-link">About</a>
        <a href="#blog" class="footer-link">Blog</a>
        <a href="#careers" class="footer-link">Careers</a>
      </div>
      <div class="footer-col">
        <span class="footer-col-title">Legal</span>
        <a href="#privacy" class="footer-link">Privacy</a>
        <a href="#terms" class="footer-link">Terms</a>
      </div>
    </nav>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span class="footer-copy">&copy; 2025 BRAND. All rights reserved.</span>
      <div class="footer-socials" role="list" aria-label="Social links">
        <a href="#" role="listitem" aria-label="Twitter / X" class="footer-social-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M12.6 2h2.2L9.9 7.3 15.5 14h-4l-3.5-4.6L4.1 14H1.9l5.3-6-5.2-6h4.1l3.2 4.2L12.6 2z"/></svg>
        </a>
        <a href="#" role="listitem" aria-label="GitHub" class="footer-social-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        </a>
      </div>
    </div>
  </div>
</footer>
```

```css
.footer {
  border-top: 1px solid var(--border); padding-top: 4rem;
  font-family: var(--font-body);
}
.footer-inner {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 3rem; flex-wrap: wrap; padding-bottom: 3rem;
}
.footer-tagline { font-size: var(--text-sm); color: var(--text-muted); margin-top: 0.75rem; font-weight: 300; }
.footer-links { display: flex; gap: 4rem; flex-wrap: wrap; }
.footer-col { display: flex; flex-direction: column; gap: 0.75rem; }
.footer-col-title {
  font-size: var(--text-xs); letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-muted); font-weight: 600; margin-bottom: 0.25rem;
}
.footer-link { font-size: var(--text-sm); color: var(--text-secondary); text-decoration: none; transition: color 150ms; }
.footer-link:hover { color: var(--text-primary); }
.footer-link:focus-visible { outline: 2px solid var(--accent-bright); outline-offset: 2px; border-radius: 2px; }
.footer-bottom { border-top: 1px solid var(--border); padding: 1.5rem clamp(1rem, 4vw, 2.5rem); }
.footer-bottom .container { display: flex; justify-content: space-between; align-items: center; }
.footer-copy { font-size: var(--text-xs); color: var(--text-muted); }
.footer-socials { display: flex; gap: 1rem; }
.footer-social-link { color: var(--text-muted); transition: color 150ms; }
.footer-social-link:hover { color: var(--accent-glow); }
.footer-social-link:focus-visible { outline: 2px solid var(--accent-bright); outline-offset: 2px; border-radius: 2px; }
```

---

## 9. Accessibility Checklist (enforce in every prompt output)

| Rule | Requirement |
|------|-------------|
| Icon buttons | `aria-label` on every `<button>` with only an icon |
| Decorative icons | `aria-hidden="true"` |
| Focus states | `focus-visible:` ring using `var(--accent-bright)` — never `outline: none` without replacement |
| Semantic HTML | `<button>` for actions, `<a>` for navigation, never `<div onClick>` |
| Images | `alt` text always; `alt=""` if decorative; explicit `width` + `height` |
| Headings | Hierarchical `h1 → h2 → h3` — one `h1` per page |
| Motion | `@media (prefers-reduced-motion: reduce)` on all transitions/animations |
| Animations | Only `transform` + `opacity` — never `transition: all` |
| Typography | `text-wrap: balance` on headings; `…` not `...` |
| Dark mode | `color-scheme: dark` on `<html>`; `<meta name="theme-color">` matches `--bg-primary` |
| Touch | `touch-action: manipulation` on buttons |
| Overflow | `min-w-0` on flex children with text; `truncate` or `break-words` on dynamic content |
| Inputs | `autocomplete`, `name`, semantic `type` attribute |

---

## 10. Icon System

- **Style:** Lucide Icons — outlined, consistent 1.5px stroke
- **Sizes:** 14px (inline), 18px (nav, list items), 20px (actions), 24px (empty states)
- **Color:** Inherits text color; Violet `var(--accent-primary)` for active nav; `var(--accent-glow)` for highlights; `var(--success)`/`var(--error)` for gain/loss indicators

---

## 11. Chart & Data Visualization

| Element | Token |
|---------|-------|
| **User portfolio line** | `var(--accent-primary)` 2px solid |
| **Benchmark line** | `var(--text-muted)` 1px solid |
| **Gains area** | `var(--success)` at 12% opacity |
| **Losses area** | `var(--error)` at 12% opacity |
| **Grid lines** | `var(--border)` 1px solid |
| **Axis labels** | `var(--text-muted)` DM Sans 0.75rem |
| **Value labels** | `var(--text-primary)` DM Sans 0.875rem |

---

## 12. APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable)

For all inner app screens (03–10):
- Use glassmorphism sidebar: `var(--bg-surface)` bg, `backdrop-filter: blur(12px)`, 1px right border `var(--glass-border)`, 240px fixed left
- Brand: "AETHER" in Syne Bold 1.1rem `var(--text-primary)`, letter-spacing 0.05em
- Nav items: DM Sans Regular 0.875rem, `var(--text-secondary)`, 40px height, glassmorphism hover
- Active item: `var(--text-primary)` text, `var(--accent-primary)` icon, left 2px border `var(--accent-primary)`, bg `var(--accent-subtle)`
- Hover item: background `var(--glass-bg)`, text `var(--text-primary)`
- Icons: Lucide, 18px, 1.5px stroke, left of label, 10px gap
- Section labels: "MAIN", "ANALYSIS", "SETTINGS" as overline labels, DM Sans Medium 0.75rem `var(--text-muted)`
- Net worth always visible at bottom of sidebar: Syne Bold 1.125rem `var(--text-primary)`
- Page header: section-header pattern with section-tag + section-headline, then 1px divider `var(--border)`
- All cards use `.card` glassmorphism pattern
- `<meta name="theme-color" content="#08080f">` and `color-scheme: dark` on `<html>`
- Background glow blobs on every page

---

## 13. Page Navigation Map

```
11 Email Registration Landing (Pre-Launch)
 └──→ 01 Landing Page (Early Access — Email Capture)
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

**Note:** 01_LANDING_PAGE is the early access page — email capture with a 3-feature bento grid. Same locked design system as all other prompts.
