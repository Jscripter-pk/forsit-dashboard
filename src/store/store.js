import { defineStore } from 'pinia'

const STORAGE_KEY = 'forsit-products-v1'

function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {}
  return [
    { id: 1, name: 'Laptop', description: 'Electronics', price: 1200, stock: 3, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=40&h=40', sales: [1,1,1,0,0,0,0] },
    { id: 2, name: 'Book', description: 'Books', price: 40, stock: 10, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=facearea&w=40&h=40', sales: [2,1,0,0,0,0,0] },
    { id: 3, name: 'Shirt', description: 'Clothing', price: 25, stock: 2, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=40&h=40', sales: [1,0,0,0,0,0,0] },
    { id: 4, name: 'Phone', description: 'Electronics', price: 800, stock: 7, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=facearea&w=40&h=40', sales: [1,1,1,1,1,1,1] },
  ]
}

export const useMainStore = defineStore('main', {
  state: () => {
    const products = loadProducts();
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const categories = Array.from(new Set(products.map(p => p.description)));
    return {
      products,
      nextId,
      categories,
      selectedCategory: '',
      selectedRange: 'monthly',
      search: '',
      sortBy: 'name',
      sortAsc: true,
      filterMinPrice: '',
      filterMaxPrice: '',
      filterInStock: false,
    };
  },
  getters: {
    totalOrders(state) {
      return state.products.reduce((sum, p) => Array.isArray(p.sales) ? sum + p.sales.reduce((a, b) => a + b, 0) : sum, 0)
    },
    totalRevenue(state) {
      return state.products.reduce((sum, p) => Array.isArray(p.sales) ? sum + p.sales.reduce((a, b) => a + b, 0) * p.price : sum, 0)
    },
    filteredProducts(state) {
      let list = state.products
      if (state.selectedCategory) {
        list = list.filter(p => p.description === state.selectedCategory)
      }
      if (state.search) {
        list = list.filter(p =>
          p.name.toLowerCase().includes(state.search.toLowerCase()) ||
          p.description.toLowerCase().includes(state.search.toLowerCase())
        )
      }
      // Advanced filters (fix: always use parseFloat and check for null/empty string)
      const min = state.filterMinPrice !== '' && state.filterMinPrice !== null ? parseFloat(state.filterMinPrice) : null
      const max = state.filterMaxPrice !== '' && state.filterMaxPrice !== null ? parseFloat(state.filterMaxPrice) : null
      if (min !== null && !isNaN(min)) {
        list = list.filter(p => parseFloat(p.price) >= min)
      }
      if (max !== null && !isNaN(max)) {
        list = list.filter(p => parseFloat(p.price) <= max)
      }
      if (state.filterInStock) {
        list = list.filter(p => p.stock > 0)
      }
      list = list.sort((a, b) => {
        if (state.sortBy === 'name') return state.sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        if (state.sortBy === 'description') return state.sortAsc ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description)
        if (state.sortBy === 'stock') return state.sortAsc ? a.stock - b.stock : b.stock - a.stock
        if (state.sortBy === 'price') return state.sortAsc ? a.price - b.price : b.price - a.price
        return 0
      })
      return list
    },
    lowStockProducts(state) {
      return state.products.filter(p => p.stock < 5)
    },
  },
  actions: {
    forecast(product) {
      if (!product || !Array.isArray(product.sales) || product.sales.length === 0) return ''
      const avgSales = product.sales.reduce((a,b)=>a+b,0) / product.sales.length
      if (avgSales > 0) {
        const daysLeft = Math.floor(product.stock / avgSales)
        if (daysLeft < 7) return `Forecast: ${daysLeft} days left`
      }
      return ''
    },
    addProduct(newProduct) {
      this.products.push(newProduct)
      if (!this.categories.includes(newProduct.description)) {
        this.categories.push(newProduct.description)
      }
      this.saveProducts()
    },
    updateStock(product, newStock) {
      const p = this.products.find(pr => pr.id === product.id)
      if (p) p.stock = newStock
      this.saveProducts()
    },
    saveProducts() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products))
      } catch (e) {}
    },
    setSort(field) {
      if (this.sortBy === field) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortBy = field
        this.sortAsc = true
      }
    },
  },
})
