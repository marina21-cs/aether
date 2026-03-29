import type { ActionableInsight, ActionableSignals } from "./types";

const REFERENCE_CONCENTRATION_PCT = 35;
const HIGH_CONCENTRATION_PCT = 45;

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function pctLabel(value: number): string {
  return `${round(value, 1).toFixed(1)}%`;
}

function createFallbackInsights(signals: ActionableSignals): ActionableInsight[] {
  const hasPortfolio = signals.totalPortfolioValue > 0;

  return [
    {
      id: "fees-baseline",
      title: "Run a fee drag check",
      summary:
        "Recurring fees are often invisible in day-to-day performance. A quick scan can reveal long-term compounding impact.",
      whyNow: "Fee reductions can improve outcomes without increasing market risk.",
      severity: "info",
      kind: "opportunity",
      score: hasPortfolio ? 44 : 28,
      action: {
        label: "Open Fee Analyzer",
        to: "/dashboard/fees",
        advisorPrompt:
          "Estimate the 10-year fee drag in my portfolio and show where recurring costs are highest.",
      },
    },
    {
      id: "inflation-baseline",
      title: "Check inflation pressure",
      summary:
        "A holding can look positive in nominal returns but still lose purchasing power after inflation.",
      whyNow: "Real-return checks keep your goals aligned with real spending power.",
      severity: "info",
      kind: "data",
      score: hasPortfolio ? 42 : 26,
      action: {
        label: "Open Performance",
        to: "/dashboard/performance",
        advisorPrompt:
          "Which parts of my portfolio are most exposed to negative real returns after inflation?",
      },
    },
  ];
}

