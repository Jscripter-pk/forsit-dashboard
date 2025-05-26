<template>
  <span>
    <svg v-if="active && asc" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4v8M8 12l-4-4m4 4l4-4" stroke="#181818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <svg v-else-if="active && !asc" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4l-4 4m4-4l4 4" stroke="#181818" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4v8" stroke="#bbb" stroke-width="2" stroke-linecap="round"/><path d="M4 8l4 4 4-4" stroke="#bbb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </span>
</template>

<script setup>
defineProps({
  active: Boolean,
  asc: Boolean
})
</script>
