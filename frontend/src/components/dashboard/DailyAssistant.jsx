import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Calendar,
  HardHat,
  RefreshCw,
  Clock
} from 'lucide-react';
import ImageUploader from '../common/ImageUploader';
import LoadingSkeleton from '../common/LoadingSkeleton';
import MetricCard from '../common/MetricCard';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_SAFETY_SVG } from '../../utils/sampleData';

const QUICK_QUERIES = [
  'Summarize Level 4 suspended slab concrete placement & inspection status',
  'Review rebar cage deliveries and heavy crane lift schedule for tomorrow',
  'Verify subcontractor manpower headcounts and perimeter safety compliance'
];

export default function DailyAssistant({ onNavigateModule }) {
  const [query, setQuery] = useState(QUICK_QUERIES[0]);
  const [projectName, setProjectName] = useState('Metropolis Tower Phase 3');
  const [userRole, setUserRole] = useState('Site Superintendent');
  const [activePhase, setActivePhase] = useState('Superstructure Concrete & Core Walls');
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await constructionApi.chatDailyAssistant({
        query,
        projectName,
        userRole,
        activePhase,
        file: selectedImage
      });
      setResponse(res);
    } catch (err) {
      setError(err.message || 'Failed to generate daily briefing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Daily Progress Delta"
          value={response ? `+${response.estimated_progress_delta_pct}%` : '+0.85%'}
          subtitle="Ahead of weekly milestone"
          icon={TrendingUp}
          trend="up"
          trendValue="0.2%"
          color="emerald"
        />
        <MetricCard
          title="Active Workforce"
          value="142"
          subtitle="Trades across 6 contractors"
          icon={HardHat}
          badge="Full Shift"
          color="amber"
        />
        <MetricCard
          title="Safety Compliance"
          value="98.2%"
          subtitle="0 lost-time incidents"
          icon={CheckCircle2}
          color="sky"
        />
        <MetricCard
          title="Operational Phase"
          value="Core Wall #3"
          subtitle="Pouring Level 4 Deck"
          icon={Calendar}
          color="violet"
        />
      </div>

      {/* Main Grid: Input Form & Multimodal Attachment on Left, AI Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Image Upload */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Daily Site Assistant Query
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Multimodal Input
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Job Site Query or Daily Log Entry
                </label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Describe today's pour, weather impact, or inspection issues..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Quick Query Suggestion Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Quick Prompts:</span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_QUERIES.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuery(q)}
                      className="text-left text-[11px] px-3 py-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 truncate transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multimodal Photo Uploader */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Multimodal Daily Site Photo (Optional)
                </label>
                <ImageUploader
                  onImageSelected={(file, url) => {
                    setSelectedImage(file);
                    setPreviewUrl(url);
                  }}
                  selectedImage={selectedImage}
                  previewUrl={previewUrl}
                  onClear={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                  sampleSvgDataUrl={SAMPLE_SAFETY_SVG}
                  sampleLabel="Load Daily Inspection Photo"
                  label="Attach site photo for multimodal reasoning"
                  sublabel="AI will correlate visual evidence with your field query"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? 'Synthesizing Multimodal Briefing...' : 'Generate AI Daily Site Briefing'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Briefing Results */}
        <div className="lg:col-span-7">
          {loading ? (
            <LoadingSkeleton
              title="Generating Daily Site Intelligence..."
              message="Correlating field inquiry, project schedules, and uploaded visual evidence"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Error Generating Briefing
              </div>
              <p>{error}</p>
            </div>
          ) : response ? (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/80 backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Daily Operations Briefing</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Generated at {response.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    +{response.estimated_progress_delta_pct}% Today
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {response.summary}
                </p>

                {/* Key Activities */}
                {response.daily_activities?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Key Field Activities Completed
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {response.daily_activities.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical Alerts */}
                {response.critical_alerts?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Critical Alerts & Potential Bottlenecks
                    </h4>
                    <div className="space-y-2">
                      {response.critical_alerts.map((alert, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2"
                        >
                          <span className="font-bold">•</span>
                          <span>{alert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proactive Recommendations */}
                {response.recommendations?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Proactive Shift Recommendations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {response.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-100 flex items-start gap-2"
                        >
                          <span className="text-amber-400 font-bold">{i + 1}.</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Forensic AI Notes */}
                {response.raw_ai_notes && (
                  <div className="pt-3 border-t border-slate-800">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold block mb-1">
                        Multimodal Observation Telemetry:
                      </span>
                      {response.raw_ai_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Default Welcome State */
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Awaiting Daily Site Query & Multimodal Input
              </h3>
              <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                Submit your daily progress updates or attach site photographs above. The multimodal LLM will correlate field status with project schedules to generate an executive briefing.
              </p>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Run Quick Demonstration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
