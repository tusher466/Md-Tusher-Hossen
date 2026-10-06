import { RequirementItem, UploadedFileRecord, RequirementStatusType, ProjectSaveState, TenderInfo, SealConfig } from '../types/tender';

export interface ChecklistExportRow {
  order: number;
  title: string;
  mandatory: string;
  fileName: string;
  pageCount: string;
  expiryDate: string;
  status: string;
}

export function exportChecklistToCSV(
  requirements: RequirementItem[],
  matches: Record<string, string | undefined>,
  expiryDates: Record<string, string | undefined>,
  filesMap: Map<string, UploadedFileRecord>,
  statusMap: Map<string, RequirementStatusType>,
  tenderId: string,
  lang: 'en' | 'bn'
) {
  const headers = ['Order', 'Document Title', 'Mandatory', 'File Name', 'Page Count', 'Expiry Date', 'Status'];

  const rows: string[][] = [headers];

  const sortedReqs = [...requirements].sort((a, b) => a.order - b.order);

  for (const req of sortedReqs) {
    const fileId = matches[req.id];
    const file = fileId ? filesMap.get(fileId) : undefined;
    const expiry = expiryDates[req.id] || 'N/A';
    const status = statusMap.get(req.id) || 'MISSING';
    const title = lang === 'bn' ? req.title_bn : req.title_en;

    rows.push([
      String(req.order),
      `"${title.replace(/"/g, '""')}"`,
      req.mandatory ? 'Yes' : 'No',
      file ? `"${file.name.replace(/"/g, '""')}"` : 'None',
      file ? String(file.pageCount) : '0',
      expiry,
      status
    ]);
  }

  const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanTenderId = tenderId.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('download', `${cleanTenderId}_Checklist.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportProjectToFile(
  tender: TenderInfo,
  requirements: RequirementItem[],
  matches: Record<string, string | undefined>,
  expiryDates: Record<string, string | undefined>,
  filesMap: Map<string, UploadedFileRecord>,
  sealConfig: SealConfig
) {
  const matchesData: Record<string, { matchedFileName?: string; expiryDate?: string }> = {};

  for (const req of requirements) {
    const fileId = matches[req.id];
    const file = fileId ? filesMap.get(fileId) : undefined;
    matchesData[req.id] = {
      matchedFileName: file?.name,
      expiryDate: expiryDates[req.id]
    };
  }

  const projectState: ProjectSaveState = {
    version: '1.0.0',
    savedAt: new Date().toISOString(),
    tender,
    requirements,
    matches: matchesData,
    sealConfig
  };

  const jsonContent = JSON.stringify(projectState, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanTenderId = tender.tender_id.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('download', `${cleanTenderId}_TenderProject.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
