import React, { useState } from 'react';
import { GradeConfig, GradeLevelId, StudentProfile } from '../../types';
import { Settings, GraduationCap, CheckCircle2, User, Bell, Sliders, Shield } from 'lucide-react';

interface SettingsViewProps {
  profile: StudentProfile;
  grades: GradeConfig[];
  currentGradeId: GradeLevelId;
  onGradeChange: (gradeId: GradeLevelId) => void;
  onUpdateTargetHours: (hours: number) => void;
  onOpenEditProfile: () => void;
  onResetProfile: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  grades,
  currentGradeId,
  onGradeChange,
  onUpdateTargetHours,
  onOpenEditProfile,
  onResetProfile
}) => {
  const [targetHours, setTargetHours] = useState(profile.weeklyHoursTarget);
  const [pedagogyStyle, setPedagogyStyle] = useState('visual');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    onUpdateTargetHours(targetHours);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Platform & Cognitive Calibration</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Settings & Student Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your academic tier from Class 1 to College, learning intensity, and AI Mirror diagnostic parameters.
        </p>
      </div>

      {/* Profile Overview & Edit Profile Card */}
      <div className="bg-gradient-to-r from-purple-50/90 via-violet-50/60 to-white rounded-3xl border border-purple-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-violet-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              {profile.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {profile.name}
                </h3>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {profile.gradeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile.schoolOrProgram}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEditProfile}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Academic Profile</span>
            </button>
            <button
              onClick={onResetProfile}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-xl border border-slate-200 transition-colors"
              title="Re-run student onboarding from scratch"
            >
              Reset Setup
            </button>
          </div>
        </div>

        {/* Customized Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4 border-t border-purple-100 text-xs">
          <div className="p-3 bg-white/80 rounded-xl border border-purple-100">
            <span className="font-semibold text-purple-900 block mb-1">Active Subjects:</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.subjects.map((s) => (
                <span key={s.id} className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-[11px] font-medium border border-purple-100/60">
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-purple-100">
            <span className="font-semibold text-purple-900 block mb-1">Selected Goals:</span>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              {(profile.learningGoals || ['Eliminate recurring cognitive gaps', 'Ace upcoming assessments']).map((g, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-purple-600 shrink-0" />
                  <span className="truncate">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 1. Grade Stage Selection */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">
            Select Your Academic Level (Class 1 to College)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          AI Mirror calibrates curriculum, problem sets, and cognitive reflection depth based on your selected level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {grades.map((grade) => {
            const isSelected = grade.id === currentGradeId;
            return (
              <div
                key={grade.id}
                onClick={() => onGradeChange(grade.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 shadow-xs'
                    : 'border-purple-100 hover:border-purple-300 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">{grade.label}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-purple-700 block mb-2">
                    {grade.sublabel}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {grade.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-100/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Curriculum Tier</span>
                  <span className="font-bold text-purple-800">{grade.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Study Goals & Target Hours */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">
            Weekly Study Volume & Cognitive Pacing
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Adjust target weekly hours. AI Mirror will dynamically calibrate your daily recommendation batches.
        </p>

        <div className="space-y-4 max-w-xl">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Weekly Target Hours</span>
              <span className="font-mono font-bold text-purple-700 text-sm">
                {targetHours} hours / week
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>5h (Light)</span>
              <span>20h (Recommended)</span>
              <span>40h (Intensive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pedagogical Mentorship Style */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">
            Cognitive Mentorship Style
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Choose how Dr. Elena and AI Mirror present explanations and micro-drills.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'visual', label: 'Intuitive & Visual First', desc: 'Diagrams, geometric analogies, and physical intuition before equations.' },
            { id: 'socratic', label: 'Socratic Dialogue', desc: 'Guided questions that lead you to derive conclusions yourself.' },
            { id: 'rigorous', label: 'Symbolic & Rigorous', desc: 'First-principles proofs, edge cases, and formal definitions.' }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setPedagogyStyle(style.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                pedagogyStyle === style.id
                  ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600'
                  : 'border-slate-200 hover:border-purple-200'
              }`}
            >
              <div className="text-xs font-bold text-slate-900 mb-1">{style.label}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {showSavedToast ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Preferences updated and cognitive matrix re-calibrated!</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            Preferences auto-sync with your AI Mirror account.
          </div>
        )}

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
