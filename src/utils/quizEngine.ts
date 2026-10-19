import { GradeLevelId, QuizQuestion, QuizResult, QuizIncorrectRecord } from '../types';

export interface AdaptiveQuizConfig {
  gradeId: GradeLevelId;
  gradeLabel: string;
  subject: string;
  topic?: string;
  questionCount: number;
  mode: 'adaptive' | 'easy' | 'medium' | 'hard';
}

export interface AdaptiveStepResult {
  nextQuestion: QuizQuestion;
  adaptationReason: string;
  newDifficulty: 'easy' | 'medium' | 'hard';
  tierLabel: string;
}

/**
 * Rich pedagogical question bank partitioned by Grade Level, Subject, and Difficulty Tier.
 * Every question has strictly 4 options (A, B, C, D) and a detailed pedagogical explanation.
 */
export const CURRICULUM_QUESTION_BANK: Record<
  GradeLevelId,
  Record<string, Record<'easy' | 'medium' | 'hard', QuizQuestion[]>>
> = {
  primary: {
    Mathematics: {
      easy: [
        {
          id: 'prim-math-e1',
          question: 'What is 48 + 27?',
          options: ['65', '75', '71', '85'],
          correctIndex: 1,
          explanation: 'Add the ones first: 8 + 7 = 15 (5 ones, carry 1 ten). Then add the tens: 4 + 2 + 1 = 7 tens. The answer is 75.',
          topic: 'Addition with Regrouping',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        },
        {
          id: 'prim-math-e2',
          question: 'How many sides does a regular pentagon have?',
          options: ['4', '5', '6', '8'],
          correctIndex: 1,
          explanation: 'The prefix "penta-" comes from the Greek word for five. A pentagon is a polygon with exactly 5 straight sides.',
          topic: '2D Geometric Shapes',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'prim-math-m1',
          question: 'A baker bakes 7 trays of cookies. Each tray has 8 cookies. How many cookies are there in total?',
          options: ['48', '54', '56', '64'],
          correctIndex: 2,
          explanation: 'Using multiplication: 7 trays × 8 cookies per tray = 56 cookies.',
          topic: 'Multiplication Tables & Word Problems',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        },
        {
          id: 'prim-math-m2',
          question: 'What fraction of a pizza is left if 3 slices out of 8 equal slices have been eaten?',
          options: ['3/8', '5/8', '8/3', '5/5'],
          correctIndex: 1,
          explanation: 'The whole pizza has 8 slices. If 3 slices were eaten, 8 - 3 = 5 slices remain, which is 5/8 of the pizza.',
          topic: 'Fractions & Part-to-Whole',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        }
      ],
      hard: [
        {
          id: 'prim-math-h1',
          question: 'A rectangular garden has a length of 9 meters and a perimeter of 30 meters. What is its width?',
          options: ['4 meters', '6 meters', '12 meters', '21 meters'],
          correctIndex: 1,
          explanation: 'Perimeter of a rectangle = 2 × (Length + Width). 30 = 2 × (9 + Width), so 9 + Width = 15. Therefore, Width = 15 - 9 = 6 meters.',
          topic: 'Perimeter & Multi-step Geometry',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Challenge'
        },
        {
          id: 'prim-math-h2',
          question: 'A train leaves at 2:45 PM and arrives at 4:20 PM. How long did the trip take?',
          options: ['1 hour 15 minutes', '1 hour 25 minutes', '1 hour 35 minutes', '1 hour 45 minutes'],
          correctIndex: 2,
          explanation: 'From 2:45 PM to 3:00 PM is 15 minutes. From 3:00 PM to 4:20 PM is 1 hour 20 minutes. Total time = 15 mins + 1h 20m = 1 hour 35 minutes.',
          topic: 'Elapsed Time Calculations',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Challenge'
        }
      ]
    },
    Science: {
      easy: [
        {
          id: 'prim-sci-e1',
          question: 'What part of a plant absorbs water and nutrients from the soil?',
          options: ['Leaves', 'Stem', 'Roots', 'Flower'],
          correctIndex: 2,
          explanation: 'Roots anchor the plant into the soil and absorb water and dissolved mineral nutrients through tiny root hairs.',
          topic: 'Plant Biology & Organs',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'prim-sci-m1',
          question: 'Which of the following processes turns liquid water into invisible water vapor when heated by the sun?',
          options: ['Condensation', 'Evaporation', 'Precipitation', 'Freezing'],
          correctIndex: 1,
          explanation: 'Evaporation is the phase change from liquid to gas when heat energy increases the movement of water molecules.',
          topic: 'The Water Cycle & States of Matter',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        }
      ],
      hard: [
        {
          id: 'prim-sci-h1',
          question: 'Why does ice float on top of liquid water?',
          options: [
            'Ice is heavier than liquid water',
            'Water expands as it freezes, making ice less dense than water',
            'Air bubbles push the ice up from the bottom',
            'Ice has zero mass compared to water'
          ],
          correctIndex: 1,
          explanation: 'When water freezes into crystalline ice, hydrogen bonds push molecules into a lattice that is less dense than liquid water, allowing it to float.',
          topic: 'Density & Physical Properties',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Challenge'
        }
      ]
    }
  },

  middle: {
    Mathematics: {
      easy: [
        {
          id: 'mid-math-e1',
          question: 'What is the value of -15 + (-8) - (-12)?',
          options: ['-35', '-11', '5', '-19'],
          correctIndex: 1,
          explanation: '-15 + (-8) = -23. Then subtracting a negative is equivalent to adding: -23 - (-12) = -23 + 12 = -11.',
          topic: 'Operations on Integers',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        },
        {
          id: 'mid-math-e2',
          question: 'Solve for x: 3x - 7 = 14.',
          options: ['x = 5', 'x = 7', 'x = 21', 'x = 9'],
          correctIndex: 1,
          explanation: 'Add 7 to both sides: 3x = 14 + 7 = 21. Divide both sides by 3: x = 21 / 3 = 7.',
          topic: 'Linear Equations in One Variable',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'mid-math-m1',
          question: 'If the ratio of boys to girls in a class of 35 students is 3:2, how many girls are in the class?',
          options: ['10', '14', '15', '21'],
          correctIndex: 1,
          explanation: 'Total parts = 3 + 2 = 5 parts. Each part = 35 / 5 = 7 students. Girls = 2 parts × 7 = 14 girls.',
          topic: 'Ratios and Proportions',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        },
        {
          id: 'mid-math-m2',
          question: 'The angles of a triangle are in the ratio 2 : 3 : 4. What is the measure of the largest angle?',
          options: ['60°', '80°', '90°', '100°'],
          correctIndex: 1,
          explanation: 'The sum of angles in a triangle is 180°. Total parts = 2 + 3 + 4 = 9. Each part = 180° / 9 = 20°. Largest angle = 4 × 20° = 80°.',
          topic: 'Properties of Triangles',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        }
      ],
      hard: [
        {
          id: 'mid-math-h1',
          question: 'Evaluate: (2³ × 3⁴ × 4) / (3² × 32).',
          options: ['9', '18', '27', '36'],
          correctIndex: 0,
          explanation: 'Rewrite 4 as 2² and 32 as 2⁵: Numerator = 2³ × 2² × 3⁴ = 2⁵ × 3⁴. Denominator = 2⁵ × 3². (2⁵ × 3⁴) / (2⁵ × 3²) = 3⁴⁻² = 3² = 9.',
          topic: 'Laws of Exponents & Powers',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Rigor'
        }
      ]
    },
    Science: {
      easy: [
        {
          id: 'mid-sci-e1',
          question: 'Which organelle is known as the "powerhouse of the cell"?',
          options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
          correctIndex: 2,
          explanation: 'Mitochondria generate most of the chemical energy needed by cellular biochemical reactions in the form of ATP (adenosine triphosphate).',
          topic: 'Cell Biology & Structure',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'mid-sci-m1',
          question: 'An object of mass 12 kg is pushed with a net force of 36 N. What is its acceleration?',
          options: ['0.33 m/s²', '2.0 m/s²', '3.0 m/s²', '48 m/s²'],
          correctIndex: 2,
          explanation: 'Newton’s Second Law states F = m × a. Rearranging for acceleration: a = F / m = 36 N / 12 kg = 3.0 m/s².',
          topic: 'Force and Laws of Motion',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        }
      ],
      hard: [
        {
          id: 'mid-sci-h1',
          question: 'When hydrochloric acid (HCl) reacts with sodium hydroxide (NaOH), what are the products formed?',
          options: [
            'Sodium chloride and water',
            'Sodium hydride and chlorine gas',
            'Sodium oxide and hydrogen gas',
            'Sodium chlorate and water'
          ],
          correctIndex: 0,
          explanation: 'This is a classic acid-base neutralization reaction: HCl + NaOH → NaCl (salt) + H₂O (water).',
          topic: 'Acids, Bases & Neutralization',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Rigor'
        }
      ]
    }
  },

  secondary: {
    Mathematics: {
      easy: [
        {
          id: 'sec-math-e1',
          question: 'What is the discriminant of the quadratic equation 2x² - 4x + 3 = 0?',
          options: ['-8', '8', '-40', '16'],
          correctIndex: 0,
          explanation: 'Discriminant D = b² - 4ac. Here a = 2, b = -4, c = 3. D = (-4)² - 4(2)(3) = 16 - 24 = -8.',
          topic: 'Quadratic Equations & Roots',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        },
        {
          id: 'sec-math-e2',
          question: 'If sin θ = 3/5 for an acute angle θ, what is the value of cos θ?',
          options: ['4/5', '5/3', '3/4', '1/5'],
          correctIndex: 0,
          explanation: 'Using the fundamental identity sin²θ + cos²θ = 1: cos²θ = 1 - (3/5)² = 1 - 9/25 = 16/25. Since θ is acute, cos θ = √(16/25) = 4/5.',
          topic: 'Trigonometric Ratios & Identities',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'sec-math-m1',
          question: 'Find the 15th term of the Arithmetic Progression (AP): 4, 9, 14, 19, ...',
          options: ['70', '74', '79', '84'],
          correctIndex: 1,
          explanation: 'First term a = 4, common difference d = 9 - 4 = 5. nth term an = a + (n - 1)d. a₁₅ = 4 + (15 - 1) × 5 = 4 + 14 × 5 = 4 + 70 = 74.',
          topic: 'Arithmetic Progressions (AP)',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        },
        {
          id: 'sec-math-m2',
          question: 'What are the coordinates of the point dividing the line segment joining (1, 3) and (4, 6) internally in the ratio 2:1?',
          options: ['(3, 5)', '(2, 4)', '(3, 6)', '(2.5, 4.5)'],
          correctIndex: 0,
          explanation: 'Section formula: x = (m₁x₂ + m₂x₁) / (m₁ + m₂) = (2×4 + 1×1) / 3 = 9/3 = 3. y = (2×6 + 1×3) / 3 = 15/3 = 5. Point is (3, 5).',
          topic: 'Coordinate Geometry & Section Formula',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        }
      ],
      hard: [
        {
          id: 'sec-math-h1',
          question: 'If the sum of the first n terms of an AP is given by Sn = 3n² + 5n, what is its 10th term?',
          options: ['58', '62', '65', '70'],
          correctIndex: 1,
          explanation: 'an = Sn - S(n-1). S₁₀ = 3(10)² + 5(10) = 300 + 50 = 350. S₉ = 3(9)² + 5(9) = 3(81) + 45 = 243 + 45 = 288. a₁₀ = 350 - 288 = 62.',
          topic: 'Sum of Arithmetic Progressions',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Board Exam Rigor'
        }
      ]
    },
    Physics: {
      easy: [
        {
          id: 'sec-phy-e1',
          question: 'What is the focal length of a spherical mirror whose radius of curvature is 30 cm?',
          options: ['15 cm', '30 cm', '60 cm', '7.5 cm'],
          correctIndex: 0,
          explanation: 'The focal length f of a spherical mirror equals half of its radius of curvature R: f = R / 2 = 30 cm / 2 = 15 cm.',
          topic: 'Reflection of Light & Spherical Mirrors',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'sec-phy-m1',
          question: 'Two resistors of 6 Ω and 12 Ω are connected in parallel across a 12 V battery. What is the total current flowing from the battery?',
          options: ['1 A', '2 A', '3 A', '4 A'],
          correctIndex: 2,
          explanation: 'Equivalent parallel resistance Rp = (R₁ × R₂) / (R₁ + R₂) = (6 × 12) / (6 + 12) = 72 / 18 = 4 Ω. Current I = V / Rp = 12 V / 4 Ω = 3 A.',
          topic: 'Current Electricity & Resistance',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate'
        }
      ],
      hard: [
        {
          id: 'sec-phy-h1',
          question: 'An object is placed 20 cm in front of a concave mirror of focal length 15 cm. What is the nature and magnification of the image?',
          options: [
            'Virtual, erect, m = +3',
            'Real, inverted, m = -3',
            'Real, inverted, m = -0.5',
            'Virtual, erect, m = +0.5'
          ],
          correctIndex: 1,
          explanation: '1/v + 1/u = 1/f. With sign conventions: u = -20 cm, f = -15 cm. 1/v = 1/(-15) - 1/(-20) = -1/15 + 1/20 = -1/60. v = -60 cm. Magnification m = -v/u = -(-60)/(-20) = -3 (real, inverted, 3x magnified).',
          topic: 'Optics & Mirror Formula Derivations',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Board Exam Rigor'
        }
      ]
    }
  },

  senior: {
    Mathematics: {
      easy: [
        {
          id: 'sen-math-e1',
          question: 'What is the derivative of f(x) = ln(3x² + 1) with respect to x?',
          options: ['6x / (3x² + 1)', '1 / (3x² + 1)', '6x · ln(3x² + 1)', '3x / (3x² + 1)'],
          correctIndex: 0,
          explanation: 'Using the chain rule: d/dx[ln(u)] = (1/u) · (du/dx). Here u = 3x² + 1, so du/dx = 6x. Therefore, f\'(x) = 6x / (3x² + 1).',
          topic: 'Chain Rule & Logarithmic Differentiation',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        },
        {
          id: 'sen-math-e2',
          question: 'Evaluate the limit: lim (x → 0) [sin(5x) / x].',
          options: ['0', '1', '5', 'Undefined'],
          correctIndex: 2,
          explanation: 'Since lim (u → 0) [sin(u) / u] = 1, we multiply numerator and denominator by 5: 5 · [sin(5x) / 5x] → 5 · 1 = 5.',
          topic: 'Limits & Continuity',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'sen-math-m1',
          question: 'Evaluate the definite integral: ∫₀¹ x · e^(x²) dx.',
          options: ['(e - 1) / 2', 'e / 2', 'e - 1', '(e² - 1) / 2'],
          correctIndex: 0,
          explanation: 'Let u = x², so du = 2x dx => x dx = du/2. When x = 0, u = 0; when x = 1, u = 1. Integral becomes 1/2 ∫₀¹ e^u du = 1/2 [e^u]₀¹ = (e - 1) / 2.',
          topic: 'Integration by Substitution',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate Application'
        },
        {
          id: 'sen-math-m2',
          question: 'Find the projection of vector a = 2i + 3j + 2k on vector b = i + 2j + k.',
          options: ['5 / √6', '10 / √6', '10 / 6', '4 / √6'],
          correctIndex: 1,
          explanation: 'Projection of a on b = (a · b) / |b|. a · b = (2)(1) + (3)(2) + (2)(1) = 2 + 6 + 2 = 10. |b| = √(1² + 2² + 1²) = √6. Projection = 10 / √6.',
          topic: 'Vector Algebra & Projections',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate Application'
        }
      ],
      hard: [
        {
          id: 'sen-math-h1',
          question: 'What is the maximum slope of the curve y = -x³ + 3x² + 9x - 27?',
          options: ['9', '12', '15', '27'],
          correctIndex: 1,
          explanation: 'The slope is dy/dx = -3x² + 6x + 9. To maximize slope, take derivative of slope: d²y/dx² = -6x + 6 = 0 => x = 1. At x = 1, slope = -3(1)² + 6(1) + 9 = -3 + 6 + 9 = 12.',
          topic: 'Applications of Derivatives (Max/Min)',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Olympiad / JEE Rigor'
        },
        {
          id: 'sen-math-h2',
          question: 'Find the general solution to the differential equation dy/dx + y/x = x².',
          options: ['y = x³/4 + C/x', 'y = x³/3 + C', 'y = x⁴/4 + C', 'y = 4x³ + C/x'],
          correctIndex: 0,
          explanation: 'Integrating factor IF = e^(∫(1/x)dx) = e^(ln x) = x. Multiplying by IF: x(dy/dx) + y = x³ => d/dx(x·y) = x³. Integrating both sides: x·y = x⁴/4 + C => y = x³/4 + C/x.',
          topic: 'First Order Linear Differential Equations',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Olympiad / JEE Rigor'
        }
      ]
    },
    Physics: {
      easy: [
        {
          id: 'sen-phy-e1',
          question: 'In rotational motion without slipping, what is the relation between linear velocity v and angular velocity ω of a cylinder of radius R?',
          options: ['v = ω / R', 'v = ω · R', 'v = ω · R²', 'v = 2ω · R'],
          correctIndex: 1,
          explanation: 'For pure rolling without slipping, the contact point is instantaneously at rest relative to the surface, giving v = ωR.',
          topic: 'Rotational Motion & Rolling',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'sen-phy-m1',
          question: 'A solid cylinder and a thin hollow hoop of equal mass and radius roll down an inclined plane from rest without slipping. Which reaches the bottom first?',
          options: [
            'The hollow hoop reaches first',
            'The solid cylinder reaches first',
            'Both reach at the exact same time',
            'Depends on the angle of inclination'
          ],
          correctIndex: 1,
          explanation: 'Acceleration on an incline rolling without slipping is a = g·sin(θ) / (1 + I/(mR²)). For a cylinder, I/(mR²) = 1/2. For a hoop, I/(mR²) = 1. The cylinder has smaller moment of inertia ratio, higher acceleration, and reaches first.',
          topic: 'Moment of Inertia & Energy Conservation',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate Application'
        }
      ],
      hard: [
        {
          id: 'sen-phy-h1',
          question: 'A Carnot engine operates between temperatures of 500 K and 300 K. If it absorbs 1000 J of heat from the reservoir, how much work is done?',
          options: ['200 J', '400 J', '600 J', '800 J'],
          correctIndex: 1,
          explanation: 'Carnot efficiency η = 1 - (Tc / Th) = 1 - (300 / 500) = 1 - 0.6 = 0.40 (40%). Work done W = η · Qh = 0.40 × 1000 J = 400 J.',
          topic: 'Thermodynamics & Carnot Cycle',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Olympiad / JEE Rigor'
        }
      ]
    }
  },

  diploma: {
    'Applied Mathematics': {
      easy: [
        {
          id: 'dip-math-e1',
          question: 'What is the determinant of the 2x2 matrix [[3, 2], [1, 4]]?',
          options: ['10', '14', '12', '8'],
          correctIndex: 0,
          explanation: 'Det = (3 × 4) - (2 × 1) = 12 - 2 = 10.',
          topic: 'Matrix Determinants',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'dip-math-m1',
          question: 'Find the Laplace transform of the function f(t) = e^(3t).',
          options: ['1 / (s - 3)', '1 / (s + 3)', '3 / s', 's / (s - 3)'],
          correctIndex: 0,
          explanation: 'The standard Laplace transform formula for e^(at) is L{e^(at)} = 1 / (s - a) for s > a. Here a = 3, so L{e^(3t)} = 1 / (s - 3).',
          topic: 'Laplace Transforms',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Intermediate Application'
        }
      ],
      hard: [
        {
          id: 'dip-math-h1',
          question: 'What is the condition for two non-zero vectors u and v to be orthogonal?',
          options: ['u × v = 0', 'u · v = 0', '|u| = |v|', 'u · v = 1'],
          correctIndex: 1,
          explanation: 'The dot product u · v = |u||v|cos(θ). For orthogonal vectors θ = 90°, so cos(90°) = 0, which means u · v = 0.',
          topic: 'Orthogonality & Inner Products',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Engineering Rigor'
        }
      ]
    }
  },

  undergrad: {
    'Computer Science': {
      easy: [
        {
          id: 'ug-cs-e1',
          question: 'What is the worst-case time complexity of standard QuickSort with poor pivot selection?',
          options: ['O(N log N)', 'O(N)', 'O(N²)', 'O(log N)'],
          correctIndex: 2,
          explanation: 'When the pivot chosen is consistently the smallest or largest element (e.g. on an already sorted array with naive pivot), the recursion tree degenerates to depth N, resulting in O(N²) comparisons.',
          topic: 'Algorithm Analysis & Sorting',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        },
        {
          id: 'ug-cs-e2',
          question: 'In relational databases, which normal form eliminates transitive functional dependencies?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctIndex: 2,
          explanation: 'Third Normal Form (3NF) requires 2NF and mandates that no non-prime attribute is transitively dependent on any candidate key (X → Y, Y → Z).',
          topic: 'Database Normalization',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Foundations'
        }
      ],
      medium: [
        {
          id: 'ug-cs-m1',
          question: 'Which of the following is NOT a necessary condition for a deadlock to occur in an operating system?',
          options: [
            'Mutual Exclusion',
            'Hold and Wait',
            'Preemption Allowed',
            'Circular Wait'
          ],
          correctIndex: 2,
          explanation: 'The four Coffman conditions are: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption (resources cannot be forcibly reclaimed), and 4) Circular Wait. Allowing preemption breaks deadlocks!',
          topic: 'Operating Systems & Concurrency',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Systems Architecture'
        },
        {
          id: 'ug-cs-m2',
          question: 'In an AVL tree, after inserting a node into the left subtree of the left child, what rotation restores balance?',
          options: ['Right-Left (RL) rotation', 'Left-Right (LR) rotation', 'Single Right (LL) rotation', 'Single Left (RR) rotation'],
          correctIndex: 2,
          explanation: 'The Left-Left (LL) imbalance is resolved by a single Right rotation centered on the unbalanced node.',
          topic: 'Balanced Search Trees & Rotations',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Systems Architecture'
        }
      ],
      hard: [
        {
          id: 'ug-cs-h1',
          question: 'What is the space complexity of Dijkstra\'s algorithm implemented with an adjacency list and min-heap priority queue for a graph with V vertices and E edges?',
          options: ['O(V)', 'O(V + E)', 'O(V²)', 'O(E log V)'],
          correctIndex: 1,
          explanation: 'The adjacency list stores O(V + E) memory. The distance array, visited set, and min-heap store at most O(V) elements. Thus total auxiliary space complexity is O(V + E).',
          topic: 'Graph Algorithms & Space Bounds',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Advanced Algorithmic Rigor'
        }
      ]
    }
  },

  postgrad: {
    'Advanced Computing & Research': {
      easy: [
        {
          id: 'pg-ac-e1',
          question: 'In deep learning transformers, what is the computational complexity of the self-attention mechanism with respect to sequence length N?',
          options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
          correctIndex: 2,
          explanation: 'Standard scaled dot-product attention computes an N × N attention matrix multiplying Query (Q) and Key (K) matrices, resulting in O(N² · d) time and memory complexity.',
          topic: 'Transformer Attention Mechanics',
          difficulty: 'easy',
          tierLabel: 'Tier 1: Graduate Foundations'
        }
      ],
      medium: [
        {
          id: 'pg-ac-m1',
          question: 'In Bayesian inference, what is the term for P(θ | X), the probability distribution of parameters θ given observed data X?',
          options: ['Likelihood', 'Prior distribution', 'Posterior distribution', 'Evidence margin'],
          correctIndex: 2,
          explanation: 'By Bayes\' theorem: P(θ | X) = [P(X | θ) · P(θ)] / P(X). P(θ | X) is the posterior distribution updating our beliefs after observing evidence.',
          topic: 'Bayesian Inference & Estimation',
          difficulty: 'medium',
          tierLabel: 'Tier 2: Statistical Modeling'
        }
      ],
      hard: [
        {
          id: 'pg-ac-h1',
          question: 'In distributed systems, which tradeoff is formally proven impossible by the CAP Theorem in the presence of network partitions (P)?',
          options: [
            'Simultaneous strong Consistency (C) and high Availability (A)',
            'Latency and Throughput',
            'Durability and Atomicity',
            'Scalability and Concurrency'
          ],
          correctIndex: 0,
          explanation: 'Brewer\'s CAP theorem states that in a distributed data store experiencing network partitions (loss of messages), the system can guarantee either Consistency (every read receives most recent write) or Availability (every non-failing node returns a response), but not both simultaneously.',
          topic: 'Distributed Systems & CAP Theorem',
          difficulty: 'hard',
          tierLabel: 'Tier 3: Distributed Systems Theory'
        }
      ]
    }
  }
};

