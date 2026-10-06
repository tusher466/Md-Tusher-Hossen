import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { TenderInfo, RequirementItem, UploadedFileRecord, SealConfig } from '../types/tender';

export interface CompiledDocEntry {
  requirement: RequirementItem;
  file: UploadedFileRecord;
  startPage: number;
  endPage: number;
  pageCount: number;
  expiryDate?: string;
}

/**
 * Renders a high-resolution A4 page onto a canvas with native browser font rendering,
 * perfectly supporting English and Bengali Unicode text with complex ligatures.
 */
function createPageCanvas(widthPt: number, heightPt: number, scale = 2.5): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(widthPt * scale);
  canvas.height = Math.round(heightPt * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  // Fill clean white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPt, heightPt);
  return { canvas, ctx };
}

/**
 * Render dynamic Cover Page onto Canvas and return PNG data URL.
 */
function renderCoverPageCanvas(
  tender: TenderInfo,
  includedDocs: CompiledDocEntry[],
  widthPt: number,
  heightPt: number,
  lang: 'en' | 'bn'
): string {
  const { canvas, ctx } = createPageCanvas(widthPt, heightPt);

  // Outer framing
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, widthPt - 72, heightPt - 72);

  // Inner decorative border
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(41, 41, widthPt - 82, heightPt - 82);

  // Header band
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(44, 44, widthPt - 88, 48);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার — দরপত্র দাখিল প্যাকেজ' : 'GOVERNMENT TENDER SUBMISSION PACKAGE',
    widthPt / 2,
    68
  );

  ctx.font = '500 9px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    lang === 'bn' ? 'পাবলিক প্রকিউরমেন্ট রুলস (PPR) অনুযায়ী প্রস্তুতকৃত' : 'OFFICIAL BID SUBMISSION UNDER PUBLIC PROCUREMENT FRAMEWORK',
    widthPt / 2,
    82
  );

  // Tender ID & Title Block
  let y = 118;
  ctx.textAlign = 'left';

  // Tender Ref badge
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(52, y, widthPt - 104, 28);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, y, widthPt - 104, 28);

  ctx.fillStyle = '#475569';
  ctx.font = '600 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TENDER IDENTIFICATION / REF NO:', 62, y + 18);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText(tender.tender_id, 240, y + 18);

  y += 42;

  // Tender Title
  ctx.fillStyle = '#64748b';
  ctx.font = '600 8.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(lang === 'bn' ? 'দরপত্রের কাজের শিরোনাম' : 'CONTRACT TITLE / SCOPE OF WORK', 52, y);
  y += 14;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  const words = tender.title.split(' ');
  let titleLine = '';
  for (const w of words) {
    const testLine = titleLine ? `${titleLine} ${w}` : w;
    if (ctx.measureText(testLine).width > widthPt - 110) {
      ctx.fillText(titleLine, 52, y);
      y += 16;
      titleLine = w;
    } else {
      titleLine = testLine;
    }
  }
  if (titleLine) {
    ctx.fillText(titleLine, 52, y);
    y += 22;
  }

  // Key Metadata 2-Column Grid
  const colW = (widthPt - 110) / 2;
  const gridBoxY = y;
  const gridBoxH = 76;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(52, gridBoxY, widthPt - 104, gridBoxH);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(52, gridBoxY, widthPt - 104, gridBoxH);
  ctx.beginPath();
  ctx.moveTo(52 + colW, gridBoxY);
  ctx.lineTo(52 + colW, gridBoxY + gridBoxH);
  ctx.stroke();

  // Left col: Procuring Entity & Submission Deadline
  ctx.fillStyle = '#64748b';
  ctx.font = '600 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(lang === 'bn' ? 'ক্রয়কারী কর্তৃপক্ষ (সংস্থা)' : 'PROCURING ENTITY', 60, gridBoxY + 16);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  
  // Wrap procuring entity
  const pWords = tender.procuring_entity.split(' ');
  let pLine = '';
  let pY = gridBoxY + 28;
  for (const pw of pWords) {
    const t = pLine ? `${pLine} ${pw}` : pw;
    if (ctx.measureText(t).width > colW - 20) {
      ctx.fillText(pLine, 60, pY);
      pY += 11;
      pLine = pw;
    } else {
      pLine = t;
    }
  }
  if (pLine) ctx.fillText(pLine, 60, pY);

  // Right col: Bidder & Deadline
  ctx.fillStyle = '#64748b';
  ctx.font = '600 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(lang === 'bn' ? 'দরপত্রদাতা প্রতিষ্ঠান' : 'BIDDER / CONTRACTOR', 52 + colW + 12, gridBoxY + 16);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 8.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(tender.bidder, 52 + colW + 12, gridBoxY + 28);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(lang === 'bn' ? 'দাখিলের শেষ সময়সীমা' : 'SUBMISSION DEADLINE', 52 + colW + 12, gridBoxY + 50);
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.fillText(tender.submission_deadline, 52 + colW + 12, gridBoxY + 62);

  // Date Generated timestamp
  ctx.fillStyle = '#64748b';
  ctx.font = '600 7.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('COMPILED ON', 60, gridBoxY + 58);
  ctx.fillStyle = '#0f172a';
  ctx.font = '8px "JetBrains Mono", monospace';
  const now = new Date();
  ctx.fillText(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC', 60, gridBoxY + 68);

  y = gridBoxY + gridBoxH + 20;

  // Documents Summary Table
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 10px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(
    lang === 'bn' ? 'সংযুক্ত নথিপত্র ও দলিলের বিবরণী' : 'ATTACHED SUBMISSION DOCUMENTS SUMMARY',
    52,
    y
  );
  y += 8;

  // Table header
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(52, y, widthPt - 104, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText('#', 58, y + 12);
  ctx.fillText(lang === 'bn' ? 'দলিলের শিরোনাম' : 'Document Description', 78, y + 12);
  ctx.fillText(lang === 'bn' ? 'মেয়াদ' : 'Validity / Expiry', 345, y + 12);
  ctx.fillText(lang === 'bn' ? 'পৃষ্ঠা' : 'Pages', 420, y + 12);
  ctx.fillText(lang === 'bn' ? 'শুরুর পৃষ্ঠা' : 'Start Page', 470, y + 12);

  y += 18;

  // Table rows
  ctx.font = '8px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  let totalDocPages = 0;

  includedDocs.forEach((doc, idx) => {
    totalDocPages += doc.pageCount;
    const isEven = idx % 2 === 0;
    ctx.fillStyle = isEven ? '#ffffff' : '#f8fafc';
    ctx.fillRect(52, y, widthPt - 104, 16);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(52, y, widthPt - 104, 16);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.fillText(String(doc.requirement.order), 58, y + 11);

    ctx.font = '500 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
    const docTitle = lang === 'bn' ? doc.requirement.title_bn : doc.requirement.title_en;
    const truncatedTitle = docTitle.length > 55 ? docTitle.slice(0, 52) + '...' : docTitle;
    ctx.fillText(truncatedTitle, 78, y + 11);

    ctx.font = '7px "JetBrains Mono", monospace';
    ctx.fillStyle = doc.expiryDate ? '#047857' : '#64748b';
    ctx.fillText(doc.expiryDate || 'N/A', 345, y + 11);

    ctx.fillStyle = '#0f172a';
    ctx.fillText(String(doc.pageCount), 425, y + 11);

    ctx.fillText(`P. ${doc.startPage}`, 475, y + 11);

    y += 16;
  });

  // Table total row
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(52, y, widthPt - 104, 18);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(52, y, widthPt - 104, 18);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 8px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(
    lang === 'bn' ? `সর্বমোট দলিল: ${includedDocs.length} টি` : `Total Included Documents: ${includedDocs.length}`,
    78,
    y + 12
  );
  ctx.font = 'bold 8px "JetBrains Mono", monospace';
  ctx.fillText(`${totalDocPages} pgs`, 420, y + 12);

  // Bottom Signature & Verification Area
  const sigBoxY = heightPt - 130;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(52, sigBoxY, widthPt - 104, 75);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(
    lang === 'bn' ? 'দরপত্রদাতা প্রতিষ্ঠানের ক্ষমতাপ্রাপ্ত প্রতিনিধির স্বাক্ষর ও সিল' : 'AUTHORIZED BIDDER SIGNATURE & OFFICIAL SEAL',
    62,
    sigBoxY + 16
  );

  // Signatory line
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 0.75;
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(widthPt - 220, sigBoxY + 50);
  ctx.lineTo(widthPt - 70, sigBoxY + 50);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#475569';
  ctx.font = '6.5px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Authorized Signature & Company Seal', widthPt - 145, sigBoxY + 62);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

/**
 * Render dynamic Index Page (Table of Contents) onto Canvas and return PNG data URL.
 */
function renderIndexPageCanvas(
  tender: TenderInfo,
  includedDocs: CompiledDocEntry[],
  totalFinalPages: number,
  widthPt: number,
  heightPt: number,
  lang: 'en' | 'bn'
): string {
  const { canvas, ctx } = createPageCanvas(widthPt, heightPt);

  // Outer framing
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, widthPt - 72, heightPt - 72);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(41, 41, widthPt - 82, heightPt - 82);

  // Index Page Header
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(44, 44, widthPt - 88, 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' ? 'দরপত্র নথিপত্রের সূচিপত্র (TABLE OF CONTENTS)' : 'TABLE OF CONTENTS & DOCUMENT INDEX',
    widthPt / 2,
    68
  );

  ctx.textAlign = 'left';

  // Subtitle banner
  let y = 100;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(52, y, widthPt - 104, 26);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(52, y, widthPt - 104, 26);

  ctx.fillStyle = '#334155';
  ctx.font = '600 8px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`TENDER REF: ${tender.tender_id} · TOTAL PACKAGE PAGES: ${totalFinalPages}`, 62, y + 16);

  y += 42;

  // Index Table Header
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(52, y, widthPt - 104, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(lang === 'bn' ? 'ক্রম' : 'Item', 62, y + 13);
  ctx.fillText(lang === 'bn' ? 'নথিপত্রের পূর্ণ বিবরণ ও শিরোনাম' : 'Document Title & Official Description', 95, y + 13);
  ctx.fillText(lang === 'bn' ? 'পৃষ্ঠা ব্যাপ্তি' : 'Page Range', 390, y + 13);
  ctx.fillText(lang === 'bn' ? 'শুরুর পৃষ্ঠা' : 'Start Page', 460, y + 13);

  y += 20;

  // Cover & Index built-in items
  const fixedSections = [
    { title: lang === 'bn' ? 'দরপত্র কভার পেজ ও তথ্য বিবরণী' : 'Tender Package Official Cover Page', start: 1, end: 1, pages: 1 },
    { title: lang === 'bn' ? 'দরপত্র সূচিপত্র ও পৃষ্ঠা নির্দেশিকা' : 'Tender Package Table of Contents (Index)', start: 2, end: 2, pages: 1 }
  ];

  fixedSections.forEach((sec, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(52, y, widthPt - 104, 20);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(52, y, widthPt - 104, 20);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';
    ctx.fillText(`0${idx + 1}`, 62, y + 13);

    ctx.fillStyle = '#0f172a';
    ctx.font = '600 8px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
    ctx.fillText(sec.title, 95, y + 13);

    ctx.font = '7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Page ${sec.start}`, 390, y + 13);
    ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`P. ${sec.start}`, 465, y + 13);

    y += 20;
  });

  // Attached Documents
  includedDocs.forEach((doc, idx) => {
    const isEven = idx % 2 === 0;
    ctx.fillStyle = isEven ? '#ffffff' : '#f8fafc';
    ctx.fillRect(52, y, widthPt - 104, 22);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(52, y, widthPt - 104, 22);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.fillText(String(doc.requirement.order), 62, y + 14);

    const docTitle = lang === 'bn' ? doc.requirement.title_bn : doc.requirement.title_en;
    ctx.font = '600 8px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
    const truncated = docTitle.length > 56 ? docTitle.slice(0, 53) + '...' : docTitle;
    ctx.fillText(truncated, 95, y + 14);

    // File source note
    ctx.font = '6.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    const cleanFileName = doc.file.name.length > 40 ? doc.file.name.slice(0, 37) + '...' : doc.file.name;
    ctx.fillText(`[${cleanFileName} · ${doc.pageCount} pgs]`, 95, y + 21);

    // Page range
    ctx.font = '7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Page ${doc.startPage} - ${doc.endPage}`, 390, y + 14);

    // Start Page highlight
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(`P. ${doc.startPage}`, 465, y + 14);

    y += 24;
  });

  // Bottom Notice
  y = Math.max(y + 20, heightPt - 95);
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(52, y, widthPt - 104, 30);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 0.75;
  ctx.strokeRect(52, y, widthPt - 104, 30);

  ctx.fillStyle = '#475569';
  ctx.font = '500 7.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
  ctx.fillText(
    lang === 'bn'
      ? 'দ্রষ্টব্য: এই সূচিপত্র ও কভার পেজ স্বয়ংক্রিয়ভাবে প্রতিটি সংযুক্ত দলিলের ক্রমানুসারে তৈরি করা হয়েছে।'
      : 'NOTE: All attached documents are certified copies assembled in strict accordance with tender specifications.',
    62,
    y + 18
  );

  return canvas.toDataURL('image/png');
}

