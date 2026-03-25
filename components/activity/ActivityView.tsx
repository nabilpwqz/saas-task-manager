'use client';

import React, { useState } from 'react';
import {
  History,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  MessageSquare,
  FolderKanban,
  UserCheck,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { exportActivitiesToCSV } from '@/lib/export-utils';

export function ActivityView() {
  const { activities, users } = useAppStore();
  const [selectedUser, setSelectedUser] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredActivities = activities.filter((act) => {
    if (selectedUser !== 'ALL' && act.userId !== selectedUser) return false;
    if (selectedAction !== 'ALL') {
      if (selectedAction === 'tasks' && !act.action.toLowerCase().includes('task')) return false;
      if (selectedAction === 'comments' && !act.action.toLowerCase().includes('comment')) return false;
      if (selectedAction === 'projects' && !act.action.toLowerCase().includes('project')) return false;
      if (selectedAction === 'members' && !act.action.toLowerCase().includes('member') && !act.action.toLowerCase().includes('invite')) return false;
    }
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            Workspace Audit Trail
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time event logging of all workspace changes, security events, and team activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportActivitiesToCSV(filteredActivities)}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Action Type Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Type:</span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              >
                <option value="ALL">All Actions</option>
                <option value="tasks">Task Updates</option>
                <option value="comments">Comments</option>
                <option value="projects">Projects</option>
                <option value="members">Team & Invites</option>
              </select>
            </div>

            {/* Actor Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Actor:</span>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              >
                <option value="ALL">All Team Members</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredActivities.length} audit records
          </div>
        </CardContent>
      </Card>

      {/* Activities Timeline */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition text-xs"
            >
              <div className="flex items-center gap-3">
                <Avatar src={act.userAvatar} name={act.userName} size="sm" />
                <div>
                  <p className="text-slate-800 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {act.userName}
                    </span>{' '}
                    <span className="text-slate-500">{act.action}</span>{' '}
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      {act.target}
                    </span>
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Event ID: {act.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{act.timestamp}</span>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="p-12 text-center text-xs text-slate-400">
              No audit log records match the selected filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
