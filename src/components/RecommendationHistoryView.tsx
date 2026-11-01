import React from 'react';
import { 
  History, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { RecommendationSession, Language } from '../types';

interface RecommendationHistoryViewProps {
  sessions: RecommendationSession[];
  onViewScheme: (schemeId: string) => void;
  language: Language;
}

export const RecommendationHistoryView: React.FC<RecommendationHistoryViewProps> = ({
  sessions,
  onViewScheme,
  language
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 10
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <History className="w-5 h-5 text-emerald-700" />
            <span>Farmer Recommendation Session History & Audit Snapshots</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Review previous scheme discovery sessions and track score variations as your crop rotation and land records evolve.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 text-center text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <History className="w-8 h-8 mx-auto mb-2 text-stone-300" />
          <p className="text-xs font-medium text-stone-600">No previous recommendation sessions recorded yet.</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Generate recommendations on your dashboard to save historical sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div 
              key={session.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2 font-medium text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Session Date: {new Date(session.timestamp).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.landSize} Acres {session.crop}</span>
                </div>
                <span className="font-mono text-emerald-800 font-bold">
                  {session.totalRecommendations} Schemes Evaluated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {session.results.slice(0, 6).map(res => (
                  <button
                    key={res.schemeId}
                    onClick={() => onViewScheme(res.schemeId)}
                    className="p-2.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-300 text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-stone-900 truncate group-hover:text-emerald-800">
                        {res.schemeName}
                      </div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${res.isEligible ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                        <span>{res.isEligible ? 'Eligible' : 'Verify'}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 shrink-0">
                      {res.score}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
