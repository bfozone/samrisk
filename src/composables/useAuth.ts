import { useQuery } from '@tanstack/vue-query'
import { getCurrentUser } from '@/api/auth'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  })
}
