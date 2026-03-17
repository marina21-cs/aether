# Phase 2 — Testing Guide

What to test, how to test, and expected results for Phase 2 (Core Dashboard).

---

## 1. Sidebar Navigation

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 1.1 | Sidebar renders | Load dashboard | 240px glassmorphic sidebar on left |
| 1.2 | Nav sections | Check sidebar | MAIN, ANALYSIS, SETTINGS section labels visible |
| 1.3 | Active state | Click "Dashboard" | Active item: violet left border, accent icon color, highlighted bg |
| 1.4 | Hover state | Hover over nav items | Glass bg appears, text brightens |
| 1.5 | Icons | Check each nav item | Lucide icons 18px, correct icon per section |
| 1.6 | Net worth in sidebar | Check sidebar bottom | Net worth figure displayed in Syne Bold |
| 1.7 | Navigation | Click each nav item | Routes to correct page |
| 1.8 | Keyboard nav | Tab through sidebar | Focus rings on every item |

---

## 2. Net Worth Dashboard

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 2.1 | Hero number | Load dashboard with assets | Large net worth number (₱X,XXX,XXX) displays |
| 2.2 | Change indicator | Check daily change | Green/red arrow with percentage and peso change |
| 2.3 | Period toggle | Switch between Daily/Weekly/Monthly | Change values update accordingly |
| 2.4 | Number formatting | Check hero number | Proper PHP formatting with ₱ symbol, commas, 2 decimal places |
| 2.5 | Empty state | Load with no assets | Meaningful empty state: "Add your first asset" with CTA |
| 2.6 | Loading state | Slow network (DevTools throttle) | Skeleton loading animation visible |
| 2.7 | Currency display | All values shown | PHP by default, all values in pesos |

---

## 3. Holdings Table

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 3.1 | Columns present | Check table headers | Ticker, Quantity, Value (₱), Allocation %, Daily Change |
| 3.2 | Data populated | Add assets, check table | All assets appear as rows |
| 3.3 | Sort by column | Click column header | Sorts ascending/descending with indicator |
| 3.4 | Pagination | Add >20 assets | Pagination controls appear at bottom |
| 3.5 | Gain/loss colors | Check daily change column | Green for gains, red for losses |
| 3.6 | Asset class icon | Check each row | Correct icon per asset class |
| 3.7 | Click row | Click on a holding | Expands detail view or navigates to asset detail |
| 3.8 | Empty table | No assets | Empty state message |
| 3.9 | Search/filter | If filter exists | Can filter by asset class, search by name |

---

## 4. Allocation View

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 4.1 | Horizontal bar renders | Load with assets | Stacked horizontal bar chart by asset class |
| 4.2 | Colors per class | Check bar segments | Distinct color per asset class |
| 4.3 | Percentages shown | Check labels | Each segment shows percentage |
| 4.4 | Hover tooltip | Hover over segment | Shows asset class name, value, percentage |
| 4.5 | Legend | Below or beside chart | Color-coded legend with all asset classes |
| 4.6 | Responsive | Resize window | Bar adapts to container width |
| 4.7 | Math correct | Calculate manually | Percentages sum to 100%, values match net worth |

---

## 5. Liabilities Section

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 5.1 | Liabilities display | Add liabilities | Listed with name, type, balance, interest rate |
| 5.2 | Net worth deduction | Check hero number | Gross assets - liabilities = net worth |
| 5.3 | Add liability | Use add form | New liability appears in list |
| 5.4 | Edit liability | Click edit on existing | Form pre-filled, save updates value |
| 5.5 | Delete liability | Click delete | Removes with confirmation dialog |

---

## 6. Historical Net Worth Chart

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 6.1 | Chart renders | Load with history data | Line chart with user's net worth over time |
| 6.2 | PSEi benchmark | Check chart | Gray reference line always visible |
| 6.3 | Time range toggle | Click 1M, 3M, 6M, 1Y, 3Y, All | Chart data range updates |
| 6.4 | Hover tooltip | Hover on chart | Date, net worth value, PSEi value shown |
| 6.5 | Responsive | Resize window | Chart redraws to fit container |
| 6.6 | Empty state | No history data | "Not enough data" message with timeframe suggestion |

---

