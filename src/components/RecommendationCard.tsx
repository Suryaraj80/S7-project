import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  FileText, 
  ExternalLink, 
  ChevronRight,
  Sparkles,
  Printer,
  Download
} from 'lucide-react';
import { RecommendationResult, FarmerProfile, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { printSchemeApplicationKit, downloadSchemeApplicationKit } from '../utils/pdfExport';

interface RecommendationCardProps {
  recommendation: RecommendationResult;
  profile: FarmerProfile;
  language: Language;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onViewDetails: (schemeId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  profile,
  language,
  isSaved,
  onToggleSave,
  onViewDetails
}) => {
  const { scheme, matchScore, isEligible, reasons, unmatchedCriteria } = recommendation;
  const t = TRANSLATIONS[language];

  // Localized title or fallback
  const title = (language === 'ta' && scheme.scheme_name_ta) 
    ? scheme.scheme_name_ta 
    : (language === 'hi' && scheme.scheme_name_hi) 
      ? scheme.scheme_name_hi 
      : scheme.scheme_name;

  const shortDesc = (language === 'ta' && scheme.short_description_ta) 
    ? scheme.short_description_ta 
    : (language === 'hi' && scheme.short_description_hi) 
      ? scheme.short_description_hi 
      : scheme.short_description;

  const keyBenefit = (language === 'ta' && scheme.benefits_ta) 
    ? scheme.benefits_ta 
    : (language === 'hi' && scheme.benefits_hi) 
      ? scheme.benefits_hi 
      : scheme.benefits;

  return (
    <div className={`rounded-xl border transition-all duration-200 bg-white p-5 sm:p-6 ${
      isEligible 
        ? 'border-stone-200 hover:border-emerald-300 hover:shadow-xs' 
        : 'border-stone-200/80 bg-stone-50/50 opacity-90'
    }`}>
      
      {/* Top row: Clean unboxed metadata with typographic separators */}
      <div className="flex items-center justify-between gap-2 mb-3 text-xs text-stone-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-stone-700">{scheme.level} Scheme</span>
          <span aria-hidden="true">·</span>
          <span>{scheme.state === 'All India' ? 'Pan-India' : scheme.state}</span>
          <span aria-hidden="true">·</span>
          <span>{scheme.category}</span>
        </div>

        {/* System Match Score in Tabular Numerals */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Match</span>
          <span className={`font-mono tabular-nums font-bold text-sm px-2 py-0.5 rounded ${
            matchScore >= 80 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : matchScore >= 60 
                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                : 'bg-stone-100 text-stone-700'
          }`}>
            {matchScore}%
          </span>
        </div>
      </div>

      {/* Primary Card Title */}
      <h3 className="text-lg font-bold text-stone-900 mb-2 leading-snug">
        {title}
      </h3>

      {/* Eligibility Status Kicker */}
      <div className="flex items-center gap-1.5 mb-3 text-xs">
        {isEligible ? (
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.eligibleStatus}
          </span>
        ) : (
          <span className="text-amber-700 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {t.ineligibleStatus}
          </span>
        )}
      </div>

      {/* Short Description */}
      <p className="text-sm text-stone-600 mb-4 line-clamp-2 leading-relaxed">
        {shortDesc}
      </p>

      {/* Key Benefit Highlight Box */}
      <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100/80 mb-4">
        <div className="text-[11px] uppercase font-semibold text-emerald-800 tracking-wider mb-1">
          {t.benefitLabel}
        </div>
        <p className="text-xs font-medium text-emerald-950 line-clamp-2">
          {scheme.benefit_amount}
        </p>
      </div>

      {/* Explainable "Why this scheme matches you" */}
      <div className="border-t border-stone-100 pt-3 mb-4">
        <div className="text-xs font-semibold text-stone-700 mb-2">
          {t.whyMatchesYou}
        </div>
        <div className="space-y-1.5 text-xs">
          {reasons.slice(0, 3).map((reason, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-stone-600">
              <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${reason.matched ? 'text-emerald-600' : 'text-stone-300'}`} />
              <span className={reason.matched ? 'text-stone-800' : 'text-stone-400'}>
                {reason.explanation}
              </span>
            </div>
          ))}
          {unmatchedCriteria.length > 0 && (
            <div className="flex items-start gap-1.5 text-amber-700 mt-1 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{unmatchedCriteria[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(scheme.id)}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${
              isSaved 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-700' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? t.savedScheme : t.saveScheme}</span>
          </button>

          <button
            onClick={() => printSchemeApplicationKit(scheme, profile)}
            className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium transition-colors flex items-center gap-1"
            title="Print Application Kit"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Print Kit</span>
          </button>

          <button
            onClick={() => downloadSchemeApplicationKit(scheme, profile)}
            className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium transition-colors flex items-center gap-1"
            title="Download Application Kit (.html)"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🌾 *${title}* (${scheme.level} Scheme - ${scheme.category})\n💰 Benefit: ${scheme.benefit_amount}\n🔗 Official Portal: ${scheme.official_website || scheme.application_url}\nShared via ANNA AGRI AI (AAA Platform for Farmers)`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-stone-200 text-emerald-700 hover:bg-emerald-50 text-xs font-medium transition-colors flex items-center gap-1"
            title="Share via WhatsApp"
            aria-label="Share via WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              strokeWidth="0"
              fill="currentColor"
              className="w-3.5 h-3.5 text-emerald-600"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29" />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </a>
        </div>

        <button
          onClick={() => onViewDetails(scheme.id)}
          className="px-4 py-2 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1 shrink-0"
        >
          <span>{t.viewDetails}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
