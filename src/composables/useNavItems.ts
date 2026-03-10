import { computed } from 'vue'
import { useRouter } from 'vue-router'

const paramSuffix = /\/:\w+\?$/

export interface NavItem {
  label: string
  icon: string
  to: string
  section?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export function useNavItems() {
  const router = useRouter()

  const navItems = computed<NavItem[]>(() =>
    router
      .getRoutes()
      .filter(r => r.meta.sidebar)
      .sort((a, b) => a.meta.sidebar!.order - b.meta.sidebar!.order)
      .map(r => ({
        label: r.meta.title ?? '',
        icon: r.meta.sidebar!.icon,
        to: r.path.replace(paramSuffix, ''),
        section: r.meta.sidebar!.section,
      })),
  )

  const navGroups = computed<NavGroup[]>(() => {
    const groups: NavGroup[] = []
    let current: NavGroup | null = null

    for (const item of navItems.value) {
      if (item.section) {
        current = { label: item.section, items: [] }
        groups.push(current)
      }
      if (current) {
        current.items.push(item)
      }
    }

    return groups
  })

  return { navItems, navGroups }
}
