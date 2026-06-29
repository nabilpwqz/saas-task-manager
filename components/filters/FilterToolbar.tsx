'use client';

import React from 'react';
import {
  KanbanSquare,
  ListTodo,
  Filter,
  X,
  UserCheck,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { TaskPriority, TaskStatus } from '@/types';
import { cn } from '@/lib/utils';

export function FilterToolbar() {
  const {
    activeView,
    setActiveView,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedAssigneeId,
    setSelectedAssigneeId,
    users,
    tasks,
    resetFilters,
  } = useAppStore();

  const activeFilterCount =
    (selectedStatus !== 'ALL' ? 1 : 0) +
    (selectedPriority !== 'ALL' ? 1 : 0) +
    (selectedAssigneeId !== 'ALL' ? 1 : 0);

  return (
    <div className="h-14 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between gap-4 select-none">
      {/* Left: View Switcher (Board vs List) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => setActiveView('board')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition',
            activeView === 'board'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <KanbanSquare className="w-3.5 h-3.5" />
          <span>Board</span>
        </button>

        <button
          onClick={() => setActiveView('list')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition',
            activeView === 'list'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          )}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>List</span>
        </button>
      </div>

      {/* Right: Filter dropdowns */}
      <div className="flex items-center gap-2.5">
        {/* Status Filter */}
        <div className="flex items-center gap-1 text-xs">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | 'ALL')}
            className="h-8 px-2.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 font-medium focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="BACKLOG">Backlog</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 text-xs">
          <select
            value={selectedPriority}
            onChange={(e) =>
              setSelectedPriority(e.target.value as TaskPriority | 'ALL')
            }
            className="h-8 px-2.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 font-medium focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL">Priority: All</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-1 text-xs">
          <select
            value={selectedAssigneeId}
            onChange={(e) => setSelectedAssigneeId(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 font-medium focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL">Assignee: All</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
