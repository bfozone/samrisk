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
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-background focus:text-foreground focus:rounded-md focus:m-2 focus:shadow-md">
      Skip to content
    </a>
    <SidebarProvider
      :open="sidebarOpen"
      class="overflow-x-hidden"
      :style="{ '--sidebar-width': 'var(--app-sidebar-width)', '--sidebar-width-icon': 'var(--app-sidebar-width-icon)' }"
      @update:open="v => sidebarOpen = v"
    >
      <AppSidebar />
      <SidebarInset class="flex flex-col">
        <AppTopbar />
        <main id="main-content" class="flex-1 overflow-auto p-[var(--app-content-padding)]">
          <ErrorBoundary>
            <router-view />
          </ErrorBoundary>
        </main>
      </SidebarInset>
    </SidebarProvider>
    <Toaster position="top-right" :duration="5000" rich-colors />
  </BackendStatus>
</template>
