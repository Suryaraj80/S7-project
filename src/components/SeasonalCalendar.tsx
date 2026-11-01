import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  ArrowRight,
  Sun,
  CloudRain,
  Snowflake
} from 'lucide-react';
import { SEASONAL_DEADLINES } from '../data/demoData';
import { Language } from '../types';

interface SeasonalCalendarProps {
  language: Language;
  onViewScheme: (schemeId: string) => void;
}

export const SeasonalCalendar: React.FC<SeasonalCalendarProps> = ({
  language,
  onViewScheme
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 4
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <CalendarIcon className="w-5 h-5 text-emerald-700" />
            <span>Seasonal Agricultural Calendar & Subsidy Deadline Tracker</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Never miss critical crop insurance cutoff dates, seed distribution windows, or annual solar pump allotment quotas.
        </p>
      </div>

      {/* Season Explainer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <CloudRain className="w-4 h-4 text-amber-700" />
            <span>Kharif Season (Monsoon)</span>
          </div>
          <p className="text-stone-600 mt-1 text-[11px]">
            Sowing: June - July · Harvesting: Sept - Oct. Priority schemes: PMFBY crop insurance, certified paddy seed packages.
          </p>
        </div>

        <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Snowflake className="w-4 h-4 text-blue-700" />
            <span>Rabi Season (Winter)</span>
          </div>
          <p className="text-stone-600 mt-1 text-[11px]">
            Sowing: Oct - Nov · Harvesting: Feb - April. Priority schemes: Wheat and gram seed subsidy, micro-irrigation installations.
          </p>
        </div>

        <div className="p-3 rounded-xl border border-orange-200 bg-orange-50/50">
          <div className="flex items-center gap-1.5 font-bold text-orange-900">
            <Sun className="w-4 h-4 text-orange-700" />
            <span>Zaid / Summer Season</span>
          </div>
          <p className="text-stone-600 mt-1 text-[11px]">
            Cultivation: March - June. Priority schemes: Water-efficient vegetables, solar pumps (PM-KUSUM), drip fertigation.
          </p>
        </div>
      </div>

      {/* Deadlines Timeline Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Active Government Deadlines & Subsidy Windows
        </h3>

        <div className="space-y-2.5">
          {SEASONAL_DEADLINES.map(dl => (
            <div 
              key={dl.id}
              className="p-4 rounded-xl border border-stone-200 hover:border-emerald-300 bg-stone-50/40 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-emerald-800">{dl.schemeName}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-500 font-medium">{dl.season} Cycle</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    dl.status === 'Closing Soon' 
                      ? 'bg-red-100 text-red-800' 
                      : dl.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                  }`}>
                    {dl.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-stone-900">
                  {dl.title}
                </h4>

                <p className="text-[11px] text-stone-500">
                  {dl.actionRequired}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">Cutoff Date</span>
                  <span className="font-mono text-xs font-bold text-stone-800">{dl.deadlineDate}</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">{dl.daysRemaining} days left</span>
                </div>

                <button
                  onClick={() => onViewScheme(dl.schemeId)}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                  title="View Scheme Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
