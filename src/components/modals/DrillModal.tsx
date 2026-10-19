import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, X, ArrowRight, RotateCcw } from 'lucide-react';
import { LearningGap } from '../../types';

interface DrillModalProps {
  gap: LearningGap | null;
  onClose: () => void;
  onResolved: (gapId: string) => void;
}

export const DrillModal: React.FC<DrillModalProps> = ({ gap, onClose, onResolved }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!gap) return null;

  const { drillProblem } = gap;
  const isCorrect = selectedOption === drillProblem.correctIndex;

  const handleOptionSelect = (index: number) => {
    if (submitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleComplete = () => {
    onResolved(gap.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 via-violet-50 to-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700">
                <span>AI Mirror Micro-Drill</span>
                <span>·</span>
                <span>{gap.subject}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {gap.concept}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Diagnostic Context */}
          <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100/80 text-xs text-purple-900 space-y-1">
            <span className="font-semibold block text-purple-800">Identified Cognitive Blindspot:</span>
            <p className="text-slate-600 leading-relaxed">{gap.rootCause}</p>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Practice Problem:</span>
            <p className="text-sm font-medium text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200/70 font-mono">
              {drillProblem.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select the correct derivation:</span>
            <div className="space-y-2">
              {drillProblem.options.map((option, idx) => {
                let optionStyle = 'border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 text-slate-700';
                
                if (selectedOption === idx) {
                  optionStyle = 'border-purple-600 bg-purple-50 text-purple-900 font-semibold ring-1 ring-purple-600';
                }

                if (submitted) {
                  if (idx === drillProblem.correctIndex) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                  } else if (selectedOption === idx) {
                    optionStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
                  } else {
                    optionStyle = 'border-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {submitted && idx === drillProblem.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {submitted && selectedOption === idx && idx !== drillProblem.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation if submitted */}
          {submitted && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-150 ${
              isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cognitive Gap Resolved! Excellent grasp.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Review Step-by-Step Derivation:</span>
                  </>
                )}
              </div>
              <p className="text-slate-700">{drillProblem.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-sm shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {!isCorrect && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
              <button
                onClick={handleComplete}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-sm shadow-purple-200 flex items-center gap-1.5"
              >
                <span>{isCorrect ? 'Mark as Mastered' : 'Close & Continue'}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
