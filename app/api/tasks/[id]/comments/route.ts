import { NextRequest, NextResponse } from 'next/server';
import { MOCK_TASKS, MOCK_USERS } from '@/lib/mock-data';
import { TaskComment } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = MOCK_TASKS.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json({ data: task.comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content } = body;
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const task = MOCK_TASKS.find((t) => t.id === params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const newComment: TaskComment = {
      id: `cm-${Date.now()}`,
      taskId: params.id,
      userId: MOCK_USERS[0].id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      user: MOCK_USERS[0],
    };

    task.comments.push(newComment);
    return NextResponse.json({ data: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
