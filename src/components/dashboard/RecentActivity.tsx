import React from 'react';
import { RecentActivity } from '../../types';
import { Activity, CheckCircle2, Sparkles, Clock, MessageSquare } from 'lucide-react';

interface RecentActivityProps {
  activities: RecentActivity[];
}

export const RecentActivityFeed: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Recent Learning Stream
              </h3>
              <p className="text-xs text-slate-400">Drills, mentor sessions, and accuracy milestones</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-400">Live Sync</span>
        </div>

        <div className="space-y-3.5">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                {act.action.includes('Spaced') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {act.action.includes('Mirror') && <Sparkles className="w-4 h-4 text-purple-600" />}
                {act.action.includes('Deep') && <Clock className="w-4 h-4 text-violet-600" />}
                {act.action.includes('Socratic') && <MessageSquare className="w-4 h-4 text-purple-600" />}
                {!act.action.includes('Spaced') &&
                  !act.action.includes('Mirror') &&
                  !act.action.includes('Deep') &&
                  !act.action.includes('Socratic') && <Activity className="w-4 h-4 text-purple-600" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {act.action}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{act.subject}</p>
                <div className="mt-1 text-[11px] font-mono font-semibold text-purple-700">
                  {act.scoreOrDetail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-purple-50 text-[11px] text-slate-400 text-center">
        All activity continuously updates your AI Mirror cognitive model
      </div>
    </div>
  );
};
