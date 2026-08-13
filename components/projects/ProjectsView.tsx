'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { TaskPriority } from '@/types';

export function ProjectsView() {
  const {
    projects,
    tasks,
    users,
    isCreateProjectOpen,
    openCreateProjectModal,
    closeCreateProjectModal,
    addProject,
    setSelectedProjectId,
    setActiveView,
  } = useAppStore();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [targetDate, setTargetDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    addProject({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      color,
      icon: 'FolderKanban',
      status: 'ACTIVE',
      priority,
      targetDate: targetDate || undefined,
    });

    setName('');
    setKey('');
    setDescription('');
    setTargetDate('');
  };

  const projectColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Projects
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your team initiatives, roadmaps, and delivery schedules.
          </p>
        </div>
        <Button onClick={openCreateProjectModal} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedTasks = projTasks.filter((t) => t.status === 'DONE').length;
          const pct = projTasks.length > 0 ? Math.round((completedTasks / projTasks.length) * 100) : 0;

          return (
            <Card
              key={proj.id}
              className="group hover:border-brand-500/50 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                      {proj.key}
                    </span>
                  </div>
                  <Badge variant="priority" priority={proj.priority} />
                </div>
                <CardTitle className="text-base font-bold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {proj.name}
                </CardTitle>
                {proj.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="pt-2 space-y-4">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Milestone Progress</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: proj.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>
                      {completedTasks} of {projTasks.length} issues done
                    </span>
                    {proj.targetDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(proj.targetDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Team & Open Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex -space-x-2">
                    {users.slice(0, 3).map((u) => (
                      <Avatar key={u.id} src={u.avatar} name={u.name} size="xs" />
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs gap-1 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveView('board');
                    }}
                  >
                    <span>View Board</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateProjectOpen}
        onClose={closeCreateProjectModal}
        title="Create New Project"
        description="Initialize a project workspace with a unique issue key."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key) {
                  setKey(e.target.value.substring(0, 4).toUpperCase());
                }
              }}
              placeholder="e.g. Design Systems"
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Project Key *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="e.g. DES"
                className="w-full h-9 px-3 text-xs uppercase font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Project Color Accent
            </label>
            <div className="flex gap-2">
              {projectColors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-brand-500 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this project aim to achieve?"
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={closeCreateProjectModal} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
