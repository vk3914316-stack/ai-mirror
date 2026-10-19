import { GradeLevelId, OnboardingFormData, StudentProfile, SubjectProgress } from '../types';

export interface EducationLevelOption {
  id: GradeLevelId;
  label: string;
  sublabel: string;
  badge: string;
  description: string;
}

export const EDUCATION_LEVEL_OPTIONS: EducationLevelOption[] = [
  {
    id: 'primary',
    label: 'Class 1 – 5',
    sublabel: 'Primary Foundations',
    badge: 'Class 1–5',
    description: 'Number sense, phonics, visual stories, and foundational curiosity.'
  },
  {
    id: 'middle',
    label: 'Class 6 – 8',
    sublabel: 'Middle School',
    badge: 'Class 6–8',
    description: 'Pre-algebra, scientific fundamentals, logical reasoning, and structured writing.'
  },
  {
    id: 'secondary',
    label: 'Class 9 – 10',
    sublabel: 'Secondary & Board Prep',
    badge: 'Class 9–10',
    description: 'Rigorous conceptual depth, board exams (CBSE/ICSE/State), and foundational Olympiads.'
  },
  {
    id: 'senior',
    label: 'Class 11 – 12',
    sublabel: 'Senior Secondary',
    badge: 'Class 11–12',
    description: 'Stream-specific deep dive (STEM / Commerce / Arts), competitive exam readiness.'
  },
  {
    id: 'diploma',
    label: 'Diploma',
    sublabel: 'Polytechnic & Applied Tech',
    badge: 'Diploma',
    description: 'Practical engineering mechanics, applied laboratories, circuits, and technical drafting.'
  },
  {
    id: 'undergrad',
    label: 'Undergraduate',
    sublabel: 'College / University Degree',
    badge: 'Undergraduate',
    description: 'Higher education: choose your degree, branch/major, and semester.'
  },
  {
    id: 'postgrad',
    label: 'Postgraduate',
    sublabel: 'Master’s / Research Track',
    badge: 'Postgraduate',
    description: 'Advanced graduate study, thesis specializations, and independent inquiry.'
  }
];

export const COLLEGE_DEGREES = [
  'B.Tech / B.E (Engineering)',
  'B.Sc (Sciences)',
  'B.Com (Commerce & Finance)',
  'B.A (Arts & Humanities)',
  'BBA / BMS (Business & Management)',
  'BCA (Computer Applications)',
  'MBBS / BDS (Medical & Dental)',
  'B.Pharm (Pharmacy)',
  'B.Arch (Architecture)',
  'LLB (Law)'
];

export const COLLEGE_BRANCHES = [
  'Computer Science & Artificial Intelligence',
  'Data Science & Analytics',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil & Environmental Engineering',
  'Biotechnology & Bioinformatics',
  'Pre-Med & Clinical Sciences',
  'Economics & Econometrics',
  'Finance & Accounting',
  'Business Administration',
  'Physics & Applied Mathematics',
  'English & Comparative Literature',
  'Psychology & Cognitive Science'
];

export const COLLEGE_SEMESTERS = [
  'Semester 1 (1st Year)',
  'Semester 2 (1st Year)',
  'Semester 3 (2nd Year)',
  'Semester 4 (2nd Year)',
  'Semester 5 (3rd Year)',
  'Semester 6 (3rd Year)',
  'Semester 7 (Final Year)',
  'Semester 8 (Final Year)'
];

export const POSTGRAD_DEGREES = [
  'M.Tech / M.S (Technology & Engineering)',
  'MBA (Business Administration)',
  'M.Sc (Sciences & Analytics)',
  'M.A (Humanities & Social Sciences)',
  'MCA (Computer Applications)',
  'MD / MS (Medical Postgraduate)',
  'Ph.D / Doctoral Research'
];

export const POSTGRAD_SPECIALIZATIONS = [
  'Machine Learning & Deep Neural Systems',
  'Distributed Systems & Cloud Architecture',
  'VLSI & Embedded Systems',
  'Cybersecurity & Cryptography',
  'Corporate Finance & Quantitative Modeling',
  'Supply Chain & Operations Strategy',
  'Cognitive Neuroscience & AI',
  'Molecular Genetics & Drug Discovery',
  'Structural Engineering & Mechanics'
];

