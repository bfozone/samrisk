<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

withDefaults(defineProps<{
  icon?: string
  emptyLabel?: string
}>(), {
  icon: 'pi pi-briefcase',
  emptyLabel: 'Select a portfolio from the topbar',
})

const analytics = useAnalyticsContext()
</script>

<template>
  <div>
    <template v-if="analytics.hasPortfolio">
      <slot></slot>
    </template>
    <div v-else class="analytics-empty-state">
      <i :class="icon"></i>
      <p>{{ emptyLabel }}</p>
    </div>
  </div>
</template>