/**
 * Main PDF Generation Engine
 */
export async function generateTenderPackage(
  tender: TenderInfo,
  requirements: RequirementItem[],
  matches: Record<string, string | undefined>,
  expiryDates: Record<string, string | undefined>,
  filesMap: Map<string, UploadedFileRecord>,
  sealConfig: SealConfig,
  lang: 'en' | 'bn',
  includeIndexPage = true,
  onProgress?: (msg: string, pct: number) => void
): Promise<Uint8Array> {
  onProgress?.('Initializing PDF Compiler...', 10);

  // 1. Filter and sort matched requirements
  const sortedReqs = [...requirements].sort((a, b) => a.order - b.order);
  const matchedDocs: { req: RequirementItem; file: UploadedFileRecord; expiry?: string }[] = [];

  for (const req of sortedReqs) {
    const fileId = matches[req.id];
    if (fileId && filesMap.has(fileId)) {
      matchedDocs.push({
        req,
        file: filesMap.get(fileId)!,
        expiry: expiryDates[req.id]
      });
    }
  }

  // Calculate dynamic starting and ending pages for each document
  // Cover Page is Page 1. If includeIndexPage is true, Index is Page 2 and docs start on Page 3.
  // Otherwise, docs start on Page 2 immediately after the cover page.
  let runningPageNumber = includeIndexPage ? 3 : 2;
  const compiledEntries: CompiledDocEntry[] = [];

  for (const item of matchedDocs) {
    const start = runningPageNumber;
    const end = runningPageNumber + item.file.pageCount - 1;
    compiledEntries.push({
      requirement: item.req,
      file: item.file,
      startPage: start,
      endPage: end,
      pageCount: item.file.pageCount,
      expiryDate: item.expiry
    });
    runningPageNumber = end + 1;
  }

  const totalFinalPages = runningPageNumber - 1; // Total pages in final combined document

  onProgress?.('Generating Official Cover Page...', 25);

  // Create final destination PDF document
  const finalPdf = await PDFDocument.create();

  // A4 dimensions in points (595.28 x 841.89 pt)
  const a4Width = 595.28;
  const a4Height = 841.89;

  // 2. Render Cover Page
  const coverPngUrl = renderCoverPageCanvas(tender, compiledEntries, a4Width, a4Height, lang);
  const coverPngBytes = await fetch(coverPngUrl).then(res => res.arrayBuffer());
  const coverImage = await finalPdf.embedPng(coverPngBytes);
  const coverPage = finalPdf.addPage([a4Width, a4Height]);
  coverPage.drawImage(coverImage, {
    x: 0,
    y: 0,
    width: a4Width,
    height: a4Height
  });

  // 3. Render Index Page if enabled
  if (includeIndexPage) {
    onProgress?.('Generating Index / Table of Contents...', 40);
    const indexPngUrl = renderIndexPageCanvas(tender, compiledEntries, totalFinalPages, a4Width, a4Height, lang);
    const indexPngBytes = await fetch(indexPngUrl).then(res => res.arrayBuffer());
    const indexImage = await finalPdf.embedPng(indexPngBytes);
    const indexPage = finalPdf.addPage([a4Width, a4Height]);
    indexPage.drawImage(indexImage, {
      x: 0,
      y: 0,
      width: a4Width,
      height: a4Height
    });
  }

  // 4. Append all matched documents in order
  let processedDocs = 0;
  for (const docEntry of compiledEntries) {
    processedDocs++;
    const progressPct = 40 + Math.round((processedDocs / compiledEntries.length) * 35);
    onProgress?.(`Appending document ${processedDocs} of ${compiledEntries.length}: ${docEntry.file.name}`, progressPct);

    // Load source document
    const sourcePdf = await PDFDocument.load(docEntry.file.data);
    const sourcePageIndices = sourcePdf.getPageIndices();
    const copiedPages = await finalPdf.copyPages(sourcePdf, sourcePageIndices);

    for (const page of copiedPages) {
      finalPdf.addPage(page);
    }
  }

  onProgress?.('Injecting Footer Pagination & Stamping Seal...', 80);

  // Embed standard font for footer text
  const fontHelvetica = await finalPdf.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await finalPdf.embedFont(StandardFonts.HelveticaBold);

  // Prepare seal image if enabled
  let embeddedSeal: any = null;
  if (sealConfig.enabled && sealConfig.imageDataUrl) {
    try {
      const sealBytes = await fetch(sealConfig.imageDataUrl).then(r => r.arrayBuffer());
      // Check if PNG or JPEG
      if (sealConfig.imageDataUrl.includes('image/jpeg') || sealConfig.imageDataUrl.includes('image/jpg')) {
        embeddedSeal = await finalPdf.embedJpg(sealBytes);
      } else {
        embeddedSeal = await finalPdf.embedPng(sealBytes);
      }
    } catch (e) {
      console.warn('Failed to embed seal image:', e);
    }
  }

  // Determine target pages for seal
  const sealTargetPages = new Set<number>();
  if (embeddedSeal) {
    if (sealConfig.targetPages === 'all') {
      for (let i = 1; i <= totalFinalPages; i++) sealTargetPages.add(i);
    } else if (sealConfig.targetPages === 'cover_only') {
      sealTargetPages.add(1);
    } else if (sealConfig.targetPages === 'doc_first_pages') {
      // First page of each attached document
      for (const entry of compiledEntries) {
        sealTargetPages.add(entry.startPage);
      }
    } else if (sealConfig.targetPages === 'all_except_cover') {
      for (let i = 2; i <= totalFinalPages; i++) sealTargetPages.add(i);
    } else if (sealConfig.targetPages === 'custom' && sealConfig.customPagesString) {
      // Parse custom page string e.g. "1, 3, 5-7"
      const parts = sealConfig.customPagesString.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [startStr, endStr] = trimmed.split('-');
          const startNum = parseInt(startStr, 10);
          const endNum = parseInt(endStr, 10);
          if (!isNaN(startNum) && !isNaN(endNum)) {
            for (let p = Math.max(1, startNum); p <= Math.min(totalFinalPages, endNum); p++) {
              sealTargetPages.add(p);
            }
          }
        } else {
          const num = parseInt(trimmed, 10);
          if (!isNaN(num) && num >= 1 && num <= totalFinalPages) {
            sealTargetPages.add(num);
          }
        }
      }
    }
  }

  // 5. Inject Footer Pagination onto every single page & Apply Seal
  const pages = finalPdf.getPages();
  const totalPagesCount = pages.length;

  for (let idx = 0; idx < totalPagesCount; idx++) {
    const page = pages[idx];
    const pageNum = idx + 1;
    const { width, height } = page.getSize();

    // -- Seal Overlay --
    if (embeddedSeal && sealTargetPages.has(pageNum)) {
      const sealW = sealConfig.width || 120;
      const sealH = sealConfig.height || 70;
      let sealX = width - sealW - 40;
      let sealY = 40;

      if (sealConfig.position === 'bottom-left') {
        sealX = 40;
        sealY = 40;
      } else if (sealConfig.position === 'bottom-center') {
        sealX = (width - sealW) / 2;
        sealY = 40;
      } else if (sealConfig.position === 'top-right') {
        sealX = width - sealW - 40;
        sealY = height - sealH - 40;
      }

      page.drawImage(embeddedSeal, {
        x: sealX,
        y: sealY,
        width: sealW,
        height: sealH,
        opacity: Math.min(1, Math.max(0.1, sealConfig.opacity || 0.85))
      });
    }

    // -- Footer Pagination --
    // Format strictly as required: <tender_id> | Page X of Y
    const footerText = `${tender.tender_id} | Page ${pageNum} of ${totalPagesCount}`;

    // Draw protective footer strip at bottom (height: 24pt)
    // Semi-opaque white background to prevent obscuring or colliding with original text
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height: 26,
      color: rgb(1, 1, 1),
      opacity: 0.94
    });

    // Subtle hairline top border for footer
    page.drawLine({
      start: { x: 30, y: 26 },
      end: { x: width - 30, y: 26 },
      thickness: 0.5,
      color: rgb(0.82, 0.85, 0.9)
    });

    // Measure text width to center it or align nicely
    const fontSize = 8.5;
    const textWidth = fontHelvetica.widthOfTextAtSize(footerText, fontSize);
    const textX = (width - textWidth) / 2;

    page.drawText(footerText, {
      x: textX,
      y: 9,
      size: fontSize,
      font: fontHelvetica,
      color: rgb(0.2, 0.25, 0.32)
    });
  }

  onProgress?.('Finalizing PDF package binary...', 95);

  const finalPdfBytes = await finalPdf.save();
  onProgress?.('Complete!', 100);
  return finalPdfBytes;
}
