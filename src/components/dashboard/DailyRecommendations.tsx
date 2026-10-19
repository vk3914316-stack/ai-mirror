import React from 'react';
import { DailyRecommendation } from '../../types';
import { CheckCircle2, Circle, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface DailyRecommendationsProps {
  recommendations: DailyRecommendation[];
  onToggleComplete: (id: string) => void;
  onStartSession: (rec: DailyRecommendation) => void;
}

export const DailyRecommendations: React.FC<DailyRecommendationsProps> = ({
  recommendations,
  onToggleComplete,
  onStartSession
}) => {
  const completedCount = recommendations.filter((r) => r.completed).length;

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-violet-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Today's High-Yield Plan
            </h3>
            <p className="text-xs text-slate-400">
              Curated by AI Mirror to reinforce fragile memories & eliminate gaps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
          <span>{completedCount} of {recommendations.length} Completed</span>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              rec.completed
                ? 'bg-slate-50/80 border-slate-200/60 opacity-75'
                : 'bg-white border-purple-100/90 hover:border-purple-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button
                type="button"
                onClick={() => onToggleComplete(rec.id)}
                className="mt-0.5 text-purple-600 hover:text-purple-700 transition-colors shrink-0"
              >
                {rec.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 hover:text-purple-600" />
                )}
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${rec.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {rec.title}
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {rec.subject}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-[11px] text-slate-500">{rec.topicTag}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-purple-800 font-semibold">AI Rationale: </strong>
                  {rec.aiRationale}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>{rec.durationMinutes} mins</span>
              </div>

              {!rec.completed ? (
                <button
                  type="button"
                  onClick={() => onStartSession(rec)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <span>Start Session</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Finished
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
