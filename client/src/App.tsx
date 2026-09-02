import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DecisionConsole } from './components/DecisionConsole';
import { RankingBenchmark } from './components/RankingBenchmark';
import { SearchBenchmark } from './components/SearchBenchmark';
import { LO3QualityEvaluation } from './components/LO3QualityEvaluation';
import { BSTVisualizer } from './components/BSTVisualizer';
import { AcademicReportView } from './components/AcademicReportView';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('DECISION_CONSOLE');
  const [serverStatus, setServerStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        setServerStatus('connected');
      } else {
        setServerStatus('error');
      }
    } catch {
      setServerStatus('error');
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        serverStatus={serverStatus} 
      />

      <main>
        {activeTab === 'DECISION_CONSOLE' && <DecisionConsole />}
        {activeTab === 'RANKING_BENCHMARK' && <RankingBenchmark />}
        {activeTab === 'SEARCH_BENCHMARK' && <SearchBenchmark />}
        {activeTab === 'LO3_QUALITY' && <LO3QualityEvaluation />}
        {activeTab === 'BST_EXPLORER' && <BSTVisualizer />}
        {activeTab === 'ACADEMIC_REPORT' && <AcademicReportView />}
      </main>

      <footer style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>
        <div>IDSS Decision Intelligence Engine • High-Performance Logistics Optimization Platform</div>
      </footer>
    </div>
  );
};

export default App;
