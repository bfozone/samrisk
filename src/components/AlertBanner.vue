<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ref } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

defineProps<{
  title: string
  message: string
  variant?: 'default' | 'destructive'
}>()

const dismissed = ref(false)
</script>

<template>
  <Alert v-if="!dismissed" :variant="variant">
    <AlertTitle class="flex items-center justify-between">
      {{ title }}
      <Button
        variant="ghost"
        size="icon"
        class="h-5 w-5 shrink-0"
        aria-label="Dismiss alert"
        @click="dismissed = true"
      >
        <X class="size-3" />
      </Button>
    </AlertTitle>
    <AlertDescription>{{ message }}</AlertDescription>
  </Alert>
</template>
