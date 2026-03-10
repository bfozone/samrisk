<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import { usePortfolios } from '@/composables/usePortfolios'
import { useAnalyticsContext } from '@/stores/analytics'

withDefaults(defineProps<{
  icon?: string
  emptyLabel?: string
  hideHeader?: boolean
}>(), {
  icon: 'briefcase',
  emptyLabel: 'Select a portfolio from the topbar',
})

const analytics = useAnalyticsContext()
const { data: portfolios } = usePortfolios()

const selectedPortfolio = computed(() =>
  portfolios.value?.find(p => p.id === analytics.portfolioId),
)

const portfolioName = computed(() => selectedPortfolio.value?.name)

const benchmarkName = computed(() => selectedPortfolio.value?.benchmarkName)

const asOfLabel = computed(() => {
  const d = analytics.asOfDate
  if (!d)
    return null
  const date = new Date(`${d}T00:00:00`)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
})
</script>

<template>
  <div class="space-y-4">
    <template v-if="analytics.hasPortfolio">
      <div v-if="!hideHeader && (portfolioName || asOfLabel)" class="flex items-baseline gap-2">
        <span v-if="portfolioName" class="text-sm font-medium text-foreground">{{ portfolioName }}</span>
        <template v-if="benchmarkName">
          <span class="text-xs text-muted-foreground">vs</span>
          <span class="text-xs text-muted-foreground">{{ benchmarkName }}</span>
        </template>
        <span v-if="asOfLabel" class="text-xs text-muted-foreground">as of {{ asOfLabel }}</span>
      </div>
      <div v-if="$slots.alerts" class="space-y-2">
        <slot name="alerts"></slot>
      </div>
      <slot></slot>
    </template>
    <div v-else class="analytics-empty-state">
      <AppIcon :name="icon" :size="40" />
      <p>{{ emptyLabel }}</p>
    </div>
  </div>
</template>
