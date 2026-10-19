import React from 'react';
import { UpcomingTask } from '../../types';
import { CalendarClock, AlertCircle, ArrowUpRight } from 'lucide-react';

interface UpcomingTasksProps {
  tasks: UpcomingTask[];
  onOpenPlanner: () => void;
  onToggleComplete?: (taskId: string) => void;
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks, onOpenPlanner, onToggleComplete }) => {
  const isOverdue = (dueDate: string, completed?: boolean) => {
    if (completed) return false;
    const lower = (dueDate || '').toLowerCase();
    return lower.includes('yesterday') || lower.includes('oct 16') || lower.includes('oct 17') || lower.includes('oct 18') || lower.includes('overdue');
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Upcoming Deadlines & Quizzes
              </h3>
              <p className="text-xs text-slate-400">Scheduled assessments & deliverables</p>
            </div>
          </div>

          <button
            onClick={onOpenPlanner}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Study Planner →</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => {
            const taskOverdue = isOverdue(task.dueDate, task.completed);
            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  task.completed
                    ? 'border-slate-100 bg-slate-50/50 opacity-60'
                    : taskOverdue
                    ? 'border-rose-200 bg-rose-50/40'
                    : 'border-purple-50 bg-purple-50/20 hover:bg-purple-50/50 hover:border-purple-200'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-purple-700">{task.subject}</span>
                    {task.topic && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 font-medium">{task.topic}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{task.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{task.estimatedMinutes}m</span>
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate ${
                    task.completed ? 'line-through text-slate-400' : ''
                  }`}>
                    {task.title}
                  </h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <span className={`font-medium ${taskOverdue ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                      {task.dueDate}
                    </span>
                    {taskOverdue && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {task.priority === 'high' && !task.completed && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      <AlertCircle className="w-3 h-3" />
                      <span>HIGH</span>
                    </div>
                  )}

                  {onToggleComplete && (
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-purple-600 bg-white'
                      }`}
                      title={task.completed ? 'Completed' : 'Mark done'}
                    >
                      {task.completed && <span className="text-xs">✓</span>}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-purple-50 text-[11px] text-slate-500 flex items-center justify-between">
        <span>{tasks.filter((t) => !t.completed).length} active deliverables remaining</span>
        <button
          onClick={onOpenPlanner}
          className="text-purple-700 font-semibold hover:underline"
        >
          Manage in Planner
        </button>
      </div>
    </div>
  );
};
