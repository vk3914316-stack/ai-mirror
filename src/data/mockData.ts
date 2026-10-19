import { GradeConfig, GradeLevelId, NotificationItem, StudentProfile, QuizResult, StudySession } from '../types';

export const GRADE_CONFIGS: GradeConfig[] = [
  {
    id: 'primary',
    label: 'Class 1 – 5',
    sublabel: 'Foundations & Curiosity',
    badge: 'Primary',
    tagline: 'Visual discovery, phonics mastery, number sense, and gamified problem-solving.'
  },
  {
    id: 'middle',
    label: 'Class 6 – 8',
    sublabel: 'Middle School Explorer',
    badge: 'Middle School',
    tagline: 'Abstract reasoning, scientific method, algebraic foundations, and structured writing.'
  },
  {
    id: 'secondary',
    label: 'Class 9 – 10',
    sublabel: 'Secondary & Board Prep',
    badge: 'Secondary',
    tagline: 'Rigorous conceptual clarity, competitive exam readiness, and subject deep-dives.'
  },
  {
    id: 'senior',
    label: 'Class 11 – 12',
    sublabel: 'Senior STEM & Humanities',
    badge: 'Senior Secondary',
    tagline: 'Advanced calculus, competitive Olympiads, college entrance readiness, and targeted analysis.'
  },
  {
    id: 'diploma',
    label: 'Diploma / Polytechnic',
    sublabel: 'Applied Engineering & Tech',
    badge: 'Polytechnic',
    tagline: 'Practical engineering mechanics, applied mathematics, circuit theory, and industrial design.'
  },
  {
    id: 'undergrad',
    label: 'Undergraduate',
    sublabel: 'Degree, Branch & Research',
    badge: 'University Undergrad',
    tagline: 'Algorithmic proof, higher mathematics, branch specializations, and analytical synthesis.'
  },
  {
    id: 'postgrad',
    label: 'Postgraduate',
    sublabel: 'Master’s & Advanced Domain',
    badge: 'Master’s / PG',
    tagline: 'Independent research, advanced thesis domains, theoretical modeling, and graduate seminars.'
  }
];

