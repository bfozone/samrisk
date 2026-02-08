<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import Button from 'primevue/button'

const appStore = useAppStore()
</script>

<template>
  <header class="app-topbar">
    <div class="topbar-left">
      <Button
        :icon="appStore.isMobile ? 'pi pi-bars' : (appStore.sidebarExpanded ? 'pi pi-chevron-left' : 'pi pi-chevron-right')"
        text
        rounded
        severity="secondary"
        @click="appStore.toggleSidebar()"
        class="topbar-toggle"
      />
      <span v-if="appStore.isMobile" class="topbar-title">RiskCog</span>
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--app-space-sm) var(--app-space-md);
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
  position: sticky;
  top: 0;
  z-index: 30;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.topbar-toggle {
  color: var(--p-surface-600);
}

.topbar-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--p-surface-900);
}
</style>
