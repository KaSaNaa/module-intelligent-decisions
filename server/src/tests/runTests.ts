import { PriorityQueue } from '../dsa/PriorityQueue';
import { BinarySearch } from '../dsa/BinarySearch';
import { JumpSearch } from '../dsa/JumpSearch';
import { LinearSearch } from '../dsa/LinearSearch';
import { MergeSort } from '../dsa/MergeSort';
import { BinarySearchTree } from '../dsa/BinarySearchTree';
import { ScoringEngine, DEFAULT_WEIGHTS } from '../engine/ScoringEngine';
import { DecisionEngine } from '../engine/DecisionEngine';
import { ExhaustiveOptimalSolver } from '../engine/ExhaustiveSolver';
import { INITIAL_TRUCKS, INITIAL_ORDERS, SCHEDULED_DELIVERY_SLOTS } from '../models/mockData';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

console.log('=======================================================');
console.log('  IDSS DECISION INTELLIGENCE ENGINE UNIT TEST SUITE    ');
console.log('=======================================================\n');

// 1. PriorityQueue Tests
console.log('--- 1. Testing PriorityQueue (Min-Heap / Max-Heap) ---');
const minHeap = new PriorityQueue<number>((a, b) => a - b);
[50, 20, 80, 10, 30].forEach(n => minHeap.offer(n));
assert(minHeap.size() === 5, 'MinHeap size is 5');
assert(minHeap.peek() === 10, 'MinHeap peek returns minimum (10)');
assert(minHeap.poll() === 10, 'MinHeap poll removes minimum (10)');
assert(minHeap.poll() === 20, 'MinHeap second poll is 20');
assert(minHeap.poll() === 30, 'MinHeap third poll is 30');

// 2. BinarySearch Tests
console.log('\n--- 2. Testing Binary Search & Feasible Slot Lookup ---');
const sortedArr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const binRes = BinarySearch.search(sortedArr, 40, (a, b) => a - b);
assert(binRes.foundIndex === 3, 'BinarySearch found 40 at index 3');
assert(binRes.comparisons <= 4, `BinarySearch log2(10) comparisons <= 4 (took ${binRes.comparisons})`);

const slotRes = BinarySearch.findEarliestFeasibleSlot(SCHEDULED_DELIVERY_SLOTS, 120, 240);
assert(slotRes.slot === 120, 'BinarySearch slot finder identified 120m for window [120, 240]');

// 3. JumpSearch & LinearSearch Tests
console.log('\n--- 3. Testing Jump Search & Linear Search ---');
const jumpRes = JumpSearch.search(sortedArr, 70, (a, b) => a - b);
assert(jumpRes.foundIndex === 6, 'JumpSearch found 70 at index 6');

const linRes = LinearSearch.search(sortedArr, 90, (a, b) => a - b);
assert(linRes.foundIndex === 8, 'LinearSearch found 90 at index 8');

// 4. MergeSort Tests
console.log('\n--- 4. Testing MergeSort ---');
const unsorted = [64, 25, 12, 22, 11, 90, 34];
const sortRes = MergeSort.sort(unsorted, (a, b) => a - b);
assert(JSON.stringify(sortRes.sorted) === JSON.stringify([11, 12, 22, 25, 34, 64, 90]), 'MergeSort correctly ordered the array');

// 5. BinarySearchTree Tests
console.log('\n--- 5. Testing BinarySearchTree ---');
const bst = new BinarySearchTree<string>();
[50, 30, 70, 20, 40, 60, 80].forEach(k => bst.insert(k, `Val-${k}`));
assert(bst.size() === 7, 'BST size is 7');
assert(bst.getHeight() === 3, 'Balanced BST height is 3');
assert(bst.search(40).node?.value === 'Val-40', 'BST search found key 40');
const inOrder = bst.inOrder().map(n => n.key);
assert(JSON.stringify(inOrder) === JSON.stringify([20, 30, 40, 50, 60, 70, 80]), 'BST in-order traversal yields sorted order');

bst.delete(30);
assert(bst.size() === 6, 'BST size decreased to 6 after deleting node 30');
assert(bst.search(30).node === null, 'Deleted key 30 no longer found');

// 6. ScoringEngine Tests
console.log('\n--- 6. Testing Multi-Objective Scoring Engine ---');
const testTruck = INITIAL_TRUCKS[0];
const testOrder = INITIAL_ORDERS[0];
const evalScore = ScoringEngine.evaluate(testTruck, testOrder, DEFAULT_WEIGHTS);
assert(evalScore.isFeasible === true, 'Truck 1 is feasible for Order 1');
assert(evalScore.score > 0, `Score is positive (${evalScore.score})`);
assert(evalScore.reasons.length > 0, 'Generated operational justifications');

// 7. DecisionEngine Pipeline Tests
console.log('\n--- 7. Testing Decision Engine Pipelines ---');
const engine = new DecisionEngine(SCHEDULED_DELIVERY_SLOTS);
const heapDec = engine.recommend(testOrder, INITIAL_TRUCKS, 3, 'HEAP_TOP_K');
const mergeDec = engine.recommend(testOrder, INITIAL_TRUCKS, 3, 'MERGE_SORT');
assert(heapDec.recommendations.length === 3, 'Heap Top-K returned 3 recommendations');
assert(mergeDec.recommendations.length === 3, 'MergeSort returned 3 recommendations');
assert(heapDec.recommendations[0].truck.id === mergeDec.recommendations[0].truck.id, 'Heap and MergeSort agreed on #1 top pick');

// 8. Exhaustive Solver vs Greedy Quality Tests
console.log('\n--- 8. Testing Exact Solver vs Greedy Multi-Objective Heuristic ---');
const qualityResult = ExhaustiveOptimalSolver.evaluateQuality(INITIAL_ORDERS.slice(0, 3), INITIAL_TRUCKS.slice(0, 6));
assert(qualityResult.exhaustiveOptimal.totalProfit > 0, `Exhaustive optimal profit: $${qualityResult.exhaustiveOptimal.totalProfit}`);
assert(qualityResult.greedyHeuristic.totalProfit > 0, `Greedy heuristic profit: $${qualityResult.greedyHeuristic.totalProfit}`);
assert(qualityResult.qualityMetrics.profitApproximationRatio >= 80, `Profit approximation ratio high fidelity: ${qualityResult.qualityMetrics.profitApproximationRatio}%`);

console.log('\n=======================================================');
console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('=======================================================');

if (failed > 0) {
  process.exit(1);
}
