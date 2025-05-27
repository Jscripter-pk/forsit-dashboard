<template>
  <div class="inventory-container">
    <h2 class="inventory-title">Inventory Management</h2>
    <div class="inventory-controls">
      <BaseInput
        v-model="store.search"
        placeholder="Search products..."
        class="search-input"
      />
      <div class="filter-dropdown-wrapper" @click.stop>
        <button class="filter-dropdown-btn" @click="showFilters = !showFilters">
          <svg class="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Filters</span>
        </button>
        <div v-if="showFilters" class="filter-dropdown-menu">
          <label class="filter-label">Category</label>
          <select v-model="store.selectedCategory" class="category-select">
            <option value="">All Categories</option>
            <option v-for="cat in store.categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <label class="filter-label">Min price</label>
          <BaseInput
            v-model="store.filterMinPrice"
            type="number"
            min="0"
            placeholder="Min price"
            class="price-input"
          />
          <label class="filter-label">Max price</label>
          <BaseInput
            v-model="store.filterMaxPrice"
            type="number"
            min="0"
            placeholder="Max price"
            class="price-input"
          />
          <label class="filter-checkbox-label">
            <input type="checkbox" v-model="store.filterInStock" /> In stock
          </label>
        </div>
      </div>
    </div>

    <template v-if="!isMobile">
      <table class="inventory-table">
        <thead>
          <tr>
            <th @click="toggleSort('name')" :class="getSortClass('name')">
              Name
              <span class="sort-icon">
                <SortIcon :active="store.sortBy === 'name'" :asc="store.sortAsc" />
              </span>
            </th>
            <th @click="toggleSort('description')" :class="getSortClass('description')">
              Description
              <span class="sort-icon">
                <SortIcon :active="store.sortBy === 'description'" :asc="store.sortAsc" />
              </span>
            </th>
            <th @click="toggleSort('price')" :class="getSortClass('price')">
              Price
              <span class="sort-icon">
                <SortIcon :active="store.sortBy === 'price'" :asc="store.sortAsc" />
              </span>
            </th>
            <th @click="toggleSort('stock')" :class="getSortClass('stock')">
              Stock
              <span class="sort-icon">
                <SortIcon :active="store.sortBy === 'stock'" :asc="store.sortAsc" />
              </span>
            </th>
            <th>Image</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in store.filteredProducts"
            :key="product.id"
            :class="{ 'low-stock': product.stock < 5 }"
          >
            <td><span class="name">{{ product.name }}</span></td>
            <td><span class="desc">{{ product.description }}</span></td>
            <td><span class="price">${{ formatNumber(product.price) }}</span></td>
            <td>
              <span :class="['stock', product.stock < 5 ? 'stock-low' : 'stock-ok']">
                {{ formatNumber(product.stock) }}
              </span>
            </td>
            <td>
              <img :src="product.image" alt="" width="40" class="product-img" />
            </td>
            <td>
              <BaseInput
                v-model="product._newStock"
                :placeholder="product.stock"
                min="0"
                type="number"
                class="stock-input"
              />
              <BaseButton class="update-btn" @click="updateStock(product)">
                Update
              </BaseButton>
            </td>
          </tr>
          <tr
            v-for="product in store.filteredProducts"
            v-if="store.forecast(product)"
            :key="'forecast-' + product.id"
          >
            <td colspan="6" class="forecast-row">
              {{ store.forecast(product) }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-else>
      <div class="inventory-list">
        <div
          v-for="product in store.filteredProducts"
          :key="product.id"
          class="inventory-list-item"
          :class="{ 'low-stock': product.stock < 5 }"
        >
          <div class="list-img-wrap">
            <img :src="product.image" alt="" class="product-img-list" />
          </div>
          <div class="list-info">
            <div class="list-title-row">
              <span class="name">{{ product.name }}</span>
              <span :class="['stock', product.stock < 5 ? 'stock-low' : 'stock-ok']">
                {{ formatNumber(product.stock) }}
              </span>
            </div>
            <div class="desc">{{ product.description }}</div>
            <div class="price">${{ formatNumber(product.price) }}</div>
            <div class="list-actions">
              <BaseInput
                v-model="product._newStock"
                :placeholder="product.stock"
                min="0"
                type="number"
                class="stock-input-list"
              />
              <BaseButton class="update-btn-list" @click="updateStock(product)">
                Update
              </BaseButton>
            </div>
            <div v-if="store.forecast(product)" class="forecast-row-list">
              {{ store.forecast(product) }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <BaseAlert v-if="store.lowStockProducts.length" type="warning">
      <strong>Low Inventory Alert: </strong>
      <span v-for="p in store.lowStockProducts" :key="p.id">
        {{ p.name }} ({{ formatNumber(p.stock) }})
      </span>
    </BaseAlert>
  </div>
</template>

<script setup>
import { useMainStore } from '../store/store.js'
import { ref, onMounted, onUnmounted } from 'vue'
import numeral from 'numeral'
import SortIcon from '../components/SortIcon.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseAlert from '../components/BaseAlert.vue'

const store = useMainStore()
const isMobile = ref(false)
const showFilters = ref(false)

function handleResize() {
  isMobile.value = window.innerWidth <= 900
}

function closeFilters(e) {
  showFilters.value = false
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', closeFilters)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', closeFilters)
})

