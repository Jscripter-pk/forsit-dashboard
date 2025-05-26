<template>
    <div class="revenue-analysis-container">
        <h2 class="page-title">Revenue Analysis</h2>
        <div class="main-content">
            <section class="summary">
                <div class="summary-item">
                    <span class="summary-icon" aria-label="Orders">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="7" width="16" height="13" rx="2" fill="#222" stroke="#fff" stroke-width="2"/><path d="M9 11h6M9 15h3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
                    </span>
                    <span class="summary-label">Total Orders</span>
                    <span class="summary-value">{{ formatNumber(stats.totalOrders) }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-icon" aria-label="Revenue">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#222" stroke="#fff" stroke-width="2"/><path d="M12 8v8M9 11h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
                    </span>
                    <span class="summary-label">Total Revenue</span>
                    <span class="summary-value">${{ formatNumber(stats.totalRevenue, '0,0.00') }}</span>
                </div>
            </section>
            <section class="filters">
                <div class="filter-group">
                    <label for="category">Category:</label>
                    <select id="category" v-model="selectedCategory" @change="fetchData">
                        <option value="">All</option>
                        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="range">Time Range:</label>
                    <select id="range" v-model="selectedRange" @change="fetchData">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                    </select>
                </div>
            </section>
            <section class="charts">
                <div class="chart-card">
                    <h3>Orders Over Time</h3>
                    <v-chart :option="ordersChartOption" style="height: 250px;" />
                </div>
                <div class="chart-card">
                    <h3>Revenue Over Time</h3>
                    <v-chart :option="revenueChartOption" style="height: 250px;" />
                </div>
                <div class="chart-card">
                    <h3>Inventory Trends</h3>
                    <v-chart :option="inventoryChartOption" style="height: 250px;" />
                </div>
                <div class="chart-card">
                    <h3>Revenue vs Orders Comparison</h3>
                    <v-chart :option="comparisonChartOption" style="height: 250px;" />
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMainStore } from '../store/store.js'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import numeral from 'numeral'

const store = useMainStore()

const stats = computed(() => ({
    totalOrders: store.totalOrders ?? 0,
    totalRevenue: store.totalRevenue ?? 0
}))

function formatNumber(val, format = '0,0') {
    return numeral(val).format(format)
}

use([
    BarChart, LineChart, PieChart,
    TitleComponent, TooltipComponent, LegendComponent, GridComponent, DatasetComponent, CanvasRenderer
])

const categories = computed(() => store.categories)
const selectedCategory = computed({
    get: () => store.selectedCategory,
    set: v => store.selectedCategory = v
})
const selectedRange = computed({
    get: () => store.selectedRange,
    set: v => store.selectedRange = v
})
const ordersChartOption = ref({})
const revenueChartOption = ref({})
const inventoryChartOption = ref({})
const comparisonChartOption = ref({})

function fetchData() {
    const rangeLabels = {
        daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        weekly: ['W1', 'W2', 'W3', 'W4'],
        monthly: ['Jan', 'Feb', 'Mar', 'Apr'],
        annually: ['2021', '2022', '2023', '2024']
    }
    const xData = rangeLabels[selectedRange.value]

    let filteredProducts = store.products
    if (selectedCategory.value) {
        filteredProducts = filteredProducts.filter(p => p.description.toLowerCase().includes(selectedCategory.value.toLowerCase()) || p.name.toLowerCase().includes(selectedCategory.value.toLowerCase()))
    }

    const ordersData = Array(xData.length).fill(0)
    const revenueData = Array(xData.length).fill(0)
    const inventoryData = Array(xData.length).fill(0)
    filteredProducts.forEach(product => {
        for (let i = 0; i < xData.length; i++) {
            const sales = product.sales ? product.sales[i % product.sales.length] : 0
            ordersData[i] += sales
            revenueData[i] += sales * product.price
            inventoryData[i] += product.stock
        }
    })

    ordersChartOption.value = {
        title: { show: false },
        tooltip: {},
        xAxis: { type: 'category', data: xData },
        yAxis: { type: 'value' },
        series: [{ name: 'Orders', data: ordersData, type: 'bar', itemStyle: { color: '#42b983' } }]
    }
    revenueChartOption.value = {
        title: { show: false },
        tooltip: {},
        xAxis: { type: 'category', data: xData },
        yAxis: { type: 'value' },
        series: [{ name: 'Revenue', data: revenueData, type: 'line', itemStyle: { color: '#35495e' } }]
    }
    inventoryChartOption.value = {
        title: { show: false },
        tooltip: {},
        xAxis: { type: 'category', data: xData },
        yAxis: { type: 'value' },
        series: [{ name: 'Inventory', data: inventoryData, type: 'bar', itemStyle: { color: '#ffa940' } }]
    }
    comparisonChartOption.value = {
        title: { show: false },
        tooltip: {},
        legend: { data: ['Revenue', 'Orders'] },
        xAxis: { type: 'category', data: xData },
        yAxis: { type: 'value' },
        series: [
            { name: 'Revenue', data: revenueData, type: 'line', itemStyle: { color: '#35495e' } },
            { name: 'Orders', data: ordersData, type: 'bar', itemStyle: { color: '#42b983' } }
        ]
    }
}

