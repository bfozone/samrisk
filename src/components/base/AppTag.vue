<script setup lang="ts">
import Tag from 'primevue/tag'
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  severity?: TagSeverity
}>()

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'

const attrs = useAttrs()
</script>

<template>
  <Tag
    v-bind="attrs"
    :severity="severity"
    class="app-tag"
  />
</template>
