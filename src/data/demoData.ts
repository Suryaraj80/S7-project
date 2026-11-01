import { FarmerProfile, User, KvkCenter, SeasonalDeadline, FarmerStory, DocumentReadinessItem, AppNotification, RecommendationWeights } from '../types';

export const DEFAULT_WEIGHTS: RecommendationWeights = {
  location: 20,
  crop: 15,
  landholding: 15,
  income: 15,
  category: 10,
  age: 10,
  irrigation: 5,
  farmingType: 5,
  specialFactors: 5,
};

export const DEMO_USERS: User[] = [
  {
    id: 'farmer-1',
    name: 'Ramasamy K.',
    email: 'demo.farmer@example.com',
    mobile: '9840123456',
    role: 'FARMER',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    createdAt: '2025-01-10',
    status: 'active'
  },
  {
    id: 'farmer-2',
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    mobile: '9415123456',
    role: 'FARMER',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    createdAt: '2025-02-15',
    status: 'active'
  },
  {
    id: 'farmer-3',
    name: 'Gurpreet Singh',
    email: 'gurpreet.singh@example.com',
    mobile: '9876543210',
    role: 'FARMER',
    state: 'Punjab',
    district: 'Ludhiana',
    createdAt: '2025-03-01',
    status: 'active'
  },
  {
    id: 'farmer-4',
    name: 'Anand Kulkarni',
    email: 'anand.k@example.com',
    mobile: '9822123456',
    role: 'FARMER',
    state: 'Maharashtra',
    district: 'Solapur',
    createdAt: '2025-03-12',
    status: 'active'
  },
  {
    id: 'admin-1',
    name: 'Dr. K. Soundararajan (Joint Director of Agriculture)',
    email: 'admin.agri@tn.gov.in',
    mobile: '9444109876',
    role: 'ADMIN',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    createdAt: '2024-01-01',
    status: 'active'
  },
  {
    id: 'buyer-1',
    name: 'Priya Sundaram (Wholesale Procurement)',
    email: 'priya.sundaram@agrotrade.in',
    mobile: '9880198765',
    role: 'BUYER',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    createdAt: '2025-02-01',
    status: 'active'
  }
];

