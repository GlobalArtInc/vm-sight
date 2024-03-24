import { defineStore } from 'pinia';
import type { User } from '~/types/user.types';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    setUser(user: User) {
      this.isAuthenticated = true;
      this.user = user;
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});
