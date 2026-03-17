# Phase 3 — Testing Guide

What to test, how to test, and expected results for Phase 3 (Intelligence Layer).

---

## 1. AI Financial Advisor

### 1.1 Basic Functionality

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.1.1 | Panel renders | Load dashboard | Right rail (320px) with advisor interface |
| 1.1.2 | Input field | Check advisor panel | Text input with "Ask your advisor..." placeholder |
| 1.1.3 | Submit query | Type question, press Enter | Streaming response begins |
| 1.1.4 | Streaming | Send query | Tokens appear one-by-one, not all at once |
| 1.1.5 | Response format | Check completed response | Sections: Answer → Data → Sources → Confidence |
| 1.1.6 | Disclaimer | Every response | Disclaimer text visible at bottom of every response |
| 1.1.7 | Terminal style | Check UI | NOT chat bubbles — terminal-style with structured output |

### 1.2 Context Injection

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.2.1 | Portfolio context | Ask "What's my allocation?" | Response references actual portfolio data |
| 1.2.2 | BSP rate context | Ask "What's the current interest rate?" | Mentions the current BSP rate |
| 1.2.3 | CPI context | Ask about inflation | References current PH CPI figure |
| 1.2.4 | Risk profile aware | Ask "Should I buy crypto?" | Response calibrated to user's risk tolerance |
| 1.2.5 | Holdings specific | Ask about a specific holding | References the user's actual position size and cost basis |

### 1.3 Rate Limiting

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.3.1 | Free tier limit | Send 20 queries in one day | 21st query returns "Daily limit reached" |
| 1.3.2 | Pro tier limit | (If pro user) Send 100 queries | 101st returns limit message |
| 1.3.3 | Rate limit UI | Hit limit | Friendly message with upgrade CTA for free users |
| 1.3.4 | Counter display | Check advisor panel | "X/20 queries remaining today" visible |

### 1.4 Caching

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.4.1 | Same query cached | Send identical query twice within 1 hour | Second response is instant (cached) |
| 1.4.2 | Cache expiry | Send same query after 1+ hour | New API call made |
| 1.4.3 | Cost savings | Check OpenRouter dashboard | Cached queries don't incur API cost |

### 1.5 Error Handling

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.5.1 | API error | Invalidate API key temporarily | Graceful error: "Advisor temporarily unavailable" |
| 1.5.2 | Network failure | Disconnect network | Error message with retry button |
| 1.5.3 | Empty query | Submit empty input | Button disabled or validation message |
| 1.5.4 | Very long query | Submit 5000+ character query | Truncated or error: "Query too long" |

---

## 2. Glass Box Predictive Engine

### 2.1 Portfolio Variance

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.1.1 | Variance displays | Navigate to Glass Box page | σp² value shown with formula |
| 2.1.2 | Formula visible | Check display | σp² = wᵀΣw formula rendered |
| 2.1.3 | Covariance matrix | Check heatmap | Color-coded matrix heatmap with asset labels |
| 2.1.4 | Weight vector | Check display | Asset weights shown (sum = 1.0) |
| 2.1.5 | Math correct | Manual calculation | Variance matches hand-calculated value for test portfolio |

### 2.2 Monte Carlo Simulation

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.2.1 | Simulation runs | Load Glass Box with assets | Fan chart renders with confidence bands |
| 2.2.2 | Progressive render | Watch on load | 100-path preview first, then refines to 1,000 |
| 2.2.3 | Fan chart bands | Check chart | 10th, 50th, 90th percentile bands visible |
| 2.2.4 | PSEi benchmark | Check chart | Gray benchmark line always visible |
| 2.2.5 | 10-year horizon | Check x-axis | Projects 10 years from current date |
| 2.2.6 | Web Worker | Check main thread | UI remains responsive during simulation (no jank) |
| 2.2.7 | GBM formula correct | Validate path | S(t) = S(0) * exp((μ - σ²/2)*t + σ*W(t)) matches expected range |

### 2.3 Assumptions Panel

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.3.1 | Panel visible | Check Glass Box page | Editable assumptions shown BY DEFAULT (not hidden) |
| 2.3.2 | Edit return | Change expected return slider | Fan chart updates in real-time |
| 2.3.3 | Edit volatility | Change volatility slider | Bands widen/narrow accordingly |
| 2.3.4 | Reset defaults | Click "Reset to defaults" | Returns to calculated values |
| 2.3.5 | Validation | Enter negative return | Accepts (negative returns are valid), chart adjusts |

