import React, { useState } from 'react';
import { 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  MessageSquareText, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Users, 
  Award, 
  TrendingUp, 
  FileCheck,
  Wheat,
  ExternalLink,
  CloudSun,
  FlaskConical,
  Store,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { Language, Scheme, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HeroLandingProps {
  language: Language;
  onGetStarted: () => void;
  onExploreSchemes: () => void;
  onNavigateTab?: (tab: string) => void;
  featuredSchemes: Scheme[];
  onViewScheme: (schemeId: string) => void;
  activeProfile: FarmerProfile;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  language,
  onGetStarted,
  onExploreSchemes,
  onNavigateTab,
  featuredSchemes,
  onViewScheme,
  activeProfile
}) => {
  const t = TRANSLATIONS[language];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ANNA AGRI AI (AAA) calculate my scheme match percentage?',
      q_ta: 'அண்ணா அக்ரி AI எனது திட்டப் பொருத்த சதவீதத்தை எவ்வாறு கணக்கிடுகிறது?',
      q_hi: 'ANNA AGRI AI मेरी योजना मिलान प्रतिशत की गणना कैसे करता है?',
      a: 'The system uses a hybrid recommendation model grounded in Tamil Nadu and Central schemes. Stage 1 executes strict rule-based filtering (mandatory age limits, land boundaries, state targeting, and crop types). Stage 2 computes a multi-attribute weighted score based on location fit (20%), crop alignment (15%), landholding scale (15%), annual income (15%), and social categories (10%).'
    },
    {
      q: 'How can farmers fix prices and sell directly to customers from other states?',
      q_ta: 'விவசாயிகள் தங்கள் விளைபொருளுக்கு தாங்களே விலை நிர்ணயித்து பிற மாநில வாடிக்கையாளர்களுக்கு எவ்வாறு விற்பனை செய்யலாம்?',
      q_hi: 'किसान अपनी फसल का मूल्य खुद तय करके अन्य राज्यों के ग्राहकों को कैसे बेच सकते हैं?',
      a: 'Through the AAA Direct Marketplace, farmers can list their harvest (Vegetables, Shallots, Banana, Rice, Spices) with their own fixed price per kg or quintal. Society members, bulk buyers, and residential communities from Kerala, Karnataka, Andhra Pradesh, and other states can place direct purchase inquiries without middlemen commission.'
    },
    {
      q: 'Is soil test slot booking at TNAU labs completely free?',
      q_ta: 'TNAU மண் பரிசோதனை நிலையங்களில் முன்பதிவு முற்றிலும் இலவசமா?',
      q_hi: 'क्या TNAU प्रयोगशालाओं में मिट्टी परीक्षण स्लॉट बुकिंग पूरी तरह से मुफ्त है?',
      a: 'Yes! Under the Tamil Nadu Soil Health Card Mission, testing for 12 primary, secondary, and micronutrients is 100% subsidized by the government. The platform provides an instant appointment token with scientific sample collection guidelines.'
    },
    {
      q: 'Are the scheme application links and deadlines official?',
      q_ta: 'திட்ட விண்ணப்ப இணைப்புகள் மற்றும் காலக்கெடு அதிகாரப்பூர்வமானவையா?',
      q_hi: 'क्या योजना आवेदन लिंक और अंतिम तिथियां आधिकारिक हैं?',
      a: 'Yes. All scheme dossiers link directly to verified government portals (pmkisan.gov.in, pmfby.gov.in, tn.gov.in/agriculture, agrimachinery.nic.in). No third-party or fake intermediaries are involved.'
    }
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-radial from-emerald-950 via-stone-900 to-stone-950 text-white p-8 sm:p-14 border border-stone-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-lg backdrop-blur-xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>ANNA AGRI AI (AAA Platform) · Dedicated to Tamil Nadu Farmers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white" style={{ textWrap: 'balance' }}>
            {language === 'ta' 
              ? 'அண்ணா அக்ரி ஏஐ (AAA) - உழவர் நலன், வானிலை, மண் பரிசோதனை & நேரடி சந்தை'
              : 'ANNA AGRI AI (AAA Platform) — Tamil Nadu Smart Agriculture & Direct Marketplace'}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
            {language === 'ta'
              ? 'விவசாயிகள் தங்கள் விளைபொருளுக்கு தாங்களே விலை நிர்ணயிக்கும் நேரடி சந்தை, மாவட்ட வானிலை அறிக்கை, TNAU மண் பரிசோதனை முன்பதிவு, மற்றும் 100% அரசு மானிய திட்டங்கள்.'
              : 'Empowering Tamil Nadu farmers with real-time agro-weather, TNAU soil test slot booking, crop recommendations, government welfare subsidies, and a direct farmgate marketplace where farmers fix their own prices.'}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onGetStarted}
              className="px-6 py-3.5 text-sm font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>{t.heroGetStarted}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreSchemes}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>{t.heroExploreSchemes}</span>
            </button>
          </div>

          {/* Active Farmer Indicator */}
          <div className="pt-4 border-t border-stone-800/80 flex items-center gap-2 text-xs text-stone-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>Currently personalized for: <strong className="text-white">{activeProfile.fullName}</strong> ({activeProfile.landholdingSize} Acres {activeProfile.cropType}, {activeProfile.state})</span>
          </div>

        </div>

        {/* Subtle Decorative Background Motif */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
          <Wheat className="w-[500px] h-[500px] text-emerald-300" />
        </div>
      </section>

      {/* STATISTICAL COUNTERS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800 block">38 Districts</span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">Tamil Nadu Agro-Met Weather</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800 block">100% Free</span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">TNAU Soil Test Token Booking</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800 block">Farmer-Fixed</span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">Direct Produce Pricing</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-800 block">Pan-India</span>
          <span className="text-xs text-stone-500 font-medium mt-1 block">Direct Society / Inter-State Buyers</span>
        </div>
      </section>

      {/* CORE AAA PLATFORM PILLARS (Tamil Nadu Farmers Special Suite) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Integrated Tamil Nadu Farmer Services
            </span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1">
              {language === 'ta' ? 'அண்ணா அக்ரி AI முக்கிய சேவைகள்' : 'ANNA AGRI AI (AAA) Core Capabilities'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Comprehensive tools designed specifically for Tamil Nadu agriculture and inter-state direct commerce.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Pillar 1: Weather Report */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('weather')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? 'வேளாண் வானிலை அறிக்கை' : 'District Agro-Weather Report'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Real-time microclimate metrics for Thanjavur, Madurai, Coimbatore, Salem and all TN districts with 5-day rain alerts & spraying advisories.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>View Weather Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 2: Soil Test Slot Booking */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('soil_booking')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? 'மண் பரிசோதனை முன்பதிவு' : 'Soil Test Slot Booking'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Book official appointment slots at TNAU research institutes or mobile testing vans. 12-nutrient lab report with instant printable token slips.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Book Laboratory Slot</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 3: Crop Recommender */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('crops')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? 'பயிர் தேர்வு வழிகாட்டி' : 'Crop Recommendation Engine'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Scientifically recommended crop varieties for Kuruvai, Samba, and Summer seasons tailored to Tamil Nadu soil types and net profit projections.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Explore Crop Advice</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 4: Shops & Depots Nearby */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('shops')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? 'அருகிலுள்ள இடுபொருள் & இயந்திர மையங்கள்' : 'Shops & Farm Machinery Depots (38 Districts)'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Verified PACCS cooperative societies, government AEC seed counters, fertilizer stockists, and Custom Hiring Centers (CHC) across all 38 districts.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Locate Nearby Shops</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 5: 38 Districts Farmer Profiles Directory */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('farmer_directory')}
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                  {language === 'ta' ? '38 மாவட்ட விவசாயிகள் விவரக் குறிப்பேடு' : '38-Districts Farmer Directory'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Explore genuine farmer profiles, landholding metrics, crops, and verified soil card statuses from Ariyalur to Virudhunagar.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <span>Browse All 38 Districts</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 6: Farmer-Fixed Price Marketplace */}
          <div 
            onClick={() => onNavigateTab && onNavigateTab('market')}
            className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/80 border-2 border-amber-300 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between sm:col-span-2 lg:col-span-3"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900">
                  Zero Middlemen · Direct Farmgate
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {language === 'ta' 
                    ? 'உழவர் நேரடி சந்தை — விவசாயிகள் தாங்களே விலை நிர்ணயிக்கும் தளம்'
                    : 'Farmer-Fixed Price Marketplace — Sell Vegetables & Crops Directly'}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-2xl">
                  Tamil Nadu farmers can list fresh vegetables, country onions, bananas, organic rice, and pulses with <strong>their own fixed price</strong>. Customers, residential housing societies, and buyers from Kerala, Karnataka, Maharashtra and other states order directly at farmgate prices with inter-state transport support.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-amber-200/80 flex items-center justify-between text-xs font-bold text-amber-900">
              <span>Open Farmer Marketplace & Post Produce</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Transparent Architecture
          </span>
          <h2 className="text-2xl font-bold text-stone-900">
            How ANNA AGRI AI Evaluates Schemes & Protects Farmers
          </h2>
          <p className="text-xs text-stone-500">
            A 4-stage explainable pipeline ensuring every recommendation is backed by real government criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              01
            </span>
            <h3 className="text-sm font-bold text-stone-900">Profile Snapshot</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Captures landholding scale, crop variety, irrigation source, state/district, annual income, and farmer social category.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              02
            </span>
            <h3 className="text-sm font-bold text-stone-900">Mandatory Rule Check</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Stage 1 filtering eliminates ineligible schemes based on statutory age limits, land maximums, and state geographic boundaries.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              03
            </span>
            <h3 className="text-sm font-bold text-stone-900">Weighted AI Match Score</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Stage 2 scores surviving schemes with configurable weights across location, crop, landholding, income, and special provisions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              04
            </span>
            <h3 className="text-sm font-bold text-stone-900">Direct Application Kit</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Generates an explainable "Why This Matches You" checklist, required document list, and direct links to official government submission portals.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED SCHEMES SPOTLIGHT */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Verified Government Schemes
            </span>
            <h2 className="text-2xl font-bold text-stone-900">
              High-Impact Flagship Agricultural Welfare
            </h2>
          </div>
          <button
            onClick={onExploreSchemes}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 15+ Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSchemes.slice(0, 4).map(sch => (
            <div
              key={sch.id}
              onClick={() => onViewScheme(sch.id)}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="text-[11px] text-stone-400 font-medium mb-1">
                  {sch.level} Scheme · {sch.category}
                </div>
                <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {sch.scheme_name}
                </h3>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                  {sch.short_description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider block">
                  Benefit
                </span>
                <span className="text-xs font-bold text-stone-900 block truncate">
                  {sch.benefit_amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Clear Answers
          </span>
          <h2 className="text-2xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const question = language === 'ta' ? faq.q_ta : language === 'hi' ? faq.q_hi : faq.q;
            const isOpen = openFaq === index;

            return (
              <div 
                key={index}
                className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-stone-900 hover:bg-stone-50"
                >
                  <span>{question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-stone-600 border-t border-stone-100 leading-relaxed bg-stone-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST FOOTER */}
      <footer className="pt-8 border-t border-stone-200 text-xs text-stone-500 text-center space-y-2">
        <p>
          KisanKalyan AI Government Schemes Recommendation Platform · Grounded strictly in publicly verified agricultural welfare guidelines.
        </p>
        <p className="text-[11px] text-stone-400">
          Official scheme sources include Ministry of Agriculture & Farmers Welfare, Government of India, and State Agriculture Departments.
        </p>
      </footer>

    </div>
  );
};
