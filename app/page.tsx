'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const { activeView } = useAppStore();

  return (
    <AppShell>
      <div className="p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          FlowCraft SaaS Workspace
        </h2>
        <p className="text-sm text-slate-500">
          Current view mode: <span className="font-semibold text-brand-500">{activeView}</span>
        </p>
      </div>
    </AppShell>
  );
}
