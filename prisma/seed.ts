import { PrismaClient } from '@prisma/client';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_USERS, MOCK_WORKSPACE } from '../lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Upsert users
  for (const user of MOCK_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, avatar: user.avatar, role: user.role, department: user.department },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        department: user.department,
      },
    });
  }
  console.log(`✅ Seeded ${MOCK_USERS.length} users`);

  // Upsert Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: MOCK_WORKSPACE.slug },
    update: { name: MOCK_WORKSPACE.name, plan: MOCK_WORKSPACE.plan },
    create: {
      id: MOCK_WORKSPACE.id,
      name: MOCK_WORKSPACE.name,
      slug: MOCK_WORKSPACE.slug,
      logo: MOCK_WORKSPACE.logo,
      plan: MOCK_WORKSPACE.plan,
    },
  });
  console.log(`✅ Seeded workspace ${workspace.name}`);

  // Upsert Workspace Members
  for (const m of MOCK_WORKSPACE.members) {
    await prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: m.userId,
        },
      },
      update: { role: m.role as any },
      create: {
        id: m.id,
        workspaceId: workspace.id,
        userId: m.userId,
        role: m.role as any,
      },
    });
  }

  // Upsert Projects
  for (const proj of MOCK_PROJECTS) {
    await prisma.project.upsert({
      where: {
        workspaceId_key: {
          workspaceId: workspace.id,
          key: proj.key,
        },
      },
      update: {
        name: proj.name,
        description: proj.description,
        color: proj.color,
        icon: proj.icon,
        status: proj.status as any,
        priority: proj.priority as any,
      },
      create: {
        id: proj.id,
        workspaceId: workspace.id,
        name: proj.name,
        key: proj.key,
        description: proj.description,
        color: proj.color,
        icon: proj.icon,
        status: proj.status as any,
        priority: proj.priority as any,
        startDate: proj.startDate ? new Date(proj.startDate) : null,
        targetDate: proj.targetDate ? new Date(proj.targetDate) : null,
      },
    });
  }
  console.log(`✅ Seeded ${MOCK_PROJECTS.length} projects`);

  // Upsert Tasks
  for (const task of MOCK_TASKS) {
    await prisma.task.upsert({
      where: {
        projectId_taskNumber: {
          projectId: task.projectId,
          taskNumber: task.taskNumber,
        },
      },
      update: {
        title: task.title,
        description: task.description,
        status: task.status as any,
        priority: task.priority as any,
        type: task.type as any,
        storyPoints: task.storyPoints,
        order: task.order,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        assigneeId: task.assigneeId,
      },
      create: {
        id: task.id,
        taskNumber: task.taskNumber,
        title: task.title,
        description: task.description,
        status: task.status as any,
        priority: task.priority as any,
        type: task.type as any,
        storyPoints: task.storyPoints,
        order: task.order,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
      },
    });
  }
  console.log(`✅ Seeded ${MOCK_TASKS.length} tasks`);

  console.log('✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
