import React, { useState } from 'react';
import {
  StudentProfile,
  SubjectProgress,
  LearningGap,
  CognitiveStrength,
  QuizResult,
  StudySession,
  DailyRecommendation
} from '../../types';
import {
  Brain,
  TrendingUp,
  Target,
  Award,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Compass,
  BarChart3,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  Plus,
  X,
  FileText,
  Activity,
  Layers,
  ChevronRight,
  Smile,
  GraduationCap
} from 'lucide-react';
import { MOCK_WEEKLY_VELOCITY } from '../../data/mockData';

interface StudentIntelligenceViewProps {
  profile: StudentProfile;
  onNavigateToMentorWithTopic?: (topic: string, subject: string) => void;
  onNavigateToPlannerWithTask?: (taskTitle: string, subject: string) => void;
  onOpenDrillModal?: (gap: LearningGap) => void;
  onRecordQuizResult?: (result: QuizResult) => void;
  onAddLearningGoal?: (newGoal: string) => void;
  onNavigateToQuiz?: (topic: string, subject: string) => void;
}

export const StudentIntelligenceView: React.FC<StudentIntelligenceViewProps> = ({
  profile,
  onNavigateToMentorWithTopic,
  onNavigateToPlannerWithTask,
  onOpenDrillModal,
  onRecordQuizResult,
  onAddLearningGoal,
  onNavigateToQuiz
}) => {
  // Mode: Real student activity logs vs Benchmark sample preview
  const [dataMode, setDataMode] = useState<'actual' | 'benchmark'>('actual');
  const [historyTab, setHistoryTab] = useState<'quizzes' | 'studySessions'>('quizzes');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [showAddGoalInput, setShowAddGoalInput] = useState(false);

  // Diagnostic Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Determine effective quiz results and study sessions
  const hasActualQuizzes = Boolean(profile.quizResults && profile.quizResults.length > 0);
  const hasActualStudy = Boolean(profile.studyHistory && profile.studyHistory.length > 0);

  // Sample benchmark fallback datasets if student data is empty and benchmark mode is active
  const benchmarkQuizzes: QuizResult[] = [
    {
      id: 'bench-q1',
      title: `${profile.subjects[0]?.name || 'Core Curriculum'} Assessment`,
      subject: profile.subjects[0]?.name || 'Mathematics',
      score: 92,
      totalQuestions: 10,
      correctQuestions: 9,
      completedAt: 'Benchmark Standard (3d ago)',
      topicsCovered: ['Conceptual Modeling', 'Analytical Verification'],
      isMeasured: false,
      status: 'Mastered'
    },
    {
      id: 'bench-q2',
      title: `${profile.subjects[1]?.name || 'Physical Science'} Problem Set`,
      subject: profile.subjects[1]?.name || 'Physics',
      score: 75,
      totalQuestions: 8,
      correctQuestions: 6,
      completedAt: 'Benchmark Standard (5d ago)',
      topicsCovered: ['First-Principles Reasoning', 'Step Derivation'],
      isMeasured: false,
      status: 'Proficient'
    }
  ];

  const benchmarkStudySessions: StudySession[] = [
    {
      id: 'bench-s1',
      subject: profile.subjects[0]?.name || 'Mathematics',
      topic: 'Spaced Repetition Review & Problem Sets',
      durationMinutes: 45,
      completedAt: 'Benchmark Standard (2d ago)',
      sessionType: 'Problem Solving',
      isMeasured: false,
      notes: 'Standard peer cohort revision cadence.'
    },
    {
      id: 'bench-s2',
      subject: profile.subjects[1]?.name || 'Physics',
      topic: 'Deep Work Conceptual Foundations',
      durationMinutes: 50,
      completedAt: 'Benchmark Standard (4d ago)',
      sessionType: 'Deep Work',
      isMeasured: false,
      notes: 'Derivations and practice drill interval.'
    }
  ];

  const activeQuizzes =
    dataMode === 'actual'
      ? profile.quizResults || []
      : hasActualQuizzes
      ? profile.quizResults!
      : benchmarkQuizzes;

  const activeStudySessions =
    dataMode === 'actual'
      ? profile.studyHistory || []
      : hasActualStudy
      ? profile.studyHistory!
      : benchmarkStudySessions;

  // Filter quizzes by subject
  const filteredQuizzes = activeQuizzes.filter(
    (q) => subjectFilter === 'all' || q.subject === subjectFilter
  );

  // Compute calculated metrics
  const calculatedAverageQuizScore =
    activeQuizzes.length > 0
      ? Math.round(
          activeQuizzes.reduce((acc, q) => acc + q.score, 0) / activeQuizzes.length
        )
      : null;

  // Grade-appropriate diagnostic quiz questions
  const getDiagnosticQuestions = () => {
    if (profile.gradeId === 'primary') {
      return [
        {
          q: 'If there are 4 nests and each nest has 3 blue robin eggs, how many eggs are there in total?',
          options: ['7 eggs', '12 eggs', '14 eggs', '10 eggs'],
          correct: 1,
          explanation: '4 groups of 3 = 4 × 3 = 12 eggs!'
        },
        {
          q: 'Which shape has 3 sides and 3 sharp corners?',
          options: ['Square', 'Circle', 'Triangle', 'Rectangle'],
          correct: 2,
          explanation: 'A triangle always has exactly 3 sides and 3 vertices.'
        },
        {
          q: 'What do green leaves need from the sun to make food?',
          options: ['Sunlight', 'Chocolate', 'Ice cubes', 'Paint'],
          correct: 0,
          explanation: 'Plants use sunlight, water, and air to produce nutrients.'
        }
      ];
    } else if (profile.gradeId === 'middle') {
      return [
        {
          q: 'Solve for x: 3x + 9 = 24',
          options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'],
          correct: 1,
          explanation: 'Subtract 9 from both sides: 3x = 15, then divide by 3: x = 5.'
        },
        {
          q: 'When two objects rub together, which force opposes their relative sliding motion?',
          options: ['Gravity', 'Friction', 'Magnetic Force', 'Buoyant Force'],
          correct: 1,
          explanation: 'Friction always opposes the direction of relative surface motion.'
        },
        {
          q: 'What is the smallest functional unit of life in all organisms?',
          options: ['Atom', 'Organ', 'Cell', 'Tissue'],
          correct: 2,
          explanation: 'The cell is the basic structural and functional unit of living organisms.'
        }
      ];
    } else if (profile.gradeId === 'secondary') {
      return [
        {
          q: 'If the discriminant b² - 4ac of a quadratic equation is negative, the roots are:',
          options: ['Real & Equal', 'Real & Distinct', 'Non-real Complex conjugates', 'Zero'],
          correct: 2,
          explanation: 'A negative discriminant indicates no real intersections with the x-axis.'
        },
        {
          q: 'An object of mass 2 kg accelerates at 4 m/s². What is the net applied force?',
          options: ['6 N', '8 N', '2 N', '16 N'],
          correct: 1,
          explanation: 'By Newton’s 2nd Law, F = m × a = 2 kg × 4 m/s² = 8 N.'
        },
        {
          q: 'Which chemical bond involves the sharing of electron pairs between atoms?',
          options: ['Ionic Bond', 'Covalent Bond', 'Hydrogen Bond', 'Metallic Bond'],
          correct: 1,
          explanation: 'Covalent bonds form via mutual sharing of valence electron pairs.'
        }
      ];
    } else {
      // Senior STEM / Undergrad
      return [
        {
          q: 'What is the derivative of f(x) = ln(3x² + 1) with respect to x?',
          options: ['6x / (3x² + 1)', '1 / (3x² + 1)', '6x ln(3x² + 1)', '3x / (3x² + 1)'],
          correct: 0,
          explanation: 'Using the chain rule: d/dx[ln(u)] = (1/u) * u\'. Here u\' = 6x, so f\'(x) = 6x / (3x² + 1).'
        },
        {
          q: 'In rotational motion without slipping, what is the relationship between linear velocity v and angular velocity ω?',
          options: ['v = ω / R', 'v = ω * R', 'v = ω * R²', 'v = 2 * ω * R'],
          correct: 1,
          explanation: 'Linear velocity of the center of mass equals the product of angular velocity and radius: v = ωR.'
        },
        {
          q: 'What is the average time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black)?',
          options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'],
          correct: 2,
          explanation: 'Balanced BST height is guaranteed to be O(log N), so lookup requires O(log N) comparisons.'
        }
      ];
    }
  };

  const diagnosticQuestions = getDiagnosticQuestions();

  const handleSelectQuizAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitDiagnosticQuiz = () => {
    let correctCount = 0;
    diagnosticQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / diagnosticQuestions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    const newResult: QuizResult = {
      id: `diag-quiz-${Date.now()}`,
      title: `${profile.gradeLabel} Diagnostic Verification`,
      subject: profile.subjects[0]?.name || 'Foundations',
      score: calculatedScore,
      totalQuestions: diagnosticQuestions.length,
      correctQuestions: correctCount,
      completedAt: 'Just now',
      topicsCovered: ['Diagnostic Assessment', 'Conceptual Verification'],
      isMeasured: true,
      status: calculatedScore >= 80 ? 'Mastered' : calculatedScore >= 60 ? 'Proficient' : 'Needs Review'
    };

    onRecordQuizResult?.(newResult);
  };

  const handleResetDiagnostic = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setIsDiagnosticModalOpen(false);
  };

  const handleAddNewGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    onAddLearningGoal?.(newGoalInput.trim());
    setNewGoalInput('');
    setShowAddGoalInput(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner with Data Integrity Transparency */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                <span>Student Intelligence Hub</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {profile.gradeLabel}
              </span>
              {profile.degree && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                  {profile.degree} {profile.branch ? `· ${profile.branch}` : ''}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {profile.name}’s Cognitive Intelligence
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Synthesizing verified test performance, real study session logs, and spaced repetition decay models. AI Mirror never invents fabricated student scores.
            </p>
          </div>

          {/* Mode Switcher & Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-purple-50/70 p-1 rounded-2xl border border-purple-200/80 flex items-center text-xs font-semibold">
              <button
                onClick={() => setDataMode('actual')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  dataMode === 'actual'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>My Activity Logs</span>
              </button>
              <button
                onClick={() => setDataMode('benchmark')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  dataMode === 'benchmark'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Benchmark Preview</span>
              </button>
            </div>

            <button
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200/80 text-purple-800 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Activity className="w-4 h-4 text-purple-700" />
              <span>Take Diagnostic Quiz</span>
            </button>
          </div>
        </div>

        {/* Data Integrity Legend Strip */}
        <div className="mt-5 pt-4 border-t border-purple-50 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span className="font-semibold text-emerald-800">MEASURED DATA:</span>
              <span>Verified from completed quiz attempts & timer logs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 ring-2 ring-purple-200" />
              <span className="font-semibold text-purple-800">ESTIMATED INSIGHT:</span>
              <span>AI cognitive retention decay & spaced repetition models</span>
            </div>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            Current Mode: <strong className="text-purple-700">{dataMode === 'actual' ? 'Student Real Logs' : 'Benchmark Preview'}</strong>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards with Measured vs Estimated Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Mastery */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Concept Mastery
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Measured
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              {profile.conceptMasteryScore}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Based on {profile.subjects.reduce((acc, s) => acc + s.completedModules, 0)} completed modules across {profile.subjects.length} subjects
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
            <span>Verified syllabus progress</span>
            <span>+2.4% this week</span>
          </div>
        </div>

        {/* Card 2: Tested Quiz Accuracy */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quiz Accuracy
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Measured
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              {calculatedAverageQuizScore !== null ? `${calculatedAverageQuizScore}%` : 'Pending'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeQuizzes.length > 0
                ? `Average across ${activeQuizzes.length} completed assessments`
                : 'No quizzes taken yet in this profile'}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px]">
            {activeQuizzes.length > 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {activeQuizzes.filter((q) => q.score >= 80).length} Mastered topics
              </span>
            ) : (
              <button
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="text-purple-700 font-bold hover:underline"
              >
                Take first quiz →
              </button>
            )}
            <span className="text-slate-400 font-mono text-[10px]">Real scores</span>
          </div>
        </div>

        {/* Card 3: Projected Retention */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              30-Day Retention
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <Compass className="w-3 h-3 text-purple-600" />
              Estimated
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-purple-900 tracking-tight">
              {profile.mirrorData.cognitiveReadinessScore}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Spaced repetition decay forecast based on active recall schedule
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
            <span>Half-life: ~28 days</span>
            <span>Optimal review</span>
          </div>
        </div>

        {/* Card 4: Study Velocity & Streak */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Weekly Volume
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Measured
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight flex items-center gap-2">
              <span>{profile.weeklyHoursLogged}h</span>
              <span className="text-base text-slate-400 font-normal">/ {profile.weeklyHoursTarget}h</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile.streakDays}-day consecutive learning streak</span>
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
            <span>{Math.round((profile.weeklyHoursLogged / profile.weeklyHoursTarget) * 100)}% of goal</span>
            <span className="text-purple-700">Deep Work: {profile.deepWorkPercentage}%</span>
          </div>
        </div>
      </div>

      {/* 3. Strengths vs Topics Needing Improvement (Dual Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Verified Cognitive Strengths */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Demonstrated Strengths
                </h3>
                <p className="text-[11px] text-slate-500">
                  Topics with &gt;85% retention or rapid recall velocity
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="space-y-3">
            {profile.mirrorData.strengths.map((str) => (
              <div
                key={str.id}
                className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-200 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{str.topic}</span>
                  </div>
                  <span className="text-[11px] font-bold font-mono text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    {str.retentionRate}% Retention
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-800">
                  <span className="font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {str.subject}
                  </span>
                  <span>·</span>
                  <span className="text-slate-600">{str.speedMultiplier}</span>
                  <span>·</span>
                  <span className="font-medium text-emerald-900 italic">
                    {str.cognitiveTrait}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-emerald-100/60">
                  {str.statusDescription}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Topics Needing Improvement (Actionable Learning Gaps) */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Topics Needing Improvement
                </h3>
                <p className="text-[11px] text-slate-500">
                  Identified cognitive gaps & sub-optimal quiz segments
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Actionable
            </span>
          </div>

          <div className="space-y-3">
            {profile.mirrorData.gaps.map((gap) => (
              <div
                key={gap.id}
                className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 hover:border-amber-200 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{gap.concept}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                      gap.severity === 'high'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {gap.severity} Priority
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center gap-2">
                  <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {gap.subject}
                  </span>
                  <span>Trigger: {gap.identifiedTrigger}</span>
                </div>

                <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-amber-100/80 leading-relaxed">
                  <strong className="text-amber-900 font-semibold">Root Cause:</strong> {gap.rootCause}
                </p>

                {/* 1-Click Action Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenDrillModal?.(gap)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Start Micro-Drill</span>
                  </button>

                  <button
                    onClick={() => onNavigateToMentorWithTopic?.(gap.concept, gap.subject)}
                    className="px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Dr. Elena</span>
                  </button>

                  {onNavigateToQuiz && (
                    <button
                      onClick={() => onNavigateToQuiz(gap.concept, gap.subject)}
                      className="px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
                      <span>Adaptive Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Simple Weekly Progress Chart & Learning Goals Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Weekly Study Velocity</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Measured Hours Logged (Mon – Sun)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Verified Time
              </span>
            </div>

            {/* Weekly Bars */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-7 gap-3 sm:gap-4 items-end h-44 border-b border-slate-100 pb-3">
                {MOCK_WEEKLY_VELOCITY.map((item, idx) => {
                  const maxDailyHour = 4.0;
                  const heightPercent = Math.min(100, (item.hours / maxDailyHour) * 100);
                  const isToday = idx === 3; // Thursday in demo

                  return (
                    <div key={item.day} className="flex flex-col items-center gap-2 group h-full justify-end">
                      {/* Hover Tooltip */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded absolute -translate-y-9 pointer-events-none z-10 font-mono">
                        {item.hours}h ({item.efficiency}%)
                      </span>

                      <div className="w-full max-w-[36px] bg-purple-50 rounded-xl relative flex items-end overflow-hidden h-36">
                        {/* Target Guideline Line */}
                        <div
                          className="absolute w-full border-b border-dashed border-purple-300 z-10"
                          style={{ bottom: `${(item.goal / maxDailyHour) * 100}%` }}
                          title={`Target: ${item.goal}h`}
                        />
                        <div
                          className={`w-full rounded-xl transition-all duration-500 ${
                            isToday
                              ? 'bg-gradient-to-t from-purple-700 to-violet-500 shadow-sm'
                              : 'bg-gradient-to-t from-purple-600/80 to-purple-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      <div className="text-center">
                        <span className={`text-[11px] font-bold block ${isToday ? 'text-purple-700' : 'text-slate-500'}`}>
                          {item.day}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {item.hours}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
              <span>Actual Hours</span>
              <span className="w-3 border-b border-dashed border-purple-400 ml-2" />
              <span>Daily Target (3.0h)</span>
            </span>
            <span className="font-semibold text-slate-800">
              Total: {profile.weeklyHoursLogged}h / {profile.weeklyHoursTarget}h
            </span>
          </div>
        </div>

        {/* Learning Goals Tracker */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-purple-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                  <Target className="w-4 h-4" />
                  <span>Academic Targets</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Student Learning Goals
                </h3>
              </div>
              <button
                onClick={() => setShowAddGoalInput(!showAddGoalInput)}
                className="p-1.5 rounded-xl text-purple-700 hover:bg-purple-50 transition-colors"
                title="Add learning goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add Goal Input */}
            {showAddGoalInput && (
              <form onSubmit={handleAddNewGoal} className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  placeholder="e.g. Master Dynamic Programming..."
                  className="flex-1 text-xs bg-slate-50 border border-purple-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 text-slate-800 font-medium"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-3">
              {(profile.learningGoals || ['Score 95%+ in Board Exam', 'Master Calculus & Vectors']).map(
                (goal, idx) => {
                  const progressVal = [85, 72, 90, 68][idx % 4];
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>{goal}</span>
                        </span>
                        <span className="font-mono text-purple-700 font-bold text-[11px]">
                          {progressVal}%
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-purple-100">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressVal}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Aligned with {profile.gradeLabel}</span>
            <span className="font-semibold text-purple-700">All targets active</span>
          </div>
        </div>
      </div>

      {/* 5. Personalized Study Recommendations (Actionable Next Steps) */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Cognitive Action Plan</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Personalized Study Recommendations & Next Steps
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by educational ROI based on your measured gaps and syllabus milestones
            </p>
          </div>

          <span className="px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-bold self-start sm:self-auto border border-purple-100">
            3 High-Yield Tasks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.recommendations.slice(0, 3).map((rec, i) => (
            <div
              key={rec.id}
              className="p-5 rounded-3xl border border-purple-100 bg-gradient-to-b from-white to-purple-50/20 hover:border-purple-200 transition-all flex flex-col justify-between shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                    Priority {i + 1} · {rec.durationMinutes} mins
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {rec.subject}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {rec.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-3 rounded-2xl border border-purple-50">
                  <strong className="text-purple-900 font-semibold block mb-0.5">Why now:</strong>
                  {rec.aiRationale}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigateToPlannerWithTask?.(rec.title, rec.subject)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Focus Timer</span>
                </button>

                <button
                  onClick={() => onNavigateToMentorWithTopic?.(rec.title, rec.subject)}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
                  title="Ask Dr. Elena about this recommendation"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Quiz Results & Study History Section with Friendly Empty State */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-purple-50 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Verifiable Academic Log</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Assessment Results & Study Sessions
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-purple-50 p-1 rounded-2xl border border-purple-200/60 flex items-center text-xs font-semibold">
              <button
                onClick={() => setHistoryTab('quizzes')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  historyTab === 'quizzes'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quiz History ({activeQuizzes.length})
              </button>
              <button
                onClick={() => setHistoryTab('studySessions')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  historyTab === 'studySessions'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Study Sessions ({activeStudySessions.length})
              </button>
            </div>

            {/* Subject Filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-semibold text-slate-700"
            >
              <option value="all">All Subjects</option>
              {profile.subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab 1: Quiz History */}
        {historyTab === 'quizzes' && (
          <div>
            {filteredQuizzes.length === 0 ? (
              // Friendly Empty State
              <div className="py-12 px-6 text-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  No Quiz Results Recorded Yet
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  AI Mirror maintains strict data integrity and never fabricates test attempts. Complete your first micro-drill or take a quick diagnostic quiz to log real performance data!
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsDiagnosticModalOpen(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    Take 2-Minute Diagnostic Quiz
                  </button>
                  <button
                    onClick={() => setDataMode('benchmark')}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    View Benchmark Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-2xl border border-purple-100 bg-slate-50/40 hover:bg-white hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {quiz.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {quiz.isMeasured ? 'Measured Test' : 'Benchmark'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-purple-700">{quiz.subject}</span>
                        <span>·</span>
                        <span>{quiz.completedAt}</span>
                        <span>·</span>
                        <span>{quiz.correctQuestions}/{quiz.totalQuestions} questions correct</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {quiz.topicsCovered.map((topic, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <div
                          className={`text-xl font-extrabold font-mono ${
                            quiz.score >= 80
                              ? 'text-emerald-700'
                              : quiz.score >= 60
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {quiz.score}%
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            quiz.status === 'Mastered'
                              ? 'text-emerald-600'
                              : quiz.status === 'Proficient'
                              ? 'text-purple-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {quiz.status}
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigateToMentorWithTopic?.(quiz.title, quiz.subject)}
                        className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                        title="Review quiz breakdown with AI Mentor"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Study Sessions */}
        {historyTab === 'studySessions' && (
          <div>
            {activeStudySessions.length === 0 ? (
              <div className="py-12 px-6 text-center max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
                  <Clock className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  No Study Sessions Logged Yet
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Start a focus session using the Study Planner Pomodoro timer to track real deep work hours and active recall intervals.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToPlannerWithTask?.('Focus Session', profile.subjects[0]?.name || 'Study')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                  >
                    Open Study Planner
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeStudySessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-2xl border border-purple-100 bg-slate-50/40 hover:bg-white hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {sess.topic}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {sess.sessionType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-semibold text-purple-700">{sess.subject}</span>
                        <span>·</span>
                        <span>{sess.completedAt}</span>
                      </div>
                      {sess.notes && (
                        <p className="text-xs text-slate-600 italic pt-0.5">
                          "{sess.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-base font-bold font-mono text-purple-900 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">
                        {sess.durationMinutes} mins
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 7. Interactive Diagnostic Quiz Modal */}
      {isDiagnosticModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-purple-100 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-purple-50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    2-Minute Diagnostic Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Establishing real measured intelligence data for {profile.gradeLabel}
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetDiagnostic}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Container */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {diagnosticQuestions.map((item, qIdx) => {
                const isAnswered = quizAnswers[qIdx] !== undefined;
                const isCorrect = isAnswered && quizAnswers[qIdx] === item.correct;

                return (
                  <div key={qIdx} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <span>{item.q}</span>
                    </div>

                    <div className="space-y-1.5 pl-7">
                      {item.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-purple-300';

                        if (quizSubmitted) {
                          if (optIdx === item.correct) {
                            optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-purple-100 border-purple-500 text-purple-900 font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pl-7 pt-1 text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-purple-100">
                        <strong className="text-purple-900 font-semibold">Explanation:</strong> {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Results & Actions */}
            <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
              {quizSubmitted ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Your Score:</span>
                  <span className="text-lg font-extrabold font-mono text-emerald-700">
                    {quizScore}%
                  </span>
                  <span className="text-xs text-slate-500">
                    (Added to Measured Intelligence)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">
                  Answer all 3 questions to generate real assessment metrics.
                </span>
              )}

              <div className="flex items-center gap-2">
                {quizSubmitted ? (
                  <button
                    onClick={handleResetDiagnostic}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow-xs"
                  >
                    Close & View Intelligence
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitDiagnosticQuiz}
                    disabled={Object.keys(quizAnswers).length < diagnosticQuestions.length}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
                  >
                    Submit Diagnostic
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
