<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [modelValue: string];
}>();

const inputElement = ref<HTMLInputElement>();

const input = () => {
  if (inputElement.value) {
    emit('update:modelValue', inputElement.value.innerText);
  }
};

</script>

<template>
  <span
    ref="inputElement"
    contenteditable
    autofocus
    class="preview-ui-textbox"
    @input="input"
  >
    {{ props.modelValue }}
  </span>
</template>

<style lang="scss">
.preview-ui-textbox {
  padding: 0.5rem 0.75rem;
  line-height: 1;
  white-space: nowrap;
  border: 1px solid transparent;
  background-color: white;
}
</style>