export const DEMO_PROFILES: Record<string, FarmerProfile> = {
  'farmer-1': {
    userId: 'farmer-1',
    fullName: 'Ramasamy K.',
    age: 46,
    gender: 'Male',
    mobile: '9840123456',
    email: 'demo.farmer@example.com',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    taluk: 'Papanasam',
    village: 'Kabisthalam',
    landholdingSize: 2.0,
    landUnit: 'Acres',
    ownershipType: 'Owner',
    cropType: 'Paddy',
    secondaryCrop: 'Banana',
    farmingType: 'Conventional',
    irrigationAvailable: true,
    irrigationType: 'Canal',
    soilType: 'Alluvial',
    hasLivestock: true,
    livestockTypes: ['Cattle'],
    annualIncome: 120000,
    incomeCategory: '1 to 2.5 Lakhs',
    isBpl: false,
    hasAadhaarLinkedBank: true,
    farmerCategory: 'OBC',
    smallMarginalClassification: 'Marginal',
    isWomanFarmer: false,
    hasDisability: false,
    profileCompletionPercentage: 100,
    lastUpdated: '2026-03-15'
  },
  'farmer-2': {
    userId: 'farmer-2',
    fullName: 'Sunita Devi',
    age: 38,
    gender: 'Female',
    mobile: '9415123456',
    email: 'sunita.devi@example.com',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    taluk: 'Pindra',
    village: 'Babatpur',
    landholdingSize: 1.2,
    landUnit: 'Acres',
    ownershipType: 'Tenant',
    cropType: 'Vegetables',
    secondaryCrop: 'Wheat',
    farmingType: 'Organic',
    irrigationAvailable: true,
    irrigationType: 'Borewell',
    soilType: 'Alluvial',
    hasLivestock: true,
    livestockTypes: ['Goat/Sheep', 'Poultry'],
    annualIncome: 85000,
    incomeCategory: 'Below 1 Lakh',
    isBpl: true,
    hasAadhaarLinkedBank: true,
    farmerCategory: 'SC',
    smallMarginalClassification: 'Marginal',
    isWomanFarmer: true,
    hasDisability: false,
    profileCompletionPercentage: 100,
    lastUpdated: '2026-03-18'
  },
  'farmer-3': {
    userId: 'farmer-3',
    fullName: 'Gurpreet Singh',
    age: 52,
    gender: 'Male',
    mobile: '9876543210',
    email: 'gurpreet.singh@example.com',
    state: 'Punjab',
    district: 'Ludhiana',
    taluk: 'Samrala',
    village: 'Chawa',
    landholdingSize: 6.5,
    landUnit: 'Acres',
    ownershipType: 'Owner',
    cropType: 'Wheat',
    secondaryCrop: 'Paddy',
    farmingType: 'Conventional',
    irrigationAvailable: true,
    irrigationType: 'Borewell',
    soilType: 'Sandy Loam',
    hasLivestock: true,
    livestockTypes: ['Cattle', 'Buffalo'],
    annualIncome: 420000,
    incomeCategory: '2.5 to 5 Lakhs',
    isBpl: false,
    hasAadhaarLinkedBank: true,
    farmerCategory: 'General',
    smallMarginalClassification: 'Medium',
    isWomanFarmer: false,
    hasDisability: false,
    profileCompletionPercentage: 100,
    lastUpdated: '2026-03-20'
  },
  'farmer-4': {
    userId: 'farmer-4',
    fullName: 'Anand Kulkarni',
    age: 41,
    gender: 'Male',
    mobile: '9822123456',
    email: 'anand.k@example.com',
    state: 'Maharashtra',
    district: 'Solapur',
    taluk: 'Pandharpur',
    village: 'Bhalwani',
    landholdingSize: 3.5,
    landUnit: 'Acres',
    ownershipType: 'Owner',
    cropType: 'Fruits',
    secondaryCrop: 'Pulses',
    farmingType: 'Organic',
    irrigationAvailable: true,
    irrigationType: 'Drip/Sprinkler',
    soilType: 'Black',
    hasLivestock: false,
    livestockTypes: [],
    annualIncome: 240000,
    incomeCategory: '1 to 2.5 Lakhs',
    isBpl: false,
    hasAadhaarLinkedBank: true,
    farmerCategory: 'General',
    smallMarginalClassification: 'Small',
    isWomanFarmer: false,
    hasDisability: false,
    profileCompletionPercentage: 100,
    lastUpdated: '2026-03-22'
  }
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'PM-KISAN 17th Installment Credited',
    title_ta: 'பி.எம் கிசான் 17வது தவணை தொகை வரவு வைக்கப்பட்டது',
    title_hi: 'पीएम-किसान 17वीं किस्त किसानों के खातों में अंतरित',
    message: 'The central government has released ₹2,000 to all eligible Aadhaar-seeded accounts. Please verify your passbook entry or check status.',
    message_ta: 'அரசு தகுதியுள்ள அனைத்து விவசாயிகளின் வங்கிக் கணக்கிலும் ₹2,000 விடுவித்துள்ளது.',
    message_hi: 'केंद्र सरकार ने पात्र किसानों के खातों में ₹2,000 की किस्त जारी कर दी है। अपना बैंक विवरण जांचें।',
    type: 'scheme_alert',
    schemeId: 'pm-kisan',
    createdAt: '2026-03-24',
    isRead: false,
    priority: 'high'
  },
  {
    id: 'notif-2',
    title: 'Kuruvai Paddy Seed Package Now Open',
    title_ta: 'குருவை நெல் விதை தொகுப்பு விண்ணப்பம் துவங்கியது',
    title_hi: 'कुरुवई धान बीज विशेष वितरण शुरू',
    message: 'Delta district farmers in Tamil Nadu can now collect subsidized certified paddy seed and DAP kits from local Agricultural Extension Centers.',
    message_ta: 'டெல்டா மாவட்ட விவசாயிகள் வேளாண் விரிவாக்க மையங்களில் இலவச நெல் விதை மற்றும் உரங்களை பெற்றுக்கொள்ளலாம்.',
    message_hi: 'तमिलनाडु के डेल्टा क्षेत्र के किसान अपने नजदीकी कृषि केंद्र से रियायती बीज किट प्राप्त कर सकते हैं।',
    type: 'deadline',
    schemeId: 'tn-kuruvai-package',
    createdAt: '2026-03-23',
    isRead: false,
    priority: 'medium'
  },
  {
    id: 'notif-3',
    title: 'PMFBY Crop Insurance Cut-Off Alert',
    title_ta: 'பயிர் காப்பீட்டுக்கான கடைசி தேதி நினைவூட்டல்',
    title_hi: 'फसल बीमा पंजीकरण की अंतिम तिथि निकट',
    message: 'Last date for non-loanee farmers to register Kharif insurance under PMFBY is approaching. Ensure your VAO sowing certificate is uploaded.',
    message_ta: 'காரிஃப் பருவத்திற்கான பிரதம மந்திரி பயிர் காப்பீட்டு பதிவு செய்ய கடைசி தேதி நெருங்குகிறது.',
    message_hi: 'पीएमएफबीवाई के तहत गैर-ऋणी किसानों के लिए खरीफ फसल बीमा की अंतिम तिथि नजदीक है।',
    type: 'deadline',
    schemeId: 'pmfby',
    createdAt: '2026-03-21',
    isRead: true,
    priority: 'high'
  }
];

