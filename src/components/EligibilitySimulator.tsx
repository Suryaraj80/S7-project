import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Unlock, 
  Lock, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Zap,
  MapPin,
  Sprout,
  DollarSign,
  ShieldCheck,
  Building2,
  Filter
} from 'lucide-react';
import { FarmerProfile, Scheme, RecommendationWeights, Language, FarmerCategory } from '../types';
import { simulateWhatIf } from '../utils/recommendationEngine';
import { TRANSLATIONS } from '../utils/translations';
import { TN_38_DISTRICTS } from '../data/tamilNaduData';

interface EligibilitySimulatorProps {
  baseProfile: FarmerProfile;
  allSchemes: Scheme[];
  weights: RecommendationWeights;
  language: Language;
  onViewScheme: (schemeId: string) => void;
}

export const EligibilitySimulator: React.FC<EligibilitySimulatorProps> = ({
  baseProfile,
  allSchemes,
  weights,
  language,
  onViewScheme
}) => {
  const t = TRANSLATIONS[language];
  const [simLand, setSimLand] = useState(baseProfile.landholdingSize);
  const [simCrop, setSimCrop] = useState(baseProfile.cropType || 'Paddy');
  const [simIncome, setSimIncome] = useState(baseProfile.annualIncome || 120000);
  const [simIrrigation, setSimIrrigation] = useState(baseProfile.irrigationAvailable);
  const [simFarmingType, setSimFarmingType] = useState(baseProfile.farmingType || 'Conventional');
  const [simOrganicPledge, setSimOrganicPledge] = useState(baseProfile.farmingType === 'Organic');
  const [simDistrict, setSimDistrict] = useState(baseProfile.district || 'Thanjavur');
  const [simCategory, setSimCategory] = useState<FarmerCategory>(baseProfile.farmerCategory || 'OBC');
  const [simWoman, setSimWoman] = useState(baseProfile.isWomanFarmer || baseProfile.gender === 'Female');
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'unlocked' | 'comparison'>('all');

  const simulation = useMemo(() => {
    return simulateWhatIf(
      baseProfile,
      {
        landholdingSize: simLand,
        cropType: simCrop,
        annualIncome: simIncome,
        irrigationAvailable: simIrrigation,
        farmingType: simOrganicPledge ? 'Organic' : simFarmingType,
        district: simDistrict,
        farmerCategory: simCategory,
        isWomanFarmer: simWoman
      },
      allSchemes,
      weights
    );
  }, [baseProfile, simLand, simCrop, simIncome, simIrrigation, simFarmingType, simOrganicPledge, simDistrict, simCategory, simWoman, allSchemes, weights]);

  const handleReset = () => {
    setSimLand(baseProfile.landholdingSize);
    setSimCrop(baseProfile.cropType || 'Paddy');
    setSimIncome(baseProfile.annualIncome || 120000);
    setSimIrrigation(baseProfile.irrigationAvailable);
    setSimFarmingType(baseProfile.farmingType || 'Conventional');
    setSimOrganicPledge(baseProfile.farmingType === 'Organic');
    setSimDistrict(baseProfile.district || 'Thanjavur');
    setSimCategory(baseProfile.farmerCategory || 'OBC');
    setSimWoman(baseProfile.isWomanFarmer || baseProfile.gender === 'Female');
  };

  // Quick Preset Scenarios for instant exploration
  const applyPreset = (preset: 'organic' | 'drip' | 'mechanization' | 'vegetable' | 'solar' | 'millets') => {
    switch (preset) {
      case 'organic':
        setSimOrganicPledge(true);
        setSimFarmingType('Organic');
        break;
      case 'drip':
        setSimIrrigation(true);
        setSimCrop('Vegetables');
        break;
      case 'mechanization':
        setSimLand(7.5);
        setSimIncome(350000);
        break;
      case 'vegetable':
        setSimCrop('Vegetables');
        setSimIrrigation(true);
        break;
      case 'solar':
        setSimIrrigation(true);
        setSimLand(3.5);
        break;
      case 'millets':
        setSimCrop('Millets');
        setSimIrrigation(false);
        break;
    }
  };

  const eligibleCount = simulation.simulatedResults.filter(r => r.isEligible).length;
  const baseEligibleCount = allSchemes.length - simulation.unlockedSchemes.length;
  const totalMonetaryUnlocked = simulation.unlockedSchemes.reduce((acc, s) => acc + (s.estimated_monetary_value || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {language === 'ta' ? 'ஊடாடும் சிமுலேட்டர்' : 'Interactive What-If Matrix'}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <span>
                {language === 'ta' ? 'அரசு நலத்திட்ட தகுதி சிமுலேட்டர்' : 'Scheme Eligibility & Subsidy What-If Simulator'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'ta' 
              ? 'நில அளவு, பயிர் வகை, இயற்கை முறை, அல்லது சொட்டுநீர் பாசனத்தை மாற்றி புதிய மானியங்கள் மற்றும் அரசு உதவிகளை சோதிக்கவும்.'
              : 'Simulate how adopting organic farming, installing micro-drip irrigation, or altering land size and crops unlocks newly available Tamil Nadu and Central subsidies.'}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
          <span>{language === 'ta' ? 'சுயவிவரத்திற்கு மீட்டமை' : 'Reset to My Profile'}</span>
        </button>
      </div>

      {/* 1-Click Fast Simulation Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{language === 'ta' ? 'விரைவு உருவகப்படுத்துதல் சூழல்கள் (1-Click Presets):' : 'Instant Simulation Scenarios (1-Click Presets):'}</span>
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset('organic')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              simOrganicPledge 
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs' 
                : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ta' ? '1. 100% இயற்கை உழவர் (PKVY & சான்றிதழ்)' : '1. 100% Organic Transition (PKVY + Mission)'}</span>
          </button>

          <button
            onClick={() => applyPreset('drip')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              simIrrigation && simCrop === 'Vegetables'
                ? 'bg-blue-700 text-white border-blue-800 shadow-xs'
                : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <span>💧</span>
            <span>{language === 'ta' ? '2. சொட்டுநீர் காய்கறி தொகுப்பு (100% மானியம்)' : '2. Micro-Drip Irrigation (100% Grant)'}</span>
          </button>

          <button
            onClick={() => applyPreset('millets')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              simCrop === 'Millets'
                ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>🌾</span>
            <span>{language === 'ta' ? '3. சிறுதானிய இயக்கம் (கேழ்வரகு, கம்பு ₹3000/ha)' : '3. TN Millet Mission Cultivator'}</span>
          </button>

          <button
            onClick={() => applyPreset('mechanization')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              simLand > 6
                ? 'bg-stone-800 text-white border-stone-900 shadow-xs'
                : 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200'
            }`}
          >
            <span>🚜</span>
            <span>{language === 'ta' ? '4. தீவிர இயந்திரமயமாக்கல் (பவர் டில்லர் & CHC)' : '4. Commercial Mechanization (AED Subsidy)'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Sliders & Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-stone-50/70 p-4 sm:p-5 rounded-xl border border-stone-200">
        
        {/* Landholding Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700">
              {language === 'ta' ? 'நில அளவு' : 'Landholding Size'}
            </span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              {simLand} {language === 'ta' ? 'ஏக்கர்' : 'Acres'}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="15.0"
            step="0.1"
            value={simLand}
            onChange={e => setSimLand(parseFloat(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>0.1 (Marginal)</span>
            <span>2.5 (Small)</span>
            <span>15+ Acres</span>
          </div>
        </div>

        {/* Annual Income Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700">
              {language === 'ta' ? 'ஆண்டு வருமானம்' : 'Annual Income'}
            </span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              ₹{simIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="30000"
            max="800000"
            step="10000"
            value={simIncome}
            onChange={e => setSimIncome(parseInt(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>₹30k (BPL)</span>
            <span>₹2.5L</span>
            <span>₹8L+</span>
          </div>
        </div>

        {/* Crop Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700">
            {language === 'ta' ? 'பயிரிடப்படும் பயிர்' : 'Cultivated Crop'}
          </label>
          <select
            value={simCrop}
            onChange={e => setSimCrop(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <option value="Paddy">Paddy / Rice (நெல்)</option>
            <option value="Vegetables">Vegetables (காய்கறிகள்)</option>
            <option value="Fruits">Fruits & Orchards (பழத்தோட்டம்)</option>
            <option value="Millets">Millets (சிறுதானியங்கள்)</option>
            <option value="Pulses">Pulses & Gram (பருப்பு வகைகள்)</option>
            <option value="Sugarcane">Sugarcane (கரும்பு)</option>
            <option value="Cotton">Cotton (பருத்தி)</option>
            <option value="Oilseeds">Oilseeds / Groundnut (எண்ணெய்வித்துகள்)</option>
            <option value="Coconut">Coconut / Copra (தென்னை)</option>
            <option value="Turmeric">Turmeric & Spices (மஞ்சள் / வாசனைப்பயிர்)</option>
          </select>
        </div>

        {/* District Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>{language === 'ta' ? 'மாவட்டம்' : 'Tamil Nadu District'}</span>
          </label>
          <select
            value={simDistrict}
            onChange={e => setSimDistrict(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            {TN_38_DISTRICTS.map(d => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.name_ta})
              </option>
            ))}
          </select>
        </div>

        {/* Toggles Bar */}
        <div className="sm:col-span-2 md:col-span-4 flex flex-wrap items-center gap-4 sm:gap-6 pt-3 border-t border-stone-200">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={simIrrigation}
              onChange={e => setSimIrrigation(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 cursor-pointer"
            />
            <span>{language === 'ta' ? 'உறுதியான பாசன வசதி (கிணறு / வாய்க்கால்)' : 'Simulate Assured Irrigation (Well / Canal)'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={simOrganicPledge}
              onChange={e => setSimOrganicPledge(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 cursor-pointer"
            />
            <span>{language === 'ta' ? '100% இயற்கை வேளாண்மை (PKVY & TNOCD)' : 'Simulate 100% Chemical-Free Organic Transition'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={simWoman}
              onChange={e => setSimWoman(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 cursor-pointer"
            />
            <span>{language === 'ta' ? 'பெண் விவசாயி முன்னுரிமை' : 'Simulate Woman Farmer Applicant'}</span>
          </label>
        </div>

      </div>

      {/* Simulation Outcome Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-white">
          <span className="text-[11px] text-stone-500 block font-medium">
            {language === 'ta' ? 'தகுதியான திட்டங்கள்' : 'Eligible Schemes'}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-800 mt-1">
            {eligibleCount} <span className="text-xs text-stone-400 font-sans font-normal">of {allSchemes.length}</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-300 bg-emerald-50/70">
          <span className="text-[11px] text-emerald-800 block font-semibold">
            {language === 'ta' ? 'புதிதாக திறக்கப்பட்டவை' : 'Newly Unlocked Schemes'}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 mt-1 flex items-center gap-1">
            <Unlock className="w-5 h-5 text-emerald-600" />
            <span>+{simulation.unlockedSchemes.length}</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/60">
          <span className="text-[11px] text-amber-800 block font-semibold">
            {language === 'ta' ? 'இழக்கப்பட்ட திட்டங்கள்' : 'Lost / Excluded Schemes'}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{simulation.lostSchemes.length}</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-teal-200 bg-teal-50/60">
          <span className="text-[11px] text-teal-800 block font-semibold">
            {language === 'ta' ? 'கூடுதல் மானிய மதிப்பு' : 'Potential Subsidy Unlock'}
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-teal-900 mt-1">
            ₹{totalMonetaryUnlocked.toLocaleString('en-IN')}
          </div>
        </div>

      </div>

      {/* Unlocked Schemes Spotlight (Dynamic Reactivity) */}
      {simulation.unlockedSchemes.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'ta' 
                  ? `இந்த உருவகப்படுத்துதலால் புதிதாக ${simulation.unlockedSchemes.length} அரசு திட்டங்கள் தகுதி பெற்றுள்ளன:`
                  : `${simulation.unlockedSchemes.length} Schemes Newly Unlocked Under This Simulated Scenario:`}
              </span>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
              +₹{totalMonetaryUnlocked.toLocaleString('en-IN')} value
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {simulation.unlockedSchemes.map(sch => (
              <div 
                key={sch.id}
                onClick={() => onViewScheme(sch.id)}
                className="p-3 bg-white rounded-lg border border-emerald-200 hover:border-emerald-500 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {sch.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-stone-500">
                      {sch.level}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-stone-900 group-hover:text-emerald-800 line-clamp-1">
                    {language === 'ta' && sch.scheme_name_ta ? sch.scheme_name_ta : sch.scheme_name}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                    {sch.benefit_amount}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'ta' ? 'விவரம் காண்க' : 'View Scheme'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lost Schemes Warning */}
      {simulation.lostSchemes.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              {language === 'ta' ? 'கவனத்திற்கு - தகுதி இழக்கப்பட்ட திட்டங்கள்:' : 'Attention - Schemes Becoming Ineligible in this Scenario:'}
            </span>
            <div className="text-[11px] text-amber-800 leading-relaxed">
              {simulation.lostSchemes.slice(0, 4).map(s => (language === 'ta' && s.scheme_name_ta ? s.scheme_name_ta : s.scheme_name)).join(' · ')}
              {simulation.lostSchemes.length > 4 && ` ... and ${simulation.lostSchemes.length - 4} more`}
            </div>
            <p className="text-[10px] text-amber-700">
              {language === 'ta' 
                ? 'நில அளவு, பயிர் வகை அல்லது பாசன நிபந்தனைகள் மாறுவதால் சிறு/குறு உழவர் முன்னுரிமை மானியங்கள் மாறுபடலாம்.'
                : 'Caused by exceeding Small/Marginal land ceilings, changing focus crops away from Paddy/Millets, or removing irrigation source.'}
            </p>
          </div>
        </div>
      )}

      {/* Before vs After Profile Matrix */}
      <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
        <div className="bg-stone-100 p-3 font-bold text-stone-800 flex items-center justify-between border-b border-stone-200">
          <span>{language === 'ta' ? 'சுயவிவர ஒப்பீட்டு மேட்ரிக்ஸ் (Profile Comparison)' : 'Baseline Profile vs Simulation Comparison'}</span>
          <span className="text-[11px] text-stone-500 font-normal">Real-Time Reactive Engine</span>
        </div>
        <div className="grid grid-cols-3 divide-x divide-stone-200 bg-white">
          <div className="p-3 space-y-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Criterion</span>
            <div className="font-medium text-stone-700">Landholding</div>
            <div className="font-medium text-stone-700">Crop Focus</div>
            <div className="font-medium text-stone-700">Farming Method</div>
            <div className="font-medium text-stone-700">Irrigation</div>
            <div className="font-medium text-stone-700">Annual Income</div>
            <div className="font-medium text-stone-700">District</div>
          </div>
          <div className="p-3 space-y-1 bg-stone-50/50">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">My Baseline</span>
            <div className="text-stone-600">{baseProfile.landholdingSize} Acres</div>
            <div className="text-stone-600">{baseProfile.cropType}</div>
            <div className="text-stone-600">{baseProfile.farmingType}</div>
            <div className="text-stone-600">{baseProfile.irrigationAvailable ? 'Yes' : 'No'}</div>
            <div className="text-stone-600">₹{baseProfile.annualIncome.toLocaleString('en-IN')}</div>
            <div className="text-stone-600">{baseProfile.district}</div>
          </div>
          <div className="p-3 space-y-1 bg-emerald-50/30">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Simulation</span>
            <div className={`font-semibold ${simLand !== baseProfile.landholdingSize ? 'text-emerald-700' : 'text-stone-700'}`}>
              {simLand} Acres {simLand !== baseProfile.landholdingSize && '★'}
            </div>
            <div className={`font-semibold ${simCrop !== baseProfile.cropType ? 'text-emerald-700' : 'text-stone-700'}`}>
              {simCrop} {simCrop !== baseProfile.cropType && '★'}
            </div>
            <div className={`font-semibold ${simOrganicPledge ? 'text-emerald-700' : 'text-stone-700'}`}>
              {simOrganicPledge ? 'Organic' : simFarmingType} {simOrganicPledge && '★'}
            </div>
            <div className={`font-semibold ${simIrrigation !== baseProfile.irrigationAvailable ? 'text-emerald-700' : 'text-stone-700'}`}>
              {simIrrigation ? 'Assured' : 'Rainfed'}
            </div>
            <div className={`font-semibold ${simIncome !== baseProfile.annualIncome ? 'text-emerald-700' : 'text-stone-700'}`}>
              ₹{simIncome.toLocaleString('en-IN')}
            </div>
            <div className={`font-semibold ${simDistrict !== baseProfile.district ? 'text-emerald-700' : 'text-stone-700'}`}>
              {simDistrict}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
