<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AlertBanner from '@/components/AlertBanner.vue'
import AnalyticsView from '@/components/AnalyticsView.vue'
import AllocationBar from '@/components/base/AllocationBar.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import SparkLine from '@/components/base/SparkLine.vue'
import PortfolioIdentityCard from '@/components/PortfolioIdentityCard.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalyticsContext } from '@/stores/analytics'
import { useSummaryMetrics } from './summary/useSummaryMetrics'

const analytics = useAnalyticsContext()
const { portfolio, isLoading, exposures, statCards, latestVar95 } = useSummaryMetrics()

const varAlert = computed(() => {
  if (latestVar95.value === null || latestVar95.value <= 5)
    return null
  return {
    title: 'VaR Threshold Exceeded',
    message: `VaR 95% is at ${latestVar95.value.toFixed(2)}%, exceeding the 5% threshold.`,
  }
})

const trendColor: Record<string, string> = {
  up: 'var(--color-positive)',
  down: 'var(--color-negative)',
  flat: 'var(--color-muted-foreground)',
}
</script>

<template>
  <AnalyticsView hide-header empty-label="Select a portfolio to view the fact sheet">
    <template v-if="varAlert" #alerts>
      <AlertBanner
        :title="varAlert.title"
        :message="varAlert.message"
        variant="destructive"
      />
    </template>

    <PortfolioIdentityCard
      v-if="portfolio"
      :name="portfolio.name"
      :manager="portfolio.manager"
      :benchmark-name="portfolio.benchmarkName"
      :currency="portfolio.currency"
      :inception-date="portfolio.inceptionDate"
      :nav-total="portfolio.navTotal"
      :as-of-date="analytics.asOfDate"
    />

    <div class="grid grid-cols-6 max-xl:grid-cols-3 max-md:grid-cols-2 gap-4 [&>*]:min-w-0">
      <Card class="gap-0 py-0 overflow-hidden">
        <CardContent class="flex flex-col gap-1.5 px-5 py-4">
          <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Allocation</span>
          <AllocationBar :data="exposures" :loading="isLoading" />
        </CardContent>
      </Card>

      <RouterLink
        v-for="item in statCards"
        :key="item.label"
        :to="item.to"
        class="no-underline"
      >
        <Card
          class="gap-0 py-0 overflow-hidden transition-shadow duration-200 hover:shadow-md cursor-pointer hover:ring-1 hover:ring-ring h-full"
          :class="{
            'border-l-[3px] border-l-positive': item.status === 'ok',
            'border-l-[3px] border-l-warning': item.status === 'warning',
            'border-l-[3px] border-l-destructive': item.status === 'critical',
          }"
        >
          <CardContent class="flex flex-col p-0">
            <Skeleton v-if="item.loading" class="h-14 w-full m-5" />
            <template v-else>
              <div class="flex flex-col gap-1.5 px-5 pt-4 pb-2">
                <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ item.label }}</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold leading-tight text-foreground">{{ item.value }}</span>
                  <span
                    v-if="item.change"
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                    :class="{
                      'bg-positive/10 text-positive': item.trend === 'up',
                      'bg-negative/10 text-negative': item.trend === 'down',
                      'bg-muted text-muted-foreground': item.trend === 'flat',
                    }"
                  >
                    <AppIcon v-if="item.trend === 'up'" name="arrow-up" :size="10" />
                    <AppIcon v-else-if="item.trend === 'down'" name="arrow-down" :size="10" />
                    {{ item.change }}
                  </span>
                </div>
              </div>
              <SparkLine
                v-if="item.sparkline?.length"
                :data="item.sparkline"
                :color="trendColor[item.trend ?? 'flat']"
                :width="200"
                :height="28"
                class="w-full"
              />
            </template>
          </CardContent>
        </Card>
      </RouterLink>
    </div>
  </AnalyticsView>
</template>
