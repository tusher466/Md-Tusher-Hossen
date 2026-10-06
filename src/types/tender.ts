export interface TenderInfo {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  submission_deadline: string; // YYYY-MM-DD
}

export interface RequirementItem {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
  description_en?: string;
  description_bn?: string;
}

export interface RequirementsData {
  tender: TenderInfo;
  requirements: RequirementItem[];
}

export interface UploadedFileRecord {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  hash: string;
  data: Uint8Array;
  blobUrl: string;
  isDuplicate?: boolean;
  duplicateOfName?: string;
  isCorrupt?: boolean;
  errorMessage?: string;
}

export type RequirementStatusType =
  | 'MISSING'          // mandatory: true && no file (Blocking)
  | 'EXPIRY_NEEDED'    // has_expiry: true && file matched && !expiryDate (Blocking)
  | 'EXPIRED'          // expiryDate < submission_deadline (Blocking)
  | 'NOT_PROVIDED'     // mandatory: false && no file (Non-blocking)
  | 'OK';              // matched && valid (Non-blocking)

export interface RequirementMatchState {
  requirementId: string;
  matchedFileId?: string;
  expiryDate?: string;
}

export interface SealConfig {
  enabled: boolean;
  imageDataUrl?: string;
  fileName?: string;
  targetPages: 'all' | 'cover_only' | 'doc_first_pages' | 'all_except_cover' | 'custom';
  customPagesString?: string;
  position: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right';
  width: number;
  height: number;
  opacity: number;
}

export interface ProjectSaveState {
  version: string;
  savedAt: string;
  tender: TenderInfo;
  requirements: RequirementItem[];
  matches: Record<string, { matchedFileName?: string; expiryDate?: string }>;
  sealConfig: SealConfig;
}
