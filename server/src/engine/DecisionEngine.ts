import { Order, Truck, Recommendation, DecisionWeights, RankingAlgorithm, SearchAlgorithm, DecisionResult } from '../models/types';
import { ScoringEngine, DEFAULT_WEIGHTS } from './ScoringEngine';
import { PriorityQueue } from '../dsa/PriorityQueue';
import { MergeSort } from '../dsa/MergeSort';
import { BinarySearch } from '../dsa/BinarySearch';
import { JumpSearch } from '../dsa/JumpSearch';
import { LinearSearch } from '../dsa/LinearSearch';
import { SCHEDULED_DELIVERY_SLOTS } from '../models/mockData';

export class DecisionEngine {
  private deliverySlots: number[];

  constructor(deliverySlots: number[] = SCHEDULED_DELIVERY_SLOTS) {
    this.deliverySlots = [...deliverySlots].sort((a, b) => a - b);
  }

  /**
   * Main recommendation dispatch pipeline
   */
  public recommend(
    order: Order,
    fleet: Truck[],
    k: number = 3,
    algorithm: RankingAlgorithm = 'HEAP_TOP_K',
    searchAlgo: SearchAlgorithm = 'BINARY_SEARCH',
    weights: DecisionWeights = DEFAULT_WEIGHTS
  ): DecisionResult {
    const startTime = performance.now();
    let recommendations: Recommendation[] = [];
    let operationsCount = 0;
    let candidatesEvaluated = fleet.length;
    let feasibleCandidatesCount = 0;

    switch (algorithm) {
      case 'HEAP_TOP_K': {
        const res = this.recommendHeapTopK(order, fleet, k, weights);
        recommendations = res.recommendations;
        operationsCount = res.operations;
        feasibleCandidatesCount = res.feasibleCount;
        break;
      }
      case 'MERGE_SORT': {
        const res = this.recommendMergeSort(order, fleet, k, weights);
        recommendations = res.recommendations;
        operationsCount = res.operations;
        feasibleCandidatesCount = res.feasibleCount;
        break;
      }
      case 'LINEAR_SCAN': {
        const res = this.recommendLinearScan(order, fleet, k, weights);
        recommendations = res.recommendations;
        operationsCount = res.operations;
        feasibleCandidatesCount = res.feasibleCount;
        break;
      }
    }

    // Assign earliest feasible delivery slot using chosen search strategy
    recommendations.forEach((rec, idx) => {
      rec.rank = idx + 1;
      const minAvailableTime = rec.truck.availableAtMinutes + rec.travelTimeMinutes;

      if (searchAlgo === 'BINARY_SEARCH') {
        const slotRes = BinarySearch.findEarliestFeasibleSlot(
          this.deliverySlots,
          minAvailableTime,
          order.deadlineMinutes
        );
        rec.slotMinutes = slotRes.slot !== null ? slotRes.slot : minAvailableTime;
        operationsCount += slotRes.comparisons;
      } else if (searchAlgo === 'JUMP_SEARCH') {
        const jumpRes = JumpSearch.search(
          this.deliverySlots,
          minAvailableTime,
          (a, b) => a - b
        );
        rec.slotMinutes = jumpRes.value !== null ? jumpRes.value : minAvailableTime;
        operationsCount += jumpRes.comparisons;
      } else {
        const linRes = LinearSearch.search(
          this.deliverySlots,
          minAvailableTime,
          (a, b) => a - b
        );
        rec.slotMinutes = linRes.value !== null ? linRes.value : minAvailableTime;
        operationsCount += linRes.comparisons;
      }
    });

    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(4));

