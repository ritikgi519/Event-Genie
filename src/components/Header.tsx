import React from 'react';
import { Sparkles, Calendar, PlusCircle, Printer, FileText, MessageSquareQuote } from 'lucide-react';
import { MasterEventPlan } from '../types';

interface HeaderProps {
  currentPlan: MasterEventPlan | null;
  onNewPlan: () => void;
  onOpenMarkdown: () => void;
  onOpenChat: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  onNewPlan,
  onOpenMarkdown,
  onOpenChat,
  onPrint
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                EventGenie
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Master Planner
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Elite AI Architectural Event Master Suite
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentPlan && (
            <>
              {/* AI Consultant Chat */}
              <button
                onClick={onOpenChat}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 hover:border-amber-400/50 transition shadow-sm"
                title="Consult with EventGenie AI"
              >
                <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                <span>AI Consultant</span>
              </button>

              {/* View Raw / Full Markdown */}
              <button
                onClick={onOpenMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
                title="View Full Formatted Markdown Document"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Full Markdown</span>
              </button>

              {/* Print / Save to PDF */}
              <button
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
                title="Print or Save Master Plan as PDF"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Print / PDF</span>
              </button>
            </>
          )}

          {/* New Event Plan button */}
          <button
            onClick={onNewPlan}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/25 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>{currentPlan ? 'Plan New Event' : 'Create Master Plan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
