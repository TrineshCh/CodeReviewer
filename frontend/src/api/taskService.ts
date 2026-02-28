import { tasks } from '../mock/tasks';
import { simulateDelay } from '../mock/delay';
import { Task, TaskStatus } from '../types';

export const taskService = {
  async getAll(filters: { status?: TaskStatus; employeeId?: string; teamId?: string } = {}): Promise<Task[]> {
    await simulateDelay(300);
    let result = [...tasks];
    if (filters.status) result = result.filter((t) => t.status === filters.status);
    if (filters.employeeId) result = result.filter((t) => t.employeeId === filters.employeeId);
    if (filters.teamId) result = result.filter((t) => t.teamId === filters.teamId);
    return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async getById(taskId: string): Promise<Task | null> {
    await simulateDelay(200);
    return tasks.find((t) => t.id === taskId) || null;
  },

  async submit(taskData: Omit<Task, 'id' | 'status' | 'submittedAt' | 'updatedAt' | 'analysisId' | 'reviewId'>): Promise<Task> {
    await simulateDelay(500);
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'pending-analysis',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysisId: null,
      reviewId: null,
    };
    tasks.push(newTask);
    return newTask;
  },

  async updateStatus(taskId: string, status: TaskStatus): Promise<Task | null> {
    await simulateDelay(300);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
    }
    return task || null;
  },
};
