import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface SampleDocDef {
  fileName: string;
  title: string;
  subtitle: string;
  pages: number;
  content: string[];
}

export const SAMPLE_DOCS: SampleDocDef[] = [
  {
    fileName: '1_Tender_Submission_Letter_Form_PW3.pdf',
    title: 'TENDER SUBMISSION LETTER (FORM PW3-1)',
    subtitle: 'Ref: WD-04/RHD/2026 - Meghna Bridge Weighbridge Facility',
    pages: 2,
    content: [
      'To: The Project Director, Roads and Highways Department, Sarak Bhaban, Tejgaon, Dhaka.',
      'We, the undersigned, declare that having examined the Tender Document and Addenda, we offer to execute the Works in conformity with the Conditions of Contract, Specifications, Drawings and Bill of Quantities.',
      'Our Tender Price is unconditional and firm for the specified validity period of 120 days from the deadline for submission.',
      'We confirm that we are eligible and qualified under the Public Procurement Act and Rules of Bangladesh.',
      'Authorized Signatory: Md. Rafiqul Islam, Managing Director, Apex Infrastructure & Engineering Consortium Ltd.'
    ]
  },
  {
    fileName: '2_Valid_Trade_License_2026.pdf',
    title: 'GOVERNMENT OF THE PEOPLE\'S REPUBLIC OF BANGLADESH - TRADE LICENSE',
    subtitle: 'Dhaka North City Corporation (Zone-03) · Issue No: TL-2025-884192',
    pages: 1,
    content: [
      'Business Name: Apex Infrastructure & Engineering Consortium Ltd.',
      'Nature of Business: Civil Engineering Contractor, Bridge & Highway Construction, Heavy Infrastructure Works',
      'Business Address: Plot 14, Mohakhali Commercial Area, Dhaka-1212',
      'Fiscal Year: 2025-2026 (Valid through 30 June 2027)',
      'Authorized Officer: Chief Revenue Officer, Dhaka North City Corporation.'
    ]
  },
  {
    fileName: '3_TIN_Certificate_and_Tax_Return_Receipt.pdf',
    title: 'NATIONAL BOARD OF REVENUE - TAXPAYER\'S IDENTIFICATION NUMBER (TIN)',
    subtitle: 'E-TIN: 8192-4412-0931 / Circle-114 (Companies), Taxes Zone-06, Dhaka',
    pages: 2,
    content: [
      'This is to certify that Apex Infrastructure & Engineering Consortium Ltd. is a registered taxpayer of Circle-114.',
      'Income Year: 2024-2025 · Assessment Year: 2025-2026',
      'Return Acknowledgment Receipt Number: TAX-ACK-2025-77192410',
      'Status: Fully compliant, no outstanding tax liability.',
      'Deputy Commissioner of Taxes, Circle-114, Taxes Zone-06.'
    ]
  },
  {
    fileName: '4_Central_VAT_BIN_Registration_Certificate.pdf',
    title: 'NATIONAL BOARD OF REVENUE - VALUE ADDED TAX (VAT) REGISTRATION',
    subtitle: 'Central BIN: 002914820-0101 · Form Mushak-2.3',
    pages: 1,
    content: [
      'Name of Entity: Apex Infrastructure & Engineering Consortium Ltd.',
      'Registration Type: Central Registration (Large Taxpayers Unit - VAT)',
      'Operational Sector: Construction, Structural Works & Heavy Engineering Services',
      'Date of Issue: 12 March 2018 · Status: Active and in good standing',
      'Director General, LTU-VAT, National Board of Revenue, Dhaka.'
    ]
  },
  {
    fileName: '5_Bank_Solvency_Certificate_and_Credit_Facility.pdf',
    title: 'EASTERN COMMERCIAL BANK PLC - BANK SOLVENCY & LIQUID ASSET COMMITMENT',
    subtitle: 'Principal Branch, Dilkusha C/A, Dhaka · Ref: ECB/PB/CR/2026/4102',
    pages: 2,
    content: [
      'To Whom It May Concern:',
      'This is to certify that Apex Infrastructure & Engineering Consortium Ltd. maintains Current Account No. 1042-881920 with our Principal Branch.',
      'The company enjoys an approved Revolving Credit & Working Capital facility of BDT 150,000,000 (One Hundred Fifty Million Taka).',
      'As of current date, liquid assets and uncommitted line of credit exceeding BDT 45,000,000 are available for tender WD-04/RHD/2026.',
      'Valid through: 31 December 2026.',
      'Senior Executive Vice President & Head of Corporate Banking Division.'
    ]
  },
  {
    fileName: '6_Specific_Civil_Infrastructure_Experience_Certificate.pdf',
    title: 'PROJECT COMPLETION CERTIFICATE - CIVIL HIGHWAY INFRASTRUCTURE',
    subtitle: 'Dhaka-Chittagong Expressway Widening Project · Package WP-03',
    pages: 3,
    content: [
      'Client: Roads and Highways Department (RHD), Government of Bangladesh',
      'Contractor: Apex Infrastructure & Engineering Consortium Ltd.',
      'Scope of Work: Construction of 4-lane rigid pavement, reinforced concrete approach structures, and weigh station bays.',
      'Contract Value: BDT 342,800,000 · Completion Date: 14 October 2024',
      'Performance Assessment: Works completed ahead of schedule to full engineering specification and QA standards.',
      'Executive Engineer, RHD Highway Division.'
    ]
  },
  {
    fileName: '7_Key_Personnel_CV_and_Professional_Certificates.pdf',
    title: 'CURRICULUM VITAE (CV) FOR KEY PROFESSIONAL STAFF',
    subtitle: 'Project Manager & Quality Assurance Lead Personnel',
    pages: 4,
    content: [
      '1. Proposed Position: Project Manager',
      'Name: Engr. M. Tariqul Anam, FIEB · Education: B.Sc. Civil Engineering (BUET), M.Sc. Structural Eng.',
      'Professional Experience: 18 years in major highway and bridge projects.',
      '2. Proposed Position: QA/QC Materials Engineer',
      'Name: Engr. Shamima Akhter · Education: B.Sc. Civil & Environmental Eng. (RUET)',
      'Professional Experience: 11 years in concrete testing, soil mechanics, and nondestructive pavement testing.',
      'All listed personnel have certified their availability for the complete contract duration.'
    ]
  }
];

