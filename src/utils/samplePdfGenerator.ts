import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface SampleDocDef {
  fileName: string;
  title: string;
  subtitle: string;
  pages: number;
  content: string[];
  suggestedExpiry?: string;
  headerBarColor?: [number, number, number];
  isDuplicateOf?: string; // for testing content-based duplicate detection
}

export const SAMPLE_DOCS: SampleDocDef[] = [
  {
    fileName: 'Trade_License_Valid_2026_2027.pdf',
    title: 'SAMPLE CITY CORPORATION - TRADE LICENSE',
    subtitle: 'Fiscal Year 2026-2027 · License No: TL-2026-118734',
    pages: 1,
    suggestedExpiry: '2027-06-30',
    headerBarColor: [0.1, 0.35, 0.45],
    content: [
      'Business Name: Meghna Tech Solutions Ltd.',
      'Business Address: House 12, Road 5, Sample Town, Dhaka',
      'Nature of Business: IT equipment supply and software services',
      'Owner / Director: Mr. Rafiq Hasan',
      'Date of Issue: 2026-07-01',
      'VALID UNTIL (EXPIRY DATE): 30 June 2027 (2027-06-30)',
      'This license is issued under the trade license rules of Sample City Corporation.',
      'Licensing Officer, Sample City Corporation.'
    ]
  },
  {
    fileName: 'Trade_License_Expired_2024_2025.pdf',
    title: 'SAMPLE CITY CORPORATION - TRADE LICENSE (EXPIRED SAMPLE)',
    subtitle: 'Fiscal Year 2024-2025 · License No: TL-2024-118734',
    pages: 1,
    suggestedExpiry: '2025-06-30',
    headerBarColor: [0.65, 0.2, 0.2],
    content: [
      'Business Name: Meghna Tech Solutions Ltd.',
      'Business Address: House 12, Road 5, Sample Town, Dhaka',
      'Nature of Business: IT equipment supply and software services',
      'Owner / Director: Mr. Rafiq Hasan',
      'Date of Issue: 2024-07-01',
      'VALID UNTIL (EXPIRY DATE): 30 June 2025 (2025-06-30)',
      'NOTICE: This document is expired and serves as a test case for expiration validation.'
    ]
  },
  {
    fileName: 'TIN_Certificate.pdf',
    title: 'SAMPLE REVENUE BOARD - TIN CERTIFICATE',
    subtitle: 'Circle 21, Zone 4 (Sample) · TIN: 1234-5678-9012',
    pages: 1,
    headerBarColor: [0.15, 0.25, 0.4],
    content: [
      'TIN: 1234-5678-9012',
      'Taxpayer Name: Meghna Tech Solutions Ltd.',
      'Taxpayer Status: Company',
      'Registered Address: House 12, Road 5, Sample Town, Dhaka',
      'Date of Issue: 2019-03-14',
      'This certificate confirms the Taxpayer Identification Number of the company named above. It does not have an expiry date.',
      'Deputy Commissioner of Taxes, Sample Revenue Board.'
    ]
  },
  {
    fileName: 'VAT_Registration_Certificate.pdf',
    title: 'SAMPLE REVENUE BOARD - VAT REGISTRATION CERTIFICATE',
    subtitle: 'Central Business ID (BIN): 000123456-0101',
    pages: 1,
    headerBarColor: [0.15, 0.25, 0.4],
    content: [
      'Business ID (BIN): 000123456-0101',
      'Name of Entity: Meghna Tech Solutions Ltd.',
      'Address: House 12, Road 5, Sample Town, Dhaka',
      'Type of Activity: Supply, Service',
      'Effective Date: 2019-04-01',
      'The entity named above is registered for Value Added Tax. This registration remains in force until it is cancelled. It does not have an expiry date.',
      'Assistant Commissioner, Sample Revenue Board.'
    ]
  },
  {
    fileName: 'Bank_Solvency_Certificate.pdf',
    title: 'SAMPLE COMMERCIAL BANK PLC - BANK SOLVENCY CERTIFICATE',
    subtitle: 'Sample Town Branch · Ref: SCB/STB/SOL/2026/0981 · Date: 2026-09-01',
    pages: 1,
    suggestedExpiry: '2026-12-31',
    headerBarColor: [0.1, 0.45, 0.25],
    content: [
      'This is to certify that Meghna Tech Solutions Ltd., House 12, Road 5, Sample Town, Dhaka, maintains Current Account No. 0000-000-0000 with our branch.',
      'To the best of our knowledge, the company is financially solvent and able to meet commitments up to BDT 5,00,00,000 (Five Crore Taka).',
      'This certificate is issued at the request of the account holder for tender purposes, without any risk or responsibility on the part of the bank or its officers.',
      'VALID UNTIL (EXPIRY DATE): 31 December 2026 (2026-12-31)',
      'Branch Manager, Sample Commercial Bank PLC.'
    ]
  },
  {
    fileName: 'Experience_Certificate.pdf',
    title: 'SAMPLE UNIVERSITY - EXPERIENCE CERTIFICATE',
    subtitle: 'Office of the Registrar · Ref: SU/REG/EXP/2026/044 · Date: 2026-05-12',
    pages: 2,
    headerBarColor: [0.35, 0.15, 0.45],
    content: [
      'This is to certify that Meghna Tech Solutions Ltd. successfully completed the following contract for Sample University. The work was completed on time and to our full satisfaction.',
      'Contract Name: Supply and Installation of Computer Lab Equipment',
      'Contract No: SU/PROC/2025/112 · Contract Value: BDT 2,35,40,000',
      'Start Date: 2025-08-01 · Completion Date: 2026-01-31',
      'Supplied items include: Desktop computers (120 units), Laser printers (10 units), Network switches (8 units), Online UPS (120 units), Interactive displays (4 units).',
      'Registrar, Sample University.'
    ]
  },
  {
    fileName: 'Technical_Proposal.pdf',
    title: 'MEGHNA TECH SOLUTIONS LTD. - TECHNICAL PROPOSAL',
    subtitle: 'Tender T-2026-0417: Supply of IT Equipment · Directorate of Sample Services',
    pages: 6,
    headerBarColor: [0.15, 0.2, 0.35],
    content: [
      '1. Cover Letter: To The Director, Directorate of Sample Services. Meghna Tech Solutions Ltd. is pleased to submit this technical proposal.',
      '2. Scope of Supply: Supply, delivery, installation, testing and commissioning of 60 desktop computers, 25 laptops, 8 printers, 60 UPS, 4 managed switches.',
      '3. Technical Compliance: All offered items meet or exceed required specifications (Core i7 13th gen, 16GB DDR5, 512GB NVMe SSD, 3-year warranty).',
      '4. Delivery Schedule: Completed within 45 days of signing contract.',
      '5. Warranty and After-Sales Support: 3-year on-site warranty with 24-hour response time.',
      '6. Project Team: Project Manager Ms. Nadia Karim (12 yrs exp), Lead Engineer Mr. Tanvir Ahmed (9 yrs exp).',
      'Rafiq Hasan, Managing Director, Meghna Tech Solutions Ltd.'
    ]
  },
  {
    fileName: 'Financial_Proposal.pdf',
    title: 'MEGHNA TECH SOLUTIONS LTD. - FINANCIAL PROPOSAL',
    subtitle: 'Price Schedule & Payment Terms · Tender T-2026-0417',
    pages: 2,
    headerBarColor: [0.15, 0.2, 0.35],
    content: [
      'Price Schedule: All prices in BDT including VAT, taxes, delivery and installation.',
      'Lot 1: Desktop computer (60 units @ 1,15,000 = 69,00,000)',
      'Lot 2: Laptop computer (25 units @ 1,30,000 = 32,50,000)',
      'Lot 3: Network laser printer (8 units @ 65,000 = 5,20,000)',
      'Lot 4: Online UPS, 1 kVA (60 units @ 18,000 = 10,80,000)',
      'Lot 5: Managed switch (4 units @ 95,000 = 3,80,000)',
      'Grand total: BDT 1,21,30,000 (One Crore Twenty-One Lakh Thirty Thousand Taka only).',
      'Payment: 80% after delivery and installation, 20% after acceptance testing. Validity: 120 days.',
      'Rafiq Hasan, Managing Director, Meghna Tech Solutions Ltd.'
    ]
  },
  {
    fileName: 'Signed_Declaration.pdf',
    title: 'MEGHNA TECH SOLUTIONS LTD. - DECLARATION',
    subtitle: 'Tender T-2026-0417 - Supply of IT Equipment · Date: 2026-10-15',
    pages: 1,
    headerBarColor: [0.15, 0.2, 0.35],
    content: [
      'We, the undersigned, declare that:',
      '1. All information and documents in this bid are true and correct.',
      '2. The company is not barred from taking part in public procurement.',
      '3. We have not offered any gift or payment to influence this tender.',
      '4. We accept all terms and conditions of the tender documents.',
      'Date: 2026-10-15',
      'Rafiq Hasan, Managing Director, Meghna Tech Solutions Ltd.',
      '[OFFICIAL SEAL APPLIED: MEGHNA TECH SEAL]'
    ]
  }
];

