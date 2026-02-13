<script setup lang="ts">
import { useAttrs } from 'vue'
import Card from 'primevue/card'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  compact?: boolean
  subtle?: boolean
}>()

const attrs = useAttrs()
</script>

<template>
  <Card
    v-bind="attrs"
    :class="[
      'app-card',
      { 'app-card-compact': props.compact, 'app-card-subtle': props.subtle },
    ]"
  >
    <template v-if="$slots.header" #header>
      <slot name="header"></slot>
    </template>
    <template v-if="$slots.title" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="$slots.subtitle" #subtitle>
      <slot name="subtitle"></slot>
    </template>
    <template #content>
      <slot name="content">
        <slot></slot>
      </slot>
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </Card>
</template>

<style scoped>
.app-card-subtle {
  background: var(--p-surface-50);
}

.app-card-compact :deep(.p-card-body) {
  padding: var(--app-card-padding-compact, 1rem);
}
</style>
