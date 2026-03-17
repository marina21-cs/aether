# Phase 4 — Testing Guide

What to test for Phase 4 (Simulator + Alerts + Multi-Currency + Email Digest).

---

## 1. Sandbox Wealth Simulator

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.1 | Page renders | Navigate to Simulator | Isolated sandbox environment loads |
| 1.2 | Clone portfolio | Click "Start from current portfolio" | Sandbox populated with copy of real assets |
| 1.3 | Start fresh | Click "Start from scratch" | Empty sandbox |
| 1.4 | Add asset | Add asset in sandbox | Only appears in sandbox, not real portfolio |
| 1.5 | Remove asset | Remove asset in sandbox | Real portfolio unchanged |
| 1.6 | Adjust allocation | Drag slider or enter % | Allocation updates, projection recalculates |
| 1.7 | Change savings rate | Adjust monthly savings input | Projection path shifts upward |
| 1.8 | Add event | Click "Add event" → "Buy condo in 2 years" | Event annotation appears on timeline |
| 1.9 | Monte Carlo bands | Check projection chart | Confidence bands visible (10th/50th/90th) |
| 1.10 | Save scenario | Click "Save scenario" | Scenario persists with name and date |
| 1.11 | Load scenario | Select saved scenario | All scenario settings restored |
| 1.12 | Compare scenarios | Select 2+ scenarios | Side-by-side comparison view |
| 1.13 | Delete scenario | Delete saved scenario | Removed from list |
| 1.14 | Isolation check | Make changes in sandbox | Navigate to Dashboard — real portfolio unchanged |

---

## 2. Alert System

### 2.1 Alert Creation

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.1.1 | Create alert | Click "New Alert" | Form with trigger type selector |
| 2.1.2 | Stock price alert | Set JFC target price | Alert saved with type "stock_price_target" |
| 2.1.3 | PSEi threshold | Set PSEi > 7000 | Alert saved with type "psei_threshold" |
| 2.1.4 | Crypto volatility | Set BTC 24h change > 10% | Alert saved |
| 2.1.5 | Portfolio drop | Set portfolio drop > 5% | Alert saved |
| 2.1.6 | BSP rate change | Alert on any BSP rate change | Alert saved |
| 2.1.7 | Free tier limit | Create 11th alert (free user) | Error: "Maximum 10 alerts on Free tier" |
| 2.1.8 | Pro tier limit | Create 51st alert (pro user) | Error: limit reached |

### 2.2 Alert Management

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.2.1 | Toggle alert | Toggle switch off | Alert disabled (not checked) |
| 2.2.2 | Toggle back on | Toggle switch on | Alert re-enabled |
| 2.2.3 | Delete alert | Click delete | Alert removed with confirmation |
| 2.2.4 | Edit alert | Click edit | Form pre-filled, save updates |
| 2.2.5 | Alert history | View "History" tab | Past triggered alerts with timestamps |

### 2.3 Alert Triggering

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.3.1 | In-app notification | Price crosses threshold | Bell icon badge + notification in panel |
| 2.3.2 | Web push | Price crosses threshold (browser in background) | Push notification appears |
| 2.3.3 | Push permission | First alert creation | Browser prompts for push permission |
| 2.3.4 | Push denied | Deny push permission | In-app notifications still work |
| 2.3.5 | Edge function runs | Check Supabase Edge Function logs | Alert checker runs every 5 minutes |

---

## 3. Multi-Currency Display

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.1 | Currency toggle | Click PHP/USD/SGD selector | All values convert to selected currency |
| 3.2 | PHP default | Load dashboard | All values in PHP |
| 3.3 | USD display | Switch to USD | Net worth, holdings, all values in USD |
| 3.4 | SGD display | Switch to SGD | All values in SGD |
| 3.5 | Exchange rates | Check conversion | Uses BSP reference rates from price_cache |
| 3.6 | Foreign assets | Check asset with native USD | Shows original (USD) + converted (PHP) |
| 3.7 | Hover shows original | Hover on converted value | Tooltip shows original currency value |
| 3.8 | Charts update | Switch currency while viewing chart | Chart Y-axis updates to new currency |
| 3.9 | Persistence | Switch to USD, reload page | Stays in USD (saved to profile) |

---

## 4. Weekly Email Digest

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 4.1 | Template renders | Preview in browser | Email shows portfolio summary, top movers, alerts |
| 4.2 | Send test | Trigger manual send | Email arrives in inbox |
| 4.3 | Content correct | Check email content | Net worth, weekly change, top 3 movers, triggered alerts |
| 4.4 | Unsubscribe | Click unsubscribe link | Disables digest, confirmation page |
| 4.5 | Re-subscribe | Toggle in Settings | Re-enables weekly digest |
| 4.6 | Edge Function | Check Supabase Edge Function | Scheduled for Monday 8 AM PHT |
| 4.7 | No activity | User with no portfolio changes | "No changes this week" section in email |
| 4.8 | HTML rendering | Check in Gmail, Outlook, Apple Mail | Email displays correctly across clients |

---

## 5. Notification Center (In-App)

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 5.1 | Bell icon | Check header/navbar | Bell icon with unread badge count |
| 5.2 | Open panel | Click bell icon | Dropdown/panel shows notification list |
| 5.3 | Mark as read | Click on notification | Read state updates, badge decrements |
| 5.4 | Mark all read | Click "Mark all as read" | All notifications marked, badge clears |
| 5.5 | Empty state | No notifications | "No notifications" message |
| 5.6 | Notification types | Check various | Alert triggered, system updates, etc. |