export const DIPLOMA_BRANCHES = [
  'Computer Engineering & IT',
  'Mechanical Engineering',
  'Electrical & Electronics Engineering',
  'Civil Engineering',
  'Automobile Engineering',
  'Electronics & Telecommunication',
  'Chemical Engineering'
];

export const DIPLOMA_YEARS = [
  '1st Year (Semester 1 / 2)',
  '2nd Year (Semester 3 / 4)',
  '3rd Year / Final (Semester 5 / 6)'
];

export const SENIOR_STREAMS = [
  'Science (PCM - Physics, Chemistry, Math)',
  'Science (PCB - Physics, Chemistry, Biology)',
  'Science (PCMB - Math & Biology)',
  'Commerce (with Mathematics)',
  'Commerce (without Mathematics)',
  'Humanities / Arts & Social Sciences'
];

export const SUGGESTED_SUBJECTS_BY_LEVEL: Record<GradeLevelId, string[]> = {
  primary: [
    'Mathematics & Numbers',
    'Science & Natural World',
    'English Language & Phonics',
    'Social & Environmental Studies',
    'Logic Puzzles & Creative Coding'
  ],
  middle: [
    'Mathematics & Pre-Algebra',
    'Physics Foundations',
    'Chemistry Foundations',
    'Biology & Ecosystems',
    'English Literature & Grammar',
    'History & Civics',
    'Geography',
    'Computer Science & Python'
  ],
  secondary: [
    'Mathematics (Algebra & Geometry)',
    'Physics (Mechanics & Light)',
    'Chemistry (Matter & Reactions)',
    'Biology (Life Processes & Genetics)',
    'English Language & Literature',
    'Social Science (History, Pol Sci, Geo)',
    'Computer Applications (Java / Python)'
  ],
  senior: [
    'Advanced Mathematics & Calculus',
    'Physics (Electromagnetism & Waves)',
    'Chemistry (Organic & Physical)',
    'Biology & Biotechnology',
    'Computer Science & Algorithms',
    'Accountancy & Financial Statements',
    'Economics & Statistics',
    'English Rhetoric & Composition'
  ],
  diploma: [
    'Applied Mathematics & Calculus',
    'Applied Physics & Thermodynamics',
    'Engineering Mechanics & Strength of Materials',
    'Electrical & Electronic Circuits',
    'Computer Programming & Data Structures',
    'Industrial Drawing & CAD',
    'Manufacturing Processes'
  ],
  undergrad: [
    'Data Structures & Algorithms',
    'Linear Algebra & Numerical Methods',
    'Operating Systems & Systems Programming',
    'Database Management Systems (DBMS)',
    'Computer Networks & Protocols',
    'Machine Learning & Artificial Intelligence',
    'Theory of Computation',
    'Software Engineering & System Design'
  ],
  postgrad: [
    'Advanced Deep Learning & Neural Architectures',
    'Statistical Inference & Probabilistic Models',
    'Distributed Systems & Consensus Protocols',
    'Research Methodology & Seminar Thesis',
    'Advanced Algorithm Analysis',
    'High Performance Computing'
  ]
};

export const COMMON_LEARNING_GOALS = [
  'Eliminate recurring conceptual blindspots and calculation errors',
  'Score 90%+ in upcoming semester and term assessments',
  'Build deep first-principles intuition rather than rote memorization',
  'Prepare for competitive entrance exams & Olympiads',
  'Improve problem-solving speed under timed conditions',
  'Establish a consistent 15+ hours weekly deep study habit',
  'Master high-yield derivation proofs and problem sets'
];

