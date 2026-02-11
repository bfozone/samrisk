<script setup lang="ts">
import { useAttrs } from 'vue'
import Tag from 'primevue/tag'

defineOptions({ inheritAttrs: false })

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'

defineProps<{
  severity?: TagSeverity
}>()

const attrs = useAttrs()
</script>

<template>
  <Tag
    v-bind="attrs"
    :severity="severity"
    class="app-tag"
  />
</template>
