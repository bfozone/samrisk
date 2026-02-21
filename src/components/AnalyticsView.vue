<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import { useAnalyticsContext } from '@/stores/analytics'

withDefaults(defineProps<{
  icon?: string
  emptyLabel?: string
}>(), {
  icon: 'briefcase',
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
      <AppIcon :name="icon" :size="40" />
      <p>{{ emptyLabel }}</p>
    </div>
  </div>
</template>
