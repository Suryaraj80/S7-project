export type UserRole = 'FARMER' | 'ADMIN' | 'BUYER';

export type Language = 'en' | 'ta' | 'hi';

export type AppTheme = 'standard' | 'yellow-red';

export type OwnershipType = 'Owner' | 'Tenant' | 'Sharecropper' | 'Leased';

export type FarmingType = 'Conventional' | 'Organic' | 'Natural' | 'ZBNF' | 'Mixed';

export type IrrigationType = 'Canal' | 'Borewell' | 'Drip/Sprinkler' | 'Rainfed' | 'None';

export type SoilType = 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Clayey' | 'Sandy Loam';

export type FarmerCategory = 'General' | 'OBC' | 'SC' | 'ST';

export type LandholdingCategory = 'Marginal' | 'Small' | 'Semi-Medium' | 'Medium' | 'Large';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state: string;
  district: string;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface FarmerProfile {
  userId: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  
  // Farming Information
  landholdingSize: number; // in acres
  landUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  ownershipType: OwnershipType;
  cropType: string;
  secondaryCrop: string;
  farmingType: FarmingType;
  irrigationAvailable: boolean;
  irrigationType: IrrigationType;
  soilType: SoilType;
  hasLivestock: boolean;
  livestockTypes: string[]; // e.g. ['Cattle', 'Poultry', 'Goat/Sheep']

  // Financial Information
  annualIncome: number; // in INR
  incomeCategory: 'Below 1 Lakh' | '1 to 2.5 Lakhs' | '2.5 to 5 Lakhs' | 'Above 5 Lakhs';
  isBpl: boolean;
  hasAadhaarLinkedBank: boolean;

  // Social & Eligibility Information
  farmerCategory: FarmerCategory;
  smallMarginalClassification: LandholdingCategory;
  isWomanFarmer: boolean;
  hasDisability: boolean;

  profileCompletionPercentage: number;
  lastUpdated: string;
}

export interface Scheme {
  id: string;
  scheme_name: string;
  scheme_name_ta?: string;
  scheme_name_hi?: string;
  short_description: string;
  short_description_ta?: string;
  short_description_hi?: string;
  full_description: string;
  category: 
    | 'Financial Support'
    | 'Crop Insurance'
    | 'Irrigation & Water'
    | 'Solar & Renewable Energy'
    | 'Mechanization & Tools'
    | 'Seeds & Fertilizers'
    | 'Organic & Natural Farming'
    | 'Livestock & Dairy'
    | 'Infrastructure & Loans'
    | 'Women Farmer Support';
  level: 'Central' | 'State';
  state: string; // 'All India' or specific state like 'Tamil Nadu', 'Uttar Pradesh'
  district?: string; // Optional district targeting
  target_users: string[]; // e.g. ['Small & Marginal Farmers', 'Women Farmers']
  
  // Eligibility Criteria
  minimum_age: number;
  maximum_age: number;
  income_limit: number; // 0 means no limit
  land_min: number; // in acres
  land_max: number; // in acres, 0 means no max
  eligible_crops: string[]; // ['All'] or specific crops
  farmer_categories: string[]; // ['All'] or ['SC', 'ST', 'OBC', 'General']
  irrigation_requirement: 'Any' | 'Required' | 'Rainfed Only' | 'Micro-Irrigation Willing';
  farming_type_requirement?: 'Any' | 'Organic Only' | 'Conventional Allowed';
  ownership_requirement: 'Any' | 'Owner Only' | 'Tenant Eligible';
  women_only: boolean;
  bpl_required: boolean;

