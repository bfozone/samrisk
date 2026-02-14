<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import AppButton from '@/components/base/AppButton.vue'

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
      <i class="pi pi-exclamation-triangle error-boundary-icon"></i>
      <h2 class="error-boundary-title">Something went wrong</h2>
      <p class="error-boundary-detail">{{ errorMessage }}</p>
      <AppButton label="Retry" icon="pi pi-refresh" @click="retry" />
    </div>
  </div>
  <slot v-else />
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
  font-size: 2.5rem;
  color: var(--p-surface-400);
}

.error-boundary-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--p-surface-700);
}

.error-boundary-detail {
  font-size: 0.875rem;
  margin: 0;
  color: var(--p-surface-500);
  max-width: 360px;
}
</style>