export const MOCK_PROFILES_BY_GRADE: Record<GradeLevelId, StudentProfile> = {
  senior: {
    name: 'Maya Sharma',
    role: 'Student',
    avatarInitials: 'MS',
    gradeId: 'senior',
    gradeLabel: 'Class 11 · STEM & Advanced Analytics',
    schoolOrProgram: 'Oakwood International Academy',
    streakDays: 14,
    weeklyHoursLogged: 18.5,
    weeklyHoursTarget: 22.0,
    conceptMasteryScore: 88.4,
    deepWorkPercentage: 92,
    mirrorData: {
      reflectionSummary:
        'Maya demonstrates exceptional conceptual intuition in Spatial Calculus and Vector Mechanics, rapidly synthesizing multi-step theorems. AI Mirror has identified a subtle recurring cognitive blindspot in implicit chain rule algebra during timed problem sets. Targeted review scheduled.',
      lastScannedAt: 'Today at 08:30 AM',
      cognitiveReadinessScore: 91,
      strengths: [
        {
          id: 'str-1',
          topic: 'Vector Fields & 3D Spatial Calculus',
          subject: 'Mathematics',
          retentionRate: 96,
          speedMultiplier: '1.4x peer velocity',
          cognitiveTrait: 'Spatial-Geometric Deduction',
          statusDescription: 'Consistent error-free multi-variable integration in under 90s.'
        },
        {
          id: 'str-2',
          topic: 'Electromagnetic Induction & Lenz’s Law',
          subject: 'Physics',
          retentionRate: 93,
          speedMultiplier: '1.3x peer velocity',
          cognitiveTrait: 'Physical Intuition & Directional Logic',
          statusDescription: 'Perfect score across magnetic flux variations and induced EMF tasks.'
        },
        {
          id: 'str-3',
          topic: 'Thematic Essay Structure & Synthesis',
          subject: 'English Lit',
          retentionRate: 89,
          speedMultiplier: 'Steady deliberate cadence',
          cognitiveTrait: 'Critical Contextual Framing',
          statusDescription: 'High qualitative depth in comparative rhetoric.'
        }
      ],
      gaps: [
        {
          id: 'gap-1',
          concept: 'Implicit Chain Rule on Composite Functions',
          subject: 'Mathematics',
          severity: 'high',
          identifiedTrigger: 'Negative sign omissions when differentiating terms like y³ · cos(xy) = x',
          rootCause: 'Rushing through product-rule combinations under timed conditions',
          recommendedAction: '3-minute deliberate step-by-step micro-drill before tomorrow’s quiz',
          drillProblem: {
            question: 'Find dy/dx for the curve x² + y² = 25 at the point (3, 4).',
            options: ['-3/4', '3/4', '-4/3', '4/3'],
            correctIndex: 0,
            explanation: 'Differentiating both sides with respect to x: 2x + 2y(dy/dx) = 0 ⟹ dy/dx = -2x / 2y = -x/y. At (3, 4), dy/dx = -3/4.'
          }
        },
        {
          id: 'gap-2',
          concept: 'Doppler Shift Frequency Sign Convention',
          subject: 'Physics',
          severity: 'medium',
          identifiedTrigger: 'Inverting relative velocity when source and observer move simultaneously',
          rootCause: 'Relying on rote memorization rather than relative wavefront compression',
          recommendedAction: 'Visual wave compression interactive model review',
          drillProblem: {
            question: 'A siren emits 1000 Hz moving away from a stationary observer. The observed frequency must be:',
            options: ['Lower than 1000 Hz', 'Equal to 1000 Hz', 'Higher than 1000 Hz', 'Depends on air pressure'],
            correctIndex: 0,
            explanation: 'When the source moves away, each wavefront is emitted further back, lengthening the apparent wavelength and decreasing the perceived frequency.'
          }
        },
        {
          id: 'gap-3',
          concept: 'Resonance Stabilization in Electrophilic Substitution',
          subject: 'Chemistry',
          severity: 'medium',
          identifiedTrigger: 'Missing the carbocation arenium ion meta vs ortho-para intermediate',
          rootCause: 'Incomplete electron density distribution sketching',
          recommendedAction: 'Draw 3 resonance hybrid forms for benzene nitration',
          drillProblem: {
            question: 'Why is -OH an ortho/para directing group in electrophilic aromatic substitution?',
            options: [
              'Lone pair resonance donation stabilizes carbocation intermediates at ortho/para positions',
              'Strong inductive electron withdrawal favors meta attack',
              'Steric hindrance blocks meta positions entirely',
              'It lowers the boiling point of the solvent'
            ],
            correctIndex: 0,
            explanation: 'The lone pair of oxygen delocalizes into the aromatic ring, donating electron density and creating stable resonance structures for ortho and para attacks.'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Visual & Geometric Mechanics',
          paceScore: 88,
          paceStatus: '24% faster than standard',
          retentionHalfLifeDays: 24,
          reflectionNote: 'Rapid internalization of graphs, vectors, and physical schematics.'
        },
        {
          domain: 'Analytical & Symbolic Proofs',
          paceScore: 76,
          paceStatus: 'Deliberate & rigorous',
          retentionHalfLifeDays: 21,
          reflectionNote: 'Spends 1.3x time verifying edge cases, resulting in high final accuracy.'
        },
        {
          domain: 'Active Recall & Spaced Repetition',
          paceScore: 94,
          paceStatus: 'Optimal rhythm',
          retentionHalfLifeDays: 28,
          reflectionNote: 'Consistently completes review intervals within 48h window.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-1',
        name: 'Mathematics',
        category: 'Pure & Applied STEM',
        masteryPercentage: 91,
        completedModules: 22,
        totalModules: 24,
        weeklyHours: 6.5,
        recentScore: 94,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-2',
        name: 'Physics',
        category: 'Mechanics & Electromagnetism',
        masteryPercentage: 87,
        completedModules: 18,
        totalModules: 22,
        weeklyHours: 5.0,
        recentScore: 89,
        color: 'from-purple-600 to-indigo-600'
      },
      {
        id: 'sub-3',
        name: 'Chemistry',
        category: 'Organic & Physical',
        masteryPercentage: 82,
        completedModules: 15,
        totalModules: 20,
        weeklyHours: 3.5,
        recentScore: 84,
        color: 'from-fuchsia-600 to-purple-600'
      },
      {
        id: 'sub-4',
        name: 'Computer Science',
        category: 'Data Structures & Algorithms',
        masteryPercentage: 94,
        completedModules: 19,
        totalModules: 20,
        weeklyHours: 2.5,
        recentScore: 98,
        color: 'from-violet-500 to-purple-700'
      },
      {
        id: 'sub-5',
        name: 'English & Rhetoric',
        category: 'Advanced Composition',
        masteryPercentage: 88,
        completedModules: 14,
        totalModules: 16,
        weeklyHours: 1.0,
        recentScore: 92,
        color: 'from-purple-500 to-violet-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Mastery Micro-Drill: Implicit Differentiation',
        subject: 'Mathematics',
        durationMinutes: 20,
        aiRationale: 'Fixes identified sign-inversion blindspot before tomorrow’s calculus assessment.',
        urgency: 'high',
        completed: false,
        topicTag: 'Calculus'
      },
      {
        id: 'rec-2',
        title: 'Spaced Review: Electromagnetic Wave Equations',
        subject: 'Physics',
        durationMinutes: 30,
        aiRationale: 'Memory decay prediction shows 15% drop if not reviewed in the next 18 hours.',
        urgency: 'medium',
        completed: false,
        topicTag: 'Electrodynamics'
      },
      {
        id: 'rec-3',
        title: 'Problem Set: Aromatic Substitution Mechanisms',
        subject: 'Chemistry',
        durationMinutes: 25,
        aiRationale: 'Reinforces arenium resonance intermediates with 4 practice structures.',
        urgency: 'normal',
        completed: false,
        topicTag: 'Organic Chemistry'
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Calculus Unit Test: Multivariable Vectors',
        subject: 'Mathematics',
        topic: 'Vector Fields & Dot Products',
        dueDate: 'Today at 02:30 PM',
        type: 'Quiz',
        estimatedMinutes: 45,
        priority: 'high',
        completed: false
      },
      {
        id: 'task-overdue',
        title: 'Chemical Equilibrium Problem Set #4',
        subject: 'Chemistry',
        topic: 'Le Chatelier Principle & Keq',
        dueDate: 'Yesterday (Overdue)',
        type: 'Assignment',
        estimatedMinutes: 40,
        priority: 'high',
        completed: false
      },
      {
        id: 'task-2',
        title: 'Lenz’s Law Experimental Lab Report',
        subject: 'Physics',
        topic: 'Electromagnetic Flux Induction',
        dueDate: 'Friday, 5:00 PM',
        type: 'Assignment',
        estimatedMinutes: 60,
        priority: 'medium',
        completed: false
      },
      {
        id: 'task-3',
        title: 'Midterm Spaced Repetition Flashcards',
        subject: 'Chemistry',
        topic: 'Reaction Mechanisms',
        dueDate: 'Sunday, 8:00 PM',
        type: 'Revision',
        estimatedMinutes: 30,
        priority: 'low',
        completed: false
      }
    ],
    recentActivities: [
      {
        id: 'act-1',
        action: 'Completed Spaced Repetition Drill',
        subject: 'Mathematics · Vector Dot & Cross Products',
        timestamp: '42 mins ago',
        scoreOrDetail: '100% Accuracy (5/5)',
        positive: true
      },
      {
        id: 'act-2',
        action: 'AI Mirror Insight Generated',
        subject: 'Physics · Electromagnetic Induction Scan',
        timestamp: '3 hours ago',
        scoreOrDetail: 'Mastery +3.2%',
        positive: true
      },
      {
        id: 'act-3',
        action: 'Deep Study Session Logged',
        subject: 'Chemistry · Reaction Mechanism Practice',
        timestamp: 'Yesterday at 4:15 PM',
        scoreOrDetail: '48 mins focused',
        positive: true
      },
      {
        id: 'act-4',
        action: 'Socratic Dialogue with AI Mentor',
        subject: 'English · Comparative Metaphor Analysis',
        timestamp: '2 days ago',
        scoreOrDetail: '4 concepts clarified',
        positive: true
      }
    ],
    quizResults: [
      {
        id: 'quiz-1',
        title: 'Vector Calculus: Dot & Cross Product Evaluation',
        subject: 'Mathematics',
        score: 95,
        totalQuestions: 10,
        correctQuestions: 9,
        completedAt: 'Yesterday, 3:30 PM',
        topicsCovered: ['Orthogonality', 'Cross Product Right Hand Rule', 'Projection Vectors'],
        isMeasured: true,
        status: 'Mastered'
      },
      {
        id: 'quiz-2',
        title: 'Electromagnetic Flux & Lenz’s Law Diagnostic',
        subject: 'Physics',
        score: 88,
        totalQuestions: 8,
        correctQuestions: 7,
        completedAt: '2 days ago',
        topicsCovered: ['Faraday Law', 'Induced EMF', 'Lenz Opposing Current'],
        isMeasured: true,
        status: 'Proficient'
      },
      {
        id: 'quiz-3',
        title: 'Implicit Chain Rule & Composite Derivatives Drill',
        subject: 'Mathematics',
        score: 65,
        totalQuestions: 10,
        correctQuestions: 6,
        completedAt: '3 days ago',
        topicsCovered: ['Nested Functions', 'Negative Sign Propagation', 'Composite Chain Rule'],
        isMeasured: true,
        status: 'Needs Review'
      },
      {
        id: 'quiz-4',
        title: 'Organic Chemistry: Electrophilic Addition Kinetics',
        subject: 'Chemistry',
        score: 82,
        totalQuestions: 10,
        correctQuestions: 8,
        completedAt: '4 days ago',
        topicsCovered: ['Markovnikov Rule', 'Carbocation Stability'],
        isMeasured: true,
        status: 'Proficient'
      }
    ],
    studyHistory: [
      {
        id: 'sess-1',
        subject: 'Mathematics',
        topic: 'Calculus: Implicit Differentiation & Related Rates',
        durationMinutes: 45,
        completedAt: 'Today, 9:15 AM',
        sessionType: 'Problem Solving',
        isMeasured: true,
        notes: 'Re-solved 8 composite problems without dropping negative signs.'
      },
      {
        id: 'sess-2',
        subject: 'Physics',
        topic: 'Electromagnetism: Inductance & AC Circuits',
        durationMinutes: 50,
        completedAt: 'Yesterday, 4:00 PM',
        sessionType: 'Deep Work',
        isMeasured: true,
        notes: 'Derived impedance triangle and power factor resonance.'
      },
      {
        id: 'sess-3',
        subject: 'Chemistry',
        topic: 'Physical Chemistry: Chemical Kinetics First Order',
        durationMinutes: 35,
        completedAt: '2 days ago',
        sessionType: 'Spaced Recall',
        isMeasured: true,
        notes: 'Half-life calculations and Arrhenius activation energy equations.'
      },
      {
        id: 'sess-4',
        subject: 'Computer Science',
        topic: 'Data Structures: Binary Search Trees & AVL Balance',
        durationMinutes: 60,
        completedAt: '3 days ago',
        sessionType: 'Deep Work',
        isMeasured: true,
        notes: 'Implemented left/right tree rotations in code.'
      }
    ]
  },
  primary: {
    name: 'Leo Miller',
    role: 'Student',
    avatarInitials: 'LM',
    gradeId: 'primary',
    gradeLabel: 'Class 4 · Foundations & Explorers',
    schoolOrProgram: 'Sunnyvale Elementary Academy',
    streakDays: 8,
    weeklyHoursLogged: 8.5,
    weeklyHoursTarget: 10.0,
    conceptMasteryScore: 84.0,
    deepWorkPercentage: 86,
    mirrorData: {
      reflectionSummary:
        'Leo shows quick visual pattern recognition and enthusiastic problem-solving in multiplication and geometry. AI Mirror noticed a pause pattern when converting word problems into division steps. Guided story-based practice is recommended.',
      lastScannedAt: 'Today at 09:15 AM',
      cognitiveReadinessScore: 88,
      strengths: [
        {
          id: 'str-p1',
          topic: 'Visual Shapes & Spatial Geometry',
          subject: 'Mathematics',
          retentionRate: 95,
          speedMultiplier: '1.5x speed',
          cognitiveTrait: 'Visual-Spatial Thinking',
          statusDescription: 'Understands symmetry, perimeter, and area with zero hints.'
        },
        {
          id: 'str-p2',
          topic: 'Story Reading & Character Motives',
          subject: 'Language Arts',
          retentionRate: 91,
          speedMultiplier: 'Strong fluency',
          cognitiveTrait: 'Empathetic Comprehension',
          statusDescription: 'Predicts story outcomes accurately from subtle context clues.'
        }
      ],
      gaps: [
        {
          id: 'gap-p1',
          concept: 'Multi-Step Division Word Problems',
          subject: 'Mathematics',
          severity: 'medium',
          identifiedTrigger: 'Selecting multiplication instead of division when sharing items into equal groups',
          rootCause: 'Keywords like "times" appearing in word stories can create misdirection',
          recommendedAction: 'Visual bar model drawing drill',
          drillProblem: {
            question: 'There are 24 apples shared equally among 6 baskets. How many apples are in each basket?',
            options: ['4 apples', '6 apples', '18 apples', '144 apples'],
            correctIndex: 0,
            explanation: 'Divide the total number of apples (24) by the number of baskets (6): 24 ÷ 6 = 4 apples.'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Visual Pattern Recognition',
          paceScore: 92,
          paceStatus: 'Quick and eager',
          retentionHalfLifeDays: 20,
          reflectionNote: 'Excels when questions include diagrams and interactive blocks.'
        },
        {
          domain: 'Word Problem Translation',
          paceScore: 72,
          paceStatus: 'Needs quiet reading pace',
          retentionHalfLifeDays: 16,
          reflectionNote: 'Benefits from highlighting key quantities before calculating.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-p1',
        name: 'Mathematics',
        category: 'Arithmetic & Shapes',
        masteryPercentage: 86,
        completedModules: 18,
        totalModules: 20,
        weeklyHours: 3.5,
        recentScore: 90,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-p2',
        name: 'Science & Nature',
        category: 'Ecosystems & Planets',
        masteryPercentage: 90,
        completedModules: 16,
        totalModules: 18,
        weeklyHours: 2.5,
        recentScore: 94,
        color: 'from-purple-600 to-indigo-600'
      },
      {
        id: 'sub-p3',
        name: 'English & Phonics',
        category: 'Reading & Vocabulary',
        masteryPercentage: 88,
        completedModules: 15,
        totalModules: 18,
        weeklyHours: 2.5,
        recentScore: 88,
        color: 'from-fuchsia-600 to-purple-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-p1',
        title: 'Story Math: The 6 Baskets Adventure',
        subject: 'Mathematics',
        durationMinutes: 15,
        aiRationale: 'Strengthens equal group division with fun cartoon illustrations.',
        urgency: 'high',
        completed: false,
        topicTag: 'Division'
      },
      {
        id: 'rec-p2',
        title: 'Planet Explorer: The Rings of Saturn',
        subject: 'Science',
        durationMinutes: 20,
        aiRationale: 'Spaced recall on solar system facts.',
        urgency: 'normal',
        completed: false,
        topicTag: 'Astronomy'
      }
    ],
    tasks: [
      {
        id: 'task-p1',
        title: 'Multiplication Tables Mastery Challenge (x7, x8)',
        subject: 'Mathematics',
        dueDate: 'Friday at 2:00 PM',
        type: 'Quiz',
        estimatedMinutes: 20,
        priority: 'medium'
      }
    ],
    recentActivities: [
      {
        id: 'act-p1',
        action: 'Earned Star Badge: Geometry Master',
        subject: 'Mathematics · Quadrilaterals & Symmetry',
        timestamp: '1 hour ago',
        scoreOrDetail: '100% Clean Run',
        positive: true
      }
    ]
  },
  middle: {
    name: 'Aarav Patel',
    role: 'Student',
    avatarInitials: 'AP',
    gradeId: 'middle',
    gradeLabel: 'Class 8 · Middle School Explorer',
    schoolOrProgram: 'Greenwood Middle High',
    streakDays: 11,
    weeklyHoursLogged: 12.0,
    weeklyHoursTarget: 14.0,
    conceptMasteryScore: 85.5,
    deepWorkPercentage: 88,
    mirrorData: {
      reflectionSummary:
        'Aarav is building strong foundational logic in linear equations and life sciences. AI Mirror detected a tendency to skip negative number distribution rules when expanding algebraic parentheses.',
      lastScannedAt: 'Today at 07:45 AM',
      cognitiveReadinessScore: 89,
      strengths: [
        {
          id: 'str-m1',
          topic: 'Cellular Biology & Organelles',
          subject: 'Science',
          retentionRate: 94,
          speedMultiplier: '1.3x faster',
          cognitiveTrait: 'Structural Taxonomy',
          statusDescription: 'Clear grasp of cell respiration and photosynthesis stages.'
        }
      ],
      gaps: [
        {
          id: 'gap-m1',
          concept: 'Distributing Negative Signs Across Parentheses',
          subject: 'Mathematics',
          severity: 'high',
          identifiedTrigger: 'Writing -(3x - 5) as -3x - 5 instead of -3x + 5',
          rootCause: 'Cognitive load during multi-term simplifications',
          recommendedAction: 'Targeted 5-question algebraic sign drill',
          drillProblem: {
            question: 'Simplify the expression: 7 - (2x - 4)',
            options: ['11 - 2x', '3 - 2x', '11 + 2x', '3 + 2x'],
            correctIndex: 0,
            explanation: 'Distribute the negative sign to both terms inside the parentheses: 7 - 2x + 4 = 11 - 2x.'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Algebraic Manipulation',
          paceScore: 78,
          paceStatus: 'Improving with practice',
          retentionHalfLifeDays: 18,
          reflectionNote: 'Needs deliberate pace when handling expressions with dual negatives.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-m1',
        name: 'Mathematics',
        category: 'Algebra & Geometry',
        masteryPercentage: 84,
        completedModules: 16,
        totalModules: 20,
        weeklyHours: 4.5,
        recentScore: 88,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-m2',
        name: 'Integrated Science',
        category: 'Physics & Biology',
        masteryPercentage: 89,
        completedModules: 18,
        totalModules: 20,
        weeklyHours: 4.0,
        recentScore: 92,
        color: 'from-purple-600 to-indigo-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-m1',
        title: 'Sign Mastery: Parentheses Expansion Drill',
        subject: 'Mathematics',
        durationMinutes: 15,
        aiRationale: 'Fixes negative sign distribution trap.',
        urgency: 'high',
        completed: false,
        topicTag: 'Algebra'
      }
    ],
    tasks: [
      {
        id: 'task-m1',
        title: 'Cell Organelle Interactive Diagram Lab',
        subject: 'Science',
        dueDate: 'Thursday at 4:00 PM',
        type: 'Assignment',
        estimatedMinutes: 35,
        priority: 'medium'
      }
    ],
    recentActivities: [
      {
        id: 'act-m1',
        action: 'Completed Linear Equations Quiz',
        subject: 'Mathematics',
        timestamp: '3 hours ago',
        scoreOrDetail: '85% Score (17/20)',
        positive: true
      }
    ]
  },
  secondary: {
    name: 'Rohan Verma',
    role: 'Student',
    avatarInitials: 'RV',
    gradeId: 'secondary',
    gradeLabel: 'Class 10 · Board Exam & Foundation Prep',
    schoolOrProgram: 'National Public School',
    streakDays: 19,
    weeklyHoursLogged: 16.0,
    weeklyHoursTarget: 18.0,
    conceptMasteryScore: 87.2,
    deepWorkPercentage: 90,
    mirrorData: {
      reflectionSummary:
        'Rohan exhibits disciplined problem execution in trigonometry and chemical reactions. AI Mirror detected slight latency on word-based quadratic equations involving speed/distance scenarios.',
      lastScannedAt: 'Today at 08:00 AM',
      cognitiveReadinessScore: 90,
      strengths: [
        {
          id: 'str-s1',
          topic: 'Trigonometric Identities & Heights',
          subject: 'Mathematics',
          retentionRate: 95,
          speedMultiplier: '1.4x faster',
          cognitiveTrait: 'Geometric-Algebraic Synergy',
          statusDescription: 'Flawless substitution of Pythagorean identities.'
        }
      ],
      gaps: [
        {
          id: 'gap-s1',
          concept: 'Speed & Distance Quadratic Framing',
          subject: 'Mathematics',
          severity: 'medium',
          identifiedTrigger: 'Confusing upstream/downstream relative velocity in river boat problems',
          rootCause: 'Framing equation in distance instead of equating time differences (t1 - t2 = delta_t)',
          recommendedAction: 'Review the canonical Time = Distance / Speed equation template',
          drillProblem: {
            question: 'A boat moves at 15 km/h in still water. If the stream flows at 3 km/h, what is the upstream speed?',
            options: ['12 km/h', '18 km/h', '5 km/h', '45 km/h'],
            correctIndex: 0,
            explanation: 'Upstream speed is still water speed minus stream speed: 15 - 3 = 12 km/h.'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Trigonometric Deduction',
          paceScore: 92,
          paceStatus: 'Fast & instinctive',
          retentionHalfLifeDays: 22,
          reflectionNote: 'Strong mastery of sine/cosine angle transformations.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-s1',
        name: 'Mathematics',
        category: 'Class 10 Core Board',
        masteryPercentage: 89,
        completedModules: 20,
        totalModules: 22,
        weeklyHours: 6.0,
        recentScore: 92,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-s2',
        name: 'Science',
        category: 'Physics, Chemistry, Biology',
        masteryPercentage: 86,
        completedModules: 18,
        totalModules: 22,
        weeklyHours: 5.5,
        recentScore: 88,
        color: 'from-purple-600 to-indigo-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-s1',
        title: 'Mastery Drill: Upstream & Downstream Quadratics',
        subject: 'Mathematics',
        durationMinutes: 20,
        aiRationale: 'Targets relative speed framing before upcoming pre-board test.',
        urgency: 'high',
        completed: false,
        topicTag: 'Quadratic Equations'
      }
    ],
    tasks: [
      {
        id: 'task-s1',
        title: 'Light: Reflection & Refraction Ray Diagrams',
        subject: 'Science',
        dueDate: 'Friday at 6:00 PM',
        type: 'Assignment',
        estimatedMinutes: 40,
        priority: 'high'
      }
    ],
    recentActivities: [
      {
        id: 'act-s1',
        action: 'Completed Trigonometry Milestone Test',
        subject: 'Mathematics',
        timestamp: '5 hours ago',
        scoreOrDetail: '96% Score (24/25)',
        positive: true
      }
    ]
  },
  undergrad: {
    name: 'Sophia Zhang',
    role: 'Undergraduate',
    avatarInitials: 'SZ',
    gradeId: 'undergrad',
    gradeLabel: 'B.Tech · Computer Science & AI · Sem 5',
    schoolOrProgram: 'University Institute of Technology',
    currentClassOrCourse: '3rd Year B.Tech',
    degree: 'B.Tech / B.E (Engineering)',
    branch: 'Computer Science & Artificial Intelligence',
    semester: 'Semester 5 (3rd Year)',
    learningGoals: [
      'Eliminate recurring asymptotic analysis blindspots',
      'Ace semester university exams with 9.5+ GPA'
    ],
    streakDays: 26,
    weeklyHoursLogged: 24.5,
    weeklyHoursTarget: 25.0,
    conceptMasteryScore: 92.6,
    deepWorkPercentage: 94,
    mirrorData: {
      reflectionSummary:
        'Sophia demonstrates remarkable algorithmic rigor in Dynamic Programming and Linear Algebra decomposition (SVD, Eigenvalues). AI Mirror has flagged a subtle recurring asymptotic trap when analyzing worst-case randomized quickselect recurrence relations.',
      lastScannedAt: 'Today at 08:50 AM',
      cognitiveReadinessScore: 94,
      strengths: [
        {
          id: 'str-c1',
          topic: 'Dynamic Programming & Memoization Graphs',
          subject: 'Computer Science',
          retentionRate: 97,
          speedMultiplier: '1.6x peer velocity',
          cognitiveTrait: 'State Space Abstraction',
          statusDescription: 'Easily derives optimal substructure and transition formulas.'
        },
        {
          id: 'str-c2',
          topic: 'Spectral Graph Theory & Eigen Decomposition',
          subject: 'Linear Algebra',
          retentionRate: 94,
          speedMultiplier: '1.4x velocity',
          cognitiveTrait: 'Geometric-Matrix Mapping',
          statusDescription: 'Deep intuition for orthogonal transformations and Rayleigh quotients.'
        }
      ],
      gaps: [
        {
          id: 'gap-c1',
          concept: 'Randomized Quickselect Recurrence & Martingales',
          subject: 'Algorithms',
          severity: 'high',
          identifiedTrigger: 'Conflating expected linear time O(n) with deterministic worst-case O(n²)',
          rootCause: 'Skipping the formal indicator variable summation during proof analysis',
          recommendedAction: 'Solve 2 recurrence proofs with indicator variables',
          drillProblem: {
            question: 'What is the expected running time of Quickselect to find the k-th smallest element in an unsorted array of size n?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
            correctIndex: 0,
            explanation: 'With random pivot selection, the expected problem size decreases geometrically in each step: n + 3/4 n + (3/4)² n + ... = O(n).'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Algorithmic Complexity Proofs',
          paceScore: 91,
          paceStatus: 'High velocity & precision',
          retentionHalfLifeDays: 32,
          reflectionNote: 'Rapid decomposition of recursive subproblems.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-c1',
        name: 'Algorithms & Data Structures',
        category: 'Computer Science',
        masteryPercentage: 95,
        completedModules: 24,
        totalModules: 26,
        weeklyHours: 8.5,
        recentScore: 97,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-c2',
        name: 'Linear Algebra & Optimization',
        category: 'Mathematics',
        masteryPercentage: 91,
        completedModules: 20,
        totalModules: 22,
        weeklyHours: 7.0,
        recentScore: 93,
        color: 'from-purple-600 to-indigo-600'
      },
      {
        id: 'sub-c3',
        name: 'Operating Systems & Concurrency',
        category: 'Computer Science',
        masteryPercentage: 88,
        completedModules: 17,
        totalModules: 20,
        weeklyHours: 5.5,
        recentScore: 89,
        color: 'from-fuchsia-600 to-purple-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-c1',
        title: 'Proof Verification: Indicator Sums in Quickselect',
        subject: 'Algorithms',
        durationMinutes: 25,
        aiRationale: 'Clarifies expected vs worst-case bounds for upcoming research seminar.',
        urgency: 'high',
        completed: false,
        topicTag: 'Randomized Algorithms'
      }
    ],
    tasks: [
      {
        id: 'task-c1',
        title: 'Problem Set 4: Singular Value Decomposition & Low-Rank Approx',
        subject: 'Linear Algebra',
        dueDate: 'Friday at 11:59 PM',
        type: 'Assignment',
        estimatedMinutes: 90,
        priority: 'high'
      }
    ],
    recentActivities: [
      {
        id: 'act-c1',
        action: 'Completed Research Paper Socratic Summary',
        subject: 'Algorithms · Graph Partitioning',
        timestamp: '1 hour ago',
        scoreOrDetail: 'Synthesized 3 Core Theorems',
        positive: true
      }
    ]
  },
  diploma: {
    name: 'Vikram Singh',
    role: 'Student',
    avatarInitials: 'VS',
    gradeId: 'diploma',
    gradeLabel: 'Diploma · Mechanical & Mechatronics',
    schoolOrProgram: 'Government Polytechnic Institute',
    currentClassOrCourse: 'Final Year Diploma',
    branch: 'Mechanical Engineering',
    semester: 'Semester 5 (Final Year)',
    learningGoals: [
      'Master thermodynamics and fluid power calculation schemas',
      'Ace technical CAD and mechanism design vivas'
    ],
    streakDays: 15,
    weeklyHoursLogged: 17.0,
    weeklyHoursTarget: 20.0,
    conceptMasteryScore: 86.5,
    deepWorkPercentage: 89,
    mirrorData: {
      reflectionSummary:
        'Vikram demonstrates solid practical grasp of mechanical link mechanisms and stress diagrams. AI Mirror detected a recurring unit conversion trap in hydraulic pressure bar-to-Pascal calculations.',
      lastScannedAt: 'Today at 08:15 AM',
      cognitiveReadinessScore: 89,
      strengths: [
        {
          id: 'str-d1',
          topic: 'Four-Bar Inversion & Kinematic Linkages',
          subject: 'Theory of Machines',
          retentionRate: 94,
          speedMultiplier: '1.4x velocity',
          cognitiveTrait: 'Spatial Mechanism Intuition',
          statusDescription: 'Accurate instant centre and velocity vector determinations.'
        }
      ],
      gaps: [
        {
          id: 'gap-d1',
          concept: 'Hydraulic Pressure Unit Conversions',
          subject: 'Applied Hydraulics',
          severity: 'medium',
          identifiedTrigger: 'Mixing bar (10⁵ Pa) with N/mm² (10⁶ Pa) in cylinder force calculations',
          rootCause: 'Omitting explicit dimensional analysis scratchpad step',
          recommendedAction: '3-question dimensional consistency check',
          drillProblem: {
            question: 'Convert a hydraulic pressure of 150 bar to N/mm²:',
            options: ['15 N/mm²', '150 N/mm²', '1.5 N/mm²', '1500 N/mm²'],
            correctIndex: 0,
            explanation: '1 bar = 0.1 N/mm² (since 1 bar = 10⁵ Pa and 1 N/mm² = 10⁶ Pa). Therefore, 150 bar = 15 N/mm².'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Applied Mechanics & Diagrams',
          paceScore: 88,
          paceStatus: 'Fast & practical',
          retentionHalfLifeDays: 20,
          reflectionNote: 'Excels with schematics and real industrial equipment cutaways.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-d1',
        name: 'Applied Hydraulics & Pneumatics',
        category: 'Mechanical Core',
        masteryPercentage: 85,
        completedModules: 16,
        totalModules: 20,
        weeklyHours: 5.5,
        recentScore: 88,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-d2',
        name: 'Strength of Materials',
        category: 'Mechanical Core',
        masteryPercentage: 88,
        completedModules: 18,
        totalModules: 20,
        weeklyHours: 6.0,
        recentScore: 90,
        color: 'from-purple-600 to-indigo-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-d1',
        title: 'Micro-Drill: Hydraulic Unit Consistency',
        subject: 'Applied Hydraulics',
        durationMinutes: 15,
        aiRationale: 'Fixes identified bar-to-Pascal conversion trap.',
        urgency: 'high',
        completed: false,
        topicTag: 'Dimensional Analysis'
      }
    ],
    tasks: [
      {
        id: 'task-d1',
        title: 'Hydraulic Cylinder Force Calculation Sheet',
        subject: 'Applied Hydraulics',
        dueDate: 'Tomorrow at 2:00 PM',
        type: 'Assignment',
        estimatedMinutes: 45,
        priority: 'high'
      }
    ],
    recentActivities: [
      {
        id: 'act-d1',
        action: 'Completed Kinematic Inversions Quiz',
        subject: 'Theory of Machines',
        timestamp: '2 hours ago',
        scoreOrDetail: '92% Score',
        positive: true
      }
    ]
  },
  postgrad: {
    name: 'Dr. Ananya Ray',
    role: 'Postgraduate Researcher',
    avatarInitials: 'AR',
    gradeId: 'postgrad',
    gradeLabel: 'M.Tech · Artificial Intelligence & Neural Systems',
    schoolOrProgram: 'National Institute of Advanced Studies',
    currentClassOrCourse: '2nd Year M.Tech',
    degree: 'M.Tech / M.S (Technology & Engineering)',
    branch: 'Machine Learning & Deep Neural Systems',
    semester: 'Thesis Phase (Year 2)',
    learningGoals: [
      'Synthesize empirical research on attention mechanisms and sparse transformers',
      'Complete doctoral thesis proposal defense'
    ],
    streakDays: 32,
    weeklyHoursLogged: 28.0,
    weeklyHoursTarget: 30.0,
    conceptMasteryScore: 94.8,
    deepWorkPercentage: 96,
    mirrorData: {
      reflectionSummary:
        'Ananya exhibits mastery across Transformer attention geometry and gradient descent optimization manifolds. AI Mirror flagged a minor ambiguity in contrasting differential privacy noise bounds across Renyi vs Gaussian mechanisms.',
      lastScannedAt: 'Today at 09:00 AM',
      cognitiveReadinessScore: 96,
      strengths: [
        {
          id: 'str-pg1',
          topic: 'FlashAttention & IO-Aware Memory Kernels',
          subject: 'Deep Learning',
          retentionRate: 98,
          speedMultiplier: '1.7x peer velocity',
          cognitiveTrait: 'Hardware-Algorithm Co-Design',
          statusDescription: 'Expert-level GPU SRAM tiling and matrix tile intuition.'
        }
      ],
      gaps: [
        {
          id: 'gap-pg1',
          concept: 'Renyi Differential Privacy Composition Bounds',
          subject: 'Trustworthy AI',
          severity: 'medium',
          identifiedTrigger: 'Applying sub-sampling amplification factors linearly instead of using moment accountant bounds',
          rootCause: 'Relying on standard epsilon-delta composition heuristics',
          recommendedAction: 'Derive Renyi divergence order alpha expansion',
          drillProblem: {
            question: 'Under Renyi Differential Privacy (RDP), how does composition of k mechanisms behave?',
            options: [
              'RDP orders and divergences add up linearly',
              'Privacy loss degrades quadratically',
              'Noise scale must double exponentially',
              'Gaussian noise is completely eliminated'
            ],
            correctIndex: 0,
            explanation: 'A key advantage of Renyi DP is that the Renyi divergences add up strictly linearly under composition, unlike standard (ε, δ)-DP which requires advanced composition theorems.'
          }
        }
      ],
      paceMetrics: [
        {
          domain: 'Deep Learning Architecture Synthesis',
          paceScore: 95,
          paceStatus: 'Research grade',
          retentionHalfLifeDays: 45,
          reflectionNote: 'Rapid assimilation of conference papers and mathematical proofs.'
        }
      ]
    },
    subjects: [
      {
        id: 'sub-pg1',
        name: 'Deep Neural Architectures',
        category: 'Postgraduate Core',
        masteryPercentage: 96,
        completedModules: 22,
        totalModules: 24,
        weeklyHours: 12.0,
        recentScore: 98,
        color: 'from-violet-600 to-purple-600'
      },
      {
        id: 'sub-pg2',
        name: 'Statistical Learning Theory',
        category: 'Mathematics & Research',
        masteryPercentage: 93,
        completedModules: 19,
        totalModules: 22,
        weeklyHours: 9.0,
        recentScore: 95,
        color: 'from-purple-600 to-indigo-600'
      }
    ],
    recommendations: [
      {
        id: 'rec-pg1',
        title: 'Thesis Proof: Renyi Composition Bounds',
        subject: 'Statistical Learning',
        durationMinutes: 35,
        aiRationale: 'Formalizes proof for Section 3 of research paper submission.',
        urgency: 'high',
        completed: false,
        topicTag: 'Differential Privacy'
      }
    ],
    tasks: [
      {
        id: 'task-pg1',
        title: 'Thesis Chapter 3: Empirical Attention Benchmarks',
        subject: 'Deep Learning',
        dueDate: 'Monday at 5:00 PM',
        type: 'Assignment',
        estimatedMinutes: 120,
        priority: 'high'
      }
    ],
    recentActivities: [
      {
        id: 'act-pg1',
        action: 'Completed Research Socratic Dialogue',
        subject: 'Deep Learning · Attention Manifolds',
        timestamp: '1 hour ago',
        scoreOrDetail: 'Validated Kernel Derivation',
        positive: true
      }
    ]
  }
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'AI Mirror Cognitive Scan Complete',
    message: '94% retention verified on Vector Geometry. 1 micro-gap detected in Implicit Chain Rule.',
    time: '25m ago',
    read: false,
    type: 'mirror'
  },
  {
    id: 'notif-2',
    title: 'Upcoming Assessment Reminder',
    message: 'Calculus Unit Test: Multivariable Vectors is scheduled for tomorrow at 10:00 AM.',
    time: '2h ago',
    read: false,
    type: 'reminder'
  },
  {
    id: 'notif-3',
    title: '14-Day Study Streak Milestone! 🔥',
    message: 'Consistency bonus activated. You are in the top 4% of active learners this month.',
    time: '5h ago',
    read: true,
    type: 'achievement'
  },
  {
    id: 'notif-4',
    title: 'Dr. Elena (AI Mentor) Shared a Strategy',
    message: 'New deliberate practice breakdown for multi-step physics proofs added to your planner.',
    time: '1d ago',
    read: true,
    type: 'mentor'
  }
];

export const MOCK_WEEKLY_VELOCITY = [
  { day: 'Mon', hours: 3.2, goal: 3.0, efficiency: 94 },
  { day: 'Tue', hours: 2.8, goal: 3.0, efficiency: 90 },
  { day: 'Wed', hours: 3.6, goal: 3.0, efficiency: 96 },
  { day: 'Thu', hours: 3.4, goal: 3.0, efficiency: 92 },
  { day: 'Fri', hours: 2.5, goal: 3.0, efficiency: 88 },
  { day: 'Sat', hours: 1.8, goal: 2.5, efficiency: 89 },
  { day: 'Sun', hours: 1.2, goal: 2.5, efficiency: 85 }
];
