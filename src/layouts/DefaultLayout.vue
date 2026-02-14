<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import BackendStatus from '@/components/BackendStatus.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useAnalyticsSync } from '@/composables/useAnalyticsSync'
import { setToastRef } from '@/utils/toastRef'

useAnalyticsSync()
setToastRef(useToast())
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
      <Toast position="top-right" />
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
