# Tender Document Package Builder

A client-side web application for office and procurement staff to upload, validate, match, and compile tender submission PDF packages strictly within Google Chrome—without any backend server, cloud database, or third-party document processing API.

---

## 🎯 Main Concept

Submitting public procurement bids requires assembling multiple separate PDF certificates and proposals in a strict sequence, verifying validity dates, numbering every page uniformly, and attaching official cover pages. 

The **Tender Document Package Builder** runs 100% locally in the user's browser to:
1. **Load Tender Specifications**: Ingest and edit `requirements.json` containing procurement metadata (`tender_id`, procuring entity, bidder, submission deadline) and ordered document criteria.
2. **Process & Verify Uploads**: Accept up to 30 PDFs (max 50 MB), calculate page counts, and run native SHA-256 cryptographic hashing to flag exact content duplicates and detect corrupted/encrypted files.
3. **1-to-1 Document Matching**: Map uploaded files to required items via drag-and-drop or dropdowns, aided by smart string similarity auto-matching and automated filename expiry date extraction.
4. **Enforce Validation Rules**: Dynamically block package generation if mandatory documents are missing, files are corrupt/duplicate, or document expiration occurs before the submission deadline.
5. **Assemble the Submission Package**: Compile `<tender_id>_Package.pdf` with:
   - **Page 1**: Official Cover Page listing tender parameters and included documents.
   - **Page 2**: Table of Contents / Index with accurate document starting pages.
   - **Appended Documents**: Merged in specification sequence with all original pages intact.
   - **Global Footer**: `<tender_id> | Page X of Y` pagination across all pages.
   - **Seal Overlay**: Optional company seal/signature stamp placement.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (White & Light Leaf Green theme)
- **PDF Assembly & Manipulation**: `pdf-lib` + `@pdf-lib/fontkit`
- **PDF Previews & Rendering**: `pdfjs-dist` + HTML5 Canvas
- **Security & Duplication**: Browser Web Crypto API (SubtleCrypto SHA-256)
- **Internationalization**: Bilingual English / Bangla (বাংলা)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```
