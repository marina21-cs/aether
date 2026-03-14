# 10 — Settings & Profile — AETHER (Dark Mode SaaS — Glassmorphism + Bento Grid)

> **Navigation:** Previous: [09 Performance](./09_PERFORMANCE_HISTORY.md) → Next: [11 Email Registration](./11_EMAIL_REGISTRATION.md)
> **Also accessible from:** Sidebar "Settings" + avatar dropdown
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 6 (Settings & Profile) + V1.1: Price Alerts, Multi-Currency Toggle + V2: Emergency Access, Offline Mode

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Settings & Profile screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. Dark Mode SaaS aesthetic with glassmorphism panels and bento grid layout sensibility. Grouped settings sections with clear hierarchy. Controls include toggles, selects, and action buttons. This is the "control panel" — clean and functional with a modern glass-layered depth, not flat or decorative.

**Global HTML & Meta:**
- `<meta name="theme-color" content="#08080f">`
- `color-scheme: dark;` on `:root`.

**Fonts (Google Fonts):**
- Headings / nav labels / section titles: Syne (Bold, SemiBold).
- Body / descriptions / controls: DM Sans (Regular, Medium, SemiBold).
- Numeric values: DM Sans with `font-variant-numeric: tabular-nums;`.
- NEVER use Inter or IBM Plex Mono anywhere in this design.

**Background:** `#08080f`.

**Background Glow Blobs (CSS, behind all content, z-index 0):**
- Top-left: radial-gradient ellipse, `rgba(124,58,237,0.08)` center → transparent, ~600px wide, positioned at (-5%, 10%).
- Bottom-right: radial-gradient ellipse, `rgba(124,58,237,0.05)` center → transparent, ~500px wide, positioned at (90%, 80%).
- Both use `position: fixed; pointer-events: none; filter: blur(80px);`.

**Left Sidebar (fixed, 240px width, full height):**
`#13131f` bg, `backdrop-filter: blur(16px)`, 1px right border `rgba(255,255,255,0.06)`, `border-radius: 0`.
- Top (24px padding): "AETHER" Syne Bold 16px `#f1f0ff`, letter-spacing 0.08em, uppercase.
- 32px gap.
- Section label: "MAIN" Syne Bold 11px `#4e4c6a`, letter-spacing 0.06em, padding 0 16px. 8px gap.
- Nav items (40px height, 12px horizontal padding, 8px radius). Inactive: `#9492b0`, hover bg `#1a1a2e`. Active: `#f1f0ff` text, icon `#7c3aed`, left 2px border `#7c3aed`, bg `rgba(124,58,237,0.08)`.
  1. Home icon 18px + "Dashboard" DM Sans Medium 14px — inactive.
  2. BarChart3 icon + "Portfolio" — inactive.
  3. Upload icon + "Import Data" — inactive.
- 24px gap.
- Section label: "ANALYSIS" Syne Bold 11px `#4e4c6a`. 8px gap.
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px `#fbbf24` beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Syne Bold 9px `#4e4c6a`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Syne Bold 11px `#4e4c6a`. 8px gap.
  9. Settings icon + "Settings" — **ACTIVE**.
- Bottom (padding 16px): "NET WORTH" Syne Bold 10px `#4e4c6a`, letter-spacing 0.06em. Below: "₱4,287,650" DM Sans Bold 18px `#f1f0ff` `font-variant-numeric: tabular-nums`. Below: "▲ +3.06%" DM Sans Medium 12px `#34d399` `font-variant-numeric: tabular-nums`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always purple (`#7c3aed` border/icon + `rgba(124,58,237,0.08)` bg), inactive `#9492b0`, hover `#1a1a2e`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `rgba(255,255,255,0.06)`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 16px for cards/panels, 8px for buttons/chips/nav-items, 1px borders `rgba(255,255,255,0.06)`, Syne for headings/labels, DM Sans for body/UI copy, DM Sans tabular-nums for all numeric values. NEVER use Inter or IBM Plex Mono.
- All card/panel surfaces use glassmorphism: `backdrop-filter: blur(16px); background: rgba(19,19,31,0.6); border: 1px solid rgba(255,255,255,0.06);`.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content (padding 32px, max-width 800px, left-aligned):**