/**
 * Fallback questions if specific subject is not in curriculum dictionary
 */
export const GENERIC_SUBJECT_FALLBACK_QUESTIONS: Record<'easy' | 'medium' | 'hard', QuizQuestion[]> = {
  easy: [
    {
      id: 'gen-e1',
      question: 'Which of the following best defines the scientific method of inquiry?',
      options: [
        'Forming a testable hypothesis, gathering empirical evidence, and refining conclusions',
        'Accepting past assertions without verification',
        'Relying solely on intuition without measurement',
        'Guessing randomly until a pattern is discovered'
      ],
      correctIndex: 0,
      explanation: 'The scientific method centers on systematic observation, falsifiable hypothesis formation, rigorous testing, and iterative refinement.',
      topic: 'Scientific Methodology',
      difficulty: 'easy',
      tierLabel: 'Tier 1: Foundations'
    }
  ],
  medium: [
    {
      id: 'gen-m1',
      question: 'When analyzing cause and effect in complex systems, what is a "feedback loop"?',
      options: [
        'An error in data transmission that breaks the model',
        'A mechanism where the output of a system circles back to influence its future inputs',
        'A one-directional pipeline with zero return signals',
        'A static parameter that never changes over time'
      ],
      correctIndex: 1,
      explanation: 'A feedback loop occurs when outputs of a system are routed back as inputs as part of a chain of cause-and-effect that forms a circuit.',
      topic: 'Systems Thinking & Dynamics',
      difficulty: 'medium',
      tierLabel: 'Tier 2: Intermediate'
    }
  ],
  hard: [
    {
      id: 'gen-h1',
      question: 'In first-principles reasoning, how is a complex problem deconstructed?',
      options: [
        'By reasoning by analogy with existing competitors',
        'By boiling the problem down to fundamental truths and reasoning up from there',
        'By copying common industry conventions',
        'By avoiding mathematical proof and relying on estimates'
      ],
      correctIndex: 1,
      explanation: 'First-principles thinking involves breaking a problem down to its most fundamental, indisputable truths that cannot be deduced any further, then building upwards.',
      topic: 'First-Principles Cognitive Analysis',
      difficulty: 'hard',
      tierLabel: 'Tier 3: Advanced Challenge'
    }
  ]
};

