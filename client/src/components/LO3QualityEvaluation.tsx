import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OptimalEvaluationResult, DecisionWeights } from '../types';
import { 
  GitCompare, 
  Play, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  Zap, 
  Sparkles 
} from 'lucide-react';

const DEFAULT_WEIGHTS: DecisionWeights = {
  profitWeight: 0.40,
  urgencyWeight: 0.25,
  costWeight: 0.20,
  fitWeight: 0.15
};

export const LO3QualityEvaluation: React.FC = () => {
  const [ordersCount, setOrdersCount] = useState<number>(4);
  const [trucksCount, setTrucksCount] = useState<number>(8);
  const [weights, setWeights] = useState<DecisionWeights>(DEFAULT_WEIGHTS);
  const [evalResult, setEvalResult] = useState<OptimalEvaluationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    runEvaluation();
  }, []);

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const data = await api.runQualityEvaluation({
        ordersCount,
        trucksCount,
        weights
      });
      setEvalResult(data);
    } catch (err) {
      console.error('Quality evaluation failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Overview Banner */}
      <div className="alert-box alert-info">
        <GitCompare size={20} />
        <div>
          <strong>Multi-Objective Heuristic & Optimality Gap Analysis:</strong> Combinatorial vehicle dispatch allocation is an NP-hard problem with O(N^M) exhaustive search state space. Here we benchmark the fast polynomial <strong>Greedy Multi-Objective Heuristic</strong> against the <strong>Global Optimal Solver</strong> on test instances (N &le; 12, M &le; 6) to evaluate the quality gap and approximation ratio.
        </div>
      </div>

      {/* Controls Card */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <Sliders size={18} />
          <span>Evaluation Instance & Weight Parameters</span>
        </div>
        <p className="card-desc">Configure problem dimensions and heuristic objective weights</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '16px' }}>
          <div>
            <label className="form-label">
              <span>Orders to Allocate (M)</span>
              <span className="font-mono text-cyan-400 font-bold">{ordersCount} orders</span>
            </label>
            <input 
              type="range" min="2" max="6" 
              value={ordersCount} 
              onChange={e => setOrdersCount(Number(e.target.value))}
              className="form-range"
            />
          </div>

          <div>
            <label className="form-label">
              <span>Candidate Fleet Size (N)</span>
              <span className="font-mono text-indigo-400 font-bold">{trucksCount} trucks</span>
            </label>
            <input 
              type="range" min="3" max="10" 
              value={trucksCount} 
              onChange={e => setTrucksCount(Number(e.target.value))}
              className="form-range"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={runEvaluation}
              disabled={loading}
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
              <span>Execute Optimality Benchmark</span>
            </button>
          </div>
        </div>

        {/* Weights sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="form-label"><span>Profit Wt</span><span className="font-mono">{Math.round(weights.profitWeight * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.05" value={weights.profitWeight} onChange={e => setWeights({ ...weights, profitWeight: Number(e.target.value) })} className="form-range" />
          </div>
          <div>
            <div className="form-label"><span>Urgency Wt</span><span className="font-mono">{Math.round(weights.urgencyWeight * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.05" value={weights.urgencyWeight} onChange={e => setWeights({ ...weights, urgencyWeight: Number(e.target.value) })} className="form-range" />
          </div>
          <div>
            <div className="form-label"><span>Cost/Dist Wt</span><span className="font-mono">{Math.round(weights.costWeight * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.05" value={weights.costWeight} onChange={e => setWeights({ ...weights, costWeight: Number(e.target.value) })} className="form-range" />
          </div>
          <div>
            <div className="form-label"><span>Fit Wt</span><span className="font-mono">{Math.round(weights.fitWeight * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.05" value={weights.fitWeight} onChange={e => setWeights({ ...weights, fitWeight: Number(e.target.value) })} className="form-range" />
          </div>
        </div>
      </div>

      {/* Benchmark Results */}
      {evalResult && (
        <div>
          {/* Key Metrics Cards */}
          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="gauge-card">
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Profit Approximation Ratio
              </div>
              <div className="gauge-value">
                {evalResult.qualityMetrics.profitApproximationRatio}%
              </div>
              <div className="gauge-sub">
                Target: &gt;90% • Status: {evalResult.qualityMetrics.profitApproximationRatio >= 90 ? 'OPTIMAL FIDELITY ✓' : 'TUNING REQUIRED'}
              </div>
            </div>

            <div className="gauge-card">
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Quality Deficit / Gap
              </div>
              <div className="gauge-value" style={{ color: evalResult.qualityMetrics.profitGap === 0 ? '#10b981' : '#f59e0b' }}>
                ${evalResult.qualityMetrics.profitGap}
              </div>
              <div className="gauge-sub">
                Optimal: ${evalResult.exhaustiveOptimal.totalProfit} vs Greedy: ${evalResult.greedyHeuristic.totalProfit}
              </div>
            </div>

            <div className="gauge-card">
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Algorithmic Speedup
              </div>
              <div className="gauge-value" style={{ color: '#38bdf8' }}>
                {evalResult.qualityMetrics.speedupFactor}x
              </div>
              <div className="gauge-sub">
                States: {evalResult.exhaustiveOptimal.statesExplored.toLocaleString()} vs {evalResult.greedyHeuristic.statesExplored}
              </div>
            </div>
          </div>

          {/* Detailed Side-by-Side Comparison */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            {/* Exhaustive Optimal Card */}
            <div className="glass-card" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
              <div className="card-title">
                <Sparkles size={18} className="text-cyan-400" />
                <span>Exhaustive Optimal Solver (Exact Benchmark)</span>
              </div>
              <p className="card-desc">Explores all {evalResult.instanceSize.trucksCount}^{evalResult.instanceSize.ordersCount} permutation branches</p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Optimal Profit:</span>
                  <strong style={{ color: '#10b981' }}>${evalResult.exhaustiveOptimal.totalProfit}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Decision Score:</span>
                  <strong style={{ color: '#38bdf8' }}>{evalResult.exhaustiveOptimal.totalScore.toFixed(4)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Compute Latency:</span>
                  <span className="font-mono">{evalResult.exhaustiveOptimal.executionTimeMs.toFixed(3)} ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Search States Visited:</span>
                  <span className="font-mono">{evalResult.exhaustiveOptimal.statesExplored.toLocaleString()} nodes</span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                GLOBAL OPTIMAL ASSIGNMENTS
              </div>
              {evalResult.exhaustiveOptimal.assignments.map((a, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '6px', marginBottom: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ color: '#fff' }}>{a.order.trackingNumber}</strong> ({a.order.destination}, {a.order.weight}kg)
                  </div>
                  <div style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    → {a.truck.code} (${a.profit})
                  </div>
                </div>
              ))}
            </div>

            {/* Greedy Heuristic Card */}
            <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
              <div className="card-title">
                <Zap size={18} className="text-emerald-400" />
                <span>Greedy Multi-Objective Heuristic</span>
              </div>
              <p className="card-desc">Real-time polynomial multi-criteria scoring algorithm</p>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Heuristic Profit:</span>
                  <strong style={{ color: '#10b981' }}>${evalResult.greedyHeuristic.totalProfit}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Decision Score:</span>
                  <strong style={{ color: '#38bdf8' }}>{evalResult.greedyHeuristic.totalScore.toFixed(4)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Compute Latency:</span>
                  <span className="font-mono text-emerald-400 font-bold">{evalResult.greedyHeuristic.executionTimeMs.toFixed(3)} ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Evaluations Count:</span>
                  <span className="font-mono text-emerald-400 font-bold">{evalResult.greedyHeuristic.statesExplored} scans</span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                GREEDY HEURISTIC ASSIGNMENTS
              </div>
              {evalResult.greedyHeuristic.assignments.map((a, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '6px', marginBottom: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <strong style={{ color: '#fff' }}>{a.order.trackingNumber}</strong> ({a.order.destination}, {a.order.weight}kg)
                  </div>
                  <div style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    → {a.truck.code} (${a.profit})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Analysis Explanation */}
          <div className="glass-card">
            <div className="card-title">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Optimality & Quality Evaluation Summary</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              {evalResult.analysisExplanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
