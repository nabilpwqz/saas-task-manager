import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TASKS, MOCK_USERS } from '@/lib/mock-data';
import { Task } from '@/types';

// In-memory runtime data cache for demo / standalone operation
let runtimeTasks: Task[] = [...MOCK_TASKS];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const assigneeId = searchParams.get('assigneeId');
  const projectId = searchParams.get('projectId');
  const search = searchParams.get('q');

  let results = [...runtimeTasks];

  if (status && status !== 'ALL') {
    results = results.filter((t) => t.status === status);
  }
  if (priority && priority !== 'ALL') {
    results = results.filter((t) => t.priority === priority);
  }
  if (assigneeId && assigneeId !== 'ALL') {
    results = results.filter((t) => t.assigneeId === assigneeId);
  }
  if (projectId && projectId !== 'ALL') {
    results = results.filter((t) => t.projectId === projectId);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.taskKey.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    data: results,
    total: results.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, projectId, status, priority, type, assigneeId, dueDate, storyPoints } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Title and projectId are required' },
        { status: 400 }
      );
    }

    const newTaskNumber = runtimeTasks.length + 101;
    const taskKey = `TASK-${newTaskNumber}`;
    const assignee = MOCK_USERS.find((u) => u.id === assigneeId);

    const newTask: Task = {
      id: `task-${Date.now()}`,
      taskNumber: newTaskNumber,
      taskKey,
      title,
      description: description || '',
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      type: type || 'TASK',
      storyPoints: storyPoints || 1,
      order: 0,
      dueDate,
      projectId,
      assigneeId,
      assignee,
      creatorId: MOCK_USERS[0].id,
      creator: MOCK_USERS[0],
      checklists: [],
      comments: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    runtimeTasks.unshift(newTask);
    return NextResponse.json({ data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