watch(
    () => store.products.map(p => ({
        id: p.id,
        price: p.price,
        stock: p.stock,
        sales: Array.isArray(p.sales) ? [...p.sales] : []
    })),
    fetchData,
    { deep: true }
)

onMounted(fetchData)
</script>

<style scoped>
.revenue-analysis-container {
    flex: 1;
    margin: 0 auto;
    padding: 2.5rem 2rem 2rem 2rem;
    border-radius: 18px;
    box-shadow: 0 6px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
}

.page-title {
    text-align: left;
    margin-bottom: 2.2rem;
    color: #111;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: 0.5px;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}

.summary {
    display: flex;
    justify-content: flex-start;
    gap: 2.5rem;
    margin-bottom: 0;
    width: 100%;
}

.summary-item {
    background: #181818;
    border-radius: 12px;
    padding: 1.2rem 2.5rem;
    text-align: left;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1 1 0;
    min-width: 0;
    align-items: flex-start;
    position: relative;
}

.summary-icon {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
    width: 32px;
    height: 32px;
}

.summary-label {
    color: #bbb;
    font-size: 1.08rem;
    font-weight: 500;
    margin-bottom: 0.2rem;
    letter-spacing: 0.2px;
}

.summary-value {
    font-size: 2.1rem;
    font-weight: 900;
    color: #fff;
    letter-spacing: 0.5px;
}

.filters {
    display: flex;
    justify-content: flex-end;
    gap: 2.5rem;
    margin-bottom: 0;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 1.08rem;
    color: #222;
}

.filter-group label {
    font-weight: 600;
    color: #222;
}

.filter-group select {
    padding: 0.45rem 1.1rem;
    border-radius: 7px;
    border: 1.5px solid #e5e7eb;
    background: #f8f8f8;
    color: #181818;
    font-size: 1.08rem;
    font-weight: 500;
    transition: border 0.2s;
    outline: none;
}

.filter-group select:focus {
    border: 1.5px solid #111;
    background: #fff;
}

.charts {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
}

.chart-card {
    background: #fff;
    border-radius: 14px;
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
}

.chart-card h3 {
    margin-bottom: 1.2rem;
    font-size: 1.18rem;
    color: #181818;
    text-align: left;
    font-weight: 700;
    letter-spacing: 0.2px;
}

@media (max-width: 1200px) {
    .charts {
        grid-template-columns: 1fr;
    }
    .summary {
        flex-direction: column;
        gap: 1.2rem;
    }
    .filters {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.2rem;
    }
}

@media (max-width: 700px) {
    .revenue-analysis-container {
        padding: 1.2rem 0.5rem;
        min-width: 80vw;
    }
    .charts {
        gap: 1.2rem;
    }
    .chart-card {
        padding: 1rem 0.5rem;
    }
    .summary-item {
        padding: 1rem 1.2rem;
    }
}
</style>
