<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="risk">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">Market, liquidity and counterparty risk</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-shield" />
      <p>Select a portfolio from the topbar to view risk metrics</p>
    </div>
  </div>
</template>

<style scoped>
.placeholder-hint {
  color: var(--p-surface-400);
  font-size: 0.875rem;
}
</style>
