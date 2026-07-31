'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { Command } from 'lucide-react';

export function ShortcutsModal() {
  const { isShortcutsOpen, closeShortcutsModal } = useAppStore();

  const shortcuts = [
    { key: 'c', description: 'Create a new task' },
    { key: '?', description: 'Open keyboard shortcuts helper' },
    { key: 'Esc', description: 'Close any active modal or slide-over drawer' },
    { key: 'Ctrl + Enter', description: 'Submit comment or form' },
    { key: 'Tab', description: 'Navigate between form fields' },
  ];

  return (
    <Modal
      isOpen={isShortcutsOpen}
      onClose={closeShortcutsModal}
      title="Keyboard Shortcuts"
      description="Supercharge your productivity with quick actions."
      maxWidth="md"
    >
      <div className="space-y-2 pt-1">
        {shortcuts.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs"
          >
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {item.description}
            </span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
