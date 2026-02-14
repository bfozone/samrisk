<script setup lang="ts">
import { useRoute } from 'vue-router'
import AnalyticsPlaceholder from '@/components/AnalyticsPlaceholder.vue'

const route = useRoute()
</script>

<template>
  <AnalyticsPlaceholder
    :icon="(route.meta.icon as string) ?? 'pi pi-box'"
    :hint="(route.meta.hint as string) ?? ''"
    :empty-label="(route.meta.emptyLabel as string) ?? 'Select a portfolio from the topbar'"
  />
</template>
