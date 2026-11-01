import React, { useState } from 'react';
import { Palette, Sparkles, Check, Copy, Scissors, Crown, Compass, Music, Flame } from 'lucide-react';
import { CreativeConcept, PaletteColor } from '../types';

interface CreativeConceptsViewProps {
  concepts: CreativeConcept[];
  selectedConceptId?: string;
  onSelectConcept?: (conceptId: string) => void;
}

export const CreativeConceptsView: React.FC<CreativeConceptsViewProps> = ({
  concepts,
  selectedConceptId,
  onSelectConcept
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(selectedConceptId || concepts[0]?.id || 'c1');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const activeConcept = concepts.find(c => c.id === activeTabId) || concepts[0];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Section 4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Personalized Theme & Creative Concepts
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              3 cohesive creative directions: signature wow-moments, hex color palettes, and DIY vs. pro styling blueprints
            </p>
          </div>

          {/* 3 Concepts Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            {concepts.map((concept, idx) => {
              const isSelected = concept.id === activeTabId;
              const isEventChampion = concept.id === selectedConceptId;

              return (
                <button
                  key={concept.id}
                  onClick={() => setActiveTabId(concept.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <span>Concept {idx + 1}</span>
                  {isEventChampion && (
                    <Crown className="w-3 h-3 text-amber-950" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Concept Showcase */}
      {activeConcept && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
          
          {/* Top Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold font-mono uppercase px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  Concept {concepts.findIndex(c => c.id === activeConcept.id) + 1} of 3
                </span>
                {selectedConceptId === activeConcept.id && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Selected Direction
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {activeConcept.themeName}
              </h3>
              <p className="text-sm text-amber-400 italic mt-1 font-display">
                "{activeConcept.tagline}"
              </p>
            </div>

            {onSelectConcept && (
              <button
                onClick={() => onSelectConcept(activeConcept.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedConceptId === activeConcept.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-md shadow-amber-500/20'
                }`}
              >
                {selectedConceptId === activeConcept.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Chosen Master Concept</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span>Choose This Direction</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Narrative Vibe */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Atmospheric Vision & Emotional Story
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {activeConcept.narrativeVibe}
            </p>
          </div>

          {/* Color Palette Matrix with Hex chips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                Curated Color Palette (Click Hex to Copy)
              </h4>
              <span className="text-[11px] text-slate-500">
                5 Harmonic Tones
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {activeConcept.palette.map((color, i) => (
                <div
                  key={i}
                  onClick={() => handleCopyHex(color.hex)}
                  className="group bg-slate-950 rounded-xl p-3 border border-slate-800 hover:border-slate-700 transition cursor-pointer select-none"
                >
                  {/* Color Swatch */}
                  <div
                    className="w-full h-16 rounded-lg mb-2.5 shadow-inner transition group-hover:scale-102 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      {copiedHex === color.hex ? (
                        <Check className="w-5 h-5 text-white drop-shadow" />
                      ) : (
                        <Copy className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </div>
                  </div>

                  {/* Color Details */}
                  <div className="text-left">
                    <p className="text-xs font-bold text-white truncate">
                      {color.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-mono text-slate-400 group-hover:text-amber-400 transition">
                        {color.hex}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[70px]">
                        {color.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Experience / Wow-Moment Card */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Signature Experience / Wow Moment
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                  The Unforgettable Event Pinnacle
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                  {activeConcept.signatureExperience}
                </p>
              </div>
            </div>
          </div>

          {/* DIY Elements vs. Professional Splurges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DIY Styling Elements */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Scissors className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    DIY Elements (Smart Savings)
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    High charm, low financial outlay to tackle in-house
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mt-3">
                {activeConcept.diyElements.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Styling Splurges */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Professional Splurges (High Impact)
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Worth every dollar for safety, scale, and flawless execution
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mt-3">
                {activeConcept.professionalElements.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ★
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tablescape & Audio-Visual Atmosphere */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Tablescape & Decor Texture</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeConcept.tablescapeAndDecor}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1.5">
                <Music className="w-3.5 h-3.5 text-sky-400" />
                <span>Audio/Visual & Lighting Mood</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeConcept.audioVisualAtmosphere}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
