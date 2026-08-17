import { NextResponse } from 'next/server';
import { MOCK_TASKS, MOCK_PROJECTS } from '@/lib/mock-data';
import { isOverdue } from '@/lib/utils';

export async function GET() {
  const total = MOCK_TASKS.length;
  const completed = MOCK_TASKS.filter((t) => t.status === 'DONE').length;
  const inProgress = MOCK_TASKS.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW'
  ).length;
  const overdue = MOCK_TASKS.filter((t) => isOverdue(t.dueDate, t.status)).length;

  return NextResponse.json({
    metrics: {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      overdueTasks: overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    },
    projects: MOCK_PROJECTS.map((p) => {
      const pTasks = MOCK_TASKS.filter((t) => t.projectId === p.id);
      const pDone = pTasks.filter((t) => t.status === 'DONE').length;
      return {
        id: p.id,
        name: p.name,
        key: p.key,
        total: pTasks.length,
        done: pDone,
        percentage: pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0,
      };
    }),
  });
}
