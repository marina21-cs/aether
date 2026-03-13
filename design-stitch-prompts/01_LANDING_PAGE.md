# 01 — Landing Page — AETHER (Enterprise Web Edition)

> **Navigation:** This is the entry point → Next: [02 Onboarding & Auth](./02_ONBOARDING_AUTH.md)
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Platform:** Web-first (1440px), dark-mode-first. Enterprise terminal-grade aesthetic.

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design a premium enterprise landing page for "AETHER", a next-generation wealth management platform built for Filipino retail investors — displayed at 1440px desktop width on a dark theme.

**Overall Aesthetic:** Enterprise terminal-grade with modern Dark SaaS marketing polish. Think Bloomberg Terminal meets Linear precision with selective fintech presentation trends: glassmorphism surfaces, subtle neomorphism-adjacent depth, bento-grid composition, and one premium 3D hero object. The page should feel like it belongs to a platform that competes with COL Financial and Bloomberg, not Mint or YNAB. Deep navy-black canvas, electric blue accents, precise typography, data-forward presentation.

**Design Style Lock (same Aether colors, non-negotiable):**
- Style family: Fintech Dark UI + SaaS Marketing Page + Glassmorphism UI + 3D Hero Design.
- Keep the existing palette exactly: base `#0A0F1E`, surface `#111827`, border `#1E293B`, primary `#2D7FF9`, AI amber `#F59E0B`, gain green `#00C896`, text `#E2E8F0/#94A3B8`.
- Neon/acid-green behavior: use ONLY `#00C896` for KPI positives, active growth indicators, and selective glow accents; never replace primary blue CTA color.
- Glassmorphism behavior: frosted cards use dark translucent fills (`rgba(17,24,39,0.55-0.75)`), blur 10-16px, 1px border `rgba(148,163,184,0.18)`, plus subtle inner highlight.
- Depth behavior: neomorphism-adjacent layering via soft dual shadows; avoid pillowy consumer look.
- Layout behavior: hero and supporting modules should follow a disciplined bento-grid rhythm (modular blocks, consistent gutters), not random floating cards.

**Background & Canvas:** Deep navy-black `#0A0F1E` as the base canvas. A very subtle mesh gradient in the hero area only: a 400px blurred circle of `#2D7FF9` at 3% opacity top-left, intersecting with a 300px blurred circle of `#F59E0B` at 2% opacity center-right. The rest of the page is flat `#0A0F1E`. No grain texture.

**Navigation Bar (fixed, full width, height 64px, top of page):**
Background: `#0A0F1E` with `backdrop-filter: blur(12px)` and `rgba(10,15,30,0.8)` when scrolled. 1px bottom border `#1E293B`.
- Left: "AETHER" wordmark in Inter Bold 18px `#E2E8F0`, letter-spacing 0.08em, uppercase.
- Center: Horizontal nav links — "Product", "Features", "Pricing", "Documentation" — Inter Medium 14px `#94A3B8`, 32px gap. Hover: `#E2E8F0`.
- Right: "Sign In" in Inter Medium 14px `#94A3B8` (ghost link). 16px gap. "Get Early Access" button — `#2D7FF9` background, Inter SemiBold 14px `#FFFFFF`, height 40px, padding 0 20px, 0px border-radius.

**Hero Section (max-width 1120px centered, padding 120px top, 80px bottom):**
- Use a two-column hero composition:
  - Left (55%): overline, headline, subtext, CTA row, live data strip.
  - Right (45%): premium 3D hero visual (a realistic floating hand holding a dark Aether card) with controlled depth and shadow.
- 3D object style: photoreal premium fintech render, not cartoon. Card face uses `#111827` with 1px border `#1E293B`, chip detail in `#2D7FF9`, micro-accent glow in `#00C896` at low opacity.
- Add 2-3 floating glass mini-cards around the 3D object (PSEi, Net Worth, Risk) using the glass rules above; keep labels in Inter and values in IBM Plex Mono.
- Overline: "WEALTH INTELLIGENCE PLATFORM" in Inter Bold 11px `#2D7FF9`, letter-spacing 0.06em, uppercase. A small blue dot 6px `#2D7FF9` inline before the text.
- 16px gap.
- Headline: "Your net worth, to the peso." in Inter Bold 56px `#E2E8F0`, line-height 1.1, letter-spacing -0.02em. Max-width 720px.
- 16px gap.
- Subtext: "AETHER unifies your PSE stocks, crypto, real estate, and savings into one enterprise-grade financial operating system — with math you can audit." in Inter Regular 18px `#94A3B8`, line-height 1.6. Max-width 600px.
- 32px gap.
- Two buttons side by side, 12px gap:
  - Primary CTA: "Get Early Access" — `#2D7FF9` bg, `#FFFFFF` text, Inter SemiBold 14px, height 48px, padding 0 32px, 0px radius.
  - Secondary CTA: "View Live Demo" — transparent bg, `#2D7FF9` text, 1px border `#2D7FF9`, same dimensions.
