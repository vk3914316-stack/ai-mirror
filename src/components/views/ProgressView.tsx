import React from 'react';
import { SubjectProgress, StudentProfile } from '../../types';
import { TrendingUp, Target, Award, Brain, Zap, Clock } from 'lucide-react';

interface ProgressViewProps {
  profile: StudentProfile;
  subjects: SubjectProgress[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile, subjects }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Overview */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Diagnostic Learning Analytics</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Cognitive Mastery & Retention Curve
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              AI Mirror measures long-term retention probability, problem-solving latency, and spaced repetition compliance across all subjects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase text-purple-600 block">Readiness</span>
              <span className="text-xl font-extrabold font-mono text-purple-900">
                {profile.mirrorData.cognitiveReadinessScore}%
              </span>
            </div>
            <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase text-violet-600 block">Streak</span>
              <span className="text-xl font-extrabold font-mono text-violet-900">
                {profile.streakDays}d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Retention Curve (The Ebbinghaus Forgetting Curve vs AI Mirror Spaced Repetition) */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Spaced Repetition Retention Advantage
            </h3>
            <p className="text-xs text-slate-400">
              Comparing standard memory decay against AI Mirror timed review boosts
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-purple-600 rounded-full" />
              <span className="text-purple-700 font-semibold">With AI Mirror (92% Stable)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-slate-300 rounded-full" />
              <span className="text-slate-400">Standard Decay (Down to 35%)</span>
            </div>
          </div>
        </div>

        {/* Visual Graph Representation */}
        <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100/60 mt-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
            {[
              { day: 'Day 1', decay: '90%', ai: '100%', boost: 'Initial Learn' },
              { day: 'Day 2', decay: '65%', ai: '98%', boost: 'Micro-Drill' },
              { day: 'Day 4', decay: '50%', ai: '96%', boost: 'Spaced Recall' },
              { day: 'Day 7', decay: '42%', ai: '95%', boost: 'Problem Set' },
              { day: 'Day 14', decay: '38%', ai: '93%', boost: 'Interleaving' },
              { day: 'Day 21', decay: '35%', ai: '92%', boost: 'Exam Simulation' },
              { day: 'Day 30', decay: '32%', ai: '91%', boost: 'Long-term Memory' },
            ].map((pt, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-purple-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">{pt.day}</span>
                <span className="text-xs font-mono font-bold text-purple-700 block">{pt.ai}</span>
                <span className="text-[10px] font-mono text-slate-400 block line-through mb-1.5">{pt.decay}</span>
                <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                  {pt.boost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive Subject Matrix */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Subject-by-Subject Deep Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Mastery</th>
                <th className="py-3 px-4">Modules Completed</th>
                <th className="py-3 px-4">Weekly Effort</th>
                <th className="py-3 px-4">Test Accuracy</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{sub.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                    {sub.masteryPercentage}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {sub.completedModules} / {sub.totalModules}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {sub.weeklyHours}h
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600">
                    {sub.recentScore}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      <span>In Good Standing</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
