import React from 'react';
import { 
  BrainCircuit, 
  Activity, 
  Cpu, 
  Search, 
  GitCompare, 
  Network, 
  BookOpen 
} from 'lucide-react';

export type TabType = 
  | 'DECISION_CONSOLE'
  | 'RANKING_BENCHMARK'
  | 'SEARCH_BENCHMARK'
  | 'LO3_QUALITY'
  | 'BST_EXPLORER'
  | 'ACADEMIC_REPORT';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  serverStatus: 'connected' | 'connecting' | 'error';
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, serverStatus }) => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-brand">
          <div className="brand-icon-box">
            <BrainCircuit size={26} />
          </div>
          <div>
            <h1 className="brand-title">IDSS | Fleet Decision Intelligence Engine</h1>
            <p className="brand-subtitle">Real-time Autonomous Vehicle Allocation & Dispatch Optimizer</p>
          </div>
        </div>

        <div className="header-badges">
          <span className="badge badge-perf" title="Asymptotic Efficiency: O(n log k)">
            <Cpu size={12} /> O(n log k) Scalability
          </span>
          <span className="badge badge-arch" title="Custom Data Structures Architecture">
            <Network size={12} /> Custom DSA Pipeline
          </span>
          <span className="badge badge-opt" title="Multi-Objective Heuristic Optimization">
            <GitCompare size={12} /> Multi-Objective Heuristic
          </span>
          <span className={`badge ${serverStatus === 'connected' ? 'badge-opt' : 'badge-status'}`}>
            <Activity size={12} /> Backend: {serverStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Engine Navigation">
        <button 
          className={`nav-tab ${activeTab === 'DECISION_CONSOLE' ? 'active' : ''}`}
          onClick={() => onTabChange('DECISION_CONSOLE')}
        >
          <BrainCircuit size={16} /> Operations Console
        </button>

        <button 
          className={`nav-tab ${activeTab === 'RANKING_BENCHMARK' ? 'active' : ''}`}
          onClick={() => onTabChange('RANKING_BENCHMARK')}
        >
          <Cpu size={16} /> Ranking Performance Lab
        </button>

        <button 
          className={`nav-tab ${activeTab === 'SEARCH_BENCHMARK' ? 'active' : ''}`}
          onClick={() => onTabChange('SEARCH_BENCHMARK')}
        >
          <Search size={16} /> Search & Slot Resolution Lab
        </button>

        <button 
          className={`nav-tab ${activeTab === 'LO3_QUALITY' ? 'active' : ''}`}
          onClick={() => onTabChange('LO3_QUALITY')}
        >
          <GitCompare size={16} /> Heuristic Quality & Optimality Lab
        </button>

        <button 
          className={`nav-tab ${activeTab === 'BST_EXPLORER' ? 'active' : ''}`}
          onClick={() => onTabChange('BST_EXPLORER')}
        >
          <Network size={16} /> Dynamic Fleet Index (BST)
        </button>

        <button 
          className={`nav-tab ${activeTab === 'ACADEMIC_REPORT' ? 'active' : ''}`}
          onClick={() => onTabChange('ACADEMIC_REPORT')}
        >
          <BookOpen size={16} /> Architecture & Whitepaper
        </button>
      </nav>
    </header>
  );
};
