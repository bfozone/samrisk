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

async function ensureShowcaseCharts() {
  await Promise.all([
    import('@/plugins/echarts'),
    import('@/plugins/echarts-showcase'),
  ])
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
      meta: { title: 'Summary', analyticsRoute: true, sidebar: { icon: 'pi pi-th-large', section: 'Analytics', order: 10 } },
    },
    {
      path: '/performance/:portfolioId?',
      name: 'performance',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Performance',
        analyticsRoute: true,
        icon: 'pi pi-chart-line',
        hint: 'Investment performance analysis',
        emptyLabel: 'Select a portfolio from the topbar to view performance',
        sidebar: { icon: 'pi pi-chart-line', order: 20 },
      },
    },
    {
      path: '/market-risk/:portfolioId?',
      name: 'market-risk',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Market Risk',
        analyticsRoute: true,
        icon: 'pi pi-shield',
        hint: 'VaR, stress testing and factor decomposition',
        emptyLabel: 'Select a portfolio from the topbar to view market risk metrics',
        sidebar: { icon: 'pi pi-shield', order: 30 },
      },
    },
    {
      path: '/liquidity-risk/:portfolioId?',
      name: 'liquidity-risk',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Liquidity Risk',
        analyticsRoute: true,
        icon: 'pi pi-wave-pulse',
        hint: 'Time-to-liquidation, bid-ask analysis and liquidity stress',
        emptyLabel: 'Select a portfolio from the topbar to view liquidity risk metrics',
        sidebar: { icon: 'pi pi-wave-pulse', order: 40 },
      },
    },
    {
      path: '/credit-risk/:portfolioId?',
      name: 'credit-risk',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Credit Risk',
        analyticsRoute: true,
        icon: 'pi pi-building-columns',
        hint: 'Counterparty exposure, credit ratings and concentration',
        emptyLabel: 'Select a portfolio from the topbar to view credit risk metrics',
        sidebar: { icon: 'pi pi-building-columns', order: 50 },
      },
    },
    {
      path: '/esg/:portfolioId?',
      name: 'esg',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'ESG',
        analyticsRoute: true,
        icon: 'pi pi-globe',
        hint: 'ESG scores, carbon footprint and sustainability metrics',
        emptyLabel: 'Select a portfolio from the topbar to view ESG analytics',
        sidebar: { icon: 'pi pi-globe', order: 60 },
      },
    },
    {
      path: '/kri',
      name: 'kri',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'KRI Dashboard',
        hint: 'Key risk indicators, limit utilization and breach alerts',
        sidebar: { icon: 'pi pi-gauge', section: 'Monitoring', order: 70 },
      },
    },
    {
      path: '/guidelines/:portfolioId?',
      name: 'guidelines',
      component: () => import('@/views/AnalyticsPlaceholderView.vue'),
      meta: {
        title: 'Guidelines',
        analyticsRoute: true,
        icon: 'pi pi-check-square',
        hint: 'Investment controlling and compliance',
        emptyLabel: 'Select a portfolio from the topbar to view guidelines',
        sidebar: { icon: 'pi pi-check-square', section: 'Compliance', order: 80 },
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'Reports',
        hint: 'Report generation and regulatory exports',
        sidebar: { icon: 'pi pi-file', order: 90 },
      },
    },
    {
      path: '/product-master',
      name: 'product-master',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'Product Master',
        hint: 'Product catalogue and fund structures',
        sidebar: { icon: 'pi pi-box', section: 'Master Data', order: 100 },
      },
    },
    {
      path: '/security-master',
      name: 'security-master',
      component: () => import('@/views/PlaceholderView.vue'),
      meta: {
        title: 'Security Master',
        hint: 'Security reference data and classifications',
        sidebar: { icon: 'pi pi-lock', order: 110 },
      },
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/views/ShowcaseView.vue'),
      beforeEnter: ensureShowcaseCharts,
      meta: { title: 'Charts', sidebar: { icon: 'pi pi-chart-bar', section: 'Showcase', order: 120 } },
    },
    {
      path: '/showcase/controls',
      name: 'showcase-controls',
      component: () => import('@/views/ControlsShowcaseView.vue'),
      meta: { title: 'Controls', sidebar: { icon: 'pi pi-sliders-h', order: 130 } },
    },
    {
      path: '/showcase/feedback',
      name: 'showcase-feedback',
      component: () => import('@/views/FeedbackShowcaseView.vue'),
      meta: { title: 'Feedback', sidebar: { icon: 'pi pi-comment', order: 140 } },
    },
    {
      path: '/showcase/overlays',
      name: 'showcase-overlays',
      component: () => import('@/views/OverlaysShowcaseView.vue'),
      meta: { title: 'Overlays', sidebar: { icon: 'pi pi-clone', order: 150 } },
    },
    {
      path: '/showcase/tables',
      name: 'showcase-tables',
      component: () => import('@/views/TablesShowcaseView.vue'),
      meta: { title: 'Tables', sidebar: { icon: 'pi pi-table', order: 160 } },
    },
    {
      path: '/showcase/forms',
      name: 'showcase-forms',
      component: () => import('@/views/FormsShowcaseView.vue'),
      meta: { title: 'Forms', sidebar: { icon: 'pi pi-pen-to-square', order: 170 } },
    },
    {
      path: '/showcase/navigation',
      name: 'showcase-navigation',
      component: () => import('@/views/NavigationShowcaseView.vue'),
      meta: { title: 'Navigation', sidebar: { icon: 'pi pi-compass', order: 180 } },
    },
    {
      path: '/showcase/layout',
      name: 'showcase-layout',
      component: () => import('@/views/LayoutShowcaseView.vue'),
      beforeEnter: ensureShowcaseCharts,
      meta: { title: 'Layout', sidebar: { icon: 'pi pi-objects-column', order: 190 } },
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
