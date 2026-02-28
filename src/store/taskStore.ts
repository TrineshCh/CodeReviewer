import { create } from 'zustand';
import { Task, TaskStatus } from '../types';
import { taskService } from '../api/taskService';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (filters?: { status?: TaskStatus; employeeId?: string; teamId?: string }) => Promise<void>;
  submitTask: (taskData: Omit<Task, 'id' | 'status' | 'submittedAt' | 'updatedAt' | 'analysisId' | 'reviewId'>) => Promise<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  fetchTasks: async (filters) => {
    set({ isLoading: true });
    const tasks = await taskService.getAll(filters);
    set({ tasks, isLoading: false });
  },
  submitTask: async (taskData) => {
    set({ isLoading: true });
    const newTask = await taskService.submit(taskData);
    set((state) => ({ tasks: [newTask, ...state.tasks], isLoading: false }));
    return newTask;
  },
  updateTaskStatus: async (taskId, status) => {
    await taskService.updateStatus(taskId, status);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t)),
    }));
  },
}));
