<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="market-risk">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">VaR, stress testing and factor decomposition</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-shield" />
      <p>Select a portfolio from the topbar to view market risk metrics</p>
    </div>
  </div>
</template>
