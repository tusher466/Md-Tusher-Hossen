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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              {t.editTender}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
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
              className="w-full text-xs font-mono py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full text-xs py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full text-xs font-mono py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
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
