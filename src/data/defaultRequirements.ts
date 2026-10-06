import { RequirementsData } from '../types/tender';

export const defaultRequirementsData: RequirementsData = {
  tender: {
    tender_id: "T-2026-0417",
    title: "Supply of IT Equipment",
    procuring_entity: "Directorate of Sample Services",
    bidder: "Meghna Tech Solutions Ltd.",
    submission_deadline: "2026-10-20"
  },
  requirements: [
    {
      id: "R01",
      order: 1,
      title_en: "Trade License",
      title_bn: "ট্রেড লাইসেন্স",
      mandatory: true,
      has_expiry: true,
      description_en: "Valid trade license renewed from City Corporation or Municipality",
      description_bn: "সিটি কর্পোরেশন বা পৌরসভা থেকে নবায়নকৃত ট্রেড লাইসেন্স"
    },
    {
      id: "R02",
      order: 2,
      title_en: "TIN Certificate",
      title_bn: "টিআইএন সনদ",
      mandatory: true,
      has_expiry: false,
      description_en: "Taxpayer Identification Number Certificate issued by Revenue Board",
      description_bn: "জাতীয় রাজস্ব বোর্ড কর্তৃক প্রদত্ত করদাতা সনাক্তকরণ নম্বর (টিআইএন)"
    },
    {
      id: "R03",
      order: 3,
      title_en: "VAT Registration Certificate",
      title_bn: "ভ্যাট নিবন্ধন সনদ",
      mandatory: true,
      has_expiry: false,
      description_en: "Value Added Tax (VAT) / Business ID (BIN) registration certificate",
      description_bn: "মূল্য সংযোজন কর (ভ্যাট) / বিজনেস আইডেন্টিফিকেশন নম্বর (বিআইএন) সনদ"
    },
    {
      id: "R04",
      order: 4,
      title_en: "Bank Solvency Certificate",
      title_bn: "ব্যাংক সচ্ছলতা সনদ",
      mandatory: true,
      has_expiry: true,
      description_en: "Solvency certificate issued by a scheduled commercial bank confirming creditworthiness",
      description_bn: "তফসিলি ব্যাংক কর্তৃক প্রদত্ত আর্থিক সচ্ছলতা ও ক্রেডিট প্রত্যয়ন সনদ"
    },
    {
      id: "R05",
      order: 5,
      title_en: "Experience Certificate",
      title_bn: "অভিজ্ঞতার সনদ",
      mandatory: true,
      has_expiry: false,
      description_en: "Satisfactory completion certificate for similar IT equipment supply contracts",
      description_bn: "অনুরূপ আইটি যন্ত্রপাতি সরবরাহ ও বাস্তবায়নের সন্তোষজনক সমাপ্তি সনদ"
    },
    {
      id: "R06",
      order: 6,
      title_en: "Audited Financial Statement",
      title_bn: "নিরীক্ষিত আর্থিক বিবরণী",
      mandatory: false,
      has_expiry: false,
      description_en: "Audited financial report prepared by a registered chartered accountant (Optional)",
      description_bn: "সনদপ্রাপ্ত চার্টার্ড অ্যাকাউন্ট্যান্ট কর্তৃক নিরীক্ষিত আর্থিক বিবরণী (ঐচ্ছিক)"
    },
    {
      id: "R07",
      order: 7,
      title_en: "Manufacturer's Authorization",
      title_bn: "প্রস্তুতকারকের অনুমোদনপত্র",
      mandatory: false,
      has_expiry: true,
      description_en: "Manufacturer's Authorization Form (MAF) from OEM hardware manufacturers (Optional)",
      description_bn: "মূল হার্ডওয়্যার প্রস্তুতকারক কর্তৃক প্রদত্ত অনুমোদনপত্র (ঐচ্ছিক)"
    },
    {
      id: "R08",
      order: 8,
      title_en: "Technical Proposal",
      title_bn: "কারিগরি প্রস্তাব",
      mandatory: true,
      has_expiry: false,
      description_en: "Comprehensive technical compliance, equipment datasheets, delivery and team schedule",
      description_bn: "কারিগরি বিবরণী, পণ্যের স্পেসিফিকেশন ও বাস্তবায়ন দলের তালিকা"
    },
    {
      id: "R09",
      order: 9,
      title_en: "Financial Proposal",
      title_bn: "আর্থিক প্রস্তাব",
      mandatory: true,
      has_expiry: false,
      description_en: "Priced bill of quantities, payment terms, and validity declaration",
      description_bn: "দরপত্র মূল্য তালিকা, মূল্য তফসিল ও আর্থিক শর্তাবলী"
    },
    {
      id: "R10",
      order: 10,
      title_en: "Signed Declaration",
      title_bn: "স্বাক্ষরিত ঘোষণাপত্র",
      mandatory: true,
      has_expiry: false,
      description_en: "Official signed declaration and anti-corruption commitment on letterhead",
      description_bn: "ক্ষমতাপ্রাপ্ত ব্যবস্থাপনা পরিচালক কর্তৃক যথাযথ স্বাক্ষরিত ও সিলযুক্ত ঘোষণাপত্র"
    }
  ]
};

