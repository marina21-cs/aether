# Phase 3 - Actionable Insights

This module turns dashboard telemetry into prioritized, concrete next actions.

## What it adds

- Signal-driven insight ranking (risk, opportunity, and data quality).
- Severity-aware cards with clear "why now" context.
- Direct route handoff to relevant pages (Holdings, Simulator, Glass Box, Alerts, Data, Fees).
- One-click "Ask Advisor" handoff with prefilled context prompt.

## Files

- `types.ts` - shared contracts for signals, insights, severity, and actions.
- `insight-engine.ts` - scoring and insight generation logic.
- `hooks/use-actionable-insights.ts` - memoized hook for ranked insight output.
- `components/actionable-insights-panel.tsx` - dashboard panel UI.
- `index.ts` - barrel exports.

## Current integration

- Active in `src/pages/DashboardHome.tsx`.
- Uses real dashboard state: concentration, cash allocation, live coverage, P&L movement, and performer spread.

## Advisor handoff behavior

- Insight cards link to `/dashboard/advisor?prompt=...`.
- `AdvisorChat` auto-sends that prompt once per unique value on page load.
