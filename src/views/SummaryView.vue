<script setup lang="ts">
import { computed } from 'vue'
import { useAnalyticsContext } from '@/stores/analytics'
import ChartCard from '@/components/ChartCard.vue'
import { useVaR, useExposures } from '@/composables/useRisk'
import { chartColors } from '@/theme/preset'
import type { EChartsOption } from 'echarts'

const analytics = useAnalyticsContext()

const portfolioId = computed(() => analytics.portfolioId ?? '')

const { data: varData, isLoading: varLoading } = useVaR(portfolioId)
const { data: exposureData, isLoading: exposureLoading } = useExposures(portfolioId)

const varChartOption = computed<EChartsOption>(() => {
  const items = varData.value ?? []
  return {
    color: [chartColors.red, chartColors.info],
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: items.map((d) => d.date),
    },
    yAxis: { type: 'value', name: 'VaR (%)' },
    series: [
      {
        name: 'VaR 95%',
        type: 'line',
        data: items.map((d) => d.var95),
        smooth: true,
      },
      {
        name: 'VaR 99%',
        type: 'line',
        data: items.map((d) => d.var99),
        smooth: true,
      },
    ],
  }
})

const exposureChartOption = computed<EChartsOption>(() => {
  const items = exposureData.value ?? []
  return {
    color: chartColors.series,
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: items.map((d) => ({ value: d.percentage, name: d.category })),
      },
    ],
  }
})
</script>

<template>
  <div class="dashboard">
    <template v-if="analytics.hasPortfolio">
      <div class="dashboard-grid">
        <ChartCard title="Value at Risk" :option="varChartOption" :loading="varLoading" />
        <ChartCard title="Asset Allocation" :option="exposureChartOption" :loading="exposureLoading" />
      </div>
    </template>
    <div v-else class="analytics-empty-state">
      <i class="pi pi-briefcase" />
      <p>Select a portfolio from the topbar to view summary analytics</p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: var(--app-space-lg);
}
</style>
