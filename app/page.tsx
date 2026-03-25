'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/lib/store';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { TaskListView } from '@/components/list/TaskListView';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { ProjectsView } from '@/components/projects/ProjectsView';
import { TeamView } from '@/components/team/TeamView';
import { ActivityView } from '@/components/activity/ActivityView';
import { SettingsView } from '@/components/settings/SettingsView';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { ShortcutsModal } from '@/components/tasks/ShortcutsModal';

export default function HomePage() {
  const { activeView } = useAppStore();

  return (
    <AppShell>
      {/* Show filtering toolbar when on board or list view */}
      {(activeView === 'board' || activeView === 'list') && <FilterToolbar />}

      {/* Main Content Area based on Active View */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto">
        {activeView === 'board' && <KanbanBoard />}
        {activeView === 'list' && <TaskListView />}
        {activeView === 'dashboard' && <AnalyticsDashboard />}
        {activeView === 'projects' && <ProjectsView />}
        {activeView === 'team' && <TeamView />}
        {activeView === 'activity' && <ActivityView />}
        {activeView === 'settings' && <SettingsView />}
      </div>

      {/* Global Modals & Slide-overs */}
      <TaskDetailModal />
      <CreateTaskModal />
      <ShortcutsModal />
    </AppShell>
  );
}
