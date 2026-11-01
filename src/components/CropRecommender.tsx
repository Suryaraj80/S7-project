import React, { useState } from 'react';
import { 
  Sprout, 
  Droplet, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Filter,
  IndianRupee
} from 'lucide-react';
import { TN_CROP_RECOMMENDATIONS } from '../data/tamilNaduData';
import { FarmerProfile, Language, SoilType } from '../types';

interface CropRecommenderProps {
  profile: FarmerProfile;
  language: Language;
  onViewScheme?: (schemeId: string) => void;
}

export const CropRecommender: React.FC<CropRecommenderProps> = ({
  profile,
  language,
  onViewScheme
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [selectedSoil, setSelectedSoil] = useState<string>(profile.soilType || 'All');

  const filteredCrops = TN_CROP_RECOMMENDATIONS.filter(crop => {
    const matchesSoil = selectedSoil === 'All' || crop.suitableSoils.includes(selectedSoil as SoilType);
    const matchesSeason = selectedSeason === 'All' || crop.season.toLowerCase().includes(selectedSeason.toLowerCase());
    return matchesSoil && matchesSeason;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            TNAU Agro-Advisory
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <span>{language === 'ta' ? 'தமிழ்நாடு பயிர் தேர்வு மற்றும் மகசூல் வழிகாட்டி' : 'Tamil Nadu Crop Recommendation Engine'}</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Scientifically recommended crop varieties for Tamil Nadu agro-climatic zones based on soil type, water availability, and maximum market profitability.
        </p>
      </div>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Filter by Sowing Season (பருவம்)
          </label>
          <select
            value={selectedSeason}
            onChange={e => setSelectedSeason(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium"
          >
            <option value="All">All Tamil Nadu Seasons (அனைத்து பருவங்கள்)</option>
            <option value="Kuruvai">Kuruvai Season (குருவை பட்டம்: May - July)</option>
            <option value="Aadi">Aadi Pattam (ஆடிப் பட்டம்: July - August)</option>
            <option value="Samba">Samba Season (சம்பா பட்டம்: August - Oct)</option>
            <option value="Navarai">Navarai / Summer (நவரை & கோடை பருவம்)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Filter by Soil Type (மண் வகை)
          </label>
          <select
            value={selectedSoil}
            onChange={e => setSelectedSoil(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium"
          >
            <option value="All">All Soil Types (அனைத்து மண் வகைகள்)</option>
            <option value="Alluvial">Alluvial (வண்டல் மண் - Delta)</option>
            <option value="Clayey">Clayey (களிமண்)</option>
            <option value="Red">Red Soil (செம்மண்)</option>
            <option value="Black">Black Soil (கரிசல் மண்)</option>
            <option value="Sandy Loam">Sandy Loam (மணல் வண்டல்)</option>
          </select>
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCrops.map(crop => {
          const cropTitle = language === 'ta' ? crop.cropName_ta : crop.cropName;
          const seasonTitle = language === 'ta' ? crop.season_ta : crop.season;
          const advantages = language === 'ta' ? crop.keyAdvantages_ta : crop.keyAdvantages;

          return (
            <div
              key={crop.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-emerald-800">{crop.category}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {crop.durationDays} Days Duration
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {cropTitle}
                </h3>
                <div className="text-xs text-stone-500 font-mono">
                  Variety: {crop.variety}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-medium">Expected Yield / Acre</span>
                    <span className="font-bold text-stone-900 font-mono">{crop.expectedYieldPerAcre}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block font-semibold">Net Profit Estimate</span>
                    <span className="font-bold text-emerald-950 font-mono text-sm">
                      ₹{crop.estimatedNetProfitPerAcre.toLocaleString('en-IN')} / acre
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-stone-700 block">Key Agronomic Highlights:</span>
                  {advantages.map((adv, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {crop.relatedSchemeId && onViewScheme && (
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    ★ Government input subsidy available
                  </span>
                  <button
                    onClick={() => onViewScheme(crop.relatedSchemeId!)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>View Scheme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