**Profile Card (top):**
Glassmorphism: `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 20px;`.
- Left: 56px avatar circle `#1a1a2e` `border: 1px solid rgba(168,85,247,0.18)`, user initials "JD" Syne Bold 20px `#7c3aed`.
- Right of avatar (12px gap):
  - "Juan Dela Cruz" Syne SemiBold 18px `#f1f0ff`.
  - "juan@email.com" DM Sans Regular 13px `#4e4c6a`.
  - "Member since Mar 2026 · Free Plan" DM Sans Regular 12px `#4e4c6a`.
- Far right (stacked): "Upgrade to Pro" DM Sans Medium 13px `#fbbf24` button, `transparent` bg, 1px border `#fbbf24`, 32px h, 8px radius. Below: "Edit profile" DM Sans Medium 13px `#7c3aed`, right arrow 14px.

---

### SETTINGS GROUPS
Each group: 24px top gap.
- Group label: Syne SemiBold 11px `#4e4c6a` uppercase tracking 0.5px, 8px bottom gap.
- Card: glassmorphism — `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;`.
- Rows: padding 14px 16px, 1px `rgba(255,255,255,0.06)` dividers between rows.
- Row layout: icon 16px left + label DM Sans Regular 14px `#f1f0ff` + description DM Sans Regular 12px `#4e4c6a` below label — value/control right-aligned.

---

**GROUP 1: INVESTMENT PROFILE**

Row 1: User 16px `#4e4c6a` → "Risk Tolerance" / "Moderate Growth" → Chevron `#4e4c6a`.
Row 2: Target 16px `#4e4c6a` → "Investment Horizon" / "10+ years" → Chevron.
Row 3: DollarSign 16px `#4e4c6a` → "Monthly Contribution" / "₱25,000" DM Sans 13px `font-variant-numeric: tabular-nums` → Chevron.
Row 4: TrendingUp 16px `#4e4c6a` → "Benchmark" / "PSEi + BTC blend" → Chevron.

**GROUP 2: ACCOUNTS & DATA**

Row 1: Link 16px `#4e4c6a` → "Import Sources" / "2 CSV imports · 5 manual entries" → "Manage" `#7c3aed`.
Row 2: Upload 16px `#4e4c6a` → "Import Data" / "CSV upload, manual entry" → "Import" `#7c3aed`.
Row 3: Download 16px `#4e4c6a` → "Export All Data" / "Full portfolio backup" → "Export" `#7c3aed`.
Row 4: RefreshCw 16px `#4e4c6a` → "Offline Mode" / "Cache portfolio data locally" → Toggle OFF `rgba(255,255,255,0.06)`. Badge: "V2" Syne Bold 9px `#fbbf24` bg `rgba(251,191,36,0.12)` 8px radius, padding 1px 6px.

**GROUP 3: APPEARANCE**

Row 1: Moon 16px `#4e4c6a` → "Theme" / "Dark" → Segmented: "Light | Dark | System" — Active "Dark": `#7c3aed` bg `#FFFFFF` text, 8px radius, 28px height. Inactive: `#1a1a2e` bg `#4e4c6a` text.
Row 2: Globe 16px `#4e4c6a` → "Language" / "English" → Chevron.
Row 3: DollarSign 16px `#4e4c6a` → "Display Currency" / "₱ PHP" → Chevron.
Row 4: Hash 16px `#4e4c6a` → "Number Format" / "1,234,567.89" → Chevron.

**GROUP 4: NOTIFICATIONS**

Row 1: Bell 16px `#4e4c6a` → "Push Notifications" / "Market alerts, AI insights" → Toggle ON `#34d399`.
Row 2: Mail 16px `#4e4c6a` → "Email Digest" / "Weekly summary" → Chevron.
Row 3: AlertTriangle 16px `#4e4c6a` → "Price Alerts" / "5 active" `#fbbf24` → Chevron (links to 09 Alerts tab). Badge: "V1.1" Syne Bold 9px `#7c3aed` bg `rgba(124,58,237,0.12)` 8px radius.
Row 4: Activity 16px `#4e4c6a` → "Quiet Hours" / "10 PM – 7 AM" → Chevron.

**GROUP 5: SECURITY & ACCESS**

Row 1: Shield 16px `#4e4c6a` → "Two-Factor Auth" / "Enabled via authenticator" `#34d399` → Chevron.
Row 2: Key 16px `#4e4c6a` → "Change Password" / "Last changed 30 days ago" → Chevron.
Row 3: Users 16px `#4e4c6a` → "Emergency Access" / "1 trusted contact" → Chevron. Badge: "V2" Syne Bold 9px `#fbbf24` bg `rgba(251,191,36,0.12)` 8px radius.
  - Description below: "Grants read-only access after 7-day inactivity" DM Sans Regular 12px `#4e4c6a`.
