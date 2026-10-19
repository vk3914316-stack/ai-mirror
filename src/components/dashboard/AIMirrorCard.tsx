import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Brain,
  RotateCcw,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { AIMirrorData, LearningGap } from '../../types';

interface AIMirrorCardProps {
  mirrorData: AIMirrorData;
  onOpenDrill: (gap: LearningGap) => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  onOpenIntelligence?: () => void;
}

export const AIMirrorCard: React.FC<AIMirrorCardProps> = ({
  mirrorData,
  onOpenDrill,
  onTriggerScan,
  isScanning,
  onOpenIntelligence
}) => {
  const [activeTab, setActiveTab] = useState<'strengths' | 'gaps' | 'pace'>('gaps');

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden transition-all relative">
      {/* Subtle decorative background gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100/40 via-violet-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

      {/* Header section with Cognitive Mirror Banner */}
      <div className="p-6 sm:p-7 border-b border-purple-50 bg-gradient-to-r from-purple-50/70 via-violet-50/40 to-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-purple-200 shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  The AI Mirror
                </h2>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md border border-purple-200/60">
                  Cognitive Synthesis
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time reflection of your strengths, cognitive blindspots, and recall velocity
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {onOpenIntelligence && (
              <button
                onClick={onOpenIntelligence}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                <span>Student Intelligence Hub →</span>
              </button>
            )}

            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-75"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Reflecting...' : 'Sync Mirror'}</span>
            </button>
          </div>
        </div>

        {/* AI Reflection narrative summary */}
        <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-purple-100/80 backdrop-blur-xs shadow-2xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {mirrorData.reflectionSummary}
            </p>
          </div>
        </div>

        {/* Segmented Interactive Control Tabs */}
        <div className="mt-5 flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab('gaps')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'gaps'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Learning Gaps ({mirrorData.gaps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('strengths')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'strengths'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Strengths ({mirrorData.strengths.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pace')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pace'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Pace & Recall</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-7">
        {/* VIEW 1: Learning Gaps (Highest Value) */}
        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Targeted Cognitive Gaps Detected
                </h3>
                <p className="text-xs text-slate-500">
                  Subtle conceptual traps identified from your quizzes and timing patterns
                </p>
              </div>
              <span className="text-xs text-purple-700 font-semibold hidden sm:inline">
                Click "Remediate Gap" to launch interactive micro-drill
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mirrorData.gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-5 rounded-2xl border border-purple-100 bg-white hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: subject + severity */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-purple-700">{gap.subject}</span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>{gap.severity.toUpperCase()} PRIORITY</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                      {gap.concept}
                    </h4>

                    {/* Root cause note */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-3 leading-relaxed">
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Observed Tendency:
                      </span>
                      {gap.rootCause}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      <span className="font-semibold text-purple-800">Prescription: </span>
                      {gap.recommendedAction}
                    </p>
                  </div>

                  {/* Remediation Drill Action */}
                  <button
                    onClick={() => onOpenDrill(gap)}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100/90 text-purple-700 text-xs font-semibold border border-purple-200/80 transition-colors flex items-center justify-center gap-1.5 group"
                  >
                    <span>Remediate Gap (1 min drill)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Strengths & Superpowers */}
        {activeTab === 'strengths' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cognitive Strengths & Superpowers
              </h3>
              <p className="text-xs text-slate-500">
                Topics where you demonstrate superior mental models, high velocity, and resilient recall
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mirrorData.strengths.map((str) => (
                <div
                  key={str.id}
                  className="p-5 rounded-2xl border border-purple-100 bg-white hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-purple-700">{str.subject}</span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{str.retentionRate}% RETENTION</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                      {str.topic}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <span className="font-mono text-purple-700 font-semibold">
                        {str.speedMultiplier}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{str.cognitiveTrait}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/40 p-3 rounded-xl border border-purple-100/50">
                      {str.statusDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Mastery Level</span>
                    <span className="font-bold text-purple-800">Advanced Tier</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Pace & Retention Half-Life */}
        {activeTab === 'pace' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cognitive Learning Pace & Memory Half-Life
              </h3>
              <p className="text-xs text-slate-500">
                Comparing your processing velocity and projected memory retention decay across domains
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mirrorData.paceMetrics.map((pace, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-purple-100 bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{pace.domain}</span>
                      <span className="text-xs font-mono font-semibold text-purple-700">
                        {pace.paceStatus}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-extrabold text-slate-900 font-mono">
                        {pace.paceScore}
                      </span>
                      <span className="text-xs text-slate-400">/ 100 Velocity Index</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${pace.paceScore}%` }}
                      />
                    </div>

                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/60 text-xs text-slate-600 leading-relaxed mb-3">
                      {pace.reflectionNote}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-purple-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Retention Half-Life</span>
                    </div>
                    <span className="font-mono font-bold text-purple-700">
                      ~{pace.retentionHalfLifeDays} Days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
