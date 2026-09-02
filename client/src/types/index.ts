export interface Order {
  id: number;
  trackingNumber: string;
  destination: string;
  weight: number;
  profit: number;
  deadlineMinutes: number;
  priority: number;
  createdAt: string;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
}

export interface Truck {
  id: number;
  code: string;
  model: string;
  currentLocation: string;
  capacityKg: number;
  usedKg: number;
  availableAtMinutes: number;
  driverName: string;
  costPerKm: number;
}

export interface ScoreBreakdown {
  profitTerm: number;
  urgencyTerm: number;
  costTerm: number;
  fitTerm: number;
  rawProfitNorm: number;
  urgencyFactor: number;
  costNorm: number;
  capacityUtilization: number;
}

export interface Recommendation {
  rank: number;
  truck: Truck;
  orderId: number;
  distanceKm: number;
  travelTimeMinutes: number;
  routeSummary: string;
  slotMinutes: number;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
  isDeadlineFeasible: boolean;
  isCapacityFeasible: boolean;
}

export interface DecisionWeights {
  profitWeight: number;
  urgencyWeight: number;
  costWeight: number;
  fitWeight: number;
}

export type RankingAlgorithm = 'HEAP_TOP_K' | 'MERGE_SORT' | 'LINEAR_SCAN';
export type SearchAlgorithm = 'BINARY_SEARCH' | 'JUMP_SEARCH' | 'LINEAR_SEARCH';

export interface DecisionResult {
  order: Order;
  recommendations: Recommendation[];
  algorithmUsed: RankingAlgorithm;
  slotSearchUsed: SearchAlgorithm;
  executionTimeMs: number;
  candidatesEvaluated: number;
  feasibleCandidatesCount: number;
  operationsCount: number;
}

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

export interface AssignmentPair {
  order: Order;
  truck: Truck;
  score: number;
  profit: number;
}

export interface OptimalEvaluationResult {
  instanceSize: { ordersCount: number; trucksCount: number };
  exhaustiveOptimal: {
    assignments: AssignmentPair[];
    totalProfit: number;
    totalScore: number;
    executionTimeMs: number;
    statesExplored: number;
  };
  greedyHeuristic: {
    assignments: AssignmentPair[];
    totalProfit: number;
    totalScore: number;
    executionTimeMs: number;
    statesExplored: number;
  };
  qualityMetrics: {
    profitApproximationRatio: number;
    scoreApproximationRatio: number;
    profitGap: number;
    scoreGap: number;
    speedupFactor: number;
    isOptimal: boolean;
  };
  analysisExplanation: string;
}

export interface VisualTreeNode {
  key: number;
  label: string;
  payload: any;
  height: number;
  balanceFactor: number;
  left: VisualTreeNode | null;
  right: VisualTreeNode | null;
}

export interface BSTResponse {
  size: number;
  height: number;
  inOrder: { key: number; value: any }[];
  preOrder: { key: number; value: any }[];
  tree: VisualTreeNode | null;
}
