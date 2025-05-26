<template>
  <button
    :type="type"
    :class="['base-btn', color, { disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  color: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
.base-btn {
  background: #181818;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0.4rem 1.2rem;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 0.2px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.base-btn:hover:not(.disabled) {
  background: #111;
}
.base-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
