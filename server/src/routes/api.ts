import { Router, Request, Response } from 'express';
import { Truck, Order, DecisionWeights, RankingAlgorithm, SearchAlgorithm } from '../models/types';
import { INITIAL_TRUCKS, INITIAL_ORDERS, CITIES, CITY_DISTANCES, SCHEDULED_DELIVERY_SLOTS } from '../models/mockData';
import { DecisionEngine } from '../engine/DecisionEngine';
import { DEFAULT_WEIGHTS } from '../engine/ScoringEngine';
import { ExhaustiveOptimalSolver } from '../engine/ExhaustiveSolver';
import { BenchmarkRunner } from '../benchmarks/BenchmarkRunner';
import { BinarySearchTree } from '../dsa/BinarySearchTree';

export const apiRouter = Router();

// In-Memory operational state
let fleet: Truck[] = JSON.parse(JSON.stringify(INITIAL_TRUCKS));
let orders: Order[] = JSON.parse(JSON.stringify(INITIAL_ORDERS));
const bstFleet = new BinarySearchTree<Truck>();

fleet.forEach(t => bstFleet.insert(t.id, t));

const decisionEngine = new DecisionEngine(SCHEDULED_DELIVERY_SLOTS);

// -------------------------------------------------------------
// FLEET & ORDERS
// -------------------------------------------------------------
apiRouter.get('/fleet', (_req: Request, res: Response) => {
  res.json({ success: true, count: fleet.length, data: fleet });
});

apiRouter.post('/fleet', (req: Request, res: Response) => {
  const { model, currentLocation, capacityKg, availableAtMinutes, driverName, costPerKm } = req.body;
  const newId = fleet.length > 0 ? Math.max(...fleet.map(t => t.id)) + 1 : 1;
  const newTruck: Truck = {
    id: newId,
    code: `TRK-${newId.toString().padStart(2, '0')}`,
    model: model || 'Standard Carrier 4T',
    currentLocation: currentLocation || 'Colombo',
    capacityKg: Number(capacityKg) || 5000,
    usedKg: 0,
    availableAtMinutes: Number(availableAtMinutes) || 0,
    driverName: driverName || `Driver ${newId}`,
    costPerKm: Number(costPerKm) || 2.0
  };
  fleet.push(newTruck);
  bstFleet.insert(newTruck.id, newTruck);
  res.status(201).json({ success: true, data: newTruck });
});

apiRouter.put('/fleet/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const truck = fleet.find(t => t.id === id);
  if (!truck) {
    return res.status(404).json({ success: false, error: 'Truck not found' });
  }
  Object.assign(truck, req.body);
  bstFleet.insert(truck.id, truck);
  res.json({ success: true, data: truck });
});

apiRouter.delete('/fleet/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  fleet = fleet.filter(t => t.id !== id);
  bstFleet.delete(id);
  res.json({ success: true, message: `Truck ${id} removed` });
});

apiRouter.get('/orders', (_req: Request, res: Response) => {
  res.json({ success: true, count: orders.length, data: orders });
});

