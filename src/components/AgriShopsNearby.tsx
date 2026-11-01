import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  Phone, 
  Search, 
  CheckCircle, 
  Tractor, 
  ShoppingBag,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { TN_AGRI_SHOPS, TN_38_DISTRICTS } from '../data/tamilNaduData';
import { Language } from '../types';

interface AgriShopsNearbyProps {
  language: Language;
  currentDistrict?: string;
}

export const AgriShopsNearby: React.FC<AgriShopsNearbyProps> = ({
  language,
  currentDistrict = 'Thanjavur'
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredShops = TN_AGRI_SHOPS.filter(shop => {
    const matchesType = selectedType === 'All' || shop.type === selectedType;
    const matchesDistrict = selectedDistrict === 'All' || shop.district === selectedDistrict;
    const matchesKeyword = !searchKeyword || 
      shop.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      shop.inventory.some(item => item.item.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    return matchesType && matchesDistrict && matchesKeyword;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Nearby Agricultural Supplies
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <Store className="w-5 h-5 text-emerald-700" />
            <span>{language === 'ta' ? 'அருகிலுள்ள உழவர் இடுபொருள் அங்காடிகள் & இயந்திர வாடகை மையங்கள்' : 'Shops & Farm Machinery Depots Nearby'}</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Direct directory of certified PACCS societies, government seed depots, fertilizer counters, and custom hiring farm machinery centers across Tamil Nadu.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search urea, seeds, tractor, harvester..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium"
        >
          <option value="All">All Store Types (அனைத்து அங்காடிகள்)</option>
          <option value="PACCS">Cooperative Societies (PACCS - கூட்டுறவு கடன் சங்கம்)</option>
          <option value="AEC_GOVT">Govt Extension AEC Depots (அரசு வேளாண் விரிவாக்க மையம்)</option>
          <option value="MACHINERY_RENTAL">Custom Hiring Centers (வேளாண் இயந்திர வாடகை மையம்)</option>
          <option value="FERTILIZER_SEED">Seed & Fertilizer Outlets</option>
        </select>

        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium focus:ring-1 focus:ring-emerald-700"
        >
          <option value="All">All 38 Tamil Nadu Districts ({TN_AGRI_SHOPS.length} Centers)</option>
          {TN_38_DISTRICTS.map(d => (
            <option key={d.id} value={d.name}>
              {d.name} ({d.name_ta})
            </option>
          ))}
        </select>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredShops.map(shop => {
          const shopName = language === 'ta' ? shop.name_ta : shop.name;
          const whatsappUrl = shop.whatsapp 
            ? `https://api.whatsapp.com/send?phone=${shop.whatsapp}&text=${encodeURIComponent(`வணக்கம், ${shopName} - உழவர் இடுபொருட்கள் கையிருப்பு குறித்து அறிய தொடர்பு கொள்கிறேன்.`)}`
            : null;

          return (
            <div
              key={shop.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Govt Verified Supplier · {shop.district}</span>
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded">
                    {shop.type}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug">
                  {shopName}
                </h3>

                <p className="text-xs text-stone-500 flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{shop.address}</span>
                </p>

                {/* Available Inventory List */}
                <div className="pt-2 border-t border-stone-200/70">
                  <span className="text-[11px] font-bold text-stone-700 block mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-stone-400" />
                    <span>Available Stock & Subsidized Rates:</span>
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {shop.inventory.map((inv, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-stone-200/70">
                        <span className="font-medium text-stone-800">
                          {language === 'ta' ? inv.item_ta : inv.item}
                        </span>
                        <span className="font-mono font-bold text-emerald-800">
                          {inv.price || 'In Stock'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Bar */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                <a
                  href={`tel:${shop.phone}`}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>{shop.phone}</span>
                </a>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>WhatsApp Inquiry</span>
                  </a>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