- 48px gap.
- **Live Data Strip** — a horizontal row of 4 metrics inline, separated by 1px vertical `#1E293B` dividers. Render as a glass strip (dark translucent panel + blur) but keep typography/colors unchanged:
  - "12,400+" above "Filipino investors" — number in IBM Plex Mono Bold 24px `#E2E8F0`, label in Inter Regular 12px `#64748B`.
  - "₱3.2B" above "Assets tracked" — same styling.
  - "99.9%" above "Uptime SLA" — same.
  - "< 200ms" above "API response" — same.
  Each metric block: 160px wide, centered.

**Bento Product Section (max-width 1120px centered, padding 64px vertical):**
Use a 12-column bento grid with 24px gutters.
- Tile A (span 8): Main product screenshot card: `#111827` bg, 1px border `#1E293B`, 4px radius, 2px top border `#2D7FF9`.
  Inside: AETHER Dashboard screenshot (dark theme) with net worth hero `₱4,287,650.00` prominent in IBM Plex Mono Bold 48px.
- Tile B (span 4): "Why Aether" glass card with 3 bullets (Auditability, PH market context, Unified assets).
- Tile C (span 4): KPI card with "+3.06% Monthly Net Worth" and sparkline in `#00C896`.
- Tile D (span 8): Compact holdings/fees preview table tile with thin dividers.
- All bento tiles keep 4px radius, 1px borders, and the same typography rules.

**Problem Section (max-width 960px centered, padding 64px vertical):**
- Overline: "THE PROBLEM" in Inter Bold 11px `#FF4D6A`, letter-spacing 0.06em, uppercase.
- 12px gap.
- Section title: "Your wealth is scattered across 5+ platforms." in Inter Bold 32px `#E2E8F0`.
- 24px gap.
- Five problem rows stacked vertically, 1px bottom border `#1E293B` each, padding 16px 0:
  - Each row: Number "01"–"05" in IBM Plex Mono Bold 14px `#64748B`, 24px right gap. Problem title in Inter SemiBold 16px `#E2E8F0`. Below title: one-line description in Inter Regular 14px `#94A3B8`.
  Problems: "No single source of truth", "Global AI tools are blind to PH markets", "Black-box advisors erode trust", "Hidden fees silently destroy wealth", "No way to test financial decisions safely".

**Features Section (max-width 1120px centered, padding 64px vertical):**
- Overline: "WHAT AETHER DOES" in Inter Bold 11px `#2D7FF9`.
- 12px gap.
- Title: "7 core features. Zero black boxes." in Inter Bold 32px `#E2E8F0`.
- 32px gap.
- Three flagship feature cards in a 3-column bento-aligned grid, 24px gap. Use subtle glassmorphism on card surfaces while preserving existing border and top-accent colors.

  **Card 1 — AI Advisor:**
  `#111827` bg, 1px border `#1E293B`, 4px radius, 24px padding.
  - Top: 2px top border `#F59E0B` (amber — AI accent).
  - Brain icon (Lucide, 20px, `#F59E0B`) at top.
  - 12px gap.
  - Title: "AI Financial Advisor" in Inter SemiBold 18px `#E2E8F0`.
  - 8px gap.
  - Body: "Ask about PSEi index funds and get answers grounded in your actual portfolio, current BSP rates, and Philippine inflation data — not generic global opinions." in Inter Regular 14px `#94A3B8`, line-height 1.6.
  - 16px gap.
  - Tag: "TIER 1 · FLAGSHIP" in Inter Bold 11px `#F59E0B`, bg `rgba(245,158,11,0.12)`, padding 4px 8px, 4px radius.

  **Card 2 — Glass Box Engine:**
  Same card structure, 2px top border `#2D7FF9`.
  - Chart-bar icon 20px `#2D7FF9`.
  - Title: "Glass Box Predictive Engine"
  - Body: "See the covariance matrix, the Monte Carlo distribution, and every assumption behind your portfolio forecast. Audit the math yourself."
  - Tag in `#2D7FF9` with blue tint bg.

  **Card 3 — Sandbox Simulator:**
  Same structure, 2px top border `#00C896`.
  - FlaskConical icon 20px `#00C896`.
  - Title: "Sandbox Wealth Simulator"
  - Body: "Test 'What if I sell stocks and buy a condo?' without risking a single peso. Full net worth projections over 10 years."
  - Tag in `#00C896` with green tint bg.

**How It Works Section (max-width 960px centered, padding 64px vertical, 1px top border `#1E293B`):**
- Overline: "HOW IT WORKS" in Inter Bold 11px `#64748B`.
- 12px gap.
- Title: "Three steps to financial clarity." in Inter Bold 32px `#E2E8F0`.
- 32px gap.
- Three steps in a horizontal row, connected by a 1px horizontal line in `#1E293B`:
  - Step 1: Number "01" in IBM Plex Mono Bold 16px `#2D7FF9`. Below: "Import your portfolio" Inter SemiBold 16px `#E2E8F0`. Below: "Upload your COL Financial CSV, add crypto and real estate — unified instantly." Inter Regular 14px `#94A3B8`.
  - Step 2: "02" in `#2D7FF9`. "See your real net worth". "Every asset, liability, and hidden fee — unified."
  - Step 3: "03" in `#2D7FF9`. "Get AI-powered insights". "Ask questions, run simulations, make decisions."
  Each step: equal column width, 24px gap.

