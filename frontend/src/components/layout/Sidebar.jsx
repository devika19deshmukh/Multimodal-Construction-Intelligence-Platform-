import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  CalendarDays,
  CloudSun,
  Building2,
  BookOpenCheck,
  HardHat,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Site Intelligence Hub', icon: LayoutDashboard, tag: 'Live Operations' },
  { id: 'safety', label: 'Safety & PPE Detection', icon: ShieldAlert, tag: 'Multimodal CV' },
  { id: 'structural', label: 'Crack & Structural Health', icon: Activity, tag: 'Forensics' },
  { id: 'planning', label: 'Project CPM Planning', icon: CalendarDays, tag: 'Scheduling' },
  { id: 'weather', label: 'Weather Risk Advisory', icon: CloudSun, tag: 'Decision Engine' },
  { id: 'valuation', label: 'Real Estate Valuation', icon: Building2, tag: 'Predictive ROI' },
  { id: 'compliance', label: 'Building Codes & RAG', icon: BookOpenCheck, tag: 'Regulatory' },
];

export default function Sidebar({ activeTab, setActiveTab, onOpenSettings, isHealthy = true }) {
  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between h-screen select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <HardHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                CONSTRUCT<span className="text-amber-400">IQ</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                Multimodal AI Engine
              </p>
            </div>
          </div>
        </div>

        {/* Project Selector Badge */}
        <div className="px-5 py-4">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="truncate">
              <span className="text-[10px] text-amber-400 font-mono font-semibold uppercase tracking-wider block">
                Active Project
              </span>
              <span className="text-xs font-semibold text-slate-200 truncate block">
                Metropolis Tower Ph. III
              </span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 group-hover:text-amber-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left truncate">
                    <span className="block truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block font-normal">{item.tag}</span>
                  </div>
                </div>

                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                  isActive ? 'text-amber-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings & Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 text-xs text-slate-300 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-45 transition-transform" />
            <span className="font-medium">AI & System Config</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-mono">
            API Keys
          </span>
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1 font-mono">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
            FastAPI :8000
          </span>
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
}
