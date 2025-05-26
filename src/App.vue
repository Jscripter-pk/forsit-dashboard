<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const sidebarOpen = ref(false)
const isMobile = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
function closeSidebar() {
  sidebarOpen.value = false
}

function handleResize() {
  isMobile.value = window.innerWidth <= 900
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="layout">
    <header class="mobile-header" v-if="isMobile">
      <button class="hamburger" @click="toggleSidebar" aria-label="Open navigation menu">
        <span :class="{ 'open': sidebarOpen }"></span>
        <span :class="{ 'open': sidebarOpen }"></span>
        <span :class="{ 'open': sidebarOpen }"></span>
      </button>
      <span class="mobile-brand">Forsit</span>
    </header>
    <aside class="sidebar" :class="{ open: sidebarOpen, mobile: isMobile }" @click.stop>
      <div class="sidebar-header" v-if="!isMobile">
        <span class="brand">Forsit</span>
        <button v-if="sidebarOpen" class="close-btn" @click="closeSidebar" aria-label="Close navigation menu">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="7" y1="7" x2="21" y2="21" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
            <line x1="21" y1="7" x2="7" y2="21" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <nav>
        <ul class="nav-list">
          <li><router-link to="/" class="nav-link" active-class="active-link" exact>Revenue Analysis</router-link></li>
          <li><router-link to="/inventory" class="nav-link" active-class="active-link">Inventory</router-link></li>
          <li><router-link to="/register" class="nav-link" active-class="active-link">Product</router-link></li>
        </ul>
      </nav>
    </aside>
    <div class="overlay" v-if="sidebarOpen && isMobile" @click="closeSidebar"></div>
    <main class="main-content" @click="sidebarOpen = false">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
:root {
  --sidebar-bg: #111;
  --sidebar-text: #fff;
  --sidebar-active: #fff;
  --sidebar-hover: #222;
  --brand-font: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  background: #fff;
  font-family: var(--brand-font);
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 64px;
  background: #111;
  z-index: 2100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding-left: 0.5rem;
}

.hamburger {
  display: flex;
  position: relative;
  z-index: 2101;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-left: 0.5rem;
}
.hamburger span {
  display: block;
  width: 28px;
  height: 4px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s;
}
.hamburger span.open:nth-child(1) {
  transform: translateY(10px) rotate(45deg);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: translateY(-10px) rotate(-45deg);
}

.mobile-brand {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  margin-left: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sidebar {
  width: 240px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  min-height: 100vh;
  transition: transform 0.3s cubic-bezier(.4, 2, .6, 1), box-shadow 0.3s;
  z-index: 2000;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
}

.sidebar.open {
  transform: translateX(0);
}
.sidebar.mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 80vw;
  max-width: 320px;
  min-width: 180px;
  height: 100vh;
  border-radius: 0 16px 16px 0;
  box-shadow: 2px 0 24px rgba(0,0,0,0.18);
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(.4, 2, .6, 1);
}
.sidebar.mobile.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  text-transform: uppercase;
}

.close-btn {
  display: none;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: block;
  color: #bbb;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.9rem 1.2rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: background 0.18s, color 0.18s;
  background: transparent;
}

.nav-link.router-link-exact-active,
.nav-link.active-link {
  background: #fff !important;
  color: #111 !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.overlay {
  display: none;
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 80vw;
    max-width: 320px;
    min-width: 180px;
    border-radius: 0 16px 16px 0;
    box-shadow: 2px 0 24px rgba(0,0,0,0.18);
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(.4, 2, .6, 1);
    z-index: 2000;
    padding-top: 64px;
    background: #303030 !important;
    color: #fff !important;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .sidebar-header {
    display: none;
  }
  .mobile-header {
    display: flex;
  }
  .main-content {
    padding-top: 64px;
  }
  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.25);
    z-index: 1500;
  }
  .nav-link {
    color: #eee !important;
    background: transparent !important;
  }
  .nav-link.router-link-exact-active,
  .nav-link.active-link {
    background: #fff !important;
    color: #000 !important;
  }
  .brand, .mobile-brand {
    color: #fff !important;
  }
}

@media (min-width: 901px) {
  .mobile-header {
    display: none;
  }
  .sidebar {
    position: relative;
    transform: none !important;
    border-radius: 0;
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
    padding-top: 2rem;
  }
  .main-content {
    padding-top: 0;
  }
}

.main-content {
  flex: 1 1 0%;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 2rem 2rem 2rem 2rem;
  background: #fff;
  min-height: 100vh;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
