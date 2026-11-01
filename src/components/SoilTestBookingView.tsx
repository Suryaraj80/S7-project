import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Download, 
  Info,
  Phone,
  Printer,
  Sparkles,
  Share2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  XCircle,
  Hourglass,
  UserCheck
} from 'lucide-react';
import { TN_SOIL_TEST_LABS, TN_38_DISTRICTS } from '../data/tamilNaduData';
import { SoilTestBooking, SoilTestStatus, FarmerProfile, Language, SoilType, User } from '../types';
import { printSoilSlipSafely, downloadSoilSlipHtml } from '../utils/printAndDownloadService';

interface SoilTestBookingViewProps {
  profile: FarmerProfile;
  language: Language;
  currentUser?: User;
  onNavigateToAdmin?: () => void;
}

const STORAGE_KEY = 'aaa_soil_test_bookings';

export const SoilTestBookingView: React.FC<SoilTestBookingViewProps> = ({
  profile,
  language,
  currentUser,
  onNavigateToAdmin
}) => {
  const [selectedLabId, setSelectedLabId] = useState(TN_SOIL_TEST_LABS[0].id);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'Morning (9:00 AM - 12:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)'>('Morning (9:00 AM - 12:00 PM)');
  const [surveyNumber, setSurveyNumber] = useState('142/3B');
  const [plannedCrop, setPlannedCrop] = useState(profile.cropType || 'Kuruvai Paddy');
  const [soilType, setSoilType] = useState<SoilType>(profile.soilType || 'Alluvial');
  const [bookingHistory, setBookingHistory] = useState<SoilTestBooking[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<SoilTestBooking | null>(null);

  // Load bookings from localStorage
  const loadBookings = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBookingHistory(JSON.parse(saved));
      } else {
        // Initial seed booking for demonstration: One approved and one pending
        const seedBookings: SoilTestBooking[] = [
          {
            id: 'AAA-SOIL-910245',
            farmerName: profile.fullName,
            mobile: profile.mobile,
            district: profile.district,
            taluk: profile.taluk,
            village: profile.village,
            surveyNumber: '89/2A',
            centerName: 'Soil & Water Management Research Institute (TNAU - SWMRI), Kattuthottam',
            appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            timeSlot: 'Morning (9:00 AM - 12:00 PM)',
            soilType: 'Alluvial',
            plannedCrop: 'Paddy CO 51',
            status: 'Pending Admin Approval',
            adminNotes: 'Application under verification by District Assistant Director of Agriculture.',
            createdAt: new Date().toISOString()
          },
          {
            id: 'AAA-SOIL-849201',
            farmerName: profile.fullName,
            mobile: profile.mobile,
            district: profile.district,
            taluk: profile.taluk,
            village: profile.village,
            surveyNumber: '104/1C',
            centerName: 'Agricultural College & Research Institute (TNAU), Madurai',
            appointmentDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
            timeSlot: 'Morning (9:00 AM - 12:00 PM)',
            soilType: 'Red',
            plannedCrop: 'Shallots',
            status: 'Approved & Slot Confirmed',
            adminNotes: 'Land records verified with e-Patta. Slot confirmed.',
            reviewedBy: 'Dr. V. Rajeshwari (Joint Director of Agriculture)',
            reviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
          }
        ];
        setBookingHistory(seedBookings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadBookings();

    // Listen for storage events (e.g. when approved in AdminDashboard in another tab or action)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadBookings();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [profile]);

  const selectedLab = TN_SOIL_TEST_LABS.find(l => l.id === selectedLabId) || TN_SOIL_TEST_LABS[0];

  // Farmer books a slot: Initial status is always 'Pending Admin Approval'
  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const token: SoilTestBooking = {
      id: 'AAA-SOIL-' + Math.floor(100000 + Math.random() * 900000),
      farmerName: profile.fullName,
      mobile: profile.mobile,
      district: profile.district,
      taluk: profile.taluk,
      village: profile.village,
      surveyNumber: surveyNumber || 'N/A',
      centerName: selectedLab.name,
      appointmentDate,
      timeSlot,
      soilType,
      plannedCrop,
      status: 'Pending Admin Approval', // MANDATORY: Admin must approve before processing
      adminNotes: 'Submitted for verification by District Agriculture Officer.',
      createdAt: new Date().toISOString()
    };

    const updated = [token, ...bookingHistory];
    setBookingHistory(updated);
    setConfirmedBooking(token);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('soil_bookings_updated'));
    } catch {
      // ignore
    }
  };

  // Admin approval helper (can be triggered directly if user is Admin or quick-testing)
  const handleAdminApproveBooking = (bookingId: string) => {
    const updated = bookingHistory.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Approved & Slot Confirmed' as SoilTestStatus,
          reviewedBy: currentUser?.name || 'Dr. K. Soundararajan (Joint Director of Agriculture)',
          reviewedAt: new Date().toISOString(),
          adminNotes: 'Survey and Patta records verified. Sample collection token approved.'
        };
      }
      return b;
    });

    setBookingHistory(updated);
    if (confirmedBooking && confirmedBooking.id === bookingId) {
      setConfirmedBooking(updated.find(b => b.id === bookingId) || null);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  const handleAdminRejectBooking = (bookingId: string) => {
    const updated = bookingHistory.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Rejected' as SoilTestStatus,
          reviewedBy: currentUser?.name || 'Agri Officer',
          reviewedAt: new Date().toISOString(),
          rejectionReason: 'Survey number records need re-verification with local VAO.'
        };
      }
      return b;
    });

    setBookingHistory(updated);
    if (confirmedBooking && confirmedBooking.id === bookingId) {
      setConfirmedBooking(updated.find(b => b.id === bookingId) || null);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  const handlePrintSlip = (token: SoilTestBooking) => {
    printSoilSlipSafely(token);
  };

  const handleDownloadSlip = (token: SoilTestBooking) => {
    downloadSoilSlipHtml(token);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-stone-950 rounded-md">
                TNAU Verified Laboratories
              </span>
              <span className="text-xs text-emerald-200">
                · Mandatory District Officer Approval Workflow
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ta' 
                ? 'மண் பரிசோதனை முன்பதிவு & அதிகாரி ஒப்புதல் முறை' 
                : 'Soil Test Slot Booking & Admin Approval Desk'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {language === 'ta'
                ? 'விவசாயிகள் மண் ஆய்வுக்கூடத்திற்கு மாதிரி அனுப்ப முன்பதிவு செய்யலாம். வேளாண்மைத்துறை அலுவலர் ஒப்புதல் அளித்த பின் பரிசோதனை தொடங்கப்பட்டு மண்வள அட்டை வழங்கப்படும்.'
                : 'Book free government soil health card slots at TNAU labs. Applications are reviewed and approved by District Agriculture Officers before sample processing.'}
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-emerald-950/80 border border-emerald-700/50 p-4 rounded-2xl backdrop-blur-md shrink-0 sm:w-64 space-y-2">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              Govt Soil Health Card
            </span>
            <div className="text-2xl font-black text-white">₹0 FREE</div>
            <p className="text-[11px] text-emerald-200">
              100% Free under National Soil Health Mission for Tamil Nadu farmers.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Notice regarding Admin Approval Requirement */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 space-y-1">
          <p className="font-bold">
            {language === 'ta' 
              ? 'முக்கிய அறிவிப்பு: நிர்வாக அதிகாரி ஒப்புதல் கட்டாயம்' 
              : 'Mandatory Administrative Verification Process'}
          </p>
          <p className="text-amber-800 text-xs leading-relaxed">
            {language === 'ta'
              ? 'விவசாயி மண் பரிசோதனைக்கு பதிவு செய்ததும், விண்ணப்பம் மாவட்ட வேளாண்மை விரிவாக்க அலுவலர் சரிபார்ப்பிற்கு செல்லும். பட்டா/சர்வே எண் சரிபார்க்கப்பட்டு "அதிகாரி ஒப்புதல்" வழங்கிய பின்னரே மாதிரி சேகரிப்பு & ஆய்வகம் நடைமுறைக்கு வரும்.'
              : 'When you submit a booking, it enters the "Pending Admin Approval" queue. The District Agri Officer verifies survey credentials before approving the testing slot. You can track status in real-time below.'}
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Form on Left, Lab Directory & Workflow on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Booking Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <span>Step 1: Book New Soil Test Appointment</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Fill your land survey details to request official sample testing.
            </p>
          </div>

          <form onSubmit={handleBookSlot} className="space-y-4">
            
            {/* Lab selector */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Select Nearest TNAU / District Soil Testing Laboratory:
              </label>
              <select
                value={selectedLabId}
                onChange={e => setSelectedLabId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
              >
                {TN_SOIL_TEST_LABS.map(lab => (
                  <option key={lab.id} value={lab.id}>
                    {lab.district}: {lab.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Farmer details prefill */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Farmer Name:</label>
                <input
                  type="text"
                  readOnly
                  value={profile.fullName}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-700 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Registered Mobile:</label>
                <input
                  type="text"
                  readOnly
                  value={profile.mobile}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-700 font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Land survey number & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">District:</label>
                <input
                  type="text"
                  readOnly
                  value={profile.district}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-700 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Taluk / Block:</label>
                <input
                  type="text"
                  readOnly
                  value={profile.taluk}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-50 text-stone-700 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Patta / Survey No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 142/3B"
                  value={surveyNumber}
                  onChange={e => setSurveyNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-semibold"
                />
              </div>
            </div>

            {/* Date & Time slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Preferred Appointment Date:</label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Time Window:</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Crop & Soil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Current / Planned Crop:</label>
                <input
                  type="text"
                  value={plannedCrop}
                  onChange={e => setPlannedCrop(e.target.value)}
                  placeholder="e.g. Kuruvai Paddy CO 51"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Visual Soil Texture:</label>
                <select
                  value={soilType}
                  onChange={e => setSoilType(e.target.value as SoilType)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
                >
                  <option value="Alluvial">Alluvial (வண்டல் மண்)</option>
                  <option value="Black">Black Cotton (கரிசல் மண்)</option>
                  <option value="Red">Red Soil (செம்மண்)</option>
                  <option value="Laterite">Laterite (செம்புறை மண்)</option>
                  <option value="Sandy Loam">Sandy Loam (மணல் பாங்கான மண்)</option>
                  <option value="Clayey">Clayey (களிமண்)</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Submit Booking for Admin Approval</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2">
                Upon submission, District Agriculture Officers will review your Survey Patta and issue the confirmed token.
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: 4-Step Approval Lifecycle & Lab Guide */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 4-Step Process Guide */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">
              Soil Testing Official Approval Flow
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs">
                  <p className="font-bold text-stone-900">Farmer Submits Application</p>
                  <p className="text-stone-500">Provides survey number, location, and crop preferences.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs">
                  <p className="font-bold text-stone-900">District Admin Approval (Required)</p>
                  <p className="text-stone-500">Agri Officer verifies Patta details and confirms lab testing slot.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs">
                  <p className="font-bold text-stone-900">Sample Collection & Intake</p>
                  <p className="text-stone-500">Soil sample is submitted to the lab or collected by Mobile Soil Van.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div className="text-xs">
                  <p className="font-bold text-stone-900">TNAU Soil Health Card Issued</p>
                  <p className="text-stone-500">Macro & micronutrient status (N, P, K, pH, EC) uploaded with advice.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Lab Card */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Selected Testing Station
            </span>
            <h4 className="text-sm font-bold text-stone-900">{selectedLab.name}</h4>
            <p className="text-xs text-stone-600 font-medium">{selectedLab.name_ta}</p>
            
            <div className="text-xs text-stone-500 space-y-1.5 pt-2 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{selectedLab.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Helpline: {selectedLab.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Standard Turnaround: {selectedLab.turnaroundDays} working days</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Active & Past Soil Test Bookings with Live Status and Admin Approval Actions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              My Soil Testing Slots & Approval Trackers ({bookingHistory.length})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Live status of your submitted soil tests across Tamil Nadu agricultural offices.
            </p>
          </div>

          {currentUser?.role === 'ADMIN' && (
            <span className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 rounded-lg">
              🛡️ Admin Mode Active: You can approve slots below
            </span>
          )}
        </div>

        {bookingHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            No booking submissions found. Use the form above to book your soil testing slot.
          </div>
        ) : (
          <div className="space-y-4">
            {bookingHistory.map(b => {
              const isPending = b.status === 'Pending Admin Approval';
              const isApproved = b.status === 'Approved & Slot Confirmed';
              const isRejected = b.status === 'Rejected';

              return (
                <div 
                  key={b.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isPending 
                      ? 'border-amber-300 bg-amber-50/30' 
                      : isApproved
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-stone-200 bg-stone-50/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Token info */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-stone-900 bg-white border border-stone-300 px-2.5 py-0.5 rounded-md shadow-xs">
                          {b.id}
                        </span>
                        
                        {/* Status Badge */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                            <Hourglass className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                            <span>Pending Admin Approval</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Approved & Slot Confirmed</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5 text-rose-700" />
                            <span>Application Rejected</span>
                          </span>
                        )}

                        <span className="text-xs text-stone-400">·</span>
                        <span className="text-xs text-stone-500">
                          Booked on: {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900">{b.centerName}</h4>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-stone-600">
                        <div>
                          <span className="text-stone-400 block text-[10px]">APPOINTMENT</span>
                          <span className="font-semibold text-stone-800">{b.appointmentDate}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">SLOT</span>
                          <span className="font-semibold text-stone-800">{b.timeSlot}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">SURVEY NO.</span>
                          <span className="font-semibold text-stone-800">{b.surveyNumber}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px]">CROP & SOIL</span>
                          <span className="font-semibold text-stone-800">{b.plannedCrop} ({b.soilType})</span>
                        </div>
                      </div>

                      {/* Admin Note if any */}
                      {b.adminNotes && (
                        <div className="text-xs text-stone-700 bg-white/80 p-2.5 rounded-lg border border-stone-200/60">
                          <span className="font-bold text-stone-800">Agri Dept Notes: </span>
                          <span>{b.adminNotes}</span>
                          {b.reviewedBy && (
                            <span className="text-stone-500 block text-[11px] mt-0.5">
                              Approved by: {b.reviewedBy} on {new Date(b.reviewedAt || '').toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      
                      {/* Download button */}
                      <button
                        onClick={() => handleDownloadSlip(b)}
                        className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-300 rounded-lg hover:bg-stone-200 flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Download token slip HTML file"
                      >
                        <Download className="w-3.5 h-3.5 text-stone-600" />
                        <span>Download</span>
                      </button>

                      {/* Print button (enabled if approved or for records) */}
                      <button
                        onClick={() => handlePrintSlip(b)}
                        className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-stone-500" />
                        <span>Print Slip</span>
                      </button>

                      {/* Admin Approval Quick Action Button (allows testing or administrative approval) */}
                      {isPending && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdminApproveBooking(b.id)}
                            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                            title="Approve this application and issue confirmation token"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve (Admin)</span>
                          </button>
                          
                          <button
                            onClick={() => handleAdminRejectBooking(b.id)}
                            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* WhatsApp share */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `*ANNA AGRI AI - Soil Test Booking Status*\nToken: ${b.id}\nStatus: ${b.status}\nLab: ${b.centerName}\nDate: ${b.appointmentDate} (${b.timeSlot})\nFarmer: ${b.farmerName} (${b.district})`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Progress tracker visual */}
                  <div className="mt-4 pt-3 border-t border-stone-200/60">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                      <div className="text-emerald-800">
                        <div className="h-1 bg-emerald-600 rounded-full mb-1"></div>
                        1. Submitted
                      </div>
                      <div className={isApproved ? 'text-emerald-800' : isPending ? 'text-amber-700 animate-pulse' : 'text-stone-400'}>
                        <div className={`h-1 rounded-full mb-1 ${isApproved ? 'bg-emerald-600' : isPending ? 'bg-amber-500' : 'bg-stone-200'}`}></div>
                        2. Admin Review
                      </div>
                      <div className={isApproved ? 'text-stone-700' : 'text-stone-400'}>
                        <div className={`h-1 rounded-full mb-1 ${isApproved ? 'bg-stone-400' : 'bg-stone-200'}`}></div>
                        3. Sample Intake
                      </div>
                      <div className="text-stone-400">
                        <div className="h-1 bg-stone-200 rounded-full mb-1"></div>
                        4. Health Card
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
