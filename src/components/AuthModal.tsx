import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  User, 
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  Sprout,
  ArrowRight
} from 'lucide-react';
import { User as UserType, Language } from '../types';
import { TN_38_DISTRICTS } from '../data/tamilNaduData';
import { StorageService } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserType) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  language
}) => {
  const [tab, setTab] = useState<'quick' | 'otp' | 'register'>('quick');

  // Phone / OTP state
  const [phoneLogin, setPhoneLogin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Custom register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Thanjavur');
  const [role, setRole] = useState<'FARMER' | 'ADMIN' | 'BUYER'>('FARMER');
  const [cropType, setCropType] = useState('Paddy');

  if (!isOpen) return null;

  const demoPersonas: UserType[] = [
    {
      id: 'farmer-thanjavur',
      name: 'Ramasamy Kulasekaran',
      email: 'ramasamy.tn@example.com',
      mobile: '9840123456',
      role: 'FARMER',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      createdAt: '2025-01-10',
      status: 'active'
    },
    {
      id: 'admin-tnau',
      name: 'Dr. K. Soundararajan (Joint Director of Agriculture)',
      email: 'admin.agri@tn.gov.in',
      mobile: '9444109876',
      role: 'ADMIN',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      createdAt: '2024-01-01',
      status: 'active'
    },
    {
      id: 'buyer-bengaluru',
      name: 'Priya Sundaram (Bengaluru Gated Society Procurement)',
      email: 'priya.sundaram@example.com',
      mobile: '9880198765',
      role: 'BUYER',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      createdAt: '2025-03-01',
      status: 'active'
    },
    {
      id: 'farmer-erode',
      name: 'Senthamizh Selvan',
      email: 'senthamizh.turmeric@example.com',
      mobile: '9443899120',
      role: 'FARMER',
      state: 'Tamil Nadu',
      district: 'Erode',
      createdAt: '2025-02-15',
      status: 'active'
    }
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneLogin || phoneLogin.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setEnteredOtp('123456'); // pre-fill demo OTP for effortless testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Create or find user with this mobile
    const user: UserType = {
      id: 'user-m-' + phoneLogin.slice(-4),
      name: `Farmer (${phoneLogin.slice(-4)})`,
      email: `farmer${phoneLogin.slice(-4)}@kisan.in`,
      mobile: phoneLogin,
      role: 'FARMER',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    StorageService.saveUser(user);
    onSelectUser(user);
    onClose();
  };

  const handleCustomRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      id: `${role.toLowerCase()}-${Date.now()}`,
      name: name || 'Registered Agri User',
      email: email || `${mobile || Date.now()}@aaa-platform.in`,
      mobile: mobile || '9840000000',
      role,
      state,
      district,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    StorageService.saveUser(newUser);

    // Also bootstrap a farmer profile if role is FARMER
    if (role === 'FARMER') {
      const newProfile = {
        userId: newUser.id,
        fullName: newUser.name,
        age: 42,
        gender: 'Male' as const,
        mobile: newUser.mobile,
        email: newUser.email,
        state: newUser.state,
        district: newUser.district,
        taluk: 'Taluk Central',
        village: 'Agri Village',
        landholdingSize: 2.5,
        landUnit: 'Acres' as const,
        ownershipType: 'Owner' as const,
        cropType: cropType || 'Paddy',
        secondaryCrop: 'Pulses',
        farmingType: 'Conventional' as const,
        irrigationAvailable: true,
        irrigationType: 'Canal' as const,
        soilType: 'Alluvial' as const,
        hasLivestock: true,
        livestockTypes: ['Cattle'],
        annualIncome: 180000,
        incomeCategory: '1 to 2.5 Lakhs' as const,
        isBpl: false,
        hasAadhaarLinkedBank: true,
        farmerCategory: 'OBC' as const,
        smallMarginalClassification: 'Small' as const,
        isWomanFarmer: false,
        hasDisability: false,
        profileCompletionPercentage: 85,
        lastUpdated: new Date().toISOString()
      };
      StorageService.saveProfile(newProfile);
    }

    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {language === 'ta' ? 'அண்ணா அக்ரி AI உள்நுழைவு' : 'ANNA AGRI AI Access Portal'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'ta' ? 'விவசாயி, அதிகாரி அல்லது நுகர்வோர் உள்நுழைவு' : 'Log in as Farmer, Admin Officer, or Inter-State Buyer'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-stone-200 text-xs font-semibold bg-stone-50/40">
          <button
            onClick={() => setTab('quick')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'quick' ? 'border-emerald-700 text-emerald-900 font-bold bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1-Click Demo Accounts
          </button>

          <button
            onClick={() => setTab('otp')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'otp' ? 'border-emerald-700 text-emerald-900 font-bold bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Mobile OTP Login
          </button>

          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'register' ? 'border-emerald-700 text-emerald-900 font-bold bg-white' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Register Profile
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* TAB 1: QUICK DEMO PERSONAS */}
          {tab === 'quick' && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Select Persona to Experience the Platform:
              </span>

              <div className="space-y-2.5">
                {demoPersonas.map(persona => {
                  const isAdm = persona.role === 'ADMIN';
                  const isBuy = persona.role === 'BUYER';

                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        onSelectUser(persona);
                        onClose();
                      }}
                      className="w-full p-3 rounded-2xl border border-stone-200 hover:border-emerald-600 bg-stone-50/50 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isAdm 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : isBuy 
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {isAdm ? <ShieldCheck className="w-5 h-5 text-amber-700" /> : isBuy ? <ShoppingBag className="w-5 h-5 text-blue-700" /> : <Sprout className="w-5 h-5 text-emerald-700" />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 group-hover:text-emerald-900 truncate">
                            {persona.name}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            <span className="font-semibold text-stone-700">{persona.role}</span> · {persona.district}, {persona.state}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        Login →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE OTP LOGIN */}
          {tab === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Farmer / User Mobile Number (10 digits):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-stone-400 font-bold font-mono">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9840123456"
                        value={phoneLogin}
                        onChange={e => setPhoneLogin(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm"
                  >
                    Send One-Time Password (OTP)
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                    OTP sent to +91 {phoneLogin}. Demo verification code prefilled below.
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Enter 6-Digit OTP:</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={e => setEnteredOtp(e.target.value)}
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 font-mono text-center tracking-widest text-lg font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm"
                  >
                    Verify & Enter Dashboard
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REGISTER NEW PROFILE (ALL 38 DISTRICTS) */}
          {tab === 'register' && (
            <form onSubmit={handleCustomRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramasamy / Meenakshi"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Role *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="FARMER">Farmer (விவசாயி)</option>
                    <option value="ADMIN">Agri Officer / Admin</option>
                    <option value="BUYER">Inter-State Produce Buyer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Mobile (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9840123456"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">District (All 38 TN)</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    {TN_38_DISTRICTS.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.name_ta})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {role === 'FARMER' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Primary Cultivated Crop</label>
                  <input
                    type="text"
                    placeholder="e.g. Kuruvai Paddy, Shallots, Banana"
                    value={cropType}
                    onChange={e => setCropType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm mt-2"
              >
                Create Account & Proceed
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
