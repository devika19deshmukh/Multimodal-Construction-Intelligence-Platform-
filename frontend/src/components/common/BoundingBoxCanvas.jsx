import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Eye } from 'lucide-react';

export default function BoundingBoxCanvas({
  imageUrl,
  detections = [],
  selectedDetectionId = null,
  onSelectDetection = () => {},
  showLabels = true
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredDetections = detections.filter((d) => {
    if (filterCategory === 'VIOLATIONS') return d.category !== 'ppe_compliant';
    if (filterCategory === 'COMPLIANT') return d.category === 'ppe_compliant';
    if (filterCategory === 'FALL') return d.category === 'fall_hazard';
    return true;
  });

  const getCategoryStyles = (category, riskLevel) => {
    if (category === 'ppe_compliant') {
      return {
        border: 'border-emerald-500',
        bg: 'bg-emerald-500/10',
        badge: 'bg-emerald-600 text-white',
        text: 'text-emerald-400',
        icon: CheckCircle
      };
    }
    if (riskLevel === 'CRITICAL' || category === 'fall_hazard') {
      return {
        border: 'border-rose-500 shadow-lg shadow-rose-500/20 animate-pulse',
        bg: 'bg-rose-500/15',
        badge: 'bg-rose-600 text-white',
        text: 'text-rose-400',
        icon: ShieldAlert
      };
    }
    if (riskLevel === 'HIGH' || category === 'ppe_violation') {
      return {
        border: 'border-amber-500',
        bg: 'bg-amber-500/15',
        badge: 'bg-amber-600 text-white',
        text: 'text-amber-400',
        icon: AlertTriangle
      };
    }
    return {
      border: 'border-sky-500',
      bg: 'bg-sky-500/10',
      badge: 'bg-sky-600 text-white',
      text: 'text-sky-400',
      icon: Eye
    };
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Category filter bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          {['ALL', 'VIOLATIONS', 'COMPLIANT', 'FALL'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat} ({cat === 'ALL' ? detections.length : detections.filter((d) => {
                if (cat === 'VIOLATIONS') return d.category !== 'ppe_compliant';
                if (cat === 'COMPLIANT') return d.category === 'ppe_compliant';
                if (cat === 'FALL') return d.category === 'fall_hazard';
                return true;
              }).length})
            </button>
          ))}
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Hover/click detection boxes to view forensic findings
        </span>
      </div>

      {/* Main Image with Responsive Bounding Overlays */}
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex items-center justify-center">
        <div className="relative inline-block w-full max-w-full">
          <img
            src={imageUrl}
            alt="Safety Audit Analysis View"
            className="w-full h-auto block max-h-[580px] object-contain select-none"
          />

          {/* SVG / HTML Overlays */}
          {filteredDetections.map((det) => {
            const { ymin, xmin, ymax, xmax } = det.box_2d;
            
            // Normalize coordinates: 0-1000 scale to percentages
            const topPct = (ymin / 1000) * 100;
            const leftPct = (xmin / 1000) * 100;
            const widthPct = Math.max(1.5, ((xmax - xmin) / 1000) * 100);
            const heightPct = Math.max(1.5, ((ymax - ymin) / 1000) * 100);

            const isSelected = selectedDetectionId === det.id;
            const isHovered = hoveredId === det.id;
            const style = getCategoryStyles(det.category, det.risk_level);
            const Icon = style.icon;

            return (
              <div
                key={det.id}
                onMouseEnter={() => setHoveredId(det.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectDetection(det)}
                style={{
                  top: `${topPct}%`,
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                }}
                className={`absolute cursor-pointer border-2 transition-all duration-150 z-20 ${style.border} ${style.bg} ${
                  isSelected || isHovered ? 'ring-2 ring-white scale-[1.01] z-30' : ''
                }`}
              >
                {/* Floating identification tag */}
                {showLabels && (
                  <div
                    className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight whitespace-nowrap flex items-center gap-1 shadow-md z-40 ${style.badge}`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{det.label}</span>
                    <span className="opacity-80">({Math.round(det.confidence * 100)}%)</span>
                  </div>
                )}

                {/* Popover on hover if not selected */}
                {isHovered && !isSelected && (
                  <div className="absolute top-full left-0 mt-1 w-64 p-2.5 rounded-lg bg-slate-900/95 border border-slate-700 shadow-xl text-left text-xs z-50 pointer-events-none">
                    <p className="font-semibold text-white mb-1 flex items-center justify-between">
                      <span>{det.label}</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400">
                        {det.risk_level}
                      </span>
                    </p>
                    <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">{det.description}</p>
                    <p className="text-emerald-400 font-medium text-[10px]">Action: {det.remediation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
