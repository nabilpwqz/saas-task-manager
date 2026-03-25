'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  CreditCard,
  Key,
  Copy,
  Check,
  Download,
  Trash2,
  Plus,
  BellRing,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { exportActivitiesToCSV, exportTasksToCSV, exportTasksToJSON } from '@/lib/export-utils';

export function SettingsView() {
  const { workspace, updateWorkspace, apiKeys, addApiKey, revokeApiKey, tasks, activities } = useAppStore();

  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // New API Key Modal state
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read:tasks', 'write:tasks']);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    updateWorkspace({ name: workspaceName.trim() });
  };

  const handleCopyKey = (id: string, key: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(key);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    }
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    addApiKey(newKeyName.trim(), selectedScopes);
    setNewKeyName('');
    setIsKeyModalOpen(false);
  };

  const toggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-500" />
          Workspace Settings & Configuration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage workspace branding, team security, developer API access, and billing.
        </p>
      </div>

      {/* 1. General Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-500" />
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveGeneral} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Workspace URL Identifier
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400 font-mono">flowcraft.io/ws/</span>
                <input
                  type="text"
                  disabled
                  value={workspace.slug}
                  className="flex-1 h-9 px-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono"
                />
              </div>
            </div>

            <Button type="submit" size="sm" className="text-xs">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2. Subscription & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-500" />
            Subscription & Usage Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Free */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Starter
                </h4>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">$0</div>
                <span className="text-[11px] text-slate-400">Forever free</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Up to 5 team members</li>
                <li>• Unlimited Kanban boards</li>
                <li>• 7 days audit history</li>
              </ul>
            </div>

            {/* Pro (Active) */}
            <div className="p-4 rounded-xl border-2 border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 space-y-3 relative shadow-sm">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Current Plan
              </span>
              <div>
                <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Pro Team
                </h4>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                  $19 <span className="text-xs font-normal text-slate-400">/ seat / mo</span>
                </div>
                <span className="text-[11px] text-slate-400">Billed annually</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Unlimited team members</li>
                <li>• Real-time analytics charts</li>
                <li>• 1 year audit log stream</li>
                <li>• Priority developer API keys</li>
              </ul>
            </div>

            {/* Enterprise */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Enterprise
                </h4>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                  $49 <span className="text-xs font-normal text-slate-400">/ seat / mo</span>
                </div>
                <span className="text-[11px] text-slate-400">Custom billing</span>
              </div>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <li>• SAML 2.0 / Okta SSO</li>
                <li>• Custom retention policies</li>
                <li>• 99.99% uptime SLA</li>
                <li>• Dedicated success engineer</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Developer API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Key className="w-4 h-4 text-brand-500" />
              Developer API Keys
            </CardTitle>
            <Button size="sm" onClick={() => setIsKeyModalOpen(true)} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Generate API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiKeys.map((keyItem) => (
              <div
                key={keyItem.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {keyItem.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-200/60 dark:bg-slate-900 px-2 py-0.5 rounded">
                      {keyItem.key.substring(0, 14)}••••••••••
                    </span>
                    <button
                      onClick={() => handleCopyKey(keyItem.id, keyItem.key)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      title="Copy full key"
                    >
                      {copiedKeyId === keyItem.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>Created: {keyItem.createdAt.split('T')[0]}</span>
                    <span>•</span>
                    <span>Last used: {keyItem.lastUsed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {keyItem.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => revokeApiKey(keyItem.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Data Export Center */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Download className="w-4 h-4 text-brand-500" />
            Data Management & Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Export Tasks (CSV)
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Download spreadsheet-compatible CSV containing all tasks, assignees, and dates.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportTasksToCSV(tasks)}
                className="w-full text-xs"
              >
                Download CSV
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Export Tasks (JSON)
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Complete database dump of tasks, checklists, and comments in raw JSON format.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportTasksToJSON(tasks)}
                className="w-full text-xs"
              >
                Download JSON
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Audit Trail (CSV)
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Historical record of all user events, PR submissions, and status shifts.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportActivitiesToCSV(activities)}
                className="w-full text-xs"
              >
                Download Audit CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate API Key Modal */}
      <Modal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        title="Generate Developer API Key"
        description="Provide a label and select authorization scopes for programmatic access."
      >
        <form onSubmit={handleCreateKey} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Key Description / App Name *
            </label>
            <input
              type="text"
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. CI/CD Deployment Bot"
              className="w-full h-9 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              API Scopes
            </label>
            <div className="space-y-2">
              {[
                { id: 'read:tasks', label: 'read:tasks (Query tasks, boards, and projects)' },
                { id: 'write:tasks', label: 'write:tasks (Create, update, and delete tasks)' },
                { id: 'write:comments', label: 'write:comments (Post task discussion comments)' },
                { id: 'admin:workspace', label: 'admin:workspace (Manage members and settings)' },
              ].map((scope) => (
                <label
                  key={scope.id}
                  className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedScopes.includes(scope.id)}
                    onChange={() => toggleScope(scope.id)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span>{scope.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsKeyModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Generate Key
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
