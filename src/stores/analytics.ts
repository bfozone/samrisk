import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAnalyticsContext = defineStore('analytics', () => {
  const portfolioId = ref<string | null>(null)
  const asOfDate = ref<string | null>(null)

  const hasPortfolio = computed(() => portfolioId.value !== null)

  function selectPortfolio(id: string | null) {
    portfolioId.value = id
  }

  function selectDate(date: string | null) {
    asOfDate.value = date
  }

  return { portfolioId, asOfDate, hasPortfolio, selectPortfolio, selectDate }
})
