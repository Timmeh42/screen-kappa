<script setup lang="ts">
const props = defineProps<{
  highlight?: boolean;
  noshrink?: boolean;
}>();
</script>

<template>
  <button
    class="preview-ui-button"
    :class="[
      props.noshrink ? 'preview-ui-button-noshrink' : '',
    ]"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.preview-ui-button {
  margin: 4px;
  padding: 4px 5px;
  color: black;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
  border: 1px solid white;
  background-color: white;

  &-noshrink {
    flex-shrink: 0;
  }

  &:hover, &:focus {
    background-color: #d1d1d1;
  }

  &:active {
    background-color: #a0a0a0;
  }
}

</style>
