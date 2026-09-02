import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SearchBenchmarkDataPoint } from '../types';
import { 
  Search, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  FileSpreadsheet 
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

export const SearchBenchmark: React.FC = () => {
  const [searchData, setSearchData] = useState<SearchBenchmarkDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    runBenchmark();
  }, []);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const data = await api.runSearchBenchmark([1000, 10000, 50000, 100000, 500000, 1000000]);
      setSearchData(data);
    } catch (err) {
      console.error('Search benchmark failed', err);
    } finally {
      setLoading(false);
    }
  };

  const chartLabels = searchData.map(d => `M=${d.m.toLocaleString()}`);

  const compsChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Binary Search [O(log m)] (Primary)',
        data: searchData.map(d => d.binarySearchComparisons),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.2,
        fill: true,
        pointRadius: 6
      },
      {
        label: 'Jump Search [O(√m)] (Comparative)',
        data: searchData.map(d => d.jumpSearchComparisons),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        borderWidth: 2,
        tension: 0.2,
        fill: false,
        pointRadius: 5
      },
      {
        label: 'Linear Search [O(m)] (Sequential Scan)',
        data: searchData.map(d => d.linearSearchComparisons),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        borderDash: [4, 4],
        tension: 0.2,
        fill: false,
        pointRadius: 4
      }
    ]
  };

  const timeChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Binary Search Time (ms)',
        data: searchData.map(d => d.binarySearchTimeMs),
        borderColor: '#10b981',
        borderWidth: 3,
        tension: 0.2,
        pointRadius: 5
      },
      {
        label: 'Jump Search Time (ms)',
        data: searchData.map(d => d.jumpSearchTimeMs),
        borderColor: '#f59e0b',
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 5
      },
      {
        label: 'Linear Search Time (ms)',
        data: searchData.map(d => d.linearSearchTimeMs),
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [4, 4],
        tension: 0.2,
        pointRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Overview Banner */}
      <div className="alert-box alert-info">
        <Zap size={20} />
        <div>
          <strong>Search & Slot Resolution Benchmark:</strong> Evaluates search techniques over sorted delivery slot schedules and capacity lookups across M in [1,000, 1,000,000] elements. Proves that <strong>Binary Search (O(log m))</strong> decisively outperforms Jump Search (O(√m)) and Linear Search (O(m)).
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Delivery Slot Lookup Benchmark</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Target element in 75th percentile of sorted schedule array</p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={runBenchmark}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            <span>Re-Run Search Benchmark</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="glass-card">
          <div className="card-title">
            <Search size={18} className="text-emerald-400" />
            <span>Comparisons Count vs Array Size M (Logarithmic Scale)</span>
          </div>
          <p className="card-desc">Exact element comparisons required to resolve delivery slot</p>
          <div style={{ height: '320px' }}>
            {searchData.length > 0 && <Line data={compsChartData} options={chartOptions} />}
          </div>
        </div>

        <div className="glass-card">
          <div className="card-title">
            <TrendingUp size={18} className="text-amber-400" />
            <span>Execution Latency (ms) vs Array Size M</span>
          </div>
          <p className="card-desc">Search execution time in milliseconds</p>
          <div style={{ height: '320px' }}>
            {searchData.length > 0 && <Line data={timeChartData} options={chartOptions} />}
          </div>
        </div>
      </div>

      {/* Empirical Evidence Table */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <FileSpreadsheet size={18} />
          <span>Search Strategy Comparison & Efficiency Results</span>
        </div>
        <p className="card-desc">Binary Search strictly requires at most ⌈log2 M⌉ comparisons</p>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Slots Count (M)</th>
                <th>Binary Search (O(log m))</th>
                <th>Jump Search (O(√m))</th>
                <th>Linear Search (O(m))</th>
                <th>Binary Advantage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {searchData.map(d => {
                const compRatio = (d.linearSearchComparisons / Math.max(1, d.binarySearchComparisons)).toFixed(0);
                return (
                  <tr key={d.m}>
                    <td className="font-mono" style={{ fontWeight: 600, color: '#f8fafc' }}>{d.m.toLocaleString()}</td>
                    <td className="font-mono" style={{ color: '#10b981', fontWeight: 700 }}>
                      {d.binarySearchComparisons} comps ({d.binarySearchTimeMs.toFixed(5)} ms)
                    </td>
                    <td className="font-mono" style={{ color: '#f59e0b' }}>
                      {d.jumpSearchComparisons.toLocaleString()} comps ({d.jumpSearchTimeMs.toFixed(5)} ms)
                    </td>
                    <td className="font-mono" style={{ color: '#ef4444' }}>
                      {d.linearSearchComparisons.toLocaleString()} comps ({d.linearSearchTimeMs.toFixed(5)} ms)
                    </td>
                    <td className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>
                      {Number(compRatio).toLocaleString()}x fewer ops
                    </td>
                    <td>
                      <span className="badge badge-opt">Production Choice</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytical Justification */}
      <div className="glass-card">
        <div className="card-title">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>Search Strategy Architecture & Performance Analysis</span>
        </div>
        <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>Why Binary Search is Selected:</strong> Delivery schedule slots and capacity ranges are naturally sorted. Binary Search reduces the search space by half at each step, taking at most 20 comparisons for 1,000,000 slots. This provides sub-millisecond slot resolution (O(log m)), essential for real-time dispatch pipelines.
          </p>
          <p>
            <strong>Why Jump Search & Linear Search are Rejected:</strong> Jump Search (O(√m)) requires ~1,000 comparisons at M=1,000,000, and Linear Search (O(m)) requires up to 750,000 comparisons. Binary Search is strictly superior in both comparisons and execution latency on sorted structures.
          </p>
        </div>
      </div>
    </div>
  );
};
