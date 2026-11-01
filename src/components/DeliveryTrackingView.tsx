import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Phone, 
  AlertCircle, 
  Thermometer, 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  X, 
  Navigation, 
  UserCheck, 
  Compass, 
  Package,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DeliveryShipment, DeliveryStatus, FarmerProfile, Language, User } from '../types';
import { INITIAL_DELIVERY_SHIPMENTS, calculateEstimatedFreight } from '../data/deliveryData';
import { VEGETABLE_IMAGES } from '../data/vegetableImages';
import { printHtmlSafely, downloadHtmlFile } from '../utils/printAndDownloadService';

interface DeliveryTrackingViewProps {
  profile: FarmerProfile;
  language: Language;
  currentUser?: User;
}

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  profile,
  language,
  currentUser
}) => {
  // 1. Shipments State (with localStorage persistence)
  const [shipments, setShipments] = useState<DeliveryShipment[]>(() => {
    try {
      const stored = localStorage.getItem('aaa_delivery_shipments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_DELIVERY_SHIPMENTS;
  });

  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    () => INITIAL_DELIVERY_SHIPMENTS[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Dispatch Form State
  const [dispatchProduceKey, setDispatchProduceKey] = useState<string>('tomato');
  const [customProduceName, setCustomProduceName] = useState('');
  const [dispatchQuantity, setDispatchQuantity] = useState<number>(2000);
  const [dispatchUnit, setDispatchUnit] = useState<string>('kg');
  const [dispatchBuyerName, setDispatchBuyerName] = useState('Koyambedu Wholesale Agro Hub');
  const [dispatchBuyerMobile, setDispatchBuyerMobile] = useState('9840123980');
  const [dispatchDestinationCity, setDispatchDestinationCity] = useState('Chennai');
  const [dispatchDestinationHub, setDispatchDestinationHub] = useState('Koyambedu Market Terminal Block A');
  const [dispatchVehicleType, setDispatchVehicleType] = useState('Eicher 14ft Pro Farm Hauler');
  const [dispatchIsColdChain, setDispatchIsColdChain] = useState(false);
  const [estimatedKm, setEstimatedKm] = useState<number>(380);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aaa_delivery_shipments', JSON.stringify(shipments));
    } catch {}
  }, [shipments]);

  // Selected Shipment Details
  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  // Filtering
  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'In Transit' && shipment.currentStatus === 'In Transit') ||
      (statusFilter === 'Dispatched' && (shipment.currentStatus === 'Vehicle Dispatched' || shipment.currentStatus === 'Harvested & Packed')) ||
      (statusFilter === 'Delivered' && shipment.currentStatus === 'Delivered & Verified');

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      shipment.id.toLowerCase().includes(searchLower) ||
      shipment.produceName.toLowerCase().includes(searchLower) ||
      shipment.originDistrict.toLowerCase().includes(searchLower) ||
      shipment.destinationCity.toLowerCase().includes(searchLower) ||
      shipment.buyerName.toLowerCase().includes(searchLower) ||
      shipment.driverName.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  // Calculate quick metrics
  const totalCount = shipments.length;
  const inTransitCount = shipments.filter(s => s.currentStatus === 'In Transit').length;
  const deliveredCount = shipments.filter(s => s.currentStatus === 'Delivered & Verified').length;
  const coldChainCount = shipments.filter(s => s.coldChainEnabled).length;

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Farmer OTP verification handler to simulate completion
  const handleVerifyOtp = (shipmentId: string) => {
    const enteredOtp = window.prompt(
      language === 'ta' 
        ? `டெலிவரி ரகசிய OTP எண்ணை உள்ளிடவும் (மாதிரி OTP: ${selectedShipment?.deliveryOtp}):`
        : `Enter the 4-digit Delivery OTP (Sample OTP: ${selectedShipment?.deliveryOtp}):`
    );

    if (!enteredOtp) return;

    if (enteredOtp.trim() === selectedShipment?.deliveryOtp) {
      setShipments(prev => prev.map(s => {
        if (s.id === shipmentId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...s,
            currentStatus: 'Delivered & Verified',
            progressPercent: 100,
            actualDeliveryTime: `Today at ${nowStr}`,
            timeline: [
              ...s.timeline.map(t => ({ ...t, completed: true })),
              {
                title: 'Delivered & Buyer OTP Verified',
                title_ta: 'கொள்முதல் அதிகாரி சரிபார்த்து ரகசிய OTP உறுதி செய்யப்பட்டது',
                location: s.destinationHub,
                timestamp: `Delivered today at ${nowStr}`,
                completed: true,
                notes: 'Payment released directly to farmer account via Escrow DBT.'
              }
            ]
          };
        }
        return s;
      }));
      showNotification(language === 'ta' ? 'சரக்கு வெற்றிகரமாக விநியோகிக்கப்பட்டு OTP உறுதி செய்யப்பட்டது!' : 'Consignment verified & delivered successfully! Payment released to farmer.');
    } else {
      alert(language === 'ta' ? 'தவறான OTP எண். தயவுசெய்து சரிபார்க்கவும்.' : 'Invalid OTP. Please check the consignment note.');
    }
  };

  // Handle New Dispatch creation
  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = VEGETABLE_IMAGES[dispatchProduceKey];
    const finalProduceName = customProduceName.trim() || (prod ? prod.name : 'Farm Fresh Vegetables');
    const finalProduceNameTa = prod ? prod.name_ta : finalProduceName;
    const finalImageUrl = prod ? prod.url : VEGETABLE_IMAGES.tomato.url;

    const trackingId = 'TN-TRK-' + Math.floor(10000 + Math.random() * 90000);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const ewayBill = '2410' + Math.floor(10000000 + Math.random() * 90000000);
    const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
    const calculatedFreight = calculateEstimatedFreight(estimatedKm, dispatchVehicleType, dispatchIsColdChain);

    const newShipment: DeliveryShipment = {
      id: trackingId,
      orderId,
      invoiceId: 'INV-TN-2026-' + Math.floor(1000 + Math.random() * 9000),
      farmerId: profile.userId,
      farmerName: profile.fullName || 'Direct Farmgate Producer',
      farmerMobile: profile.mobile || '9840123456',
      originVillage: `${profile.village || 'Farm Village'}, ${profile.taluk || 'Taluk'}`,
      originDistrict: profile.district || 'Tamil Nadu',
      destinationCity: dispatchDestinationCity,
      destinationState: 'Tamil Nadu',
      destinationHub: dispatchDestinationHub,
      buyerName: dispatchBuyerName,
      buyerMobile: dispatchBuyerMobile,
      produceName: finalProduceName,
      produceName_ta: finalProduceNameTa,
      category: 'Vegetables',
      imageUrl: finalImageUrl,
      quantity: dispatchQuantity,
      unit: dispatchUnit,
      cratesCount: Math.ceil(dispatchQuantity / 25),
      totalValue: dispatchQuantity * 35,
      vehicleType: dispatchVehicleType,
      vehicleNumber: 'TN ' + Math.floor(10 + Math.random() * 89) + ' AA ' + Math.floor(1000 + Math.random() * 9000),
      driverName: 'S. Shanmugam',
      driverMobile: '9789' + Math.floor(100000 + Math.random() * 900000),
      driverRating: 4.9,
      currentStatus: 'Vehicle Dispatched',
      currentLocationName: `${profile.district} Mandi Checkpost (Speed: 42 km/h)`,
      currentSpeedKmH: 42,
      temperatureCelsius: dispatchIsColdChain ? 13.5 : 24.0,
      coldChainEnabled: dispatchIsColdChain,
      dispatchTime: 'Just now',
      estimatedDeliveryTime: 'Today by 06:30 PM',
      progressPercent: 20,
      deliveryOtp: generatedOtp,
      ewayBillNumber: ewayBill,
      freightCost: calculatedFreight,
      routeStops: [
        { name: `${profile.district} Farmgate Pickup`, reached: true, time: 'Just now' },
        { name: 'District Highway Toll Checkpost', reached: true, time: 'In 30m' },
        { name: 'State Commercial Weighbridge', reached: false, time: 'In 2h' },
        { name: `${dispatchDestinationCity} Outer Ring Junction`, reached: false, time: 'In 4h' },
        { name: dispatchDestinationHub, reached: false, time: '06:30 PM (ETA)' }
      ],
      timeline: [
        {
          title: 'Farmgate Harvested, Sorted & Weighed',
          title_ta: 'வயலில் அறுவடை செய்யப்பட்டு தரம் பிரித்து எடை போடப்பட்டது',
          location: `${profile.village || 'Farm'}, ${profile.district}`,
          timestamp: 'Today Morning',
          completed: true
        },
        {
          title: 'Loaded on Agri Vehicle & Dispatched',
          title_ta: 'விவசாய சரக்கு வாகனத்தில் ஏற்றப்பட்டு புறப்பட்டது',
          location: `${profile.district} Farm Gate`,
          timestamp: 'Just now',
          completed: true,
          isCurrent: true,
          notes: `Vehicle assigned: ${dispatchVehicleType}. Live GPS tracking active.`
        },
        {
          title: 'Highway Transit & Toll Clearances',
          title_ta: 'நெடுஞ்சாலை பயணம் மற்றும் சுங்கச்சாவடி விலக்கு பதிவு',
          location: 'En route to destination',
          timestamp: 'In Progress',
          completed: false
        },
        {
          title: `Arrival at ${dispatchDestinationHub}`,
          title_ta: 'கொள்முதல் மையத்தை அடைதல்',
          location: dispatchDestinationHub,
          timestamp: 'Today by 06:30 PM (ETA)',
          completed: false
        },
        {
          title: 'Buyer Physical Verification & OTP Confirmation',
          title_ta: 'கொள்முதல் அதிகாரி சரிபார்த்து ரகசிய OTP உறுதி செய்தல்',
          location: 'Buyer Hub Inspection Bay',
          timestamp: 'Pending Final Verification',
          completed: false
        }
      ],
      notes: 'Direct farmgate shipment with 0% middleman brokerage. Perishable handling protocols active.'
    };

    setShipments([newShipment, ...shipments]);
    setSelectedShipmentId(newShipment.id);
    setIsNewDispatchOpen(false);
    showNotification(
      language === 'ta'
        ? `புதிய சரக்கு பதிவு செய்யப்பட்டது! கண்காணிப்பு எண்: ${newShipment.id} (OTP: ${generatedOtp})`
        : `Shipment dispatched! Live Tracking ID: ${newShipment.id} (Delivery OTP: ${generatedOtp})`
    );
  };

  // Generate Printable Lorry Receipt / Waybill HTML
  const handlePrintLorryReceipt = (shipment: DeliveryShipment) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lorry Receipt & Consignment Waybill - ${shipment.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #1c1917; }
    .header { border-bottom: 2px solid #166534; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 20px; font-weight: 800; color: #166534; margin: 0; }
    .brand-sub { font-size: 11px; color: #44403c; margin-top: 2px; }
    .lr-badge { background: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 6px 12px; font-weight: 800; font-size: 14px; border-radius: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 12px; }
    .card { border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; background: #fafaf9; }
    .card-title { font-size: 11px; font-weight: 700; color: #78716c; text-transform: uppercase; margin-bottom: 8px; }
    .field { margin-bottom: 4px; }
    .field strong { color: #292524; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
    th { background: #f5f5f4; text-align: left; padding: 8px; border: 1px solid #e7e5e4; font-size: 11px; text-transform: uppercase; }
    td { padding: 8px; border: 1px solid #e7e5e4; }
    .stamp-box { border: 2px dashed #166534; padding: 12px; text-align: center; border-radius: 8px; margin-top: 20px; font-size: 11px; color: #166534; font-weight: 600; }
    .otp-highlight { font-size: 18px; font-weight: 800; color: #b91c1c; letter-spacing: 2px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">ANNA AGRI AI - DIRECT FARMGATE LOGISTICS</h1>
      <div class="brand-sub">Government of Tamil Nadu Direct Farmer Produce Movement Act · 0% Intermediary Exemption</div>
      <div class="brand-sub">E-Way Bill: <strong>${shipment.ewayBillNumber}</strong> | Lorry Receipt No: <strong>${shipment.id}</strong></div>
    </div>
    <div class="lr-badge">
      STATUS: ${shipment.currentStatus.toUpperCase()}
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">CONSIGNOR (PRODUCER / FARMER)</div>
      <div class="field"><strong>Farmer Name:</strong> ${shipment.farmerName}</div>
      <div class="field"><strong>Mobile:</strong> +91 ${shipment.farmerMobile}</div>
      <div class="field"><strong>Farm Location:</strong> ${shipment.originVillage}, ${shipment.originDistrict}, TN</div>
      <div class="field"><strong>Dispatch Time:</strong> ${shipment.dispatchTime}</div>
    </div>

    <div class="card">
      <div class="card-title">CONSIGNEE (BUYER / MANDI HUB)</div>
      <div class="field"><strong>Buyer Name:</strong> ${shipment.buyerName}</div>
      <div class="field"><strong>Mobile:</strong> +91 ${shipment.buyerMobile}</div>
      <div class="field"><strong>Destination Hub:</strong> ${shipment.destinationHub}, ${shipment.destinationCity}</div>
      <div class="field"><strong>Estimated Arrival:</strong> ${shipment.estimatedDeliveryTime}</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">TRANSPORT & VEHICLE DETAILS</div>
      <div class="field"><strong>Vehicle Type:</strong> ${shipment.vehicleType}</div>
      <div class="field"><strong>Registration Number:</strong> ${shipment.vehicleNumber}</div>
      <div class="field"><strong>Driver Name:</strong> ${shipment.driverName} (Rating: ${shipment.driverRating}★)</div>
      <div class="field"><strong>Driver Contact:</strong> +91 ${shipment.driverMobile}</div>
      ${shipment.coldChainEnabled ? `<div class="field" style="color:#0284c7"><strong>Cold Chain Reefer Active:</strong> Target Temp 12°C - 14°C (Current: ${shipment.temperatureCelsius}°C)</div>` : ''}
    </div>

    <div class="card">
      <div class="card-title">FREIGHT & DELIVERY SECURITY</div>
      <div class="field"><strong>Freight Charges:</strong> ₹${shipment.freightCost.toLocaleString()} (Paid via Escrow / DBT)</div>
      <div class="field"><strong>Mandi Brokerage Deduction:</strong> ₹0.00 (100% Exempted)</div>
      <div class="field"><strong>Statutory Toll Exemption:</strong> Verified Farm Produce Green Corridor</div>
      <div class="field" style="margin-top: 6px;"><strong>Delivery Verification OTP:</strong> <span class="otp-highlight">${shipment.deliveryOtp}</span></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produce Description</th>
        <th>Category</th>
        <th>Quantity</th>
        <th>Packaging</th>
        <th>Total Value (INR)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${shipment.produceName}</strong><br><small>${shipment.produceName_ta}</small></td>
        <td>${shipment.category}</td>
        <td><strong>${shipment.quantity.toLocaleString()} ${shipment.unit}s</strong></td>
        <td>${shipment.cratesCount ? `${shipment.cratesCount} Ventilated Crates / Sacks` : 'Standard Agri Bags'}</td>
        <td><strong>₹${shipment.totalValue.toLocaleString()}</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="stamp-box">
    OFFICIALLY REGISTERED FARM PRODUCE WAYBILL · ZERO BROKER DEDUCTION VERIFIED<br>
    This digital waybill grants uninterrupted passage across Tamil Nadu state checkposts and municipal boundaries under Agricultural Produce Marketing Exemption.
  </div>
</body>
</html>
    `;

    printHtmlSafely(htmlContent, `Waybill-${shipment.id}`);
  };

  const handleDownloadWaybill = (shipment: DeliveryShipment) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lorry Receipt & Consignment Waybill - ${shipment.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #1c1917; }
    .header { border-bottom: 2px solid #166534; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 20px; font-weight: 800; color: #166534; margin: 0; }
    .lr-badge { background: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 6px 12px; font-weight: 800; font-size: 14px; border-radius: 6px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 12px; }
    .card { border: 1px solid #e7e5e4; border-radius: 8px; padding: 12px; background: #fafaf9; }
    .field { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
    th { background: #f5f5f4; text-align: left; padding: 8px; border: 1px solid #e7e5e4; }
    td { padding: 8px; border: 1px solid #e7e5e4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">ANNA AGRI AI - DIRECT FARMGATE LOGISTICS WAYBILL</h1>
      <div>Waybill ID: ${shipment.id} | E-Way Bill: ${shipment.ewayBillNumber}</div>
    </div>
    <div class="lr-badge">STATUS: ${shipment.currentStatus}</div>
  </div>
  <div class="grid">
    <div class="card">
      <strong>Consignor (Farmer):</strong> ${shipment.farmerName} (${shipment.farmerMobile})<br>
      Location: ${shipment.originVillage}, ${shipment.originDistrict}, TN
    </div>
    <div class="card">
      <strong>Consignee (Buyer):</strong> ${shipment.buyerName} (${shipment.buyerMobile})<br>
      Destination: ${shipment.destinationHub}, ${shipment.destinationCity}
    </div>
  </div>
  <table>
    <tr><th>Produce</th><th>Quantity</th><th>Vehicle Number</th><th>Driver</th><th>Freight</th><th>OTP</th></tr>
    <tr>
      <td>${shipment.produceName}</td>
      <td>${shipment.quantity} ${shipment.unit}</td>
      <td>${shipment.vehicleNumber}</td>
      <td>${shipment.driverName} (${shipment.driverMobile})</td>
      <td>₹${shipment.freightCost}</td>
      <td><strong>${shipment.deliveryOtp}</strong></td>
    </tr>
  </table>
</body>
</html>`;
    downloadHtmlFile(htmlContent, `Waybill_${shipment.id}.html`);
    showNotification('Waybill downloaded successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Notification */}
      {actionNotice && (
        <div className="p-3 bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="p-1 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-800 text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                {language === 'ta' ? 'விளைபொருள் சரக்கு நேரலை கண்காணிப்பு' : 'Farmer Produce Delivery & Transit Tracking'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ta' 
                  ? 'விவசாயிகள் அனுப்பும் விளைபொருட்களின் ஜி.பி.எஸ் வழித்தடம், வாகன நிலை மற்றும் நேரடி விநியோகம்'
                  : 'Live GPS dispatch tracking, refrigerated transit monitor, and digital Lorry Receipts for farmgate dispatches'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewDispatchOpen(true)}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய சரக்கு பதிவு செய்க' : 'Dispatch New Produce'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] text-stone-500 font-medium block">
            {language === 'ta' ? 'மொத்த சரக்குகள்' : 'Total Dispatches'}
          </span>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{totalCount}</div>
          <span className="text-[10px] text-emerald-800 font-medium">100% Farmgate Direct</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] text-emerald-800 font-semibold block flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {language === 'ta' ? 'வழியில் உள்ளவை' : 'Active In-Transit'}
          </span>
          <div className="text-2xl font-bold text-emerald-800 font-mono mt-1">{inTransitCount}</div>
          <span className="text-[10px] text-stone-500">Live GPS tracking</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] text-stone-500 font-medium block">
            {language === 'ta' ? 'நிறைவடைந்த டெலிவரிகள்' : 'Delivered & Accepted'}
          </span>
          <div className="text-2xl font-bold text-stone-900 font-mono mt-1">{deliveredCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium">Verified by OTP</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs">
          <span className="text-[11px] text-blue-700 font-medium block flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-blue-600" />
            {language === 'ta' ? 'குளிர்சாதன வாகனங்கள்' : 'Cold Chain Reefer'}
          </span>
          <div className="text-2xl font-bold text-blue-900 font-mono mt-1">{coldChainCount}</div>
          <span className="text-[10px] text-blue-600">Perishables safe</span>
        </div>
      </div>

      {/* Main Grid: Left = Selected Shipment Spotlight & Live GPS; Right = Shipments List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Focused Consignment Spotlight */}
        <div className="lg:col-span-8 space-y-5">
          {selectedShipment ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              
              {/* Card Header with Vegetable Imagery Banner */}
              <div className="relative h-44 sm:h-52 w-full bg-stone-100 overflow-hidden">
                <img
                  src={selectedShipment.imageUrl}
                  alt={selectedShipment.produceName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                
                {/* Badges on Top */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-800 text-white font-mono font-bold text-xs rounded-lg shadow-sm border border-emerald-600">
                      {selectedShipment.id}
                    </span>
                    <span className="px-2.5 py-1 bg-black/60 text-white backdrop-blur-xs text-[11px] rounded-lg">
                      E-Way: {selectedShipment.ewayBillNumber}
                    </span>
                  </div>

                  <span className={`px-3 py-1 font-bold text-xs rounded-lg shadow-sm ${
                    selectedShipment.currentStatus === 'Delivered & Verified'
                      ? 'bg-emerald-600 text-white'
                      : selectedShipment.currentStatus === 'In Transit'
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {selectedShipment.currentStatus}
                  </span>
                </div>

                {/* Bottom Details on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold drop-shadow-md">
                    {language === 'ta' ? selectedShipment.produceName_ta : selectedShipment.produceName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-200 mt-1">
                    <span>Quantity: <strong>{selectedShipment.quantity.toLocaleString()} {selectedShipment.unit}</strong></span>
                    <span>·</span>
                    <span>Crates: <strong>{selectedShipment.cratesCount || 40} crates</strong></span>
                    <span>·</span>
                    <span>Consignment Value: <strong>₹{selectedShipment.totalValue.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Live Transit Radar & Progress Bar */}
              <div className="p-5 border-b border-stone-200 bg-stone-50/70 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-800 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-bold text-stone-800">
                      {language === 'ta' ? 'தற்போதைய இடம்' : 'Current GPS Location'}:
                    </span>
                    <span className="font-semibold text-emerald-800">{selectedShipment.currentLocationName}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-600">
                    {selectedShipment.progressPercent}% {language === 'ta' ? 'நிறைவு' : 'Completed'}
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-800 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedShipment.progressPercent}%` }}
                  />
                </div>

                {/* Origin to Destination Route Indicators */}
                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Origin (Farmgate)</span>
                    <span className="font-semibold text-stone-800">{selectedShipment.originVillage}, {selectedShipment.originDistrict}</span>
                  </div>
                  <div className="text-center px-2">
                    <ArrowRight className="w-4 h-4 text-stone-400 mx-auto" />
                    <span className="text-[10px] text-emerald-800 font-medium">NH Corridor</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Destination (Hub)</span>
                    <span className="font-semibold text-stone-800">{selectedShipment.destinationHub}, {selectedShipment.destinationCity}</span>
                  </div>
                </div>
              </div>

              {/* Driver, Vehicle & Commercial Dossier */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-stone-200">
                {/* Vehicle & Driver Box */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Assigned Agri Vehicle
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 rounded text-stone-800">
                      {selectedShipment.vehicleNumber}
                    </span>
                  </div>
                  
                  <div className="text-sm font-semibold text-stone-900">
                    {selectedShipment.vehicleType}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                        <span>{selectedShipment.driverName}</span>
                        <span className="text-amber-500 font-normal">★ {selectedShipment.driverRating}</span>
                      </div>
                      <span className="text-[11px] text-stone-500">Certified Agri Driver</span>
                    </div>

                    <a
                      href={`tel:${selectedShipment.driverMobile}`}
                      className="py-1.5 px-3 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Driver</span>
                    </a>
                  </div>

                  {selectedShipment.coldChainEnabled && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900 font-medium">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                        Reefer Temperature
                      </span>
                      <span className="font-mono font-bold">{selectedShipment.temperatureCelsius}°C (Normal)</span>
                    </div>
                  )}
                </div>

                {/* Buyer & Verification Box */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Consignee / Buyer
                    </span>
                    <a
                      href={`tel:${selectedShipment.buyerMobile}`}
                      className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{selectedShipment.buyerMobile}</span>
                    </a>
                  </div>

                  <div className="text-sm font-semibold text-stone-900 leading-snug">
                    {selectedShipment.buyerName}
                  </div>
                  <div className="text-xs text-stone-500">
                    {selectedShipment.destinationHub}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">Delivery Verification OTP</span>
                      <span className="text-base font-bold font-mono text-rose-600 tracking-wider">
                        {selectedShipment.deliveryOtp}
                      </span>
                    </div>

                    {selectedShipment.currentStatus !== 'Delivered & Verified' && (
                      <button
                        onClick={() => handleVerifyOtp(selectedShipment.id)}
                        className="py-1.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-2xs"
                      >
                        Verify & Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Waybill Route Milestones & Checkpoints */}
              <div className="p-5 space-y-4">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <span>Route Milestones & Timeline Checkpoints</span>
                </h4>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-stone-200 pl-8">
                  {selectedShipment.timeline.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.completed
                          ? 'bg-emerald-800 text-white'
                          : step.isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : 'bg-stone-200 text-stone-500'
                      }`}>
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900">
                            {language === 'ta' ? step.title_ta : step.title}
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono">{step.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-stone-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{step.location}</span>
                        </div>
                        {step.notes && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-md border border-amber-200 mt-1">
                            {step.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-stone-500">
                  Freight: <strong className="text-stone-800">₹{selectedShipment.freightCost.toLocaleString()}</strong> · APMC Mandi Cess: <strong className="text-emerald-700">₹0 (Exempt)</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintLorryReceipt(selectedShipment)}
                    className="py-2 px-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-600" />
                    <span>Print Lorry Receipt (LR)</span>
                  </button>

                  <button
                    onClick={() => handleDownloadWaybill(selectedShipment)}
                    className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Waybill</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
              No consignment selected.
            </div>
          )}
        </div>

        {/* Right Column: Consignments Registry List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">
                {language === 'ta' ? 'விவசாயி சரக்குகள் பட்டியல்' : 'Farmer Consignment List'}
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-stone-100 rounded text-stone-600">
                {filteredShipments.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'ta' ? 'கண்காணிப்பு எண் / காய் பெயர்...' : 'Tracking ID / Produce name...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-stone-50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs overflow-x-auto">
              {['All', 'In Transit', 'Dispatched', 'Delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 py-1 px-2 font-medium rounded-md whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Shipment Items */}
          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredShipments.map(item => {
              const isSelected = item.id === selectedShipmentId;
              const title = language === 'ta' ? item.produceName_ta : item.produceName;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedShipmentId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-800">{item.id}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.currentStatus === 'Delivered & Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.currentStatus === 'In Transit'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.currentStatus}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {title}
                    </h4>

                    <div className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>To: {item.destinationCity} ({item.destinationHub})</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-stone-600 font-mono">
                      <span>{item.quantity} {item.unit}</span>
                      <span className="text-stone-900 font-bold">₹{item.totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DISPATCH NEW PRODUCE MODAL */}
      {isNewDispatchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  {language === 'ta' ? 'புதிய விளைபொருள் சரக்கு பதிவு' : 'Dispatch New Harvest Consignment'}
                </h3>
                <span className="text-[11px] text-stone-500">
                  Automated GPS Waybill & 0% APMC Brokerage Mandate
                </span>
              </div>
              <button onClick={() => setIsNewDispatchOpen(false)} className="p-1 rounded text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Produce Selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Select Harvested Produce *
                </label>
                <select
                  value={dispatchProduceKey}
                  onChange={e => setDispatchProduceKey(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="tomato">Country Red Tomatoes (நாட்டு தக்காளி)</option>
                  <option value="shallots">Dindigul Small Shallots (சின்ன வெங்காயம்)</option>
                  <option value="carrots">Nilgiri Ooty Mountain Carrots (ஊட்டி மலை கேரட்)</option>
                  <option value="brinjal">Manapparai Green Brinjal (மணப்பாறை கத்தரிக்காய்)</option>
                  <option value="okra">Oddanchatram Ladies Finger / Bhendi (வெண்டைக்காய்)</option>
                  <option value="drumstick">Aravakurichi Moringa Drumstick (முருங்கைக்காய்)</option>
                  <option value="capsicum">Hosur Capsicum / Bell Pepper (குடைமிளகாய்)</option>
                  <option value="chillies">Theni Green Chillies (பச்சை மிளகாய்)</option>
                  <option value="potato">Nilgiri Potatoes (உருளைக்கிழங்கு)</option>
                  <option value="garlic">Kodaikanal Hill Garlic (மலைப்பூண்டு - GI Tagged)</option>
                  <option value="rawBanana">Pollachi Green Plantain (வாழைக்காய்)</option>
                  <option value="rice">Thanjavur Ponni Rice (பொன்னி அரிசி)</option>
                  <option value="coconut">Pollachi Tender Coconuts (இளநீர் & தேங்காய்)</option>
                </select>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={dispatchQuantity}
                    onChange={e => setDispatchQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unit</label>
                  <select
                    value={dispatchUnit}
                    onChange={e => setDispatchUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="kg">Kilograms (கிலோ)</option>
                    <option value="crates">Crates (பெட்டிகள் - 25kg each)</option>
                    <option value="quintal">Quintals (குவிண்டால்)</option>
                    <option value="bags">Bags (மூட்டைகள்)</option>
                  </select>
                </div>
              </div>

              {/* Destination City & Buyer Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Destination City *</label>
                  <select
                    value={dispatchDestinationCity}
                    onChange={e => {
                      setDispatchDestinationCity(e.target.value);
                      if (e.target.value === 'Chennai') {
                        setDispatchDestinationHub('Koyambedu Wholesale Agro Terminal');
                        setEstimatedKm(380);
                      } else if (e.target.value === 'Madurai') {
                        setDispatchDestinationHub('Mattuthavani Central Vegetable Market');
                        setEstimatedKm(120);
                      } else if (e.target.value === 'Bengaluru') {
                        setDispatchDestinationHub('Yeshwanthpur Wholesale APMC Yard');
                        setEstimatedKm(310);
                      } else if (e.target.value === 'Kochi') {
                        setDispatchDestinationHub('Ernakulam Maradu Wholesale Mandi');
                        setEstimatedKm(260);
                      } else {
                        setDispatchDestinationHub('Ukkadam Uzhavar Santhai Hub');
                        setEstimatedKm(85);
                      }
                    }}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Chennai">Chennai (Koyambedu Mandi)</option>
                    <option value="Bengaluru">Bengaluru (Yeshwanthpur APMC)</option>
                    <option value="Madurai">Madurai (Mattuthavani Market)</option>
                    <option value="Coimbatore">Coimbatore (Ukkadam Market)</option>
                    <option value="Kochi">Kochi / Ernakulam (Kerala)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Buyer Organization *</label>
                  <input
                    type="text"
                    required
                    value={dispatchBuyerName}
                    onChange={e => setDispatchBuyerName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Vehicle Type Selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Select Transport Vehicle</label>
                <select
                  value={dispatchVehicleType}
                  onChange={e => {
                    setDispatchVehicleType(e.target.value);
                    if (e.target.value.includes('Reefer')) setDispatchIsColdChain(true);
                  }}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Eicher 14ft Pro Farm Hauler">Eicher 14ft Pro Farm Hauler (4 to 6 Tons)</option>
                  <option value="Cold Chain Reefer Van (12°C Controlled)">Cold Chain Reefer Van (12°C Perishables)</option>
                  <option value="Tata Ace Gold Mini Pickup">Tata Ace Gold Mini Pickup (1.5 Tons)</option>
                  <option value="Uzhavar Santhai Direct Electric Pickup">Uzhavar Santhai Direct Electric Van</option>
                </select>
              </div>

              {/* Cold Chain Toggle */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <input
                  type="checkbox"
                  id="coldChainCheck"
                  checked={dispatchIsColdChain}
                  onChange={e => setDispatchIsColdChain(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="coldChainCheck" className="text-xs font-semibold text-blue-900 cursor-pointer">
                  Enable Cold Chain Temperature Monitoring (Mandatory for Carrots, Greens & Tomatoes)
                </label>
              </div>

              {/* Cost Summary Box */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Estimated Distance:</span>
                  <span className="font-mono font-bold">{estimatedKm} km</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Estimated Freight:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    ₹{calculateEstimatedFreight(estimatedKm, dispatchVehicleType, dispatchIsColdChain).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Mandi Cess Deduction:</span>
                  <span>₹0.00 (Exempted)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewDispatchOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Generate Waybill & Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
