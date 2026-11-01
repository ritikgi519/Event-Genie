import React, { useState } from 'react';
import { 
  Briefcase, 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  Copy, 
  ShieldCheck, 
  Zap, 
  Users, 
  Compass, 
  FileCheck, 
  Scale, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { VendorAndLogistics, VendorChecklistItem, VendorQuote } from '../types';
import { VendorQuoteComparison } from './VendorQuoteComparison';

interface VendorLogisticsViewProps {
  vendorAndLogistics: VendorAndLogistics;
  onUpdateVendorQuotes?: (vendorRole: string, quotes: VendorQuote[]) => void;
  onSelectWinningQuote?: (vendorRole: string, quoteId: string) => void;
}

export const VendorLogisticsView: React.FC<VendorLogisticsViewProps> = ({ 
  vendorAndLogistics,
  onUpdateVendorQuotes,
  onSelectWinningQuote
}) => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'quotes' | 'logistics'>('quotes');
  const [vendorStatuses, setVendorStatuses] = useState<Record<string, string>>({});
  const [copiedVendorRole, setCopiedVendorRole] = useState<string | null>(null);

  // Total quotes across all vendors
  const totalQuotesCount = vendorAndLogistics.vendors.reduce(
    (acc, v) => acc + (v.quotes?.length || 0), 0
  );

  const handleCopyQuestions = (vendor: VendorChecklistItem) => {
    const questionsText = `Interview Inquiries for ${vendor.role} (${vendor.category}):\n` +
      vendor.criticalQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') +
      `\n\nRed Flags Checklist:\n` +
      vendor.redFlags.map(rf => `- ${rf}`).join('\n');
    
    navigator.clipboard.writeText(questionsText);
    setCopiedVendorRole(vendor.role);
    setTimeout(() => setCopiedVendorRole(null), 2500);
  };

  const handleStatusChange = (role: string, status: string) => {
    setVendorStatuses(prev => ({
      ...prev,
      [role]: status
    }));
  };

  const getLogisticsIcon = (category: string) => {
    switch (category) {
      case 'Permits & Licensing':
        return <FileCheck className="w-4 h-4 text-amber-400" />;
      case 'Event Insurance & Safety':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Power & AV Specs':
        return <Zap className="w-4 h-4 text-sky-400" />;
      case 'Guest Flow & Accessibility':
        return <Compass className="w-4 h-4 text-rose-400" />;
      case 'Sanitation & Facilities':
        return <Users className="w-4 h-4 text-indigo-400" />;
      default:
        return <Briefcase className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleInternalUpdateQuotes = (role: string, quotes: VendorQuote[]) => {
    if (onUpdateVendorQuotes) {
      onUpdateVendorQuotes(role, quotes);
    } else {
      const vendor = vendorAndLogistics.vendors.find(v => v.role === role);
      if (vendor) {
        vendor.quotes = quotes;
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Section 3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Vendor & Logistics Suite
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Side-by-side quote comparison vs. budget, hiring guides, red flag traps, and municipal compliance
            </p>
          </div>

          {/* Toggle Views: Quotes Comparison, Hiring Checklist, Logistics */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'quotes'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Quote Comparison</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'quotes' ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'
              }`}>
                {totalQuotesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vendors')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'vendors'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Questions & Hires ({vendorAndLogistics.vendors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('logistics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'logistics'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Logistics ({vendorAndLogistics.logistics.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: SIDE-BY-SIDE QUOTE COMPARISON (NEW FEATURE) */}
      {activeTab === 'quotes' && (
        <VendorQuoteComparison
          vendors={vendorAndLogistics.vendors}
          onUpdateVendorQuotes={handleInternalUpdateQuotes}
          onSelectWinningQuote={onSelectWinningQuote}
        />
      )}

      {/* VIEW 2: VENDORS INTERVIEW QUESTIONS & CHECKLIST */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          {vendorAndLogistics.vendors.map((vendor, idx) => {
            const currentStatus = vendorStatuses[vendor.role] || vendor.status || 'To Contact';
            const quoteCount = vendor.quotes?.length || 0;

            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 transition hover:border-slate-700"
              >
                {/* Vendor Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {vendor.role}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {vendor.category}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        vendor.priority === 'Essential'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {vendor.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Budget Allocation: <span className="text-emerald-400 font-mono font-semibold">{vendor.budgetEstimate}</span>
                    </p>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('quotes')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition"
                      title="Compare Quotes for this category"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Compare Quotes ({quoteCount})</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleCopyQuestions(vendor)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      title="Copy Interview Questions to Clipboard"
                    >
                      {copiedVendorRole === vendor.role ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Questions</span>
                        </>
                      )}
                    </button>

                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(vendor.role, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none transition ${
                        currentStatus === 'Booked' || currentStatus === 'Deposit Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : currentStatus === 'Interviewing'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="To Contact">To Contact</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Deposit Paid">Deposit Paid</option>
                      <option value="Booked">Contract Signed</option>
                    </select>
                  </div>
                </div>

                {/* Critical Questions */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Critical Questions You Must Ask Before Signing
                    </h4>
                  </div>
                  <div className="space-y-1.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                    {vendor.criticalQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="text-xs text-slate-200 flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <p className="leading-relaxed">"{q}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red Flags Alert Box */}
                {vendor.redFlags && vendor.redFlags.length > 0 && (
                  <div className="mt-3 bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Vendor Red Flags To Watch Out For:</span>
                    </div>
                    <div className="space-y-1">
                      {vendor.redFlags.map((rf, rfIdx) => (
                        <p key={rfIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-rose-400 shrink-0 mt-0.5">•</span>
                          <span>{rf}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: LOGISTICS & COMPLIANCE */}
      {activeTab === 'logistics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendorAndLogistics.logistics.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getLogisticsIcon(item.category)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {item.requirement}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.criticalDetails}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-emerald-400 bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/20">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-emerald-300">Action Mandate: </strong>
                  {item.actionItem}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
