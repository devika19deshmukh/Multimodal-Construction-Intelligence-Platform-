import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Umbrella
} from 'lucide-react';
import LoadingSkeleton from '../common/LoadingSkeleton';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_WEATHER_CONDITIONS } from '../../utils/sampleData';

export default function WeatherAdvisory() {
  const [weatherState, setWeatherState] = useState({ ...SAMPLE_WEATHER_CONDITIONS.storm });
  const [loading, setLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEvaluate = async (customState = weatherState) => {
    setLoading(true);
    setError(null);

    try {
      const res = await constructionApi.evaluateWeather({
        location: customState.location,
        temperature_c: Number(customState.temperature_c),
        wind_speed_kmh: Number(customState.wind_speed_kmh),
        precipitation_prob_pct: Number(customState.precipitation_prob_pct),
        precipitation_amount_mm: Number(customState.precipitation_amount_mm),
        weather_condition: customState.weather_condition,
        active_tasks: customState.active_tasks,
      });
      setAdvisoryResult(res);
    } catch (err) {
      setError(err.message || 'Weather evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (presetKey) => {
    const preset = SAMPLE_WEATHER_CONDITIONS[presetKey];
    if (preset) {
      setWeatherState({ ...preset });
      handleEvaluate(preset);
    }
  };

  const toggleTask = (task) => {
    if (weatherState.active_tasks.includes(task)) {
      setWeatherState({
        ...weatherState,
        active_tasks: weatherState.active_tasks.filter((t) => t !== task),
      });
    } else {
      setWeatherState({
        ...weatherState,
        active_tasks: [...weatherState.active_tasks, task],
      });
    }
  };

  const allAvailableTasks = [
    'Tower Crane Heavy Lifts',
    'Structural Concrete Pouring (Level 4)',
    'Exterior Curtain Wall Glazing',
    'Trench Excavation',
    'Roofing Torch-Down Membrane',
    'Electrical Rough-in',
    'Structural Steel Welding',
    'Interior Drywall Taping'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Site Status"
          value={advisoryResult ? advisoryResult.overall_site_status.replace(/_/g, ' ') : 'STANDDOWN'}
          subtitle="Meteorological advisory"
          icon={AlertTriangle}
          color={advisoryResult?.overall_site_status === 'NORMAL_OPERATIONS' ? 'emerald' : 'rose'}
        />
        <MetricCard
          title="Sustained Winds"
          value={`${weatherState.wind_speed_kmh} km/h`}
          subtitle="Crane limit: 38 km/h"
          icon={Wind}
          color={weatherState.wind_speed_kmh > 35 ? 'rose' : 'amber'}
        />
        <MetricCard
          title="Rain Probability"
          value={`${weatherState.precipitation_prob_pct}%`}
          subtitle={`${weatherState.precipitation_amount_mm} mm forecast`}
          icon={Droplets}
          color={weatherState.precipitation_prob_pct > 60 ? 'rose' : 'sky'}
        />
        <MetricCard
          title="Site Safety Index"
          value={advisoryResult ? `${advisoryResult.site_safety_index}/100` : '52/100'}
          subtitle="Dynamic weather envelope"
          icon={ShieldAlert}
          color={advisoryResult?.site_safety_index > 75 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Main Grid: Controls on Left, AI Advisory on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Telemetry Controls & Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-400" />
                Live Meteorological Telemetry Station
              </h3>
            </div>

            {/* Quick 1-Click Scenario Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Simulate Weather Scenario Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('storm')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all text-center"
                >
                  ⛈️ High Wind & Rain
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('heatwave')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-center"
                >
                  🔥 Heatwave (41°C)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('ideal')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all text-center"
                >
                  ☀️ Ideal Clear Day
                </button>
              </div>
            </div>

            {/* Sliders and Inputs */}
            <div className="space-y-4 pt-2 text-xs">
              <div>
                <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
                  <span>Wind Speed (km/h)</span>
                  <span className="font-mono text-amber-400">{weatherState.wind_speed_kmh} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={weatherState.wind_speed_kmh}
                  onChange={(e) => setWeatherState({ ...weatherState, wind_speed_kmh: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
                  <span>Ambient Temperature (°C)</span>
                  <span className="font-mono text-amber-400">{weatherState.temperature_c}°C</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="50"
                  step="0.5"
                  value={weatherState.temperature_c}
                  onChange={(e) => setWeatherState({ ...weatherState, temperature_c: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Precip. Prob (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weatherState.precipitation_prob_pct}
                    onChange={(e) => setWeatherState({ ...weatherState, precipitation_prob_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Rainfall (mm)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weatherState.precipitation_amount_mm}
                    onChange={(e) => setWeatherState({ ...weatherState, precipitation_amount_mm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Weather Condition Summary</label>
                <input
                  type="text"
                  value={weatherState.weather_condition}
                  onChange={(e) => setWeatherState({ ...weatherState, weather_condition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              {/* Active Tasks Checklist */}
              <div>
                <span className="block font-semibold text-slate-300 mb-2">
                  Active Construction Tasks Under Evaluation:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {allAvailableTasks.map((task) => {
                    const isChecked = weatherState.active_tasks.includes(task);
                    return (
                      <button
                        key={task}
                        type="button"
                        onClick={() => toggleTask(task)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{task}</span>
                        <span className="w-2 h-2 rounded-full bg-current" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleEvaluate()}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Evaluating Engineering Thresholds...' : 'Evaluate Site Operations Clearance'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Task Decision Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <LoadingSkeleton
              title="Assessing Weather Risk Matrix..."
              message="Cross-referencing crane wind limits, concrete hydration equations, and worker thermal safety"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Evaluation Failed
              </div>
              <p>{error}</p>
            </div>
          ) : advisoryResult ? (
            <div className="space-y-6">
              {/* Site Advisory Banner */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Meteorological Advisory Directive
                  </h4>
                  <StatusBadge status={advisoryResult.overall_site_status} />
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {advisoryResult.forecast_summary}
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono">
                  ⏱️ Resumption Timeline: {advisoryResult.resumption_timeline}
                </div>
              </div>

              {/* Task Decision Matrix Cards */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Task-by-Task Clearance Evaluation ({advisoryResult.task_impacts?.length || 0})</span>
                  <span className="text-[11px] text-slate-500 font-mono">Enforcing safety limits</span>
                </h4>

                <div className="space-y-3">
                  {advisoryResult.task_impacts?.map((impact, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                        impact.status === 'HALT'
                          ? 'bg-rose-500/10 border-rose-500/40'
                          : impact.status === 'CAUTION'
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-emerald-500/10 border-emerald-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{impact.task_name}</span>
                        <StatusBadge status={impact.status} />
                      </div>

                      <p className="text-slate-200 text-xs leading-relaxed">
                        {impact.primary_hazard}
                      </p>

                      <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                        <div>
                          <strong className="text-amber-400">Limit: </strong>
                          {impact.limiting_threshold}
                        </div>
                        <div>
                          <strong className="text-emerald-400">Protocol: </strong>
                          {impact.mandatory_protocol}
                        </div>
                      </div>

                      {impact.safe_alternative_task && (
                        <div className="text-[11px] text-sky-300 flex items-center gap-1.5 pt-1">
                          <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                          <span>Alternate Task Reassignment: <strong>{impact.safe_alternative_task}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautionary Checklist */}
              {advisoryResult.emergency_precautions?.length > 0 && (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Umbrella className="w-4 h-4 text-amber-400" />
                    Mandatory Site Tie-Down & Emergency Precautions
                  </h4>
                  <div className="space-y-1.5">
                    {advisoryResult.emergency_precautions.map((prec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded-lg bg-slate-950 border border-slate-800/80"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{prec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <CloudSun className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Weather Advisory Evaluated</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Configure ambient wind speed, rainfall probability, and select active job site tasks, or pick a preset on the left to generate task clearances.
              </p>
              <button
                type="button"
                onClick={() => handleEvaluate()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Run Storm Advisory Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
