<script setup lang="ts">
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
  <Card class="gap-0 py-0">
    <CardContent class="grid p-0" :style="{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }">
      <div
        v-for="(item, i) in items"
        :key="item.label"
        class="flex items-end justify-between gap-4 px-5 py-4"
        :class="{
          'border-l border-border dark:border-white/5': i > 0,
          'border-l-[3px] border-l-positive': item.status === 'ok',
          'border-l-[3px] border-l-warning': item.status === 'warning',
          'border-l-[3px] border-l-destructive': item.status === 'critical',
        }"
      >
        <Skeleton v-if="item.loading" class="h-14 w-full" />
        <QueryError v-else-if="item.error" :on-retry="item.onRetry" />
        <template v-else>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ item.label }}</span>
            <span class="text-2xl font-bold leading-tight text-foreground">{{ item.value }}</span>
            <span
              v-if="item.change"
              class="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
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
          <SparkLine
            v-if="item.sparkline?.length"
            :data="item.sparkline"
            :color="trendColor[item.trend ?? 'flat']"
          />
        </template>
      </div>
    </CardContent>
  </Card>
</template>
