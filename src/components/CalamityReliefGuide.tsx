import React, { useState } from 'react';
import { 
  CloudLightning, 
  Clock, 
  Camera, 
  FileText, 
  Phone, 
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';

interface CalamityReliefGuideProps {
  profile: FarmerProfile;
  language: Language;
}

export const CalamityReliefGuide: React.FC<CalamityReliefGuideProps> = ({ profile, language }) => {
  const [selectedDamageType, setSelectedDamageType] = useState<'flood' | 'drought' | 'hailstorm' | 'pest'>('flood');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 9
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <CloudLightning className="w-5 h-5 text-emerald-700" />
            <span>Emergency Crop Calamity & 72-Hour PMFBY Insurance Claim Protocol</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Government insurance guidelines strictly require localized crop losses to be intimated within 72 hours of damage to ensure surveyor inspection.
        </p>
      </div>

      {/* 72-Hour Golden Rule Alert */}
      <div className="p-4 rounded-xl border border-red-200 bg-red-50/60 flex items-start gap-3">
        <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
            Mandatory 72-Hour Rule Under PMFBY
          </h4>
          <p className="text-xs text-red-800 mt-0.5 leading-relaxed">
            In event of localized inundation, unseasonal heavy rainfall, hailstorm, or landslide, intimation must reach the insurance company, bank, or Crop Insurance App within <strong>72 hours</strong>. Delay will void individual survey compensation.
          </p>
        </div>
      </div>

      {/* Calamity Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setSelectedDamageType('flood')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
            selectedDamageType === 'flood'
              ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Flood / Inundation
        </button>

        <button
          onClick={() => setSelectedDamageType('drought')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
            selectedDamageType === 'drought'
              ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Severe Drought / Dry Spell
        </button>

        <button
          onClick={() => setSelectedDamageType('hailstorm')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
            selectedDamageType === 'hailstorm'
              ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Hailstorm / Cyclonic Gust
        </button>

        <button
          onClick={() => setSelectedDamageType('pest')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-colors ${
            selectedDamageType === 'pest'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Widespread Pest / Disease
        </button>
      </div>

      {/* 4-Step Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Immediate Step-by-Step Action Checklist
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Step 1: Capture GPS Geo-Tagged Field Photos</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Take wide-angle photographs showing standing water or broken stalks with clear farm landmarks. Open your phone camera location tags.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Step 2: Call Insurance Toll-Free (14447)</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Dial national crop insurance helpline 14447 or your state toll-free desk. State your PMFBY policy application number and get a docket number.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Step 3: Inform Village Administrative Officer (VAO)</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Submit a 1-page written intimation to the local VAO / Patwari and Block Agriculture Officer for joint field enumeration.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Step 4: Sign Joint Loss Assessment Survey</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              A joint team (insurance surveyor + revenue officer + farmer) will inspect within 10 days. Ensure you receive a signed copy of the survey sheet.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
