import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    analyticsRoute?: boolean
  }
}

const ensureShowcaseCharts = async () => {
  await Promise.all([
    import('@/plugins/echarts'),
    import('@/plugins/echarts-showcase'),
  ])
}

const ensureAnalyticsCharts = async () => {
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
      meta: { title: 'Summary', analyticsRoute: true },
    },
    {
      path: '/performance/:portfolioId?',
      name: 'performance',
      component: () => import('@/views/PerformanceView.vue'),
      meta: { title: 'Performance', analyticsRoute: true },
    },
    {
      path: '/market-risk/:portfolioId?',
      name: 'market-risk',
      component: () => import('@/views/MarketRiskView.vue'),
      meta: { title: 'Market Risk', analyticsRoute: true },
    },
    {
      path: '/liquidity-risk/:portfolioId?',
      name: 'liquidity-risk',
      component: () => import('@/views/LiquidityRiskView.vue'),
      meta: { title: 'Liquidity Risk', analyticsRoute: true },
    },
    {
      path: '/credit-risk/:portfolioId?',
      name: 'credit-risk',
      component: () => import('@/views/CreditRiskView.vue'),
      meta: { title: 'Credit Risk', analyticsRoute: true },
    },
    {
      path: '/esg/:portfolioId?',
      name: 'esg',
      component: () => import('@/views/EsgView.vue'),
      meta: { title: 'ESG', analyticsRoute: true },
    },
    {
      path: '/kri',
      name: 'kri',
      component: () => import('@/views/KriDashboardView.vue'),
      meta: { title: 'KRI Dashboard' },
    },
    {
      path: '/guidelines/:portfolioId?',
      name: 'guidelines',
      component: () => import('@/views/GuidelinesView.vue'),
      meta: { title: 'Guidelines', analyticsRoute: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { title: 'Reports' },
    },
    {
      path: '/product-master',
      name: 'product-master',
      component: () => import('@/views/ProductMasterView.vue'),
      meta: { title: 'Product Master' },
    },
    {
      path: '/security-master',
      name: 'security-master',
      component: () => import('@/views/SecurityMasterView.vue'),
      meta: { title: 'Security Master' },
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/views/ShowcaseView.vue'),
      beforeEnter: ensureShowcaseCharts,
      meta: { title: 'Charts' },
    },
    {
      path: '/showcase/controls',
      name: 'showcase-controls',
      component: () => import('@/views/ControlsShowcaseView.vue'),
      meta: { title: 'Controls' },
    },
    {
      path: '/showcase/feedback',
      name: 'showcase-feedback',
      component: () => import('@/views/FeedbackShowcaseView.vue'),
      meta: { title: 'Feedback' },
    },
    {
      path: '/showcase/overlays',
      name: 'showcase-overlays',
      component: () => import('@/views/OverlaysShowcaseView.vue'),
      meta: { title: 'Overlays' },
    },
    {
      path: '/showcase/tables',
      name: 'showcase-tables',
      component: () => import('@/views/TablesShowcaseView.vue'),
      meta: { title: 'Tables' },
    },
    {
      path: '/showcase/forms',
      name: 'showcase-forms',
      component: () => import('@/views/FormsShowcaseView.vue'),
      meta: { title: 'Forms' },
    },
    {
      path: '/showcase/navigation',
      name: 'showcase-navigation',
      component: () => import('@/views/NavigationShowcaseView.vue'),
      meta: { title: 'Navigation' },
    },
    {
      path: '/showcase/layout',
      name: 'showcase-layout',
      component: () => import('@/views/LayoutShowcaseView.vue'),
      beforeEnter: ensureShowcaseCharts,
      meta: { title: 'Layout' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Not Found' },
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - SAMRisk` : 'SAMRisk'
})

export default router
