import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  CheckCircle,
  ExternalLink 
} from 'lucide-react';
import { KVK_CENTERS } from '../data/demoData';
import { Language } from '../types';

interface KvkLocatorProps {
  language: Language;
}

export const KvkLocator: React.FC<KvkLocatorProps> = ({ language }) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCenters = KVK_CENTERS.filter(center => {
    const matchesState = selectedState === 'All' || center.state === selectedState;
    const matchesSearch = 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 3
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>Direct Krishi Vigyan Kendra (KVK) & CSC Assistance Directory</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Locate official ICAR agricultural research stations, extension centers, and assisted application desks for offline biometric e-KYC and lab testing.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by district, center name, or landmark..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <select
          value={selectedState}
          onChange={e => setSelectedState(e.target.value)}
          className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
        >
          <option value="All">All States</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Punjab">Punjab</option>
          <option value="Maharashtra">Maharashtra</option>
        </select>
      </div>

      {/* Center Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCenters.map(center => (
          <div 
            key={center.id}
            className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition-all space-y-3"
          >
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {center.state} · {center.district} District
              </span>
              <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                {center.name}
              </h3>
              <p className="text-xs text-stone-500 mt-1 flex items-start gap-1.5 leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{center.address}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-stone-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-mono">{center.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-mono text-[11px]">{center.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                Authorized On-Site Services:
              </span>
              <div className="space-y-1 text-[11px] text-stone-600">
                {center.keyServices.map((service, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