apiRouter.post('/orders', (req: Request, res: Response) => {
  const { destination, weight, profit, deadlineMinutes, priority } = req.body;
  const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 101;
  const newOrder: Order = {
    id: newId,
    trackingNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    destination: destination || 'Kandy',
    weight: Number(weight) || 1000,
    profit: Number(profit) || 500,
    deadlineMinutes: Number(deadlineMinutes) || 240,
    priority: Number(priority) || 3,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING'
  };
  orders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

// -------------------------------------------------------------
// DECISION ENGINE RECOMMENDATION
// -------------------------------------------------------------
apiRouter.post('/recommend', (req: Request, res: Response) => {
  try {
    const { order, k = 3, algorithm = 'HEAP_TOP_K', searchAlgo = 'BINARY_SEARCH', weights } = req.body;
    if (!order) {
      return res.status(400).json({ success: false, error: 'Order data required' });
    }

    const decisionWeights: DecisionWeights = {
      profitWeight: weights?.profitWeight ?? DEFAULT_WEIGHTS.profitWeight,
      urgencyWeight: weights?.urgencyWeight ?? DEFAULT_WEIGHTS.urgencyWeight,
      costWeight: weights?.costWeight ?? DEFAULT_WEIGHTS.costWeight,
      fitWeight: weights?.fitWeight ?? DEFAULT_WEIGHTS.fitWeight
    };

    const result = decisionEngine.recommend(
      order,
      fleet,
      Number(k),
      algorithm as RankingAlgorithm,
      searchAlgo as SearchAlgorithm,
      decisionWeights
    );

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/dispatch', (req: Request, res: Response) => {
  const { orderId, truckId } = req.body;
  const order = orders.find(o => o.id === Number(orderId));
  const truck = fleet.find(t => t.id === Number(truckId));

  if (!order || !truck) {
    return res.status(404).json({ success: false, error: 'Order or Truck not found' });
  }

  if (truck.usedKg + order.weight > truck.capacityKg) {
    return res.status(400).json({ success: false, error: 'Cannot dispatch: Truck capacity exceeded' });
  }

  truck.usedKg += order.weight;
  order.status = 'DISPATCHED';
  bstFleet.insert(truck.id, truck);

  res.json({
    success: true,
    message: `Order ${order.trackingNumber} successfully dispatched onto ${truck.code}`,
    truck,
    order
  });
});

// -------------------------------------------------------------
// ROAD NETWORK & CACHE
// -------------------------------------------------------------
apiRouter.get('/network', (_req: Request, res: Response) => {
  res.json({
    success: true,
    cities: CITIES,
    distances: CITY_DISTANCES,
    slots: SCHEDULED_DELIVERY_SLOTS
  });
});

// -------------------------------------------------------------
// BENCHMARKING APIS
// -------------------------------------------------------------
apiRouter.post('/benchmarks/ranking', (req: Request, res: Response) => {
  try {
    const { sizes = [100, 500, 1000, 5000, 10000, 50000], k = 3 } = req.body;
    const data = BenchmarkRunner.runRankingBenchmark(sizes, Number(k));
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/benchmarks/search', (req: Request, res: Response) => {
  try {
    const { sizes = [1000, 10000, 50000, 100000, 500000, 1000000] } = req.body;
    const data = BenchmarkRunner.runSearchBenchmark(sizes);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/benchmarks/quality', (req: Request, res: Response) => {
  try {
    const { ordersCount = 4, trucksCount = 8, weights } = req.body;
    const countN = Math.min(12, Math.max(3, Number(trucksCount)));
    const countM = Math.min(6, Math.max(1, Number(ordersCount)));

    const testTrucks = fleet.slice(0, countN);
    const testOrders = orders.slice(0, countM);

    const decisionWeights: DecisionWeights = {
      profitWeight: weights?.profitWeight ?? DEFAULT_WEIGHTS.profitWeight,
      urgencyWeight: weights?.urgencyWeight ?? DEFAULT_WEIGHTS.urgencyWeight,
      costWeight: weights?.costWeight ?? DEFAULT_WEIGHTS.costWeight,
      fitWeight: weights?.fitWeight ?? DEFAULT_WEIGHTS.fitWeight
    };

    const evaluation = ExhaustiveOptimalSolver.evaluateQuality(testOrders, testTrucks, decisionWeights);
    res.json({ success: true, data: evaluation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// BST OPERATIONS & VISUALIZATION
// -------------------------------------------------------------
apiRouter.get('/bst', (_req: Request, res: Response) => {
  res.json({
    success: true,
    size: bstFleet.size(),
    height: bstFleet.getHeight(),
    inOrder: bstFleet.inOrder(),
    preOrder: bstFleet.preOrder(),
    tree: bstFleet.toVisualTree()
  });
});

apiRouter.post('/bst/search', (req: Request, res: Response) => {
  const { key } = req.body;
  const result = bstFleet.search(Number(key));
  res.json({
    success: true,
    found: result.node !== null,
    node: result.node ? { key: result.node.key, value: result.node.value } : null,
    comparisons: result.comparisons
  });
});

apiRouter.post('/bst/skewed', (req: Request, res: Response) => {
  const { n = 10 } = req.body;
  const skewedTree = new BinarySearchTree<string>();
  const balancedTree = new BinarySearchTree<string>();

  // Monotonic sorted insertion
  for (let i = 1; i <= n; i++) {
    skewedTree.insert(i, `Node-${i}`);
  }

  // Balanced midpoint insertion
  function insertBalanced(low: number, high: number) {
    if (low > high) return;
    const mid = Math.floor((low + high) / 2);
    balancedTree.insert(mid, `Node-${mid}`);
    insertBalanced(low, mid - 1);
    insertBalanced(mid + 1, high);
  }
  insertBalanced(1, n);

  const skewedSearch = skewedTree.search(n);
  const balancedSearch = balancedTree.search(n);

  res.json({
    success: true,
    n,
    skewed: {
      height: skewedTree.getHeight(),
      searchComparisons: skewedSearch.comparisons,
      tree: skewedTree.toVisualTree(),
      theoreticalWorstCase: `O(N) = ${n}`
    },
    balanced: {
      height: balancedTree.getHeight(),
      searchComparisons: balancedSearch.comparisons,
      tree: balancedTree.toVisualTree(),
      theoreticalAverageCase: `O(log2 N) ≈ ${Math.ceil(Math.log2(n))}`
    }
  });
});
