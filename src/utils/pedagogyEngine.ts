import { GradeLevelId, StudentProfile, SubjectProgress } from '../types';

export interface PedagogicalResponse {
  responseText: string;
  speechText: string;
  levelBadge: string;
  sourceEngine: 'curriculum_engine' | 'gemini_api';
  keyTakeaway: string;
  suggestedFollowUps: string[];
}

/**
 * Maps curriculum-grounded Socratic explanations adapted to the student's
 * specific education level (Class 1-5 up to Postgraduate) and selected subject.
 */
export function generateCurriculumResponse(
  query: string,
  profile: StudentProfile,
  activeSubject: string
): PedagogicalResponse {
  const q = query.trim().toLowerCase();
  const name = profile.name || 'Student';
  const gradeId = profile.gradeId;
  const gradeLabel = profile.gradeLabel;
  const degree = profile.degree || profile.currentClassOrCourse || '';
  const branch = profile.branch ? `(${profile.branch})` : '';

  // Extract Student Intelligence metrics
  const strengths = profile.mirrorData?.strengths || [];
  const gaps = profile.mirrorData?.gaps || [];
  const primaryStrength = strengths[0]?.topic || 'conceptual modeling';
  const primaryGap = gaps[0]?.concept || 'multi-step algebra';
  const targetGoal = profile.learningGoals?.[0] || 'mastering your core curriculum';
  const quizResults = profile.quizResults || [];
  const latestQuiz = quizResults[0];

  // Determine subject domain
  const subLower = activeSubject.toLowerCase();
  const isMath = subLower.includes('math') || subLower.includes('calculus') || subLower.includes('algebra') || subLower.includes('geometry');
  const isPhysics = subLower.includes('physics') || subLower.includes('mechanics') || subLower.includes('electromagnet');
  const isChemistry = subLower.includes('chem') || subLower.includes('organic') || subLower.includes('inorganic');
  const isCS = subLower.includes('computer') || subLower.includes('data') || subLower.includes('code') || subLower.includes('algorithm') || subLower.includes('software');
  const isBio = subLower.includes('bio') || subLower.includes('botany') || subLower.includes('zoology') || subLower.includes('life');

  // Check query intent
  const isUnpackQuery = q.includes('unpack') || q.includes('student intelligence') || q.includes('diagnostics');
  const isGapQuery = isUnpackQuery || q.includes('gap') || q.includes('blindspot') || q.includes('mistake') || q.includes('struggling') || q.includes('weak') || q.includes('error');
  const isScheduleQuery = q.includes('schedule') || q.includes('plan') || q.includes('tonight') || q.includes('routine') || q.includes('time') || q.includes('focus');
  const isChallengeQuery = q.includes('challenge') || q.includes('quiz') || q.includes('test') || q.includes('question') || q.includes('problem');
  const isFoundationQuery = q.includes('foundation') || q.includes('principle') || q.includes('basics') || q.includes('core') || q.includes('formula') || q.includes('concept');

  // ================= 1. PRIMARY LEVEL (Class 1 – 5) =================
  if (gradeId === 'primary') {
    let mainText = '';
    let speech = '';
    let takeaway = '';
    let followUps: string[] = [];

    if (isGapQuery) {
      mainText = `Hi ${name}! 🎉 Don't worry at all when something feels tricky. In **${activeSubject}**, tricky problems are just puzzles waiting to be solved!\n\n🌟 **Dr. Elena's Magic Trick:** Whenever you see a big problem, break it into tiny friendly pieces—just like building a Lego castle one brick at a time.\n\nDraw a quick picture on paper before answering. Your brain loves pictures!`;
      speech = `Hi ${name}! Tricky problems in ${activeSubject} are just puzzles. Try drawing a quick picture on paper first—your brain loves pictures, and breaking things down into friendly pieces makes it easy!`;
      takeaway = 'Break big problems into tiny friendly steps and draw a picture!';
      followUps = [
        'Can you show me an example with a fun drawing?',
        'Give me a playful riddle in this subject!'
      ];
    } else if (isScheduleQuery) {
      mainText = `Here is your super-fun study game plan for tonight, ${name}!\n\n⏰ **20 Minutes of Fun Learning:** Focus on **${activeSubject}** with high curiosity.\n🍎 **5 Minutes Snack Break:** Stretch, drink a glass of water, or give a high five!\n⭐ **10 Minutes Review:** Tell someone at home what cool fact you learned today.\n\nShort, happy bursts make you remember everything much better!`;
      speech = `Here is your study plan, ${name}! Spend twenty minutes on ${activeSubject}, take a five-minute snack break, and then share one cool fact you learned with your family!`;
      takeaway = '20 minutes of happy focus followed by water and a snack!';
      followUps = [
        'What is a fun story about tonight\'s topic?',
        'How many stars did I earn today?'
      ];
    } else if (isChallengeQuery) {
      mainText = `Here is your Quick Star Challenge in **${activeSubject}**, ${name}! ⭐\n\n🎯 **Question:** If you have 3 baskets and each basket holds 4 glowing stars, how many stars do you have in total? And if you give 2 stars to your best friend, how many are left?\n\nTake your time and count on your fingers or draw little stars!`;
      speech = `Here is your star challenge in ${activeSubject}! If you have three baskets and each has four glowing stars, how many stars do you have in all? Count them up!`;
      takeaway = 'Practice counting groups to master multiplication and subtraction!';
      followUps = [
        'I counted 10 stars, is that right?',
        'Give me another animal or star challenge!'
      ];
    } else {
      mainText = `Hello ${name}! ✨ In **${activeSubject}**, everything begins with asking big, curious questions like *"Why does that happen?"*\n\nThink of ${activeSubject} like exploring an exciting playground. When you play with numbers, shapes, or science experiments, your brain grows stronger every single day!\n\nWhat would you like to explore together next?`;
      speech = `Hello ${name}! In ${activeSubject}, every question makes your brain grow stronger. Ask me anything you want to know about our fun topics!`;
      takeaway = 'Curiosity turns learning into an exciting playground adventure.';
      followUps = [
        'Why do things fall down to the ground?',
        'How do plants drink water through their roots?'
      ];
    }

    return {
      responseText: mainText,
      speechText: speech,
      levelBadge: 'Class 1–5 Foundations',
      sourceEngine: 'curriculum_engine',
      keyTakeaway: takeaway,
      suggestedFollowUps: followUps
    };
  }

  // ================= 2. MIDDLE SCHOOL (Class 6 – 8) =================
  if (gradeId === 'middle') {
    let mainText = '';
    let speech = '';
    let takeaway = '';
    let followUps: string[] = [];

    if (isGapQuery) {
      mainText = `Great instinct to inspect your learning gaps, ${name}. In **${activeSubject}** for Class 6–8, the most common trap is memorizing steps without picturing the underlying physical model.\n\n🔍 **Cognitive Fix:** Before writing formulas, ask yourself: *"What is happening in the real world here?"*\n• In ratios and fractions, picture dividing a pizza or measuring liquid in beakers.\n• In forces and motion, imagine riding a skateboard or kicking a football.\n• Always write down your units (like meters, grams, or seconds) so you don't drop them!`;
      speech = `Great instinct, ${name}. In ${activeSubject}, always picture what is happening in the real world before jumping into math. Visualizing the system and tracking your units prevents easy mistakes!`;
      takeaway = 'Visualize real-world models and track physical units on every step.';
      followUps = [
        'How can I convert between different units easily?',
        'Give me a concept check on force and motion!'
      ];
    } else if (isScheduleQuery) {
      mainText = `Here is an optimal study schedule for your Class 6–8 curriculum tonight, ${name}:\n\n1. **Deep Focus (25 mins):** Tackle challenging exercises in **${activeSubject}**.\n2. **Brain Refresh (5 mins):** Walk around, drink water, no phone or screens.\n3. **Active Recall (15 mins):** Close the book and write down the 3 biggest ideas you just learned.\n\nYour AI Mirror velocity shows this active recall loop locks concepts in long-term memory twice as fast!`;
      speech = `For tonight, ${name}: Spend twenty-five minutes on ${activeSubject}, take a five-minute screen-free rest, and finish with a quick fifteen-minute active recall drill where you write down the key ideas from memory.`;
      takeaway = '25m deep focus + 5m physical break + 15m closed-book active recall.';
      followUps = [
        'What are the best flashcard techniques for my grade?',
        'How do I study for my upcoming school tests?'
      ];
    } else if (isChallengeQuery) {
      mainText = `Here is your conceptual challenge in **${activeSubject}**, ${name}! 💡\n\n🎯 **Scenario:** You have a heavy solid metal ball and a light wooden ball of the exact same size. You drop both from your desk in a room. \n\n**Question:** Which one hits the floor first, and what would happen if we performed this inside a vacuum chamber with zero air resistance?\n\nThink about gravitational acceleration versus air drag!`;
      speech = `Here is your challenge in ${activeSubject}! If you drop a heavy metal ball and a light wooden ball of the same size, which lands first, and what happens in a vacuum chamber with no air?`;
      takeaway = 'Gravitational acceleration is constant for all masses when air drag is removed.';
      followUps = [
        'Do they land at the exact same time in a vacuum?',
        'Give me a math challenge with fractions and variables!'
      ];
    } else {
      mainText = `Welcome back, ${name}. For your **${gradeLabel}** journey in **${activeSubject}**, the goal is building bridges between concrete facts and abstract logic.\n\nInstead of just memorizing definitions, practice explaining *"Why does this rule work?"* to a classmate. When you can teach it simply, you own the concept completely.`;
      speech = `Welcome back, ${name}! In ${activeSubject}, we are building bridges from facts to abstract logic. Ask me about any topic and we will break down the underlying reasons together.`;
      takeaway = 'Conceptual mastery means being able to explain the "why" in simple terms.';
      followUps = [
        'Explain how photosynthesis turns sunlight into energy.',
        'What is the easiest way to solve equations with variables?'
      ];
    }

    return {
      responseText: mainText,
      speechText: speech,
      levelBadge: 'Class 6–8 Middle School',
      sourceEngine: 'curriculum_engine',
      keyTakeaway: takeaway,
      suggestedFollowUps: followUps
    };
  }

  // ================= 3. SECONDARY (Class 9 – 10) =================
  if (gradeId === 'secondary') {
    let mainText = '';
    let speech = '';
    let takeaway = '';
    let followUps: string[] = [];

    if (isGapQuery) {
      mainText = `Hello ${name}. For Board Exam preparation in **${activeSubject}**, examiners look for two things: conceptual precision and structured presentation.\n\n⚠️ **Common Secondary Trap:** Rushing through sign conventions (in coordinate geometry, optics, and kinematics) and skipping intermediate derivation steps.\n\n✅ **Fix:** Label every given variable with its SI unit and sign convention *first* in a dedicated column before picking formulas. This eliminates 80% of careless exam errors.`;
      speech = `Hello ${name}. In Class 9 and 10 ${activeSubject}, the biggest pitfall is rushing sign conventions in physics and algebra. Always state your given quantities and units explicitly before selecting formulas.`;
      takeaway = 'State given variables, sign conventions, and SI units in advance.';
      followUps = [
        'What are the most repeated board exam questions in this topic?',
        'Can we practice a 3-mark numerical problem?'
      ];
    } else if (isScheduleQuery) {
      mainText = `Targeted Class 10 Board study session for tonight, ${name}:\n\n• **Block 1 (35 mins):** Numerical problem sets in **${activeSubject}** under timed conditions (aim for 3 minutes per question).\n• **Rest (5 mins):** Deep breathing & hydration.\n• **Block 2 (25 mins):** Error log analysis—re-solve every question you got wrong this week without looking at the answer key.\n\nExam toppers spend more time analyzing errors than solving easy problems!`;
      speech = `Here is your board exam study plan, ${name}. Do thirty-five minutes of timed numerical problems in ${activeSubject}, followed by twenty-five minutes analyzing your personal error log from this week.`;
      takeaway = 'Timed problem solving combined with ruthless error log retrospectives.';
      followUps = [
        'How should I format my board exam answer sheet?',
        'What is the best revision strategy 30 days before exams?'
      ];
    } else {
      mainText = `In **${activeSubject}** (${gradeLabel}), board mastery requires transforming definitions into rigorous problem-solving tools.\n\nWhether working through Newton's laws, chemical stoichiometry, or quadratic polynomials, always verify your final answer with a sanity check: *Does the order of magnitude make physical sense?*`;
      speech = `In ${activeSubject}, board mastery comes down to precision and sanity checks. Always ask if your answer makes physical and mathematical sense before moving to the next question.`;
      takeaway = 'Verify numerical magnitude and dimensional consistency.';
      followUps = [
        'Explain how the lens formula uses Cartesian sign conventions.',
        'Why does quadratic factorization fail for prime roots?'
      ];
    }

    return {
      responseText: mainText,
      speechText: speech,
      levelBadge: 'Class 9–10 Board Mastery',
      sourceEngine: 'curriculum_engine',
      keyTakeaway: takeaway,
      suggestedFollowUps: followUps
    };
  }

  // ================= 4. SENIOR SECONDARY (Class 11 – 12 STEM / Pre-College) =================
  if (gradeId === 'senior') {
    let mainText = '';
    let speech = '';
    let takeaway = '';
    let followUps: string[] = [];

    if (isGapQuery) {
      mainText = `Analyzing cognitive diagnostic metrics for ${name} in **${activeSubject}** (Senior STEM):\n\n🔍 **Identified Micro-Gap:** Composite chain rule applications and boundary condition constraints under high-stress timed testing.\n\n💡 **First-Principles Remedy:** When evaluating multi-step problems (e.g. rotational dynamics, related rates, or equilibrium constants):\n1. **Isolate Free Variables:** Never plug numerical values into equations until the symbolic equation is fully simplified.\n2. **Dimensional Analysis Sanity Check:** Verify that $[\text{LHS}] = [\text{RHS}]$ before calculation. If the dimensions do not match, an algebraic index error occurred in an earlier line.\n3. **Asymptotic Limits:** Test edge cases ($t \\to 0$, $t \\to \\infty$, or $\\theta = 0, 90^\\circ$) to confirm the model behaves predictably.`;
      speech = `Let us tackle your identified learning gap in ${activeSubject}, ${name}. Keep your equations symbolic until the final step, and verify dimensional consistency on both sides before plugging in numbers. This eliminates algebraic dropouts under timed testing!`;
      takeaway = 'Keep equations purely symbolic until the final step; check dimensions and limits.';
      followUps = [
        'How do I identify non-inertial frames of reference in mechanics?',
        'Give me a tricky integration challenge testing chain rule substitution!'
      ];
    } else if (isScheduleQuery) {
      mainText = `High-yield competitive exam study protocol for ${name} tonight:\n\n• **Block A (45 mins):** Deep deliberate practice on unmastered concepts in **${activeSubject}**. Focus on unfamiliar multi-concept problems.\n• **Interleaving Buffer (10 mins):** Physical reset, eye strain relief.\n• **Block B (35 mins):** Speed recall test on secondary subject. Attempt 15 questions in 30 minutes without reference notes.\n• **Synthesis (10 mins):** Update your AI Mirror cognitive error journal with the exact trigger of any missed question.`;
      speech = `Here is your high-yield schedule tonight, ${name}. Dedicate forty-five minutes of deep problem-solving to ${activeSubject}, take a ten-minute reset, and do a rapid thirty-five minute speed test to build test stamina.`;
      takeaway = 'Interleaved deep focus blocks with an immediate cognitive error journal update.';
      followUps = [
        'How do I maintain concentration during a 3-hour mock exam?',
        'What is the optimal spaced repetition interval for organic reactions?'
      ];
    } else if (isChallengeQuery) {
      mainText = `Here is your Senior STEM conceptual challenge in **${activeSubject}**, ${name}!\n\n⚡ **Problem:** A uniform cylinder of mass $M$ and radius $R$ rolls without slipping down an inclined plane of angle $\\theta$.\n\n**Question:** \n1. What fraction of its total kinetic energy is rotational versus translational?\n2. Does this ratio depend on the mass $M$ or radius $R$ of the cylinder? *(Explain from first principles using moment of inertia $I = \\frac{1}{2} M R^2$!)*`;
      speech = `Here is your challenge in ${activeSubject}, ${name}! When a uniform cylinder rolls down an incline without slipping, what fraction of its total kinetic energy is rotational, and does it depend on the cylinder's mass or radius?`;
      takeaway = 'Rolling kinetic energy partitions depend strictly on the dimensionless geometry coefficient $k = I / MR^2$.';
      followUps = [
        'Is rotational KE exactly 1/3 of the total kinetic energy?',
        'How would the acceleration change if it were a hollow sphere instead?'
      ];
    } else {
      mainText = `Welcome ${name}. In Class 11–12 STEM, the paradigm shift is moving from memorizing formulas to mastering physical symmetries and conservation laws in **${activeSubject}**.\n\nWhenever you encounter an unfamiliar problem, ask: *What conserved quantities exist here? (Energy, momentum, angular momentum, charge, or mass)*. Conserved quantities collapse multi-variable complexity into direct solutions.`;
      speech = `In senior STEM, always look for conserved quantities first, ${name}. Energy, momentum, and charge conservation will cut through complex problems much faster than raw computation.`;
      takeaway = 'Conserved quantities and symmetry invariants collapse complex equations.';
      followUps = [
        'How does Hamiltonian mechanics generalize conservation of energy?',
        'Break down the physical intuition behind Maxwell-Boltzmann distribution.'
      ];
    }

    return {
      responseText: mainText,
      speechText: speech,
      levelBadge: 'Class 11–12 STEM & Pre-College',
      sourceEngine: 'curriculum_engine',
      keyTakeaway: takeaway,
      suggestedFollowUps: followUps
    };
  }

  // ================= 5. DIPLOMA / POLYTECHNIC =================
  if (gradeId === 'diploma') {
    let mainText = `Hello ${name}! For Diploma engineering in **${activeSubject}**, industry readiness requires understanding practical mechanics, industrial tolerancing, and diagnostic schematics.\n\n🔧 **Core Applied Rule:** Always connect theoretical equations to practical component specifications (e.g. current ratings, factor of safety, load limits, and thermal dissipation).\n\nWhat specific component or system diagram would you like to review?`;
    let speech = `Hello ${name}. In Diploma engineering for ${activeSubject}, we connect theory directly to practical machine components, safety factors, and hands-on diagnostics. What system shall we inspect?`;

    if (isGapQuery) {
      mainText = `Diagnostic analysis for your Diploma course in **${activeSubject}**, ${name}:\n\n⚙️ **Practical Engineering Fix:** Theoretical calculations often assume ideal conditions, but in the field you must account for friction, voltage drop, and thermal efficiency losses.\n\nAlways specify safety margins ($FOS \\ge 1.5 - 2.0$) and verify component thermal thresholds before finalizing calculations.`;
      speech = `In practical engineering, ${name}, always account for real-world losses and safety margins. Ideal equations must be verified against actual component thermal and load limits.`;
    }

    return {
      responseText: mainText,
      speechText: speech,
      levelBadge: 'Diploma / Applied Engineering',
      sourceEngine: 'curriculum_engine',
      keyTakeaway: 'Bridge theoretical formulas with industrial safety factors and diagnostics.',
      suggestedFollowUps: [
        'How do I calculate factor of safety for machine components?',
        'Explain practical troubleshooting steps for circuit voltage drops.'
      ]
    };
  }

  // ================= 6. UNDERGRADUATE (B.Tech, B.Sc, College) =================
  if (gradeId === 'undergrad') {
    let mainText = '';
    let speech = '';
    let takeaway = '';
    let followUps: string[] = [];

    if (isGapQuery) {
      mainText = `Undergraduate diagnostic evaluation for ${name} (${degree} ${branch}) in **${activeSubject}**:\n\n🔬 **Cognitive Bottleneck:** Transitioning from procedural heuristics to asymptotic and rigorous proof techniques.\n\n💡 **Architectural Recommendation:**\n• **Analyze Time/Space Invariants:** For systems and algorithms, explicitly declare invariants before designing state transitions.\n• **Trade-off Matrix:** In collegiate coursework, questions rarely have a single trivial answer. State the trade-off: e.g. latency vs throughput, memory footprint vs cache locality, or precision vs stability.\n• **Edge Cases:** Always test degenerate inputs ($N=0, 1$, cyclic graphs, floating-point roundoff).`;
      speech = `Here is your undergraduate analysis in ${activeSubject}, ${name}. Focus on architectural trade-offs, formal invariants, and edge case boundaries rather than straightforward heuristics.`;
      takeaway = 'State invariants explicitly and evaluate engineering trade-offs.';
      followUps = [
        'How do cache line invalidations impact multi-threaded performance?',
        'Explain the mathematical proof of Master Theorem for recursive relations.'
      ];
    } else if (isScheduleQuery) {
      mainText = `Collegiate engineering sprint schedule for ${name} tonight:\n\n• **Phase 1 (50 mins):** Deep implementation / mathematical proof derivation in **${activeSubject}**. Turn off all notifications; enter uninterrupted flow state.\n• **Phase 2 (10 mins):** Cognitive pause & hydration.\n• **Phase 3 (40 mins):** Code review, test bench design, or textbook problem set verification against benchmark solutions.\n• **Phase 4 (10 mins):** Document architecture notes or commit clean code to your repository.`;
      speech = `Here is your engineering sprint for tonight, ${name}. Fifty minutes of deep proof or implementation on ${activeSubject}, followed by test bench verification and architecture documentation.`;
      takeaway = '50m deep flow + 40m verification against test bench benchmarks.';
      followUps = [
        'What design patterns best suit concurrent data streaming?',
        'How do I prepare for campus technical interview rounds?'
      ];
    } else if (isChallengeQuery) {
      mainText = `Collegiate Challenge for ${name} in **${activeSubject}** (${degree}):\n\n💻 **Systems & Complexity Challenge:**\nSuppose you have a stream of $N$ elements where $N$ is unknown and cannot fit in memory. Design an algorithm that selects a uniform random element with probability $\\frac{1}{N}$ in a single pass ($O(1)$ extra space).\n\n*(Hint: Think about Reservoir Sampling and inductive conditional probabilities!)*`;
      speech = `Here is your challenge in ${activeSubject}, ${name}! How do you select a uniform random element from an infinite stream of unknown size in a single pass using constant memory?`;
      takeaway = 'Reservoir sampling uses inductive conditional probabilities to achieve uniform distribution in single-pass streaming.';
      followUps = [
        'Does the k-th item have replacement probability 1/k?',
        'How do you generalize reservoir sampling to select k items?'
      ];
    } else {
      mainText = `Welcome ${name}. At the undergraduate level (${degree} ${branch}), our focus in **${activeSubject}** is formal systems thinking and first-principles derivation.\n\nWe examine not just *how* a model or algorithm works, but its asymptotic limits, failure modes, and hardware/physical grounding. What topic shall we dissect?`;
      speech = `Welcome ${name}. In undergraduate ${activeSubject}, we dissect formal systems from first principles, analyzing asymptotic bounds and failure modes. What topic shall we explore?`;
      takeaway = 'First-principles systems thinking, formal proofs, and asymptotic complexity.';
      followUps = [
        'Explain the CAP theorem trade-offs in distributed datastores.',
        'Derive the Fourier Transform from the continuous limit of Fourier Series.'
      ];
    }

    return {
      responseText: mainText,
      speechText: speech,
      levelBadge: `Collegiate · ${degree || 'Undergrad'}`,
      sourceEngine: 'curriculum_engine',
      keyTakeaway: takeaway,
      suggestedFollowUps: followUps
    };
  }

  // ================= 7. POSTGRADUATE (Masters / Research / MBA) =================
  let mainText = `Welcome ${name}. In postgraduate and research scholarship (${degree} ${branch}) for **${activeSubject}**, the goal is advancing beyond textbook formulations toward state-of-the-art methodology and critical synthesis.\n\nWe evaluate underlying statistical or physical assumptions, empirical reproducibility, and mathematical foundations. What research or advanced thesis topic shall we interrogate?`;
  let speech = `Welcome ${name}. In postgraduate studies for ${activeSubject}, we examine research-grade literature, mathematical proofs, and experimental bounds. What advanced topic are you investigating?`;

  if (isGapQuery) {
    mainText = `Postgraduate research evaluation for ${name} in **${activeSubject}**:\n\n🔬 **Critical Gap Analysis:** Ensuring that theoretical assumptions (e.g. i.i.d. distributions, linearity, thermal equilibrium, or convexity) hold under empirical real-world conditions.\n\nExamine edge cases where standard models degrade, and perform rigorous sensitivity analysis on your hyper-parameters and error margins.`;
    speech = `In postgraduate research, ${name}, always scrutinize whether theoretical assumptions hold under real-world empirical distributions. Rigorous sensitivity analysis is essential.`;
  }

  return {
    responseText: mainText,
    speechText: speech,
    levelBadge: `Postgraduate · ${degree || 'Advanced Research'}`,
    sourceEngine: 'curriculum_engine',
    keyTakeaway: 'Critical synthesis, empirical bounds, and state-of-the-art methodology.',
    suggestedFollowUps: [
      'What are the current open problems and literature frontiers in this topic?',
      'How do non-convex optimization methods guarantee convergence?'
    ]
  };
}
