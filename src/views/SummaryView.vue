<script setup lang="ts">
import { computed } from 'vue'
import AlertBanner from '@/components/AlertBanner.vue'
import AnalyticsView from '@/components/AnalyticsView.vue'
import PresetChartCard from '@/components/charts/PresetChartCard.vue'
import StatCard from '@/components/StatCard.vue'
import { useSummaryMetrics } from './summary/useSummaryMetrics'

const { statCards, chartRows, latestVar95 } = useSummaryMetrics()

const varAlert = computed(() => {
  if (latestVar95.value === null || latestVar95.value <= 5)
    return null
  return {
    title: 'VaR Threshold Exceeded',
    message: `VaR 95% is at ${latestVar95.value.toFixed(2)}%, exceeding the 5% threshold.`,
  }
})
</script>

<template>
  <AnalyticsView empty-label="Select a portfolio from the topbar to view summary analytics">
    <template v-if="varAlert" #alerts>
      <AlertBanner
        :title="varAlert.title"
        :message="varAlert.message"
        variant="destructive"
      />
    </template>
    <div class="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 [&>*]:min-w-0">
      <StatCard v-for="s in statCards" :key="s.label" v-bind="s" />
    </div>
    <div
      v-for="row in chartRows"
      :key="row.map(c => c.title).join('-')"
      class="grid grid-cols-2 max-md:grid-cols-1 gap-6 [&>*]:min-w-0"
    >
      <PresetChartCard v-for="c in row" :key="c.title" v-bind="c" />
    </div>
  </AnalyticsView>
</template>
