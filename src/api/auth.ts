import apiClient, { parse } from './client'
import { UserSchema } from './schemas'

export interface AuthQueryOptions {
  signal?: AbortSignal
}

export async function getCurrentUser(options?: AuthQueryOptions) {
  const data = await apiClient.get('auth/me', { signal: options?.signal }).json()
  return parse(UserSchema, data)
}
