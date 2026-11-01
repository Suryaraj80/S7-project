import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Tag, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  DollarSign, 
  ArrowRight,
  Filter,
  Search,
  Package,
  ShieldCheck,
  Building2,
  Calendar,
  Share2,
  FileText
} from 'lucide-react';
import { User, Language, MarketplaceListing } from '../types';
import { INITIAL_MARKETPLACE_LISTINGS, TN_38_DISTRICTS } from '../data/tamilNaduData';

interface BuyerHomeViewProps {
  currentUser: User;
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const BuyerHomeView: React.FC<BuyerHomeViewProps> = ({
  currentUser,
  language,
  onNavigateTab
}) => {
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [inquiryProduce, setInquiryProduce] = useState('Pollachi Tender Coconut');
  const [inquiryQty, setInquiryQty] = useState('2,000 Pieces');
  const [inquiryNotes, setInquiryNotes] = useState('Bi-weekly scheduled delivery to apartment society clubhouse.');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Top GI & Special Commodities from Tamil Nadu
  const specialtyCommodities = [
    {
      id: 'gi-pollachi-coconut',
      name: 'Pollachi Tender Coconut (இளநீர்)',
      district: 'Coimbatore',
      farmgatePrice: '₹32 / piece',
      mandiRetailPrice: '₹55 / piece',
      savings: '41% Direct Savings',
      leadTime: '12 Hours to Bengaluru',
      season: 'Year-Round Harvest',
      farmer: 'Thirunavukkarasu P. (Pollachi)',
      farmerPhone: '9842511223'
    },
    {
      id: 'gi-panruti-jackfruit',
      name: 'Panruti GI Sweet Jackfruit (பலா)',
      district: 'Cuddalore',
      farmgatePrice: '₹40 / kg',
      mandiRetailPrice: '₹80 / kg',
      savings: '50% Direct Savings',
      leadTime: '18 Hours to Bengaluru/Chennai',
      season: 'Peak Season Now',
      farmer: 'Kaliyaperumal G. (Panruti)',
      farmerPhone: '9443445566'
    },
    {
      id: 'gi-erode-turmeric',
      name: 'Erode GI High-Curcumin Turmeric (மஞ்சள்)',
      district: 'Erode',
      farmgatePrice: '₹140 / kg',
      mandiRetailPrice: '₹220 / kg',
      savings: '36% Direct Savings',
      leadTime: 'Next-Day Dispatch',
      season: 'Sun-Dried Batches',
      farmer: 'Senthamizh Selvan (Kodumudi)',
      farmerPhone: '9443899120'
    },
    {
      id: 'gi-dindigul-shallots',
      name: 'Dindigul Small Onion / Shallots (சின்ன வெங்காயம்)',
      district: 'Dindigul',
      farmgatePrice: '₹48 / kg',
      mandiRetailPrice: '₹85 / kg',
      savings: '43% Direct Savings',
      leadTime: '14 Hours to Bengaluru/Kochi',
      season: 'Fresh Harvest',
      farmer: 'Muthuvelan Subbiah (Dindigul)',
      farmerPhone: '9443219870'
    }
  ];

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    const text = `*ANNA AGRI AI - Bulk Produce Sourcing Inquiry*\nBuyer: ${currentUser.name}\nDestination: ${selectedCity}\nRequested Item: ${inquiryProduce}\nQuantity: ${inquiryQty}\nNotes: ${inquiryNotes}\nBuyer Contact: +91 ${currentUser.mobile}`;
    window.open(`https://wa.me/919842511223?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Buyer Wholesale Portal Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-teal-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider bg-teal-400 text-stone-950 rounded-md">
                Inter-State Buyer Sourcing Hub
              </span>
              <span className="text-xs text-teal-300 font-semibold">
                Direct Farmgate to Retail & Society Collectives
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {language === 'ta' 
                ? 'நேரடி உழவர் விளைபொருள் மொத்த கொள்முதல் மையம்' 
                : 'Direct Farmgate Produce Procurement Hub'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {language === 'ta'
                ? `வணக்கம் ${currentUser.name}. தமிழ்நாட்டின் 38 மாவட்டங்களின் சான்று பெற்ற உழவர்களிடமிருந்து புவிசார் குறியீடு பெற்ற விளைபொருட்களை இடைத்தரகரின்றி நியாயமான விலையில் நேரடியாகக் கொள்முதல் செய்யுங்கள்.`
                : `Welcome, ${currentUser.name}. Source GI-tagged, organic, and farm-fresh commodities directly from verified Tamil Nadu growers across all 38 districts with zero middleman commissions.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('market')}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse All 38 Districts Harvests</span>
              </button>

              <button
                onClick={() => onNavigateTab('buyer_farmers')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Contact 38-District Growers</span>
              </button>

              <button
                onClick={() => onNavigateTab('buyer_billing')}
                className="px-4 py-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 hover:text-white font-bold text-xs border border-teal-600/50 flex items-center gap-2 transition-all shadow-sm"
              >
                <FileText className="w-4 h-4 text-teal-300" />
                <span>Invoices & E-Way Bills</span>
              </button>
            </div>
          </div>

          {/* Buyer Credential Card */}
          <div className="bg-stone-950/80 border border-teal-600/40 p-4 rounded-2xl backdrop-blur-md shrink-0 lg:w-80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-400 text-stone-950 font-bold text-lg flex items-center justify-center shadow-sm">
                🏬
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                  Procurement Partner
                </span>
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-teal-400 truncate">{currentUser.district}, {currentUser.state}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Sourcing Radius: Inter-State</span>
              <span className="text-teal-400 font-bold">Pan-South India</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Buyer Value Proposition Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-teal-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Price Advantage</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900">20% - 45%</div>
          <p className="text-xs text-stone-500 mt-1">Average savings compared to wholesale terminal mandis.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-teal-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Direct Producers</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900">38 Districts</div>
          <p className="text-xs text-stone-500 mt-1">Authentic farmgate traceability and lab-tested soil cards.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-teal-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Transit Freshness</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900">&lt; 24 Hours</div>
          <p className="text-xs text-stone-500 mt-1">Direct farm harvest to Bengaluru, Chennai, Kochi & Hyderabad.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-teal-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Commission</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-stone-900">₹0 Middlemen</div>
          <p className="text-xs text-stone-500 mt-1">100% of price paid goes directly to the cultivating farmer.</p>
        </div>

      </div>

      {/* 3. Featured Tamil Nadu GI & Specialty Produce Spotlight */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Certified GI & Signature Produce from Tamil Nadu</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              High-demand commodities ready for bulk society, supermarket, or processing dispatch.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('market')}
            className="text-xs font-bold text-teal-800 hover:text-teal-900 hover:underline"
          >
            Explore Complete Marketplace →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specialtyCommodities.map(item => (
            <div 
              key={item.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:border-teal-500 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded uppercase">
                      {item.district} District
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-1">{item.name}</h3>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {item.savings}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-semibold">DIRECT FARMGATE PRICE</span>
                    <span className="text-sm font-black text-emerald-800">{item.farmgatePrice}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 block font-semibold">CITY MANDI RETAIL</span>
                    <span className="text-sm font-black text-stone-500 line-through">{item.mandiRetailPrice}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 flex items-center justify-between pt-1">
                  <span>Transit: <strong className="text-stone-800">{item.leadTime}</strong></span>
                  <span>Batch: <strong className="text-stone-800">{item.season}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
                <div className="text-xs text-stone-600 truncate">
                  <span className="text-stone-400">Farmer:</span> {item.farmer}
                </div>

                <a
                  href={`https://wa.me/91${item.farmerPhone}?text=${encodeURIComponent(
                    `Hello ${item.farmer}, I am ${currentUser.name} (${currentUser.district}) contacting you via ANNA AGRI AI platform to procure your ${item.name}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs font-bold text-teal-900 bg-teal-100 hover:bg-teal-200 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-teal-800" />
                  <span>Direct WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Instant Bulk Sourcing Quotation Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-700" />
            <span>Request Bulk Farmgate Shipment to Your Destination</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Submit your requirements to receive direct farmgate quotations and cold-chain logistics schedules.
          </p>
        </div>

        <form onSubmit={handleSendInquiry} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Destination City / Hub:</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-teal-700"
            >
              <option value="Bengaluru">Bengaluru (Whitefield, Koramangala, Indiranagar)</option>
              <option value="Chennai">Chennai (OMR, Anna Nagar, Adyar)</option>
              <option value="Kochi">Kochi / Ernakulam</option>
              <option value="Hyderabad">Hyderabad (Gachibowli, Hitec City)</option>
              <option value="Mumbai">Mumbai Wholesale Market</option>
              <option value="Coimbatore">Coimbatore Urban</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Commodity / Produce:</label>
            <input
              type="text"
              required
              value={inquiryProduce}
              onChange={e => setInquiryProduce(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-medium focus:ring-2 focus:ring-teal-700"
              placeholder="e.g. Pollachi Tender Coconut, Panruti Jackfruit"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Required Quantity & Frequency:</label>
            <input
              type="text"
              required
              value={inquiryQty}
              onChange={e => setInquiryQty(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-medium focus:ring-2 focus:ring-teal-700"
              placeholder="e.g. 20 Quintals / 2,000 pieces weekly"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-stone-700 block mb-1">Delivery Instructions / Quality Grade:</label>
            <input
              type="text"
              value={inquiryNotes}
              onChange={e => setInquiryNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-700"
              placeholder="e.g. Export grade, crate packed, delivery on Saturday mornings."
            />
          </div>

          <div className="md:col-span-3 flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect Directly on WhatsApp</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
