'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { BOARD_COLUMNS } from '@/lib/constants';
import { TaskCard } from './TaskCard';
import { TaskStatus } from '@/types';

export function KanbanBoard() {
  const {
    tasks,
    selectedProjectId,
    selectedPriority,
    selectedStatus,
    selectedAssigneeId,
    searchQuery,
    openCreateTaskModal,
    moveTaskStatus,
  } = useAppStore();

  // Filter tasks based on all active criteria
  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId !== 'ALL' && task.projectId !== selectedProjectId) return false;
    if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && task.status !== selectedStatus) return false;
    if (selectedAssigneeId !== 'ALL' && task.assigneeId !== selectedAssigneeId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchKey = task.taskKey.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchTag = task.tags.some((t) => t.name.toLowerCase().includes(q));
      if (!matchTitle && !matchKey && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, status);
    }
  };

  return (
    <div className="h-full flex gap-5 overflow-x-auto p-6 pb-12 select-none">
      {BOARD_COLUMNS.map((column) => {
        const columnTasks = filteredTasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="w-80 flex-shrink-0 flex flex-col rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 max-h-full"
          >
            {/* Column Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-semibold text-xs tracking-tight text-slate-800 dark:text-slate-200 uppercase">
                  {column.title}
                </h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => openCreateTaskModal(column.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                title={`Add task to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Body: Tasks List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task.id);
                  }}
                >
                  <TaskCard task={task} />
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-400 dark:text-slate-500">
                  <span>No tasks</span>
                  <button
                    onClick={() => openCreateTaskModal(column.id)}
                    className="mt-1 text-brand-600 dark:text-brand-400 font-medium hover:underline text-[11px]"
                  >
                    + Add task
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
