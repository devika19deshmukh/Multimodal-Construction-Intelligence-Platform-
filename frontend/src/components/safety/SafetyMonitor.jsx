import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileCheck2,
  HardHat,
  Search,
  Scale,
  Sparkles,
  RefreshCw,
  Check
} from 'lucide-react';
import ImageUploader from '../common/ImageUploader';
import BoundingBoxCanvas from '../common/BoundingBoxCanvas';
import LoadingSkeleton from '../common/LoadingSkeleton';
import StatusBadge from '../common/StatusBadge';
import MetricCard from '../common/MetricCard';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_SAFETY_SVG, dataUrlToFile } from '../../utils/sampleData';

export default function SafetyMonitor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [siteLocation, setSiteLocation] = useState('South Bay Substructure Deck');
  const [priority, setPriority] = useState('Standard High-Precision Audit');

  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [error, setError] = useState(null);
  const [supervisorSigned, setSupervisorSigned] = useState(false);

  const handleAudit = async (fileToAudit = selectedFile) => {
    if (!fileToAudit) return;
    setLoading(true);
    setError(null);
    setSupervisorSigned(false);

    try {
      const res = await constructionApi.auditSafety({
        file: fileToAudit,
        siteLocation,
        priority
      });
      setAuditResult(res);
      if (res.detections?.length > 0) {
        setSelectedDetection(res.detections[0]);
      }
    } catch (err) {
      setError(err.message || 'Safety audit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleAndAudit = () => {
    const file = dataUrlToFile(SAMPLE_SAFETY_SVG, 'sample_safety_inspection.svg');
    setSelectedFile(file);
    setPreviewUrl(SAMPLE_SAFETY_SVG);
    handleAudit(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Safety Index Score"
          value={auditResult ? `${auditResult.overall_safety_score}/100` : '88/100'}
          subtitle="Target threshold: > 85"
          icon={ShieldCheck}
          color={auditResult?.overall_safety_score < 80 ? 'rose' : 'emerald'}
        />
        <MetricCard
          title="Violations Identified"
          value={auditResult ? auditResult.violation_count : '0'}
          subtitle="Immediate field fixes required"
          icon={AlertTriangle}
          color={auditResult?.violation_count > 0 ? 'rose' : 'emerald'}
        />
        <MetricCard
          title="Verified Compliant PPE"
          value={auditResult ? auditResult.compliant_elements_count : '3'}
          subtitle="Helmets & high-vis certified"
          icon={HardHat}
          color="amber"
        />
        <MetricCard
          title="Compliance Status"
          value={auditResult ? auditResult.compliance_status.replace(/_/g, ' ') : 'STANDBY'}
          subtitle="OSHA 1926 Standards"
          icon={Scale}
          color="sky"
        />
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Bounding Box Canvas */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Visual Safety Audit Workspace</h3>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleAndAudit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Site Photo
              </button>
            </div>

            {/* Uploader or Interactive Canvas */}
            {!previewUrl ? (
              <ImageUploader
                onImageSelected={(file, url) => {
                  setSelectedFile(file);
                  setPreviewUrl(url);
                  handleAudit(file);
                }}
                selectedImage={selectedFile}
                previewUrl={previewUrl}
                onClear={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setAuditResult(null);
                }}
                sampleSvgDataUrl={SAMPLE_SAFETY_SVG}
                sampleLabel="Load High-Risk Safety Scenario"
                label="Upload Construction Site Photo for Safety Audit"
                sublabel="Multimodal AI identifies PPE compliance, fall risks, and mechanical hazards"
              />
            ) : (
              <div className="space-y-4">
                <BoundingBoxCanvas
                  imageUrl={previewUrl}
                  detections={auditResult?.detections || []}
                  selectedDetectionId={selectedDetection?.id}
                  onSelectDetection={(det) => setSelectedDetection(det)}
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Inspection Zone: <strong className="text-white">{siteLocation}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAuditResult(null);
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Forensic Findings & Corrective Action Plan */}
        <div className="lg:col-span-5 space-y-6">
          {loading ? (
            <LoadingSkeleton
              title="Auditing Site Imagery..."
              message="Detecting PPE items, estimating spatial coordinates, and mapping OSHA standard violations"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Audit Execution Error
              </div>
              <p>{error}</p>
            </div>
          ) : auditResult ? (
            <div className="space-y-6">
              {/* Overall Status Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Audit Status Assessment
                  </h4>
                  <StatusBadge status={auditResult.compliance_status} />
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {auditResult.summary}
                </p>

                {/* OSHA References */}
                {auditResult.osha_references?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Applicable OSHA Statutory Standards
                    </span>
                    <div className="space-y-1.5">
                      {auditResult.osha_references.map((ref, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300"
                        >
                          <Scale className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{ref}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Detected Items Breakdown */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Detected Objects & Hazards ({auditResult.detections?.length || 0})
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">Select card to inspect</span>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {auditResult.detections?.map((det) => {
                    const isSelected = selectedDetection?.id === det.id;
                    return (
                      <div
                        key={det.id}
                        onClick={() => setSelectedDetection(det)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/60 shadow-lg'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white text-xs">{det.label}</span>
                          <StatusBadge status={det.risk_level} />
                        </div>
                        <p className="text-slate-300 text-[11px] mb-2 leading-relaxed">{det.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                          <span>Confidence: {Math.round(det.confidence * 100)}%</span>
                          <span className="text-emerald-400 font-medium">Remedy: {det.remediation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Immediate Corrective Actions */}
              {auditResult.immediate_corrective_actions?.length > 0 && (
                <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md shadow-xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Mandatory Immediate Corrective Actions
                  </h4>
                  <div className="space-y-2">
                    {auditResult.immediate_corrective_actions.map((act, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-rose-200"
                      >
                        <span className="font-bold text-rose-400">{idx + 1}.</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>

                  {/* Supervisor Sign-Off */}
                  <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Site Supervisor Sign-Off
                    </span>
                    <button
                      type="button"
                      onClick={() => setSupervisorSigned(true)}
                      disabled={supervisorSigned}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        supervisorSigned
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {supervisorSigned ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Certified by Supervisor
                        </>
                      ) : (
                        <>
                          <FileCheck2 className="w-3.5 h-3.5 text-amber-400" /> Certify Field Resolution
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Image Under Active Audit</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Upload a site image or click "Load Sample Site Photo" to trigger real-time AI bounding box detection and safety compliance scoring.
              </p>
              <button
                type="button"
                onClick={handleLoadSampleAndAudit}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Launch Demo Safety Audit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
