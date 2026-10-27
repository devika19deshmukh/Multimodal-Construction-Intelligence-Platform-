import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Wrench,
  Sparkles,
  RefreshCw,
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  Ruler
} from 'lucide-react';
import ImageUploader from '../common/ImageUploader';
import LoadingSkeleton from '../common/LoadingSkeleton';
import StatusBadge from '../common/StatusBadge';
import MetricCard from '../common/MetricCard';
import { constructionApi } from '../../api/constructionApi';
import { SAMPLE_CRACK_SVG, dataUrlToFile } from '../../utils/sampleData';

export default function CrackAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [elementType, setElementType] = useState('Reinforced Concrete Beam');
  const [ageOfStructure, setAgeOfStructure] = useState('Under Active Construction (6 months)');

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (fileToAnalyze = selectedFile) => {
    if (!fileToAnalyze) return;
    setLoading(true);
    setError(null);

    try {
      const res = await constructionApi.analyzeCrack({
        file: fileToAnalyze,
        elementType,
        ageOfStructure
      });
      setAnalysisResult(res);
    } catch (err) {
      setError(err.message || 'Crack analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleAndAnalyze = () => {
    const file = dataUrlToFile(SAMPLE_CRACK_SVG, 'sample_concrete_crack.svg');
    setSelectedFile(file);
    setPreviewUrl(SAMPLE_CRACK_SVG);
    handleAnalyze(file);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Crack Aperture Width"
          value={analysisResult ? `${analysisResult.estimated_width_mm} mm` : '1.85 mm'}
          subtitle="ACI 224R Limit: 0.30 mm"
          icon={Ruler}
          color={analysisResult?.estimated_width_mm > 0.4 ? 'rose' : 'emerald'}
        />
        <MetricCard
          title="Structural Risk"
          value={analysisResult ? analysisResult.structural_risk_level : 'HIGH'}
          subtitle="Principal shear tension"
          icon={AlertOctagon}
          color={analysisResult?.structural_risk_level === 'HIGH' ? 'rose' : 'amber'}
        />
        <MetricCard
          title="Element Affected"
          value={analysisResult ? analysisResult.structural_element : 'RC Beam'}
          subtitle="Primary transfer member"
          icon={Activity}
          color="violet"
        />
        <MetricCard
          title="PE Inspection Required"
          value={analysisResult ? (analysisResult.requires_licensed_pe_inspection ? 'MANDATORY' : 'RECOMMENDED') : 'MANDATORY'}
          subtitle="Within 48 hours"
          icon={ShieldAlert}
          color="amber"
        />
      </div>

      {/* Main Forensic Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Upload View */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Concrete Distress Forensic Viewer</h3>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleAndAnalyze}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Crack Image
              </button>
            </div>

            {!previewUrl ? (
              <ImageUploader
                onImageSelected={(file, url) => {
                  setSelectedFile(file);
                  setPreviewUrl(url);
                  handleAnalyze(file);
                }}
                selectedImage={selectedFile}
                previewUrl={previewUrl}
                onClear={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setAnalysisResult(null);
                }}
                sampleSvgDataUrl={SAMPLE_CRACK_SVG}
                sampleLabel="Load Concrete Shear Fracture"
                label="Upload Concrete or Masonry Crack Image"
                sublabel="Multimodal AI analyzes fracture width, orientation, causes, and shoring needs"
              />
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Crack Analysis"
                    className="w-full h-auto max-h-[460px] object-contain"
                  />
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-amber-300 flex items-center gap-1 shadow">
                    <ZoomIn className="w-3 h-3 text-amber-400" />
                    Forensic Optical Inspection
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Selected Element: <strong className="text-white">{elementType}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAnalysisResult(null);
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

        {/* Right Column: Forensic Diagnosis & Remediation Protocols */}
        <div className="lg:col-span-6 space-y-6">
          {loading ? (
            <LoadingSkeleton
              title="Executing Structural Crack Forensics..."
              message="Calculating crack geometry, comparing against ACI 224R limits, and formulating shoring requirements"
            />
          ) : error ? (
            <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Analysis Failed
              </div>
              <p>{error}</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-6">
              {/* Diagnosis Summary Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                      AI Forensic Diagnosis
                    </span>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {analysisResult.crack_type}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={analysisResult.severity} />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {analysisResult.urgency_timeframe}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Crack Aperture</span>
                    <span className="text-sm font-bold text-rose-400 font-mono">
                      {analysisResult.estimated_width_mm} mm
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Tolerable: &lt; 0.30 mm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono block">Estimated Length</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      {analysisResult.estimated_length_cm} cm
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Diagonal progression</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed pt-1">
                  {analysisResult.detailed_assessment}
                </p>

                {/* Probable Causes */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Identified Root Failure Causes
                  </span>
                  <div className="space-y-1.5">
                    {analysisResult.probable_causes?.map((cause, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                      >
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Remediation Protocols */}
              <div className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/80 backdrop-blur-md shadow-xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  Engineering Remediation Specifications
                </h4>

                {/* Immediate Mitigation */}
                <div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-2">
                    Immediate Emergency Mitigation
                  </span>
                  <div className="space-y-1.5">
                    {analysisResult.immediate_mitigation_steps?.map((step, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2"
                      >
                        <span className="font-bold text-rose-400">{i + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Long Term Repair */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                    Long-Term Structural Rehabilitation
                  </span>
                  <div className="space-y-1.5">
                    {analysisResult.long_term_remediation?.map((spec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Structural Image Loaded</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Upload a high-resolution photo of a concrete fracture or click below to launch the diagnostic demonstration.
              </p>
              <button
                type="button"
                onClick={handleLoadSampleAndAnalyze}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Inspect Demo Shear Crack
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
