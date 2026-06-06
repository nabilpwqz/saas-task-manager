'use client';

import React from 'react';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Task } from '@/types';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDate, isOverdue } from '@/lib/utils';
import { BOARD_COLUMNS } from '@/lib/constants';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { openTaskDetail, moveTaskStatus } = useAppStore();
  const completedChecklists = task.checklists.filter((c) => c.completed).length;
  const overdue = isOverdue(task.dueDate, task.status);

  // Next status in board sequence
  const currentIdx = BOARD_COLUMNS.findIndex((c) => c.id === task.status);
  const nextColumn = currentIdx < BOARD_COLUMNS.length - 1 ? BOARD_COLUMNS[currentIdx + 1] : null;

  return (
    <div
      onClick={() => openTaskDetail(task.id)}
      className="group relative bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all cursor-pointer select-none"
    >
      {/* Card Header: Task Key + Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: task.project?.color || '#6366f1' }}
          />
          <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {task.taskKey}
          </span>
        </div>

        <Badge variant="priority" priority={task.priority} />
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              #{tag.name}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Footer Info: Meta stats and Assignee */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-slate-400 text-xs">
        <div className="flex items-center gap-3">
          {/* Due date */}
          {task.dueDate && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium ${
                overdue
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {overdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Checklist progress */}
          {task.checklists.length > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <CheckSquare className="w-3 h-3" />
              <span>
                {completedChecklists}/{task.checklists.length}
              </span>
            </div>
          )}

          {/* Comments count */}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee & Quick Move Button */}
        <div className="flex items-center gap-1.5">
          {nextColumn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveTaskStatus(task.id, nextColumn.id);
              }}
              title={`Move to ${nextColumn.title}`}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {task.assignee ? (
            <Avatar src={task.assignee.avatar} name={task.assignee.name} size="xs" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
