import React from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { DocumentReadinessItem, Language } from '../types';

interface DocumentLockerProps {
  items: DocumentReadinessItem[];
  onToggleItem: (id: string) => void;
  language: Language;
}

export const DocumentLocker: React.FC<DocumentLockerProps> = ({
  items,
  onToggleItem,
  language
}) => {
  const readyCount = items.filter(i => i.isReady).length;
  const readinessPercentage = Math.round((readyCount / items.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 2
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <span>Digital Document Readiness Locker & CSC Pre-check</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Verify your physical papers before visiting the village administrative office or CSC e-Seva center to ensure instant first-time scheme approval.
        </p>
      </div>

      {/* Readiness Progress Bar */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-700">Application Readiness Score</span>
          <span className="font-mono font-bold text-emerald-800 text-sm">
            {readinessPercentage}% Ready ({readyCount} of {items.length} Documents)
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-emerald-700 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${readinessPercentage}%` }}
          />
        </div>
        <p className="text-[11px] text-stone-500">
          {readinessPercentage === 100 
            ? '✓ Excellent! You possess all mandatory government papers required for all 15+ agricultural welfare schemes.'
            : 'Prepare the pending documents below to unlock 100% submission clearance at CSC centers.'}
        </p>
      </div>

      {/* Document Items List */}
      <div className="space-y-3">
        {items.map(item => {
          const docName = language === 'ta' ? item.name_ta : language === 'hi' ? item.name_hi : item.name;

          return (
            <div 
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                item.isReady 
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300' 
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-emerald-700 focus:outline-none"
                >
                  {item.isReady ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                  )}
                </button>
                <div>
                  <h4 className={`text-xs font-bold ${item.isReady ? 'text-stone-900' : 'text-stone-700'}`}>
                    {docName}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-stone-400 font-mono">
                    Required for {item.requiredForSchemesCount} schemes in database
                  </span>
                </div>
              </div>

              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                item.isReady 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-stone-100 text-stone-600'
              }`}>
                {item.isReady ? 'Verified Ready' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