## 7. Manual Asset Entry

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 7.1 | Form renders | Navigate to add asset | Form with fields for all asset classes |
| 7.2 | Asset class selector | Select each class | Fields adjust based on class (stocks show ticker, real estate shows address) |
| 7.3 | Validation - required | Submit empty form | Error messages on required fields |
| 7.4 | Validation - numbers | Enter negative quantity | Error: "Quantity must be positive" |
| 7.5 | Successful create | Fill valid data, submit | Asset created, appears in holdings table |
| 7.6 | Audit log entry | Check audit log after create | `asset_created` entry with new values |
| 7.7 | Edit existing | Click edit on asset | Form pre-filled with current values |
| 7.8 | Delete asset | Click delete | Confirmation dialog, then removes |
| 7.9 | Real estate fields | Select "Real Estate" class | Shows address, estimated value, BIR zonal reference |
| 7.10 | Crypto ticker | Select "Crypto", enter "BTC" | Auto-fetches current BTC/PHP price |

---

## 8. CSV Import

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 8.1 | Upload area | Navigate to import | Drag-and-drop zone + file picker button |
| 8.2 | File validation | Upload non-CSV file | Error: "Only CSV files are accepted" |
| 8.3 | File size limit | Upload >10MB CSV | Error: "File too large. Maximum 10MB." |
| 8.4 | COL format parsed | Upload valid COL CSV | Preview table shows parsed data |
| 8.5 | Column mapping | Check preview | Columns correctly mapped (date, stock, buy/sell, qty, price) |
| 8.6 | Import confirmation | Click "Import" after preview | Assets/transactions created, success message |
| 8.7 | Duplicate detection | Import same CSV twice | Warning: "X transactions already exist" |
| 8.8 | Audit log | Check after import | `csv_imported` entry with file name and row count |
| 8.9 | Error rows | CSV with invalid rows | Error report showing which rows failed and why |

---

## 9. API Routes

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 9.1 | GET /portfolio/net-worth | Authenticated request | Returns `{ netWorth, breakdown, change }` |
| 9.2 | GET /portfolio/holdings | Authenticated request | Returns paginated holdings array |
| 9.3 | GET /portfolio/allocation | Authenticated request | Returns allocation by class |
| 9.4 | POST /portfolio/assets | Valid body | Creates asset, returns 201 |
| 9.5 | POST /portfolio/assets (invalid) | Missing required fields | Returns 400 with Zod validation errors |
| 9.6 | PUT /portfolio/assets/:id | Valid update | Updates asset, returns 200 |
| 9.7 | PUT /portfolio/assets/:id (wrong user) | Update another user's asset | Returns 404 (RLS blocks access) |
| 9.8 | DELETE /portfolio/assets/:id | Valid delete | Deletes asset, returns 200 |
| 9.9 | POST /data/upload-csv | Valid CSV file | Parses and imports, returns summary |
| 9.10 | GET /data/audit-log | Authenticated request | Returns paginated audit entries |
| 9.11 | GET /market/prices | Authenticated request | Returns cached prices for PSE, crypto, forex |
| 9.12 | Rate limiting | Send 61 requests in 1 minute | 429 Too Many Requests on 61st request |
| 9.13 | Unauthenticated | Any endpoint without token | Returns 401 |

---

## 10. Price Cache

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 10.1 | CoinGecko fetch | Trigger price refresh | BTC, ETH prices in PHP stored in price_cache |
| 10.2 | Cache TTL | Request within 5 minutes | Returns cached value (no new API call) |
| 10.3 | Cache expiry | Request after 5+ minutes | New API call made, cache updated |
| 10.4 | Rate limit handling | Simulate 50+ CoinGecko calls | Graceful handling, uses cached values |
| 10.5 | PSE prices | Trigger PSE refresh | PSE stock prices cached (JFC, SM, ALI, etc.) |
| 10.6 | Forex rates | Trigger forex refresh | USD/PHP, SGD/PHP rates cached |
| 10.7 | Error resilience | Kill network connection | Returns last cached values, logs error |

---

## How to Test APIs

Use the built-in test approach or a tool like:

```bash
# Using curl
# 1. Get your Clerk session token from browser cookies or Clerk dev tools
TOKEN="your-clerk-jwt-token"

# 2. Test endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/portfolio/net-worth
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/portfolio/holdings
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"asset_class":"crypto","ticker_or_name":"BTC","quantity":0.5,"current_value_php":2500000}' \
  http://localhost:3000/api/v1/portfolio/assets
```
