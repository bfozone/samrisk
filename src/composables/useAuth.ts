import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { getCurrentUser } from '@/api/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: ({ signal }) => getCurrentUser({ signal }),
    staleTime: Infinity,
    retry: false,
  })
}

const isMockMode = import.meta.env.VITE_USE_MOCK_API !== 'false'

export function useAuth() {
  const isAuthenticated = ref(false)

  async function checkAuth() {
    if (isMockMode) {
      isAuthenticated.value = true
      return
    }
    const { getMsalInstance } = await import('@/auth/msalInstance')
    const msal = getMsalInstance()
    isAuthenticated.value = msal.getAllAccounts().length > 0
  }

  async function login() {
    if (isMockMode)
      return
    const { getMsalInstance } = await import('@/auth/msalInstance')
    const { loginRequest } = await import('@/auth/msalConfig')
    const msal = getMsalInstance()
    await msal.loginRedirect(loginRequest)
  }

  async function logout() {
    if (isMockMode)
      return
    const { getMsalInstance } = await import('@/auth/msalInstance')
    const msal = getMsalInstance()
    await msal.logoutRedirect()
  }

  checkAuth()

  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    logout,
  }
}
