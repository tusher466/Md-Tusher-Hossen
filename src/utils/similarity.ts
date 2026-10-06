import { RequirementItem, UploadedFileRecord } from '../types/tender';

// Tokenize and clean text
function tokenize(text: string): Set<string> {
  const cleaned = text
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9\u0980-\u09FF\s]/gi, ' ')
    .trim();
  const tokens = cleaned.split(/\s+/).filter(t => t.length > 1);
  return new Set(tokens);
}

// Compute Jaccard token similarity
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersection++;
    }
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// Key mapping synonyms for common procurement terms in Bangladesh & general tenders
const synonymGroups: string[][] = [
  ['trade', 'license', 'ট্রেড', 'লাইসেন্স', 'tl'],
  ['tin', 'tax', 'ট্যাক্স', 'আয়কর', 'returntin', 'income'],
  ['vat', 'bin', 'ভ্যাট', 'বিআইএন', 'vatbin', 'registration'],
  ['solvency', 'bank', 'ব্যাংক', 'সচ্ছলতা', 'credit', 'liquid'],
  ['experience', 'completion', 'অভিজ্ঞতা', 'work', 'similar', 'track'],
  ['technical', 'proposal', 'কারিগরি', 'tech'],
  ['financial', 'proposal', 'commercial', 'price', 'আর্থিক'],
  ['declaration', 'signed', 'undertaking', 'ঘোষণাপত্র', 'statement'],
  ['audited', 'financial', 'statement', 'নিরীক্ষিত', 'audit', 'ca'],
  ['manufacturer', 'authorization', 'maf', 'প্রস্তুতকারক', 'অনুমোদনপত্র', 'oem'],
  ['cv', 'personnel', 'key', 'manpower', 'জীবনবৃত্তান্ত', 'staff', 'engineer'],
  ['equipment', 'machinery', 'যন্ত্রপাতি', 'সরঞ্জাম', 'plant', 'tools'],
  ['affidavit', 'litigation', 'debarment', 'হলফনামা', 'এফিডেভিট', 'court', 'case'],
  ['submission', 'letter', 'form', 'pw3', 'দরপত্র', 'দাখিল', 'tenderform', 'tenderletter']
];

/**
 * Extract ISO date string (YYYY-MM-DD) from a filename if present.
 */
export function extractDateFromText(text: string): string | null {
  // Matches e.g. 2026-12-31, 2027-06-30, 2025_06_30
  const match = text.match(/\b(20\d\d)[-_/](0[1-9]|1[0-2])[-_/](0[1-9]|[12]\d|3[01])\b/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  // Matches year range like 2026_2027 -> standard fiscal year end is 2027-06-30
  const fiscalMatch = text.match(/202[0-9][-_](202[0-9])/);
  if (fiscalMatch) {
    return `${fiscalMatch[1]}-06-30`;
  }
  return null;
}

function synonymBoost(nameTokens: Set<string>, reqTokens: Set<string>): number {
  let matchedGroupCount = 0;
  for (const group of synonymGroups) {
    const hasName = group.some(word => nameTokens.has(word));
    const hasReq = group.some(word => reqTokens.has(word));
    if (hasName && hasReq) {
      matchedGroupCount++;
    }
  }
  return matchedGroupCount * 0.45;
}

export interface MatchSuggestion {
  requirementId: string;
  fileId: string;
  score: number;
}

/**
 * Auto-match unassigned files to requirements based on similarity.
 * Returns 1-to-1 matching recommendations.
 */
export function calculateBestMatches(
  requirements: RequirementItem[],
  files: UploadedFileRecord[],
  existingMatches: Record<string, string | undefined>
): MatchSuggestion[] {
  // Available files (not duplicate, not corrupt)
  const availableFiles = files.filter(f => !f.isCorrupt && !f.isDuplicate);

  // Score matrix between each requirement and each file
  const candidateScores: { reqId: string; fileId: string; score: number }[] = [];

  for (const req of requirements) {
    const reqTokensEn = tokenize(req.title_en);
    const reqTokensBn = tokenize(req.title_bn);
    const combinedReqTokens = new Set([...reqTokensEn, ...reqTokensBn]);

    // Add order number hint if file name starts with numbers like "1_", "02.", "2-trade"
    const orderStr = String(req.order);
    const paddedOrderStr = req.order < 10 ? `0${req.order}` : `${req.order}`;

    for (const file of availableFiles) {
      const fileTokens = tokenize(file.name);
      const rawFileNameLower = file.name.toLowerCase();

      let score = jaccardSimilarity(fileTokens, combinedReqTokens);
      score += synonymBoost(fileTokens, combinedReqTokens);

      // Number prefix check (e.g., "1_tender_form.pdf" or "02_trade.pdf")
      if (
        rawFileNameLower.startsWith(`${orderStr}_`) ||
        rawFileNameLower.startsWith(`${orderStr}-`) ||
        rawFileNameLower.startsWith(`${orderStr}.`) ||
        rawFileNameLower.startsWith(`${paddedOrderStr}_`) ||
        rawFileNameLower.startsWith(`${paddedOrderStr}-`)
      ) {
        score += 0.5;
      }

      // Check substring matches
      for (const token of fileTokens) {
        if (token.length >= 3) {
          if (req.title_en.toLowerCase().includes(token) || req.title_bn.includes(token)) {
            score += 0.2;
          }
        }
      }

      if (score > 0.15) {
        candidateScores.push({ reqId: req.id, fileId: file.id, score });
      }
    }
  }

  // Sort descending by score
  candidateScores.sort((a, b) => b.score - a.score);

  // Greedy 1-to-1 matching
  const assignedReqs = new Set<string>();
  const assignedFiles = new Set<string>();
  const suggestions: MatchSuggestion[] = [];

  for (const candidate of candidateScores) {
    if (!assignedReqs.has(candidate.reqId) && !assignedFiles.has(candidate.fileId)) {
      assignedReqs.add(candidate.reqId);
      assignedFiles.add(candidate.fileId);
      suggestions.push({
        requirementId: candidate.reqId,
        fileId: candidate.fileId,
        score: candidate.score
      });
    }
  }

  return suggestions;
}