store.filteredProducts.forEach(product => {
  if (typeof product._newStock === 'undefined') {
    product._newStock = product.stock
  }
})

function updateStock(product) {
  store.updateStock(product, product._newStock)
  product._newStock = product.stock
}

function toggleSort(field) {
  if (store.sortBy === field) {
    store.sortAsc = !store.sortAsc
  } else {
    store.sortBy = field
    store.sortAsc = true
  }
}

function getSortClass(field) {
  if (store.sortBy === field) {
    return store.sortAsc ? 'sorted-asc' : 'sorted-desc'
  }
  return ''
}

function formatNumber(value, format = '0,0') {
  return numeral(value).format(format)
}
</script>

<style scoped>
.inventory-container {
    flex: 1;
    margin: 2.5rem auto;
    padding: 2.5rem 2rem 2rem 2rem;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 6px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
}

.inventory-title {
    text-align: left;
    color: #111;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 2.2rem;
    letter-spacing: 0.5px;
}

.inventory-controls {
    display: flex;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
    justify-content: flex-end;
    flex-wrap: wrap;
}

.search-input {
    padding: 0.55rem 1.2rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 7px;
    font-size: 1.08rem;
    background: #f8f8f8;
    color: #181818;
    transition: border 0.2s;
}

.search-input:focus {
    border: 1.5px solid #111;
    outline: none;
    background: #fff;
}

.filter-dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.filter-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #181818;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.45rem 1.2rem;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.filter-dropdown-btn:hover {
  background: #111;
}
.filter-icon {
  display: inline-block;
  margin-right: 0.2rem;
  vertical-align: middle;
}

.filter-dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  min-width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 1.2rem 1.2rem 1rem 1.2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.filter-label {
  font-size: 1.01rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.2rem;
}

.filter-checkbox-label {
  display: flex;
  align-items: center;
  font-size: 1.01rem;
  color: #222;
  gap: 0.3rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.filter-dropdown-menu .category-select,
.filter-dropdown-menu .price-input {
  margin-bottom: 0.5rem;
}

.inventory-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    background: #fff;
    font-size: 1.08rem;
    box-shadow: 0 1.5px 6px rgba(0,0,0,0.04);
    border-radius: 12px;
    overflow: hidden;
}

.inventory-table th {
    background: #d9d9d9;
    color: #000000;
    font-weight: 700;
    padding: 1rem 0.7rem;
    border-bottom: 2px solid #e5e7eb;
    cursor: pointer;
    user-select: none;
    transition: background 0.2s, color 0.2s;
    letter-spacing: 0.2px;
    font-size: 1.08rem;
}

