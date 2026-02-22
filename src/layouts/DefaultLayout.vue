<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import BackendStatus from '@/components/BackendStatus.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useAnalyticsSync } from '@/composables/useAnalyticsSync'

useAnalyticsSync()

const sidebarOpen = useLocalStorage('samrisk-sidebar-expanded', true)
</script>

<template>
  <BackendStatus>
    <SidebarProvider
      :open="sidebarOpen"
      class="overflow-x-hidden"
      :style="{ '--sidebar-width': '250px', '--sidebar-width-icon': '64px' }"
      @update:open="v => sidebarOpen = v"
    >
      <AppSidebar />
      <SidebarInset class="flex flex-col">
        <AppTopbar />
        <div class="flex-1 overflow-auto p-[var(--app-content-padding)]">
          <ErrorBoundary>
            <router-view />
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
    <Toaster position="top-right" :duration="5000" rich-colors />
  </BackendStatus>
</template>
