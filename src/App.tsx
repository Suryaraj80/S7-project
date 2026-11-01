import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sprout, 
  Search, 
  SlidersHorizontal, 
  Filter, 
  Bookmark, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  FlaskConical,
  MessageSquare,
  PhoneCall,
  CloudLightning,
  History,
  Calculator,
  FileCheck,
  RefreshCw,
  Menu,
  Bell,
  Globe,
  User as UserIcon,
  ChevronRight,
  ShoppingBag,
  Clock,
  UserCheck
} from 'lucide-react';
import { 
  User, 
  FarmerProfile, 
  Scheme, 
  RecommendationResult, 
  Language, 
  AppNotification, 
  RecommendationSession,
  RecommendationWeights,
  DocumentReadinessItem,
  TNDistrictFarmer
} from './types';
import { StorageService } from './services/storageService';
import { generateRecommendations } from './utils/recommendationEngine';
import { TRANSLATIONS } from './utils/translations';
import { DEMO_PROFILES } from './data/demoData';

// Components
import { SidebarNav } from './components/SidebarNav';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { HeroLanding } from './components/HeroLanding';
import { FarmerHomeView } from './components/FarmerHomeView';
import { AdminHomeView } from './components/AdminHomeView';
import { BuyerHomeView } from './components/BuyerHomeView';
import { RecommendationCard } from './components/RecommendationCard';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { NotificationPanel } from './components/NotificationPanel';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FarmerDirectoryView } from './components/FarmerDirectoryView';

// Extra 10 Features Components
import { EligibilitySimulator } from './components/EligibilitySimulator';
import { DocumentLocker } from './components/DocumentLocker';
import { KvkLocator } from './components/KvkLocator';
import { SeasonalCalendar } from './components/SeasonalCalendar';
import { SubsidyCalculator } from './components/SubsidyCalculator';
import { SoilHealthAdvisor } from './components/SoilHealthAdvisor';
import { CommunityStories } from './components/CommunityStories';
import { GrievanceEscalation } from './components/GrievanceEscalation';
import { CalamityReliefGuide } from './components/CalamityReliefGuide';
import { RecommendationHistoryView } from './components/RecommendationHistoryView';

// Flagship Tamil Nadu Farmer & Marketplace Components
import { WeatherWidget } from './components/WeatherWidget';
import { CropRecommender } from './components/CropRecommender';
import { SoilTestBookingView } from './components/SoilTestBookingView';
import { AgriShopsNearby } from './components/AgriShopsNearby';
import { FarmerMarketplace } from './components/FarmerMarketplace';
import { BillingInvoiceView } from './components/BillingInvoiceView';
import { DeliveryTrackingView } from './components/DeliveryTrackingView';
import { useAppTheme } from './context/ThemeContext';

