<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useCurrentUser } from '@/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import Tooltip from 'primevue/tooltip'

const vTooltip = Tooltip

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()

const navItems = [
  { label: 'Home', icon: 'pi pi-home', to: '/' },
  { label: 'Dashboard', icon: 'pi pi-chart-bar', to: '/dashboard', section: 'Analytics' },
  { label: 'Risk Analysis', icon: 'pi pi-shield', to: '/risk', badge: 2 },
  { label: 'Exposures', icon: 'pi pi-sitemap', to: '/exposures' },
  { label: 'Portfolios', icon: 'pi pi-briefcase', to: '/portfolios', section: 'Management' },
  { label: 'Reports', icon: 'pi pi-file', to: '/reports' },
  { label: 'Settings', icon: 'pi pi-cog', to: '/settings', bottom: true },
]

const showLabels = computed(() => appStore.sidebarExpanded || (appStore.isMobile && appStore.mobileOpen))
const showTooltip = computed(() => appStore.sidebarCollapsed && !appStore.isMobile)
const firstBottomIndex = navItems.findIndex((i) => i.bottom)

const env = import.meta.env.MODE === 'production' ? 'PROD' : 'DEV'

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function navigate(to: string) {
  router.push(to)
  if (appStore.isMobile) appStore.closeMobile()
}
</script>

<template>
  <!-- Mobile backdrop -->
  <Transition name="fade">
    <div
      v-if="appStore.isMobile && appStore.mobileOpen"
      class="sidebar-backdrop"
      @click="appStore.closeMobile()"
    />
  </Transition>

  <aside
    class="app-sidebar"
    :class="appStore.isMobile
      ? (appStore.mobileOpen ? 'mobile-open' : 'mobile-closed')
      : (appStore.sidebarExpanded ? 'expanded' : 'collapsed')
    "
  >
    <!-- Header -->
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="logo-container">
          <img src="/logo-light.svg" alt="RiskCog" class="logo-icon" />
        </div>
        <Transition name="label">
          <span v-if="showLabels" class="logo-text">
            RiskCog
          </span>
        </Transition>
      </div>
      <Transition name="label">
        <span v-if="showLabels" class="env-tag" :class="env.toLowerCase()">{{ env }}</span>
      </Transition>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <template v-for="(item, index) in navItems" :key="item.to">
          <li v-if="index === firstBottomIndex" class="nav-spacer" aria-hidden="true" />

          <!-- Section header -->
          <li v-if="item.section" class="nav-section" :class="{ 'nav-section-collapsed': !showLabels }">
            <Transition name="label">
              <span v-if="showLabels" class="nav-section-label">{{ item.section }}</span>
            </Transition>
          </li>

          <!-- Nav item -->
          <li>
            <button
              v-tooltip.right="showTooltip ? item.label : undefined"
              class="nav-item"
              :class="{ active: isActive(item.to) }"
              @click="navigate(item.to)"
            >
              <i :class="item.icon" class="nav-icon" />
              <Transition name="label">
                <span v-if="showLabels" class="nav-label">
                  {{ item.label }}
                </span>
              </Transition>
              <span v-if="item.badge && showLabels" class="nav-badge">{{ item.badge }}</span>
              <span v-else-if="item.badge && !showLabels" class="nav-badge-dot" />
            </button>
          </li>
        </template>
      </ul>
    </nav>

    <!-- User section -->
    <div v-if="user" class="sidebar-user">
      <div class="user-avatar">{{ user.initials }}</div>
      <Transition name="label">
        <div v-if="showLabels" class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-role">{{ user.role }}</span>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

.app-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--p-surface-900);
  color: var(--p-surface-300);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  flex-shrink: 0;
}

.app-sidebar.expanded {
  width: 250px;
}

.app-sidebar.collapsed {
  width: 64px;
}

/* Mobile: off-screen by default, slide in when open */
.app-sidebar.mobile-closed {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0, 0.52, 0, 1);
}

.app-sidebar.mobile-open {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0, 0.52, 0, 1);
}

/* Header */
.sidebar-header {
  padding: 1.25rem 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-space-sm);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--p-surface-0);
  white-space: nowrap;
  overflow: hidden;
}

.logo-container {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(238, 0, 12, 0.15);
  border-radius: 8px;
  flex-shrink: 0;
}

.logo-icon {
  width: 1.25rem;
  height: 1.25rem;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.env-tag {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
  line-height: 1.4;
}

.env-tag.dev {
  background: rgba(238, 0, 12, 0.15);
  color: var(--p-primary-color);
}

.env-tag.prod {
  background: rgba(112, 164, 20, 0.15);
  color: #9ec436;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--app-space-xs) 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0 var(--app-space-sm);
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.nav-spacer {
  flex: 1;
}

/* Section headers */
.nav-section {
  padding: 1.5rem 0.75rem 0.5rem;
}

.nav-section-collapsed {
  padding: var(--app-space-md) 0;
  display: flex;
  justify-content: center;
}

.nav-section-collapsed::after {
  content: '';
  display: block;
  width: 1.5rem;
  height: 1px;
  background: var(--p-surface-700);
}

.nav-section-label {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--p-surface-500);
}

/* Nav items */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--p-surface-400);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  transition:
    background-color var(--app-transition-fast),
    color var(--app-transition-fast);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--p-surface-200);
}

.nav-item:hover .nav-icon {
  color: var(--p-surface-200);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--p-surface-0);
  font-weight: 600;
}

.nav-item.active .nav-icon {
  color: var(--p-primary-color);
}

.nav-icon {
  font-size: 1.125rem;
  width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  overflow: hidden;
  flex: 1;
  text-align: left;
}

/* Badges */
.nav-badge {
  font-size: 0.625rem;
  font-weight: 600;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(238, 0, 12, 0.15);
  color: var(--p-primary-color);
  border-radius: 9999px;
  flex-shrink: 0;
  line-height: 1;
}

.nav-badge-dot {
  width: 0.375rem;
  height: 0.375rem;
  background: var(--p-primary-color);
  border-radius: 50%;
  flex-shrink: 0;
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
}

.nav-item {
  position: relative;
}

/* User section */
.sidebar-user {
  padding: 0.75rem;
  margin: 0 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid var(--p-surface-700);
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color var(--app-transition-fast);
}

.sidebar-user:hover {
  background: rgba(255, 255, 255, 0.06);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: var(--p-surface-700);
  color: var(--p-surface-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.user-name,
.user-role {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--p-surface-0);
  line-height: 1.3;
}

.user-role {
  font-size: 0.6875rem;
  color: var(--p-surface-500);
  line-height: 1.3;
}

/* Transitions */
.label-enter-active {
  transition: opacity var(--app-transition-base) 0.1s;
}

.label-leave-active {
  transition: opacity var(--app-transition-fast);
}

.label-enter-from,
.label-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--app-transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
