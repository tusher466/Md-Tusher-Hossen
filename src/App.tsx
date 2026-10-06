import React, { useState, useEffect } from 'react';
import {
  TenderInfo,
  RequirementItem,
  RequirementsData,
  UploadedFileRecord,
  RequirementStatusType,
  SealConfig
} from './types/tender';
import { defaultRequirementsData } from './data/defaultRequirements';
import { Language, translations } from './locales/translations';
import { Header } from './components/Header';
import { TenderOverview } from './components/TenderOverview';
import { FileUploader } from './components/FileUploader';
import { RequirementList } from './components/RequirementList';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { SealModal } from './components/SealModal';
import { RequirementsJsonModal } from './components/RequirementsJsonModal';
import { TenderEditModal } from './components/TenderEditModal';
import { generateTenderPackage } from './utils/PdfGenerator';
import { calculateBestMatches } from './utils/similarity';
import { exportChecklistToCSV, exportProjectToFile } from './utils/exportChecklist';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Download,
  Stamp,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Eye,
  ArrowRight,
  Info
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tender_builder_progress_v1';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Requirements & Tender Data
  const [requirementsData, setRequirementsData] = useState<RequirementsData>(defaultRequirementsData);
  const { tender, requirements } = requirementsData;

  // Uploaded Files State
  const [files, setFiles] = useState<UploadedFileRecord[]>([]);

  // Matching & Expiry State
  // matches: requirementId -> fileId
  const [matches, setMatches] = useState<Record<string, string | undefined>>({});
  // expiryDates: requirementId -> YYYY-MM-DD
  const [expiryDates, setExpiryDates] = useState<Record<string, string | undefined>>({});

  // Seal / Stamp Configuration
  const [sealConfig, setSealConfig] = useState<SealConfig>({
    enabled: false,
    targetPages: 'all',
    position: 'bottom-right',
    width: 140,
    height: 70,
    opacity: 0.85
  });

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'matching' | 'generate'>('matching');
  const [previewFile, setPreviewFile] = useState<UploadedFileRecord | null>(null);
  const [generatedPdfBytes, setGeneratedPdfBytes] = useState<Uint8Array | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);
  const [showCustomJsonModal, setShowCustomJsonModal] = useState(false);
  const [showTenderEditModal, setShowTenderEditModal] = useState(false);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ message: string; percent: number }>({
    message: '',
    percent: 0
  });

  // Load initial progress from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tender && parsed.requirements) {
          setRequirementsData({ tender: parsed.tender, requirements: parsed.requirements });
        }
        if (parsed.matches) {
          setMatches(parsed.matches);
        }
        if (parsed.expiryDates) {
          setExpiryDates(parsed.expiryDates);
        }
        if (parsed.sealConfig) {
          setSealConfig(parsed.sealConfig);
        }
        if (parsed.lang) {
          setLang(parsed.lang);
        }
      }
    } catch (e) {
      console.warn('Could not restore from localStorage:', e);
    }
  }, []);

  // Auto-save progress to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        tender: requirementsData.tender,
        requirements: requirementsData.requirements,
        matches,
        expiryDates,
        sealConfig,
        lang
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to auto-save to localStorage:', e);
    }
  }, [requirementsData, matches, expiryDates, sealConfig, lang]);

  // Files Map
  const filesMap = new Map<string, UploadedFileRecord>();
  files.forEach(f => filesMap.set(f.id, f));

  // Compute status map for all requirements
  const statusMap = new Map<string, RequirementStatusType>();
  const blockingItems: { req: RequirementItem; reason: string }[] = [];

  for (const req of requirements) {
    const matchedFileId = matches[req.id];
    const matchedFile = matchedFileId ? filesMap.get(matchedFileId) : undefined;
    const expiryDate = expiryDates[req.id];

    let currentStatus: RequirementStatusType = 'OK';

    if (!matchedFile) {
      if (req.mandatory) {
        currentStatus = 'MISSING';
        blockingItems.push({
          req,
          reason: lang === 'bn' ? 'আবশ্যকীয় দলিলটি এখনো সংযুক্ত করা হয়নি।' : 'Mandatory document has not been attached.'
        });
      } else {
        currentStatus = 'NOT_PROVIDED';
      }
    } else if (req.has_expiry) {
      if (!expiryDate) {
        currentStatus = 'EXPIRY_NEEDED';
        blockingItems.push({
          req,
          reason: lang === 'bn' ? 'দলিলের মেয়াদের তারিখ প্রদান করা প্রয়োজন।' : 'Expiry date must be specified for this document.'
        });
      } else {
        const deadlineStr = tender.submission_deadline.slice(0, 10);
        const expiryStr = expiryDate.slice(0, 10);
        if (expiryStr < deadlineStr) {
          currentStatus = 'EXPIRED';
          blockingItems.push({
            req,
            reason: lang === 'bn' ? `মেয়াদ শেষ (${expiryDate}), যা দাখিলের শেষ তারিখ (${tender.submission_deadline}) এর পূর্বে।` : `Expired on ${expiryDate}, which is strictly before the submission deadline (${tender.submission_deadline}).`
          });
        } else {
          currentStatus = 'OK';
        }
      }
    } else {
      currentStatus = 'OK';
    }

    statusMap.set(req.id, currentStatus);
  }

  const isPackageGenerationAllowed = blockingItems.length === 0;

  // File Handlers
  const handleAddFiles = (newFiles: UploadedFileRecord[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    // Clear matches referencing this file
    setMatches(prev => {
      const next = { ...prev };
      Object.entries(next).forEach(([reqId, fId]) => {
        if (fId === fileId) {
          delete next[reqId];
        }
      });
      return next;
    });
  };

  const handleClearAllFiles = () => {
    setFiles([]);
    setMatches({});
    setExpiryDates({});
  };

  const handleMatch = (requirementId: string, fileId: string | undefined) => {
    setMatches(prev => {
      const next = { ...prev };
      if (!fileId) {
        delete next[requirementId];
      } else {
        // Enforce 1-to-1: if this file was matched anywhere else, unassign it
        Object.entries(next).forEach(([otherReqId, otherFileId]) => {
          if (otherFileId === fileId && otherReqId !== requirementId) {
            delete next[otherReqId];
          }
        });
        next[requirementId] = fileId;
      }
      return next;
    });
  };

  const handleSetExpiryDate = (requirementId: string, dateStr: string) => {
    setExpiryDates(prev => ({
      ...prev,
      [requirementId]: dateStr
    }));
  };

  // Smart Auto-Match
  const handleAutoMatchAll = () => {
    const suggestions = calculateBestMatches(requirements, files, matches);
    if (suggestions.length === 0) return;

    setMatches(prev => {
      const next = { ...prev };
      for (const item of suggestions) {
        next[item.requirementId] = item.fileId;
      }
      return next;
    });
  };

  // Generate Final PDF Package
  const handleGeneratePackage = async () => {
    if (!isPackageGenerationAllowed) return;

    setIsGenerating(true);
    setGenerationProgress({ message: 'Starting PDF Package Generation...', percent: 5 });

    try {
      const compiledBytes = await generateTenderPackage(
        tender,
        requirements,
        matches,
        expiryDates,
        filesMap,
        sealConfig,
        lang,
        (msg, pct) => setGenerationProgress({ message: msg, percent: pct })
      );

      setGeneratedPdfBytes(compiledBytes);

      // Trigger automatic download
      const blob = new Blob([compiledBytes as unknown as BlobPart], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const cleanTenderId = tender.tender_id.replace(/[^a-zA-Z0-9_-]/g, '_');
      link.download = `${cleanTenderId}_Package.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error('Failed to generate package:', err);
      alert(`Package generation error: ${err?.message || err}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export CSV
  const handleExportChecklistCsv = () => {
    exportChecklistToCSV(requirements, matches, expiryDates, filesMap, statusMap, tender.tender_id, lang);
  };

  // Export Project File
  const handleExportProject = () => {
    exportProjectToFile(tender, requirements, matches, expiryDates, filesMap, sealConfig);
  };

  // Import Project File
  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.tender && parsed.requirements) {
          setRequirementsData({ tender: parsed.tender, requirements: parsed.requirements });
        }
        if (parsed.matches) {
          // Re-map matches based on file name if file exists in list
          const restoredMatches: Record<string, string | undefined> = {};
          const restoredExpiries: Record<string, string | undefined> = {};

          Object.entries(parsed.matches).forEach(([reqId, val]: [string, any]) => {
            if (val.expiryDate) {
              restoredExpiries[reqId] = val.expiryDate;
            }
            if (val.matchedFileName) {
              const matchingFile = files.find(f => f.name === val.matchedFileName);
              if (matchingFile) {
                restoredMatches[reqId] = matchingFile.id;
              }
            }
          });

          setMatches(restoredMatches);
          setExpiryDates(restoredExpiries);
        }
        if (parsed.sealConfig) {
          setSealConfig(parsed.sealConfig);
        }
        alert(t.projectLoadedAlert);
      } catch (err: any) {
        alert(`Failed to import project: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset to default sample tender
  const handleResetToDefault = () => {
    if (window.confirm('Reset all tender specifications to the default sample configuration?')) {
      setRequirementsData(defaultRequirementsData);
      setMatches({});
      setExpiryDates({});
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const matchedDocsCount = Object.values(matches).filter(Boolean).length;
  const totalMandatoryCount = requirements.filter(r => r.mandatory).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Bar adhering to strict Top Bar Contract */}
      <Header
        currentLang={lang}
        onToggleLang={() => setLang(l => (l === 'en' ? 'bn' : 'en'))}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCustomJson={() => setShowCustomJsonModal(true)}
        onExportProject={handleExportProject}
        onImportProject={handleImportProject}
      />

      {/* Main Body Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Tender Overview Card */}
        <TenderOverview
          tender={tender}
          currentLang={lang}
          onEditTender={() => setShowTenderEditModal(true)}
          onLoadCustomJson={() => setShowCustomJsonModal(true)}
          onResetToDefault={handleResetToDefault}
        />

        {/* Section 1: Upload Files Dashboard */}
        <div className="mb-8">
          <FileUploader
            files={files}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onClearAllFiles={handleClearAllFiles}
            onPreviewFile={file => {
              setPreviewFile(file);
              setGeneratedPdfBytes(null);
              setShowPreviewModal(true);
            }}
            currentLang={lang}
          />
        </div>

        {/* Section 2: Requirements & Document Matching */}
        <RequirementList
          requirements={requirements}
          files={files}
          matches={matches}
          expiryDates={expiryDates}
          tender={tender}
          currentLang={lang}
          onMatch={handleMatch}
          onSetExpiryDate={handleSetExpiryDate}
          onAutoMatchAll={handleAutoMatchAll}
        />

        {/* Section 3: Package Validation Gate & Generation Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <span>Phase 3</span>
                <span>·</span>
                <span>{t.generateHeader}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {isPackageGenerationAllowed ? t.allValidTitle : t.blockingErrorsTitle}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {isPackageGenerationAllowed ? t.allValidDesc : t.blockingErrorsDesc}
              </p>
            </div>

            {/* Seal and Export Controls */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowSealModal(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors shadow-2xs ${
                  sealConfig.enabled
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Stamp className="w-3.5 h-3.5 text-blue-600" />
                <span>{sealConfig.enabled ? t.sealActive : t.sealConfigure}</span>
              </button>

              <button
                onClick={handleExportChecklistCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.exportChecklistCsv}</span>
              </button>
            </div>
          </div>

          {/* Blocking Issues Checklist */}
          {!isPackageGenerationAllowed && (
            <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-900 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Blocking Requirements Checklist ({blockingItems.length})</span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-rose-800">
                {blockingItems.map(item => (
                  <li key={item.req.id}>
                    <span className="font-semibold">
                      {lang === 'bn' ? item.req.title_bn : item.req.title_en}
                    </span>
                    : {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Compilation Status & Final Action */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  {matchedDocsCount} / {requirements.length}
                </span>
                <span>documents included</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">
                  {totalMandatoryCount} mandatory
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {generatedPdfBytes && (
                <button
                  onClick={() => {
                    setPreviewFile(null);
                    setShowPreviewModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Generated Package</span>
                </button>
              )}

              <button
                onClick={handleGeneratePackage}
                disabled={!isPackageGenerationAllowed || isGenerating}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold rounded-lg transition-all shadow-sm ${
                  isPackageGenerationAllowed && !isGenerating
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{generationProgress.message || t.generatingBtn}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t.generateBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generating Progress Bar */}
          {isGenerating && (
            <div className="mt-4">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${generationProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>Tender Document Package Builder · Strict In-Browser Processing (Chrome Tested)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Powered by pdf-lib & pdf.js</span>
            <span>·</span>
            <span>Zero External API Calls</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PdfPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        file={previewFile}
        customPdfBytes={generatedPdfBytes}
        customTitle={generatedPdfBytes ? `${tender.tender_id}_Package.pdf` : undefined}
        currentLang={lang}
      />

      <SealModal
        isOpen={showSealModal}
        onClose={() => setShowSealModal(false)}
        config={sealConfig}
        onSave={setSealConfig}
        currentLang={lang}
      />

      <RequirementsJsonModal
        isOpen={showCustomJsonModal}
        onClose={() => setShowCustomJsonModal(false)}
        currentData={requirementsData}
        onLoadData={newData => {
          setRequirementsData(newData);
          setMatches({});
          setExpiryDates({});
        }}
        currentLang={lang}
      />

      <TenderEditModal
        isOpen={showTenderEditModal}
        onClose={() => setShowTenderEditModal(false)}
        tender={tender}
        onSave={updated => {
          setRequirementsData(prev => ({ ...prev, tender: updated }));
        }}
        currentLang={lang}
      />
    </div>
  );
}
