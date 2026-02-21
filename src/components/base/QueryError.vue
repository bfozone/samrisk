<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import AppIcon from '@/components/base/AppIcon.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  message?: string
  onRetry?: () => void
}>()
</script>

<template>
  <div class="query-error">
    <AppIcon name="exclamation-circle" :size="24" />
    <span class="query-error-message">{{ message ?? 'Failed to load data' }}</span>
    <Button
      v-if="onRetry"
      variant="outline"
      size="sm"
      @click="onRetry"
    >
      <RefreshCw class="size-3.5" />
      Retry
    </Button>
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
  color: var(--color-text-faint);
}

.query-error svg {
  width: 1.5rem;
  height: 1.5rem;
}

.query-error-message {
  font-size: 0.8125rem;
  font-weight: 500;
}
</style>
