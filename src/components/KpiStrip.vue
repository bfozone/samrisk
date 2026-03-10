<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/base/AppIcon.vue'
import QueryError from '@/components/base/QueryError.vue'
import SparkLine from '@/components/base/SparkLine.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface KpiItem {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'flat'
  sparkline?: number[]
  status?: 'ok' | 'warning' | 'critical'
  loading?: boolean
  error?: boolean
  onRetry?: () => void
  to?: string
}

defineProps<{
  items: KpiItem[]
}>()

const trendColor: Record<string, string> = {
  up: 'var(--color-positive)',
  down: 'var(--color-negative)',
  flat: 'var(--color-muted-foreground)',
}
</script>

<template>
  <div class="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 [&>*]:min-w-0">
    <component
      :is="item.to ? RouterLink : 'div'"
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      class="no-underline"
    >
      <Card
        class="gap-0 py-0 overflow-hidden transition-shadow duration-200 hover:shadow-md"
        :class="[
          {
            'border-l-[3px] border-l-positive': item.status === 'ok',
            'border-l-[3px] border-l-warning': item.status === 'warning',
            'border-l-[3px] border-l-destructive': item.status === 'critical',
          },
          item.to && 'cursor-pointer hover:ring-1 hover:ring-ring',
        ]"
      >
        <CardContent class="flex flex-col p-0">
          <Skeleton v-if="item.loading" class="h-14 w-full m-5" />
          <QueryError v-else-if="item.error" class="px-5 py-4" :on-retry="item.onRetry" />
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
    </component>
  </div>
</template>
