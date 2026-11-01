import React, { useState } from 'react';
import { HelpCircle, Sparkles, Send, CheckCircle2, MessageSquare, ArrowRight, Lightbulb } from 'lucide-react';
import { CollaborationPrompt, MasterEventPlan } from '../types';

interface CollaborationPromptsViewProps {
  prompts: CollaborationPrompt[];
  currentPlan: MasterEventPlan;
  onRefinePlan: (promptId: string, answer: string) => Promise<void>;
  isRefining: boolean;
  refinementResult: { promptId: string; note: string; tweaks: string[]; detail?: string } | null;
}

export const CollaborationPromptsView: React.FC<CollaborationPromptsViewProps> = ({
  prompts,
  currentPlan,
  onRefinePlan,
  isRefining,
  refinementResult
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [activePromptId, setActivePromptId] = useState<string>(prompts[0]?.id || 'p1');

  const handleSelectOption = (promptId: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [promptId]: option
    }));
    setCustomAnswers(prev => ({
      ...prev,
      [promptId]: option
    }));
  };

  const handleCustomChange = (promptId: string, text: string) => {
    setCustomAnswers(prev => ({
      ...prev,
      [promptId]: text
    }));
  };

  const handleSubmit = (promptId: string) => {
    const answer = customAnswers[promptId] || selectedOptions[promptId];
    if (!answer || !answer.trim()) return;
    onRefinePlan(promptId, answer.trim());
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Section 5
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Interactive Collaboration Prompts
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Targeted strategic inquiries to dial in precision logistics, weather contingencies, and culinary nuances
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full shrink-0">
            3 Strategic Inquiries
          </span>
        </div>
      </div>

      {/* Prompts Accordion / List */}
      <div className="space-y-5">
        {prompts.map((prompt, idx) => {
          const currentAnswer = customAnswers[prompt.id] || selectedOptions[prompt.id] || '';
          const isResultForThis = refinementResult && refinementResult.promptId === prompt.id;

          return (
            <div
              key={prompt.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 transition hover:border-slate-700 space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {prompt.question}
                  </h3>
                  <div className="flex items-start gap-2 mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400 font-medium">Why This Matters: </strong>
                      <span className="text-slate-300 leading-relaxed">{prompt.contextWhyItMatters}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Options Pills */}
              {prompt.sampleOptions && prompt.sampleOptions.length > 0 && (
                <div className="pt-1">
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Click a Curated Approach or Customize Below:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {prompt.sampleOptions.map((opt, optIdx) => {
                      const isChosen = selectedOptions[prompt.id] === opt;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(prompt.id, opt)}
                          className={`text-left p-2.5 rounded-xl text-xs transition border flex items-start gap-2 ${
                            isChosen
                              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 font-medium'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="text-amber-400/80 font-mono text-[10px] mt-0.5">•</span>
                          <span className="leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Input & Refine Trigger */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => handleCustomChange(prompt.id, e.target.value)}
                  placeholder="Specify your preference or refine instructions..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  disabled={isRefining || !currentAnswer.trim()}
                  onClick={() => handleSubmit(prompt.id)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>{isRefining ? 'Refining Plan...' : 'Refine Plan'}</span>
                </button>
              </div>

              {/* Dynamic Refinement Feedback Box */}
              {isResultForThis && (
                <div className="mt-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>EventGenie Strategic Plan Adaptation</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {refinementResult.note}
                  </p>

                  {refinementResult.tweaks && refinementResult.tweaks.length > 0 && (
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-emerald-500/20 space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                        Operational Tweaks Applied:
                      </p>
                      {refinementResult.tweaks.map((tweak, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tweak}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {refinementResult.detail && (
                    <p className="text-xs text-amber-300/90 italic pt-1">
                      ✨ Bespoke Recommendation: {refinementResult.detail}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
