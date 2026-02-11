<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="esg">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">ESG scores, carbon footprint and sustainability metrics</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-globe" />
      <p>Select a portfolio from the topbar to view ESG analytics</p>
    </div>
  </div>
</template>
