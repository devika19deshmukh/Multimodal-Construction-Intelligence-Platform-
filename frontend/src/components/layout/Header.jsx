import React, { useState, useEffect } from 'react';
import { Cpu, Settings, Printer, Download, Clock, ShieldCheck } from 'lucide-react';
import { NAVIGATION_ITEMS } from './Sidebar';

export default function Header({ activeTab, onOpenSettings, healthData }) {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];

  const handlePrint = () => {
    window.print();
  };

  const isConfigured = healthData?.gemini_configured || healthData?.openai_configured;

  return (
    <header className="h-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-8 flex items-center justify-between z-20">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
            Module
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 font-medium">{activeItem.tag}</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {activeItem.label}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{currentTime}</span>
        </div>

        {/* AI Engine Status Pill */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isConfigured
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
          title="Click to configure AI providers"
        >
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>
            {isConfigured
              ? healthData?.gemini_configured ? 'Gemini 1.5 Pro Active' : 'GPT-4o Active'
              : 'Domain Simulation Mode (Zero Key Needed)'}
          </span>
          <span className="w-2 h-2 rounded-full bg-current" />
        </button>

        {/* Action Buttons */}
        <button
          type="button"
          onClick={handlePrint}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Print / Export PDF Audit Report"
        >
          <Printer className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
          title="Settings & API Credentials"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
