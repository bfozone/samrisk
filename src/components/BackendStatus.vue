<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import AppIcon from '@/components/base/AppIcon.vue'
import { Button } from '@/components/ui/button'
import { usePortfolios } from '@/composables/usePortfolios'

const { isError, refetch, isLoading } = usePortfolios()
</script>

<template>
  <div v-if="isError" class="backend-status">
    <div class="backend-status-content">
      <AppIcon name="cloud-off" :size="48" class="backend-status-icon" />
      <h2 class="backend-status-title">
        Unable to connect
      </h2>
      <p class="backend-status-detail">
        The server is not reachable. Please check your connection and try again.
      </p>
      <Button @click="refetch()">
        <RefreshCw class="size-4" />
        Retry
      </Button>
    </div>
  </div>
  <slot v-else-if="!isLoading"></slot>
  <div v-else class="backend-status">
    <div class="backend-status-content">
      <AppIcon name="spinner" :size="48" class="backend-status-icon animate-spin" />
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
  color: var(--color-text-faint);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

.backend-status-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-secondary);
}

.backend-status-detail {
  font-size: 0.875rem;
  margin: 0;
  color: var(--muted-foreground);
  max-width: 360px;
}
</style>
