<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import AppCard from '@/components/base/AppCard.vue'
import QueryError from '@/components/base/QueryError.vue'

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
  <AppCard class="stat-card" compact>
    <template #content>
      <Skeleton v-if="loading" height="3.5rem" width="100%" />
      <QueryError v-else-if="error" :on-retry="onRetry" />
      <template v-else>
        <span class="stat-label">{{ label }}</span>
        <span class="stat-value">{{ value }}</span>
        <span v-if="change" class="stat-change" :class="trend">
          <i v-if="trend === 'up'" class="pi pi-arrow-up" />
          <i v-else-if="trend === 'down'" class="pi pi-arrow-down" />
          {{ change }}
        </span>
      </template>
    </template>
  </AppCard>
</template>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.stat-card :deep(.p-card-content) {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--p-surface-500);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--p-surface-900);
  line-height: 1.2;
}

.stat-change {
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-change i {
  font-size: 0.625rem;
}

.stat-change.up {
  color: var(--app-color-positive, #A5B077);
}

.stat-change.down {
  color: var(--app-color-negative, #ee000c);
}

.stat-change.flat {
  color: var(--p-surface-500);
}
</style>