### 2.4 Algorithm Validation

Run these with known inputs to verify correctness:

| # | Test | Expected |
|---|------|----------|
| 2.4.1 | 2-asset portfolio variance (50/50 BTC/JFC, known Σ) | Matches analytical solution |
| 2.4.2 | Single-asset Monte Carlo (no volatility) | All paths converge to single line |
| 2.4.3 | High volatility Monte Carlo | Wide fan, 10th percentile can go below starting value |
| 2.4.4 | 10th percentile vs 90th | 10th < median < 90th for all time points |
| 2.4.5 | Path count | Exactly 1,000 paths generated (verify in console) |

---

## 3. Fee Analyzer

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.1 | Fee scan | Navigate to Fee Analyzer | All holdings scanned for fees |
| 3.2 | Hero metric | Check top of page | "Your fees will cost you ₱X over 10 years" |
| 3.3 | Formula correct | Check with known values | P × ((1+r)^n − (1+r−f)^n) matches manual calc |
| 3.4 | Severity badges | Check fee items | Critical (red), Warning (yellow), Info (blue) badges |
| 3.5 | UITF flagged | Add UITF with >1% fee | Warning badge: "Fee above benchmark" |
| 3.6 | Alternatives | Check flagged items | Lower-cost alternatives suggested (e.g., FMETF) |
| 3.7 | No fees | Portfolio with no fee-bearing assets | "No fee issues detected" message |
| 3.8 | Compound cost visual | Check display | Shows annual fee impact growing over 10 years |

---

## 4. Real-Return Calculator

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 4.1 | Renders | Navigate to Real Return section | All holdings with nominal vs real return |
| 4.2 | Formula correct | With 8% nominal, 6% CPI | Real = ((1.08)/(1.06)) − 1 = 1.89% |
| 4.3 | Negative real return | Savings at 0.25%, CPI at 6.1% | Flagged in red: negative real return |
| 4.4 | Side-by-side | Check layout | Nominal vs Real columns shown |
| 4.5 | CPI source | Check footer/info | "CPI data: PSA, updated [date]" |
| 4.6 | Time deposit flagged | Time deposit at 4% vs 6.1% CPI | Highlighted with negative real return warning |

---

## 5. Performance History

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 5.1 | Chart renders | Navigate to Performance page | Time-series net worth chart |
| 5.2 | Range selector | Click 1M, 3M, 6M, 1Y, 3Y, All | Chart range changes |
| 5.3 | PSEi benchmark | Check chart | Gray line always visible as reference |
| 5.4 | BTC benchmark | Enable BTC benchmark | Dashed secondary line appears |
| 5.5 | Transaction annotations | Check timeline | Buy/sell events marked on chart |
| 5.6 | Period summary | Check below chart | Total return, vs PSEi, vs BTC |
| 5.7 | Monthly breakdown | Check table | Month-by-month change % with benchmark comparison |
| 5.8 | CSV download | Click "Download CSV" | CSV file downloads with correct data |
| 5.9 | PDF download | Click "Download PDF" | PDF report generates and downloads |

---

## 6. Settings Page

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 6.1 | Profile display | Navigate to Settings | Name, email, risk tolerance, currency shown |
| 6.2 | Update risk | Change risk tolerance | Saves to Supabase, AI advisor reflects new tolerance |
| 6.3 | Change currency | Switch base currency | Dashboard values update to new currency |
| 6.4 | Account info | Check Clerk user info | Email, last login displayed |

---

## Unit Tests for Financial Calculations

These MUST be automated (Vitest):

```
describe('Portfolio Variance')
  it('computes correct variance for 2-asset portfolio')
  it('handles single-asset portfolio (variance = asset variance)')
  it('handles zero-weight assets')

describe('Monte Carlo Simulation')
  it('generates correct number of paths')
  it('all paths start at current portfolio value')
  it('median path approximates expected return over long horizon')
  it('10th percentile < median < 90th percentile')
  it('handles zero volatility (deterministic path)')

describe('Fee Compound Cost')
  it('P × ((1+r)^n − (1+r−f)^n) for known values')
  it('returns 0 when fee is 0')
  it('handles large fees correctly')

describe('Real Return')
  it('((1 + 0.08) / (1 + 0.06)) − 1 = 0.01886...')
  it('returns negative when nominal < inflation')
  it('returns 0 when nominal = inflation')
```
