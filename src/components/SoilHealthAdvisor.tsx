import React, { useState } from 'react';
import { 
  FlaskConical, 
  Leaf, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';

interface SoilHealthAdvisorProps {
  profile: FarmerProfile;
  language: Language;
  onViewScheme: (schemeId: string) => void;
}

export const SoilHealthAdvisor: React.FC<SoilHealthAdvisorProps> = ({
  profile,
  language,
  onViewScheme
}) => {
  const [nitrogen, setNitrogen] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [phosphorus, setPhosphorus] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [potassium, setPotassium] = useState<'Low' | 'Medium' | 'High'>('High');
  const [phLevel, setPhLevel] = useState<number>(6.8);
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.45); // in %

  // Calculate savings
  const ureaWastePrevented = nitrogen === 'High' ? 40 : 20;
  const fertilizerSavingPerAcre = nitrogen === 'High' ? 1200 : 750;
  const totalFarmSavings = Math.round(fertilizerSavingPerAcre * profile.landholdingSize);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 6
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <FlaskConical className="w-5 h-5 text-emerald-700" />
            <span>Soil Nutrient Test Analyzer & Fertilizer Advisory</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Input your 12-parameter Soil Health Card numbers to calculate optimal urea/DAP dosage, cut input costs by 25%, and match organic bio-fertilizer subsidies.
        </p>
      </div>

      {/* Input Sliders / Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Available Nitrogen (N)
          </label>
          <select
            value={nitrogen}
            onChange={e => setNitrogen(e.target.value as any)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
          >
            <option value="Low">Low (&lt; 280 kg/ha)</option>
            <option value="Medium">Medium (280 - 560 kg/ha)</option>
            <option value="High">High (&gt; 560 kg/ha)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Available Phosphorus (P)
          </label>
          <select
            value={phosphorus}
            onChange={e => setPhosphorus(e.target.value as any)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
          >
            <option value="Low">Low (&lt; 10 kg/ha)</option>
            <option value="Medium">Medium (10 - 25 kg/ha)</option>
            <option value="High">High (&gt; 25 kg/ha)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Available Potassium (K)
          </label>
          <select
            value={potassium}
            onChange={e => setPotassium(e.target.value as any)}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
          >
            <option value="Low">Low (&lt; 110 kg/ha)</option>
            <option value="Medium">Medium (110 - 280 kg/ha)</option>
            <option value="High">High (&gt; 280 kg/ha)</option>
          </select>
        </div>

        <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
              <span>Soil pH Level</span>
              <span className="font-mono text-emerald-800">{phLevel} ({phLevel < 6.5 ? 'Acidic' : phLevel > 7.5 ? 'Alkaline' : 'Neutral & Fertile'})</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="9.0"
              step="0.1"
              value={phLevel}
              onChange={e => setPhLevel(parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
              <span>Organic Carbon (OC)</span>
              <span className="font-mono text-emerald-800">{organicCarbon}% ({organicCarbon < 0.5 ? 'Deficient' : 'Sufficient'})</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={organicCarbon}
              onChange={e => setOrganicCarbon(parseFloat(e.target.value))}
              className="w-full accent-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* Advisory Outcome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Fertilizer Prescription */}
        <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Targeted Nutrient Prescription for {profile.cropType}</span>
          </h4>
          <div className="space-y-1 text-xs text-stone-700">
            <p>• <strong>Urea Dosage:</strong> {nitrogen === 'High' ? 'Reduce by 25% to avoid pest lodging' : 'Apply split dose in 3 stages (basal, tillering, panicle)'}.</p>
            <p>• <strong>DAP / Superphosphate:</strong> {phosphorus === 'High' ? 'Skip basal phosphate to avoid soil fixation' : 'Apply 45 kg/acre basal application'}.</p>
            <p>• <strong>Zinc Sulphate:</strong> Apply 10 kg/acre to treat micro-nutrient deficiency.</p>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">Estimated Input Cost Saved:</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">
              ₹{totalFarmSavings.toLocaleString('en-IN')} / season
            </span>
          </div>
        </div>

        {/* Matching Scheme CTA */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Govt Support Matched
            </span>
            <h4 className="text-xs font-bold text-stone-900 mt-1">
              Paramparagat Krishi Vikas Yojana (PKVY) & Free Soil Health Card
            </h4>
            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
              Since your organic carbon is {organicCarbon}%, you are eligible for ₹50,000/ha subsidy under PKVY to establish vermicompost and bio-fertilizer production on your farm.
            </p>
          </div>

          <button
            onClick={() => onViewScheme('pkvy-organic')}
            className="px-3 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center justify-between"
          >
            <span>View PKVY Organic Subsidy Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
