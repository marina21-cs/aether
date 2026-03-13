# 10 — Settings & Profile — AETHER (Enterprise Web Edition)

> **Navigation:** Previous: [09 Performance](./09_PERFORMANCE_HISTORY.md) → Next: [11 Email Registration](./11_EMAIL_REGISTRATION.md)
> **Also accessible from:** Sidebar "Settings" + avatar dropdown
> **Connects to:** 00_DESIGN_SYSTEM.md for all tokens
> **Features covered:** Feature 6 (Settings & Profile) + V1.1: Price Alerts, Multi-Currency Toggle + V2: Emergency Access, Offline Mode

---

## DARK THEME — Web (1440px)

### Prompt (copy below)

```
Design the Settings & Profile screen for "AETHER", a wealth management platform — displayed at 1440px desktop width. Grouped settings sections with clear hierarchy. Controls include toggles, selects, and action buttons. Enterprise terminal-grade. This is the "control panel" — clean and functional, not decorative.

**Background:** `#0A0F1E`.

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
  4. Brain icon + "AI Advisor" — inactive. Amber dot 6px beside label.
  5. Eye icon + "Glass Box" — inactive.
  6. FlaskConical icon + "Simulator" — inactive. "V1.1" tag Inter Bold 9px `#475569`.
  7. AlertTriangle icon + "Fee Scanner" — inactive.
  8. TrendingUp icon + "Performance" — inactive.
- 24px gap.
- Section label: "SETTINGS" Inter Bold 11px `#475569`. 8px gap.
  9. Settings icon + "Settings" — **ACTIVE**.
- Bottom (padding 16px): "NET WORTH" Inter Bold 10px `#475569`, letter-spacing 0.06em. Below: "₱4,287,650" IBM Plex Mono Bold 18px `#E2E8F0`. Below: "▲ +3.06%" IBM Plex Mono Medium 12px `#00C896`.

**APP CHROME CONSISTENCY LOCK (Stitch, non-negotiable):**
- Keep sidebar geometry EXACTLY: 240px width, fixed left, same paddings/gaps/order/items as listed above. Never add/remove/reorder nav items.
- Keep icon system EXACTLY: Lucide icons, 18px nav icons, 1.5px stroke, left-aligned with 10px icon-label gap. No icon substitutions.
- Keep color behavior EXACTLY: active nav always blue (`#2D7FF9` border/icon + `rgba(45,127,249,0.08)` bg), inactive `#94A3B8`, hover `#1A2035`. Do not recolor active nav by feature.
- Keep page header shell EXACTLY across app screens: top title row + optional right action, then muted metadata/subtitle row, then 1px divider `#1E293B`, then content blocks.
- Keep foundational tokens EXACTLY: corner radius 4px for cards/buttons/chips, 1px borders, Inter for UI copy, IBM Plex Mono for all numeric values.
- If any screen-specific styling conflicts with this lock, follow this lock.

**Main Content (padding 32px, max-width 800px, left-aligned):**

**Profile Card (top, `#111827` bg, 1px border `#1E293B`, 4px radius, padding 20px):**
- Left: 56px avatar circle `#1A2035`, user initials "JD" Inter Bold 20px `#2D7FF9`.
- Right of avatar (12px gap):
  - "Juan Dela Cruz" Inter SemiBold 18px `#E2E8F0`.
  - "juan@email.com" Inter Regular 13px `#475569`.
  - "Member since Mar 2026 · Free Plan" Inter Regular 12px `#64748B`.
- Far right (stacked): "Upgrade to Pro" Inter Medium 13px `#F59E0B` button, `transparent` bg, 1px border `#F59E0B`, 32px h, 4px radius. Below: "Edit profile" Inter Medium 13px `#2D7FF9`, right arrow 14px.

---

### SETTINGS GROUPS
Each group: 24px top gap.
- Group label: Inter SemiBold 11px `#64748B` uppercase tracking 0.5px, 8px bottom gap.
- Card: `#111827` bg, 1px border `#1E293B`, 4px radius.
- Rows: padding 14px 16px, 1px `#1E293B` dividers between rows.
- Row layout: icon 16px left + label Inter Regular 14px `#E2E8F0` + description Inter Regular 12px `#475569` below label — value/control right-aligned.

---

**GROUP 1: INVESTMENT PROFILE**

Row 1: User 16px `#64748B` → "Risk Tolerance" / "Moderate Growth" → Chevron `#475569`.
Row 2: Target 16px `#64748B` → "Investment Horizon" / "10+ years" → Chevron.
Row 3: DollarSign 16px `#64748B` → "Monthly Contribution" / "₱25,000" IBM Plex Mono 13px → Chevron.
Row 4: TrendingUp 16px `#64748B` → "Benchmark" / "PSEi + BTC blend" → Chevron.

**GROUP 2: ACCOUNTS & DATA**

Row 1: Link 16px `#64748B` → "Import Sources" / "2 CSV imports · 5 manual entries" → "Manage" `#2D7FF9`.
Row 2: Upload 16px `#64748B` → "Import Data" / "CSV upload, manual entry" → "Import" `#2D7FF9`.
Row 3: Download 16px `#64748B` → "Export All Data" / "Full portfolio backup" → "Export" `#2D7FF9`.
Row 4: RefreshCw 16px `#64748B` → "Offline Mode" / "Cache portfolio data locally" → Toggle OFF `#1E293B`. Badge: "V2" Inter Bold 9px `#F59E0B` bg `rgba(245,158,11,0.12)` 4px radius, padding 1px 6px.

