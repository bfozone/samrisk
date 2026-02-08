<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="performance">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">Investment performance analysis</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-chart-line" />
      <p>Select a portfolio from the topbar to view performance</p>
    </div>
  </div>
</template>

<style scoped>
.placeholder-hint {
  color: var(--p-surface-400);
  font-size: 0.875rem;
}
</style>
