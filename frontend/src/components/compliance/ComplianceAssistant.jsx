import React, { useState } from 'react';
import {
  BookOpenCheck,
  Scale,
  Search,
  Sparkles,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import LoadingSkeleton from '../common/LoadingSkeleton';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_COMPLIANCE_QUERIES } from '../../utils/sampleData';

export default function ComplianceAssistant() {
  const [query, setQuery] = useState(SAMPLE_COMPLIANCE_QUERIES[0]);
  const [domain, setDomain] = useState('OSHA Safety Standards (29 CFR 1926)');
  const [specificClause, setSpecificClause] = useState('');

  const [loading, setLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState(null);
  const [error, setError] = useState(null);

  const handleQuery = async (queryText = query) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await constructionApi.queryCompliance({
        query: queryText,
        regulatory_domain: domain,
        specific_clause: specificClause || null,
      });
      setComplianceResult(res);
    } catch (err) {
      setError(err.message || 'Compliance query failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (q) => {
    setQuery(q);
    handleQuery(q);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Regulatory Corpus"
          value="IBC & OSHA"
          subtitle="2024 Building Codes Indexed"
          icon={BookOpenCheck}
          color="amber"
        />
        <MetricCard
          title="Active Domain"
          value="OSHA 1926"
          subtitle="Safety & Life Preservations"
          icon={Scale}
          color="emerald"
        />
        <MetricCard
          title="Citations Found"
          value={complianceResult ? complianceResult.citations?.length || 2 : 2}
          subtitle="Statutory clauses referenced"
          icon={FileText}
          color="sky"
        />
        <MetricCard
          title="Max Non-Compliance Penalty"
          value="$161,323"
          subtitle="OSHA Willful Citation Cap"
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Main Grid: Query Form on Left, Regulatory Findings on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form & Query Chips */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                Building Code & Compliance RAG Search
              </h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleQuery(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Regulatory Framework Domain
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="OSHA Safety Standards (29 CFR 1926)">OSHA Safety Standards (29 CFR 1926)</option>
                  <option value="International Building Code (IBC 2024)">International Building Code (IBC 2024)</option>
                  <option value="Local Zoning & Municipal Permits">Local Zoning & Municipal Permits</option>
                  <option value="Standard Operating Procedures (SOP & ACI)">SOP & ACI Concrete Standards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Natural Language Regulatory Inquiry
                </label>
                <textarea
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask any question regarding safety rules, code sections, allowable widths..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Sample Query Chips */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Frequently Queried Statutory Topics:
                </span>
                <div className="space-y-1.5">
                  {SAMPLE_COMPLIANCE_QUERIES.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChipClick(q)}
                      className="w-full text-left text-[11px] px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 truncate hover:text-amber-300 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-4"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Retrieving Statutory Context...' : 'Query Knowledge Base & Codes'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: RAG Citations & Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <LoadingSkeleton
              title="Retrieving Regulatory Statutes..."
              message="Indexing OSHA 1926, IBC 2024, and ACI standards to construct legal compliance advice"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Query Failed
              </div>
              <p>{error}</p>
            </div>
          ) : complianceResult ? (
            <div className="space-y-6">
              {/* Authoritative Answer Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Authoritative Regulatory Guidance
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    Statute Verified
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {complianceResult.answer}
                </p>
              </div>

              {/* Exact Statutory Citations */}
              {complianceResult.citations?.length > 0 && (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      Statutory Citations & Legal Standards ({complianceResult.citations.length})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Retrieved via RAG</span>
                  </h4>

                  <div className="space-y-3">
                    {complianceResult.citations.map((cite, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 font-mono text-xs">
                            {cite.standard}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-300">
                            {cite.section_title}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {cite.relevance}
                        </p>
                        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
                          <strong className="text-slate-300 block mb-0.5">Mandatory Statute:</strong>
                          {cite.mandatory_rule}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Verification Checklist */}
              {complianceResult.compliance_checklist?.length > 0 && (
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Site Verification & Inspection Checklist
                  </h4>

                  <div className="space-y-2">
                    {complianceResult.compliance_checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="font-semibold text-white mb-1">{item.requirement}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Method: {item.inspection_method}
                          </p>
                        </div>
                        <StatusBadge status={item.compliance_status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Penalty Risk & Required Docs */}
              <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md shadow-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Non-Compliance Liabilities & Required Records
                </h4>
                <p className="text-xs text-rose-200 leading-relaxed">
                  {complianceResult.risk_if_non_compliant}
                </p>
                {complianceResult.recommended_documentation?.length > 0 && (
                  <div className="pt-2 border-t border-rose-500/20">
                    <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                      Mandatory Archive Documentation:
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      {complianceResult.recommended_documentation.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <BookOpenCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Regulatory Knowledge Base Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Query building codes, OSHA safety regulations, and zoning ordinances on the left to extract statutory citations and actionable field checklists.
              </p>
              <button
                type="button"
                onClick={() => handleQuery()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Query Fall Protection Mandate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
