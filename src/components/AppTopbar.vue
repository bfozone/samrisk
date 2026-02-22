<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSelect from '@/components/base/AppSelect.vue'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { usePortfolios } from '@/composables/usePortfolios'
import { useAnalyticsContext } from '@/stores/analytics'

const analytics = useAnalyticsContext()
const route = useRoute()
const { data: portfolios } = usePortfolios()

const isAnalyticsRoute = computed(() => !!route.meta.analyticsRoute)
const pageTitle = computed(() => (route.meta.title as string) ?? '')

function onDateChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  analytics.selectDate(value || null)
}
</script>

<template>
  <header class="app-topbar">
    <div class="topbar-left">
      <SidebarTrigger class="-ml-1 md:hidden" />
      <h1 class="topbar-title">
        {{ pageTitle }}
      </h1>
    </div>

    <div v-if="isAnalyticsRoute" class="topbar-right">
      <AppSelect
        :modelValue="analytics.portfolioId"
        :options="portfolios ?? []"
        optionLabel="name"
        optionValue="id"
        placeholder="Select portfolio"
        class="topbar-portfolio-select"
        @update:modelValue="analytics.selectPortfolio($event)"
      />
      <input
        type="date"
        :value="analytics.asOfDate ?? ''"
        placeholder="As-of date"
        aria-label="As-of date"
        class="topbar-date-input"
        @change="onDateChange"
      />
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--app-space-sm) var(--app-space-md);
  background: var(--card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 30;
  gap: var(--app-space-md);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.topbar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--app-space-sm);
  flex-shrink: 0;
}

.topbar-portfolio-select {
  min-width: 200px;
}

.topbar-date-input {
  width: 160px;
  padding: 0.5rem 0.75rem;
  min-height: 2.375rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm, 6px);
  font-size: 0.875rem;
  font-family: inherit;
  color: var(--foreground);
  background: var(--card);
  outline: none;
  transition: border-color 0.15s ease;
}

.topbar-date-input:hover {
  border-color: var(--color-text-faint);
}

.topbar-date-input:focus-visible {
  border-color: var(--ring);
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .app-topbar {
    flex-wrap: wrap;
  }

  .topbar-right {
    width: 100%;
    flex-wrap: wrap;
  }

  .topbar-portfolio-select,
  .topbar-date-input {
    flex: 1;
    min-width: 140px;
  }
}
</style>
