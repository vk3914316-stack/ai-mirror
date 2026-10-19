import React from 'react';
import { Target, Clock, Flame, Zap, ArrowUpRight } from 'lucide-react';
import { StudentProfile } from '../../types';

interface OverviewStatsProps {
  profile: StudentProfile;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ profile }) => {
  const hoursProgress = Math.min(
    100,
    Math.round((profile.weeklyHoursLogged / profile.weeklyHoursTarget) * 100)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Concept Mastery */}
      <div className="p-5 bg-white rounded-2xl border border-purple-100/90 shadow-xs hover:border-purple-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Concept Mastery
          </span>
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Target className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            {profile.conceptMasteryScore}%
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.8%</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Across all active topics</span>
          <span aria-hidden="true">·</span>
          <span className="text-purple-700 font-medium">94th percentile</span>
        </div>
      </div>

      {/* 2. Study Time Logged */}
      <div className="p-5 bg-white rounded-2xl border border-purple-100/90 shadow-xs hover:border-purple-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Weekly Study Time
          </span>
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            {profile.weeklyHoursLogged}h
          </span>
          <span className="text-xs text-slate-400 font-mono">
            / {profile.weeklyHoursTarget}h target
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${hoursProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{hoursProgress}% of weekly goal</span>
          <span className="text-purple-700 font-medium">On Track</span>
        </div>
      </div>

      {/* 3. Study Streak */}
      <div className="p-5 bg-white rounded-2xl border border-purple-100/90 shadow-xs hover:border-purple-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Active Study Streak
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            {profile.streakDays}
          </span>
          <span className="text-xs font-semibold text-amber-600">
            Days Active
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Personal record: 21 days</span>
          <span aria-hidden="true">·</span>
          <span className="text-purple-700 font-medium">+100 XP streak</span>
        </div>
      </div>

      {/* 4. Deep Focus Efficiency */}
      <div className="p-5 bg-white rounded-2xl border border-purple-100/90 shadow-xs hover:border-purple-300 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Deep Focus Score
          </span>
          <div className="w-8 h-8 rounded-xl bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums tracking-tight">
            {profile.deepWorkPercentage}%
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Optimal</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Zero tab-switching</span>
          <span aria-hidden="true">·</span>
          <span className="text-purple-700 font-medium">High retention</span>
        </div>
      </div>
    </div>
  );
};
