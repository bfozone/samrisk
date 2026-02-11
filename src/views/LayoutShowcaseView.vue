<script setup lang="ts">
import ShowcaseLayout from '@/components/ShowcaseLayout.vue'
import DashboardGrid from '@/components/DashboardGrid.vue'
import AppCard from '@/components/base/AppCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import { gaugeChart } from '@/charts'
import { uiColorPresets } from '@/ui/config'

const gaugeOption = gaugeChart({
  value: 73,
  name: 'VaR Limit',
  thresholds: uiColorPresets.gaugeThresholds,
})
</script>

<template>
  <ShowcaseLayout>
    <!-- Grid Columns -->
    <h3 class="section-title">Grid Columns</h3>

    <DashboardGrid :columns="4" gap="md">
      <AppCard v-for="n in 4" :key="n"><template #content><span class="placeholder-label">columns=4 gap=md</span></template></AppCard>
    </DashboardGrid>

    <DashboardGrid :columns="3">
      <AppCard v-for="n in 3" :key="n"><template #content><span class="placeholder-label">columns=3</span></template></AppCard>
    </DashboardGrid>

    <DashboardGrid>
      <AppCard v-for="n in 2" :key="n"><template #content><span class="placeholder-label">columns=2 (default)</span></template></AppCard>
    </DashboardGrid>

    <!-- Card Sizes -->
    <h3 class="section-title">Card Sizes</h3>

    <DashboardGrid :columns="3">
      <ChartCard title="Small (220px)" :option="gaugeOption" size="sm" />
      <ChartCard title="Default (350px)" :option="gaugeOption" />
      <ChartCard title="Large (480px)" :option="gaugeOption" size="lg" />
    </DashboardGrid>
  </ShowcaseLayout>
</template>

<style scoped>
.section-title {
  margin-bottom: var(--app-space-md);
}

.placeholder-label {
  font-size: 0.875rem;
  color: var(--p-surface-500);
}
</style>
