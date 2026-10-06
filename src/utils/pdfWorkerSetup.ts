import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker for browser environment
if (typeof window !== 'undefined') {
  try {
    // Point worker to cdnjs / unpkg matching the version
    const version = (pdfjsLib as any).version || '4.10.38';
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('Could not set GlobalWorkerOptions.workerSrc:', err);
  }
}

export { pdfjsLib };