/**
 * Resolves available questions for a given grade and subject.
 */
export function getQuestionsForCurriculum(
  gradeId: GradeLevelId,
  subjectName: string
): Record<'easy' | 'medium' | 'hard', QuizQuestion[]> {
  const gradePool = CURRICULUM_QUESTION_BANK[gradeId];
  if (!gradePool) {
    return GENERIC_SUBJECT_FALLBACK_QUESTIONS;
  }

  // Exact match
  if (gradePool[subjectName]) {
    return gradePool[subjectName];
  }

  // Partial match (e.g. "Math" in "Mathematics", "Physics" in "Physics & Mechanics")
  const subLower = subjectName.toLowerCase();
  for (const [key, questions] of Object.entries(gradePool)) {
    if (subLower.includes(key.toLowerCase()) || key.toLowerCase().includes(subLower)) {
      return questions;
    }
  }

  // Check closest STEM subject
  const keys = Object.keys(gradePool);
  if (keys.length > 0) {
    return gradePool[keys[0]];
  }

  return GENERIC_SUBJECT_FALLBACK_QUESTIONS;
}

/**
 * Generates an adaptive sequence of questions.
 */
export function buildAdaptiveQuiz(
  config: AdaptiveQuizConfig
): QuizQuestion[] {
  const pool = getQuestionsForCurriculum(config.gradeId, config.subject);

  // In adaptive mode, initial question is Tier 2 (medium), followed by dynamic adaptation
  const questions: QuizQuestion[] = [];
  const easyList = [...(pool.easy || [])];
  const medList = [...(pool.medium || [])];
  const hardList = [...(pool.hard || [])];

  // Guarantee at least questionCount questions by pulling with fallbacks
  const targetCount = Math.max(3, Math.min(config.questionCount, 10));

  if (config.mode === 'easy') {
    questions.push(...easyList);
    questions.push(...medList);
  } else if (config.mode === 'hard') {
    questions.push(...hardList);
    questions.push(...medList);
  } else {
    // Adaptive: starts with medium, then includes a balanced adaptive reserve
    if (medList.length > 0) questions.push(medList[0]);
    if (hardList.length > 0) questions.push(hardList[0]);
    if (easyList.length > 0) questions.push(easyList[0]);
    if (medList.length > 1) questions.push(medList[1]);
    if (hardList.length > 1) questions.push(hardList[1]);
  }

  // Ensure four options and valid structure on each question
  const validated = questions.slice(0, targetCount).map((q, idx) => ({
    ...q,
    id: `${q.id}-${idx}-${Date.now()}`
  }));

  if (validated.length < targetCount) {
    // Fill remaining with generic fallbacks
    const fallbackList = [
      ...GENERIC_SUBJECT_FALLBACK_QUESTIONS.medium,
      ...GENERIC_SUBJECT_FALLBACK_QUESTIONS.hard,
      ...GENERIC_SUBJECT_FALLBACK_QUESTIONS.easy
    ];
    let fIdx = 0;
    while (validated.length < targetCount) {
      const fb = fallbackList[fIdx % fallbackList.length];
      validated.push({
        ...fb,
        id: `fb-${validated.length}-${Date.now()}`
      });
      fIdx++;
    }
  }

  return validated;
}

