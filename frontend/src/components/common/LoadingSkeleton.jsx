import React, { useState, useEffect } from 'react';
import { Cpu, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoadingSkeleton({ title = 'Analyzing Multimodal Telemetry...', message = 'Engaging AI inference engine' }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { label: 'Preprocessing & encoding high-resolution imagery', icon: Eye },
    { label: 'Executing multimodal vision-language model inference', icon: Cpu },
    { label: 'Applying construction safety & engineering compliance rules', icon: ShieldCheck },
    { label: 'Synthesizing structured JSON decision matrix', icon: CheckCircle2 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-amber-500/20 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Animated background glowing orb */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Main Spinner Ring */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-amber-400">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-8">{message}</p>

      {/* Steps pipeline */}
      <div className="w-full max-w-md space-y-3">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-medium transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 animate-pulse'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <StepIcon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-slate-600'}`} />
              <span className="flex-1 text-left">{step.label}</span>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
