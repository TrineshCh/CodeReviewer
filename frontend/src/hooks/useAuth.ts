import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { currentUser, isAuthenticated, login, logout } = useAuthStore();
  return { currentUser, isAuthenticated, login, logout, isAdmin: currentUser?.role === 'admin' };
};
