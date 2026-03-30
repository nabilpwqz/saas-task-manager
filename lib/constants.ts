import { BoardColumn, TaskPriority, TaskStatus, TaskType } from '@/types';

export const BOARD_COLUMNS: BoardColumn[] = [
  { id: 'BACKLOG', title: 'Backlog', color: '#64748b', badgeBg: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  { id: 'TODO', title: 'To Do', color: '#3b82f6', badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: '#f59e0b', badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { id: 'IN_REVIEW', title: 'In Review', color: '#8b5cf6', badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { id: 'DONE', title: 'Done', color: '#10b981', badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
];

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string; dot: string }> = {
  LOW: { label: 'Low', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' },
  MEDIUM: { label: 'Medium', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  HIGH: { label: 'High', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  URGENT: { label: 'Urgent', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; dot: string }> = {
  BACKLOG: { label: 'Backlog', bg: 'bg-slate-100 dark:bg-slate-800/80', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-400' },
  TODO: { label: 'To Do', bg: 'bg-blue-50 dark:bg-blue-950/50', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-amber-50 dark:bg-amber-950/50', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  IN_REVIEW: { label: 'In Review', bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  DONE: { label: 'Done', bg: 'bg-emerald-50 dark:bg-emerald-950/50', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
};

export const TYPE_CONFIG: Record<TaskType, { label: string; icon: string; color: string }> = {
  FEATURE: { label: 'Feature', icon: 'Sparkles', color: 'text-indigo-500' },
  BUG: { label: 'Bug', icon: 'Bug', color: 'text-rose-500' },
  TASK: { label: 'Task', icon: 'CheckSquare', color: 'text-sky-500' },
  IMPROVEMENT: { label: 'Improvement', icon: 'TrendingUp', color: 'text-emerald-500' },
};
