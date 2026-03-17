export interface MonteCarloParams {
  initialValue: number;
  expectedReturn: number;
  volatility: number;
  years: number;
  numPaths: number;
  stepsPerYear: number;
}

export interface MonteCarloResult {
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  timeLabels: string[];
  stats: {
    mean: number;
    median: number;
    min: number;
    max: number;
    probLoss: number;
  };
}

function randn(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = values.slice().sort((a, b) => a - b);
  const idx = Math.floor((sorted.length - 1) * p);
  return sorted[idx] ?? 0;
}

export function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResult {
  const { initialValue, expectedReturn, volatility, years, numPaths, stepsPerYear } = params;
  const totalSteps = years * stepsPerYear;
  const dt = 1 / stepsPerYear;
  const drift = (expectedReturn - (volatility * volatility) / 2) * dt;
  const diffusion = volatility * Math.sqrt(dt);

  const paths: number[][] = [];

  for (let pathIndex = 0; pathIndex < numPaths; pathIndex += 1) {
    const path: number[] = [initialValue];
    let value = initialValue;

    for (let step = 1; step <= totalSteps; step += 1) {
      value = value * Math.exp(drift + diffusion * randn());
      path.push(value);
    }

    paths.push(path);
  }

  const p10: number[] = [];
  const p25: number[] = [];
  const p50: number[] = [];
  const p75: number[] = [];
  const p90: number[] = [];

  for (let step = 0; step <= totalSteps; step += 1) {
    const valuesAtStep = paths.map((path) => path[step]);
    p10.push(percentile(valuesAtStep, 0.1));
    p25.push(percentile(valuesAtStep, 0.25));
    p50.push(percentile(valuesAtStep, 0.5));
    p75.push(percentile(valuesAtStep, 0.75));
    p90.push(percentile(valuesAtStep, 0.9));
  }

  const finalValues = paths.map((path) => path[path.length - 1]);
  const sortedFinalValues = finalValues.slice().sort((a, b) => a - b);

  return {
    percentiles: { p10, p25, p50, p75, p90 },
    timeLabels: Array.from({ length: years + 1 }, (_, index) => `Year ${index}`),
    stats: {
      mean: finalValues.reduce((sum, value) => sum + value, 0) / (finalValues.length || 1),
      median: sortedFinalValues[Math.floor(sortedFinalValues.length / 2)] || 0,
      min: sortedFinalValues[0] || 0,
      max: sortedFinalValues[sortedFinalValues.length - 1] || 0,
      probLoss:
        finalValues.length > 0
          ? finalValues.filter((value) => value < initialValue).length / finalValues.length
          : 0,
    },
  };
}