.inventory-table th.sorted-asc,
.inventory-table th.sorted-desc {
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.inventory-table td {
    background: #fff;
    padding: 1rem 0.7rem;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
    font-size: 1.08rem;
}

.product-img {
    border-radius: 8px;
    border: 1.5px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.name {
    color: #111;
    font-weight: 700;
    font-size: 1.08rem;
}

.desc {
    color: #222;
    font-weight: 500;
}

.price {
    color: #111;
    font-weight: 700;
}

.stock {
    font-weight: 700;
    padding: 0.3rem 1rem;
    border-radius: 8px;
    font-size: 1.08rem;
}

.stock-ok {
    background: #f6f8fa;
    color: #222;
}

.stock-low {
    background: #fff3cd;
    color: #b94a48;
}

.stock-input {
    width: 70px;
    padding: 0.4rem 0.7rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 7px;
    font-size: 1.08rem;
    background: #f8f8f8;
    color: #181818;
}

.stock-input:focus {
    border: 1.5px solid #111;
    background: #fff;
}

.update-btn {
    background: #181818;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.4rem 1.2rem;
    font-size: 1.08rem;
    margin-left: 0.7rem;
    cursor: pointer;
    font-weight: 700;
    transition: background 0.2s;
    letter-spacing: 0.2px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.update-btn:hover {
    background: #111;
}

.low-stock {
    background: #fff8e1 !important;
}

.alert {
    margin-top: 2rem;
    color: #b94a48;
    background: #fff3cd;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-size: 1.08rem;
    box-shadow: 0 1px 4px rgba(255, 243, 205, 0.15);
    font-weight: 700;
}

.forecast-row {
    background: #fffbe6;
    color: #b8860b;
    font-style: italic;
    text-align: left;
    font-size: 1.05rem;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(255, 243, 205, 0.10);
    padding-left: 1.2rem;
}

.sort-icon {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 0.3em;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.inventory-list-item {
  display: flex;
  gap: 1.1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 1.1rem 1rem;
  align-items: flex-start;
  border: 1.5px solid #f0f0f0;
}
.inventory-list-item.low-stock {
  background: #fff8e1 !important;
}
.list-img-wrap {
  flex-shrink: 0;
}
.product-img-list {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.list-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.stock {
  font-size: 1.02rem;
  padding: 0.2rem 0.7rem;
}
.stock-ok {
  background: #f6f8fa;
  color: #222;
}
.stock-low {
  background: #fff3cd;
  color: #b94a48;
}
.list-actions {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-top: 0.3rem;
}
.stock-input-list {
  width: 60px;
  padding: 0.3rem 0.6rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 1.02rem;
  background: #f8f8f8;
  color: #181818;
}
.stock-input-list:focus {
  border: 1.5px solid #111;
  background: #fff;
}
.update-btn-list {
  background: #181818;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.3rem 1.1rem;
  font-size: 1.02rem;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.update-btn-list:hover {
  background: #111;
}
.forecast-row-list {
  background: #fffbe6;
  color: #b8860b;
  font-style: italic;
  text-align: left;
  font-size: 0.98rem;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(255, 243, 205, 0.10);
  padding: 0.5rem 0.8rem;
  margin-top: 0.5rem;
}
@media (min-width: 901px) {
  .inventory-list {
    display: none;
  }
}
@media (max-width: 900px) {
  .inventory-table {
    display: none;
  }
  .inventory-list {
    display: flex;
    padding-bottom: 3.8rem;
  }
}
@media (max-width: 700px) {
  .filter-dropdown-menu {
    right: auto;
    left: 0;
    min-width: 180px;
    padding: 1rem 0.7rem 0.7rem 0.7rem;
  }
}
</style>
