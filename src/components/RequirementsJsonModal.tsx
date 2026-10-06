import React, { useState } from 'react';
import { RequirementsData } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { X, Upload, Code, CheckCircle2, AlertCircle } from 'lucide-react';

interface RequirementsJsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: RequirementsData;
  onLoadData: (newData: RequirementsData) => void;
  currentLang: Language;
}

export const RequirementsJsonModal: React.FC<RequirementsJsonModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onLoadData,
  currentLang
}) => {
  const t = translations[currentLang];
  const [jsonText, setJsonText] = useState(JSON.stringify(currentData, null, 2));
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.tender || !Array.isArray(parsed.requirements)) {
          throw new Error('Invalid schema: Missing "tender" object or "requirements" array.');
        }
        setJsonText(text);
      } catch (err: any) {
        setError(`Failed to parse JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.tender || !Array.isArray(parsed.requirements)) {
        throw new Error('JSON must include "tender" object and "requirements" array.');
      }
      onLoadData(parsed);
      onClose();
    } catch (err: any) {
      setError(`JSON Validation Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              {t.loadCustomJson}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <span className="font-semibold text-slate-900 block">
                Upload requirements.json
              </span>
              <span className="text-slate-500 text-[11px]">
                Load an official tender specification file directly from disk.
              </span>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-md font-medium text-slate-700 cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Choose File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              JSON Specification Editor
            </label>
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              rows={14}
              className="w-full font-mono text-[11px] p-3 border border-slate-300 rounded-lg bg-slate-900 text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
          >
            Apply Specification
          </button>
        </div>
      </div>
    </div>
  );
};
