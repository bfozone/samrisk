import { useToast } from 'primevue/usetoast'
import { configureApiErrorHandlers } from '@/api/client'

export function useApiToast() {
  const toast = useToast()

  configureApiErrorHandlers({
    onUnauthorized: () => {
      toast.add({ severity: 'warn', summary: 'Session expired', detail: 'Please sign in again', life: 5000 })
    },
    onForbidden: () => {
      toast.add({ severity: 'warn', summary: 'Access denied', detail: 'You do not have permission for this action', life: 5000 })
    },
    onServerError: ({ status }) => {
      toast.add({ severity: 'error', summary: 'Server error', detail: `Something went wrong (${status ?? 'unknown'})`, life: 5000 })
    },
    onNetworkError: () => {
      toast.add({ severity: 'error', summary: 'Network error', detail: 'Unable to reach the server', life: 5000 })
    },
    onUnknownError: ({ status }) => {
      toast.add({ severity: 'error', summary: 'Request failed', detail: `Unexpected error (${status ?? 'unknown'})`, life: 5000 })
    },
  })
}
