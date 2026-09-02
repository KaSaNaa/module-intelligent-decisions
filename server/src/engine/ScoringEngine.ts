import { Order, Truck, DecisionWeights, ScoreBreakdown } from '../models/types';
import { getCityDistance } from '../models/mockData';

export const DEFAULT_WEIGHTS: DecisionWeights = {
  profitWeight: 0.40,
  urgencyWeight: 0.25,
  costWeight: 0.20,
  fitWeight: 0.15
};

const AVG_SPEED_KMH = 60.0;
const MAX_REFERENCE_PROFIT = 2000.0;
const MAX_REFERENCE_DISTANCE = 500.0;

export interface ScoreEvaluation {
  score: number;
  isFeasible: boolean;
  distanceKm: number;
  travelTimeMinutes: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
}

export class ScoringEngine {
  /**
   * Multi-objective scoring function combining revenue yield, delivery urgency,
   * fuel/distance cost, and payload capacity utilization into a normalized index [0, 1].
   */
  public static evaluate(
    truck: Truck,
    order: Order,
    weights: DecisionWeights = DEFAULT_WEIGHTS
  ): ScoreEvaluation {
    const distanceKm = getCityDistance(truck.currentLocation, order.destination);
    const travelTimeMinutes = Math.round((distanceKm / AVG_SPEED_KMH) * 60);

    const projectedArrival = truck.availableAtMinutes + travelTimeMinutes;
    const isDeadlineFeasible = projectedArrival <= order.deadlineMinutes;
    const isCapacityFeasible = (truck.usedKg + order.weight) <= truck.capacityKg;

    const reasons: string[] = [];

    if (!isCapacityFeasible) {
      const overage = (truck.usedKg + order.weight) - truck.capacityKg;
      return {
        score: -1,
        isFeasible: false,
        distanceKm,
        travelTimeMinutes,
        scoreBreakdown: this.emptyBreakdown(),
        reasons: [`Infeasible: Exceeds capacity by ${overage.toFixed(1)} kg (Capacity: ${truck.capacityKg}kg, Required: ${(truck.usedKg + order.weight).toFixed(1)}kg)`]
      };
    }

    if (!isDeadlineFeasible) {
      const delay = projectedArrival - order.deadlineMinutes;
      return {
        score: -1,
        isFeasible: false,
        distanceKm,
        travelTimeMinutes,
        scoreBreakdown: this.emptyBreakdown(),
        reasons: [`Infeasible: Misses delivery window by ${delay} mins (ETA: ${projectedArrival}m, Deadline: ${order.deadlineMinutes}m)`]
      };
    }

    // Normalizations
    const rawProfitNorm = Math.min(1.0, order.profit / MAX_REFERENCE_PROFIT);
    const profitTerm = weights.profitWeight * rawProfitNorm;

    const deadlineHours = Math.max(0.5, order.deadlineMinutes / 60.0);
    const urgencyFactor = Math.min(1.0, (order.priority / 5.0) * (3.0 / Math.sqrt(deadlineHours)));
    const urgencyTerm = weights.urgencyWeight * urgencyFactor;

    const costNorm = Math.min(1.0, distanceKm / MAX_REFERENCE_DISTANCE);
    const costTerm = weights.costWeight * (1.0 - costNorm);

    const capacityUtilization = (truck.usedKg + order.weight) / truck.capacityKg;
    const fitTerm = weights.fitWeight * (1.0 - capacityUtilization * 0.5);

    const totalScore = parseFloat((profitTerm + urgencyTerm + costTerm + fitTerm).toFixed(4));

    // Transparent operational justifications
    if (distanceKm <= 50) {
      reasons.push(`Optimal proximity: Located in ${truck.currentLocation} (${distanceKm} km away)`);
    } else {
      reasons.push(`Route transit: ${distanceKm} km from ${truck.currentLocation} to ${order.destination}`);
    }

    const payloadPercent = Math.round(capacityUtilization * 100);
    reasons.push(`Payload capacity fit: ${payloadPercent}% utilization (${(truck.capacityKg - truck.usedKg - order.weight).toFixed(0)} kg remaining)`);

    if (order.priority >= 4) {
      reasons.push(`High priority express fulfillment: ETA ${projectedArrival}m well before ${order.deadlineMinutes}m deadline`);
    } else {
      reasons.push(`Feasible time window: Estimated arrival in ${projectedArrival} minutes`);
    }

    reasons.push(`Predicted revenue yield: $${order.profit.toFixed(2)} (Score index: ${(totalScore * 100).toFixed(1)}/100)`);

    return {
      score: totalScore,
      isFeasible: true,
      distanceKm,
      travelTimeMinutes,
      scoreBreakdown: {
        profitTerm: parseFloat(profitTerm.toFixed(4)),
        urgencyTerm: parseFloat(urgencyTerm.toFixed(4)),
        costTerm: parseFloat(costTerm.toFixed(4)),
        fitTerm: parseFloat(fitTerm.toFixed(4)),
        rawProfitNorm: parseFloat(rawProfitNorm.toFixed(3)),
        urgencyFactor: parseFloat(urgencyFactor.toFixed(3)),
        costNorm: parseFloat(costNorm.toFixed(3)),
        capacityUtilization: parseFloat(capacityUtilization.toFixed(3))
      },
      reasons
    };
  }

  private static emptyBreakdown(): ScoreBreakdown {
    return {
      profitTerm: 0,
      urgencyTerm: 0,
      costTerm: 0,
      fitTerm: 0,
      rawProfitNorm: 0,
      urgencyFactor: 0,
      costNorm: 0,
      capacityUtilization: 0
    };
  }
}
