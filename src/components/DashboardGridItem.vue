<script setup lang="ts">
withDefaults(defineProps<{
  span?: 1 | 2 | 3 | 4
}>(), {
  span: 1,
})
</script>

<template>
  <div class="dashboard-grid-item" :class="`span-${span}`">
    <slot></slot>
  </div>
</template>

<style scoped>
.span-1 { grid-column: span 1; }
.span-2 { grid-column: span 2; }
.span-3 { grid-column: span 3; }
.span-4 { grid-column: span 4; }

@media (max-width: 768px) {
  .span-2,
  .span-3,
  .span-4 { grid-column: span 1; }
}
</style>
