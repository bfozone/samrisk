<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
import type { LineChartConfig, PieChartConfig, BarChartConfig, ChartOverrides } from '@/charts'
import { metricTrend, pnlTrend, riskTrend, dualMetric, allocationDonut, liquidityProfile } from '@/charts'
import ChartCard from '@/components/ChartCard.vue'
import { uiComponentDefaults } from '@/ui/config'

type PresetPayload =
  | { preset: 'metricTrend'; config: LineChartConfig }
  | { preset: 'pnlTrend'; config: Omit<LineChartConfig, 'zeroLine'> }
  | { preset: 'riskTrend'; config: LineChartConfig }
  | { preset: 'dualMetric'; config: LineChartConfig }
  | { preset: 'allocationDonut'; config: PieChartConfig }
  | { preset: 'liquidityProfile'; config: Omit<BarChartConfig, 'horizontal'> }

const props = defineProps<{
  title: string
  loading?: boolean
  height?: string
  size?: 'sm' | 'default' | 'lg'
  overrides?: ChartOverrides
} & PresetPayload>()

const option = computed<EChartsOption>(() => {
  switch (props.preset) {
    case 'metricTrend':
      return metricTrend(props.config, props.overrides)
    case 'pnlTrend':
      return pnlTrend(props.config, props.overrides)
    case 'riskTrend':
      return riskTrend(props.config, props.overrides)
    case 'dualMetric':
      return dualMetric(props.config, props.overrides)
    case 'allocationDonut':
      return allocationDonut(props.config, props.overrides)
    case 'liquidityProfile':
      return liquidityProfile(props.config, props.overrides)
  }
})

const resolvedSize = computed(() => props.size ?? uiComponentDefaults.chartCard.size)
</script>

<template>
  <ChartCard
    :title="title"
    :option="option"
    :loading="loading"
    :height="height"
    :size="resolvedSize"
  />
</template>
