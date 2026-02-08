import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    analyticsRoute?: boolean
  }
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
      path: '/overview',
      name: 'overview',
      component: () => import('@/views/OverviewView.vue'),
      meta: { title: 'Overview' },
    },
    {
      path: '/summary/:portfolioId?',
      name: 'summary',
      component: () => import('@/views/SummaryView.vue'),
      meta: { title: 'Summary', analyticsRoute: true },
    },
    {
      path: '/performance/:portfolioId?',
      name: 'performance',
      component: () => import('@/views/PerformanceView.vue'),
      meta: { title: 'Performance', analyticsRoute: true },
    },
    {
      path: '/guidelines/:portfolioId?',
      name: 'guidelines',
      component: () => import('@/views/GuidelinesView.vue'),
      meta: { title: 'Guidelines', analyticsRoute: true },
    },
    {
      path: '/risk/:portfolioId?',
      name: 'risk',
      component: () => import('@/views/RiskView.vue'),
      meta: { title: 'Risk', analyticsRoute: true },
    },
    {
      path: '/portfolios',
      name: 'portfolios',
      component: () => import('@/views/PortfoliosView.vue'),
      meta: { title: 'Portfolios' },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { title: 'Reports' },
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
  document.title = to.meta.title ? `${to.meta.title} - RiskCog` : 'RiskCog'
})

export default router
