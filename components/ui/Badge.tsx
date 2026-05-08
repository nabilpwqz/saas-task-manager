import React from 'react';
import { cn } from '@/lib/utils';
import { TaskPriority, TaskStatus } from '@/types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/lib/constants';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'status' | 'priority';
  status?: TaskStatus;
  priority?: TaskPriority;
}

export function Badge({
  className,
  variant = 'default',
  status,
  priority,
  children,
  ...props
}: BadgeProps) {
  if (variant === 'status' && status) {
    const config = STATUS_CONFIG[status];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
          config.bg,
          config.text,
          className
        )}
        {...props}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
        {config.label}
      </span>
    );
  }

  if (variant === 'priority' && priority) {
    const config = PRIORITY_CONFIG[priority];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
          config.bg,
          config.color,
          className
        )}
        {...props}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
        {config.label}
      </span>
    );
  }

  const variants = {
    default: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variants[variant as 'default' | 'secondary' | 'outline'] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