export const KVK_CENTERS: KvkCenter[] = [
  {
    id: 'kvk-tn-1',
    name: 'ICAR - Krishi Vigyan Kendra, Thanjavur (Tamil Nadu)',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    address: 'Soil and Water Management Research Institute, Kattuthottam, Thanjavur - 613501',
    phone: '04362-267355 / 9443567812',
    email: 'kvk.thanjavur@icar.gov.in',
    headName: 'Dr. S. Ramasubramanian (Senior Scientist)',
    keyServices: [
      'Soil & Water Quality Lab Testing',
      'Kuruvai & Samba Variety Trial Demonstrations',
      'Organic Pest Management Formulations',
      'Assisted PM-KISAN and Uzhavan App e-KYC'
    ]
  },
  {
    id: 'kvk-tn-2',
    name: 'ICAR - Krishi Vigyan Kendra, Tiruvarur (Tamil Nadu)',
    state: 'Tamil Nadu',
    district: 'Tiruvarur',
    address: 'Needamangalam Research Station, Tiruvarur District - 614404',
    phone: '04367-260666 / 9442198765',
    email: 'kvk.tiruvarur@icar.gov.in',
    headName: 'Dr. M. Sangeetha (Head & Specialist)',
    keyServices: [
      'Direct Seeded Rice (DSR) Training',
      'Micro-Irrigation Field Layout Design',
      'Integrated Farm Management Advisory',
      'Livestock Fodder Variety Seeds'
    ]
  },
  {
    id: 'kvk-up-1',
    name: 'ICAR - Krishi Vigyan Kendra, Varanasi (Uttar Pradesh)',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    address: 'Indian Institute of Vegetable Research (IIVR), Shahanshapur, Varanasi - 221305',
    phone: '0542-2635230 / 9415287654',
    email: 'kvk.varanasi@icar.gov.in',
    headName: 'Dr. N. K. Singh (Senior Scientist)',
    keyServices: [
      'High-Yield Vegetable Nursery Techniques',
      'Drip Irrigation Subsidy Documentation',
      'Soil Health Card Issuance',
      'Women SHG Food Processing Skills'
    ]
  },
  {
    id: 'kvk-pb-1',
    name: 'ICAR - Krishi Vigyan Kendra, Ludhiana (Punjab)',
    state: 'Punjab',
    district: 'Ludhiana',
    address: 'Punjab Agricultural University (PAU) Campus, Ludhiana - 141004',
    phone: '0161-2401960 / 9872145678',
    email: 'kvk.ludhiana@pau.edu',
    headName: 'Dr. Gurmeet Singh (Head Specialist)',
    keyServices: [
      'Happy Seeder / Super SMS Paddy Stubble Management',
      'Wheat Rust Disease Surveillance',
      'Solar Agri-Pump Testing Assistance',
      'Dairy Cattle Nutrition & Health Camps'
    ]
  },
  {
    id: 'kvk-mh-1',
    name: 'ICAR - Krishi Vigyan Kendra, Solapur (Maharashtra)',
    state: 'Maharashtra',
    district: 'Solapur',
    address: 'National Research Centre on Pomegranate, Kegaon, Solapur - 413255',
    phone: '0217-2350074 / 9422078912',
    email: 'kvk.solapur@icar.gov.in',
    headName: 'Dr. L. R. Jadhav (Principal Scientist)',
    keyServices: [
      'Pomegranate Bacterial Blight Mitigation',
      'PKVY Organic Cluster Certification Support',
      'Drip Irrigation Automation Guidance',
      'Water Shed & Farm Pond Grant Subsidies'
    ]
  }
];

