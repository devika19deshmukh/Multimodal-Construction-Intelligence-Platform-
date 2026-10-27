import React from 'react';

export default function StatusBadge({ status, type = 'status', className = '' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  // Color mappings
  let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotStyle = 'bg-slate-400';

  if (['GO', 'COMPLIANT', 'LOW', 'NORMAL_OPERATIONS', 'AAA (PRIME INSTITUTIONAL)', 'MANDATORY_COMPLIANCE'].includes(normalized)) {
    badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotStyle = 'bg-emerald-400 animate-pulse';
  } else if (['CAUTION', 'MINOR_INFRACTIONS', 'MEDIUM', 'CAUTIONARY_ADVISORY', 'AA (STRONG COMMERCIAL)', 'ACTION_REQUIRED', 'MODERATE (REQUIRES MONITORING)'].includes(normalized)) {
    badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotStyle = 'bg-amber-400 animate-pulse';
  } else if (['HALT', 'HIGH_RISK', 'STOP_WORK_RECOMMENDED', 'HIGH', 'CRITICAL', 'PARTIAL_STANDDOWN', 'FULL_SITE_STOPPAGE', 'IMMINENT_COLLAPSE_RISK', 'SEVERE'].includes(normalized)) {
    badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotStyle = 'bg-rose-400 animate-ping';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase ${badgeStyle} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {status}
    </span>
  );
}
