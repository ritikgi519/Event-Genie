import React, { useState } from 'react';
import { X, Sparkles, Wand2, Calendar, MapPin, Users, DollarSign, Palette, CheckCircle2 } from 'lucide-react';
import { EventInput, EventType } from '../types';
import { SAMPLE_PRESETS } from '../utils/planGenerator';

interface EventIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: EventInput) => Promise<void>;
  isGenerating: boolean;
  generationStep: string;
}

export const EventIntakeModal: React.FC<EventIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating,
  generationStep
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('Sunset Hilltop Vineyard Wedding');
  const [guestCount, setGuestCount] = useState<number>(120);
  const [location, setLocation] = useState('Sonoma Valley Outdoor Estate, California');
  const [vibe, setVibe] = useState('Romantic Tuscan, warm candlelight, olive branches, golden-hour intimacy');
  const [totalBudget, setTotalBudget] = useState<number>(45000);
  const [eventDate, setEventDate] = useState('2026-09-19');
  const [specialNotes, setSpecialNotes] = useState('Focus on open bar craft cocktails, acoustic duo during vows, and weather contingency buffer.');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setEventType(preset.input.eventType);
    setTitle(preset.input.title);
    setGuestCount(preset.input.guestCount);
    setLocation(preset.input.location);
    setVibe(preset.input.vibe);
    setTotalBudget(preset.input.totalBudget);
    if (preset.input.eventDate) setEventDate(preset.input.eventDate);
    if (preset.input.specialNotes) setSpecialNotes(preset.input.specialNotes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventType,
      title: title || `${eventType.toUpperCase()} Celebration`,
      guestCount: Number(guestCount) || 100,
      location: location || 'Private Venue',
      vibe: vibe || 'Elegant and memorable',
      totalBudget: Number(totalBudget) || 30000,
      eventDate,
      specialNotes
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl relative overflow-hidden my-8">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-400 to-emerald-400" />
        
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Create Master Event Plan
              </h2>
              <p className="text-xs text-slate-400">
                Provide your vision, constraints, and budget for EventGenie’s 5-pillar master plan
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Loading overlay during generation */}
        {isGenerating ? (
          <div className="p-12 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white font-display">
                EventGenie Is Architecting Your Master Plan
              </h3>
              <p className="text-sm text-amber-400 font-medium">
                {generationStep || 'Analyzing event parameters & budget tolerances...'}
              </p>
              <div className="max-w-md mx-auto pt-4 space-y-2 text-left text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Computing percentage & dollar Budget Allocation Matrix</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Structuring Reverse Timeline Countdown & Day-Of Run of Show</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Compiling Vendor Interview Checklists & Red Flag Traps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Synthesizing 3 Bespoke Creative Concepts with Hex Palettes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Framing Targeted Strategic Collaboration Prompts</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Quick Inspiration Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                Quick-Start Curated Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3 text-left rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white group-hover:text-amber-300">
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-mono">
                        ${preset.input.totalBudget.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4" />

            {/* Event Type & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Event Category *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                >
                  <option value="wedding">Wedding</option>
                  <option value="milestone-birthday">Milestone Birthday (30th, 50th, Quince)</option>
                  <option value="community-event">Large-Scale Community Event / Festival</option>
                  <option value="corporate-gala">Corporate Gala / Fundraiser</option>
                  <option value="anniversary-party">Anniversary Celebration</option>
                  <option value="other">Bespoke Celebration</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Event Title / Couple / Honoree Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Sarah & Jordan's Coastal Garden Wedding"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Guest Count & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Estimated Guest Count *
                  </label>
                  <span className="text-xs font-semibold text-amber-400">
                    {guestCount} Guests
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="15"
                    max="2000"
                    step="5"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Total Budget (USD) *
                  </label>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    ${totalBudget.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="3000"
                    max="250000"
                    step="1000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white text-center focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Estimated spend: <span className="text-slate-200 font-semibold">${Math.round(totalBudget / Math.max(1, guestCount))} per guest</span>
                </p>
              </div>
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Location / Venue Style *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Historic Ballroom in Savannah, GA"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Target Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Vibe / Theme Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Aesthetic Vision, Vibe & Mood Keywords *
              </label>
              <textarea
                rows={2}
                required
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g., Earthy bohemian, candlelit romance, live strings, cozy speakeasy energy..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Special Considerations */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Specific Constraints, Cultural Traditions or Must-Haves
              </label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g., Severe peanut allergies, outdoor rain contingency needed, surprise 50th birthday toast, strict 10 PM sound curfew..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Master Plan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
