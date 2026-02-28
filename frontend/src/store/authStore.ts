import { create } from 'zustand';
import { User } from '../types';
import { users } from '../mock/users';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
    }
  },
  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
  },
}));
