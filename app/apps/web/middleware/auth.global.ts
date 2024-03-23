import { useProtectedApi } from '~/api'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data, error } = await useProtectedApi<{ isAdministratorPresent: boolean }>('user/info')

  if (error.value && !(to.path.startsWith('/init') || to.path.startsWith('/auth'))) { return navigateTo('/auth/login') }
  else if (data.value && to.path.startsWith('/auth')) { return navigateTo('/') }
})
