import React, { useState, useEffect, useMemo } from 'react';
import { StudentProfile, UpcomingTask, QuizResult, LearningGap } from '../../types';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Edit3,
  Sparkles,
  Brain,
  Filter,
  Check,
  X,
  ChevronRight,
  CalendarDays,
  BookOpen,
  Target,
  Flame,
  ArrowRight,
  CheckSquare,
  ListTodo,
  TrendingUp,
  BarChart2,
  HelpCircle
} from 'lucide-react';

interface StudyPlannerViewProps {
  tasks: UpcomingTask[];
  profile: StudentProfile;
  onUpdateTasks: (tasks: UpcomingTask[]) => void;
  onNavigateToMentor?: (topic?: string, subject?: string) => void;
  onNavigateToQuiz?: (topic?: string, subject?: string) => void;
}

// Days of the week helper
interface WeekDayInfo {
  dayName: string; // 'Mon', 'Tue', etc.
  fullDay: string; // 'Monday', 'Tuesday'
  dateLabel: string; // 'Oct 19'
  isoDate: string; // '2026-10-19'
  isToday: boolean;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks,
  profile,
  onUpdateTasks,
  onNavigateToMentor,
  onNavigateToQuiz
}) => {
  // Navigation & View Mode
  const [plannerMode, setPlannerMode] = useState<'daily' | 'weekly' | 'tasks'>('daily');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // Default to "Today" (Thursday, Oct 19)
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'overdue' | 'high_priority'>('all');

  // Focus Pomodoro Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [timerInitialSeconds, setTimerInitialSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [activeFocusTaskTitle, setActiveFocusTaskTitle] = useState<string>('Deep Focus Session');

  // Task Modal State (for Add / Edit)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<UpcomingTask | null>(null);

  // Task Form State
  const [taskForm, setTaskForm] = useState<{
    title: string;
    subject: string;
    topic: string;
    type: 'Quiz' | 'Assignment' | 'Milestone' | 'Revision';
    priority: 'high' | 'medium' | 'low';
    estimatedMinutes: number;
    dueDate: string;
    scheduledTime: string;
    notes: string;
  }>({
    title: '',
    subject: profile.subjects[0]?.name || 'Mathematics',
    topic: '',
    type: 'Revision',
    priority: 'high',
    estimatedMinutes: 45,
    dueDate: 'Today',
    scheduledTime: '02:30 PM',
    notes: ''
  });

  // Week days representation (Centered around current simulated date Oct 19, 2026)
  const weekDays: WeekDayInfo[] = useMemo(() => [
    { dayName: 'Mon', fullDay: 'Monday', dateLabel: 'Oct 16', isoDate: '2026-10-16', isToday: false },
    { dayName: 'Tue', fullDay: 'Tuesday', dateLabel: 'Oct 17', isoDate: '2026-10-17', isToday: false },
    { dayName: 'Wed', fullDay: 'Wednesday', dateLabel: 'Oct 18', isoDate: '2026-10-18', isToday: false },
    { dayName: 'Thu', fullDay: 'Thursday', dateLabel: 'Oct 19', isoDate: '2026-10-19', isToday: true },
    { dayName: 'Fri', fullDay: 'Friday', dateLabel: 'Oct 20', isoDate: '2026-10-20', isToday: false },
    { dayName: 'Sat', fullDay: 'Saturday', dateLabel: 'Oct 21', isoDate: '2026-10-21', isToday: false },
    { dayName: 'Sun', fullDay: 'Sunday', dateLabel: 'Oct 22', isoDate: '2026-10-22', isToday: false }
  ], []);

  const currentSelectedDay = weekDays[selectedDayIndex] || weekDays[3];

  // Pomodoro Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerSeconds]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = (type: 'focus' | 'break', customSeconds?: number) => {
    setIsRunning(false);
    setSessionType(type);
    const secs = customSeconds || (type === 'focus' ? 25 * 60 : 5 * 60);
    setTimerSeconds(secs);
    setTimerInitialSeconds(secs);
  };

  const handleStartTaskTimer = (task: UpcomingTask) => {
    setActiveFocusTaskTitle(task.title);
    const durationSec = Math.max(15, task.estimatedMinutes) * 60;
    resetTimer('focus', durationSec);
    setIsRunning(true);
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Helper to determine if a task is overdue, due today, or upcoming
  const getTaskDueStatus = (dueDate: string, isCompleted?: boolean): 'overdue' | 'today' | 'upcoming' => {
    if (isCompleted) return 'upcoming';
    const lower = (dueDate || '').toLowerCase().trim();

    if (lower.includes('yesterday') || lower.includes('oct 16') || lower.includes('oct 17') || lower.includes('oct 18') || lower.includes('overdue')) {
      return 'overdue';
    }
    if (lower.includes('today') || lower.includes('oct 19')) {
      return 'today';
    }
    return 'upcoming';
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const status = getTaskDueStatus(task.dueDate, task.completed);
      if (activeFilter === 'pending') return !task.completed;
      if (activeFilter === 'completed') return !!task.completed;
      if (activeFilter === 'overdue') return status === 'overdue' && !task.completed;
      if (activeFilter === 'high_priority') return task.priority === 'high' && !task.completed;
      return true;
    });
  }, [tasks, activeFilter]);

  // Daily Completion Summary & Progress Stats
  const dailySummary = useMemo(() => {
    // Look at tasks due today or scheduled for today
    const todayTasks = tasks.filter((t) => {
      const status = getTaskDueStatus(t.dueDate, t.completed);
      return status === 'today' || (t.dueDate || '').toLowerCase().includes('today');
    });

    const totalToday = todayTasks.length;
    const completedToday = todayTasks.filter((t) => t.completed).length;
    const pendingToday = totalToday - completedToday;

    const plannedMinutes = todayTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
    const completedMinutes = todayTasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

    const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    const overdueCount = tasks.filter((t) => getTaskDueStatus(t.dueDate, t.completed) === 'overdue' && !t.completed).length;

    return {
      totalToday,
      completedToday,
      pendingToday,
      plannedMinutes,
      completedMinutes,
      completionRate,
      overdueCount
    };
  }, [tasks]);

  // Identify topics needing revision from quiz results (< 75%) or diagnosed gaps
  const revisionRecommendations = useMemo(() => {
    const list: Array<{
      id: string;
      topic: string;
      subject: string;
      reason: string;
      scoreOrSeverity: string;
      source: 'quiz' | 'gap';
      gapRef?: LearningGap;
    }> = [];

    // 1. Check quiz results for scores under 75% or "Needs Review"
    if (profile.quizResults && profile.quizResults.length > 0) {
      profile.quizResults.forEach((q) => {
        if (q.score < 75 || q.status === 'Needs Review') {
          const topicName = q.topicsCovered?.[0] || q.title;
          if (!list.some((item) => item.topic === topicName)) {
            list.push({
              id: `rec-quiz-${q.id}`,
              topic: topicName,
              subject: q.subject,
              reason: `Scored ${q.score}% in diagnostic assessment`,
              scoreOrSeverity: `${q.score}%`,
              source: 'quiz'
            });
          }
        }
      });
    }

    // 2. Check learning gaps from AI Mirror
    if (profile.mirrorData?.gaps && profile.mirrorData.gaps.length > 0) {
      profile.mirrorData.gaps.forEach((g) => {
        if (!list.some((item) => item.topic === g.concept)) {
          list.push({
            id: `rec-gap-${g.id}`,
            topic: g.concept,
            subject: g.subject,
            reason: g.identifiedTrigger || 'Identified cognitive blindspot under timed conditions',
            scoreOrSeverity: `${g.severity.toUpperCase()} Priority`,
            source: 'gap',
            gapRef: g
          });
        }
      });
    }

    return list;
  }, [profile.quizResults, profile.mirrorData?.gaps]);

  // Dynamic Daily Schedule Blocks Generator
  // Adapts time blocks based on education level, enrolled subjects, and target hours
  const dynamicDailyBlocks = useMemo(() => {
    const subs = profile.subjects || [];
    const gradeId = profile.gradeId;
    const targetDailyHours = (profile.weeklyHoursTarget || 18) / 7;

    // Default block durations and style based on grade level
    let blockMinutes = 45;
    let blockType = 'Derivation & Practice';
    if (gradeId === 'primary') {
      blockMinutes = 25;
      blockType = 'Interactive Play & Exercises';
    } else if (gradeId === 'middle') {
      blockMinutes = 35;
      blockType = 'Conceptual Models & Problems';
    } else if (gradeId === 'undergrad' || gradeId === 'postgrad') {
      blockMinutes = 60;
      blockType = 'System Architecture & Proofs';
    }

    const sub1 = subs[0]?.name || 'Mathematics';
    const sub2 = subs[1]?.name || 'Physical Sciences';
    const sub3 = subs[2]?.name || subs[0]?.name || 'Analytical Reasoning';

    // Highlight day variation
    const dayName = currentSelectedDay.dayName;
    const isWeekend = dayName === 'Sat' || dayName === 'Sun';

    return [
      {
        id: 'block-1',
        time: isWeekend ? '10:00 AM' : '09:00 AM',
        duration: blockMinutes,
        subject: sub1,
        title: `${sub1}: Deep Focus & Core Theory`,
        description: `High-yield prime energy slot for ${profile.gradeLabel}. Focus on fundamentals and step-by-step proofs.`,
        tag: 'Prime Cognitive Window',
        status: currentSelectedDay.isToday ? 'completed' : 'scheduled'
      },
      {
        id: 'block-2',
        time: isWeekend ? '02:00 PM' : '02:30 PM',
        duration: blockMinutes + 15,
        subject: sub2,
        title: `${sub2}: Problem Sets & AI Dialogue`,
        description: `Apply formulas and test edge cases. Consult Dr. Elena in AI Mentor for any sticky derivations.`,
        tag: 'Deliberate Practice',
        status: currentSelectedDay.isToday ? 'in-progress' : 'scheduled'
      },
      {
        id: 'block-3',
        time: isWeekend ? '05:30 PM' : '06:00 PM',
        duration: 30,
        subject: sub3,
        title: `${sub3}: Spaced Recall & Retention Drills`,
        description: `Active recall quiz and flashcards. Calibrate your retention curve before sleep.`,
        tag: 'Retention Lock',
        status: 'scheduled'
      }
    ];
  }, [profile.subjects, profile.gradeId, profile.gradeLabel, profile.weeklyHoursTarget, currentSelectedDay]);

  // Weekly Subject Hours Distribution
  const weeklyDistribution = useMemo(() => {
    const subs = profile.subjects || [];
    const totalWeeklyTarget = profile.weeklyHoursTarget || 18;
    const perSub = totalWeeklyTarget / Math.max(1, subs.length);

    return subs.map((sub, idx) => {
      const allocated = Number((perSub * (1 + (idx === 0 ? 0.2 : idx === 1 ? 0.1 : -0.1))).toFixed(1));
      return {
        id: sub.id,
        name: sub.name,
        allocatedHours: allocated,
        completedHours: Number((allocated * 0.58).toFixed(1)),
        color: sub.color
      };
    });
  }, [profile.subjects, profile.weeklyHoursTarget]);

  // ================= TASK ACTIONS (Add, Edit, Toggle Complete, Delete) =================

  const handleOpenAddTask = (preset?: Partial<UpcomingTask>) => {
    setEditingTask(null);
    setTaskForm({
      title: preset?.title || '',
      subject: preset?.subject || profile.subjects[0]?.name || 'Mathematics',
      topic: preset?.topic || '',
      type: preset?.type || 'Revision',
      priority: preset?.priority || 'high',
      estimatedMinutes: preset?.estimatedMinutes || 45,
      dueDate: preset?.dueDate || 'Today',
      scheduledTime: preset?.scheduledTime || '03:00 PM',
      notes: preset?.notes || ''
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: UpcomingTask) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      subject: task.subject,
      topic: task.topic || '',
      type: task.type,
      priority: task.priority,
      estimatedMinutes: task.estimatedMinutes,
      dueDate: task.dueDate,
      scheduledTime: task.scheduledTime || '02:30 PM',
      notes: task.notes || ''
    });
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      // Edit existing task
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: taskForm.title.trim(),
              subject: taskForm.subject,
              topic: taskForm.topic.trim(),
              type: taskForm.type,
              priority: taskForm.priority,
              estimatedMinutes: Number(taskForm.estimatedMinutes) || 30,
              dueDate: taskForm.dueDate,
              scheduledTime: taskForm.scheduledTime,
              notes: taskForm.notes
            }
          : t
      );
      onUpdateTasks(updated);
    } else {
      // Add new task
      const newTask: UpcomingTask = {
        id: `task-${Date.now()}`,
        title: taskForm.title.trim(),
        subject: taskForm.subject,
        topic: taskForm.topic.trim(),
        type: taskForm.type,
        priority: taskForm.priority,
        estimatedMinutes: Number(taskForm.estimatedMinutes) || 30,
        dueDate: taskForm.dueDate,
        scheduledTime: taskForm.scheduledTime,
        notes: taskForm.notes,
        completed: false
      };
      onUpdateTasks([newTask, ...tasks]);
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : undefined
          }
        : t
    );
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    onUpdateTasks(updated);
  };

  // Add recommended revision task directly
  const handleAddRevisionTask = (item: { topic: string; subject: string; reason: string }) => {
    const newTask: UpcomingTask = {
      id: `task-rev-${Date.now()}`,
      title: `Remediate ${item.topic} (${item.subject})`,
      subject: item.subject,
      topic: item.topic,
      dueDate: 'Today at 06:30 PM',
      type: 'Revision',
      estimatedMinutes: 30,
      priority: 'high',
      completed: false,
      isRecommendedRevision: true,
      revisionReason: item.reason,
      notes: `Suggested by AI Mirror based on: ${item.reason}`
    };
    onUpdateTasks([newTask, ...tasks]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= 1. STUDY PLANNER HEADER ================= */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs relative overflow-hidden">
        {/* Subtle decorative purple blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>Personalized Academic Schedule · {profile.gradeLabel}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Mirror Study Planner & Timetable
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Curated daily study schedule calibrated to your {profile.weeklyHoursTarget}h weekly goal,
              active learning priorities ({(profile.learningGoals || []).slice(0, 2).join(' & ') || 'Academic Mastery'}), and cognitive retention cycles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Toggle: Daily vs Weekly vs All Tasks */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold">
              <button
                onClick={() => setPlannerMode('daily')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  plannerMode === 'daily'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily Schedule
              </button>
              <button
                onClick={() => setPlannerMode('weekly')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  plannerMode === 'weekly'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Weekly Plan
              </button>
              <button
                onClick={() => setPlannerMode('tasks')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  plannerMode === 'tasks'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Tasks ({tasks.length})
              </button>
            </div>

            <button
              onClick={() => handleOpenAddTask()}
              className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study Task</span>
            </button>
          </div>
        </div>

        {/* ================= 2. DAILY COMPLETION SUMMARY & PROGRESS INDICATOR ================= */}
        <div className="mt-6 pt-5 border-t border-purple-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Completion Rate */}
          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-purple-700 block">Today's Tasks</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {dailySummary.completedToday} / {dailySummary.totalToday} Completed
              </div>
              <span className="text-[10px] text-slate-500">
                {dailySummary.pendingToday > 0 ? `${dailySummary.pendingToday} remaining today` : 'All tasks cleared! 🎉'}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              {dailySummary.completionRate}%
            </div>
          </div>

          {/* Card 2: Study Time Progress */}
          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-600 block">Focus Time Today</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {dailySummary.completedMinutes}m / {dailySummary.plannedMinutes}m
              </div>
              <span className="text-[10px] text-slate-500">
                Target: {Math.round((profile.weeklyHoursTarget || 18) / 7 * 60)}m daily average
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Weekly Goal Rhythm */}
          <div className="p-3.5 rounded-2xl bg-white border border-purple-100 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-600 block">Weekly Target</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                {profile.weeklyHoursTarget}h / week
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                Paced for {profile.gradeLabel}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Overdue Alert Status */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            dailySummary.overdueCount > 0
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
          }`}>
            <div>
              <span className="text-[11px] font-semibold block">
                {dailySummary.overdueCount > 0 ? 'Action Needed' : 'Schedule Health'}
              </span>
              <div className="text-lg font-black mt-0.5">
                {dailySummary.overdueCount > 0 ? `${dailySummary.overdueCount} Overdue` : 'Zero Overdue'}
              </div>
              <span className="text-[10px] opacity-80">
                {dailySummary.overdueCount > 0 ? 'Reschedule or clear today' : 'All assignments on schedule'}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              dailySummary.overdueCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {dailySummary.overdueCount > 0 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
            <span>Daily Goal Completion: {dailySummary.completedToday} of {dailySummary.totalToday} tasks ({dailySummary.completionRate}%)</span>
            <span>{dailySummary.plannedMinutes - dailySummary.completedMinutes}m remaining planned</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-purple-100/60">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(8, dailySummary.completionRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= 3. OVERDUE ALERT BANNER (If any exist) ================= */}
      {dailySummary.overdueCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-900">
                {dailySummary.overdueCount} {dailySummary.overdueCount === 1 ? 'Task is' : 'Tasks are'} Overdue
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Past deadlines impact your cognitive momentum. Review and reschedule or check them off below.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveFilter('overdue')}
            className="px-3.5 py-1.5 bg-white text-rose-800 border border-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors shadow-2xs self-end sm:self-auto"
          >
            View Overdue Tasks
          </button>
        </div>
      )}

      {/* ================= 4. TARGETED REVISION RECOMMENDATIONS (Based on Quiz Results & Gaps) ================= */}
      {revisionRecommendations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50/90 via-violet-50/70 to-fuchsia-50/60 border border-purple-200 rounded-3xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Targeted Revision Recommendations (From Diagnostic Quizzes & Gaps)
                </h3>
                <p className="text-xs text-slate-500">
                  Topics where measured quiz scores or cognitive diagnostics flagged difficulty
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-lg border border-purple-200 self-start sm:self-auto">
              {revisionRecommendations.length} High-Yield Focus Areas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {revisionRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">
                      {rec.subject}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      rec.source === 'quiz' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {rec.scoreOrSeverity}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {rec.topic}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAddRevisionTask(rec)}
                    className="flex-1 py-1.5 px-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add 30m Task</span>
                  </button>

                  {onNavigateToMentor && (
                    <button
                      onClick={() => onNavigateToMentor(`Explain ${rec.topic} and solve 2 practice problems`, rec.subject)}
                      className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-[11px] font-bold transition-all border border-purple-200 flex items-center gap-1"
                      title="Consult Dr. Elena in AI Mentor"
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>Mentor</span>
                    </button>
                  )}

                  {onNavigateToQuiz && (
                    <button
                      onClick={() => onNavigateToQuiz(rec.topic, rec.subject)}
                      className="py-1.5 px-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-[11px] font-bold transition-all border border-violet-200 flex items-center gap-1"
                      title="Take Adaptive Quiz on this Topic"
                    >
                      <HelpCircle className="w-3 h-3 text-violet-600" />
                      <span>Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. MAIN CONTENT AREA: DAILY vs WEEKLY vs ALL TASKS ================= */}

      {/* Mode 1: Daily Schedule & Pomodoro */}
      {plannerMode === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Schedule for Selected Day */}
          <div className="lg:col-span-2 space-y-5">
            {/* Day Selector Header */}
            <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {currentSelectedDay.fullDay} Schedule ({currentSelectedDay.dateLabel})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cognitive blocks scheduled according to your peak learning efficiency
                </p>
              </div>

              {/* Day selection pill strip */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-2xl">
                {weekDays.map((d, idx) => (
                  <button
                    key={d.dayName}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center ${
                      selectedDayIndex === idx
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="text-[10px] opacity-80">{d.dayName}</span>
                    <span className="font-mono font-bold">{d.dateLabel.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Blocks for the Day */}
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Targeted Session Blocks
                </span>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                  {dynamicDailyBlocks.length} High-Yield Windows
                </span>
              </div>

              <div className="space-y-3.5">
                {dynamicDailyBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      block.status === 'in-progress'
                        ? 'border-purple-300 bg-purple-50/50 shadow-2xs'
                        : block.status === 'completed'
                        ? 'border-purple-100 bg-purple-50/20'
                        : 'border-slate-100 bg-white hover:border-purple-200'
                    }`}
                  >
                    <div className="text-center font-mono shrink-0 w-20 pt-1">
                      <span className="text-xs font-bold text-slate-900 block">{block.time}</span>
                      <span className="text-[10px] text-slate-500">{block.duration} mins</span>
                    </div>

                    <div className="flex-1 border-l border-purple-200/80 pl-4 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{block.title}</span>
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                          {block.subject}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {block.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {block.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 pt-1">
                      {block.status === 'completed' ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Done</span>
                        </div>
                      ) : block.status === 'in-progress' ? (
                        <button
                          onClick={() => {
                            setActiveFocusTaskTitle(block.title);
                            resetTimer('focus', block.duration * 60);
                            setIsRunning(true);
                          }}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start Block</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveFocusTaskTitle(block.title);
                            resetTimer('focus', block.duration * 60);
                          }}
                          className="px-2 py-1 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-medium transition-colors"
                          title="Queue in timer"
                        >
                          Queue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Study Tasks Scheduled for Today */}
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-purple-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Tasks Scheduled for Today ({dailySummary.totalToday})
                  </h3>
                </div>

                <button
                  onClick={() => handleOpenAddTask({ dueDate: 'Today' })}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task Today</span>
                </button>
              </div>

              {tasks.filter((t) => getTaskDueStatus(t.dueDate, t.completed) === 'today').length === 0 ? (
                <div className="text-center py-8 border border-dashed border-purple-200 rounded-2xl bg-purple-50/30">
                  <CheckCircle2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">No remaining tasks due today</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You are completely caught up! Add a new study assignment or start a Pomodoro focus sprint.
                  </p>
                  <button
                    onClick={() => handleOpenAddTask({ dueDate: 'Today' })}
                    className="mt-3 px-3.5 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors shadow-2xs"
                  >
                    + Add New Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter((t) => getTaskDueStatus(t.dueDate, t.completed) === 'today')
                    .map((task) => renderTaskRow(task))}
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Zero-Distraction Pomodoro Focus Timer */}
          <div className="bg-gradient-to-b from-purple-800 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Glow circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    Focus Mode Timer
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-purple-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                  Deep Study
                </span>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center p-1 bg-white/10 rounded-2xl mb-5">
                <button
                  onClick={() => resetTimer('focus')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sessionType === 'focus'
                      ? 'bg-white text-purple-900 shadow-md'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  25m Focus
                </button>
                <button
                  onClick={() => resetTimer('break')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sessionType === 'break'
                      ? 'bg-white text-purple-900 shadow-md'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  5m Break
                </button>
              </div>

              {/* Active Target Banner */}
              <div className="bg-white/10 rounded-2xl p-3 border border-white/10 mb-4 text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">
                  Current Target
                </span>
                <span className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                  {activeFocusTaskTitle}
                </span>
              </div>

              {/* Digital Clock Display */}
              <div className="text-center py-4">
                <div className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tight tabular-nums drop-shadow-sm">
                  {formattedTime}
                </div>
                <p className="text-xs text-purple-200 mt-2 font-medium">
                  {sessionType === 'focus' ? '🎯 Active Deep Learning Sprint' : '☕ Rest your eyes, hydrate & stretch'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={toggleTimer}
                  className="flex-1 py-3 px-4 rounded-2xl bg-white text-purple-950 hover:bg-purple-50 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Focus</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Focus Sprint</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => resetTimer(sessionType)}
                  className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/10"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center text-[11px] text-purple-200">
                <span>Completing a focus sprint adds </span>
                <span className="font-bold text-amber-300">+25 Concept Velocity Points</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Weekly Schedule Overview */}
      {plannerMode === 'weekly' && (
        <div className="space-y-6">
          {/* Weekly Summary Cards */}
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Weekly Study Allocation Matrix ({profile.weeklyHoursTarget}h Target)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Subject breakdown calibrated to ensure balance across all enrolled curriculum courses
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 self-start sm:self-auto">
                Goal: ~{(profile.weeklyHoursTarget / 7).toFixed(1)}h / day
              </span>
            </div>

            {/* Subject Distribution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeklyDistribution.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-purple-100 bg-purple-50/20 shadow-2xs hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</span>
                    <span className="text-xs font-mono font-extrabold text-purple-700 shrink-0">
                      {item.allocatedHours}h
                    </span>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Completed This Week</span>
                      <span className="font-semibold text-slate-700">{item.completedHours}h</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.completedHours / item.allocatedHours) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Timetable Grid */}
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              7-Day Curriculum Timetable
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {weekDays.map((wDay, idx) => {
                const isSelected = selectedDayIndex === idx;
                const subs = profile.subjects || [];
                const dayPrimarySub = subs[idx % subs.length]?.name || 'Core Study';
                const daySecondarySub = subs[(idx + 1) % subs.length]?.name || 'Problem Lab';

                return (
                  <div
                    key={wDay.dayName}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      setPlannerMode('daily');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                      wDay.isToday
                        ? 'border-purple-300 bg-purple-50/40 shadow-xs ring-1 ring-purple-400'
                        : isSelected
                        ? 'border-purple-200 bg-purple-50/20'
                        : 'border-slate-100 bg-white hover:border-purple-200 hover:shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{wDay.dayName}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                          wDay.isToday ? 'bg-purple-600 text-white font-bold' : 'text-slate-500 bg-slate-100'
                        }`}>
                          {wDay.dateLabel.split(' ')[1]}
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-2">
                        <div className="p-1.5 rounded-lg bg-white border border-purple-100 text-[10px] font-medium text-slate-800 line-clamp-1 shadow-2xs">
                          {dayPrimarySub}
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-50 text-[10px] text-slate-600 line-clamp-1">
                          {daySecondarySub}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{(profile.weeklyHoursTarget / 7).toFixed(1)}h</span>
                      <span className="font-semibold text-purple-700">View Day →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: All Tasks Management View (Add, Edit, Complete, Delete, Filter) */}
      {plannerMode === 'tasks' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs space-y-5">
          {/* Controls Bar: Search / Filter & Add Task */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-2">
                <Filter className="w-3.5 h-3.5 text-purple-600" />
                <span>Filter:</span>
              </span>

              {[
                { id: 'all', label: `All (${tasks.length})` },
                { id: 'pending', label: `Pending (${tasks.filter((t) => !t.completed).length})` },
                { id: 'completed', label: `Completed (${tasks.filter((t) => t.completed).length})` },
                { id: 'overdue', label: `Overdue (${tasks.filter((t) => getTaskDueStatus(t.dueDate, t.completed) === 'overdue' && !t.completed).length})` },
                { id: 'high_priority', label: 'High Priority' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === f.id
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleOpenAddTask()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Task Rows List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-purple-200 rounded-3xl bg-purple-50/20">
              <ListTodo className="w-10 h-10 text-purple-400 mx-auto mb-2.5" />
              <h4 className="text-sm font-bold text-slate-800">No tasks found for this filter</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try switching filters or add a new study task.
              </p>
              <button
                onClick={() => handleOpenAddTask()}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow-xs"
              >
                + Add Study Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => renderTaskRow(task))}
            </div>
          )}
        </div>
      )}

      {/* ================= 6. ADD / EDIT TASK MODAL ================= */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  {editingTask ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTask ? 'Edit Study Task' : 'Add New Study Task'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set topic, duration, priority, and deadline
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveTask} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Master Chain Rule Derivations & Unit Practice"
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                />
              </div>

              {/* Subject & Specific Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={taskForm.subject}
                    onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium"
                  >
                    {profile.subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                    <option value="General Cognitive Skills">General Cognitive Skills</option>
                    <option value="Research & Projects">Research & Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Specific Topic
                  </label>
                  <input
                    type="text"
                    value={taskForm.topic}
                    onChange={(e) => setTaskForm({ ...taskForm, topic: e.target.value })}
                    placeholder="e.g. Implicit Differentiation"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Task Type, Priority, & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Task Type
                  </label>
                  <select
                    value={taskForm.type}
                    onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value as any })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  >
                    <option value="Revision">Revision</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Milestone">Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900 font-medium"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Duration (mins)
                  </label>
                  <select
                    value={taskForm.estimatedMinutes}
                    onChange={(e) => setTaskForm({ ...taskForm, estimatedMinutes: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (1 hr)</option>
                    <option value={90}>90 mins (1.5 hrs)</option>
                    <option value={120}>120 mins (2 hrs)</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Scheduled Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Due Date *
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      placeholder="e.g. Today, Tomorrow at 5 PM, or Oct 22"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                    />
                    <div className="flex items-center gap-1.5">
                      {['Today', 'Tomorrow', 'Oct 21', 'Next Week'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setTaskForm({ ...taskForm, dueDate: preset })}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Time Slot
                  </label>
                  <input
                    type="text"
                    value={taskForm.scheduledTime}
                    onChange={(e) => setTaskForm({ ...taskForm, scheduledTime: e.target.value })}
                    placeholder="e.g. 09:00 AM or 02:30 PM"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Study Notes / Specific Instructions
                </label>
                <textarea
                  rows={2}
                  value={taskForm.notes}
                  onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
                  placeholder="Key textbook pages, problem numbers, or questions for Dr. Elena..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 outline-none focus:border-purple-600 focus:bg-white text-slate-900 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Helper to render an individual task row with completion checkbox,
   * priority tags, overdue badge, Pomodoro trigger, Edit, and Delete.
   */
  function renderTaskRow(task: UpcomingTask) {
    const dueStatus = getTaskDueStatus(task.dueDate, task.completed);
    const isOverdue = dueStatus === 'overdue' && !task.completed;
    const isToday = dueStatus === 'today' && !task.completed;

    return (
      <div
        key={task.id}
        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
          task.completed
            ? 'bg-slate-50/60 border-slate-200/60 opacity-70'
            : isOverdue
            ? 'bg-rose-50/50 border-rose-200 shadow-2xs'
            : isToday
            ? 'bg-purple-50/40 border-purple-200 shadow-2xs'
            : 'bg-white border-purple-50 hover:border-purple-200 hover:shadow-2xs'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Completion Toggle Checkbox */}
          <button
            onClick={() => handleToggleComplete(task.id)}
            className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 hover:border-purple-600 bg-white'
            }`}
            title={task.completed ? 'Mark incomplete' : 'Mark completed'}
          >
            {task.completed && <Check className="w-4 h-4" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-1">
              <span className="font-bold text-purple-700">{task.subject}</span>
              {task.topic && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium">{task.topic}</span>
                </>
              )}
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                {task.type}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{task.estimatedMinutes}m</span>

              {/* Priority badge */}
              {task.priority === 'high' && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                  High Priority
                </span>
              )}

              {/* Overdue Badge */}
              {isOverdue && (
                <span className="flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span>OVERDUE</span>
                </span>
              )}

              {/* Due Today Badge */}
              {isToday && (
                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Due Today
                </span>
              )}

              {/* Recommended Revision Tag */}
              {task.isRecommendedRevision && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Quiz Revision</span>
                </span>
              )}
            </div>

            <h4 className={`text-xs sm:text-sm font-bold text-slate-900 leading-snug ${
              task.completed ? 'line-through text-slate-400' : ''
            }`}>
              {task.title}
            </h4>

            {task.notes && (
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                {task.notes}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className={`font-medium ${isOverdue ? 'text-rose-700 font-bold' : ''}`}>
                Due: {task.dueDate}
              </span>
              {task.scheduledTime && (
                <span className="text-slate-400">
                  @ {task.scheduledTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Task Row Action Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          {!task.completed && (
            <button
              onClick={() => handleStartTaskTimer(task)}
              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-all border border-purple-200 flex items-center gap-1"
              title="Start Pomodoro Focus Timer on this task"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Focus</span>
            </button>
          )}

          <button
            onClick={() => handleOpenEditTask(task)}
            className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDeleteTask(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
};