  // Benefits & Process
  benefits: string;
  benefits_ta?: string;
  benefits_hi?: string;
  benefit_amount: string; // e.g., '₹6,000 per year in 3 installments' or 'Up to 60% subsidy'
  estimated_monetary_value: number; // Estimated annual value in INR for calculators
  required_documents: string[];
  application_process: string[];
  official_website: string;
  application_url: string;
  helpline: string;
  valid_from: string;
  valid_until?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface MatchReason {
  criterion: string;
  matched: boolean;
  explanation: string;
  weightContribution: number;
}

export interface RecommendationResult {
  scheme: Scheme;
  matchScore: number; // 0 to 100
  isEligible: boolean;
  reasons: MatchReason[];
  unmatchedCriteria: string[];
  recommendedBadge?: 'Highly Relevant' | 'Recommended' | 'Informative';
}

export interface RecommendationSession {
  id: string;
  userId: string;
  timestamp: string;
  farmerName: string;
  state: string;
  crop: string;
  landSize: number;
  totalRecommendations: number;
  results: {
    schemeId: string;
    schemeName: string;
    score: number;
    isEligible: boolean;
  }[];
}

export interface RecommendationWeights {
  location: number; // e.g. 20
  crop: number; // e.g. 15
  landholding: number; // e.g. 15
  income: number; // e.g. 15
  category: number; // e.g. 10
  age: number; // e.g. 10
  irrigation: number; // e.g. 5
  farmingType: number; // e.g. 5
  specialFactors: number; // e.g. 5 (women, bpl, livestock)
}

export interface AppNotification {
  id: string;
  title: string;
  title_ta?: string;
  title_hi?: string;
  message: string;
  message_ta?: string;
  message_hi?: string;
  type: 'scheme_alert' | 'deadline' | 'profile_tip' | 'broadcast';
  schemeId?: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedSchemes?: Scheme[];
  suggestions?: string[];
  isVoiceInput?: boolean;
}

export interface KvkCenter {
  id: string;
  name: string;
  state: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  headName: string;
  keyServices: string[];
}

export interface SeasonalDeadline {
  id: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Annual';
  schemeName: string;
  schemeId: string;
  title: string;
  deadlineDate: string; // YYYY-MM-DD
  daysRemaining: number;
  actionRequired: string;
  status: 'Open' | 'Closing Soon' | 'Upcoming';
}

export interface FarmerStory {
  id: string;
  farmerName: string;
  location: string;
  schemeName: string;
  benefitReceived: string;
  storyQuote: string;
  storyQuote_ta?: string;
  storyQuote_hi?: string;
  crop: string;
  rating: number;
  date: string;
}

export interface DocumentReadinessItem {
  id: string;
  name: string;
  name_ta: string;
  name_hi: string;
  description: string;
  isReady: boolean;
  requiredForSchemesCount: number;
}

export interface DistrictWeather {
  district: string;
  district_ta: string;
  tempCurrent: number;
  tempMin: number;
  tempMax: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Humid';
  condition_ta: string;
  rainProbability: number;
  humidity: number;
  windSpeed: number;
  rainfallWarning?: string;
  rainfallWarning_ta?: string;
  agroAdvisory: string;
  agroAdvisory_ta: string;
  forecast: { day: string; day_ta: string; temp: number; rainProb: number; condition: string }[];
}

export type SoilTestStatus = 
  | 'Pending Admin Approval'
  | 'Approved & Slot Confirmed'
  | 'Rejected'
  | 'Sample Collected'
  | 'Report Generated';

export interface SoilTestBooking {
  id: string;
  farmerName: string;
  mobile: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  centerName: string;
  appointmentDate: string;
  timeSlot: 'Morning (9:00 AM - 12:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)';
  soilType: SoilType;
  plannedCrop: string;
  status: SoilTestStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface TNDistrictFarmer {
  id: string;
  district: string;
  district_ta: string;
  zone: string;
  farmerName: string;
  farmerName_ta: string;
  age: number;
  gender: 'Male' | 'Female';
  village: string;
  taluk: string;
  mobile: string;
  landholdingSize: number;
  landUnit: 'Acres';
  ownershipType: OwnershipType;
  primaryCrop: string;
  primaryCrop_ta: string;
  secondaryCrop: string;
  secondaryCrop_ta: string;
  soilType: SoilType;
  irrigationType: IrrigationType;
  annualIncome: number;
  soilHealthCardStatus: 'Active & Verified' | 'Sample In Lab' | 'Renewal Due' | 'Awaiting Test';
  activeSchemesCount: number;
  keySuccess: string;
  keySuccess_ta: string;
}

export interface CropRecommendationItem {
  id: string;
  cropName: string;
  cropName_ta: string;
  variety: string;
  category: 'Cereals' | 'Pulses' | 'Horticulture' | 'Cash Crops' | 'Spices' | 'Oilseeds';
  suitableDistricts: string[];
  suitableSoils: SoilType[];
  season: string;
  season_ta: string;
  durationDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  expectedYieldPerAcre: string;
  estimatedNetProfitPerAcre: number;
  keyAdvantages: string[];
  keyAdvantages_ta: string[];
  relatedSchemeId?: string;
}

export interface AgriShop {
  id: string;
  name: string;
  name_ta: string;
  type: 'PACCS' | 'AEC_GOVT' | 'FERTILIZER_SEED' | 'MACHINERY_RENTAL';
  district: string;
  address: string;
  phone: string;
  whatsapp?: string;
  verifiedGovt: boolean;
  inventory: { item: string; item_ta: string; inStock: boolean; price?: string }[];
}

export interface MarketplaceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  village: string;
  district: string;
  state: string;
  produceName: string;
  produceName_ta: string;
  category: 'Vegetables' | 'Fruits' | 'Paddy & Grains' | 'Spices' | 'Plantation & Others';
  farmerPrice: number;
  unit: 'kg' | 'quintal' | 'bag' | 'piece' | 'ton';
  availableQuantity: number;
  minOrderQuantity: number;
  harvestDate: string;
  interStateDeliveryAvailable: boolean;
  deliveryStates: string[];
  description: string;
  description_ta: string;
  imageUrl?: string;
  isOrganic: boolean;
  status: 'Available' | 'Sold Out';
}

export interface MarketplaceOrder {
  id: string;
  listingId: string;
  produceName: string;
  buyerName: string;
  buyerMobile: string;
  buyerState: string;
  buyerCity: string;
  requestedQuantity: number;
  totalAmount: number;
  status: 'Pending Farmer Confirmation' | 'Accepted' | 'Dispatched' | 'Delivered';
  createdAt: string;
}

export type InvoiceType = 'BUYER_TAX_INVOICE' | 'FARMER_SALES_RECEIPT' | 'GOVT_SUBSIDY_BILLING';
export type PaymentStatus = 'Paid via DBT/Escrow' | 'NEFT Confirmed' | 'Pending Settlement' | 'Govt Direct Credit';

export interface InvoiceItem {
  id: string;
  description: string;
  description_ta?: string;
  hsnCode?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  mandiComparisonPrice?: number;
  savingsPercentage?: number;
}

export interface InvoiceRecord {
  id: string; // e.g. "INV-TN-2025-0891" or "RCPT-TN-4521"
  invoiceNumber: string;
  invoiceType: InvoiceType;
  date: string;
  dueDate?: string;
  
