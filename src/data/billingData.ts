import { InvoiceRecord } from '../types';

export const INITIAL_INVOICES: InvoiceRecord[] = [
  // 1. BUYER INVOICE 1: Bengaluru Society purchasing Pollachi Tender Coconuts
  {
    id: 'inv-tn-2025-0412',
    invoiceNumber: 'INV-TN/2025-26/0412',
    invoiceType: 'BUYER_TAX_INVOICE',
    date: '2025-03-24',
    dueDate: '2025-03-26',
    
    // Farmer
    farmerId: 'farmer-pollachi-thiru',
    farmerName: 'Thirunavukkarasu P.',
    farmerMobile: '9842511223',
    farmerDistrict: 'Coimbatore',
    farmerTaluk: 'Pollachi South',
    farmerVillage: 'Annamalai Hills Foothills',
    farmerPattaNo: 'PTA-CBE-88219',
    farmerAadhaarMasked: 'XXXX-XXXX-4109',
    farmerBankRef: 'IOB Pollachi - A/C 2201***98',

    // Buyer
    buyerId: 'buyer-1',
    buyerName: 'Priya Sundaram',
    buyerOrganization: 'Palm Meadows Gated Community Procurement Guild',
    buyerMobile: '9880198765',
    buyerEmail: 'procure.palmmeadows@bengaluru.in',
    buyerGstin: '29AAACH7789M1Z5',
    buyerFssai: '11223344556677',
    buyerState: 'Karnataka',
    buyerCity: 'Bengaluru',
    deliveryAddress: 'Central Clubhouse Gate 2, Palm Meadows, Whitefield, Bengaluru - 560066',

    items: [
      {
        id: 'item-1',
        description: 'Pollachi Grade-A GI Tagged Sweet Tender Coconuts (இளநீர்)',
        description_ta: 'பொள்ளாச்சி புவிசார் குறியீடு பெற்ற செவ்விளநீர்',
        hsnCode: '08011910',
        quantity: 2500,
        unit: 'pieces',
        unitPrice: 32,
        total: 80000,
        mandiComparisonPrice: 55,
        savingsPercentage: 41.8
      }
    ],
    subtotal: 80000,
    freightAndLogistics: 6500,
    apmcCess: 0,
    middlemanCommissionDeduction: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 86500,
    paymentStatus: 'Paid via DBT/Escrow',
    paymentMethod: 'Escrow Account',
    transactionReference: 'TXN-HDFC-ESCROW-998812',

    ewayBillNumber: 'EB-TN-2025-9921448102',
    vehicleNumber: 'TN 38 CB 8820 (Eicher 14ft Reefer)',
    dispatchDate: '2025-03-24 18:30 IST',
    transportOperator: 'Kovai Green Agri Coldline Logistics',

    isGiCertified: true,
    giTagNumber: 'GI-APPL-TN-2012-004',
    zeroCommissionVerified: true,
    qrCodeData: 'AAA-VERIFY-EB-9921448102-TN38CB8820-FARMER-THIRU-86500',
    notes: 'Direct farmgate procurement via ANNA AGRI AI Platform. Exempt from APMC Mandi Cess under TN Direct Agri Marketing Act 2024. Zero middleman commission.'
  },

  // 2. BUYER INVOICE 2: Organic Store Chain purchasing Erode GI Turmeric
  {
    id: 'inv-tn-2025-0789',
    invoiceNumber: 'INV-TN/2025-26/0789',
    invoiceType: 'BUYER_TAX_INVOICE',
    date: '2025-03-20',
    dueDate: '2025-03-22',

    farmerId: 'farmer-erode',
    farmerName: 'Senthamizh Selvan',
    farmerMobile: '9443899120',
    farmerDistrict: 'Erode',
    farmerTaluk: 'Kodumudi',
    farmerVillage: 'Unjalur Bank Road',
    farmerPattaNo: 'PTA-ERD-45102',
    farmerAadhaarMasked: 'XXXX-XXXX-9912',
    farmerBankRef: 'Canara Bank Kodumudi - A/C 4511***33',

    buyerId: 'buyer-1',
    buyerName: 'Priya Sundaram',
    buyerOrganization: 'PureRoots Organic Supermarket Chain',
    buyerMobile: '9880198765',
    buyerEmail: 'priya.sundaram@agrotrade.in',
    buyerGstin: '29AAACH7789M1Z5',
    buyerFssai: '11223344558899',
    buyerState: 'Karnataka',
    buyerCity: 'Bengaluru',
    deliveryAddress: 'Warehouse Bay 4, Industrial Agro Park, Hosur Road, Bengaluru - 560100',

    items: [
      {
        id: 'item-2',
        description: 'Erode GI Certified Sun-Dried Turmeric Fingers (Curcumin 4.8%)',
        description_ta: 'ஈரோடு விரலி மஞ்சள் (உயர் குர்குமின் இயற்கை முறை)',
        hsnCode: '09103020',
        quantity: 1200,
        unit: 'kg',
        unitPrice: 140,
        total: 168000,
        mandiComparisonPrice: 220,
        savingsPercentage: 36.3
      }
    ],
    subtotal: 168000,
    freightAndLogistics: 4200,
    apmcCess: 0,
    middlemanCommissionDeduction: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 172200,
    paymentStatus: 'Paid via DBT/Escrow',
    paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-UTIB0001099238',

    ewayBillNumber: 'EB-TN-2025-4410298811',
    vehicleNumber: 'TN 33 AK 4410 (Tata 407 Heavy)',
    dispatchDate: '2025-03-21 07:00 IST',
    transportOperator: 'Kongu Express Agri Cargo',

    isGiCertified: true,
    giTagNumber: 'GI-APPL-TN-2019-012',
    zeroCommissionVerified: true,
    qrCodeData: 'AAA-VERIFY-EB-4410298811-TN33AK4410-FARMER-SENTHAMIZH-172200',
    notes: 'Sun-dried traditional farm processing. Free from synthetic polishing or lead chromate.'
  },

  // 3. FARMER SALES RECEIPT 1: Ramasamy K. (Thanjavur) - BPT-5204 Ponni Paddy
  {
    id: 'rcpt-tn-4521',
    invoiceNumber: 'RCPT-UZHAVAR/2025-26/4521',
    invoiceType: 'FARMER_SALES_RECEIPT',
    date: '2025-03-22',
    dueDate: '2025-03-22',

    farmerId: 'farmer-1',
    farmerName: 'Ramasamy K.',
    farmerMobile: '9840123456',
    farmerDistrict: 'Thanjavur',
    farmerTaluk: 'Kumbakonam',
    farmerVillage: 'Ammapettai Delta Agrarian Ward',
    farmerPattaNo: 'PTA-TNJ-771890',
    farmerAadhaarMasked: 'XXXX-XXXX-1234',
    farmerBankRef: 'Canara Bank Ammapettai - A/C 1198***8812',

    buyerId: 'buyer-chennai-corp',
    buyerName: 'R. K. Parthiban',
    buyerOrganization: 'Chennai Delta Grain Mills & Wholesale Federation',
    buyerMobile: '9444012345',
    buyerEmail: 'procure@chennaigrains.in',
    buyerGstin: '33AAACL8891P1ZK',
    buyerFssai: '11220033441122',
    buyerState: 'Tamil Nadu',
    buyerCity: 'Chennai',
    deliveryAddress: 'Direct Farmgate Loading at Ammapettai Threshing Yard, Thanjavur - 614401',

    items: [
      {
        id: 'item-3',
        description: 'BPT-5204 Super Fine Ponni Paddy (தஞ்சாவூர் பொன்னி நெல்)',
        description_ta: 'தஞ்சாவூர் பாரம்பரிய பொன்னி நெல் (முதல் தரம்)',
        hsnCode: '10061010',
        quantity: 30,
        unit: 'quintal',
        unitPrice: 2450,
        total: 73500,
        mandiComparisonPrice: 2150,
        savingsPercentage: 13.9
      }
    ],
    subtotal: 73500,
    freightAndLogistics: 0, // Picked up at farmgate by buyer
    apmcCess: 0,
    middlemanCommissionDeduction: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 73500,
    paymentStatus: 'NEFT Confirmed',
    paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-CNRB0002241-73500-CREDITED',

    ewayBillNumber: 'EB-TN-2025-10294811',
    vehicleNumber: 'TN 49 AZ 3301',
    dispatchDate: '2025-03-22 14:00 IST',
    transportOperator: 'Buyer Arranged Farmgate Vehicle',

    isGiCertified: true,
    giTagNumber: 'GI-APPL-TN-THANJAVUR-GRAIN',
    zeroCommissionVerified: true,
    qrCodeData: 'AAA-FARMER-RCPT-4521-RAMASAMY-73500-PAID-0COMM',
    notes: 'Farmer-Direct Bikri Parchi (உழவர் நேரடி விற்பனை ரசீது). 100% sale proceeds credited to farmer bank account with zero middleman deductions.'
  },

  // 4. FARMER SALES RECEIPT 2: Ramasamy K. - Certified Black Gram (Ulundu)
  {
    id: 'rcpt-tn-4588',
    invoiceNumber: 'RCPT-UZHAVAR/2025-26/4588',
    invoiceType: 'FARMER_SALES_RECEIPT',
    date: '2025-03-15',
    dueDate: '2025-03-15',

    farmerId: 'farmer-1',
    farmerName: 'Ramasamy K.',
    farmerMobile: '9840123456',
    farmerDistrict: 'Thanjavur',
    farmerTaluk: 'Kumbakonam',
    farmerVillage: 'Ammapettai Delta Agrarian Ward',
    farmerPattaNo: 'PTA-TNJ-771890',
    farmerAadhaarMasked: 'XXXX-XXXX-1234',
    farmerBankRef: 'Canara Bank Ammapettai - A/C 1198***8812',

    buyerId: 'buyer-trichy-coop',
    buyerName: 'Trichy Central Consumer Cooperative Wholesale Stores',
    buyerOrganization: 'TNCCW Ltd (Government Cooperative Buyer)',
    buyerMobile: '9443198877',
    buyerEmail: 'tnccw.trichy@tn.gov.in',
    buyerGstin: '33AAAGT1002G1Z9',
    buyerFssai: '11221199887766',
    buyerState: 'Tamil Nadu',
    buyerCity: 'Tiruchirappalli',
    deliveryAddress: 'Central Warehouse, Fort Station Road, Tiruchirappalli - 620002',

    items: [
      {
        id: 'item-4',
        description: 'VBN-8 High-Yield Black Gram / Urad Dal (உளுந்து)',
        description_ta: 'வம்பன்-8 சான்றளிக்கப்பட்ட உளுந்து',
        hsnCode: '07133100',
        quantity: 5,
        unit: 'quintal',
        unitPrice: 7200,
        total: 36000,
        mandiComparisonPrice: 6500,
        savingsPercentage: 10.7
      }
    ],
    subtotal: 36000,
    freightAndLogistics: 1200,
    apmcCess: 0,
    middlemanCommissionDeduction: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 37200,
    paymentStatus: 'Paid via DBT/Escrow',
    paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
    transactionReference: 'DBT-TNCOOP-99881122-37200',

    ewayBillNumber: 'EB-TN-2025-88192033',
    vehicleNumber: 'TN 45 BE 9912',
    dispatchDate: '2025-03-15 16:00 IST',
    transportOperator: 'Cooperative Apex Logistics',

    isGiCertified: false,
    zeroCommissionVerified: true,
    qrCodeData: 'AAA-FARMER-RCPT-4588-RAMASAMY-37200-DBT-PAID',
    notes: 'Certified pulse procurement by state cooperative under Minimum Support Price (MSP) Guarantee.'
  },

  // 5. GOVERNMENT SUBSIDY BILLING / SANCTION INVOICE: Soil Test Fee Waiver
  {
    id: 'gov-bill-2025-102',
    invoiceNumber: 'GOV-BILL/SOIL-WAIVER/2025/102',
    invoiceType: 'GOVT_SUBSIDY_BILLING',
    date: '2025-03-21',
    dueDate: '2025-03-21',

    farmerId: 'farmer-1',
    farmerName: 'Ramasamy K.',
    farmerMobile: '9840123456',
    farmerDistrict: 'Thanjavur',
    farmerTaluk: 'Kumbakonam',
    farmerVillage: 'Ammapettai Delta Agrarian Ward',
    farmerPattaNo: 'PTA-TNJ-771890',
    farmerAadhaarMasked: 'XXXX-XXXX-1234',
    farmerBankRef: 'Canara Bank Ammapettai - A/C 1198***8812',

    buyerId: 'admin-tnau',
    buyerName: 'Tamil Nadu Agricultural University & Agri Dept',
    buyerOrganization: 'Directorate of Agriculture, Chepauk, Chennai',
    buyerMobile: '044-28524851',
    buyerEmail: 'agri.dept@tn.gov.in',
    buyerState: 'Tamil Nadu',
    buyerCity: 'Chennai',
    deliveryAddress: 'TNAU Mobile Testing Center, Regional Research Station, Thanjavur',

    items: [
      {
        id: 'item-5',
        description: 'TNAU 16-Parameter Soil Chemical & Micronutrient Assay (NPK, pH, EC, Zn, B, Fe)',
        description_ta: 'TNAU 16-காரணி விரிவான மண் பரிசோதனை & மண்வள அட்டை கட்டண விலக்கு',
        quantity: 1,
        unit: 'test',
        unitPrice: 1200,
        total: 1200
      },
      {
        id: 'item-6',
        description: 'Tamil Nadu State Soil Health Mission 100% Subsidy Grant Waiver',
        description_ta: 'தமிழ்நாடு மண்வள மேலாண்மைத் திட்ட 100% முழு மானியக் கழிவு',
        quantity: 1,
        unit: 'waiver',
        unitPrice: -1200,
        total: -1200
      }
    ],
    subtotal: 0,
    freightAndLogistics: 0,
    apmcCess: 0,
    middlemanCommissionDeduction: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 0, // Fully Subsidized
    paymentStatus: 'Govt Direct Credit',
    paymentMethod: 'State DBT Credit',
    transactionReference: 'TN-GOV-SOIL-SCHEME-GRANT-1200',

    isGiCertified: false,
    zeroCommissionVerified: true,
    qrCodeData: 'AAA-GOV-BILL-102-SOIL-WAIVER-100PCT-FREE-RAMASAMY',
    notes: 'Official Soil Testing Sanction Invoice. Net amount payable by farmer is ₹0. Fully funded under State Soil Health Management Scheme.'
  }
];
