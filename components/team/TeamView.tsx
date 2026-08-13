'use client';

import React, { useState } from 'react';
import { Users2, UserPlus, Mail, Shield, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

export function TeamView() {
  const {
    workspace,
    users,
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,
    inviteMember,
  } = useAppStore();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    inviteMember(email.trim(), role);
    setEmail('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team Members
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage roles, seat permissions, and access for {workspace.name}.
          </p>
        </div>

        <Button onClick={openInviteModal} size="sm">
          <UserPlus className="w-4 h-4 mr-1" />
          Invite Teammate
        </Button>
      </div>

      {/* Seats Plan Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600/10 via-indigo-600/10 to-violet-600/10 border border-brand-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
            {workspace.logo}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {workspace.plan} Plan Active
            </div>
            <div className="text-[11px] text-slate-500">
              {workspace.members.length} of 25 seats active in this billing cycle
            </div>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> All systems operational
        </span>
      </div>

      {/* Members Directory */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
          <div className="col-span-5">Member</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-2">Access Role</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {workspace.members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition text-xs"
            >
              {/* Member User */}
              <div className="col-span-5 flex items-center gap-3">
                <Avatar src={member.user.avatar} name={member.user.name} size="md" showStatus />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {member.user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{member.user.email}</span>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="col-span-3 text-slate-600 dark:text-slate-300">
                {member.user.department || 'Product Engineering'}
              </div>

              {/* Role */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                    member.role === 'OWNER'
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      : member.role === 'ADMIN'
                      ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  {member.role}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 text-right">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ● Active now
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        title="Invite Teammate"
        description="Grant workspace collaboration access to an engineer or designer."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@flowcraft.io"
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Workspace Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="MEMBER">Member (Create and edit assigned tasks)</option>
              <option value="ADMIN">Admin (Full project management and settings)</option>
              <option value="GUEST">Guest (Read-only observation access)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={closeInviteModal} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
