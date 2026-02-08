<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChartCard from '@/components/ChartCard.vue'
import { usePortfolios } from '@/composables/usePortfolios'
import { useVaR, useExposures } from '@/composables/useRisk'
import { chartColors } from '@/theme/preset'
import type { EChartsOption } from 'echarts'

const route = useRoute()
const { data: portfolios } = usePortfolios()

const portfolioId = computed(
  () => (route.params.portfolioId as string) || portfolios.value?.[0]?.id || '',
)

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
    <h1>Dashboard</h1>
    <div class="dashboard-grid">
      <ChartCard title="Value at Risk" :option="varChartOption" :loading="varLoading" />
      <ChartCard title="Asset Allocation" :option="exposureChartOption" :loading="exposureLoading" />
    </div>
  </div>
</template>

<style scoped>
.dashboard h1 {
  margin-bottom: var(--app-space-lg);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: var(--app-space-lg);
}
</style>
