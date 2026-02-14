<script setup lang="ts">
import Button from 'primevue/button'
import { computed, useAttrs } from 'vue'
import { uiComponentDefaults } from '@/ui/config'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  severity?: ButtonSeverity
  size?: ButtonSize
}>()
type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
type ButtonSize = 'small' | 'large'

const attrs = useAttrs()

const resolvedSeverity = computed(() => {
  const severity = props.severity ?? uiComponentDefaults.button.severity
  return severity === 'primary' ? undefined : severity
})

const resolvedSize = computed(() => props.size ?? uiComponentDefaults.button.size)
</script>

<template>
  <Button
    v-bind="attrs"
    :severity="resolvedSeverity"
    :size="resolvedSize"
    class="app-button"
  />
</template>
