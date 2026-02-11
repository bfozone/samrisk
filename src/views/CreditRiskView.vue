<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="credit-risk">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">Counterparty exposure, credit ratings and concentration</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-building-columns" />
      <p>Select a portfolio from the topbar to view credit risk metrics</p>
    </div>
  </div>
</template>
