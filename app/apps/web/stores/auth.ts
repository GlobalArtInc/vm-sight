import { defineStore } from 'pinia';
import type { User } from '~/types/user.types';

export const useAuthStore = defineStore('authStore', () => {
  const isAuthenticated = ref<boolean>(false);
  const user = ref<User | null>(null);

  const setUser = (savedUser: User) => {
    isAuthenticated.value = true;
    user.value = savedUser;
  };

  const logout = () => {
    isAuthenticated.value = false;
    user.value = null;
  };

  return { isAuthenticated, user, setUser, logout };
});
