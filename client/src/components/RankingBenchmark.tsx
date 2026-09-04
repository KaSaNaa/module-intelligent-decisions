import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RankingBenchmarkDataPoint } from '../types';
import { 
  Cpu, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  FileSpreadsheet
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const RankingBenchmark: React.FC = () => {
  const [benchmarkData, setBenchmarkData] = useState<RankingBenchmarkDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [kParam, setKParam] = useState<number>(3);

  useEffect(() => {
    runBenchmark();
  }, []);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const data = await api.runRankingBenchmark([100, 500, 1000, 5000, 10000, 50000], kParam);
      setBenchmarkData(data);
    } catch (err) {
      console.error('Benchmark failed', err);
    } finally {
      setLoading(false);
    }
  };

  const chartLabels = benchmarkData.map(d => `N=${d.n.toLocaleString()}`);

  const timeChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Min-Heap Top-K [O(n log k)] (Primary)',
        data: benchmarkData.map(d => d.heapTimeMs),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointRadius: 5
      },
      {
        label: 'Merge Sort [O(n log n)] (Full Sort)',
        data: benchmarkData.map(d => d.mergeSortTimeMs),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 5
      },
      {
        label: 'Linear Scan [O(n·k)] (Baseline)',
        data: benchmarkData.map(d => d.linearScanTimeMs),
        borderColor: '#b45309',
        backgroundColor: 'rgba(251, 191, 36, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
        pointRadius: 4
      }
    ]
  };

  const opsChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Heap Operations (Comparisons + Swaps)',
        data: benchmarkData.map(d => d.heapOperations),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 5
      },
      {
        label: 'Merge Sort Operations',
        data: benchmarkData.map(d => d.mergeSortOperations),
        borderColor: '#dc2626',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 5
      },
      {
        label: 'Linear Scan Comparisons',
        data: benchmarkData.map(d => d.linearScanOperations),
        borderColor: '#b45309',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderWidth: 2,
        tension: 0.3,
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
          color: '#475569',
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: 'rgba(15, 23, 42, 0.12)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(15, 23, 42, 0.08)' },
        ticks: { color: '#64748b', font: { family: 'monospace' } }
      },
      y: {
        grid: { color: 'rgba(15, 23, 42, 0.08)' },
        ticks: { color: '#64748b', font: { family: 'monospace' } }
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Overview Banner */}
      <div className="alert-box alert-info">
        <Zap size={20} />
        <div>
          <strong>Algorithmic Scalability & Empirical Performance Analysis:</strong> Evaluates candidate ranking strategies across fleet scales from N = 100 to 50,000 trucks. Demonstrates that <strong>Heap-based Top-k selection (O(n log k))</strong> outperforms full sorting (O(n log n)) when k is much smaller than n.
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Parameter k (Recommendations):</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[3, 5, 10].map(val => (
                <button
                  key={val}
                  type="button"
                  className={`btn btn-sm ${kParam === val ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setKParam(val)}
                >
                  k = {val}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={runBenchmark}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            <span>Re-Run Benchmark (Live Hardware)</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="glass-card">
          <div className="card-title">
            <TrendingUp size={18} className="text-cyan-400" />
            <span>Execution Latency vs Fleet Size N</span>
          </div>
          <p className="card-desc">Measured CPU time (ms) per recommendation query</p>
          <div style={{ height: '320px' }}>
            {benchmarkData.length > 0 && <Line data={timeChartData} options={chartOptions} />}
          </div>
        </div>

        <div className="glass-card">
          <div className="card-title">
            <Cpu size={18} className="text-indigo-400" />
            <span>DSA Operations Count vs Fleet Size N</span>
          </div>
          <p className="card-desc">Number of element comparisons and heap sift swaps</p>
          <div style={{ height: '320px' }}>
            {benchmarkData.length > 0 && <Line data={opsChartData} options={chartOptions} />}
          </div>
        </div>
      </div>

      {/* Empirical Evidence Table */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <FileSpreadsheet size={18} />
          <span>Empirical Benchmark Results & Comparison</span>
        </div>
        <p className="card-desc">Averaged over statistical runs on actual memory allocations</p>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Fleet Size (N)</th>
                <th>Heap Top-k [O(n log k)]</th>
                <th>Merge Sort [O(n log n)]</th>
                <th>Linear Scan [O(n·k)]</th>
                <th>Heap Speedup vs MergeSort</th>
                <th>Engine State</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map(d => {
                const speedup = (d.mergeSortTimeMs / Math.max(0.001, d.heapTimeMs)).toFixed(1);
                return (
                  <tr key={d.n}>
                    <td className="font-mono" style={{ fontWeight: 600, color: '#1e293b' }}>{d.n.toLocaleString()}</td>
                    <td className="font-mono" style={{ color: '#0284c7' }}>{d.heapTimeMs.toFixed(4)} ms ({d.heapOperations.toLocaleString()} ops)</td>
                    <td className="font-mono" style={{ color: '#dc2626' }}>{d.mergeSortTimeMs.toFixed(4)} ms ({d.mergeSortOperations.toLocaleString()} ops)</td>
                    <td className="font-mono" style={{ color: '#b45309' }}>{d.linearScanTimeMs.toFixed(4)} ms ({d.linearScanOperations.toLocaleString()} ops)</td>
                    <td className="font-mono" style={{ color: '#15803d', fontWeight: 700 }}>{speedup}x Faster</td>
                    <td>
                      <span className="badge badge-opt">Production Engine</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architectural Justification Card */}
      <div className="glass-card">
        <div className="card-title">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>Architectural Decision & Asymptotic Analysis</span>
        </div>
        <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>Why Min-Heap Top-k is Selected:</strong> In real-time logistics dispatch, operations dispatchers require only the top k = 3 to 5 candidate vehicles. A full merge sort performs redundant sorting on the remaining (n - k) candidates, wasting O(n log n) compute cycles. By maintaining a bounded min-heap of size k, each candidate requires at most O(log k) sift operations. Since k is small and constant, log k is effectively a constant factor, yielding linear O(n) latency.
          </p>
          <p>
            <strong>Baseline Comparison:</strong> Linear scan (O(n · k)) degrades when k increases, and full sort (O(n log n)) incurs excessive array allocations. The experimental data confirms that Heap Top-k consistently maintains sub-millisecond response times even at 50,000 vehicles.
          </p>
        </div>
      </div>
    </div>
  );
};
