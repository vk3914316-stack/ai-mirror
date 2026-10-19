import React, { useState, useMemo } from 'react';
import { StudentProfile, QuizResult, QuizQuestion, QuizIncorrectRecord, UpcomingTask } from '../../types';
import {
  CURRICULUM_QUESTION_BANK,
  buildAdaptiveQuiz,
  computeTopicMastery,
  getQuestionsForCurriculum
} from '../../utils/quizEngine';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  Play,
  Filter,
  Check,
  Zap,
  Target,
  ChevronRight,
  Info
} from 'lucide-react';

interface AdaptiveQuizViewProps {
  profile: StudentProfile;
  initialSubject?: string | null;
  initialTopic?: string | null;
  onRecordQuizResult: (result: QuizResult) => void;
  onNavigateToMentor: (topic: string, subject: string) => void;
  onAddRevisionTask: (task: UpcomingTask) => void;
  onClearInitialTrigger?: () => void;
}

export const AdaptiveQuizView: React.FC<AdaptiveQuizViewProps> = ({
  profile,
  initialSubject,
  initialTopic,
  onRecordQuizResult,
  onNavigateToMentor,
  onAddRevisionTask,
  onClearInitialTrigger
}) => {
  // Step in quiz lifecycle: 'setup' | 'active' | 'summary'
  const [viewState, setViewState] = useState<'setup' | 'active' | 'summary'>('setup');

  // Setup configuration state
  const defaultSubject = initialSubject || profile.subjects[0]?.name || 'Mathematics';
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic || '');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [quizMode, setQuizMode] = useState<'adaptive' | 'easy' | 'medium' | 'hard'>('adaptive');
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentTier, setCurrentTier] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [adaptiveHistory, setAdaptiveHistory] = useState<string[]>([]);
  const [lastAdaptationNote, setLastAdaptationNote] = useState<string>('Quiz initialized at Tier 2 (Intermediate Application)');
  const [userAnswersRecord, setUserAnswersRecord] = useState<
    {
      question: QuizQuestion;
      selectedOption: number;
      isCorrect: boolean;
      tierAtTime: 'easy' | 'medium' | 'hard';
    }[]
  >([]);

  // Completed quiz result
  const [completedResult, setCompletedResult] = useState<QuizResult | null>(null);
  const [addedTasksMap, setAddedTasksMap] = useState<Record<string, boolean>>({});

  // History filtering
  const [historyFilterSubject, setHistoryFilterSubject] = useState<string>('All');

  // Compute available topics for the active grade and subject
  const availableCurriculumQuestions = useMemo(() => {
    return getQuestionsForCurriculum(profile.gradeId, selectedSubject);
  }, [profile.gradeId, selectedSubject]);

  const suggestedTopics = useMemo(() => {
    const set = new Set<string>();
    [
      ...availableCurriculumQuestions.easy,
      ...availableCurriculumQuestions.medium,
      ...availableCurriculumQuestions.hard
    ].forEach((q) => {
      if (q.topic) set.add(q.topic);
    });
    // Add topics from profile gaps if relevant
    profile.mirrorData.gaps.forEach((g) => {
      if (g.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
        set.add(g.concept);
      }
    });
    return Array.from(set);
  }, [availableCurriculumQuestions, profile.mirrorData.gaps, selectedSubject]);

  // Measured quiz history from profile
  const quizHistory: QuizResult[] = useMemo(() => {
    return profile.quizResults || [];
  }, [profile.quizResults]);

  // Topic mastery stats computed from real history
  const topicMasteryList = useMemo(() => {
    return computeTopicMastery(quizHistory);
  }, [quizHistory]);

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (historyFilterSubject === 'All') return quizHistory;
    return quizHistory.filter((h) => h.subject.toLowerCase() === historyFilterSubject.toLowerCase());
  }, [quizHistory, historyFilterSubject]);

  // Start new quiz handler
  const handleStartQuiz = async () => {
    setIsLoadingQuiz(true);
    const topicToUse = customTopic.trim() || selectedTopic || suggestedTopics[0] || 'Core Curriculum';

    // Attempt online generation via Gemini if available, or build from question bank
    let generatedQuestions: QuizQuestion[] = [];
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeLabel: profile.gradeLabel,
          subject: selectedSubject,
          topic: topicToUse,
          difficulty: quizMode,
          questionCount
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          generatedQuestions = data.questions.map((q: any, i: number) => ({
            id: q.id || `gemini-q-${i}-${Date.now()}`,
            question: q.question,
            options: q.options as [string, string, string, string],
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            topic: q.topic || topicToUse,
            difficulty: q.difficulty || 'medium',
            tierLabel: q.tierLabel || 'Tier 2: Intermediate'
          }));
        }
      }
    } catch {
      // Fallback to local curriculum engine
    }

    if (generatedQuestions.length === 0) {
      generatedQuestions = buildAdaptiveQuiz({
        gradeId: profile.gradeId,
        gradeLabel: profile.gradeLabel,
        subject: selectedSubject,
        topic: topicToUse,
        questionCount,
        mode: quizMode
      });
    }

    setActiveQuestions(generatedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentScore(0);
    setCurrentTier('medium');
    setAdaptiveHistory(['Tier 2: Intermediate']);
    setLastAdaptationNote('Quiz initialized at Tier 2 (Intermediate Application)');
    setUserAnswersRecord([]);
    setCompletedResult(null);
    setAddedTasksMap({});
    setIsLoadingQuiz(false);
    setViewState('active');

    if (onClearInitialTrigger) {
      onClearInitialTrigger();
    }
  };

  // Option selection
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  // Submit current question
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;
    const newScore = isCorrect ? currentScore + 1 : currentScore;

    setIsAnswerSubmitted(true);
    setCurrentScore(newScore);

    // Record answer
    setUserAnswersRecord((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedOption,
        isCorrect,
        tierAtTime: currentTier
      }
    ]);

    // Calculate adaptive difficulty shift for next question
    if (quizMode === 'adaptive') {
      if (isCorrect) {
        if (currentTier === 'easy') {
          setCurrentTier('medium');
          setLastAdaptationNote('Leveled up to Tier 2 (Application) based on your correct answer!');
          setAdaptiveHistory((prev) => [...prev, 'Tier 2: Intermediate']);
        } else if (currentTier === 'medium') {
          setCurrentTier('hard');
          setLastAdaptationNote('Leveled up to Tier 3 (Advanced Rigor) based on your high accuracy!');
          setAdaptiveHistory((prev) => [...prev, 'Tier 3: Advanced']);
        } else {
          setLastAdaptationNote('Maintained at Tier 3 (Advanced Rigor) – Excellent mastery!');
        }
      } else {
        if (currentTier === 'hard') {
          setCurrentTier('medium');
          setLastAdaptationNote('Adapted to Tier 2 (Intermediate) to consolidate problem-solving steps.');
          setAdaptiveHistory((prev) => [...prev, 'Tier 2: Intermediate']);
        } else if (currentTier === 'medium') {
          setCurrentTier('easy');
          setLastAdaptationNote('Adapted to Tier 1 (Foundations) to diagnose core principles.');
          setAdaptiveHistory((prev) => [...prev, 'Tier 1: Foundations']);
        } else {
          setLastAdaptationNote('Reinforcing Tier 1 (Foundational Concepts) for clarity.');
        }
      }
    }
  };

  // Next Question or Finish Quiz
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed all questions: finalize result
      const total = activeQuestions.length;
      const finalScorePercentage = Math.round((currentScore / total) * 100);

      // Extract incorrect questions and recommendations
      const incorrect: QuizIncorrectRecord[] = [];
      const weakTopics = new Set<string>();

      userAnswersRecord.forEach((rec) => {
        if (!rec.isCorrect) {
          incorrect.push({
            question: rec.question.question,
            yourAnswer: rec.question.options[rec.selectedOption],
            correctAnswer: rec.question.options[rec.question.correctIndex],
            explanation: rec.question.explanation,
            topic: rec.question.topic
          });
          weakTopics.add(rec.question.topic);
        }
      });

      const result: QuizResult = {
        id: `quiz-${Date.now()}`,
        title: `${selectedSubject} Adaptive Assessment: ${selectedTopic || 'Core Curriculum'}`,
        subject: selectedSubject,
        topic: selectedTopic || 'Core Curriculum',
        score: finalScorePercentage,
        totalQuestions: total,
        correctQuestions: currentScore,
        completedAt: 'Just now',
        topicsCovered: Array.from(new Set(activeQuestions.map((q) => q.topic))),
        isMeasured: true,
        status:
          finalScorePercentage >= 85
            ? 'Mastered'
            : finalScorePercentage >= 65
            ? 'Proficient'
            : 'Needs Review',
        difficultyTierReached:
          currentTier === 'hard'
            ? 'Tier 3 (Advanced Rigor)'
            : currentTier === 'medium'
            ? 'Tier 2 (Intermediate)'
            : 'Tier 1 (Foundations)',
        incorrectQuestions: incorrect,
        recommendedRevisionTopics: Array.from(weakTopics)
      };

      setCompletedResult(result);
      onRecordQuizResult(result);
      setViewState('summary');
    }
  };

  // Add revision task directly into student planner
  const handleAddRevisionTask = (topic: string) => {
    const task: UpcomingTask = {
      id: `rev-task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `Priority Revision: ${topic}`,
      subject: selectedSubject,
      topic,
      dueDate: 'Tomorrow',
      type: 'Revision',
      estimatedMinutes: 25,
      priority: 'high',
      completed: false,
      isRecommendedRevision: true,
      revisionReason: `Recommended based on adaptive quiz diagnostic in ${selectedSubject}.`
    };

    onAddRevisionTask(task);
    setAddedTasksMap((prev) => ({ ...prev, [topic]: true }));
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Top Header Banner */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Cognitive Evaluation & Adaptive Drills</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Adaptive Curriculum Quizzes
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Dynamically scales question difficulty to your responses. Every attempt persistently records measured mastery in your Student Intelligence ledger.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase text-purple-600 block">Education Level</span>
              <span className="text-xs font-extrabold font-mono text-purple-900">
                {profile.gradeLabel}
              </span>
            </div>
            <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase text-violet-600 block">Measured Quizzes</span>
              <span className="text-xl font-extrabold font-mono text-violet-900">
                {quizHistory.length}
              </span>
            </div>
          </div>
        </div>

        {/* View State Switcher (when not active in a quiz) */}
        {viewState !== 'active' && (
          <div className="flex items-center gap-2 mt-6 pt-5 border-t border-purple-100">
            <button
              onClick={() => setViewState('setup')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewState === 'setup'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Launch New Quiz</span>
            </button>
            <button
              onClick={() => setViewState('summary')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewState === 'summary'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Quiz History & Diagnostics ({quizHistory.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SETUP SCREEN                                                          */}
      {/* ========================================================================= */}
      {viewState === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Parameters */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-purple-50 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Configure Adaptive Assessment</span>
              </h2>
              <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg font-semibold border border-purple-100">
                Level: {profile.gradeLabel}
              </span>
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                1. Select Academic Subject
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(s.name);
                      setSelectedTopic('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedSubject.toLowerCase() === s.name.toLowerCase()
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-purple-100 hover:border-purple-300'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                2. Choose Curriculum Topic or Identified Gap
              </label>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((top) => (
                  <button
                    key={top}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(top);
                      setCustomTopic('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      selectedTopic === top && !customTopic
                        ? 'bg-purple-100 text-purple-900 border-purple-400 font-bold'
                        : 'bg-purple-50/50 text-slate-600 border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>

              {/* Or Custom Topic Input */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Or enter any custom topic (e.g., Carnot Heat Engines, Limits, SQL Normalization)..."
                  value={customTopic}
                  onChange={(e) => {
                    setCustomTopic(e.target.value);
                    if (e.target.value) setSelectedTopic('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Question Count & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  3. Question Volume
                </label>
                <div className="flex items-center gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        questionCount === num
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-slate-600 border-purple-100 hover:bg-purple-50'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  4. Assessment Engine
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuizMode('adaptive')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      quizMode === 'adaptive'
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Adaptive Scaling</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuizMode('hard')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      quizMode === 'hard'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-600 border-purple-100 hover:bg-purple-50'
                    }`}
                  >
                    Max Rigor
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 border-t border-purple-50 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>All questions contain 4 options and verified explanations</span>
              </div>
              <button
                onClick={handleStartQuiz}
                disabled={isLoadingQuiz}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
              >
                {isLoadingQuiz ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Adaptive Drill...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Adaptive Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Adaptive Intelligence Info */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-violet-700 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">
                  How Adaptive Scaling Works
                </h3>
                <ul className="text-xs text-purple-100 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 shrink-0" />
                    <span>
                      <strong>Dynamic Tiering:</strong> Starts at Tier 2. Correct answers trigger Tier 3 multi-step analysis; missed questions trigger Tier 1 diagnostic foundations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 mt-1.5 shrink-0" />
                    <span>
                      <strong>Immediate Socratic Feedback:</strong> Explanations unpack the underlying derivation after every submit.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300 mt-1.5 shrink-0" />
                    <span>
                      <strong>Verified Persistence:</strong> Unlocks tailored revision tasks in your Study Planner and updates your Student Intelligence matrix.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Topic Mastery Snapshot */}
            <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                  Measured Topic Mastery
                </h4>
                <span className="text-[10px] text-purple-600 font-bold">
                  {topicMasteryList.length} Topics
                </span>
              </div>
              {topicMasteryList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No verified topic attempts yet. Complete a quiz to benchmark your accuracy.
                </p>
              ) : (
                <div className="space-y-2">
                  {topicMasteryList.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/60">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                          {item.topic}
                        </span>
                        <span
                          className={`font-bold font-mono text-[11px] ${
                            item.accuracy >= 80
                              ? 'text-emerald-700'
                              : item.accuracy >= 60
                              ? 'text-purple-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {item.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.accuracy >= 80
                              ? 'bg-emerald-500'
                              : item.accuracy >= 60
                              ? 'bg-purple-600'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ACTIVE QUIZ EXECUTION                                                  */}
      {/* ========================================================================= */}
      {viewState === 'active' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Header & Adaptive Status Bar */}
          <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-lg uppercase tracking-wider text-[10px]">
                  {selectedSubject}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                  {currentQ.topic}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-purple-700 font-mono">
                  Question {currentIndex + 1} of {activeQuestions.length}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Score: {currentScore}/{currentIndex + (isAnswerSubmitted ? 1 : 0)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-300"
                style={{
                  width: `${((currentIndex + (isAnswerSubmitted ? 1 : 0)) / activeQuestions.length) * 100}%`
                }}
              />
            </div>

            {/* Live Adaptive Indicator */}
            {quizMode === 'adaptive' && (
              <div className="p-2.5 bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-900 font-medium">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    <strong>Adaptive Engine:</strong> {currentQ.tierLabel || `Tier ${currentTier}`}
                  </span>
                </div>
                <span className="text-[11px] text-purple-700 italic hidden sm:inline">
                  {lastAdaptationNote}
                </span>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase text-purple-600 tracking-wider block mb-2">
                Question {currentIndex + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Four Options: A, B, C, D */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyles = 'border-purple-100 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50/30';
                let badgeContent: React.ReactNode = String.fromCharCode(65 + idx);

                if (isSelected && !isAnswerSubmitted) {
                  optionStyles = 'border-purple-600 bg-purple-50 text-purple-900 font-semibold ring-2 ring-purple-600/20';
                }

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    badgeContent = <Check className="w-4 h-4 text-emerald-600" />;
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'border-rose-400 bg-rose-50 text-rose-950 font-medium ring-2 ring-rose-400/20';
                    badgeContent = <XCircle className="w-4 h-4 text-rose-600" />;
                  } else {
                    optionStyles = 'border-slate-200 bg-slate-50/60 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected && !isAnswerSubmitted
                            ? 'bg-purple-600 text-white'
                            : isAnswerSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isAnswerSubmitted && isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {badgeContent}
                      </div>
                      <span className="leading-relaxed">{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider shrink-0 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        Correct Answer
                      </span>
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider shrink-0 bg-rose-100/80 px-2 py-0.5 rounded-md">
                        Your Choice
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clear Submit Button (before submission) */}
            {!isAnswerSubmitted && (
              <div className="pt-4 border-t border-purple-50 flex items-center justify-end">
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                >
                  <span>Submit Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Immediate Post-Answer Pedagogical Feedback */}
            {isAnswerSubmitted && (
              <div className="mt-6 pt-5 border-t border-purple-100 space-y-4 animate-in fade-in duration-200">
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {selectedOption === currentQ.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <span className="text-xs font-bold block">
                      {selectedOption === currentQ.correctIndex
                        ? 'Spot On! Correct answer.'
                        : 'Concept Misconception Detected.'}
                    </span>
                    <p className="text-xs leading-relaxed text-slate-700">
                      <strong>Pedagogical Explanation:</strong> {currentQ.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-bold text-slate-600 font-mono">
                    Current Running Score: {currentScore} / {currentIndex + 1} (
                    {Math.round((currentScore / (currentIndex + 1)) * 100)}%)
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                  >
                    <span>
                      {currentIndex + 1 < activeQuestions.length
                        ? 'Next Question'
                        : 'View Comprehensive Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPREHENSIVE POST-QUIZ DIAGNOSTIC SUMMARY                             */}
      {/* ========================================================================= */}
      {viewState === 'summary' && completedResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Main Score & Mastery Banner */}
          <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-700 ring-8 ring-purple-50/50 mb-1">
              {completedResult.score >= 80 ? (
                <Award className="w-8 h-8 text-emerald-600" />
              ) : completedResult.score >= 60 ? (
                <Sparkles className="w-8 h-8 text-purple-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
                Adaptive Assessment Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {completedResult.score}% Mastery Score
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {completedResult.correctQuestions} of {completedResult.totalQuestions} questions answered correctly · {completedResult.subject} ({completedResult.topic})
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  completedResult.status === 'Mastered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : completedResult.status === 'Proficient'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Status: {completedResult.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                Peak Rigor: {completedResult.difficultyTierReached || 'Tier 2'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Verified Measured Result
              </span>
            </div>
          </div>

          {/* Actionable Revision Recommendations based on Incorrect Answers */}
          {completedResult.incorrectQuestions && completedResult.incorrectQuestions.length > 0 ? (
            <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-rose-50 pb-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Recommended Topics for Targeted Revision
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg">
                  {completedResult.incorrectQuestions.length} Misconception{completedResult.incorrectQuestions.length > 1 ? 's' : ''} Identified
                </span>
              </div>

              <div className="space-y-4">
                {completedResult.incorrectQuestions.map((inc, i) => {
                  const isTaskAdded = addedTasksMap[inc.topic];
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-rose-50/30 border border-rose-100 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-purple-700 block">
                            Sub-concept: {inc.topic}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-800 mt-0.5">
                            {inc.question}
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-rose-100/60 rounded-xl text-rose-900">
                          <span className="font-bold block text-[10px] uppercase text-rose-700">Your Answer:</span>
                          <span>{inc.yourAnswer}</span>
                        </div>
                        <div className="p-2 bg-emerald-100/60 rounded-xl text-emerald-900">
                          <span className="font-bold block text-[10px] uppercase text-emerald-700">Correct Answer:</span>
                          <span>{inc.correctAnswer}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-rose-100 leading-relaxed">
                        <strong className="text-slate-800">Pedagogical Rationale:</strong> {inc.explanation}
                      </p>

                      {/* 1-Click Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isTaskAdded}
                          onClick={() => handleAddRevisionTask(inc.topic)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isTaskAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                          }`}
                        >
                          {isTaskAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added to Study Planner</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Add Revision Task to Study Planner</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onNavigateToMentor(inc.topic, completedResult.subject)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 transition-colors flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Consult Dr. Elena on this Topic</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-950">
                Flawless Accuracy — 100% Concept Mastery!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                No misconceptions identified in this session. You have demonstrated firm grasp of all tested sub-concepts for your curriculum tier.
              </p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
            <button
              onClick={() => {
                setViewState('setup');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Adaptive Quiz</span>
            </button>

            <button
              onClick={() => {
                setCompletedResult(null);
                setViewState('setup');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all flex items-center gap-2"
            >
              <span>Done & Return to Dashboard</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PERSISTENT QUIZ HISTORY & TOPIC PERFORMANCE SECTION                   */}
      {/* ========================================================================= */}
      {viewState !== 'active' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-50 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Verified Assessment Ledger</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Topic-Wise Mastery & Attempt History
              </h3>
            </div>

            {/* Subject Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {['All', ...profile.subjects.map((s) => s.name)].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setHistoryFilterSubject(sub)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    historyFilterSubject === sub
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Topic-Wise Aggregate Performance */}
          {topicMasteryList.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
                Topic-Wise Mastery Index (Real Performance Data)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topicMasteryList.map((tm, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-purple-700">{tm.subject}</span>
                        <span className="font-mono text-slate-400">{tm.attempts} attempt{tm.attempts > 1 ? 's' : ''}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {tm.topic}
                      </h4>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[11px] font-medium text-slate-600">Measured Accuracy</span>
                        <span
                          className={`font-bold font-mono ${
                            tm.accuracy >= 80
                              ? 'text-emerald-700'
                              : tm.accuracy >= 60
                              ? 'text-purple-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {tm.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            tm.accuracy >= 80
                              ? 'bg-emerald-500'
                              : tm.accuracy >= 60
                              ? 'bg-purple-600'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${tm.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Attempts List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
              Quiz Attempts ({filteredHistory.length})
            </span>

            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-purple-200 space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    No Recorded Quiz Attempts
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    AI Mirror never invents past student performance data. Launch your first adaptive quiz above to measure your baseline knowledge.
                  </p>
                </div>
                <button
                  onClick={() => setViewState('setup')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start First Quiz</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-purple-600" />
                          Measured
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="font-semibold text-purple-700">{item.subject}</span>
                        <span>·</span>
                        <span>{item.correctQuestions}/{item.totalQuestions} Questions</span>
                        <span>·</span>
                        <span>{item.completedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span
                          className={`text-lg font-extrabold font-mono ${
                            item.score >= 80
                              ? 'text-emerald-700'
                              : item.score >= 60
                              ? 'text-purple-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {item.score}%
                        </span>
                        <span className="block text-[10px] font-bold text-slate-400">
                          {item.status}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedSubject(item.subject);
                          setSelectedTopic(item.topic || '');
                          handleStartQuiz();
                        }}
                        className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                        title="Retake Quiz on this Topic"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
