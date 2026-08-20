import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeTime, isOverdue, getInitials } from '@/lib/utils';
import { MOCK_TASKS } from '@/lib/mock-data';

describe('Task Manager Utilities', () => {
  it('combines tailwind classes correctly with cn', () => {
    expect(cn('px-2 py-1', 'bg-blue-500')).toBe('px-2 py-1 bg-blue-500');
    expect(cn('px-2', false && 'hidden', 'px-4')).toBe('px-4');
  });

  it('formats dates consistently', () => {
    const formatted = formatDate('2026-08-25T00:00:00Z');
    expect(formatted).toContain('Aug');
  });

  it('computes user initials accurately', () => {
    expect(getInitials('Alex Rivera')).toBe('AR');
    expect(getInitials('Sarah Chen')).toBe('SC');
    expect(getInitials('Marcus')).toBe('MA');
    expect(getInitials('')).toBe('??');
  });

  it('detects overdue tasks when date is in the past', () => {
    const pastDate = '2020-01-01T00:00:00Z';
    const futureDate = '2099-01-01T00:00:00Z';

    expect(isOverdue(pastDate, 'TODO')).toBe(true);
    expect(isOverdue(pastDate, 'DONE')).toBe(false); // Completed tasks are never marked overdue
    expect(isOverdue(futureDate, 'TODO')).toBe(false);
    expect(isOverdue(undefined, 'TODO')).toBe(false);
  });

  it('validates mock data integrity', () => {
    expect(MOCK_TASKS.length).toBeGreaterThanOrEqual(15);
    for (const task of MOCK_TASKS) {
      expect(task.title).toBeTruthy();
      expect(task.taskKey).toBeTruthy();
      expect(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).toContain(task.status);
      expect(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).toContain(task.priority);
    }
  });
});
