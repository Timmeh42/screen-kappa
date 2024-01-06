<script setup lang="ts">
import StreamUIText from './StreamUIText.vue';

const props = defineProps<{
  error: DOMException;
}>();
</script>

<template>
  <div class="preview-container">
    <div class="preview-ui">
      <StreamUIText>
        Error: {{ props.error.name }}
      </StreamUIText>
    </div>
    <div class="video-placeholder" />
    <div class="preview-ui">
      <StreamUIText>
        Refresh the page to try again.
      </StreamUIText>
    </div>
  </div>
</template>

<style>
.video-placeholder {
  width: 100%;
  padding-bottom: 60%;
  background-color: black;
}

.preview-ui {
  background-color: black;
  display: flex;
  justify-content: space-between;
}

.preview-ui > * {
  flex-grow: 0;
}
</style>
