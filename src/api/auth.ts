import apiClient, { parse } from './client'
import { UserSchema } from './schemas'

export async function getCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return parse(UserSchema, data)
}
