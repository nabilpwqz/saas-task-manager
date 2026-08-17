import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TASKS } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = MOCK_TASKS.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json({ data: task });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const taskIndex = MOCK_TASKS.findIndex((t) => t.id === params.id);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = {
      ...MOCK_TASKS[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    MOCK_TASKS[taskIndex] = updatedTask;
    return NextResponse.json({ data: updatedTask });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskIndex = MOCK_TASKS.findIndex((t) => t.id === params.id);
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  MOCK_TASKS.splice(taskIndex, 1);
  return NextResponse.json({ success: true, message: 'Task deleted successfully' });
}
