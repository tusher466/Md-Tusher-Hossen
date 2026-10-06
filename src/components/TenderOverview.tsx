import React from 'react';
import { TenderInfo } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { Building2, Calendar, FileCode, Hash, ShieldCheck, UserCheck, Edit3, RotateCcw } from 'lucide-react';

interface TenderOverviewProps {
  tender: TenderInfo;
  currentLang: Language;
  onEditTender: () => void;
  onLoadCustomJson: () => void;
  onResetToDefault: () => void;
}

export const TenderOverview: React.FC<TenderOverviewProps> = ({
  tender,
  currentLang,
  onEditTender,
  onLoadCustomJson,
  onResetToDefault
}) => {
  const t = translations[currentLang];

  // Calculate days remaining to deadline
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(tender.submission_deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isPast = diffDays < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>{t.tenderDetails}</span>
            <span>·</span>
            <span className="font-mono text-slate-700 font-semibold">{tender.tender_id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {tender.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onEditTender}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.editTender}</span>
          </button>

          <button
            onClick={onLoadCustomJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.loadCustomJson}</span>
          </button>

          <button
            onClick={onResetToDefault}
            title={t.resetToDefault}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tender Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.procuringEntity}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5 line-clamp-2">
              {tender.procuring_entity}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.bidderName}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
              {tender.bidder}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {t.submissionDeadline}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">
              {tender.submission_deadline}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isPast ? (
                <span className="text-rose-600 font-medium">Passed {Math.abs(diffDays)} days ago</span>
              ) : diffDays === 0 ? (
                <span className="text-amber-600 font-semibold">Expires Today</span>
              ) : (
                <span className="text-emerald-600 font-medium">{diffDays} days remaining</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Procurement Protocol
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              National Competitive (PPR-2008)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Client-Side Certified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
