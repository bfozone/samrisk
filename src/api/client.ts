import axios from 'axios'
import type { AxiosError } from 'axios'

export type ApiErrorKind = 'unauthorized' | 'forbidden' | 'server' | 'network' | 'unknown'

export interface ApiErrorContext {
  kind: ApiErrorKind
  status?: number
  error: AxiosError
}

export interface ApiErrorHandlers {
  onUnauthorized: (context: ApiErrorContext) => void
  onForbidden: (context: ApiErrorContext) => void
  onServerError: (context: ApiErrorContext) => void
  onNetworkError: (context: ApiErrorContext) => void
  onUnknownError: (context: ApiErrorContext) => void
}

const defaultHandlers: ApiErrorHandlers = {
  onUnauthorized: ({ status }) => {
    console.warn(`[api] unauthorized request (${status ?? 'no-status'})`)
  },
  onForbidden: ({ status }) => {
    console.warn(`[api] forbidden request (${status ?? 'no-status'})`)
  },
  onServerError: ({ status }) => {
    console.error(`[api] upstream server error (${status ?? 'no-status'})`)
  },
  onNetworkError: () => {
    console.error('[api] network error while calling backend')
  },
  onUnknownError: ({ status }) => {
    console.error(`[api] unexpected API error (${status ?? 'no-status'})`)
  },
}

const errorHandlers: ApiErrorHandlers = { ...defaultHandlers }

export function configureApiErrorHandlers(handlers: Partial<ApiErrorHandlers>) {
  Object.assign(errorHandlers, handlers)
}

function classifyError(error: AxiosError): ApiErrorContext {
  const status = error.response?.status

  if (!status) return { kind: 'network', error }
  if (status === 401) return { kind: 'unauthorized', status, error }
  if (status === 403) return { kind: 'forbidden', status, error }
  if (status >= 500) return { kind: 'server', status, error }
  return { kind: 'unknown', status, error }
}

function handleApiError(context: ApiErrorContext) {
  switch (context.kind) {
    case 'unauthorized':
      errorHandlers.onUnauthorized(context)
      return
    case 'forbidden':
      errorHandlers.onForbidden(context)
      return
    case 'server':
      errorHandlers.onServerError(context)
      return
    case 'network':
      errorHandlers.onNetworkError(context)
      return
    case 'unknown':
      errorHandlers.onUnknownError(context)
      return
    default: {
      const exhaustiveCheck: never = context.kind
      return exhaustiveCheck
    }
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const context = classifyError(error)
    handleApiError(context)

    return Promise.reject(error)
  },
)

export default apiClient