// Helper to generate initials from a student name
export function getInitials(name: string): string {
  if (!name.trim()) return 'AM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Subject color gradient generator
const COLOR_GRADIENTS = [
  'from-violet-600 to-purple-600',
  'from-purple-600 to-indigo-600',
  'from-fuchsia-600 to-purple-600',
  'from-violet-500 to-purple-700',
  'from-purple-500 to-violet-600',
  'from-indigo-600 to-purple-700',
  'from-violet-700 to-fuchsia-600'
];

export function generatePersonalizedProfile(
  formData: OnboardingFormData,
  existingProfile?: StudentProfile
): StudentProfile {
  const levelOption = EDUCATION_LEVEL_OPTIONS.find((l) => l.id === formData.educationLevel) || EDUCATION_LEVEL_OPTIONS[3];

  let displayGradeLabel = levelOption.label;
  if (formData.educationLevel === 'undergrad' && formData.degree) {
    const degreeShort = formData.degree.split('(')[0].trim();
    const branchShort = formData.branch ? `· ${formData.branch}` : '';
    const semShort = formData.semester ? `· ${formData.semester.split('(')[0].trim()}` : '';
    displayGradeLabel = `${degreeShort} ${branchShort} ${semShort}`.trim();
  } else if (formData.educationLevel === 'postgrad' && formData.degree) {
    const degreeShort = formData.degree.split('(')[0].trim();
    const branchShort = formData.branch ? `· ${formData.branch}` : '';
    displayGradeLabel = `${degreeShort} ${branchShort}`.trim();
  } else if (formData.educationLevel === 'diploma' && formData.branch) {
    displayGradeLabel = `Diploma · ${formData.branch}`;
  } else if (formData.currentClassOrCourse) {
    displayGradeLabel = `${formData.currentClassOrCourse} · ${levelOption.badge}`;
  }

  const subjectsToUse = formData.selectedSubjects.length > 0
    ? formData.selectedSubjects
    : SUGGESTED_SUBJECTS_BY_LEVEL[formData.educationLevel].slice(0, 4);

  const subjects: SubjectProgress[] = subjectsToUse.map((subjectName, idx) => ({
    id: `subj-${idx + 1}`,
    name: subjectName,
    category: `${levelOption.badge} Core`,
    masteryPercentage: Math.floor(82 + (idx * 3.5) % 15),
    completedModules: 14 + (idx * 2) % 8,
    totalModules: 20 + (idx % 4),
    weeklyHours: Number((3.5 + (idx * 0.8) % 3.0).toFixed(1)),
    recentScore: Math.floor(85 + (idx * 4) % 13),
    color: COLOR_GRADIENTS[idx % COLOR_GRADIENTS.length]
  }));

  const firstSubject = subjects[0]?.name || 'Core Foundations';
  const secondSubject = subjects[1]?.name || 'Analytical Reasoning';

  const defaultTasks = [
    {
      id: 'task-gen-1',
      title: `${firstSubject} Diagnostic Quiz & Review`,
      subject: firstSubject,
      dueDate: 'Tomorrow at 10:00 AM',
      type: 'Quiz' as const,
      estimatedMinutes: 40,
      priority: 'high' as const
    },
    {
      id: 'task-gen-2',
      title: `${secondSubject} Problem Set & Derivation Lab`,
      subject: secondSubject,
      dueDate: 'Friday at 5:00 PM',
      type: 'Assignment' as const,
      estimatedMinutes: 60,
      priority: 'medium' as const
    },
    {
      id: 'task-gen-3',
      title: 'Spaced Recall Flashcards & Concept Verification',
      subject: subjects[2]?.name || firstSubject,
      dueDate: 'Sunday at 8:00 PM',
      type: 'Revision' as const,
      estimatedMinutes: 30,
      priority: 'low' as const
    }
  ];

  const defaultRecommendations = [
    {
      id: 'rec-gen-1',
      title: `High-Yield Concept Drill: ${firstSubject}`,
      subject: firstSubject,
      durationMinutes: 25,
      aiRationale: `Addresses identified learning gap in ${firstSubject} to build strong conceptual retention.`,
      urgency: 'high' as const,
      completed: false,
      topicTag: 'Targeted Drill'
    },
    {
      id: 'rec-gen-2',
      title: `Spaced Review: Core Principles of ${secondSubject}`,
      subject: secondSubject,
      durationMinutes: 30,
      aiRationale: 'Predicted memory decay threshold reached. Timely review locks this into long-term memory.',
      urgency: 'medium' as const,
      completed: false,
      topicTag: 'Active Recall'
    },
    {
      id: 'rec-gen-3',
      title: 'Deliberate Problem Solving Session',
      subject: subjects[2]?.name || firstSubject,
      durationMinutes: 20,
      aiRationale: 'Strengthens procedural speed and minimizes sign-inversion / oversight tendencies.',
      urgency: 'normal' as const,
      completed: false,
      topicTag: 'Problem Set'
    }
  ];

  const mirrorSummary = `${formData.name.split(' ')[0]} demonstrates clear conceptual clarity in foundational frameworks of ${firstSubject}, showing fast deduction and strong pattern recognition. AI Mirror has flagged subtle recurring oversight tendencies when dealing with multi-step synthesis under timed conditions. Targeted micro-drills scheduled.`;

  return {
    name: formData.name.trim() || 'Student',
    role: 'Student',
    avatarInitials: getInitials(formData.name),
    gradeId: formData.educationLevel,
    gradeLabel: displayGradeLabel,
    schoolOrProgram: formData.schoolOrCollege.trim() || (formData.educationLevel === 'undergrad' ? 'University College' : 'Academic Institute'),
    currentClassOrCourse: formData.currentClassOrCourse,
    degree: formData.degree,
    branch: formData.branch,
    semester: formData.semester,
    learningGoals: formData.learningGoals.length > 0 ? formData.learningGoals : COMMON_LEARNING_GOALS.slice(0, 2),
    streakDays: existingProfile?.streakDays || 12,
    weeklyHoursLogged: existingProfile?.weeklyHoursLogged || 14.5,
    weeklyHoursTarget: formData.weeklyHoursTarget || 18.0,
    conceptMasteryScore: existingProfile?.conceptMasteryScore || 88.0,
    deepWorkPercentage: existingProfile?.deepWorkPercentage || 92,
    mirrorData: {
      reflectionSummary: mirrorSummary,
      lastScannedAt: 'Today at 08:30 AM',
      cognitiveReadinessScore: 92,
      strengths: [
        {
          id: 'str-p-1',
          topic: `Core Principles of ${firstSubject}`,
          subject: firstSubject,
          retentionRate: 95,
          speedMultiplier: '1.4x peer velocity',
          cognitiveTrait: 'First-Principles Synthesis',
          statusDescription: 'Consistent error-free multi-step deduction in under 90s.'
        },
        {
          id: 'str-p-2',
          topic: `Analytical Foundations in ${secondSubject}`,
          subject: secondSubject,
          retentionRate: 91,
          speedMultiplier: '1.3x velocity',
          cognitiveTrait: 'Structural Reasoning',
          statusDescription: 'High qualitative and quantitative problem-solving accuracy.'
        }
      ],
      gaps: [
        {
          id: 'gap-p-1',
          concept: `Multi-Step Synthesis in ${firstSubject}`,
          subject: firstSubject,
          severity: 'high' as const,
          identifiedTrigger: 'Oversight during combined operations under timed exam conditions',
          rootCause: 'Cognitive load during transition between symbolic and visual steps',
          recommendedAction: '3-minute deliberate step-by-step micro-drill',
          drillProblem: {
            question: `In ${firstSubject}, what is the foundational principle when evaluating multi-variable constraints?`,
            options: [
              'Verify boundary invariants before applying transformations',
              'Ignore boundary conditions until the final step',
              'Assume static equilibrium without checking rates',
              'Invert the direction of all vector fields'
            ],
            correctIndex: 0,
            explanation: 'Always verify boundary invariants first to ensure the domain constraints remain valid through every algebraic or conceptual step.'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Visual & Conceptual Mechanics',
          paceScore: 89,
          paceStatus: '24% faster than standard',
          retentionHalfLifeDays: 24,
          reflectionNote: 'Rapid internalization of visual schematics and intuitive models.'
        },
        {
          domain: 'Analytical & Symbolic Proofs',
          paceScore: 78,
          paceStatus: 'Deliberate & rigorous',
          retentionHalfLifeDays: 22,
          reflectionNote: 'Spends deliberate time verifying intermediate steps with high accuracy.'
        }
      ]
    },
    subjects,
    recommendations: defaultRecommendations,
    tasks: (existingProfile?.tasks && existingProfile.tasks.length > 0) ? existingProfile.tasks : defaultTasks,
    recentActivities: [
      {
        id: 'act-setup-1',
        action: 'Completed AI Mirror Onboarding Diagnostic',
        subject: `${displayGradeLabel} · Personalized Baseline`,
        timestamp: 'Just now',
        scoreOrDetail: 'Diagnostic Baseline Established',
        positive: true
      },
      {
        id: 'act-setup-2',
        action: 'Curated High-Yield Study Pathway',
        subject: `${subjects.length} Active Subjects Enrolled`,
        timestamp: '5 mins ago',
        scoreOrDetail: `${formData.weeklyHoursTarget || 18}h Weekly Goal Set`,
        positive: true
      }
    ],
    quizResults: existingProfile?.quizResults || [],
    studyHistory: existingProfile?.studyHistory || []
  };
}
