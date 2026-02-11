<script setup lang="ts">
defineProps<{
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    class="dashboard-grid"
    :class="[`cols-${columns ?? 2}`, `gap-${gap ?? 'lg'}`]"
  >
    <slot />
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
}

.cols-1 { grid-template-columns: 1fr; }
.cols-2 { grid-template-columns: repeat(2, 1fr); }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
.cols-4 { grid-template-columns: repeat(4, 1fr); }

.gap-sm { gap: var(--app-space-sm); margin-bottom: var(--app-space-sm); }
.gap-md { gap: var(--app-space-md); margin-bottom: var(--app-space-md); }
.gap-lg { gap: var(--app-space-lg); margin-bottom: var(--app-space-lg); }

@media (max-width: 1024px) {
  .cols-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .cols-2,
  .cols-3,
  .cols-4 { grid-template-columns: 1fr; }
}
</style>
