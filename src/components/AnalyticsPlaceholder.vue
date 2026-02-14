<script setup lang="ts">
import AnalyticsView from '@/components/AnalyticsView.vue'

defineProps<{
  icon: string
  hint: string
  emptyLabel: string
}>()
</script>

<template>
  <AnalyticsView :icon="icon" :empty-label="emptyLabel">
    <p class="placeholder-hint">{{ hint }}</p>
  </AnalyticsView>
</template>
