<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppButton from '@/components/base/AppButton.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import { usePortfolios } from '@/composables/usePortfolios'
import { useAnalyticsContext } from '@/stores/analytics'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const analytics = useAnalyticsContext()
const route = useRoute()
const { data: portfolios } = usePortfolios()

const isAnalyticsRoute = computed(() => !!route.meta.analyticsRoute)
const pageTitle = computed(() => (route.meta.title as string) ?? '')

/** Parse YYYY-MM-DD to local Date (avoids UTC midnight shift from Date.parse) */
function parseLocalDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m)
    return null
  return new Date(+m[1]!, +m[2]! - 1, +m[3]!)
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const dateModel = computed({
  get: () => (analytics.asOfDate ? parseLocalDate(analytics.asOfDate) : null),
  set: (val: Date | null) => {
    analytics.selectDate(val ? toIsoDate(val) : null)
  },
})
</script>

<template>
  <header class="app-topbar">
    <div class="topbar-left">
      <AppButton
        v-if="appStore.isMobile"
        icon="pi pi-bars"
        text
        rounded
        severity="secondary"
        aria-label="Open navigation menu"
        class="topbar-toggle"
        @click="appStore.toggleSidebar()"
      />
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
      <DatePicker
        v-model="dateModel"
        dateFormat="yy-mm-dd"
        placeholder="As-of date"
        showIcon
        class="topbar-date-picker"
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
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
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

.topbar-toggle {
  color: var(--p-surface-600);
  flex-shrink: 0;
}

.topbar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-surface-900);
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

.topbar-date-picker {
  width: 160px;
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
  .topbar-date-picker {
    flex: 1;
    min-width: 140px;
  }
}
</style>
