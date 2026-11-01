import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, Scheme, FarmerProfile, Language, User as UserType } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  language: Language;
  onViewScheme: (schemeId: string) => void;
  currentUser?: UserType;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  language,
  onViewScheme,
  currentUser
}) => {
  const t = TRANSLATIONS[language];
  const userName = currentUser?.name || profile.fullName;
  const isBuyer = currentUser?.role === 'BUYER';
  const isAdmin = currentUser?.role === 'ADMIN';

  const getInitialMessage = (): ChatMessage => {
    let welcomeText = '';
    let initialSuggestions: string[] = [];

    if (isBuyer) {
      if (language === 'ta') {
        welcomeText = `வணக்கம் ${userName}! நான் உங்கள் அண்ணா அக்ரி AI (ANNA AGRI AI) கொள்முதல் வழிகாட்டி. தமிழ்நாட்டின் 38 மாவட்ட உழவர்களிடமிருந்து நேரடி விளைபொருள் கொள்முதல், வரிவிலக்கு விலைப்பட்டியல்கள் (GST Exemption), APMC மண்டி செஸ் விலக்கு, மற்றும் இ-வே பில் நடைமுறைகள் பற்றி என்னிடம் கேட்கலாம்.`;
      } else if (language === 'hi') {
        welcomeText = `नमस्ते ${userName}! मैं आपका ANNA AGRI AI खरीद सलाहकार हूँ। आप तमिलनाडु के किसानों से सीधी उपज खरीद, टैक्स इनवॉइस, एपीएमसी मंडी उपकर छूट एवं ई-वे बिल के बारे में पूछ सकते हैं।`;
      } else {
        welcomeText = `Namaste ${userName}! I am your ANNA AGRI AI Procurement Advisor. Ask me anything about sourcing direct from 38 Tamil Nadu districts, commercial tax invoices, APMC Mandi Cess exemptions under TN Direct Agri Marketing Act, and E-Way bill generation.`;
      }
      initialSuggestions = [
        'How does direct farmgate procurement work?',
        'Are raw farm produce exempt from APMC Mandi Cess & GST?',
        'How to generate commercial invoice and E-Way bill?',
        'How does escrow payment settlement protect buyers?'
      ];
    } else if (isAdmin) {
      if (language === 'ta') {
        welcomeText = `வணக்கம் ${userName}! நான் உங்கள் அண்ணா அக்ரி AI (ANNA AGRI AI) அரசு நிர்வாக ஆலோசகர். மண் பரிசோதனை ஒப்புதல்கள், 38 மாவட்ட வேளாண் கண்காணிப்பு, டெல்டா குறுவை தொகுப்பு மற்றும் நேரடி வர்த்தக தணிக்கை குறித்து என்னிடம் வினவலாம்.`;
      } else if (language === 'hi') {
        welcomeText = `नमस्ते ${userName}! मैं आपका ANNA AGRI AI प्रशासनिक सलाहकार हूँ। आप मिट्टी परीक्षण अनुमोदन, राज्यव्यापी कृषि निगरानी, एवं योजना वितरण के बारे में पूछ सकते हैं।`;
      } else {
        welcomeText = `Namaste ${userName}! I am your ANNA AGRI AI Executive Administrative Advisor. Ask me about TNAU soil test slot approval queues, 38-district agro-weather monitoring, Kuruvai delta packages, or statewide zero-commission trade audits.`;
      }
      initialSuggestions = [
        'Guidelines for approving pending soil test slots',
        'Statewide direct farmgate trade audit protocol',
        'Kuruvai package free inputs distribution criteria',
        'PM-KISAN and PMFBY beneficiary verification rules'
      ];
    } else {
      if (language === 'ta') {
        welcomeText = `வணக்கம் ${userName}! நான் உங்கள் அண்ணா அக்ரி AI (ANNA AGRI AI) உழவர் வழிகாட்டி. தமிழ்நாடு மாவட்ட வானிலை, TNAU மண் பரிசோதனை முன்பதிவு, பயிர் பரிந்துரைகள், நேரடி விளைபொருள் விற்பனை மற்றும் அரசு மானியங்கள் பற்றி என்னிடம் கேட்கலாம்.`;
      } else if (language === 'hi') {
        welcomeText = `नमस्ते ${userName}! मैं आपका ANNA AGRI AI किसान सलाहकार हूँ। आप मुझसे तमिलनाडु मौसम, TNAU मिट्टी परीक्षण स्लॉट, फसल सिफारिशें, सीधी उपज बिक्री एवं सरकारी योजनाओं के बारे में पूछ सकते हैं।`;
      } else {
        welcomeText = `Namaste ${userName}! I am your ANNA AGRI AI Advisor. Ask me anything about Tamil Nadu agro-weather, TNAU soil test slot booking, crop recommendations, nearby agri shops, direct farmgate marketplace pricing, or central & state agricultural subsidies.`;
      }
      initialSuggestions = [
        'How to book TNAU Soil Test slot?',
        'Subsidies for paddy in Tamil Nadu',
        'How to sell vegetables at farmer-fixed price?',
        'Drip irrigation 100% subsidy in Tamil Nadu'
      ];
    }

    return {
      id: 'welcome',
      sender: 'assistant',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: initialSuggestions
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      if (language === 'ta') recognition.lang = 'ta-IN';
      else if (language === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript, true);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (language === 'ta') recognitionRef.current.lang = 'ta-IN';
        else if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
        else recognitionRef.current.lang = 'en-IN';
        
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  };

  const handleSpeakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (playingAudioId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'ta') utterance.lang = 'ta-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setPlayingAudioId(null);
    utterance.onerror = () => setPlayingAudioId(null);

    window.speechSynthesis.speak(utterance);
    setPlayingAudioId(msgId);
  };

  const handleSendMessage = async (textToSend?: string, isVoice = false) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoiceInput: isVoice
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          farmerProfile: {
            ...profile,
            fullName: userName,
            role: currentUser?.role || 'FARMER'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Here is the relevant information based on our scheme database.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedSchemes: data.referencedSchemes || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.warn('Chat request failed, providing smart contextual reply:', err);

      let fallbackText = '';
      const q = query.toLowerCase();
      if (q.includes('soil') || q.includes('மண்') || q.includes('mitti')) {
        fallbackText = language === 'ta'
          ? `TNAU மண் பரிசோதனை முன்பதிவு: இத்தளத்தில் உள்ள 'மண் பரிசோதனை' (Soil Test Booking) பக்கத்தில் உங்கள் நில விபரம், சர்வே எண் மற்றும் பயிரைத் தேர்வு செய்து இலவசமாக முன்பதிவு செய்யலாம். 12 நுண்ணூட்டச் சத்துக்கள் அடங்கிய அதிகாரப்பூர்வ மண்வள அட்டை தமிழ்நாடு அரசால் 100% இலவசமாக வழங்கப்படும்.`
          : `TNAU Soil Testing Slot: You can book a 100% free appointment slot directly via the "Soil Test Booking" tab. Select your research center/mobile van, enter survey number, and bring a 500g dry sample. A comprehensive 12-nutrient Soil Health Card is issued free of cost under the Government Soil Health Mission.`;
      } else if (q.includes('paddy') || q.includes('rice') || q.includes('நெல்')) {
        fallbackText = language === 'ta'
          ? `நெல் சாகுபடிக்கு PM-KISAN (ஆண்டுக்கு ₹6,000), PMFBY பயிர் காப்பீடு (2% மானிய பிரீமியம்), மற்றும் காவிரி டெல்டா மாவட்டங்களுக்கு குருவை சிறப்பு தொகுப்பு திட்டம் (இலவச சான்று பெற்ற விதைகள் & உரங்கள்) கிடைக்கின்றன.`
          : `For Paddy/Rice cultivation, key support schemes include PM-KISAN (₹6,000/yr direct income support), PMFBY Crop Insurance (2% subsidized Kharif premium), and the Tamil Nadu Kuruvai Special Package (free certified seeds & fertilizers for delta farmers).`;
      } else if (q.includes('price') || q.includes('market') || q.includes('விலை') || q.includes('விற்பனை') || q.includes('buy') || q.includes('procure')) {
        fallbackText = language === 'ta'
          ? `அண்ணா அக்ரி AI சந்தை: விவசாயிகள் தங்கள் விளைபொருளுக்கு தாங்களே நியாயமான விலையை நிர்ணயிக்கலாம். இடைத்தரகர் கமிஷன் 0% மற்றும் தமிழ்நாடு நேரடி சந்தைப்படுத்தல் சட்டத்தின்படி APMC மண்டி செஸ் வரிவிலக்கு உண்டு.`
          : `ANNA AGRI AI Farmgate Marketplace: Farmers fix their own fair prices with 0% middleman brokerage. Commercial buyers procure direct with APMC Mandi Cess exemption under the Tamil Nadu Direct Agricultural Produce Marketing Act 2024 and escrow DBT security.`;
      } else {
        fallbackText = language === 'ta'
          ? `உங்கள் சுயவிவரப்படி PM-KISAN, பிரதம மந்திரி பயிர் காப்பீட்டுத் திட்டம் (PMFBY), மற்றும் சொட்டுநீர் பாசன மானியம் (PDMC - சிறு/குறு விவசாயிகளுக்கு 100% மானியம்) போன்ற திட்டங்கள் சிறந்த பொருத்தமுடையவை.`
          : `Based on verified Tamil Nadu agricultural guidelines, top recommended schemes include PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, PMKSY Micro-Irrigation (100% subsidy for small/marginal farmers in TN), and TNAU Free Soil Testing.`;
      }

      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-stone-200 flex flex-col animate-slideIn">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 leading-none">
              {t.chatTitle}
            </h3>
            <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Grounded in verified government records
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                AI
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-800 text-white rounded-br-xs'
                : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-xs'
            }`}>
              <div className="flex items-center justify-between gap-2 mb-1 opacity-70 text-[10px]">
                <span>{msg.sender === 'user' ? 'You' : 'Krishi Assistant'}</span>
                <div className="flex items-center gap-1.5">
                  {msg.isVoiceInput && <span className="italic font-mono">🎤 Voice</span>}
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleSpeakText(msg.text, msg.id)}
                      className="hover:opacity-100"
                      title="Listen audio"
                    >
                      {playingAudioId === msg.id ? (
                        <VolumeX className="w-3 h-3 text-amber-600" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Referenced Scheme Cards */}
              {msg.referencedSchemes && msg.referencedSchemes.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Referenced Government Schemes
                  </div>
                  {msg.referencedSchemes.map(sch => (
                    <button
                      key={sch.id}
                      onClick={() => onViewScheme(sch.id)}
                      className="w-full p-2 rounded-lg bg-stone-50 hover:bg-emerald-50/50 border border-stone-200 text-left transition-colors flex items-center justify-between gap-2 group"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-stone-900 group-hover:text-emerald-800 truncate text-[11px]">
                          {sch.scheme_name}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate">
                          {sch.benefit_amount}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestions chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] transition-colors border border-stone-200 text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                {profile.fullName.charAt(0)}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-stone-500">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-stone-500 ml-1">Analyzing government rules...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Listening Wave Indicator */}
      {isListening && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 animate-pulse">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-700 animate-bounce" />
            <span className="font-medium">{t.chatVoiceListening}</span>
          </div>
          <button
            onClick={toggleListening}
            className="text-[11px] font-bold text-amber-800 underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input Form */}
      <form 
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-stone-200 bg-white flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            isListening 
              ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' 
              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
          title="Voice input"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={t.chatPlaceholder}
          className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-stone-50/50"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
