import type { AxiosError } from 'axios'
import axios from 'axios'
import * as v from 'valibot'

export type ApiErrorKind
  = | 'unauthorized'
    | 'forbidden'
    | 'not_found'
    | 'validation'
    | 'rate_limited'
    | 'server'
    | 'network'
    | 'unknown'

export interface ApiErrorContext {
  kind: ApiErrorKind
  status?: number
  retryAfter?: number
  error: AxiosError
}

export interface ApiErrorHandlers {
  onUnauthorized: (context: ApiErrorContext) => void
  onForbidden: (context: ApiErrorContext) => void
  onNotFound: (context: ApiErrorContext) => void
  onValidation: (context: ApiErrorContext) => void
  onRateLimited: (context: ApiErrorContext) => void
  onServerError: (context: ApiErrorContext) => void
  onNetworkError: (context: ApiErrorContext) => void
  onUnknownError: (context: ApiErrorContext) => void
}

const defaultHandlers: ApiErrorHandlers = {
  onUnauthorized: () => {
    console.warn('[api] unauthorized request')
  },
  onForbidden: () => {
    console.warn('[api] forbidden request')
  },
  onNotFound: () => {
    console.warn('[api] resource not found')
  },
  onValidation: () => {
    console.warn('[api] validation error')
  },
  onRateLimited: () => {
    console.warn('[api] rate limited')
  },
  onServerError: () => {
    console.error('[api] upstream server error')
  },
  onNetworkError: () => {
    console.error('[api] network error while calling backend')
  },
  onUnknownError: () => {
    console.error('[api] unexpected API error')
  },
}

let errorHandlers: Readonly<ApiErrorHandlers> = { ...defaultHandlers }

export function configureApiErrorHandlers(handlers: Partial<ApiErrorHandlers>) {
  errorHandlers = { ...errorHandlers, ...handlers }
}

export function classifyError(error: AxiosError): ApiErrorContext {
  const status = error.response?.status

  if (!status)
    return { kind: 'network', error }
  if (status === 401)
    return { kind: 'unauthorized', status, error }
  if (status === 403)
    return { kind: 'forbidden', status, error }
  if (status === 404)
    return { kind: 'not_found', status, error }
  if (status === 422)
    return { kind: 'validation', status, error }
  if (status === 429) {
    const ra = Number.parseInt(error.response?.headers?.['retry-after'] ?? '', 10)
    return { kind: 'rate_limited', status, retryAfter: Number.isNaN(ra) ? undefined : ra, error }
  }
  if (status >= 500)
    return { kind: 'server', status, error }
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
    case 'not_found':
      errorHandlers.onNotFound(context)
      return
    case 'validation':
      errorHandlers.onValidation(context)
      return
    case 'rate_limited':
      errorHandlers.onRateLimited(context)
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

let getAuthToken: (() => Promise<string | null>) | null = null

/** Register a token provider for the Authorization header (e.g. from MSAL). */
export function configureAuthToken(provider: () => Promise<string | null>) {
  getAuthToken = provider
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken?.()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  response => response,
  (error) => {
    if (!axios.isAxiosError(error))
      return Promise.reject(error)

    const context = classifyError(error)
    handleApiError(context)

    return Promise.reject(error)
  },
)

/** Validate API response data against a valibot schema. */
export function parse<T>(schema: v.GenericSchema<T>, data: unknown): T {
  return v.parse(schema, data)
}

export function parseArray<T>(schema: v.GenericSchema<T>, data: unknown): T[] {
  return v.parse(v.array(schema), data)
}

export default apiClient
