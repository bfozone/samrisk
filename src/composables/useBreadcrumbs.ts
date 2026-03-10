import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface BreadcrumbEntry {
  label: string
}

export function useBreadcrumbs() {
  const route = useRoute()

  const items = computed<BreadcrumbEntry[]>(() => {
    const entries: BreadcrumbEntry[] = []
    const section = route.meta.sidebar?.section
    const title = route.meta.title as string | undefined

    if (section) {
      entries.push({ label: section })
    }
    if (title) {
      entries.push({ label: title })
    }

    return entries
  })

  return { items }
}
