<template>
  <div :class="['base-alert', type]" v-if="show">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'info' },
  show: { type: Boolean, default: true }
})
</script>

<style scoped>
.base-alert {
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 1.08rem;
  font-weight: 700;
  margin-top: 1.2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.base-alert.info {
  background: #e3f2fd;
  color: #1976d2;
}
.base-alert.success {
  background: #e6f9ed;
  color: #1b5e20;
}
.base-alert.warning {
  background: #fff3cd;
  color: #b94a48;
}
.base-alert.error {
  background: #fdecea;
  color: #b71c1c;
}
</style>
