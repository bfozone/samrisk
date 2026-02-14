<script setup lang="ts">
import { usePortfolios } from '@/composables/usePortfolios'
import AppButton from '@/components/base/AppButton.vue'

const { isError, refetch, isLoading } = usePortfolios()
</script>

<template>
  <div v-if="isError" class="backend-status">
    <div class="backend-status-content">
      <i class="pi pi-cloud-off backend-status-icon"></i>
      <h2 class="backend-status-title">Unable to connect</h2>
      <p class="backend-status-detail">The server is not reachable. Please check your connection and try again.</p>
      <AppButton label="Retry" icon="pi pi-refresh" @click="refetch()" />
    </div>
  </div>
  <slot v-else-if="!isLoading" />
  <div v-else class="backend-status">
    <div class="backend-status-content">
      <i class="pi pi-spin pi-spinner backend-status-icon"></i>
    </div>
  </div>
</template>

<style scoped>
.backend-status {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

.backend-status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 2rem;
}

.backend-status-icon {
  font-size: 3rem;
  color: var(--p-surface-400);
}

.backend-status-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--p-surface-700);
}

.backend-status-detail {
  font-size: 0.875rem;
  margin: 0;
  color: var(--p-surface-500);
  max-width: 360px;
}
</style>
