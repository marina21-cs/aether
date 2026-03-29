import type {
  GlossaryEntry,
  LiteracyContext,
  LiteracyInsight,
  LiteracySignals,
} from "./types";

const DEFAULT_INFLATION_RATE = 0.042;

const GLOSSARY: Record<string, GlossaryEntry> = {
  "inflation drag": {
    term: "Inflation Drag",
    shortDefinition: "The buying-power loss caused by rising prices.",
    plainDefinition:
      "Inflation drag means your money can buy less over time. If your savings grow slower than inflation, your real lifestyle value shrinks.",
    whyItMatters:
      "Beating inflation protects your future budget, especially for long-term goals like retirement.",
  },
  "real return": {
    term: "Real Return",
    shortDefinition: "Return after subtracting inflation.",
    plainDefinition:
      "Real return is your true growth after inflation. Example: 7% investment return minus 4% inflation equals about 3% real return.",
    whyItMatters:
      "Real return shows whether your wealth is actually growing in practical buying power.",
  },
  "asset allocation": {
    term: "Asset Allocation",
    shortDefinition: "How your money is split across asset types.",
    plainDefinition:
      "Asset allocation is the percentage of your wealth in stocks, bonds, cash, crypto, and other assets.",
    whyItMatters:
      "Your allocation has a bigger long-term impact than trying to time short-term market moves.",
  },
  "diversification": {
    term: "Diversification",
    shortDefinition: "Spreading risk across different assets.",
    plainDefinition:
      "Diversification means not putting too much money in one asset, sector, or region.",
    whyItMatters:
      "It reduces the impact of a single bad performer and smooths long-term results.",
  },
  "concentration risk": {
    term: "Concentration Risk",
    shortDefinition: "Too much exposure to one position.",
    plainDefinition:
      "Concentration risk happens when one asset makes up a large portion of your portfolio, increasing downside if it drops.",
    whyItMatters:
      "High concentration can erase gains quickly when that single asset moves against you.",
  },
  "cost basis": {
    term: "Cost Basis",
    shortDefinition: "Your average purchase cost.",
    plainDefinition:
      "Cost basis is the average price you paid for an asset, including adjustments from buys and sells.",
    whyItMatters:
      "It helps you track true profit or loss and make clearer sell decisions.",
  },
  "fee drag": {
    term: "Fee Drag",
    shortDefinition: "Long-term growth lost to recurring fees.",
    plainDefinition:
      "Fee drag is how annual fees reduce compounding over time. Even small fees can consume large future value.",
    whyItMatters:
      "Cutting fees is one of the most reliable ways to improve long-term net returns.",
  },
  "annual fee": {
    term: "Annual Fee",
    shortDefinition: "Yearly percentage charged on managed assets.",
    plainDefinition:
      "An annual fee is the percentage charged each year for managing a fund, account, or product.",
    whyItMatters:
      "Lower annual fees leave more capital compounding for you.",
  },
  apr: {
    term: "APR",
    shortDefinition: "Annual Percentage Rate for debt cost.",
    plainDefinition:
      "APR is the yearly borrowing cost of a loan or card, often including interest and some charges.",
    whyItMatters:
      "High APR debt can grow faster than your investments, slowing net-worth growth.",
  },
  "live pricing": {
    term: "Live Pricing",
    shortDefinition: "Market values updated from recent data.",
    plainDefinition:
      "Live pricing means the app is using current market quotes instead of manual or stale values.",
    whyItMatters:
      "More current pricing gives more realistic allocation and risk decisions.",
  },
};

const GLOSSARY_ALIASES: Record<string, string> = {
  inflation: "inflation drag",
  allocation: "asset allocation",
  diversify: "diversification",
  "asset mix": "asset allocation",
  "avg cost": "cost basis",
  "average cost": "cost basis",
  fee: "annual fee",
  fees: "annual fee",
  "fee cost": "fee drag",
};

function safeNumber(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function toPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatPhp(value: number): string {
  const safe = Math.max(0, safeNumber(value));
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safe);
}

