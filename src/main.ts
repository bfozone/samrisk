import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { HTTPError } from 'ky'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { classifyError, configureApiErrorHandlers, configureAuthToken } from '@/api/client'
import { getToastRef } from '@/utils/toastRef'
import App from './App.vue'
import router from './router'

import './assets/tailwind.css'
import './assets/tokens.css'
import './assets/main.css'

const isMockMode = import.meta.env.VITE_USE_MOCK_API !== 'false'

async function bootstrap() {
  if (isMockMode) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  if (!isMockMode) {
    const { initializeMsal, getMsalInstance } = await import('@/auth/msalInstance')
    const { acquireToken } = await import('@/auth/tokenProvider')
    const { loginRequest } = await import('@/auth/msalConfig')
    await initializeMsal()

    const msal = getMsalInstance()
    if (!msal.getAllAccounts().length) {
      await msal.loginRedirect(loginRequest)
      return
    }

    configureAuthToken(acquireToken)
  }

  configureApiErrorHandlers({
    onUnauthorized: () => {
      getToastRef()?.add({ severity: 'warn', summary: 'Session expired', detail: 'Please sign in again', life: 5000 })
    },
    onForbidden: () => {
      getToastRef()?.add({ severity: 'warn', summary: 'Access denied', detail: 'You do not have permission for this action', life: 5000 })
    },
    onNotFound: () => {
      getToastRef()?.add({ severity: 'warn', summary: 'Not found', detail: 'The requested resource was not found', life: 5000 })
    },
    onValidation: () => {
      getToastRef()?.add({ severity: 'warn', summary: 'Validation error', detail: 'Please check your input', life: 5000 })
    },
    onRateLimited: (ctx) => {
      const detail = ctx.retryAfter
        ? `Too many requests. Retrying in ${ctx.retryAfter}s`
        : 'Too many requests. Please wait a moment'
      getToastRef()?.add({ severity: 'warn', summary: 'Rate limited', detail, life: 5000 })
    },
    onServerError: () => {
      getToastRef()?.add({ severity: 'error', summary: 'Server error', detail: 'Something went wrong', life: 5000 })
    },
    onNetworkError: () => {
      getToastRef()?.add({ severity: 'error', summary: 'Network error', detail: 'Unable to reach the server', life: 5000 })
    },
    onUnknownError: () => {
      getToastRef()?.add({ severity: 'error', summary: 'Request failed', detail: 'Unexpected error', life: 5000 })
    },
  })

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof HTTPError && error.response.status === 429)
            return failureCount < 3
          return false
        },
        retryDelay: (attemptIndex, error) => {
          if (error instanceof HTTPError) {
            const { retryAfter } = classifyError(error)
            if (retryAfter)
              return retryAfter * 1000
          }
          return Math.min(1000 * 2 ** attemptIndex, 30000)
        },
      },
    },
  })
  app.use(VueQueryPlugin, { queryClient })

  app.mount('#app')
}

bootstrap()
