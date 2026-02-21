<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import BackendStatus from '@/components/BackendStatus.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { Toaster } from '@/components/ui/sonner'
import { useAnalyticsSync } from '@/composables/useAnalyticsSync'

useAnalyticsSync()
</script>

<template>
  <BackendStatus>
    <div class="app-layout">
      <AppSidebar />
      <div class="app-main">
        <AppTopbar />
        <main class="app-content">
          <ErrorBoundary>
            <router-view />
          </ErrorBoundary>
        </main>
      </div>
      <Toaster position="top-right" :duration="5000" rich-colors />
    </div>
  </BackendStatus>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-content {
  flex: 1;
  padding: var(--app-content-padding);
  overflow-y: auto;
}
</style>
