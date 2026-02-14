import { useLocalStorage, useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarExpanded = useLocalStorage('samrisk-sidebar-expanded', true)
  const mobileOpen = ref(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const sidebarCollapsed = computed(() => !sidebarExpanded.value)

  function toggleSidebar() {
    if (isMobile.value) {
      mobileOpen.value = !mobileOpen.value
    }
    else {
      sidebarExpanded.value = !sidebarExpanded.value
    }
  }

  function closeMobile() {
    mobileOpen.value = false
  }

  return { sidebarExpanded, sidebarCollapsed, mobileOpen, isMobile, toggleSidebar, closeMobile }
})
