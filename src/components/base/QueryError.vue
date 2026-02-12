<script setup lang="ts">
import AppButton from '@/components/base/AppButton.vue'

defineProps<{
  message?: string
  onRetry?: () => void
}>()
</script>

<template>
  <div class="query-error">
    <i class="pi pi-exclamation-circle" />
    <span class="query-error-message">{{ message ?? 'Failed to load data' }}</span>
    <AppButton
      v-if="onRetry"
      label="Retry"
      icon="pi pi-refresh"
      severity="secondary"
      size="small"
      @click="onRetry"
    />
  </div>
</template>

<style scoped>
.query-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  color: var(--p-surface-400);
}

.query-error i {
  font-size: 1.5rem;
}

.query-error-message {
  font-size: 0.8125rem;
  font-weight: 500;
}
</style>
