export function calculateRealReturn(
  nominalReturn: number,
  inflationRate: number
): number {
  return (1 + nominalReturn) / (1 + inflationRate) - 1;
}