**CTA Banner (max-width 1120px centered, padding 64px vertical):**
A full-width card: `#111827` bg, 1px border `#1E293B`, 4px radius, padding 48px, text centered.
- Headline: "Stop guessing. Start seeing." in Inter Bold 32px `#E2E8F0`.
- 12px gap.
- Subtext: "Join 12,400+ Filipinos managing their wealth with full transparency." in Inter Regular 16px `#94A3B8`.
- 32px gap.
- CTA: "Get Early Access" — `#2D7FF9` bg, `#FFFFFF` text, Inter SemiBold 14px, height 48px, padding 0 32px, 0px radius.

**Footer (full width, `#111827` bg, 1px top border `#1E293B`, padding 48px):**
Max-width 1120px centered.
- Top row: "AETHER" wordmark Inter Bold 16px `#E2E8F0`, letter-spacing 0.08em. Right: four column groups of links.
- Four columns — "Product", "Company", "Legal", "Connect" — each column heading in Inter SemiBold 12px `#64748B` uppercase, links in Inter Regular 14px `#94A3B8`, 8px gap between links. Hover: `#E2E8F0`.
- 32px gap.
- Bottom line: "© 2026 AETHER. Built in the Philippines." in Inter Regular 12px `#475569`.

**Key Design Notes:**
- Dark-mode-first: `#0A0F1E` base, `#111827` surfaces, thin `#1E293B` borders
- Web-first: full 1440px layout, no mobile compromises in primary design
- Typography: Inter for all UI text, IBM Plex Mono for ALL numbers — numbers must feel precise
- Color: dominant deep navy canvas, electric blue `#2D7FF9` for primary, amber `#F59E0B` for AI, `#00C896` for gains
- Include one premium 3D hero object (floating hand + Aether card) and bento grid structure; avoid cartoonish illustration styles
- Net worth number visible in product screenshot — hero of the product
- Data strip with real metrics immediately signals enterprise quality
- Micro-interaction: numbers in data strip animate/count up on scroll into view
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER landing page in LIGHT THEME at 1440px.

**Background:** Cool white `#F8FAFC`. No grain.

**Nav Bar:** `#F8FAFC` with `backdrop-filter: blur(12px)`. 1px bottom border `#E2E8F0`. "AETHER" in `#0F172A`. Nav links `#64748B`, hover `#0F172A`. "Get Early Access" button: `#2563EB` bg, `#FFFFFF` text.

**Hero:**
Overline: `#2563EB`. Headline: `#0F172A`. Subtext: `#64748B`. Mesh gradient: blue at 4% opacity, amber at 2%.
Primary CTA: `#2563EB` bg. Secondary: `#2563EB` border and text.
Data strip: numbers `#0F172A` IBM Plex Mono Bold 24px. Labels `#94A3B8`. Dividers `#E2E8F0`.
Keep the same two-column hero composition from dark theme, including the premium 3D hand + card object and floating mini-cards; only invert card/background colors for light mode.

**Bento Product Section:** Keep the same bento tile layout and spans as dark theme. Cards `#FFFFFF` bg, 1px border `#E2E8F0`, primary tile top border `#2563EB`. Show dark-theme dashboard inside (dark screenshot on light page for contrast).

**Problem:** Overline `#DC2626`. Title `#0F172A`. Row borders `#E2E8F0`. Numbers `#94A3B8`. Titles `#0F172A`. Descriptions `#64748B`.

**Features:** Cards `#FFFFFF` bg, 1px border `#E2E8F0`. AI card top border `#F59E0B`. Engine top border `#2563EB`. Simulator top border `#059669`. Titles `#0F172A`. Body `#64748B`.

**How It Works:** Connecting line `#E2E8F0`. Step numbers `#2563EB`. Titles `#0F172A`. Descriptions `#64748B`.

**CTA Banner:** Card `#0F172A` bg (dark on light for impact), 1px border `#1E293B`. Headline `#E2E8F0`. Subtext `#94A3B8`. CTA: `#2D7FF9` bg, `#FFFFFF` text.

**Footer:** `#F8FAFC` bg, 1px top border `#E2E8F0`. Links `#64748B`. Hover `#0F172A`. Copyright `#94A3B8`.

**Key Light Theme Notes:**
- `#F8FAFC` base, `#FFFFFF` card surfaces, `#E2E8F0` borders
- Product screenshot still shows dark-theme dashboard — this IS the product aesthetic
- CTA banner inverts to dark `#0F172A` for visual impact in the light context
- Deeper blue `#2563EB` for better contrast on light backgrounds
- Preserve the exact same Dark SaaS + Glassmorphism + Bento + 3D hero structure from dark theme; only colors invert
```
