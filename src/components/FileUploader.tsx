import React, { useState, useRef } from 'react';
import { UploadedFileRecord } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { calculateBufferHash } from '../utils/hash';
import { generateSamplePdfs } from '../utils/samplePdfGenerator';
import { PDFDocument } from 'pdf-lib';
import { pdfjsLib } from '../utils/pdfWorkerSetup';
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  AlertTriangle,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GripVertical
} from 'lucide-react';

interface FileUploaderProps {
  files: UploadedFileRecord[];
  onAddFiles: (newFiles: UploadedFileRecord[]) => void;
  onRemoveFile: (fileId: string) => void;
  onClearAllFiles: () => void;
  onPreviewFile: (file: UploadedFileRecord) => void;
  currentLang: Language;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onClearAllFiles,
  onPreviewFile,
  currentLang
}) => {
  const t = translations[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatingDemo, setGeneratingDemo] = useState(false);

  const MAX_FILES = 30;
  const MAX_TOTAL_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  const totalSizeBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalPages = files.reduce((acc, f) => acc + (f.isCorrupt ? 0 : f.pageCount), 0);

  // Safe PDF processor
  const processPdfFile = async (file: File): Promise<UploadedFileRecord> => {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const hash = await calculateBufferHash(bytes);
    const blobUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));

    let pageCount = 0;
    let isCorrupt = false;
    let errorMessage: string | undefined = undefined;

    // Load with pdf-lib to check structure, encryption, and count pages safely
    try {
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });
      pageCount = pdfDoc.getPageCount();
    } catch (err: any) {
      isCorrupt = true;
      const errStr = String(err?.message || err);
      if (errStr.toLowerCase().includes('password') || errStr.toLowerCase().includes('encrypted')) {
        errorMessage = t.passwordProtected;
      } else {
        errorMessage = t.corruptFile;
      }
    }

    const uniqueId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}_${Math.random().toString(36).slice(2, 9)}`;

    return {
      id: uniqueId,
      name: file.name,
      size: file.size,
      pageCount,
      hash,
      data: bytes,
      blobUrl,
      isCorrupt,
      errorMessage
    };
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const rawFiles = Array.from(fileList);

    // Filter PDF only
    const nonPdfs = rawFiles.filter(f => !f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf');
    if (nonPdfs.length > 0) {
      setErrorMessage(`Rejected ${nonPdfs.length} non-PDF file(s): ${nonPdfs.map(f => f.name).join(', ')}. Only .pdf files are accepted.`);
    }

    const validPdfFiles = rawFiles.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (validPdfFiles.length === 0) return;

    if (files.length + validPdfFiles.length > MAX_FILES) {
      setErrorMessage(`Upload limit reached: Maximum ${MAX_FILES} files allowed. You already have ${files.length} files.`);
      return;
    }

    const incomingSize = validPdfFiles.reduce((acc, f) => acc + f.size, 0);
    if (totalSizeBytes + incomingSize > MAX_TOTAL_SIZE_BYTES) {
      setErrorMessage(`Size limit exceeded: Total files cannot exceed 50 MB.`);
      return;
    }

    setIsProcessing(true);

    try {
      const processedList: UploadedFileRecord[] = [];

      for (const f of validPdfFiles) {
        const processed = await processPdfFile(f);
        processedList.push(processed);
      }

      // Pass processed files to parent which calculates duplicates reactively across all files
      onAddFiles(processedList);
    } catch (err: any) {
      setErrorMessage(`Failed to process PDFs: ${err?.message || err}`);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleGenerateSampleFiles = async () => {
    setGeneratingDemo(true);
    try {
      const sampleFiles = await generateSamplePdfs();
      await handleFiles(sampleFiles);
    } catch (err: any) {
      setErrorMessage(`Failed to generate test PDFs: ${err?.message || err}`);
    } finally {
      setGeneratingDemo(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {t.uploadHeader}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.uploadLimits}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateSampleFiles}
              disabled={generatingDemo || isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{generatingDemo ? 'Generating...' : t.createDemoPdfs}</span>
            </button>

            {files.length > 0 && (
              <button
                onClick={onClearAllFiles}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearAllFiles}</span>
              </button>
            )}
          </div>
        </div>

        {/* Drag & Drop Surface */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
              : 'border-emerald-200/90 hover:border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => e.target.files && handleFiles(e.target.files)}
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-2xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-sm font-semibold text-slate-900">
            {t.dropzoneTitle}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {t.dropzoneSubtitle}
          </div>

          {isProcessing && (
            <div className="mt-3 text-xs text-emerald-700 font-medium animate-pulse">
              Calculating cryptographic SHA-256 hashes & page counts...
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload Capacity Stats */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-emerald-50 pt-4">
          <div>
            <span className="text-slate-500 block">{t.totalFilesCount}</span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums">
              {files.length} / {MAX_FILES}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.totalSize}</span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums">
              {formatFileSize(totalSizeBytes)} / 50 MB
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.pageCount}</span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums">
              {totalPages} pages total
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Status</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for matching
            </span>
          </div>
        </div>
      </div>

      {/* Uploaded Files Table Dashboard */}
      {files.length > 0 && (
        <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-emerald-100 bg-emerald-50/40 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Uploaded Document Repository ({files.length})
            </h3>
            <span className="text-xs text-emerald-700/80 font-medium">
              Content-verified & indexed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-100 bg-emerald-50/20 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">File Name & Content Verification</th>
                  <th className="py-2.5 px-4 w-28 text-right">Size</th>
                  <th className="py-2.5 px-4 w-24 text-center">Pages</th>
                  <th className="py-2.5 px-4 w-36 text-center">Integrity</th>
                  <th className="py-2.5 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {files.map((file, idx) => {
                  const canDrag = !file.isCorrupt && !file.isDuplicate;
                  return (
                    <tr
                      key={file.id}
                      draggable={canDrag}
                      onDragStart={e => {
                        if (!canDrag) return;
                        e.dataTransfer.setData('text/plain', file.id);
                        e.dataTransfer.setData('application/json', JSON.stringify({ id: file.id, name: file.name }));
                        e.dataTransfer.effectAllowed = 'copyMove';
                      }}
                      className={`hover:bg-emerald-50/40 transition-colors ${
                        canDrag ? 'cursor-grab active:cursor-grabbing' : ''
                      } ${
                        file.isDuplicate ? 'bg-amber-50/30' : file.isCorrupt ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-400">
                        <div className="flex items-center justify-center gap-1">
                          {canDrag ? (
                            <span title="Drag to match with requirement" className="cursor-grab">
                              <GripVertical className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-700 shrink-0" />
                            </span>
                          ) : (
                            <span className="w-3.5" />
                          )}
                          <span>{idx + 1}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className={`w-4 h-4 shrink-0 ${file.isCorrupt ? 'text-rose-500' : 'text-emerald-600'}`} />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate max-w-md">
                              {file.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              SHA: {file.hash.slice(0, 16)}...
                            </span>
                          </div>
                        </div>

                      {/* Duplicate Flag */}
                      {file.isDuplicate && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {t.duplicateDetected}: {t.duplicateDesc} &quot;{file.duplicateOfName}&quot;
                          </span>
                        </div>
                      )}

                      {/* Corrupt Flag */}
                      {file.isCorrupt && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
                          {file.errorMessage?.includes('Password') ? (
                            <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          )}
                          <span>{file.errorMessage}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      {formatFileSize(file.size)}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-slate-900 font-semibold tabular-nums">
                      {file.isCorrupt ? '-' : file.pageCount}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {file.isCorrupt ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                          <AlertCircle className="w-3 h-3 text-rose-600" /> Corrupt
                        </span>
                      ) : file.isDuplicate ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Duplicate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!file.isCorrupt && (
                          <button
                            onClick={() => onPreviewFile(file)}
                            title={t.previewPdf}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onRemoveFile(file.id)}
                          title={t.removeFile}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
