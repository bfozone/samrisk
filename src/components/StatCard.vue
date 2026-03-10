<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import QueryError from '@/components/base/QueryError.vue'
import SparkLine from '@/components/base/SparkLine.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'flat'
  sparkline?: number[]
  status?: 'ok' | 'warning' | 'critical'
  loading?: boolean
  error?: boolean
  onRetry?: () => void
}>()

const trendColor: Record<string, string> = {
  up: 'var(--color-positive)',
  down: 'var(--color-negative)',
  flat: 'var(--color-muted-foreground)',
}
</script>

<template>
  <Card
    class="gap-0 py-0 transition-shadow duration-200 hover:shadow-md"
    :class="{
      'border-l-[3px] border-l-positive': props.status === 'ok',
      'border-l-[3px] border-l-warning': props.status === 'warning',
      'border-l-[3px] border-l-destructive': props.status === 'critical',
    }"
  >
    <CardContent class="flex items-end justify-between gap-4 p-5">
      <Skeleton v-if="loading" class="h-14 w-full" />
      <QueryError v-else-if="error" :on-retry="onRetry" />
      <template v-else>
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ label }}</span>
          <span class="text-2xl font-bold leading-tight text-foreground">{{ value }}</span>
          <span
            v-if="change"
            class="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="{
              'bg-positive/10 text-positive': trend === 'up',
              'bg-negative/10 text-negative': trend === 'down',
              'bg-muted text-muted-foreground': trend === 'flat',
            }"
          >
            <AppIcon v-if="trend === 'up'" name="arrow-up" :size="10" />
            <AppIcon v-else-if="trend === 'down'" name="arrow-down" :size="10" />
            {{ change }}
          </span>
        </div>
        <SparkLine
          v-if="sparkline?.length"
          :data="sparkline"
          :color="trendColor[trend ?? 'flat']"
        />
      </template>
    </CardContent>
  </Card>
</template>
