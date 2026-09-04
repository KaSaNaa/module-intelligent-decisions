import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Order, 
  DecisionResult, 
  DecisionWeights, 
  RankingAlgorithm, 
  SearchAlgorithm 
} from '../types';
import { api } from '../services/api';
import { 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Truck as TruckIcon, 
  Clock, 
  DollarSign, 
  MapPin, 
  Layers, 
  Send, 
  RefreshCw,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const DEFAULT_WEIGHTS: DecisionWeights = {
  profitWeight: 0.40,
  urgencyWeight: 0.25,
  costWeight: 0.20,
  fitWeight: 0.15
};

export const DecisionConsole: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [fleet, setFleet] = useState<Truck[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [kValue, setKValue] = useState<number>(3);
  const [rankingAlgo, setRankingAlgo] = useState<RankingAlgorithm>('HEAP_TOP_K');
  const [searchAlgo, setSearchAlgo] = useState<SearchAlgorithm>('BINARY_SEARCH');
  const [weights, setWeights] = useState<DecisionWeights>(DEFAULT_WEIGHTS);

  // New Order Form state
  const [newOrderDest, setNewOrderDest] = useState('Kandy');
  const [newOrderWeight, setNewOrderWeight] = useState(1200);
  const [newOrderProfit, setNewOrderProfit] = useState(650);
  const [newOrderDeadline, setNewOrderDeadline] = useState(240);
  const [newOrderPriority, setNewOrderPriority] = useState(4);

  // Decision Result State
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dispatchMsg, setDispatchMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [fleetData, ordersData] = await Promise.all([
        api.getFleet(),
        api.getOrders()
      ]);
      setFleet(fleetData);
      setOrders(ordersData);
      if (ordersData.length > 0 && selectedOrderId === null) {
        setSelectedOrderId(ordersData[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data', err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createOrder({
        destination: newOrderDest,
        weight: Number(newOrderWeight),
        profit: Number(newOrderProfit),
        deadlineMinutes: Number(newOrderDeadline),
        priority: Number(newOrderPriority)
      });
      setOrders(prev => [created, ...prev]);
      setSelectedOrderId(created.id);
      setDispatchMsg({ text: `New Order ${created.trackingNumber} created!`, type: 'success' });
    } catch (err: any) {
      setDispatchMsg({ text: err.message, type: 'error' });
    }
  };

  const handleRunDecision = async () => {
    const currentOrder = orders.find(o => o.id === selectedOrderId);
    if (!currentOrder) return;

    setLoading(true);
    setDispatchMsg(null);
    try {
      const result = await api.getRecommendations({
        order: currentOrder,
        k: kValue,
        algorithm: rankingAlgo,
        searchAlgo,
        weights
      });
      setDecisionResult(result);
    } catch (err: any) {
      setDispatchMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (truckId: number) => {
    if (!selectedOrderId) return;
    try {
      const res = await api.dispatchOrder(selectedOrderId, truckId);
      setDispatchMsg({ text: res.message, type: 'success' });
      loadInitialData();
      if (decisionResult) {
        handleRunDecision();
      }
    } catch (err: any) {
      setDispatchMsg({ text: err.message, type: 'error' });
    }
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="animate-fade-in">
      {dispatchMsg && (
        <div className={`alert-box ${dispatchMsg.type === 'success' ? 'alert-success' : 'alert-warning'}`}>
          {dispatchMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{dispatchMsg.text}</span>
        </div>
      )}

      <div className="grid-decision">
        {/* Left Column: Order Selector & Controls */}
        <div className="glass-card">
          <div className="card-title">
            <Sparkles size={20} className="text-indigo-400" />
            <span>Order & Algorithm Configuration</span>
          </div>
          <p className="card-desc">Select incoming order and tune decision parameters</p>

          {/* Select Existing Order */}
          <div className="form-group">
            <label className="form-label">
              <span>Select Active Order</span>
              <span className="font-mono text-xs">{orders.length} available</span>
            </label>
            <select 
              className="form-select"
              value={selectedOrderId || ''}
              onChange={e => setSelectedOrderId(Number(e.target.value))}
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.trackingNumber} - {o.destination} ({o.weight}kg, ${o.profit}, {o.deadlineMinutes}m, P{o.priority})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Order Summary Card */}
          {selectedOrder && (
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="font-mono" style={{ color: '#0284c7', fontWeight: 600 }}>{selectedOrder.trackingNumber}</span>
                <span className={`badge ${selectedOrder.status === 'PENDING' ? 'badge-status' : 'badge-opt'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                <div>Destination: <strong style={{ color: '#1e293b' }}>{selectedOrder.destination}</strong></div>
                <div>Weight: <strong style={{ color: '#1e293b' }}>{selectedOrder.weight} kg</strong></div>
                <div>Profit: <strong style={{ color: '#15803d' }}>${selectedOrder.profit}</strong></div>
                <div>Deadline: <strong style={{ color: '#b45309' }}>{selectedOrder.deadlineMinutes} mins</strong></div>
                <div>Priority: <strong style={{ color: '#9333ea' }}>Level {selectedOrder.priority}/5</strong></div>
              </div>
            </div>
          )}

          {/* Ranking Algorithm Selection */}
          <div className="form-group">
            <label className="form-label">
              <span>Candidate Ranking Engine</span>
              <span className="font-mono text-xs text-indigo-400">
                {rankingAlgo === 'HEAP_TOP_K' ? 'O(n log k)' : rankingAlgo === 'MERGE_SORT' ? 'O(n log n)' : 'O(n·k)'}
              </span>
            </label>
            <select 
              className="form-select"
              value={rankingAlgo}
              onChange={e => setRankingAlgo(e.target.value as RankingAlgorithm)}
            >
              <option value="HEAP_TOP_K">Min-Heap Top-K [Primary Production Engine]</option>
              <option value="MERGE_SORT">Merge Sort Full Ranking [Comparative Baseline]</option>
              <option value="LINEAR_SCAN">Linear Scan Bounded Buffer [Legacy Baseline]</option>
            </select>
          </div>

          {/* Slot Search Algorithm */}
          <div className="form-group">
            <label className="form-label">
              <span>Delivery Slot Search Strategy</span>
              <span className="font-mono text-xs text-cyan-400">
                {searchAlgo === 'BINARY_SEARCH' ? 'O(log m)' : searchAlgo === 'JUMP_SEARCH' ? 'O(√m)' : 'O(m)'}
              </span>
            </label>
            <select 
              className="form-select"
              value={searchAlgo}
              onChange={e => setSearchAlgo(e.target.value as SearchAlgorithm)}
            >
              <option value="BINARY_SEARCH">Binary Search [O(log m) Production]</option>
              <option value="JUMP_SEARCH">Jump Search [O(√m) Comparative]</option>
              <option value="LINEAR_SEARCH">Linear Search [O(m) Sequential Scan]</option>
            </select>
          </div>

          {/* Top K Count */}
          <div className="form-group">
            <div className="form-label">
              <span>Recommendations Count (k)</span>
              <span className="font-mono font-bold text-indigo-400">{kValue}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={kValue} 
              onChange={e => setKValue(Number(e.target.value))}
              className="form-range"
            />
          </div>

          {/* Tunable Heuristic Weights */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={15} /> Multi-Objective Scoring Weights
              </span>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setWeights(DEFAULT_WEIGHTS)}
              >
                Reset
              </button>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Profit Weight (Revenue yield)</span>
                <span className="font-mono">{Math.round(weights.profitWeight * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={weights.profitWeight}
                onChange={e => setWeights({ ...weights, profitWeight: Number(e.target.value) })}
                className="form-range"
              />
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Urgency Weight (Priority & Deadline)</span>
                <span className="font-mono">{Math.round(weights.urgencyWeight * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={weights.urgencyWeight}
                onChange={e => setWeights({ ...weights, urgencyWeight: Number(e.target.value) })}
                className="form-range"
              />
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Cost / Distance Weight (Proximity)</span>
                <span className="font-mono">{Math.round(weights.costWeight * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={weights.costWeight}
                onChange={e => setWeights({ ...weights, costWeight: Number(e.target.value) })}
                className="form-range"
              />
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Capacity Fit Weight (Payload match)</span>
                <span className="font-mono">{Math.round(weights.fitWeight * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                value={weights.fitWeight}
                onChange={e => setWeights({ ...weights, fitWeight: Number(e.target.value) })}
                className="form-range"
              />
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px' }}
            onClick={handleRunDecision}
            disabled={loading || !selectedOrder}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <TrendingUp size={18} />}
            <span>Run Decision Engine</span>
          </button>
        </div>

        {/* Right Column: Ranked Recommendations & Operational Results */}
        <div>
          {decisionResult ? (
            <div>
              {/* Performance & Execution Telemetry Bar */}
              <div className="glass-card" style={{ marginBottom: '16px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ALGORITHM PIPELINE</div>
                    <div style={{ fontWeight: 700, color: '#0284c7', fontFamily: 'var(--font-mono)' }}>
                      {decisionResult.algorithmUsed} + {decisionResult.slotSearchUsed}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>EXECUTION TIME</div>
                    <div style={{ fontWeight: 700, color: '#15803d', fontFamily: 'var(--font-mono)' }}>
                      {decisionResult.executionTimeMs.toFixed(3)} ms
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>FLEET CANDIDATES</div>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontFamily: 'var(--font-mono)' }}>
                      {decisionResult.feasibleCandidatesCount} / {decisionResult.candidatesEvaluated} Feasible
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>DSA OPERATIONS</div>
                    <div style={{ fontWeight: 700, color: '#9333ea', fontFamily: 'var(--font-mono)' }}>
                      {decisionResult.operationsCount} ops
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations List */}
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Top-{decisionResult.recommendations.length} Recommended Truck Assignments</span>
              </h2>

              {decisionResult.recommendations.length === 0 ? (
                <div className="alert-box alert-warning">
                  <AlertCircle size={20} />
                  <div>
                    <strong>No Feasible Trucks Found:</strong> All {decisionResult.candidatesEvaluated} trucks in the fleet either exceed payload capacity or cannot reach {decisionResult.order.destination} within the {decisionResult.order.deadlineMinutes}m deadline.
                  </div>
                </div>
              ) : (
                decisionResult.recommendations.map(rec => (
                  <div key={rec.truck.id} className={`rec-card rank-${rec.rank}`}>
                    <div className="rec-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`rank-pill rank-${rec.rank}`}>
                          RANK #{rec.rank}
                        </span>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
                            {rec.truck.code} • {rec.truck.model}
                          </h3>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Driver: <strong>{rec.truck.driverName}</strong></span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <MapPin size={13} /> {rec.truck.currentLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="score-badge">
                        {(rec.score * 100).toFixed(1)}
                        <span>/100</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="rec-stats">
                      <div className="stat-box">
                        <div className="stat-label">Scheduled Slot</div>
                        <div className="stat-value" style={{ color: '#0284c7' }}>+{rec.slotMinutes} mins</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Transit Distance</div>
                        <div className="stat-value">{rec.distanceKm} km</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Travel ETA</div>
                        <div className="stat-value">{rec.travelTimeMinutes} mins</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-label">Capacity Post-Load</div>
                        <div className="stat-value" style={{ color: '#15803d' }}>
                          {(rec.truck.usedKg + decisionResult.order.weight).toFixed(0)} / {rec.truck.capacityKg} kg
                        </div>
                      </div>
                    </div>

                    {/* Multi-Criteria Score Breakdown Bar */}
                    <div className="breakdown-container">
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                        <span>Heuristic Factor Contribution</span>
                        <span>Score: {rec.score.toFixed(4)}</span>
                      </div>
                      <div className="breakdown-bars">
                        <div 
                          className="bar-segment bar-profit" 
                          style={{ width: `${(rec.scoreBreakdown.profitTerm / Math.max(0.01, rec.score)) * 100}%` }}
                          title={`Profit Term: ${rec.scoreBreakdown.profitTerm.toFixed(3)}`}
                        />
                        <div 
                          className="bar-segment bar-urgency" 
                          style={{ width: `${(rec.scoreBreakdown.urgencyTerm / Math.max(0.01, rec.score)) * 100}%` }}
                          title={`Urgency Term: ${rec.scoreBreakdown.urgencyTerm.toFixed(3)}`}
                        />
                        <div 
                          className="bar-segment bar-cost" 
                          style={{ width: `${(rec.scoreBreakdown.costTerm / Math.max(0.01, rec.score)) * 100}%` }}
                          title={`Cost/Distance Term: ${rec.scoreBreakdown.costTerm.toFixed(3)}`}
                        />
                        <div 
                          className="bar-segment bar-fit" 
                          style={{ width: `${(rec.scoreBreakdown.fitTerm / Math.max(0.01, rec.score)) * 100}%` }}
                          title={`Capacity Fit Term: ${rec.scoreBreakdown.fitTerm.toFixed(3)}`}
                        />
                      </div>
                      <div className="breakdown-legend">
                        <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }} /> Profit ({rec.scoreBreakdown.profitTerm.toFixed(3)})</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> Urgency ({rec.scoreBreakdown.urgencyTerm.toFixed(3)})</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: '#15803d' }} /> Distance ({rec.scoreBreakdown.costTerm.toFixed(3)})</div>
                        <div className="legend-item"><span className="legend-dot" style={{ background: '#9333ea' }} /> Fit ({rec.scoreBreakdown.fitTerm.toFixed(3)})</div>
                      </div>
                    </div>

                    {/* Operational justifications */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Assignment Reasoning
                      </div>
                      <ul className="reasons-list">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="reason-item">
                            <span className="reason-bullet">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Dispatch Action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleDispatch(rec.truck.id)}
                      >
                        <Send size={14} />
                        <span>Dispatch Order onto {rec.truck.code}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <TruckIcon size={48} style={{ color: '#475569', margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Ready to Generate Dispatch Recommendations</h3>
              <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
                Select an active order on the left panel and click <strong>"Run Decision Engine"</strong> to execute the multi-objective scoring and Min-Heap Top-k ranking pipeline.
              </p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleRunDecision}
                disabled={!selectedOrder}
              >
                <TrendingUp size={16} />
                <span>Evaluate Order #{selectedOrder?.trackingNumber || ''}</span>
              </button>
            </div>
          )}

          {/* Quick Create Custom Order Drawer */}
          <div className="glass-card" style={{ marginTop: '24px' }}>
            <div className="card-title">
              <Layers size={18} />
              <span>Simulate Incoming Real-time Order</span>
            </div>
            <p className="card-desc">Inject an order arrival event into the decision pipeline</p>

            <form onSubmit={handleCreateOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div>
                <label className="form-label">Destination</label>
                <select className="form-select" value={newOrderDest} onChange={e => setNewOrderDest(e.target.value)}>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Matara">Matara</option>
                  <option value="Trincomalee">Trincomalee</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Kurunegala">Kurunegala</option>
                </select>
              </div>

              <div>
                <label className="form-label">Weight (kg)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={newOrderWeight} 
                  onChange={e => setNewOrderWeight(Number(e.target.value))}
                  min="50" max="10000"
                />
              </div>

              <div>
                <label className="form-label">Profit ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={newOrderProfit} 
                  onChange={e => setNewOrderProfit(Number(e.target.value))}
                  min="10" max="5000"
                />
              </div>

              <div>
                <label className="form-label">Deadline (mins)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={newOrderDeadline} 
                  onChange={e => setNewOrderDeadline(Number(e.target.value))}
                  min="30" max="1440"
                />
              </div>

              <div>
                <label className="form-label">Priority (1-5)</label>
                <select className="form-select" value={newOrderPriority} onChange={e => setNewOrderPriority(Number(e.target.value))}>
                  <option value="1">1 - Economy</option>
                  <option value="2">2 - Standard</option>
                  <option value="3">3 - Priority</option>
                  <option value="4">4 - Express</option>
                  <option value="5">5 - Emergency</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }}>
                  + Add Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
