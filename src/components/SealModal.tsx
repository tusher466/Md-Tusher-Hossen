import React, { useState, useRef } from 'react';
import { SealConfig } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { Stamp, Upload, X, Check, Trash2, Eye } from 'lucide-react';

interface SealModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SealConfig;
  onSave: (config: SealConfig) => void;
  currentLang: Language;
}

export const SealModal: React.FC<SealModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  currentLang
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentConfig, setCurrentConfig] = useState<SealConfig>(config);
  const [previewError, setPreviewError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPreviewError('Please upload a valid PNG or JPG image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCurrentConfig(prev => ({
        ...prev,
        enabled: true,
        imageDataUrl: reader.result as string,
        fileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSampleSeal = () => {
    // Generate a clean circular SVG/Canvas stamp for testing
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 140;
    const ctx = canvas.getContext('2d')!;

    // Outer border
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 220, 120);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, 210, 110);

    // Text
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('APEX INFRASTRUCTURE LTD.', 120, 42);

    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('OFFICIAL TENDER SEAL', 120, 62);

    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('Md. Rafiqul Islam (MD)', 120, 85);

    ctx.font = '8px monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('Date: 2026-10-06 · Dhaka', 120, 105);

    const dataUrl = canvas.toDataURL('image/png');
    setCurrentConfig(prev => ({
      ...prev,
      enabled: true,
      imageDataUrl: dataUrl,
      fileName: 'Generated_Demo_Seal.png'
    }));
  };

  const handleSave = () => {
    onSave(currentConfig);
    onClose();
  };

  const handleClearSeal = () => {
    setCurrentConfig(prev => ({
      ...prev,
      enabled: false,
      imageDataUrl: undefined,
      fileName: undefined
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              {t.sealModalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Enable toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="font-semibold text-slate-900 block">
                Enable Seal / Signature Overlay
              </span>
              <span className="text-slate-500 text-[11px]">
                Stamp official company insignia onto pages of the compiled submission PDF.
              </span>
            </div>
            <input
              type="checkbox"
              checked={currentConfig.enabled}
              onChange={e => setCurrentConfig(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold text-slate-900 mb-2">
              {t.uploadSealImg}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png,image/jpeg"
              className="hidden"
            />

            {currentConfig.imageDataUrl ? (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 bg-white border border-slate-200 rounded p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={currentConfig.imageDataUrl}
                      alt="Seal Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block truncate max-w-xs">
                      {currentConfig.fileName || 'Company_Seal.png'}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Seal image loaded
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    Change
                  </button>
                  <button
                    onClick={handleClearSeal}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="font-semibold text-slate-800 block text-xs">Browse Seal Image</span>
                  <span className="text-[11px] text-slate-500">Transparent PNG recommended</span>
                </button>

                <button
                  type="button"
                  onClick={handleCreateSampleSeal}
                  className="px-4 py-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors text-center"
                >
                  Create Demo Seal Stamp
                </button>
              </div>
            )}

            {previewError && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{previewError}</p>
            )}
          </div>

          {/* Target Pages */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1.5">
              {t.sealPageTarget}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'all', label: t.targetAll },
                { id: 'cover_only', label: t.targetCoverOnly },
                { id: 'doc_first_pages', label: t.targetFirstPages },
                { id: 'all_except_cover', label: t.targetExceptCover },
                { id: 'custom', label: t.targetCustom }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    currentConfig.targetPages === opt.id
                      ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetPages"
                    value={opt.id}
                    checked={currentConfig.targetPages === opt.id}
                    onChange={() => setCurrentConfig(prev => ({ ...prev, targetPages: opt.id as any }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {currentConfig.targetPages === 'custom' && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={t.customPagesPlaceholder}
                  value={currentConfig.customPagesString || ''}
                  onChange={e => setCurrentConfig(prev => ({ ...prev, customPagesString: e.target.value }))}
                  className="w-full text-xs font-mono py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Placement & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                {t.stampPosition}
              </label>
              <select
                value={currentConfig.position}
                onChange={e => setCurrentConfig(prev => ({ ...prev, position: e.target.value as any }))}
                className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white"
              >
                <option value="bottom-right">{t.posBottomRight}</option>
                <option value="bottom-left">{t.posBottomLeft}</option>
                <option value="bottom-center">{t.posBottomCenter}</option>
                <option value="top-right">{t.posTopRight}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                {t.stampOpacity} ({Math.round((currentConfig.opacity || 0.85) * 100)}%)
              </label>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={currentConfig.opacity || 0.85}
                onChange={e => setCurrentConfig(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                className="w-full mt-2 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            {t.saveSeal}
          </button>
        </div>
      </div>
    </div>
  );
};
