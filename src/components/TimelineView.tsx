import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Plus, Flag, ChevronRight, User } from 'lucide-react';
import { ReverseTimeline, TimelineTask } from '../types';

interface TimelineViewProps {
  timeline: ReverseTimeline;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'dayOf'>('roadmap');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [customTasks, setCustomTasks] = useState<Record<string, TimelineTask[]>>({});
  const [newCustomTaskText, setNewCustomTaskText] = useState('');
  const [selectedMilestonePeriod, setSelectedMilestonePeriod] = useState<string>(
    timeline.milestones[0]?.period || '9–12 Months Out'
  );

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleAddCustomTask = (period: string) => {
    if (!newCustomTaskText.trim()) return;
    const newTask: TimelineTask = {
      id: `custom_${Date.now()}`,
      task: newCustomTaskText.trim(),
      completed: false,
    };
    setCustomTasks(prev => ({
      ...prev,
      [period]: [...(prev[period] || []), newTask]
    }));
    setNewCustomTaskText('');
  };

  // Count total completed tasks
  const allMilestoneTasks = timeline.milestones.flatMap(m => [
    ...m.tasks,
    ...(customTasks[m.period] || [])
  ]);
  const totalTasks = allMilestoneTasks.length;
  const completedCount = allMilestoneTasks.filter(t => completedTasks[t.id]).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header and Mode Toggle */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Section 2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Reverse Timeline & Milestones
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Chronological countdown roadmap and granular day-of run of show execution
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'roadmap'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Countdown Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('dayOf')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dayOf'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Day-Of Run of Show ({timeline.dayOfSchedule.length})</span>
            </button>
          </div>
        </div>

        {/* Task Progress Bar (Roadmap mode) */}
        {activeTab === 'roadmap' && (
          <div className="mt-5 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-medium">Milestones Completed:</span>
                <span className="font-mono">{completedCount} of {totalTasks}</span>
              </span>
              <span className="font-mono text-amber-400 font-semibold">{progressPercent}% Locked</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* View: Countdown Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {timeline.milestones.map((milestone, idx) => {
            const milestoneTasks = [
              ...milestone.tasks,
              ...(customTasks[milestone.period] || [])
            ];
            const isMilestoneComplete = milestoneTasks.every(t => completedTasks[t.id]);

            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden transition hover:border-slate-700"
              >
                {/* Period Badge & Focus Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
                      {milestone.period}
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">
                      {milestone.focusTitle}
                    </h3>
                  </div>

                  {/* Booking Window Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium text-slate-200">{milestone.bookingWindow}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {milestone.description}
                </p>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {milestoneTasks.map((t) => {
                    const isDone = !!completedTasks[t.id];
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTask(t.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                          isDone
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-slate-500 hover:text-amber-400 transition shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${isDone ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                            {t.task}
                          </p>
                          {t.deadlineNote && (
                            <span className="inline-block mt-1 text-[11px] text-amber-400/90 font-mono">
                              ⏳ {t.deadlineNote}
                            </span>
                          )}
                        </div>

                        {t.isUrgent && !isDone && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0">
                            High Priority
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Add Custom Task to this Milestone */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedMilestonePeriod === milestone.period ? newCustomTaskText : ''}
                    onChange={(e) => {
                      setSelectedMilestonePeriod(milestone.period);
                      setNewCustomTaskText(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTask(milestone.period);
                      }
                    }}
                    placeholder={`Add custom task to ${milestone.period}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomTask(milestone.period)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Day-Of Master Run of Show */}
      {activeTab === 'dayOf' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Master Day-Of Run of Show (Chronological Schedule)
              </h3>
              <p className="text-xs text-slate-400">
                Minute-by-minute operational flow to distribute to your wedding party, emcee, and catering lead
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
              {timeline.dayOfSchedule.length} Cue Points
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-6 my-4">
            {timeline.dayOfSchedule.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Timeline node dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center group-hover:scale-125 transition">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold font-mono border border-amber-500/30">
                        {item.time}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {item.activity}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span className="text-slate-300 font-medium">Lead: {item.leadPerson}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pl-1">
                    {item.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
