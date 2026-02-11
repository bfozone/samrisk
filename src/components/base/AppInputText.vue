<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import InputText from 'primevue/inputtext'
import { uiComponentDefaults } from '@/ui/config'

defineOptions({ inheritAttrs: false })

type InputTextSize = 'small' | 'large'

const props = defineProps<{
  size?: InputTextSize
}>()

defineEmits(['update:modelValue'])

const attrs = useAttrs()

const resolvedSize = computed(() => props.size ?? uiComponentDefaults.inputText.size)
</script>

<template>
  <InputText
    v-bind="attrs"
    :size="resolvedSize"
    class="app-input-text"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>
