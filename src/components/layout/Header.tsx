import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  SlidersHorizontal,
  User,
  GraduationCap
} from 'lucide-react';
import { GradeConfig, GradeLevelId, NotificationItem, StudentProfile } from '../../types';

interface HeaderProps {
  profile: StudentProfile;
  grades: GradeConfig[];
  currentGradeId: GradeLevelId;
  onGradeChange: (gradeId: GradeLevelId) => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenSettings: () => void;
  onOpenEditProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  grades,
  currentGradeId,
  onGradeChange,
  onOpenSidebar,
  onOpenSearch,
  notifications,
  onMarkNotificationRead,
  onOpenSettings,
  onOpenEditProfile
}) => {
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const gradeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gradeRef.current && !gradeRef.current.contains(event.target as Node)) {
        setGradeDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentGradeConfig = grades.find((g) => g.id === currentGradeId) || grades[0];

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/80 backdrop-blur-md border-b border-purple-100/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Welcome */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-purple-50 lg:hidden"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              Welcome, {profile.name}
            </h1>
            <span className="hidden sm:inline-flex items-center text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
              Active Focus
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{profile.gradeLabel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="hidden md:inline">{profile.schoolOrProgram}</span>
          </div>
        </div>
      </div>

      {/* Right: Grade Switcher, Search, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Grade Level Selector (Class 1 to College) */}
        <div className="relative" ref={gradeRef}>
          <button
            onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-200/80 bg-purple-50/60 hover:bg-purple-100/70 text-purple-900 text-xs font-semibold transition-all shadow-xs"
          >
            <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
            <div className="text-left hidden sm:block">
              <span className="block leading-tight">{currentGradeConfig.label}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          </button>

          {/* Grade Selector Dropdown */}
          {gradeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-purple-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-purple-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                  Select Grade Stage
                </span>
                <p className="text-[11px] text-slate-500">
                  AI Mirror adapts curriculum from Class 1 to College
                </p>
              </div>

              <div className="mt-1 space-y-1">
                {grades.map((grade) => {
                  const isSelected = grade.id === currentGradeId;
                  return (
                    <button
                      key={grade.id}
                      onClick={() => {
                        onGradeChange(grade.id);
                        setGradeDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-purple-50 border border-purple-200/80 text-purple-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{grade.label}</div>
                        <div className="text-[11px] text-slate-500">{grade.sublabel}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all shadow-xs"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline text-slate-400">Search topics...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-purple-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-purple-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => notifications.forEach((n) => onMarkNotificationRead(n.id))}
                  className="text-[11px] text-purple-700 hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-purple-50 max-h-72 overflow-y-auto mt-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => onMarkNotificationRead(notif.id)}
                    className={`p-3 rounded-xl transition-colors cursor-pointer hover:bg-purple-50/50 ${
                      !notif.read ? 'bg-purple-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        {notif.type === 'mirror' && <Sparkles className="w-3.5 h-3.5" />}
                        {notif.type === 'reminder' && <CalendarCheck className="w-3.5 h-3.5" />}
                        {notif.type === 'achievement' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {notif.type === 'mentor' && <BookOpen className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 leading-tight">
                            {notif.title}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-purple-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-purple-200 shadow-xs">
              {profile.avatarInitials}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 border-b border-purple-50">
                <div className="text-xs font-bold text-slate-900">{profile.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{profile.schoolOrProgram}</div>
              </div>

              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    onOpenEditProfile();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Edit Academic Profile</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-900 rounded-xl transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  <span>Learning Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
