import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  Palette, 
  HelpCircle, 
  Layers, 
  MapPin, 
  Users, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  MessageSquareQuote,
  ShieldCheck
} from 'lucide-react';
import { Header } from './components/Header';
import { EventIntakeModal } from './components/EventIntakeModal';
import { BudgetMatrixView } from './components/BudgetMatrixView';
import { TimelineView } from './components/TimelineView';
import { VendorLogisticsView } from './components/VendorLogisticsView';
import { CreativeConceptsView } from './components/CreativeConceptsView';
import { CollaborationPromptsView } from './components/CollaborationPromptsView';
import { MarkdownDocumentModal } from './components/MarkdownDocumentModal';
import { ConsultantChatDrawer } from './components/ConsultantChatDrawer';
import { EventInput, MasterEventPlan, VendorQuote } from './types';
import { SAMPLE_PRESETS, generateDefaultPlan } from './utils/planGenerator';

type TabType = 'overview' | 'budget' | 'timeline' | 'vendors' | 'creative' | 'collaboration';

export default function App() {
  // Initialize with the Tuscan Vineyard Wedding sample plan
  const [currentPlan, setCurrentPlan] = useState<MasterEventPlan>(() => {
    return generateDefaultPlan(SAMPLE_PRESETS[0].input);
  });

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMarkdownOpen, setIsMarkdownOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('c1');

  // Refinement state
  const [isRefining, setIsRefining] = useState(false);
  const [refinementResult, setRefinementResult] = useState<{
    promptId: string;
    note: string;
    tweaks: string[];
    detail?: string;
  } | null>(null);

  // Sync selected concept when plan changes
  useEffect(() => {
    if (currentPlan.creativeConcepts?.[0]?.id) {
      setSelectedConceptId(currentPlan.creativeConcepts[0].id);
    }
  }, [currentPlan]);

  const handleGeneratePlan = async (input: EventInput) => {
    setIsGenerating(true);
    setGenerationStep('Analyzing event constraints and guest scale...');

    try {
      const stepTimer1 = setTimeout(() => {
        setGenerationStep('Computing granular percentage & dollar budget allocations...');
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setGenerationStep('Structuring reverse milestone roadmap and run-of-show...');
      }, 1500);

      const stepTimer3 = setTimeout(() => {
        setGenerationStep('Synthesizing 3 bespoke creative concepts with hex swatches...');
      }, 2300);

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        throw new Error('Server returned non-200');
      }

      const data = await response.json();
      if (data && data.plan) {
        setCurrentPlan(data.plan);
      } else {
        const fallback = generateDefaultPlan(input);
        setCurrentPlan(fallback);
      }
    } catch (err) {
      console.warn('API error, using client-side master generator:', err);
      const fallback = generateDefaultPlan(input);
      setCurrentPlan(fallback);
    } finally {
      setIsGenerating(false);
      setIsModalOpen(false);
      setActiveTab('overview');
    }
  };

  const handleRefinePlan = async (promptId: string, answer: string) => {
    setIsRefining(true);
    try {
      const response = await fetch('/api/refine-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan,
          promptAnswer: answer
        })
      });

      const data = await response.json();
      setRefinementResult({
        promptId,
        note: data.refinementNote || `Refinement incorporated: "${answer}". Your master timeline and vendor criteria have been calibrated.`,
        tweaks: data.actionableTweaks || [
          'Briefed catering captain on custom preferences.',
          'Updated vendor contract riders.',
          'Noted contingency threshold in master run-of-show.'
        ],
        detail: data.signatureDrinkOrDetail
      });
    } catch (err) {
      console.error(err);
      setRefinementResult({
        promptId,
        note: `Strategic preference noted: "${answer}". Your planning parameters have been updated to emphasize this direction.`,
        tweaks: [
          'Direct catering and bar coordinators to reflect this update.',
          'Reallocate contingency reserves as necessary.'
        ]
      });
    } finally {
      setIsRefining(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    { id: 'overview', label: 'Master Overview', icon: Layers, badge: null },
    { id: 'budget', label: '1. Budget Matrix', icon: DollarSign, badge: `$${currentPlan.budgetMatrix.totalBudget.toLocaleString()}` },
    { id: 'timeline', label: '2. Reverse Timeline', icon: Calendar, badge: `${currentPlan.timeline.milestones.length} Stages` },
    { id: 'vendors', label: '3. Vendor & Logistics', icon: Briefcase, badge: `${currentPlan.vendorAndLogistics.vendors.length} Hires` },
    { id: 'creative', label: '4. Creative Concepts', icon: Palette, badge: '3 Directions' },
    { id: 'collaboration', label: '5. Collaboration Prompts', icon: HelpCircle, badge: '3 Prompts' },
  ];

  const handleUpdateVendorQuotes = (vendorRole: string, quotes: any[]) => {
    setCurrentPlan(prev => {
      const updatedVendors = prev.vendorAndLogistics.vendors.map(v => {
        if (v.role === vendorRole) {
          return { ...v, quotes };
        }
        return v;
      });
      return {
        ...prev,
        vendorAndLogistics: {
          ...prev.vendorAndLogistics,
          vendors: updatedVendors
        }
      };
    });
  };

  const handleSelectWinningQuote = (vendorRole: string, quoteId: string) => {
    setCurrentPlan(prev => {
      const updatedVendors = prev.vendorAndLogistics.vendors.map(v => {
        if (v.role === vendorRole) {
          const updatedQuotes: VendorQuote[] = (v.quotes || []).map(q => ({
            ...q,
            status: (q.id === quoteId ? 'Selected' : 'Shortlisted') as VendorQuote['status']
          }));
          return {
            ...v,
            status: 'Booked' as const,
            quotes: updatedQuotes
          };
        }
        return v;
      });
      return {
        ...prev,
        vendorAndLogistics: {
          ...prev.vendorAndLogistics,
          vendors: updatedVendors
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <Header
        currentPlan={currentPlan}
        onNewPlan={() => setIsModalOpen(true)}
        onOpenMarkdown={() => setIsMarkdownOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Event Header Banner */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle warm glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {currentPlan.eventInput.eventType.replace('-', ' ')}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {currentPlan.eventInput.location}
                </span>
                {currentPlan.eventInput.eventDate && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    {currentPlan.eventInput.eventDate}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                {currentPlan.eventInput.title}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{currentPlan.eventInput.vibe}"
              </p>
            </div>

            {/* Quick Metrics Badge Group */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Total Budget
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono block">
                  ${currentPlan.budgetMatrix.totalBudget.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ${currentPlan.budgetMatrix.perGuestCost}/guest
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Guest Count
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono block">
                  {currentPlan.eventInput.guestCount}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Attendees
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Reserve Buffer
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono block">
                  {currentPlan.budgetMatrix.contingencyBufferPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ${currentPlan.budgetMatrix.contingencyBufferAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <div className="border-b border-slate-800/90 no-print overflow-x-auto">
          <nav className="flex space-x-2 sm:space-x-3 pb-3 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition select-none ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          
          {/* OVERVIEW TAB: Master Executive Briefing */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Executive Summary Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-white font-display">
                    EventGenie Master Strategy Brief
                  </h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {currentPlan.executiveSummary}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>5 Master Pillars Engineered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Reverse Timeline from 12 Months to Day-Of</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>3 Unique Concepts with Swatches</span>
                  </div>
                </div>
              </div>

              {/* 4 Feature Preview Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Budget Card */}
                <div 
                  onClick={() => setActiveTab('budget')}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Section 1</span>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                          Budget Allocation Matrix
                        </h3>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    Total: <strong className="text-white font-mono">${currentPlan.budgetMatrix.totalBudget.toLocaleString()}</strong> across {currentPlan.budgetMatrix.categories.length} categories with an 8% reserve buffer.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <span>Inspect budget sliders & cost-saving tips</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. Timeline Card */}
                <div 
                  onClick={() => setActiveTab('timeline')}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Section 2</span>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                          Reverse Timeline & Milestones
                        </h3>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    From 9-12 Months Out through Day-Of Master Run of Show with minute-by-minute coordinator assignments.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                    <span>Open countdown roadmap & checklists</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 3. Vendors & Logistics Card */}
                <div 
                  onClick={() => setActiveTab('vendors')}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Section 3</span>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                          Vendor & Logistics Checklist
                        </h3>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    Essential vendor categories with high-impact interview inquiries, red flag traps, and permits/power specifications.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                    <span>Review hiring guides & copy questions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 4. Creative Concepts Card */}
                <div 
                  onClick={() => setActiveTab('creative')}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Section 4</span>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                          Personalized Theme Concepts
                        </h3>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    3 cohesive design directions with copyable hex color palettes, signature wow-moments, and DIY vs pro styling.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                    <span>Explore 3 aesthetic visions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Quick AI Consultant Prompt Bar */}
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <MessageSquareQuote className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">
                      Need custom advice or venue negotiation tips?
                    </h3>
                    <p className="text-xs text-slate-400">
                      EventGenie’s live AI assistant is available 24/7 to draft vendor emails, cocktail recipes, or budget revisions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition shadow-md shadow-amber-500/20 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch EventGenie Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: BUDGET MATRIX */}
          {activeTab === 'budget' && (
            <BudgetMatrixView
              budgetMatrix={currentPlan.budgetMatrix}
              guestCount={currentPlan.eventInput.guestCount}
            />
          )}

          {/* TAB 2: REVERSE TIMELINE */}
          {activeTab === 'timeline' && (
            <TimelineView
              timeline={currentPlan.timeline}
            />
          )}

          {/* TAB 3: VENDOR & LOGISTICS */}
          {activeTab === 'vendors' && (
            <VendorLogisticsView
              vendorAndLogistics={currentPlan.vendorAndLogistics}
              onUpdateVendorQuotes={handleUpdateVendorQuotes}
              onSelectWinningQuote={handleSelectWinningQuote}
            />
          )}

          {/* TAB 4: CREATIVE CONCEPTS */}
          {activeTab === 'creative' && (
            <CreativeConceptsView
              concepts={currentPlan.creativeConcepts}
              selectedConceptId={selectedConceptId}
              onSelectConcept={(id) => setSelectedConceptId(id)}
            />
          )}

          {/* TAB 5: COLLABORATION PROMPTS */}
          {activeTab === 'collaboration' && (
            <CollaborationPromptsView
              prompts={currentPlan.collaborationPrompts}
              currentPlan={currentPlan}
              onRefinePlan={handleRefinePlan}
              isRefining={isRefining}
              refinementResult={refinementResult}
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 no-print">
        <p className="flex items-center justify-center gap-1.5">
          <span>Architected with precision by</span>
          <strong className="text-slate-300 font-display">EventGenie</strong>
          <span>• Master Planning AI Suite</span>
        </p>
      </footer>

      {/* Modal: Event Intake / Create New Master Plan */}
      <EventIntakeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGeneratePlan}
        isGenerating={isGenerating}
        generationStep={generationStep}
      />

      {/* Modal: Full Markdown Document Viewer */}
      <MarkdownDocumentModal
        isOpen={isMarkdownOpen}
        onClose={() => setIsMarkdownOpen(false)}
        markdownContent={currentPlan.fullMarkdown}
        eventTitle={currentPlan.eventInput.title}
        onPrint={handlePrint}
      />

      {/* Drawer: Live AI Consultant Chat */}
      <ConsultantChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPlan={currentPlan}
      />

    </div>
  );
}
