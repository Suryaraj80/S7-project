import { DeliveryShipment } from '../types';
import { VEGETABLE_IMAGES } from './vegetableImages';

export const INITIAL_DELIVERY_SHIPMENTS: DeliveryShipment[] = [
  {
    id: 'TN-TRK-89214',
    orderId: 'ORD-982140',
    invoiceId: 'INV-TN-2026-0891',
    farmerId: 'farmer-dindigul',
    farmerName: 'Muthuvelan Subbiah',
    farmerMobile: '9443219870',
    originVillage: 'Reddiarchatram, Oddanchatram Taluk',
    originDistrict: 'Dindigul',
    destinationCity: 'Chennai',
    destinationState: 'Tamil Nadu',
    destinationHub: 'Koyambedu Wholesale Agro Terminal Block-C',
    buyerName: 'Koyambedu Wholesale Greens & Onions Federation',
    buyerMobile: '9840192837',
    produceName: 'Dindigul Country Small Shallots (சின்ன வெங்காயம்)',
    produceName_ta: 'திண்டுக்கல் நாட்டு சின்ன வெங்காயம்',
    category: 'Vegetables',
    imageUrl: VEGETABLE_IMAGES.shallots.url,
    quantity: 2800,
    unit: 'kg',
    cratesCount: 112,
    totalValue: 117600,
    vehicleType: 'Eicher 14ft Pro Farm Hauler',
    vehicleNumber: 'TN 57 BH 4892',
    driverName: 'K. Rajendran',
    driverMobile: '9789123450',
    driverRating: 4.9,
    currentStatus: 'In Transit',
    currentLocationName: 'NH 45 near Villupuram Toll Plaza (Speed: 58 km/h)',
    currentSpeedKmH: 58,
    temperatureCelsius: 24.2,
    coldChainEnabled: false,
    dispatchTime: '2026-03-26 05:30 AM',
    estimatedDeliveryTime: '2026-03-26 02:45 PM',
    progressPercent: 72,
    deliveryOtp: '7482',
    ewayBillNumber: '241098234710',
    freightCost: 6500,
    routeStops: [
      { name: 'Reddiarchatram Farmgate Pickup', reached: true, time: '05:30 AM' },
      { name: 'Dindigul Toll Checkpost (NH 45)', reached: true, time: '06:40 AM' },
      { name: 'Tiruchirappalli Bypass Toll', reached: true, time: '08:30 AM' },
      { name: 'Villupuram Agri Inspection Post', reached: true, time: '11:15 AM' },
      { name: 'Chengalpattu Toll Plaza', reached: false, time: '01:15 PM' },
      { name: 'Koyambedu Agri Market Hub', reached: false, time: '02:45 PM' }
    ],
    timeline: [
      {
        title: 'Farmgate Harvested & Packed in Mesh Sacks',
        title_ta: 'வயலில் அறுவடை செய்யப்பட்டு 25 கிலோ வலைப்பைகளில் அடைக்கப்பட்டது',
        location: 'Reddiarchatram, Dindigul',
        timestamp: '2026-03-25 04:00 PM',
        completed: true
      },
      {
        title: 'Loaded on Vehicle & Digital E-Way Bill Generated',
        title_ta: 'வாகனத்தில் ஏற்றப்பட்டு மின்-சரக்கு ரசீது (E-Way Bill) உருவாக்கப்பட்டது',
        location: 'Oddanchatram Farm Gate',
        timestamp: '2026-03-26 05:30 AM',
        completed: true
      },
      {
        title: 'Passed Tiruchirappalli Toll & Mandatory Weighbridge',
        title_ta: 'திருச்சி சுங்கச்சாவடி மற்றும் அரசு எடை மேடை சோதனையை கடந்தது',
        location: 'Trichy Bypass NH 45',
        timestamp: '2026-03-26 08:30 AM',
        completed: true
      },
      {
        title: 'In Highway Transit towards Chennai',
        title_ta: 'சென்னை நோக்கி தேசிய நெடுஞ்சாலையில் பயணித்துக்கொண்டிருக்கிறது',
        location: 'Villupuram Highway Junction',
        timestamp: '2026-03-26 11:15 AM',
        completed: true,
        isCurrent: true,
        notes: 'Driver taking 15 min mandatory safety refreshment break at certified highway plaza.'
      },
      {
        title: 'Arrival at Koyambedu Wholesale Agro Hub',
        title_ta: 'கோயம்பேடு மொத்த காய்கறி வளாகத்தில் இறக்குதல்',
        location: 'Koyambedu Gate 4',
        timestamp: '2026-03-26 02:45 PM (ETA)',
        completed: false
      },
      {
        title: 'Buyer Physical Verification & OTP Confirmation',
        title_ta: 'கொள்முதல் அதிகாரி சரிபார்த்து ரகசிய OTP மூலம் உறுதி செய்தல்',
        location: 'Buyer Warehouse #12',
        timestamp: 'Pending Final Verification',
        completed: false
      }
    ],
    notes: 'Cleaned, shade-dried country shallots. Handled with top priority. Net weight certified at farm weighbridge.'
  },
  {
    id: 'TN-TRK-76519',
    orderId: 'ORD-871203',
    invoiceId: 'INV-TN-2026-0742',
    farmerId: 'farmer-nilgiris',
    farmerName: 'Bellie Gowder',
    farmerMobile: '9488102344',
    originVillage: 'Ketti Valley, Ooty',
    originDistrict: 'The Nilgiris',
    destinationCity: 'Bengaluru',
    destinationState: 'Karnataka',
    destinationHub: 'Yeshwanthpur Wholesale APMC Yard',
    buyerName: 'FreshBasket Supermarkets Logistics Hub',
    buyerMobile: '9845012398',
    produceName: 'Nilgiri Ooty Mountain Carrots (ஊட்டி மலை கேரட்)',
    produceName_ta: 'ஊட்டி மலைப்பகுதியில் விளைந்த நயமான ஆர்கானிக் கேரட்',
    category: 'Vegetables',
    imageUrl: VEGETABLE_IMAGES.carrots.url,
    quantity: 3200,
    unit: 'kg',
    cratesCount: 160,
    totalValue: 121600,
    vehicleType: 'Cold Chain Reefer Van (12°C Controlled)',
    vehicleNumber: 'TN 43 C 9811',
    driverName: 'S. Selvakumar',
    driverMobile: '9442088712',
    driverRating: 4.95,
    currentStatus: 'In Transit',
    currentLocationName: 'NH 44 near Hosur State Border (Speed: 52 km/h)',
    currentSpeedKmH: 52,
    temperatureCelsius: 12.8,
    coldChainEnabled: true,
    dispatchTime: '2026-03-26 04:00 AM',
    estimatedDeliveryTime: '2026-03-26 01:30 PM',
    progressPercent: 84,
    deliveryOtp: '3920',
    ewayBillNumber: '241098451290',
    freightCost: 8200,
    routeStops: [
      { name: 'Ooty Ketti Valley Cold Hub', reached: true, time: '04:00 AM' },
      { name: 'Mettupalayam Ghat Checkpost', reached: true, time: '05:45 AM' },
      { name: 'Bhavani River Bypass', reached: true, time: '07:30 AM' },
      { name: 'Dharmapuri Cold Reefer Checkpoint', reached: true, time: '09:50 AM' },
      { name: 'Hosur TN-KA Inter-State Border', reached: true, time: '11:45 AM' },
      { name: 'Yeshwanthpur APMC Hub', reached: false, time: '01:30 PM' }
    ],
    timeline: [
      {
        title: 'Washed in Spring Water & Graded in Ooty',
        title_ta: 'இயற்கை ஊற்று நீரில் கழுவப்பட்டு தரம் பிரிக்கப்பட்டது',
        location: 'Ketti Valley Processing Shed',
        timestamp: '2026-03-25 02:00 PM',
        completed: true
      },
      {
        title: 'Reefer Van Pre-Cooled to 12°C & Loaded',
        title_ta: 'குளிர்சாதன வாகனம் 12°C வெப்பநிலைக்கு குளிர்விக்கப்பட்டு ஏற்றப்பட்டது',
        location: 'Ooty Cold Chain Hub',
        timestamp: '2026-03-26 04:00 AM',
        completed: true
      },
      {
        title: 'Crossed Nilgiri Ghat Road Checkpost',
        title_ta: 'நீலகிரி மலைப்பாதை சோதனைச் சாவடியை கடந்தது',
        location: 'Mettupalayam Checkpost',
        timestamp: '2026-03-26 05:45 AM',
        completed: true
      },
      {
        title: 'Inter-State Border Cleared (Green Corridor)',
        title_ta: 'ஓசூர் தமிழ்நாடு-கர்நாடகா எல்லை சோதனைச் சாவடி அனுமதி பெற்றது',
        location: 'Hosur Commercial Tax Checkpost',
        timestamp: '2026-03-26 11:45 AM',
        completed: true,
        isCurrent: true,
        notes: 'Temperature stable at 12.8°C. Moisture and crispness intact.'
      },
      {
        title: 'Yeshwanthpur APMC Unloading & Acceptance',
        title_ta: 'பெங்களூரு யஷ்வந்த்பூர் மண்டியில் இறக்குதல்',
        location: 'Bengaluru APMC Gate 2',
        timestamp: '2026-03-26 01:30 PM (ETA)',
        completed: false
      }
    ],
    notes: 'Premium high-altitude carrots. Requires cold chain integrity at all transit stages.'
  },
  {
    id: 'TN-TRK-65401',
    orderId: 'ORD-761920',
    invoiceId: 'INV-TN-2026-0618',
    farmerId: 'farmer-dharmapuri',
    farmerName: 'K. Chinnasamy',
    farmerMobile: '9443567890',
    originVillage: 'Palacode, Dharmapuri',
    originDistrict: 'Dharmapuri',
    destinationCity: 'Madurai',
    destinationState: 'Tamil Nadu',
    destinationHub: 'Mattuthavani Central Vegetable Market',
    buyerName: 'Madurai Commercial Vegetable Traders Association',
    buyerMobile: '9442156789',
    produceName: 'Dharmapuri Fresh Red Country Tomatoes (நாட்டு தக்காளி)',
    produceName_ta: 'தருமபுரி நாட்டு சிவப்பு தக்காளி',
    category: 'Vegetables',
    imageUrl: VEGETABLE_IMAGES.tomato.url,
    quantity: 4500,
    unit: 'kg',
    cratesCount: 180,
    totalValue: 99000,
    vehicleType: 'Tata 407 Agri Turbo Truck',
    vehicleNumber: 'TN 29 AZ 5621',
    driverName: 'M. Pandian',
    driverMobile: '9842345678',
    driverRating: 4.85,
    currentStatus: 'In Transit',
    currentLocationName: 'NH 44 near Dindigul Highway Ring Road (Speed: 64 km/h)',
    currentSpeedKmH: 64,
    temperatureCelsius: 23.5,
    coldChainEnabled: false,
    dispatchTime: '2026-03-26 06:15 AM',
    estimatedDeliveryTime: '2026-03-26 01:00 PM',
    progressPercent: 78,
    deliveryOtp: '8154',
    ewayBillNumber: '241098561234',
    freightCost: 5200,
    routeStops: [
      { name: 'Palacode Farmgate Load', reached: true, time: '06:15 AM' },
      { name: 'Salem Outer Ring Road', reached: true, time: '07:45 AM' },
      { name: 'Namakkal Poultry & Agri Corridor', reached: true, time: '09:10 AM' },
      { name: 'Karur Amaravathi Bridge', reached: true, time: '10:20 AM' },
      { name: 'Dindigul Ring Road', reached: true, time: '11:45 AM' },
      { name: 'Madurai Mattuthavani Market', reached: false, time: '01:00 PM' }
    ],
    timeline: [
      {
        title: 'Morning Harvest from Trellis Fields',
        title_ta: 'காலை வேளையில் பந்தல் தோட்டத்திலிருந்து பறிக்கப்பட்டது',
        location: 'Palacode Farm, Dharmapuri',
        timestamp: '2026-03-26 05:00 AM',
        completed: true
      },
      {
        title: 'Packed in Ventilated Food-Grade Crates',
        title_ta: '25 கிலோ காற்றோட்டமான பிளாஸ்டிக் பெட்டிகளில் அடுக்கி ஏற்றப்பட்டது',
        location: 'Palacode Mandi Gate',
        timestamp: '2026-03-26 06:15 AM',
        completed: true
      },
      {
        title: 'Passed Karur Toll Plaza with Agricultural Exemption',
        title_ta: 'கரூர் சுங்கச்சாவடியை வேளாண்மை விலக்குடன் கடந்தது',
        location: 'Karur NH 44',
        timestamp: '2026-03-26 10:20 AM',
        completed: true
      },
      {
        title: 'Approaching Madurai Ring Road',
        title_ta: 'திண்டுக்கல் வழியே மதுரை வெளிவட்டச் சாலையை நெருங்குகிறது',
        location: 'NH 44 Dindigul-Madurai Corridor',
        timestamp: '2026-03-26 11:45 AM',
        completed: true,
        isCurrent: true
      },
      {
        title: 'Final Unloading at Mattuthavani Stall #48',
        title_ta: 'மதுரை மாட்டுத்தாவணி அங்காடியில் இறக்கி சரிபார்த்தல்',
        location: 'Mattuthavani Vegetable Complex',
        timestamp: '2026-03-26 01:00 PM (ETA)',
        completed: false
      }
    ],
    notes: 'Firm semi-ripe country tomatoes suited for distance transport. Zero damage packaging.'
  },
  {
    id: 'TN-TRK-54312',
    orderId: 'ORD-654321',
    invoiceId: 'INV-TN-2026-0520',
    farmerId: 'farmer-coimbatore',
    farmerName: 'Thirunavukkarasu Palanisamy',
    farmerMobile: '9842511223',
    originVillage: 'Anamalai, Pollachi',
    originDistrict: 'Coimbatore',
    destinationCity: 'Coimbatore',
    destinationState: 'Tamil Nadu',
    destinationHub: 'Ukkadam Uzhavar Santhai Direct Hub',
    buyerName: 'Coimbatore Urban Organic Consumers Collective',
    buyerMobile: '9443129087',
    produceName: 'Pollachi Green Plantain & Native Vegetables (வாழைக்காய் & கத்தரி)',
    produceName_ta: 'பொள்ளாச்சி நேந்திரன் வாழைக்காய் & நாட்டு காய்கறிகள்',
    category: 'Vegetables',
    imageUrl: VEGETABLE_IMAGES.rawBanana.url,
    quantity: 1200,
    unit: 'kg',
    cratesCount: 48,
    totalValue: 45600,
    vehicleType: 'Uzhavar Santhai Direct Electric Pickup',
    vehicleNumber: 'TN 38 EV 1092',
    driverName: 'V. Murugesan',
    driverMobile: '9842109844',
    driverRating: 5.0,
    currentStatus: 'Delivered & Verified',
    currentLocationName: 'Ukkadam Uzhavar Santhai Gate 1 (Delivered)',
    currentSpeedKmH: 0,
    temperatureCelsius: 22.0,
    coldChainEnabled: false,
    dispatchTime: '2026-03-26 05:00 AM',
    estimatedDeliveryTime: '2026-03-26 07:30 AM',
    actualDeliveryTime: '2026-03-26 07:22 AM',
    progressPercent: 100,
    deliveryOtp: '5619',
    ewayBillNumber: '241098671829',
    freightCost: 1800,
    routeStops: [
      { name: 'Anamalai Farmgate', reached: true, time: '05:00 AM' },
      { name: 'Pollachi Town Junction', reached: true, time: '05:40 AM' },
      { name: 'Kinathukadavu Toll', reached: true, time: '06:25 AM' },
      { name: 'Malumichampatti Ring Road', reached: true, time: '06:55 AM' },
      { name: 'Ukkadam Uzhavar Santhai Hub', reached: true, time: '07:22 AM' }
    ],
    timeline: [
      {
        title: 'Hand-Harvested from Anamalai Groves',
        title_ta: 'பொள்ளாச்சி ஆனைமலை தோட்டத்தில் இருந்து கையால் அறுவடை செய்யப்பட்டது',
        location: 'Anamalai, Pollachi',
        timestamp: '2026-03-26 04:00 AM',
        completed: true
      },
      {
        title: 'Direct Dispatch via EV Agri Pickup',
        title_ta: 'சுற்றுச்சூழல் மின்சார வாகனத்தில் நேரடியாக ஏற்றப்பட்டு புறப்பட்டது',
        location: 'Pollachi Road',
        timestamp: '2026-03-26 05:00 AM',
        completed: true
      },
      {
        title: 'Arrived at Ukkadam Farmer Market',
        title_ta: 'உக்கடம் உழவர் சந்தையை அடைந்தது',
        location: 'Ukkadam Hub',
        timestamp: '2026-03-26 07:22 AM',
        completed: true
      },
      {
        title: 'OTP 5619 Verified & Direct DBT Released',
        title_ta: 'OTP 5619 சரிபார்க்கப்பட்டு விவசாயி வங்கிக் கணக்கில் பணம் வரவு வைக்கப்பட்டது',
        location: 'Ukkadam Uzhavar Santhai Stall #18',
        timestamp: '2026-03-26 07:35 AM',
        completed: true,
        notes: 'Delivery completed safely. 100% fresh rating from buyers.'
      }
    ],
    notes: 'Direct farmgate to morning market delivery. Zero intermediary cuts.'
  },
  {
    id: 'TN-TRK-43210',
    orderId: 'ORD-543210',
    invoiceId: 'INV-TN-2026-0411',
    farmerId: 'farmer-salem',
    farmerName: 'Kandasamy Muthusamy',
    farmerMobile: '9486123488',
    originVillage: 'Veerapandi, Salem',
    originDistrict: 'Salem',
    destinationCity: 'Kochi',
    destinationState: 'Kerala',
    destinationHub: 'Ernakulam Maradu Wholesale Vegetable Market',
    buyerName: 'Kerala State Horticultural Products Development Corp (Horticorp)',
    buyerMobile: '9447102938',
    produceName: 'Salem Malgoa Mangoes & Sweet Ruby Beetroot (மாம்பழம் & பீட்ரூட்)',
    produceName_ta: 'சேலம் மல்கோவா மாம்பழங்கள் & நாட்டு பீட்ரூட்',
    category: 'Fruits & Vegetables',
    imageUrl: VEGETABLE_IMAGES.mango.url,
    quantity: 2500,
    unit: 'kg',
    cratesCount: 100,
    totalValue: 215000,
    vehicleType: 'Cold Chain Reefer Van',
    vehicleNumber: 'TN 30 BD 7891',
    driverName: 'C. Venkatesh',
    driverMobile: '9843219088',
    driverRating: 4.92,
    currentStatus: 'Vehicle Dispatched',
    currentLocationName: 'Sankagiri Highway Hub (Speed: 45 km/h)',
    currentSpeedKmH: 45,
    temperatureCelsius: 16.0,
    coldChainEnabled: true,
    dispatchTime: '2026-03-26 07:30 AM',
    estimatedDeliveryTime: '2026-03-26 06:30 PM',
    progressPercent: 22,
    deliveryOtp: '6741',
    ewayBillNumber: '241098782341',
    freightCost: 9500,
    routeStops: [
      { name: 'Veerapandi Salem Farmgate', reached: true, time: '07:30 AM' },
      { name: 'Sankagiri Highway Junction', reached: true, time: '08:45 AM' },
      { name: 'Erode Perundurai Bypass', reached: false, time: '10:15 AM' },
      { name: 'Coimbatore Walayar Border', reached: false, time: '01:00 PM' },
      { name: 'Palakkad Gap Highway', reached: false, time: '02:30 PM' },
      { name: 'Ernakulam Maradu Market', reached: false, time: '06:30 PM' }
    ],
    timeline: [
      {
        title: 'Graded and Layered in Straw Crates',
        title_ta: 'வைக்கோல் பெட்டிகளில் சேதமின்றி பாதுகாப்பாக அடுக்கப்பட்டது',
        location: 'Veerapandi Orchard',
        timestamp: '2026-03-26 06:00 AM',
        completed: true
      },
      {
        title: 'Vehicle Dispatched with E-Way Bill',
        title_ta: 'வாகனம் புறப்பட்டது மற்றும் அரசு இ-வே பில் பதிவு செய்யப்பட்டது',
        location: 'Salem Highway',
        timestamp: '2026-03-26 07:30 AM',
        completed: true,
        isCurrent: true
      },
      {
        title: 'En route to Walayar Kerala Border',
        title_ta: 'வாளையார் எல்லை சோதனைச் சாவடி நோக்கி செல்கிறது',
        location: 'Perundurai Bypass',
        timestamp: 'Estimated 01:00 PM',
        completed: false
      },
      {
        title: 'Horticorp Kerala Acceptance',
        title_ta: 'கேரளா ஹார்டிகார்ப் மையத்தில் இறக்குதல்',
        location: 'Ernakulam Maradu Hub',
        timestamp: 'Estimated 06:30 PM',
        completed: false
      }
    ],
    notes: 'Premium carbide-free naturally ripened Salem mangoes with fresh beetroot.'
  }
];

// Helper to calculate freight cost based on vehicle type and distance
export function calculateEstimatedFreight(distanceKm: number, vehicleType: string, isColdChain: boolean): number {
  let baseRatePerKm = 18;
  if (vehicleType.includes('Tata Ace') || vehicleType.includes('Pickup')) baseRatePerKm = 14;
  else if (vehicleType.includes('14ft') || vehicleType.includes('Truck')) baseRatePerKm = 22;
  else if (vehicleType.includes('Reefer') || isColdChain) baseRatePerKm = 28;

  const baseLoadingFee = 800;
  const coldChainSurcharge = isColdChain ? 1200 : 0;
  return Math.round(distanceKm * baseRatePerKm + baseLoadingFee + coldChainSurcharge);
}