Row 4: Smartphone 16px `#4e4c6a` → "Active Sessions" / "2 devices" → "View" `#7c3aed`.

**GROUP 6: ABOUT & LEGAL**

Row 1: Info 16px `#4e4c6a` → "Version" / "1.0.0 (build 2026.03)" DM Sans Regular 13px `#4e4c6a` → no control.
Row 2: FileText 16px `#4e4c6a` → "Terms of Service" → ExternalLink 14px `#4e4c6a`.
Row 3: FileText 16px `#4e4c6a` → "Privacy Policy" → ExternalLink.
Row 4: MessageCircle 16px `#4e4c6a` → "Send Feedback" → ExternalLink.

**DANGER ZONE (32px top gap):**
- "DANGER ZONE" Syne SemiBold 11px `#f87171` uppercase.
- Card: glassmorphism — `background: rgba(19,19,31,0.6); backdrop-filter: blur(16px); border: 1px solid rgba(248,113,113,0.30); border-radius: 16px;`.
- Row 1: Pause 16px `#f87171` → "Deactivate Account" DM Sans Regular 14px `#f1f0ff` / "Temporarily disable your account" → "Deactivate" button: `transparent` bg, 1px border `#f87171`, `#f87171` text, DM Sans Medium 13px, 32px h, 8px radius.
- Row 2: Trash2 16px `#f87171` → "Delete Account" / "Permanently remove all data" → "Delete" button: `#f87171` bg, `#FFFFFF` text, same style.

---

### ACCESSIBILITY CHECKLIST

- **Color contrast:** All text passes WCAG 2.1 AA minimum. `#f1f0ff` on `#08080f` ≥ 15.7:1. `#9492b0` on `#08080f` ≥ 5.2:1. `#4e4c6a` on `#08080f` ≥ 3.1:1 (used only for supplementary/description text at 12px+, not primary content).
- **Focus indicators:** All interactive elements (toggles, buttons, links, segmented controls, nav items) show a 2px solid `#7c3aed` outline with 2px offset on `:focus-visible`. Focus ring must not be clipped by `overflow: hidden`.
- **Keyboard navigation:** Full tab order through sidebar nav → profile card actions → each settings row control (toggles, chevrons, action buttons) → danger zone buttons. Segmented control uses arrow keys for internal navigation.
- **Touch targets:** All interactive rows are minimum 44px tall. Toggle hit area is at least 44×44px. Buttons are minimum 32px height × 44px width.
- **Screen reader support:** Toggles use `role="switch"` with `aria-checked`. Segmented control uses `role="radiogroup"` with `role="radio"` children and `aria-checked`. Chevron rows use `role="button"` or are wrapped in `<button>`. Badge labels ("V1.1", "V2") use `aria-label` for context (e.g., `aria-label="Available in version 2"`). Danger zone section uses `aria-labelledby` pointing to the "DANGER ZONE" heading.
- **Reduced motion:** All backdrop-filter blur transitions and glow blob animations respect `prefers-reduced-motion: reduce` — disable transitions or set `transition-duration: 0.01ms`.
- **Color independence:** Toggle ON/OFF states are distinguishable by position (left/right) in addition to color. Status text ("Enabled", active count) provides textual confirmation beyond color alone.
- **Semantic structure:** Settings groups use `<section>` with `aria-labelledby` pointing to group heading. Danger zone is a `<section>` with `role="region"` and explicit label. Page title uses `<h1>`, group labels use `<h2>`.

---

### KEY DESIGN NOTES

- Settings page is utilitarian — clean rows with glassmorphism depth, no cards-within-cards, no decorative illustrations.
- Max-width 800px keeps settings readable — not stretched across full panel.
- All financial values use DM Sans with `font-variant-numeric: tabular-nums` — never IBM Plex Mono.
- Toggle styling: 40px × 20px, ON = `#34d399` track, OFF = `rgba(255,255,255,0.06)` track, 8px radius on track.
- Segmented control for theme: 8px radius, matches chip style from other screens.
- Danger zone uses `rgba(248,113,113,0.30)` border — visible but not alarming until hovered.
- Emergency access is a premium Philippine market feature — visible but not buried.
- Chevron `#4e4c6a` on all rows that navigate to sub-screens.
- Row hover: bg → `#1a1a2e`.
- Background glow blobs add subtle ambient depth without distracting from content.
- Glass panels create layered depth hierarchy: base `#08080f` → glow blobs → glass cards.
```
