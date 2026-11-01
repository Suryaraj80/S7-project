import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Sliders, 
  Bookmark, 
  MessageSquareText, 
  ShieldCheck, 
  ChevronDown,
  Volume2,
  Palette
} from 'lucide-react';
import { User, Language, AppNotification } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { DEMO_USERS } from '../data/demoData';
import { useAppTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenChat: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  notifications,
  onOpenNotifications,
  onOpenProfile,
  onOpenAuth,
  onOpenChat,
  savedCount
}) => {
  const t = TRANSLATIONS[language];
  const { theme, setTheme, isYellowRed } = useAppTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-colors ${
      isYellowRed ? 'bg-white border-b-2 border-red-600 shadow-sm' : 'bg-white/95 border-b border-stone-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand title (one line, single text element wordmark) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
                isYellowRed ? 'bg-red-700 text-yellow-300 ring-2 ring-amber-400' : 'bg-emerald-700 text-white'
              }`}>
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                {t.appName}
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (clean text links with hover styling) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-600">
            <button
              onClick={() => onTabChange('home')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => onTabChange('weather')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'weather'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {t.navWeather}
            </button>
            <button
              onClick={() => onTabChange('recommendations')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'recommendations' || activeTab === 'schemes'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {t.navSchemes}
            </button>
            <button
              onClick={() => onTabChange('crops')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'crops'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {t.navCropRecommender}
            </button>
            <button
              onClick={() => onTabChange('soil_booking')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'soil_booking'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {t.navSoilBooking}
            </button>
            <button
              onClick={() => onTabChange('shops')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'shops'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {t.navShopsNearby}
            </button>
            <button
              onClick={() => onTabChange('market')}
              className={`transition-colors cursor-pointer font-bold px-2 py-1 rounded-md border ${
                isYellowRed
                  ? 'text-red-900 bg-amber-100 border-amber-300 ring-1 ring-red-600'
                  : 'text-amber-900 bg-amber-50 border-amber-200'
              } ${activeTab === 'market' ? (isYellowRed ? 'ring-2 ring-red-700' : 'ring-2 ring-emerald-600') : ''}`}
            >
              {t.navMarketplace}
            </button>
            <button
              onClick={() => onTabChange('more')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'more'
                  ? (isYellowRed ? 'text-red-700 font-extrabold border-b-2 border-red-600 pb-0.5' : 'text-emerald-800 font-bold')
                  : 'hover:text-emerald-700'
              }`}
            >
              {language === 'ta' ? 'சிமுலேட்டர் & கருவிகள்' : 'What-If Simulator & Tools'}
            </button>
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => onTabChange('admin')}
                className={`flex items-center gap-1 transition-colors text-amber-800 hover:text-amber-900 cursor-pointer ${activeTab === 'admin' ? 'font-bold' : ''}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.navAdmin}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* 2-Theme Switcher Toggle */}
            <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 text-xs shadow-2xs" title="Select App Theme">
              <button
                onClick={() => setTheme('standard')}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all cursor-pointer ${
                  !isYellowRed
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Standard Emerald Palette"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span className="hidden xl:inline">{language === 'ta' ? 'வழக்கமான பசுமை' : 'Standard'}</span>
              </button>
              <button
                onClick={() => setTheme('yellow-red')}
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all cursor-pointer ${
                  isYellowRed
                    ? 'bg-red-700 text-yellow-300 font-bold shadow-xs ring-1 ring-amber-400'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Kisan Yellow, White & Red Theme (மஞ்சள், வெள்ளை & சிவப்பு)"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block border border-red-600"></span>
                <span className="hidden xl:inline">{language === 'ta' ? 'மஞ்சள்-சிவப்பு' : 'Yellow-Red'}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50 text-xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${language === 'en' ? (isYellowRed ? 'bg-red-700 text-white font-bold' : 'bg-white shadow-xs font-semibold text-emerald-800') : 'text-stone-600 hover:text-stone-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${language === 'ta' ? (isYellowRed ? 'bg-red-700 text-white font-bold' : 'bg-white shadow-xs font-semibold text-emerald-800') : 'text-stone-600 hover:text-stone-900'}`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${language === 'hi' ? (isYellowRed ? 'bg-red-700 text-white font-bold' : 'bg-white shadow-xs font-semibold text-emerald-800') : 'text-stone-600 hover:text-stone-900'}`}
              >
                हिन्दी
              </button>
            </div>

            {/* AI Advisor Chat Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              title="Open Krishi AI Advisor"
            >
              <MessageSquareText className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Saved Schemes Button */}
            <button
              onClick={() => onTabChange('saved')}
              className={`relative p-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors ${activeTab === 'saved' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'text-stone-600'}`}
              title="Saved Schemes"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User / Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[110px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {currentUser.role === 'ADMIN' ? 'System Administrator' : 'Verified Farmer Profile'}
                    </span>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'FARMER' && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenProfile();
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-stone-500" />
                        <span>Edit Farmer Profile</span>
                      </button>
                    )}
                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onTabChange('admin');
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Console</span>
                      </button>
                    )}
                  </div>

                  {/* Quick Persona Switcher for testing */}
                  <div className="border-t border-stone-100 pt-1.5 px-3">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-1">
                      Quick Demo Personas
                    </p>
                    <div className="space-y-1">
                      {DEMO_USERS.map(user => (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSelectUser(user);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between ${currentUser.id === user.id ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-stone-600 hover:bg-stone-50'}`}
                        >
                          <span className="truncate">{user.name}</span>
                          <span className="text-[10px] text-stone-400 shrink-0 ml-1">
                            {user.role === 'ADMIN' ? 'Admin' : user.state}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-stone-100 mt-2 pt-1 px-3">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth();
                      }}
                      className="w-full py-1.5 text-center text-xs text-stone-600 hover:text-stone-900 font-medium"
                    >
                      Login with Another Account
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Horizontal Navigation Scroller (Essential for farmers on mobile phones) */}
      <div className="lg:hidden border-t border-stone-200/80 bg-stone-50/90 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
        <button
          onClick={() => onTabChange('home')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          {t.navHome}
        </button>
        <button
          onClick={() => onTabChange('weather')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'weather' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          {t.navWeather}
        </button>
        <button
          onClick={() => onTabChange('recommendations')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'recommendations' || activeTab === 'schemes' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          {t.navSchemes}
        </button>
        <button
          onClick={() => onTabChange('crops')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'crops' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          {t.navCropRecommender}
        </button>
        <button
          onClick={() => onTabChange('soil_booking')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'soil_booking' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          {t.navSoilBooking}
        </button>
        <button
          onClick={() => onTabChange('shops')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'shops' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          {t.navShopsNearby}
        </button>
        <button
          onClick={() => onTabChange('market')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'market' ? 'bg-amber-600 text-white font-bold' : 'text-amber-900 bg-amber-50 border border-amber-300 font-bold'}`}
        >
          {t.navMarketplace}
        </button>
        <button
          onClick={() => onTabChange('more')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'more' ? 'bg-emerald-800 text-white' : 'text-stone-700 bg-white border border-stone-200'}`}
        >
          More Tools
        </button>
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={() => onTabChange('admin')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${activeTab === 'admin' ? 'bg-amber-700 text-white' : 'text-amber-800 bg-amber-50 border border-amber-200'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
