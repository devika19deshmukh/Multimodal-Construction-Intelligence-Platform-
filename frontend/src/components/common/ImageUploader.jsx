import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { dataUrlToFile } from '../../utils/sampleData';

export default function ImageUploader({
  onImageSelected,
  selectedImage,
  previewUrl,
  onClear,
  sampleSvgDataUrl,
  sampleLabel = 'Load Demo Inspection Image',
  label = 'Upload Job Site Inspection Photo',
  sublabel = 'Drag and drop high-res PNG, JPG, or WebP (up to 20MB)'
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onImageSelected(file, url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = () => {
    if (!sampleSvgDataUrl) return;
    const file = dataUrlToFile(sampleSvgDataUrl, 'demo_inspection_site.svg');
    handleFile(file);
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-slate-700/80 hover:border-amber-500/50 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />

          <div className="p-4 mb-3 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 group-hover:scale-110 group-hover:text-amber-300 transition-all">
            <Upload className="w-7 h-7" />
          </div>

          <p className="text-sm font-semibold text-slate-200 mb-1">{label}</p>
          <p className="text-xs text-slate-400 text-center max-w-sm mb-4">{sublabel}</p>

          {sampleSvgDataUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSampleClick();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {sampleLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-md group">
          <div className="relative max-h-72 w-full flex items-center justify-center bg-slate-900/80">
            <img
              src={previewUrl}
              alt="Inspection Upload Preview"
              className="max-h-72 w-auto object-contain"
            />
          </div>

          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 truncate">
              <ImageIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-mono truncate">{selectedImage?.name || 'Inspection Image'}</span>
              {selectedImage?.size && (
                <span className="text-slate-500 font-mono">
                  ({(selectedImage.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {sampleSvgDataUrl && (
                <button
                  type="button"
                  onClick={handleSampleClick}
                  className="px-2 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Reload Demo Sample
                </button>
              )}
              <button
                type="button"
                onClick={onClear}
                className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
