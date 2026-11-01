import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ExternalLink, 
  Phone, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  Printer, 
  Download,
  Volume2, 
  VolumeX, 
  Calendar,
  Layers,
  MapPin,
  IndianRupee,
  Share2
} from 'lucide-react';
import { Scheme, FarmerProfile, Language, RecommendationResult } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { printSchemeApplicationKit, downloadSchemeApplicationKit } from '../utils/pdfExport';

// WhatsApp icon SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="0"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29" />
  </svg>
);

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  recommendation?: RecommendationResult;
  profile: FarmerProfile;
  language: Language;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onClose: () => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  recommendation,
  profile,
  language,
  isSaved,
  onToggleSave,
  onClose
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!scheme) return null;

  const title = (language === 'ta' && scheme.scheme_name_ta) 
    ? scheme.scheme_name_ta 
    : (language === 'hi' && scheme.scheme_name_hi) 
      ? scheme.scheme_name_hi 
      : scheme.scheme_name;

  const benefitsText = (language === 'ta' && scheme.benefits_ta) 
    ? scheme.benefits_ta 
    : (language === 'hi' && scheme.benefits_hi) 
      ? scheme.benefits_hi 
      : scheme.benefits;

  const whatsappShareMessage = useMemo(() => {
    const schemeLink = scheme.application_url || scheme.official_website;
    if (language === 'ta') {
      return `🌾 *அண்ணா அக்ரி ஏஐ - விவசாயிகளுக்கான அரசு நலத்திட்ட தகவல்* 🌾\n\n📌 *திட்டம்:* ${title}\n🏷️ *பிரிவு:* ${scheme.category} (${scheme.level} திட்டம்)\n💰 *முக்கிய மானியம்/பலன்:* ${scheme.benefit_amount}\n📍 *பொருந்தும் மாநிலம்:* ${scheme.state}\n\n🔗 *அதிகாரப்பூர்வ தளம் & விண்ணப்பம்:*\n${schemeLink}\n\n_அண்ணா அக்ரி AI (ANNA AGRI AI - AAA Platform) மூலம் பகிரப்பட்டது_`;
    } else if (language === 'hi') {
      return `🌾 *किसानों के लिए महत्वपूर्ण सरकारी योजना* 🌾\n\n📌 *योजना:* ${title}\n🏷️ *श्रेणी:* ${scheme.category} (${scheme.level} योजना)\n💰 *मुख्य लाभ/सब्सिडी:* ${scheme.benefit_amount}\n📍 *राज्य:* ${scheme.state}\n\n🔗 *आधिकारिक पोर्टल एवं आवेदन लिंक:*\n${schemeLink}\n\n_ANNA AGRI AI (AAA Platform) द्वारा साझा किया गया_`;
    }
    return `🌾 *Important Government Scheme for Farmers* 🌾\n\n📌 *Scheme:* ${title}\n🏷️ *Category:* ${scheme.category} (${scheme.level} Scheme)\n💰 *Key Benefit:* ${scheme.benefit_amount}\n📍 *Applicable State:* ${scheme.state}\n\n🔗 *Official Portal & Application Link:*\n${schemeLink}\n\n_Shared via ANNA AGRI AI (AAA Platform for Farmers)_`;
  }, [scheme, title, language]);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareMessage)}`;

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${title}. Category: ${scheme.category}. Benefits: ${scheme.benefit_amount}. ${benefitsText}. Documents required: ${scheme.required_documents.join(', ')}.`;
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    if (language === 'ta') utterance.lang = 'ta-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';
    
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 flex-wrap">
              <span className="font-semibold text-stone-700">{scheme.level} Scheme</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                {scheme.state === 'All India' ? 'Pan-India Central Scheme' : scheme.state}
              </span>
              <span aria-hidden="true">·</span>
              <span>{scheme.category}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Voice Read-Aloud */}
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-lg border transition-colors ${
                isPlayingAudio 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse' 
                  : 'border-stone-200 text-stone-600 hover:bg-white'
              }`}
              title={isPlayingAudio ? t.stopAudio : t.readAloud}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Share via WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 transition-colors"
              title="Share via WhatsApp"
              aria-label="Share via WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
            </a>

            {/* Save Scheme */}
            <button
              onClick={() => onToggleSave(scheme.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                  : 'border-stone-200 text-stone-600 hover:bg-white'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Scheme'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-700' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          
          {/* Match Score Banner if recommendation is provided */}
          {recommendation && (
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              recommendation.isEligible 
                ? 'bg-emerald-50/70 border-emerald-200' 
                : 'bg-amber-50/70 border-amber-200'
            }`}>
              <div>
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <span>{t.systemMatchScore}:</span>
                  <span className="font-mono text-emerald-800 text-base">{recommendation.matchScore}%</span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  {recommendation.isEligible ? t.eligibleStatus : t.ineligibleStatus}
                </p>
              </div>

              {recommendation.reasons.length > 0 && (
                <div className="text-xs text-stone-600 space-y-1">
                  {recommendation.reasons.filter(r => r.matched).slice(0, 2).map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{r.explanation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scheme Objective & Full Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Scheme Overview & Objective
            </h3>
            <p className="text-stone-700 leading-relaxed">
              {scheme.full_description}
            </p>
          </div>

          {/* Assistance & Benefits */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Assistance & Benefit Structure</span>
            </h3>
            <div className="font-bold text-base text-stone-900">
              {scheme.benefit_amount}
            </div>
            <p className="text-stone-600 leading-relaxed text-xs">
              {benefitsText}
            </p>
          </div>

          {/* Eligibility Matrix */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Eligibility Conditions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-stone-400 block text-[11px]">Age Limit</span>
                <span className="font-semibold text-stone-900">{scheme.minimum_age} to {scheme.maximum_age} years</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-stone-400 block text-[11px]">Landholding Bracket</span>
                <span className="font-semibold text-stone-900">
                  {scheme.land_min > 0 ? `Min ${scheme.land_min} acres` : 'No minimum'} · {scheme.land_max > 0 ? `Max ${scheme.land_max} acres` : 'No upper limit'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-stone-400 block text-[11px]">Targeted Crops</span>
                <span className="font-semibold text-stone-900">{scheme.eligible_crops.join(', ')}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-stone-400 block text-[11px]">Ownership Requirement</span>
                <span className="font-semibold text-stone-900">{scheme.ownership_requirement}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-stone-400 block text-[11px]">Irrigation Requirement</span>
                <span className="font-semibold text-stone-900">{scheme.irrigation_requirement}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-stone-400 block text-[11px]">Income Limit</span>
                <span className="font-semibold text-stone-900">
                  {scheme.income_limit > 0 ? `Up to ₹${scheme.income_limit.toLocaleString('en-IN')}/year` : 'No income cap'}
                </span>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Mandatory Documents Required
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {scheme.required_documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Application Procedure */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Step-by-Step Application Procedure
            </h3>
            <ol className="space-y-2 text-xs text-stone-700">
              {scheme.application_process.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Support Helpline & Official Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-stone-200 flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">Toll-Free Helpline</span>
                <span className="font-semibold text-stone-900 font-mono text-xs">{scheme.helpline}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="truncate">
                <span className="text-[11px] text-stone-400 block font-medium">Official Portal</span>
                <a 
                  href={scheme.official_website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-medium text-emerald-700 hover:underline truncate block text-xs"
                >
                  {scheme.official_website}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => printSchemeApplicationKit(scheme, profile)}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              title="Print Application Kit"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'ta' ? 'அச்சிடு (Print Kit)' : 'Print Kit'}</span>
            </button>

            <button
              onClick={() => downloadSchemeApplicationKit(scheme, profile)}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-300 rounded-lg hover:bg-stone-200 transition-colors flex items-center gap-1.5"
              title="Download Application Kit as HTML file"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.downloadKit}</span>
            </button>

            {/* Share via WhatsApp Button */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Share scheme details with other farmers on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'வாட்ஸ்அப் பகிர்வு' : language === 'hi' ? 'व्हाट्सएप पर शेयर' : 'Share via WhatsApp'}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              {t.close}
            </button>
            <a
              href={scheme.application_url || scheme.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>{t.applyNow}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
