
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LogAnalysis } from './components/LogAnalysis';
import { PIDMasterConsole } from './components/PIDMasterConsole';
import { FilterSetup } from './components/FilterSetup';
import { CLICommands } from './components/CLICommands';
import { ViewType, TraditionalPID, ModernPID, FilterSettings, AnalysisResult } from './types';

const INITIAL_TRADITIONAL_PID: TraditionalPID = {
  roll: { p: 45, i: 80, d: 35, dMax: 30, ff: 120 },
  pitch: { p: 50, i: 85, d: 40, dMax: 35, ff: 125 },
  yaw: { p: 45, i: 80, d: 0, dMax: 0, ff: 100 }
};

const INITIAL_MODERN_PID: ModernPID = {
  dDamping: 1.0,
  piTracking: 1.0,
  stickResponseFF: 1.0,
  dynamicDampingDMax: 1.0,
  driftWobbleIGain: 1.0,
  pitchRollDRatio: 1.0,
  pitchRollPIFFRatio: 1.0,
  masterMultiplier: 1.0
};

const INITIAL_FILTERS: FilterSettings = {
  gyroMultiplier: 1.0,
  dTermMultiplier: 1.0
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.LOG_ANALYSIS);
  const [isLogLoaded, setIsLogLoaded] = useState(false);
  const [traditionalPIDs, setTraditionalPIDs] = useState<TraditionalPID>(INITIAL_TRADITIONAL_PID);
  const [modernPIDs, setModernPIDs] = useState<ModernPID>(INITIAL_MODERN_PID);
  const [filters, setFilters] = useState<FilterSettings>(INITIAL_FILTERS);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleLogAnalyzed = (result: AnalysisResult) => {
    setAnalysis(result);
    if (result.pids) setTraditionalPIDs(result.pids);
    if (result.modernPids) setModernPIDs(result.modernPids);
    if (result.filters) setFilters(result.filters);
    setIsLogLoaded(true);
    setCurrentView(ViewType.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewType.LOG_ANALYSIS:
        return <LogAnalysis onAnalyzed={handleLogAnalyzed} />;
      case ViewType.DASHBOARD:
        return <Dashboard analysis={analysis} isLogLoaded={isLogLoaded} />;
      case ViewType.PID_MASTER_CONSOLE:
        return (
          <PIDMasterConsole 
            traditionalPids={traditionalPIDs} setTraditionalPids={setTraditionalPIDs}
            modernPids={modernPIDs} setModernPids={setModernPIDs}
          />
        );
      case ViewType.FILTER_SETUP:
        return <FilterSetup filters={filters} setFilters={setFilters} />;
      case ViewType.CLI_COMMANDS:
        return <CLICommands analysis={analysis} />;
      default:
        return <LogAnalysis onAnalyzed={handleLogAnalyzed} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] text-[#e0e0e0]">
      <Sidebar currentView={currentView} setView={setCurrentView} isLogLoaded={isLogLoaded} />
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
        
        {/* Neko Decoration */}
        <div className="fixed bottom-4 right-4 text-pink-400 opacity-30 select-none pointer-events-none text-right">
          <div className="text-4xl font-bold">(=^･ω･^=)</div>
          <div className="text-xs font-mono uppercase tracking-widest">猫娘调参秘籍 v0.1.0-beta 咕噜咕噜~</div>
        </div>
      </main>
    </div>
  );
};

export default App;
