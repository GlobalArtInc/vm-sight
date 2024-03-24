import type { User } from '~/types/user.types';

export default defineNuxtRouteMiddleware(async (to) => {
  try {
    await $fetch<User>('/api/protected/user/info');
    if (to.path.startsWith('/auth')) {
      return navigateTo('/');
    }
  } catch {
    if (!(to.path.startsWith('/init') || to.path.startsWith('/auth'))) {
      return navigateTo('/auth/login');
    }
  }
});
