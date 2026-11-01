import React, { useState } from 'react';
import { DollarSign, ShieldAlert, Sparkles, TrendingDown, Users, Sliders, Download, Check, HelpCircle, X, Filter } from 'lucide-react';
import { BudgetMatrix } from '../types';
import { BudgetD3Chart } from './BudgetD3Chart';

interface BudgetMatrixViewProps {
  budgetMatrix: BudgetMatrix;
  guestCount: number;
  onUpdateCategory?: (categoryIndex: number, newPercentage: number) => void;
}

const CATEGORY_COLORS = [
  'bg-amber-500 text-amber-500 border-amber-500/40',
  'bg-emerald-500 text-emerald-500 border-emerald-500/40',
  'bg-rose-500 text-rose-500 border-rose-500/40',
  'bg-indigo-500 text-indigo-500 border-indigo-500/40',
  'bg-sky-500 text-sky-500 border-sky-500/40',
  'bg-purple-500 text-purple-500 border-purple-500/40',
  'bg-teal-500 text-teal-500 border-teal-500/40',
  'bg-amber-600 text-amber-600 border-amber-600/40',
];

export const BudgetMatrixView: React.FC<BudgetMatrixViewProps> = ({
  budgetMatrix,
  guestCount,
  onUpdateCategory
}) => {
  const [categories, setCategories] = useState(budgetMatrix.categories);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [isFineTuning, setIsFineTuning] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  const totalBudget = budgetMatrix.totalBudget;
  const perGuest = Math.round(totalBudget / Math.max(1, guestCount));

  // Compute total current percentage
  const totalAllocatedPercentage = categories.reduce((acc, c) => acc + c.percentage, 0);

  // Compute contingency dollars & percent
  const contingencyCategory = categories.find(c => 
    c.category.toLowerCase().includes('contingency') || c.category.toLowerCase().includes('reserve')
  );
  const currentContingencyAmount = contingencyCategory?.amount || budgetMatrix.contingencyBufferAmount;
  const currentContingencyPercent = contingencyCategory?.percentage || budgetMatrix.contingencyBufferPercent;

  const handleSliderChange = (idx: number, newPct: number) => {
    const updated = [...categories];
    updated[idx] = {
      ...updated[idx],
      percentage: newPct,
      amount: Math.round(totalBudget * (newPct / 100))
    };
    setCategories(updated);
    if (onUpdateCategory) {
      onUpdateCategory(idx, newPct);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Category', 'Percentage', 'Dollar Amount', 'Inclusions', 'Cost-Saving Tip'];
    const rows = categories.map(c => [
      `"${c.category}"`,
      `"${c.percentage}%"`,
      `"$${c.amount.toLocaleString()}"`,
      `"${c.items.join('; ')}"`,
      `"${c.tips}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EventGenie_Budget_Matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2500);
  };

  const filteredCategories = selectedCategoryName
    ? categories.filter(c => c.category === selectedCategoryName)
    : categories;

  return (
    <div className="space-y-6">
      
      {/* Section Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Section 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Budget Allocation Matrix
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Calibrated dollar & percentage division tailored to your guest headcount and venue profile
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsFineTuning(!isFineTuning)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                isFineTuning
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isFineTuning ? 'Done Adjusting' : 'Fine-Tune Sliders'}</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Export Budget Matrix to CSV"
            >
              {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copiedCsv ? 'Exported!' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* High-Level Financial Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Budget</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white font-mono">
              ${totalBudget.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Per-Guest Ratio</span>
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-white font-mono">
              ${perGuest} <span className="text-xs text-slate-400 font-sans font-normal">/ guest</span>
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Contingency Buffer</span>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold text-amber-400 font-mono">
              ${currentContingencyAmount.toLocaleString()}
              <span className="text-xs text-amber-400/70 font-sans ml-1">({currentContingencyPercent}%)</span>
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Allocation Sum</span>
              <span className="text-[10px] text-slate-500 font-mono">Target: 100%</span>
            </div>
            <p className={`text-lg sm:text-xl font-bold font-mono ${
              totalAllocatedPercentage === 100 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {totalAllocatedPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* D3 VISUALIZATION COMPONENT: Spending Breakdown by Category vs. Remaining Contingency */}
      <BudgetD3Chart
        categories={categories}
        totalBudget={totalBudget}
        contingencyBufferAmount={currentContingencyAmount}
        contingencyBufferPercent={currentContingencyPercent}
        selectedCategoryName={selectedCategoryName}
        onSelectCategory={(catName) => setSelectedCategoryName(catName)}
      />

      {/* Filter status banner if category selected from D3 chart */}
      {selectedCategoryName && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-xl text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>
              Filtered to: <strong className="text-white">{selectedCategoryName}</strong>
            </span>
          </div>
          <button
            onClick={() => setSelectedCategoryName(null)}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Show All Categories</span>
          </button>
        </div>
      )}

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((category) => {
          // Find original index for slider
          const originalIdx = categories.findIndex(c => c.category === category.category);
          const colorMeta = CATEGORY_COLORS[originalIdx % CATEGORY_COLORS.length];
          const dotColor = colorMeta.split(' ')[0];
          const textColor = colorMeta.split(' ')[1];
          const isSelected = selectedCategoryName === category.category;

          return (
            <div
              key={category.category}
              className={`bg-slate-900/80 border rounded-xl p-5 transition flex flex-col justify-between ${
                isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/10 bg-slate-900' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                    <h3 className="text-base font-semibold text-white">
                      {category.category}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-white font-mono">
                      ${category.amount.toLocaleString()}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 ${textColor} border border-slate-700`}>
                      {category.percentage}% of Budget
                    </span>
                  </div>
                </div>

                {/* Slider if in fine-tuning mode */}
                {isFineTuning && (
                  <div className="my-3 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Adjust Allocation</span>
                      <span className="font-mono text-white font-bold">{category.percentage}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="60"
                      value={category.percentage}
                      onChange={(e) => handleSliderChange(originalIdx, Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 cursor-pointer"
                    />
                  </div>
                )}

                {/* Core Inclusions List */}
                <div className="mt-3">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">
                    Covered Line Items
                  </p>
                  <ul className="space-y-1">
                    {category.items.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-slate-500 text-xs leading-none mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Specific Insider Tip */}
              {category.tips && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="text-amber-300 font-medium">Genie Pro Tip: </strong>
                    {category.tips}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Theme-Specific Cost-Saving Tips Box */}
      {budgetMatrix.themeSpecificSavingsTips && budgetMatrix.themeSpecificSavingsTips.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Theme-Specific Cost Optimization Tactics
              </h3>
              <p className="text-xs text-slate-400">
                High-leverage insider strategies to stretch your capital without diminishing aesthetic impact
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {budgetMatrix.themeSpecificSavingsTips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
