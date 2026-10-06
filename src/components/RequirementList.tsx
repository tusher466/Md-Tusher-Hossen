import React from 'react';
import { RequirementItem, UploadedFileRecord, RequirementStatusType, TenderInfo } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { calculateBestMatches } from '../utils/similarity';
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  XCircle,
  HelpCircle,
  Wand2,
  FileCheck,
  X,
  FileText,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface RequirementListProps {
  requirements: RequirementItem[];
  files: UploadedFileRecord[];
  matches: Record<string, string | undefined>; // requirementId -> fileId
  expiryDates: Record<string, string | undefined>; // requirementId -> YYYY-MM-DD
  tender: TenderInfo;
  currentLang: Language;
  onMatch: (requirementId: string, fileId: string | undefined) => void;
  onSetExpiryDate: (requirementId: string, dateStr: string) => void;
  onAutoMatchAll: () => void;
}

export const RequirementList: React.FC<RequirementListProps> = ({
  requirements,
  files,
  matches,
  expiryDates,
  tender,
  currentLang,
  onMatch,
  onSetExpiryDate,
  onAutoMatchAll
}) => {
  const t = translations[currentLang];

  // Map fileId -> file object
  const filesMap = new Map<string, UploadedFileRecord>();
  files.forEach(f => filesMap.set(f.id, f));

  // Determine which files are already assigned to WHICH requirement
  const assignedFileToReqMap = new Map<string, string>();
  Object.entries(matches).forEach(([reqId, fileId]) => {
    if (fileId) assignedFileToReqMap.set(fileId, reqId);
  });

  // Calculate status for each requirement
  const getRequirementStatus = (req: RequirementItem): {
    status: RequirementStatusType;
    label: string;
    description: string;
    isBlocking: boolean;
  } => {
    const matchedFileId = matches[req.id];
    const matchedFile = matchedFileId ? filesMap.get(matchedFileId) : undefined;
    const expiryDate = expiryDates[req.id];

    // Case 1: No file matched
    if (!matchedFile) {
      if (req.mandatory) {
        return {
          status: 'MISSING',
          label: t.statusMissing,
          description: t.descMissing,
          isBlocking: true
        };
      } else {
        return {
          status: 'NOT_PROVIDED',
          label: t.statusNotProvided,
          description: t.descNotProvided,
          isBlocking: false
        };
      }
    }

    // Case 2: File matched, check expiry requirement
    if (req.has_expiry) {
      if (!expiryDate) {
        return {
          status: 'EXPIRY_NEEDED',
          label: t.statusExpiryNeeded,
          description: t.descExpiryNeeded,
          isBlocking: true
        };
      }

      // Check date: if expiryDate < submission_deadline => Expired
      // Date string format YYYY-MM-DD can be compared lexically directly or via Date
      const deadlineStr = tender.submission_deadline.slice(0, 10);
      const expiryStr = expiryDate.slice(0, 10);

      if (expiryStr < deadlineStr) {
        return {
          status: 'EXPIRED',
          label: t.statusExpired,
          description: `${t.descExpired} (${tender.submission_deadline})`,
          isBlocking: true
        };
      }
    }

    // Case 3: All good!
    return {
      status: 'OK',
      label: t.statusOk,
      description: t.descOk,
      isBlocking: false
    };
  };

  // Sort requirements by order
  const sortedRequirements = [...requirements].sort((a, b) => a.order - b.order);

  // Available files count
  const usableFiles = files.filter(f => !f.isCorrupt && !f.isDuplicate);
  const unassignedFilesCount = usableFiles.filter(f => !assignedFileToReqMap.has(f.id)).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs mb-8">
      {/* Header bar */}
      <div className="p-5 md:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {t.matchingHeader}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.matchingSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {usableFiles.length > 0 && (
            <button
              onClick={onAutoMatchAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{t.autoMatchBtn}</span>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-500 block">Available Uploads</span>
            <span className="text-xs font-semibold text-slate-800 font-mono">
              {unassignedFilesCount} unassigned
            </span>
          </div>
        </div>
      </div>

      {/* Requirements Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">{t.orderCol}</th>
              <th className="py-3 px-4 min-w-[260px]">{t.reqCol}</th>
              <th className="py-3 px-4 min-w-[300px]">{t.matchedFileCol}</th>
              <th className="py-3 px-4 min-w-[170px]">{t.statusCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedRequirements.map(req => {
              const matchedFileId = matches[req.id];
              const matchedFile = matchedFileId ? filesMap.get(matchedFileId) : undefined;
              const statusInfo = getRequirementStatus(req);
              const title = currentLang === 'bn' ? req.title_bn : req.title_en;
              const description = currentLang === 'bn' ? req.description_bn : req.description_en;
              const expiryVal = expiryDates[req.id] || '';

              return (
                <tr
                  key={req.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    statusInfo.status === 'MISSING'
                      ? 'bg-rose-50/20'
                      : statusInfo.status === 'EXPIRED' || statusInfo.status === 'EXPIRY_NEEDED'
                      ? 'bg-amber-50/20'
                      : ''
                  }`}
                >
                  {/* Order Number */}
                  <td className="py-4 px-4 text-center font-mono font-bold text-slate-500 align-top">
                    {req.order}
                  </td>

                  {/* Requirement Details */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 leading-snug">
                          {title}
                        </span>
                      </div>

                      {description && (
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {description}
                        </p>
                      )}

                      {/* Metadata tags */}
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                        <span className={req.mandatory ? 'font-semibold text-blue-700' : 'text-slate-500'}>
                          {req.mandatory ? t.mandatoryBadge : t.optionalBadge}
                        </span>
                        {req.has_expiry && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {t.hasExpiryBadge}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* File Matching & Expiry Picker */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-2">
                      {/* Dropdown File Selector */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <select
                            value={matchedFileId || ''}
                            onChange={e => onMatch(req.id, e.target.value || undefined)}
                            className={`w-full text-xs py-2 px-3 pr-8 rounded-lg border transition-colors bg-white appearance-none cursor-pointer ${
                              matchedFile
                                ? 'border-slate-300 text-slate-900 font-medium'
                                : 'border-slate-200 text-slate-500'
                            }`}
                          >
                            <option value="">{t.selectFilePlaceholder}</option>
                            {files.map(file => {
                              const isCurrentMatch = file.id === matchedFileId;
                              const assignedToOther = assignedFileToReqMap.has(file.id) && !isCurrentMatch;
                              const disabled = file.isCorrupt || file.isDuplicate || assignedToOther;

                              let labelSuffix = '';
                              if (file.isCorrupt) labelSuffix = ' (Corrupt)';
                              else if (file.isDuplicate) labelSuffix = ' (Duplicate)';
                              else if (assignedToOther) labelSuffix = ' (Assigned to another doc)';
                              else labelSuffix = ` (${file.pageCount} pgs)`;

                              return (
                                <option
                                  key={file.id}
                                  value={file.id}
                                  disabled={disabled}
                                  className={disabled ? 'text-slate-400' : 'text-slate-900'}
                                >
                                  {file.name}{labelSuffix}
                                </option>
                              );
                            })}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <FileText className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>

                        {matchedFile && (
                          <button
                            onClick={() => onMatch(req.id, undefined)}
                            title={t.unassignFile}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Expiry Date Input (if has_expiry: true and file is matched) */}
                      {req.has_expiry && matchedFile && (
                        <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/80">
                          <label className="block text-[11px] font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-700" />
                            <span>{t.expiryDateLabel} *</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={expiryVal}
                              onChange={e => onSetExpiryDate(req.id, e.target.value)}
                              className="text-xs font-mono py-1.5 px-2.5 rounded-md border border-amber-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                            <span className="text-[10px] text-amber-700">
                              (Submission deadline: {tender.submission_deadline})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Indicator */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {statusInfo.status === 'OK' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : statusInfo.status === 'NOT_PROVIDED' ? (
                          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : statusInfo.status === 'MISSING' ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}

                        <span
                          className={`font-semibold text-xs ${
                            statusInfo.status === 'OK'
                              ? 'text-emerald-700'
                              : statusInfo.status === 'NOT_PROVIDED'
                              ? 'text-slate-500'
                              : statusInfo.status === 'MISSING'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-tight">
                        {statusInfo.description}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
