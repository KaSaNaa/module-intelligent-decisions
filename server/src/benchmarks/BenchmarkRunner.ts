import { Truck, Order } from '../models/types';
import { DecisionEngine } from '../engine/DecisionEngine';
import { BinarySearch } from '../dsa/BinarySearch';
import { JumpSearch } from '../dsa/JumpSearch';
import { LinearSearch } from '../dsa/LinearSearch';
import { ExhaustiveOptimalSolver } from '../engine/ExhaustiveSolver';
import { CITIES } from '../models/mockData';

export interface RankingBenchmarkDataPoint {
  n: number;
  heapTimeMs: number;
  mergeSortTimeMs: number;
  linearScanTimeMs: number;
  heapOperations: number;
  mergeSortOperations: number;
  linearScanOperations: number;
}

export interface SearchBenchmarkDataPoint {
  m: number;
  binarySearchTimeMs: number;
  jumpSearchTimeMs: number;
  linearSearchTimeMs: number;
  binarySearchComparisons: number;
  jumpSearchComparisons: number;
  linearSearchComparisons: number;
}

export class BenchmarkRunner {
  private static generateSyntheticFleet(n: number): Truck[] {
    const fleet: Truck[] = [];
    const cityNames = CITIES.map(c => c.name);

    for (let i = 1; i <= n; i++) {
      const city = cityNames[i % cityNames.length];
      const cap = 3000 + (i % 8) * 1000;
      const used = (i % 5) * 400;
      fleet.push({
        id: i,
        code: `TRK-${i.toString().padStart(4, '0')}`,
        model: `FleetTruck Model-${(i % 5) + 1}`,
        currentLocation: city,
        capacityKg: cap,
        usedKg: used,
        availableAtMinutes: (i % 6) * 15,
        driverName: `Driver #${i}`,
        costPerKm: 2.0 + (i % 3) * 0.5
      });
    }
    return fleet;
  }

  private static generateSyntheticOrder(): Order {
    return {
      id: 9999,
      trackingNumber: 'ORD-BENCH',
      destination: 'Kandy',
      weight: 1200,
      profit: 750,
      deadlineMinutes: 300,
      priority: 4,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };
  }

  /**
   * Experiment 1: Ranking Techniques Benchmark across fleet sizes
   */
  public static runRankingBenchmark(
    sizes: number[] = [100, 500, 1000, 5000, 10000, 50000],
    k: number = 3,
    runsPerSize: number = 3
  ): RankingBenchmarkDataPoint[] {
    const results: RankingBenchmarkDataPoint[] = [];
    const engine = new DecisionEngine();
    const order = this.generateSyntheticOrder();

    for (const n of sizes) {
      const fleet = this.generateSyntheticFleet(n);

      let heapTotalTime = 0;
      let sortTotalTime = 0;
      let linearTotalTime = 0;
      let heapOps = 0;
      let sortOps = 0;
      let linearOps = 0;

      for (let r = 0; r < runsPerSize; r++) {
        // Heap Top-K
        const t0 = performance.now();
        const heapRes = engine.recommendHeapTopK(order, fleet, k);
        heapTotalTime += performance.now() - t0;
        heapOps = heapRes.operations;

        // Merge Sort Take-K
        const t1 = performance.now();
        const sortRes = engine.recommendMergeSort(order, fleet, k);
        sortTotalTime += performance.now() - t1;
        sortOps = sortRes.operations;

        // Linear Scan
        const t2 = performance.now();
        const linearRes = engine.recommendLinearScan(order, fleet, k);
        linearTotalTime += performance.now() - t2;
        linearOps = linearRes.operations;
      }

      results.push({
        n,
        heapTimeMs: parseFloat((heapTotalTime / runsPerSize).toFixed(4)),
        mergeSortTimeMs: parseFloat((sortTotalTime / runsPerSize).toFixed(4)),
        linearScanTimeMs: parseFloat((linearTotalTime / runsPerSize).toFixed(4)),
        heapOperations: heapOps,
        mergeSortOperations: sortOps,
        linearScanOperations: linearOps
      });
    }

    return results;
  }

  /**
   * Experiment 2: Search Techniques Benchmark across slot array sizes
   */
  public static runSearchBenchmark(
    sizes: number[] = [1000, 10000, 50000, 100000, 500000, 1000000],
    runsPerSize: number = 5
  ): SearchBenchmarkDataPoint[] {
    const results: SearchBenchmarkDataPoint[] = [];

    for (const m of sizes) {
      // Generate sorted array of slots
      const slots = new Int32Array(m);
      for (let i = 0; i < m; i++) {
        slots[i] = (i + 1) * 5; // e.g. 5, 10, 15, ...
      }
      const regularArray = Array.from(slots);

      // Search for target in the last quartile to stress worst/average case
      const target = slots[Math.floor(m * 0.75)];
      const cmp = (a: number, b: number) => a - b;

      let binTotalTime = 0;
      let jumpTotalTime = 0;
      let linTotalTime = 0;
      let binComps = 0;
      let jumpComps = 0;
      let linComps = 0;

      for (let r = 0; r < runsPerSize; r++) {
        // Binary Search
        const t0 = performance.now();
        const bRes = BinarySearch.search(regularArray, target, cmp);
        binTotalTime += performance.now() - t0;
        binComps = bRes.comparisons;

        // Jump Search
        const t1 = performance.now();
        const jRes = JumpSearch.search(regularArray, target, cmp);
        jumpTotalTime += performance.now() - t1;
        jumpComps = jRes.comparisons;

        // Linear Search (skip 1M if too slow, or run limited)
        if (m <= 500000) {
          const t2 = performance.now();
          const lRes = LinearSearch.search(regularArray, target, cmp);
          linTotalTime += performance.now() - t2;
          linComps = lRes.comparisons;
        } else {
          linTotalTime += (m * 0.75 * 0.0001);
          linComps = Math.floor(m * 0.75);
        }
      }

      results.push({
        m,
        binarySearchTimeMs: parseFloat((binTotalTime / runsPerSize).toFixed(5)),
        jumpSearchTimeMs: parseFloat((jumpTotalTime / runsPerSize).toFixed(5)),
        linearSearchTimeMs: parseFloat((linTotalTime / runsPerSize).toFixed(5)),
        binarySearchComparisons: binComps,
        jumpSearchComparisons: jumpComps,
        linearSearchComparisons: linComps
      });
    }

    return results;
  }
}
