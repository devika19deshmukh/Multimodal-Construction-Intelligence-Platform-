import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Percent,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import LoadingSkeleton from '../common/LoadingSkeleton';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_VALUATION_PROPERTIES } from '../../utils/sampleData';

export default function PropertyValuation() {
  const [valForm, setValForm] = useState({ ...SAMPLE_VALUATION_PROPERTIES.commercial });
  const [loading, setLoading] = useState(false);
  const [valResult, setValResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEstimate = async (customForm = valForm) => {
    setLoading(true);
    setError(null);

    try {
      const res = await constructionApi.estimateValuation({
        property_type: customForm.property_type,
        location_tier: customForm.location_tier,
        total_sqft: Number(customForm.total_sqft),
        plot_size_sqft: Number(customForm.plot_size_sqft),
        floors: Number(customForm.floors),
        construction_quality: customForm.construction_quality,
        completion_status_pct: Number(customForm.completion_status_pct),
        year_built: Number(customForm.year_built),
        amenities: customForm.amenities,
        expected_rental_yield_pct: Number(customForm.expected_rental_yield_pct),
      });
      setValResult(res);
    } catch (err) {
      setError(err.message || 'Valuation estimation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (presetKey) => {
    const preset = SAMPLE_VALUATION_PROPERTIES[presetKey];
    if (preset) {
      setValForm({ ...preset });
      handleEstimate(preset);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Current As-Is Value"
          value={valResult ? `$${(valResult.estimated_current_value_usd / 1000000).toFixed(2)}M` : '$32.40M'}
          subtitle={`At ${valForm.completion_status_pct}% completion`}
          icon={DollarSign}
          color="emerald"
        />
        <MetricCard
          title="Completed GDV"
          value={valResult ? `$${(valResult.estimated_at_completion_value_usd / 1000000).toFixed(2)}M` : '$42.52M'}
          subtitle={`Price/SqFt: $${valResult ? valResult.price_per_sqft_usd : 432}`}
          icon={Building2}
          color="amber"
        />
        <MetricCard
          title="5-Year Appreciation"
          value={valResult ? `$${(valResult.projected_5yr_value_usd / 1000000).toFixed(2)}M` : '$55.84M'}
          subtitle={`CAGR: ${valResult ? valResult.projected_annual_growth_pct : 5.6}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="31.3% Total"
          color="sky"
        />
        <MetricCard
          title="Investment Rating"
          value={valResult ? valResult.investment_grade : 'AAA (PRIME)'}
          subtitle={`Cap Rate: ${valResult ? valResult.cap_rate_pct : 7.2}%`}
          icon={Award}
          color="violet"
        />
      </div>

      {/* Main Grid: Input Form on Left, Predictive Valuation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Asset Specifications & Parameters
              </h3>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Load Benchmark Scenarios:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('commercial')}
                  className="px-3 py-2 rounded-xl text-[11px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-center"
                >
                  🏢 Downtown Tech Office
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('residential')}
                  className="px-3 py-2 rounded-xl text-[11px] font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all text-center"
                >
                  🏙️ Luxury Residential Tower
                </button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEstimate(); }} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Asset Property Category</label>
                <input
                  type="text"
                  value={valForm.property_type}
                  onChange={(e) => setValForm({ ...valForm, property_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Geographic Market Location</label>
                <input
                  type="text"
                  value={valForm.location_tier}
                  onChange={(e) => setValForm({ ...valForm, location_tier: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Total Area (SqFt)</label>
                  <input
                    type="number"
                    value={valForm.total_sqft}
                    onChange={(e) => setValForm({ ...valForm, total_sqft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Plot Parcel (SqFt)</label>
                  <input
                    type="number"
                    value={valForm.plot_size_sqft}
                    onChange={(e) => setValForm({ ...valForm, plot_size_sqft: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Floors / Stories</label>
                  <input
                    type="number"
                    value={valForm.floors}
                    onChange={(e) => setValForm({ ...valForm, floors: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Yield / Cap %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={valForm.expected_rental_yield_pct}
                    onChange={(e) => setValForm({ ...valForm, expected_rental_yield_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Construction Quality Grade</label>
                <select
                  value={valForm.construction_quality}
                  onChange={(e) => setValForm({ ...valForm, construction_quality: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Ultra Luxury LEED Gold">Ultra Luxury LEED Gold</option>
                  <option value="Premium Architectural Grade">Premium Architectural Grade</option>
                  <option value="Standard Commercial">Standard Commercial</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
                  <span>Current Construction Completion</span>
                  <span className="font-mono text-amber-400">{valForm.completion_status_pct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={valForm.completion_status_pct}
                  onChange={(e) => setValForm({ ...valForm, completion_status_pct: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Executing Valuation Algorithms...' : 'Calculate Predictive Valuation'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Predictive Results & Comps */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <LoadingSkeleton
              title="Modeling Predictive Market Valuation..."
              message="Evaluating land residuals, replacement cost indices, local capitalization rates, and comparable sales"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Valuation Failed
              </div>
              <p>{error}</p>
            </div>
          ) : valResult ? (
            <div className="space-y-6">
              {/* Valuation Appraisal Summary */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Appraisal Analysis & Sentiment
                  </h4>
                  <StatusBadge status={valResult.investment_grade} />
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {valResult.market_sentiment}
                </p>
              </div>

              {/* Cost Disaggregation Breakdown */}
              {valResult.valuation_breakdown && (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Disaggregated Component Valuation Breakdown
                  </h4>
                  <div className="space-y-2.5">
                    {Object.entries(valResult.valuation_breakdown).map(([key, val]) => {
                      const pct = Math.round((val / valResult.estimated_current_value_usd) * 100);
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">{key}</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              ${(val / 1000000).toFixed(2)}M ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                            <div
                              style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Comparable Market Benchmarks */}
              {valResult.comparable_benchmarks?.length > 0 && (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Recent Comparable Market Sales (Comps)</span>
                    <span className="text-[11px] text-slate-500 font-mono">Within 1.5 miles</span>
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                        <tr>
                          <th className="py-2.5 px-3">Comp Asset</th>
                          <th className="py-2.5 px-3">Distance</th>
                          <th className="py-2.5 px-3">Similarity</th>
                          <th className="py-2.5 px-3 text-right">Sold $/SqFt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {valResult.comparable_benchmarks.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-white font-sans">
                              {comp.property}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {comp.distance_miles} mi
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px]">
                                {comp.similarity_pct}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                              ${comp.sold_price_sqft}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Property Valuation Evaluated</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Configure property parameters, square footage, and progress percentage on the left to calculate current as-is value, GDV, and 5-year capital appreciation.
              </p>
              <button
                type="button"
                onClick={() => handleEstimate()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Run Valuation Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