    return {
      order,
      recommendations,
      algorithmUsed: algorithm,
      slotSearchUsed: searchAlgo,
      executionTimeMs,
      candidatesEvaluated,
      feasibleCandidatesCount,
      operationsCount
    };
  }

  /**
   * Primary Production Pipeline: Min-Heap Top-K Selection
   * Complexity: O(n log k)
   */
  public recommendHeapTopK(
    order: Order,
    fleet: Truck[],
    k: number = 3,
    weights: DecisionWeights = DEFAULT_WEIGHTS
  ): { recommendations: Recommendation[]; operations: number; feasibleCount: number } {
    // Min-heap ordered by score ascending: smallest score at the root
    const minHeap = new PriorityQueue<Recommendation>((a, b) => a.score - b.score);
    let feasibleCount = 0;

    for (const truck of fleet) {
      const evalRes = ScoringEngine.evaluate(truck, order, weights);
      if (!evalRes.isFeasible || evalRes.score < 0) continue;

      feasibleCount++;
      const rec: Recommendation = {
        rank: 0,
        truck,
        orderId: order.id,
        distanceKm: evalRes.distanceKm,
        travelTimeMinutes: evalRes.travelTimeMinutes,
        routeSummary: `${truck.currentLocation} -> ${order.destination}`,
        slotMinutes: 0,
        score: evalRes.score,
        scoreBreakdown: evalRes.scoreBreakdown,
        reasons: evalRes.reasons,
        isDeadlineFeasible: true,
        isCapacityFeasible: true
      };

      if (minHeap.size() < k) {
        minHeap.offer(rec);
      } else {
        const root = minHeap.peek();
        if (root && rec.score > root.score) {
          minHeap.poll();
          minHeap.offer(rec);
        }
      }
    }

    const stats = minHeap.getStats();
    const result: Recommendation[] = [];
    while (!minHeap.isEmpty()) {
      result.push(minHeap.poll()!);
    }
    result.reverse();

    return {
      recommendations: result,
      operations: stats.totalOperations,
      feasibleCount
    };
  }

  /**
   * Comparative Baseline: Merge Sort full ranking then slice K
   * Complexity: O(n log n)
   */
  public recommendMergeSort(
    order: Order,
    fleet: Truck[],
    k: number = 3,
    weights: DecisionWeights = DEFAULT_WEIGHTS
  ): { recommendations: Recommendation[]; operations: number; feasibleCount: number } {
    const candidates: Recommendation[] = [];

    for (const truck of fleet) {
      const evalRes = ScoringEngine.evaluate(truck, order, weights);
      if (!evalRes.isFeasible || evalRes.score < 0) continue;

      candidates.push({
        rank: 0,
        truck,
        orderId: order.id,
        distanceKm: evalRes.distanceKm,
        travelTimeMinutes: evalRes.travelTimeMinutes,
        routeSummary: `${truck.currentLocation} -> ${order.destination}`,
        slotMinutes: 0,
        score: evalRes.score,
        scoreBreakdown: evalRes.scoreBreakdown,
        reasons: evalRes.reasons,
        isDeadlineFeasible: true,
        isCapacityFeasible: true
      });
    }

    const sortRes = MergeSort.sort(candidates, (a, b) => b.score - a.score);
    const topK = sortRes.sorted.slice(0, k);

    return {
      recommendations: topK,
      operations: sortRes.comparisons,
      feasibleCount: candidates.length
    };
  }

  /**
   * Comparative Baseline: Linear Scan with bounded buffer
   * Complexity: O(n * k log k)
   */
  public recommendLinearScan(
    order: Order,
    fleet: Truck[],
    k: number = 3,
    weights: DecisionWeights = DEFAULT_WEIGHTS
  ): { recommendations: Recommendation[]; operations: number; feasibleCount: number } {
    const topK: Recommendation[] = [];
    let comparisons = 0;
    let feasibleCount = 0;

    for (const truck of fleet) {
      const evalRes = ScoringEngine.evaluate(truck, order, weights);
      if (!evalRes.isFeasible || evalRes.score < 0) continue;

      feasibleCount++;
      const rec: Recommendation = {
        rank: 0,
        truck,
        orderId: order.id,
        distanceKm: evalRes.distanceKm,
        travelTimeMinutes: evalRes.travelTimeMinutes,
        routeSummary: `${truck.currentLocation} -> ${order.destination}`,
        slotMinutes: 0,
        score: evalRes.score,
        scoreBreakdown: evalRes.scoreBreakdown,
        reasons: evalRes.reasons,
        isDeadlineFeasible: true,
        isCapacityFeasible: true
      };

      if (topK.length < k) {
        topK.push(rec);
        topK.sort((a, b) => b.score - a.score);
      } else {
        comparisons++;
        if (rec.score > topK[topK.length - 1].score) {
          topK.pop();
          topK.push(rec);
          topK.sort((a, b) => b.score - a.score);
        }
      }
    }

    return {
      recommendations: topK,
      operations: comparisons + topK.length,
      feasibleCount
    };
  }
}
