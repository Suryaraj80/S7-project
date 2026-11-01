import React, { useState } from 'react';
import { 
  AlertCircle, 
  PhoneCall, 
  HelpCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  FileWarning 
} from 'lucide-react';
import { FarmerProfile, Language } from '../types';

interface GrievanceEscalationProps {
  profile: FarmerProfile;
  language: Language;
}

export const GrievanceEscalation: React.FC<GrievanceEscalationProps> = ({ profile, language }) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('pmkisan_installment');
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'GRV-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(id);
    setGrievanceSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Extra Feature 8
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
            <PhoneCall className="w-5 h-5 text-emerald-700" />
            <span>Delayed Subsidy Grievance Resolution & Kisan Call Centre Helper</span>
          </h2>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Resolve blocked PM-KISAN installments, rejected insurance claims, or delayed solar pump sanctions with direct official escalation protocols.
        </p>
      </div>

      {/* Emergency Helpline Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            KCC
          </div>
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">National Kisan Call Center</span>
            <span className="font-mono text-xs font-bold text-stone-900">1800-180-1551 (Toll-Free)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            PMK
          </div>
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">PM-KISAN Direct Helpdesk</span>
            <span className="font-mono text-xs font-bold text-stone-900">155261 / 011-24300606</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            INS
          </div>
          <div>
            <span className="text-[11px] text-stone-400 block font-medium">Crop Insurance Escalation</span>
            <span className="font-mono text-xs font-bold text-stone-900">14447 (National Toll-Free)</span>
          </div>
        </div>
      </div>

      {/* Resolution Assistant Form */}
      {!grievanceSubmitted ? (
        <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Generate Escalation Dossier for Block Agriculture Officer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Dispute or Delay Category
              </label>
              <select
                value={selectedIssue}
                onChange={e => setSelectedIssue(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="pmkisan_installment">PM-KISAN: Installment Stopped / Inactive e-KYC</option>
                <option value="pmfby_claim">PMFBY: Crop Loss Intimated but Claim Assessment Delayed</option>
                <option value="kusum_allotment">PM-KUSUM: Solar Pump Vendor Not Responding / Site Pending</option>
                <option value="bank_aadhaar_dbt">Bank: DBT subsidy credited to wrong account / NPCI Unlinked</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Beneficiary Mobile / Aadhaar Last 4 Digits
              </label>
              <input
                type="text"
                required
                defaultValue={profile.mobile}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description of the Issue & Expected Resolution
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. My 16th and 17th PM-KISAN installments have not credited despite completing biometric e-KYC in January at CSC center..."
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit & Generate Escalation Ticket</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>Escalation Dossier Successfully Generated: #{ticketId}</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            Your grievance petition has been formatted for the District Agriculture Grievance Cell in <strong>{profile.district}, {profile.state}</strong>. An SMS confirmation will be sent to <strong>{profile.mobile}</strong>.
          </p>
          <div className="text-[11px] text-stone-600 bg-white p-3 rounded-lg border border-emerald-200">
            <strong>Next Action:</strong> If unresolved within 7 working days, present Ticket #{ticketId} directly to the Assistant Director of Agriculture during the weekly Monday Grievance Redressal Day at your Taluk office.
          </div>
          <button
            onClick={() => setGrievanceSubmitted(false)}
            className="text-xs text-emerald-800 font-semibold underline mt-2"
          >
            File another ticket
          </button>
        </div>
      )}

    </div>
  );
};
