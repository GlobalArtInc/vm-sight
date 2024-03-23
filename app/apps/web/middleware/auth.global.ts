import type { User } from '~/types/user.types';

export default defineNuxtRouteMiddleware(async (to) => {
  const { data, error } = await useFetch<User>('/api/protected/user/info');

  if (error.value && !(to.path.startsWith('/init') || to.path.startsWith('/auth'))) {
    return navigateTo('/auth/login');
  } else if (data.value && to.path.startsWith('/auth')) {
    return navigateTo('/');
  }
});
