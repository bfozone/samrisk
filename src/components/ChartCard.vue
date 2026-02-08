<script setup lang="ts">
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

defineProps<{
  title: string
  option: EChartsOption
  height?: string
  loading?: boolean
}>()
</script>

<template>
  <Card>
    <template #title>{{ title }}</template>
    <template #content>
      <Skeleton v-if="loading" :style="{ height: height || '350px', width: '100%' }" />
      <VChart v-else :option="option" :style="{ height: height || '350px', width: '100%' }" autoresize />
    </template>
  </Card>
</template>