export function buildActionableInsights(signals: ActionableSignals): ActionableInsight[] {
  const insights: ActionableInsight[] = [];
  const hasPortfolio = signals.holdingsCount > 0 && signals.totalPortfolioValue > 0;

  if (!hasPortfolio) {
    insights.push({
      id: "starter-allocation",
      title: "Set up your first allocation map",
      summary:
        "No active holdings are detected yet. Starting with a simple asset map unlocks all analysis layers.",
      whyNow:
        "Once positions are loaded, AETHER can generate risk, fee, and inflation-aware recommendations.",
      severity: "info",
      kind: "data",
      score: 100,
      action: {
        label: "Import first assets",
        to: "/dashboard/data",
        advisorPrompt:
          "I am just getting started. Help me design a beginner-friendly portfolio allocation framework.",
      },
    });

    return [...insights, ...createFallbackInsights(signals)].sort((a, b) => b.score - a.score);
  }

  if (signals.topAllocationPct >= HIGH_CONCENTRATION_PCT) {
    const overweight = Math.max(0, signals.topAllocationPct - REFERENCE_CONCENTRATION_PCT);
    insights.push({
      id: "concentration-risk",
      title: "Concentration risk is elevated",
      summary: `Your largest exposure is ${pctLabel(signals.topAllocationPct)} of portfolio value, above the ${pctLabel(REFERENCE_CONCENTRATION_PCT)} watch level.`,
      whyNow:
        "A single overweight bucket can dominate drawdowns during adverse moves.",
      severity: "high",
      kind: "risk",
      score: 88 + Math.min(overweight, 12),
      action: {
        label: "Review allocations",
        to: "/dashboard/holdings",
        advisorPrompt:
          "My largest allocation is high. Suggest a gradual rebalancing plan with downside-risk reduction tradeoffs.",
      },
    });
  }

  if (signals.cashAllocationPct >= 25) {
    insights.push({
      id: "cash-drag",
      title: "Cash drag watch",
      summary: `Cash is ${pctLabel(signals.cashAllocationPct)} of the portfolio. This can reduce volatility but may slow long-term compounding.`,
      whyNow:
        "Testing a staged deployment plan can balance flexibility and growth potential.",
      severity: "medium",
      kind: "opportunity",
      score: 75 + Math.min((signals.cashAllocationPct - 25) * 0.5, 10),
      action: {
        label: "Run simulator",
        to: "/dashboard/simulator",
        advisorPrompt:
          "Model scenarios where I gradually deploy excess cash while keeping a safety buffer.",
      },
    });
  }

  if (signals.liveCoveragePct < 60) {
    insights.push({
      id: "pricing-coverage",
      title: "Live pricing coverage is low",
      summary: `${pctLabel(signals.liveCoveragePct)} of holdings are live-priced; ${signals.manualPricedCount} position${signals.manualPricedCount === 1 ? " is" : "s are"} still manually marked.`,
      whyNow:
        "Manual marks can drift from market reality and distort risk and performance analytics.",
      severity: "medium",
      kind: "data",
      score: 70 + Math.min((60 - signals.liveCoveragePct) * 0.4, 16),
      action: {
        label: "Update data links",
        to: "/dashboard/data",
        advisorPrompt:
          "Which of my manually priced holdings should I prioritize for live data linking first?",
      },
    });
  }

  const dailyMovePct =
    signals.totalPortfolioValue > 0
      ? (Math.abs(signals.dailyPnl) / signals.totalPortfolioValue) * 100
      : 0;

  if (dailyMovePct >= 1.5) {
    const isDrawdown = signals.dailyPnl < 0;
    insights.push({
      id: isDrawdown ? "drawdown-spike" : "upside-spike",
      title: isDrawdown ? "Daily drawdown spike detected" : "Daily upside spike detected",
      summary: `Portfolio moved ${pctLabel(dailyMovePct)} in one day (${isDrawdown ? "down" : "up"}).`,
      whyNow:
        "Stress-testing current assumptions helps separate noise from structural risk.",
      severity: isDrawdown ? "high" : "info",
      kind: isDrawdown ? "risk" : "opportunity",
      score: isDrawdown ? 86 : 62,
      action: {
        label: "Open Glass Box",
        to: "/dashboard/glass-box",
        advisorPrompt: isDrawdown
          ? "My portfolio had a sharp down day. Show downside scenarios and what assumptions are most sensitive."
          : "My portfolio had a strong up day. Help me review if my risk level remains aligned with my goals.",
      },
    });
  }

  if (signals.holdingsCount > 0 && signals.holdingsCount < 4) {
    insights.push({
      id: "thin-diversification",
      title: "Diversification is still thin",
      summary: `Only ${signals.holdingsCount} holding${signals.holdingsCount === 1 ? "" : "s"} are currently tracked.`,
      whyNow:
        "Small position counts can amplify idiosyncratic volatility and concentration effects.",
      severity: "medium",
      kind: "risk",
      score: 73,
      action: {
        label: "Expand holdings map",
        to: "/dashboard/data",
        advisorPrompt:
          "Given my current holdings count, suggest diversification directions by asset class and risk tradeoffs.",
      },
    });
  }

  if (signals.hasCryptoExposure) {
    insights.push({
      id: "crypto-alerts",
      title: "Crypto exposure needs active guardrails",
      summary:
        "Crypto positions can change portfolio risk quickly between refresh cycles.",
      whyNow:
        "Price and drawdown alerts provide faster reaction windows during high-volatility sessions.",
      severity: "info",
      kind: "risk",
      score: 58,
      action: {
        label: "Set alert rules",
        to: "/dashboard/alerts",
        advisorPrompt:
          "Recommend practical alert thresholds for my crypto exposure that avoid excessive notification noise.",
      },
    });
  }

  if (typeof signals.worstPerformerPct === "number" && signals.worstPerformerPct <= -8) {
    insights.push({
      id: "loser-review",
      title: "Lagging position review",
      summary: `A tracked position is down ${pctLabel(Math.abs(signals.worstPerformerPct))} from cost basis.`,
      whyNow:
        "Separating temporary volatility from thesis breakage improves decision discipline.",
      severity: "medium",
      kind: "risk",
      score: 67,
      action: {
        label: "Review in holdings",
        to: "/dashboard/holdings",
        advisorPrompt:
          "Help me audit my worst-performing holding using thesis risk, drawdown context, and next-check signals.",
      },
    });
  }

  if (typeof signals.bestPerformerPct === "number" && signals.bestPerformerPct >= 15) {
    insights.push({
      id: "winner-discipline",
      title: "Strong winner, rebalance check",
      summary: `Top performer is up ${pctLabel(signals.bestPerformerPct)}.`,
      whyNow:
        "Large winners can silently increase concentration risk if position sizes are not reviewed.",
      severity: "info",
      kind: "opportunity",
      score: 57,
      action: {
        label: "Inspect top positions",
        to: "/dashboard/holdings",
        advisorPrompt:
          "My top winner has run up strongly. Show trim-vs-hold tradeoffs without giving direct trade instructions.",
      },
    });
  }

  const merged = [...insights, ...createFallbackInsights(signals)];
  const deduped = new Map<string, ActionableInsight>();
  for (const insight of merged) {
    if (!deduped.has(insight.id)) {
      deduped.set(insight.id, insight);
    }
  }

  return Array.from(deduped.values()).sort((a, b) => b.score - a.score);
}
