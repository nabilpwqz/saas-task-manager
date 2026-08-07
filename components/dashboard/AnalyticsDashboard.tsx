'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  FolderKanban,
  Activity,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { isOverdue } from '@/lib/utils';
import { BOARD_COLUMNS } from '@/lib/constants';

export function AnalyticsDashboard() {
  const { tasks, projects, activities } = useAppStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Status breakdown
  const statusCounts = BOARD_COLUMNS.map((col) => ({
    name: col.title,
    count: tasks.filter((t) => t.status === col.id).length,
    color: col.color,
  }));

  // Priority breakdown
  const priorityCounts = [
    { name: 'Urgent', count: tasks.filter((t) => t.priority === 'URGENT').length, color: '#f43f5e' },
    { name: 'High', count: tasks.filter((t) => t.priority === 'HIGH').length, color: '#f59e0b' },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'MEDIUM').length, color: '#3b82f6' },
    { name: 'Low', count: tasks.filter((t) => t.priority === 'LOW').length, color: '#94a3b8' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tasks */}
        <Card className="hover:border-brand-500/30 transition shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Issues
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalTasks}
              </span>
              <span className="text-xs text-emerald-500 flex items-center font-medium">
                <ArrowUpRight className="w-3 h-3" /> +12% this mo
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="hover:border-emerald-500/30 transition shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Completion Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {completionRate}%
              </span>
              <span className="text-xs text-slate-400">
                ({completedTasks}/{totalTasks} done)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="hover:border-amber-500/30 transition shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                In Active Flight
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {inProgressTasks}
              </span>
              <span className="text-xs text-slate-400">tasks in progress</span>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className="hover:border-rose-500/30 transition shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Needs Attention
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                {overdueTasks}
              </span>
              <span className="text-xs text-slate-400">past due date</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution (Donut style) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              {statusCounts.map((item) => {
                const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-slate-500">
                        {item.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown (Bar style) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              {priorityCounts.map((item) => {
                const pct = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-slate-500">
                        {item.count} issues ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-500" />
              Project Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-1">
              {projects.map((proj) => {
                const projTasks = tasks.filter((t) => t.projectId === proj.id);
                const projDone = projTasks.filter((t) => t.status === 'DONE').length;
                const projPct = projTasks.length > 0 ? Math.round((projDone / projTasks.length) * 100) : 0;

                return (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: proj.color }}
                        />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {proj.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                        {projPct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 transition-all duration-500"
                        style={{ width: `${projPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Key: {proj.key}</span>
                      <span>
                        {projDone} of {projTasks.length} tasks completed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              Recent Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3.5 pt-1">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <Avatar src={act.userAvatar} name={act.userName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {act.userName}
                      </span>{' '}
                      {act.action}{' '}
                      <span className="font-semibold text-brand-600 dark:text-brand-400">
                        {act.target}
                      </span>
                    </p>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
