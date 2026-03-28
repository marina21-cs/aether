# Phase 1 - Contextual Literacy

This module adds beginner-friendly financial literacy overlays to existing pages without changing current routing or page architecture.

## What it adds

- Dynamic "Did you know" insights tuned to each page context.
- Inline glossary popups for finance terms.
- Plain-English metric explanations for key dashboard numbers.

## Files

- `types.ts` - shared types for contexts, signals, insights, and glossary entries.
- `literacy-content.ts` - glossary dictionary and contextual insight ranking logic.
- `hooks/use-contextual-literacy.ts` - React hook that selects and rotates insights.
- `components/contextual-literacy-panel.tsx` - drop-in literacy panel with insights + glossary chips.
- `components/did-you-know-card.tsx` - focused insight card with "show another tip" action.
- `components/glossary-term.tsx` - inline term with popup definition.
- `components/metric-explainer-card.tsx` - metric explanation card for beginner context.
- `index.ts` - exports for easy imports.

## Quick usage

```tsx
import { ContextualLiteracyPanel, GlossaryTerm } from "@/feature/phase_1_contextual_literacy";

<ContextualLiteracyPanel
  context="dashboard"
  signals={{
    totalPortfolioValue,
    holdingsCount,
    liveCoveragePct,
    topAllocationPct,
    dailyPnl,
  }}
  metricLabel="Estimated yearly inflation drag"
  metricValue={formatDisplay(inflationEstimate)}
  metricExplanation="If returns lag inflation, buying power can decline over time."
/>

<p>
  Track your <GlossaryTerm term="asset allocation" /> and protect against{" "}
  <GlossaryTerm term="inflation drag" />.
</p>
```
