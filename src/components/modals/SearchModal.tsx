import React, { useState } from 'react';
import { Search, X, BookOpen, Sparkles, ArrowRight, Brain } from 'lucide-react';
import { SubjectProgress, UpcomingTask } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectProgress[];
  tasks: UpcomingTask[];
  onSelectAction: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  subjects,
  tasks,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-purple-50">
          <Search className="w-5 h-5 text-purple-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, calculus, physics formulas, tasks..."
            autoFocus
            className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-slate-200">
              ESC
            </span>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Quick Suggestions / Topics */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Subjects & Curricula
            </div>
            <div className="space-y-1">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectAction(s.name);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-50/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        {s.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-purple-700">
                          {s.name}
                        </div>
                        <div className="text-xs text-slate-500">{s.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-purple-700">
                        {s.masteryPercentage}% Mastery
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 p-2">No matching subjects</div>
              )}
            </div>
          </div>

          {/* Tasks & Milestones */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Upcoming Study Tasks
            </div>
            <div className="space-y-1">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectAction(t.title);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-50/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 group-hover:text-purple-700">
                          {t.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {t.subject} · Due {t.dueDate}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {t.estimatedMinutes}m
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-400 p-2">No matching tasks</div>
              )}
            </div>
          </div>

          {/* AI Mirror Quick Scans */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              AI Mirror Diagnostic Tools
            </div>
            <button
              onClick={() => {
                onSelectAction('mirror-scan');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left bg-gradient-to-r from-purple-50/80 to-violet-50/80 border border-purple-100 hover:border-purple-300 transition-all text-purple-900 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold">Run Complete Cognitive Mirror Diagnostic</div>
                <div className="text-[11px] text-purple-700/80">
                  Analyze recent quiz attempts, velocity, and identify blindspots
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                onSelectAction('open-intelligence');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left bg-white border border-purple-100 hover:border-purple-300 transition-all text-purple-900 group mt-2"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                <Brain className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold">Open Student Intelligence Dashboard</div>
                <div className="text-[11px] text-purple-700/80">
                  View measured strengths, learning gaps, quiz history, and next steps
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
