'use client';

import React from 'react';
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, isOverdue } from '@/lib/utils';
import { BOARD_COLUMNS, STATUS_CONFIG } from '@/lib/constants';
import { Task, TaskPriority, TaskStatus } from '@/types';

export function TaskListView() {
  const {
    tasks,
    selectedProjectId,
    selectedPriority,
    selectedStatus,
    selectedAssigneeId,
    searchQuery,
    openTaskDetail,
    moveTaskStatus,
    updateTask,
  } = useAppStore();

  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId !== 'ALL' && task.projectId !== selectedProjectId) return false;
    if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && task.status !== selectedStatus) return false;
    if (selectedAssigneeId !== 'ALL' && task.assigneeId !== selectedAssigneeId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchKey = task.taskKey.toLowerCase().includes(q);
      const matchTag = task.tags.some((t) => t.name.toLowerCase().includes(q));
      if (!matchTitle && !matchKey && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto pb-16">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
          <div className="col-span-5 flex items-center gap-2">
            <span>Issue / Task</span>
          </div>
          <div className="col-span-2">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1">Assignee</div>
          <div className="col-span-1 text-right">Due Date</div>
        </div>

        {/* Table Rows Grouped by Column */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {BOARD_COLUMNS.map((col) => {
            const groupTasks = filteredTasks.filter((t) => t.status === col.id);
            if (groupTasks.length === 0) return null;

            return (
              <div key={col.id}>
                {/* Group Divider */}
                <div className="px-6 py-2 bg-slate-100/40 dark:bg-slate-800/20 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <span>{col.title}</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    ({groupTasks.length})
                  </span>
                </div>

                {/* Tasks in Group */}
                {groupTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => openTaskDetail(task.id)}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition text-xs select-none"
                    >
                      {/* Task Key & Title */}
                      <div className="col-span-5 flex items-center gap-3">
                        <span className="font-mono font-semibold text-slate-400 flex-shrink-0">
                          {task.taskKey}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-slate-100 truncate hover:text-brand-600 dark:hover:text-brand-400">
                          {task.title}
                        </span>
                      </div>

                      {/* Project */}
                      <div className="col-span-2 flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: task.project?.color || '#6366f1' }}
                        />
                        <span className="truncate text-slate-600 dark:text-slate-300">
                          {task.project?.name || 'General'}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div
                        className="col-span-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.status}
                          onChange={(e) =>
                            moveTaskStatus(task.id, e.target.value as TaskStatus)
                          }
                          className="h-7 px-2 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-brand-500 cursor-pointer"
                        >
                          {BOARD_COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Priority Selector */}
                      <div
                        className="col-span-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.priority}
                          onChange={(e) =>
                            updateTask(task.id, {
                              priority: e.target.value as TaskPriority,
                            })
                          }
                          className="h-7 px-1.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-brand-500 cursor-pointer"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      </div>

                      {/* Assignee */}
                      <div className="col-span-1 flex items-center gap-1.5 truncate">
                        {task.assignee ? (
                          <>
                            <Avatar
                              src={task.assignee.avatar}
                              name={task.assignee.name}
                              size="xs"
                            />
                            <span className="truncate text-slate-600 dark:text-slate-400 text-[11px]">
                              {task.assignee.name.split(' ')[0]}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Unassigned</span>
                        )}
                      </div>

                      {/* Due Date */}
                      <div className="col-span-1 text-right">
                        {task.dueDate ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                              overdue
                                ? 'text-rose-500 dark:text-rose-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {overdue && <AlertCircle className="w-3 h-3" />}
                            {formatDate(task.dueDate)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="p-12 text-center text-sm text-slate-400">
              No tasks found matching your filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
