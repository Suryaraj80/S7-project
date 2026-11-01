import React from 'react';
import { 
  Quote, 
  Star, 
  MapPin, 
  MessageSquare, 
  ThumbsUp, 
  Lightbulb 
} from 'lucide-react';
import { FARMER_STORIES } from '../data/demoData';
import { Language } from '../types';

interface CommunityStoriesProps {
  language: Language;
}

export const CommunityStories: React.FC<CommunityStoriesProps> = ({ language }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 7
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            <span>Farmer Community Field Experiences & Success Stories</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Practical advice and real experiences from farmers who navigated government scheme applications and received direct benefits.
        </p>
      </div>

      {/* Field Tips Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
          <Lightbulb className="w-4 h-4 text-amber-700" />
          <span>Top Practical Tips from Experienced Beneficiaries</span>
        </div>
        <ul className="text-xs text-stone-700 space-y-1.5 pl-5 list-disc leading-relaxed">
          <li><strong>Aadhaar e-KYC:</strong> Ensure your mobile number linked to Aadhaar is active; OTP issues account for 80% of subsidy disbursement delays.</li>
          <li><strong>Land Chitta/Khatauni:</strong> Carry computer-printed revenue records with digital QR codes, as older handwritten receipts are often rejected by central portals.</li>
          <li><strong>Joint Landholding:</strong> If land is registered jointly in family name, obtain a stamped consent deed (NOC) from co-owners before applying for solar pump or tractor subsidies.</li>
        </ul>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FARMER_STORIES.map(story => {
          const quoteText = language === 'ta' && story.storyQuote_ta 
            ? story.storyQuote_ta 
            : language === 'hi' && story.storyQuote_hi 
              ? story.storyQuote_hi 
              : story.storyQuote;

          return (
            <div 
              key={story.id}
              className="p-5 rounded-xl border border-stone-200 bg-stone-50/40 hover:bg-white transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{story.date}</span>
                </div>

                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                  {story.schemeName}
                </div>
                <div className="text-xs font-semibold text-stone-900 mb-2">
                  {story.benefitReceived}
                </div>

                <p className="text-xs text-stone-600 italic leading-relaxed">
                  "{quoteText}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-800 block">{story.farmerName}</span>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {story.location}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  {story.crop}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
