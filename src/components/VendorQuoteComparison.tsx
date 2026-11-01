import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Crown, 
  Sparkles, 
  Star, 
  Phone, 
  Mail, 
  FileText, 
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Download,
  Info
} from 'lucide-react';
import { VendorChecklistItem, VendorQuote } from '../types';

interface VendorQuoteComparisonProps {
  vendors: VendorChecklistItem[];
  onUpdateVendorQuotes: (vendorRole: string, quotes: VendorQuote[]) => void;
  onSelectWinningQuote?: (vendorRole: string, quoteId: string) => void;
}

export const VendorQuoteComparison: React.FC<VendorQuoteComparisonProps> = ({
  vendors,
  onUpdateVendorQuotes,
  onSelectWinningQuote
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(vendors[0]?.role || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<VendorQuote | null>(null);

  // Form state for adding/editing a quote
  const [vendorName, setVendorName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [depositRequired, setDepositRequired] = useState<number>(0);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [exclusionsText, setExclusionsText] = useState('');
  const [prosText, setProsText] = useState('');
  const [consText, setConsText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const currentVendor = vendors.find(v => v.role === selectedRole) || vendors[0];
  const quotes = currentVendor?.quotes || [];

  // Parse numerical allocated budget from budgetEstimate string (e.g., "$16,800" -> 16800)
  const allocatedBudgetNumber = currentVendor?.allocatedBudgetNumber || 
    Number(currentVendor?.budgetEstimate?.replace(/[^0-9]/g, '')) || 10000;

  const handleOpenAddModal = (quoteToEdit?: VendorQuote) => {
    if (quoteToEdit) {
      setEditingQuote(quoteToEdit);
      setVendorName(quoteToEdit.vendorName);
      setContactPerson(quoteToEdit.contactPerson || '');
      setEmailOrPhone(quoteToEdit.emailOrPhone || '');
      setQuoteAmount(quoteToEdit.quoteAmount);
      setDepositRequired(quoteToEdit.depositRequired || 0);
      setCancellationPolicy(quoteToEdit.cancellationPolicy || '');
      setInclusionsText(quoteToEdit.inclusions.join('\n'));
      setExclusionsText(quoteToEdit.exclusionsOrExtraFees.join('\n'));
      setProsText(quoteToEdit.pros.join('\n'));
      setConsText(quoteToEdit.cons.join('\n'));
      setRating(quoteToEdit.rating || 5);
      setNotes(quoteToEdit.notes || '');
    } else {
      setEditingQuote(null);
      setVendorName('');
      setContactPerson('');
      setEmailOrPhone('');
      setQuoteAmount(allocatedBudgetNumber);
      setDepositRequired(Math.round(allocatedBudgetNumber * 0.25));
      setCancellationPolicy('25% non-refundable deposit upon signing; balance due 14 days prior to event.');
      setInclusionsText('Full event day coverage\nDedicated on-site lead coordinator\nSetup and post-event breakdown included');
      setExclusionsText('Travel fee outside 30-mile radius\nOvertime at $250/hour');
      setProsText('Stellar portfolio and pristine reviews\nResponsive communication');
      setConsText('Slightly higher travel fees');
      setRating(5);
      setNotes('');
    }
    setIsAddModalOpen(true);
  };

  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim() || !quoteAmount) return;

    const inclusions = inclusionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const exclusionsOrExtraFees = exclusionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const pros = prosText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const cons = consText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    let updatedQuotes: VendorQuote[] = [];

    if (editingQuote) {
      updatedQuotes = quotes.map(q => {
        if (q.id === editingQuote.id) {
          return {
            ...q,
            vendorName,
            contactPerson,
            emailOrPhone,
            quoteAmount: Number(quoteAmount),
            depositRequired: Number(depositRequired),
            cancellationPolicy,
            inclusions,
            exclusionsOrExtraFees,
            pros,
            cons,
            rating,
            notes
          };
        }
        return q;
      });
    } else {
      const newQuote: VendorQuote = {
        id: `quote_${Date.now()}`,
        vendorName,
        contactPerson,
        emailOrPhone,
        quoteAmount: Number(quoteAmount),
        depositRequired: Number(depositRequired),
        cancellationPolicy,
        inclusions,
        exclusionsOrExtraFees,
        pros,
        cons,
        rating,
        status: 'Shortlisted',
        notes,
        quoteDate: new Date().toISOString().split('T')[0]
      };
      updatedQuotes = [...quotes, newQuote];
    }

    onUpdateVendorQuotes(currentVendor.role, updatedQuotes);
    setIsAddModalOpen(false);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updated = quotes.filter(q => q.id !== quoteId);
    onUpdateVendorQuotes(currentVendor.role, updated);
  };

  const handleSelectWinner = (quoteId: string) => {
    const updated = quotes.map(q => ({
      ...q,
      status: (q.id === quoteId ? 'Selected' : 'Shortlisted') as VendorQuote['status']
    }));
    onUpdateVendorQuotes(currentVendor.role, updated);
    if (onSelectWinningQuote) {
      onSelectWinningQuote(currentVendor.role, quoteId);
    }
  };

  const handleSeedBenchmarkQuotes = () => {
    const sampleSet: VendorQuote[] = [
      {
        id: `quote_${Date.now()}_1`,
        vendorName: 'Heritage Artisans & Fine Service',
        contactPerson: 'Julian Vance (Lead Producer)',
        emailOrPhone: 'julian@heritageartisans.com | (415) 555-0182',
        quoteAmount: Math.round(allocatedBudgetNumber * 0.94),
        depositRequired: Math.round(allocatedBudgetNumber * 0.20),
        cancellationPolicy: 'Full refund minus $250 admin fee up to 60 days before event date.',
        inclusions: [
          'Full-scale signature service package',
          'Primary lead manager + 2 certified support staff',
          'Load-in, soundcheck, and complete late-night strike',
          'Complimentary pre-event mock tasting / walkthrough'
        ],
        exclusionsOrExtraFees: [
          'Overtime surcharge: $175 per additional half hour past midnight'
        ],
        pros: [
          'Under allocated budget by 6%',
          'Exceptional references with local venues',
          'All-inclusive equipment — no separate rental fees'
        ],
        cons: [
          'Requires final headcount 21 days in advance instead of 14'
        ],
        rating: 5,
        status: 'Selected',
        notes: 'Top contender. Highly responsive and matches our aesthetic vision perfectly.'
      },
      {
        id: `quote_${Date.now()}_2`,
        vendorName: 'Apex Luxe Event Collective',
        contactPerson: 'Seraphina Lin',
        emailOrPhone: 'concierge@apexluxe.com | (415) 555-0199',
        quoteAmount: Math.round(allocatedBudgetNumber * 1.08),
        depositRequired: Math.round(allocatedBudgetNumber * 0.30),
        cancellationPolicy: '30% non-refundable deposit. 50% refund between 90 and 30 days.',
        inclusions: [
          'Ultra-premium tiered offering with bespoke styling',
          'Lead creative director on site for entire 10 hours',
          'Luxury hardware, crystal glassware, and custom signage',
          'Dedicated VIP hospitality concierge'
        ],
        exclusionsOrExtraFees: [
          '18% mandatory administrative service fee',
          'Travel fee outside downtown metro: $250'
        ],
        pros: [
          'Museum-quality presentation and celebrity clientele',
          'Unmatched attention to micro-details'
        ],
        cons: [
          '8% over allocated budget ($' + Math.round(allocatedBudgetNumber * 0.08).toLocaleString() + ' premium)',
          'Strict 30% non-refundable deposit'
        ],
        rating: 4.8,
        status: 'Shortlisted',
        notes: 'Gorgeous portfolio, but will need to draw from contingency buffer if chosen.'
      },
      {
        id: `quote_${Date.now()}_3`,
        vendorName: 'Boutique Craft Studios',
        contactPerson: 'Mateo Rossi',
        emailOrPhone: 'hello@boutiquecraft.co | (415) 555-0144',
        quoteAmount: Math.round(allocatedBudgetNumber * 0.88),
        depositRequired: Math.round(allocatedBudgetNumber * 0.25),
        cancellationPolicy: 'Flexible reschedule policy with 30-day notice.',
        inclusions: [
          'Standard full-day package',
          'Experienced 2-person team',
          'Basic day-of coordination'
        ],
        exclusionsOrExtraFees: [
          'Glassware / specialty hardware rentals billed separately',
          'Breakdown crew requires host coordination'
        ],
        pros: [
          'Significant cost savings (12% under budget)',
          'Very flexible contract terms'
        ],
        cons: [
          'Leaves cleanup and strike to client team',
          'Less established history with our specific venue'
        ],
        rating: 4.3,
        status: 'Shortlisted',
        notes: 'Great value alternative if we want to save budget for floral or bar splurges.'
      }
    ];

    onUpdateVendorQuotes(currentVendor.role, sampleSet);
  };

  return (
    <div className="space-y-6">
      
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {vendors.map((vendor) => {
          const isCurrent = vendor.role === selectedRole;
          const quoteCount = vendor.quotes?.length || 0;
          const hasSelected = vendor.quotes?.some(q => q.status === 'Selected');

          return (
            <button
              key={vendor.role}
              type="button"
              onClick={() => setSelectedRole(vendor.role)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{vendor.role}</span>
              {quoteCount > 0 && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isCurrent ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                }`}>
                  {quoteCount} {quoteCount === 1 ? 'quote' : 'quotes'}
                </span>
              )}
              {hasSelected && (
                <Crown className={`w-3 h-3 ${isCurrent ? 'text-slate-950' : 'text-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Target Category Budget Benchmark Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {currentVendor.category}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display">
              {currentVendor.role} — Multi-Quote Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare candidate bids against your budget allocation of{' '}
            <strong className="text-emerald-400 font-mono text-sm">${allocatedBudgetNumber.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {quotes.length === 0 && (
            <button
              type="button"
              onClick={handleSeedBenchmarkQuotes}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load 3 Benchmark Quotes</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add Vendor Quote</span>
          </button>
        </div>
      </div>

      {/* Zero Quotes Empty State */}
      {quotes.length === 0 ? (
        <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-base font-bold text-white font-display">
              No Candidate Quotes Logged for {currentVendor.role}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add received estimates to compare deliverables, deposits, extra fees, and variance against your{' '}
              <span className="text-emerald-400 font-semibold font-mono">${allocatedBudgetNumber.toLocaleString()}</span> budget.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleSeedBenchmarkQuotes}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
            >
              Populate 3 Realistic Comparison Quotes
            </button>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
            >
              Enter New Quote
            </button>
          </div>
        </div>
      ) : (
        /* Side-By-Side Comparison Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quotes.map((quote) => {
            const delta = quote.quoteAmount - allocatedBudgetNumber;
            const deltaPercent = Math.round((Math.abs(delta) / allocatedBudgetNumber) * 100);
            const isUnder = delta <= 0;
            const isSelected = quote.status === 'Selected';

            return (
              <div
                key={quote.id}
                className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Selected Crown Banner */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 px-3 py-1 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    <span>Contract Winner</span>
                  </div>
                )}

                <div>
                  {/* Vendor Name & Rating */}
                  <div className="flex items-start justify-between gap-2 pr-16 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {quote.vendorName}
                      </h4>
                      {quote.contactPerson && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {quote.contactPerson}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (quote.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-300 ml-1 font-mono">
                      {quote.rating || 5}.0
                    </span>
                  </div>

                  {/* Pricing Box & Delta vs Allocated Budget */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 mb-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Quoted Total:</span>
                      <span className="text-xl font-extrabold text-white font-mono">
                        ${quote.quoteAmount.toLocaleString()}
                      </span>
                    </div>

                    {/* Variance vs Target Category Budget */}
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400">Budget Delta:</span>
                      <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                        isUnder ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isUnder ? (
                          <>
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>-${Math.abs(delta).toLocaleString()} ({deltaPercent}% Under)</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>+${delta.toLocaleString()} ({deltaPercent}% Over)</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Deposit info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Deposit Required:</span>
                      <span className="font-mono text-slate-300">
                        ${quote.depositRequired?.toLocaleString() || '0'}{' '}
                        ({Math.round(((quote.depositRequired || 0) / quote.quoteAmount) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* Contact Snippet */}
                  {quote.emailOrPhone && (
                    <div className="text-[11px] text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800/60 mb-4 truncate">
                      {quote.emailOrPhone}
                    </div>
                  )}

                  {/* Included Services Section */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Key Inclusions ({quote.inclusions.length})
                    </span>
                    <ul className="space-y-1">
                      {quote.inclusions.map((inc, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                          <span className="leading-snug">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions / Extra Surcharges Section */}
                  {quote.exclusionsOrExtraFees && quote.exclusionsOrExtraFees.length > 0 && (
                    <div className="space-y-1.5 mb-4 bg-rose-950/15 p-2.5 rounded-lg border border-rose-500/20">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        Extra Fees / Exclusions ({quote.exclusionsOrExtraFees.length})
                      </span>
                      <ul className="space-y-1">
                        {quote.exclusionsOrExtraFees.map((ex, i) => (
                          <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <span className="text-rose-400 shrink-0">•</span>
                            <span className="leading-snug">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pros & Cons Scorecard */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="font-bold text-emerald-400 block mb-1">Pros</span>
                      <ul className="space-y-1">
                        {quote.pros.map((p, idx) => (
                          <li key={idx} className="text-slate-300 flex items-start gap-1">
                            <span className="text-emerald-400 shrink-0">+</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="font-bold text-rose-400 block mb-1">Cons</span>
                      <ul className="space-y-1">
                        {quote.cons.map((c, idx) => (
                          <li key={idx} className="text-slate-300 flex items-start gap-1">
                            <span className="text-rose-400 shrink-0">-</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Cancellation & Notes */}
                  {quote.cancellationPolicy && (
                    <div className="text-[11px] text-slate-400 mb-4 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                      <strong className="text-slate-300">Terms: </strong>
                      {quote.cancellationPolicy}
                    </div>
                  )}
                </div>

                {/* Footer Controls: Select as Winner / Edit / Delete */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(quote)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      title="Delete Quote"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectWinner(quote.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Winner Locked</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-3.5 h-3.5 text-slate-950" />
                        <span>Select Winner</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Add / Edit Quote */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {editingQuote ? 'Edit Vendor Quote' : `Add Quote for ${currentVendor.role}`}
                </h3>
                <p className="text-xs text-slate-400">
                  Target category budget: <span className="text-emerald-400 font-mono font-bold">${allocatedBudgetNumber.toLocaleString()}</span>
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Vendor Name & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vendor Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="e.g. Sonoma Harvest Catering Co."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Vetted Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={5}>5.0 Stars (Elite)</option>
                    <option value={4.5}>4.5 Stars (Great)</option>
                    <option value={4}>4.0 Stars (Good)</option>
                    <option value={3.5}>3.5 Stars (Average)</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Deposit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Quoted Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <span className={`text-[11px] block mt-1 font-mono ${
                    quoteAmount <= allocatedBudgetNumber ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {quoteAmount <= allocatedBudgetNumber
                      ? `✓ $${(allocatedBudgetNumber - quoteAmount).toLocaleString()} under category allocation`
                      : `⚠️ $${(quoteAmount - allocatedBudgetNumber).toLocaleString()} over category allocation`}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Deposit Amount Required ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={depositRequired}
                    onChange={(e) => setDepositRequired(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Elena Rostova (Director)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email / Phone Number
                  </label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. info@vendor.com | (555) 012-3456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Package Inclusions (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={inclusionsText}
                  onChange={(e) => setInclusionsText(e.target.value)}
                  placeholder="8 hours coverage&#10;Lead photographer + second shooter&#10;High-res online gallery"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Exclusions & Hidden Fees */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Exclusions & Extra Fees (One item per line)
                </label>
                <textarea
                  rows={2}
                  value={exclusionsText}
                  onChange={(e) => setExclusionsText(e.target.value)}
                  placeholder="Overtime: $250/hour&#10;Travel fee: $150 outside radius"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">
                    Pros (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={prosText}
                    onChange={(e) => setProsText(e.target.value)}
                    placeholder="Stellar reviews&#10;Free tasting included"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-400 mb-1">
                    Cons (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={consText}
                    onChange={(e) => setConsText(e.target.value)}
                    placeholder="Non-refundable deposit&#10;Strict cutoff hours"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cancellation / Refund Policy
                </label>
                <input
                  type="text"
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="e.g. 50% refund prior to 60 days"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md shadow-amber-500/20"
                >
                  {editingQuote ? 'Update Quote' : 'Save Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