/**
 * Computes topic mastery stats from persistent quiz history.
 */
export function computeTopicMastery(results: QuizResult[]): {
  topic: string;
  subject: string;
  accuracy: number;
  attempts: number;
  status: 'Mastered' | 'Proficient' | 'Needs Review';
}[] {
  const map = new Map<string, { totalScore: number; count: number; subject: string }>();

  results.forEach((res) => {
    const topics = res.topicsCovered && res.topicsCovered.length > 0 ? res.topicsCovered : [res.topic || res.title];
    topics.forEach((t) => {
      const existing = map.get(t) || { totalScore: 0, count: 0, subject: res.subject };
      existing.totalScore += res.score;
      existing.count += 1;
      map.set(t, existing);
    });
  });

  const list: {
    topic: string;
    subject: string;
    accuracy: number;
    attempts: number;
    status: 'Mastered' | 'Proficient' | 'Needs Review';
  }[] = [];

  map.forEach((data, topic) => {
    const avg = Math.round(data.totalScore / data.count);
    list.push({
      topic,
      subject: data.subject,
      accuracy: avg,
      attempts: data.count,
      status: avg >= 80 ? 'Mastered' : avg >= 60 ? 'Proficient' : 'Needs Review'
    });
  });

  return list.sort((a, b) => a.accuracy - b.accuracy); // weakest topics first
}
