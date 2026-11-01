import React from 'react';
import { Sprout, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { User, Language } from '../types';
import { DEMO_USERS } from '../data/demoData';

interface RoleSwitcherBarProps {
  currentUser: User;
  onSwitchRole: (user: User) => void;
  language: Language;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentUser,
  onSwitchRole,
  language
}) => {
  const farmerUser = DEMO_USERS.find(u => u.id === 'farmer-1') || DEMO_USERS[0];
  const adminUser = DEMO_USERS.find(u => u.id === 'admin-1') || {
    id: 'admin-1',
    name: 'Dr. K. Soundararajan (Joint Director of Agriculture)',
    email: 'admin.agri@tn.gov.in',
    mobile: '9444109876',
    role: 'ADMIN' as const,
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    createdAt: '2024-01-01',
    status: 'active' as const
  };
  const buyerUser = DEMO_USERS.find(u => u.id === 'buyer-1') || {
    id: 'buyer-1',
    name: 'Priya Sundaram (Wholesale Procurement)',
    email: 'priya.sundaram@agrotrade.in',
    mobile: '9880198765',
    role: 'BUYER' as const,
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    createdAt: '2025-02-01',
    status: 'active' as const
  };

  return (
    <div className="bg-stone-900 border-b border-stone-800 text-white px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Active Role Indicator with Description */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
            {language === 'ta' ? 'செயலில் உள்ள பயனர் நிலை' : 'Active Role Mode'}
          </span>

          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              currentUser.role === 'ADMIN' ? 'bg-amber-400' : currentUser.role === 'BUYER' ? 'bg-cyan-400' : 'bg-emerald-400'
            }`} />
            
            <p className="text-xs truncate font-medium text-stone-300">
              {currentUser.role === 'ADMIN' && (
                <span>
                  <strong className="text-amber-300 font-bold">Admin Officer Mode:</strong>{' '}
                  {language === 'ta'
                    ? 'மண் பரிசோதனை ஒப்புதல்கள், திட்ட மேலாண்மை & 38 மாவட்ட கண்காணிப்பு மட்டும்'
                    : 'Soil Test Approvals, Scheme Manager & 38-District Oversight only'}
                </span>
              )}
              {currentUser.role === 'BUYER' && (
                <span>
                  <strong className="text-cyan-300 font-bold">Inter-State Buyer Mode:</strong>{' '}
                  {language === 'ta'
                    ? '38 மாவட்ட விளைபொருட்கள், மொத்த கொள்முதல் & நேரடி உழவர் தொடர்பு மட்டும்'
                    : '38-Districts Farmgate Produce, Bulk Quotes & Direct Farmer Directory'}
                </span>
              )}
              {currentUser.role === 'FARMER' && (
                <span>
                  <strong className="text-emerald-300 font-bold">Farmer Mode:</strong>{' '}
                  {language === 'ta'
                    ? 'உழவர் கட்டுப்பாட்டு மையம், மண் பரிசோதனை முன்பதிவு, வானிலை & மானியங்கள்'
                    : 'Farmer Command Center, Soil Test Booking, Weather & Eligible Subsidies'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: 1-Click Role Switch Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 bg-stone-950 p-1 rounded-xl border border-stone-800">
          
          {/* 1. Farmer Button */}
          <button
            onClick={() => onSwitchRole(farmerUser)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentUser.role === 'FARMER'
                ? 'bg-emerald-600 text-white shadow-xs scale-102 ring-1 ring-emerald-400'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Switch to Farmer Portal"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'உழவர்' : 'Farmer'}</span>
          </button>

          {/* 2. Admin Button */}
          <button
            onClick={() => onSwitchRole(adminUser)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentUser.role === 'ADMIN'
                ? 'bg-amber-500 text-stone-950 shadow-xs scale-102 ring-1 ring-amber-300 font-black'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Switch to Agriculture Officer (Admin)"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அதிகாரி (Admin)' : 'Admin Officer'}</span>
          </button>

          {/* 3. Buyer Button */}
          <button
            onClick={() => onSwitchRole(buyerUser)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentUser.role === 'BUYER'
                ? 'bg-cyan-500 text-stone-950 shadow-xs scale-102 ring-1 ring-cyan-300 font-black'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
            }`}
            title="Switch to Wholesale / Buyer Hub"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'கொள்முதல் (Buyer)' : 'Wholesale Buyer'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
