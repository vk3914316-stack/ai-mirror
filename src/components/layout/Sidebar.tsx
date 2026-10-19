import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  TrendingUp,
  Calendar,
  Sparkles,
  Settings,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Brain,
  HelpCircle
} from 'lucide-react';
import { NavTab, StudentProfile } from '../../types';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  profile,
  isOpen,
  onClose,
  onTriggerScan,
  isScanning
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'intelligence',
      label: 'Student Intelligence',
      icon: <Brain className="w-4 h-4" />,
      badge: 'Intel'
    },
    {
      id: 'learning',
      label: 'My Learning',
      icon: <GraduationCap className="w-4 h-4" />
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'planner',
      label: 'Study Planner',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: 'quiz',
      label: 'Adaptive Quizzes',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: 'Adaptive'
    },
    {
      id: 'mentor',
      label: 'AI Mentor',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'Active'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-md border-r border-purple-100 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-purple-200 ring-2 ring-purple-100">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                    AI Mirror
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 leading-tight">
                  Cognitive Mentorship
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Student Level Pill */}
          <div className="mt-4 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100/80 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                Target Curriculum
              </span>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {profile.gradeLabel.split('·')[0].trim()}
              </p>
            </div>
            <button
              onClick={() => onTabChange('settings')}
              className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 shrink-0 hover:underline"
            >
              Change
            </button>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Menu
          </div>

          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-sm shadow-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive
                        ? 'text-white/80 translate-x-0.5'
                        : 'text-slate-300 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* AI Mirror Quick Scan Box */}
          <div className="pt-4 px-1">
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-50/90 to-violet-100/50 border border-purple-200/70 text-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900">
                  Cognitive Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                Scan your recent answers to update cognitive strengths and gaps.
              </p>
              <button
                onClick={onTriggerScan}
                disabled={isScanning}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Analyzing Matrix...' : 'Run Mirror Scan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Student Profile */}
        <div className="p-4 border-t border-purple-50 bg-white/50">
          <button
            onClick={() => onTabChange('settings')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-purple-50/60 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-purple-100">
              {profile.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate group-hover:text-purple-700">
                  {profile.name}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {profile.schoolOrProgram}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
