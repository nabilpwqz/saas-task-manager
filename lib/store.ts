import { create } from 'zustand';
import { MOCK_ACTIVITIES, MOCK_PROJECTS, MOCK_TASKS, MOCK_USERS, MOCK_WORKSPACE } from './mock-data';
import { ActivityItem, ChecklistItem, Project, Task, TaskComment, TaskPriority, TaskStatus, User, Workspace } from '@/types';

export type AppViewMode = 'board' | 'list' | 'dashboard' | 'projects' | 'team';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Domain data
  workspace: Workspace;
  users: User[];
  projects: Project[];
  tasks: Task[];
  activities: ActivityItem[];

  // Navigation & Filtering
  activeView: AppViewMode;
  setActiveView: (view: AppViewMode) => void;
  selectedProjectId: string | 'ALL';
  setSelectedProjectId: (id: string | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatus: TaskStatus | 'ALL';
  setSelectedStatus: (status: TaskStatus | 'ALL') => void;
  selectedPriority: TaskPriority | 'ALL';
  setSelectedPriority: (priority: TaskPriority | 'ALL') => void;
  selectedAssigneeId: string | 'ALL';
  setSelectedAssigneeId: (id: string | 'ALL') => void;
  resetFilters: () => void;

  // Modals & Panels
  isCreateTaskOpen: boolean;
  openCreateTaskModal: (defaultStatus?: TaskStatus) => void;
  closeCreateTaskModal: () => void;
  createTaskDefaultStatus?: TaskStatus;

  selectedTaskId: string | null;
  openTaskDetail: (taskId: string) => void;
  closeTaskDetail: () => void;

  isCreateProjectOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;

  isShortcutsOpen: boolean;
  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;

  isInviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;

  // Task Mutators
  addTask: (newTask: Omit<Task, 'id' | 'taskNumber' | 'taskKey' | 'createdAt' | 'updatedAt' | 'checklists' | 'comments'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;

  // Checklist Mutators
  toggleChecklistItem: (taskId: string, checklistId: string) => void;
  addChecklistItem: (taskId: string, title: string) => void;

  // Comment Mutators
  addComment: (taskId: string, content: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;

  // Project Mutators
  addProject: (project: Omit<Project, 'id' | 'workspaceId' | 'taskCount' | 'completedTaskCount'>) => void;

  // Workspace Mutators
  inviteMember: (email: string, role: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: true,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  workspace: MOCK_WORKSPACE,
  users: MOCK_USERS,
  projects: MOCK_PROJECTS,
  tasks: MOCK_TASKS,
  activities: MOCK_ACTIVITIES,

  activeView: 'board',
  setActiveView: (view) => set({ activeView: view }),
  selectedProjectId: 'ALL',
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedStatus: 'ALL',
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  selectedPriority: 'ALL',
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  selectedAssigneeId: 'ALL',
  setSelectedAssigneeId: (id) => set({ selectedAssigneeId: id }),

  resetFilters: () =>
    set({
      selectedProjectId: 'ALL',
      searchQuery: '',
      selectedStatus: 'ALL',
      selectedPriority: 'ALL',
      selectedAssigneeId: 'ALL',
    }),

  isCreateTaskOpen: false,
  createTaskDefaultStatus: undefined,
  openCreateTaskModal: (defaultStatus) =>
    set({ isCreateTaskOpen: true, createTaskDefaultStatus: defaultStatus }),
  closeCreateTaskModal: () =>
    set({ isCreateTaskOpen: false, createTaskDefaultStatus: undefined }),

  selectedTaskId: null,
  openTaskDetail: (taskId) => set({ selectedTaskId: taskId }),
  closeTaskDetail: () => set({ selectedTaskId: null }),

  isCreateProjectOpen: false,
  openCreateProjectModal: () => set({ isCreateProjectOpen: true }),
  closeCreateProjectModal: () => set({ isCreateProjectOpen: false }),

  isShortcutsOpen: false,
  openShortcutsModal: () => set({ isShortcutsOpen: true }),
  closeShortcutsModal: () => set({ isShortcutsOpen: false }),

  isInviteModalOpen: false,
  openInviteModal: () => set({ isInviteModalOpen: true }),
  closeInviteModal: () => set({ isInviteModalOpen: false }),

  addTask: (data) => {
    const { tasks, projects, users } = get();
    const project = projects.find((p) => p.id === data.projectId) || projects[0];
    const newNum = tasks.filter((t) => t.projectId === project.id).length + 101;
    const taskKey = `${project.key}-${newNum}`;
    const assignee = users.find((u) => u.id === data.assigneeId);
    const creator = users[0];

    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      taskNumber: newNum,
      taskKey,
      project,
      assignee,
      creator,
      checklists: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      userId: creator.id,
      userName: creator.name,
      userAvatar: creator.avatar,
      action: 'created task',
      target: `${taskKey} (${newTask.title})`,
      timestamp: 'Just now',
      taskId: newTask.id,
    };

    set({
      tasks: [newTask, ...tasks],
      activities: [newActivity, ...get().activities],
      isCreateTaskOpen: false,
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ),
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
      selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
    }));
  },

  moveTaskStatus: (taskId, newStatus) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    const oldStatus = task.status;
    const currentUser = get().users[0];

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      action: 'moved task',
      target: `${task.taskKey} from ${oldStatus} to ${newStatus}`,
      timestamp: 'Just now',
      taskId: task.id,
    };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      ),
      activities: [newActivity, ...state.activities],
    }));
  },

  toggleChecklistItem: (taskId, checklistId) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          checklists: task.checklists.map((cl) =>
            cl.id === checklistId ? { ...cl, completed: !cl.completed } : cl
          ),
        };
      }),
    }));
  },

  addChecklistItem: (taskId, title) => {
    if (!title.trim()) return;
    const newCl: ChecklistItem = {
      id: `cl-${Date.now()}`,
      taskId,
      title: title.trim(),
      completed: false,
      order: 99,
    };
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          checklists: [...task.checklists, newCl],
        };
      }),
    }));
  },

  addComment: (taskId, content) => {
    if (!content.trim()) return;
    const currentUser = get().users[0];
    const newComment: TaskComment = {
      id: `cm-${Date.now()}`,
      taskId,
      userId: currentUser.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      user: currentUser,
    };

    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          comments: [...task.comments, newComment],
        };
      }),
    }));
  },

  deleteComment: (taskId, commentId) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          comments: task.comments.filter((c) => c.id !== commentId),
        };
      }),
    }));
  },

  addProject: (data) => {
    const { projects } = get();
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      workspaceId: get().workspace.id,
      taskCount: 0,
      completedTaskCount: 0,
    };
    set({
      projects: [...projects, newProject],
      isCreateProjectOpen: false,
    });
  },

  inviteMember: (email, role) => {
    const newMemberUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces`,
      role: role,
      department: 'Invited',
    };
    set((state) => ({
      users: [...state.users, newMemberUser],
      workspace: {
        ...state.workspace,
        members: [
          ...state.workspace.members,
          {
            id: `wm-${Date.now()}`,
            workspaceId: state.workspace.id,
            userId: newMemberUser.id,
            role: role as any,
            joinedAt: new Date().toISOString(),
            user: newMemberUser,
          },
        ],
      },
      isInviteModalOpen: false,
    }));
  },
}));
