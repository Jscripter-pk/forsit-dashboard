<template>
  <input
    v-bind="$attrs"
    :type="type"
    :class="['base-input']"
    :placeholder="placeholder"
    v-model="modelValueProxy"
    @input="$emit('update:modelValue', modelValueProxy)"
  />
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' }
})
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-input {
  padding: 0.55rem 1.2rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 7px;
  font-size: 1.08rem;
  background: #f8f8f8;
  color: #181818;
  transition: border 0.2s;
}
.base-input:focus {
  border: 1.5px solid #111;
  outline: none;
  background: #fff;
}
</style>
