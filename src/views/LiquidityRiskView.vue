<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="liquidity-risk">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">Time-to-liquidation, bid-ask analysis and liquidity stress</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-wave-pulse" />
      <p>Select a portfolio from the topbar to view liquidity risk metrics</p>
    </div>
  </div>
</template>
