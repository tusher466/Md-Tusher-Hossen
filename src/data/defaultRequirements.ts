import { RequirementsData } from '../types/tender';

export const defaultRequirementsData: RequirementsData = {
  tender: {
    tender_id: "WD-04/RHD/2026",
    title: "Procurement of Civil Works & Intelligent Weighbridge Inspection Facilities at Meghna Bridge Approach",
    procuring_entity: "Roads and Highways Department (RHD), Ministry of Road Transport and Bridges",
    bidder: "Apex Infrastructure & Engineering Consortium Ltd.",
    submission_deadline: "2026-11-15"
  },
  requirements: [
    {
      id: "req-1",
      order: 1,
      title_en: "Tender Submission Letter & Form PW3-1",
      title_bn: "দরপত্র দাখিল পত্র ও নির্ধারিত ফরম (PW3-1)",
      mandatory: true,
      has_expiry: false,
      description_en: "Duly signed and stamped Tender Submission Letter by the authorized representative",
      description_bn: "ক্ষমতাপ্রাপ্ত প্রতিনিধি কর্তৃক যথাযথ স্বাক্ষরিত ও সিলযুক্ত দরপত্র দাখিল পত্র"
    },
    {
      id: "req-2",
      order: 2,
      title_en: "Valid Trade License (Current Fiscal Year)",
      title_bn: "হালনাগাদ ট্রেড লাইসেন্স (চলতি অর্থবছর)",
      mandatory: true,
      has_expiry: true,
      description_en: "Trade License renewed for current fiscal year from City Corporation or Municipality",
      description_bn: "সংশ্লিষ্ট সিটি কর্পোরেশন বা পৌরসভা থেকে চলতি অর্থবছরের হালনাগাদ লাইসেন্স"
    },
    {
      id: "req-3",
      order: 3,
      title_en: "Tax Identification Number (TIN) & Income Tax Certificate",
      title_bn: "ট্যাক্স আইডেন্টিফিকেশন নম্বর (TIN) ও আয়কর রিটার্ন প্রাপ্তি স্বীকার",
      mandatory: true,
      has_expiry: false,
      description_en: "TIN Certificate along with acknowledgment receipt of the latest assessment year",
      description_bn: "টিআইএন সনদ এবং সর্বশেষ কর বর্ষের আয়কর দাখিলের স্বীকৃতি স্লিপ"
    },
    {
      id: "req-4",
      order: 4,
      title_en: "VAT / Business Identification Number (BIN) Certificate",
      title_bn: "ভ্যাট / বিআইএন নিবন্ধন সনদপত্র (১৩ ডিজিট)",
      mandatory: true,
      has_expiry: false,
      description_en: "13-digit Central Value Added Tax registration certificate from NBR",
      description_bn: "জাতীয় রাজস্ব বোর্ড (এনবিআর) কর্তৃক প্রদত্ত ১৩ ডিজিটের কেন্দ্রীয় ভ্যাট নিবন্ধন সনদ"
    },
    {
      id: "req-5",
      order: 5,
      title_en: "Bank Solvency Certificate & Liquid Assets Credit Line",
      title_bn: "ব্যাংক সচ্ছলতা সনদপত্র ও লিকুইড এসেট ক্রেডিট লাইন",
      mandatory: true,
      has_expiry: true,
      description_en: "Certificate from a scheduled commercial bank confirming liquid assets or line of credit",
      description_bn: "তফসিলি ব্যাংক কর্তৃক প্রদত্ত তারল্য সম্পদ বা ক্রেডিট সুবিধার প্রত্যয়ন সনদ"
    },
    {
      id: "req-6",
      order: 6,
      title_en: "Specific Civil Infrastructure Construction Experience",
      title_bn: "অনুরূপ প্রকৃতির সিভিল কাজের সন্তোষজনক সমাপ্তি সনদপত্র",
      mandatory: true,
      has_expiry: false,
      description_en: "Completion certificate confirming similar highway/bridge works within the last 5 years",
      description_bn: "বিগত ৫ বছরে সরকারি বা স্বায়ত্তশাসিত প্রতিষ্ঠানে অনুরূপ কাজ সম্পন্ন করার সনদ"
    },
    {
      id: "req-7",
      order: 7,
      title_en: "Key Personnel Qualifications & Curriculum Vitae (CV)",
      title_bn: "মূল কারিগরি জনবলের জীবনবৃত্তান্ত ও পেশাগত সনদ",
      mandatory: true,
      has_expiry: false,
      description_en: "Signed CVs of Project Manager, Lead Structural Engineer, and Materials Inspector",
      description_bn: "প্রকল্প ব্যবস্থাপক, প্রধান স্ট্রাকচারাল ইঞ্জিনিয়ার ও গুণমান প্রকৌশলীর স্বাক্ষরিত জীবনবৃত্তান্ত"
    },
    {
      id: "req-8",
      order: 8,
      title_en: "Major Equipment & Heavy Machinery Capability Schedule",
      title_bn: "প্রয়োজনীয় ভারী যন্ত্রপাতি ও সরঞ্জামের বিবরণী",
      mandatory: false,
      has_expiry: false,
      description_en: "List of owned or leased heavy rollers, asphalt pavers, and batching plant",
      description_bn: "চুক্তির জন্য বরাদ্দকৃত নিজস্ব বা লিজকৃত ভারী রোলার ও মেশিনারিজের তালিকা"
    },
    {
      id: "req-9",
      order: 9,
      title_en: "Manufacturer's Authorization Certificate (MAF)",
      title_bn: "মূল প্রস্তুতকারকের অনুমোদন পত্র (MAF)",
      mandatory: false,
      has_expiry: true,
      description_en: "Authorized distributor/manufacturer certificate for load cell sensor instruments",
      description_bn: "বিশেষায়িত পরিদর্শন সেন্সর ও ওজন স্কেলের প্রস্তুতকারক কর্তৃক প্রদত্ত প্রত্যয়ন"
    },
    {
      id: "req-10",
      order: 10,
      title_en: "Litigation History & Non-Debarment Affidavit",
      title_bn: "আইনগত মামলা ও কালোতালিকাভুক্ত না হওয়ার এফিডেভিট",
      mandatory: false,
      has_expiry: false,
      description_en: "Non-judicial stamp notarized affidavit confirming non-debarment and clean track record",
      description_bn: "কোম্পানি দেউলিয়া বা কালোতালিকাভুক্ত নয় মর্মে ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে হলফনামা"
    }
  ]
};
