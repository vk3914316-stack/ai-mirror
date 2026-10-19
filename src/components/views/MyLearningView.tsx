import React, { useState } from 'react';
import { SubjectProgress } from '../../types';
import { BookOpen, CheckCircle2, Play, Bookmark, Award, Clock } from 'lucide-react';

interface MyLearningViewProps {
  subjects: SubjectProgress[];
}

export const MyLearningView: React.FC<MyLearningViewProps> = ({ subjects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Pure & Applied STEM', 'Class 10 Core Board', 'Computer Science', 'Advanced Composition'];

  const filteredSubjects =
    selectedCategory === 'All'
      ? subjects
      : subjects.filter((s) => s.category.includes(selectedCategory) || selectedCategory === 'All');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Structured Learning Pathway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight mb-2">
            Adaptive Syllabus & Active Modules
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed mb-5">
            Every module is dynamically ordered by AI Mirror to ensure foundational mastery before advancing to complex multi-step theorem synthesis.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/90">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-300" />
              <span>{subjects.reduce((acc, s) => acc + s.completedModules, 0)} Completed Modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-300" />
              <span>{subjects.reduce((acc, s) => acc + s.weeklyHours, 0).toFixed(1)}h This Week</span>
            </div>
          </div>
        </div>

        {/* Subtle geometric circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-purple-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subject Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 hover:border-purple-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                  {subject.category}
                </span>
                <button className="text-slate-400 hover:text-purple-600 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {subject.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Structured progressive curriculum aligned with AI Mirror diagnostic markers.
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Progress</span>
                  <span className="font-mono font-bold text-purple-700">
                    {subject.masteryPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full bg-gradient-to-r ${subject.color}`}
                    style={{ width: `${subject.masteryPercentage}%` }}
                  />
                </div>
              </div>

              {/* Modules breakdown */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Units
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/70 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Unit 1: Foundational Frameworks</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">100% Mastered</span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/70 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">Unit 2: Analytical Applications</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-700 font-bold">92% Retention</span>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-100/50 border border-purple-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin shrink-0" />
                    <span className="font-semibold text-purple-900">Unit 3: Advanced Theorem Synthesis</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-700 font-bold">Current</span>
                </div>
              </div>
            </div>

            {/* Action footer */}
            <div className="pt-4 border-t border-purple-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {subject.completedModules} of {subject.totalModules} modules finished
              </span>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Lesson</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
