<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppTopbar from '@/components/AppTopbar.vue'
import Toast from 'primevue/toast'
import { useAnalyticsSync } from '@/composables/useAnalyticsSync'
import { useApiToast } from '@/composables/useApiToast'

useAnalyticsSync()
useApiToast()
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="app-main">
      <AppTopbar />
      <main class="app-content">
        <router-view />
      </main>
    </div>
    <Toast position="top-right" />
  </div>
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
