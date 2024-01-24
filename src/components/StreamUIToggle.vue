<script setup lang="ts">
import StreamUIButton from './StreamUIButton.vue';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  labels: [string, string];
}>(), {
  modelValue: false,
  labels: () => ['off', 'on'],
});

const emit = defineEmits<{
  'update:model-value': [modelValue: boolean];
}>();

const toggleState = () => {
  emit('update:model-value', !props.modelValue);
};
</script>

<template>
  <StreamUIButton
    @click="toggleState()"
  >
    <span>
      <slot />
    </span>
    <span class="preview-ui-toggle-choicegroup">
      <span
        class="preview-ui-toggle-choice"
        :class="modelValue === true ? 'preview-ui-toggle-active' : ''"
      >{{ labels[1] }}</span>
      <span
        class="preview-ui-toggle-choice"
        :class="modelValue === false ? 'preview-ui-toggle-active' : ''"
      >{{ labels[0] }}</span>
    </span>
  </StreamUIButton>
</template>

<style lang="scss">
.preview-ui-toggle-choicegroup {
  margin-left: 4px;
  margin-right: -6px;
  padding: 3px 2px;
  border-radius: 9999px;
  background-color: rgb(187, 187, 187);
}

.preview-ui-toggle-choice {
  padding: 0 4px;
  border: 1px solid transparent;
  border-radius: 9999px;
}

.preview-ui-toggle-active {
  border-color: black;
  background-color: white;
}

</style>
