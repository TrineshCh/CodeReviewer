import { users } from '../mock/users';
import { simulateDelay } from '../mock/delay';
import { User } from '../types';

export const authService = {
  async login(userId: string): Promise<User | null> {
    await simulateDelay(300);
    return users.find((u) => u.id === userId) || null;
  },

  async getUsers(role?: string): Promise<User[]> {
    await simulateDelay(200);
    if (role) return users.filter((u) => u.role === role);
    return users;
  },

  async getUserById(userId: string): Promise<User | null> {
    await simulateDelay(100);
    return users.find((u) => u.id === userId) || null;
  },
};
