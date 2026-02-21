<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onErrorCaptured, ref } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import { Button } from '@/components/ui/button'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : 'An unexpected error occurred'
  return false
})

function retry() {
  hasError.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary-content">
      <AppIcon name="exclamation-triangle" :size="40" class="error-boundary-icon" />
      <h2 class="error-boundary-title">
        Something went wrong
      </h2>
      <p class="error-boundary-detail">
        {{ errorMessage }}
      </p>
      <Button @click="retry">
        <RefreshCw class="size-4" />
        Retry
      </Button>
    </div>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
}

.error-boundary-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 2rem;
}

.error-boundary-icon {
  color: var(--color-text-faint);
}

.error-boundary-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-secondary);
}

.error-boundary-detail {
  font-size: 0.875rem;
  margin: 0;
  color: var(--muted-foreground);
  max-width: 360px;
}
</style>
