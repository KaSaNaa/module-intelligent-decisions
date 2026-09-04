import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BSTResponse, VisualTreeNode } from '../types';
import { 
  Network, 
  Search, 
  AlertTriangle, 
  RefreshCw, 
  GitBranch 
} from 'lucide-react';

export const BSTVisualizer: React.FC = () => {
  const [bstData, setBstData] = useState<BSTResponse | null>(null);
  const [searchKey, setSearchKey] = useState<number>(3);
  const [searchResult, setSearchResult] = useState<{ found: boolean; node: any; comparisons: number } | null>(null);
  const [skewedDemo, setSkewedDemo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadBST();
    loadSkewedDemo();
  }, []);

  const loadBST = async () => {
    setLoading(true);
    try {
      const data = await api.getBST();
      setBstData(data);
    } catch (err) {
      console.error('Failed to load BST', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSkewedDemo = async () => {
    try {
      const demo = await api.getSkewedBSTDemo(8);
      setSkewedDemo(demo);
    } catch (err) {
      console.error('Failed to load skewed demo', err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.searchBST(searchKey);
      setSearchResult(res);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  // Recursive tree node renderer
  const renderTreeNode = (node: VisualTreeNode | null): React.ReactNode => {
    if (!node) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
        <div 
          className="tree-node-card"
          style={{
            borderColor: searchResult?.node?.key === node.key ? '#0284c7' : 'rgba(37, 99, 235, 0.4)',
            background: searchResult?.node?.key === node.key ? 'rgba(2, 132, 199, 0.12)' : '#f1f5f9'
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
            ID #{node.key}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {node.payload?.code || `Node-${node.key}`}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#9333ea', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            h:{node.height} | bf:{node.balanceFactor}
          </div>
        </div>

        {(node.left || node.right) && (
          <div style={{ display: 'flex', marginTop: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {renderTreeNode(node.left)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {renderTreeNode(node.right)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Overview Banner */}
      <div className="alert-box alert-info">
        <GitBranch size={20} />
        <div>
          <strong>Dynamic Fleet Index (Binary Search Tree):</strong> Real-time logistics fleets undergo continuous record insertions (dynamic registrations, location updates) and deletions. A BST provides O(log n) average lookup and in-order sorted sequencing. This explorer visualizes the tree structure and illustrates the <strong>worst-case O(n) degradation under skewed sequential insertions</strong>.
        </div>
      </div>

      <div className="grid-decision" style={{ marginBottom: '24px' }}>
        {/* BST Controls & Search */}
        <div className="glass-card">
          <div className="card-title">
            <Search size={18} />
            <span>BST Search & Query</span>
          </div>
          <p className="card-desc">Search vehicle records by primary key ID</p>

          <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label">Vehicle ID Key</label>
              <input 
                type="number" 
                className="form-input"
                value={searchKey}
                onChange={e => setSearchKey(Number(e.target.value))}
                min="1" max="100"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Search size={16} /> Search in BST
            </button>
          </form>

          {searchResult && (
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: searchResult.found ? '#15803d' : '#dc2626' }}>
                  {searchResult.found ? '✓ Record Found' : '✗ Record Not Found'}
                </span>
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  {searchResult.comparisons} BST Comparisons
                </span>
              </div>
              {searchResult.found && (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  <div>Model: <strong style={{ color: '#1e293b' }}>{searchResult.node.value.model}</strong></div>
                  <div>Location: <strong style={{ color: '#1e293b' }}>{searchResult.node.value.currentLocation}</strong></div>
                  <div>Capacity: <strong style={{ color: '#15803d' }}>{searchResult.node.value.capacityKg} kg</strong></div>
                </div>
              )}
            </div>
          )}

          {/* Tree Statistics */}
          {bstData && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>
                Tree Complexity Metrics
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                <div>Total Nodes: <strong className="font-mono text-indigo-400">{bstData.size}</strong></div>
                <div>Tree Height (h): <strong className="font-mono text-cyan-400">{bstData.height}</strong></div>
                <div>Avg Lookup: <strong className="font-mono text-emerald-400">O(log n)</strong></div>
                <div>Worst Lookup: <strong className="font-mono text-rose-400">O(n)</strong></div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>IN-ORDER TRAVERSAL (SORTED KEYS):</div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: '#0284c7', background: '#f8fafc', padding: '6px 10px', borderRadius: '4px' }}>
                  [{bstData.inOrder.map(n => n.key).join(' → ')}]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visual BST Hierarchy Canvas */}
        <div className="glass-card">
          <div className="card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={18} className="text-cyan-400" />
              <span>Active Fleet BST Visual Hierarchy</span>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={loadBST}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <p className="card-desc">Hierarchical view of trucks stored in the BST</p>

          <div className="tree-container">
            {bstData?.tree ? renderTreeNode(bstData.tree) : <div>No tree data available</div>}
          </div>
        </div>
      </div>

      {/* Skewed vs Balanced BST Worst-Case Analysis */}
      {skewedDemo && (
        <div className="glass-card">
          <div className="card-title">
            <AlertTriangle size={18} className="text-amber-400" />
            <span>Binary Search Tree Asymptotic Degradation & Balanced State Analysis</span>
          </div>
          <p className="card-desc">Demonstrates worst-case O(n) search degradation when keys are inserted in monotonic sorted order versus balanced insertion</p>

          <div className="grid-2" style={{ marginTop: '16px' }}>
            {/* Balanced Tree */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <h4 style={{ color: '#15803d', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
                ✓ Balanced Tree Insertion (Optimal)
              </h4>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '12px' }}>
                Keys partitioned evenly at root and subtrees:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', marginBottom: '12px' }}>
                <div>Tree Height: <strong className="font-mono text-emerald-400">{skewedDemo.balanced.height}</strong></div>
                <div>Search Comparisons: <strong className="font-mono text-emerald-400">{skewedDemo.balanced.searchComparisons} comps</strong></div>
                <div>Complexity: <strong className="font-mono">{skewedDemo.balanced.theoreticalAverageCase}</strong></div>
              </div>
            </div>

            {/* Skewed Tree */}
            <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '16px', borderRadius: '10px' }}>
              <h4 style={{ color: '#e11d48', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
                ✗ Skewed Tree Degeneration (Worst Case)
              </h4>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '12px' }}>
                Keys inserted sequentially (1, 2, 3, ...), degrading into a linked list:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', marginBottom: '12px' }}>
                <div>Tree Height: <strong className="font-mono text-rose-400">{skewedDemo.skewed.height} (Equal to N)</strong></div>
                <div>Search Comparisons: <strong className="font-mono text-rose-400">{skewedDemo.skewed.searchComparisons} comps</strong></div>
                <div>Complexity: <strong className="font-mono">{skewedDemo.skewed.theoreticalWorstCase}</strong></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
            <strong>Engineering Trade-off Note:</strong> <em>"While standard BST offers O(log n) average search for dynamic records, it carries the limitation of degenerating into an O(n) linear chain when items are inserted in monotonic sorted order. For production systems requiring strict guaranteed O(log n) worst-case bounds, self-balancing trees (AVL or Red-Black Trees) or array-backed binary heaps are preferred."</em>
          </div>
        </div>
      )}
    </div>
  );
};