/**
 * Creates genuine PDF files using pdf-lib in the browser memory matching the contest documents.
 */
export async function generateSamplePdfs(): Promise<File[]> {
  const generatedFiles: File[] = [];

  for (const docDef of SAMPLE_DOCS) {
    const pdfDoc = await PDFDocument.create();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const barColor = docDef.headerBarColor || [0.1, 0.2, 0.35];

    for (let p = 1; p <= docDef.pages; p++) {
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
      const { width, height } = page.getSize();

      // Top color banner
      page.drawRectangle({
        x: 36,
        y: height - 50,
        width: width - 72,
        height: 28,
        color: rgb(barColor[0], barColor[1], barColor[2])
      });

      page.drawText('SAMPLE DOCUMENT - FICTIONAL DATA - FOR AI DEVFEST CONTEST USE ONLY', {
        x: 44,
        y: height - 42,
        size: 7,
        font: helveticaBold,
        color: rgb(1, 1, 1)
      });

      // Internal page tag
      page.drawText(`Page ${p} of ${docDef.pages}`, {
        x: width - 110,
        y: height - 42,
        size: 7,
        font: helveticaBold,
        color: rgb(1, 1, 1)
      });

      // Document Title
      page.drawText(docDef.title, {
        x: 40,
        y: height - 85,
        size: 11,
        font: helveticaBold,
        color: rgb(0.08, 0.15, 0.28)
      });

      // Subtitle
      page.drawText(docDef.subtitle, {
        x: 40,
        y: height - 102,
        size: 8.5,
        font: helvetica,
        color: rgb(0.35, 0.4, 0.48)
      });

      // Hairline rule
      page.drawLine({
        start: { x: 40, y: height - 115 },
        end: { x: width - 40, y: height - 115 },
        thickness: 0.75,
        color: rgb(0.85, 0.88, 0.92)
      });

      // Content paragraphs
      let currentY = height - 145;
      for (let i = 0; i < docDef.content.length; i++) {
        const text = docDef.content[i];
        const isHeader = i === 0 || text.startsWith('VALID UNTIL') || text.startsWith('Grand total') || text.startsWith('Rafiq');
        
        // Wrap text
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word;
          if (testLine.length > 75) {
            page.drawText(line, {
              x: 45,
              y: currentY,
              size: isHeader ? 9.5 : 8.5,
              font: isHeader ? helveticaBold : helvetica,
              color: text.startsWith('VALID UNTIL') ? rgb(0.1, 0.5, 0.2) : rgb(0.15, 0.18, 0.22)
            });
            currentY -= 15;
            line = word;
          } else {
            line = testLine;
          }
        }
        if (line) {
          page.drawText(line, {
            x: 45,
            y: currentY,
            size: isHeader ? 9.5 : 8.5,
            font: isHeader ? helveticaBold : helvetica,
            color: text.startsWith('VALID UNTIL') ? rgb(0.1, 0.5, 0.2) : rgb(0.15, 0.18, 0.22)
          });
          currentY -= 20;
        }

        if (currentY < 120) break;
      }

      // Official signatory stamp representation on last page
      if (p === docDef.pages) {
        page.drawRectangle({
          x: width - 210,
          y: 65,
          width: 170,
          height: 60,
          borderColor: rgb(0.2, 0.35, 0.6),
          borderWidth: 1,
          color: rgb(0.97, 0.98, 1.0)
        });

        page.drawText('MEGHNA TECH SOLUTIONS LTD.', {
          x: width - 200,
          y: 108,
          size: 7.5,
          font: helveticaBold,
          color: rgb(0.1, 0.25, 0.5)
        });
        page.drawText('Authorized Signatory & Seal', {
          x: width - 200,
          y: 95,
          size: 7,
          font: helvetica,
          color: rgb(0.4, 0.45, 0.5)
        });
        page.drawText('Rafiq Hasan, Managing Director', {
          x: width - 200,
          y: 78,
          size: 6.5,
          font: helveticaBold,
          color: rgb(0.2, 0.25, 0.3)
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const file = new File([pdfBytes as unknown as BlobPart], docDef.fileName, { type: 'application/pdf' });
    generatedFiles.push(file);
  }

  // Also add 1 duplicate file to explicitly test and demonstrate Duplicate Detection!
  // Same content as Trade_License_Valid_2026_2027.pdf but renamed to "Trade_License_Duplicate_Copy.pdf"
  const firstDoc = generatedFiles[0];
  if (firstDoc) {
    const duplicateFile = new File([firstDoc], 'Trade_License_Duplicate_Copy.pdf', { type: 'application/pdf' });
    generatedFiles.push(duplicateFile);
  }

  return generatedFiles;
}
