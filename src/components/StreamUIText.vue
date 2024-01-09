<script setup lang="ts">
const props = defineProps<{
  highlight?: boolean;
  noshrink?: boolean;
}>();
</script>

<template>
  <span
    class="preview-ui-text"
    :class="[
      props.highlight ? 'preview-ui-text-highlight' : '',
      props.noshrink ? 'preview-ui-text-noshrink' : '',
    ]"
  >
    <slot />
  </span>
</template>

<style lang="scss">
.preview-ui-text {
  padding: 0.5rem 0.75rem;
  color: white;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid transparent;

  &-highlight {
    border-radius: 0.5rem;
    border-color: white;
  }

  &-noshrink {
    flex-shrink: 0;
  }
}
</style>
