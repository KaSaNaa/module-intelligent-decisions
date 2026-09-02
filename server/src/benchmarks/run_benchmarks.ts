import { BenchmarkRunner } from './BenchmarkRunner';
import { ExhaustiveOptimalSolver } from '../engine/ExhaustiveSolver';
import { INITIAL_TRUCKS, INITIAL_ORDERS } from '../models/mockData';
import * as fs from 'fs';
import * as path from 'path';

console.log('Running Ranking Benchmarks...');
const rankingData = BenchmarkRunner.runRankingBenchmark([100, 500, 1000, 5000, 10000, 50000], 3, 5);

console.log('Running Search Benchmarks...');
const searchData = BenchmarkRunner.runSearchBenchmark([1000, 10000, 50000, 100000, 500000, 1000000], 5);

console.log('Running Exhaustive vs Greedy Benchmark...');
const qualityData = [];
for (let n = 2; n <= 8; n += 2) {
  const orders = INITIAL_ORDERS.slice(0, n);
  const fleet = INITIAL_TRUCKS.slice(0, Math.min(n + 2, INITIAL_TRUCKS.length));
  const res = ExhaustiveOptimalSolver.evaluateQuality(orders, fleet);
  qualityData.push(res);
}

const output = {
  rankingData,
  searchData,
  qualityData
};

const outputPath = path.join(__dirname, 'benchmark_results.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log('Saved benchmark results to', outputPath);
