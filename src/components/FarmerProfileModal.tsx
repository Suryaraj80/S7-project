import React, { useState } from 'react';
import { 
  X, 
  Check, 
  User, 
  MapPin, 
  Tractor, 
  IndianRupee, 
  Users, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  FarmerProfile, 
  Language, 
  OwnershipType, 
  FarmingType, 
  IrrigationType, 
  SoilType, 
  FarmerCategory,
  LandholdingCategory 
} from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface FarmerProfileModalProps {
  profile: FarmerProfile;
  onSave: (updatedProfile: FarmerProfile) => void;
  onClose: () => void;
  language: Language;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  profile,
  onSave,
  onClose,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [activeSection, setActiveSection] = useState<'personal' | 'farming' | 'financial' | 'social'>('personal');
  const [formData, setFormData] = useState<FarmerProfile>({ ...profile });

  // Compute land classification automatically:
  const computeClassification = (acres: number): LandholdingCategory => {
    if (acres <= 2.5) return 'Marginal';
    if (acres <= 5.0) return 'Small';
    if (acres <= 10.0) return 'Semi-Medium';
    if (acres <= 25.0) return 'Medium';
    return 'Large';
  };

  const calculateCompletion = (p: FarmerProfile): number => {
    let filled = 0;
    const fields = [
      p.fullName, p.age, p.mobile, p.state, p.district, p.village,
      p.landholdingSize, p.cropType, p.farmingType, p.annualIncome, p.farmerCategory
    ];
    fields.forEach(f => {
      if (f !== undefined && f !== null && f !== '') filled++;
    });
    return Math.round((filled / fields.length) * 100);
  };

  const handleLandSizeChange = (val: number) => {
    const classification = computeClassification(val);
    setFormData(prev => ({
      ...prev,
      landholdingSize: val,
      smallMarginalClassification: classification
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      profileCompletionPercentage: calculateCompletion(formData),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900">
                {t.profileTitle}
              </h2>
              <span className="font-mono text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                {calculateCompletion(formData)}% Complete
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Accurate details ensure exact matching with central and state government guidelines.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-100/50 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSection('personal')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'personal'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.personalInfo}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('farming')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'farming'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>{t.farmingInfo}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('financial')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'financial'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{t.financialInfo}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('social')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'social'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.socialInfo}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* 1. PERSONAL INFORMATION */}
          {activeSection === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.mobile} *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.age} *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    required
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.gender}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.state} *
                  </label>
                  <select
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white font-medium"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.district} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.taluk}
                  </label>
                  <input
                    type="text"
                    value={formData.taluk}
                    onChange={e => setFormData({ ...formData, taluk: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.village}
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. FARMING INFORMATION */}
          {activeSection === 'farming' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.landSize} *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={formData.landholdingSize}
                    onChange={e => handleLandSizeChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                  <span className="text-[10px] text-emerald-800 font-semibold mt-1 block">
                    Classification: {formData.smallMarginalClassification} Farmer
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.landUnit}
                  </label>
                  <select
                    value={formData.landUnit}
                    onChange={e => setFormData({ ...formData, landUnit: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Acres">Acres</option>
                    <option value="Hectares">Hectares</option>
                    <option value="Bigha">Bigha</option>
                    <option value="Guntha">Guntha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Land Ownership
                  </label>
                  <select
                    value={formData.ownershipType}
                    onChange={e => setFormData({ ...formData, ownershipType: e.target.value as OwnershipType })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Owner">Owner (Title Holder)</option>
                    <option value="Tenant">Tenant Cultivator</option>
                    <option value="Sharecropper">Sharecropper (Bataidar)</option>
                    <option value="Leased">Leased Land</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.cropType} *
                  </label>
                  <select
                    value={formData.cropType}
                    onChange={e => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white font-medium"
                  >
                    <option value="Paddy">Paddy / Rice</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits / Horticulture</option>
                    <option value="Pulses">Pulses (Gram/Tur)</option>
                    <option value="Millets">Millets (Ragi/Bajra)</option>
                    <option value="Oilseeds">Oilseeds (Groundnut/Mustard)</option>
                    <option value="Banana">Banana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.secondaryCrop}
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCrop}
                    onChange={e => setFormData({ ...formData, secondaryCrop: e.target.value })}
                    placeholder="e.g. Pulses, Maize"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Farming Method
                  </label>
                  <select
                    value={formData.farmingType}
                    onChange={e => setFormData({ ...formData, farmingType: e.target.value as FarmingType })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Conventional">Conventional (Chemical/Fertilizer)</option>
                    <option value="Organic">Organic Farming</option>
                    <option value="Natural">Natural Farming</option>
                    <option value="ZBNF">Zero Budget Natural Farming (ZBNF)</option>
                    <option value="Mixed">Mixed Farming</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Irrigation Available?
                  </label>
                  <select
                    value={formData.irrigationAvailable ? 'true' : 'false'}
                    onChange={e => setFormData({ ...formData, irrigationAvailable: e.target.value === 'true' })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="true">Yes (Assured Water Source)</option>
                    <option value="false">No (Rainfed Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Irrigation Source
                  </label>
                  <select
                    value={formData.irrigationType}
                    onChange={e => setFormData({ ...formData, irrigationType: e.target.value as IrrigationType })}
                    disabled={!formData.irrigationAvailable}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white disabled:bg-stone-100"
                  >
                    <option value="Canal">Canal Irrigation</option>
                    <option value="Borewell">Borewell / Tubewell</option>
                    <option value="Drip/Sprinkler">Drip / Micro Sprinkler</option>
                    <option value="Rainfed">Rainfed</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Soil Type
                  </label>
                  <select
                    value={formData.soilType}
                    onChange={e => setFormData({ ...formData, soilType: e.target.value as SoilType })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Alluvial">Alluvial Soil</option>
                    <option value="Black">Black Soil (Regur)</option>
                    <option value="Red">Red Soil</option>
                    <option value="Laterite">Laterite Soil</option>
                    <option value="Clayey">Clayey Soil</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                  </select>
                </div>
              </div>

              {/* Livestock toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasLivestock}
                    onChange={e => setFormData({ ...formData, hasLivestock: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    I own livestock (Cattle, Buffalo, Goat/Sheep, or Poultry)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* 3. FINANCIAL INFORMATION */}
          {activeSection === 'financial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.annualIncome} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    required
                    value={formData.annualIncome}
                    onChange={e => {
                      const inc = Number(e.target.value);
                      let cat: any = 'Below 1 Lakh';
                      if (inc >= 500000) cat = 'Above 5 Lakhs';
                      else if (inc >= 250000) cat = '2.5 to 5 Lakhs';
                      else if (inc >= 100000) cat = '1 to 2.5 Lakhs';
                      setFormData({ ...formData, annualIncome: inc, incomeCategory: cat });
                    }}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Income Category
                  </label>
                  <select
                    value={formData.incomeCategory}
                    onChange={e => setFormData({ ...formData, incomeCategory: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Below 1 Lakh">Below ₹1,00,000</option>
                    <option value="1 to 2.5 Lakhs">₹1,00,000 to ₹2,50,000</option>
                    <option value="2.5 to 5 Lakhs">₹2,50,000 to ₹5,00,000</option>
                    <option value="Above 5 Lakhs">Above ₹5,00,000</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBpl}
                    onChange={e => setFormData({ ...formData, isBpl: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Below Poverty Line (BPL) Card Holder
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Unlocks specialized poverty alleviation and 100% subsidized input kits.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAadhaarLinkedBank}
                    onChange={e => setFormData({ ...formData, hasAadhaarLinkedBank: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Bank Account with Aadhaar and NPCI DBT Mapping
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Mandatory for receiving PM-KISAN and DBT subsidies directly.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 4. SOCIAL & ELIGIBILITY INFORMATION */}
          {activeSection === 'social' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.farmerCategory} *
                  </label>
                  <select
                    value={formData.farmerCategory}
                    onChange={e => setFormData({ ...formData, farmerCategory: e.target.value as FarmerCategory })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white font-medium"
                  >
                    <option value="General">General Category</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Landholding Classification
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${formData.smallMarginalClassification} Farmer (${formData.landholdingSize} Acres)`}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-100 text-stone-700 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isWomanFarmer}
                    onChange={e => setFormData({ ...formData, isWomanFarmer: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Woman Farmer / Woman-Headed Farm Family
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Eligible for Mahila Kisan Sashaktikaran Pariyojana (MKSP) and 10% additional farm machinery subsidy.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasDisability}
                    onChange={e => setFormData({ ...formData, hasDisability: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Differently-Abled (Divyangjan) Farmer
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Priority allocation in subsidized micro-irrigation and solar pump quotas.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveProfile}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
