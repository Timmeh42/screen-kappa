<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  modelValue: string;
  highlight?: boolean;
  noshrink?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [modelValue: string];
}>();

const inputElement = ref<HTMLInputElement>();

const input = () => {
  if (inputElement.value) {
    emit('update:modelValue', inputElement.value.value);
  }
};

</script>

<template>
  <input
    ref="inputElement"
    type="text"
    autofocus
    :value="props.modelValue"
    class="preview-ui-textbox"
    @input="input"
  >
</template>

<style lang="scss">
.preview-ui-textbox {
  margin: 4px;
  padding: 4px 5px;
  line-height: 1;
  white-space: nowrap;
}
</style>
