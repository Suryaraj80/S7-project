import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  TrendingUp, 
  Send, 
  AlertTriangle, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  Building,
  Check,
  XCircle,
  Database,
  Sliders,
  DollarSign
} from 'lucide-react';
import { User, Scheme, Language, SoilTestBooking, SoilTestStatus } from '../types';
import { TN_38_DISTRICTS } from '../data/tamilNaduData';

interface AdminHomeViewProps {
  currentUser: User;
  schemes: Scheme[];
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const AdminHomeView: React.FC<AdminHomeViewProps> = ({
  currentUser,
  schemes,
  language,
  onNavigateTab
}) => {
  const [soilBookings, setSoilBookings] = useState<SoilTestBooking[]>(() => {
    try {
      const raw = localStorage.getItem('aaa_soil_test_bookings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  const loadBookings = () => {
    try {
      const raw = localStorage.getItem('aaa_soil_test_bookings');
      if (raw) setSoilBookings(JSON.parse(raw));
    } catch {}
  };

  useEffect(() => {
    loadBookings();
    window.addEventListener('storage', loadBookings);
    window.addEventListener('soil_bookings_updated', loadBookings);
    return () => {
      window.removeEventListener('storage', loadBookings);
      window.removeEventListener('soil_bookings_updated', loadBookings);
    };
  }, []);

  const pendingBookings = soilBookings.filter(b => b.status === 'Pending Admin Approval');
  const approvedCount = soilBookings.filter(b => b.status === 'Approved & Slot Confirmed').length;

  const handleQuickApprove = (bookingId: string) => {
    const updated = soilBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Approved & Slot Confirmed' as SoilTestStatus,
          reviewedBy: currentUser.name,
          reviewedAt: new Date().toISOString(),
          adminNotes: 'Patta & survey number verified against state land records. Approved.'
        };
      }
      return b;
    });
    setSoilBookings(updated);
    localStorage.setItem('aaa_soil_test_bookings', JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Official Government Department Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 rounded-md">
                Official Admin Console
              </span>
              <span className="text-xs text-emerald-300 font-semibold">
                Tamil Nadu Department of Agriculture & Farmers Welfare
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {language === 'ta' 
                ? 'வேளாண்மைத் துறை நிர்வாக அதிகாரி கட்டுப்பாட்டு மையம்' 
                : 'State Agricultural Officer Command Center'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {language === 'ta'
                ? `வணக்கம் ${currentUser.name}. 38 மாவட்டங்களின் மண் பரிசோதனை விண்ணப்பங்கள், மானியத் திட்டங்கள் மற்றும் உழவர் நலப் பணிகளை மேற்பார்வையிடவும்.`
                : `Welcome, ${currentUser.name}. Manage soil testing verifications, scheme allocations, and farmer welfare operations across all 38 districts of Tamil Nadu.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('soil_approvals')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Clock className="w-4 h-4" />
                <span>Verify Soil Slots ({pendingBookings.length})</span>
              </button>

              <button
                onClick={() => onNavigateTab('admin_billing')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Trade Invoicing Ledger</span>
              </button>
            </div>
          </div>

          {/* Officer Profile Card */}
          <div className="bg-stone-950/80 border border-emerald-600/40 p-4 rounded-2xl backdrop-blur-md shrink-0 lg:w-80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-stone-950 font-bold text-lg flex items-center justify-center shadow-sm">
                🛡️
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  Logged-In Officer
                </span>
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-emerald-400 truncate">{currentUser.district} District HQ</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Jurisdiction: Whole Tamil Nadu</span>
              <span className="text-emerald-400 font-bold">38 Districts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Admin Real-Time KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Soil Approvals Pending */}
        <div 
          onClick={() => onNavigateTab('soil_approvals')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pending Soil Approvals
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              pendingBookings.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {pendingBookings.length}
            </span>
            <span className="text-xs font-semibold text-amber-700">
              {pendingBookings.length > 0 ? 'Needs Action' : 'All Cleared'}
            </span>
          </div>

          <p className="text-[11px] text-stone-500 mt-1">
            Farmers awaiting Patta / Survey verification token.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* KPI 2: Active Schemes */}
        <div 
          onClick={() => onNavigateTab('schemes_mgr')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-400 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Welfare Schemes
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {schemes.length}
            </span>
            <span className="text-xs font-semibold text-emerald-700">Active</span>
          </div>

          <p className="text-[11px] text-stone-500 mt-1">
            Central & Tamil Nadu State sponsored schemes.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
            <span>Manage Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* KPI 3: Registered Farmers */}
        <div 
          onClick={() => onNavigateTab('farmer_oversight')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-blue-400 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Farmer Registry
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              38
            </span>
            <span className="text-xs font-semibold text-blue-700">Districts</span>
          </div>

          <p className="text-[11px] text-stone-500 mt-1">
            Verified agricultural holdings across 7 agro-zones.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
            <span>View 38 Dossiers</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* KPI 4: Subsidies Disbursed */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-purple-400 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Disbursed Subsidies
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              ₹28.4 Cr
            </span>
            <span className="text-xs font-semibold text-purple-700">FY 25-26</span>
          </div>

          <p className="text-[11px] text-stone-500 mt-1">
            Direct Benefit Transfer (DBT) to Aadhaar linked accounts.
          </p>

          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
            <span>View Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

      </div>

      {/* 3. Action Queue: Immediate Soil Test Approvals */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Pending Soil Health Card Applications ({pendingBookings.length})</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Review and approve farmer testing tokens directly from this command console.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('soil_approvals')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
          >
            Open Full Approvals Desk →
          </button>
        </div>

        {pendingBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-stone-800">All Applications Verified & Approved</p>
            <p className="text-stone-400 mt-0.5">No pending soil test applications awaiting officer confirmation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingBookings.map(b => (
              <div 
                key={b.id}
                className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-stone-900 bg-white border border-stone-300 px-2 py-0.5 rounded shadow-xs">
                      {b.id}
                    </span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      Awaiting Verification
                    </span>
                    <span className="text-xs text-stone-500">
                      {b.farmerName} ({b.mobile})
                    </span>
                  </div>

                  <p className="text-xs text-stone-700">
                    <span className="font-semibold">Survey No:</span> {b.surveyNumber} · 
                    <span className="font-semibold ml-2">Location:</span> {b.village}, {b.taluk}, {b.district} · 
                    <span className="font-semibold ml-2">Crop:</span> {b.plannedCrop} ({b.soilType} Soil)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Lab: {b.centerName} · Preferred Date: {b.appointmentDate} ({b.timeSlot})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleQuickApprove(b.id)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Slot</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('soil_approvals')}
                    className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    Inspect Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Officer Quick Launch Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Scheme Management */}
        <div 
          onClick={() => onNavigateTab('schemes_mgr')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            Scheme Eligibility & Guidelines Manager
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Update eligibility rules, financial ceilings, required documents, and subsidy percentages.
          </p>
        </div>

        {/* Card 2: AI Weights Tuning */}
        <div 
          onClick={() => onNavigateTab('weights_config')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold mb-3">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            Recommendation Algorithm Weights
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Fine-tune scoring weights for Land Size, Crop Relevance, Income Need, and Marginal Status.
          </p>
        </div>

        {/* Card 3: Advisory Broadcast */}
        <div 
          onClick={() => onNavigateTab('broadcast')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold mb-3">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            Farmer Emergency Broadcast (SMS/App)
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Send urgent weather warnings, subsidy intake deadlines, and pest advisories across 38 districts.
          </p>
        </div>

      </div>

    </div>
  );
};
