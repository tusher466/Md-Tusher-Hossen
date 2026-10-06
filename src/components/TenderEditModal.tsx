import React, { useState } from 'react';
import { TenderInfo } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { X, Edit3, Save } from 'lucide-react';

interface TenderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: TenderInfo;
  onSave: (updated: TenderInfo) => void;
  currentLang: Language;
}

export const TenderEditModal: React.FC<TenderEditModalProps> = ({
  isOpen,
  onClose,
  tender,
  onSave,
  currentLang
}) => {
  const t = translations[currentLang];
  const [formData, setFormData] = useState<TenderInfo>({ ...tender });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-emerald-100 bg-white text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.editTender}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              {t.tenderId}
            </label>
            <input
              type="text"
              required
              value={formData.tender_id}
              onChange={e => setFormData({ ...formData, tender_id: e.target.value })}
              className="w-full text-xs font-mono py-2 px-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              {t.tenderTitle}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs py-2 px-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              {t.procuringEntity}
            </label>
            <input
              type="text"
              required
              value={formData.procuring_entity}
              onChange={e => setFormData({ ...formData, procuring_entity: e.target.value })}
              className="w-full text-xs py-2 px-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              {t.bidderName}
            </label>
            <input
              type="text"
              required
              value={formData.bidder}
              onChange={e => setFormData({ ...formData, bidder: e.target.value })}
              className="w-full text-xs py-2 px-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              {t.submissionDeadline}
            </label>
            <input
              type="date"
              required
              value={formData.submission_deadline}
              onChange={e => setFormData({ ...formData, submission_deadline: e.target.value })}
              className="w-full text-xs font-mono py-2 px-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-emerald-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveTender}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
