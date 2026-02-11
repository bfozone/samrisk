<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAnalyticsContext } from '@/stores/analytics'
import { usePortfolios } from '@/composables/usePortfolios'
import AppButton from '@/components/base/AppButton.vue'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'

const appStore = useAppStore()
const analytics = useAnalyticsContext()
const route = useRoute()
const { data: portfolios } = usePortfolios()

const isAnalyticsRoute = computed(() => !!route.meta.analyticsRoute)
const pageTitle = computed(() => (route.meta.title as string) ?? '')

function parseIsoDate(date: string): Date {
  const [year = 1970, month = 1, day = 1] = date.split('-').map((part) => Number(part))
  return new Date(year, month - 1, day)
}

function formatIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dateModel = computed({
  get: () => (analytics.asOfDate ? parseIsoDate(analytics.asOfDate) : null),
  set: (val: Date | null) => {
    analytics.selectDate(val ? formatIsoDate(val) : null)
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
        @click="appStore.toggleSidebar()"
        class="topbar-toggle"
      />
      <h1 class="topbar-title">{{ pageTitle }}</h1>
    </div>

    <div v-if="isAnalyticsRoute" class="topbar-right">
      <Select
        :modelValue="analytics.portfolioId"
        @update:modelValue="analytics.selectPortfolio($event)"
        :options="portfolios ?? []"
        optionLabel="name"
        optionValue="id"
        placeholder="Select portfolio"
        class="topbar-portfolio-select"
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
