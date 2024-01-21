<script setup lang="ts">
withDefaults(defineProps<{
  frameColor?: string;
}>(), {
  frameColor: 'black',
});
</script>

<template>
  <div
    class="preview-container"
    :style="`--frame-color: ${frameColor};`"
  >
    <div class="preview-ui">
      <slot name="header" />
    </div>
    <div class="preview-video">
      <div class="video-placeholder" />
      <div class="video-container">
        <slot name="video" />
      </div>
      <div class="video-overlay">
        <div class="video-overlay-content">
          <slot name="video-overlay" />
        </div>
      </div>
    </div>
    <div class="preview-ui">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss">
.preview-ui {
  padding: 0.5rem;
  background-color: var(--frame-color);
  display: flex;
  justify-content: space-between;
  gap: 0.25rem;
}

.preview-ui > * {
  flex-grow: 0;
}

.preview-video {
  position: relative;
  border: 2px solid var(--frame-color);
  border-width: 0 2px;
}

.video-placeholder {
  width: 100%;
  padding-bottom: 60%;
  background-color: var(--frame-color);
}

.video-container {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;

  & > video {
    width: 100%;
    height: 100%;
  }
}

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  pointer-events: none;
}

.video-overlay-content:not(:empty) {
  text-align: center;
  color: white;
  background-color: rgba(100, 100, 100, 0.7);
  padding: 0.5rem;
  pointer-events: all;
}
</style>
