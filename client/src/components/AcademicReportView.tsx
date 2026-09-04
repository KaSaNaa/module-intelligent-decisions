import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Cpu, 
  Network, 
  GitCompare, 
  Layers, 
  ShieldCheck,
  Code
} from 'lucide-react';

export const AcademicReportView: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Title Header */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-perf" style={{ marginBottom: '8px' }}>Architecture &amp; Algorithm Whitepaper</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
              IDSS Fleet Decision Intelligence Engine
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              High-Throughput Autonomous Vehicle Assignment &amp; Multi-Objective Optimization
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-perf">O(n log k) Scalability</span>
            <span className="badge badge-arch">Custom DSA Architecture</span>
            <span className="badge badge-opt">Multi-Objective Optimization</span>
          </div>
        </div>
      </div>

      {/* Section 1: Module Overview */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <BookOpen size={18} className="text-indigo-400" />
          <span>1. Operational Context &amp; Decision Objective</span>
        </div>
        <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>
            The <strong>Intelligent Decision Engine</strong> serves as the central operational dispatch brain for the Intelligent Decision Support System (IDSS). It evaluates real-time demand queries and answers the operational allocation problem:
          </p>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid #2563eb', padding: '12px 16px', borderRadius: '4px', fontStyle: 'italic', marginBottom: '14px', color: '#3730a3' }}>
            "A new delivery order just arrived with specific weight, profit, destination, deadline, and priority — which truck candidate should take it, via which route, and scheduled at what delivery slot?"
          </div>
          <p>
            The engine evaluates dynamic constraints (truck payload capacities, current city locations, remaining delivery schedules) and produces a <strong>ranked top-k list of recommendations</strong> with transparent, explainable scoring justifications.
          </p>
        </div>
      </div>

      {/* Section 2: Candidate Techniques Comparison Table */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <Cpu size={18} className="text-cyan-400" />
          <span>2. Algorithmic Candidates &amp; Comparative Complexity</span>
        </div>
        <p className="card-desc">Comparative analysis across the 8 evaluated algorithmic candidates</p>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate Technique</th>
                <th>Category</th>
                <th>Time Complexity</th>
                <th>Space</th>
                <th>Role &amp; Suitability in Engine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Heap-based Top-k Ranking</strong></td>
                <td className="font-mono">Binary Heap</td>
                <td className="font-mono text-cyan-400">O(n log k)</td>
                <td className="font-mono">O(k)</td>
                <td><strong style={{ color: '#15803d' }}>Selected Primary</strong> — optimal for interactive top-3 ranking when k is much smaller than n.</td>
              </tr>
              <tr>
                <td><strong>Binary Search</strong></td>
                <td className="font-mono">Search Algorithm</td>
                <td className="font-mono text-cyan-400">O(log m)</td>
                <td className="font-mono">O(1)</td>
                <td><strong style={{ color: '#15803d' }}>Selected Primary</strong> — fastest lookup for sorted delivery slots &amp; capacity thresholds.</td>
              </tr>
              <tr>
                <td><strong>Greedy Weighted Scoring</strong></td>
                <td className="font-mono">Heuristic Optimization</td>
                <td className="font-mono text-emerald-400">O(n)</td>
                <td className="font-mono">O(1)</td>
                <td><strong style={{ color: '#15803d' }}>Selected Heuristic</strong> — balances profit, urgency, proximity, and capacity fit.</td>
              </tr>
              <tr>
                <td><strong>Binary Search Tree (BST)</strong></td>
                <td className="font-mono">Hierarchical Tree</td>
                <td className="font-mono text-amber-400">O(log n) avg / O(n) worst</td>
                <td className="font-mono">O(n)</td>
                <td><strong>Dynamic Fleet Records</strong> — handles insertions/deletions, with worst-case analysis.</td>
              </tr>
              <tr>
                <td><strong>Merge Sort Full Ranking</strong></td>
                <td className="font-mono">Divide &amp; Conquer</td>
                <td className="font-mono text-rose-400">O(n log n)</td>
                <td className="font-mono">O(n)</td>
                <td><em>Comparative Baseline</em> — wasteful when only top-k is requested.</td>
              </tr>
              <tr>
                <td><strong>Jump Search</strong></td>
                <td className="font-mono">Block Search</td>
                <td className="font-mono text-amber-400">O(√m)</td>
                <td className="font-mono">O(1)</td>
                <td><em>Comparative Baseline</em> — dominated by Binary Search.</td>
              </tr>
              <tr>
                <td><strong>Linear Search</strong></td>
                <td className="font-mono">Sequential Scan</td>
                <td className="font-mono text-rose-400">O(n)</td>
                <td className="font-mono">O(1)</td>
                <td><em>Legacy Baseline</em> — too slow for repeated queries at high scale.</td>
              </tr>
              <tr>
                <td><strong>Exhaustive Backtracking</strong></td>
                <td className="font-mono">Exact Combinatorial</td>
                <td className="font-mono text-rose-400">O(N^M)</td>
                <td className="font-mono">O(M)</td>
                <td><strong>Exact Optimal Benchmark</strong> — computes true global optimum on small instances.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Data Structures & Scoring Formula */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <Network size={18} className="text-emerald-400" />
          <span>3. Data Structure Architecture &amp; Multi-Criteria Scoring Formula</span>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>
            The multi-objective heuristic scoring engine combines conflicting operational objectives into a single normalized score in [0, 1]:
          </p>
          <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: '#0f172a', marginBottom: '14px' }}>
            Score(t, o) = w1 · ProfitNorm(o.profit) + w2 · Urgency(o.priority, o.deadline) + w3 · (1 - DistNorm(d)) + w4 · Fit(t.usedKg, o.weight, t.capacityKg)
          </div>
          <p style={{ marginBottom: '12px' }}>
            <strong>Default Parameter Weights:</strong> w1 = 0.40 (Profit), w2 = 0.25 (Urgency), w3 = 0.20 (Cost/Distance), w4 = 0.15 (Capacity Fit).
          </p>
        </div>
      </div>

      {/* Section 4: Engineering Validation Matrix */}
      <div className="glass-card">
        <div className="card-title">
          <ShieldCheck size={18} className="text-indigo-400" />
          <span>4. System Quality &amp; Algorithmic Verification Matrix</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ color: '#4f46e5', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} /> Complexity &amp; Scalability
            </h4>
            <ul style={{ fontSize: '0.8rem', color: '#475569', listStyle: 'none', lineHeight: '1.5' }}>
              <li>✓ Rigorous Big-O derivation for all 8 candidates</li>
              <li>✓ Experimental validation across N = 100 to 50,000</li>
              <li>✓ Evidence-based rejection of linear, jump, and full sort</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ color: '#0e7490', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Network size={16} /> Custom DSA Design
            </h4>
            <ul style={{ fontSize: '0.8rem', color: '#475569', listStyle: 'none', lineHeight: '1.5' }}>
              <li>✓ Custom Binary Heap PriorityQueue (Min/Max)</li>
              <li>✓ Custom Binary Search bounded slot finder</li>
              <li>✓ Custom BST with in-order traversal &amp; height metrics</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ color: '#15803d', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GitCompare size={16} /> Heuristic Optimization
            </h4>
            <ul style={{ fontSize: '0.8rem', color: '#475569', listStyle: 'none', lineHeight: '1.5' }}>
              <li>✓ Multi-criteria Greedy Scoring Heuristic</li>
              <li>✓ Exhaustive Optimal Solver benchmark on small N</li>
              <li>✓ Profit approximation ratio &gt; 90% achieved with exponential speedup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
