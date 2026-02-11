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
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/views/ShowcaseView.vue'),
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
