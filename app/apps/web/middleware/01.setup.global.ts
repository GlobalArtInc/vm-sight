import { usePublicApi } from '~/api'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data } = await usePublicApi<{ isAdministratorPresent: boolean }>('user/admin/check')

  if (data.value?.isAdministratorPresent && to.path.startsWith('/init')) { return navigateTo('/'); }
  else if (!data.value?.isAdministratorPresent && (!to.path.startsWith('/init') || to.path.startsWith('/auth'))) { return navigateTo('/init/admin'); }
})
