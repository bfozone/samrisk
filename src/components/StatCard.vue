<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import QueryError from '@/components/base/QueryError.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'flat'
  loading?: boolean
  error?: boolean
  onRetry?: () => void
}>()
</script>

<template>
  <Card class="stat-card">
    <CardContent class="stat-content">
      <Skeleton v-if="loading" class="h-14 w-full" />
      <QueryError v-else-if="error" :on-retry="onRetry" />
      <template v-else>
        <span class="stat-label">{{ label }}</span>
        <span class="stat-value">{{ value }}</span>
        <span v-if="change" class="stat-change" :class="trend">
          <AppIcon v-if="trend === 'up'" name="arrow-up" :size="10" />
          <AppIcon v-else-if="trend === 'down'" name="arrow-down" :size="10" />
          {{ change }}
        </span>
      </template>
    </CardContent>
  </Card>
</template>

<style scoped>
.stat-card {
  gap: 0;
  padding: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem !important;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-foreground);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1.2;
}

.stat-change {
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-change svg {
  width: 0.625rem;
  height: 0.625rem;
}

.stat-change.up {
  color: var(--color-positive);
}

.stat-change.down {
  color: var(--color-negative);
}

.stat-change.flat {
  color: var(--muted-foreground);
}
</style>