export default function App() {
  const { theme, setTheme, isYellowRed } = useAppTheme();
  // 1. Core State
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [profile, setProfile] = useState<FarmerProfile>(() => StorageService.getProfile(currentUser.id));
  const [schemes, setSchemes] = useState<Scheme[]>(() => StorageService.getSchemes());
  const [savedIds, setSavedIds] = useState<string[]>(() => StorageService.getSavedSchemeIds(currentUser.id));
  const [weights, setWeights] = useState<RecommendationWeights>(() => StorageService.getWeights());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => StorageService.getNotifications());
  const [documentItems, setDocumentItems] = useState<DocumentReadinessItem[]>(() => StorageService.getDocumentItems());
  const [historySessions, setHistorySessions] = useState<RecommendationSession[]>(() => StorageService.getRecommendationHistory(currentUser.id));

  // 2. Navigation & UI State (Sidebar Layout)
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>(() => {
    const role = currentUser.role;
    if (role === 'ADMIN') return 'admin_home';
    if (role === 'BUYER') return 'buyer_home';
    return 'home';
  });
  const [moreSubTab, setMoreSubTab] = useState<string>('simulator');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 3. Modals State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  // 4. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'benefit'>('score');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  // 5. Track Pending Admin Approvals for Soil Testing
  const [pendingSoilCount, setPendingSoilCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('aaa_soil_test_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.filter((b: any) => b.status === 'Pending Admin Approval').length;
      }
    } catch {}
    return 1;
  });

  useEffect(() => {
    const updatePendingCount = () => {
      try {
        const raw = localStorage.getItem('aaa_soil_test_bookings');
        if (raw) {
          const parsed = JSON.parse(raw);
          setPendingSoilCount(parsed.filter((b: any) => b.status === 'Pending Admin Approval').length);
        }
      } catch {}
    };

    window.addEventListener('storage', updatePendingCount);
    window.addEventListener('soil_bookings_updated', updatePendingCount);
    return () => {
      window.removeEventListener('storage', updatePendingCount);
      window.removeEventListener('soil_bookings_updated', updatePendingCount);
    };
  }, []);

  const t = TRANSLATIONS[language];

  // Refresh user-specific data on persona switch
  const handleSelectUser = (newUser: User) => {
    setCurrentUser(newUser);
    StorageService.setCurrentUser(newUser);
    const newProfile = StorageService.getProfile(newUser.id);
    setProfile(newProfile);
    setSavedIds(StorageService.getSavedSchemeIds(newUser.id));
    setHistorySessions(StorageService.getRecommendationHistory(newUser.id));
    if (newUser.role === 'ADMIN') {
      setActiveTab('admin_home');
    } else if (newUser.role === 'BUYER') {
      setActiveTab('buyer_home');
    } else {
      setActiveTab('home');
    }
  };

  // Enforce strict role-based access control on active view
  useEffect(() => {
    const role = currentUser.role;
    const adminAllowedTabs = [
      'admin_home',
      'soil_approvals',
      'schemes_mgr',
      'farmer_oversight',
      'paccs_oversight',
      'weights_config',
      'broadcast',
      'analytics',
      'admin_billing',
      'delivery_tracking'
    ];
    const buyerAllowedTabs = [
      'buyer_home',
      'market',
      'delivery_tracking',
      'buyer_farmers',
      'weather',
      'shops',
      'buyer_billing'
    ];
    const farmerAllowedTabs = [
      'home',
      'farmer_billing',
      'delivery_tracking',
      'schemes',
      'recommendations',
      'weather',
      'soil_booking',
      'crops',
      'shops',
      'market',
      'farmer_directory',
      'saved',
      'more',
      'simulator',
      'calculator',
      'documents',
      'kvk',
      'calendar',
      'soil',
      'stories',
      'grievance',
      'calamity',
      'history'
    ];

    if (role === 'ADMIN' && !adminAllowedTabs.includes(activeTab)) {
      setActiveTab('admin_home');
    } else if (role === 'BUYER' && !buyerAllowedTabs.includes(activeTab)) {
      setActiveTab('buyer_home');
    } else if (role === 'FARMER' && !farmerAllowedTabs.includes(activeTab)) {
      setActiveTab('home');
    }
  }, [currentUser.role, activeTab]);

  // Switch persona from the 38-District Farmer Registry
  const handleSelectFarmerFromDirectory = (farmer: TNDistrictFarmer) => {
    const matchingUser: User = {
      id: farmer.id,
      name: farmer.farmerName,
      email: `${farmer.id}@kisan.tn.gov.in`,
      mobile: farmer.mobile,
      role: 'FARMER',
      state: 'Tamil Nadu',
      district: farmer.district,
      createdAt: '2025-01-01',
      status: 'active'
    };

    const matchingProfile: FarmerProfile = {
      userId: farmer.id,
      fullName: farmer.farmerName,
      age: farmer.age,
      gender: farmer.gender,
      mobile: farmer.mobile,
      email: `${farmer.id}@kisan.tn.gov.in`,
      state: 'Tamil Nadu',
      district: farmer.district,
      taluk: farmer.taluk,
      village: farmer.village,
      landholdingSize: farmer.landholdingSize,
      landUnit: farmer.landUnit,
      ownershipType: farmer.ownershipType,
      cropType: farmer.primaryCrop,
      secondaryCrop: farmer.secondaryCrop,
      farmingType: 'Conventional',
      irrigationAvailable: farmer.irrigationType !== 'Rainfed',
      irrigationType: farmer.irrigationType,
      soilType: farmer.soilType,
      hasLivestock: true,
      livestockTypes: ['Cattle'],
      annualIncome: farmer.annualIncome,
      incomeCategory: farmer.annualIncome < 250000 ? '1 to 2.5 Lakhs' : '2.5 to 5 Lakhs',
      isBpl: farmer.annualIncome < 100000,
      hasAadhaarLinkedBank: true,
      farmerCategory: 'OBC',
      smallMarginalClassification: farmer.landholdingSize <= 2.5 ? 'Marginal' : farmer.landholdingSize <= 5 ? 'Small' : 'Medium',
      isWomanFarmer: farmer.gender === 'Female',
      hasDisability: false,
      profileCompletionPercentage: 90,
      lastUpdated: new Date().toISOString()
    };

    setCurrentUser(matchingUser);
    StorageService.setCurrentUser(matchingUser);
    setProfile(matchingProfile);
    StorageService.saveProfile(matchingProfile);
    setActiveTab('home');
  };

  // Run Recommendation Engine
  const recommendationResults = useMemo(() => {
    return generateRecommendations(profile, schemes, weights);
  }, [profile, schemes, weights]);

  // Save session snapshot to history if recommendations change significantly
  useEffect(() => {
    if (recommendationResults.length > 0 && currentUser.role === 'FARMER') {
      const newSession: RecommendationSession = {
        id: 'sess-' + Date.now(),
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        farmerName: profile.fullName,
        state: profile.state,
        crop: profile.cropType,
        landSize: profile.landholdingSize,
        totalRecommendations: recommendationResults.length,
        results: recommendationResults.map(r => ({
          schemeId: r.scheme.id,
          schemeName: r.scheme.scheme_name,
          score: r.matchScore,
          isEligible: r.isEligible
        }))
      };
      StorageService.saveRecommendationSession(newSession);
      setHistorySessions(StorageService.getRecommendationHistory(currentUser.id));
    }
  }, [profile.lastUpdated, currentUser.id]);

  // Handlers
  const handleProfileSave = (updated: FarmerProfile) => {
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleToggleSave = (schemeId: string) => {
    StorageService.toggleSaveScheme(currentUser.id, schemeId);
    setSavedIds(StorageService.getSavedSchemeIds(currentUser.id));
  };

  const handleSaveWeights = (newWeights: RecommendationWeights) => {
    setWeights(newWeights);
    StorageService.saveWeights(newWeights);
  };

  const handleSaveScheme = (sch: Scheme) => {
    StorageService.addOrUpdateScheme(sch);
    setSchemes(StorageService.getSchemes());
  };

  const handleDeleteScheme = (schemeId: string) => {
    StorageService.deleteScheme(schemeId);
    setSchemes(StorageService.getSchemes());
  };

  const handleSendNotification = (notif: AppNotification) => {
    StorageService.addNotification(notif);
    setNotifications(StorageService.getNotifications());
  };

  const handleMarkNotificationRead = (notifId: string) => {
    StorageService.markNotificationAsRead(notifId);
    setNotifications(StorageService.getNotifications());
  };

  const handleToggleDocument = (docId: string) => {
    const updated = StorageService.toggleDocumentReady(docId);
    setDocumentItems(updated);
  };

  // Filter & sort recommendations
  const filteredRecommendations = useMemo(() => {
    return recommendationResults.filter(rec => {
      const sch = rec.scheme;
      
      // Search
      const searchMatch = !searchQuery || 
        sch.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sch.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const categoryMatch = filterCategory === 'All' || sch.category === filterCategory;

      // State
      const stateMatch = filterState === 'All' || sch.state === 'All India' || sch.state === filterState;

      // Eligible
      const eligibleMatch = !filterEligibleOnly || rec.isEligible;

      return searchMatch && categoryMatch && stateMatch && eligibleMatch;
    }).sort((a, b) => {
      if (sortBy === 'score') {
        if (a.isEligible && !b.isEligible) return -1;
        if (!a.isEligible && b.isEligible) return 1;
        return b.matchScore - a.matchScore;
      }
      if (sortBy === 'benefit') return b.scheme.estimated_monetary_value - a.scheme.estimated_monetary_value;
      return a.scheme.scheme_name.localeCompare(b.scheme.scheme_name);
    });
  }, [recommendationResults, searchQuery, filterCategory, filterState, filterEligibleOnly, sortBy]);

  // Selected scheme object for modal
  const selectedSchemeObj = useMemo(() => {
    if (!selectedSchemeId) return null;
    return schemes.find(s => s.id === selectedSchemeId) || null;
  }, [selectedSchemeId, schemes]);

  const selectedRecommendation = useMemo(() => {
    if (!selectedSchemeId) return undefined;
    return recommendationResults.find(r => r.scheme.id === selectedSchemeId);
  }, [selectedSchemeId, recommendationResults]);

  // Saved schemes list
  const savedRecommendations = useMemo(() => {
    return recommendationResults.filter(r => savedIds.includes(r.scheme.id));
  }, [recommendationResults, savedIds]);

  // Title for current view
  const currentViewTitle = useMemo(() => {
    switch (activeTab) {
      case 'home': return language === 'ta' ? 'உழவர் கட்டுப்பாட்டு மையம்' : 'Farmer Command Center';
      case 'admin_home': return language === 'ta' ? 'வேளாண்மை அதிகாரி கட்டுப்பாட்டு மையம்' : 'State Agricultural Officer Command Center';
      case 'buyer_home': return language === 'ta' ? 'உழவர் நேரடி விளைபொருள் கொள்முதல் மையம்' : 'Inter-State Produce Procurement Hub';
      case 'soil_approvals': return language === 'ta' ? 'மண் பரிசோதனை அதிகாரி ஒப்புதல் பலகை' : 'Soil Test Slot Approvals Queue';
      case 'schemes_mgr': return language === 'ta' ? 'நலத்திட்டங்கள் & நெறிமுறைகள் மேலாண்மை' : 'Welfare Schemes & Rules Manager';
      case 'weights_config': return language === 'ta' ? 'AI படிமுறை எடைகள் உள்ளமைவு' : 'AI Recommendation Weights';
      case 'farmer_oversight': return language === 'ta' ? '38 மாவட்ட உழவர் பதிவேடு மேற்பார்வை' : '38-Districts Farmer Registry Oversight';
      case 'paccs_oversight': return language === 'ta' ? 'PACCS & கூட்டுறவு கிடங்குகள் கண்காணிப்பு' : 'PACCS & Agri Depots Oversight';
      case 'broadcast': return language === 'ta' ? 'உழவர் அவசர எச்சரிக்கை ஒளிபரப்பு' : 'Farmer Emergency Broadcast Desk';
      case 'analytics': return language === 'ta' ? 'மானியம் வழங்கல் புள்ளிவிவரம்' : 'Disbursement Analytics & Metrics';
      case 'admin_billing': return language === 'ta' ? 'மாநில வேளாண் வர்த்தகம் & விலைப்பட்டியல் தணிக்கை' : 'Statewide Trade Invoicing & DBT Audit Ledger';
      case 'buyer_billing': return language === 'ta' ? 'கொள்முதல் விலைப்பட்டியல் & இ-வே பில்' : 'Procurement Tax Invoices & E-Way Bills';
      case 'farmer_billing': return language === 'ta' ? 'உழவர் விற்பனை ரசீதுகள் & வங்கி வரவு' : 'Farmgate Sales Receipts & Direct Credit Invoices';
      case 'buyer_farmers': return language === 'ta' ? '38 மாவட்ட நேரடி உழவர் பட்டியல்' : '38-Districts Producer Directory';
      case 'weather': return language === 'ta' ? 'வானிலை அறிக்கை (38 மாவட்டங்கள்)' : 'Agro-Weather (38 Districts)';
      case 'soil_booking': return language === 'ta' ? 'மண் பரிசோதனை முன்பதிவு & அடையாள அட்டை' : 'Soil Test Slot Booking & Approvals';
      case 'crops': return language === 'ta' ? 'பயிர் பரிந்துரை AI' : 'Crop Recommender AI';
      case 'shops': return language === 'ta' ? 'வேளாண் அங்காடிகள் & PACCS' : 'Agri Shops Directory (38 Districts)';
      case 'market': return language === 'ta' ? 'விவசாயிகள் நேரடி சந்தை' : 'Farmgate Marketplace';
      case 'farmer_directory': return language === 'ta' ? '38 மாவட்ட விவசாயிகள் விவரக் குறிப்பேடு' : '38-Districts Farmer Directory';
      case 'schemes': return language === 'ta' ? 'பொருத்தமான அரசு நலத்திட்டங்கள்' : 'Matched Government Welfare Schemes';
      case 'saved': return language === 'ta' ? 'சேமிக்கப்பட்ட திட்டங்கள்' : 'Saved Schemes & Subsidies';
      case 'admin': return language === 'ta' ? 'அதிகாரி கட்டுப்பாட்டு பலகை' : 'Admin & Officer Desk';
      case 'more': return language === 'ta' ? 'மானியம் & இதர கருவிகள்' : 'Tools & What-If Simulator';
      default: return 'ANNA AGRI AI';
    }
  }, [activeTab, language]);

  return (
    <div className={`min-h-screen text-stone-900 font-sans flex transition-colors ${
      isYellowRed ? 'bg-[#fffdf5] selection:bg-amber-200 selection:text-red-950' : 'bg-stone-100 selection:bg-emerald-100 selection:text-emerald-900'
    }`}>
      
      {/* 1. Permanent Modern Side Navbar (Contains ALL Features) */}
      <SidebarNav
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onLanguageChange={setLanguage}
        savedCount={savedIds.length}
        pendingSoilApprovalsCount={pendingSoilCount}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* 2. Main Application Canvas (Pushed to the right of Sidebar on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        
        {/* Sleek Top Header Bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-md h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs transition-colors ${
          isYellowRed ? 'bg-white border-b-2 border-red-600' : 'bg-white/95 border-b border-stone-200'
        }`}>
          
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 min-w-0">
              <span className="hidden sm:inline text-stone-400">ANNA AGRI AI</span>
              <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-stone-300" />
              <span className="font-bold text-stone-900 truncate text-sm">
                {currentViewTitle}
              </span>
            </div>
          </div>

          {/* Right: Quick Tools, Notifications & User Persona */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Ask AI button in header */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ask AI</span>
            </button>

            {/* Role-Specific Quick Header Action */}
            {currentUser.role === 'ADMIN' && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('soil_approvals')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors"
                  title="Soil Test Slot Approvals"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>{pendingSoilCount} Approvals</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin_billing')}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold border border-stone-300 transition-colors"
                  title="State Trade & Invoicing Ledger"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-700" />
                  <span>Trade Ledger</span>
                </button>
              </div>
            )}

            {currentUser.role === 'BUYER' && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('market')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-bold border border-cyan-300 transition-colors"
                  title="38-Districts Farmgate Produce"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-cyan-700" />
                  <span>38-District Produce</span>
                </button>
                <button
                  onClick={() => setActiveTab('buyer_billing')}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300 transition-colors"
                  title="Procurement Invoices & E-Way Bills"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>Invoices & Bills</span>
                </button>
              </div>
            )}

            {currentUser.role === 'FARMER' && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-colors"
                  title="Farmer Profile & Land Holding"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{profile.fullName.split(' ')[0]} ({profile.landholdingSize} Ac)</span>
                </button>
                <button
                  onClick={() => setActiveTab('farmer_billing')}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 transition-colors"
                  title="Farmgate Sales Receipts & Bills"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Sales Receipts</span>
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Theme Toggle Pill */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs shadow-2xs">
              <button
                onClick={() => setTheme('standard')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  !isYellowRed ? 'bg-emerald-800 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Standard Emerald Theme"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span className="hidden sm:inline">{language === 'ta' ? 'பசுமை' : 'Standard'}</span>
              </button>
              <button
                onClick={() => setTheme('yellow-red')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  isYellowRed ? 'bg-red-700 text-yellow-300 shadow-2xs ring-1 ring-amber-400' : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Kisan Yellow, White & Red Theme (மஞ்சள், வெள்ளை & சிவப்பு)"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block border border-red-600"></span>
                <span className="hidden sm:inline">{language === 'ta' ? 'மஞ்சள்-சிவப்பு' : 'Yellow-Red'}</span>
              </button>
            </div>

            {/* Language Pill Switcher */}
            <div className="hidden sm:flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  language === 'en' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  language === 'ta' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Logged in User chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 text-left p-1.5 rounded-xl hover:bg-stone-100 transition-colors"
                title="Switch persona or sign in"
              >
                <div className={`w-7 h-7 rounded-lg text-stone-950 font-bold text-xs flex items-center justify-center ${
                  currentUser.role === 'ADMIN' ? 'bg-amber-400 font-black' : currentUser.role === 'BUYER' ? 'bg-cyan-400 font-black' : 'bg-emerald-400 font-bold'
                }`}>
                  {currentUser.role === 'ADMIN' ? '🛡️' : currentUser.role === 'BUYER' ? '🏬' : currentUser.name.charAt(0)}
                </div>
                <div className="hidden xl:block min-w-0">
                  <p className="text-xs font-bold text-stone-900 leading-none truncate max-w-28">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5 font-bold">
                    [{currentUser.role}] · {currentUser.district}
                  </p>
                </div>
              </button>
            </div>

          </div>

        </header>

        {/* Global 1-Click Role Switcher Bar */}
        <RoleSwitcherBar
          currentUser={currentUser}
          onSwitchRole={handleSelectUser}
          language={language}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* ROLE 1: FARMER HOME VIEW */}
          {activeTab === 'home' && (
            <FarmerHomeView
              profile={profile}
              schemes={schemes}
              recommendations={recommendationResults}
              language={language}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onViewScheme={(id) => setSelectedSchemeId(id)}
              onEditProfile={() => setIsProfileOpen(true)}
            />
          )}

          {/* ROLE 2: ADMIN OFFICER HOME VIEW */}
          {activeTab === 'admin_home' && (
            <AdminHomeView
              currentUser={currentUser}
              schemes={schemes}
              language={language}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ROLE 3: WHOLESALE BUYER HOME VIEW */}
          {activeTab === 'buyer_home' && (
            <BuyerHomeView
              currentUser={currentUser}
              language={language}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ADMIN SUBTAB: SOIL TEST APPROVALS */}
          {activeTab === 'soil_approvals' && (
            <AdminDashboard
              schemes={schemes}
              users={StorageService.getAllUsers()}
              weights={weights}
              onSaveWeights={handleSaveWeights}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              onSendNotification={handleSendNotification}
              language={language}
              initialTab="soil_approvals"
            />
          )}

          {/* ADMIN SUBTAB: SCHEME RULES & CATALOG MANAGER */}
          {activeTab === 'schemes_mgr' && (
            <AdminDashboard
              schemes={schemes}
              users={StorageService.getAllUsers()}
              weights={weights}
              onSaveWeights={handleSaveWeights}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              onSendNotification={handleSendNotification}
              language={language}
              initialTab="schemes"
            />
          )}

          {/* ADMIN SUBTAB: AI RECOMMENDATION WEIGHTS */}
          {activeTab === 'weights_config' && (
            <AdminDashboard
              schemes={schemes}
              users={StorageService.getAllUsers()}
              weights={weights}
              onSaveWeights={handleSaveWeights}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              onSendNotification={handleSendNotification}
              language={language}
              initialTab="weights"
            />
          )}

          {/* ADMIN SUBTAB: 38-DISTRICTS FARMER REGISTRY OVERSIGHT */}
          {activeTab === 'farmer_oversight' && (
            <FarmerDirectoryView
              currentProfile={profile}
              language={language}
              onEditProfile={() => setIsProfileOpen(true)}
              onSelectFarmerPersona={handleSelectFarmerFromDirectory}
            />
          )}

          {/* ADMIN SUBTAB: PACCS & AEC DEPOTS OVERSIGHT */}
          {activeTab === 'paccs_oversight' && (
            <AgriShopsNearby
              language={language}
              currentDistrict={profile.district}
            />
          )}

          {/* ADMIN SUBTAB: EMERGENCY BROADCAST */}
          {activeTab === 'broadcast' && (
            <AdminDashboard
              schemes={schemes}
              users={StorageService.getAllUsers()}
              weights={weights}
              onSaveWeights={handleSaveWeights}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              onSendNotification={handleSendNotification}
              language={language}
              initialTab="broadcast"
            />
          )}

          {/* ADMIN SUBTAB: DISBURSEMENT ANALYTICS */}
          {activeTab === 'analytics' && (
            <AdminDashboard
              schemes={schemes}
              users={StorageService.getAllUsers()}
              weights={weights}
              onSaveWeights={handleSaveWeights}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              onSendNotification={handleSendNotification}
              language={language}
              initialTab="metrics"
            />
          )}

          {/* VIEW: ROLE-BASED BILLING & INVOICE GENERATIONS */}
          {(activeTab === 'farmer_billing' || activeTab === 'buyer_billing' || activeTab === 'admin_billing') && (
            <BillingInvoiceView
              currentUser={currentUser}
              profile={profile}
              language={language}
            />
          )}

          {/* BUYER SUBTAB: DIRECT PRODUCER DIRECTORY */}
          {activeTab === 'buyer_farmers' && (
            <FarmerDirectoryView
              currentProfile={profile}
              language={language}
              onEditProfile={() => setIsProfileOpen(true)}
              onSelectFarmerPersona={handleSelectFarmerFromDirectory}
            />
          )}

          {/* VIEW: TAMIL NADU AGRO-WEATHER REPORT (ALL 38 DISTRICTS) */}
          {activeTab === 'weather' && (
            <WeatherWidget
              language={language}
              currentDistrict={profile.district}
            />
          )}

          {/* VIEW: CROP RECOMMENDER ENGINE */}
          {activeTab === 'crops' && (
            <CropRecommender
              profile={profile}
              language={language}
              onViewScheme={(id) => setSelectedSchemeId(id)}
            />
          )}

          {/* VIEW: SOIL TEST SLOT BOOKING & MANDATORY ADMIN APPROVALS */}
          {activeTab === 'soil_booking' && (
            <SoilTestBookingView
              profile={profile}
              language={language}
              currentUser={currentUser}
              onNavigateToAdmin={() => setActiveTab('admin_home')}
            />
          )}

          {/* VIEW: AGRI SHOPS & MACHINERY CENTERS (ALL 38 DISTRICTS) */}
          {activeTab === 'shops' && (
            <AgriShopsNearby
              language={language}
              currentDistrict={profile.district}
            />
          )}

          {/* VIEW: FARMER-FIXED PRICE DIRECT MARKETPLACE */}
          {activeTab === 'market' && (
            <FarmerMarketplace
              profile={profile}
              language={language}
              currentUser={currentUser}
            />
          )}

          {/* VIEW: FARMER DIRECT PRODUCE DELIVERY & GPS TRACKING */}
          {activeTab === 'delivery_tracking' && (
            <DeliveryTrackingView
              profile={profile}
              language={language}
              currentUser={currentUser}
            />
          )}

          {/* VIEW: 38 DISTRICTS FARMER DIRECTORY & PROFILES */}
          {activeTab === 'farmer_directory' && (
            <FarmerDirectoryView
              currentProfile={profile}
              language={language}
              onEditProfile={() => setIsProfileOpen(true)}
              onSelectFarmerPersona={handleSelectFarmerFromDirectory}
              onViewSchemesForFarmer={(district, crop) => {
                setFilterState(district);
                setActiveTab('schemes');
              }}
            />
          )}

          {/* VIEW 8: GOVERNMENT SCHEMES & RECOMMENDATIONS */}
          {(activeTab === 'schemes' || activeTab === 'recommendations') && (
            <div className="space-y-6">
              
              {/* Header & Farmer Profile Bar */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Intelligent Matching Engine
                  </span>
                  <h1 className="text-2xl font-bold text-stone-900 mt-0.5">
                    {t.recTitle}
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Personalized based on {profile.fullName}'s landholding ({profile.landholdingSize} {profile.landUnit} {profile.ownershipType}), {profile.cropType} cultivation in {profile.district}, {profile.state}.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Edit Farmer Profile ({profile.profileCompletionPercentage}%)
                  </button>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Open Simulator
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={e => {
                      setFilterCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                  >
                    <option value="All">{t.allCategories}</option>
                    <option value="Financial Support">Financial Support</option>
                    <option value="Crop Insurance">Crop Insurance</option>
                    <option value="Irrigation & Water">Irrigation & Water</option>
                    <option value="Solar & Renewable Energy">Solar & Renewable</option>
                    <option value="Mechanization & Tools">Mechanization & Tools</option>
                    <option value="Seeds & Fertilizers">Seeds & Fertilizers</option>
                    <option value="Organic & Natural Farming">Organic Farming</option>
                    <option value="Livestock & Dairy">Livestock & Dairy</option>
                    <option value="Infrastructure & Loans">Infrastructure & Loans</option>
                    <option value="Women Farmer Support">Women Farmer Support</option>
                  </select>

                  <select
                    value={filterState}
                    onChange={e => {
                      setFilterState(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                  >
                    <option value="All">{language === 'ta' ? 'அனைத்து மாநிலங்கள் / மத்திய அரசு' : 'All States / Central'}</option>
                    <option value="Tamil Nadu">Tamil Nadu (தமிழ்நாடு)</option>
                    <option value="All India">Central Govt (All India)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={e => {
                      setSortBy(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
                  >
                    <option value="score">Sort: Match Score</option>
                    <option value="benefit">Sort: Benefit Amount</option>
                    <option value="name">Sort: Alphabetical</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800">{filteredRecommendations.length}</span>
                    <span>schemes catalogued (Page {currentPage} of {Math.max(1, Math.ceil(filteredRecommendations.length / pageSize))})</span>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-stone-700 select-none">
                    <input
                      type="checkbox"
                      checked={filterEligibleOnly}
                      onChange={e => {
                        setFilterEligibleOnly(e.target.checked);
                        setCurrentPage(1);
                      }}
                      className="rounded text-emerald-800 focus:ring-emerald-600"
                    />
                    <span>{language === 'ta' ? 'தகுதியானவை மட்டும்' : 'Eligible Only'}</span>
                  </label>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRecommendations
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map(rec => (
                  <RecommendationCard
                    key={rec.scheme.id}
                    recommendation={rec}
                    profile={profile}
                    language={language}
                    isSaved={savedIds.includes(rec.scheme.id)}
                    onToggleSave={handleToggleSave}
                    onViewDetails={(id) => setSelectedSchemeId(id)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {filteredRecommendations.length > pageSize && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 text-xs">
                  <span className="text-stone-500">
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRecommendations.length)} of {filteredRecommendations.length} schemes
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1.5 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      {language === 'ta' ? 'முந்தைய பக்கம்' : 'Previous'}
                    </button>
                    <span className="font-mono font-bold text-stone-800 px-2">
                      {currentPage} / {Math.ceil(filteredRecommendations.length / pageSize)}
                    </span>
                    <button
                      disabled={currentPage >= Math.ceil(filteredRecommendations.length / pageSize)}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="px-3 py-1.5 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      {language === 'ta' ? 'அடுத்த பக்கம்' : 'Next'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 9: SAVED SCHEMES */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Bookmarked Collection
                  </span>
                  <h1 className="text-2xl font-bold text-stone-900 mt-0.5">
                    My Saved Schemes ({savedRecommendations.length})
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Keep track of schemes you plan to apply for during this agricultural season.
                  </p>
                </div>
              </div>

              {savedRecommendations.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
                  <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800">No Saved Schemes Yet</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Click the bookmark icon on any recommendation card to save it for quick access.
                  </p>
                  <button
                    onClick={() => setActiveTab('schemes')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900"
                  >
                    Discover Schemes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedRecommendations.map(rec => (
                    <RecommendationCard
                      key={rec.scheme.id}
                      recommendation={rec}
                      profile={profile}
                      language={language}
                      isSaved={true}
                      onToggleSave={handleToggleSave}
                      onViewDetails={(id) => setSelectedSchemeId(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 10: ADMIN DASHBOARD (INCLUDES SOIL TEST APPROVAL DESK) */}
          {activeTab === 'admin' && (
            <AdminDashboard
              schemes={schemes}
              users={StorageService.getAllUsers()}
              weights={weights}
              onSaveWeights={handleSaveWeights}
              onSaveScheme={handleSaveScheme}
              onDeleteScheme={handleDeleteScheme}
              onSendNotification={handleSendNotification}
              language={language}
            />
          )}

          {/* VIEW: ELIGIBILITY SIMULATOR DIRECT */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <EligibilitySimulator
                baseProfile={profile}
                allSchemes={schemes}
                weights={weights}
                language={language}
                onViewScheme={(id) => setSelectedSchemeId(id)}
              />
            </div>
          )}

          {/* VIEW: SUBSIDY CALCULATOR DIRECT */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <SubsidyCalculator
                profile={profile}
                language={language}
              />
            </div>
          )}

          {/* VIEW: DOCUMENTS DIRECT */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <DocumentLocker
                items={documentItems}
                onToggleItem={handleToggleDocument}
                language={language}
              />
            </div>
          )}

          {/* VIEW: KVK DIRECT */}
          {activeTab === 'kvk' && (
            <div className="space-y-6">
              <KvkLocator language={language} />
            </div>
          )}

          {/* VIEW: CALENDAR DIRECT */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <SeasonalCalendar
                language={language}
                onViewScheme={(id) => setSelectedSchemeId(id)}
              />
            </div>
          )}

          {/* VIEW: SOIL ADVISOR DIRECT */}
          {activeTab === 'soil' && (
            <div className="space-y-6">
              <SoilHealthAdvisor
                profile={profile}
                language={language}
                onViewScheme={(id) => setSelectedSchemeId(id)}
              />
            </div>
          )}

          {/* VIEW: STORIES DIRECT */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <CommunityStories language={language} />
            </div>
          )}

          {/* VIEW: GRIEVANCE DIRECT */}
          {activeTab === 'grievance' && (
            <div className="space-y-6">
              <GrievanceEscalation
                profile={profile}
                language={language}
              />
            </div>
          )}

          {/* VIEW: CALAMITY DIRECT */}
          {activeTab === 'calamity' && (
            <div className="space-y-6">
              <CalamityReliefGuide
                profile={profile}
                language={language}
              />
            </div>
          )}

          {/* VIEW: HISTORY DIRECT */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <RecommendationHistoryView
                sessions={historySessions}
                onViewScheme={(id) => setSelectedSchemeId(id)}
                language={language}
              />
            </div>
          )}
          {activeTab === 'more' && (
            <div className="space-y-6">
              {/* Sub-navigation bar for extra features */}
              <div className="flex border-b border-stone-200 bg-white p-2 rounded-xl gap-2 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setMoreSubTab('simulator')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'simulator' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>1. What-If Simulator</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('documents')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'documents' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>2. Doc Readiness</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('kvk')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'kvk' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>3. KVK Directory</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('calendar')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'calendar' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>4. Seasonal Deadlines</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('calculator')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'calculator' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>5. Subsidy Calculator</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('soil')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'soil' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>6. Soil Health Analyzer</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('stories')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'stories' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>7. Field Stories</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('grievance')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'grievance' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>8. Grievance Escalation</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('calamity')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'calamity' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CloudLightning className="w-3.5 h-3.5" />
                  <span>9. 72-Hr Calamity Protocol</span>
                </button>

                <button
                  onClick={() => setMoreSubTab('history')}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    moreSubTab === 'history' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>10. Session History</span>
                </button>
              </div>

              {/* Sub-view switcher */}
              {moreSubTab === 'simulator' && (
                <EligibilitySimulator
                  baseProfile={profile}
                  allSchemes={schemes}
                  weights={weights}
                  language={language}
                  onViewScheme={(id) => setSelectedSchemeId(id)}
                />
              )}
              {moreSubTab === 'documents' && (
                <DocumentLocker
                  items={documentItems}
                  onToggleItem={handleToggleDocument}
                  language={language}
                />
              )}
              {moreSubTab === 'kvk' && <KvkLocator language={language} />}
              {moreSubTab === 'calendar' && (
                <SeasonalCalendar
                  language={language}
                  onViewScheme={(id) => setSelectedSchemeId(id)}
                />
              )}
              {moreSubTab === 'calculator' && (
                <SubsidyCalculator
                  profile={profile}
                  language={language}
                />
              )}
              {moreSubTab === 'soil' && (
                <SoilHealthAdvisor
                  profile={profile}
                  language={language}
                  onViewScheme={(id) => setSelectedSchemeId(id)}
                />
              )}
              {moreSubTab === 'stories' && <CommunityStories language={language} />}
              {moreSubTab === 'grievance' && (
                <GrievanceEscalation
                  profile={profile}
                  language={language}
                />
              )}
              {moreSubTab === 'calamity' && (
                <CalamityReliefGuide
                  profile={profile}
                  language={language}
                />
              )}
              {moreSubTab === 'history' && (
                <RecommendationHistoryView
                  sessions={historySessions}
                  onViewScheme={(id) => setSelectedSchemeId(id)}
                  language={language}
                />
              )}
            </div>
          )}

        </main>

      </div>

      {/* Floating AI Advisor Launcher (if chat is closed) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full shadow-lg flex items-center gap-2.5 transition-transform hover:scale-105 cursor-pointer ${
            isYellowRed
              ? 'bg-red-700 hover:bg-red-800 text-yellow-300 border-2 border-amber-400 shadow-red-950/40'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700 shadow-emerald-950/40'
          }`}
          title="Ask ANNA AGRI AI Advisor"
        >
          <Sprout className={`w-5 h-5 ${isYellowRed ? 'text-yellow-300' : 'text-emerald-300'}`} />
          <span className="text-xs font-bold hidden sm:inline">
            {language === 'ta' ? 'அண்ணா அக்ரி AI' : 'Ask ANNA AGRI AI'}
          </span>
        </button>
      )}

      {/* MODAL 1: SCHEME DETAILS DOSSIER (WITH WHATSAPP SHARE) */}
      {selectedSchemeObj && (
        <SchemeDetailModal
          scheme={selectedSchemeObj}
          recommendation={selectedRecommendation}
          profile={profile}
          language={language}
          isSaved={savedIds.includes(selectedSchemeObj.id)}
          onToggleSave={handleToggleSave}
          onClose={() => setSelectedSchemeId(null)}
        />
      )}

      {/* MODAL 2: FARMER PROFILE EDITOR */}
      {isProfileOpen && (
        <FarmerProfileModal
          profile={profile}
          onSave={handleProfileSave}
          onClose={() => setIsProfileOpen(false)}
          language={language}
        />
      )}

      {/* MODAL 3: AI KRISHI CHATBOT DRAWER */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        profile={profile}
        language={language}
        currentUser={currentUser}
        onViewScheme={(id) => {
          setSelectedSchemeId(id);
          setIsChatOpen(false);
        }}
      />

      {/* MODAL 4: NOTIFICATIONS POPOVER */}
      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onViewScheme={(id) => setSelectedSchemeId(id)}
        language={language}
      />

      {/* MODAL 5: AUTHENTICATION & LOGIN SYSTEM */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSelectUser={handleSelectUser}
        language={language}
      />

    </div>
  );
}
