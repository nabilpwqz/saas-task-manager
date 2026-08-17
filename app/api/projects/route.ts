import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PROJECTS, MOCK_WORKSPACE } from '@/lib/mock-data';
import { Project } from '@/types';

export async function GET() {
  return NextResponse.json({
    data: MOCK_PROJECTS,
    total: MOCK_PROJECTS.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, key, description, color, priority, targetDate } = body;

    if (!name || !key) {
      return NextResponse.json(
        { error: 'Project name and key are required' },
        { status: 400 }
      );
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      workspaceId: MOCK_WORKSPACE.id,
      name,
      key: key.toUpperCase(),
      description: description || '',
      color: color || '#6366f1',
      icon: 'FolderKanban',
      status: 'ACTIVE',
      priority: priority || 'MEDIUM',
      targetDate,
      taskCount: 0,
      completedTaskCount: 0,
    };

    MOCK_PROJECTS.push(newProject);
    return NextResponse.json({ data: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
