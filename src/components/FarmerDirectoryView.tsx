import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Sprout, 
  Award, 
  FileCheck, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  UserCheck,
  Building,
  Droplets,
  Edit3
} from 'lucide-react';
import { TN_38_FARMER_PROFILES, TN_38_DISTRICTS, TNDistrictInfo } from '../data/tamilNaduData';
import { TNDistrictFarmer, FarmerProfile, Language, User } from '../types';

interface FarmerDirectoryViewProps {
  currentProfile: FarmerProfile;
  language: Language;
  onEditProfile: () => void;
  onSelectFarmerPersona?: (farmer: TNDistrictFarmer) => void;
  onViewSchemesForFarmer?: (district: string, crop: string) => void;
}

export const FarmerDirectoryView: React.FC<FarmerDirectoryViewProps> = ({
  currentProfile,
  language,
  onEditProfile,
  onSelectFarmerPersona,
  onViewSchemesForFarmer
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [landFilter, setLandFilter] = useState<'All' | 'Marginal' | 'Small' | 'Medium'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFarmerModal, setActiveFarmerModal] = useState<TNDistrictFarmer | null>(null);

  // Extract unique zones
  const zones = useMemo(() => {
    return Array.from(new Set(TN_38_DISTRICTS.map(d => d.zone)));
  }, []);

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    return TN_38_FARMER_PROFILES.filter(f => {
      const matchesDistrict = selectedDistrict === 'All' || f.district === selectedDistrict;
      const matchesZone = selectedZone === 'All' || f.zone === selectedZone;
      
      let matchesLand = true;
      if (landFilter === 'Marginal') matchesLand = f.landholdingSize < 2.5;
      else if (landFilter === 'Small') matchesLand = f.landholdingSize >= 2.5 && f.landholdingSize <= 5.0;
      else if (landFilter === 'Medium') matchesLand = f.landholdingSize > 5.0;

      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        f.farmerName.toLowerCase().includes(q) ||
        f.farmerName_ta.includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.district_ta.includes(q) ||
        f.village.toLowerCase().includes(q) ||
        f.primaryCrop.toLowerCase().includes(q) ||
        f.secondaryCrop.toLowerCase().includes(q);

      return matchesDistrict && matchesZone && matchesLand && matchesSearch;
    });
  }, [selectedDistrict, selectedZone, landFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header & Active Farmer Profile Dossier */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-700/50">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-stone-900 rounded-md">
                100% Whole Tamil Nadu Coverage
              </span>
              <span className="text-xs text-emerald-200">
                · All 38 Districts & Agro-Climatic Zones
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' 
                ? 'தமிழ்நாடு 38 மாவட்ட விவசாயிகள் விவரக் குறிப்பேடு' 
                : 'Tamil Nadu 38-Districts Farmer Registry & Profiles'}
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {language === 'ta'
                ? 'அரியலூர் முதல் விருதுநகர் வரை உள்ள 38 மாவட்டங்களின் விவசாயிகள் விவரங்கள், சாகுபடி முறைகள், மண் அட்டை நிலை மற்றும் அரசின் திட்டப் பலன்கள்.'
                : 'Explore authentic agricultural profiles, landholdings, crop varieties, irrigation systems, and soil card records across all 38 districts of Tamil Nadu.'}
            </p>
          </div>

          {/* Quick Active Profile Summary Card */}
          <div className="bg-emerald-950/70 border border-emerald-600/40 p-4 rounded-2xl backdrop-blur-md shrink-0 lg:w-80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Your Logged-In Profile
              </span>
              <button 
                onClick={onEditProfile}
                className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="mt-2.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-base shadow-sm">
                {currentProfile.fullName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{currentProfile.fullName}</p>
                <p className="text-xs text-emerald-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {currentProfile.district}, {currentProfile.state}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-800/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-emerald-300 block">Cultivation</span>
                <span className="font-semibold text-white truncate block">{currentProfile.cropType || 'Paddy'}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block">Landholding</span>
                <span className="font-semibold text-white block">{currentProfile.landholdingSize} {currentProfile.landUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter & 38-District Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={language === 'ta' 
                ? 'விவசாயி பெயர், மாவட்டம், பயிர் அல்லது ஊர் தேடுக...' 
                : 'Search by farmer name, district, crop, or village...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-stone-50/50"
            />
          </div>

          {/* District Selector (All 38 Districts) */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="All">All 38 Districts (அனைத்து மாவட்டங்கள்)</option>
              {TN_38_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.name_ta})
                </option>
              ))}
            </select>
          </div>

          {/* Zone Selector */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="All">All Agro-Zones</option>
              {zones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Landholding Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select
              value={landFilter}
              onChange={e => setLandFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="All">All Holdings</option>
              <option value="Marginal">Marginal (&lt; 2.5 Acres)</option>
              <option value="Small">Small (2.5 - 5 Acres)</option>
              <option value="Medium">Medium &gt; 5 Acres</option>
            </select>
          </div>
        </div>

        {/* Quick summary tally */}
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">{filteredFarmers.length}</span>
            <span>farmers listed matching your filters across Tamil Nadu</span>
          </div>

          {(selectedDistrict !== 'All' || selectedZone !== 'All' || landFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDistrict('All');
                setSelectedZone('All');
                setLandFilter('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. Farmers Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFarmers.map(farmer => {
          return (
            <div 
              key={farmer.id}
              className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all p-5 shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                
                {/* Card Top: Avatar, Name, District & Zone */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-base shrink-0 border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      {farmer.farmerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                        {farmer.farmerName}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">{farmer.farmerName_ta}</p>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{farmer.district} ({farmer.district_ta})</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                    {farmer.zone}
                  </span>
                </div>

                {/* Agricultural Parameters Specs */}
                <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Taluk & Village:</span>
                    <span className="font-semibold text-stone-800">{farmer.village}, {farmer.taluk}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Landholding:</span>
                    <span className="font-semibold text-stone-800">
                      {farmer.landholdingSize} {farmer.landUnit} · {farmer.ownershipType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Primary Crop:</span>
                    <span className="font-semibold text-emerald-900 font-medium">
                      {farmer.primaryCrop} ({farmer.primaryCrop_ta})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Irrigation:</span>
                    <span className="font-semibold text-stone-800">
                      {farmer.irrigationType} · {farmer.soilType} Soil
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/50">
                    <span className="text-stone-500">Soil Health Card:</span>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {farmer.soilHealthCardStatus}
                    </span>
                  </div>
                </div>

                {/* Real farmer takeaway / success note */}
                <div className="text-xs text-stone-600 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100 italic">
                  "{language === 'ta' ? farmer.keySuccess_ta : farmer.keySuccess}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/91${farmer.mobile}?text=${encodeURIComponent(
                    `Vanakkam ${farmer.farmerName}, I am contacting you via ANNA AGRI AI (AAA Platform) regarding your ${farmer.primaryCrop} cultivation in ${farmer.district}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp</span>
                </a>

                {onSelectFarmerPersona && (
                  <button
                    onClick={() => onSelectFarmerPersona(farmer)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    title="Switch to this farmer persona to view schemes and recommendations from their district"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>View Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