export const SEASONAL_DEADLINES: SeasonalDeadline[] = [
  {
    id: 'sd-1',
    season: 'Kharif',
    schemeName: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    schemeId: 'pmfby',
    title: 'Kharif Crop Insurance Cut-off Date for Paddy & Cotton',
    deadlineDate: '2026-07-31',
    daysRemaining: 127,
    actionRequired: 'Submit Sowing Certificate and pay subsidized 2% premium at bank or CSC center.',
    status: 'Open'
  },
  {
    id: 'sd-2',
    season: 'Annual',
    schemeName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    schemeId: 'pm-kisan',
    title: 'Mandatory Aadhaar OTP / Biometric e-KYC Renewal',
    deadlineDate: '2026-04-30',
    daysRemaining: 35,
    actionRequired: 'Complete e-KYC on pmkisan.gov.in or visit CSC to avoid pause in upcoming ₹2,000 installment.',
    status: 'Closing Soon'
  },
  {
    id: 'sd-3',
    season: 'Kharif',
    schemeName: 'Tamil Nadu Kuruvai Cultivation Special Package',
    schemeId: 'tn-kuruvai-package',
    title: 'Delta Kuruvai Free Paddy Seed & Fertilizer Token Booking',
    deadlineDate: '2026-05-25',
    daysRemaining: 60,
    actionRequired: 'Register on Uzhavan App with VAO Adangal slip to collect seed bags.',
    status: 'Open'
  },
  {
    id: 'sd-4',
    season: 'Annual',
    schemeName: 'PM-KUSUM (Solar Agricultural Pumps Scheme)',
    schemeId: 'pm-kusum',
    title: 'Component-B Standalone Solar Pump State Quota Allotment',
    deadlineDate: '2026-06-15',
    daysRemaining: 81,
    actionRequired: 'Deposit 10% farmer share with State Renewable Energy Agency to lock empanelled vendor.',
    status: 'Open'
  },
  {
    id: 'sd-5',
    season: 'Rabi',
    schemeName: 'Sub-Mission on Seeds and Planting Material (SMSP)',
    schemeId: 'smsp-certified-seeds',
    title: 'Certified Wheat & Gram Pulse Seed 50% Subsidized Indent',
    deadlineDate: '2026-10-15',
    daysRemaining: 203,
    actionRequired: 'Submit land area estimate to Block Agriculture Depot for early seed allocation.',
    status: 'Upcoming'
  }
];

export const FARMER_STORIES: FarmerStory[] = [
  {
    id: 'story-1',
    farmerName: 'Murugesan K.',
    location: 'Kumbakonam, Thanjavur, Tamil Nadu',
    schemeName: 'Per Drop More Crop - PMKSY',
    benefitReceived: '100% Free Drip Irrigation Kit worth ₹72,000',
    storyQuote: 'As a marginal farmer with 1.8 acres, I used to struggle with acute summer canal shortages. With the 100% state-subsidized drip irrigation, my vegetable yield doubled and I save 50% water.',
    storyQuote_ta: '1.8 ஏக்கர் நிலத்தில் கோடையில் தண்ணீர் பற்றாக்குறையால் தவித்தேன். 100% அரசு மானிய சொட்டுநீர் பாசனம் பெற்று காய்கறி மகசூல் இருமடங்காக உயர்ந்துள்ளது.',
    storyQuote_hi: '1.8 एकड़ खेत में पानी की भारी किल्लत थी। सरकार की 100% ड्रिप सिंचाई सब्सिडी से सब्जी की पैदावार दोगुनी हो गई।',
    crop: 'Vegetables & Banana',
    rating: 5,
    date: '2026-01-14'
  },
  {
    id: 'story-2',
    farmerName: 'Kalyani S.',
    location: 'Varanasi Rural, Uttar Pradesh',
    schemeName: 'Mahila Kisan Sashaktikaran Pariyojana (MKSP)',
    benefitReceived: 'Ergonomic Weeder & ₹15,000 Organic Input Grant',
    storyQuote: 'Our women SHG received hand-operated rotary weeders and organic bio-fertilizer training. We stopped buying costly chemical pesticides and now sell chemical-free spinach and tomatoes at premium prices.',
    storyQuote_ta: 'எங்கள் மகளிர் குழுவிற்கு உழைப்பை குறைக்கும் களை எடுக்கும் கருவிகள் மற்றும் இயற்கை உர பயிற்சி கிடைத்தது. கெமிக்கல் இல்லாமல் ஆரோக்கியமான காய்கறி விளைவிக்கிறோம்.',
    storyQuote_hi: 'हमारे महिला स्वयं सहायता समूह को निराई-गुड़ाई के आधुनिक यंत्र और जैविक खाद निर्माण की मुफ्त ट्रेनिंग मिली। हमारी आमदनी में 40% वृद्धि हुई है।',
    crop: 'Organic Vegetables',
    rating: 5,
    date: '2026-02-20'
  },
  {
    id: 'story-3',
    farmerName: 'Balwinder Singh',
    location: 'Khanna, Ludhiana, Punjab',
    schemeName: 'PM-KUSUM Solar Agricultural Pump',
    benefitReceived: '7.5 HP Solar Pump with 60% Govt Subsidy (₹1.4 Lakh saved)',
    storyQuote: 'Diesel expenses were eating up 35% of my wheat and paddy margin every season. The 7.5 HP PM-KUSUM solar pump supplies reliable water through bright sunshine with zero fuel cost.',
    storyQuote_ta: 'டீசல் பம்புசெட்டிற்கு அதிக செலவு செய்து வந்தேன். 60% அரசு மானியத்தில் சோலார் பம்புசெட் அமைத்த பின் டீசல் செலவு முற்றிலும் இல்லை.',
    storyQuote_hi: 'हर महीने ₹8,000 डीजल में खर्च हो जाते थे। 60% सब्सिडी पर 7.5 एचपी सोलर पंप लगने के बाद बिना किसी बिजली बिल के दिन में भरपूर पानी मिलता है।',
    crop: 'Wheat & Paddy',
    rating: 5,
    date: '2026-03-05'
  }
];

