<template>
    <div class="product-registration-container">
        <h2 class="product-title">Product</h2>
        <form @submit.prevent="submitForm" class="product-form">
            <div class="form-group">
                <label>Name:</label>
                <BaseInput v-model="form.name" required class="input-field" placeholder="Enter product name" />
            </div>
            <div class="form-group">
                <label>Description:</label>
                <BaseInput v-model="form.description" required class="input-field" placeholder="Enter product description" />
            </div>
            <div class="form-group">
                <label>Price:</label>
                <BaseInput v-model.number="form.price" type="number" min="0" required class="input-field" placeholder="Enter price" />
            </div>
            <div class="form-group">
                <label>Initial Stock:</label>
                <BaseInput v-model.number="form.stock" type="number" min="0" required class="input-field" placeholder="Enter stock quantity" />
            </div>
            <div class="form-group">
                <label>Image:</label>
                <input type="file" @change="onFileChange" class="input-field" />
            </div>
            <div class="preview" v-if="form.imageUrl">
            <img :src="form.imageUrl" alt="Preview" width="80" />
            </div>
            <BaseButton type="submit" class="submit-btn">Register Product</BaseButton>
        </form>
        <transition name="toast-fade">
            <BaseAlert v-if="showToast" type="success">Product registered and inventory updated!</BaseAlert>
        </transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '../store/store.js'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import BaseAlert from '../components/BaseAlert.vue'

const store = useMainStore()
const form = ref({ name: '', description: '', price: 0, stock: 0, image: null, imageUrl: '' })
const showToast = ref(false)

function onFileChange(e) {
    const file = e.target.files[0]
    if (file) {
        form.value.image = file
        form.value.imageUrl = URL.createObjectURL(file)
    }
}

function submitForm() {
    const newProduct = {
        id: store.nextId++,
        name: form.value.name,
        description: form.value.description,
        price: form.value.price,
        stock: form.value.stock,
        image: form.value.imageUrl || 'https://via.placeholder.com/40',
        sales: [0,0,0,0,0,0,0],
    }
    store.addProduct(newProduct)
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2200)
    form.value = { name: '', description: '', price: 0, stock: 0, image: null, imageUrl: '' }
}
</script>

<style scoped>
.product-registration-container {
    flex: 1;
    margin: 2.5rem auto;
    padding: 2.5rem 2rem 2rem 2rem;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 6px 32px rgba(0,0,0,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
}

.product-title {
    text-align: left;
    color: #111;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 2.2rem;
    letter-spacing: 0.5px;
}

.product-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.form-group label {
    color: #222;
    font-weight: 700;
    font-size: 1.08rem;
    margin-bottom: 0.2rem;
}

.input-field {
    padding: 0.55rem 1.2rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 7px;
    font-size: 1.08rem;
    background: #f8f8f8;
    color: #181818;
    transition: border 0.2s;
}

.input-field:focus {
    border: 1.5px solid #111;
    outline: none;
    background: #fff;
}

.submit-btn {
    background: #181818;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.7rem 1.5rem;
    font-size: 1.15rem;
    font-weight: 800;
    margin-top: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.submit-btn:hover {
    background: #111;
}

.toast-success {
    position: fixed;
    top: 2.5rem;
    right: 2.5rem;
    z-index: 3000;
    background: #14f445;
    color: #fff;
    padding: 1.1rem 2.2rem;
    border-radius: 10px;
    font-size: 1.12rem;
    font-weight: 700;
    box-shadow: 0 4px 24px rgba(0,0,0,0.13);
    opacity: 0.97;
    transition: opacity 0.3s, transform 0.3s;
}
.toast-fade-enter-active, .toast-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
.toast-fade-enter-to, .toast-fade-leave-from {
    opacity: 0.97;
    transform: translateY(0);
}

.preview {
    margin-top: 1.2rem;
    text-align: center;
}

.preview img {
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

@media (max-width: 700px) {
    .product-registration-container {
        padding: 1.2rem 0.5rem;
    }
    .product-title {
        font-size: 1.4rem;
    }
}
</style>
