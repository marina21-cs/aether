export interface PerformancePoint {
  label: string;
  portfolio: number;
  psei: number;
  btc: number;
}

// Generates synthetic monthly history anchored on current value.
// This is a fallback until historical snapshots are persisted.
export function buildPerformanceSeries(currentValue: number): PerformancePoint[] {
  const labels = ["1M", "2M", "3M", "4M", "5M", "6M", "7M", "8M", "9M", "10M", "11M", "Now"];
  const points: PerformancePoint[] = [];

  for (let i = 0; i < labels.length; i += 1) {
    const monthFactor = i / (labels.length - 1 || 1);
    const portfolioScale = 0.88 + monthFactor * 0.12;
    const pseiScale = 0.91 + monthFactor * 0.09;
    const btcScale = 0.78 + monthFactor * 0.22;

    points.push({
      label: labels[i],
      portfolio: currentValue * portfolioScale,
      psei: currentValue * pseiScale,
      btc: currentValue * btcScale,
    });
  }

  return points;
}
