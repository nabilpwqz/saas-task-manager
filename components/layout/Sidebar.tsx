'use client';

import React from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  ListTodo,
  FolderKanban,
  Users2,
  Plus,
  Sparkles,
  Command,
  HelpCircle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const {
    workspace,
    activeView,
    setActiveView,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    users,
    openCreateProjectModal,
    openShortcutsModal,
    tasks,
  } = useAppStore();

  const currentUser = users[0];

  const navItems = [
    { id: 'board', label: 'Kanban Board', icon: KanbanSquare, count: tasks.length },
    { id: 'list', label: 'List View', icon: ListTodo, count: tasks.length },
    { id: 'dashboard', label: 'Analytics Hub', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban, count: projects.length },
    { id: 'team', label: 'Team Members', icon: Users2, count: workspace.members.length },
  ] as const;

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col justify-between h-screen select-none">
      {/* Workspace Branding */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-brand-500/20">
              {workspace.logo}
            </div>
            <div className="truncate">
              <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                {workspace.name}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">
                {workspace.plan} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      isActive
                        ? 'bg-brand-500/20 text-brand-600 dark:text-brand-300'
                        : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Projects Section */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 mt-1">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Projects
            </span>
            <button
              onClick={openCreateProjectModal}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              title="Create new project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            <button
              onClick={() => setSelectedProjectId('ALL')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition',
                selectedProjectId === 'ALL'
                  ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="truncate">All Projects</span>
            </button>

            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition',
                  selectedProjectId === proj.id
                    ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: proj.color }} />
                  <span className="truncate">{proj.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{proj.key}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Area: Shortcuts & Current User */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        <button
          onClick={openShortcutsModal}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono">
            ?
          </kbd>
        </button>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" showStatus />
          <div className="truncate flex-1">
            <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
