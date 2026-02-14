<script setup lang="ts">
import AnalyticsView from '@/components/AnalyticsView.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import StatCard from '@/components/StatCard.vue'
import PresetChartCard from '@/components/charts/PresetChartCard.vue'
import { useSummaryMetrics } from './summary/useSummaryMetrics'

const { statCards, chartRows } = useSummaryMetrics()
</script>

<template>
  <AnalyticsView empty-label="Select a portfolio from the topbar to view summary analytics">
    <DashboardGrid :columns="4" gap="md">
      <StatCard v-for="s in statCards" :key="s.label" v-bind="s" />
    </DashboardGrid>
    <DashboardGrid v-for="(row, i) in chartRows" :key="i">
      <PresetChartCard v-for="c in row" :key="c.title" v-bind="c" />
    </DashboardGrid>
  </AnalyticsView>
</template>
