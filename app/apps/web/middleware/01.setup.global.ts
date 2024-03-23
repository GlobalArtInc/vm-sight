export default defineNuxtRouteMiddleware(async (to) => {
  const data = await $fetch<{ isAdministratorPresent: boolean }>('/api/public/user/admin/check');

  if (data.isAdministratorPresent && to.path.startsWith('/init')) {
    return navigateTo('/');
  } else if (!data.isAdministratorPresent && (!to.path.startsWith('/init') || to.path.startsWith('/auth'))) {
    return navigateTo('/init/admin');
  }
});
