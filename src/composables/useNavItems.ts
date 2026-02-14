import { computed } from 'vue'
import { useRouter } from 'vue-router'

export interface NavItem {
  label: string
  icon: string
  to: string
  section?: string
}

export function useNavItems() {
  const router = useRouter()

  const navItems = computed<NavItem[]>(() =>
    router.getRoutes()
      .filter(r => r.meta.sidebar)
      .sort((a, b) => a.meta.sidebar!.order - b.meta.sidebar!.order)
      .map(r => ({
        label: r.meta.title ?? '',
        icon: r.meta.sidebar!.icon,
        to: r.path.replace(/\/:\w+\?$/, ''),
        section: r.meta.sidebar!.section,
      })),
  )

  return { navItems }
}
