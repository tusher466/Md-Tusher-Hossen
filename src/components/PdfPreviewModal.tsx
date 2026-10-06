import React, { useEffect, useRef, useState } from 'react';
import { UploadedFileRecord } from '../types/tender';
import { Language, translations } from '../locales/translations';
import { pdfjsLib } from '../utils/pdfWorkerSetup';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UploadedFileRecord | null;
  customPdfBytes?: Uint8Array | null;
  customTitle?: string;
  currentLang: Language;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  file,
  customPdfBytes,
  customTitle,
  currentLang
}) => {
  const t = translations[currentLang];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const title = customTitle || file?.name || 'PDF Preview';

  // Load PDF document
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setRenderError(null);
    setCurrentPage(1);

    const dataToLoad = customPdfBytes || file?.data;

    if (!dataToLoad) {
      setLoading(false);
      setRenderError('No PDF data available to preview.');
      return;
    }

    // Clone buffer so worker transfer never detaches the original data in state
    const clonedBuffer = new Uint8Array(dataToLoad.slice(0));
    const loadingTask = (pdfjsLib as any).getDocument({ data: clonedBuffer });
    loadingTask.promise
      .then((doc: any) => {
        if (isMounted) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setLoading(false);
          setRenderError(`Could not render PDF preview: ${err?.message || err}`);
        }
      });

    return () => {
      isMounted = false;
      if (pdfDoc) {
        pdfDoc.destroy?.();
      }
    };
  }, [isOpen, file, customPdfBytes]);

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !isOpen) return;

    let renderTask: any = null;

    pdfDoc.getPage(currentPage).then((page: any) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport
      };

      renderTask = page.render(renderContext);
      renderTask.promise.catch((err: any) => {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('Page render error:', err);
        }
      });
    });

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale, isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const bytes = customPdfBytes || file?.data;
    if (!bytes) return;
    const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-emerald-100 flex items-center justify-between bg-white text-slate-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold truncate text-slate-900">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              title="Download PDF"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title={t.close}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-emerald-50/40 border-b border-emerald-100 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded-md hover:bg-emerald-100/70 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-emerald-900"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-semibold text-emerald-950">
              Page {currentPage} {t.pageOf} {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded-md hover:bg-emerald-100/70 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-emerald-900"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
              title={t.zoomOut}
              className="p-1 rounded-md hover:bg-emerald-100/70 transition-colors text-emerald-900"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] font-semibold text-emerald-900 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
              title={t.zoomIn}
              className="p-1 rounded-md hover:bg-emerald-100/70 transition-colors text-emerald-900"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview Canvas Body */}
        <div className="flex-1 overflow-auto bg-emerald-950/10 p-6 flex items-center justify-center">
          {loading && (
            <div className="text-emerald-800 font-medium text-xs flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Rendering PDF pages...</span>
            </div>
          )}

          {renderError && (
            <div className="text-rose-600 text-xs font-semibold bg-rose-50 border border-rose-200 p-4 rounded-lg">
              {renderError}
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={`shadow-lg bg-white mx-auto rounded-sm ${loading ? 'hidden' : 'block'}`}
          />
        </div>
      </div>
    </div>
  );
};
