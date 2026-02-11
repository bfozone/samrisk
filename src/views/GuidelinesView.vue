<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
</script>

<template>
  <div class="guidelines">
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">Investment controlling and compliance</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-check-square" />
      <p>Select a portfolio from the topbar to view guidelines</p>
    </div>
  </div>
</template>
