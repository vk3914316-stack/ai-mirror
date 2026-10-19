import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Target,
  Sliders,
  Plus,
  X,
  Layers,
  School,
  Building2,
  Calendar
} from 'lucide-react';
import { GradeLevelId, OnboardingFormData, StudentProfile } from '../../types';
import {
  EDUCATION_LEVEL_OPTIONS,
  COLLEGE_DEGREES,
  COLLEGE_BRANCHES,
  COLLEGE_SEMESTERS,
  POSTGRAD_DEGREES,
  POSTGRAD_SPECIALIZATIONS,
  DIPLOMA_BRANCHES,
  DIPLOMA_YEARS,
  SENIOR_STREAMS,
  SUGGESTED_SUBJECTS_BY_LEVEL,
  COMMON_LEARNING_GOALS,
  generatePersonalizedProfile
} from '../../data/onboardingData';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile;
  isEditing?: boolean;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfile,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  const initialEducationLevel: GradeLevelId = initialProfile?.gradeId || 'senior';

  const [formData, setFormData] = useState<OnboardingFormData>({
    name: initialProfile?.name || '',
    educationLevel: initialEducationLevel,
    currentClassOrCourse: initialProfile?.currentClassOrCourse || 'Class 11',
    schoolOrCollege: initialProfile?.schoolOrProgram || '',
    degree: initialProfile?.degree || (initialEducationLevel === 'undergrad' ? COLLEGE_DEGREES[0] : ''),
    branch: initialProfile?.branch || (initialEducationLevel === 'undergrad' ? COLLEGE_BRANCHES[0] : ''),
    semester: initialProfile?.semester || (initialEducationLevel === 'undergrad' ? COLLEGE_SEMESTERS[4] : ''),
    selectedSubjects: initialProfile?.subjects.map((s) => s.name) || SUGGESTED_SUBJECTS_BY_LEVEL[initialEducationLevel].slice(0, 4),
    learningGoals: initialProfile?.learningGoals || [COMMON_LEARNING_GOALS[0], COMMON_LEARNING_GOALS[1]],
    weeklyHoursTarget: initialProfile?.weeklyHoursTarget || 18,
    pedagogyStyle: 'visual'
  });

  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [customGoalInput, setCustomGoalInput] = useState('');

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialProfile && isEditing) {
        setFormData({
          name: initialProfile.name || '',
          educationLevel: initialProfile.gradeId || 'senior',
          currentClassOrCourse: initialProfile.currentClassOrCourse || 'Class 11',
          schoolOrCollege: initialProfile.schoolOrProgram || '',
          degree: initialProfile.degree || '',
          branch: initialProfile.branch || '',
          semester: initialProfile.semester || '',
          selectedSubjects: initialProfile.subjects?.map((s) => s.name) || [],
          learningGoals: initialProfile.learningGoals || [COMMON_LEARNING_GOALS[0], COMMON_LEARNING_GOALS[1]],
          weeklyHoursTarget: initialProfile.weeklyHoursTarget || 18,
          pedagogyStyle: 'visual'
        });
      }
      setCurrentStep(1);
    }
  }, [isOpen, initialProfile, isEditing]);

  if (!isOpen) return null;

  // Change education level and adjust defaults
  const handleSelectEducationLevel = (levelId: GradeLevelId) => {
    const defaultSubjects = SUGGESTED_SUBJECTS_BY_LEVEL[levelId].slice(0, 4);
    let defaultClass = '';
    let defaultDegree = '';
    let defaultBranch = '';
    let defaultSemester = '';

    if (levelId === 'primary') defaultClass = 'Class 4';
    else if (levelId === 'middle') defaultClass = 'Class 8';
    else if (levelId === 'secondary') defaultClass = 'Class 10';
    else if (levelId === 'senior') defaultClass = 'Class 11 · Science (PCM)';
    else if (levelId === 'diploma') {
      defaultClass = '2nd Year Diploma';
      defaultBranch = DIPLOMA_BRANCHES[0];
      defaultSemester = DIPLOMA_YEARS[1];
    } else if (levelId === 'undergrad') {
      defaultDegree = COLLEGE_DEGREES[0];
      defaultBranch = COLLEGE_BRANCHES[0];
      defaultSemester = COLLEGE_SEMESTERS[4];
      defaultClass = '3rd Year B.Tech';
    } else if (levelId === 'postgrad') {
      defaultDegree = POSTGRAD_DEGREES[0];
      defaultBranch = POSTGRAD_SPECIALIZATIONS[0];
      defaultSemester = 'Thesis Phase (Year 2)';
      defaultClass = '2nd Year M.Tech';
    }

    setFormData((prev) => ({
      ...prev,
      educationLevel: levelId,
      currentClassOrCourse: defaultClass,
      degree: defaultDegree,
      branch: defaultBranch,
      semester: defaultSemester,
      selectedSubjects: defaultSubjects
    }));
  };

  const handleToggleSubject = (subject: string) => {
    setFormData((prev) => {
      const exists = prev.selectedSubjects.includes(subject);
      if (exists) {
        if (prev.selectedSubjects.length === 1) return prev; // Keep at least one
        return {
          ...prev,
          selectedSubjects: prev.selectedSubjects.filter((s) => s !== subject)
        };
      } else {
        return {
          ...prev,
          selectedSubjects: [...prev.selectedSubjects, subject]
        };
      }
    });
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectInput.trim()) return;
    if (!formData.selectedSubjects.includes(customSubjectInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        selectedSubjects: [...prev.selectedSubjects, customSubjectInput.trim()]
      }));
    }
    setCustomSubjectInput('');
  };

  const handleToggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.learningGoals.includes(goal);
      if (exists) {
        return {
          ...prev,
          learningGoals: prev.learningGoals.filter((g) => g !== goal)
        };
      } else {
        return {
          ...prev,
          learningGoals: [...prev.learningGoals, goal]
        };
      }
    });
  };

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoalInput.trim()) return;
    if (!formData.learningGoals.includes(customGoalInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        learningGoals: [...prev.learningGoals, customGoalInput.trim()]
      }));
    }
    setCustomGoalInput('');
  };

  const handleFinish = () => {
    const personalizedProfile = generatePersonalizedProfile(formData, initialProfile);
    onComplete(personalizedProfile);
    onClose();
  };

  const canProceedStep1 = formData.name.trim().length > 0;
  const canProceedStep2 = true;
  const canProceedStep3 = formData.selectedSubjects.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Step Progress */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 via-violet-50 to-white border-b border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-violet-500 text-white flex items-center justify-center shadow-md shadow-purple-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {isEditing ? 'Update Academic Profile' : 'Welcome to AI Mirror'}
                </h2>
                <p className="text-xs text-slate-500">
                  {isEditing
                    ? 'Adjust your grade tier, subjects, and study target'
                    : 'Personalize your cognitive mentorship pathway'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                Step {currentStep} of {totalSteps}
              </span>
              {isEditing && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-purple-600'
                    : 'bg-purple-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ================= STEP 1: Name & Education Level ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  What is your name?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name (e.g., Maya Sharma, Alex Chen)"
                    autoFocus
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-600 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Education Level Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Select your Education Level
                  </label>
                  <span className="text-[11px] text-purple-700 font-semibold">
                    Class 1 to College
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EDUCATION_LEVEL_OPTIONS.map((opt) => {
                    const isSelected = formData.educationLevel === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectEducationLevel(opt.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-600 shadow-xs'
                            : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {opt.label}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-purple-700 block mb-1">
                            {opt.sublabel}
                          </span>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: Relevant Academic Details ================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Showing specialized curriculum fields for <strong>{formData.name}</strong> ({EDUCATION_LEVEL_OPTIONS.find((l) => l.id === formData.educationLevel)?.label})
                </span>
              </div>

              {/* A. If Undergraduate */}
              {formData.educationLevel === 'undergrad' && (
                <div className="space-y-4">
                  {/* Degree Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Degree Program
                    </label>
                    <select
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {COLLEGE_DEGREES.map((deg) => (
                        <option key={deg} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Branch / Major */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Branch / Department / Major
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => {
                        const newBranch = e.target.value;
                        setFormData({ ...formData, branch: newBranch });
                      }}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {COLLEGE_BRANCHES.map((br) => (
                        <option key={br} value={br}>
                          {br}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Current Semester / Academic Year
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {COLLEGE_SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* College Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      College / University Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., Stanford University, IIT Bombay, University College London"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* B. If Postgraduate */}
              {formData.educationLevel === 'postgrad' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Master's / Postgraduate Degree
                    </label>
                    <select
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {POSTGRAD_DEGREES.map((deg) => (
                        <option key={deg} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Research Specialization / Domain
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {POSTGRAD_SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Current Academic Stage
                    </label>
                    <input
                      type="text"
                      value={formData.semester || 'Thesis Phase (Year 2)'}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      placeholder="e.g. 1st Year Coursework or 2nd Year Thesis Defense"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      University / Research Institution
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., National Institute of Advanced Studies, Oxford"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* C. If Diploma */}
              {formData.educationLevel === 'diploma' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Polytechnic Diploma Branch
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {DIPLOMA_BRANCHES.map((br) => (
                        <option key={br} value={br}>
                          {br}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Year / Semester
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      {DIPLOMA_YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Polytechnic / Technical Institute Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., Government Polytechnic Institute"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* D. If Class 11–12 */}
              {formData.educationLevel === 'senior' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Select Class & Academic Stream
                    </label>
                    <select
                      value={formData.currentClassOrCourse}
                      onChange={(e) => setFormData({ ...formData, currentClassOrCourse: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800 font-medium"
                    >
                      <option value="Class 11 · Science (PCM)">Class 11 · Science (PCM - Engineering track)</option>
                      <option value="Class 11 · Science (PCB)">Class 11 · Science (PCB - Medical track)</option>
                      <option value="Class 11 · Commerce">Class 11 · Commerce & Economics</option>
                      <option value="Class 11 · Humanities">Class 11 · Humanities & Social Sciences</option>
                      <option value="Class 12 · Science (PCM)">Class 12 · Science (PCM - Engineering track)</option>
                      <option value="Class 12 · Science (PCB)">Class 12 · Science (PCB - Medical track)</option>
                      <option value="Class 12 · Commerce">Class 12 · Commerce & Economics</option>
                      <option value="Class 12 · Humanities">Class 12 · Humanities & Social Sciences</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Target Exam or Focus (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., JEE Advanced, NEET, SAT / AP, CBSE Boards, Olympiads"
                      value={formData.degree || ''}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      School / Junior College Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., Oakwood International Academy"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* E. If Class 9–10 */}
              {formData.educationLevel === 'secondary' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Current Grade
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Class 9', 'Class 10 (Board Exam Year)'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setFormData({ ...formData, currentClassOrCourse: cls })}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            formData.currentClassOrCourse.includes(cls.split(' ')[1])
                              ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600'
                              : 'border-slate-200 text-slate-700 hover:border-purple-200'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., National Public School, St. Xavier's"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* F. If Class 6–8 */}
              {formData.educationLevel === 'middle' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Current Grade
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Class 6', 'Class 7', 'Class 8'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setFormData({ ...formData, currentClassOrCourse: cls })}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            formData.currentClassOrCourse === cls
                              ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600'
                              : 'border-slate-200 text-slate-700 hover:border-purple-200'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., Greenwood Middle High"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* G. If Class 1–5 */}
              {formData.educationLevel === 'primary' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Current Grade (Primary)
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setFormData({ ...formData, currentClassOrCourse: cls })}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            formData.currentClassOrCourse === cls
                              ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600'
                              : 'border-slate-200 text-slate-700 hover:border-purple-200'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrCollege}
                      onChange={(e) => setFormData({ ...formData, schoolOrCollege: e.target.value })}
                      placeholder="e.g., Sunnyvale Elementary School"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: Subjects Selection ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Enrolled Subjects & Study Domains
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Click to select subjects for your personalized syllabus, diagnostic tracking, and micro-drills.
                </p>

                {/* Suggested Subjects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {(SUGGESTED_SUBJECTS_BY_LEVEL[formData.educationLevel] || []).map((subject) => {
                    const isSelected = formData.selectedSubjects.includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => handleToggleSubject(subject)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600'
                            : 'border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                          <span>{subject}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Subject */}
                <form onSubmit={handleAddCustomSubject} className="flex gap-2">
                  <input
                    type="text"
                    value={customSubjectInput}
                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                    placeholder="Add a custom subject (e.g. Econometrics, Robotics, German)..."
                    className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!customSubjectInput.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </form>

                {/* Selected Count Indicator */}
                <div className="mt-3 text-xs text-purple-700 font-medium">
                  {formData.selectedSubjects.length} subjects active in your personal curriculum
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: Goals & Study Cadence ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Study Hours Target */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Weekly Study Goal
                  </label>
                  <span className="font-mono text-sm font-bold text-purple-700">
                    {formData.weeklyHoursTarget} hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={formData.weeklyHoursTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, weeklyHoursTarget: Number(e.target.value) })
                  }
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>5h (Light)</span>
                  <span>18h (Recommended)</span>
                  <span>40h (Intensive)</span>
                </div>
              </div>

              {/* Learning Goals Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Primary Learning Goals
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  AI Mirror tailors your daily recommendations and spaced repetition around these targets:
                </p>

                <div className="space-y-2 mb-3">
                  {COMMON_LEARNING_GOALS.map((goal) => {
                    const isSelected = formData.learningGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleToggleGoal(goal)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold'
                            : 'border-slate-200 text-slate-700 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Target className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                          <span>{goal}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Goal */}
                <form onSubmit={handleAddCustomGoal} className="flex gap-2">
                  <input
                    type="text"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    placeholder="Type a custom goal (e.g. Master fluid dynamics equations)..."
                    className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-purple-600 focus:bg-white text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!customGoalInput.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < totalSteps ? (
              <button
                type="button"
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3)
                }
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm shadow-purple-200 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEditing ? 'Save & Update Dashboard' : 'Launch My AI Mirror'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
