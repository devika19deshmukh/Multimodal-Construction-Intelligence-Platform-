import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  RefreshCw,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Users,
  Truck,
  Package,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import GanttTimeline from './GanttTimeline';
import LoadingSkeleton from '../common/LoadingSkeleton';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_PROJECT_PLAN } from '../../utils/sampleData';

export default function ProjectPlanner() {
  const [formData, setFormData] = useState({ ...SAMPLE_PROJECT_PLAN });
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await constructionApi.generateProjectPlan({
        project_name: formData.project_name,
        building_type: formData.building_type,
        total_sqft: Number(formData.total_sqft),
        budget_usd: Number(formData.budget_usd),
        target_duration_months: Number(formData.target_duration_months),
        location: formData.location,
        soil_condition: formData.soil_condition,
        project_scope: formData.project_scope,
      });
      setPlanResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate project plan');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    setFormData({ ...SAMPLE_PROJECT_PLAN });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Schedule Feasibility"
          value={planResult ? `${planResult.feasibility_score}/100` : '91/100'}
          subtitle="CPM confidence score"
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Projected Expenditure"
          value={planResult ? `$${(planResult.total_estimated_cost_usd / 1000000).toFixed(2)}M` : '$24.13M'}
          subtitle={`Variance: ${planResult ? planResult.budget_variance_pct : '-1.5'}%`}
          icon={DollarSign}
          color="amber"
        />
        <MetricCard
          title="Target Timeline"
          value={planResult ? `${planResult.duration_months} Mos` : `${formData.target_duration_months} Mos`}
          subtitle="6 Master Phases"
          icon={CalendarDays}
          color="sky"
        />
        <MetricCard
          title="Identified Critical Risks"
          value={planResult ? planResult.risk_matrix?.length || 3 : 3}
          subtitle="Mitigations established"
          icon={AlertTriangle}
          color="violet"
        />
      </div>

      {/* Main Grid: Form on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                Project Specification Parameters
              </h3>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Reset Demo
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Building Type</label>
                <select
                  value={formData.building_type}
                  onChange={(e) => setFormData({ ...formData, building_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Commercial High-Rise & Mixed Retail">Commercial High-Rise & Mixed Retail</option>
                  <option value="Residential Multi-Family Tower">Residential Multi-Family Tower</option>
                  <option value="Industrial Logistics & Warehouse">Industrial Logistics & Warehouse</option>
                  <option value="Healthcare & Hospital Complex">Healthcare & Hospital Complex</option>
                  <option value="Infrastructure / Transit Terminal">Infrastructure / Transit Terminal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Gross Area (SqFt)</label>
                  <input
                    type="number"
                    value={formData.total_sqft}
                    onChange={(e) => setFormData({ ...formData, total_sqft: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Allocated Budget ($)</label>
                  <input
                    type="number"
                    value={formData.budget_usd}
                    onChange={(e) => setFormData({ ...formData, budget_usd: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    value={formData.target_duration_months}
                    onChange={(e) => setFormData({ ...formData, target_duration_months: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Soil / Geotechnical Baseline</label>
                <input
                  type="text"
                  value={formData.soil_condition}
                  onChange={(e) => setFormData({ ...formData, soil_condition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Scope & Specs</label>
                <textarea
                  rows={3}
                  value={formData.project_scope}
                  onChange={(e) => setFormData({ ...formData, project_scope: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Optimizing Critical Path CPM...' : 'Generate AI Construction Plan'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Generated Plan, Gantt, and Resource Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <LoadingSkeleton
              title="Formulating Critical Path CPM Schedule..."
              message="Calculating phase durations, labor trade allocations, and risk contingencies"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Planning Generation Failed
              </div>
              <p>{error}</p>
            </div>
          ) : planResult ? (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Master Scheduling Synthesis
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400">
                      Feasibility: {planResult.feasibility_score}/100
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-mono text-amber-400">
                      Cost: ${(planResult.total_estimated_cost_usd / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {planResult.executive_summary}
                </p>
              </div>

              {/* Gantt Timeline View */}
              <GanttTimeline
                phases={planResult.phases}
                durationMonths={planResult.duration_months}
                criticalPath={planResult.critical_path}
              />

              {/* Resource Allocation Breakdown */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  Primary Resource Demands & Allocation Matrix
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                      <tr>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Resource Name</th>
                        <th className="py-2.5 px-3">Quantity</th>
                        <th className="py-2.5 px-3">Peak Phase</th>
                        <th className="py-2.5 px-3 text-right">Est. Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {planResult.resource_allocations?.map((res, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-sans">
                              {res.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white font-sans">
                            {res.resource_name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {res.quantity.toLocaleString()} {res.unit}
                          </td>
                          <td className="py-2.5 px-3 text-amber-400 font-bold">{res.peak_phase}</td>
                          <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                            ${res.estimated_cost_usd ? res.estimated_cost_usd.toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Mitigation Matrix */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Project Risk & Contingency Planning Matrix
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {planResult.risk_matrix?.map((r, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <StatusBadge status={r.severity} />
                          <span className="text-[10px] font-mono text-slate-500">Prob: {r.probability}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs mb-1">{r.risk_title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800/80">
                        <strong className="text-amber-400 block mb-0.5 font-sans">Mitigation:</strong>
                        {r.mitigation_strategy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Active Project Plan Generated</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Adjust project budget, duration, and scope on the left, then click "Generate AI Construction Plan" to synthesize CPM phases, Gantt charts, and resource demands.
              </p>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Run Metropolis Tower Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
