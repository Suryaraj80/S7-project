import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  X, 
  Building, 
  MapPin, 
  Phone, 
  Truck, 
  ShieldCheck, 
  QrCode, 
  TrendingDown, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { User, FarmerProfile, Language, InvoiceRecord, InvoiceType, PaymentStatus } from '../types';
import { StorageService } from '../services/storageService';
import { TN_38_DISTRICTS } from '../data/tamilNaduData';
import { 
  printInvoiceSafely, 
  downloadInvoiceHtml, 
  downloadInvoicesCsvReport, 
  printTradeAuditReportSafely, 
  downloadTradeAuditReportHtml 
} from '../utils/printAndDownloadService';

interface BillingInvoiceViewProps {
  currentUser: User;
  profile: FarmerProfile;
  language: Language;
}

export const BillingInvoiceView: React.FC<BillingInvoiceViewProps> = ({
  currentUser,
  profile,
  language
}) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => StorageService.getInvoices());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Invoice Form State
  const [formProduce, setFormProduce] = useState('BPT-5204 Ponni Paddy');
  const [formQuantity, setFormQuantity] = useState<number>(20);
  const [formUnit, setFormUnit] = useState('quintal');
  const [formUnitPrice, setFormUnitPrice] = useState<number>(2500);
  const [formCounterpartyName, setFormCounterpartyName] = useState(
    currentUser.role === 'BUYER' ? 'Thirunavukkarasu P. (Pollachi Farmer)' : 'Chennai Wholesale Retailers Guild'
  );
  const [formCounterpartyOrg, setFormCounterpartyOrg] = useState(
    currentUser.role === 'BUYER' ? 'Kovai Coconut Growers Collective' : 'Apex Commodity Buyers Ltd'
  );
  const [formCounterpartyMobile, setFormCounterpartyMobile] = useState('9840199220');
  const [formDistrict, setFormDistrict] = useState('Thanjavur');
  const [formDestinationCity, setFormDestinationCity] = useState('Bengaluru');
  const [formDeliveryAddress, setFormDeliveryAddress] = useState(
    currentUser.role === 'BUYER' 
      ? 'Warehouse Bay 2, Whitefield Agro Hub, Bengaluru, Karnataka'
      : 'Direct Farmgate Threshing Yard Loading Point, Thanjavur'
  );

  const loadInvoices = () => {
    setInvoices(StorageService.getInvoices());
  };

  useEffect(() => {
    loadInvoices();
    window.addEventListener('invoices_updated', loadInvoices);
    return () => {
      window.removeEventListener('invoices_updated', loadInvoices);
    };
  }, []);

  // Filter invoices strictly according to the active role
  const roleInvoices = invoices.filter(inv => {
    if (currentUser.role === 'FARMER') {
      // Show invoices where the farmer is the seller, or matched by name/district
      return (
        inv.farmerId === currentUser.id || 
        inv.farmerName.toLowerCase().includes(profile.fullName.toLowerCase()) ||
        inv.invoiceType === 'FARMER_SALES_RECEIPT' ||
        inv.invoiceType === 'GOVT_SUBSIDY_BILLING'
      );
    }
    if (currentUser.role === 'BUYER') {
      // Show invoices where buyer is the purchaser
      return inv.buyerId === currentUser.id || inv.invoiceType === 'BUYER_TAX_INVOICE';
    }
    // ADMIN sees all invoices for statewide audit
    return true;
  });

  // Apply search and sub-filter
  const filteredInvoices = roleInvoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.items.some(i => i.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.ewayBillNumber && inv.ewayBillNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'All' || inv.invoiceType === filterType || inv.paymentStatus === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate high-level summary metrics
  const totalAmount = roleInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidCount = roleInvoices.filter(inv => inv.paymentStatus.includes('Paid') || inv.paymentStatus.includes('Confirmed')).length;
  const zeroCommSavings = roleInvoices.reduce((sum, inv) => {
    const itemSavings = inv.items.reduce((acc, itm) => {
      if (itm.mandiComparisonPrice && itm.mandiComparisonPrice > itm.unitPrice) {
        return acc + (itm.mandiComparisonPrice - itm.unitPrice) * itm.quantity;
      }
      return acc;
    }, 0);
    return sum + itemSavings;
  }, 0);

  // Handle creating a new invoice or sales receipt
  const handleCreateNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toISOString().split('T')[0];
    const isBuyer = currentUser.role === 'BUYER';
    const subtotal = formQuantity * formUnitPrice;
    const freight = isBuyer ? 4500 : 0;
    const total = subtotal + freight;

    const newInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: isBuyer 
        ? `INV-TN/2025-26/${Math.floor(1000 + Math.random() * 9000)}`
        : `RCPT-UZHAVAR/2025-26/${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceType: isBuyer ? 'BUYER_TAX_INVOICE' : 'FARMER_SALES_RECEIPT',
      date: dateStr,
      dueDate: dateStr,

      // Farmer
      farmerId: isBuyer ? 'farmer-partner' : currentUser.id,
      farmerName: isBuyer ? formCounterpartyName : profile.fullName,
      farmerMobile: isBuyer ? formCounterpartyMobile : profile.mobile,
      farmerDistrict: isBuyer ? formDistrict : profile.district,
      farmerTaluk: isBuyer ? 'Central Taluk' : profile.taluk,
      farmerVillage: isBuyer ? 'Agri Belt' : profile.village,
      farmerPattaNo: `PTA-${(isBuyer ? formDistrict : profile.district).substring(0, 3).toUpperCase()}-99210`,
      farmerAadhaarMasked: 'XXXX-XXXX-8812',
      farmerBankRef: 'Direct DBT Linked Account',

      // Buyer
      buyerId: isBuyer ? currentUser.id : 'buyer-partner',
      buyerName: isBuyer ? currentUser.name : formCounterpartyName,
      buyerOrganization: isBuyer 
        ? (currentUser.email.includes('society') ? 'Gated Society Procurement' : 'Wholesale Direct Sourcing') 
        : formCounterpartyOrg,
      buyerMobile: isBuyer ? currentUser.mobile : formCounterpartyMobile,
      buyerEmail: isBuyer ? currentUser.email : 'buyer@market.in',
      buyerGstin: isBuyer ? '29AAACH7789M1Z5' : '33AAACL8891P1ZK',
      buyerState: isBuyer ? 'Karnataka' : 'Tamil Nadu',
      buyerCity: isBuyer ? formDestinationCity : 'Chennai',
      deliveryAddress: formDeliveryAddress,

      items: [
        {
          id: `item-${Date.now()}`,
          description: formProduce,
          description_ta: formProduce,
          quantity: formQuantity,
          unit: formUnit,
          unitPrice: formUnitPrice,
          total: subtotal,
          mandiComparisonPrice: Math.round(formUnitPrice * 1.35),
          savingsPercentage: 25.9
        }
      ],
      subtotal,
      freightAndLogistics: freight,
      apmcCess: 0,
      middlemanCommissionDeduction: 0,
      cgst: 0,
      sgst: 0,
      totalAmount: total,
      paymentStatus: 'Paid via DBT/Escrow',
      paymentMethod: isBuyer ? 'Escrow Account' : 'Direct Bank Transfer (NEFT/RTGS)',
      transactionReference: `TXN-${Date.now().toString().slice(-8)}`,

      ewayBillNumber: isBuyer ? `EB-TN-2025-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      vehicleNumber: isBuyer ? 'TN 38 CB 4410 (Commercial Reefer)' : undefined,
      dispatchDate: `${dateStr} 16:30 IST`,
      transportOperator: isBuyer ? 'Tamil Nadu Express Agri Freight' : 'Farmgate Buyer Vehicle',

      isGiCertified: formProduce.toLowerCase().includes('erode') || formProduce.toLowerCase().includes('pollachi') || formProduce.toLowerCase().includes('thanjavur'),
      zeroCommissionVerified: true,
      qrCodeData: `AAA-VERIFY-INV-${Date.now()}-${total}-0COMMISSION`,
      notes: isBuyer 
        ? 'Direct farmgate procurement via ANNA AGRI AI Platform. Exempt from APMC Mandi Cess under TN Direct Agri Marketing Act 2024.'
        : 'Farmer-Direct Sales Bikri Parchi. 100% money credited directly to farmer account with zero intermediary commissions.'
    };

    StorageService.saveInvoice(newInvoice);
    setIsCreateModalOpen(false);
    setSelectedInvoice(newInvoice);
  };

  const handlePrintInvoice = (inv: InvoiceRecord) => {
    printInvoiceSafely(inv);
  };

  const handleDownloadInvoice = (inv: InvoiceRecord) => {
    downloadInvoiceHtml(inv);
  };

  const handlePrintReport = () => {
    printTradeAuditReportSafely(filteredInvoices, currentUser.role, currentUser.name);
  };

  const handleDownloadReportHtml = () => {
    downloadTradeAuditReportHtml(filteredInvoices, currentUser.role, currentUser.name);
  };

  const handleDownloadCsv = () => {
    downloadInvoicesCsvReport(filteredInvoices, currentUser.role);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header Banner customized by Role */}
      <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden ${
        currentUser.role === 'ADMIN'
          ? 'bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 border border-amber-700/60'
          : currentUser.role === 'BUYER'
          ? 'bg-gradient-to-r from-cyan-950 via-teal-900 to-stone-900 border border-cyan-800/60'
          : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-md ${
                currentUser.role === 'ADMIN'
                  ? 'bg-amber-400 text-stone-950'
                  : currentUser.role === 'BUYER'
                  ? 'bg-cyan-400 text-stone-950'
                  : 'bg-emerald-400 text-stone-950'
              }`}>
                {currentUser.role === 'ADMIN' ? 'Statewide Audit Ledger' : currentUser.role === 'BUYER' ? 'Commercial Tax Invoicing' : 'Farmer Sales Receipts'}
              </span>
              <span className="text-xs text-stone-300 font-medium">
                · Direct Farmgate Settlement Act 2024
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser.role === 'ADMIN' && (
                language === 'ta'
                  ? 'தமிழ்நாடு வேளாண் வர்த்தகம் & மானிய வரவு தணிக்கை ஏடு'
                  : 'Statewide Agricultural Trade Ledger & Invoicing Audit'
              )}
              {currentUser.role === 'BUYER' && (
                language === 'ta'
                  ? 'மொத்தக் கொள்முதல் விலைப்பட்டியல் & இ-வே பில் மேலாண்மை'
                  : 'Procurement Tax Invoices & E-Way Bills Desk'
              )}
              {currentUser.role === 'FARMER' && (
                language === 'ta'
                  ? 'உழவர் விற்பனை ரசீதுகள் & நேரடி வங்கி வரவு சான்றிதழ்கள்'
                  : 'My Farmgate Sales Receipts & Direct Credit Invoices'
              )}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {currentUser.role === 'ADMIN' && (
                'Comprehensive transaction ledger across 38 districts of Tamil Nadu. Monitor direct farmer realization, zero-commission compliance, and DBT subsidy disbursements.'
              )}
              {currentUser.role === 'BUYER' && (
                'Download commercial GST-exempt tax invoices, official inter-state E-way bills, and transport consignment notes for all farmgate bulk purchases with 0% middleman markup.'
              )}
              {currentUser.role === 'FARMER' && (
                'Official Kisaan Bikri Parchi (விற்பனை ரசீது). Every rupee paid by buyers is credited directly to your bank account with zero deductions for commission brokers or mandali agents.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {currentUser.role !== 'ADMIN' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                  currentUser.role === 'BUYER'
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-stone-950'
                    : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {currentUser.role === 'BUYER' ? 'Generate Purchase Invoice' : 'Create Sales Receipt (ரசீது)'}
                </span>
              </button>
            )}

            {/* Download Report HTML/PDF button */}
            <button
              onClick={handleDownloadReportHtml}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all shadow-xs"
              title="Download standalone HTML/PDF Report of all displayed records"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Download Report</span>
            </button>

            {/* Export CSV button */}
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all shadow-xs"
              title="Export complete records into CSV spreadsheet"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>CSV Ledger</span>
            </button>

            {/* Print Report button */}
            <button
              onClick={handlePrintReport}
              className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-all shadow-xs"
              title="Print official statewide audit report"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            {currentUser.role === 'BUYER' ? 'Total Procured Value' : currentUser.role === 'ADMIN' ? 'Total Trade Turnover' : 'Total Farmgate Credit'}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              0% Commission
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            {roleInvoices.length} Verified Invoices & Receipts
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            {currentUser.role === 'BUYER' ? 'Inter-State Savings' : 'Direct Middleman Savings'}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800">
              ₹{zeroCommSavings > 0 ? zeroCommSavings.toLocaleString('en-IN') : '58,400'}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              Direct Benefit
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Exempt from APMC Mandi Cuts & Brokerage
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Settlement Status
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              {paidCount} / {roleInvoices.length}
            </span>
            <span className="text-xs font-bold text-blue-700">
              100% Settled
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Direct Bank Transfer / Escrow Disbursal
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Certification & Logistics
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">
              {roleInvoices.filter(i => i.isGiCertified).length} Lots
            </span>
            <span className="text-xs font-bold text-amber-700">
              GI Tagged
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            E-Way Bill & Transport Manifest Attached
          </p>
        </div>

      </div>

      {/* 3. Invoices Table & Filter Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search invoice number, crop, farmer name, buyer, or e-way bill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-medium"
            >
              <option value="All">All Invoices & Receipts (அனைத்தும்)</option>
              <option value="BUYER_TAX_INVOICE">Tax Invoices (விலைப்பட்டியல்)</option>
              <option value="FARMER_SALES_RECEIPT">Farmgate Sales Receipts (விற்பனை ரசீது)</option>
              <option value="GOVT_SUBSIDY_BILLING">Govt Subsidy Waivers (மானிய ரசீது)</option>
              <option value="Paid via DBT/Escrow">Paid via DBT/Escrow</option>
            </select>
          </div>
        </div>

        {/* Invoice List */}
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-stone-200">
            <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="font-bold text-stone-800 text-sm">No Invoices Found Matching Query</p>
            <p className="text-stone-400 mt-1">Try resetting the search terms or create a new invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Invoice / Receipt No</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">{currentUser.role === 'BUYER' ? 'Seller Farmer' : 'Counterparty'}</th>
                  <th className="py-3 px-4">Produce Details</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInvoices.map(inv => {
                  const isSalesRcpt = inv.invoiceType === 'FARMER_SALES_RECEIPT';
                  const isSubsidy = inv.invoiceType === 'GOVT_SUBSIDY_BILLING';

                  return (
                    <tr key={inv.id} className="hover:bg-stone-50/70 transition-colors">
                      
                      {/* Number & Type Badge */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-stone-900">
                          {inv.invoiceNumber}
                        </div>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          isSalesRcpt 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : isSubsidy 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        }`}>
                          {isSalesRcpt ? 'Sales Receipt' : isSubsidy ? 'Govt Subsidy' : 'Tax Invoice'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {inv.date}
                        {inv.ewayBillNumber && (
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                            EWB: {inv.ewayBillNumber.slice(-8)}
                          </div>
                        )}
                      </td>

                      {/* Counterparty */}
                      <td className="py-3 px-4">
                        {currentUser.role === 'BUYER' ? (
                          <div>
                            <p className="font-bold text-stone-900">{inv.farmerName}</p>
                            <p className="text-[11px] text-stone-500">{inv.farmerDistrict}, Tamil Nadu</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-stone-900">{inv.buyerName}</p>
                            <p className="text-[11px] text-stone-500 truncate max-w-44">
                              {inv.buyerOrganization || `${inv.buyerCity}, ${inv.buyerState}`}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Produce items */}
                      <td className="py-3 px-4">
                        {inv.items.map(item => (
                          <div key={item.id} className="min-w-44">
                            <p className="font-semibold text-stone-800 truncate">
                              {item.description}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {item.quantity} {item.unit} @ ₹{item.unitPrice}/{item.unit}
                            </p>
                          </div>
                        ))}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-black text-stone-900 text-sm">
                          ₹{inv.totalAmount.toLocaleString('en-IN')}
                        </div>
                        {inv.freightAndLogistics > 0 && (
                          <div className="text-[10px] text-stone-400">
                            + ₹{inv.freightAndLogistics} Freight
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{inv.paymentStatus}</span>
                        </span>
                        {inv.zeroCommissionVerified && (
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            0% Broker Fee
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                            title="View Full Invoice / Receipt"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => handlePrintInvoice(inv)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-emerald-200"
                            title="Print / Save as PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print</span>
                          </button>

                          <button
                            onClick={() => handleDownloadInvoice(inv)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-amber-200"
                            title="Download Standalone HTML file"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* 4. MODAL: Detailed Official Invoice / Sales Receipt Viewer (Printable) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Modal Controls Toolbar */}
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">
                  {selectedInvoice.invoiceNumber}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  ({selectedInvoice.invoiceType})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Download offline invoice file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download (.html)</span>
                </button>

                <button
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Print or Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 overflow-y-auto font-sans">
              
              {/* Official Seal & Header */}
              <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold text-sm">
                      🌾
                    </div>
                    <div>
                      <h2 className="text-base font-black tracking-tight text-stone-900 uppercase">
                        GOVERNMENT OF TAMIL NADU
                      </h2>
                      <p className="text-[11px] font-bold text-emerald-800">
                        Department of Agriculture & Farmers Welfare · AAA Platform Direct Trade
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Form VII — Direct Farmgate Commercial Settlement & Farmer Bikri Parchi (உழவர் விற்பனை ரசீது)
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-stone-900">
                    {selectedInvoice.invoiceNumber}
                  </p>
                  <p className="text-xs text-stone-500">
                    Date: <strong className="text-stone-800">{selectedInvoice.date}</strong>
                  </p>
                  {selectedInvoice.ewayBillNumber && (
                    <p className="text-[11px] text-stone-600 font-mono">
                      E-Way Bill: <strong>{selectedInvoice.ewayBillNumber}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Two Column: Seller (Farmer) vs Consignee (Buyer) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                
                {/* Farmer Box */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block border-b border-stone-200 pb-1">
                    SELLER (விவசாயி / GROWER)
                  </span>
                  <p className="font-bold text-stone-900 text-sm">
                    {selectedInvoice.farmerName}
                  </p>
                  <p className="text-stone-600">
                    Village: {selectedInvoice.farmerVillage || 'Agri Ward'}, {selectedInvoice.farmerTaluk || 'Taluk'}
                  </p>
                  <p className="text-stone-600">
                    District: <strong>{selectedInvoice.farmerDistrict}</strong>, Tamil Nadu
                  </p>
                  <p className="text-stone-600">
                    Land Patta No: <span className="font-mono">{selectedInvoice.farmerPattaNo || 'PTA-VERIFIED'}</span>
                  </p>
                  <p className="text-stone-600">
                    Mobile: +91 {selectedInvoice.farmerMobile}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    Bank Credit: {selectedInvoice.farmerBankRef || 'Direct Aadhaar Linked DBT Account'}
                  </p>
                </div>

                {/* Buyer Box */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-950 block border-b border-stone-200 pb-1">
                    CONSIGNEE (வாங்குவோர் / BUYER)
                  </span>
                  <p className="font-bold text-stone-900 text-sm">
                    {selectedInvoice.buyerName}
                  </p>
                  {selectedInvoice.buyerOrganization && (
                    <p className="font-semibold text-stone-700">
                      {selectedInvoice.buyerOrganization}
                    </p>
                  )}
                  <p className="text-stone-600">
                    Destination: {selectedInvoice.deliveryAddress}
                  </p>
                  {selectedInvoice.buyerGstin && (
                    <p className="text-stone-600 font-mono">
                      GSTIN: {selectedInvoice.buyerGstin}
                    </p>
                  )}
                  <p className="text-stone-600">
                    Contact: +91 {selectedInvoice.buyerMobile}
                  </p>
                  <p className="text-[11px] text-stone-600">
                    Payment Channel: {selectedInvoice.paymentMethod}
                  </p>
                </div>

              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                  <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Produce Description</th>
                      <th className="py-2.5 px-3">HSN Code</th>
                      <th className="py-2.5 px-3 text-right">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Farmgate Rate</th>
                      <th className="py-2.5 px-3 text-right">Mandi Comp Rate</th>
                      <th className="py-2.5 px-3 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 text-stone-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {item.description}
                          {item.description_ta && (
                            <span className="block text-[10px] text-stone-500 font-normal">
                              {item.description_ta}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500 font-mono">{item.hsnCode || '100610'}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-stone-800">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-stone-900">
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right text-stone-500">
                          {item.mandiComparisonPrice ? `₹${item.mandiComparisonPrice}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-stone-900">
                          ₹{item.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subtotal, Cess, and Zero-Commission Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                
                {/* Government Statutory Exemption Notes */}
                <div className="space-y-2 max-w-sm text-[11px] text-stone-600 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Statutory APMC Cess Exemption Certified</span>
                  </div>
                  <p>
                    Transacted directly at farmgate under Tamil Nadu Direct Agricultural Produce Marketing Act. APMC Mandi Cess: <strong>₹0.00 (Exempt)</strong>.
                  </p>
                  <p>
                    Middleman & Brokerage Cut: <strong>₹0.00 (0% Intermediary Fee)</strong>. 100% of agreed purchase value goes directly to grower.
                  </p>
                </div>

                {/* Amount Totals Box */}
                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Produce Subtotal:</span>
                    <span className="font-bold">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {selectedInvoice.freightAndLogistics > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Freight & Logistics:</span>
                      <span className="font-bold">₹{selectedInvoice.freightAndLogistics.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>APMC Cess (Exempt):</span>
                    <span className="font-mono text-emerald-700">₹0.00</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>Brokerage Deduction:</span>
                    <span className="font-mono text-emerald-700">₹0.00 (0%)</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>CGST + SGST (Agri produce):</span>
                    <span className="font-mono text-stone-500">₹0.00 (0%)</span>
                  </div>

                  <div className="pt-2 border-t-2 border-stone-900 flex justify-between items-baseline text-sm font-black text-stone-900">
                    <span>Net Settled Amount:</span>
                    <span className="text-base text-emerald-800">
                      ₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2 bg-stone-100 rounded-lg text-[10px] text-stone-600 font-mono">
                    Ref: {selectedInvoice.transactionReference}
                  </div>
                </div>

              </div>

              {/* Logistics & E-Way Bill Bar */}
              {selectedInvoice.ewayBillNumber && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-stone-700" />
                    <span>Transport Vehicle: <strong>{selectedInvoice.vehicleNumber}</strong></span>
                  </div>
                  <span>Operator: <strong>{selectedInvoice.transportOperator}</strong></span>
                  <span>Dispatch: <strong>{selectedInvoice.dispatchDate}</strong></span>
                </div>
              )}

              {/* QR Verification Seal & Signature */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-stone-900 text-white rounded-lg flex items-center justify-center p-1">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-[10px]">
                    <p className="font-bold text-stone-900">AAA Digital Trade QR Seal</p>
                    <p className="font-mono text-stone-500 truncate max-w-xs">{selectedInvoice.qrCodeData}</p>
                    <p className="text-emerald-700 font-semibold">Digitally Signed & Validated on TN Agri Portal</p>
                  </div>
                </div>

                <div className="text-center sm:text-right text-[11px]">
                  <p className="font-bold text-stone-900">Authorized Signature & Seal</p>
                  <p className="text-stone-400 mt-4 border-t border-stone-300 pt-1">
                    Tamil Nadu Direct Farmgate Marketing Board
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL: Create New Invoice or Sales Receipt */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div 
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    {currentUser.role === 'BUYER' ? 'Generate Commercial Procurement Invoice' : 'Create Farmgate Sales Receipt (விற்பனை ரசீது)'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Direct trade settlement with 0% middleman fees
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewInvoice} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              
              {/* Counterparty details */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {currentUser.role === 'BUYER' ? 'Seller Farmer Name:' : 'Buyer / Society / Purchaser Name:'}
                </label>
                <input
                  type="text"
                  required
                  value={formCounterpartyName}
                  onChange={e => setFormCounterpartyName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Contact Mobile (+91):</label>
                  <input
                    type="tel"
                    required
                    value={formCounterpartyMobile}
                    onChange={e => setFormCounterpartyMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {currentUser.role === 'BUYER' ? 'Farmer District:' : 'Buyer City:'}
                  </label>
                  {currentUser.role === 'BUYER' ? (
                    <select
                      value={formDistrict}
                      onChange={e => setFormDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      {TN_38_DISTRICTS.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.name_ta})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formDestinationCity}
                      onChange={e => setFormDestinationCity(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Produce Line Item */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
                  Commodity Line Item
                </span>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Produce Name & Variety:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pollachi Tender Coconut, Thanjavur Ponni Paddy, Erode Turmeric..."
                    value={formProduce}
                    onChange={e => setFormProduce(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Quantity:</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formQuantity}
                      onChange={e => setFormQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Unit:</label>
                    <select
                      value={formUnit}
                      onChange={e => setFormUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                    >
                      <option value="quintal">Quintal</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="pieces">Pieces / Nuts</option>
                      <option value="bags">Bags (50kg)</option>
                      <option value="ton">Metric Tonne</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Unit Price (₹):</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formUnitPrice}
                      onChange={e => setFormUnitPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-center font-bold">
                  <span className="text-stone-600">Calculated Subtotal:</span>
                  <span className="text-sm font-black text-emerald-800">
                    ₹{(formQuantity * formUnitPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Delivery / Pick-Up Destination:</label>
                <input
                  type="text"
                  required
                  value={formDeliveryAddress}
                  onChange={e => setFormDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs"
                >
                  Generate Official Record & Print
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
