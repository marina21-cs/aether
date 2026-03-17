export function calculatePortfolioVariance(
  weights: number[],
  covarianceMatrix: number[][]
): number {
  let total = 0;
  for (let i = 0; i < weights.length; i += 1) {
    for (let j = 0; j < weights.length; j += 1) {
      total += weights[i] * covarianceMatrix[i][j] * weights[j];
    }
  }
  return total;
}

export function buildCovarianceMatrix(returns: number[][]): number[][] {
  const n = returns.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      const sample = Math.min(returns[i].length, returns[j].length);
      if (sample < 2) {
        matrix[i][j] = 0;
        matrix[j][i] = 0;
        continue;
      }

      const meanI = returns[i].slice(0, sample).reduce((sum, value) => sum + value, 0) / sample;
      const meanJ = returns[j].slice(0, sample).reduce((sum, value) => sum + value, 0) / sample;

      let covariance = 0;
      for (let k = 0; k < sample; k += 1) {
        covariance += (returns[i][k] - meanI) * (returns[j][k] - meanJ);
      }

      covariance /= sample - 1;
      matrix[i][j] = covariance;
      matrix[j][i] = covariance;
    }
  }

  return matrix;
}

export function portfolioStdDev(variance: number): number {
  return Math.sqrt(Math.max(variance, 0));
}

export function sharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  stdDev: number
): number {
  if (stdDev <= 0) return 0;
  return (portfolioReturn - riskFreeRate) / stdDev;
}