function normalizeTerm(rawTerm: string): string {
  return rawTerm.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getGlossaryEntry(rawTerm: string): GlossaryEntry | null {
  const normalized = normalizeTerm(rawTerm);
  const key = GLOSSARY[normalized]
    ? normalized
    : GLOSSARY_ALIASES[normalized] ?? normalized;

  return GLOSSARY[key] ?? null;
}

function dashboardInsights(signals: LiteracySignals): LiteracyInsight[] {
  const portfolioValue = safeNumber(signals.totalPortfolioValue);
  const topAllocationPct = safeNumber(signals.topAllocationPct);
  const liveCoveragePct = safeNumber(signals.liveCoveragePct);
  const dailyPnl = safeNumber(signals.dailyPnl);
  const inflationLoss = portfolioValue * DEFAULT_INFLATION_RATE;

  const insights: LiteracyInsight[] = [
    {
      id: "dashboard-inflation-drag",
      title: "Did you know? Inflation can quietly shrink cash value.",
      body:
        portfolioValue > 0
          ? `At around 4.2% inflation, about ${formatPhp(
              inflationLoss
            )} of buying power can fade in a year if growth does not keep up.`
          : "When inflation rises, idle cash loses buying power unless your returns outpace inflation.",
      whyItMatters:
        "A beginner-friendly target is to keep long-term returns above inflation so your goals stay affordable.",
      score: portfolioValue > 0 ? 98 : 78,
      relatedTerms: ["inflation drag", "real return"],
    },
    {
      id: "dashboard-live-pricing",
      title: "Live prices improve decision quality.",
      body:
        liveCoveragePct > 0
          ? `${toPercent(
              liveCoveragePct
            )} of your holdings are using live pricing. Better coverage means more reliable allocation and risk signals.`
          : "Live pricing coverage is still low. Update pricing so your dashboard reflects current market reality.",
      whyItMatters:
        "Accurate current values prevent overconfidence and reduce surprise when markets move quickly.",
      score: liveCoveragePct < 65 ? 95 : 70,
      relatedTerms: ["live pricing", "asset allocation"],
    },
  ];

  if (topAllocationPct >= 45) {
    insights.push({
      id: "dashboard-concentration",
      title: "Your top allocation may be too concentrated.",
      body: `One asset bucket holds ${toPercent(
        topAllocationPct
      )} of your portfolio. Consider gradual rebalancing for smoother outcomes.`,
      whyItMatters:
        "Concentration can amplify drawdowns, especially for beginners still building stable habits.",
      score: 96,
      relatedTerms: ["concentration risk", "diversification"],
    });
  }

  if (dailyPnl < 0) {
    insights.push({
      id: "dashboard-volatility-coaching",
      title: "Down days are normal in long-term investing.",
      body:
        "A red day does not automatically mean your strategy failed. Compare changes against your long-term plan, not one session.",
      whyItMatters:
        "Sticking to process during volatility usually beats emotional reactive moves.",
      score: 88,
      relatedTerms: ["diversification", "asset allocation"],
    });
  }

  return insights;
}

function assetInsights(signals: LiteracySignals): LiteracyInsight[] {
  const holdingsCount = safeNumber(signals.holdingsCount);
  const topAllocationPct = safeNumber(signals.topAllocationPct);
  const liveCoveragePct = safeNumber(signals.liveCoveragePct);

  const insights: LiteracyInsight[] = [
    {
      id: "assets-cost-basis",
      title: "Cost basis keeps your P and L honest.",
      body:
        "Track average purchase price per asset so gains and losses are judged against what you actually paid.",
      whyItMatters:
        "Better cost-basis tracking improves sell discipline and helps avoid emotional decisions.",
      score: 86,
      relatedTerms: ["cost basis"],
    },
    {
      id: "assets-coverage",
      title: "Keep valuation inputs fresh.",
      body:
        liveCoveragePct > 0
          ? `${toPercent(
              liveCoveragePct
            )} of positions are currently live priced. Continue improving this for cleaner tracking.`
          : "Manual values are useful, but periodic updates keep your position view realistic.",
      whyItMatters:
        "Fresh inputs are critical for trustworthy allocation and risk insights.",
      score: liveCoveragePct < 70 ? 94 : 72,
      relatedTerms: ["live pricing", "asset allocation"],
    },
  ];

  if (holdingsCount > 0 && holdingsCount < 5) {
    insights.push({
      id: "assets-diversification-count",
      title: "A small number of positions increases single-asset risk.",
      body: `You currently hold ${Math.round(
        holdingsCount
      )} positions. Consider gradual diversification as your capital grows.`,
      whyItMatters:
        "More balanced exposure can reduce portfolio swings caused by one underperformer.",
      score: 92,
      relatedTerms: ["diversification", "concentration risk"],
    });
  }

  if (topAllocationPct >= 35) {
    insights.push({
      id: "assets-top-position",
      title: "Your largest position is carrying most of the risk.",
      body: `Your top holding bucket is ${toPercent(topAllocationPct)} of total value. A staggered rebalance can lower concentration risk.`,
      whyItMatters:
        "Reducing concentration makes outcomes less dependent on one single narrative.",
      score: 95,
      relatedTerms: ["concentration risk", "asset allocation"],
    });
  }

  return insights;
}

function liabilitiesInsights(signals: LiteracySignals): LiteracyInsight[] {
  const weightedAnnualFeePct = safeNumber(signals.weightedAnnualFeePct);
  const projectedFeeCost = safeNumber(signals.projectedFeeCost);
  const negativeRealCount = safeNumber(signals.negativeRealCount);
  const highInterestLiabilityCount = safeNumber(signals.highInterestLiabilityCount);

  const insights: LiteracyInsight[] = [
    {
      id: "liabilities-fee-drag",
      title: "Small fees can create large long-term drag.",
      body:
        projectedFeeCost > 0
          ? `Current assumptions project around ${formatPhp(
              projectedFeeCost
            )} in fee drag over 10 years.`
          : "Even a 1-2% annual fee can remove a meaningful share of your long-term gains.",
      whyItMatters:
        "Fee reduction is one of the few levers that improves return potential without adding market risk.",
      score: projectedFeeCost > 0 ? 98 : 84,
      relatedTerms: ["fee drag", "annual fee"],
    },
  ];

  if (weightedAnnualFeePct >= 1.25) {
    insights.push({
      id: "liabilities-high-fee-rate",
      title: "Your weighted annual fee is on the expensive side.",
      body: `The blended annual fee is ${toPercent(
        weightedAnnualFeePct
      )}. Compare alternatives with lower expense ratios where possible.`,
      whyItMatters:
        "Saving even 0.5% annually can materially improve compounding over a decade.",
      score: 95,
      relatedTerms: ["annual fee", "fee drag"],
    });
  }

  if (negativeRealCount > 0) {
    insights.push({
      id: "liabilities-negative-real",
      title: "Some holdings are not beating inflation.",
      body: `${Math.round(
        negativeRealCount
      )} holdings currently show negative real return. Focus on net return after both fees and inflation.`,
      whyItMatters:
        "Nominal gains can still mean losing buying power in real terms.",
      score: 93,
      relatedTerms: ["real return", "inflation drag"],
    });
  }

  if (highInterestLiabilityCount > 0) {
    insights.push({
      id: "liabilities-apr-priority",
      title: "High APR debt is usually a top priority.",
      body: `${Math.round(
        highInterestLiabilityCount
      )} liabilities are flagged as high interest. Paying these faster may outperform many low-risk investments.`,
      whyItMatters:
        "Reducing expensive debt can create guaranteed savings and improve monthly cash flow.",
      score: 97,
      relatedTerms: ["apr"],
    });
  }

  return insights;
}

export function buildContextualInsights(
  context: LiteracyContext,
  signals: LiteracySignals
): LiteracyInsight[] {
  const baseInsights =
    context === "dashboard"
      ? dashboardInsights(signals)
      : context === "assets"
        ? assetInsights(signals)
        : liabilitiesInsights(signals);

  return [...baseInsights].sort((a, b) => b.score - a.score);
}
