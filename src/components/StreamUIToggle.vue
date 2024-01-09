<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean;
  labels: [string, string];
}>(), {
  modelValue: false,
  labels: () => ['off', 'on'],
});

const emit = defineEmits<{
  'update:model-value': [modelValue: boolean];
}>();

const setState = (value: boolean) => {
  emit('update:model-value', value);
};
</script>

<template>
  <span class="preview-ui-toggle">
    <span class="preview-ui-toggle-content">
      <slot />
    </span>
    <button
      class="preview-ui-toggle-choice"
      :class="modelValue === true ? 'preview-ui-toggle-active' : ''"
      @click="setState(true)"
    >{{ labels[1] }}</button>
    <button
      class="preview-ui-toggle-choice"
      :class="modelValue === false ? 'preview-ui-toggle-active' : ''"
      @click="setState(false)"
    >{{ labels[0] }}</button>
  </span>
</template>

<style lang="scss">
.preview-ui-toggle {
  padding: 0.5rem 0.75rem;
  color: black;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 999rem;
  border: 1px solid white;
  background-color: white;
  flex-shrink: 0;
}

.preview-ui-toggle > * {
  vertical-align: bottom;
}

.preview-ui-toggle-choice {
  margin-left: 4px;
  padding: 0 4px;
  border: 1px solid transparent;
  border-radius: 8px;
}

.preview-ui-toggle-active {
  border-color: black;
}

</style>
