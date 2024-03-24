export default defineNuxtRouteMiddleware((to) => {
  const router = useRouter();

  for (const key in to) {
    router.currentRoute.value[key] = to[key];
  }
});
