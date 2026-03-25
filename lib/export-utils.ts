import { ActivityItem, Task } from '@/types';

export function exportTasksToCSV(tasks: Task[]): void {
  const headers = ['Task Key', 'Title', 'Status', 'Priority', 'Type', 'Project', 'Assignee', 'Due Date', 'Created At'];
  const rows = tasks.map((t) => [
    t.taskKey,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.status,
    t.priority,
    t.type,
    `"${(t.project?.name || '').replace(/"/g, '""')}"`,
    `"${(t.assignee?.name || 'Unassigned').replace(/"/g, '""')}"`,
    t.dueDate || '',
    t.createdAt || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, 'flowcraft-tasks-export.csv', 'text/csv;charset=utf-8;');
}

export function exportTasksToJSON(tasks: Task[]): void {
  const jsonContent = JSON.stringify(tasks, null, 2);
  downloadBlob(jsonContent, 'flowcraft-tasks-export.json', 'application/json');
}

export function exportActivitiesToCSV(activities: ActivityItem[]): void {
  const headers = ['Timestamp', 'User', 'Action', 'Target', 'Task ID'];
  const rows = activities.map((a) => [
    `"${a.timestamp}"`,
    `"${a.userName.replace(/"/g, '""')}"`,
    `"${a.action.replace(/"/g, '""')}"`,
    `"${a.target.replace(/"/g, '""')}"`,
    a.taskId || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadBlob(csvContent, 'flowcraft-audit-log.csv', 'text/csv;charset=utf-8;');
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
