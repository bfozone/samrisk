<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentUser } from '@/composables/useAuth'

const { data: user } = useCurrentUser()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const today = computed(() =>
  new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)
</script>

<template>
  <div class="welcome">
    <h1 class="welcome-greeting">
      {{ greeting }}<span v-if="user">, {{ user.name.split(' ')[0] }}</span>
    </h1>
    <p class="welcome-date">{{ today }}</p>
  </div>
</template>

<style scoped>
.welcome-date {
  margin-top: 0.375rem;
  font-size: 0.875rem;
  color: var(--p-surface-500);
}
</style>
