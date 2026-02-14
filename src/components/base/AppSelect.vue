<script setup lang="ts">
import Select from 'primevue/select'
import { computed, useAttrs } from 'vue'
import { uiComponentDefaults } from '@/ui/config'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  size?: SelectSize
}>()

defineEmits(['update:modelValue'])

type SelectSize = 'small' | 'large'

const attrs = useAttrs()

const resolvedSize = computed(() => props.size ?? uiComponentDefaults.select.size)
</script>

<template>
  <Select
    v-bind="attrs"
    :size="resolvedSize"
    class="app-select"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template
      v-for="(_, slotName) in $slots"
      :key="String(slotName)"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps ?? {}"></slot>
    </template>
  </Select>
</template>
