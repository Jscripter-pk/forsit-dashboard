import { createRouter, createWebHistory } from 'vue-router'
const RevenueAnalysis = () => import('../views/RevenueAnalysis.vue')
const InventoryManagement = () => import('../views/InventoryManagement.vue')
const ProductRegistration = () => import('../views/ProductRegistration.vue')

const routes = [
  { path: '/', name: 'RevenueAnalysis', component: RevenueAnalysis },
  { path: '/inventory', name: 'InventoryManagement', component: InventoryManagement },
  { path: '/register', name: 'ProductRegistration', component: ProductRegistration },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
