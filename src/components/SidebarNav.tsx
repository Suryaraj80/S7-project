import React, { useState } from 'react';
import { 
  Sprout, 
  CloudSun, 
  FlaskConical, 
  Sparkles, 
  Store, 
  ShoppingBag, 
  Users, 
  BookOpen, 
  Bookmark, 
  ShieldCheck, 
  SlidersHorizontal, 
  Globe, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  MessageSquare,
  Bell,
  User as UserIcon,
  Layers,
  ArrowRight,
  Database,
  Sliders,
  DollarSign,
  MapPin,
  Truck
} from 'lucide-react';
import { FileText } from 'lucide-react';
import { User, Language, AppNotification } from '../types';
import { useAppTheme } from '../context/ThemeContext';

interface SidebarNavProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  savedCount: number;
  pendingSoilApprovalsCount?: number;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  savedCount,
  pendingSoilApprovalsCount = 0,
  onOpenAuth,
  onOpenProfile,
  onOpenChat,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme, isYellowRed } = useAppTheme();

  // Role-based Navigation Configuration
  const getNavGroups = () => {
    // 1. ADMIN ROLE SPECIFIC NAVIGATION
    if (currentUser.role === 'ADMIN') {
      return [
        {
          groupTitle: language === 'ta' ? 'அதிகாரி செயல்பாடுகள்' : 'EXECUTIVE COMMAND',
          items: [
            {
              id: 'admin_home',
              label: language === 'ta' ? 'அதிகாரி கட்டுப்பாட்டு மையம்' : 'Admin Command Center',
              icon: ShieldCheck,
              badge: 'Official'
            },
            {
              id: 'soil_approvals',
              label: language === 'ta' ? 'மண் பரிசோதனை ஒப்புதல்' : 'Soil Test Slot Approvals',
              icon: FlaskConical,
              badge: pendingSoilApprovalsCount > 0 ? `${pendingSoilApprovalsCount} Pending` : null
            },
            {
              id: 'schemes_mgr',
              label: language === 'ta' ? 'மானியத் திட்டங்கள் மேலாண்மை' : 'Welfare Schemes Manager',
              icon: BookOpen,
              badge: 'Catalog'
            },
            {
              id: 'admin_billing',
              label: language === 'ta' ? 'வர்த்தக விலைப்பட்டியல் தணிக்கை' : 'Trade Billing & Audit',
              icon: FileText,
              badge: 'DBT Ledger'
            }
          ]
        },
        {
          groupTitle: language === 'ta' ? 'கண்காணிப்பு & அமைப்புகள்' : 'OVERSIGHT & SYSTEM',
          items: [
            {
              id: 'farmer_oversight',
              label: language === 'ta' ? '38 மாவட்ட உழவர் பதிவேடு' : '38-Districts Farmer Registry',
              icon: Users,
              badge: 'All 38'
            },
            {
              id: 'paccs_oversight',
              label: language === 'ta' ? 'PACCS & கூட்டுறவு அங்காடிகள்' : 'PACCS & Agri Depots',
              icon: Store,
              badge: '38 Districts'
            },
            {
              id: 'weights_config',
              label: language === 'ta' ? 'AI படிமுறை எடைகள்' : 'AI Algorithm Weights',
              icon: SlidersHorizontal,
              badge: null
            },
            {
              id: 'broadcast',
              label: language === 'ta' ? 'அவசர எச்சரிக்கை ஒளிபரப்பு' : 'Emergency Broadcast',
              icon: MessageSquare,
              badge: 'SMS/App'
            },
            {
              id: 'analytics',
              label: language === 'ta' ? 'மானியம் வழங்கல் புள்ளிவிவரம்' : 'Disbursement Analytics',
              icon: Layers,
              badge: 'FY 25-26'
            }
          ]
        }
      ];
    }

    // 2. BUYER ROLE SPECIFIC NAVIGATION
    if (currentUser.role === 'BUYER') {
      return [
        {
          groupTitle: language === 'ta' ? 'மொத்தக் கொள்முதல்' : 'BUYER SOURCING',
          items: [
            {
              id: 'buyer_home',
              label: language === 'ta' ? 'கொள்முதல் முகப்பு மையம்' : 'Procurement Hub Home',
              icon: ShoppingBag,
              badge: 'Direct'
            },
            {
              id: 'market',
              label: language === 'ta' ? '38 மாவட்ட உழவர் விளைபொருட்கள்' : '38-Districts Farmgate Produce',
              icon: Store,
              badge: 'GI Tagged'
            },
            {
              id: 'delivery_tracking',
              label: language === 'ta' ? 'சரக்கு நேரலை கண்காணிப்பு' : 'Live Delivery Tracking',
              icon: Truck,
              badge: 'GPS Live'
            },
            {
              id: 'buyer_billing',
              label: language === 'ta' ? 'கொள்முதல் விலைப்பட்டியல் & இ-வே பில்' : 'Tax Invoices & E-Way Bills',
              icon: FileText,
              badge: 'GST Exempt'
            }
          ]
        },
        {
          groupTitle: language === 'ta' ? 'உழவர் தொடர்பு & விவரம்' : 'GROWERS & LOGISTICS',
          items: [
            {
              id: 'buyer_farmers',
              label: language === 'ta' ? 'நேரடி உழவர் தொடர்புப் பட்டியல்' : 'Direct Farmer Directory',
              icon: Users,
              badge: '38 Districts'
            },
            {
              id: 'weather',
              label: language === 'ta' ? 'வானிலை & விளைச்சல் சூழல்' : 'Harvest & Weather (38 Districts)',
              icon: CloudSun,
              badge: 'Live'
            },
            {
              id: 'shops',
              label: language === 'ta' ? 'விவசாய கிடங்குகள் & அங்காடிகள்' : 'Regional Warehouses & Depots',
              icon: MapPin,
              badge: null
            }
          ]
        }
      ];
    }

    // 3. FARMER ROLE SPECIFIC NAVIGATION (DEFAULT)
    return [
      {
        groupTitle: language === 'ta' ? 'உழவர் முதன்மை சேவைகள்' : 'FARMER SERVICES',
        items: [
          {
            id: 'home',
            label: language === 'ta' ? 'உழவர் கட்டுப்பாட்டு மையம்' : 'Farmer Command Center',
            icon: Sprout,
            badge: null
          },
          {
            id: 'farmer_billing',
            label: language === 'ta' ? 'உழவர் விற்பனை ரசீதுகள் (பில்)' : 'Sales Receipts & Invoices',
            icon: FileText,
            badge: '0% Broker'
          },
          {
            id: 'schemes',
            label: language === 'ta' ? 'பொருத்தமான அரசு திட்டங்கள்' : 'Matched Welfare Schemes',
            icon: BookOpen,
            badge: 'Subsidies'
          },
          {
            id: 'weather',
            label: language === 'ta' ? 'வானிலை (38 மாவட்டங்கள்)' : 'Agro-Weather (38 Districts)',
            icon: CloudSun,
            badge: 'Live'
          },
          {
            id: 'soil_booking',
            label: language === 'ta' ? 'மண் பரிசோதனை முன்பதிவு' : 'Soil Test Slot Booking',
            icon: FlaskConical,
            badge: pendingSoilApprovalsCount > 0 ? `${pendingSoilApprovalsCount}` : null
          },
          {
            id: 'crops',
            label: language === 'ta' ? 'பயிர் பரிந்துரை AI' : 'Crop Recommender AI',
            icon: Sparkles,
            badge: null
          },
          {
            id: 'shops',
            label: language === 'ta' ? 'அருகிலுள்ள அங்காடிகள் & PACCS' : 'Agri Shops & PACCS',
            icon: Store,
            badge: '38 Districts'
          },
          {
            id: 'market',
            label: language === 'ta' ? 'விளைபொருளை நானே விற்பனை செய்க' : 'Sell Harvest at My Price',
            icon: ShoppingBag,
            badge: '0% Comm'
          },
          {
            id: 'delivery_tracking',
            label: language === 'ta' ? 'விளைபொருள் சரக்கு கண்காணிப்பு' : 'Live Delivery Tracking',
            icon: Truck,
            badge: 'GPS Live'
          }
        ]
      },
      {
        groupTitle: language === 'ta' ? 'நலத்திட்டம் & கருவிகள்' : 'BENEFITS & TOOLS',
        items: [
          {
            id: 'farmer_directory',
            label: language === 'ta' ? '38 மாவட்ட உழவர் குறிப்பேடு' : '38-Districts Farmers Registry',
            icon: Users,
            badge: 'All 38'
          },
          {
            id: 'saved',
            label: language === 'ta' ? 'சேமிக்கப்பட்ட திட்டங்கள்' : 'My Saved Subsidies',
            icon: Bookmark,
            badge: savedCount > 0 ? `${savedCount}` : null
          },
          {
            id: 'simulator',
            label: language === 'ta' ? 'What-If மானிய சிமுலேட்டர்' : 'What-If Scheme Simulator',
            icon: Sliders,
            badge: 'Live'
          },
          {
            id: 'calculator',
            label: language === 'ta' ? 'மானிய கால்குலேட்டர்' : 'Subsidy Calculator',
            icon: DollarSign,
            badge: 'Calc'
          },
          {
            id: 'more',
            label: language === 'ta' ? 'கூடுதல் 10 கருவிகள்' : 'Extra 10 Agri Tools',
            icon: SlidersHorizontal,
            badge: 'Suite'
          }
        ]
      }
    ];
  };

  const navGroups = getNavGroups();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 shadow-2xl flex flex-col transition-all duration-300 ${
          isYellowRed 
            ? 'bg-[#3b0a0a] text-amber-50 border-r-2 border-red-700' 
            : 'bg-[#07241a] text-stone-200 border-r border-emerald-950/80'
        } ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        
        {/* 1. Brand Header */}
        <div className={`h-18 px-4 flex items-center justify-between border-b shrink-0 ${
          isYellowRed ? 'bg-[#260505] border-red-900/80' : 'bg-[#051c14] border-emerald-900/60'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-md shrink-0 border ${
              isYellowRed 
                ? 'bg-gradient-to-br from-amber-400 to-red-600 text-stone-950 border-amber-300' 
                : 'bg-gradient-to-br from-emerald-500 to-teal-700 text-stone-950 border-emerald-400/40'
            }`}>
              <Sprout className="w-6 h-6 text-white" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-base font-extrabold tracking-tight text-white block truncate leading-tight">
                  ANNA AGRI AI
                </span>
                <span className={`text-[10px] font-semibold block truncate tracking-wide ${
                  isYellowRed ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  AAA PLATFORM · தமிழ்நாடு உழவர்
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-colors cursor-pointer ${
              isYellowRed 
                ? 'text-amber-300 hover:text-white hover:bg-red-900/60' 
                : 'text-emerald-300 hover:text-white hover:bg-emerald-900/50'
            }`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Current User Profile Card (Shows Active Role & Switch Button) */}
        <div className={`p-3 border-b shrink-0 ${isCollapsed ? 'px-2' : ''} ${
          isYellowRed ? 'border-red-900/60 bg-[#4a0d0d]/80' : 'border-emerald-900/40 bg-[#092b20]/60'
        }`}>
          {!isCollapsed ? (
            <div className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${
              isYellowRed 
                ? 'bg-red-950/80 border-red-800/60' 
                : 'bg-emerald-950/70 border-emerald-800/40'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-400 text-stone-950'
                    : currentUser.role === 'BUYER'
                    ? 'bg-teal-400 text-stone-950'
                    : 'bg-emerald-400 text-stone-950'
                }`}>
                  {currentUser.role === 'ADMIN' ? '🛡️' : currentUser.role === 'BUYER' ? '🏬' : '🌾'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-snug">
                    {currentUser.name}
                  </p>
                  <p className={`text-[10px] flex items-center gap-1 truncate font-medium ${
                    isYellowRed ? 'text-amber-300' : 'text-emerald-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      currentUser.role === 'ADMIN' ? 'bg-amber-400' : currentUser.role === 'BUYER' ? 'bg-teal-400' : 'bg-emerald-400'
                    }`} />
                    <span className="font-bold text-amber-300">[{currentUser.role}]</span>
                    <span>· {currentUser.district}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAuth}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isYellowRed 
                    ? 'text-amber-200 hover:text-white bg-red-900 hover:bg-red-800' 
                    : 'text-emerald-300 hover:text-white bg-emerald-900/60 hover:bg-emerald-800'
                }`}
                title="Switch role / persona"
              >
                Switch
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className={`w-full flex items-center justify-center p-2 rounded-lg font-bold text-xs cursor-pointer ${
                currentUser.role === 'ADMIN' ? 'bg-amber-900/60 text-amber-300' : currentUser.role === 'BUYER' ? 'bg-teal-900/60 text-teal-300' : 'bg-emerald-950/70 text-emerald-300'
              }`}
              title={`${currentUser.name} (${currentUser.role}) - Click to Switch`}
            >
              {currentUser.role.charAt(0)}
            </button>
          )}
        </div>

        {/* 3. Role-Filtered Navigation Links List */}
        <div className={`flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin ${
          isYellowRed ? 'scrollbar-thumb-red-900' : 'scrollbar-thumb-emerald-900'
        }`}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {!isCollapsed && (
                <div className={`px-3 text-[10px] font-black uppercase tracking-wider mb-1 ${
                  isYellowRed ? 'text-amber-300/90' : 'text-emerald-400/80'
                }`}>
                  {group.groupTitle}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                        isActive
                          ? (isYellowRed 
                              ? 'bg-red-700 text-yellow-200 shadow-md font-bold border-l-4 border-amber-400 shadow-red-950/50' 
                              : 'bg-emerald-700 text-white shadow-md font-bold shadow-emerald-950/50')
                          : (isYellowRed 
                              ? 'text-stone-300 hover:text-white hover:bg-red-900/40' 
                              : 'text-stone-300 hover:text-white hover:bg-emerald-900/40')
                      }`}
                      title={item.label}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive 
                          ? (isYellowRed ? 'text-yellow-300' : 'text-amber-300') 
                          : (isYellowRed ? 'text-amber-400' : 'text-emerald-400')
                      }`} />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between text-left truncate">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-black whitespace-nowrap ml-1 ${
                              isActive 
                                ? 'bg-amber-400 text-stone-950' 
                                : (isYellowRed 
                                    ? 'bg-red-950 text-amber-200 border border-red-700/60' 
                                    : 'bg-emerald-900 text-emerald-200 border border-emerald-700/50')
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Bottom Controls: Language, AI Help & Logout */}
        <div className={`p-3 border-t shrink-0 space-y-2 ${
          isYellowRed ? 'border-red-900/60 bg-[#260505]' : 'border-emerald-900/60 bg-[#051c14]'
        }`}>
          
          {/* Ask AI button (Only for Farmer or Buyer, or Admin assistance) */}
          <button
            onClick={onOpenChat}
            className={`w-full py-2 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors border cursor-pointer ${
              isYellowRed
                ? 'bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 border-amber-500/50'
                : 'bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 border-emerald-600/40'
            } ${
              isCollapsed ? 'px-2' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            {!isCollapsed && (
              <span>{language === 'ta' ? 'அண்ணா அக்ரி AI' : 'Ask ANNA AGRI AI'}</span>
            )}
          </button>

          {/* Theme Quick Switcher in Sidebar */}
          {!isCollapsed && (
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-400 px-1 pt-1">
              <span className={`flex items-center gap-1 ${isYellowRed ? 'text-amber-300' : 'text-emerald-400'}`}>
                <span>🎨 {language === 'ta' ? 'தீம்:' : 'Theme:'}</span>
              </span>

              <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
                isYellowRed ? 'bg-red-950 border-red-800' : 'bg-emerald-950 border-emerald-800'
              }`}>
                <button
                  onClick={() => setTheme('standard')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    !isYellowRed ? 'bg-emerald-700 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Standard Emerald"
                >
                  🌿
                </button>
                <button
                  onClick={() => setTheme('yellow-red')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    isYellowRed ? 'bg-red-700 text-yellow-300' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Kisan Yellow-Red"
                >
                  🔴🟡
                </button>
              </div>
            </div>
          )}

        </div>

      </aside>
    </>
  );
};
