import React, { useState } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  Sun, 
  Droplet, 
  Tractor, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';

interface SubsidyCalculatorProps {
  profile: FarmerProfile;
  language: Language;
}

export const SubsidyCalculator: React.FC<SubsidyCalculatorProps> = ({ profile, language }) => {
  const [calculatorType, setCalculatorType] = useState<'solar' | 'drip' | 'mechanization'>('solar');

  // Solar pump state
  const [pumpHp, setPumpHp] = useState<number>(5);
  const [pumpType, setPumpType] = useState<'surface' | 'submersible'>('submersible');

  // Drip state
  const [dripLandAcres, setDripLandAcres] = useState<number>(profile.landholdingSize || 2.0);
  const [cropSpacing, setCropSpacing] = useState<'wide' | 'medium' | 'close'>('medium');

  // Machinery state
  const [machineType, setMachineType] = useState<'tractor' | 'power_tiller' | 'rotavator'>('tractor');
  const [tractorHp, setTractorHp] = useState<number>(45);

  // Solar calculation:
  // 3 HP: ~₹1,80,000 total cost. 60% subsidy = ₹1,08,000. Farmer pays ₹72,000
  // 5 HP: ~₹2,50,000 total cost. 60% subsidy = ₹1,50,000. Farmer pays ₹1,00,000
  // 7.5 HP: ~₹3,50,000 total cost. 60% subsidy = ₹2,10,000. Farmer pays ₹1,40,000
  const solarBaseCost = pumpHp === 3 ? 180000 : pumpHp === 5 ? 250000 : 350000;
  const isPriorityState = profile.state === 'Tamil Nadu' || profile.state === 'Uttar Pradesh';
  const solarSubsidyPercent = isPriorityState ? 70 : 60;
  const solarSubsidyAmount = Math.round((solarBaseCost * solarSubsidyPercent) / 100);
  const solarFarmerShare = solarBaseCost - solarSubsidyAmount;

  // Drip calculation:
  // Base cost ~ ₹45,000 to ₹75,000 per acre
  const dripCostPerAcre = cropSpacing === 'close' ? 75000 : cropSpacing === 'medium' ? 55000 : 42000;
  const dripTotalCost = Math.round(dripCostPerAcre * dripLandAcres);
  const isSmallMarginal = profile.landholdingSize <= 5.0;
  const dripSubsidyPercent = profile.state === 'Tamil Nadu' 
    ? (isSmallMarginal ? 100 : 75) 
    : (isSmallMarginal ? 55 : 45);
  const dripSubsidyAmount = Math.round((dripTotalCost * dripSubsidyPercent) / 100);
  const dripFarmerShare = dripTotalCost - dripSubsidyAmount;

  // Machinery calculation:
  let machineCost = 0;
  let maxSubsidyCap = 0;
  let machinePercent = profile.isWomanFarmer || profile.farmerCategory === 'SC' || profile.farmerCategory === 'ST' ? 50 : 40;

  if (machineType === 'tractor') {
    machineCost = tractorHp >= 40 ? 750000 : 550000;
    maxSubsidyCap = 125000;
  } else if (machineType === 'power_tiller') {
    machineCost = 180000;
    maxSubsidyCap = 85000;
  } else {
    machineCost = 110000;
    maxSubsidyCap = 45000;
  }
  const rawSubsidy = Math.round((machineCost * machinePercent) / 100);
  const machineSubsidyAmount = Math.min(rawSubsidy, maxSubsidyCap);
  const machineFarmerShare = machineCost - machineSubsidyAmount;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 5
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <Calculator className="w-5 h-5 text-emerald-700" />
            <span>Precision Subsidy & Capital Grant Calculator</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Calculate your exact out-of-pocket share and direct government grant under PM-KUSUM, Micro-Irrigation, and Agricultural Mechanization.
        </p>
      </div>

      {/* Calculator Type Tabs */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl max-w-md">
        <button
          onClick={() => setCalculatorType('solar')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            calculatorType === 'solar'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Solar Pump</span>
        </button>
        <button
          onClick={() => setCalculatorType('drip')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            calculatorType === 'drip'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Droplet className="w-3.5 h-3.5 text-blue-600" />
          <span>Drip Irrigation</span>
        </button>
        <button
          onClick={() => setCalculatorType('mechanization')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            calculatorType === 'mechanization'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Tractor className="w-3.5 h-3.5 text-emerald-700" />
          <span>Machinery</span>
        </button>
      </div>

      {/* CALCULATOR 1: SOLAR PUMP */}
      {calculatorType === 'solar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Solar Pump Capacity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 7.5].map(hp => (
                  <button
                    key={hp}
                    type="button"
                    onClick={() => setPumpHp(hp)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                      pumpHp === hp 
                        ? 'bg-emerald-800 text-white border-emerald-800' 
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {hp} HP
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Water Source Type
              </label>
              <select
                value={pumpType}
                onChange={e => setPumpType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="submersible">Deep Borewell (Submersible Pump)</option>
                <option value="surface">Open Well / Farm Pond (Surface Pump)</option>
              </select>
            </div>

            <div className="text-[11px] text-stone-500 bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700">Scheme: </span>
              PM-KUSUM Component-B ({profile.state} quota active)
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Estimated Financial Breakdown
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Standard Empanelled Cost:</span>
                <span className="font-mono font-medium">₹{solarBaseCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold border-t border-emerald-200 pt-1.5">
                <span>Government Grant ({solarSubsidyPercent}%):</span>
                <span className="font-mono text-sm">₹{solarSubsidyAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-800 font-bold border-t border-emerald-200 pt-1.5">
                <span>Farmer Contribution ({100 - solarSubsidyPercent}%):</span>
                <span className="font-mono text-base text-stone-900">₹{solarFarmerShare.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-950 mt-2 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              * Bank loan available for up to 30% of farmer contribution. Eliminates ₹6,000–₹10,000 monthly diesel fuel costs.
            </p>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: DRIP IRRIGATION */}
      {calculatorType === 'drip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-200">
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Coverage Land Area</span>
                <span className="font-mono text-emerald-800">{dripLandAcres} Acres</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.25"
                value={dripLandAcres}
                onChange={e => setDripLandAcres(parseFloat(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Crop Spacing
              </label>
              <select
                value={cropSpacing}
                onChange={e => setCropSpacing(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="medium">Medium Spacing (Sugarcane, Cotton, Vegetables)</option>
                <option value="close">Close Spacing (Banana, Papaya, High-density)</option>
                <option value="wide">Wide Spacing (Coconut, Mango, Guava)</option>
              </select>
            </div>

            <div className="text-[11px] text-stone-500 bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700">Scheme: </span>
              Per Drop More Crop (PDMC - PMKSY)
            </div>
          </div>

          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Estimated Financial Breakdown
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Total Installation Cost:</span>
                <span className="font-mono font-medium">₹{dripTotalCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold border-t border-emerald-200 pt-1.5">
                <span>Government Subsidy ({dripSubsidyPercent}%):</span>
                <span className="font-mono text-sm">₹{dripSubsidyAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-800 font-bold border-t border-emerald-200 pt-1.5">
                <span>Farmer Share ({100 - dripSubsidyPercent}%):</span>
                <span className="font-mono text-base text-stone-900">₹{dripFarmerShare.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-950 mt-2 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              {profile.state === 'Tamil Nadu' && isSmallMarginal
                ? '★ 100% full subsidy eligible for Small & Marginal farmers in Tamil Nadu!'
                : 'Saves up to 60% water and increases crop productivity by 35%.'}
            </p>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: MECHANIZATION */}
      {calculatorType === 'mechanization' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-200">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Equipment Category
              </label>
              <select
                value={machineType}
                onChange={e => setMachineType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="tractor">Agricultural Tractor</option>
                <option value="power_tiller">Power Tiller</option>
                <option value="rotavator">Rotavator / Cultivator</option>
              </select>
            </div>

            {machineType === 'tractor' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tractor Horsepower (HP)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[35, 45].map(hp => (
                    <button
                      key={hp}
                      type="button"
                      onClick={() => setTractorHp(hp)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                        tractorHp === hp 
                          ? 'bg-emerald-800 text-white border-emerald-800' 
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      {hp} HP Engine
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-stone-500 bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700">Scheme: </span>
              Sub-Mission on Agricultural Mechanization (SMAM)
            </div>
          </div>

          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Estimated Financial Breakdown
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Equipment Approximate Price:</span>
                <span className="font-mono font-medium">₹{machineCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold border-t border-emerald-200 pt-1.5">
                <span>Government Subsidy ({machinePercent}% capped):</span>
                <span className="font-mono text-sm">₹{machineSubsidyAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-800 font-bold border-t border-emerald-200 pt-1.5">
                <span>Farmer Share to Pay:</span>
                <span className="font-mono text-base text-stone-900">₹{machineFarmerShare.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-950 mt-2 bg-white/80 p-2.5 rounded-lg border border-emerald-200">
              SC/ST, Women, and Small/Marginal farmers receive up to 50% subsidy priority under the SMAM DBT portal.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
