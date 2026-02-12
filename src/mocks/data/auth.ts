import { http, HttpResponse } from 'msw'
import type { User } from '@/types'

const currentUser: User = {
  id: '1',
  name: 'Benjamin Fink',
  initials: 'BF',
  role: 'Head Investment Performance & Risk Controlling',
}

export const authHandlers = [
  http.get('/api/auth/me', () => HttpResponse.json(currentUser)),
]
