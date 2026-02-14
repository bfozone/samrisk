<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { computed, useAttrs } from 'vue'
import { uiComponentDefaults } from '@/ui/config'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  size?: InputTextSize
}>()

defineEmits(['update:modelValue'])

type InputTextSize = 'small' | 'large'

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
