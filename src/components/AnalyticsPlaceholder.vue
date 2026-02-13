<script setup lang="ts">
import { useAnalyticsContext } from '@/stores/analytics'

defineProps<{
  icon: string
  hint: string
  emptyLabel: string
}>()

const analytics = useAnalyticsContext()
</script>

<template>
  <div>
    <template v-if="analytics.hasPortfolio">
      <p class="placeholder-hint">{{ hint }}</p>
    </template>
    <div v-else class="analytics-empty-state">
      <i :class="icon"></i>
      <p>{{ emptyLabel }}</p>
    </div>
  </div>
</template>
