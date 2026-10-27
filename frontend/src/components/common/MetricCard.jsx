import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, trendValue, badge, color = 'amber' }) {
  const colorGradients = {
    amber: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-400',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
    rose: 'from-rose-500/10 to-transparent border-rose-500/20 text-rose-400',
    sky: 'from-sky-500/10 to-transparent border-sky-500/20 text-sky-400',
    violet: 'from-violet-500/10 to-transparent border-violet-500/20 text-violet-400',
  };

  const selectedTheme = colorGradients[color] || colorGradients.amber;

  return (
    <div className={`relative p-5 rounded-xl border bg-gradient-to-b ${selectedTheme} bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 text-slate-200">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        {badge && <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{badge}</span>}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span className={`font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
