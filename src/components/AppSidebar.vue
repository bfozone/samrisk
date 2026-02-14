<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useAnalyticsContext } from '@/stores/analytics'
import { useCurrentUser } from '@/composables/useAuth'
import { useNavItems } from '@/composables/useNavItems'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import Tooltip from 'primevue/tooltip'

const vTooltip = Tooltip

const appStore = useAppStore()
const analytics = useAnalyticsContext()
const route = useRoute()
const router = useRouter()
const { data: user } = useCurrentUser()
const { navItems } = useNavItems()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && appStore.isMobile && appStore.mobileOpen) {
    appStore.closeMobile()
  }
}

const showLabels = computed(() => appStore.sidebarExpanded || (appStore.isMobile && appStore.mobileOpen))
const showTooltip = computed(() => appStore.sidebarCollapsed && !appStore.isMobile)

const env = import.meta.env.MODE === 'production' ? 'PROD' : 'DEV'

function isActive(to: string) {
  if (route.path === to) return true
  if (!route.path.startsWith(to + '/')) return false
  return !navItems.value.some(item => item.to !== to && item.to.length > to.length
    && (route.path === item.to || route.path.startsWith(item.to + '/')))
}

function navigate(to: string) {
  const resolved = router.resolve(to)
  const target = resolved.meta.analyticsRoute && analytics.portfolioId
    ? `${to}/${analytics.portfolioId}`
    : to
  router.push(target)
  if (appStore.isMobile) appStore.closeMobile()
}
</script>

<template>
  <!-- Mobile backdrop -->
  <Transition name="fade">
    <div
      v-if="appStore.isMobile && appStore.mobileOpen"
      class="sidebar-backdrop"
      role="presentation"
      @click="appStore.closeMobile()"
    ></div>
  </Transition>

  <aside
    class="app-sidebar"
    :class="appStore.isMobile
      ? (appStore.mobileOpen ? 'mobile-open' : 'mobile-closed')
      : (appStore.sidebarExpanded ? 'expanded' : 'collapsed')
    "
    aria-label="Main navigation"
    @keydown="onKeydown"
  >
    <div class="sidebar-inner">
      <!-- Header -->
      <div class="sidebar-header">
        <button class="sidebar-logo" @click="navigate('/')">
          <div class="logo-container">
            <img src="/logo-light.svg" alt="SAMRisk" class="logo-icon" />
          </div>
          <Transition name="label">
            <span v-if="showLabels" class="logo-text">
              SAMRisk
            </span>
          </Transition>
        </button>
        <Transition name="label">
          <span v-if="showLabels" class="env-tag" :class="env.toLowerCase()">{{ env }}</span>
        </Transition>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav" aria-label="Main navigation">
        <ul class="nav-list" role="menubar" aria-orientation="vertical">
          <template v-for="item in navItems" :key="item.to">
            <!-- Section header -->
            <li v-if="item.section" class="nav-section" :class="{ 'nav-section-collapsed': !showLabels }">
              <Transition name="label">
                <span v-if="showLabels" class="nav-section-label">{{ item.section }}</span>
              </Transition>
            </li>

            <!-- Nav item -->
            <li role="none">
              <button
                v-tooltip.right="showTooltip ? item.label : undefined"
                role="menuitem"
                class="nav-item"
                :class="{ active: isActive(item.to) }"
                :aria-current="isActive(item.to) ? 'page' : undefined"
                @click="navigate(item.to)"
              >
                <i :class="item.icon" class="nav-icon"></i>
                <Transition name="label">
                  <span v-if="showLabels" class="nav-label">
                    {{ item.label }}
                  </span>
                </Transition>
              </button>
            </li>
          </template>
        </ul>
      </nav>

      <!-- User section -->
      <button class="sidebar-user" type="button" :aria-label="`User: ${user?.name ?? 'Unidentified User'}`">
        <div class="user-avatar" aria-hidden="true">{{ user?.initials ?? '?' }}</div>
        <Transition name="label">
          <div v-if="showLabels" class="user-info">
            <span class="user-name">{{ user?.name ?? 'Unidentified User' }}</span>
            <span class="user-role">{{ user?.role ?? 'No session' }}</span>
          </div>
        </Transition>
      </button>
    </div>

    <!-- Edge toggle (desktop only) -->
    <button
      v-if="!appStore.isMobile"
      class="sidebar-edge-toggle"
      aria-label="Toggle sidebar"
      @click="appStore.toggleSidebar()"
    >
      <i :class="appStore.sidebarExpanded ? 'pi pi-chevron-left' : 'pi pi-chevron-right'"></i>
    </button>
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
  overflow: visible;
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

/* Inner wrapper - clips content, lets edge toggle protrude */
.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
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
  color: #ee000c;
}

.env-tag.prod {
  background: rgba(112, 164, 20, 0.15);
  color: #9ec436;
}

/* Edge toggle */
.sidebar-edge-toggle {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 1px solid var(--p-surface-200);
  background: var(--p-surface-0);
  color: var(--p-surface-500);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 60;
  opacity: 0;
  transition:
    opacity var(--app-transition-fast),
    background-color var(--app-transition-fast),
    color var(--app-transition-fast);
  box-shadow: var(--app-shadow-sm);
}

.app-sidebar:hover .sidebar-edge-toggle {
  opacity: 1;
}

.sidebar-edge-toggle:hover {
  background: var(--p-surface-100);
  color: var(--p-surface-700);
}

.sidebar-edge-toggle i {
  font-size: 0.625rem;
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
  position: relative;
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
  color: #ee000c;
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

/* User section */
.sidebar-user {
  padding: 0.75rem;
  margin: 0 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  border-top: 1px solid var(--p-surface-700);
  background: transparent;
  color: inherit;
  font-family: inherit;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 8px;
  cursor: pointer;
  width: calc(100% - 1rem);
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
