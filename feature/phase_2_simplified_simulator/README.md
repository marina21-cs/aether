# Phase 2 - Simplified Simulator

Phase 2 makes the Sandbox Wealth Simulator understandable for first-time users while keeping advanced controls available for power users.

## Why this phase exists

Many users can enter numbers, but still cannot answer:

- What does this result mean for me?
- Is this risky or acceptable?
- Which control should I change first?

This phase solves that by adding guided defaults, plain-language explanations, and progressive disclosure.

## UX strategy

The simulator now has two layers:

- Guided mode (default): simpler setup, risk profiles, quick presets, and beginner instructions.
- Advanced mode: manual control over assumptions for deeper scenario tuning.

This mirrors the product philosophy:

- Black-box simplicity when users need speed and clarity.
- Glass-box detail when users want control and transparency.

## Delivered in this phase

### 1) Guided setup for beginners

- Beginner flow card with a 3-step sequence.
- Mode switch: Guided or Advanced.
- Quick presets users can apply with one click.
- Risk profile cards:
	- Steady
	- Balanced
	- Growth
- Core fields remain visible and explained:
	- Starting wealth
	- Monthly contribution
	- Time horizon

### 2) Plain-language interpretation

Added a readable summary card after simulation run:

- Typical outcome in currency terms.
- Change from starting wealth.
- "Out of 10" framing for loss probability.
- Width of outcome range.
- Human recommendation message based on risk level.

### 3) Learning layer

- "How to read this" section retained and improved.
- Percentile explanation in non-technical wording.

## File map

- `src/pages/Simulator.tsx`
	- Guided vs Advanced UX.
	- Quick preset application logic.
	- Risk profile mapping and assumptions.
	- Plain-language summary output.

## Product behavior goals

Phase 2 simulator should help users answer these immediately:

1. "What is my likely outcome?"
2. "How bad can it get in conservative scenarios?"
3. "How often do I lose vs starting value?"
4. "What simple change can reduce my risk?"

## Acceptance criteria

- New user can run first simulation in under 2 minutes.
- User can identify conservative, typical, and optimistic outcomes.
- User can explain chance of loss in plain language.
- Advanced users can still tune detailed assumptions.
- Existing save/load scenario flow continues to work.
- Build passes without introducing TypeScript errors.

## Future additions (recommended)

- On-chart annotations for one-time events.
- "What changed" diff panel between two saved scenarios.
- Interactive onboarding coach for first run.
- Goal-based presets (retirement, tuition, house, emergency fund).
- Localized copy variants (Filipino/Taglish) for financial terminology.
