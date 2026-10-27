import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ApiSettingsModal from './components/settings/ApiSettingsModal';

import DailyAssistant from './components/dashboard/DailyAssistant';
import SafetyMonitor from './components/safety/SafetyMonitor';
import CrackAnalysis from './components/structural/CrackAnalysis';
import ProjectPlanner from './components/planning/ProjectPlanner';
import WeatherAdvisory from './components/weather/WeatherAdvisory';
import PropertyValuation from './components/valuation/PropertyValuation';
import ComplianceAssistant from './components/compliance/ComplianceAssistant';

import { constructionApi } from './api/constructionApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);

  const fetchHealth = async () => {
    try {
      const data = await constructionApi.getHealth();
      setHealthData(data);
      setIsBackendHealthy(true);
    } catch (err) {
      console.warn('Backend offline or starting up:', err);
      setIsBackendHealthy(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DailyAssistant onNavigateModule={(tab) => setActiveTab(tab)} />;
      case 'safety':
        return <SafetyMonitor />;
      case 'structural':
        return <CrackAnalysis />;
      case 'planning':
        return <ProjectPlanner />;
      case 'weather':
        return <WeatherAdvisory />;
      case 'valuation':
        return <PropertyValuation />;
      case 'compliance':
        return <ComplianceAssistant />;
      default:
        return <DailyAssistant onNavigateModule={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isHealthy={isBackendHealthy}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          activeTab={activeTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          healthData={healthData}
        />

        {/* Scrollable Module Workspace */}
        <main className="flex-1 overflow-y-auto px-8 py-8 relative">
          {/* Subtle background mesh glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Global AI API Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigUpdated={(updated) => {
          setHealthData((prev) => ({ ...prev, ...updated }));
          fetchHealth();
        }}
      />
    </div>
  );
}
