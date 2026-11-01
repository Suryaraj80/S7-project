import React, { useState } from 'react';
import { 
  FlaskConical, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Download, 
  X, 
  Info,
  Phone,
  Printer
} from 'lucide-react';
import { TN_SOIL_TEST_LABS } from '../data/tamilNaduData';
import { SoilTestBooking, FarmerProfile, Language, SoilType } from '../types';
import { printSoilSlipSafely, downloadSoilSlipHtml } from '../utils/printAndDownloadService';

interface SoilTestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  language: Language;
}

export const SoilTestBookingModal: React.FC<SoilTestBookingModalProps> = ({
  isOpen,
  onClose,
  profile,
  language
}) => {
  const [selectedLabId, setSelectedLabId] = useState(TN_SOIL_TEST_LABS[0].id);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'Morning (9:00 AM - 12:00 PM)' | 'Afternoon (2:00 PM - 5:00 PM)'>('Morning (9:00 AM - 12:00 PM)');
  const [surveyNumber, setSurveyNumber] = useState('142/3B');
  const [plannedCrop, setPlannedCrop] = useState(profile.cropType || 'Paddy');
  const [soilType, setSoilType] = useState<SoilType>(profile.soilType || 'Alluvial');
  const [confirmedBooking, setConfirmedBooking] = useState<SoilTestBooking | null>(null);

  if (!isOpen) return null;

  const selectedLab = TN_SOIL_TEST_LABS.find(l => l.id === selectedLabId) || TN_SOIL_TEST_LABS[0];

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
      status: 'Pending Admin Approval',
      createdAt: new Date().toISOString()
    };
    setConfirmedBooking(token);
  };

  const handlePrintSlip = () => {
    if (!confirmedBooking) return;
    printSoilSlipSafely(confirmedBooking);
  };

  const handleDownloadSlip = () => {
    if (!confirmedBooking) return;
    downloadSoilSlipHtml(confirmedBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Tamil Nadu Soil Health Mission
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <FlaskConical className="w-5 h-5 text-emerald-700" />
                <span>{language === 'ta' ? 'மண் பரிசோதனை முன்பதிவு' : 'Soil Test Slot Booking'}</span>
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Book appointment slots at TNAU research stations or mobile testing vans for scientific 12-nutrient lab report.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!confirmedBooking ? (
          <form onSubmit={handleBookSlot} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
            
            {/* Lab selection */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Select Nearest TNAU / District Soil Testing Laboratory *
              </label>
              <select
                value={selectedLabId}
                onChange={e => setSelectedLabId(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium text-xs"
              >
                {TN_SOIL_TEST_LABS.map(lab => (
                  <option key={lab.id} value={lab.id}>
                    {language === 'ta' ? lab.name_ta : lab.name} ({lab.district})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                <span>📍 {selectedLab.address}</span>
                <span>· 📞 {selectedLab.phone}</span>
              </div>
            </div>

            {/* Date and Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Preferred Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Time Window Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Land & Crop parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Survey / Patta Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 142/3B"
                  value={surveyNumber}
                  onChange={e => setSurveyNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Current Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={e => setSoilType(e.target.value as SoilType)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Alluvial">Alluvial (வண்டல் மண்)</option>
                  <option value="Clayey">Clayey (களிமண்)</option>
                  <option value="Red">Red Soil (செம்மண்)</option>
                  <option value="Black">Black Soil (கரிசல் மண்)</option>
                  <option value="Sandy Loam">Sandy Loam (மணல் கலந்த வண்டல்)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Target Crop Planned
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kuruvai Paddy, Banana"
                  value={plannedCrop}
                  onChange={e => setPlannedCrop(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            {/* Instruction Callout */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-stone-700 space-y-1">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>How to prepare your 500g soil sample:</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Collect from 8-10 points in a 'V' shape cut (depth 15cm). Mix thoroughly, shade dry, and bring 500 grams packed in a clean polythene cover along with your printed token. Testing fee is <strong>100% Free</strong> under Government Soil Health Card Scheme.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                Confirm Soil Test Slot
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>Soil Test Slot Confirmed: #{confirmedBooking.id}</span>
              </div>
              <p className="text-stone-700 leading-relaxed text-xs">
                Your appointment has been registered with <strong>{confirmedBooking.centerName}</strong>. A confirmation SMS has been queued to <strong>{confirmedBooking.mobile}</strong>.
              </p>
            </div>

            {/* Token details grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">Farmer Name</span>
                <span className="font-bold text-stone-900">{confirmedBooking.farmerName}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">Appointment Date</span>
                <span className="font-bold text-stone-900 font-mono">{confirmedBooking.appointmentDate}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">Time Window</span>
                <span className="font-bold text-stone-900">{confirmedBooking.timeSlot}</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">Planned Crop / Soil</span>
                <span className="font-bold text-stone-900">{confirmedBooking.plannedCrop} ({confirmedBooking.soilType})</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setConfirmedBooking(null)}
                className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
              >
                Book Another Slot
              </button>
              <button
                onClick={handleDownloadSlip}
                className="px-4 py-2 font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4 text-stone-600" />
                <span>Download Token (.html)</span>
              </button>
              <button
                onClick={handlePrintSlip}
                className="px-4 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Appointment Token</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
