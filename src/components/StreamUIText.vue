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
  margin: 4px;
  padding: 4px 5px;
  color: white;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &-highlight {
    border-radius: 6px;
    border: 1px solid white;
  }

  &-noshrink {
    flex-shrink: 0;
  }
}
</style>
