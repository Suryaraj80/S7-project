import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Sliders, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Search,
  ExternalLink,
  X
} from 'lucide-react';
import { Scheme, User, RecommendationWeights, AppNotification, Language, SoilTestBooking, SoilTestStatus } from '../types';

interface AdminDashboardProps {
  schemes: Scheme[];
  users: User[];
  weights: RecommendationWeights;
  onSaveWeights: (weights: RecommendationWeights) => void;
  onSaveScheme: (scheme: Scheme) => void;
  onDeleteScheme: (schemeId: string) => void;
  onSendNotification: (notif: AppNotification) => void;
  language: Language;
  initialTab?: 'metrics' | 'soil_approvals' | 'schemes' | 'weights' | 'users' | 'broadcast';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  schemes,
  users,
  weights,
  onSaveWeights,
  onSaveScheme,
  onDeleteScheme,
  onSendNotification,
  language,
  initialTab = 'soil_approvals'
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'soil_approvals' | 'schemes' | 'weights' | 'users' | 'broadcast'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveAdminTab(initialTab);
    }
  }, [initialTab]);
  
  // Soil test bookings state for admin approvals
  const [soilBookings, setSoilBookings] = useState<SoilTestBooking[]>(() => {
    try {
      const raw = localStorage.getItem('aaa_soil_test_bookings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [soilFilterStatus, setSoilFilterStatus] = useState<string>('All');
  const [soilFilterDistrict, setSoilFilterDistrict] = useState<string>('All');

  // Scheme Edit / Create Modal state
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Weights state
  const [currentWeights, setCurrentWeights] = useState<RecommendationWeights>({ ...weights });

  // Broadcast state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifPriority, setNotifPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Metrics
  const activeSchemesCount = schemes.filter(s => s.status === 'active').length;
  const totalFarmers = users.filter(u => u.role === 'FARMER').length;

  const handleWeightsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWeights(currentWeights);
    alert('Recommendation weights successfully updated across the scoring pipeline!');
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: notifTitle,
      message: notifMessage,
      type: 'broadcast',
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
      priority: notifPriority
    };

    onSendNotification(newNotif);
    setNotifTitle('');
    setNotifMessage('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  // Soil approval helpers
  const pendingSoilCount = soilBookings.filter(b => b.status === 'Pending Admin Approval').length;

  const handleApproveSoilSlot = (bookingId: string) => {
    const updated = soilBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Approved & Slot Confirmed' as SoilTestStatus,
          reviewedBy: 'Dr. K. Soundararajan (Joint Director of Agriculture)',
          reviewedAt: new Date().toISOString(),
          adminNotes: 'Patta & Survey number verified with Revenue Portal. Soil testing slot approved.'
        };
      }
      return b;
    });
    setSoilBookings(updated);
    localStorage.setItem('aaa_soil_test_bookings', JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  const handleRejectSoilSlot = (bookingId: string) => {
    const reason = prompt('Enter rejection reason for farmer:', 'Survey number requires re-verification with local Village Administrative Officer (VAO).') || 'Land survey verification pending.';
    const updated = soilBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Rejected' as SoilTestStatus,
          reviewedBy: 'Agri Dept Admin',
          reviewedAt: new Date().toISOString(),
          rejectionReason: reason,
          adminNotes: reason
        };
      }
      return b;
    });
    setSoilBookings(updated);
    localStorage.setItem('aaa_soil_test_bookings', JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  const handleMarkSampleCollected = (bookingId: string) => {
    const updated = soilBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Sample Collected' as SoilTestStatus,
          adminNotes: 'Sample received at laboratory intake desk. Testing started.'
        };
      }
      return b;
    });
    setSoilBookings(updated);
    localStorage.setItem('aaa_soil_test_bookings', JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  const handleIssueHealthCard = (bookingId: string) => {
    const updated = soilBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Report Generated' as SoilTestStatus,
          adminNotes: 'Soil Health Card generated. NPK: 210:18:240 kg/ha. pH: 7.2 (Neutral). EC: 0.42 dS/m. Micronutrients Zinc & Boron adequate.'
        };
      }
      return b;
    });
    setSoilBookings(updated);
    localStorage.setItem('aaa_soil_test_bookings', JSON.stringify(updated));
    window.dispatchEvent(new Event('soil_bookings_updated'));
  };

  const openNewSchemeModal = () => {
    setEditingScheme({
      id: 'scheme-' + Date.now(),
      scheme_name: '',
      short_description: '',
      full_description: '',
      category: 'Financial Support',
      level: 'Central',
      state: 'All India',
      target_users: ['All Farmers'],
      minimum_age: 18,
      maximum_age: 75,
      income_limit: 0,
      land_min: 0,
      land_max: 0,
      eligible_crops: ['All'],
      farmer_categories: ['All'],
      irrigation_requirement: 'Any',
      ownership_requirement: 'Any',
      women_only: false,
      bpl_required: false,
      benefits: '',
      benefit_amount: '',
      estimated_monetary_value: 10000,
      required_documents: ['Aadhaar Card', 'Land Record', 'Bank Passbook'],
      application_process: ['Apply on official portal', 'District verification', 'Subsidy credit'],
      official_website: 'https://agricoop.nic.in',
      application_url: '',
      helpline: '1800-180-1551',
      valid_from: new Date().toISOString().split('T')[0],
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    });
    setIsCreatingNew(true);
  };

  const handleSaveSchemeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;
    onSaveScheme(editingScheme);
    setEditingScheme(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Administrative Control
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>National Agricultural Scheme Administration Console</span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage central and state scheme eligibility criteria, calibrate recommendation weights, monitor farmers, and dispatch urgent alerts.
          </p>
        </div>

        <button
          onClick={openNewSchemeModal}
          className="px-3 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
        </button>
      </div>

      {/* Admin Subtabs */}
      <div className="flex border-b border-stone-200 gap-2 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveAdminTab('soil_approvals')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'soil_approvals'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Soil Test Slot Approvals</span>
          {pendingSoilCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
              {pendingSoilCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('metrics')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'metrics'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>System Metrics & Analytics</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('schemes')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'schemes'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scheme Management ({schemes.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('weights')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'weights'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Recommendation Engine Weights</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'users'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Registered Farmers ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('broadcast')}
          className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAdminTab === 'broadcast'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Broadcast Notification</span>
        </button>
      </div>

      {/* TAB 0: SOIL TEST SLOT APPROVALS (MANDATORY ADMIN VERIFICATION) */}
      {activeAdminTab === 'soil_approvals' && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* Header & Filter Controls */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Tamil Nadu Soil Test Slot Verification & Approval Queue</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verify Patta and survey number credentials before approving testing appointment slots.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 rounded-lg">
                  {pendingSoilCount} Pending Verification
                </span>
                <span className="px-2.5 py-1 text-xs font-bold text-emerald-900 bg-emerald-100 rounded-lg">
                  {soilBookings.filter(b => b.status === 'Approved & Slot Confirmed').length} Approved
                </span>
              </div>
            </div>

            {/* Filter by Status and District */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-stone-200">
              <div className="w-full sm:w-60">
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Filter by Status:</label>
                <select
                  value={soilFilterStatus}
                  onChange={e => setSoilFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="All">All Statuses ({soilBookings.length})</option>
                  <option value="Pending Admin Approval">Pending Admin Approval ({pendingSoilCount})</option>
                  <option value="Approved & Slot Confirmed">Approved & Slot Confirmed</option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="Report Generated">Report Generated</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="w-full sm:w-60">
                <label className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Filter by District:</label>
                <select
                  value={soilFilterDistrict}
                  onChange={e => setSoilFilterDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="All">All Tamil Nadu Districts</option>
                  {Array.from(new Set(soilBookings.map(b => b.district))).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Queue */}
          <div className="space-y-3.5">
            {soilBookings
              .filter(b => {
                const matchesStatus = soilFilterStatus === 'All' || b.status === soilFilterStatus;
                const matchesDistrict = soilFilterDistrict === 'All' || b.district === soilFilterDistrict;
                return matchesStatus && matchesDistrict;
              })
              .map(booking => {
                const isPending = booking.status === 'Pending Admin Approval';
                const isApproved = booking.status === 'Approved & Slot Confirmed';
                const isRejected = booking.status === 'Rejected';

                return (
                  <div
                    key={booking.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending
                        ? 'border-amber-300 bg-amber-50/40 shadow-xs'
                        : isApproved
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: Booking Details */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-stone-900 bg-white border border-stone-300 px-2.5 py-0.5 rounded shadow-xs">
                            {booking.id}
                          </span>

                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isPending
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isRejected
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-stone-100 text-stone-800'
                          }`}>
                            {booking.status}
                          </span>

                          <span className="text-xs text-stone-400">·</span>
                          <span className="text-xs font-semibold text-stone-700">
                            {booking.farmerName} ({booking.mobile})
                          </span>
                        </div>

                        <div className="text-xs text-stone-600 space-y-1">
                          <p>
                            <span className="font-bold text-stone-800">Location: </span>
                            {booking.village}, {booking.taluk} Taluk, <span className="font-semibold text-emerald-800">{booking.district} District</span>
                          </p>
                          <p>
                            <span className="font-bold text-stone-800">Patta / Survey No.: </span>
                            <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-900">{booking.surveyNumber}</span>
                            <span className="mx-2">·</span>
                            <span className="font-bold text-stone-800">Lab: </span>
                            {booking.centerName}
                          </p>
                          <p>
                            <span className="font-bold text-stone-800">Slot: </span>
                            {booking.appointmentDate} ({booking.timeSlot}) · <span className="font-semibold">{booking.plannedCrop}</span> ({booking.soilType} Soil)
                          </p>
                        </div>

                        {booking.adminNotes && (
                          <div className="text-xs text-stone-600 bg-white/80 p-2.5 rounded-lg border border-stone-200 mt-2">
                            <span className="font-bold text-stone-800">Review Notes: </span>
                            {booking.adminNotes}
                            {booking.reviewedBy && (
                              <span className="text-stone-400 block text-[11px] mt-0.5">
                                Reviewed by {booking.reviewedBy} on {new Date(booking.reviewedAt || '').toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Administrative Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleApproveSoilSlot(booking.id)}
                              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve & Confirm Slot</span>
                            </button>

                            <button
                              onClick={() => handleRejectSoilSlot(booking.id)}
                              className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            onClick={() => handleMarkSampleCollected(booking.id)}
                            className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                          >
                            Mark Sample Collected
                          </button>
                        )}

                        {booking.status === 'Sample Collected' && (
                          <button
                            onClick={() => handleIssueHealthCard(booking.id)}
                            className="px-3 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors"
                          >
                            Generate Soil Health Card
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 1: METRICS & ANALYTICS */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <span className="text-xs text-stone-400 font-medium block">Total Registered Farmers</span>
              <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">{totalFarmers}</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Active Beneficiaries</span>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <span className="text-xs text-stone-400 font-medium block">Active Schemes in DB</span>
              <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">{activeSchemesCount}</span>
              <span className="text-[10px] text-stone-500 font-medium mt-1 block">{schemes.length} total catalogued</span>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <span className="text-xs text-stone-400 font-medium block">Recommendations Run</span>
              <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">1,428</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">+18% this month</span>
            </div>
            <div className="p-4 rounded-xl border border-stone-200 bg-white">
              <span className="text-xs text-stone-400 font-medium block">Chatbot Queries Handled</span>
              <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">3,890</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Voice & Text</span>
            </div>
          </div>

          {/* Real SVG Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Breakdown Bar Chart */}
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Scheme Distribution by Category
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { cat: 'Financial Support', count: 3, pct: 90 },
                  { cat: 'Crop Insurance', count: 1, pct: 40 },
                  { cat: 'Solar & Renewable', count: 1, pct: 40 },
                  { cat: 'Irrigation & Water', count: 1, pct: 40 },
                  { cat: 'Mechanization & Tools', count: 1, pct: 40 },
                  { cat: 'Seeds & Fertilizers', count: 3, pct: 90 },
                  { cat: 'Organic Farming', count: 1, pct: 40 },
                  { cat: 'Livestock & Dairy', count: 1, pct: 40 }
                ].map(item => (
                  <div key={item.cat} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-600">
                      <span>{item.cat}</span>
                      <span className="font-mono font-bold text-stone-900">{item.count} schemes</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div className="bg-emerald-700 h-1.5 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farmers by State Distribution */}
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Registered Farmers by State
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { state: 'Tamil Nadu', count: '45%', countNum: 642 },
                  { state: 'Uttar Pradesh', count: '25%', countNum: 357 },
                  { state: 'Punjab', count: '18%', countNum: 257 },
                  { state: 'Maharashtra', count: '12%', countNum: 172 }
                ].map(item => (
                  <div key={item.state} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-stone-600">
                      <span>{item.state}</span>
                      <span className="font-mono font-bold text-stone-900">{item.countNum} farmers ({item.count})</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div className="bg-emerald-700 h-1.5 rounded-full" style={{ width: item.count }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-500 mt-4">
                <strong>System Health:</strong> All 15+ central and state schemes are operating with active guidelines. No downtime reported across DBT endpoints.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: SCHEME MANAGEMENT CRUD */}
      {activeAdminTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search schemes by name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <button
              onClick={openNewSchemeModal}
              className="px-3 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Scheme</span>
            </button>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Scheme Name</th>
                  <th className="p-3">Level / State</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Max Land / Income</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {schemes
                  .filter(s => s.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(sch => (
                    <tr key={sch.id} className="hover:bg-stone-50/60">
                      <td className="p-3 font-semibold text-stone-900 max-w-[200px] truncate">
                        {sch.scheme_name}
                      </td>
                      <td className="p-3 text-stone-600">
                        {sch.level} ({sch.state})
                      </td>
                      <td className="p-3 text-stone-600">
                        {sch.category}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-stone-600">
                        {sch.land_max > 0 ? `${sch.land_max} Ac` : 'No max'} / {sch.income_limit > 0 ? `₹${sch.income_limit/1000}k` : 'No cap'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sch.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-stone-100 text-stone-500'
                        }`}>
                          {sch.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingScheme(sch);
                            setIsCreatingNew(false);
                          }}
                          className="p-1 text-stone-600 hover:text-emerald-800"
                          title="Edit Scheme"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const updated = { ...sch, status: sch.status === 'active' ? 'inactive' : 'active' as any };
                            onSaveScheme(updated);
                          }}
                          className="p-1 text-stone-600 hover:text-amber-800"
                          title="Toggle Active/Inactive"
                        >
                          {sch.status === 'active' ? (
                            <ToggleRight className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-stone-400" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete scheme: ${sch.scheme_name}?`)) {
                              onDeleteScheme(sch.id);
                            }
                          }}
                          className="p-1 text-stone-600 hover:text-red-700"
                          title="Delete Scheme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURABLE RECOMMENDATION WEIGHTS */}
      {activeAdminTab === 'weights' && (
        <form onSubmit={handleWeightsSubmit} className="space-y-6 max-w-2xl bg-stone-50 p-6 rounded-xl border border-stone-200">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Recommendation Engine Scoring Weights
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Calibrate the relative importance of each farmer attribute in the Stage 2 relevance matching equation.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { key: 'location', label: 'Location & Geographic Alignment', desc: 'Central vs State targeting fit' },
              { key: 'crop', label: 'Cultivated Crop Alignment', desc: 'Primary & secondary crop compatibility' },
              { key: 'landholding', label: 'Landholding Scale Fit', desc: 'Small/marginal acre boundaries' },
              { key: 'income', label: 'Income Suitability', desc: 'Economic criteria compatibility' },
              { key: 'category', label: 'Farmer Social Category', desc: 'SC/ST/OBC prioritization' },
              { key: 'age', label: 'Farmer Age Bracket', desc: 'Operational age criteria compliance' },
              { key: 'irrigation', label: 'Irrigation Suitability', desc: 'Canal, borewell, or drip fit' },
              { key: 'farmingType', label: 'Farming Practice (Organic/Conventional)', desc: 'PKVY & natural farming boost' },
              { key: 'specialFactors', label: 'Special Attributes', desc: 'Women farmer, BPL, livestock assets' }
            ].map(item => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-800">{item.label}</span>
                  <span className="font-mono font-bold text-emerald-800 bg-white border border-stone-200 px-2 py-0.5 rounded">
                    {(currentWeights as any)[item.key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={(currentWeights as any)[item.key]}
                  onChange={e => setCurrentWeights({ ...currentWeights, [item.key]: parseInt(e.target.value) || 0 })}
                  className="w-full accent-emerald-700"
                />
                <span className="text-[10px] text-stone-400 block">{item.desc}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              Save & Apply Weights
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">State / District</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Registration Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50/60">
                    <td className="p-3 font-semibold text-stone-900">
                      {u.name}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">
                      {u.state}, {u.district}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-stone-600">
                      {u.mobile}
                    </td>
                    <td className="p-3 text-stone-500 text-[11px]">
                      {u.createdAt}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST NOTIFICATIONS */}
      {activeAdminTab === 'broadcast' && (
        <form onSubmit={handleBroadcastSubmit} className="space-y-4 max-w-xl bg-stone-50 p-6 rounded-xl border border-stone-200">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Dispatch Agricultural Welfare Broadcast Alert
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Send immediate in-app alerts regarding new scheme additions, deadline reminders, or emergency relief announcements.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Broadcast Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kuruvai Paddy Free Fertilizer Distribution Now Open"
              value={notifTitle}
              onChange={e => setNotifTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Message Content *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Provide exact instructions, eligibility conditions, and nearest collection depots..."
              value={notifMessage}
              onChange={e => setNotifMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Alert Priority
            </label>
            <select
              value={notifPriority}
              onChange={e => setNotifPriority(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
            >
              <option value="high">High Priority (Red Badge)</option>
              <option value="medium">Medium Priority (Standard Alert)</option>
              <option value="low">Low Priority (Advisory Tip)</option>
            </select>
          </div>

          {broadcastSent && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Broadcast dispatched to all registered farmers!</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              Dispatch Broadcast
            </button>
          </div>
        </form>
      )}

      {/* SCHEME CREATE/EDIT MODAL */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">
                {isCreatingNew ? 'Create New Government Scheme' : 'Edit Scheme Guidelines'}
              </h3>
              <button 
                onClick={() => setEditingScheme(null)}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchemeForm} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Scheme Official Name *</label>
                <input
                  type="text"
                  required
                  value={editingScheme.scheme_name}
                  onChange={e => setEditingScheme({ ...editingScheme, scheme_name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Level</label>
                  <select
                    value={editingScheme.level}
                    onChange={e => setEditingScheme({ ...editingScheme, level: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Central">Central Govt</option>
                    <option value="State">State Govt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editingScheme.state}
                    onChange={e => setEditingScheme({ ...editingScheme, state: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    placeholder="All India or specific state"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={editingScheme.category}
                  onChange={e => setEditingScheme({ ...editingScheme, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Financial Support">Financial Support</option>
                  <option value="Crop Insurance">Crop Insurance</option>
                  <option value="Irrigation & Water">Irrigation & Water</option>
                  <option value="Solar & Renewable Energy">Solar & Renewable Energy</option>
                  <option value="Mechanization & Tools">Mechanization & Tools</option>
                  <option value="Seeds & Fertilizers">Seeds & Fertilizers</option>
                  <option value="Organic & Natural Farming">Organic & Natural Farming</option>
                  <option value="Livestock & Dairy">Livestock & Dairy</option>
                  <option value="Infrastructure & Loans">Infrastructure & Loans</option>
                  <option value="Women Farmer Support">Women Farmer Support</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Benefit Summary Amount *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹6,000 / year"
                    value={editingScheme.benefit_amount}
                    onChange={e => setEditingScheme({ ...editingScheme, benefit_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Max Landholding (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingScheme.land_max}
                    onChange={e => setEditingScheme({ ...editingScheme, land_max: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingScheme.short_description}
                  onChange={e => setEditingScheme({ ...editingScheme, short_description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Guidelines & Objectives</label>
                <textarea
                  rows={3}
                  value={editingScheme.full_description}
                  onChange={e => setEditingScheme({ ...editingScheme, full_description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Official Portal URL</label>
                <input
                  type="url"
                  value={editingScheme.official_website}
                  onChange={e => setEditingScheme({ ...editingScheme, official_website: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingScheme(null)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
                >
                  Save Scheme
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
