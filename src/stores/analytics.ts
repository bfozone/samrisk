import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useAnalyticsContext = defineStore('analytics', () => {
  const portfolioId = useLocalStorage<string | null>('samrisk-portfolio-id', null)
  const asOfDate = useLocalStorage<string | null>('samrisk-as-of-date', null)

  const hasPortfolio = computed(() => portfolioId.value !== null)

  function selectPortfolio(id: string | null) {
    portfolioId.value = id
  }

  function selectDate(date: string | null) {
    asOfDate.value = date
  }

  return { portfolioId, asOfDate, hasPortfolio, selectPortfolio, selectDate }
})
