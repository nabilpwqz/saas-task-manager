'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TaskPriority, TaskStatus, TaskType } from '@/types';
import { Sparkles, Tag as TagIcon, X } from 'lucide-react';

export function CreateTaskModal() {
  const {
    isCreateTaskOpen,
    closeCreateTaskModal,
    createTaskDefaultStatus,
    projects,
    users,
    addTask,
  } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>(createTaskDefaultStatus || 'TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [type, setType] = useState<TaskType>('TASK');
  const [assigneeId, setAssigneeId] = useState(users[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [storyPoints, setStoryPoints] = useState(3);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<{ id: string; name: string; color: string }[]>([
    { id: 't1', name: 'Frontend', color: '#38bdf8' },
  ]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tagName = tagInput.trim().replace(/^#/, '');
      if (!tags.some((t) => t.name.toLowerCase() === tagName.toLowerCase())) {
        setTags([...tags, { id: `tag-${Date.now()}`, name: tagName, color: '#818cf8' }]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setTags(tags.filter((t) => t.name !== tagName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      projectId,
      status: createTaskDefaultStatus || status,
      priority,
      type,
      assigneeId: assigneeId || undefined,
      creatorId: users[0].id,
      dueDate: dueDate || undefined,
      storyPoints,
      order: 0,
      tags,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setTagInput('');
  };

  return (
    <Modal
      isOpen={isCreateTaskOpen}
      onClose={closeCreateTaskModal}
      title="Create New Task"
      description="Add a new issue or milestone to the project roadmap."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement OAuth 2.1 authentication flow"
            className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Project & Task Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="TASK">Task</option>
              <option value="FEATURE">Feature</option>
              <option value="BUG">Bug Fix</option>
              <option value="IMPROVEMENT">Improvement</option>
            </select>
          </div>
        </div>

        {/* Status, Priority, Assignee */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Status
            </label>
            <select
              value={createTaskDefaultStatus || status}
              disabled={!!createTaskDefaultStatus}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full h-9 px-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full h-9 px-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full h-9 px-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date & Story Points */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Story Points
            </label>
            <input
              type="number"
              min={1}
              max={21}
              value={storyPoints}
              onChange={(e) => setStoryPoints(parseInt(e.target.value) || 1)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Tags (press Enter to add)
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[40px] items-center">
            {tags.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
              >
                #{t.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t.name)}
                  className="hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={tags.length === 0 ? 'Type tag and press Enter...' : ''}
              className="flex-1 bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none min-w-[80px]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details, acceptance criteria, or technical notes..."
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={closeCreateTaskModal} size="sm">
            Cancel
          </Button>
          <Button type="submit" size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
