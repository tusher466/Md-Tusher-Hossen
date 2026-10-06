import React from 'react';
import { TenderInfo } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { Building2, Calendar, FileCode, Hash, ShieldCheck, UserCheck, Edit3, RotateCcw } from 'lucide-react';

interface TenderOverviewProps {
  tender: TenderInfo;
  currentLang: Language;
  onEditTender: () => void;
  onLoadCustomJson: () => void;
  onDirectJsonUpload: (data: any) => void;
  onResetToDefault: () => void;
}

export const TenderOverview: React.FC<TenderOverviewProps> = ({
  tender,
  currentLang,
  onEditTender,
  onLoadCustomJson,
  onDirectJsonUpload,
  onResetToDefault
}) => {
  const t = translations[currentLang];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed.tender || !Array.isArray(parsed.requirements)) {
          alert('Invalid schema: File must contain a "tender" object and a "requirements" array.');
          return;
        }
        onDirectJsonUpload(parsed);
      } catch (err: any) {
        alert(`Failed to parse JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Calculate days remaining to deadline
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(tender.submission_deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isPast = diffDays < 0;

  return (
    <div className="bg-white border border-emerald-100/90 rounded-2xl shadow-xs p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-emerald-50">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <span className="text-emerald-800 font-medium">{t.tenderDetails}</span>
            <span>·</span>
            <span className="font-mono text-emerald-900 font-bold bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/70">
              {tender.tender_id}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {tender.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
            title="Open requirements.json file"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open requirements.json</span>
          </button>

          <button
            onClick={onEditTender}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.editTender}</span>
          </button>

          <button
            onClick={onLoadCustomJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors"
            title="Open JSON editor modal"
          >
            <span>JSON Editor</span>
          </button>

          <button
            onClick={onResetToDefault}
            title={t.resetToDefault}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tender Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
        <div className="flex items-start gap-3 bg-emerald-50/30 border border-emerald-100/70 p-3 rounded-xl">
          <div className="p-2 rounded-lg bg-white border border-emerald-100 text-emerald-700 shrink-0 shadow-2xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-emerald-800/80 uppercase tracking-wider">
              {t.procuringEntity}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5 line-clamp-2">
              {tender.procuring_entity}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-emerald-50/30 border border-emerald-100/70 p-3 rounded-xl">
          <div className="p-2 rounded-lg bg-white border border-emerald-100 text-emerald-700 shrink-0 shadow-2xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-emerald-800/80 uppercase tracking-wider">
              {t.bidderName}
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">
              {tender.bidder}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-emerald-50/30 border border-emerald-100/70 p-3 rounded-xl">
          <div className="p-2 rounded-lg bg-white border border-emerald-100 text-emerald-700 shrink-0 shadow-2xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-emerald-800/80 uppercase tracking-wider">
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
                <span className="text-emerald-700 font-semibold">{diffDays} days remaining</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-emerald-50/30 border border-emerald-100/70 p-3 rounded-xl">
          <div className="p-2 rounded-lg bg-white border border-emerald-100 text-emerald-600 shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-emerald-800/80 uppercase tracking-wider">
              Procurement Protocol
            </div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              National Competitive (PPR-2008)
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Client-Side Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
