<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>
    <p class="placeholder-hint">
      {{ (route.meta.hint as string) ?? '' }}
    </p>
  </div>
</template>
