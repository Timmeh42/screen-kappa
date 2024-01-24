<script setup lang="ts">
</script>

<template>
  <button class="preview-ui-button">
    <span class="preview-ui-button-content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
.preview-ui-button {
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

  &:hover {
    background-color: #d8d8d8;
  }

  &:active {
    background-color: #a0a0a0;
  }
}

.preview-ui-button-content {
  vertical-align: middle;
}

</style>