  // Seller / Farmer Details
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  farmerDistrict: string;
  farmerTaluk?: string;
  farmerVillage?: string;
  farmerPattaNo?: string;
  farmerAadhaarMasked?: string;
  farmerBankRef?: string;
  
  // Buyer Details
  buyerId: string;
  buyerName: string;
  buyerOrganization?: string;
  buyerMobile: string;
  buyerEmail?: string;
  buyerGstin?: string;
  buyerFssai?: string;
  buyerState: string;
  buyerCity: string;
  deliveryAddress: string;

  // Commercials
  items: InvoiceItem[];
  subtotal: number;
  freightAndLogistics: number;
  apmcCess: number; // 0 for farmgate direct sales!
  middlemanCommissionDeduction: number; // 0
  cgst: number; // 0 for unprocessed agricultural produce
  sgst: number; // 0
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: 'Escrow Account' | 'Direct Bank Transfer (NEFT/RTGS)' | 'UPI / QR' | 'State DBT Credit';
  transactionReference: string;
  
  // Logistics & E-Way Bill
  ewayBillNumber?: string;
  vehicleNumber?: string;
  dispatchDate?: string;
  transportOperator?: string;
  
  // Govt Certifications & Stamps
  isGiCertified?: boolean;
  giTagNumber?: string;
  zeroCommissionVerified: boolean;
  qrCodeData: string;
  notes?: string;
}

// FARMER DIRECT PRODUCE DELIVERY TRACKING SYSTEM
export type DeliveryStatus = 
  | 'Harvested & Packed'
  | 'Vehicle Dispatched'
  | 'In Transit'
  | 'Checkpost Passed'
  | 'Reached Mandi Hub'
  | 'Out for Delivery'
  | 'Delivered & Verified';

export interface TrackingTimelineStep {
  title: string;
  title_ta: string;
  location: string;
  timestamp: string;
  completed: boolean;
  isCurrent?: boolean;
  notes?: string;
}

export interface DeliveryShipment {
  id: string; // e.g. "TN-TRK-8921"
  orderId?: string;
  invoiceId?: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  originVillage: string;
  originDistrict: string;
  destinationCity: string;
  destinationState: string;
  destinationHub: string;
  buyerName: string;
  buyerMobile: string;
  produceName: string;
  produceName_ta: string;
  category: string;
  imageUrl: string;
  quantity: number;
  unit: string;
  cratesCount?: number;
  totalValue: number;
  vehicleType: string;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  driverRating: number;
  currentStatus: DeliveryStatus;
  currentLocationName: string;
  currentSpeedKmH: number;
  temperatureCelsius?: number;
  coldChainEnabled: boolean;
  dispatchTime: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  progressPercent: number; // 0 to 100
  deliveryOtp: string;
  ewayBillNumber: string;
  freightCost: number;
  routeStops: { name: string; reached: boolean; time?: string }[];
  timeline: TrackingTimelineStep[];
  notes?: string;
}


