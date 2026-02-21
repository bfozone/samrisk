<script setup lang="ts">
import AppIcon from '@/components/base/AppIcon.vue'
import { Card, CardContent } from '@/components/ui/card'

defineProps<{
  severity: 'error' | 'warn' | 'success' | 'info'
  title?: string
}>()

const icons: Record<string, string> = {
  error: 'times-circle',
  warn: 'exclamation-triangle',
  success: 'check-circle',
  info: 'info-circle',
}
</script>

<template>
  <Card class="info-card" :class="`info-card-${severity}`">
    <CardContent class="info-card-content">
      <div class="info-card-header">
        <AppIcon :name="icons[severity]!" :size="18" />
        <span v-if="title" class="info-card-title">{{ title }}</span>
      </div>
      <div v-if="$slots.default" class="info-card-body">
        <slot></slot>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.info-card {
  border-left: 3px solid transparent;
  gap: 0;
  padding: 0;
}

.info-card-content {
  padding: 1rem !important;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card-header svg {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.info-card-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.info-card-body {
  margin-top: 0.375rem;
  padding-left: 1.625rem;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.info-card-error {
  border-left-color: var(--color-negative);
}
.info-card-error .info-card-header {
  color: var(--color-negative);
}

.info-card-warn {
  border-left-color: var(--color-warning);
}
.info-card-warn .info-card-header {
  color: var(--color-warning);
}

.info-card-success {
  border-left-color: var(--color-positive);
}
.info-card-success .info-card-header {
  color: var(--color-positive);
}

.info-card-info {
  border-left-color: var(--color-info);
}
.info-card-info .info-card-header {
  color: var(--color-info);
}
</style>
