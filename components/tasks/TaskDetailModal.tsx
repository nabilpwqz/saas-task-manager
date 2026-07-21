'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Calendar,
  CheckSquare,
  Plus,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BOARD_COLUMNS, STATUS_CONFIG } from '@/lib/constants';
import { TaskPriority, TaskStatus } from '@/types';
import { formatDate, isOverdue } from '@/lib/utils';
import { TaskComments } from './TaskComments';

export function TaskDetailModal() {
  const {
    selectedTaskId,
    closeTaskDetail,
    tasks,
    updateTask,
    deleteTask,
    moveTaskStatus,
    toggleChecklistItem,
    addChecklistItem,
    users,
    projects,
  } = useAppStore();

  const [newChecklistText, setNewChecklistText] = useState('');

  if (!selectedTaskId) return null;
  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const completedChecklists = task.checklists.filter((c) => c.completed).length;
  const checklistPercentage =
    task.checklists.length > 0
      ? Math.round((completedChecklists / task.checklists.length) * 100)
      : 0;
  const overdue = isOverdue(task.dueDate, task.status);

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addChecklistItem(task.id, newChecklistText);
    setNewChecklistText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeTaskDetail}
      />

      {/* Slide-Over Drawer */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: task.project?.color || '#6366f1' }}
            />
            <span className="font-mono text-xs font-semibold text-slate-500">
              {task.taskKey}
            </span>
            <Badge variant="status" status={task.status} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeTaskDetail}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title Editor */}
          <div>
            <textarea
              rows={2}
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              className="w-full text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none resize-none focus:outline-none focus:ring-0 p-0"
              placeholder="Task title..."
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs">
            {/* Status */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) =>
                  moveTaskStatus(task.id, e.target.value as TaskStatus)
                }
                className="w-full h-8 px-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
              >
                {BOARD_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) =>
                  updateTask(task.id, { priority: e.target.value as TaskPriority })
                }
                className="w-full h-8 px-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Assignee
              </label>
              <select
                value={task.assigneeId || ''}
                onChange={(e) => {
                  const newAssignee = users.find((u) => u.id === e.target.value);
                  updateTask(task.id, {
                    assigneeId: e.target.value,
                    assignee: newAssignee,
                  });
                }}
                className="w-full h-8 px-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                onChange={(e) =>
                  updateTask(task.id, { dueDate: e.target.value || undefined })
                }
                className="w-full h-8 px-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
              />
            </div>
          </div>

          {/* Description Editor */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={task.description || ''}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              placeholder="Add detailed markdown description..."
              className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Checklists Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-500" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                  Checklist
                </h4>
                <span className="text-[11px] text-slate-400">
                  ({completedChecklists}/{task.checklists.length})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                {checklistPercentage}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${checklistPercentage}%` }}
              />
            </div>

            {/* Checklist items list */}
            <div className="space-y-1.5 pt-1">
              {task.checklists.map((cl) => (
                <div
                  key={cl.id}
                  onClick={() => toggleChecklistItem(task.id, cl.id)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition select-none group"
                >
                  <input
                    type="checkbox"
                    checked={cl.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span
                    className={`text-xs flex-1 ${
                      cl.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {cl.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Checklist Item Input */}
            <form onSubmit={handleAddChecklist} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 h-8 px-3 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs">
                Add
              </Button>
            </form>
          </div>

          {/* Discussion & Activity Section */}
          <TaskComments task={task} />
        </div>
      </div>
    </div>
  );
}
