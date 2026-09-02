import {
  Order,
  Truck,
  DecisionWeights,
  RankingAlgorithm,
  SearchAlgorithm,
  DecisionResult,
  RankingBenchmarkDataPoint,
  SearchBenchmarkDataPoint,
  OptimalEvaluationResult,
  BSTResponse
} from '../types';

const BASE_URL = '/api';

export const api = {
  async getFleet(): Promise<Truck[]> {
    const res = await fetch(`${BASE_URL}/fleet`);
    const data = await res.json();
    return data.data;
  },

  async addTruck(truck: Partial<Truck>): Promise<Truck> {
    const res = await fetch(`${BASE_URL}/fleet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(truck)
    });
    const data = await res.json();
    return data.data;
  },

  async deleteTruck(id: number): Promise<void> {
    await fetch(`${BASE_URL}/fleet/${id}`, { method: 'DELETE' });
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${BASE_URL}/orders`);
    const data = await res.json();
    return data.data;
  },

  async createOrder(order: Partial<Order>): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    return data.data;
  },

  async getRecommendations(params: {
    order: Order;
    k: number;
    algorithm: RankingAlgorithm;
    searchAlgo: SearchAlgorithm;
    weights: DecisionWeights;
  }): Promise<DecisionResult> {
    const res = await fetch(`${BASE_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data.data;
  },

  async dispatchOrder(orderId: number, truckId: number): Promise<any> {
    const res = await fetch(`${BASE_URL}/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, truckId })
    });
    return res.json();
  },

  async getNetwork(): Promise<{ cities: any[]; distances: Record<string, number>; slots: number[] }> {
    const res = await fetch(`${BASE_URL}/network`);
    return res.json();
  },

  async runRankingBenchmark(sizes?: number[], k?: number): Promise<RankingBenchmarkDataPoint[]> {
    const res = await fetch(`${BASE_URL}/benchmarks/ranking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizes, k })
    });
    const data = await res.json();
    return data.data;
  },

  async runSearchBenchmark(sizes?: number[]): Promise<SearchBenchmarkDataPoint[]> {
    const res = await fetch(`${BASE_URL}/benchmarks/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sizes })
    });
    const data = await res.json();
    return data.data;
  },

  async runQualityEvaluation(params: {
    ordersCount: number;
    trucksCount: number;
    weights: DecisionWeights;
  }): Promise<OptimalEvaluationResult> {
    const res = await fetch(`${BASE_URL}/benchmarks/quality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data.data;
  },

  async getBST(): Promise<BSTResponse> {
    const res = await fetch(`${BASE_URL}/bst`);
    return res.json();
  },

  async searchBST(key: number): Promise<{ found: boolean; node: any; comparisons: number }> {
    const res = await fetch(`${BASE_URL}/bst/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    return res.json();
  },

  async getSkewedBSTDemo(n: number = 10): Promise<any> {
    const res = await fetch(`${BASE_URL}/bst/skewed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n })
    });
    return res.json();
  }
};
