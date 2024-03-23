export function usePublicApi<T = unknown>(url: string) {
  return useFetch<T>(url, {
    baseURL: '/api/public/',
  })
}

export async function useProtectedApi<T = unknown>(url: string) {
  return useFetch<T>(url, {
    baseURL: '/api/protected/',
  })
}
