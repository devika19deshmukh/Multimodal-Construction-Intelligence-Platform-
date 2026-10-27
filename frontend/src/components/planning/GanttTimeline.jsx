import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Users, Truck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function GanttTimeline({ phases = [], durationMonths = 18, criticalPath = [] }) {
  if (!phases || phases.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Visual Gantt Bar Chart */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Critical Path Method (CPM) Phase Timeline
            </h4>
            <p className="text-xs text-slate-400">Total Planned Duration: {durationMonths} Months</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded bg-amber-500" /> Planned Phase
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded bg-rose-500" /> High-Risk Milestones
            </span>
          </div>
        </div>

        {/* Timeline Header Months Grid */}
        <div className="min-w-[700px]">
          <div className="grid grid-cols-12 gap-1 text-[10px] font-mono text-slate-500 pb-2 border-b border-slate-800 text-center">
            {Array.from({ length: 12 }).map((_, i) => {
              const monthNum = Math.round(((i + 1) / 12) * durationMonths);
              return <div key={i}>M{monthNum}</div>;
            })}
          </div>

          {/* Phase Rows */}
          <div className="space-y-3.5 pt-4">
            {phases.map((phase) => {
              const startPct = (phase.start_month / durationMonths) * 100;
              const widthPct = Math.max(5, ((phase.end_month - phase.start_month) / durationMonths) * 100);
              const isHighRisk = phase.risk_level === 'HIGH';

              return (
                <div key={phase.phase_id} className="group relative">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 font-bold">
                        {phase.phase_id}
                      </span>
                      <span className="font-semibold text-slate-200">{phase.phase_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>{phase.duration_weeks} wks</span>
                      <span className="text-emerald-400">${(phase.estimated_cost_usd / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>

                  {/* Bar track */}
                  <div className="w-full h-7 bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800/80">
                    {/* Gantt Bar */}
                    <div
                      style={{
                        left: `${startPct}%`,
                        width: `${widthPct}%`,
                      }}
                      className={`absolute top-0 bottom-0 rounded-md transition-all duration-300 flex items-center justify-between px-2.5 text-[10px] font-bold shadow-md cursor-pointer ${
                        isHighRisk
                          ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950'
                      }`}
                    >
                      <span className="truncate">{phase.phase_name}</span>
                      <span className="opacity-80 font-mono hidden sm:inline">
                        {phase.labor_headcount} workers
                      </span>
                    </div>
                  </div>

                  {/* Milestones Chips below bar */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {phase.key_milestones?.map((ms, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Critical Path Sequence Banner */}
      {criticalPath?.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs">
          <span className="font-bold text-amber-400 uppercase tracking-wider block mb-1.5 font-mono">
            Identified Critical Path Sequence (Zero Float)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {criticalPath.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-200 font-medium">
                  {item}
                </span>
                {idx < criticalPath.length - 1 && (
                  <span className="text-amber-400 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
