# 11 — Email Registration (Pre-Launch Landing Page) — AETHER (Dark SaaS Edition)

> **Navigation:** Previous: [10 Settings](./10_SETTINGS_PROFILE.md) -- (Standalone page)
> **Purpose:** Pre-launch email capture page -- collect emails before the product is live
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens, 01_LANDING_PAGE.md for brand voice
> **Context:** This is NOT the full landing page. This is a focused "Register Now" page with a single goal: capture email addresses so we can notify users when AETHER launches.
> **Aesthetic:** Dark Mode SaaS -- Glassmorphism + Bento Grid + 3D Hero

---

## DARK THEME -- Web (1440px)

### Prompt (copy below)

```
Design a pre-launch email registration page for "AETHER", a wealth management platform -- displayed at 1440px desktop width. Single purpose: capture email addresses. Minimal, confident, dark SaaS with glassmorphism. No feature tours, no lengthy copy -- just trust, value prop, and an email field. Dark theme only.

Aesthetic: Dark Mode SaaS -- Glassmorphism + Bento Grid + 3D Hero. Luxury fintech meets minimal precision. Deep violet-tinted dark palette with purple/violet accents. References: Framer dark templates x Webflow fintech UI x Linear's precision x Stripe's gradient artistry. Avoid anything pastel, friendly, illustrative, or resembling a consumer budgeting app.

---

### HEAD REQUIREMENTS

<meta name="theme-color" content="#08080f">
<html lang="en" style="color-scheme: dark;">

Google Fonts (load in <head>):
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

NEVER use Inter, Roboto, Arial, Helvetica, Space Grotesk, or system-ui as primary fonts.

---

### CSS VARIABLES (inject into :root)

:root {
  /* Base */
  --bg-primary:    #08080f;
  --bg-secondary:  #0f0f1a;
  --bg-surface:    #13131f;
  --bg-elevated:   #1a1a2e;

  /* Accent -- Purple / Violet */
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

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
}

---

### GLOBAL RESET & BASE

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

---

### BACKGROUND GLOW BLOBS (place immediately after <body> open)

<div class="bg-glow bg-glow-1" aria-hidden="true"></div>
<div class="bg-glow bg-glow-2" aria-hidden="true"></div>

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

---

### NAVBAR (fixed, full width, design-system standard -- identical across every page)

HTML:

<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="Home">
      <svg class="nav-logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="var(--accent-primary)"/>
        <path d="M8 14h12M14 8l6 6-6 6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-brand-name">AETHER</span>
    </a>
    <ul class="nav-links" role="list">
      <!-- Minimal for pre-launch: no feature/pricing/docs links -->
    </ul>
    <div class="nav-actions">
      <a href="#signup" class="btn-primary">Get Early Access</a>
    </div>
    <button class="nav-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</nav>

CSS:

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
.nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
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
  .nav-actions { display: none; }
  .nav-toggle { display: flex; margin-left: auto; }
}

---

### PAGE LAYOUT (single centered column, vertically centered)

<main class="page-wrapper" role="main">
  <div class="page-center">
    <!-- Hero, Form, Social Proof, Feature Teaser go here -->
  </div>
</main>

.page-wrapper {
  position: relative; z-index: 1;
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: 96px 32px 80px; /* 96px top = 64px nav + 32px breathing */
}
.page-center {
  max-width: 560px; width: 100%; text-align: center;
  display: flex; flex-direction: column; align-items: center;
}

---

### HERO SECTION (inside .page-center)

**Badge (top):**
- Glass pill container: background var(--glass-bg), 1px border var(--glass-border), border-radius 999px, padding 6px 16px.
- Backdrop-filter: blur(12px).
- Rocket icon (Lucide Rocket, 14px, var(--warning) #fbbf24) + "Launching Soon" DM Sans Medium 0.8125rem var(--warning) #fbbf24.
- 24px gap below badge.

**Headline:**
- "Know your net worth," line 1
- "to the last peso." line 2
- Syne Bold (700) 3rem (48px) var(--text-primary) #f1f0ff, line-height 1.1, letter-spacing -0.03em.
- text-wrap: balance.
- 16px gap below.

**Subheadline:**
- "AETHER is the intelligent wealth tracker built for Filipinos -- AI-powered insights, Glass Box transparency, and real benchmarks against PSEi."
- DM Sans Light (300) 1.0625rem (17px) var(--text-secondary) #9492b0, line-height 1.7, max-width 480px.
- text-pretty: auto.
- 32px gap below.

---

### EMAIL CAPTURE FORM (glassmorphism card wrapper)

Wrap the form in a glass card for depth:
- background: var(--glass-bg) rgba(255, 255, 255, 0.04).
- border: 1px solid var(--glass-border) rgba(168, 85, 247, 0.18).
- border-radius: 16px.
- backdrop-filter: blur(12px).
- -webkit-backdrop-filter: blur(12px).
- box-shadow: var(--glass-shadow) 0 8px 32px rgba(124, 58, 237, 0.12).
- padding: 24px.

<form class="email-form card" action="#" method="post" aria-label="Email registration" novalidate>
  <div class="email-form-row">
    <label for="email-input" class="sr-only">Email address</label>
    <input
      id="email-input"
      type="email"
      name="email"
      autocomplete="email"
      placeholder="Enter your email"
      required
      aria-required="true"
      class="email-input"
    />
    <button type="submit" class="email-submit" aria-label="Get early access">
      Get Early Access
    </button>
  </div>
  <p class="email-privacy" aria-hidden="false">
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" stroke-width="1.4"/>
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
    No spam. Unsubscribe anytime.
  </p>
</form>

/* Visually-hidden utility for accessible labels */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

**Input Row (.email-form-row): horizontal layout, 8px gap, display flex.**
- Email input (.email-input):
  - background: var(--bg-elevated) #1a1a2e.
  - 1px border var(--glass-border) rgba(168, 85, 247, 0.18).
  - border-radius: 8px.
  - height 48px, padding 0 16px, flex: 1, min-width: 0.
  - Placeholder: DM Sans Regular 0.9375rem (15px) var(--text-muted) #4e4c6a.
  - Text input: DM Sans Regular 1rem var(--text-primary) #f1f0ff.
  - Focus: border var(--accent-bright) #a855f7, box-shadow 0 0 0 3px rgba(168, 85, 247, 0.15). outline: none (replaced by visible ring).
  - Transition: border-color 160ms ease, box-shadow 160ms ease.
  - Invalid state (after submit attempt): border var(--error) #f87171, box-shadow 0 0 0 3px rgba(248, 113, 113, 0.12).

- Submit button (.email-submit):
  - background: var(--accent-primary) #7c3aed.
  - height 48px, padding 0 24px, border-radius 8px, border: none.
  - "Get Early Access" DM Sans Medium (500) 0.9375rem (15px) #fff.
  - box-shadow: 0 0 20px rgba(124, 58, 237, 0.35).
  - cursor: pointer.
  - touch-action: manipulation.
  - Hover: background var(--accent-bright) #a855f7, box-shadow 0 0 28px rgba(168, 85, 247, 0.45).
  - Active: transform scale(0.97).
  - Focus-visible: outline 2px solid var(--accent-glow) #c084fc, outline-offset 2px.
  - Transition: background 160ms, box-shadow 160ms, transform 100ms.
  - Loading state: spinner (16px, #fff, border-style animation) replaces text. button gets aria-busy="true", aria-label="Submitting...".
  - Disabled state: opacity 0.5, pointer-events none.

**Validation error (appears below input row when invalid):**
- "Please enter a valid email" DM Sans Regular 0.75rem var(--error) #f87171.
- 6px top margin.
- role="alert" aria-live="polite".

**Privacy note (.email-privacy, 8px below form row):**
- Lock icon (Lucide Lock, 12px) var(--text-muted) #4e4c6a.
- + "No spam. Unsubscribe anytime." DM Sans Regular 0.75rem var(--text-muted) #4e4c6a.
- display: inline-flex, align-items center, gap 6px, justify-content center.

---

### SUCCESS STATE (replaces form after submission, same glass card wrapper)

<div class="email-success card" role="status" aria-live="polite">
  <svg class="email-success-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="var(--success)" stroke-width="1.5"/>
    <path d="M8 12l3 3 5-5" stroke="var(--success)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <h2 class="email-success-title">You're on the list.</h2>
  <p class="email-success-desc">We'll notify you when AETHER launches. Check your inbox for confirmation.</p>
  <a href="#share" class="email-success-share" aria-label="Share AETHER with a friend">Tell a friend &rarr;</a>
</div>

- CheckCircle icon: 32px, var(--success) #34d399 stroke.
- Title: Syne SemiBold (600) 1.25rem (20px) var(--text-primary) #f1f0ff. 4px gap below icon.
- Description: DM Sans Regular (400) 0.875rem (14px) var(--text-secondary) #9492b0. 4px gap below title.
- "Tell a friend" link: DM Sans Medium (500) 0.8125rem (13px) var(--accent-primary) #7c3aed. 16px gap below description.
  - Hover: color var(--accent-bright) #a855f7.
  - Focus-visible: outline 2px solid var(--accent-bright), outline-offset 2px, border-radius 2px.
  - Opens share/copy-link modal or clipboard.

---

### SOCIAL PROOF (32px below form/card)

<div class="social-proof" aria-label="Waitlist social proof">
  <div class="avatar-stack" aria-hidden="true">
    <!-- 5 overlapping avatar circles -->
    <span class="avatar" style="background: var(--accent-primary); z-index: 5;">JM</span>
    <span class="avatar" style="background: var(--success); z-index: 4;">AC</span>
    <span class="avatar" style="background: var(--warning); z-index: 3;">RS</span>
    <span class="avatar" style="background: var(--error); z-index: 2;">KL</span>
    <span class="avatar" style="background: var(--text-secondary); z-index: 1;">DT</span>
    <span class="avatar-count">+2,395</span>
  </div>
  <p class="social-proof-text">Join 2,400+ Filipinos already on the waitlist</p>
</div>

- .social-proof: display flex, flex-direction column, align-items center, gap 8px.
- .avatar-stack: display flex, align-items center.
- .avatar: 32px width, 32px height, border-radius 50%, margin-left -8px (first child margin-left 0), display flex, align-items center, justify-content center, Syne Bold 0.625rem #fff, 2px border var(--bg-primary) #08080f.
- .avatar-count: glass pill -- background var(--glass-bg), border 1px solid var(--glass-border), backdrop-filter blur(8px), padding 4px 10px, border-radius 999px, margin-left -4px, DM Sans Medium 0.75rem var(--text-muted) #4e4c6a.
- .social-proof-text: DM Sans Medium (500) 0.8125rem (13px) var(--text-muted) #4e4c6a.

---

### FEATURE TEASER (40px below social proof, max-width 560px)

Three glassmorphism feature pills, horizontal, 8px gap, centered, flex-wrap: wrap, justify-content: center.

<div class="feature-pills" aria-label="Feature highlights">
  <span class="feature-pill">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.5l-3.7 1.8.7-4.1-3-2.9 4.2-.7L8 1z" stroke="var(--warning)" stroke-width="1.2" stroke-linejoin="round" fill="none"/>
    </svg>
    AI Advisor
  </span>
  <span class="feature-pill">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="var(--accent-primary)" stroke-width="1.2"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="var(--accent-primary)" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
    Glass Box Engine
  </span>
  <span class="feature-pill">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 12l4-4 3 3 5-6" stroke="var(--success)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    PSEi Benchmarks
  </span>
</div>

.feature-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.feature-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 8px 16px;
  font-family: var(--font-body); font-size: 0.8125rem; font-weight: 500;
  color: var(--text-secondary);
  transition: border-color 160ms ease;
}
.feature-pill:hover { border-color: var(--border-accent); }

- "AI Advisor" icon: Sparkles 14px var(--warning) #fbbf24 stroke.
- "Glass Box Engine" icon: Eye/Crosshair 14px var(--accent-primary) #7c3aed stroke.
- "PSEi Benchmarks" icon: TrendingUp 14px var(--success) #34d399 stroke.

---

### FOOTER (design-system standard -- identical across every page)

HTML:

<footer class="footer" role="contentinfo">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="/" class="nav-brand" aria-label="Home">
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect width="28" height="28" rx="8" fill="var(--accent-primary)"/>
          <path d="M8 14h12M14 8l6 6-6 6" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="nav-brand-name">AETHER</span>
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
      <span class="footer-copy">&copy; 2026 AETHER. All rights reserved.</span>
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

CSS:

.container { max-width: 1280px; margin: 0 auto; }
.footer {
  border-top: 1px solid var(--border); padding-top: 4rem;
  font-family: var(--font-body); position: relative; z-index: 1;
}
.footer-inner {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 3rem; flex-wrap: wrap; padding-bottom: 3rem;
  padding-left: clamp(1rem, 4vw, 2.5rem); padding-right: clamp(1rem, 4vw, 2.5rem);
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

---

### MOBILE RESPONSIVE (below 640px)

@media (max-width: 640px) {
  .page-wrapper { padding: 80px 20px 60px; }
  .page-center { max-width: 100%; }

  /* Headline shrinks */
  .hero-headline {
    font-size: 2rem; /* 32px */
  }

  /* Stack input + button vertically */
  .email-form-row {
    flex-direction: column;
  }
  .email-input, .email-submit {
    width: 100%;
  }

  /* Feature pills wrap naturally via flex-wrap */
  .feature-pills { gap: 6px; }

  /* Footer stacks */
  .footer-inner { flex-direction: column; gap: 2rem; }
  .footer-links { gap: 2rem; }
  .footer-bottom .container { flex-direction: column; gap: 1rem; text-align: center; }
}

---

### ACCESSIBILITY CHECKLIST (enforced)

- [x] `<html lang="en" style="color-scheme: dark;">`
- [x] `<meta name="theme-color" content="#08080f">`
- [x] Every icon button has aria-label
- [x] All decorative SVGs have aria-hidden="true"
- [x] focus-visible on all interactive elements using var(--accent-bright) #a855f7 ring
- [x] Semantic HTML: <button> for actions, <a> for navigation, <form> with proper labels
- [x] <label for="email-input"> (visually hidden via .sr-only)
- [x] Input has autocomplete="email", name="email", type="email"
- [x] Success state uses role="status" aria-live="polite"
- [x] Validation error uses role="alert" aria-live="polite"
- [x] Heading hierarchy: single h1 (headline), h2 for success title
- [x] @media (prefers-reduced-motion: reduce) disables all transitions/animations
- [x] NEVER use transition: all -- only specific properties (background, border-color, box-shadow, color, transform, opacity)
- [x] touch-action: manipulation on all buttons
- [x] text-wrap: balance on headline
- [x] text-pretty: auto on body copy
- [x] min-width: 0 on flex children with text (email input)
- [x] No particles, no autoplay video, no complex animations

---

### KEY DESIGN NOTES

- This is a SINGLE-PURPOSE page -- email capture only
- No feature sections, no pricing -- just trust and conversion
- Vertically centered content creates a "login page" feel -- familiar and focused
- The waitlist number creates urgency and social proof
- Feature pills are just teasers -- not clickable, just reinforcing what AETHER does
- Success state is immediate, inline (role="status") -- no modal, no redirect
- Warning amber badge + violet CTA creates visual hierarchy: attention then action
- Glass card around the form creates a focal glass panel effect
- Background glow blobs add depth without distraction
- Navbar and footer are design-system-standard components (identical to all other pages)
- Fonts: Syne for headings/brand, DM Sans for body/UI. NEVER Inter.
- Border-radius: 8px buttons/inputs, 12px pills, 16px cards, 999px badges
- All colors from the design-system dark palette. No light theme variant.
```
