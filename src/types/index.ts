export type NavTab = 
  | 'dashboard'
  | 'intelligence'
  | 'learning'
  | 'progress'
  | 'planner'
  | 'quiz'
  | 'mentor'
  | 'settings';

export type GradeLevelId = 
  | 'primary'      // Class 1 - 5
  | 'middle'       // Class 6 - 8
  | 'secondary'    // Class 9 - 10
  | 'senior'       // Class 11 - 12 (STEM / Pre-College)
  | 'diploma'      // Diploma / Polytechnic
  | 'undergrad'    // Undergraduate (B.Tech, B.Sc, etc.)
  | 'postgrad';    // Postgraduate (M.Tech, MBA, etc.)

export interface GradeConfig {
  id: GradeLevelId;
  label: string;
  sublabel: string;
  badge: string;
  tagline: string;
}

export interface OnboardingFormData {
  name: string;
  educationLevel: GradeLevelId;
  currentClassOrCourse: string;
  schoolOrCollege: string;
  degree?: string;
  branch?: string;
  semester?: string;
  selectedSubjects: string[];
  learningGoals: string[];
  weeklyHoursTarget: number;
  pedagogyStyle: 'visual' | 'socratic' | 'rigorous';
}

export interface CognitiveStrength {
  id: string;
  topic: string;
  subject: string;
  retentionRate: number; // e.g. 96
  speedMultiplier: string; // e.g. "1.4x faster recall"
  cognitiveTrait: string; // e.g. "Spatial conceptualization", "First-principles deduction"
  statusDescription: string;
  isMeasured?: boolean; // verified via quiz/assessment
}

export interface LearningGap {
  id: string;
  concept: string;
  subject: string;
  severity: 'high' | 'medium' | 'low';
  identifiedTrigger: string;
  rootCause: string;
  recommendedAction: string;
  isMeasured?: boolean; // verified via student test logs
  drillProblem: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LearningPaceMetric {
  domain: string;
  paceScore: number; // 0 - 100
  paceStatus: string; // e.g. "+24% faster", "Deliberate & deep", "Optimal"
  retentionHalfLifeDays: number;
  reflectionNote: string;
  isMeasured?: boolean;
}

export interface AIMirrorData {
  reflectionSummary: string;
  lastScannedAt: string;
  cognitiveReadinessScore: number; // 0 - 100
  strengths: CognitiveStrength[];
  gaps: LearningGap[];
  paceMetrics: LearningPaceMetric[];
}

export interface SubjectProgress {
  id: string;
  name: string;
  category: string;
  masteryPercentage: number;
  completedModules: number;
  totalModules: number;
  weeklyHours: number;
  recentScore: number;
  color: string;
  isMeasured?: boolean;
}

export interface DailyRecommendation {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  aiRationale: string;
  urgency: 'high' | 'medium' | 'normal';
  completed: boolean;
  topicTag: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  dueDate: string;
  type: 'Quiz' | 'Assignment' | 'Milestone' | 'Revision';
  estimatedMinutes: number;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  completedAt?: string;
  isRecommendedRevision?: boolean;
  revisionReason?: string;
  notes?: string;
  scheduledTime?: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  subject: string;
  timestamp: string;
  scoreOrDetail: string;
  positive: boolean;
  isMeasured?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
  tierLabel?: string;
}

export interface QuizIncorrectRecord {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface QuizResult {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctQuestions: number;
  completedAt: string;
  topicsCovered: string[];
  isMeasured: boolean; // true = actual student quiz attempt
  status: 'Mastered' | 'Proficient' | 'Needs Review';
  difficultyTierReached?: string;
  incorrectQuestions?: QuizIncorrectRecord[];
  recommendedRevisionTopics?: string[];
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  completedAt: string;
  sessionType: 'Deep Work' | 'Problem Solving' | 'Spaced Recall' | 'Concept Review';
  isMeasured: boolean;
  notes?: string;
}

export interface StudentProfile {
  name: string;
  role: string;
  avatarInitials: string;
  gradeId: GradeLevelId;
  gradeLabel: string;
  schoolOrProgram: string;
  currentClassOrCourse?: string;
  degree?: string;
  branch?: string;
  semester?: string;
  learningGoals?: string[];
  streakDays: number;
  weeklyHoursLogged: number;
  weeklyHoursTarget: number;
  conceptMasteryScore: number;
  deepWorkPercentage: number;
  mirrorData: AIMirrorData;
  subjects: SubjectProgress[];
  recommendations: DailyRecommendation[];
  tasks: UpcomingTask[];
  recentActivities: RecentActivity[];
  quizResults?: QuizResult[];
  studyHistory?: StudySession[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'mirror' | 'reminder' | 'achievement' | 'mentor';
}
