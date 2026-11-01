import { 
  User, 
  FarmerProfile, 
  Scheme, 
  RecommendationSession, 
  RecommendationWeights, 
  AppNotification, 
  DocumentReadinessItem,
  InvoiceRecord 
} from '../types';
import { INITIAL_SCHEMES } from '../data/schemesData';
import { 
  DEMO_USERS, 
  DEMO_PROFILES, 
  DEFAULT_WEIGHTS, 
  INITIAL_NOTIFICATIONS, 
  DOCUMENT_READINESS_ITEMS 
} from '../data/demoData';
import { INITIAL_INVOICES } from '../data/billingData';

const KEYS = {
  CURRENT_USER: 'kisankalyan_user',
  PROFILES: 'kisankalyan_profiles',
  SCHEMES: 'kisankalyan_schemes',
  SAVED_SCHEMES: 'kisankalyan_saved_schemes',
  REC_HISTORY: 'kisankalyan_history',
  WEIGHTS: 'kisankalyan_weights',
  NOTIFICATIONS: 'kisankalyan_notifications',
  DOCUMENTS: 'kisankalyan_documents',
  USERS: 'kisankalyan_users',
  LANGUAGE: 'kisankalyan_lang',
  INVOICES: 'kisankalyan_invoices'
};

export const StorageService = {
  // Current user & authentication
  getCurrentUser(): User {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fallback
      }
    }
    // Default to Demo Farmer 1
    return DEMO_USERS[0];
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },

  getAllUsers(): User[] {
    const raw = localStorage.getItem(KEYS.USERS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return DEMO_USERS;
  },

  saveUser(newUser: User): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === newUser.id || u.email === newUser.email);
    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // Farmer Profiles
  getProfile(userId: string): FarmerProfile {
    const raw = localStorage.getItem(KEYS.PROFILES);
    if (raw) {
      try {
        const dict = JSON.parse(raw);
        if (dict[userId]) return dict[userId];
      } catch (e) {}
    }
    if (DEMO_PROFILES[userId]) {
      return DEMO_PROFILES[userId];
    }
    // Generate empty profile for fresh registration
    return {
      userId,
      fullName: 'New Farmer',
      age: 35,
      gender: 'Male',
      mobile: '9800000000',
      email: 'farmer@example.com',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      taluk: 'Rural',
      village: 'Village 1',
      landholdingSize: 2.0,
      landUnit: 'Acres',
      ownershipType: 'Owner',
      cropType: 'Paddy',
      secondaryCrop: 'Pulses',
      farmingType: 'Conventional',
      irrigationAvailable: true,
      irrigationType: 'Canal',
      soilType: 'Alluvial',
      hasLivestock: false,
      livestockTypes: [],
      annualIncome: 120000,
      incomeCategory: '1 to 2.5 Lakhs',
      isBpl: false,
      hasAadhaarLinkedBank: true,
      farmerCategory: 'General',
      smallMarginalClassification: 'Small',
      isWomanFarmer: false,
      hasDisability: false,
      profileCompletionPercentage: 85,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  },

  saveProfile(profile: FarmerProfile): void {
    const raw = localStorage.getItem(KEYS.PROFILES);
    let dict: Record<string, FarmerProfile> = { ...DEMO_PROFILES };
    if (raw) {
      try {
        dict = { ...dict, ...JSON.parse(raw) };
      } catch (e) {}
    }
    dict[profile.userId] = profile;
    localStorage.setItem(KEYS.PROFILES, JSON.stringify(dict));
  },

  // Schemes database
  getSchemes(): Scheme[] {
    const SCHEMES_CACHE_VERSION = 'v3_state_403_schemes';
    const cachedVer = localStorage.getItem('kisan_schemes_ver');
    if (cachedVer === SCHEMES_CACHE_VERSION) {
      const raw = localStorage.getItem(KEYS.SCHEMES);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length >= INITIAL_SCHEMES.length) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    // Update local storage with complete 403 authentic state & central schemes
    try {
      localStorage.setItem('kisan_schemes_ver', SCHEMES_CACHE_VERSION);
      localStorage.setItem(KEYS.SCHEMES, JSON.stringify(INITIAL_SCHEMES));
    } catch (e) {}
    return INITIAL_SCHEMES;
  },

  saveSchemes(schemes: Scheme[]): void {
    localStorage.setItem(KEYS.SCHEMES, JSON.stringify(schemes));
  },

  addOrUpdateScheme(scheme: Scheme): void {
    const schemes = this.getSchemes();
    const idx = schemes.findIndex(s => s.id === scheme.id);
    if (idx >= 0) {
      schemes[idx] = { ...scheme, updated_at: new Date().toISOString().split('T')[0] };
    } else {
      schemes.unshift({
        ...scheme,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      });
    }
    this.saveSchemes(schemes);
  },

  deleteScheme(schemeId: string): void {
    const schemes = this.getSchemes().filter(s => s.id !== schemeId);
    this.saveSchemes(schemes);
  },

  // Saved / Bookmarked Schemes
  getSavedSchemeIds(userId: string): string[] {
    const raw = localStorage.getItem(`${KEYS.SAVED_SCHEMES}_${userId}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    // Defaults for demo
    return ['pm-kisan', 'pmfby', 'pmksy-pdmc'];
  },

  toggleSaveScheme(userId: string, schemeId: string): boolean {
    const current = this.getSavedSchemeIds(userId);
    let updated: string[];
    let isNowSaved = false;
    if (current.includes(schemeId)) {
      updated = current.filter(id => id !== schemeId);
      isNowSaved = false;
    } else {
      updated = [...current, schemeId];
      isNowSaved = true;
    }
    localStorage.setItem(`${KEYS.SAVED_SCHEMES}_${userId}`, JSON.stringify(updated));
    return isNowSaved;
  },

  // Recommendation History
  getRecommendationHistory(userId: string): RecommendationSession[] {
    const raw = localStorage.getItem(`${KEYS.REC_HISTORY}_${userId}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return [];
  },

  saveRecommendationSession(session: RecommendationSession): void {
    const history = this.getRecommendationHistory(session.userId);
    history.unshift(session);
    // Keep max 20 sessions
    localStorage.setItem(
      `${KEYS.REC_HISTORY}_${session.userId}`,
      JSON.stringify(history.slice(0, 20))
    );
  },

  // Recommendation Weights
  getWeights(): RecommendationWeights {
    const raw = localStorage.getItem(KEYS.WEIGHTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return DEFAULT_WEIGHTS;
  },

  saveWeights(weights: RecommendationWeights): void {
    localStorage.setItem(KEYS.WEIGHTS, JSON.stringify(weights));
  },

  // Notifications
  getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  },

  saveNotifications(notifs: AppNotification[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n);
    this.saveNotifications(notifs);
  },

  addNotification(notif: AppNotification): void {
    const notifs = [notif, ...this.getNotifications()];
    this.saveNotifications(notifs);
  },

  // Documents Readiness
  getDocumentItems(): DocumentReadinessItem[] {
    const raw = localStorage.getItem(KEYS.DOCUMENTS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return DOCUMENT_READINESS_ITEMS;
  },

  toggleDocumentReady(id: string): DocumentReadinessItem[] {
    const items = this.getDocumentItems().map(item => 
      item.id === id ? { ...item, isReady: !item.isReady } : item
    );
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(items));
    return items;
  },

  // Invoices & Billing
  getInvoices(): InvoiceRecord[] {
    const raw = localStorage.getItem(KEYS.INVOICES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    // initialize with initial invoices
    this.saveAllInvoices(INITIAL_INVOICES);
    return INITIAL_INVOICES;
  },

  saveAllInvoices(invoices: InvoiceRecord[]): void {
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },

  saveInvoice(invoice: InvoiceRecord): void {
    const invoices = this.getInvoices();
    const existingIndex = invoices.findIndex(i => i.id === invoice.id);
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice;
    } else {
      invoices.unshift(invoice);
    }
    this.saveAllInvoices(invoices);
    window.dispatchEvent(new Event('invoices_updated'));
  },

  deleteInvoice(id: string): void {
    const invoices = this.getInvoices().filter(i => i.id !== id);
    this.saveAllInvoices(invoices);
    window.dispatchEvent(new Event('invoices_updated'));
  }
};
