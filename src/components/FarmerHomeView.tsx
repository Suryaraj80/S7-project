import React, { useState } from 'react';
import { 
  Sprout, 
  CloudSun, 
  FlaskConical, 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Bookmark, 
  DollarSign, 
  Phone, 
  Award, 
  Clock, 
  Compass, 
  Droplets,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  FileText
} from 'lucide-react';
import { FarmerProfile, Scheme, RecommendationResult, Language } from '../types';
import { TN_DISTRICT_WEATHER } from '../data/tamilNaduData';

interface FarmerHomeViewProps {
  profile: FarmerProfile;
  schemes: Scheme[];
  recommendations: RecommendationResult[];
  language: Language;
  onNavigateTab: (tab: string) => void;
  onViewScheme: (schemeId: string) => void;
  onEditProfile: () => void;
}

export const FarmerHomeView: React.FC<FarmerHomeViewProps> = ({
  profile,
  schemes,
  recommendations,
  language,
  onNavigateTab,
  onViewScheme,
  onEditProfile
}) => {
  // Find current weather for farmer's district
  const districtWeather = TN_DISTRICT_WEATHER.find(w => w.district.toLowerCase() === profile.district.toLowerCase()) || TN_DISTRICT_WEATHER[0];

  // Top 3 matched schemes
  const topRecommendations = recommendations.filter(r => r.isEligible).slice(0, 3);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Dynamic Farmer Command Dashboard Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800 relative overflow-hidden">
        
        {/* Subtle background graphic pattern */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <Sprout className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-amber-400 text-stone-950 rounded-md">
                Farmer Intelligence Command
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                · {profile.district} District, {profile.state}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
              {language === 'ta'
                ? `வணக்கம் ${profile.fullName}! இன்றைய வேளாண்மைத் தகவல்கள் & திட்டங்கள்`
                : `Welcome, ${profile.fullName}! Your Daily Farm Intelligence & Subsidies`}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {language === 'ta'
                ? `${profile.cropType} பயிர் சாகுபடிக்கு உகந்த உர பரிந்துரைகள், நேரடி வாங்குவோர் விலை மற்றும் 100% அரசு மானியங்களை ஒரே இடத்தில் பெறுங்கள்.`
                : `Precision advisories for your ${profile.cropType} crop across ${profile.landholdingSize} ${profile.landUnit} (${profile.soilType} soil). Connect to direct buyers with zero commissions.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('schemes')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>View {recommendations.filter(r => r.isEligible).length} Eligible Subsidies</span>
              </button>

              <button
                onClick={() => onNavigateTab('soil_booking')}
                className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-600/60 flex items-center gap-2 transition-all"
              >
                <FlaskConical className="w-4 h-4 text-emerald-300" />
                <span>Book Soil Test</span>
              </button>

              <button
                onClick={() => onNavigateTab('farmer_billing')}
                className="px-4 py-2.5 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white font-semibold text-xs border border-teal-500/60 flex items-center gap-2 transition-all shadow-xs"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>My Sales Receipts (விற்பனை ரசீது)</span>
              </button>
            </div>
          </div>

          {/* Quick Weather & Farm Snapshot Card */}
          <div className="bg-emerald-950/80 border border-emerald-700/50 p-4 rounded-2xl backdrop-blur-md shrink-0 lg:w-80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.district} Live Weather</span>
              </div>
              <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono">
                {districtWeather.condition}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-black text-white">
                {districtWeather.tempCurrent}°C
              </div>
              <div className="text-right text-xs text-emerald-200">
                <span>Rain: {districtWeather.rainProbability}%</span>
                <span className="block text-[11px] text-emerald-300">Wind: {districtWeather.windSpeed} km/h</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-100/90 leading-tight bg-emerald-900/60 p-2 rounded-lg border border-emerald-800">
              {language === 'ta' ? districtWeather.agroAdvisory_ta : districtWeather.agroAdvisory}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Action 1: Soil Test Booking */}
        <div 
          onClick={() => onNavigateTab('soil_booking')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <FlaskConical className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            Soil Health Card Slot
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Book free testing at nearest TNAU research center. Track officer verification.
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Book Appointment</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Action 2: Crop Recommender */}
        <div 
          onClick={() => onNavigateTab('crops')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            AI Crop Recommender
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            High-profit alternatives based on {profile.district} seasonal rainfall and market demand.
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Run Recommendation</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Action 3: Sell Harvest Directly */}
        <div 
          onClick={() => onNavigateTab('market')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 text-teal-700" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            Farmgate Marketplace
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Sell {profile.cropType} at your own price to wholesale buyers with zero commissions.
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>List Your Harvest</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Action 4: Agri Shops & PACCS Nearby */}
        <div 
          onClick={() => onNavigateTab('shops')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all cursor-pointer shadow-xs hover:shadow-md group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-blue-700" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
            PACCS & Seed Depots
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Find subsidized urea, DAP, and machinery rental centers across {profile.district}.
          </p>
          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Locate Depots</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

      </div>

      {/* 3. Top AI Matched Subsidies Spotlight */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Highest Match Subsidies for {profile.fullName}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Personalized based on {profile.landholdingSize} {profile.landUnit}, {profile.cropType} cultivation, and {profile.district} location.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('schemes')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
          >
            View All {schemes.length} Schemes →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRecommendations.map(rec => (
            <div 
              key={rec.scheme.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded uppercase">
                    {rec.scheme.category}
                  </span>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {rec.matchScore}% Match
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug">
                  {rec.scheme.scheme_name}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-2">
                  {rec.scheme.short_description}
                </p>

                <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-xs">
                  <span className="text-[10px] text-stone-400 block font-semibold">ESTIMATED FINANCIAL BENEFIT</span>
                  <span className="text-sm font-black text-emerald-800">
                    ₹{rec.scheme.estimated_monetary_value.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Eligible</span>
                </span>

                <button
                  onClick={() => onViewScheme(rec.scheme.id)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tamil Nadu 38-Districts Farmer Network Spotlight */}
      <div 
        onClick={() => onNavigateTab('farmer_directory')}
        className="bg-gradient-to-r from-teal-900 to-emerald-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-all"
      >
        <div className="space-y-1 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
            Tamil Nadu Whole State Coverage
          </span>
          <h3 className="text-base sm:text-lg font-bold">
            Explore Farmer Profiles from All 38 Districts
          </h3>
          <p className="text-xs text-emerald-100">
            Connect with certified growers from Ariyalur to Virudhunagar, exchange cultivation techniques, and view real soil card records.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-xs font-bold text-white">
          <span>Open 38-District Registry</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

    </div>
  );
};
