import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    analyticsRoute?: boolean
    icon?: string
    hint?: string
    emptyLabel?: string
    sidebar?: { icon: string, section?: string, order: number }
  }
}

async function ensureAnalyticsCharts() {
  await import('@/plugins/echarts')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/WelcomeView.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/summary/:portfolioId?',
      name: 'summary',
      component: () => import('@/views/SummaryView.vue'),
      beforeEnter: ensureAnalyticsCharts,
      meta: { title: 'Summary', analyticsRoute: true, sidebar: { icon: 'th-large', section: 'Analytics', order: 10 } },
    },
    {
      path: '/performance/:portfolioId?',
      name: 'performance',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Performance',
        analyticsRoute: true,
        icon: 'chart-line',
        hint: 'Investment performance analysis',
        emptyLabel: 'Select a portfolio from the topbar to view performance',
        sidebar: { icon: 'chart-line', order: 20 },
      },
    },
    {
      path: '/market-risk/:portfolioId?',
      name: 'market-risk',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Market Risk',
        analyticsRoute: true,
        icon: 'shield',
        hint: 'VaR, stress testing and factor decomposition',
        emptyLabel: 'Select a portfolio from the topbar to view market risk metrics',
        sidebar: { icon: 'shield', order: 30 },
      },
    },
    {
      path: '/liquidity-risk/:portfolioId?',
      name: 'liquidity-risk',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Liquidity Risk',
        analyticsRoute: true,
        icon: 'wave-pulse',
        hint: 'Time-to-liquidation, bid-ask analysis and liquidity stress',
        emptyLabel: 'Select a portfolio from the topbar to view liquidity risk metrics',
        sidebar: { icon: 'wave-pulse', order: 40 },
      },
    },
    {
      path: '/credit-risk/:portfolioId?',
      name: 'credit-risk',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Credit Risk',
        analyticsRoute: true,
        icon: 'building-columns',
        hint: 'Counterparty exposure, credit ratings and concentration',
        emptyLabel: 'Select a portfolio from the topbar to view credit risk metrics',
        sidebar: { icon: 'building-columns', order: 50 },
      },
    },
    {
      path: '/esg/:portfolioId?',
      name: 'esg',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'ESG',
        analyticsRoute: true,
        icon: 'globe',
        hint: 'ESG scores, carbon footprint and sustainability metrics',
        emptyLabel: 'Select a portfolio from the topbar to view ESG analytics',
        sidebar: { icon: 'globe', order: 60 },
      },
    },
    {
      path: '/kri',
      name: 'kri',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'KRI Dashboard',
        hint: 'Key risk indicators, limit utilization and breach alerts',
        sidebar: { icon: 'gauge', section: 'Monitoring', order: 70 },
      },
    },
    {
      path: '/guidelines/:portfolioId?',
      name: 'guidelines',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Guidelines',
        analyticsRoute: true,
        icon: 'check-square',
        hint: 'Investment controlling and compliance',
        emptyLabel: 'Select a portfolio from the topbar to view guidelines',
        sidebar: { icon: 'check-square', section: 'Compliance', order: 80 },
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'Reports',
        hint: 'Report generation and regulatory exports',
        sidebar: { icon: 'file', order: 90 },
      },
    },
    {
      path: '/product-master',
      name: 'product-master',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'Product Master',
        hint: 'Product catalogue and fund structures',
        sidebar: { icon: 'box', section: 'Master Data', order: 100 },
      },
    },
    {
      path: '/security-master',
      name: 'security-master',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'Security Master',
        hint: 'Security reference data and classifications',
        sidebar: { icon: 'lock', order: 110 },
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Not Found' },
    },
  ],
})

const isMockMode = import.meta.env.VITE_USE_MOCK_API !== 'false'

router.beforeEach(async () => {
  if (isMockMode)
    return true
  const { getMsalInstance } = await import('@/auth/msalInstance')
  const { loginRequest } = await import('@/auth/msalConfig')
  const msal = getMsalInstance()
  if (!msal.getAllAccounts().length) {
    await msal.loginRedirect(loginRequest)
    return false
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - SAMRisk` : 'SAMRisk'
})

export default router
