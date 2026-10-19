import React, { useState } from 'react';
import { SubjectProgress } from '../../types';
import { MOCK_WEEKLY_VELOCITY } from '../../data/mockData';
import { BarChart3, TrendingUp, Info } from 'lucide-react';

interface ProgressChartsProps {
  subjects: SubjectProgress[];
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ subjects }) => {
  const [activeDay, setActiveDay] = useState<string | null>('Wed');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const maxHours = 4.0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Weekly Study Velocity Chart */}
      <div className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Weekly Study Velocity
                </h3>
                <p className="text-xs text-slate-400">
                  Hours logged vs daily 3.0h standard target
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
                <span>Logged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-300" />
                <span>Target</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="mt-6 pt-4 border-t border-slate-50">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 relative px-2">
              {/* Daily target reference line at 3.0 hrs (75% height) */}
              <div className="absolute inset-x-0 bottom-[75%] border-b border-dashed border-purple-200 pointer-events-none flex items-center justify-end pr-2">
                <span className="text-[10px] font-mono text-purple-400 -mt-4 bg-white px-1">
                  Goal: 3.0h
                </span>
              </div>

              {MOCK_WEEKLY_VELOCITY.map((item) => {
                const heightPercent = Math.min(100, (item.hours / maxHours) * 100);
                const isSelected = activeDay === item.day;
                const exceedsGoal = item.hours >= item.goal;

                return (
                  <div
                    key={item.day}
                    onClick={() => setActiveDay(item.day)}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                  >
                    {/* Tooltip on active / hover */}
                    <div
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-purple-900 text-white scale-105'
                          : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-white'
                      }`}
                    >
                      {item.hours}h ({item.efficiency}%)
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-purple-700'
                            : exceedsGoal
                            ? 'bg-purple-500 group-hover:bg-purple-600'
                            : 'bg-violet-300 group-hover:bg-violet-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'text-purple-700 font-bold'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected day summary footnote */}
        {activeDay && (
          <div className="mt-4 p-3 bg-purple-50/60 rounded-xl border border-purple-100/80 text-xs text-purple-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                {activeDay}: {MOCK_WEEKLY_VELOCITY.find((d) => d.day === activeDay)?.hours}h logged · Efficiency{' '}
                {MOCK_WEEKLY_VELOCITY.find((d) => d.day === activeDay)?.efficiency}%
              </span>
            </div>
            <span className="font-semibold text-purple-700">Deep Work Verified</span>
          </div>
        )}
      </div>

      {/* 2. Subject Mastery Breakdown */}
      <div className="p-6 bg-white rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Subject Mastery Index
                </h3>
                <p className="text-xs text-slate-400">
                  Calculated from quizzes, problem sets, and cognitive pace
                </p>
              </div>
            </div>
          </div>

          {/* List of subjects with progress tracks */}
          <div className="space-y-3.5">
            {subjects.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubject(isSelected ? null : sub.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-300 bg-purple-50/40 shadow-xs'
                      : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{sub.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
                        {sub.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-medium">
                        {sub.completedModules}/{sub.totalModules} modules
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-700">
                        {sub.masteryPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Visual mastery bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${sub.color}`}
                      style={{ width: `${sub.masteryPercentage}%` }}
                    />
                  </div>

                  {/* Expanded detail on click */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-purple-100/70 flex items-center justify-between text-xs text-slate-600 animate-in fade-in duration-150">
                      <span>Recent quiz score: <strong className="text-purple-800">{sub.recentScore}%</strong></span>
                      <span>Weekly time: <strong className="text-purple-800">{sub.weeklyHours}h</strong></span>
                      <span className="text-emerald-600 font-semibold">Advancing</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 text-right">
          Click any subject to view module breakdowns and recent test scores
        </div>
      </div>
    </div>
  );
};
