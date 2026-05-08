import React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
}

export function Avatar({ src, name, size = 'sm', className, showStatus }: AvatarProps) {
  const sizes = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className="relative inline-block select-none">
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-medium bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10',
          sizes[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {showStatus && (
        <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
      )}
    </div>
  );
}
