import { runMonteCarloSimulation } from "@/src/lib/calculations/monte-carlo";
import type { ScenarioModification, ScenarioSimulationOutput } from "@/src/lib/simulator/types";

interface SimulationInput {
  baseNetWorth: number;
  baseReturn: number;
  baseVolatility: number;
  years: number;
  monthlySavings: number;
  modifications: ScenarioModification[];
}

export function runScenarioSimulation(input: SimulationInput): ScenarioSimulationOutput {
  let adjustedValue = Math.max(input.baseNetWorth, 0);
  let adjustedReturn = input.baseReturn;
  let adjustedVolatility = Math.max(input.baseVolatility, 0.01);
  let adjustedMonthlySavings = Math.max(input.monthlySavings, 0);
  const events: ScenarioSimulationOutput["events"] = [];

  for (const mod of input.modifications) {
    switch (mod.type) {
      case "add_asset":
        adjustedValue += Math.max(mod.asset?.value || 0, 0);
        break;
      case "remove_asset":
        adjustedValue -= Math.max(mod.asset?.value || 0, 0);
        break;
      case "change_allocation": {
        if (typeof mod.newAllocationPct === "number") {
          const shift = (mod.newAllocationPct - 60) / 100;
          adjustedReturn += shift * 0.04;
          adjustedVolatility += shift * 0.08;
        }
        break;
      }
      case "change_savings_rate":
        adjustedMonthlySavings = Math.max(adjustedMonthlySavings + (mod.savingsRateChange || 0), 0);
        break;
      case "one_time_event": {
        if (!mod.event) break;
        const impact = mod.event.type === "outflow" ? -Math.abs(mod.event.amount) : Math.abs(mod.event.amount);
        adjustedValue += impact;

        const eventDate = new Date(mod.event.date).getTime();
        const eventYear = Number.isFinite(eventDate)
          ? Math.max(
              1,
              Math.min(
                input.years,
                Math.round((eventDate - Date.now()) / (365.25 * 24 * 60 * 60 * 1000))
              )
            )
          : 1;

        events.push({
          year: eventYear,
          label: mod.event.name,
          impact,
        });
        break;
      }
      default:
        break;
    }
  }

  const monteCarlo = runMonteCarloSimulation({
    initialValue: Math.max(adjustedValue, 0),
    expectedReturn: adjustedReturn,
    volatility: Math.max(adjustedVolatility, 0.01),
    years: Math.max(1, Math.round(input.years)),
    numPaths: 1000,
    stepsPerYear: 12,
  });

  return {
    ...monteCarlo,
    events,
  };
}
