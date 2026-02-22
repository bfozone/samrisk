<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '@/components/base/AppIcon.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { useCurrentUser } from '@/composables/useAuth'
import { useNavItems } from '@/composables/useNavItems'
import { useTheme } from '@/composables/useTheme'
import { useAnalyticsContext } from '@/stores/analytics'

const { isDark, toggle: toggleTheme } = useTheme()
const { isMobile, setOpenMobile } = useSidebar()
const analytics = useAnalyticsContext()
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()
const { navItems, navGroups } = useNavItems()

const env = import.meta.env.MODE === 'production' ? 'PROD' : 'DEV'

function isActive(to: string) {
  if (route.path === to)
    return true
  if (!route.path.startsWith(`${to}/`))
    return false
  return !navItems.value.some(item => item.to !== to && item.to.length > to.length
    && (route.path === item.to || route.path.startsWith(`${item.to}/`)))
}

function navigate(to: string) {
  const resolved = router.resolve(to)
  if (resolved.meta.analyticsRoute && analytics.portfolioId) {
    router.push({
      name: resolved.name!,
      params: { portfolioId: analytics.portfolioId },
      query: { ...route.query },
    })
  }
  else {
    router.push(to)
  }
  if (isMobile.value)
    setOpenMobile(false)
}
</script>

<template>
  <Sidebar collapsible="icon" class="border-r-0">
    <!-- Header: logo + env tag -->
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip="SAMRisk"
            class="sidebar-logo"
            @click="navigate('/')"
          >
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(238,0,12,0.15)]">
              <img src="/logo-light.svg" alt="" class="size-5 brightness-0 invert" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-lg font-bold tracking-tight text-white">SAMRisk</span>
              <span
                class="shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold leading-[1.4] tracking-wide"
                :class="env === 'DEV'
                  ? 'bg-[rgba(238,0,12,0.15)] text-accent-brand'
                  : 'bg-[rgba(112,164,20,0.15)] text-[#9ec436]'"
              >{{ env }}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <!-- Navigation groups -->
    <SidebarContent>
      <SidebarGroup v-for="group in navGroups" :key="group.label">
        <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.to">
              <SidebarMenuButton
                :is-active="isActive(item.to)"
                :tooltip="item.label"
                @click="navigate(item.to)"
              >
                <AppIcon :name="item.icon" :size="18" :class="isActive(item.to) && 'text-accent-brand'" />
                <span>{{ item.label }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <!-- Footer: theme toggle + user -->
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            :tooltip="isDark ? 'Light mode' : 'Dark mode'"
            @click="toggleTheme"
          >
            <AppIcon :name="isDark ? 'sun' : 'moon'" :size="18" />
            <span>{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarSeparator />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="cursor-default" tooltip="User profile">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-active text-sidebar-text text-[0.6875rem] font-semibold tracking-[0.02em]">
              {{ user?.initials ?? '?' }}
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="truncate text-[0.8125rem] font-semibold text-white leading-tight">
                {{ user?.name ?? 'Unidentified User' }}
              </span>
              <span class="truncate text-[0.6875rem] text-sidebar-foreground/70 leading-tight">
                {{ user?.role ?? 'No session' }}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