export const DOCUMENT_READINESS_ITEMS: DocumentReadinessItem[] = [
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar Card (Active Mobile Linked)',
    name_ta: 'ஆதார் அட்டை (மொபைல் எண் இணைக்கப்பட்டது)',
    name_hi: 'आधार कार्ड (सक्रिय मोबाइल नंबर से लिंक)',
    description: 'Required for e-KYC and Direct Benefit Transfer (DBT) subsidies.',
    isReady: true,
    requiredForSchemesCount: 15
  },
  {
    id: 'doc-land',
    name: 'Land Record (Patta / Chitta / Khatauni / 7/12 Extract)',
    name_ta: 'நில ஆவணங்கள் (பட்டா / சிட்டா / அடங்கல்)',
    name_hi: 'भूमि अभिलेख (खतौनी / पट्टा / 7/12 नकल)',
    description: 'Official proof of landownership, survey number, and acreage.',
    isReady: true,
    requiredForSchemesCount: 13
  },
  {
    id: 'doc-bank',
    name: 'Bank Passbook (Aadhaar & NPCI Mapped)',
    name_ta: 'வங்கி கணக்கு புத்தகம் (ஆதார் இணைக்கப்பட்டது)',
    name_hi: 'बैंक पासबुक (आधार एवं एनपीसीआई से लिंक)',
    description: 'Clear copy showing account number, IFSC code, and farmer name.',
    isReady: true,
    requiredForSchemesCount: 14
  },
  {
    id: 'doc-sowing',
    name: 'Crop Sowing Proof / Adangal / Khasra Girdawari',
    name_ta: 'பயிர் சாகுபடி சான்றிதழ் / கிராம நிர்வாக அலுவலர் அடங்கல்',
    name_hi: 'फसल बुवाई प्रमाण पत्र / पटवारी गिरदावरी',
    description: 'Issued by Village Administrative Officer (VAO) or Patwari for insurance & crop packages.',
    isReady: false,
    requiredForSchemesCount: 7
  },
  {
    id: 'doc-soil',
    name: 'Soil Health Card / Soil Test Report',
    name_ta: 'மண் வள அட்டை / மண் பரிசோதனை அறிக்கை',
    name_hi: 'मृदा स्वास्थ्य कार्ड / मिट्टी जांच रिपोर्ट',
    description: 'Scientific test report required for micro-irrigation and fertilizer subsidy sanctions.',
    isReady: false,
    requiredForSchemesCount: 5
  },
  {
    id: 'doc-category',
    name: 'Community Certificate (SC/ST/OBC) or Women ID',
    name_ta: 'சாதிச் சான்றிதழ் (எஸ்சி/எஸ்டி/ஓபிசி) அல்லது மகளிர் குழு சான்று',
    name_hi: 'जाति प्रमाण पत्र (अजा/अजजा/अपिव) या महिला पहचान',
    description: 'Unlocks up to 10% to 15% extra subsidy under mechanization and irrigation schemes.',
    isReady: true,
    requiredForSchemesCount: 8
  },
  {
    id: 'doc-water',
    name: 'Water Source Proof / Borewell Electricity NOC',
    name_ta: 'நீர் ஆதார சான்று / கிணறு-போர்வெல் விவரம்',
    name_hi: 'जल स्रोत प्रमाण / बोरवेल अनापत्ति प्रमाण पत्र',
    description: 'Required for PM-KUSUM solar pumps and micro-irrigation systems.',
    isReady: false,
    requiredForSchemesCount: 4
  }
];
