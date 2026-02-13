<script setup lang="ts">
withDefaults(defineProps<{
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
}>(), {
  gap: 'md',
  align: 'stretch',
})
</script>

<template>
  <div
    class="flex-stack"
    :style="{
      gap: `var(--app-space-${gap})`,
      alignItems: align,
    }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.flex-stack {
  display: flex;
  flex-direction: column;
}
</style>
