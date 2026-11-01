import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  navHome: string;
  navSchemes: string;
  navRecommendations: string;
  navWeather: string;
  navSoilBooking: string;
  navCropRecommender: string;
  navShopsNearby: string;
  navMarketplace: string;
  navSimulator: string;
  navDocuments: string;
  navKvkCenters: string;
  navCalendar: string;
  navCalculator: string;
  navAdmin: string;
  navLogin: string;
  navLogout: string;
  navProfile: string;
  navSaved: string;
  navChatbot: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroGetStarted: string;
  heroExploreSchemes: string;
  heroStatFarmers: string;
  heroStatSchemes: string;
  heroStatSubsidy: string;
  heroStatAccuracy: string;

  // Recommendations
  recTitle: string;
  recSubtitle: string;
  systemMatchScore: string;
  eligibleStatus: string;
  ineligibleStatus: string;
  whyMatchesYou: string;
  benefitLabel: string;
  viewDetails: string;
  saveScheme: string;
  savedScheme: string;
  allCategories: string;
  filterByState: string;
  filterByCrop: string;
  filterByCategory: string;
  sortByScore: string;

  // Profile
  profileTitle: string;
  personalInfo: string;
  farmingInfo: string;
  financialInfo: string;
  socialInfo: string;
  fullName: string;
  age: string;
  gender: string;
  mobile: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  landSize: string;
  landUnit: string;
  cropType: string;
  secondaryCrop: string;
  irrigation: string;
  annualIncome: string;
  farmerCategory: string;
  saveProfile: string;
  profileCompletion: string;

  // Chatbot
  chatTitle: string;
  chatPlaceholder: string;
  chatSend: string;
  chatVoiceListening: string;
  chatDisclaimer: string;

  // Common
  searchPlaceholder: string;
  noResults: string;
  close: string;
  applyNow: string;
  officialSource: string;
  helpline: string;
  readAloud: string;
  stopAudio: string;
  downloadKit: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'ANNA AGRI AI',
    tagline: 'AAA Platform for Farmers - Tamil Nadu Smart Agriculture & Direct Marketplace',
    navHome: 'Home',
    navSchemes: 'Schemes',
    navRecommendations: 'Recommendations',
    navWeather: 'Weather Report',
    navSoilBooking: 'Soil Test Booking',
    navCropRecommender: 'Crop Advisor',
    navShopsNearby: 'Shops Nearby',
    navMarketplace: 'Farmer Direct Market',
    navSimulator: 'Eligibility Simulator',
    navDocuments: 'Doc Readiness',
    navKvkCenters: 'KVK & CSC Directory',
    navCalendar: 'Seasonal Calendar',
    navCalculator: 'Subsidy Calculator',
    navAdmin: 'Admin Console',
    navLogin: 'Login / Register',
    navLogout: 'Logout',
    navProfile: 'My Profile',
    navSaved: 'Saved Schemes',
    navChatbot: 'Anna AI Advisor',

    heroTitle: 'Find Government Agricultural Schemes Made For You',
    heroSubtitle: 'Intelligent, explainable scheme recommendations based on your land size, location, crop, and farming practices.',
    heroGetStarted: 'Get My Recommendations',
    heroExploreSchemes: 'Browse All Schemes',
    heroStatFarmers: 'Active Farmers Assisted',
    heroStatSchemes: 'Central & State Schemes',
    heroStatSubsidy: 'Estimated Benefits Mapped',
    heroStatAccuracy: 'Rule-Matching Precision',

    recTitle: 'Recommended Government Schemes',
    recSubtitle: 'Personalized based on your verified farming profile and local agricultural policies.',
    systemMatchScore: 'System Match Score',
    eligibleStatus: 'Eligible based on your profile',
    ineligibleStatus: 'Requires official criteria verification',
    whyMatchesYou: 'Why this scheme matches you:',
    benefitLabel: 'Key Benefit:',
    viewDetails: 'View Details',
    saveScheme: 'Save Scheme',
    savedScheme: 'Saved',
    allCategories: 'All Categories',
    filterByState: 'Filter by State',
    filterByCrop: 'Filter by Crop',
    filterByCategory: 'Filter by Category',
    sortByScore: 'Sort by Match Score',

    profileTitle: 'Farmer Profile & Agricultural Holdings',
    personalInfo: 'Personal Information',
    farmingInfo: 'Farming & Land Details',
    financialInfo: 'Financial Information',
    socialInfo: 'Social & Special Category',
    fullName: 'Full Name',
    age: 'Age (Years)',
    gender: 'Gender',
    mobile: 'Mobile Number',
    state: 'State',
    district: 'District',
    taluk: 'Taluk / Tehsil',
    village: 'Village / Gram Panchayat',
    landSize: 'Landholding Size (Acres)',
    landUnit: 'Land Unit',
    cropType: 'Primary Crop',
    secondaryCrop: 'Secondary Crop',
    irrigation: 'Irrigation Facility',
    annualIncome: 'Annual Income (₹)',
    farmerCategory: 'Farmer Category',
    saveProfile: 'Save & Update Profile',
    profileCompletion: 'Profile Completeness',

    chatTitle: 'Krishi AI Scheme Advisor',
    chatPlaceholder: 'Ask in English, தமிழ் or हिन्दी (e.g. "What schemes are available for rice farmers in Tamil Nadu?")...',
    chatSend: 'Send',
    chatVoiceListening: 'Listening to your voice... Speak clearly',
    chatDisclaimer: 'Responses are grounded in verified government scheme records.',

    searchPlaceholder: 'Search by scheme name, crop, state, subsidy, or keyword...',
    noResults: 'No matching government schemes found. Try adjusting your search query or filters.',
    close: 'Close',
    applyNow: 'Apply on Official Portal',
    officialSource: 'Official Portal',
    helpline: 'Toll-Free Helpline',
    readAloud: 'Read Aloud (Voice)',
    stopAudio: 'Stop Audio',
    downloadKit: 'Download Application Kit (PDF)'
  },
  ta: {
    appName: 'அண்ணா அக்ரி ஏஐ (AAA)',
    tagline: 'தமிழ்நாடு உழவர்களுக்கான நவீன வேளாண் வழிகாட்டி & நேரடி சந்தை',
    navHome: 'முகப்பு',
    navSchemes: 'அரசு திட்டங்கள்',
    navRecommendations: 'பரிந்துரைகள்',
    navWeather: 'வானிலை அறிக்கை',
    navSoilBooking: 'மண் பரிசோதனை',
    navCropRecommender: 'பயிர் ஆலோசகர்',
    navShopsNearby: 'அருகிலுள்ள கடைகள்',
    navMarketplace: 'உழவர் நேரடி சந்தை',
    navSimulator: 'தகுதி கால்குலேட்டர்',
    navDocuments: 'ஆவண சரிபார்ப்பு',
    navKvkCenters: 'கே.வி.கே மையங்கள்',
    navCalendar: 'பருவ கால அட்டவணை',
    navCalculator: 'மானிய கால்குலேட்டர்',
    navAdmin: 'நிர்வாக மையம்',
    navLogin: 'உள்நுழைவு / பதிவு',
    navLogout: 'வெளியேறு',
    navProfile: 'எனது விவரம்',
    navSaved: 'சேமிக்கப்பட்டவை',
    navChatbot: 'அண்ணா AI வழிகாட்டி',

    heroTitle: 'உங்களுக்காகவே உருவாக்கப்பட்ட அரசு வேளாண் நலத்திட்டங்கள்',
    heroSubtitle: 'உங்கள் நில அளவு, மாவட்டம், பயிர் மற்றும் விவசாய முறைக்கு ஏற்ற மிகச்சரியான அரசு உதவித் திட்டங்களை உடனே கண்டறியுங்கள்.',
    heroGetStarted: 'எனக்கான திட்டங்களை காண்க',
    heroExploreSchemes: 'அனைத்து திட்டங்கள்',
    heroStatFarmers: 'பயன்பெற்ற விவசாயிகள்',
    heroStatSchemes: 'மத்திய & மாநில திட்டங்கள்',
    heroStatSubsidy: 'நேரடி மானிய வழிகாட்டல்',
    heroStatAccuracy: 'துல்லியமான தகுதி பொருத்தம்',

    recTitle: 'உங்களுக்கு பரிந்துரைக்கப்பட்ட அரசு திட்டங்கள்',
    recSubtitle: 'உங்கள் சுயவிவரம் மற்றும் அரசு வழிகாட்டுதல்களின் அடிப்படையில் கணக்கிடப்பட்டது.',
    systemMatchScore: 'கணினி பொருத்த மதிப்பீடு',
    eligibleStatus: 'உங்கள் சுயவிவரப்படி நீங்கள் தகுதியுடையவர்',
    ineligibleStatus: 'அதிகாரப்பூர்வ நிபந்தனை சரிபார்ப்பு தேவை',
    whyMatchesYou: 'இந்த திட்டம் உங்களுக்கு எவ்வாறு பொருந்துகிறது:',
    benefitLabel: 'முக்கிய பலன்:',
    viewDetails: 'முழு விவரம்',
    saveScheme: 'சேமிக்க',
    savedScheme: 'சேமிக்கப்பட்டது',
    allCategories: 'அனைத்து பிரிவுகள்',
    filterByState: 'மாநிலம் வாரியாக',
    filterByCrop: 'பயிர் வாரியாக',
    filterByCategory: 'வகை வாரியாக',
    sortByScore: 'பொருத்த மதிப்பெண் வரிசை',

    profileTitle: 'விவசாயி சுயவிவரம் & நில விவரங்கள்',
    personalInfo: 'தனிநபர் தகவல்கள்',
    farmingInfo: 'விவசாயம் மற்றும் நில விவரங்கள்',
    financialInfo: 'நிதி விவரங்கள்',
    socialInfo: 'சமூக பிரிவு & சிறப்பு தகுதிகள்',
    fullName: 'முழு பெயர்',
    age: 'வயது',
    gender: 'பாலினம்',
    mobile: 'கைபேசி எண்',
    state: 'மாநிலம்',
    district: 'மாவட்டம்',
    taluk: 'வட்டம் / தாலுகா',
    village: 'கிராமம் / பஞ்சாயத்து',
    landSize: 'நில அளவு (ஏக்கர்)',
    landUnit: 'நில அலகு',
    cropType: 'முதன்மை பயிர்',
    secondaryCrop: 'துணை பயிர்',
    irrigation: 'பாசன வசதி',
    annualIncome: 'ஆண்டு வருமானம் (₹)',
    farmerCategory: 'விவசாயி பிரிவு',
    saveProfile: 'சுயவிவரத்தை புதுப்பிக்கவும்',
    profileCompletion: 'சுயவிவர பூர்த்தி சதவீதம்',

    chatTitle: 'கிருஷி AI வேளாண்மை உதவியாளர்',
    chatPlaceholder: 'தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள் (எ.கா: "நெல் விவசாயிகளுக்கு என்னென்ன மானியங்கள் உள்ளன?")...',
    chatSend: 'அனுப்புக',
    chatVoiceListening: 'உங்கள் குரல் கேட்கப்படுகிறது... பேசுங்கள்',
    chatDisclaimer: 'அனைத்து பதில்களும் அரசு சரிபார்க்கப்பட்ட தகவல்களை அடிப்படையாகக் கொண்டவை.',

    searchPlaceholder: 'திட்டப் பெயர், பயிர், மானியம் அல்லது முக்கிய வார்த்தை மூலம் தேடவும்...',
    noResults: 'பொருத்தமான திட்டங்கள் எதுவும் கிடைக்கவில்லை. தேடல் வார்த்தையை மாற்றி முயற்சிக்கவும்.',
    close: 'மூடுக',
    applyNow: 'அரசு இணையதளத்தில் விண்ணப்பிக்க',
    officialSource: 'அதிகாரப்பூர்வ இணையதளம்',
    helpline: 'கட்டணமில்லா உதவி எண்',
    readAloud: 'குரல் வழியே வாசிக்க',
    stopAudio: 'ஆடியோவை நிறுத்து',
    downloadKit: 'விண்ணப்ப கையேட்டை பதிவிறக்கு (PDF)'
  },
  hi: {
    appName: 'अन्ना एग्री एआई (AAA)',
    tagline: 'तमिलनाडु किसानों हेतु एआई संचालित कृषि कल्याण एवं प्रत्यक्ष बाजार प्रणाली',
    navHome: 'होम',
    navSchemes: 'सरकारी योजनाएं',
    navRecommendations: 'अनुशंसित योजनाएं',
    navWeather: 'मौसम रिपोर्ट',
    navSoilBooking: 'मृदा जांच बुकिंग',
    navCropRecommender: 'फसल सलाहकार',
    navShopsNearby: 'निकटतम दुकानें',
    navMarketplace: 'किसान डायरेक्ट मार्केट',
    navSimulator: 'पात्रता सिमुलेटर',
    navDocuments: 'दस्तावेज तैयारी',
    navKvkCenters: 'केवीके केंद्र',
    navCalendar: 'मौसमी कैलेंडर',
    navCalculator: 'सब्सिडी कैलकुलेटर',
    navAdmin: 'प्रशासक डैशबोर्ड',
    navLogin: 'लॉग इन / पंजीकरण',
    navLogout: 'लॉग आउट',
    navProfile: 'मेरी प्रोफाइल',
    navSaved: 'सहेजी गई योजनाएं',
    navChatbot: 'अन्ना एआई सलाहकार',

    heroTitle: 'आपके खेत और फसल के लिए सही सरकारी योजनाएं खोजें',
    heroSubtitle: 'आपकी जमीन, फसल, आय और राज्य के आधार पर सटीक और पारदर्शी योजना अनुशंसा प्राप्त करें।',
    heroGetStarted: 'मेरी योजनाएं देखें',
    heroExploreSchemes: 'सभी योजनाएं ब्राउज़ करें',
    heroStatFarmers: 'सक्रिय किसान लाभान्वित',
    heroStatSchemes: 'केंद्र व राज्य योजनाएं',
    heroStatSubsidy: 'अनुमानित लाभ मार्गदर्शन',
    heroStatAccuracy: 'सटीक पात्रता मिलान',

    recTitle: 'आपके लिए अनुशंसित सरकारी योजनाएं',
    recSubtitle: 'आपकी सत्यापित कृषि प्रोफाइल एवं सरकारी नियमों के अनुसार तैयार की गई सूची।',
    systemMatchScore: 'सिस्टम मैच स्कोर',
    eligibleStatus: 'आपकी प्रोफाइल के अनुसार आप पात्र हैं',
    ineligibleStatus: 'आधिकारिक शर्तों का सत्यापन आवश्यक',
    whyMatchesYou: 'यह योजना आपके अनुकूल क्यों है:',
    benefitLabel: 'प्रमुख लाभ:',
    viewDetails: 'विस्तृत जानकारी',
    saveScheme: 'योजना सहेजें',
    savedScheme: 'सहेजी गई',
    allCategories: 'सभी श्रेणियां',
    filterByState: 'राज्य अनुसार',
    filterByCrop: 'फसल अनुसार',
    filterByCategory: 'श्रेणी अनुसार',
    sortByScore: 'मैच स्कोर के अनुसार',

    profileTitle: 'किसान प्रोफाइल एवं कृषि भूमि विवरण',
    personalInfo: 'व्यक्तिगत जानकारी',
    farmingInfo: 'कृषि एवं भूमि विवरण',
    financialInfo: 'वित्तीय स्थिति',
    socialInfo: 'सामाजिक एवं विशेष श्रेणी',
    fullName: 'पूरा नाम',
    age: 'आयु (वर्ष)',
    gender: 'लिंग',
    mobile: 'मोबाइल नंबर',
    state: 'राज्य',
    district: 'जिला',
    taluk: 'तहसील',
    village: 'ग्राम पंचायत',
    landSize: 'कृषि भूमि (एकड़)',
    landUnit: 'इकाई',
    cropType: 'मुख्य फसल',
    secondaryCrop: 'गौण फसल',
    irrigation: 'सिंचाई सुविधा',
    annualIncome: 'वार्षिक आय (₹)',
    farmerCategory: 'किसान श्रेणी',
    saveProfile: 'प्रोफाइल सहेजें',
    profileCompletion: 'प्रोफाइल पूर्णता',

    chatTitle: 'कृषि एआई योजना सलाहकार',
    chatPlaceholder: 'हिंदी या अंग्रेजी में पूछें (उदा. "धान किसानों के लिए कौन सी सब्सिडी उपलब्ध है?")...',
    chatSend: 'पूछें',
    chatVoiceListening: 'आपकी आवाज सुनी जा रही है... कृपया बोलें',
    chatDisclaimer: 'उत्तर आधिकारिक सरकारी योजनाओं पर आधारित हैं।',

    searchPlaceholder: 'योजना, फसल, राज्य, सब्सिडी या कीवर्ड से खोजें...',
    noResults: 'कोई योजना नहीं मिली। कृपया अपने खोज शब्द या फिल्टर बदलें।',
    close: 'बंद करें',
    applyNow: 'आधिकारिक पोर्टल पर आवेदन करें',
    officialSource: 'आधिकारिक पोर्टल',
    helpline: 'टोल-फ्री हेल्पलाइन',
    readAloud: 'आवाज में सुनें',
    stopAudio: 'ऑडियो रोकें',
    downloadKit: 'आवेदन किट डाउनलोड करें (PDF)'
  }
};
