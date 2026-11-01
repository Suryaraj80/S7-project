import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  MapPin, 
  Phone, 
  Tag, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Search,
  IndianRupee,
  Share2,
  X,
  ExternalLink,
  Users
} from 'lucide-react';
import { INITIAL_MARKETPLACE_LISTINGS } from '../data/tamilNaduData';
import { MarketplaceListing, MarketplaceOrder, FarmerProfile, Language, User } from '../types';

interface FarmerMarketplaceProps {
  profile: FarmerProfile;
  language: Language;
  currentUser?: User;
}

export const FarmerMarketplace: React.FC<FarmerMarketplaceProps> = ({
  profile,
  language,
  currentUser
}) => {
  const [listings, setListings] = useState<MarketplaceListing[]>(INITIAL_MARKETPLACE_LISTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBuyerState, setSelectedBuyerState] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookingListing, setBookingListing] = useState<MarketplaceListing | null>(null);

  // New listing form state
  const [newProduceName, setNewProduceName] = useState('');
  const [newCategory, setNewCategory] = useState<'Vegetables' | 'Fruits' | 'Paddy & Grains' | 'Spices' | 'Plantation & Others'>('Vegetables');
  const [newFarmerPrice, setNewFarmerPrice] = useState<number>(45);
  const [newUnit, setNewUnit] = useState<'kg' | 'quintal' | 'bag' | 'piece' | 'ton'>('kg');
  const [newAvailableQty, setNewAvailableQty] = useState<number>(500);
  const [newMinOrderQty, setNewMinOrderQty] = useState<number>(10);
  const [newDescription, setNewDescription] = useState('');
  const [newIsOrganic, setNewIsOrganic] = useState(true);
  const [newInterState, setNewInterState] = useState(true);

  // Booking order form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerMobile, setBuyerMobile] = useState('');
  const [buyerState, setBuyerState] = useState('Karnataka');
  const [buyerCity, setBuyerCity] = useState('Bengaluru');
  const [orderQuantity, setOrderQuantity] = useState<number>(25);
  const [confirmedOrder, setConfirmedOrder] = useState<MarketplaceOrder | null>(null);

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesBuyerState = selectedBuyerState === 'All' || 
      item.deliveryStates.includes(selectedBuyerState) || 
      item.deliveryStates.includes('Pan-India');
    const matchesSearch = !searchKeyword || 
      item.produceName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.district.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchKeyword.toLowerCase());

    return matchesCategory && matchesBuyerState && matchesSearch;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduceName.trim()) return;

    const newListing: MarketplaceListing = {
      id: 'mkt-' + Date.now(),
      farmerId: profile.userId,
      farmerName: profile.fullName,
      farmerMobile: profile.mobile,
      village: profile.village || 'Local Farm',
      district: profile.district,
      state: 'Tamil Nadu',
      produceName: newProduceName,
      produceName_ta: newProduceName,
      category: newCategory,
      farmerPrice: newFarmerPrice,
      unit: newUnit,
      availableQuantity: newAvailableQty,
      minOrderQuantity: newMinOrderQty,
      harvestDate: new Date().toISOString().split('T')[0],
      interStateDeliveryAvailable: newInterState,
      deliveryStates: newInterState ? ['Karnataka', 'Kerala', 'Andhra Pradesh', 'Maharashtra', 'Pan-India'] : ['Tamil Nadu'],
      description: newDescription || 'Fresh farmgate produce harvested with utmost care.',
      description_ta: newDescription || 'இயற்கை உரம் கொண்டு விளைவிக்கப்பட்ட தூய உழவர் நேரடி விளைபொருள்.',
      isOrganic: newIsOrganic,
      status: 'Available'
    };

    setListings([newListing, ...listings]);
    setIsCreateModalOpen(false);
    setNewProduceName('');
    setNewDescription('');
    alert('Your harvest listing has been published to the statewide and inter-state marketplace!');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingListing) return;

    const order: MarketplaceOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      listingId: bookingListing.id,
      produceName: bookingListing.produceName,
      buyerName: buyerName || 'Customer',
      buyerMobile: buyerMobile || '9876543210',
      buyerState,
      buyerCity,
      requestedQuantity: orderQuantity,
      totalAmount: Math.round(orderQuantity * bookingListing.farmerPrice),
      status: 'Pending Farmer Confirmation',
      createdAt: new Date().toISOString()
    };

    setConfirmedOrder(order);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Uzhavar Sandhai Direct (உழவர் நேரடி சந்தை)
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'உழவர் நேரடி விளைபொருள் சந்தை (விவசாயிகள் நிர்ணயிக்கும் விலை)' : 'Farmer-Direct Produce Marketplace'}</span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {currentUser?.role === 'BUYER' ? (
              <span><strong>Bulk Procurement Portal:</strong> Direct farmgate orders with zero middleman markup. Sourced directly from verified growers in Tamil Nadu's 38 districts with pan-India dispatch.</span>
            ) : currentUser?.role === 'ADMIN' ? (
              <span><strong>State Market Surveillance:</strong> Live monitoring of farmgate transaction rates, grower price realization, and inter-state trade movements.</span>
            ) : (
              <span><strong>Farmers fix their own fair prices.</strong> Consumers, apartment societies, and bulk buyers across Tamil Nadu and neighbouring states buy fresh farmgate harvest with 0% middleman commission.</span>
            )}
          </p>
        </div>

        {/* Action Button depends on Role */}
        {currentUser?.role === 'BUYER' ? (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-teal-700" />
              <span>Buyer Procurement Mode</span>
            </span>
          </div>
        ) : currentUser?.role === 'ADMIN' ? (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
              <span>Official Market Oversight</span>
            </span>
          </div>
        ) : (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>List My Harvest (நான் விலை நிர்ணயிக்க)</span>
          </button>
        )}
      </div>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Ponni rice, shallots, coconut, mangoes..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium"
        >
          <option value="All">All Categories (அனைத்து வகைகள்)</option>
          <option value="Vegetables">Vegetables (காய்கறிகள் - சின்ன வெங்காயம், கேரட்)</option>
          <option value="Fruits">Fruits (பழங்கள் - மாம்பழம், இளநீர், வாழை)</option>
          <option value="Paddy & Grains">Paddy & Rice (பாரம்பரிய அரிசி & தானியங்கள்)</option>
          <option value="Spices">Spices (மஞ்சள், மல்லி, மிளகாய்)</option>
        </select>

        <select
          value={selectedBuyerState}
          onChange={e => setSelectedBuyerState(e.target.value)}
          className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium"
        >
          <option value="All">All Delivery Destinations (அனைத்து மாநிலங்கள்)</option>
          <option value="Karnataka">Ships to Karnataka (Bengaluru, Mysuru)</option>
          <option value="Kerala">Ships to Kerala (Kochi, Palakkad, Trivandrum)</option>
          <option value="Andhra Pradesh">Ships to Andhra Pradesh / Telangana</option>
          <option value="Maharashtra">Ships to Maharashtra (Mumbai, Pune)</option>
          <option value="Delhi">Ships to Delhi NCR</option>
        </select>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map(item => {
          const title = language === 'ta' ? item.produceName_ta : item.produceName;
          const desc = language === 'ta' ? item.description_ta : item.description;
          const whatsappMsg = `வணக்கம் ${item.farmerName}, ANNA AGRI AI தளம் வழியாக உங்களின் ${title} விளைபொருளை வாங்க தொடர்பு கொள்கிறேன். (விலை: ₹${item.farmerPrice}/${item.unit}).`;
          const whatsappUrl = `https://api.whatsapp.com/send?phone=91${item.farmerMobile}&text=${encodeURIComponent(whatsappMsg)}`;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-stone-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {item.imageUrl && (
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {item.isOrganic && (
                      <span className="text-[10px] font-bold text-emerald-100 bg-emerald-900/80 backdrop-blur-xs px-2 py-0.5 rounded border border-emerald-500/40">
                        100% Organic / இயற்கை
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="font-medium drop-shadow-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      {item.village}, {item.district}
                    </span>
                    <span className="bg-white/20 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-mono">
                      Harvest: {item.harvestDate}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  {!item.imageUrl && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800">{item.category}</span>
                      {item.isOrganic && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          100% Organic / இயற்கை
                        </span>
                      )}
                    </div>
                  )}

                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {title}
                </h3>

                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{item.village}, {item.district}, Tamil Nadu</span>
                </div>

                {/* Farmer Price Tag */}
                <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                      Farmer Fixed Price
                    </span>
                    <div className="flex items-baseline gap-1 text-emerald-800 font-bold font-mono text-lg">
                      <span>₹{item.farmerPrice}</span>
                      <span className="text-xs text-stone-500 font-sans font-normal">/ {item.unit}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-medium">Available Stock</span>
                    <span className="text-xs font-bold text-stone-800 font-mono">
                      {item.availableQuantity} {item.unit}s
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {desc}
                </p>

                {/* Inter-state delivery badge */}
                {item.interStateDeliveryAvailable && (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200">
                    <Truck className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                    <span>Inter-State Delivery: {item.deliveryStates.slice(0, 3).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setBookingListing(item)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-2xs text-center"
                >
                  Buy / Pre-Order
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                  title="Chat directly with farmer on WhatsApp"
                >
                  <span>WhatsApp</span>
                </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW LISTING MODAL (FOR FARMERS TO FIX PRICE) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  List Your Farm Produce & Fix Your Price
                </h3>
                <span className="text-[11px] text-stone-500">Zero commission. 100% money goes to you.</span>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Produce Name * (e.g. Fresh Ponni Rice, Small Shallots, Tender Coconut)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Country Small Shallots / சின்ன வெங்காயம்"
                  value={newProduceName}
                  onChange={e => setNewProduceName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Vegetables">Vegetables (காய்கறிகள்)</option>
                    <option value="Fruits">Fruits (பழங்கள்)</option>
                    <option value="Paddy & Grains">Paddy & Grains (அரிசி & தானியங்கள்)</option>
                    <option value="Spices">Spices (மஞ்சள், வாசனைப் பொருட்கள்)</option>
                    <option value="Plantation & Others">Plantation & Others</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Measurement Unit</label>
                  <select
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="kg">Per Kilogram (கிலோ)</option>
                    <option value="quintal">Per Quintal (100 kg)</option>
                    <option value="bag">Per Bag (மூட்டை)</option>
                    <option value="piece">Per Piece (எண்ணிக்கை)</option>
                    <option value="ton">Per Ton</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newFarmerPrice}
                    onChange={e => setNewFarmerPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Available Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newAvailableQty}
                    onChange={e => setNewAvailableQty(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Min Order Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newMinOrderQty}
                    onChange={e => setNewMinOrderQty(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Description & Quality Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Directly harvested from farm. Naturally shade dried. Ready for immediate lorry/tempo dispatch."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={newIsOrganic}
                    onChange={e => setNewIsOrganic(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <span>100% Chemical-Free / Organic produce</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={newInterState}
                    onChange={e => setNewInterState(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <span>Allow orders from Bengaluru, Kerala, and other states</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BUY / PRE-ORDER MODAL (FOR CONSUMERS / INTER-STATE BUYERS) */}
      {bookingListing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Direct Farmgate Pre-Order / Booking
                </h3>
                <span className="text-[11px] text-stone-500">Contacting: {bookingListing.farmerName} ({bookingListing.district})</span>
              </div>
              <button 
                onClick={() => {
                  setBookingListing(null);
                  setConfirmedOrder(null);
                }} 
                className="p-1 rounded text-stone-500 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!confirmedOrder ? (
              <form onSubmit={handlePlaceOrder} className="p-5 space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-bold text-stone-900">{bookingListing.produceName}</div>
                  <div className="text-xs text-emerald-800 font-mono font-bold mt-0.5">
                    Farmer Price: ₹{bookingListing.farmerPrice} per {bookingListing.unit}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Location: {bookingListing.village}, {bookingListing.district}, Tamil Nadu
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Anand Sharma"
                      value={buyerName}
                      onChange={e => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Contact Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={buyerMobile}
                      onChange={e => setBuyerMobile(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your State *</label>
                    <select
                      value={buyerState}
                      onChange={e => setBuyerState(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      <option value="Karnataka">Karnataka (Bengaluru/Mysuru)</option>
                      <option value="Kerala">Kerala (Kochi/Palakkad)</option>
                      <option value="Tamil Nadu">Tamil Nadu (Chennai/Coimbatore)</option>
                      <option value="Andhra Pradesh">Andhra Pradesh / Telangana</option>
                      <option value="Maharashtra">Maharashtra (Mumbai/Pune)</option>
                      <option value="Delhi">Delhi NCR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">City / Delivery Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indiranagar, Bengaluru"
                      value={buyerCity}
                      onChange={e => setBuyerCity(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Order Quantity ({bookingListing.unit}) * [Min: {bookingListing.minOrderQuantity}]
                  </label>
                  <input
                    type="number"
                    min={bookingListing.minOrderQuantity}
                    max={bookingListing.availableQuantity}
                    required
                    value={orderQuantity}
                    onChange={e => setOrderQuantity(parseFloat(e.target.value) || bookingListing.minOrderQuantity)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Estimated Total: <strong className="font-mono text-emerald-800 text-sm">₹{Math.round(orderQuantity * bookingListing.farmerPrice).toLocaleString('en-IN')}</strong> (Transport payable as agreed directly with farmer)
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingListing(null)}
                    className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
                  >
                    Submit Booking Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Booking Intimation Sent: #{confirmedOrder.id}</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed text-xs">
                    Your request for <strong>{confirmedOrder.requestedQuantity} {bookingListing.unit}s</strong> of {confirmedOrder.produceName} has been transmitted directly to farmer <strong>{bookingListing.farmerName}</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="font-bold text-stone-800">Direct Farmer Contact Details:</div>
                  <div className="text-stone-700 space-y-1 text-xs">
                    <div>Farmer Name: <strong>{bookingListing.farmerName}</strong></div>
                    <div>Mobile: <strong className="font-mono">{bookingListing.farmerMobile}</strong></div>
                    <div>Location: {bookingListing.village}, {bookingListing.district}, Tamil Nadu</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${bookingListing.farmerMobile}&text=${encodeURIComponent(`Hello ${bookingListing.farmerName}, I placed Booking Ticket #${confirmedOrder.id} from ${confirmedOrder.buyerCity}, ${confirmedOrder.buyerState} for ${confirmedOrder.requestedQuantity} ${bookingListing.unit}s of ${confirmedOrder.produceName}. Please confirm dispatch details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5"
                  >
                    <span>Open Farmer WhatsApp Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
