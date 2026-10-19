import React, { useState, useEffect } from 'react';
import {
  GRADE_CONFIGS,
  MOCK_NOTIFICATIONS,
  MOCK_PROFILES_BY_GRADE
} from './data/mockData';
import {
  GradeLevelId,
  LearningGap,
  NavTab,
  DailyRecommendation,
  NotificationItem,
  StudentProfile,
  QuizResult,
  UpcomingTask
} from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewStats } from './components/dashboard/OverviewStats';
import { AIMirrorCard } from './components/dashboard/AIMirrorCard';
import { ProgressCharts } from './components/dashboard/ProgressCharts';
import { DailyRecommendations } from './components/dashboard/DailyRecommendations';
import { UpcomingTasks } from './components/dashboard/UpcomingTasks';
import { RecentActivityFeed } from './components/dashboard/RecentActivity';
import { MyLearningView } from './components/views/MyLearningView';
import { StudentIntelligenceView } from './components/views/StudentIntelligenceView';
import { ProgressView } from './components/views/ProgressView';
import { StudyPlannerView } from './components/views/StudyPlannerView';
import { AdaptiveQuizView } from './components/views/AdaptiveQuizView';
import { AIMentorView } from './components/views/AIMentorView';
import { SettingsView } from './components/views/SettingsView';
import { DrillModal } from './components/modals/DrillModal';
import { SearchModal } from './components/modals/SearchModal';
import { StudentOnboardingModal } from './components/onboarding/StudentOnboardingModal';
import { Sparkles, CheckCircle2, Award, Target, Edit3, BookOpen } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ai_mirror_student_profile';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  
  // Hydrate profile from localStorage if present
  const [savedProfile, setSavedProfile] = useState<StudentProfile | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage', e);
    }
    return null;
  });

  // If no saved profile, trigger onboarding on launch
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      return false;
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [currentGradeId, setCurrentGradeId] = useState<GradeLevelId>(() => {
    if (savedProfile) return savedProfile.gradeId;
    return 'senior';
  });

  const [profiles, setProfiles] = useState<Record<GradeLevelId, StudentProfile>>(() => {
    if (savedProfile) {
      return {
        ...MOCK_PROFILES_BY_GRADE,
        [savedProfile.gradeId]: savedProfile
      };
    }
    return MOCK_PROFILES_BY_GRADE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDrillGap, setActiveDrillGap] = useState<LearningGap | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mentorInitialTopic, setMentorInitialTopic] = useState<string | null>(null);
  const [mentorInitialSubject, setMentorInitialSubject] = useState<string | null>(null);
  const [quizInitialTopic, setQuizInitialTopic] = useState<string | null>(null);
  const [quizInitialSubject, setQuizInitialSubject] = useState<string | null>(null);

  // Active current profile
  const currentProfile = savedProfile || profiles[currentGradeId] || profiles.senior;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Persists profile updates into React state and localStorage reliably
   */
  const persistProfile = (updatedProfile: StudentProfile) => {
    setSavedProfile(updatedProfile);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
    setProfiles((prev) => ({
      ...prev,
      [updatedProfile.gradeId]: updatedProfile
    }));
  };

  const handleRecordQuizResult = (result: QuizResult) => {
    const updatedResults = [result, ...(currentProfile.quizResults || [])];

    // Log verified measured activity
    const newActivity = {
      id: `act-quiz-${Date.now()}`,
      action: `Completed Adaptive Quiz (${result.score}%)`,
      subject: result.subject,
      timestamp: 'Just now',
      scoreOrDetail: `${result.score}% Score · ${result.status}`,
      positive: result.score >= 60,
      isMeasured: true
    };

    const updatedActivities = [newActivity, ...(currentProfile.recentActivities || []).slice(0, 9)];

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      quizResults: updatedResults,
      recentActivities: updatedActivities,
      conceptMasteryScore: Math.min(100, Number((currentProfile.conceptMasteryScore + 1.2).toFixed(1)))
    };

    persistProfile(updatedProfile);
    showToast(`Adaptive quiz recorded: ${result.score}% score verified in Student Intelligence!`);
  };

  const handleAddLearningGoal = (newGoal: string) => {
    const updatedGoals = [...(currentProfile.learningGoals || []), newGoal];
    const updatedProfile: StudentProfile = {
      ...currentProfile,
      learningGoals: updatedGoals
    };

    persistProfile(updatedProfile);
    showToast(`Added academic goal: "${newGoal}"`);
  };

  const handleGradeChange = (gradeId: GradeLevelId) => {
    setCurrentGradeId(gradeId);
    const targetConfig = GRADE_CONFIGS.find((g) => g.id === gradeId);
    const label = targetConfig?.label || 'Curriculum';
    const baseGradeProfile = profiles[gradeId] || MOCK_PROFILES_BY_GRADE[gradeId];

    const updatedProfile: StudentProfile = {
      ...currentProfile,
      gradeId,
      gradeLabel: label,
      subjects: baseGradeProfile?.subjects || currentProfile.subjects,
      mirrorData: baseGradeProfile?.mirrorData || currentProfile.mirrorData,
      tasks: currentProfile.tasks && currentProfile.tasks.length > 0 ? currentProfile.tasks : (baseGradeProfile?.tasks || [])
    };

    persistProfile(updatedProfile);
    showToast(`Switched curriculum to ${label}`);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('AI Mirror scan complete! Cognitive reflection matrix updated.');
      
      const updatedProfile = {
        ...currentProfile,
        mirrorData: {
          ...currentProfile.mirrorData,
          lastScannedAt: 'Just now',
          cognitiveReadinessScore: Math.min(99, currentProfile.mirrorData.cognitiveReadinessScore + 1)
        }
      };

      persistProfile(updatedProfile);
    }, 1200);
  };

  const handleToggleDailyRecommendation = (recId: string) => {
    const updatedRecs = currentProfile.recommendations.map((r) =>
      r.id === recId ? { ...r, completed: !r.completed } : r
    );

    const updatedProfile = {
      ...currentProfile,
      recommendations: updatedRecs
    };

    persistProfile(updatedProfile);

    const targetRec = currentProfile.recommendations.find((r) => r.id === recId);
    if (targetRec && !targetRec.completed) {
      showToast(`Completed "${targetRec.title}"! +50 Concept Mastery Points`);
    }
  };

  const handleStartSession = (rec: DailyRecommendation) => {
    setCurrentTab('planner');
    showToast(`Loaded "${rec.title}" into your Study Planner focus timer`);
  };

  const handleResolvedDrill = (gapId: string) => {
    showToast('Cognitive gap successfully remediated! Updated retention curve.');
    const remainingGaps = currentProfile.mirrorData.gaps.filter((g) => g.id !== gapId);
    
    const updatedProfile = {
      ...currentProfile,
      conceptMasteryScore: Math.min(100, Number((currentProfile.conceptMasteryScore + 1.2).toFixed(1))),
      mirrorData: {
        ...currentProfile.mirrorData,
        gaps: remainingGaps
      }
    };

    persistProfile(updatedProfile);
  };

  const handleUpdateTargetHours = (hours: number) => {
    const updatedProfile = {
      ...currentProfile,
      weeklyHoursTarget: hours
    };

    persistProfile(updatedProfile);
  };

  const handleUpdateTasks = (updatedTasks: UpcomingTask[]) => {
    const updatedProfile: StudentProfile = {
      ...currentProfile,
      tasks: updatedTasks
    };

    persistProfile(updatedProfile);
  };

  // Onboarding Complete Handler
  const handleCompleteOnboarding = (newProfile: StudentProfile) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }

    setSavedProfile(newProfile);
    setCurrentGradeId(newProfile.gradeId);
    setProfiles((prev) => ({
      ...prev,
      [newProfile.gradeId]: newProfile
    }));
    setOnboardingOpen(false);
    setIsEditingProfile(false);
    showToast(`Welcome, ${newProfile.name}! Your personalized curriculum is ready.`);
  };

  const handleOpenEditProfile = () => {
    setIsEditingProfile(true);
    setOnboardingOpen(true);
  };

  const handleResetProfile = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
    setSavedProfile(null);
    setIsEditingProfile(false);
    setOnboardingOpen(true);
    showToast("Profile reset. Let's set up your academic profile.");
  };

  return (
    <div className="min-h-screen bg-[#FAF9FD] text-slate-800 flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs font-semibold animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        profile={currentProfile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          profile={currentProfile}
          grades={GRADE_CONFIGS}
          currentGradeId={currentGradeId}
          onGradeChange={handleGradeChange}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenSettings={() => setCurrentTab('settings')}
          onOpenEditProfile={handleOpenEditProfile}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-7">
          {/* Active Tab View Rendering */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200">
              {/* Top Welcome & Cognitive Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-purple-100/60">
                <div>
                  <div className="flex items-center gap-2 text-xs text-purple-700 font-semibold uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Personalized Cognitive Learning Hub</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Welcome to AI Mirror, {currentProfile.name.split(' ')[0]}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 bg-purple-50/80 px-3 py-1.5 rounded-xl border border-purple-100">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>{currentProfile.gradeLabel}</span>
                  </div>

                  <button
                    onClick={handleOpenEditProfile}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200/80 text-xs font-semibold shadow-2xs transition-colors"
                    title="Edit profile & subjects"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Active Learning Goals & Focus Strip */}
              {currentProfile.learningGoals && currentProfile.learningGoals.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-purple-50/90 via-violet-50/60 to-white rounded-2xl border border-purple-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block sm:inline mr-2">
                        Active Study Goals:
                      </span>
                      <span className="text-slate-600">
                        {currentProfile.learningGoals.join(' · ')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenEditProfile}
                    className="text-purple-700 hover:text-purple-900 font-semibold shrink-0 hover:underline text-left sm:text-right"
                  >
                    Customize Goals
                  </button>
                </div>
              )}

              {/* 1. Personalized Student Overview Stats */}
              <OverviewStats profile={currentProfile} />

              {/* 2. Prominent Flagship AI Mirror Section */}
              <AIMirrorCard
                mirrorData={currentProfile.mirrorData}
                onOpenDrill={(gap) => setActiveDrillGap(gap)}
                onTriggerScan={handleTriggerScan}
                isScanning={isScanning}
                onOpenIntelligence={() => setCurrentTab('intelligence')}
              />

              {/* 3. Attractive Progress Charts */}
              <ProgressCharts subjects={currentProfile.subjects} />

              {/* 4. Daily Learning Recommendations (Curated by AI Mirror) */}
              <DailyRecommendations
                recommendations={currentProfile.recommendations}
                onToggleComplete={handleToggleDailyRecommendation}
                onStartSession={handleStartSession}
              />

              {/* 5. Two-column bottom strip: Upcoming Tasks & Recent Activity Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingTasks
                  tasks={currentProfile.tasks}
                  onOpenPlanner={() => setCurrentTab('planner')}
                  onToggleComplete={(taskId) => {
                    const updated = currentProfile.tasks.map((t) =>
                      t.id === taskId ? { ...t, completed: !t.completed } : t
                    );
                    handleUpdateTasks(updated);
                  }}
                />
                <RecentActivityFeed activities={currentProfile.recentActivities} />
              </div>
            </div>
          )}

          {currentTab === 'intelligence' && (
            <StudentIntelligenceView
              profile={currentProfile}
              onNavigateToMentorWithTopic={(topic, subject) => {
                setMentorInitialTopic(topic);
                setMentorInitialSubject(subject);
                setCurrentTab('mentor');
              }}
              onNavigateToPlannerWithTask={(taskTitle) => {
                setCurrentTab('planner');
                showToast(`Loaded "${taskTitle}" into your Study Planner focus timer.`);
              }}
              onOpenDrillModal={(gap) => {
                setActiveDrillGap(gap);
              }}
              onRecordQuizResult={handleRecordQuizResult}
              onAddLearningGoal={handleAddLearningGoal}
              onNavigateToQuiz={(topic, subject) => {
                setQuizInitialTopic(topic);
                setQuizInitialSubject(subject);
                setCurrentTab('quiz');
              }}
            />
          )}

          {currentTab === 'learning' && (
            <MyLearningView subjects={currentProfile.subjects} />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              profile={currentProfile}
              subjects={currentProfile.subjects}
            />
          )}

          {currentTab === 'planner' && (
            <StudyPlannerView
              tasks={currentProfile.tasks}
              profile={currentProfile}
              onUpdateTasks={handleUpdateTasks}
              onNavigateToMentor={(topic, subject) => {
                setMentorInitialTopic(topic || null);
                setMentorInitialSubject(subject || null);
                setCurrentTab('mentor');
              }}
              onNavigateToQuiz={(topic, subject) => {
                setQuizInitialTopic(topic || null);
                setQuizInitialSubject(subject || null);
                setCurrentTab('quiz');
              }}
            />
          )}

          {currentTab === 'quiz' && (
            <AdaptiveQuizView
              profile={currentProfile}
              initialSubject={quizInitialSubject}
              initialTopic={quizInitialTopic}
              onRecordQuizResult={handleRecordQuizResult}
              onNavigateToMentor={(topic, subject) => {
                setMentorInitialTopic(topic);
                setMentorInitialSubject(subject);
                setCurrentTab('mentor');
              }}
              onAddRevisionTask={(task) => {
                const updatedTasks = [task, ...currentProfile.tasks];
                handleUpdateTasks(updatedTasks);
                showToast(`Added revision task "${task.title}" to your Study Planner!`);
              }}
              onClearInitialTrigger={() => {
                setQuizInitialSubject(null);
                setQuizInitialTopic(null);
              }}
            />
          )}

          {currentTab === 'mentor' && (
            <AIMentorView
              profile={currentProfile}
              initialTopic={mentorInitialTopic}
              initialSubject={mentorInitialSubject}
              onClearInitialTopic={() => {
                setMentorInitialTopic(null);
                setMentorInitialSubject(null);
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              profile={currentProfile}
              grades={GRADE_CONFIGS}
              currentGradeId={currentGradeId}
              onGradeChange={handleGradeChange}
              onUpdateTargetHours={handleUpdateTargetHours}
              onOpenEditProfile={handleOpenEditProfile}
              onResetProfile={handleResetProfile}
            />
          )}
        </main>
      </div>

      {/* Student Onboarding & Profile Setup Modal */}
      <StudentOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        initialProfile={currentProfile}
        isEditing={isEditingProfile}
      />

      {/* Interactive Micro-Drill Modal */}
      <DrillModal
        gap={activeDrillGap}
        onClose={() => setActiveDrillGap(null)}
        onResolved={handleResolvedDrill}
      />

      {/* Command Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        subjects={currentProfile.subjects}
        tasks={currentProfile.tasks}
        onSelectAction={(query) => {
          if (query === 'mirror-scan') {
            handleTriggerScan();
          } else if (query === 'open-intelligence') {
            setCurrentTab('intelligence');
          } else {
            showToast(`Opened filter for "${query}"`);
          }
        }}
      />
    </div>
  );
}