/**
 * Creates genuine PDF files using pdf-lib in the browser memory.
 */
export async function generateSamplePdfs(): Promise<File[]> {
  const generatedFiles: File[] = [];

  for (const docDef of SAMPLE_DOCS) {
    const pdfDoc = await PDFDocument.create();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let p = 1; p <= docDef.pages; p++) {
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait in points (210mm x 297mm)
      const { width, height } = page.getSize();

      // Draw top header band
      page.drawRectangle({
        x: 36,
        y: height - 60,
        width: width - 72,
        height: 3,
        color: rgb(0.1, 0.2, 0.35)
      });

      // Page Title
      page.drawText(docDef.title, {
        x: 40,
        y: height - 85,
        size: 13,
        font: helveticaBold,
        color: rgb(0.08, 0.15, 0.28)
      });

      // Subtitle
      page.drawText(docDef.subtitle, {
        x: 40,
        y: height - 105,
        size: 9,
        font: helvetica,
        color: rgb(0.4, 0.45, 0.5)
      });

      // Internal page tag
      page.drawText(`Document Page ${p} of ${docDef.pages}`, {
        x: width - 170,
        y: height - 85,
        size: 9,
        font: helveticaBold,
        color: rgb(0.3, 0.35, 0.4)
      });

      // Subtle horizontal rule
      page.drawLine({
        start: { x: 40, y: height - 120 },
        end: { x: width - 40, y: height - 120 },
        thickness: 0.75,
        color: rgb(0.85, 0.88, 0.92)
      });

      // Content paragraphs
      let currentY = height - 150;
      for (let i = 0; i < docDef.content.length; i++) {
        const text = docDef.content[i];
        const isHeader = i === 0 || text.startsWith('Authorized') || text.startsWith('To:');
        
        // Wrap long text simply
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word;
          if (testLine.length > 75) {
            page.drawText(line, {
              x: 45,
              y: currentY,
              size: isHeader ? 10.5 : 9.5,
              font: isHeader ? helveticaBold : helvetica,
              color: rgb(0.15, 0.18, 0.22)
            });
            currentY -= 16;
            line = word;
          } else {
            line = testLine;
          }
        }
        if (line) {
          page.drawText(line, {
            x: 45,
            y: currentY,
            size: isHeader ? 10.5 : 9.5,
            font: isHeader ? helveticaBold : helvetica,
            color: rgb(0.15, 0.18, 0.22)
          });
          currentY -= 22;
        }

        if (currentY < 120) break;
      }

      // Decorative official verification stamp box on the last page
      if (p === docDef.pages) {
        page.drawRectangle({
          x: width - 210,
          y: 70,
          width: 170,
          height: 60,
          borderColor: rgb(0.65, 0.7, 0.75),
          borderWidth: 1,
          color: rgb(0.98, 0.99, 1.0)
        });

        page.drawText('VERIFIED TENDER ATTACHMENT', {
          x: width - 200,
          y: 115,
          size: 7.5,
          font: helveticaBold,
          color: rgb(0.2, 0.4, 0.6)
        });
        page.drawText('Official Signatory Seal', {
          x: width - 200,
          y: 100,
          size: 7,
          font: helvetica,
          color: rgb(0.45, 0.5, 0.55)
        });
        page.drawText('Date: 2026-10-06 · Apex Consortium', {
          x: width - 200,
          y: 82,
          size: 6.5,
          font: helvetica,
          color: rgb(0.45, 0.5, 0.55)
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    const file = new File([pdfBytes as unknown as BlobPart], docDef.fileName, { type: 'application/pdf' });
    generatedFiles.push(file);
  }

  return generatedFiles;
}
