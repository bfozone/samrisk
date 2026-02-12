<script setup lang="ts">
import AppCard from '@/components/base/AppCard.vue'

defineProps<{
  severity: 'error' | 'warn' | 'success' | 'info'
  title?: string
}>()

const icons: Record<string, string> = {
  error: 'pi pi-times-circle',
  warn: 'pi pi-exclamation-triangle',
  success: 'pi pi-check-circle',
  info: 'pi pi-info-circle',
}
</script>

<template>
  <AppCard class="info-card" :class="`info-card-${severity}`" compact>
    <template #content>
      <div class="info-card-header">
        <i :class="icons[severity]" />
        <span v-if="title" class="info-card-title">{{ title }}</span>
      </div>
      <div v-if="$slots.default" class="info-card-body">
        <slot />
      </div>
    </template>
  </AppCard>
</template>

<style scoped>
.info-card {
  border-left: 3px solid transparent;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card-header i {
  font-size: 1.125rem;
}

.info-card-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.info-card-body {
  margin-top: 0.375rem;
  padding-left: 1.625rem;
  font-size: 0.8125rem;
  color: var(--p-surface-600);
  line-height: 1.5;
}

.info-card-error {
  border-left-color: var(--app-color-negative, #ee000c);
}
.info-card-error .info-card-header {
  color: var(--app-color-negative, #ee000c);
}

.info-card-warn {
  border-left-color: var(--app-color-warning, #EAA159);
}
.info-card-warn .info-card-header {
  color: var(--app-color-warning, #EAA159);
}

.info-card-success {
  border-left-color: var(--app-color-positive, #A5B077);
}
.info-card-success .info-card-header {
  color: var(--app-color-positive, #A5B077);
}

.info-card-info {
  border-left-color: var(--app-color-info, #61828E);
}
.info-card-info .info-card-header {
  color: var(--app-color-info, #61828E);
}
</style>
