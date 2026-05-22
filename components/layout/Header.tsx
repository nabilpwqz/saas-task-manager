'use client';

import React from 'react';
import {
  Search,
  Plus,
  Sun,
  Moon,
  Bell,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export function Header() {
  const {
    activeView,
    projects,
    selectedProjectId,
    searchQuery,
    setSearchQuery,
    openCreateTaskModal,
    isDarkMode,
    toggleTheme,
    tasks,
  } = useAppStore();

  const activeProject =
    selectedProjectId === 'ALL'
      ? null
      : projects.find((p) => p.id === selectedProjectId);

  const viewTitles: Record<string, string> = {
    board: 'Board',
    list: 'Tasks',
    dashboard: 'Analytics Overview',
    projects: 'Projects Hub',
    team: 'Team Directory',
  };

  return (
    <header className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex items-center justify-between z-20">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-slate-900 dark:text-white">
          {viewTitles[activeView] || 'Workspace'}
        </span>
        {activeProject && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeProject.color }}
              />
              <span>{activeProject.name}</span>
            </div>
          </>
        )}
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full h-9 pl-9 pr-4 text-xs rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon with unread badge */}
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* New Task Button */}
        <Button
          onClick={() => openCreateTaskModal()}
          size="sm"
          className="bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </Button>
      </div>
    </header>
  );
}
