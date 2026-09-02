export interface Order {
  id: number;
  trackingNumber: string;
  destination: string;
  weight: number;            // in kg
  profit: number;            // revenue in USD / LKR
  deadlineMinutes: number;   // delivery deadline relative to current time (e.g. 180 mins)
  priority: number;          // 1 (Economy), 2 (Standard), 3 (Priority), 4 (Express), 5 (Emergency/Urgent)
  createdAt: string;
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
}

export interface Truck {
  id: number;
  code: string;              // e.g. "TRK-01"
  model: string;             // e.g. "Volvo FH16"
  currentLocation: string;   // e.g. "Colombo"
  capacityKg: number;        // maximum payload capacity
  usedKg: number;            // already committed payload
  availableAtMinutes: number;// minute offset from now when truck becomes free
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
  slotMinutes: number;        // earliest scheduled feasible delivery slot found
  score: number;
  scoreBreakdown: ScoreBreakdown;
  reasons: string[];
  isDeadlineFeasible: boolean;
  isCapacityFeasible: boolean;
}

export interface DecisionWeights {
  profitWeight: number;    // default: 0.40
  urgencyWeight: number;   // default: 0.25
  costWeight: number;      // default: 0.20
  fitWeight: number;       // default: 0.15
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
  memoryUsedBytes?: number;
  operationsCount: number;
}

export interface CityDistanceCache {
  [key: string]: number; // "Colombo->Kandy": 115
}

export interface CityNode {
  name: string;
  x: number;
  y: number;
}