**GROUP 3: APPEARANCE**

Row 1: Moon 16px `#64748B` → "Theme" / "Dark" → Segmented: "Light | Dark | System" — Active "Dark": `#2D7FF9` bg `#FFFFFF` text, 0px radius, 28px height. Inactive: `#1A2035` bg `#475569` text.
Row 2: Globe 16px `#64748B` → "Language" / "English" → Chevron.
Row 3: DollarSign 16px `#64748B` → "Display Currency" / "₱ PHP" → Chevron.
Row 4: Hash 16px `#64748B` → "Number Format" / "1,234,567.89" → Chevron.

**GROUP 4: NOTIFICATIONS**

Row 1: Bell 16px `#64748B` → "Push Notifications" / "Market alerts, AI insights" → Toggle ON `#00C896`.
Row 2: Mail 16px `#64748B` → "Email Digest" / "Weekly summary" → Chevron.
Row 3: AlertTriangle 16px `#64748B` → "Price Alerts" / "5 active" `#F59E0B` → Chevron (links to 09 Alerts tab). Badge: "V1.1" Inter Bold 9px `#2D7FF9` bg `rgba(45,127,249,0.12)` 4px radius.
Row 4: Activity 16px `#64748B` → "Quiet Hours" / "10 PM – 7 AM" → Chevron.

**GROUP 5: SECURITY & ACCESS**

Row 1: Shield 16px `#64748B` → "Two-Factor Auth" / "Enabled via authenticator" `#00C896` → Chevron.
Row 2: Key 16px `#64748B` → "Change Password" / "Last changed 30 days ago" → Chevron.
Row 3: Users 16px `#64748B` → "Emergency Access" / "1 trusted contact" → Chevron. Badge: "V2" Inter Bold 9px `#F59E0B` bg `rgba(245,158,11,0.12)` 4px radius.
  - Description below: "Grants read-only access after 7-day inactivity" Inter Regular 12px `#475569`.
Row 4: Smartphone 16px `#64748B` → "Active Sessions" / "2 devices" → "View" `#2D7FF9`.

**GROUP 6: ABOUT & LEGAL**

Row 1: Info 16px `#64748B` → "Version" / "1.0.0 (build 2026.03)" Inter Regular 13px `#475569` → no control.
Row 2: FileText 16px `#64748B` → "Terms of Service" → ExternalLink 14px `#475569`.
Row 3: FileText 16px `#64748B` → "Privacy Policy" → ExternalLink.
Row 4: MessageCircle 16px `#64748B` → "Send Feedback" → ExternalLink.

**DANGER ZONE (32px top gap):**
- "DANGER ZONE" Inter SemiBold 11px `#FF4D6A` uppercase.
- Card: `#111827` bg, 1px border `#FF4D6A` at 30% opacity, 4px radius.
- Row 1: Pause 16px `#FF4D6A` → "Deactivate Account" Inter Regular 14px `#E2E8F0` / "Temporarily disable your account" → "Deactivate" button: `transparent` bg, 1px border `#FF4D6A`, `#FF4D6A` text, Inter Medium 13px, 32px h, 4px radius.
- Row 2: Trash2 16px `#FF4D6A` → "Delete Account" / "Permanently remove all data" → "Delete" button: `#FF4D6A` bg, `#FFFFFF` text, same style.

**Key Design Notes:**
- Settings page is utilitarian — clean rows, no cards-within-cards, no decorative elements
- Max-width 800px keeps settings readable — not stretched across full panel
- All financial values in IBM Plex Mono
- Toggle styling: 40px × 20px, ON = `#00C896` track, OFF = `#1E293B` track
- Segmented control for theme matches the chip style from other screens
- Danger zone uses red border at low opacity — visible but not alarming until hovered
- Emergency access is a premium Philippine market feature — visible but not buried
- Chevron `#475569` on all rows that navigate to sub-screens
- Row hover: bg → `#1A2035`
```

---

## LIGHT THEME — Web (1440px)

### Prompt (copy below)

```
Design the same AETHER Settings & Profile screen in LIGHT THEME at 1440px. Max-width 800px.

**Background:** `#F8FAFC`. Use the exact same 9-item sidebar structure, order, spacing, and placement as the dark-theme sidebar above; only switch to light colors.

**Profile card:** `#FFFFFF` bg, `#E2E8F0` border. Name `#0F172A`. Email `#64748B`. Initials `#2563EB` on `#EFF6FF` circle.

**Group labels:** `#94A3B8` uppercase.

**Setting cards:** `#FFFFFF` bg, `#E2E8F0` border.
- Row text: `#0F172A`. Description: `#94A3B8`. Icons: `#94A3B8`. Hover: `#F8FAFC`.
- Value text: `#64748B`. Links: `#2563EB`.
- Toggle ON: `#059669`. Toggle OFF: `#E2E8F0`.
- Theme segmented: Active `#2563EB` bg, `#FFFFFF` text. Inactive `#F1F5F9` bg, `#64748B` text.
- Chevron: `#CBD5E1`.

**Danger zone:** `#FFFFFF` bg, `#FEE2E2` border. Text `#DC2626`. "Deactivate": `#DC2626` border+text. "Delete": `#DC2626` bg, `#FFFFFF` text.
```
